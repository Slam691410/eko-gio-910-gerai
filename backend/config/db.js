const fsSync = require('fs');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
const sqlite3 = require('sqlite3').verbose();
const pino = require('pino');

// NOTE: __dirname = <repo>/backend/config, jadi naik 2 level = root repo.
const DATA_DIR = path.join(__dirname, '../../data');
const JSON_DB_PATH = path.join(__dirname, '../../database.json');
const LOG_FILE = path.join(__dirname, '../../server.log');
const SQLITE_FILE = path.join(DATA_DIR, 'database.sqlite');

if (!fsSync.existsSync(DATA_DIR)) {
  fsSync.mkdirSync(DATA_DIR, { recursive: true });
}

// Pino async logger to file
const logger = pino({}, pino.destination(LOG_FILE));

// Initialize SQLite DB
const db = new sqlite3.Database(SQLITE_FILE, (err) => {
  if (err) {
    logger.error({ err }, 'Failed to open SQLite database');
  }
});

// Ensure schema + concurrency tuning (WAL & busy_timeout mencegah SQLITE_BUSY)
db.serialize(() => {
  db.run(`PRAGMA journal_mode = WAL`);
  db.run(`PRAGMA busy_timeout = 5000`);
  db.run(`CREATE TABLE IF NOT EXISTS kv (key TEXT PRIMARY KEY, value TEXT)`);
  db.run(`CREATE TABLE IF NOT EXISTS logs (id INTEGER PRIMARY KEY AUTOINCREMENT, level TEXT, message TEXT, ts TEXT)`);
});

// Helper to run DB statements with promise
function runAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve(this);
    });
  });
}

function getAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

// Migrasi database.json -> SQLite HANYA SEKALI (idempotent):
// - Hitung hash isi database.json, simpan di kv 'migration_marker'.
// - Jika hash sama dengan marker, file sudah pernah dimigrasi -> skip.
// - Dengan begitu data live TIDAK akan ditimpa seed lagi saat restart/respawn worker.
async function migrateIfNeeded() {
  try {
    if (!fsSync.existsSync(JSON_DB_PATH)) return;

    const raw = fsSync.readFileSync(JSON_DB_PATH, 'utf8');
    const hash = crypto.createHash('sha256').update(raw).digest('hex');

    const marker = await getAsync(`SELECT value FROM kv WHERE key = 'migration_marker'`);
    if (marker && marker.value === hash) {
      logger.info('database.json already migrated (marker match). Skipping.');
      return;
    }

    let obj = {};
    try {
      obj = JSON.parse(raw);
    } catch (e) {
      logger.error({ err: e }, 'Failed to parse existing database.json during migration');
    }

    await writeKV('root', obj);
    await writeKV('migration_marker', hash);
    const bakPath = path.join(DATA_DIR, `database.json.bak.${Date.now()}`);
    fsSync.copyFileSync(JSON_DB_PATH, bakPath);
    logger.info(`Migrated database.json to sqlite and backed up to ${bakPath}`);
  } catch (err) {
    logger.error({ err }, 'Error during migration');
  }
}

function writeKV(key, value) {
  const s = JSON.stringify(value || {});
  return runAsync(`INSERT OR REPLACE INTO kv(key, value) VALUES(?,?)`, [key, s]);
}

async function readKV(key) {
  const row = await getAsync(`SELECT value FROM kv WHERE key = ?`, [key]);
  if (!row || !row.value) return null;
  try {
    return JSON.parse(row.value);
  } catch (e) {
    return null;
  }
}

async function readDB() {
  const data = await readKV('root');
  return data || {};
}

async function writeDB(data) {
  await writeKV('root', data);
  return true;
}

let logInsertCounter = 0;

function logEvent(level, msg, errorDetails = null) {
  const timestamp = new Date().toISOString();
  const base = { timestamp, pid: process.pid };
  if (level === 'ERROR' || level === 'CRITICAL') {
    logger.error({ ...base, error: errorDetails || undefined }, msg);
  } else if (level === 'WARN') {
    logger.warn({ ...base, error: errorDetails || undefined }, msg);
  } else {
    logger.info({ ...base }, msg);
  }

  // ringkasan log ke tabel sqlite (async, jangan di-await)
  db.run(`INSERT INTO logs(level, message, ts) VALUES(?,?,?)`, [level, msg, timestamp], (err) => {
    if (err) logger.error({ err }, 'Failed to insert log summary into sqlite logs table');
  });

  // Prune tabel log agar tidak membengkak tanpa batas (sisakan 5000 baris terakhir)
  logInsertCounter++;
  if (logInsertCounter % 1000 === 0) {
    db.run(`DELETE FROM logs WHERE id <= (SELECT MAX(id) FROM logs) - 5000`);
  }
}

module.exports = {
  readDB,
  writeDB,
  logEvent,
  migrateIfNeeded,
  DB_PATH: SQLITE_FILE,
  LOG_FILE
};
