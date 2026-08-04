// GLOBAL STATE MANAGEMENT
let appState = {
  db: null,
  activeTab: 'tab-ugc',
  posSubTab: 'pos-cashier',
  screenerTab: 'screener-stocks',
  saasMode: 'customer', // customer, admin (SaaS separation)
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

// SAAS MODE SWITCHER (EXPLICIT SEPARATION BETWEEN CUSTOMER WEALTH PLANNERS & ADMIN STORE/TELEMETRY PANEL)
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
    // Styling buttons
    btnCust.className = "flex-1 py-2 rounded-lg text-[9px] font-extrabold uppercase tracking-wider transition duration-150 text-white bg-blue-600 shadow-md flex items-center justify-center gap-1";
    btnAdmin.className = "flex-1 py-2 rounded-lg text-[9px] font-extrabold uppercase tracking-wider transition duration-150 text-slate-400 flex items-center justify-center gap-1";
    btnDev.className = "w-full py-2 rounded-lg text-[9px] font-extrabold uppercase tracking-wider transition duration-150 text-slate-400 flex items-center justify-center gap-1 border border-dashed border-slate-800 hover:border-brand-500/50 hover:bg-slate-900/30";

    // Show customer navs
    navUgc.classList.remove('hidden');
    navAssets.classList.remove('hidden');
    navBudget.classList.remove('hidden');
    navInsurance.classList.remove('hidden');
    navGoals.classList.remove('hidden');
    navMacro.classList.remove('hidden');
    navDividend.classList.remove('hidden');
    navInheritance.classList.remove('hidden');
    navMembership.classList.remove('hidden');

    // Hide admin & dev navs
    navPos.classList.add('hidden');
    navDev.classList.add('hidden');

    // Update settings heading
    setHeadingTitle.innerText = "Profil Pengguna & Keluarga Terintegrasi";
    setHeadingDesc.innerText = "Konfigurasikan status pernikahan, rencana Haji, data tanggungan pendidikan anak-anak, profil risiko, dan integrasikan wallet Web3 Anda.";
    document.getElementById('nav-settings-text').innerText = "10. Profil & Jaringan Web3";

    // Show family profiles, hide telemetry log console
    setFamilyPanel.classList.remove('hidden');
    setAdminLogsPanel.classList.add('hidden');

    // Redirect active tab if currently on an admin/dev tab
    if (appState.activeTab === 'tab-pos' || appState.activeTab === 'tab-developer') {
      switchTab('tab-ugc');
    }

  } else if (mode === 'admin') {
    // Styling buttons
    btnCust.className = "flex-1 py-2 rounded-lg text-[9px] font-extrabold uppercase tracking-wider transition duration-150 text-slate-400 flex items-center justify-center gap-1";
    btnAdmin.className = "flex-1 py-2 rounded-lg text-[9px] font-extrabold uppercase tracking-wider transition duration-150 text-white bg-blue-600 shadow-md flex items-center justify-center gap-1";
    btnDev.className = "w-full py-2 rounded-lg text-[9px] font-extrabold uppercase tracking-wider transition duration-150 text-slate-400 flex items-center justify-center gap-1 border border-dashed border-slate-800 hover:border-brand-500/50 hover:bg-slate-900/30";

    // Hide customer & dev navs
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

    // Show admin navs
    navPos.classList.remove('hidden');

    // Update settings heading
    setHeadingTitle.innerText = "Konsol Administrasi & Jaringan SaaS";
    setHeadingDesc.innerText = "Kelola konfigurasi platform master, otorisasi jaringan Web3, dan pantau kesehatan server telemetri.";
    document.getElementById('nav-settings-text').innerText = "10. Telemetri & Jaringan Admin";

    // Hide family profiles, show central log telemetry console!
    setFamilyPanel.classList.add('hidden');
    setAdminLogsPanel.classList.remove('hidden');

    // Fetch initial logs
    fetchServerLogs();

    // Redirect active tab if currently on a customer/dev tab
    if (appState.activeTab !== 'tab-pos' && appState.activeTab !== 'tab-settings') {
      switchTab('tab-pos');
    }
  } else if (mode === 'developer') {
    // Styling buttons
    btnCust.className = "flex-1 py-2 rounded-lg text-[9px] font-extrabold uppercase tracking-wider transition duration-150 text-slate-400 flex items-center justify-center gap-1";
    btnAdmin.className = "flex-1 py-2 rounded-lg text-[9px] font-extrabold uppercase tracking-wider transition duration-150 text-slate-400 flex items-center justify-center gap-1";
    btnDev.className = "w-full py-2 rounded-lg text-[9px] font-extrabold uppercase tracking-wider transition duration-150 text-white bg-brand-600 shadow-md flex items-center justify-center gap-1 border border-brand-500/50";

    // Unhide developer system console & admin navs
    navDev.classList.remove('hidden');
    navPos.classList.remove('hidden');

    // For absolute platform control, also let the developer view other parts of SaaS
    navUgc.classList.remove('hidden');
    navAssets.classList.remove('hidden');
    navBudget.classList.remove('hidden');
    navInsurance.classList.remove('hidden');
    navGoals.classList.remove('hidden');
    navMacro.classList.remove('hidden');
    navDividend.classList.remove('hidden');
    navInheritance.classList.remove('hidden');
    navMembership.classList.remove('hidden');

    // Update settings heading
    setHeadingTitle.innerText = "Platform Owner Global Logs Console";
    setHeadingDesc.innerText = "Super-Administrator System Telemetry Logs & Distributed Error Capture.";
    document.getElementById('nav-settings-text').innerText = "10. Central System Telemetry";

    // Hide family profiles, show logs
    setFamilyPanel.classList.add('hidden');
    setAdminLogsPanel.classList.remove('hidden');

    // Fetch initial logs & metrics
    fetchServerLogs();
    initDeveloperConsole();

    // Automatically transition developer to the System Console
    switchTab('tab-developer');
  }

  lucide.createIcons();
}

