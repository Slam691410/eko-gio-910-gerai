// -------------------------------------------------------------
// MAIN BOOTSTRAPPER & UI ROUTER - GERAI 910

document.addEventListener('DOMContentLoaded', async () => {
  lucide.createIcons();
  await fetchDatabase();
  startRealTimeFeeds();
  initCharts();
  toggleAssetCategoryForm();
  
  setEconomicPhase('Boom');
  
  calculateKHL();
  calculateRetirement();
  calculateInheritance();
  forecastCompounding();
  calculateInsuranceAdequacy();

  // Initialize Web3 Estate Tracker on Main App
  updateMainHeartbeatUI();

  // Set default SaaS mode on launch
  setSaaSMode('customer');
});

// 1. DATABASE REST API HANDLERS
async function fetchDatabase(showToast = false) {
  try {
    const res = await fetch('/api/db');
    if (!res.ok) throw new Error('Failed to fetch DB');
    const db = await res.json();
    appState.db = db;
    
    // Update family profile outputs
    document.getElementById('user-display-name').innerText = db.profile.name;
    document.getElementById('user-tier').innerText = `${db.profile.premiumTier.toUpperCase()} MEMBER`;
    document.getElementById('profile-info-email').innerText = db.profile.email;
    document.getElementById('profile-info-phone').innerText = db.profile.phone;
    
    updateWeb3WalletWidget();
    renderUGCFeed();
    renderMembershipAffiliate();
    renderPOSProducts();
    renderCRMCustomers();
    renderPOSTransactions();
    renderBlockchainLedger();
    
    // Recalculate financial formulas
    recalculateAssetNetWorth();

    if (showToast) {
      alert("✓ Database rill disinkronkan langsung dari server.");
    }
  } catch (err) {
    console.error('Error fetching database.json:', err);
    reportErrorToServer('FETCH_DB_ERROR', err.message);
  }
}

async function saveDatabase() {
  try {
    const res = await fetch('/api/db', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(appState.db)
    });
    if (!res.ok) throw new Error('Failed to save DB');
    const data = await res.json();
    appState.db = data.db;
  } catch (err) {
    console.error('Error writing database:', err);
    reportErrorToServer('SAVE_DB_ERROR', err.message);
  }
}

// 2. PAGE ROUTER SYSTEM (TAB HANDLERS)
function switchTab(tabId) {
  document.querySelectorAll('.tab-panel').forEach(panel => {
    panel.classList.add('hidden');
  });
  
  const target = document.getElementById(tabId);
  if (target) target.classList.remove('hidden');

  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.remove('bg-slate-800/50', 'text-white');
    btn.classList.add('text-slate-400');
    if (btn.getAttribute('data-tab') === tabId) {
      btn.classList.add('bg-slate-800/50', 'text-white');
      btn.classList.remove('text-slate-400');
    }
  });

  appState.activeTab = tabId;
  
  if (tabId === 'tab-assets') {
    setTimeout(() => {
      if (appState.priceChartInstance) appState.priceChartInstance.resize();
      if (appState.allocationChartInstance) appState.allocationChartInstance.resize();
    }, 150);
  }

  if (tabId === 'tab-developer') {
    initDeveloperConsole();
  }
}

// 3. REAL-TIME SPOT PRICES FEED (POLLING SERVER ENDPOINT)
function startRealTimeFeeds() {
  fetchMarketData();
  // Poll market data every 10 seconds rill!
  setInterval(fetchMarketData, 10000);
}

async function fetchMarketData() {
  try {
    const res = await fetch('/api/market-data');
    if (!res.ok) throw new Error('Failed to fetch market data');
    const data = await res.json();
    appState.liveMarket = data;

    // Update frontend text indicators
    document.getElementById('lbl-live-gold').innerText = `Rp ${data.gold.toLocaleString('id-ID')}`;
    document.getElementById('lbl-live-gold-buyback').innerText = `Rp ${data.goldBuyback.toLocaleString('id-ID')}`;
    document.getElementById('lbl-live-silver').innerText = `Rp ${data.silver.toLocaleString('id-ID')}`;
    document.getElementById('lbl-live-ihsg').innerText = data.ihsg.toLocaleString('id-ID');
    document.getElementById('lbl-live-usdidr').innerText = `Rp ${data.usdidr.toLocaleString('id-ID')}`;
    document.getElementById('lbl-live-btc').innerText = `Rp ${(data.btc * data.usdidr).toLocaleString('id-ID', {maximumFractionDigits: 0})}`;
    document.getElementById('lbl-live-eth').innerText = `Rp ${(data.eth * data.usdidr).toLocaleString('id-ID', {maximumFractionDigits: 0})}`;

    // Update market graphs
    const timeLabel = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    appState.goldPriceHistory.push({ time: timeLabel, price: data.gold });
    if (appState.goldPriceHistory.length > 15) appState.goldPriceHistory.shift();

    updatePriceChart();
    recalculateAssetNetWorth();

  } catch (err) {
    console.error('Failed to parse real-time prices feed:', err);
  }
}

