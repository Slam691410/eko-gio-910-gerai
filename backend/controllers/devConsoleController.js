const fs = require('fs');
const path = require('path');
const { logEvent } = require('../config/db');

// Retrieve system health and worker metrics
function getSystemStatus(req, res) {
  const memory = process.memoryUsage();
  res.json({
    success: true,
    pid: process.pid,
    nodeVersion: process.version,
    platform: process.platform,
    uptime: process.uptime(),
    memory: {
      rss: Math.round(memory.rss / 1024 / 1024), 
      heapTotal: Math.round(memory.heapTotal / 1024 / 1024),
      heapUsed: Math.round(memory.heapUsed / 1024 / 1024),
      external: Math.round(memory.external / 1024 / 1024),
    },
    numCPUs: require('os').cpus().length,
    masterAffiliateCode: process.env.MASTER_AFFILIATE_CODE || 'MASTER_GERAI910',
    masterAffiliatePercent: parseInt(process.env.MASTER_AFFILIATE_PERCENT || '30', 10),
  });
}

// Retrieve .env configurations
function getEnvConfig(req, res) {
  const envKeys = [
    'PORT',
    'OPENAI_API_KEY',
    'OPENAI_MODEL',
    'ANTHROPIC_API_KEY',
    'OLLAMA_HOST',
    'WEB3_PROVIDER_RPC_URL',
    'TREASURY_SMART_CONTRACT_ADDRESS',
    'WEB3_PLATFORM_MASTER_PRIVATE_KEY',
    'GOLD_PRICE_API_KEY',
    'ALPHA_VANTAGE_API_KEY',
    'COINGECKO_PREMIUM_API_KEY',
    'MIDTRANS_ENVIRONMENT',
    'MIDTRANS_SERVER_KEY',
    'MIDTRANS_CLIENT_KEY',
    'MASTER_AFFILIATE_CODE',
    'MASTER_AFFILIATE_PERCENT'
  ];

  const envData = {};
  envKeys.forEach(key => {
    envData[key] = process.env[key] || '';
  });

  res.json({ success: true, env: envData });
}

// Save .env configurations
function saveEnvConfig(req, res) {
  const newEnv = req.body;
  if (!newEnv || typeof newEnv !== 'object') {
    return res.status(400).json({ error: 'Invalid request body' });
  }

  try {
    const envPath = path.join(__dirname, '../../../.env');
    let fileContent = '# GERAI 910 - PRODUCTION SAAS CONFIGURATION ENVIRONMENT\n';
    fileContent += '# Isi dengan kunci API produksi Anda untuk mengaktifkan integrasi riil dunia!\n\n';

    for (const [key, value] of Object.entries(newEnv)) {
      if (/^[A-Z0-9_]+$/.test(key)) {
        fileContent += `${key}=${value}\n`;
        process.env[key] = value;
      }
    }

    fs.writeFileSync(envPath, fileContent, 'utf8');
    logEvent('INFO', `[SaaS Developer] Environment variables updated and written to .env file by Developer Console.`);
    
    res.json({ success: true, message: 'Environment variables updated and saved successfully!', env: newEnv });
  } catch (err) {
    logEvent('ERROR', 'Failed to save environment variables', err.message);
    res.status(500).json({ error: 'Failed to write .env file' });
  }
}

// Shut down worker process to test failover clustering
function forceCrashWorker(req, res) {
  logEvent('CRITICAL', `[SaaS Developer] SIMULATED SERVER CRASH TRIGGERED by Developer Console on Worker Process (PID: ${process.pid}). Initiating emergency failover...`);
  
  res.json({
    success: true,
    message: `Worker PID ${process.pid} is shutting down now. The Master load-balancer cluster should automatically spawn a new Worker process within milliseconds!`
  });

  setTimeout(() => {
    process.exit(1);
  }, 150);
}

module.exports = {
  getSystemStatus,
  getEnvConfig,
  saveEnvConfig,
  forceCrashWorker
};