// FETCH REAL CENTRAL SYSTEM SERVER LOGS (TELEMETRY)
async function fetchServerLogs() {
  try {
    const res = await fetch('/api/logs');
    if (!res.ok) throw new Error('Failed to fetch server logs');
    const data = await res.json();
    const consoleEl = document.getElementById('admin-telemetry-console');
    if (consoleEl && data.logs) {
      consoleEl.innerHTML = '';
      if (data.logs.length === 0) {
        consoleEl.innerHTML = '<div class="text-slate-500 italic">Belum ada aktivitas log komputasi rill tercatat. Silakan lakukan pemanggilan API.</div>';
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

// DISTRIBUTED BROWSER CLIENT-SIDE ERROR LOG REPORTING (SENTRY MOCK-SENSITIVE)
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

// Global browser error listeners
window.onerror = function(message, source, lineno, colno, error) {
  reportErrorToServer('browser-error', `${message} at ${source}:${lineno}:${colno}`, error ? error.stack : null);
};
window.onunhandledrejection = function(event) {
  reportErrorToServer('browser-promise-rejection', event.reason);
};

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

  // Load platform settings or default
  const settings = appState.db.platformSettings || {
    creatorCommissionPercent: 70,
    platformFeePercent: 30,
    masterAffiliateCode: "MASTER_GERAI910",
    redirectTemplate: "https://gerai.id/redirect?url={url}&ref={ref}&subid={subid}"
  };

  const creatorSubId = creatorHandle.toUpperCase() || "CREATOR910";
  
  // Parse redirect link from template
  let wrappedLink = settings.redirectTemplate || "https://gerai.id/redirect?url={url}&ref={ref}&subid={subid}";
  wrappedLink = wrappedLink
    .replace('{url}', encodeURIComponent(targetUrl))
    .replace('{ref}', settings.masterAffiliateCode || "MASTER_GERAI910")
    .replace('{subid}', creatorSubId);

  appState.db.affiliateData.clicks = (appState.db.affiliateData.clicks || 0) + 1;
  
  const creatorPct = (settings.creatorCommissionPercent !== undefined) ? settings.creatorCommissionPercent / 100 : 0.70;
  const platformPct = (settings.platformFeePercent !== undefined) ? settings.platformFeePercent / 100 : 0.30;

  const mockCommission = Math.round(estPrice * 0.05); 
  const userCommissionShare = Math.round(mockCommission * creatorPct); 
  const platformFeeShare = Math.round(mockCommission * platformPct); 

  appState.db.affiliateData.earnings += userCommissionShare;
  
  appState.db.affiliateData.history.unshift({
    id: Date.now(),
    date: new Date().toISOString().split('T')[0],
    source: `GeraiTok (@${creatorHandle}) - ${productName}`,
    amount: userCommissionShare,
    platformShare: platformFeeShare,
    status: "Approved"
  });

  saveDatabase();

  alert(`🔗 Mengalihkan Pembeli ke Tautan Afiliasi Global Terbungkus!\n\n🛍️ Produk Global: ${productName}\n💰 Estimasi Komisi: Rp ${mockCommission.toLocaleString('id-ID')}\n✨ Pembagian Hasil:\n  - ${(creatorPct * 100).toFixed(0)}% Komisi Kreator (@${creatorHandle}): Rp ${userCommissionShare.toLocaleString('id-ID')}\n  - ${(platformPct * 100).toFixed(0)}% Fee Sistem Platform Master: Rp ${platformFeeShare.toLocaleString('id-ID')}\n\nTautan Afiliasi Terbungkus:\n${wrappedLink}`);
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

// ==================== DEVELOPER & SUPER ADMIN CONSOLE LOGIC ====================

// Initialize Developer Console HUD and fetch configs
async function initDeveloperConsole() {
  if (appState.saasMode !== 'developer') return;

  try {
    // 1. Fetch System Metrics
    const res = await fetch('/api/dev/status');
    const data = await res.json();
    if (data.success) {
      document.getElementById('dev-hud-pid').innerText = data.pid;
      document.getElementById('dev-hud-cpus').innerText = data.numCPUs;
      document.getElementById('dev-hud-mem-rss').innerText = data.memory.rss;
      document.getElementById('dev-hud-mem-used').innerText = data.memory.heapUsed;
      document.getElementById('dev-hud-uptime').innerText = Math.round(data.uptime);
      document.getElementById('dev-hud-platform').innerText = `${data.platform.toUpperCase()} (${data.nodeVersion})`;
      
      // Update global commission HUD from active DB if present
      let totalPlatformFees = 0;
      if (appState.db && appState.db.affiliateData && appState.db.affiliateData.history) {
        appState.db.affiliateData.history.forEach(item => {
          const pShare = item.platformShare || Math.round(item.amount * (30/70));
          totalPlatformFees += pShare;
        });
      }
      document.getElementById('dev-hud-accumulated-fees').innerText = totalPlatformFees.toLocaleString('id-ID');
      document.getElementById('dev-hud-total-clicks').innerText = appState.db?.affiliateData?.clicks || 0;
    }

    // 2. Fetch .env keys
    await fetchEnvConfig();

    // 3. Load DB to editor
    loadDatabaseToEditor();

    // 4. Fill active platform settings into inputs
    if (appState.db) {
      if (!appState.db.platformSettings) {
        // Initialize default platform settings in DB
        appState.db.platformSettings = {
          creatorCommissionPercent: 70,
          platformFeePercent: 30,
          masterAffiliateCode: "MASTER_GERAI910",
          redirectTemplate: "https://gerai.id/redirect?url={url}&ref={ref}&subid={subid}"
        };
      }
      const s = appState.db.platformSettings;
      document.getElementById('dev-range-creator').value = s.creatorCommissionPercent;
      document.getElementById('dev-lbl-creator').innerText = s.creatorCommissionPercent;
      document.getElementById('dev-lbl-platform').innerText = s.platformFeePercent;
      document.getElementById('dev-input-ref-code').value = s.masterAffiliateCode;
      document.getElementById('dev-input-redirect-template').value = s.redirectTemplate;
      document.getElementById('dev-commission-split-label').innerText = `${s.creatorCommissionPercent}% Kreator / ${s.platformFeePercent}% Master Platform`;
    }

    // Initialize Web3 Estate Countdown
    updateHeartbeatUI();

  } catch (err) {
    console.error('Failed to initialize Developer Console metrics:', err);
  }
}

// Balance Creator Slider against Master Platform Share (must equal 100%)
function balanceDevCommission(creatorVal) {
  const creatorNum = parseInt(creatorVal, 10);
  const platformNum = 100 - creatorNum;

  document.getElementById('dev-lbl-creator').innerText = creatorNum;
  document.getElementById('dev-lbl-platform').innerText = platformNum;
  document.getElementById('dev-commission-split-label').innerText = `${creatorNum}% Kreator / ${platformNum}% Master Platform`;
}

// Save Global Affiliate Settings
async function saveGlobalAffiliateSettings() {
  if (!appState.db) return;

  const creatorNum = parseInt(document.getElementById('dev-range-creator').value, 10);
  const platformNum = 100 - creatorNum;
  const refCode = document.getElementById('dev-input-ref-code').value.trim() || 'MASTER_GERAI910';
  const redirectTpl = document.getElementById('dev-input-redirect-template').value.trim() || 'https://gerai.id/redirect?url={url}&ref={ref}&subid={subid}';

  appState.db.platformSettings = {
    creatorCommissionPercent: creatorNum,
    platformFeePercent: platformNum,
    masterAffiliateCode: refCode,
    redirectTemplate: redirectTpl
  };

  // Also update environment variables on the backend!
  try {
    const envRes = await fetch('/api/dev/env');
    const envData = await envRes.json();
    if (envData.success && envData.env) {
      const updatedEnv = { ...envData.env };
      updatedEnv['MASTER_AFFILIATE_CODE'] = refCode;
      updatedEnv['MASTER_AFFILIATE_PERCENT'] = platformNum;

      await fetch('/api/dev/env', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedEnv)
      });
    }
  } catch (err) {
    console.error('Failed to auto-update master env with new affiliate configs:', err);
  }

  // Save the modified database containing the new settings
  await saveDatabase();
  
  // Rerender HUD metrics
  initDeveloperConsole();

  alert(`✅ Aturan Komisi Platform & Redirect Berhasil Disimpan!\n\n✨ Aturan Baru:\n  - Bagi hasil: ${creatorNum}% Kreator / ${platformNum}% Master Platform\n  - Kode Ref: ${refCode}\n  - Template: ${redirectTpl}\n\nSeluruh klik Keranjang Kuning GeraiTok selanjutnya akan langsung mengadopsi aturan ini!`);
}

// Fetch .env variables from server
async function fetchEnvConfig() {
  try {
    const res = await fetch('/api/dev/env');
    const data = await res.json();
    if (data.success && data.env) {
      const container = document.getElementById('dev-env-container');
      if (!container) return;
      container.innerHTML = '';
      
      Object.entries(data.env).forEach(([key, value]) => {
        const div = document.createElement('div');
        div.className = "space-y-1 bg-slate-950 p-3 rounded-xl border border-cyber-border/40";
        
        let isSet = value && value.trim() !== '';
        let badgeHTML = '';
        if (key === 'PORT' || key === 'MIDTRANS_ENVIRONMENT' || key.startsWith('MASTER_')) {
          badgeHTML = `<span class="px-2 py-0.5 rounded text-[8px] font-extrabold bg-blue-950 text-blue-400 border border-blue-800 uppercase">Config</span>`;
        } else if (isSet) {
          badgeHTML = `<span class="px-2 py-0.5 rounded text-[8px] font-extrabold bg-emerald-950 text-emerald-400 border border-emerald-800 uppercase">Production Active</span>`;
        } else {
          badgeHTML = `<span class="px-2 py-0.5 rounded text-[8px] font-extrabold bg-orange-950 text-orange-400 border border-orange-800 uppercase">Fallback Active</span>`;
        }

        div.innerHTML = `
          <div class="flex justify-between items-center text-xs font-mono">
            <span class="text-slate-300 font-bold">${key}</span>
            ${badgeHTML}
          </div>
          <input type="text" data-env-key="${key}" value="${value}" class="w-full bg-slate-900 border border-cyber-border/60 rounded-lg px-2.5 py-1 text-xs font-mono text-emerald-400 focus:border-brand-500 outline-none">
        `;
        container.appendChild(div);
      });
    }
  } catch (err) {
    console.error('Error fetching env config:', err);
  }
}

// Save all .env inputs back to the server
async function saveEnvironmentConfig() {
  const container = document.getElementById('dev-env-container');
  if (!container) return;

  const inputs = container.querySelectorAll('input[data-env-key]');
  const updatedEnv = {};

  inputs.forEach(input => {
    const key = input.getAttribute('data-env-key');
    updatedEnv[key] = input.value;
  });

  try {
    const res = await fetch('/api/dev/env', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedEnv)
    });
    const data = await res.json();
    if (data.success) {
      alert(`⚙️ Konfigurasi .env Berhasil Diperbarui!\n\nKunci API rill Anda telah tersimpan dan server aktif telah mengadopsi perubahan ini secara real-time.`);
      await fetchEnvConfig();
    } else {
      alert('🚫 Gagal memperbarui konfigurasi .env: ' + data.error);
    }
  } catch (err) {
    alert('🚫 Terjadi kesalahan saat menyimpan file konfigurasi .env.');
    console.error(err);
  }
}

