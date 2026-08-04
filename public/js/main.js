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
  updateActiveHeartbeatUI();

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

    const provSelect = document.getElementById('prof-province-select');
    if (provSelect && db.profile.province) {
      provSelect.value = db.profile.province;
    }
    
    updateWeb3WalletWidget();
    renderUGCFeed();
    renderMembershipAffiliate();
    renderPOSProducts();
    renderCRMCustomers();
    renderPOSTransactions();
    renderBlockchainLedger();
    renderProfileDependents();
    renderDebts();
    renderDividendCalendar();
    
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

  // Settings sub-panels references
  const setHeadingTitle = document.getElementById('settings-heading-title');
  const setHeadingDesc = document.getElementById('settings-heading-desc');
  const setFamilyPanel = document.getElementById('settings-family-panel');
  const setAdminLogsPanel = document.getElementById('settings-admin-logs-panel');
  const setDeveloperPanel = document.getElementById('settings-developer-panel');

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

    setHeadingTitle.innerText = "Profil Pengguna & Keluarga Terintegrasi";
    setHeadingDesc.innerText = "Konfigurasikan status pernikahan, rencana Haji, data tanggungan pendidikan anak-anak, profil risiko, dan integrasikan wallet Web3 Anda.";
    document.getElementById('nav-settings-text').innerText = "10. Profil & Jaringan Web3";

    setFamilyPanel.classList.remove('hidden');
    setAdminLogsPanel.classList.add('hidden');
    if (setDeveloperPanel) setDeveloperPanel.classList.add('hidden');

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

    navPos.classList.remove('hidden');

    setHeadingTitle.innerText = "Konsol Administrasi & Jaringan SaaS";
    setHeadingDesc.innerText = "Kelola konfigurasi platform master, otorisasi jaringan Web3, dan pantau kesehatan server telemetri.";
    document.getElementById('nav-settings-text').innerText = "10. Telemetri & Jaringan Admin";

    setFamilyPanel.classList.add('hidden');
    setAdminLogsPanel.classList.remove('hidden');
    if (setDeveloperPanel) setDeveloperPanel.classList.add('hidden');

    fetchServerLogs();

    if (appState.activeTab !== 'tab-pos' && appState.activeTab !== 'tab-settings') {
      switchTab('tab-pos');
    }
  } else if (mode === 'developer') {
    btnCust.className = "flex-1 py-2 rounded-lg text-[9px] font-extrabold uppercase tracking-wider transition duration-150 text-slate-400 flex items-center justify-center gap-1";
    btnAdmin.className = "flex-1 py-2 rounded-lg text-[9px] font-extrabold uppercase tracking-wider transition duration-150 text-slate-400 flex items-center justify-center gap-1";
    btnDev.className = "w-full py-2 rounded-lg text-[9px] font-extrabold uppercase tracking-wider transition duration-150 text-white bg-brand-600 shadow-md flex items-center justify-center gap-1 border border-brand-500/50";

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

    setHeadingTitle.innerText = "Platform Owner Global Logs & Developer Console";
    setHeadingDesc.innerText = "Super-Administrator Global Node Orchestrations, Smart Treasury Solidity Interactor & System Telemetries.";
    document.getElementById('nav-settings-text').innerText = "10. Central System Telemetry";

    setFamilyPanel.classList.add('hidden');
    setAdminLogsPanel.classList.add('hidden');
    if (setDeveloperPanel) setDeveloperPanel.classList.remove('hidden');

    fetchServerLogs();
    initDeveloperConsole();

    switchTab('tab-settings');
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
  // Handled dynamically in calculators.js
  updateEconomicPhaseAll(phase);
}

// ==================== CORE INTERACTIVE FORM SUBMISSIONS & WEB3/AI CONNECTORS ====================

// Web3 connection modals triggers
function connectWallet() {
  openModal('modal-web3-connect');
}

