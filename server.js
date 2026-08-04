const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// -----------------------------------------------------------------
// NEW: ADVANCED HTTP STATIC ASSETS CACHING & ETAG MANAGEMENT (CDN & SENSITIVE CACHE OPTIMIZATION)
const STATIC_CACHE_AGE_MS = 24 * 60 * 60 * 1000; // 1 Day in milliseconds
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: STATIC_CACHE_AGE_MS,
  etag: true,
  lastModified: true,
  setHeaders: (res, filePath, stat) => {
    // Cache static assets (JS, CSS, images, icons) at the client browser and CDN edge for 1 day
    res.setHeader('Cache-Control', 'public, max-age=86400'); // 86400 seconds = 1 day
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  }
}));
// -----------------------------------------------------------------

const DB_PATH = path.join(__dirname, 'database.json');

// Helper to read database
function readDB() {
  try {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading database.json:', err);
    return {};
  }
}

// Helper to write database
function writeDB(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error writing database.json:', err);
    return false;
  }
}

// Ensure database.json exists
if (!fs.existsSync(DB_PATH)) {
  writeDB({});
}

// ENTERPRISE-GRADE SERVER-SIDE API RATE LIMITER
const rateLimitMap = new Map(); 
const RATE_LIMIT_WINDOW_MS = 10000; 
const RATE_LIMIT_MAX_REQUESTS = 15; 

function apiRateLimiter(req, res, next) {
  const ip = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';
  const now = Date.now();

  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, { count: 1, windowStart: now });
    return next();
  }

  const clientData = rateLimitMap.get(ip);
  if (now - clientData.windowStart > RATE_LIMIT_WINDOW_MS) {
    clientData.count = 1;
    clientData.windowStart = now;
    return next();
  }

  clientData.count++;
  if (clientData.count > RATE_LIMIT_MAX_REQUESTS) {
    console.warn(`[Rate Limit Triggered] Blocked request from IP: ${ip}. Exceeded request limits.`);
    return res.status(429).json({
      error: 'Too Many Requests',
      message: 'Deteksi Aktivitas Tidak Wajar: Server Komputasi Awan (Cloud Compute) memblokir sementara IP Anda karena melebihi kuota pemanggilan aman (Maksimum 15 pemanggilan per 10 detik). Silakan tunggu beberapa detik.'
    });
  }

  next();
}

app.use('/api/', apiRateLimiter);

// 1. GET full database
app.get('/api/db', (req, res) => {
  const db = readDB();
  res.json(db);
});

// 2. POST save database
app.post('/api/db', (req, res) => {
  const db = readDB();
  const updated = { ...db, ...req.body };
  if (writeDB(updated)) {
    res.json({ success: true, message: 'Database updated successfully', db: updated });
  } else {
    res.status(500).json({ success: false, message: 'Failed to write to database' });
  }
});

// 3. Simulated real-time market data generator
app.get('/api/market-data', (req, res) => {
  const t = Date.now();
  
  // Real-time fluctuating pricing per August 3, 2026
  const goldBase = 2610000; // IDR per gram Antam
  const silverBase = 39450; // IDR per gram
  const ihsgBase = 7248.5; // Points
  const usdidrBase = 16350; // Rupiah per USD
  const btcBase = 64250; // USD per BTC
  const ethBase = 3420; // USD per ETH
  const sbnBaseYield = 6.25; // % Yield

  const randGold = Math.sin(t / 10000) * 1500 + (Math.random() - 0.5) * 500;
  const randSilver = Math.sin(t / 12000) * 40 + (Math.random() - 0.5) * 15;
  const randIhsg = Math.cos(t / 15000) * 12 + (Math.random() - 0.5) * 4;
  const randUsdidr = Math.sin(t / 20000) * 15 + (Math.random() - 0.5) * 5;
  const randBtc = Math.cos(t / 8000) * 80 + (Math.random() - 0.5) * 30;
  const randEth = Math.sin(t / 9000) * 5 + (Math.random() - 0.5) * 2;

  res.json({
    timestamp: new Date().toISOString(),
    gold: Math.round(goldBase + randGold),
    goldBuyback: Math.round((goldBase * 0.911) + (randGold * 0.9)),
    silver: Math.round(silverBase + randSilver),
    silverBuyback: Math.round((silverBase * 0.88) + (randSilver * 0.85)),
    ihsg: parseFloat((ihsgBase + randIhsg).toFixed(2)),
    usdidr: Math.round(usdidrBase + randUsdidr),
    btc: parseFloat((btcBase + randBtc).toFixed(2)),
    eth: parseFloat((ethBase + randEth).toFixed(2)),
    sbnYield: parseFloat((sbnBaseYield + Math.sin(t / 30000) * 0.05).toFixed(3)),
    interestRateBI: 6.00, // BI Rate August 2026
    inflationID: 2.42, // Inflation YoY
    gdpGrowthID: 4.95, // GDP growth Q2/FY
    fedRate: 3.50 // US Fed Rate
  });
});

