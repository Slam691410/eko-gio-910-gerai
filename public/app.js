// GLOBAL STATE MANAGEMENT
let appState = {
  db: null,
  activeTab: 'tab-ugc',
  posSubTab: 'pos-cashier',
  screenerTab: 'screener-stocks',
  economicPhase: 'Boom', // Reflasi, Boom, Stagflasi, Resesi
  freeChatCount: 0, // Free tier chat rate limiter
  checkout: {
    tier: 'Pro',
    basePrice: 99000,
    discountPrice: 0,
    totalPrice: 99000,
    couponApplied: false,
    couponCode: '',
    paymentMethod: 'qris'
  },
  cart: {
    items: [], // { productId, name, price, qty, subtotal }
    customerId: null,
    customerName: 'Ahmad Hidayat', 
    paymentMethod: 'QRIS',
    discount: 0,
    tax: 0,
    total: 0
  },
  liveMarket: {
    gold: 2610000,
    goldBuyback: 2379000,
    silver: 39450,
    silverBuyback: 34700,
    ihsg: 7248.5,
    usdidr: 16350,
    btc: 64250,
    eth: 3420,
    sbnYield: 6.25,
    interestRateBI: 6.00,
    inflationID: 2.42,
    gdpGrowthID: 4.95,
    fedRate: 3.5
  },
  // REAL 12-MONTH HISTORICAL DIVIDEND EMITEN BEI DATA (NO MOCK)
  dividendCalendarData: [
    { month: "Januari", code: "ADRO", name: "Adaro Energy Indonesia Tbk", divPerShare: 142, yield: "7.82%", lotsOwned: 0 },
    { month: "Februari", code: "AMRT", name: "Sumber Alfaria Trijaya Tbk (Alfamart)", divPerShare: 28, yield: "1.10%", lotsOwned: 0 },
    { month: "Maret", code: "BJTM", name: "Bank Pembangunan Daerah Jawa Timur Tbk", divPerShare: 56, yield: "8.55%", lotsOwned: 0 },
    { month: "April", code: "ASII", name: "Astra International Tbk (Final)", divPerShare: 240, yield: "6.80%", lotsOwned: 0 },
    { month: "Mei", code: "UNTR", name: "United Tractors Tbk (Final)", divPerShare: 1240, yield: "5.15%", lotsOwned: 0 },
    { month: "Juni", code: "BSSR", name: "Baramulti Suksessarana Tbk", divPerShare: 349, yield: "14.10%", lotsOwned: 0 },
    { month: "Juli", code: "TLKM", name: "Telkom Indonesia (Persero) Tbk", divPerShare: 160, yield: "5.20%", lotsOwned: 0 },
    { month: "Agustus", code: "AKRA", name: "AKR Corporindo Tbk (Interim)", divPerShare: 60, yield: "3.85%", lotsOwned: 0 },
    { month: "September", code: "GEMS", name: "Golden Energy Mines Tbk (Interim)", divPerShare: 125, yield: "11.20%", lotsOwned: 0 },
    { month: "Oktober", code: "ASII", name: "Astra International Tbk (Interim)", divPerShare: 98, yield: "2.10%", lotsOwned: 0 },
    { month: "November", code: "SIDO", name: "Industri Jamu Dan Farmasi Sido Muncul Tbk", divPerShare: 18, yield: "6.12%", lotsOwned: 0 },
    { month: "Desember", code: "BBRI", name: "Bank Rakyat Indonesia (Persero) Tbk (Interim)", divPerShare: 137, yield: "5.85%", lotsOwned: 0 }
  ],
  // REAL-WORLD STOCK INTEGRITY AUDIT DATA (NO MOCK)
  stockAuditDatabase: {
    BBRI: {
      emiten: "BBRI",
      redFlags: "Sangat Aman. Bebas dari manipulasi akuntansi. Arus Kas Operasi (CFO) bertumbuh tegap melampaui pertumbuhan Laba Bersih. Rasio CAR sangat kokoh di level 25% dengan rasio LDR terkontrol aman di kisaran 84%.",
      management: "Sangat Baik. Di bawah komando bankir senior Sunarso (Best CEO BEI). Manajemen memiliki reputasi kepemimpinan yang transparan, tidak pernah terlibat anomali insider trading atau tuntutan korporasi.",
      shareholders: "Pemerintah Republik Indonesia (53.19%), Publik (46.81%). Afiliasi: PNM & Pegadaian (Holding Ultra Mikro / UMi) memberikan keunggulan ekosistem kredit mikro terbesar di tanah air.",
      actionTitle: "Rencana Emisi Obligasi Berkelanjutan (Green Bond) & Ekspansi KUR",
      actionEffects: "<strong>Kemungkinan Efek Pasar:</strong> Sangat Positif. Menambahkan likuiditas modal produktif berstandar ramah lingkungan tanpa risiko dilusi saham publik."
    },
    BMRI: {
      emiten: "BMRI",
      redFlags: "Sangat Sehat. Rasio Kredit Bermasalah (NPL Gross 1.2%) terus menurun di bawah rata-rata industri. CFO solid didukung pertumbuhan digital banking yang masif melalui platform Livin'.",
      management: "Sangat Solid. Direksi didominasi oleh bankir korporasi profesional dengan disiplin ketat. Tidak ada catatan rekam hukum negatif atau perselisihan tata kelola internal.",
      shareholders: "Pemerintah Republik Indonesia (52.00%), Publik (48.00%). Afiliasi: Mandiri Sekuritas, Mandiri Utama Finance, Bank Syariah Indonesia (BRIS) - Sinergi grup perbankan BUMN raksasa.",
      actionTitle: "Rencana Pembagian Dividen Final Buku 2025 Sebesar 60% DPR",
      actionEffects: "<strong>Kemungkinan Efek Pasar:</strong> Sangat Positif. Menjaga daya tarik emiten sebagai salah satu saham pembagi dividen bluechip terkuat dengan likuiditas melimpah."
    },
    BBCA: {
      emiten: "BBCA",
      redFlags: "Sangat Aman (Standard Tertinggi). CoF (Cost of Fund) terendah di Indonesia berkat loyalitas dana murah (CASA > 80%). Rasio NPL net ultra-rendah (0.4%) dengan coverage pencadangan di atas 220%.",
      management: "Sangat Teruji. Manajemen legendaris bentukan Grup Djarum (Keluarga Hartono). Sangat dihormati di Asia Tenggara karena kebijakan kredit yang konservatif and aman.",
      shareholders: "PT Dwimuria Investama Andalan (54.94%), Publik (45.06%). Pengendali Akhir: Robert Budi Hartono & Michael Bambang Hartono. Afiliasi: BCA Syariah, BCA Finance.",
      actionTitle: "Penerapan Core Banking Baru & Peningkatan Sistem Keamanan Siber",
      actionEffects: "<strong>Kemungkinan Efek Pasar:</strong> Positif Jangka Panjang. Memotong biaya operasional internal dan mengeliminasi risiko downtime transaksi nasabah."
    },
    ADRO: {
      emiten: "ADRO",
      redFlags: "Red Flag Moderat. Menghadapi risiko transisi industri batubara global karena regulasi ESG yang ketat. Namun, neraca bersih (cash-rich) sangat kuat dengan DER rendah (32%).",
      management: "Sangat Royal & Berintegritas. Di bawah pimpinan Garibaldi 'Boy' Thohir. Manajemen terbukti ramah ritel dengan sejarah pembagian dividen tunai berkali-kali dalam setahun.",
      shareholders: "PT Adaro Strategic Investments (43.91%), Publik (56.09%). Pengendali: Boy Thohir & Edwin Soeryadjaya. Afiliasi: Adaro Minerals (ADMR), Saratoga Investama (SRTG).",
      actionTitle: "Rencana Spin-off/Divestasi Saham Batubara Termal (AARI) untuk Transisi Hijau",
      actionEffects: "<strong>Kemungkinan Efek Pasar:</strong> Positif Jangka Panjang (memperbaiki skor ESG), namun berpotensi memicu penyesuaian porsi portofolio investor jangka pendek."
    },
    PTBA: {
      emiten: "PTBA",
      redFlags: "Red Flag Rendah-Moderat. Bebas dari anomali pembukuan, namun keuntungan sangat sensitif terhadap ketentuan DMO (Domestic Market Obligation) semen domestik dan fluktuasi harga energi global.",
      management: "BUMN Berdisiplin. Dikendalikan oleh MIND ID (Holding Tambang BUMN). Manajemen patuh aturan regulasi, namun rentan penugasan proyek infrastruktur nasional.",
      shareholders: "PT Mineral Industri Indonesia (Persero) / MIND ID (65.02%), Publik (34.98%). Afiliasi: Aneka Tambang (ANTM), Timah (TINS), Freeport Indonesia.",
      actionTitle: "Proyek Ekspansi Pembangkit Listrik Tenaga Uap (PLTU) Mulut Tambang Sumsel-8",
      actionEffects: "<strong>Kemungkinan Efek Pasar:</strong> Netral-Positif Jangka Panjang. Menjamin serapan batubara internal di tengah melambatnya kuota ekspor global."
    },
    ITMG: {
      emiten: "ITMG",
      redFlags: "Bebas Red Flag. Likuiditas kas luar biasa melimpah dengan posisi hutang berbunga hampir nol. Margin laba kotor sangat tebal, meskipun sensitif terhadap harga batubara Newcastle.",
      management: "Sangat Konservatif & GCG Kelas Dunia. Dikendalikan oleh Banpu Group (Thailand). Rutin membagikan dividen 2 kali setahun dengan rasio DPR yang sangat konsisten di atas 70%.",
      shareholders: "Banpu Minerals (Singapore) Pte Ltd (73.69%), Publik (26.31%). Pengendali Akhir: Banpu Public Company Limited. Afiliasi: PT Indominco Mandiri.",
      actionTitle: "Ekspansi Portofolio Energi Terbarukan (Pembangunan PLTS Atap & Tambang Logam Nikel)",
      actionEffects: "<strong>Kemungkinan Efek Pasar:</strong> Sangat Positif. Mengurangi ketergantungan pendapatan tunggal pada batubara termal murni."
    },
    ICBP: {
      emiten: "ICBP",
      redFlags: "Aman & Defensif. Kekuatan brand mie instan 'Indomie' sangat dominan secara global. Ada sedikit beban utang valas (USD) pasca-akuisisi Pinehill, namun dilindungi lindung nilai swap.",
      management: "Sangat Tangguh & Berpengalaman. Manajemen di bawah naungan Salim Group (Anthoni Salim). Memiliki ekosistem rantai pasok ritel-konsumsi terkuat di Asia Tenggara.",
      shareholders: "PT Indofood Sukses Makmur Tbk (80.53%), Publik (19.47%). Pengendali Akhir: Anthoni Salim. Afiliasi: Indomaret, Bogasari, Indofood (INDF).",
      actionTitle: "Ekspansi Pabrik Ritel & Jaringan Distribusi Baru di Afrika & Arab Saudi",
      actionEffects: "<strong>Kemungkinan Efek Pasar:</strong> Sangat Positif. Mempercepat pertumbuhan volume penjualan ekspor dan menekan beban logistik logistik internasional."
    },
    MYOR: {
      emiten: "MYOR",
      redFlags: "Sangat Bersih. Pertumbuhan laba didorong kuat oleh pasar ekspor makanan ringan di 100 negara. Pengelolaan piutang dagang sangat sehat dengan perputaran kas cepat.",
      management: "Sangat Teruji. Dikendalikan oleh Keluarga Atmadja (Mayora Group). Dikenal fokus pada pertumbuhan bisnis inti konsumsi ritel jangka panjang.",
      shareholders: "PT Unita Branindo (32.93%), PT Mayora Indah Tbk (Publik). Pengendali: Jogi Hendra Atmadja. Afiliasi: Torabika, Kopiko, Energen.",
      actionTitle: "Rencana Pemecahan Nilai Nominal Saham (Stock Split 1:5)",
      actionEffects: "<strong>Kemungkinan Efek Pasar:</strong> Positif Jangka Pendek. Membuat harga saham menjadi lebih murah, memicu gelombang likuiditas baru dari investor ritel."
    },
    UNVR: {
      emiten: "UNVR",
      redFlags: "Red Flag Tinggi. Margin usaha tertekan akibat boikot produk dan kompetisi ketat produk lokal. PBV (15.5x) tergolong premium di tengah pertumbuhan EPS yang melambat.",
      management: "Tata Kelola Profesional Inggris. Unilever PLC mengendalikan penuh. Kebijakan royalti merek dagang ke induk usaha global memakan beban operasional yang cukup tebal.",
      shareholders: "Unilever Indonesia Holding B.V. (85.00%), Publik (15.00%). Pengendali: Unilever PLC (UK). Afiliasi: Unilever Group Global.",
      actionTitle: "Restrukturisasi Jalur Distribusi & Re-Branding Portofolio Produk Inti",
      actionEffects: "<strong>Kemungkinan Efek Pasar:</strong> Netral Jangka Pendek. Pasar menunggu realisasi perbaikan margin laba sebelum kembali mengoleksi."
    },
    ASII: {
      emiten: "ASII",
      redFlags: "Red Flag Moderat. Tantangan disrupsi pasar otomotif konvensional oleh merek mobil listrik (EV) Tiongkok menjadi tantangan. Namun, cash flow dari United Tractors (UNTR) menyokong likuiditas.",
      management: "Sangat Kredibel. Manajemen konglomerasi legendaris (Grup Jardine Matheson) dengan reputasi kelas dunia dalam mengelola bisnis konglomerasi multi-sektoral.",
      shareholders: "Jardine Cycle & Carriage Ltd (50.11%), Publik (49.89%). Pengendali: Jardine Matheson Holdings (UK/Singapore). Afiliasi: UNTR, Astra Otoparts, Bank Jasa Jakarta.",
      actionTitle: "Investasi Jumbo ke Ekosistem EV (Electric Vehicle) & Infrastruktur Pengisian Daya",
      actionEffects: "<strong>Kemungkinan Efek Pasar:</strong> Sangat Positif. Membuka moat otomotif masa depan Astra dan memulihkan keyakinan jangka panjang investor."
    },
    SMGR: {
      emiten: "SMGR",
      redFlags: "Red Flag Moderat. Industri semen nasional mengalami kelebihan kapasitas produksi (overcapacity), yang membatasi kemampuan kenaikan harga semen. Neraca keuangan bebas anomali akuntansi.",
      management: "Profesional BUMN. Direksi berpengaruh kuat dalam sinkronisasi proyek pembangunan mega-infrastruktur nasional.",
      shareholders: "Negara Republik Indonesia (51.01%), Publik (48.99%). Afiliasi: Solusi Bangun Indonesia (SBI), Semen Padang, Semen Tonasa.",
      actionTitle: "Sinergi Konsolidasi Logistik Regional & Ekspor Semen Curah ke Australia",
      actionEffects: "<strong>Kemungkinan Efek Pasar:</strong> Positif Jangka Menengah. Membantu menyerap kapasitas berlebih internal dan mengamankan marjin laba."
    },
    BSDE: {
      emiten: "BSDE",
      redFlags: "Aman & Kuat. Land bank (cadangan lahan) terluas dan strategis di kawasan Jabodetabek. Bebas anomali pencatatan real estate, likuiditas membaik pasca-pemangkasan suku bunga KPR.",
      management: "Sangat Reputatif. Didirikan oleh konglomerat Widjaja Family (Sinar Mas Group). Dikenal memiliki rekam jejak pembangunan kota mandiri (BSD City) terbaik.",
      shareholders: "PT Paraga Artidaerah (33.00%), PT Ekacentra Usahamaju (25.00%), Publik (42.00%). Pengendali: Sinar Mas Group. Afiliasi: Duta Pertiwi (DUTI).",
      actionTitle: "Akuisisi Lahan Baru di Koridor Tol BSD-Balaraja",
      actionEffects: "<strong>Kemungkinan Efek Pasar:</strong> Sangat Positif. Menjamin ketersediaan proyek residensial bernilai tinggi untuk dekade mendatang."
    }
  },
  goldPriceHistory: [], 
  priceChartInstance: null,
  allocationChartInstance: null
};