async function confirmWalletConnection() {
  // execute Web3 wallet address generation
  const hex = "0123456789ABCDEFabcdef";
  let aktifAddr = "0x";
  for (let i = 0; i < 40; i++) {
    aktifAddr += hex.charAt(Math.floor(Math.random() * hex.length));
  }

  if (!appState.db) appState.db = {};
  if (!appState.db.profile) appState.db.profile = {};
  
  appState.db.profile.web3Address = aktifAddr;
  await saveDatabase();

  updateWeb3WalletWidget();
  closeModal('modal-web3-connect');
  alert(`🦊 DOMPET METAMASK BERHASIL TERHUBUNG!\n\nAlamat Dompet:\n${aktifAddr}\n\nSeluruh status transaksi on-chain & waris otonom Anda telah di-sync!`);
}

// AI Chat collaspible panel handlers
function toggleAIChat() {
  const panel = document.getElementById('ai-chat-panel');
  if (panel) {
    panel.classList.toggle('hidden');
  }
}

async function sendChatMessage(event) {
  if (event) event.preventDefault();

  const input = document.getElementById('ai-chat-input');
  if (!input) return;

  const msg = input.value.trim();
  if (!msg) return;

  input.value = '';

  // Append user message
  appendChatMessage('user', msg);

  try {
    appendChatMessage('ai-loading', 'GeraiAI sedang menganalisis...');

    const res = await fetch('/api/ai-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: msg })
    });
    const data = await res.json();
    
    removeChatLoadingBubble();

    if (data.reply) {
      appendChatMessage('ai', data.reply);
    } else {
      appendChatMessage('ai', 'Maaf, saya tidak dapat memproses data Anda saat ini.');
    }
  } catch (err) {
    removeChatLoadingBubble();
    appendChatMessage('ai', 'Koneksi terputus. Silakan hubungi admin platform.');
    console.error(err);
  }
}

function appendChatMessage(sender, text) {
  const container = document.getElementById('ai-chat-messages');
  if (!container) return;

  const bubble = document.createElement('div');
  if (sender === 'user') {
    bubble.className = "bg-blue-600/25 border border-blue-500/25 p-3 rounded-xl max-w-[85%] self-end ml-auto space-y-1";
    bubble.innerHTML = `<strong class="text-[10px] text-blue-400 block font-bold">SAYA</strong><p class="text-slate-200">${text}</p>`;
  } else if (sender === 'ai-loading') {
    bubble.id = "chat-loading-bubble";
    bubble.className = "bg-slate-800 border border-cyber-border/40 p-3 rounded-xl max-w-[85%] mr-auto space-y-1 animate-pulse";
    bubble.innerHTML = `<strong class="text-[10px] text-brand-400 block font-bold">GERAI AI</strong><p class="text-slate-400 italic">${text}</p>`;
  } else {
    bubble.className = "bg-slate-800 border border-cyber-border/40 p-3 rounded-xl max-w-[85%] mr-auto space-y-1";
    bubble.innerHTML = `<strong class="text-[10px] text-brand-400 block font-bold">GERAI AI</strong><p class="text-slate-200">${text}</p>`;
  }

  container.appendChild(bubble);
  container.scrollTop = container.scrollHeight;
}

function removeChatLoadingBubble() {
  const el = document.getElementById('chat-loading-bubble');
  if (el) el.remove();
}

// executed Group Forum Chats
function submitForumMessage(event) {
  if (event) event.preventDefault();
  
  const input = document.getElementById('forum-chat-input');
  if (!input) return;

  const msg = input.value.trim();
  if (!msg) return;

  input.value = '';

  const box = document.getElementById('forum-chat-box');
  if (box) {
    const timeLabel = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    const user = appState.db?.profile?.name?.replace(' ', '_') || 'Eko_Gio';

    const div = document.createElement('div');
    div.className = "bg-slate-900/40 p-2.5 rounded-xl border border-cyber-border/40";
    div.innerHTML = `
      <span class="font-bold text-brand-400 block mb-0.5">${user} <span class="text-[9px] text-slate-500 font-mono">${timeLabel}</span></span>
      <span>${msg}</span>
    `;
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
  }
}

// Clear POS Cart
function clearCart() {
  appState.cart.items = [];
  recalculatePOSCartTotals();
}

// Alias mapping for HTML button triggers to modular POS handlers
function setPaymentMethod(method) {
  setPOSPaymentMethod(method);
}

function processCheckout() {
  executePOSCheckout();
}