// 4. CHART.JS INITIALIZATIONS
function initCharts() {
  const ctxPrice = document.getElementById('priceHistoryChart');
  const ctxAlloc = document.getElementById('assetAllocationChart');

  if (ctxPrice) {
    appState.priceChartInstance = new Chart(ctxPrice, {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: 'Harga Emas Spot / Gram (IDR)',
          data: [],
          borderColor: '#eab308',
          borderWidth: 2,
          backgroundColor: 'rgba(234, 179, 8, 0.05)',
          fill: true,
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { color: '#94a3b8', font: { size: 10 } } },
          y: { grid: { color: 'rgba(51, 65, 85, 0.15)' }, ticks: { color: '#94a3b8', font: { size: 10 } } }
        }
      }
    });
  }

  if (ctxAlloc) {
    appState.allocationChartInstance = new Chart(ctxAlloc, {
      type: 'doughnut',
      data: {
        labels: ['Emas', 'Perak', 'Reksadana', 'SBN', 'Deposito', 'Saham', 'Properti'],
        datasets: [{
          data: [0, 0, 0, 0, 0, 0, 0],
          backgroundColor: ['#eab308', '#94a3b8', '#0ea5e9', '#10b981', '#f43f5e', '#a855f7', '#84cc16'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { color: '#cbd5e1', font: { size: 11 } } }
        }
      }
    });
  }
}

function updatePriceChart() {
  if (!appState.priceChartInstance) return;
  appState.priceChartInstance.data.labels = appState.goldPriceHistory.map(h => h.time);
  appState.priceChartInstance.data.datasets[0].data = appState.goldPriceHistory.map(h => h.price);
  appState.priceChartInstance.update();
}

function recalculateAssetNetWorth() {
  const db = appState.db;
  if (!db) return;

  const goldGrams = db.assets?.gold?.grams || 0;
  const silverGrams = db.assets?.silver?.grams || 0;
  const goldVal = goldGrams * (appState.liveMarket?.gold || 2610000);
  const silverVal = silverGrams * (appState.liveMarket?.silver || 39450);

  let mfVal = 0;
  db.assets?.mutualFunds?.forEach(f => mfVal += f.balance);
  let sbnVal = 0;
  db.assets?.sbn?.forEach(s => sbnVal += s.balance);
  let depVal = 0;
  db.assets?.deposits?.forEach(d => depVal += d.balance);
  let propVal = 0;
  db.assets?.property?.forEach(p => propVal += p.balance);
  
  let stockVal = 0;
  db.assets?.stocks?.forEach(s => {
    const prices = { BBRI: 4750, TLKM: 3100, ASII: 4850 };
    const p = prices[s.code] || 1000;
    stockVal += s.shares * p;
  });

  const totalAssets = goldVal + silverVal + mfVal + sbnVal + depVal + propVal + stockVal;
  
  let totalDebts = 0;
  db.debts?.forEach(d => totalDebts += d.remaining);

  const netWorth = totalAssets - totalDebts;

  // Render on DOM
  document.getElementById('lbl-net-worth').innerText = `Rp ${netWorth.toLocaleString('id-ID')}`;
  document.getElementById('lbl-total-assets').innerText = `Rp ${totalAssets.toLocaleString('id-ID')}`;
  document.getElementById('lbl-total-debts').innerText = `Rp ${totalDebts.toLocaleString('id-ID')}`;
  
  // Details list
  document.getElementById('lbl-asset-gold').innerText = `Rp ${goldVal.toLocaleString('id-ID')} (${goldGrams}g)`;
  document.getElementById('lbl-asset-silver').innerText = `Rp ${silverVal.toLocaleString('id-ID')} (${silverGrams}g)`;
  document.getElementById('lbl-asset-reksadana').innerText = `Rp ${mfVal.toLocaleString('id-ID')}`;
  document.getElementById('lbl-asset-sbn').innerText = `Rp ${sbnVal.toLocaleString('id-ID')}`;
  document.getElementById('lbl-asset-deposito').innerText = `Rp ${depVal.toLocaleString('id-ID')}`;
  document.getElementById('lbl-asset-saham').innerText = `Rp ${stockVal.toLocaleString('id-ID')}`;
  document.getElementById('lbl-asset-properti').innerText = `Rp ${propVal.toLocaleString('id-ID')}`;

  // Update allocation doughnut chart
  updateAllocationChart(goldVal, silverVal, mfVal, sbnVal, depVal, stockVal, propVal);
}