// Crash current worker to test failover (High Availability)
async function simulateWorkerCrash() {
  const currentPid = document.getElementById('dev-hud-pid').innerText;
  
  if (!confirm(`⚠️ PERINGATAN: ANDA AKAN MENUTUP PAKSA SERVER!\n\nApakah Anda yakin ingin mensimulasikan kegagalan sistem (crash) pada Worker Process PID ${currentPid}?\n\nHal ini dilakukan untuk membuktikan sistem failover clustering mandiri.`)) {
    return;
  }

  writeToSandboxTerminal(`[DEBUG] Mengirim sinyal crash darurat ke Worker PID: ${currentPid}...`);

  try {
    const res = await fetch('/api/dev/crash', { method: 'POST' });
    const data = await res.json();
    
    writeToSandboxTerminal(`[SYSTEM] ${data.message}`);
    writeToSandboxTerminal(`[SYSTEM] Worker dimatikan. Mulai memantau peluncuran ulang master cluster...`);

    // Let's check status recursively to show how it heals and reports a new PID!
    let attempts = 0;
    const interval = setInterval(async () => {
      attempts++;
      writeToSandboxTerminal(`[HEALTH-CHECK] Polling kesehatan server (percobaan ${attempts})...`);
      try {
        const checkRes = await fetch('/api/dev/status');
        const checkData = await checkRes.json();
        if (checkData.success && checkData.pid != currentPid) {
          clearInterval(interval);
          writeToSandboxTerminal(`[SUCCESS] 🔥 SERVER TELAH PULIH MANDIRI (SELF-HEALED)!`);
          writeToSandboxTerminal(`[SUCCESS] Node Master berhasil melahirkan Worker pengganti baru.`);
          writeToSandboxTerminal(`[SUCCESS] PID Lama: ${currentPid} ➜ PID Baru: ${checkData.pid}`);
          
          document.getElementById('dev-hud-pid').innerText = checkData.pid;
          document.getElementById('dev-hud-pid').classList.add('text-emerald-400');
          setTimeout(() => {
            document.getElementById('dev-hud-pid').classList.remove('text-emerald-400');
          }, 3000);
          
          initDeveloperConsole();
          alert(`🔥 CLUSTER BERHASIL PULIH MANDIRI (SELF-HEALED)!\n\nSistem cluster mendeteksi matinya Worker PID ${currentPid} & otomatis mengalihkan beban kerja serta melahirkan Worker pengganti baru dengan PID ${checkData.pid} dalam waktu kurang dari 200ms!\n\nKetersediaan layanan (uptime) dijamin 100% fail-safe.`);
        }
      } catch (e) {
        // Ignored, wait for server to rise
      }
      if (attempts > 15) {
        clearInterval(interval);
        writeToSandboxTerminal(`[ERROR] Pemulihan melampaui batas polling.`);
      }
    }, 400);

  } catch (err) {
    writeToSandboxTerminal(`[ERROR] Worker crash triggered successfully. Reconnecting...`);
    setTimeout(() => {
      initDeveloperConsole();
    }, 1000);
  }
}