// Affiliate wrapper link generator
function generateGlobalAffiliateLink() {
  const url = document.getElementById('aff-target-url').value.trim();
  if (!url) {
    alert('Mohon masukkan URL target tujuan.');
    return;
  }

  const code = appState.db?.profile?.affiliateCode || 'EKOGERAI910';
  const wrapped = `https://gerai.id/redirect?url=${encodeURIComponent(url)}&ref=MASTER_GERAI910&subid=${code}`;
  
  const el = document.getElementById('aff-generated-link');
  if (el) {
    el.innerText = wrapped;
    document.getElementById('aff-link-output-box').classList.remove('hidden');
  }
}

// Save Risk Profile & marital/resepst/haji plans from Category 10
async function saveRiskProfile() {
  const select = document.getElementById('prof-risk-profile');
  if (!select) return;
  
  appState.db.profile.riskProfile = select.value;

  const provSelect = document.getElementById('prof-province-select');
  if (provSelect) {
    appState.db.profile.province = provSelect.value;
  }
  
  const weddingStatus = document.getElementById('prof-marital-status').value;
  appState.db.profile.maritalStatus = weddingStatus;
  
  const weddingYear = parseInt(document.getElementById('prof-wedding-year').value, 10) || 2028;
  const weddingCost = parseFloat(document.getElementById('prof-wedding-cost').value) || 75000000;
  appState.db.profile.weddingPlan = {
    hasPlan: weddingStatus === 'Belum Menikah',
    targetYear: weddingYear,
    estimatedCost: weddingCost
  };

  const hajiStatus = document.getElementById('prof-haji-status').value;
  const hajiYear = parseInt(document.getElementById('prof-haji-year').value, 10) || 2032;
  const hajiCost = parseFloat(document.getElementById('prof-haji-cost').value) || 110000000;
  const hajiQueue = parseInt(document.getElementById('prof-haji-queue').value, 10) || 18;
  appState.db.profile.hajiPlan = {
    hajiStatus,
    hasPlan: hajiStatus === 'Belum Haji',
    targetYear: hajiYear,
    estimatedCost: hajiCost,
    waitingTimeYears: hajiQueue
  };

  await saveDatabase();
  alert('✅ Profil & Rencana Finansial Berhasil Diperbarui!');
  calculateKHL(); // Update target goals
}

function sendQuickPrompt(promptText) {
  const input = document.getElementById('ai-chat-input');
  if (input) {
    input.value = promptText;
    // Make sure panel is open
    const panel = document.getElementById('ai-chat-panel');
    if (panel && panel.classList.contains('hidden')) {
      panel.classList.remove('hidden');
    }
    sendChatMessage();
  }
}

// Web3 Commodities Minting modal trigger
async function mintTokenizedAsset() {
  const type = document.getElementById('mint-asset-type').value;
  const amt = parseFloat(document.getElementById('mint-asset-qty').value) || 0;

  if (amt <= 0) {
    alert('Mohon masukkan jumlah berat komoditas yang ingin di-mint.');
    return;
  }

  await triggerWeb3Mint(type, amt);
  closeModal('modal-web3-mint');
}

// -------------------------------------------------------------
// 10 MODALS FORM SUBMISSION HANDLERS (ENTERPRISE-GRADE SAVING)

async function submitAddAsset() {
  const assetClass = document.getElementById('form-asset-class').value;
  const name = document.getElementById('form-asset-name').value.trim();
  const value = parseFloat(document.getElementById('form-asset-val').value) || 0;
  const yr = parseFloat(document.getElementById('form-asset-yield').value) || 0;

  if (!name || value <= 0) {
    alert('Mohon isi seluruh data aset dengan benar.');
    return;
  }

  if (assetClass === 'gold') {
    if (!appState.db.assets.gold) appState.db.assets.gold = { grams: 0, avgBuyPrice: 0 };
    appState.db.assets.gold.grams += value;
    appState.db.assets.gold.avgBuyPrice = yr || appState.db.assets.gold.avgBuyPrice;
  } else if (assetClass === 'silver') {
    if (!appState.db.assets.silver) appState.db.assets.silver = { grams: 0, avgBuyPrice: 0 };
    appState.db.assets.silver.grams += value;
    appState.db.assets.silver.avgBuyPrice = yr || appState.db.assets.silver.avgBuyPrice;
  } else {
    const mapping = {
      reksadana: 'mutualFunds',
      sbn: 'sbn',
      deposito: 'deposits',
      saham: 'stocks',
      properti: 'property'
    };
    const key = mapping[assetClass];
    if (key) {
      if (!appState.db.assets[key]) appState.db.assets[key] = [];
      if (assetClass === 'saham') {
        appState.db.assets[key].push({ code: name, shares: value, avgPrice: yr });
      } else {
        appState.db.assets[key].push({ name: name, balance: value, yield: yr });
      }
    }
  }

  await saveDatabase();
  closeModal('modal-add-asset');
  alert('✅ Sukses menambah aset baru ke portofolio!');
  recalculateAssetNetWorth();
}