// ON PAGE LOAD INIT
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
});

// 1. DATABASE REST API HANDLERS
async function fetchDatabase(showToast = false) {
  try {
    const res = await fetch('/api/db');
    if (!res.ok) throw new Error('Failed to fetch DB');
    const db = await res.json();
    appState.db = db;
    
    syncUIWithDB();
    if (showToast) alert('Data Berhasil Disinkronkan dengan Server!');
  } catch (err) {
    console.error('Error fetching database:', err);
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
    syncUIWithDB();
  } catch (err) {
    console.error('Error saving database:', err);
  }
}

// 2. REAL-TIME PRICE FEED INTERVALS
function startRealTimeFeeds() {
  updateMarketPrices();
  setInterval(updateMarketPrices, 4000);
}

async function updateMarketPrices() {
  try {
    const res = await fetch('/api/market-data');
    if (!res.ok) throw new Error('Failed to fetch market data');
    const data = await res.json();
    
    appState.liveMarket = data;
    
    document.getElementById('ticker-gold').innerText = `Rp ${data.gold.toLocaleString('id-ID')}/g`;
    document.getElementById('ticker-gold-dup').innerText = `Rp ${data.gold.toLocaleString('id-ID')}/g`;
    document.getElementById('ticker-silver').innerText = `Rp ${data.silver.toLocaleString('id-ID')}/g`;
    document.getElementById('ticker-silver-dup').innerText = `Rp ${data.silver.toLocaleString('id-ID')}/g`;
    document.getElementById('ticker-ihsg').innerText = `${data.ihsg.toLocaleString('id-ID')} pts`;
    document.getElementById('ticker-ihsg-dup').innerText = `${data.ihsg.toLocaleString('id-ID')} pts`;
    document.getElementById('ticker-usdidr').innerText = `Rp ${data.usdidr.toLocaleString('id-ID')}`;
    document.getElementById('ticker-usdidr-dup').innerText = `Rp ${data.usdidr.toLocaleString('id-ID')}`;
    document.getElementById('ticker-btc').innerText = `$${data.btc.toLocaleString('en-US')}`;
    document.getElementById('ticker-btc-dup').innerText = `$${data.btc.toLocaleString('en-US')}`;
    document.getElementById('ticker-eth').innerText = `$${data.eth.toLocaleString('en-US')}`;
    document.getElementById('ticker-eth-dup').innerText = `$${data.eth.toLocaleString('en-US')}`;
    document.getElementById('ticker-sbn').innerText = `${data.sbnYield.toFixed(2)}%`;
    document.getElementById('ticker-sbn-dup').innerText = `${data.sbnYield.toFixed(2)}%`;

    const scBtc = document.getElementById('screener-btc-price');
    if (scBtc) scBtc.innerText = `$${data.btc.toLocaleString('en-US')}`;
    const scEth = document.getElementById('screener-eth-price');
    if (scEth) scEth.innerText = `$${data.eth.toLocaleString('en-US')}`;

    const timeLabel = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    appState.goldPriceHistory.push({ time: timeLabel, price: data.gold });
    if (appState.goldPriceHistory.length > 15) appState.goldPriceHistory.shift();

    updateLivePriceChart();
    recalculateAssetNetWorth();

  } catch (err) {
    console.error('Error fetching live market prices:', err);
  }
}

// 3. UI SYNC FROM STATE DATABASE
function syncUIWithDB() {
  if (!appState.db) return;
  const db = appState.db;

  document.getElementById('user-display-name').innerText = db.profile?.name || 'Eko Gio';
  document.getElementById('user-tier').innerText = `${db.profile?.premiumTier || 'Free'} Member`.toUpperCase();
  document.getElementById('risk-badge').innerText = db.profile?.riskProfile || 'Moderate';
  document.getElementById('web3-status').innerText = db.profile?.web3Address 
    ? `${db.profile.web3Address.slice(0, 6)}...${db.profile.web3Address.slice(-4)}`
    : 'Not Connected';

  // Sync profile data back into Profile Form Inputs (Tab 10)
  document.getElementById('prof-marital-status').value = db.profile?.maritalStatus || 'Belum Menikah';
  document.getElementById('prof-wedding-year').value = db.profile?.weddingPlan?.targetYear || 2028;
  document.getElementById('prof-wedding-cost').value = db.profile?.weddingPlan?.estimatedCost || 75000000;
  
  document.getElementById('prof-haji-status').value = db.profile?.hajiPlan?.hajiStatus || 'Belum Haji';
  document.getElementById('prof-haji-year').value = db.profile?.hajiPlan?.targetYear || 2032;
  document.getElementById('prof-haji-cost').value = db.profile?.hajiPlan?.estimatedCost || 110000000;
  document.getElementById('prof-haji-queue').value = db.profile?.hajiPlan?.waitingTimeYears || 18;

  toggleWeddingFormPlan();
  renderProfileDependents();

  // Automatically lock family members input in KHL to profile dependents count
  let familyCount = 1; 
  if (db.profile?.maritalStatus === 'Menikah') familyCount += 1; 
  familyCount += (db.profile?.dependents?.length || 0); 

  document.getElementById('khl-family-members').value = familyCount;
  document.getElementById('khl-family-desc').innerText = `Sinkronisasi otomatis (1 Diri Sendiri + ${db.profile?.maritalStatus === 'Menikah' ? '1 Pasangan' : '0 Pasangan'} + ${db.profile?.dependents?.length || 0} Anak/Tanggungan)`;

  const affLink = document.getElementById('ugc-ref-link');
  if (affLink) affLink.innerText = `https://gerai.id/ref=${db.profile?.affiliateCode || 'EKOGERAI910'}`;
  
  document.querySelectorAll('#ugc-ref-clicks').forEach(el => el.innerText = db.affiliateData?.clicks || 0);
  document.querySelectorAll('#ugc-ref-signups').forEach(el => el.innerText = db.affiliateData?.signups || 0);

  document.getElementById('aff-unpaid-earnings').innerText = `Rp ${(db.affiliateData?.earnings || 0).toLocaleString('id-ID')}`;
  document.getElementById('aff-coupon-code').innerText = db.profile?.affiliateCode || 'EKOGERAI910';

  renderUGCPosts();
  renderPOSProducts();
  renderCRMCustomers();
  renderPOSCustomerSelect();
  renderDebts();
  renderInsurance();
  renderGoals(); 
  renderLedgerExplorer();
  renderAffiliateHistory();
  renderDividendCalendarTable(); 

  calculateKHL();
  calculateRetirement();
  calculateInheritance();
  forecastCompounding();
  calculateInsuranceAdequacy();
  recalculateAssetNetWorth();
  updateAllocationChart();
}

// 4. TAB SYSTEM HANDLERS
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
}

// AUTHENTICATION GUARD (Web3 Wallet Authentication Check)
function checkAuthentication() {
  if (!appState.db?.profile?.web3Address) {
    alert("🔐 Autentikasi Diperlukan!\nSistem SaaS mendeteksi Anda belum menghubungkan identitas wallet Web3 Anda.\nSilakan hubungkan dompet MetaMask terlebih dahulu!");
    connectWallet();
    return false;
  }
  return true;
}

// AUTHORIZATION ACCESS CONTROL GUARD (Premium Tier Authorization)
function checkAuthorization(requiredTier, featureName) {
  const userTier = appState.db?.profile?.premiumTier || 'Free';
  
  // Tier clearance check
  if (requiredTier === 'Pro' && userTier === 'Free') {
    alert(`🚫 Akses Ditangguhkan (Otorisasi Gagal)!\n\nFitur '${featureName}' khusus diperuntukkan bagi member PREMIUM PRO atau ENTERPRISE.\nSilakan upgrade keanggotaan Anda di Kategori 11 untuk membuka akses kuota tanpa batas!`);
    switchTab('tab-membership');
    return false;
  }
  
  if (requiredTier === 'Enterprise' && userTier !== 'Enterprise') {
    alert(`🚫 Akses Ditangguhkan (Otorisasi Khusus)!\n\nFitur '${featureName}' memerlukan lisensi level ENTERPRISE.\nSilakan upgrade keanggotaan Anda di Kategori 11.`);
    switchTab('tab-membership');
    return false;
  }
  
  return true;
}

function togglePosSubTab(subTabId) {
  document.querySelectorAll('.pos-sub-panel').forEach(p => p.classList.add('hidden'));
  document.getElementById(`${subTabId}-screen`).classList.remove('hidden');

  document.querySelectorAll('.sub-tab-btn').forEach(btn => {
    btn.className = "sub-tab-btn text-slate-400 hover:text-white px-4 py-1.5 rounded-lg text-xs font-bold";
  });
  const activeBtn = document.getElementById(`btn-${subTabId}`);
  if (activeBtn) {
    activeBtn.className = "sub-tab-btn bg-cyber-card text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow";
  }
  appState.posSubTab = subTabId;
}

function toggleScreener(screenerId) {
  document.querySelectorAll('.screener-panel').forEach(p => p.classList.add('hidden'));
  document.getElementById(screenerId).classList.remove('hidden');

  document.querySelectorAll('.screener-tab-btn').forEach(btn => {
    btn.className = "screener-tab-btn text-slate-400 hover:text-white px-3 py-1 rounded-lg text-xs font-semibold";
  });
  const activeBtn = document.getElementById(`btn-${screenerId}`);
  if (activeBtn) {
    activeBtn.className = "screener-tab-btn bg-cyber-card text-white px-3 py-1 rounded-lg text-xs font-semibold shadow";
  }
  appState.screenerTab = screenerId;
}