function updateAllocationChart(gold, silver, mf, sbn, dep, stock, prop) {
  if (!appState.allocationChartInstance) return;
  appState.allocationChartInstance.data.datasets[0].data = [gold, silver, mf, sbn, dep, stock, prop];
  appState.allocationChartInstance.update();
}

// 5. SAAS SWITCH ROLE-BASED ACCESS CONTROLLER
function setSaaSMode(mode) {
  appState.saasMode = mode;

  const btnCust = document.getElementById('btn-saas-customer');
  const btnAdmin = document.getElementById('btn-saas-admin');
  const btnDev = document.getElementById('btn-saas-dev');

  // Sidebar link references
  const navUgc = document.getElementById('nav-ugc');
  const navPos = document.getElementById('nav-pos');
  const navAssets = document.getElementById('nav-assets');
  const navBudget = document.getElementById('nav-budget');
  const navInsurance = document.getElementById('nav-insurance');
  const navGoals = document.getElementById('nav-goals');
  const navMacro = document.getElementById('nav-macro');
  const navDividend = document.getElementById('nav-dividend');
  const navInheritance = document.getElementById('nav-inheritance');
  const navMembership = document.getElementById('nav-membership');
  const navDev = document.getElementById('nav-dev');

  // Settings sub-panels references
  const setHeadingTitle = document.getElementById('settings-heading-title');
  const setHeadingDesc = document.getElementById('settings-heading-desc');
  const setFamilyPanel = document.getElementById('settings-family-panel');
  const setAdminLogsPanel = document.getElementById('settings-admin-logs-panel');

  if (mode === 'customer') {
    btnCust.className = "flex-1 py-2 rounded-lg text-[9px] font-extrabold uppercase tracking-wider transition duration-150 text-white bg-blue-600 shadow-md flex items-center justify-center gap-1";
    btnAdmin.className = "flex-1 py-2 rounded-lg text-[9px] font-extrabold uppercase tracking-wider transition duration-150 text-slate-400 flex items-center justify-center gap-1";
    btnDev.className = "w-full py-2 rounded-lg text-[9px] font-extrabold uppercase tracking-wider transition duration-150 text-slate-400 flex items-center justify-center gap-1 border border-dashed border-slate-800 hover:border-brand-500/50 hover:bg-slate-900/30";

    navUgc.classList.remove('hidden');
    navAssets.classList.remove('hidden');
    navBudget.classList.remove('hidden');
    navInsurance.classList.remove('hidden');
    navGoals.classList.remove('hidden');
    navMacro.classList.remove('hidden');
    navDividend.classList.remove('hidden');
    navInheritance.classList.remove('hidden');
    navMembership.classList.remove('hidden');

    navPos.classList.add('hidden');
    navDev.classList.add('hidden');

    setHeadingTitle.innerText = "Profil Pengguna & Keluarga Terintegrasi";
    setHeadingDesc.innerText = "Konfigurasikan status pernikahan, rencana Haji, data tanggungan pendidikan anak-anak, profil risiko, dan integrasikan wallet Web3 Anda.";
    document.getElementById('nav-settings-text').innerText = "10. Profil & Jaringan Web3";

    setFamilyPanel.classList.remove('hidden');
    setAdminLogsPanel.classList.add('hidden');

    if (appState.activeTab === 'tab-pos' || appState.activeTab === 'tab-developer') {
      switchTab('tab-ugc');
    }

  } else if (mode === 'admin') {
    btnCust.className = "flex-1 py-2 rounded-lg text-[9px] font-extrabold uppercase tracking-wider transition duration-150 text-slate-400 flex items-center justify-center gap-1";
    btnAdmin.className = "flex-1 py-2 rounded-lg text-[9px] font-extrabold uppercase tracking-wider transition duration-150 text-white bg-blue-600 shadow-md flex items-center justify-center gap-1";
    btnDev.className = "w-full py-2 rounded-lg text-[9px] font-extrabold uppercase tracking-wider transition duration-150 text-slate-400 flex items-center justify-center gap-1 border border-dashed border-slate-800 hover:border-brand-500/50 hover:bg-slate-900/30";

    navUgc.classList.add('hidden');
    navAssets.classList.add('hidden');
    navBudget.classList.add('hidden');
    navInsurance.classList.add('hidden');
    navGoals.classList.add('hidden');
    navMacro.classList.add('hidden');
    navDividend.classList.add('hidden');
    navInheritance.classList.add('hidden');
    navMembership.classList.add('hidden');
    navDev.classList.add('hidden');

    navPos.classList.remove('hidden');

    setHeadingTitle.innerText = "Konsol Administrasi & Jaringan SaaS";
    setHeadingDesc.innerText = "Kelola konfigurasi platform master, otorisasi jaringan Web3, dan pantau kesehatan server telemetri.";
    document.getElementById('nav-settings-text').innerText = "10. Telemetri & Jaringan Admin";

    setFamilyPanel.classList.add('hidden');
    setAdminLogsPanel.classList.remove('hidden');

    fetchServerLogs();

    if (appState.activeTab !== 'tab-pos' && appState.activeTab !== 'tab-settings') {
      switchTab('tab-pos');
    }
  } else if (mode === 'developer') {
    btnCust.className = "flex-1 py-2 rounded-lg text-[9px] font-extrabold uppercase tracking-wider transition duration-150 text-slate-400 flex items-center justify-center gap-1";
    btnAdmin.className = "flex-1 py-2 rounded-lg text-[9px] font-extrabold uppercase tracking-wider transition duration-150 text-slate-400 flex items-center justify-center gap-1";
    btnDev.className = "w-full py-2 rounded-lg text-[9px] font-extrabold uppercase tracking-wider transition duration-150 text-white bg-brand-600 shadow-md flex items-center justify-center gap-1 border border-brand-500/50";

    navDev.classList.remove('hidden');
    navPos.classList.remove('hidden');

    navUgc.classList.remove('hidden');
    navAssets.classList.remove('hidden');
    navBudget.classList.remove('hidden');
    navInsurance.classList.remove('hidden');
    navGoals.classList.remove('hidden');
    navMacro.classList.remove('hidden');
    navDividend.classList.remove('hidden');
    navInheritance.classList.remove('hidden');
    navMembership.classList.remove('hidden');

    setHeadingTitle.innerText = "Platform Owner Global Logs Console";
    setHeadingDesc.innerText = "Super-Administrator System Telemetry Logs & Distributed Error Capture.";
    document.getElementById('nav-settings-text').innerText = "10. Central System Telemetry";

    setFamilyPanel.classList.add('hidden');
    setAdminLogsPanel.classList.remove('hidden');

    fetchServerLogs();
    initDeveloperConsole();

    switchTab('tab-developer');
  }

  lucide.createIcons();
}