async function submitAddDebt() {
  const name = document.getElementById('form-debt-name').value.trim();
  const remaining = parseFloat(document.getElementById('form-debt-remaining').value) || 0;
  const rate = parseFloat(document.getElementById('form-debt-rate').value) || 0;
  const minPayment = parseFloat(document.getElementById('form-debt-min').value) || 0;

  if (!name || remaining <= 0) {
    alert('Mohon lengkapi seluruh data utang.');
    return;
  }

  if (!appState.db.debts) appState.db.debts = [];
  appState.db.debts.push({
    id: Date.now(),
    name,
    remaining,
    rate,
    minPayment
  });

  await saveDatabase();
  closeModal('modal-add-debt');
  alert('✅ Sukses menambahkan liabilitas baru!');
  recalculateAssetNetWorth();
}

async function submitAddDependent() {
  const name = document.getElementById('form-dep-name').value.trim();
  const age = parseInt(document.getElementById('form-dep-age').value, 10) || 0;
  const relation = document.getElementById('form-dep-relation').value.trim();
  const school = document.getElementById('form-dep-school').value;

  if (!name || age <= 0) {
    alert('Mohon isi nama dan usia tanggungan.');
    return;
  }

  if (!appState.db.profile.dependents) appState.db.profile.dependents = [];
  appState.db.profile.dependents.push({
    id: Date.now(),
    name,
    relation,
    age,
    schoolStatus: school
  });

  await saveDatabase();
  closeModal('modal-add-dependent');
  alert('✅ Sukses menambah data tanggungan keluarga!');
  
  calculateKHL();
  renderProfileDependents();
}

async function submitAddGoal() {
  const name = document.getElementById('form-goal-name').value.trim();
  const target = parseFloat(document.getElementById('form-goal-target').value) || 0;
  const year = parseInt(document.getElementById('form-goal-year').value, 10) || 2030;
  const saved = parseFloat(document.getElementById('form-goal-saved').value) || 0;

  if (!name || target <= 0) {
    alert('Mohon lengkapi rencana target impian.');
    return;
  }

  if (!appState.db.goals) appState.db.goals = [];
  appState.db.goals.push({
    id: Date.now(),
    name,
    target,
    targetYear: year,
    saved
  });

  await saveDatabase();
  closeModal('modal-add-goal');
  alert('✅ Sukses menambahkan sasaran keuangan baru!');
  calculateKHL();
}

async function submitAddInsurance() {
  const type = document.getElementById('form-ins-type').value.trim();
  const provider = document.getElementById('form-ins-provider').value.trim();
  const premium = parseFloat(document.getElementById('form-ins-premium').value) || 0;

  if (!type || !provider || premium <= 0) {
    alert('Mohon lengkapi detail perlindungan asuransi.');
    return;
  }

  if (!appState.db.insurance) appState.db.insurance = [];
  appState.db.insurance.push({
    id: Date.now(),
    type,
    provider,
    premium,
    coverAmount: premium * 120
  });

  await saveDatabase();
  closeModal('modal-add-insurance');
  alert('✅ Sukses mendaftarkan polis perlindungan!');
  calculateInsuranceAdequacy();
}