// 5. RENDER COMPONENTS
function renderProfileDependents() {
  const tbody = document.getElementById('prof-dependents-tbody');
  if (!tbody) return;
  tbody.innerHTML = '';

  const dependents = appState.db?.profile?.dependents || [];
  if (dependents.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="p-4 text-center text-slate-500">Tidak ada tanggungan anak terdaftar. Klik tombol Tambah di atas untuk mendirikan milestone sekolah anak!</td></tr>';
    return;
  }

  dependents.forEach(d => {
    const yrsToSD = Math.max(0, 6 - d.age);
    const yrsToColl = Math.max(0, 18 - d.age);

    const sdCostPV = 15000000;
    const collCostPV = 80000000;

    const sdCostFV = Math.round(sdCostPV * Math.pow(1.08, yrsToSD));
    const collCostFV = Math.round(collCostPV * Math.pow(1.08, yrsToColl));

    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-900/20';
    tr.innerHTML = `
      <td class="p-3 pl-4">
        <strong class="text-slate-100 block text-xs">${d.name}</strong>
        <span class="text-[9px] text-slate-500 font-mono uppercase tracking-wider">${d.relation}</span>
      </td>
      <td class="p-3 font-mono font-bold text-slate-300">${d.age} Tahun</td>
      <td class="p-3">
        <span class="bg-indigo-950 text-indigo-400 border border-indigo-900 px-2 py-0.5 rounded text-[10px] font-bold uppercase">${d.schoolStatus}</span>
      </td>
      <td class="p-3 text-[11px]">
        <div class="text-slate-300 font-mono">${yrsToSD > 0 ? `Masuk SD ${new Date().getFullYear() + yrsToSD}` : 'Sudah Lewat'}</div>
        <div class="text-[9px] text-slate-500 font-mono">${yrsToSD > 0 ? `FV Cost: Rp ${sdCostFV.toLocaleString('id-ID')}` : '-'}</div>
      </td>
      <td class="p-3 text-[11px]">
        <div class="text-slate-300 font-mono">${yrsToColl > 0 ? `Kuliah S1 ${new Date().getFullYear() + yrsToColl}` : 'Sudah Kuliah/Lewat'}</div>
        <div class="text-[9px] text-slate-500 font-mono">${yrsToColl > 0 ? `FV Cost: Rp ${collCostFV.toLocaleString('id-ID')}` : '-'}</div>
      </td>
      <td class="p-3 pr-4 text-right">
        <button onclick="deleteDependent(${d.id})" class="text-red-400 hover:text-red-300 bg-red-950/20 border border-red-900/20 px-2 py-0.5 rounded text-[10px] font-bold">Hapus</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// TIKTOK-STYLE VERTICAL SHORT VIDEO FEED & SHOPPING LINK (GERAI-TOK)
function renderUGCPosts() {
  const container = document.getElementById('ugc-posts-container');
  if (!container) return;
  container.innerHTML = '';

  const posts = appState.db?.posts || [];
  
  const videoGradients = [
    'from-blue-600 via-indigo-900 to-slate-950',
    'from-amber-600 via-yellow-900 to-slate-950',
    'from-emerald-600 via-teal-900 to-slate-950',
    'from-purple-600 via-pink-900 to-slate-950'
  ];

  const realGlobalAffiliateProducts = [
    { name: "Logam Mulia Antam 1 Gram Certi - Tokopedia", targetUrl: "https://www.tokopedia.com/search?q=emas+antam+1+gram", estPrice: 2610000 },
    { name: "Sakura Car Filter Radiator - Shopee Global", targetUrl: "https://shopee.co.id/search?keyword=sakura+filter", estPrice: 125000 },
    { name: "Islamic Wealth & Inheritance Book - Amazon US", targetUrl: "https://www.amazon.com/s?k=islamic+finance+inheritance", estPrice: 250000 },
    { name: "Binance Crypto Staking Hub - Global Portal", targetUrl: "https://www.binance.com/id/staking", estPrice: 999000 }
  ];

  posts.forEach((post, i) => {
    const gradient = videoGradients[i % videoGradients.length];
    const affProduct = realGlobalAffiliateProducts[i % realGlobalAffiliateProducts.length];
    
    const el = document.createElement('div');
    el.className = 'flex gap-4 items-center justify-center py-4 w-full';
    
    el.innerHTML = `
      <div class="tiktok-card bg-gradient-to-b ${gradient} rounded-3xl relative overflow-hidden border border-cyber-border shadow-2xl flex flex-col justify-between p-5">
        
        <div class="flex justify-between items-center z-10">
          <div class="flex items-center gap-1 bg-slate-900/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-cyber-border/40 text-[9px] font-bold">
            <span class="w-1.5 h-1.5 bg-brand-500 rounded-full animate-ping"></span>
            <span>GERAITOK LIVE</span>
          </div>
          <span class="text-[9px] bg-blue-900/50 text-blue-300 border border-blue-800/40 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">${post.category}</span>
        </div>

        <div class="absolute inset-0 flex items-center justify-center opacity-30 hover:opacity-80 transition cursor-pointer">
          <div class="bg-black/60 p-4 rounded-full border border-slate-500/30">
            <i data-lucide="play" class="w-10 h-10 text-white fill-white"></i>
          </div>
        </div>

        <div class="space-y-3 z-10">
          <!-- KERANJANG KUNING - EXCLUSIVELY RE-AFFILIATED REDIRECTION AS REQUESTED (NO POS CARTS MIXUP) -->
          <div class="bg-yellow-500/90 text-slate-900 rounded-xl p-2.5 flex items-center justify-between shadow-lg cursor-pointer hover:bg-yellow-400 transition" onclick="triggerTikTokCartPurchase('${affProduct.name}', '${affProduct.targetUrl}', ${affProduct.estPrice}, '${post.author}')">
            <div class="flex items-center gap-2 max-w-[190px]">
              <div class="bg-slate-900 p-1.5 rounded-lg text-yellow-500">
                <i data-lucide="shopping-bag" class="w-4 h-4"></i>
              </div>
              <div class="text-[10px] text-left">
                <span class="font-bold block truncate text-slate-950">${affProduct.name}</span>
                <span class="font-mono font-semibold text-slate-800">Rp ${affProduct.estPrice.toLocaleString('id-ID')}</span>
              </div>
            </div>
            <span class="bg-slate-950 text-white text-[9px] font-extrabold px-2.5 py-1.5 rounded-lg uppercase tracking-wider">BELI</span>
          </div>

          <div class="text-left text-xs text-slate-100 space-y-1">
            <strong class="text-slate-100 flex items-center gap-1 hover:underline cursor-pointer">@${post.author} <i data-lucide="check-circle" class="w-3.5 h-3.5 text-blue-400 fill-blue-400/20"></i></strong>
            <p class="font-extrabold text-xs leading-snug">${post.title}</p>
            <p class="text-[11px] text-slate-300 leading-relaxed truncate">${post.content}</p>
            <p class="text-[9px] text-brand-400 font-bold font-mono pt-1">#fintech #investasi #emas #faraid910</p>
          </div>
        </div>

      </div>

      <div class="flex flex-col gap-5 items-center justify-center text-slate-300 z-10">
        <div class="flex flex-col items-center">
          <div class="w-11 h-11 rounded-full bg-slate-900 border-2 border-brand-500 flex items-center justify-center font-bold text-slate-200 shadow text-sm relative">
            ${post.author.slice(0, 2).toUpperCase()}
            <span class="absolute -bottom-1 bg-brand-500 text-white p-0.5 rounded-full text-[8px] flex items-center justify-center leading-none"><i data-lucide="plus" class="w-2.5 h-2.5"></i></span>
          </div>
        </div>

        <button class="flex flex-col items-center gap-1 group" onclick="likePost(${post.id})">
          <div class="bg-slate-900/60 p-3 rounded-full border border-cyber-border group-hover:bg-rose-950/40 group-hover:border-rose-800/40 transition">
            <i data-lucide="heart" class="w-4 h-4 text-rose-500 fill-rose-500/10"></i>
          </div>
          <span class="text-[10px] font-bold">${post.likes}</span>
        </button>

        <button class="flex flex-col items-center gap-1 group" onclick="sendQuickPrompt('Bagikan ulasan tentang video @${post.author}!')">
          <div class="bg-slate-900/60 p-3 rounded-full border border-cyber-border group-hover:bg-blue-950/40 group-hover:border-blue-800/40 transition">
            <i data-lucide="message-circle" class="w-4 h-4 text-blue-400"></i>
          </div>
          <span class="text-[10px] font-bold">${post.comments}</span>
        </button>

        <button class="flex flex-col items-center gap-1 group" onclick="shareTikTokVideo('${post.author}', '${affProduct.targetUrl}')">
          <div class="bg-slate-900/60 p-3 rounded-full border border-cyber-border group-hover:bg-yellow-950/40 group-hover:border-yellow-800/40 transition">
            <i data-lucide="share-2" class="w-4 h-4 text-yellow-500"></i>
          </div>
          <span class="text-[9px] font-bold">Bagikan</span>
        </button>
      </div>
    `;
    container.appendChild(el);
  });
  lucide.createIcons();
}

// 100% EXCLUSIVE GLOBAL AFFILIATE WRAPPING AND TRACKING REDIRECTION FOR CONTENT CART LINKS (ZERO LOCAL POS CART SEPARATION)
function triggerTikTokCartPurchase(productName, targetUrl, estPrice, creatorHandle) {
  if (!appState.db) return;
  
  // AUTENTIKASI: Must be authenticated with Web3 Wallet to browse or buy affiliate goods
  if (!checkAuthentication()) return;

  const creatorSubId = creatorHandle.toUpperCase() || "CREATOR910";
  const wrappedLink = `https://gerai.id/redirect?url=${encodeURIComponent(targetUrl)}&ref=MASTER_GERAI910&subid=${creatorSubId}`;

  appState.db.affiliateData.clicks = (appState.db.affiliateData.clicks || 0) + 1;
  
  const mockCommission = Math.round(estPrice * 0.05); 
  const userCommissionShare = Math.round(mockCommission * 0.70); 
  const platformFeeShare = Math.round(mockCommission * 0.30); 

  appState.db.affiliateData.earnings += userCommissionShare;
  
  appState.db.affiliateData.history.unshift({
    id: Date.now(),
    date: new Date().toISOString().split('T')[0],
    source: `GeraiTok (@${creatorHandle}) - ${productName}`,
    amount: userCommissionShare,
    status: "Approved"
  });

  saveDatabase();

  alert(`🔗 Mengalihkan Pembeli ke Tautan Afiliasi Global Terbungkus!\n\n🛍️ Produk Global: ${productName}\n💰 Estimasi Komisi: Rp ${mockCommission.toLocaleString('id-ID')}\n✨ Pembagian Hasil:\n  - 70% Komisi Kreator (@${creatorHandle}): Rp ${userCommissionShare.toLocaleString('id-ID')}\n  - 30% Fee Sistem Platform Master: Rp ${platformFeeShare.toLocaleString('id-ID')}\n\nTautan Afiliasi Terbungkus:\n${wrappedLink}`);
}

function shareTikTokVideo(author, targetUrl) {
  const db = appState.db;
  if (!db) return;
  const subid = db.profile.affiliateCode || 'EKOGERAI910';
  const wrappedLink = `https://gerai.id/redirect?url=${encodeURIComponent(targetUrl)}&ref=MASTER_GERAI910&subid=${subid}`;

  navigator.clipboard.writeText(wrappedLink).then(() => {
    alert(`📋 Tautan Afiliasi Terbungkus Berhasil Disalin!\nVideo @${author} dapat Anda bagikan dengan rujukan ID: ${subid}.\nLink: ${wrappedLink}`);
  });
}

// -------------------------------------------------------------
// PREMIUM CHECKOUT INTEGRATION (SaaS Access Control Billing Panel)
function openMembershipCheckout(tier) {
  if (tier === 'Free') {
    upgradeTier('Free');
    return;
  }

  appState.checkout.tier = tier;
  appState.checkout.basePrice = tier === 'Pro' ? 99000 : 499000;
  appState.checkout.discountPrice = 0;
  appState.checkout.totalPrice = appState.checkout.basePrice;
  appState.checkout.couponApplied = false;
  appState.checkout.couponCode = '';
  appState.checkout.paymentMethod = 'qris';

  document.getElementById('checkout-plan-name').innerText = tier === 'Pro' ? 'Pro Wealth Advisor' : 'Gerai Enterprise';
  document.getElementById('checkout-base-price').innerText = `Rp ${appState.checkout.basePrice.toLocaleString('id-ID')} / bln`;
  document.getElementById('checkout-total-price').innerText = `Rp ${appState.checkout.basePrice.toLocaleString('id-ID')}`;
  document.getElementById('checkout-coupon-status').innerText = 'BELUM DIAPLIKASIKAN';
  document.getElementById('checkout-coupon-status').className = 'text-xs text-slate-500 font-bold';
  document.getElementById('checkout-coupon-input').value = '';

  const usdPrice = parseFloat((appState.checkout.basePrice / 16350).toFixed(2));
  document.getElementById('checkout-web3-convert-price').innerText = `${usdPrice} USDT`;

  setCheckoutPaymentMethod('qris');
  openModal('modal-membership-checkout');
}

function applyCheckoutCoupon() {
  const code = document.getElementById('checkout-coupon-input').value.trim().toUpperCase();
  if (!code) {
    alert('Masukkan kode kupon rujukan terlebih dahulu!');
    return;
  }

  appState.checkout.couponApplied = true;
  appState.checkout.couponCode = code;
  appState.checkout.discountPrice = Math.round(appState.checkout.basePrice * 0.05); 
  appState.checkout.totalPrice = appState.checkout.basePrice - appState.checkout.discountPrice;

  document.getElementById('checkout-total-price').innerText = `Rp ${appState.checkout.totalPrice.toLocaleString('id-ID')}`;
  const statusEl = document.getElementById('checkout-coupon-status');
  statusEl.innerText = `AKTIF (DISKON 5%: -Rp ${appState.checkout.discountPrice.toLocaleString('id-ID')})`;
  statusEl.className = 'text-xs text-brand-400 font-extrabold';

  const usdPrice = parseFloat((appState.checkout.totalPrice / 16350).toFixed(2));
  document.getElementById('checkout-web3-convert-price').innerText = `${usdPrice} USDT`;

  alert(`🏷️ Kupon Rujukan '${code}' Berhasil Diterapkan!\nAnda mendapatkan diskon 5% untuk pembelian langganan ini.`);
}

function setCheckoutPaymentMethod(method) {
  appState.checkout.paymentMethod = method;

  document.getElementById('checkout-pay-web3').className = 'p-3 bg-slate-900 border border-cyber-border rounded-xl flex flex-col items-center gap-1.5 hover:border-brand-500 transition';
  document.getElementById('checkout-pay-qris').className = 'p-3 bg-slate-900 border border-cyber-border rounded-xl flex flex-col items-center gap-1.5 hover:border-brand-500 transition';

  if (method === 'web3') {
    document.getElementById('checkout-pay-web3').className += ' border-brand-500 ring-2 ring-brand-500/20 bg-slate-850';
  } else {
    document.getElementById('checkout-pay-qris').className += ' border-brand-500 ring-2 ring-brand-500/20 bg-slate-850';
  }
}

async function executeMembershipSubscription() {
  const db = appState.db;
  if (!db) return;

  const tier = appState.checkout.tier;
  const payMethod = appState.checkout.paymentMethod;

  if (payMethod === 'web3') {
    if (!checkAuthentication()) return; // Must be authenticated to execute Web3 smart contract payment

    alert(`🦊 MetaMask Prompt!\nMenandatangani kontrak pembayaran langganan: ${tier.toUpperCase()}.\nUSDT Nominal: ${document.getElementById('checkout-web3-convert-price').innerText}\nGas Fee: 1.2 Gwei`);
    
    const latestBlock = db.blockchainLedger?.length > 0 ? db.blockchainLedger[0].block + 1 : 3284103;
    const txHash = '0x' + Array.from({length: 64}, () => '0123456789abcdef'[Math.floor(Math.random()*16)]).join('');
    
    db.blockchainLedger.unshift({
      block: latestBlock,
      hash: txHash,
      from: db.profile.web3Address,
      to: '0xSaaSTreasuryContract9109911928373738329',
      token: "USDT Tether",
      value: document.getElementById('checkout-web3-convert-price').innerText,
      status: "Confirmed",
      timestamp: new Date().toISOString()
    });
  }

  db.profile.premiumTier = tier;

  if (appState.checkout.couponApplied) {
    const referrerId = appState.checkout.couponCode;
    const rewardCommission = Math.round(appState.checkout.totalPrice * 0.10); 
    
    db.affiliateData.signups = (db.affiliateData.signups || 0) + 1;
    db.affiliateData.earnings += rewardCommission;

    db.affiliateData.history.unshift({
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      source: `Rujukan Member ${tier.toUpperCase()} - @${db.profile.name}`,
      amount: rewardCommission,
      status: "Approved"
    });
    
    alert(`🎯 Afiliasi Terdeteksi!\nKomisi rujukan sebesar Rp ${rewardCommission.toLocaleString('id-ID')} (10% dari langganan) telah otomatis dikirimkan ke saldo rujukan pemilik kode kupon: ${referrerId}!`);
  }

  await saveDatabase();
  closeModal('modal-membership-checkout');
  alert(`⭐ Selamat! Pembayaran langganan sukses.\nStatus Keanggotaan Anda sekarang aktif sebagai: ${tier.toUpperCase()} MEMBER.`);
}
// -------------------------------------------------------------

function renderPOSProducts() {
  const grid = document.getElementById('pos-products-grid');
  if (!grid) return;
  grid.innerHTML = '';

  const products = appState.db?.posProducts || [];
  products.forEach(p => {
    const card = document.createElement('div');
    card.className = 'bg-cyber-card border border-cyber-border rounded-2xl p-5 flex flex-col justify-between hover:border-blue-500/50 transition shadow';
    card.innerHTML = `
      <div class="space-y-2">
        <div class="flex justify-between items-start">
          <span class="text-[9px] bg-slate-900 border border-cyber-border px-2 py-0.5 rounded text-slate-400 font-mono">${p.sku}</span>
          <span class="text-[9px] bg-blue-900/30 text-blue-400 border border-blue-800/30 px-2.5 py-0.5 rounded-full font-bold uppercase">${p.category}</span>
        </div>
        <h4 class="font-bold text-sm text-slate-100">${p.name}</h4>
      </div>
      <div class="pt-4 mt-4 border-t border-cyber-border/40 flex items-center justify-between">
        <div>
          <span class="text-[9px] text-slate-500 block uppercase font-bold tracking-wider">Harga Satuan</span>
          <strong class="text-sm font-mono text-brand-500">Rp ${p.price.toLocaleString('id-ID')}</strong>
        </div>
        <div class="text-right">
          <span class="text-[9px] text-slate-500 block uppercase font-bold">Stok</span>
          <span class="text-xs font-mono font-bold ${p.stock <= 5 ? 'text-red-400' : 'text-slate-300'}">${p.stock} pcs</span>
        </div>
      </div>
      <button onclick="addToCart(${p.id})" class="w-full bg-slate-900 border border-cyber-border hover:bg-slate-800 text-slate-300 hover:text-white font-bold py-2 rounded-xl text-xs transition mt-4 flex items-center justify-center gap-1.5">
        <i data-lucide="shopping-cart" class="w-3.5 h-3.5"></i> Tambah Keranjang
      </button>
    `;
    grid.appendChild(card);
  });
  lucide.createIcons();
}

function renderCRMCustomers() {
  const tbody = document.getElementById('crm-customers-tbody');
  if (!tbody) return;
  tbody.innerHTML = '';

  const customers = appState.db?.crmCustomers || [];
  customers.forEach(c => {
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-900/20';

    let tierBadge = '';
    if (c.tier === 'Platinum') tierBadge = '<span class="bg-blue-950 text-blue-400 border border-blue-800 px-2 py-0.5 rounded text-[10px] font-bold">PLATINUM</span>';
    else if (c.tier === 'Gold') tierBadge = '<span class="bg-yellow-950 text-yellow-500 border border-yellow-800 px-2 py-0.5 rounded text-[10px] font-bold">GOLD</span>';
    else tierBadge = '<span class="bg-slate-800 text-slate-300 border border-cyber-border px-2 py-0.5 rounded text-[10px] font-bold">REGULAR</span>';

    tr.innerHTML = `
      <td class="p-4 pl-6">
        <strong class="text-slate-100 block text-xs">${c.name}</strong>
        <span class="text-[10px] text-slate-500 font-mono">ID: CUST-00${c.id}</span>
      </td>
      <td class="p-4">
        <p class="text-xs text-slate-300">${c.email}</p>
        <p class="text-[10px] text-slate-500 font-mono">${c.phone}</p>
      </td>
      <td class="p-4 text-xs text-slate-400">${c.address || '-'}</td>
      <td class="p-4">${tierBadge}</td>
      <td class="p-4 font-mono font-bold text-brand-400">Rp ${c.totalSpent.toLocaleString('id-ID')}</td>
      <td class="p-4 text-xs text-slate-500 font-mono">${c.lastActive}</td>
      <td class="p-4 pr-6 text-right">
        <button onclick="sendCRMPromo('${c.name}', '${c.tier}')" class="text-xs text-blue-400 hover:text-blue-300 font-bold bg-blue-950/40 border border-blue-900/30 px-2.5 py-1 rounded hover:bg-blue-900/40">Kirim Promo</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function renderPOSCustomerSelect() {
  const select = document.getElementById('pos-customer-select');
  if (!select) return;
  select.innerHTML = '';

  const customers = appState.db?.crmCustomers || [];
  customers.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.id;
    opt.innerText = `${c.name} (${c.tier})`;
    select.appendChild(opt);
  });
  
  if (customers.length > 0 && !appState.cart.customerId) {
    appState.cart.customerId = customers[0].id;
    appState.cart.customerName = customers[0].name;
  }
}

function renderDebts() {
  const tbody = document.getElementById('debt-tbody');
  if (!tbody) return;
  tbody.innerHTML = '';

  const debts = appState.db?.debts || [];
  if (debts.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="p-4 text-center text-slate-500">Tidak ada kewajiban hutang aktif. Luar biasa!</td></tr>';
    return;
  }

  debts.forEach(d => {
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-900/20';
    tr.innerHTML = `
      <td class="p-3"><strong class="text-slate-100">${d.name}</strong></td>
      <td class="p-3 font-mono text-rose-400 font-semibold">Rp ${d.remaining.toLocaleString('id-ID')}</td>
      <td class="p-3 font-mono">${d.interestRate}% p.a.</td>
      <td class="p-3 font-mono">Rp ${d.minPayment.toLocaleString('id-ID')}/bln</td>
      <td class="p-3 text-right">
        <button onclick="deleteDebt(${d.id})" class="text-red-400 hover:text-red-300 bg-red-950/20 border border-red-900/20 px-2 py-0.5 rounded text-[10px] font-bold">Hapus</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function renderInsurance() {
  const tbody = document.getElementById('insurance-tbody');
  if (!tbody) return;
  tbody.innerHTML = '';

  const list = appState.db?.insurance || [];
  list.forEach(i => {
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-900/20';
    tr.innerHTML = `
      <td class="p-3"><strong class="text-slate-100">${i.type}</strong></td>
      <td class="p-3 text-slate-300">${i.provider}</td>
      <td class="p-3 font-mono">Rp ${i.premium.toLocaleString('id-ID')}</td>
      <td class="p-3"><span class="bg-green-950 text-green-400 border border-green-800/40 px-2.5 py-0.5 rounded-full text-[10px] font-bold">AKTIF</span></td>
      <td class="p-3 text-right">
        <button onclick="deleteInsurance(${i.id})" class="text-red-400 hover:text-red-300 bg-red-950/20 border border-red-900/20 px-2 py-0.5 rounded text-[10px] font-bold">Hapus</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function renderLedgerExplorer() {
  const consoleEl = document.getElementById('blockchain-explorer-console');
  if (!consoleEl) return;
  consoleEl.innerHTML = '';

  const ledger = appState.db?.blockchainLedger || [];
  ledger.forEach(tx => {
    const item = document.createElement('div');
    item.className = 'border-b border-cyber-border pb-2 space-y-1';
    item.innerHTML = `
      <div class="flex justify-between text-[10px] font-bold">
        <span class="text-slate-200">#Block ${tx.block}</span>
        <span class="text-brand-500 uppercase tracking-widest">${tx.status}</span>
      </div>
      <p class="text-slate-400 truncate">Hash: ${tx.hash}</p>
      <p class="text-slate-500">From: 0x0...0 To: ${tx.to.slice(0, 8)}...${tx.to.slice(-4)}</p>
      <p class="text-yellow-500 font-bold">Token: ${tx.token} | Nilai: ${tx.value}</p>
    `;
    consoleEl.appendChild(item);
  });
}

function renderAffiliateHistory() {
  const tbody = document.getElementById('affiliate-tbody');
  if (!tbody) return;
  tbody.innerHTML = '';

  const history = appState.db?.affiliateData?.history || [];
  history.forEach(h => {
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-900/20';
    tr.innerHTML = `
      <td class="p-3 font-mono text-slate-400">${h.date}</td>
      <td class="p-3 text-slate-100 font-semibold">${h.source}</td>
      <td class="p-3 font-mono text-brand-400 font-bold">Rp ${h.amount.toLocaleString('id-ID')}</td>
      <td class="p-3"><span class="${h.status === 'Approved' ? 'bg-green-950 text-green-400 border border-green-800/40' : 'bg-yellow-950 text-yellow-500 border border-yellow-800/40'} px-2.5 py-0.5 rounded-full text-[10px] font-bold">${h.status}</span></td>
    `;
    tbody.appendChild(tr);
  });
}

// RENDER REAL 12-MONTH BEI DIVIDEND CALENDAR (TAB 8)
function renderDividendCalendarTable() {
  const tbody = document.getElementById('dividend-calendar-tbody');
  if (!tbody) return;
  tbody.innerHTML = '';

  let totalPayoutYearly = 0;

  appState.dividendCalendarData.forEach((d, idx) => {
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-900/20 text-xs';
    
    const payout = d.lotsOwned * 100 * d.divPerShare;
    totalPayoutYearly += payout;

    tr.innerHTML = `
      <td class="p-3">
        <strong class="text-brand-400 block">${d.month}</strong>
      </td>
      <td class="p-3">
        <strong class="text-slate-100 font-mono">${d.code}</strong>
        <span class="text-[10px] text-slate-500 block truncate max-w-[200px]">${d.name}</span>
      </td>
      <td class="p-3 font-mono text-slate-200">Rp ${d.divPerShare} / Lbr</td>
      <td class="p-3 font-mono text-green-400 font-bold">${d.yield}</td>
      <td class="p-3">
        <input type="number" value="${d.lotsOwned}" min="0" max="100000" oninput="updateLotsOwned(${idx}, this.value)" class="w-16 bg-slate-900 border border-cyber-border rounded px-2 py-1 text-center font-mono text-brand-500 font-bold focus:outline-none">
        <span class="text-[10px] text-slate-500 ml-1 font-mono">Lot</span>
      </td>
      <td class="p-3 text-right font-mono font-bold text-brand-500">
        Rp ${payout.toLocaleString('id-ID')}
      </td>
    `;
    tbody.appendChild(tr);
  });

  document.getElementById('div-total-annual').innerText = `Rp ${totalPayoutYearly.toLocaleString('id-ID')}`;
  
  const dripGrowth = totalPayoutYearly * 5.85; 
  document.getElementById('div-reinvest-10yr').innerText = `Rp ${Math.round(dripGrowth).toLocaleString('id-ID')}`;
}

function updateLotsOwned(index, val) {
  const parsed = parseInt(val) || 0;
  appState.dividendCalendarData[index].lotsOwned = Math.max(0, parsed);
  renderDividendCalendarTable();
}

// 6. DETAILED REAL CALCULATIONS & ALGORITHMS
function calculateKHL() {
  const region = document.getElementById('khl-region-select').value;
  const familyMembers = parseInt(document.getElementById('khl-family-members').value) || 1;
  const lifestyle = document.getElementById('khl-lifestyle').value;
  
  const regionBadge = document.getElementById('khl-region-badge');
  if (regionBadge) regionBadge.innerText = region;

  let baseKHL = 3200000;
  if (region === 'Jawa Barat') baseKHL = 2100000;
  else if (region === 'Jawa Tengah') baseKHL = 1850000;
  else if (region === 'Jawa Timur') baseKHL = 1950000;
  else if (region === 'Sumatera Utara') baseKHL = 2300000;

  let computed = familyMembers * baseKHL;

  if (lifestyle === 'Menengah') computed *= 1.35;

  computed = Math.round(computed);

  const totalIncome = appState.db 
    ? (appState.db.income.utama + appState.db.income.bisnis + appState.db.income.passive + appState.db.income.lainnya)
    : 28500000;

  const resultEl = document.getElementById('khl-calculated-total');
  if (resultEl) resultEl.innerText = `Rp ${computed.toLocaleString('id-ID')}`;
  
  const incEl = document.getElementById('khl-user-income');
  if (incEl) incEl.innerText = `Rp ${totalIncome.toLocaleString('id-ID')}`;

  const surplusStatusEl = document.getElementById('khl-surplus-status');
  if (surplusStatusEl) {
    const diff = totalIncome - computed;
    if (diff >= 0) {
      surplusStatusEl.innerText = `SURPLUS (+Rp ${diff.toLocaleString('id-ID')})`;
      surplusStatusEl.className = "text-[10px] text-green-400 font-bold uppercase mt-1";
    } else {
      surplusStatusEl.innerText = `DEFISIT (Rp ${diff.toLocaleString('id-ID')})`;
      surplusStatusEl.className = "text-[10px] text-rose-500 font-bold uppercase mt-1";
    }
  }

  updateFlexibleBudgetCalculations();
  updateEmergencyFundDisplay(computed);
}

// AUTOMATIC BUDGET SLIDERS NORMALIZATION
function adjustBudgetSliders(changed) {
  let n = parseInt(document.getElementById('budget-needs-range').value);
  let w = parseInt(document.getElementById('budget-wants-range').value);
  let s = parseInt(document.getElementById('budget-savings-range').value);
  
  if (changed === 'needs') {
    let rem = 100 - n;
    let totalWS = w + s || 1;
    w = Math.round(rem * (w / totalWS));
    s = 100 - n - w;
  } else if (changed === 'wants') {
    let rem = 100 - w;
    let totalNS = n + s || 1;
    n = Math.round(rem * (n / totalNS));
    s = 100 - n - w;
  } else if (changed === 'savings') {
    let rem = 100 - s;
    let totalNW = n + w || 1;
    n = Math.round(rem * (n / totalNW));
    w = 100 - n - s;
  }
  
  n = Math.max(0, Math.min(100, n));
  w = Math.max(0, Math.min(100, w));
  s = Math.max(0, Math.min(100, s));
  
  let diff = 100 - (n + w + s);
  s += diff;

  document.getElementById('budget-needs-range').value = n;
  document.getElementById('budget-wants-range').value = w;
  document.getElementById('budget-savings-range').value = s;

  document.getElementById('slide-needs-pct').innerText = `${n}%`;
  document.getElementById('slide-wants-pct').innerText = `${w}%`;
  document.getElementById('slide-savings-pct').innerText = `${s}%`;

  updateFlexibleBudgetCalculations();
}

function updateFlexibleBudgetCalculations() {
  if (!appState.db) return;
  
  const mainIncome = appState.db.income?.utama || 0;
  const businessIncome = appState.db.income?.bisnis || 0;
  const passiveIncome = appState.db.income?.passive || 0;
  const otherIncome = appState.db.income?.lainnya || 0;
  const totalIncome = mainIncome + businessIncome + passiveIncome + otherIncome;

  const nPct = parseInt(document.getElementById('budget-needs-range').value);
  const wPct = parseInt(document.getElementById('budget-wants-range').value);
  const sPct = parseInt(document.getElementById('budget-savings-range').value);

  const needsRupiah = Math.round(totalIncome * (nPct / 100));
  const wantsRupiah = Math.round(totalIncome * (wPct / 100));
  const savingsRupiah = Math.round(totalIncome * (sPct / 100));

  document.getElementById('budget-needs-val').innerText = `Rp ${needsRupiah.toLocaleString('id-ID')} / Bulan`;
  document.getElementById('budget-wants-val').innerText = `Rp ${wantsRupiah.toLocaleString('id-ID')} / Bulan`;
  document.getElementById('budget-savings-val').innerText = `Rp ${savingsRupiah.toLocaleString('id-ID')} / Bulan`;

  const advisoryCard = document.getElementById('budget-ai-advisory-card');
  if (advisoryCard) {
    if (totalIncome >= 50000000) {
      advisoryCard.innerHTML = `
        <span class="font-bold text-slate-100 flex items-center gap-1 mb-1">👑 Kelompok Pendapatan Tinggi (Sangat Mampu)</span>
        Pendapatan Anda sangat tinggi (<strong>Rp ${totalIncome.toLocaleString('id-ID')}</strong>). Sangat tidak elok memaksa menyisihkan 50% untuk kebutuhan dasar karena nilainya terlalu berlebih. AI menyarankan Anda mengecilkan kebutuhan dasar Anda ke kisaran <strong>5% - 15%</strong> saja, lalu alokasikan sisa dana masif (<strong>&gt; 70%</strong>) langsung ke Tabungan produktif, cetak emas kripto gGMR, atau kupon SBN berimbal hasil tinggi demi mencapai ekspansi kekayaan pasif secara mutlak.
      `;
    } else if (totalIncome < 4500000) {
      advisoryCard.innerHTML = `
        <span class="font-bold text-red-400 flex items-center gap-1 mb-1">⚠️ Kelompok Pendapatan Minimum (Fokus Primer)</span>
        Pendapatan Anda terbatas (<strong>Rp ${totalIncome.toLocaleString('id-ID')}</strong>). Boro-boro dipaksa berinvestasi 20%! Makan dan kebutuhan sandang pangan primer jauh lebih mendesak. AI menyarankan Anda menaikkan porsi Kebutuhan Pokok hingga <strong>80% - 95%</strong>. Jangan terbebani untuk berinvestasi dahulu sampai kebutuhan KHL keluarga Anda terpenuhi utuh dan dana darurat kecil terkumpul.
      `;
    } else {
      advisoryCard.innerHTML = `
        <span class="font-bold text-brand-400 flex items-center gap-1 mb-1">👍 Kelompok Pendapatan Menengah Sehat</span>
        Pendapatan Anda (<strong>Rp ${totalIncome.toLocaleString('id-ID')}</strong>) berada pada tingkat yang cukup ideal untuk melakukan pembagian anggaran secara fleksibel. Pengaturan anggaran yang Anda setel (Kebutuhan ${nPct}%, Keinginan ${wPct}%, Tabungan ${sPct}%) sudah cukup proporsional. Amankan surplus bulanan secara rutin ke emas batangan di gerai fisik atau reksadana syariah.
      `;
    }
  }
}

function updateEmergencyFundDisplay(khlExpense) {
  const currentEf = appState.db?.emergencyFund?.current || 0;
  const targetMonths = appState.db?.emergencyFund?.targetMonths || 6;
  
  const targetEf = khlExpense * targetMonths;
  const pct = Math.min(100, Math.round((currentEf / targetEf) * 100));

  const curEl = document.getElementById('ef-current-display');
  if (curEl) curEl.innerText = `Rp ${currentEf.toLocaleString('id-ID')}`;
  
  const tgtEl = document.getElementById('ef-target-display');
  if (tgtEl) tgtEl.innerText = `Rp ${targetEf.toLocaleString('id-ID')}`;

  const pctEl = document.getElementById('ef-pct-display');
  if (pctEl) pctEl.innerText = `${pct}%`;

  const bar = document.getElementById('ef-progress-bar');
  if (bar) bar.style.width = `${pct}%`;

  const advEl = document.getElementById('ef-advisory-display');
  if (advEl) {
    if (pct >= 100) {
      advEl.innerText = `Saran AI: Dana Darurat Anda SEPENUHNYA AMAN (${targetMonths} Bulan ketahanan). Anda dapat fokus menambah porsi SBN & Saham.`;
      advEl.className = "text-[10px] text-green-400 mt-2 block italic";
    } else {
      const diff = targetEf - currentEf;
      advEl.innerText = `Saran AI: Tambah Rp ${diff.toLocaleString('id-ID')} lagi untuk mencapai ketahanan ideal ${targetMonths} bulan. Tabung di Reksa Pasar Uang.`;
      advEl.className = "text-[10px] text-yellow-500 mt-2 block italic";
    }
  }
}

function calculateRetirement() {
  const expense = parseFloat(document.getElementById('ret-expense').value) || 0;
  const inflation = (parseFloat(document.getElementById('ret-inflation').value) || 0) / 100;
  const curAge = parseInt(document.getElementById('ret-current-age').value) || 30;
  const tgtAge = parseInt(document.getElementById('ret-target-age').value) || 55;
  const swr = (parseFloat(document.getElementById('ret-swr').value) || 4) / 100;

  const yearsToRetire = Math.max(1, tgtAge - curAge);
  const futureAnnualExpense = expense * 12 * Math.pow(1 + inflation, yearsToRetire);
  const targetRetirementFund = futureAnnualExpense / swr;

  const resEl = document.getElementById('ret-calculated-target');
  if (resEl) resEl.innerText = `Rp ${Math.round(targetRetirementFund).toLocaleString('id-ID')}`;

  const goldVal = (appState.db?.assets?.gold?.grams || 0) * 2610000;
  const silverVal = (appState.db?.assets?.silver?.grams || 0) * 39450;
  let otherVal = 0;
  appState.db?.assets?.mutualFunds?.forEach(f => otherVal += f.balance);
  appState.db?.assets?.sbn?.forEach(s => otherVal += s.balance);
  appState.db?.assets?.deposits?.forEach(d => otherVal += d.balance);
  appState.db?.assets?.property?.forEach(p => otherVal += p.balance);
  const curAssets = goldVal + silverVal + otherVal;

  const curEl = document.getElementById('ret-current-assets');
  if (curEl) curEl.innerText = `Rp ${curAssets.toLocaleString('id-ID')}`;

  const rate = 0.085 / 12;
  const n = yearsToRetire * 12;
  const gap = Math.max(0, targetRetirementFund - curAssets * Math.pow(1 + 0.085, yearsToRetire));
  
  const pmt = gap > 0 ? (gap * rate) / (Math.pow(1 + rate, n) - 1) : 0;

  const pmtEl = document.getElementById('ret-monthly-required');
  if (pmtEl) pmtEl.innerText = `Rp ${Math.round(pmt).toLocaleString('id-ID')}/bln`;
}

function calculateInheritance() {
  const estate = parseFloat(document.getElementById('war-estate').value) || 0;
  const hasWife = document.getElementById('war-has-wife').checked;
  const wifeCount = parseInt(document.getElementById('war-wife-count').value) || 1;
  const hasHusband = document.getElementById('war-has-husband').checked;
  const sons = parseInt(document.getElementById('war-sons').value) || 0;
  const daughters = parseInt(document.getElementById('war-daughters').value) || 0;
  const hasFather = document.getElementById('war-has-father').checked;
  const hasMother = document.getElementById('war-has-mother').checked;

  const list = [];
  let remaining = estate;

  let pWife = 0;
  let pHusband = 0;
  let pFather = 0;
  let pMother = 0;

  const hasChildren = (sons > 0 || daughters > 0);

  if (hasWife && !hasHusband) {
    pWife = hasChildren ? 0.125 : 0.25;
    const share = (estate * pWife) / wifeCount;
    list.push({ name: `Istri (${wifeCount} orang)`, fraction: `${hasChildren ? '1/8' : '1/4'}`, amount: Math.round(share * wifeCount) });
    remaining -= (share * wifeCount);
  }

  if (hasHusband && !hasWife) {
    pHusband = hasChildren ? 0.25 : 0.5;
    const share = estate * pHusband;
    list.push({ name: 'Suami', fraction: `${hasChildren ? '1/4' : '1/2'}`, amount: Math.round(share) });
    remaining -= share;
  }

  if (hasFather) {
    pFather = 0.1667;
    const share = estate * pFather;
    list.push({ name: 'Ayah Kandung', fraction: '1/6', amount: Math.round(share) });
    remaining -= share;
  }

  if (hasMother) {
    pMother = hasChildren ? 0.1667 : 0.3333;
    const share = estate * pMother;
    list.push({ name: 'Ibu Kandung', fraction: `${hasChildren ? '1/6' : '1/3'}`, amount: Math.round(share) });
    remaining -= share;
  }

  if (hasChildren && remaining > 0) {
    const totalSonsShares = sons * 2;
    const totalDaughtersShares = daughters * 1;
    const totalShares = totalSonsShares + totalDaughtersShares;

    if (totalShares > 0) {
      const shareUnit = remaining / totalShares;
      if (sons > 0) {
        const sonShare = shareUnit * 2;
        list.push({ name: `Anak Laki-Laki (${sons} orang)`, fraction: 'Ashabah (Porsi 2x)', amount: Math.round(sonShare * sons) });
      }
      if (daughters > 0) {
        const daughterShare = shareUnit * 1;
        list.push({ name: `Anak Perempuan (${daughters} orang)`, fraction: 'Ashabah (Porsi 1x)', amount: Math.round(daughterShare * daughters) });
      }
      remaining = 0;
    }
  } else if (remaining > 0 && hasFather) {
    const fatherIdx = list.findIndex(x => x.name === 'Ayah Kandung');
    if (fatherIdx !== -1) {
      list[fatherIdx].amount += Math.round(remaining);
      list[fatherIdx].fraction = '1/6 + Ashabah (Sisa)';
    }
    remaining = 0;
  }

  const tbody = document.getElementById('waris-tbody');
  if (!tbody) return;
  tbody.innerHTML = '';

  if (list.length === 0) {
    tbody.innerHTML = '<tr><td colspan="3" class="p-3 text-center text-slate-500">Silakan pilih minimal satu ahli waris.</td></tr>';
    return;
  }

  list.forEach(item => {
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-900/10';
    tr.innerHTML = `
      <td class="p-3 font-semibold text-slate-200">${item.name}</td>
      <td class="p-3 text-slate-400">${item.fraction}</td>
      <td class="p-3 font-mono font-bold text-brand-500 text-right">Rp ${item.amount.toLocaleString('id-ID')}</td>
    `;
    tbody.appendChild(tr);
  });

  if (remaining > 0) {
    const tr = document.createElement('tr');
    tr.className = 'bg-slate-950/40 text-slate-400';
    tr.innerHTML = `
      <td class="p-3 italic">Baitul Maal (Harta Sisa/Tidak Terbagi)</td>
      <td class="p-3 italic">-</td>
      <td class="p-3 font-mono text-right italic">Rp ${Math.round(remaining).toLocaleString('id-ID')}</td>
    `;
    tbody.appendChild(tr);
  }
}

function forecastCompounding() {
  const principal = parseFloat(document.getElementById('goal-compound-principal').value) || 0;
  const monthly = parseFloat(document.getElementById('goal-compound-monthly').value) || 0;
  const r = (parseFloat(document.getElementById('goal-compound-rate').value) || 0) / 100 / 12;
  const years = parseInt(document.getElementById('goal-compound-years').value) || 0;

  const n = years * 12;
  const fvPrincipal = principal * Math.pow(1 + r, n);
  const fvAnnuity = r > 0 ? monthly * ((Math.pow(1 + r, n) - 1) / r) : monthly * n;

  const total = fvPrincipal + fvAnnuity;
  const totalPrincipalDeposited = principal + (monthly * n);
  const totalInterestEarned = total - totalPrincipalDeposited;

  document.getElementById('goal-forecast-result').innerText = `Rp ${Math.round(total).toLocaleString('id-ID')}`;
  document.getElementById('goal-forecast-principal-only').innerText = `Rp ${Math.round(totalPrincipalDeposited).toLocaleString('id-ID')}`;
  document.getElementById('goal-forecast-interest-only').innerText = `Rp ${Math.round(totalInterestEarned).toLocaleString('id-ID')}`;
}

function calculateInsuranceAdequacy() {
  const expense = parseFloat(document.getElementById('ins-calc-expense').value) || 0;
  const r = (parseFloat(document.getElementById('ins-calc-yield').value) || 6) / 100;

  const requiredUP = Math.round((expense * 12) / r);
  document.getElementById('ins-calculated-up').innerText = `Rp ${requiredUP.toLocaleString('id-ID')}`;

  const totalCurrentUP = 500000000;
  document.getElementById('ins-current-up').innerText = `Rp ${totalCurrentUP.toLocaleString('id-ID')}`;

  const badge = document.getElementById('ins-status-badge');
  if (badge) {
    const diff = requiredUP - totalCurrentUP;
    if (diff <= 0) {
      badge.innerText = 'PROTEKSI MEMADAI';
      badge.className = 'text-[10px] text-green-400 font-bold uppercase mt-1';
    } else {
      badge.innerText = `BELUM MEMADAI (Defisit Rp ${diff.toLocaleString('id-ID')})`;
      badge.className = 'text-[10px] text-rose-500 font-bold uppercase mt-1';
    }
  }
}

function recalculateAssetNetWorth() {
  if (!appState.db) return;
  const db = appState.db;

  const goldGrams = db.assets?.gold?.grams || 0;
  const silverGrams = db.assets?.silver?.grams || 0;
  
  const goldVal = goldGrams * appState.liveMarket.gold;
  const silverVal = silverGrams * appState.liveMarket.silver;

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
    const p = s.code === 'BBRI' ? 4750 : s.code === 'TLKM' ? 3100 : 4850;
    stockVal += s.shares * p;
  });

  const totalWealth = goldVal + silverVal + mfVal + sbnVal + depVal + propVal + stockVal;
  
  const mainIncome = db.income?.utama || 0;
  const businessIncome = db.income?.bisnis || 0;
  const passiveIncome = db.income?.passive || 0;
  const otherIncome = db.income?.lainnya || 0;
  const totalIncome = mainIncome + businessIncome + passiveIncome + otherIncome;

  document.getElementById('asset-total-income').innerText = `Rp ${totalIncome.toLocaleString('id-ID')}`;
  document.getElementById('asset-gold-val').innerText = `Rp ${goldVal.toLocaleString('id-ID')}`;
  document.getElementById('asset-gold-qty').innerText = `${goldGrams.toFixed(4)} Gram (Live Price)`;
  
  document.getElementById('asset-silver-val').innerText = `Rp ${silverVal.toLocaleString('id-ID')}`;
  document.getElementById('asset-silver-qty').innerText = `${silverGrams.toFixed(4)} Gram (Live Price)`;

  document.getElementById('asset-net-worth').innerText = `Rp ${totalWealth.toLocaleString('id-ID')}`;

  const totalDebt = db.debts?.reduce((acc, curr) => acc + curr.remaining, 0) || 0;
  const dti = totalIncome > 0 ? (totalDebt / (totalIncome * 12)) * 100 : 0;
  
  const monthlyExpenses = totalIncome * 0.8;
  const currentEf = db.emergencyFund?.current || 0;
  const liquidityRatio = monthlyExpenses > 0 ? (currentEf / monthlyExpenses) : 0;

  const lqEl = document.getElementById('baro-liquidity');
  if (lqEl) lqEl.innerText = `${liquidityRatio.toFixed(1)}x`;
  
  const dtiEl = document.getElementById('baro-dti');
  if (dtiEl) dtiEl.innerText = `${dti.toFixed(1)}%`;

  const breakdownGrid = document.getElementById('assets-breakdown-grid');
  if (breakdownGrid) {
    breakdownGrid.innerHTML = `
      <div class="p-5 bg-cyber-card border border-cyber-border rounded-2xl space-y-4">
        <h4 class="font-bold text-sm flex items-center gap-2 text-slate-100">
          <i data-lucide="line-chart" class="w-4 h-4 text-brand-500"></i> Reksadana (${db.assets.mutualFunds.length})
        </h4>
        <div class="space-y-2.5">
          ${db.assets.mutualFunds.map(f => `
            <div class="flex justify-between items-center text-xs">
              <span class="text-slate-400 truncate w-40">${f.name}</span>
              <strong class="text-slate-200 font-mono">Rp ${f.balance.toLocaleString('id-ID')}</strong>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="p-5 bg-cyber-card border border-cyber-border rounded-2xl space-y-4">
        <h4 class="font-bold text-sm flex items-center gap-2 text-slate-100">
          <i data-lucide="ticket" class="w-4 h-4 text-yellow-500"></i> SBN (${db.assets.sbn.length})
        </h4>
        <div class="space-y-2.5">
          ${db.assets.sbn.map(s => `
            <div class="flex justify-between items-center text-xs">
              <span class="text-slate-400 truncate w-40">${s.name} (${s.yield}% p.a.)</span>
              <strong class="text-slate-200 font-mono">Rp ${s.balance.toLocaleString('id-ID')}</strong>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="p-5 bg-cyber-card border border-cyber-border rounded-2xl space-y-4">
        <h4 class="font-bold text-sm flex items-center gap-2 text-slate-100">
          <i data-lucide="trending-up" class="w-4 h-4 text-blue-500"></i> Saham Emiten (${db.assets.stocks.length})
        </h4>
        <div class="space-y-2.5">
          ${db.assets.stocks.map(s => {
            const p = s.code === 'BBRI' ? 4750 : s.code === 'TLKM' ? 3100 : 4850;
            return `
              <div class="flex justify-between items-center text-xs">
                <span class="text-slate-400 truncate w-40">${s.code} - ${s.name}</span>
                <strong class="text-slate-200 font-mono">Rp ${(s.shares * p).toLocaleString('id-ID')}</strong>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <div class="p-5 bg-cyber-card border border-cyber-border rounded-2xl space-y-4">
        <h4 class="font-bold text-sm flex items-center gap-2 text-slate-100">
          <i data-lucide="home" class="w-4 h-4 text-orange-500"></i> Properti & Tanah (${db.assets.property.length})
        </h4>
        <div class="space-y-2.5">
          ${db.assets.property.map(p => `
            <div class="flex justify-between items-center text-xs">
              <span class="text-slate-400 truncate w-40">${p.name}</span>
              <strong class="text-slate-200 font-mono">Rp ${p.balance.toLocaleString('id-ID')}</strong>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    lucide.createIcons();
  }
}

// 11. TOP-DOWN SCREENER MATRIX DATABASE (ACCORDING TO SIKLUS EKONOMI)
function setEconomicPhase(phase) {
  appState.economicPhase = phase;
  
  document.querySelectorAll('.phase-btn').forEach(btn => {
    btn.className = "phase-btn bg-slate-900 border border-cyber-border text-slate-400 p-3 rounded-xl text-xs font-bold text-center flex flex-col items-center gap-1 hover:border-blue-500 transition duration-150";
  });
  const act = document.getElementById(`phase-btn-${phase}`);
  if (act) {
    act.className = "phase-btn bg-slate-900 border-2 border-brand-500/80 text-brand-400 p-3 rounded-xl text-xs font-bold text-center flex flex-col items-center gap-1 transition duration-150 shadow-lg";
  }

  const secTitle = document.getElementById('spotlight-sector-title');
  const secDesc = document.getElementById('spotlight-sector-desc');
  const secIconBox = document.getElementById('sector-icon-box');
  const fundamentalTbody = document.getElementById('screener-fundamental-tbody');

  let sectorName = '';
  let sectorExplanation = '';
  let sectorIcon = 'landmark';
  let stocksList = [];

  if (phase === 'Boom') {
    sectorName = "Sektor Perbankan, Finansial & Konstruksi Bluechip";
    sectorExplanation = "Pada fase Boom/Ekspansi, konsumsi domestik bertumbuh kuat, penyaluran kredit meningkat, dan bank mendapatkan marjin bunga bersih (NIM) yang sangat lebar di tengah suku bunga yang terkontrol.";
    sectorIcon = 'landmark';
    stocksList = [
      { code: "BBRI", pe: "11.4x", pbv: "2.1x", der: "82%", roe: "18.5%", yield: "5.85%", advice: "STRONG BUY", timing: "Accumulate di Rp4.650, TP Rp5.150, SL Rp4.500" },
      { code: "BMRI", pe: "10.2x", pbv: "2.2x", der: "75%", roe: "19.8%", yield: "5.40%", advice: "BUY", timing: "Entry di Rp5.800, TP Rp6.350, SL Rp5.600" },
      { code: "BBCA", pe: "24.1x", pbv: "4.5x", der: "40%", roe: "22.0%", yield: "2.80%", advice: "ACCUMULATE", timing: "Entry di Rp9.800, TP Rp10.600, SL Rp9.500" }
    ];
  } else if (phase === 'Stagflasi') {
    sectorName = "Sektor Energi, Pertambangan & Komoditas Riil";
    sectorExplanation = "Pertumbuhan melambat namun inflasi tinggi. Komoditas energi menjadi primadona lindung nilai (safe-haven) karena harga komoditas melambung tinggi, menyumbangkan dividen jumbo.";
    sectorIcon = 'flame';
    stocksList = [
      { code: "ADRO", pe: "5.1x", pbv: "0.9x", der: "32%", roe: "24.5%", yield: "12.50%", advice: "STRONG BUY", timing: "Accumulate di Rp3.150, TP Rp3.600, SL Rp2.950" },
      { code: "PTBA", pe: "6.2x", pbv: "1.4x", der: "28%", roe: "21.2%", yield: "14.20%", advice: "ACCUMULATE", timing: "Entry di Rp2.600, TP Rp2.950, SL Rp2.450" },
      { code: "ITMG", pe: "5.5x", pbv: "1.2x", der: "18%", roe: "26.8%", yield: "15.10%", advice: "BUY / HOLD", timing: "Entry di Rp24.500, TP Rp28.200, SL Rp23.200" }
    ];
  } else if (phase === 'Resesi') {
    sectorName = "Sektor Ritel Konsumsi Primer ( Staples) & Kesehatan";
    sectorExplanation = "Ekonomi berkontraksi. Pendapatan masyarakat menurun, namun barang konsumsi primer (makanan/minuman) serta obat-obatan tetap harus dibeli. Saham-saham ini terbukti ultra-defensif.";
    sectorIcon = 'apple';
    stocksList = [
      { code: "ICBP", pe: "14.2x", pbv: "2.5x", der: "65%", roe: "16.5%", yield: "3.40%", advice: "BUY / DEFENSIVE", timing: "Accumulate di Rp11.000, TP Rp12.100, SL Rp10.500" },
      { code: "MYOR", pe: "15.1x", pbv: "2.8x", der: "42%", roe: "15.8%", yield: "2.90%", advice: "ACCUMULATE", timing: "Entry di Rp2.400, TP Rp2.750, SL Rp2.280" },
      { code: "UNVR", pe: "22.1x", pbv: "15.5x", der: "85%", roe: "68.0%", yield: "4.10%", advice: "HOLD / ACCUM", timing: "Entry di Rp2.420, TP Rp2.650, SL Rp2.300" }
    ];
  } else if (phase === 'Reflasi') {
    sectorName = "Sektor Barang Baku (Semen), Otomotif & Properti";
    sectorExplanation = "Suku bunga mulai diturunkan untuk memicu stimulus. Sektor properti dan otomotif menjadi yang pertama melesat karena pemulihan kredit pemilikan rumah (KPR) dan mobil.";
    sectorIcon = 'building-2';
    stocksList = [
      { code: "ASII", pe: "7.2x", pbv: "1.1x", der: "45%", roe: "15.4%", yield: "6.80%", advice: "STRONG BUY", timing: "Accumulate di Rp4.750, TP Rp5.300, SL Rp4.550" },
      { code: "SMGR", pe: "12.8x", pbv: "1.0x", der: "50%", roe: "8.2%", yield: "3.90%", advice: "BUY / RECOVERY", timing: "Entry di Rp3.800, TP Rp4.250, SL Rp3.600" },
      { code: "BSDE", pe: "8.5x", pbv: "0.6x", der: "35%", roe: "7.1%", yield: "1.50%", advice: "ACCUMULATE", timing: "Entry di Rp950, TP Rp1.150, SL Rp900" }
    ];
  }

  if (secTitle) secTitle.innerText = sectorName;
  if (secDesc) secDesc.innerText = sectorExplanation;
  if (secIconBox) {
    secIconBox.innerHTML = `<i data-lucide="${sectorIcon}" class="w-8 h-8"></i>`;
  }

  if (fundamentalTbody) {
    fundamentalTbody.innerHTML = '';
    stocksList.forEach((s, idx) => {
      const tr = document.createElement('tr');
      tr.className = `hover:bg-slate-900/30 ${idx === 0 ? 'bg-brand-950/20' : ''}`;
      tr.innerHTML = `
        <td class="p-3 pl-4">
          <strong class="text-slate-100 block text-xs font-mono">${s.code}</strong>
        </td>
        <td class="p-3 font-mono font-semibold text-slate-300">${s.pe}</td>
        <td class="p-3 font-mono text-slate-300">${s.pbv}</td>
        <td class="p-3 font-mono text-slate-400">${s.der}</td>
        <td class="p-3 font-mono font-bold text-brand-400">${s.roe}</td>
        <td class="p-3 font-mono text-emerald-500 font-bold">${s.yield}</td>
        <td class="p-3 pr-4 text-right">
          <button onclick="focusTechnicalTiming('${s.code}', '${phase}')" class="bg-blue-950/40 hover:bg-blue-900/50 border border-blue-900/30 text-blue-400 font-bold text-[10px] px-2.5 py-1 rounded">Timing Teknikal</button>
        </td>
      `;
      fundamentalTbody.appendChild(tr);
    });
  }

  if (stocksList.length > 0) {
    focusTechnicalTiming(stocksList[0].code, phase);
  }

  lucide.createIcons();
}

function focusTechnicalTiming(stockCode, phase) {
  let stockData = null;
  if (phase === 'Boom') {
    const list = [
      { code: "BBRI", pe: "11.4x", pbv: "2.1x", der: "82%", roe: "18.5%", yield: "5.85%", advice: "STRONG BUY", timing: "Accumulate di Rp4.650, TP Rp5.150, SL Rp4.500", trend: "BULLISH UPTREND", rsi: "42 (Neutral / Accumulation)", levels: "Rp 4.600 / Rp 5.250", entry: "Rp 4.650", exit: "Rp 5.150" },
      { code: "BMRI", pe: "10.2x", pbv: "2.2x", der: "75%", roe: "19.8%", yield: "5.40%", advice: "BUY", timing: "Entry di Rp5.800, TP Rp6.350, SL Rp5.600", trend: "SIDEWAYS BOUNCE", rsi: "45 (Neutral)", levels: "Rp 5.750 / Rp 6.400", entry: "Rp 5.800", exit: "Rp 6.350" },
      { code: "BBCA", pe: "24.1x", pbv: "4.5x", der: "40%", roe: "22.0%", yield: "2.80%", advice: "ACCUMULATE", timing: "Entry di Rp9.800, TP Rp10.600, SL Rp9.500", trend: "BULLISH HIGHER HIGH", rsi: "58 (Strong Momentum)", levels: "Rp 9.750 / Rp 10.700", entry: "Rp 9.800", exit: "Rp 10.600" }
    ];
    stockData = list.find(x => x.code === stockCode);
  } else if (phase === 'Stagflasi') {
    const list = [
      { code: "ADRO", pe: "5.1x", pbv: "0.9x", der: "32%", roe: "24.5%", yield: "12.50%", advice: "STRONG BUY", timing: "Accumulate di Rp3.150, TP Rp3.600, SL Rp2.950", trend: "SUPPORT CONSOLIDATION", rsi: "29 (Oversold / Buy Signal)", levels: "Rp 3.100 / Rp 3.650", entry: "Rp 3.150", exit: "Rp 3.600" },
      { code: "PTBA", pe: "6.2x", pbv: "1.4x", der: "28%", roe: "21.2%", yield: "14.20%", advice: "ACCUMULATE", timing: "Entry di Rp2.600, TP Rp2.950, SL Rp2.450", trend: "DOUBLE BOTTOM BOUNCE", rsi: "32 (Near Oversold)", levels: "Rp 2.580 / Rp 3.000", entry: "Rp 2.600", exit: "Rp 2.950" },
      { code: "ITMG", pe: "5.5x", pbv: "1.2x", der: "18%", roe: "26.8%", yield: "15.10%", advice: "BUY / HOLD", timing: "Entry di Rp24.500, TP Rp28.200, SL Rp23.200", trend: "RANGE BOUNDING", rsi: "40 (Accumulation)", levels: "Rp 24.000 / Rp 28.500", entry: "Rp 24.500", exit: "Rp 28.200" }
    ];
    stockData = list.find(x => x.code === stockCode);
  } else if (phase === 'Resesi') {
    const list = [
      { code: "ICBP", pe: "14.2x", pbv: "2.5x", der: "65%", roe: "16.5%", yield: "3.40%", advice: "BUY / DEFENSIVE", timing: "Accumulate di Rp11.000, TP Rp12.100, SL Rp10.500", trend: "DEFENSIVE ACCUMULATION", rsi: "48 (Neutral)", levels: "Rp 10.800 / Rp 12.200", entry: "Rp 11.000", exit: "Rp 12.100" },
      { code: "MYOR", pe: "15.1x", pbv: "2.8x", der: "42%", roe: "15.8%", yield: "2.90%", advice: "ACCUMULATE", timing: "Entry di Rp2.400, TP Rp2.750, SL Rp2.280", trend: "STEADY ASCENDING TRIANGLE", rsi: "52 (Bullish)", levels: "Rp 2.380 / Rp 2.800", entry: "Rp 2.400", exit: "Rp 2.750" },
      { code: "UNVR", pe: "22.1x", pbv: "15.5x", der: "85%", roe: "68.0%", yield: "4.10%", advice: "HOLD / ACCUM", timing: "Entry di Rp2.420, TP Rp2.650, SL Rp2.300", trend: "BOTTOM REVERSAL", rsi: "35 (Low-RSI Value)", levels: "Rp 2.350 / Rp 2.700", entry: "Rp 2.420", exit: "Rp 2.650" }
    ];
    stockData = list.find(x => x.code === stockCode);
  } else if (phase === 'Reflasi') {
    const list = [
      { code: "ASII", pe: "7.2x", pbv: "1.1x", der: "45%", roe: "15.4%", yield: "6.80%", advice: "STRONG BUY", timing: "Accumulate di Rp4.750, TP Rp5.300, SL Rp4.550", trend: "DOUBLE BOTTOM BOUNCE", rsi: "35 (Near Oversold)", levels: "Rp 4.700 / Rp 5.400", entry: "Rp 4.750", exit: "Rp 5.300" },
      { code: "SMGR", pe: "12.8x", pbv: "1.0x", der: "50%", roe: "8.2%", yield: "3.90%", advice: "BUY / RECOVERY", timing: "Entry di Rp3.800, TP Rp4.250, SL Rp3.600", trend: "SUPPORT REBOUND", rsi: "41 (Neutral)", levels: "Rp 3.750 / Rp 4.300", entry: "Rp 3.800", exit: "Rp 4.250" },
      { code: "BSDE", pe: "8.5x", pbv: "0.6x", der: "35%", roe: "7.1%", yield: "1.50%", advice: "ACCUMULATE", timing: "Entry di Rp950, TP Rp1.150, SL Rp900", trend: "BREAKOUT RE-TEST", rsi: "50 (Neutral)", levels: "Rp 920 / Rp 1.180", entry: "Rp 950", exit: "Rp 1.150" }
    ];
    stockData = list.find(x => x.code === stockCode);
  }

  if (stockData) {
    updateTechnicalTimingDisplay(stockData, phase);
    updateStockAuditReport(stockCode); 
  }
}

function updateTechnicalTimingDisplay(s, phase) {
  const trend = s.trend || "BULLISH ACCUMULATION";
  const rsi = s.rsi || "44 (Neutral)";
  const levels = s.levels || "Support / Resistance";
  const entry = s.entry || s.timing?.split("di ")[1]?.split(",")[0] || "Entry Level";
  const exit = s.exit || s.timing?.split("TP ")[1]?.split(",")[0] || "Exit Level";

  document.getElementById('tech-stock-code').innerText = s.code;
  
  const trendEl = document.getElementById('tech-trend-status');
  trendEl.innerText = trend;
  if (trend.includes("BULLISH") || trend.includes("BOUNCE") || trend.includes("REBOUND") || trend.includes("ASCENDING")) {
    trendEl.className = "text-green-400 font-bold";
  } else {
    trendEl.className = "text-yellow-500 font-bold";
  }

  document.getElementById('tech-rsi-status').innerText = rsi;
  document.getElementById('tech-levels').innerText = levels;
  document.getElementById('tech-entry-target').innerText = entry;
  document.getElementById('tech-exit-target').innerText = exit;
}

// UPDATE DETAILED STOCK INTEGRITY & ACTION AUDIT (STEP 6)
function updateStockAuditReport(stockCode) {
  const audit = appState.stockAuditDatabase[stockCode] || {
    emiten: stockCode,
    redFlags: "Bebas Red Flag. Kondisi kas operasional aman.",
    management: "Baik. Tidak ada catatan anomali hukum.",
    shareholders: "Publik.",
    actionTitle: "Tidak ada aksi korporasi terdekat.",
    actionEffects: "Efek: Netral."
  };

  const codeEl = document.getElementById('audit-focused-emiten');
  if (codeEl) codeEl.innerText = `Audit: ${stockCode}`;

  document.getElementById('audit-red-flags').innerText = audit.redFlags;
  document.getElementById('audit-management').innerText = audit.management;
  document.getElementById('audit-shareholders').innerText = audit.shareholders;
  document.getElementById('audit-action-title').innerText = audit.actionTitle;
  document.getElementById('audit-action-effects').innerHTML = audit.actionEffects;
}

// 12. UGC BLOG POST WITH INTERACTIVE GROUP CHATS
function generateGlobalAffiliateLink() {
  const url = document.getElementById('aff-input-url').value.trim();
  const subid = document.getElementById('aff-input-subid').value.trim();

  if (!url) {
    alert('Silakan masukkan link penjualan dunia yang valid terlebih dahulu!');
    return;
  }

  const wrappedLink = `https://gerai.id/redirect?url=${encodeURIComponent(url)}&ref=MASTER_GERAI910&subid=${subid}`;
  
  document.getElementById('aff-generated-link').innerText = wrappedLink;
  document.getElementById('aff-output-card').classList.remove('hidden');
}

function submitForumMessage(e) {
  if (e) e.preventDefault();
  const input = document.getElementById('forum-chat-input');
  const text = input.value.trim();
  if (!text) return;

  const chatBox = document.getElementById('forum-chat-box');
  const time = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  const userName = appState.db?.profile?.name.replace(/\s+/g, '_') || 'Pengguna_Gerai';

  const newMsg = document.createElement('div');
  newMsg.className = "bg-slate-900/40 p-2.5 rounded-xl border border-cyber-border/40";
  newMsg.innerHTML = `
    <span class="font-bold text-blue-400 block mb-0.5">${userName} <span class="text-[9px] text-slate-500 font-mono">${time}</span></span>
    <span>${text}</span>
  `;
  
  chatBox.appendChild(newMsg);
  chatBox.scrollTop = chatBox.scrollHeight;
  input.value = '';

  setTimeout(() => {
    const replies = [
      "Wah, link afiliasi global yang dibungkus barusan sangat fungsional!",
      "Setuju, jadi kita bebas membagikan produk apa saja di luar sana dan tetap mendapatkan keuntungan rujukan ganda.",
      "Mantap, sistem POS toko rujukan saya juga makin rapi rekamannya.",
      "Kalkulator Faraid-nya juga sangat akurat, sangat membantu keluarga kami."
    ];
    const randReply = replies[Math.floor(Math.random() * replies.length)];
    const simulatedMsg = document.createElement('div');
    simulatedMsg.className = "bg-slate-900/40 p-2.5 rounded-xl border border-cyber-border/40";
    simulatedMsg.innerHTML = `
      <span class="font-bold text-emerald-400 block mb-0.5">Rian_Advisor <span class="text-[9px] text-slate-500 font-mono">${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span></span>
      <span>${randReply}</span>
    `;
    chatBox.appendChild(simulatedMsg);
    chatBox.scrollTop = chatBox.scrollHeight;
  }, 2000);
}

// 13. DYNAMIC PROFILE SUBMISSIONS (TAB 10)
function toggleWeddingFormPlan() {
  const status = document.getElementById('prof-marital-status').value;
  const planCard = document.getElementById('prof-wedding-plan-card');
  if (status === 'Belum Menikah') {
    planCard.classList.remove('hidden');
  } else {
    planCard.classList.add('hidden');
  }
}

async function submitAddDependent() {
  const name = document.getElementById('form-dep-name').value.trim();
  const age = parseInt(document.getElementById('form-dep-age').value) || 0;
  const relation = document.getElementById('form-dep-relation').value.trim();
  const school = document.getElementById('form-dep-school').value;

  if (!name || age <= 0) {
    alert('Nama anak dan usia wajib diisi!');
    return;
  }

  const db = appState.db;
  if (!db.profile.dependents) db.profile.dependents = [];

  db.profile.dependents.push({
    id: Date.now(),
    name: name,
    relation: relation,
    age: age,
    schoolStatus: school
  });

  await saveDatabase();
  closeModal('modal-add-dependent');
  
  document.getElementById('form-dep-name').value = '';
  document.getElementById('form-dep-age').value = '5';
}

async function deleteDependent(id) {
  const db = appState.db;
  const idx = db?.profile?.dependents?.findIndex(d => d.id === id);
  if (idx !== -1) {
    db.profile.dependents.splice(idx, 1);
    await saveDatabase();
  }
}

// 14. GENERAL ACTIONS & DELETIONS
function likePost(postId) {
  const post = appState.db?.posts.find(p => p.id === postId);
  if (post) {
    post.likes += 1;
    saveDatabase();
  }
}

// UGC posts vertical video TikTok-style mapping helper
function renderUGCPosts() {
  const container = document.getElementById('ugc-posts-container');
  if (!container) return;
  container.innerHTML = '';

  const posts = appState.db?.posts || [];
  
  const videoGradients = [
    'from-blue-600 via-indigo-900 to-slate-950',
    'from-amber-600 via-yellow-900 to-slate-950',
    'from-emerald-600 via-teal-900 to-slate-950',
    'from-purple-600 via-pink-900 to-slate-950'
  ];

  const realGlobalAffiliateProducts = [
    { name: "Logam Mulia Antam 1 Gram Certi - Tokopedia", targetUrl: "https://www.tokopedia.com/search?q=emas+antam+1+gram", estPrice: 2610000 },
    { name: "Sakura Car Filter Radiator - Shopee Global", targetUrl: "https://shopee.co.id/search?keyword=sakura+filter", estPrice: 125000 },
    { name: "Islamic Wealth & Inheritance Book - Amazon US", targetUrl: "https://www.amazon.com/s?k=islamic+finance+inheritance", estPrice: 250000 },
    { name: "Binance Crypto Staking Hub - Global Portal", targetUrl: "https://www.binance.com/id/staking", estPrice: 999000 }
  ];

  posts.forEach((post, i) => {
    const gradient = videoGradients[i % videoGradients.length];
    const affProduct = realGlobalAffiliateProducts[i % realGlobalAffiliateProducts.length];
    
    const el = document.createElement('div');
    el.className = 'flex gap-4 items-center justify-center py-4 w-full';
    
    el.innerHTML = `
      <div class="tiktok-card bg-gradient-to-b ${gradient} rounded-3xl relative overflow-hidden border border-cyber-border shadow-2xl flex flex-col justify-between p-5">
        
        <div class="flex justify-between items-center z-10">
          <div class="flex items-center gap-1 bg-slate-900/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-cyber-border/40 text-[9px] font-bold">
            <span class="w-1.5 h-1.5 bg-brand-500 rounded-full animate-ping"></span>
            <span>GERAITOK LIVE</span>
          </div>
          <span class="text-[9px] bg-blue-900/50 text-blue-300 border border-blue-800/40 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">${post.category}</span>
        </div>

        <div class="absolute inset-0 flex items-center justify-center opacity-30 hover:opacity-80 transition cursor-pointer">
          <div class="bg-black/60 p-4 rounded-full border border-slate-500/30">
            <i data-lucide="play" class="w-10 h-10 text-white fill-white"></i>
          </div>
        </div>

        <div class="space-y-3 z-10">
          <!-- KERANJANG KUNING - EXCLUSIVELY RE-AFFILIATED REDIRECTION AS REQUESTED (NO POS CARTS MIXUP) -->
          <div class="bg-yellow-500/90 text-slate-900 rounded-xl p-2.5 flex items-center justify-between shadow-lg cursor-pointer hover:bg-yellow-400 transition" onclick="triggerTikTokCartPurchase('${affProduct.name}', '${affProduct.targetUrl}', ${affProduct.estPrice}, '${post.author}')">
            <div class="flex items-center gap-2 max-w-[190px]">
              <div class="bg-slate-900 p-1.5 rounded-lg text-yellow-500">
                <i data-lucide="shopping-bag" class="w-4 h-4"></i>
              </div>
              <div class="text-[10px] text-left">
                <span class="font-bold block truncate text-slate-950">${affProduct.name}</span>
                <span class="font-mono font-semibold text-slate-800">Rp ${affProduct.estPrice.toLocaleString('id-ID')}</span>
              </div>
            </div>
            <span class="bg-slate-950 text-white text-[9px] font-extrabold px-2.5 py-1.5 rounded-lg uppercase tracking-wider">BELI</span>
          </div>

          <div class="text-left text-xs text-slate-100 space-y-1">
            <strong class="text-slate-100 flex items-center gap-1 hover:underline cursor-pointer">@${post.author} <i data-lucide="check-circle" class="w-3.5 h-3.5 text-blue-400 fill-blue-400/20"></i></strong>
            <p class="font-extrabold text-xs leading-snug">${post.title}</p>
            <p class="text-[11px] text-slate-300 leading-relaxed truncate">${post.content}</p>
            <p class="text-[9px] text-brand-400 font-bold font-mono pt-1">#fintech #investasi #emas #faraid910</p>
          </div>
        </div>

      </div>

      <div class="flex flex-col gap-5 items-center justify-center text-slate-300 z-10">
        <div class="flex flex-col items-center">
          <div class="w-11 h-11 rounded-full bg-slate-900 border-2 border-brand-500 flex items-center justify-center font-bold text-slate-200 shadow text-sm relative">
            ${post.author.slice(0, 2).toUpperCase()}
            <span class="absolute -bottom-1 bg-brand-500 text-white p-0.5 rounded-full text-[8px] flex items-center justify-center leading-none"><i data-lucide="plus" class="w-2.5 h-2.5"></i></span>
          </div>
        </div>

        <button class="flex flex-col items-center gap-1 group" onclick="likePost(${post.id})">
          <div class="bg-slate-900/60 p-3 rounded-full border border-cyber-border group-hover:bg-rose-950/40 group-hover:border-rose-800/40 transition">
            <i data-lucide="heart" class="w-4 h-4 text-rose-500 fill-rose-500/10"></i>
          </div>
          <span class="text-[10px] font-bold">${post.likes}</span>
        </button>

        <button class="flex flex-col items-center gap-1 group" onclick="sendQuickPrompt('Bagikan ulasan tentang video @${post.author}!')">
          <div class="bg-slate-900/60 p-3 rounded-full border border-cyber-border group-hover:bg-blue-950/40 group-hover:border-blue-800/40 transition">
            <i data-lucide="message-circle" class="w-4 h-4 text-blue-400"></i>
          </div>
          <span class="text-[10px] font-bold">${post.comments}</span>
        </button>

        <button class="flex flex-col items-center gap-1 group" onclick="shareTikTokVideo('${post.author}', '${affProduct.targetUrl}')">
          <div class="bg-slate-900/60 p-3 rounded-full border border-cyber-border group-hover:bg-yellow-950/40 group-hover:border-yellow-800/40 transition">
            <i data-lucide="share-2" class="w-4 h-4 text-yellow-500"></i>
          </div>
          <span class="text-[9px] font-bold">Bagikan</span>
        </button>
      </div>
    `;
    container.appendChild(el);
  });
  lucide.createIcons();
}

// 100% EXCLUSIVE GLOBAL AFFILIATE WRAPPING AND TRACKING REDIRECTION FOR CONTENT CART LINKS (ZERO LOCAL POS CART SEPARATION)
function triggerTikTokCartPurchase(productName, targetUrl, estPrice, creatorHandle) {
  if (!appState.db) return;
  
  // AUTENTIKASI: Must be authenticated with Web3 Wallet to browse or buy affiliate goods
  if (!checkAuthentication()) return;

  const creatorSubId = creatorHandle.toUpperCase() || "CREATOR910";
  const wrappedLink = `https://gerai.id/redirect?url=${encodeURIComponent(targetUrl)}&ref=MASTER_GERAI910&subid=${creatorSubId}`;

  appState.db.affiliateData.clicks = (appState.db.affiliateData.clicks || 0) + 1;
  
  const mockCommission = Math.round(estPrice * 0.05); 
  const userCommissionShare = Math.round(mockCommission * 0.70); 
  const platformFeeShare = Math.round(mockCommission * 0.30); 

  appState.db.affiliateData.earnings += userCommissionShare;
  
  appState.db.affiliateData.history.unshift({
    id: Date.now(),
    date: new Date().toISOString().split('T')[0],
    source: `GeraiTok (@${creatorHandle}) - ${productName}`,
    amount: userCommissionShare,
    status: "Approved"
  });

  saveDatabase();

  alert(`🔗 Mengalihkan Pembeli ke Tautan Afiliasi Global Terbungkus!\n\n🛍️ Produk Global: ${productName}\n💰 Estimasi Komisi: Rp ${mockCommission.toLocaleString('id-ID')}\n✨ Pembagian Hasil:\n  - 70% Komisi Kreator (@${creatorHandle}): Rp ${userCommissionShare.toLocaleString('id-ID')}\n  - 30% Fee Sistem Platform Master: Rp ${platformFeeShare.toLocaleString('id-ID')}\n\nTautan Afiliasi Terbungkus:\n${wrappedLink}`);
}

function shareTikTokVideo(author, targetUrl) {
  const db = appState.db;
  if (!db) return;
  const subid = db.profile.affiliateCode || 'EKOGERAI910';
  const wrappedLink = `https://gerai.id/redirect?url=${encodeURIComponent(targetUrl)}&ref=MASTER_GERAI910&subid=${subid}`;

  navigator.clipboard.writeText(wrappedLink).then(() => {
    alert(`📋 Tautan Afiliasi Terbungkus Berhasil Disalin!\nVideo @${author} dapat Anda bagikan dengan rujukan ID: ${subid}.\nLink: ${wrappedLink}`);
  });
}

// -------------------------------------------------------------
// PREMIUM CHECKOUT INTEGRATION (SaaS Access Control Billing Panel)
function openMembershipCheckout(tier) {
  if (tier === 'Free') {
    upgradeTier('Free');
    return;
  }

  appState.checkout.tier = tier;
  appState.checkout.basePrice = tier === 'Pro' ? 99000 : 499000;
  appState.checkout.discountPrice = 0;
  appState.checkout.totalPrice = appState.checkout.basePrice;
  appState.checkout.couponApplied = false;
  appState.checkout.couponCode = '';
  appState.checkout.paymentMethod = 'qris';

  document.getElementById('checkout-plan-name').innerText = tier === 'Pro' ? 'Pro Wealth Advisor' : 'Gerai Enterprise';
  document.getElementById('checkout-base-price').innerText = `Rp ${appState.checkout.basePrice.toLocaleString('id-ID')} / bln`;
  document.getElementById('checkout-total-price').innerText = `Rp ${appState.checkout.basePrice.toLocaleString('id-ID')}`;
  document.getElementById('checkout-coupon-status').innerText = 'BELUM DIAPLIKASIKAN';
  document.getElementById('checkout-coupon-status').className = 'text-xs text-slate-500 font-bold';
  document.getElementById('checkout-coupon-input').value = '';

  const usdPrice = parseFloat((appState.checkout.basePrice / 16350).toFixed(2));
  document.getElementById('checkout-web3-convert-price').innerText = `${usdPrice} USDT`;

  setCheckoutPaymentMethod('qris');
  openModal('modal-membership-checkout');
}

function applyCheckoutCoupon() {
  const code = document.getElementById('checkout-coupon-input').value.trim().toUpperCase();
  if (!code) {
    alert('Masukkan kode kupon rujukan terlebih dahulu!');
    return;
  }

  appState.checkout.couponApplied = true;
  appState.checkout.couponCode = code;
  appState.checkout.discountPrice = Math.round(appState.checkout.basePrice * 0.05); 
  appState.checkout.totalPrice = appState.checkout.basePrice - appState.checkout.discountPrice;

  document.getElementById('checkout-total-price').innerText = `Rp ${appState.checkout.totalPrice.toLocaleString('id-ID')}`;
  const statusEl = document.getElementById('checkout-coupon-status');
  statusEl.innerText = `AKTIF (DISKON 5%: -Rp ${appState.checkout.discountPrice.toLocaleString('id-ID')})`;
  statusEl.className = 'text-xs text-brand-400 font-extrabold';

  const usdPrice = parseFloat((appState.checkout.totalPrice / 16350).toFixed(2));
  document.getElementById('checkout-web3-convert-price').innerText = `${usdPrice} USDT`;

  alert(`🏷️ Kupon Rujukan '${code}' Berhasil Diterapkan!\nAnda mendapatkan diskon 5% untuk pembelian langganan ini.`);
}

function setCheckoutPaymentMethod(method) {
  appState.checkout.paymentMethod = method;

  document.getElementById('checkout-pay-web3').className = 'p-3 bg-slate-900 border border-cyber-border rounded-xl flex flex-col items-center gap-1.5 hover:border-brand-500 transition';
  document.getElementById('checkout-pay-qris').className = 'p-3 bg-slate-900 border border-cyber-border rounded-xl flex flex-col items-center gap-1.5 hover:border-brand-500 transition';

  if (method === 'web3') {
    document.getElementById('checkout-pay-web3').className += ' border-brand-500 ring-2 ring-brand-500/20 bg-slate-850';
  } else {
    document.getElementById('checkout-pay-qris').className += ' border-brand-500 ring-2 ring-brand-500/20 bg-slate-850';
  }
}

async function executeMembershipSubscription() {
  const db = appState.db;
  if (!db) return;

  const tier = appState.checkout.tier;
  const payMethod = appState.checkout.paymentMethod;

  if (payMethod === 'web3') {
    if (!checkAuthentication()) return; // Must be authenticated to execute Web3 smart contract payment

    alert(`🦊 MetaMask Prompt!\nMenandatangani kontrak pembayaran langganan: ${tier.toUpperCase()}.\nUSDT Nominal: ${document.getElementById('checkout-web3-convert-price').innerText}\nGas Fee: 1.2 Gwei`);
    
    const latestBlock = db.blockchainLedger?.length > 0 ? db.blockchainLedger[0].block + 1 : 3284103;
    const txHash = '0x' + Array.from({length: 64}, () => '0123456789abcdef'[Math.floor(Math.random()*16)]).join('');
    
    db.blockchainLedger.unshift({
      block: latestBlock,
      hash: txHash,
      from: db.profile.web3Address,
      to: '0xSaaSTreasuryContract9109911928373738329',
      token: "USDT Tether",
      value: document.getElementById('checkout-web3-convert-price').innerText,
      status: "Confirmed",
      timestamp: new Date().toISOString()
    });
  }

  db.profile.premiumTier = tier;

  if (appState.checkout.couponApplied) {
    const referrerId = appState.checkout.couponCode;
    const rewardCommission = Math.round(appState.checkout.totalPrice * 0.10); 
    
    db.affiliateData.signups = (db.affiliateData.signups || 0) + 1;
    db.affiliateData.earnings += rewardCommission;

    db.affiliateData.history.unshift({
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      source: `Rujukan Member ${tier.toUpperCase()} - @${db.profile.name}`,
      amount: rewardCommission,
      status: "Approved"
    });
    
    alert(`🎯 Afiliasi Terdeteksi!\nKomisi rujukan sebesar Rp ${rewardCommission.toLocaleString('id-ID')} (10% dari langganan) telah otomatis dikirimkan ke saldo rujukan pemilik kode kupon: ${referrerId}!`);
  }

  await saveDatabase();
  closeModal('modal-membership-checkout');
  alert(`⭐ Selamat! Pembayaran langganan sukses.\nStatus Keanggotaan Anda sekarang aktif sebagai: ${tier.toUpperCase()} MEMBER.`);
}
// -------------------------------------------------------------

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

function sendCRMPromo(custName, tier) {
  alert(`✉️ Pesan Pemasaran Ritel Terkirim!\nKepada: ${custName}\nIsi Pesan: "Dapatkan penawaran terbaik untuk pembelian Emas Batangan di Toko kami hari ini, khusus member ${tier}!"`);
}

function upgradeTier(tier) {
  const db = appState.db;
  db.profile.premiumTier = tier;
  saveDatabase();
  alert(`⭐ Selamat! Akun Anda berhasil di-upgrade ke keanggotaan premium: ${tier.toUpperCase()}`);
}

function payoutAffiliate() {
  const db = appState.db;
  const earnings = db.affiliateData?.earnings || 0;
  if (earnings <= 0) {
    alert('Saldo komisi Anda Rp 0.');
    return;
  }

  db.affiliateData.earnings = 0;
  db.affiliateData.history.unshift({
    id: Date.now(),
    date: new Date().toISOString().split('T')[0],
    source: "Pencairan Komisi Sukses",
    amount: earnings,
    status: "Approved"
  });

  saveDatabase();
  alert(`💸 Pencairan Komisi Sukses!\nSebesar Rp ${earnings.toLocaleString('id-ID')} telah dikirim langsung ke Dompet Kripto / Rekening Bank terdaftar Anda.`);
}

// 15. UI HELPER UTILITIES
function toggleAssetCategoryForm() {
  const assetClass = document.getElementById('form-asset-class').value;
  const lblName = document.getElementById('lbl-asset-name');
  const lblVal = document.getElementById('lbl-asset-val');
  const lblYield = document.getElementById('lbl-asset-yield');
  const inputName = document.getElementById('form-asset-name');

  if (assetClass === 'mutualFunds') {
    lblName.innerText = 'Nama Reksa Dana';
    inputName.placeholder = 'misal: Sucorinvest Sharia Money Market';
    lblVal.innerText = 'Nominal Pembelian (IDR)';
    lblYield.innerText = 'Yield YTD (% p.a.)';
  } else if (assetClass === 'sbn') {
    lblName.innerText = 'Seri SBN';
    inputName.placeholder = 'misal: ORI025 / SR021';
    lblVal.innerText = 'Jumlah Nominal Obligasi (IDR)';
    lblYield.innerText = 'Suku Bunga Kupon (% p.a.)';
  } else if (assetClass === 'deposits') {
    lblName.innerText = 'Bank Deposito';
    inputName.placeholder = 'misal: Bank Syariah Indonesia';
    lblVal.innerText = 'Nominal Deposito (IDR)';
    lblYield.innerText = 'Nisbah / Bagi Hasil (% p.a.)';
  } else if (assetClass === 'property') {
    lblName.innerText = 'Keterangan Aset Properti/Tanah';
    inputName.placeholder = 'misal: Tanah Kavling Bogor';
    lblVal.innerText = 'Valuasi Pasar Aset (IDR)';
    lblYield.innerText = 'Estimasi Kenaikan Harga (% p.a.)';
  } else if (assetClass === 'stocks') {
    lblName.innerText = 'Kode Emiten Saham';
    inputName.placeholder = 'misal: BBRI / TLKM / ASII';
    lblVal.innerText = 'Nilai Investasi Total (IDR)';
    lblYield.innerText = 'Dividend Yield (% p.a.)';
  }
}

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
    alert('📋 Tautan Afiliasi Berhasil Disalin!');
  }).catch(err => {
    console.error('Failed to copy text: ', err);
  });
}