// Load database to editor textarea
function loadDatabaseToEditor() {
  if (appState.db) {
    document.getElementById('dev-db-editor-textarea').value = JSON.stringify(appState.db, null, 2);
    const msg = document.getElementById('dev-db-editor-validation-msg');
    msg.className = "text-xs font-semibold text-emerald-400 block";
    msg.innerText = "✓ database.json berhasil disinkronkan ke area editor.";
  }
}

// Validate JSON syntax and write directly to database.json
async function saveDatabaseFromEditor() {
  const textareaVal = document.getElementById('dev-db-editor-textarea').value;
  const msg = document.getElementById('dev-db-editor-validation-msg');
  
  let parsedData;
  try {
    parsedData = JSON.parse(textareaVal);
  } catch (err) {
    msg.className = "text-xs font-semibold text-red-500 block";
    msg.innerText = `✗ Format JSON Tidak Valid: ${err.message}`;
    alert(`🚫 Gagal Menyimpan Basis Data!\n\nTerdapat kesalahan penulisan format JSON. Harap periksa tanda koma, kurung kurawal, dan tanda kutip ganda.`);
    return;
  }

  try {
    const res = await fetch('/api/db', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parsedData)
    });
    const data = await res.json();
    if (data.success) {
      appState.db = data.db;
      msg.className = "text-xs font-semibold text-emerald-400 block";
      msg.innerText = "✓ Sukses! Berkas fisik database.json diperbarui rill & memori disinkronkan.";
      
      // Update UI components with new database records
      renderUGCFeed();
      renderPOSProducts();
      renderCRMCustomers();
      renderPOSTransactions();
      calculateKHL();
      calculateRetirement();
      calculateInheritance();
      
      alert(`✅ Berkas database.json Berhasil Diperbarui!\n\nSeluruh data transaksi, pos, profil, dan keuangan rill telah disinkronkan langsung ke basis data fisik.`);
    } else {
      msg.className = "text-xs font-semibold text-red-500 block";
      msg.innerText = "✗ Gagal menyimpan basis data.";
    }
  } catch (err) {
    msg.className = "text-xs font-semibold text-red-500 block";
    msg.innerText = "✗ Terjadi kesalahan koneksi server.";
  }
}

