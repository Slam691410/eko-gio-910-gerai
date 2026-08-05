const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../../../database.json');
const LOG_FILE = path.join(__dirname, '../../../server.log');

// Central Telemetry Event Logger
function logEvent(level, msg, errorDetails = null) {
  const timestamp = new Date().toISOString();
  const workerPid = process.pid;
  let logLine = `[${timestamp}] [Worker PID: ${workerPid}] [${level}] ${msg}\n`;
  if (errorDetails) {
    logLine += `[Details] ${errorDetails}\n`;
  }
  
  if (level === 'ERROR' || level === 'CRITICAL') {
    console.error(logLine.trim());
  } else {
    console.log(logLine.trim());
  }

  try {
    fs.appendFileSync(LOG_FILE, logLine, 'utf8');
  } catch (err) {
    console.error('Error writing to server.log:', err);
  }
}

// Read JSON Database physically from disk
function readDB() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      writeDB({});
    }
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    logEvent('ERROR', `Failed to read database.json`, err.message);
    return {};
  }
}

// Write JSON Database atomically to prevent cluster race conditions
function writeDB(data) {
  try {
    const tmpPath = DB_PATH + '.tmp';
    fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2), 'utf8');
    fs.renameSync(tmpPath, DB_PATH); // Atomic OS operation
    return true;
  } catch (err) {
    logEvent('ERROR', `Failed to write database.json atomically`, err.message);
    return false;
  }
}

module.exports = {
  readDB,
  writeDB,
  logEvent,
  DB_PATH,
  LOG_FILE
};