// 4. Simulated AI Financial Assistant ("GeraiAI") Endpoint
app.post('/api/ai-chat', (req, res) => {
  const { message } = req.body;
  const db = readDB();
  
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const prompt = message.toLowerCase();
  let reply = '';
  
  const goldGrams = db.assets?.gold?.grams || 0;
  const silverGrams = db.assets?.silver?.grams || 0;
  const goldVal = goldGrams * 2610000;
  const silverVal = silverGrams * 39450;
  
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

  const totalWealth = goldVal + silverVal + mfVal + sbnVal + depVal + propVal + stockVal;
  const mainIncome = db.income?.utama || 0;
  const businessIncome = db.income?.bisnis || 0;
  const passiveIncome = db.income?.passive || 0;
  const otherIncome = db.income?.lainnya || 0;
  const totalIncome = mainIncome + businessIncome + passiveIncome + otherIncome;

  const totalDebt = db.debts?.reduce((acc, curr) => acc + curr.remaining, 0) || 0;
  
  const familyMembers = 3; 
  const baseKhlPerPerson = 3200000; 
  const estimatedKhlFamily = familyMembers * baseKhlPerPerson;
  const emergencyFundCurrent = db.emergencyFund?.current || 0;
  const emergencyFundTargetMonths = db.emergencyFund?.targetMonths || 6;
  const emergencyFundTarget = estimatedKhlFamily * emergencyFundTargetMonths;

  if (prompt.includes('waris') || prompt.includes('faraid') || prompt.includes('hibah') || prompt.includes('pembagian harta')) {
    reply = `### ⚖️ Analisis AI Ahli Waris & Faraid (Hukum Islam)
Hukum Waris Islam (Faraid) di Indonesia diatur dalam **Kompilasi Hukum Islam (KHI)**. Berdasarkan portofolio keuangan Anda saat ini, nilai total aset Anda berkisar **Rp ${totalWealth.toLocaleString('id-ID')}** (tidak termasuk kewajiban utang sebesar **Rp ${totalDebt.toLocaleString('id-ID')}**).

**Prinsip Dasar Pembagian (KHI):**
1. **Utang & Wasiat diselesaikan terlebih dahulu:** Sebelum harta dibagikan, lunasi utang Anda sebesar **Rp ${totalDebt.toLocaleString('id-ID')}** dan penuhi wasiat (maksimal 1/3 harta).
2. **Harta Bersama:** Harta yang diperoleh selama perkawinan dibagi 50% untuk pasangan yang ditinggalkan terlebih dahulu, sisanya (50%) menjadi harta warisan.
3. **Porsi Ahli Waris Utama (Jika wafat meninggalkan Istri, Ibu, Ayah, Anak Laki-laki, dan Anak Perempuan):**
   * **Istri/Suami:** Mendapatkan **1/8** (jika ada anak) atau **1/4** (jika tidak ada anak).
   * **Ibu & Ayah:** Masing-masing mendapatkan **1/6** jika pewaris memiliki anak.
   * **Anak Laki-laki & Perempuan:** Anak laki-laki mendapatkan bagian **2:1** dibanding anak perempuan (*Ashabah bi al-Ghair*).

*Rekomendasi AI:* Untuk menghindari perselisihan keluarga, manfaatkan fitur **Tujuan Investasi & Waris** di dashboard kami untuk mensimulasikan pembagian aset secara mendetail. Anda juga dapat menggunakan instrumen **Hibah** saat masih hidup guna mendistribusikan aset secara sukarela tanpa batasan faraid.`;

  } else if (prompt.includes('emas') || prompt.includes('perak') || prompt.includes('logam mulia') || prompt.includes('asset') || prompt.includes('aset')) {
    reply = `### 🪙 Analisis Portofolio Aset & Logam Mulia oleh AI
Eko, saat ini Anda memiliki kepemilikan emas sebesar **${goldGrams} Gram** (Nilai pasar saat ini: ~Rp ${goldVal.toLocaleString('id-ID')}) dan perak sebesar **${silverGrams} Gram** (Nilai pasar saat ini: ~Rp ${silverVal.toLocaleString('id-ID')}).

**Tinjauan Makroekonomi (Agustus 2026):**
* Harga Emas Antam stabil menguat di kisaran **Rp 2.610.000 / Gram** karena sentimen pemotongan suku bunga Fed yang kini berada di level 3.5%.
* Perak murni diperdagangkan kuat di kisaran **Rp 39.450 / Gram**, didorong oleh permintaan industri panel surya dan kendaraan listrik global.

**Rekomendasi Strategi Alokasi Aset:**
1. **Diversifikasi Portofolio:** Total aset likuid Anda adalah **Rp ${(goldVal + silverVal + mfVal + sbnVal).toLocaleString('id-ID')}**. Rasio emas Anda adalah **${((goldVal / (totalWealth || 1)) * 100).toFixed(1)}%** dari total kekayaan bersih Anda. Proporsi ideal emas untuk pelindung nilai adalah **10% - 15%**.
2. **Blockchain Tokenisasi:** Di platform kami, Anda dapat mendesentralisasikan emas fisik Anda menjadi token **gGMR (geraiGold)** untuk likuiditas instan, mempermudah transaksi POS mikro atau staking on-chain dengan yield tambahan.`;

  } else if (prompt.includes('dana darurat') || prompt.includes('darurat') || prompt.includes('emergency') || prompt.includes('khl') || prompt.includes('budget')) {
    reply = `### 🚨 Evaluasi KHL, Budget Fleksibel & Dana Darurat oleh AI
Sesuai kebutuhan spesifik Anda, platform ini menggunakan rumus KHL riil: **Jumlah Anggota Keluarga × KHL Dasar Wilayah** (contoh: 3 orang × Rp 3.200.000 = Rp 9.600.000).

**Status Kesiapan Dana Darurat Anda:**
* **Jumlah Saat Ini:** Rp ${emergencyFundCurrent.toLocaleString('id-ID')}
* **Target Minimum (${emergencyFundTargetMonths} Bulan KHL Keluarga):** Sekitar **Rp ${emergencyFundTarget.toLocaleString('id-ID')}**.
* **Tingkat Ketercapaian:** **${((emergencyFundCurrent / (emergencyFundTarget || 1)) * 100).toFixed(0)}%** dari target.

**Analisis Alokasi Anggaran Fleksibel:**
Sangat tidak elok memaksakan aturan budget kaku 50% Kebutuhan bagi kelompok pendapatan tinggi (miliaran) maupun pendapatan kecil yang pas-pasan. Platform ini membebaskan Anda menggunakan **Budget Sliders** di menu Kategori 4. 
* Jika Anda memiliki penghasilan besar, turunkan porsi kebutuhan pokok hingga **5% - 15%** dan alokasikan **&gt; 70%** untuk investasi.
* Jika penghasilan sedang ketat, naikkan porsi kebutuhan dasar hingga **90%** untuk makan dan sandang tanpa dipaksa berinvestasi dahulu.`;

  } else if (prompt.includes('pos') || prompt.includes('crm') || prompt.includes('bisnis') || prompt.includes('jual') || prompt.includes('kasir')) {
    const productsCount = db.posProducts?.length || 0;
    const transactionsCount = db.posTransactions?.length || 0;
    const customersCount = db.crmCustomers?.length || 0;

    reply = `### 🛍️ Analisis AI untuk Sistem POS & CRM Toko Anda
Sebagai pemilik gerai, Anda memegang kontrol penuh atas sistem kasir dan database CRM ini:
* **Jumlah Produk Ritel:** ${productsCount} item.
* **Database Pelanggan CRM:** ${customersCount} orang terdaftar.
* **Jumlah Transaksi Toko:** ${transactionsCount} transaksi berhasil dibukukan.

**Rekomendasi AI untuk Mengoptimalkan Toko Anda:**
1. **Diskon Otomatis CRM:** Sistem POS Anda mendeteksi tingkatan loyalitas secara otomatis. Manfaatkan diskon Platinum (Rp100 ribu) dan Gold (Rp50 ribu) di keranjang kasir untuk meningkatkan pengulangan belanja pelanggan loyal.
2. **Kemitraan Afiliasi Komunitas:** Integrasikan dengan menu Kategori 11. Biarkan pelanggan Anda menyebarkan kupon diskon Anda. Mereka menjadi sub-affiliate yang mendapatkan pembagian komisi adil, sementara Anda mengamankan penjualan ritel emas Anda secara masif!`;

  } else if (prompt.includes('afiliasi') || prompt.includes('ref') || prompt.includes('link') || prompt.includes('iklan')) {
    reply = `### 🔗 Mekanisme Afiliasi Global Gerai 910
Sistem afiliasi platform ini dirancang khusus untuk memberikan kebebasan penuh bagi pengguna (*user-centric*):
1. **Bebas Pilih Link:** Pengguna dapat memasukkan tautan penjualan apa saja dari seluruh penjuru dunia (Amazon, Tokopedia, Shopee, dll.) ke **Link Generator Afiliasi Dunia** di menu Kategori 1.
2. **Mekanisme Sub-Affiliate:** Tautan tersebut dibungkus dengan menyematkan ID Afiliasi Pengguna dan ID Master platform kita. 
3. **Skema Pembagian Adil:** Ketika pembeli membeli produk melalui link terbungkus tersebut, komisi rujukan global akan dilacak. Pengguna mendapatkan bagian **70%** sebagai sub-afiliasi langsung, dan **30%** masuk sebagai fee pemeliharaan sistem platform kita. Ini adalah model bisnis SaaS win-win yang nyata!`;

  } else if (prompt.includes('makro') || prompt.includes('inflasi') || prompt.includes('suku bunga') || prompt.includes('sbn') || prompt.includes('investasi')) {
    reply = `### 📈 Analisis Makroekonomi & Screening Investasi oleh AI
Kondisi indikator makroekonomi riil Indonesia saat ini menunjukkan stabilitas yang solid namun waspada:
* **Suku Bunga BI (BI-Rate):** **6.00%** (Suku bunga riil yang tinggi ini menjaga kekuatan Rupiah).
* **Inflasi YoY:** **2.42%** (Masih berada dalam target Bank Indonesia 2.5±1%).
* **Nilai Tukar Rupiah:** **~Rp 16.350 / USD** (Ada fluktuasi tipis karena ketidakpastian suku bunga global).
* **Suku Bunga Federal Reserve AS:** **3.50% - 3.75%**.

**Rekomendasi Investasi Berdasarkan Profil Risiko ${db.profile?.riskProfile || 'Moderate'}-Anda:**
1. **Sovereign Debt Securities (SBN):** Sangat disarankan untuk mengunci yield SBN saat ini (SR020 / ORI025 di portofolio Anda memberikan imbal hasil **6.25% - 6.30% p.a.** yang bebas pajak & dilindungi undang-undang). Ini adalah spread yang luar biasa tinggi di atas inflasi 2.42% (suku bunga riil positif ~3.8%).
2. **Reksadana Pendapatan Tetap:** Pilihan yang sangat baik untuk meningkatkan return portofolio di atas deposito konvensional dengan tingkat volatilitas moderat.
3. **Saham Dividen (Deviden Screening):** Lakukan penyaringan saham berkapitalisasi besar (Blue Chip) seperti **BBRI** atau **TLKM** di portofolio Anda. Saham-saham ini menawarkan Dividend Yield historis 4% - 6% p.a. yang konsisten dibagikan di tengah volatilitas pasar global.`;

  } else {
    reply = `### 👋 Halo ${db.profile?.name || 'Eko Gio'}, Saya GeraiAI Financial Assistant Anda!
Saya adalah asisten AI finansial yang dirancang khusus untuk menganalisis kekayaan bersih, bisnis POS, CRM, portofolio aset riil, perhitungan waris Islam (faraid), hingga integrasi blockchain Anda secara real-time.

**Beberapa hal yang bisa Anda tanyakan kepada saya:**
1. *"Bagaimana pembagian waris atau faraid sesuai KHI untuk keluarga saya?"*
2. *"Bagaimana sistem anggaran fleksibel & dana darurat KHL dihitung?"*
3. *"Bagaimana mekanisme afiliasi link global (sub-affiliate) bekerja?"*
4. *"Berikan strategi promosi kasir POS & CRM untuk toko ritel saya."*
5. *"Bagaimana cara mendesentralisasikan emas fisik saya ke jaringan blockchain?"*

*Ketik pertanyaan Anda di atas, dan saya akan meramu jawaban komprehensif berdasarkan data riil keuangan Anda!*`;
  }

  res.json({
    reply: reply,
    timestamp: new Date().toISOString()
  });
});