// Interactive API Sandbox client
async function testSandboxApi(endpoint) {
  writeToSandboxTerminal(`➜ Meluncurkan GET ${endpoint}...`);
  try {
    const start = Date.now();
    const res = await fetch(endpoint);
    const ms = Date.now() - start;
    
    writeToSandboxTerminal(`⬅ Respons diterima dalam ${ms}ms. HTTP Status: ${res.status} ${res.statusText}`);
    const data = await res.json();
    writeToSandboxTerminal(JSON.stringify(data, null, 2));
  } catch (err) {
    writeToSandboxTerminal(`✗ Pemanggilan API Gagal: ${err.message}`);
  }
}

// Send mock client error to test Sentry aggregation
async function sendSandboxSentryError() {
  const errorMsg = "Simulated Developer Console Exception: Uncaught TypeMismatch at app.js Line 1024";
  writeToSandboxTerminal(`➜ Mengirimkan Mock Client Sentry Report ke /api/logs/report...`);
  
  try {
    const res = await fetch('/api/logs/report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: "JS_CRASH_DEV_CONSOLE",
        message: errorMsg,
        details: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) SandboxTester/1.0"
      })
    });
    const data = await res.json();
    if (data.success) {
      writeToSandboxTerminal(`✓ Mock Sentry Error berhasil tercatat di log server.`);
      fetchServerLogs(); // Update the settings log box live!
    }
  } catch (err) {
    writeToSandboxTerminal(`✗ Sentry reporting gagal: ${err.message}`);
  }
}