async function submitCRMCustomer() {
  const name = document.getElementById('form-cust-name').value.trim();
  const email = document.getElementById('form-cust-email').value.trim();
  const phone = document.getElementById('form-cust-phone').value.trim();
  const address = document.getElementById('form-cust-address').value.trim();
  const tier = document.getElementById('form-cust-tier').value;

  if (!name || !phone) {
    alert('Mohon isi nama dan nomor telepon pelanggan CRM.');
    return;
  }

  if (!appState.db.crmCustomers) appState.db.crmCustomers = [];
  appState.db.crmCustomers.push({
    id: Date.now(),
    name,
    email,
    phone,
    address,
    tier,
    totalOrders: 0
  });

  await saveDatabase();
  closeModal('modal-add-customer');
  alert(`✅ Sukses mendaftarkan pelanggan loyal ${name}!`);
  renderCRMCustomers();
}

async function submitPOSProduct() {
  const sku = document.getElementById('form-prod-sku').value.trim();
  const name = document.getElementById('form-prod-name').value.trim();
  const price = parseFloat(document.getElementById('form-prod-price').value) || 0;
  const stock = parseInt(document.getElementById('form-prod-stock').value, 10) || 0;
  const cat = document.getElementById('form-prod-cat').value;

  if (!name || price <= 0 || stock <= 0) {
    alert('Mohon lengkapi detail produk retail POS.');
    return;
  }

  if (!appState.db.posProducts) appState.db.posProducts = [];
  appState.db.posProducts.push({
    id: Date.now(),
    sku,
    name,
    price,
    stock,
    category: cat,
    unit: 'Pcs'
  });

  await saveDatabase();
  closeModal('modal-add-product');
  alert(`✅ Sukses menambahkan produk retail: ${name}`);
  renderPOSProducts();
}

async function submitUGCPost() {
  const title = document.getElementById('form-post-title').value.trim();
  const cat = document.getElementById('form-post-cat').value;
  const link = document.getElementById('form-post-cart-link').value.trim();
  const content = document.getElementById('form-post-content').value.trim();

  if (!title || !content) {
    alert('Mohon isi judul dan deskripsi video/analisis UGC.');
    return;
  }

  if (!appState.db.posts) appState.db.posts = [];
  appState.db.posts.unshift({
    id: Date.now(),
    author: appState.db.profile.name || "Eko_Gio",
    category: cat,
    title,
    content,
    productName: title,
    price: 99000, 
    redirectUrl: link || "https://shopee.co.id"
  });

  await saveDatabase();
  closeModal('modal-add-post');
  alert('✅ Sukses mempublikasikan konten siber GeraiTok baru!');
  renderUGCFeed();
}

async function submitUpdateEmergency() {
  const current = parseFloat(document.getElementById('form-ef-current').value) || 0;
  const targetMonths = parseInt(document.getElementById('form-ef-months').value, 10) || 6;

  if (current < 0) {
    alert('Dana darurat saat ini tidak boleh bernilai negatif.');
    return;
  }

  if (!appState.db.emergencyFund) appState.db.emergencyFund = { current: 0, targetMonths: 6 };
  appState.db.emergencyFund.current = current;
  appState.db.emergencyFund.targetMonths = targetMonths;

  await saveDatabase();
  closeModal('modal-update-emergency');
  alert('✅ Konfigurasi Dana Darurat Berhasil Diperbarui!');
  calculateKHL();
}

async function submitUpdateIncome() {
  const utama = parseFloat(document.getElementById('form-inc-utama').value) || 0;
  const bisnis = parseFloat(document.getElementById('form-inc-bisnis').value) || 0;
  const passive = parseFloat(document.getElementById('form-inc-passive').value) || 0;
  const lainnya = parseFloat(document.getElementById('form-inc-lainnya').value) || 0;

  appState.db.income = {
    utama,
    bisnis,
    passive,
    lainnya
  };

  await saveDatabase();
  closeModal('modal-update-income');
  alert('✅ Aliran Kas Pendapatan Berhasil Diperbarui!');
  balanceBudgetSliders('needs'); 
}

// -------------------------------------------------------------
// PROFILE FAMILY DEPENDENTS RENDERING & REMOVALS

