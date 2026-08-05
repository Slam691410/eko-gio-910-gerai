const cluster = require('cluster');
const os = require('os');
const { logEvent, migrateIfNeeded } = require('./db');
const { startAutopilotDaemon } = require('../services/autopilotService');

function initCluster(bootWorkerApp) {
  if (cluster.isMaster) {
    const numCPUs = os.cpus().length || 1;
    logEvent('INFO', `[Master Cloud Load Balancer] Active on PID: ${process.pid}`);

    // Migrasi database.json -> SQLite HANYA dilakukan sekali di proses Master,
    // supaya tidak ada race antar worker saat boot.
    migrateIfNeeded().then(() => {
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
    });

    // SELF-HEALING FAILOVER SCALING dengan proteksi crash-loop:
    // jika worker mati berulang kali dalam 60 detik, jeda respawn sementara.
    let respawnTimestamps = [];
    let respawnPaused = false;

    cluster.on('exit', (worker, code, signal) => {
      logEvent('CRITICAL', `[Failover Scaling Alert] Worker process ${worker.process.pid} exited with code: ${code}.`);

      if (respawnPaused) return;

      const now = Date.now();
      respawnTimestamps = respawnTimestamps.filter((t) => now - t < 60000);
      respawnTimestamps.push(now);

      if (respawnTimestamps.length > 10) {
        respawnPaused = true;
        logEvent('CRITICAL', '[Self-Healing] Terlalu banyak worker crash dalam 60 detik. Respawn dijeda 60 detik untuk mencegah crash-loop.');
        setTimeout(() => {
          respawnPaused = false;
          respawnTimestamps = [];
          logEvent('INFO', '[Self-Healing] Respawn diaktifkan kembali.');
          cluster.fork();
        }, 60000);
        return;
      }

      logEvent('INFO', `[Self-Healing] Automatically spawning a replacement Express Worker node...`);
      cluster.fork();
    });

    process.on('uncaughtException', (err) => {
      logEvent('CRITICAL', `Uncaught Exception on Master: ${err.message}`, err.stack);
      // Master tidak boleh terus hidup dalam kondisi korup -> mati agar process manager bisa restart bersih.
      process.exit(1);
    });

  } else {
    // Let the worker run the actual application bootstrap function
    bootWorkerApp();
  }
}

module.exports = {
  initCluster
};
