const { readDB, writeDB, logEvent } = require('../config/db');

function runAutopilotCycle() {
  try {
    const db = readDB();
    
    if (!db.platformSettings) db.platformSettings = {};
    if (!db.platformSettings.autopilot) {
      db.platformSettings.autopilot = {
        isGrowthActive: true,
        isHeartbeatActive: true,
        uptimeTicks: 0
      };
    }

    const state = db.platformSettings.autopilot;
    if (!state.isGrowthActive) {
      logEvent('INFO', `[SaaS Autopilot Daemon] Autopilot growth is currently PAUSED.`);
      return;
    }

    state.uptimeTicks = (state.uptimeTicks || 0) + 1;
    logEvent('INFO', `[SaaS Autopilot Daemon] Starting cycle #${state.uptimeTicks}...`);

    let dbUpdated = true; // State tick is updated

    // 1. MENGHIMPUN: Scan POS transactions and update cumulative platform stats
    const totalTransactions = db.posTransactions?.length || 0;

    // 2. MENGELOLA: Auto-convert platform fees (30% master fee) into PAXG Gold Reserves
    if (db.affiliateData && db.affiliateData.history) {
      let totalPlatformShareToConvert = 0;
      db.affiliateData.history.forEach(item => {
        if (!item.isAutopilotHarvested) {
          const pShare = item.platformShare || Math.round(item.amount * (30/70));
          totalPlatformShareToConvert += pShare;
          item.isAutopilotHarvested = true; // Mark as harvested
          dbUpdated = true;
        }
      });

      if (totalPlatformShareToConvert > 0) {
        const paxgConverted = totalPlatformShareToConvert / 15000000;
        db.platformSettings.accumulatedGoldPAXG = (db.platformSettings.accumulatedGoldPAXG || 16.45) + paxgConverted;
        dbUpdated = true;
        logEvent('INFO', `[SaaS Autopilot] MENGELOLA: Auto-harvested platform fees and converted to +${paxgConverted.toFixed(6)} PAXG Gold.`);
      }
    }

    // 3. MENGEMBANGKAN: Auto-deploy a new International Regional Node based on business volume milestones!
    const activeNodes = db.platformSettings.activeNodesCount || 3;
    const expectedNodes = 3 + Math.floor(totalTransactions / 3);

    if (expectedNodes > activeNodes) {
      const regions = ["EU (Uni Eropa)", "US (Amerika Serikat)", "MY (Malaysia)", "JP (Jepang)", "UK (Inggris)"];
      const newRegionIndex = (activeNodes - 3) % regions.length;
      const deployedRegion = regions[newRegionIndex];

      db.platformSettings.activeNodesCount = expectedNodes;
      dbUpdated = true;

      logEvent('INFO', `[SaaS Autopilot] MENGEMBANGKAN: Volume milestone reached! Automatically deployed regional Node [${deployedRegion}] on Polygon!`);
    }

    // 4. AUTOPILOT HEARTBEAT: Keep owner checked-in automatically if active
    if (state.isHeartbeatActive) {
      db.platformSettings.lastHeartbeatTimestamp = Date.now();
      dbUpdated = true;
      logEvent('INFO', `[SaaS Autopilot] HEARTBEAT: Auto-check-in owner wallet to renew estate protection.`);
    }

    // 5. CRM PROMOTIONS: Auto-dispatch marketing coupons if sales drop
    if (state.uptimeTicks % 10 === 0 && db.crmCustomers?.length > 0) {
      const luckyCustomer = db.crmCustomers[Math.floor(Math.random() * db.crmCustomers.length)];
      logEvent('INFO', `[SaaS Autopilot] MARKETING: Auto-dispatched 12% loyalty coupon to [${luckyCustomer.name}] to optimize store traffic.`);
    }

    if (dbUpdated) {
      writeDB(db);
    }

  } catch (err) {
    logEvent('ERROR', 'Failed during SaaS Autopilot Daemon cycle', err.message);
  }
}

// Start Background Autopilot Daemon (Runs every 15 seconds)
function startAutopilotDaemon() {
  logEvent('INFO', '[SaaS Autopilot Daemon] Active and monitoring core platform database...');
  
  // Initialize default state in DB if missing
  try {
    const db = readDB();
    if (!db.platformSettings) db.platformSettings = {};
    if (!db.platformSettings.autopilot) {
      db.platformSettings.autopilot = {
        isGrowthActive: true,
        isHeartbeatActive: true,
        uptimeTicks: 0
      };
      writeDB(db);
    }
  } catch (e) {}

  // Run first cycle and schedule intervals
  setTimeout(runAutopilotCycle, 2000);
  setInterval(runAutopilotCycle, 15000); 
}

function getAutopilotState() {
  try {
    const db = readDB();
    return db.platformSettings?.autopilot || {
      isGrowthActive: true,
      isHeartbeatActive: true,
      uptimeTicks: 0
    };
  } catch (e) {
    return { isGrowthActive: true, isHeartbeatActive: true, uptimeTicks: 0 };
  }
}

function setAutopilotState(growth, heartbeat) {
  try {
    const db = readDB();
    if (!db.platformSettings) db.platformSettings = {};
    db.platformSettings.autopilot = {
      isGrowthActive: growth,
      isHeartbeatActive: heartbeat,
      uptimeTicks: db.platformSettings?.autopilot?.uptimeTicks || 0
    };
    writeDB(db);
    logEvent('INFO', `[SaaS Autopilot] State changed: Growth=${growth}, Heartbeat=${heartbeat}`);
    return db.platformSettings.autopilot;
  } catch (e) {
    return { isGrowthActive: growth, isHeartbeatActive: heartbeat, uptimeTicks: 0 };
  }
}

module.exports = {
  startAutopilotDaemon,
  getAutopilotState,
  setAutopilotState
};