function renderProfileDependents() {
  const container = document.getElementById('prof-dependents-tbody');
  if (!container || !appState.db?.profile?.dependents) return;

  container.innerHTML = '';
  appState.db.profile.dependents.forEach((dep, idx) => {
    const row = document.createElement('tr');
    row.className = "hover:bg-slate-900/30 transition duration-150 text-xs";
    row.innerHTML = `
      <td class="p-3 text-slate-400 font-mono">${idx + 1}</td>
      <td class="p-3 text-slate-200 font-bold">${dep.name}</td>
      <td class="p-3 text-slate-300">${dep.relation}</td>
      <td class="p-3 text-slate-400 font-mono">${dep.age} Tahun</td>
      <td class="p-3 text-brand-500 font-semibold">${dep.schoolStatus}</td>
      <td class="p-3 text-center">
        <button onclick="removeDependent(${dep.id})" class="text-red-400 hover:text-red-300 font-bold text-[10px] uppercase">Hapus</button>
      </td>
    `;
    container.appendChild(row);
  });
}

async function removeDependent(id) {
  const idx = appState.db?.profile?.dependents.findIndex(d => d.id === id);
  if (idx !== -1) {
    appState.db.profile.dependents.splice(idx, 1);
    await saveDatabase();
    calculateKHL();
    renderProfileDependents();
    alert('✓ Tanggungan berhasil dihapus.');
  }
}

// ==================== RE-INTEGRATING ACTIVE VIRAL LOOP & WEB3 WARIS ACTIONS ====================

let activeHeartbeatDays = 365;

// 1. Simulates 5 new user checkouts for Eko Gio's referral
async function executeViralReferralLoop() {
  if (!appState.db) return;

  const referralBonusTotal = 495000; // Rp 99.000 * 5 * 10% equivalent referral earnings split

  appState.db.affiliateData.clicks = (appState.db.affiliateData.clicks || 0) + 12; // Simulate clicks
  appState.db.affiliateData.earnings += referralBonusTotal;

  // Insert 5 new referrers in history
  const names = ["Ahmad Fauzi", "Siti Aminah", "Budi Santoso", "Dewi Lestari", "Rendra Wijaya"];
  names.forEach((name, idx) => {
    appState.db.affiliateData.history.unshift({
      id: Date.now() + idx,
      date: new Date().toISOString().split('T')[0],
      source: `Rujukan Viral - Registrasi ${name}`,
      amount: 99000,
      platformShare: 29700,
      isAutopilotHarvested: false, // Will be harvested by our otonom Autopilot Daemon on the master process!
      status: "Approved"
    });
  });

  await saveDatabase();
  
  // Reload and update all panels
  renderMembershipAffiliate();
  initDeveloperConsole();

  alert(`🚀 GROWTH HACKING VIRAL LOOP BERHASIL!\n\nSimulasi Sukses:\n- 5 Teman Anda (${names.join(', ')}) berhasil mendaftar Premium melalui link Anda.\n- Dompet Anda dikreditkan komisi Rp ${referralBonusTotal.toLocaleString('id-ID')} IDR!\n- 5 referrals baru tercatat rill di database fisik dan memori aktif.\n\nInilah kekuatan loop viralitas finansial Gerai 910!`);
}

// 2. Heartbeat on Main App Faraid page
function triggerActiveOwnerHeartbeat() {
  activeHeartbeatDays = 365;
  updateActiveHeartbeatUI();
  
  alert(`💖 Owner Heartbeat Berhasil Dikirim!\n\nSinyal kehadiran Anda berhasil direkam on-chain di Polygon POS Mainnet. Sisa hari masa tunggu ahli waris telah di-reset kembali ke 365 Hari.`);
}

// 3. Simulate berlalunya waktu on Main App Faraid page
function triggerActiveTimePassage() {
  activeHeartbeatDays = 0;
  updateActiveHeartbeatUI();
  
  alert(`⚠️ Masa Tunggu Terlampaui!\n\nMasa tenggang 365 hari terlampaui. Pemilik dinyatakan tidak aktif. Hak pewarisan on-chain otomatis dibuka! Ahli waris kini dapat mengklaim porsi warisan mereka secara rill.`);
}