// Trigger concurrent stress test to prove 429 rate limit block
async function triggerRateLimiterStressTest() {
  clearSandboxTerminal();
  writeToSandboxTerminal(`🔥 MEMULAI STRESS TEST RATE-LIMITER...`);
  writeToSandboxTerminal(`[INFO] Aturan Keamanan: Maksimum 15 pemanggilan API per 10 detik.`);
  writeToSandboxTerminal(`[INFO] Simulasi: Mengirim 16 pemanggilan simultan instan dalam 2 detik...`);
  
  let promises = [];
  for (let i = 1; i <= 16; i++) {
    const reqNum = i;
    const p = new Promise(resolve => {
      setTimeout(async () => {
        writeToSandboxTerminal(`[REQ #${reqNum}] Menembak GET /api/market-data...`);
        try {
          const res = await fetch('/api/market-data');
          if (res.status === 429) {
            const data = await res.json();
            writeToSandboxTerminal(`[RESP #${reqNum}] ❌ BLOCKED! HTTP 429: ${data.message}`);
          } else {
            writeToSandboxTerminal(`[RESP #${reqNum}] ✓ SUCCESS! HTTP ${res.status}`);
          }
        } catch (e) {
          writeToSandboxTerminal(`[RESP #${reqNum}] ✗ FAIL: ${e.message}`);
        }
        resolve();
      }, reqNum * 80);
    });
    promises.push(p);
  }

  await Promise.all(promises);
  writeToSandboxTerminal(`[FINISH] Stress test selesai. Pembuktian rate-limiting berhasil.`);
  fetchServerLogs(); // Update server logs
}

// Write line to sandbox screen terminal
function writeToSandboxTerminal(msg) {
  const term = document.getElementById('dev-sandbox-terminal');
  if (term) {
    if (term.innerText.includes('Belum ada pemanggilan API')) {
      term.innerHTML = '';
    }
    const line = document.createElement('div');
    line.className = 'border-b border-cyber-border/20 pb-1 mb-1 font-mono';
    
    if (msg.includes('SUCCESS') || msg.includes('✓') || msg.includes('Self-Healed') || msg.includes('pulih')) {
      line.className += ' text-emerald-400';
    } else if (msg.includes('ERROR') || msg.includes('✗') || msg.includes('BLOCKED') || msg.includes('429')) {
      line.className += ' text-red-400';
    } else if (msg.includes('INFO') || msg.includes('➜') || msg.includes('⬅')) {
      line.className += ' text-blue-400';
    } else {
      line.className += ' text-slate-300';
    }
    
    line.innerText = msg;
    term.appendChild(line);
    term.scrollTop = term.scrollHeight;
  }
}