// 6. SERVER LOGS TELEMETRY & CLIENT EXCEPTION LOGGER
async function fetchServerLogs() {
  try {
    const res = await fetch('/api/logs');
    if (!res.ok) throw new Error('Failed to fetch server logs');
    const data = await res.json();
    const consoleEl = document.getElementById('admin-telemetry-console');
    if (consoleEl && data.logs) {
      consoleEl.innerHTML = '';
      if (data.logs.length === 0) {
        consoleEl.innerHTML = '<div class="text-slate-500 italic">Belum ada aktivitas log komputasi rill tercatat.</div>';
      } else {
        data.logs.forEach(log => {
          const item = document.createElement('div');
          if (log.includes('[ERROR]') || log.includes('[CLIENT_ERROR]')) {
            item.className = 'text-red-400';
          } else if (log.includes('[CRITICAL]')) {
            item.className = 'text-rose-500 font-extrabold animate-pulse';
          } else if (log.includes('[WARN]')) {
            item.className = 'text-yellow-400';
          } else {
            item.className = 'text-slate-300';
          }
          item.innerText = log;
          consoleEl.appendChild(item);
        });
        consoleEl.scrollTop = consoleEl.scrollHeight;
      }
    }
  } catch (err) {
    console.error('Error fetching server telemetry logs:', err);
  }
}

async function reportErrorToServer(type, message, details = null) {
  try {
    await fetch('/api/logs/report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, message, details: details || navigator.userAgent })
    });
  } catch (err) {
    console.error('Distributed error logging reporting offline.');
  }
}