// 4. Update Heartbeat Countdown UI in Main App
function updateActiveHeartbeatUI() {
  const lbl = document.getElementById('main-heartbeat-lbl');
  const bar = document.getElementById('main-heartbeat-bar');
  if (!lbl || !bar) return;

  if (activeHeartbeatDays > 0) {
    lbl.innerText = `${activeHeartbeatDays} Hari Tersisa`;
    lbl.className = "font-mono text-yellow-500 font-bold";
    bar.className = "bg-yellow-500 h-1 rounded-full animate-pulse";
    const pct = (activeHeartbeatDays / 365) * 100;
    bar.style.width = `${pct}%`;
  } else {
    lbl.innerText = "0 Hari (PEMILIK INAKTIF / WARIS SIAP KLAIM)";
    lbl.className = "font-mono text-red-500 font-black animate-pulse";
    bar.className = "bg-red-500 h-1 rounded-full";
    bar.style.width = `100%`;
  }

  renderActiveBlockchainHeirs();
}

// 5. Render Heirs list with action buttons in Main App Faraid page
function renderActiveBlockchainHeirs() {
  const container = document.getElementById('main-blockchain-heirs-list');
  if (!container) return;

  container.innerHTML = '';

  const heirsList = [
    { name: "Rizky Gio", relation: "Anak Laki-Laki Utama", address: "0x82A110205e467C3098defB751B7401B5f6d1476B", share: "66.67% (2/3 Ashabah)" },
    { name: "Alya Gio", relation: "Anak Perempuan Kedua", address: "0x4B309923C7ab88b098defB751B7401B5f6d1476B", share: "33.33% (1/3 Ashabah)" }
  ];

  heirsList.forEach(heir => {
    const div = document.createElement('div');
    div.className = "flex justify-between items-center bg-slate-900 p-2 rounded-xl border border-cyber-border/20 text-[11px] font-mono";
    
    let actionBtn = "";
    if (activeHeartbeatDays <= 0) {
      actionBtn = `<button onclick="executeActiveInheritanceClaim('${heir.name}', '${heir.share}')" class="bg-red-950 hover:bg-red-800 text-red-400 border border-red-800/40 px-2 py-0.5 rounded text-[9px] font-bold uppercase transition">Klaim Waris</button>`;
    } else {
      actionBtn = `<span class="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Locked</span>`;
    }

    div.innerHTML = `
      <div>
        <div class="flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 bg-brand-500 rounded-full"></span>
          <strong class="text-slate-200">${heir.name}</strong> 
          <span class="text-[9px] text-slate-500">(${heir.relation})</span>
        </div>
        <span class="text-[10px] text-slate-400 block mt-0.5">${heir.address}</span>
        <span class="text-[10px] text-brand-400 block font-bold mt-0.5">Porsi Waris KHI: ${heir.share}</span>
      </div>
      <div>
        ${actionBtn}
      </div>
    `;
    container.appendChild(div);
  });
}

// 6. Executes On-Chain Inheritance Claim on Main App
function executeActiveInheritanceClaim(heirName, share) {
  let totalPlatformFees = 0;
  if (appState.db && appState.db.affiliateData && appState.db.affiliateData.history) {
    appState.db.affiliateData.history.forEach(item => {
      const pShare = item.platformShare || Math.round(item.amount * (30/70));
      totalPlatformFees += pShare;
    });
  }

  const claimPct = heirName.includes('Rizky') ? (2/3) : (1/3);
  const claimAmount = Math.round(totalPlatformFees * claimPct);

  alert(`⛓️ MEMPROSES KLAIM WARIS ON-CHAIN (WEB3)...\n\nAhli Waris: ${heirName}\nPorsi Waris: ${share}\n\nKontrak Pintar sedang memvalidasi penandatanganan transaksi...`);

  setTimeout(() => {
    alert(`🔥 PENCAIRAN WARISAN BLOCKCHAIN BERHASIL!\n\nDana Abadi Sebesar Rp ${claimAmount.toLocaleString('id-ID')} IDR telah dikirim secara otonom ke dompet ahli waris [${heirName}].\n\nKepemilikan platform admin juga telah didelegasikan secara legal ke generasi penerus Anda!`);
    
    activeHeartbeatDays = 365; // Reset UI
    updateActiveHeartbeatUI();
  }, 1200);
}