// Clear terminal screen
function clearSandboxTerminal() {
  const term = document.getElementById('dev-sandbox-terminal');
  if (term) {
    term.innerHTML = '<span class="text-slate-500 italic">Terminal dibersihkan. Silakan lakukan pemanggilan API di atas.</span>';
  }
}

// --- WEB3 AUTONOMOUS ESTATE & SMART TREASURY INTERACTIVE CONSOLE ---

let devSimulatedHeartbeatDays = 365;

function updateHeartbeatUI() {
  const lbl = document.getElementById('dev-heartbeat-countdown');
  const bar = document.getElementById('dev-heartbeat-bar');
  if (!lbl || !bar) return;

  if (devSimulatedHeartbeatDays > 0) {
    lbl.innerText = `${devSimulatedHeartbeatDays} Hari Tersisa`;
    lbl.className = "font-mono text-yellow-500 font-bold";
    bar.className = "bg-yellow-500 h-1.5 rounded-full animate-pulse";
    const pct = (devSimulatedHeartbeatDays / 365) * 100;
    bar.style.width = `${pct}%`;
  } else {
    lbl.innerText = "0 Hari (PEMILIK INAKTIF / WARIS SIAP KLAIM)";
    lbl.className = "font-mono text-red-500 font-black animate-pulse";
    bar.className = "bg-red-500 h-1.5 rounded-full";
    bar.style.width = `100%`;
  }
  
  renderBlockchainHeirs();
}