// 7. DELETIONS AND TOPUPS
function deleteDebt(id) {
  const idx = appState.db?.debts.findIndex(d => d.id === id);
  if (idx !== -1) {
    appState.db.debts.splice(idx, 1);
    saveDatabase();
  }
}

function deleteInsurance(id) {
  const idx = appState.db?.insurance.findIndex(i => i.id === id);
  if (idx !== -1) {
    appState.db.insurance.splice(idx, 1);
    saveDatabase();
  }
}

function topUpGoal(id) {
  const amt = prompt('Masukkan nominal tabungan yang ingin disetor (IDR):');
  const parsed = parseFloat(amt);
  if (isNaN(parsed) || parsed <= 0) return;

  const goal = appState.db?.goals.find(g => g.id === id);
  if (goal) {
    goal.saved += parsed;
    saveDatabase();
  }
}

function topUpSystemGoal(goalId, currentSaved) {
  const amt = prompt('Masukkan nominal tambahan tabungan untuk target rencana ini (IDR):');
  const parsed = parseFloat(amt);
  if (isNaN(parsed) || parsed <= 0) return;

  const db = appState.db;
  const label = goalId === 'wedding' ? 'Tabungan Pernikahan Impian' : goalId.startsWith('edu-') ? 'Tabungan Pendidikan Anak' : 'Tabungan Haji';
  
  const existing = db.goals.find(g => g.name === label);
  if (existing) {
    existing.saved += parsed;
  } else {
    db.goals.push({
      id: Date.now(),
      name: label,
      target: goalId === 'wedding' ? db.profile.weddingPlan.estimatedCost : 100000000,
      saved: parsed,
      targetYear: 2030
    });
  }

  saveDatabase();
  alert(`Rp ${parsed.toLocaleString('id-ID')} berhasil dialokasikan ke ${label}!`);
}

// 8. ASSET CATEGORIES HANDLERS
function toggleAssetCategoryForm() {
  const assetClass = document.getElementById('form-asset-class').value;
  const lblName = document.getElementById('lbl-asset-name');
  const lblVal = document.getElementById('lbl-asset-val');
  const lblYield = document.getElementById('lbl-asset-yield');
  const inputName = document.getElementById('form-asset-name');
  
  if (assetClass === 'gold' || assetClass === 'silver') {
    lblName.innerText = "Nama Logam / Deskripsi";
    inputName.value = assetClass === 'gold' ? "Emas Batangan Antam" : "Perak Murni";
    lblVal.innerText = "Jumlah Berat Logam (Gram)";
    lblYield.innerText = "Rata-Rata Harga Beli Per Gram (IDR)";
  } else {
    lblName.innerText = "Nama Pengelola / Kode Emiten";
    inputName.value = "";
    lblVal.innerText = "Total Saldo Investasi (IDR)";
    lblYield.innerText = "Target Imbal Hasil / Dividen (% p.a.)";
  }
}

// 9. MODALS AND CLIPBOARDS UTILITIES
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.remove('hidden');
    if (id === 'modal-update-income' && appState.db) {
      document.getElementById('form-inc-utama').value = appState.db.income.utama;
      document.getElementById('form-inc-bisnis').value = appState.db.income.bisnis;
      document.getElementById('form-inc-passive').value = appState.db.income.passive;
      document.getElementById('form-inc-lainnya').value = appState.db.income.lainnya;
    }
    if (id === 'modal-update-emergency' && appState.db) {
      document.getElementById('form-ef-current').value = appState.db.emergencyFund.current;
      document.getElementById('form-ef-months').value = appState.db.emergencyFund.targetMonths;
    }
  }
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.add('hidden');
}

function copyToClipboard(id) {
  const text = document.getElementById(id).innerText;
  navigator.clipboard.writeText(text).then(() => {
    alert('📋 Tautan Berhasil Disalin!');
  }).catch(err => {
    console.error('Failed to copy text: ', err);
  });
}

function setEconomicPhase(phase) {
  appState.economicPhase = phase;
  document.querySelectorAll('.phase-badge').forEach(badge => {
    badge.className = "phase-badge cursor-pointer px-3 py-1.5 rounded-xl border text-xs font-semibold uppercase transition";
    if (badge.getAttribute('data-phase') === phase) {
      badge.className += " bg-brand-500 text-white border-brand-500 shadow-md";
    } else {
      badge.className += " bg-slate-900 border-cyber-border text-slate-400";
    }
  });
}