// 5. Simulated Blockchain Endpoint: Mint Tokenized Gold / Silver
app.post('/api/blockchain/mint', (req, res) => {
  const { token, value, address } = req.body;
  const db = readDB();
  
  if (!token || !value || !address) {
    return res.status(400).json({ error: 'Missing token, value or address' });
  }

  const latestBlock = db.blockchainLedger?.length > 0 
    ? db.blockchainLedger[0].block + Math.floor(Math.random() * 5) + 1 
    : 3284103;

  const characters ='abcdef0123456789';
  let txHash = '0x';
  for ( let i = 0; i < 64; i++ ) {
    txHash += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  const newTx = {
    block: latestBlock,
    hash: txHash,
    from: '0x0000000000000000000000000000000000000000',
    to: address,
    token: token,
    value: parseFloat(value).toFixed(4) + ' g',
    status: 'Confirmed',
    timestamp: new Date().toISOString()
  };

  // Add to ledger
  if (!db.blockchainLedger) {
    db.blockchainLedger = [];
  }
  db.blockchainLedger.unshift(newTx); // pre-pend latest

  // Automatically update asset holdings
  if (token.includes('Gold') || token.includes('gGMR')) {
    if (!db.assets.gold) db.assets.gold = { grams: 0, avgBuyPrice: 0 };
    db.assets.gold.grams = parseFloat((parseFloat(db.assets.gold.grams) + parseFloat(value)).toFixed(4));
  } else if (token.includes('Silver') || token.includes('gSLV')) {
    if (!db.assets.silver) db.assets.silver = { grams: 0, avgBuyPrice: 0 };
    db.assets.silver.grams = parseFloat((parseFloat(db.assets.silver.grams) + parseFloat(value)).toFixed(4));
  }

  writeDB(db);

  res.json({
    success: true,
    transaction: newTx,
    updatedAssets: db.assets
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