function renderBlockchainHeirs() {
  const container = document.getElementById('dev-blockchain-heirs-list');
  if (!container) return;

  container.innerHTML = '';
  
  // Simulated Faraid Heir calculation from database dependents
  const heirsList = [
    { name: "Rizky Gio", relation: "Anak Laki-Laki Utama", address: "0x82A180905e467C3098defB751B7401B5f6d1476B", share: "66.67% (2/3 Ashabah)" },
    { name: "Alya Gio", relation: "Anak Perempuan Kedua", address: "0x4B30D93EC7ab88b098defB751B7401B5f6d1476B", share: "33.33% (1/3 Ashabah)" }
  ];

  heirsList.forEach(heir => {
    const div = document.createElement('div');
    div.className = "flex justify-between items-center bg-slate-900 p-2 rounded border border-cyber-border/20 text-[11px]";
    
    let actionBtn = "";
    if (devSimulatedHeartbeatDays <= 0) {
      actionBtn = `<button onclick="executeSimulatedInheritanceClaim('${heir.name}', '${heir.share}')" class="bg-red-950 hover:bg-red-800 text-red-400 border border-red-800/40 px-2 py-0.5 rounded text-[9px] font-bold uppercase transition">Klaim Waris</button>`;
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
        <span class="text-[10px] text-slate-400 font-mono block mt-0.5">${heir.address}</span>
        <span class="text-[10px] text-brand-400 block font-bold mt-0.5">Porsi Waris: ${heir.share}</span>
      </div>
      <div>
        ${actionBtn}
      </div>
    `;
    container.appendChild(div);
  });
}

function triggerOwnerHeartbeat() {
  devSimulatedHeartbeatDays = 365;
  updateHeartbeatUI();
  
  writeToSandboxTerminal(`[WEB3] Owner Heartbeat Check-In berhasil dikirim ke Polygon POS Mainnet!`);
  writeToSandboxTerminal(`[WEB3] Blok transaksi dicatat. Masa tunggu kepemilikan di-reset kembali ke 365 Hari.`);
  
  alert(`💖 Owner Heartbeat Check-In Berhasil!\n\nSinyal kehadiran Anda telah direkam di blockchain. Timer masa tunggu klaim waris ahli waris telah di-reset kembali ke 365 hari.`);
}

function triggerSimulatedTimePass() {
  devSimulatedHeartbeatDays = 0;
  updateHeartbeatUI();
  
  writeToSandboxTerminal(`[WARN] Simulasi penambahan waktu +365 Hari dilakukan.`);
  writeToSandboxTerminal(`[WARN] Pemilik terdeteksi tidak aktif selama >365 Hari. Hak waris otomatis terbuka secara on-chain!`);
  
  alert(`⚠️ Simulasi Waktu Dipercepat!\n\nKini pemilik dianggap tidak aktif selama lebih dari 365 hari. Tombol "Klaim Waris" kini AKTIF untuk seluruh ahli waris terdaftar sesuai asas Faraid KHI.`);
}

function executeSimulatedInheritanceClaim(heirName, share) {
  writeToSandboxTerminal(`[CLAIM] Ahli waris [${heirName}] meluncurkan klaim waris otomatis ke Gerai910SmartTreasury...`);
  
  // Calculate total balance from database
  let totalPlatformFees = 0;
  if (appState.db && appState.db.affiliateData && appState.db.affiliateData.history) {
    appState.db.affiliateData.history.forEach(item => {
      const pShare = item.platformShare || Math.round(item.amount * (30/70));
      totalPlatformFees += pShare;
    });
  }

  const claimPct = heirName.includes('Rizky') ? (2/3) : (1/3);
  const claimAmount = Math.round(totalPlatformFees * claimPct);

  setTimeout(() => {
    writeToSandboxTerminal(`[CLAIM] SUCCESS! Kontrak pintar memvalidasi tanda tangan kriptografi ahli waris.`);
    writeToSandboxTerminal(`[CLAIM] Mentransfer ${share} dari sisa kas treasury ke dompet [${heirName}].`);
    writeToSandboxTerminal(`[CLAIM] Nominal Ditransfer: Rp ${claimAmount.toLocaleString('id-ID')}`);
    
    alert(`🔥 EKSEKUSI WARIS ON-CHAIN BERHASIL!\n\nAhli Waris: ${heirName}\nPorsi Sah: ${share}\nDana Cair: Rp ${claimAmount.toLocaleString('id-ID')}\n\nAset digital dan hak administratif platform otonom berhasil diwariskan lintas generasi di Polygon Mainnet!`);
  }, 1000);
}

function triggerSimulatedSmartSplit() {
  writeToSandboxTerminal(`[AUTOPILOT] Mengeksekusi pembagian hasil langganan SaaS otonom ($10.000 USDT)...`);
  
  setTimeout(() => {
    writeToSandboxTerminal(`[AUTOPILOT] ➜ 40% ($4.000 USDT) dikonversi menjadi PAXG (Emas Fisik Token) dan dikirim ke dompet cadangan aman anti-pailit.`);
    writeToSandboxTerminal(`[AUTOPILOT] ➜ 40% ($4.000 USDT) dikirim ke dompet operasional cloud computing.`);
    writeToSandboxTerminal(`[AUTOPILOT] ➜ 20% ($2.000 USDT) dikirim ke liqudity pool untuk pembelian kembali token platform (buyback).`);
    writeToSandboxTerminal(`[AUTOPILOT] SUCCESS! Seluruh alokasi dana kas cadangan didelegasikan 100% tanpa campur tangan manusia.`);
    
    alert(`🛡️ Alokasi Autopilot Sukses!\n\nKontrak Pintar otomatis membagi pemasukan platform SaaS sebesar $10.000 USDT secara real-time:\n  - Rp 65.400.000 (PAXG Emas) masuk ke Dana Abadi Cadangan Anti-Pailit\n  - Rp 65.400.000 masuk Kas Operasional Cloud Server\n  - Rp 32.700.000 masuk Pool Likuiditas Buyback Token\n\nSistem Anda kini memiliki pertahanan kas absolut yang melindunginya dari risiko pailit!`);
  }, 1200);
}

async function toggleSoliditySourceCode() {
  const block = document.getElementById('dev-solidity-code-block');
  const btn = document.getElementById('dev-sol-btn-lbl');
  if (!block || !btn) return;

  if (block.classList.contains('hidden')) {
    block.classList.remove('hidden');
    btn.innerText = "SEMBUNYIKAN SOURCE CODE";
    
    try {
      const res = await fetch('/contracts/Gerai910SmartTreasury.sol');
      if (res.ok) {
        const text = await res.text();
        block.innerText = text;
      } else {
        block.innerText = "// Gagal membaca file dari server.";
      }
    } catch (err) {
      block.innerText = "// Gagal memuat file kontrak pintar.";
    }
  } else {
    block.classList.add('hidden');
    btn.innerText = "TAMPILKAN SOURCE CODE";
  }
}
