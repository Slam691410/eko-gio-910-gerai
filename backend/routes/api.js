const express = require('express');
const fs = require('fs');
const fsp = require('fs').promises;
const { readDB, writeDB, LOG_FILE, logEvent } = require('../config/db');
const { getMarketData, getDynamicScreenerData, getGlobalStockAudit } = require('../controllers/marketDataController');
const { handleAIChat } = require('../controllers/aiChatController');
const { mintToken } = require('../controllers/web3Controller');
const {
  getSystemStatus,
  getEnvConfig,
  saveEnvConfig,
  forceCrashWorker
} = require('../controllers/devConsoleController');

const router = express.Router();

// 1. Database endpoints
router.get('/db', async (req, res) => {
  try {
    const db = await readDB();
    res.json(db);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read DB', details: err.message });
  }
});

router.post('/db', async (req, res) => {
  try {
    const db = await readDB();
    const updated = { ...db, ...req.body };
    const ok = await writeDB(updated);
    if (ok) {
      logEvent('INFO', `Database updated successfully via POST /api/db`);
      res.json({ success: true, message: 'Database updated successfully', db: updated });
    } else {
      res.status(500).json({ success: false, message: 'Failed to write to database' });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to write to database', details: err.message });
  }
});

// 2. Centralized Logs Telemetry
router.get('/logs', async (req, res) => {
  try {
    if (!fs.existsSync(LOG_FILE)) {
      return res.json({ logs: [] });
    }
    const rawText = await fsp.readFile(LOG_FILE, 'utf8');
    const lines = rawText.trim().split('\n').slice(-200);
    res.json({ logs: lines });
  } catch (err) {
    res.status(500).json({ error: 'Failed to read log file', details: err.message });
  }
});

router.post('/logs/report', (req, res) => {
  const { type, message, details } = req.body;
  logEvent('CLIENT_ERROR', `[${type}] ${message}`, details);
  res.json({ success: true });
});

// 3. Market and macroeconomic feeds
router.get('/market-data', getMarketData);
router.get('/screener', getDynamicScreenerData);
router.get('/screener/audit', getGlobalStockAudit);

// 4. AI Chat Assistant
router.post('/ai-chat', handleAIChat);

// 5. Blockchain Web3 Ledger Minting
router.post('/blockchain/mint', mintToken);

// 6. Developer Console & Super Admin endpoints
const { getAutopilotState, setAutopilotState } = require('../services/autopilotService');

router.get('/dev/status', getSystemStatus);
router.get('/dev/env', getEnvConfig);
router.post('/dev/env', saveEnvConfig);
router.post('/dev/crash', forceCrashWorker);

// Autopilot state routes
router.get('/dev/autopilot', (req, res) => {
  res.json({ success: true, ...(getAutopilotState ? getAutopilotState() : {}) });
});

router.post('/dev/autopilot', (req, res) => {
  const { growth, heartbeat } = req.body;
  const state = setAutopilotState(growth === true, heartbeat === true);
  res.json({ success: true, ...state });
});

module.exports = router;
