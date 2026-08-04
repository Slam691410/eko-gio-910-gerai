const express = require('express');
const fs = require('fs');
const { readDB, writeDB, LOG_FILE, logEvent } = require('../config/db');
const { getMarketData } = require('../controllers/marketDataController');
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
router.get('/db', (req, res) => {
  const db = readDB();
  res.json(db);
});

router.post('/db', (req, res) => {
  const db = readDB();
  const updated = { ...db, ...req.body };
  if (writeDB(updated)) {
    logEvent('INFO', `Database updated successfully via POST /api/db`);
    res.json({ success: true, message: 'Database updated successfully', db: updated });
  } else {
    res.status(500).json({ success: false, message: 'Failed to write to database' });
  }
});

// 2. Centralized Logs Telemetry
router.get('/logs', (req, res) => {
  try {
    if (!fs.existsSync(LOG_FILE)) {
      return res.json({ logs: [] });
    }
    const rawText = fs.readFileSync(LOG_FILE, 'utf8');
    const lines = rawText.trim().split('\n').slice(-100); 
    res.json({ logs: lines });
  } catch (err) {
    res.status(500).json({ error: 'Failed to read log file' });
  }
});

router.post('/logs/report', (req, res) => {
  const { type, message, details } = req.body;
  logEvent('CLIENT_ERROR', `[${type}] ${message}`, details);
  res.json({ success: true });
});

// 3. Market and macroeconomic feeds
router.get('/market-data', getMarketData);

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
  res.json({ success: true, ...getAutopilotState() });
});

router.post('/dev/autopilot', (req, res) => {
  const { growth, heartbeat } = req.body;
  const state = setAutopilotState(growth === true, heartbeat === true);
  res.json({ success: true, ...state });
});

module.exports = router;
