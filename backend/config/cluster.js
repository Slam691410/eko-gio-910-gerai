const cluster = require('cluster');
const os = require('os');
const { logEvent } = require('./db');
const { startAutopilotDaemon } = require('../services/autopilotService');

function initCluster(bootWorkerApp) {
  if (cluster.isMaster) {
    const numCPUs = os.cpus().length || 1;
    logEvent('INFO', `[Master Cloud Load Balancer] Active on PID: ${process.pid}`);
    
    // Start Autopilot Daemon on the Master process
    startAutopilotDaemon();
    
    logEvent('INFO', '==================================================');
    logEvent('INFO', '⚙️ VERIFIKASI KUNCI INTEGRASI PRODUKSI SAAS GERAITOK 910:');
    
    if (process.env.OPENAI_API_KEY) {
      logEvent('INFO', `[SaaS Config] Real OpenAI API Key found. Transitioning AI advisor to Production GPT-4o Mode!`);
    } else if (process.env.ANTHROPIC_API_KEY) {
      logEvent('INFO', `[SaaS Config] Real Anthropic API Key found. Transitioning AI advisor to Production Claude 3.5 Mode!`);
    } else {
      logEvent('INFO', `[SaaS Config] OpenAI/Anthropic API keys are empty. Falling back to High-Fidelity Local NLP Simulation Mode.`);
    }

    if (process.env.WEB3_PROVIDER_RPC_URL) {
      logEvent('INFO', `[SaaS Config] Real Web3 RPC Node Provider found: ${process.env.WEB3_PROVIDER_RPC_URL}. Connecting to Ethereum/Polygon Mainnets!`);
    } else {
      logEvent('INFO', `[SaaS Config] Web3 RPC URL is empty. Operating on High-Fidelity Sandbox Decentralized Ledger mesin.`);
    }

    if (process.env.GOLD_PRICE_API_KEY) {
      logEvent('INFO', `[SaaS Config] Spot Gold/Silver API Key detected. Pulling real goldapi.io spot tickers!`);
    } else {
      logEvent('INFO', `[SaaS Config] Gold/Silver market API Key is empty. Utilizing High-Fidelity Random-Walk Price Ticker Feed.`);
    }

    if (process.env.MIDTRANS_SERVER_KEY) {
      logEvent('INFO', `[SaaS Config] Midtrans Gateway detected. QRIS & Bank Virtual Accounts are set to production-ready.`);
    } else {
      logEvent('INFO', `[SaaS Config] Midtrans Keys are empty. Falling back to High-Fidelity QRIS Barcode & Bank payment engines.`);
    }
    logEvent('INFO', '==================================================');

    logEvent('INFO', `[Horizontal Scaling] Spawning ${numCPUs} parallel Express Worker instances...`);

    // Fork a worker process for each CPU core
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }

    // SELF-HEALING FAILOVER SCALING
    cluster.on('exit', (worker, code, signal) => {
      logEvent('CRITICAL', `[Failover Scaling Alert] Worker process ${worker.process.pid} exited with code: ${code}.`);
      logEvent('INFO', `[Self-Healing] Automatically spawning a replacement Express Worker node...`);
      cluster.fork();
    });

    process.on('uncaughtException', (err) => {
      logEvent('CRITICAL', `Uncaught Exception on Master: ${err.message}`, err.stack);
    });

  } else {
    // Let the worker run the actual application bootstrap function
    bootWorkerApp();
  }
}

module.exports = {
  initCluster
};
