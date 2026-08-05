const express = require('express');
const fs = require('fs');
const fsp = require('fs').promises;
const { readDB, writeDB, LOG_FILE, logEvent } = require('../config/db');
const { getMarketData, getDynamicScreenerData, getGlobalStockAudit } = require('../controllers/marketDataController');
const { handleAIChat } = require('../controllers/aiChatController');
const { mintToken } = require('../controllers/web3Controller');
const {
  getProvinsiList,
  getProvinsiDetail,
  getKomponen,
  hitungKhl,
  surveiKhl
} = require('../controllers/khlController');
const adminAuth = require('../middleware/adminAuth');
const {
  getSystemStatus,
  getEnvConfig,
  saveEnvConfig,
  forceCrashWorker
} = require('../controllers/devConsoleController');

const router = express.Router();

// Wrapper untuk route async: error diteruskan ke error middleware Express
// (Express 4 tidak menangkap rejection dari async handler secara otomatis,
//  sehingga sebelumnya request bisa menggantung tanpa respons).
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// 1. Database endpoints
router.get('/db', asyncHandler(async (req, res) => {
  const db = await readDB();
  res.json(db);
}));

// Write endpoint — diproteksi token admin
router.post('/db', adminAuth, asyncHandler(async (req, res) => {
  const db = await readDB();
  const updated = { ...db, ...req.body };
  const ok = await writeDB(updated);
  if (ok) {
    logEvent('INFO', `Database updated successfully via POST /api/db`);
    res.json({ success: true, message: 'Database updated successfully', db: updated });
  } else {
    res.status(500).json({ success: false, message: 'Failed to write to database' });
  }
}));

// 2. Centralized Logs Telemetry
router.get('/logs', asyncHandler(async (req, res) => {
  if (!fs.existsSync(LOG_FILE)) {
    return res.json({ logs: [] });
  }
  const rawText = await fsp.readFile(LOG_FILE, 'utf8');
  const lines = rawText.trim().split('\n').slice(-200);
  res.json({ logs: lines });
}));

router.post('/logs/report', asyncHandler(async (req, res) => {
  const { type, message, details } = req.body;
  logEvent('CLIENT_ERROR', `[${type}] ${message}`, details);
  res.json({ success: true });
}));

// 3. Market and macroeconomic feeds
router.get('/market-data', asyncHandler(getMarketData));
router.get('/screener', asyncHandler(getDynamicScreenerData));
router.get('/screener/audit', asyncHandler(getGlobalStockAudit));

// 3b. KHL (Kebutuhan Hidup Layak) 2026 — data 38 provinsi + analisis
router.get('/khl/provinsi', asyncHandler(getProvinsiList));
router.get('/khl/provinsi/:kode', asyncHandler(getProvinsiDetail));
router.get('/khl/komponen', asyncHandler(getKomponen));
router.post('/khl/hitung', asyncHandler(hitungKhl));
router.post('/khl/survei', asyncHandler(surveiKhl));

// 4. AI Chat Assistant
router.post('/ai-chat', asyncHandler(handleAIChat));

// 5. Blockchain Web3 Ledger Minting (menulis ke database -> proteksi token)
router.post('/blockchain/mint', adminAuth, asyncHandler(mintToken));

// 6. Developer Console & Super Admin endpoints (semua diproteksi token admin)
const { getAutopilotState, setAutopilotState } = require('../services/autopilotService');

router.get('/dev/status', adminAuth, asyncHandler(getSystemStatus));
router.get('/dev/env', adminAuth, asyncHandler(getEnvConfig));
router.post('/dev/env', adminAuth, asyncHandler(saveEnvConfig));
router.post('/dev/crash', adminAuth, asyncHandler(forceCrashWorker));

// Autopilot state routes
router.get('/dev/autopilot', adminAuth, asyncHandler(async (req, res) => {
  const state = await getAutopilotState();
  res.json({ success: true, ...state });
}));

router.post('/dev/autopilot', adminAuth, asyncHandler(async (req, res) => {
  const { growth, heartbeat } = req.body;
  const state = await setAutopilotState(growth === true, heartbeat === true);
  res.json({ success: true, ...state });
}));

module.exports = router;
