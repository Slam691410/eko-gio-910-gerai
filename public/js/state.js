// GLOBAL REACTIVE STATE MANAGEMENT - GERAI 910
let appState = {
  db: null,
  activeTab: 'tab-ugc',
  posSubTab: 'pos-cashier',
  screenerTab: 'screener-stocks',
  saasMode: 'customer', // customer, admin, developer
  economicPhase: 'Boom', // Reflasi, Boom, Stagflasi, Resesi
  freeChatCount: 0, // Free tier rate limiter
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
    items: [], 
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
    silverBuyback: 34716,
    ihsg: 7248.5,
    usdidr: 16350,
    btc: 64250,
    eth: 3420,
    sbnYield: 6.25,
    interestRateBI: 6.00,
    inflationID: 2.42,
    gdpGrowthID: 4.95,
    fedRate: 3.50
  },
  goldPriceHistory: [],
  priceChartInstance: null,
  allocationChartInstance: null
};

// State update handlers
function checkAuthentication() {
  if (!appState.db?.profile?.web3Address) {
    alert("🚫 Akses Ditolak: Silakan sambungkan dompet kripto Web3 Anda terlebih dahulu di Kategori 10!");
    switchTab('tab-settings');
    return false;
  }
  return true;
}

function verifyAuthorization(requiredTier, featureName) {
  const userTier = appState.db?.profile?.premiumTier || 'Free';
  
  if (requiredTier === 'Pro' && userTier === 'Free') {
    alert(`🚫 Akses Ditangguhkan (Otorisasi Khusus)!\n\nFitur '${featureName}' memerlukan lisensi level PREMIUM PRO.\nSilakan upgrade keanggotaan Anda di Kategori 11.`);
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

// ---------------------------------------------------------------------------
// HELPER FETCH DENGAN TOKEN ADMIN
// Endpoint yang diproteksi (POST /api/db, /api/blockchain/mint, /api/dev/*)
// memerlukan header: Authorization: Bearer <ADMIN_API_TOKEN>.
// Token diminta sekali lalu disimpan di localStorage.
// ---------------------------------------------------------------------------
function getAdminToken() {
  try {
    return localStorage.getItem('gerai_admin_token') || '';
  } catch (e) {
    return '';
  }
}

async function apiFetch(url, opts = {}) {
  opts.headers = Object.assign({}, opts.headers || {});
  const token = getAdminToken();
  if (token) opts.headers['Authorization'] = 'Bearer ' + token;

  const res = await fetch(url, opts);

  // Jika server menolak (401), minta token sekali lalu coba lagi
  if (res.status === 401) {
    const input = window.prompt('Endpoint ini membutuhkan ADMIN_API_TOKEN server. Masukkan token:');
    if (input && input.trim()) {
      try { localStorage.setItem('gerai_admin_token', input.trim()); } catch (e) {}
      return apiFetch(url, opts);
    }
  }
  return res;
}
