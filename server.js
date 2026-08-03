/**
 * PyraBudget — SaaS Budgeting Engine
 * ------------------------------------------------------------------
 * Vibes coding + AI Blockchain.
 *
 * Backend murni dengan modul bawaan Node (tanpa npm install):
 *   - http        : web server + REST API
 *   - fs / path   : penyajian file statis & persistensi JSON
 *   - crypto      : SHA-256 nyata untuk rantai blok (Proof-of-Budget)
 *
 * Konsep: setiap keputusan/transaksi anggaran dicatat sebagai blok
 * dalam blockchain privat. Rantai ini menjadi "buku besar" yang
 * transparan & tamper-evident. AI Advisor menganalisis alokasi
 * berdasarkan Piramida Maslow + Piramida Keuangan.
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, 'public');
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');
const PORT = process.env.PORT || 3000;

/* ----------------------------------------------------------------- *
 * MODEL: Piramida Maslow x Piramida Keuangan
 * ----------------------------------------------------------------- */
const TIERS = [
  {
    id: 'physiological',
    maslow: 'Kebutuhan Fisiologis',
    finance: 'Arus Kas & Survival',
    icon: '🍚',
    target: 50,
    desc: 'Makan, tempat tinggal, air, listrik, transportasi dasar. Pondasi hidup.',
    examples: ['Sewa / cicilan rumah', 'Makanan', 'Utilitas', 'Transportasi dasar'],
  },
  {
    id: 'safety',
    maslow: 'Rasa Aman',
    finance: 'Dana Darurat, Utang & Proteksi',
    icon: '🛡️',
    target: 20,
    desc: 'Dana darurat 3–6 bulan, pelunasan utang konsumtif, asuransi.',
    examples: ['Dana darurat', 'Bayar utang', 'Premi asuransi'],
  },
  {
    id: 'belonging',
    maslow: 'Cinta & Keterikatan',
    finance: 'Gaya Hidup & Relasi',
    icon: '💞',
    target: 15,
    desc: 'Keluarga, pertemanan, rekreasi, hadiah, kesejahteraan sosial.',
    examples: ['Makan luar', 'Hobi sosial', 'Hadiah', 'Rekreasi'],
  },
  {
    id: 'esteem',
    maslow: 'Penghargaan Diri',
    finance: 'Pertumbuhan & Kapabilitas',
    icon: '🎓',
    target: 10,
    desc: 'Pendidikan, pelatihan, kesehatan, pengembangan karier.',
    examples: ['Kursus', 'Buku', 'Gym', 'Kesehatan'],
  },
  {
    id: 'selfactualization',
    maslow: 'Aktualisasi Diri',
    finance: 'Akumulasi & Warisan',
    icon: '🌟',
    target: 5,
    desc: 'Investasi, wirausaha, filantropi, passion bermakna.',
    examples: ['Investasi', 'Amal', 'Bisnis sampingan'],
  },
];

const TIER_IDS = TIERS.map((t) => t.id);

/* ----------------------------------------------------------------- *
 * BLOCKCHAIN (Proof-of-Budget) — SHA-256 nyata + light Proof-of-Work
 * ----------------------------------------------------------------- */
const DIFFICULTY = 2; // jumlah nol di awal hash (PoW ringan)

function sha256(input) {
  return crypto.createHash('sha256').update(input).digest('hex');
}

function mineHash(payload) {
  let nonce = 0;
  const prefix = '0'.repeat(DIFFICULTY);
  let hash;
  do {
    hash = sha256(payload + nonce);
    nonce += 1;
  } while (!hash.startsWith(prefix));
  return { hash, nonce: nonce - 1 };
}

function createBlock(index, previousHash, data) {
  const timestamp = Date.now();
  const base = JSON.stringify(data);
  const payload = index + timestamp + base + previousHash;
  const { hash, nonce } = mineHash(payload);
  return { index, timestamp, previousHash, data, nonce, hash };
}

function genesisBlock() {
  return createBlock(0, '0'.repeat(64), {
    type: 'genesis',
    label: 'Blok Genesis PyraBudget',
    note: 'Awal rantai buku besar anggaran',
  });
}

/* ----------------------------------------------------------------- *
 * DATABASE (persistensi file JSON)
 * ----------------------------------------------------------------- */
function blankDb() {
  return {
    household: { name: 'Keluarga Saya', income: 0, currency: 'IDR' },
    chain: [genesisBlock()],
  };
}

let db;
function loadDb() {
  try {
    if (fs.existsSync(DB_FILE)) {
      db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
      if (!db.chain || db.chain.length === 0) db.chain = [genesisBlock()];
      if (!db.household) db.household = blankDb().household;
      return;
    }
  } catch (err) {
    console.error('Gagal memuat db, membuat baru:', err.message);
  }
  db = blankDb();
  saveDb();
}

function saveDb() {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
  } catch (err) {
    console.error('Gagal menyimpan db:', err.message);
  }
}

/* ----------------------------------------------------------------- *
 * STATE — replay rantai menjadi ringkasan anggaran
 * ----------------------------------------------------------------- */
function computeState() {
  const incomeTx = [];
  const expenseByTier = Object.fromEntries(TIER_IDS.map((id) => [id, 0]));

  for (const block of db.chain) {
    const d = block.data;
    if (d && d.type === 'tx') {
      if (d.kind === 'income') incomeTx.push(d);
      else if (d.kind === 'expense' && expenseByTier[d.tier] !== undefined) {
        expenseByTier[d.tier] += Math.max(0, Number(d.amount) || 0);
      }
    }
  }

  const income = db.household.income || incomeTx.reduce((s, t) => s + (Number(t.amount) || 0), 0);
  const totalExpense = Object.values(expenseByTier).reduce((a, b) => a + b, 0);

  const allocations = TIERS.map((tier) => {
    const spent = expenseByTier[tier.id];
    const actualPct = income > 0 ? (spent / income) * 100 : 0;
    const gap = actualPct - tier.target;
    // skor tier: 100 bila pas, turun seiring deviasi
    const score = Math.max(0, 100 - Math.abs(gap) * 4);
    return {
      ...tier,
      spent,
      actualPct: Math.round(actualPct * 10) / 10,
      gap: Math.round(gap * 10) / 10,
      score: Math.round(score),
    };
  });

  const totalTarget = TIERS.reduce((s, t) => s + t.target, 0);
  // skor kesehatan = rata-rata skor tier (0..100), intuitif & tidak terlalu menghukum
  const avgScore = allocations.reduce((s, a) => s + a.score, 0) / (allocations.length || 1);
  const health = Math.max(0, Math.min(100, Math.round(avgScore)));
  const leftover = income - totalExpense;

  return {
    household: db.household,
    income,
    totalExpense,
    leftover,
    totalTarget,
    health,
    allocations,
    blockCount: db.chain.length,
  };
}

/* ----------------------------------------------------------------- *
 * AI ADVISOR — mesin aturan berbasis piramida (heuristic AI)
 * ----------------------------------------------------------------- */
function aiAdvice() {
  const state = computeState();
  const tips = [];
  let weakest = null;
  let weakestScore = 101;

  for (const a of state.allocations) {
    if (a.score < weakestScore) {
      weakestScore = a.score;
      weakest = a;
    }
    if (a.gap > 8) {
      tips.push({
        tier: a.id,
        severity: 'high',
        title: `Kurangi alokasi "${a.maslow}"`,
        message: `Saat ini ${(a.actualPct).toFixed(1)}% (target ${a.target}%). Kelebihan ~${(
          a.gap
        ).toFixed(1)}% dari pemasukan. Arahkan kebutuhan ke tier yang lebih rendah dulu.`,
        suggestAmount: Math.round((a.gap / 100) * state.income),
      });
    } else if (a.gap < -8) {
      tips.push({
        tier: a.id,
        severity: 'medium',
        title: `Tingkatkan alokasi "${a.maslow}"`,
        message: `Baru ${(a.actualPct).toFixed(1)}% (target ${a.target}%). Tier ini underfunded — naikkan secara bertahap.`,
        suggestAmount: Math.round((-a.gap / 100) * state.income),
      });
    } else {
      tips.push({
        tier: a.id,
        severity: 'ok',
        title: `Tier "${a.maslow}" sehat`,
        message: `Alokasi ${(a.actualPct).toFixed(1)}% berada di zona target ${a.target}%. Pertahankan.`,
        suggestAmount: 0,
      });
    }
  }

  // Saran lintas-tier: dana darurat & utang prioritas sebelum gaya hidup
  const safety = state.allocations.find((a) => a.id === 'safety');
  const belonging = state.allocations.find((a) => a.id === 'belonging');
  if (safety && belonging && safety.gap < -8 && belonging.gap > -8) {
    tips.unshift({
      tier: 'safety',
      severity: 'high',
      title: 'Prioritaskan Rasa Aman sebelum Gaya Hidup',
      message:
        'Menurut piramida, penuhi dana darurat & proteksi (Safety) sebelum memperbesar relasi/gaya hidup (Belonging).',
      suggestAmount: Math.round((8 / 100) * state.income),
    });
  }

  const confidence = Math.min(0.98, 0.55 + state.blockCount * 0.02);
  return {
    generatedAt: new Date().toISOString(),
    health: state.health,
    weakestTier: weakest ? weakest.id : null,
    confidence: Math.round(confidence * 100) / 100,
    summary:
      state.income === 0
        ? 'Masukkan pemasukan & transaksi untuk mendapat analisis AI yang akurat.'
        : `Skor kesehatan piramida keuangan Anda ${state.health}/100. Tier terlemah: ${
            weakest ? weakest.maslow : '-'
          }.`,
    tips,
  };
}

/* ----------------------------------------------------------------- *
 * MARKETING — generator strategi konten
 * ----------------------------------------------------------------- */
function marketingStrategy(weakestTierId) {
  const funnel = [
    { stage: 'Awareness', channel: 'TikTok / Reels', goal: 'Edukasi piramida keuangan' },
    { stage: 'Consideration', channel: 'Instagram Carousel / LinkedIn', goal: 'Demo fitur & perbandingan' },
    { stage: 'Conversion', channel: 'Email / Landing Page', goal: 'Trial gratis & onboarding' },
    { stage: 'Retention', channel: 'WhatsApp / Newsletter', goal: 'Tips mingguan & streak' },
  ];

  const pillars = TIERS.map((t) => ({
    pillar: `${t.icon} ${t.maslow} → ${t.finance}`,
    angle: t.desc,
  }));

  const calendar = [];
  const themes = [
    'Piramida Maslow untuk dompet',
    'Dana darurat 3-6 bulan',
    'Audit gaya hidup',
    'Investasi sebagai aktualisasi diri',
    'Blockchain untuk transparansi keuangan',
    'Budgeting ala AI',
  ];
  for (let w = 0; w < 4; w += 1) {
    calendar.push({
      week: `Minggu ${w + 1}`,
      theme: themes[w % themes.length],
      posts: [
        { type: 'Reels/TikTok', hook: `Cek tier "${TIERS[w % TIERS.length].maslow}" kamu 🔥` },
        { type: 'Carousel IG', hook: `5 langkah ke ${TIERS[(w + 1) % TIERS.length].finance}` },
        { type: 'LinkedIn/Newsletter', hook: 'Data: kenapa mayoritas gagal di tier Safety' },
      ],
    });
  }

  const copyTemplates = [
    {
      platform: 'Instagram / TikTok',
      template:
        'Dompet boncos tiap akhir bulan? Mungkin kamu loncat piramida 🚀 Catat tiap rupiah di PyraBudget, AI kami susun ulang ke Piramida Maslow + Keuangan. Coba gratis 👇',
    },
    {
      platform: 'LinkedIn',
      template:
        '87% pekerja gig tidak punya dana darurat (tier Safety). Kami membangun PyraBudget: buku besar anggaran berbasis blockchain + AI advisor yang menyarankan alokasi per tier. Thread 🧵',
    },
    {
      platform: 'Newsletter',
      template:
        'Halo {nama}, minggu ini fokus ke tier {tier}. Target ideal {target}%. Simak 3 cara naik level tanpa naik utang.',
    },
  ];

  return {
    generatedAt: new Date().toISOString(),
    focusTier: weakestTierId || null,
    position: 'SaaS budgeting yang menyusun ulang keuanganmu mengikuti Piramida Maslow × Piramida Keuangan — transparan berkat blockchain, pintar berkat AI.',
    audience: 'Pekerja muda, freelancer, pasangan baru, dan creator yang ingin financial clarity tanpa ribet.',
    funnel,
    pillars,
    calendar,
    copyTemplates,
    kpis: ['Trial signup', 'Activation (isi 5 tx)', 'Weekly active', 'Referral per user'],
  };
}

/* ----------------------------------------------------------------- *
 * REAL-TIME DATA — KHL (logam mulia) + aset & makro/siklus ekonomi
 * Di-fetch server-side (bebas CORS) dengan cache & fallback.
 * ----------------------------------------------------------------- */
function computePhase(ind) {
  const inf = ind.inflation, gdp = ind.gdpGrowth, ur = ind.unemployment, rt = ind.interestRate;
  const highInfl = inf != null && inf > 4.5;
  const lowGdp = gdp != null && gdp < 3;
  const strongGdp = gdp != null && gdp > 5;
  let name, label, desc, budgeting;
  if (inf == null && gdp == null && ur == null) {
    name = 'unknown'; label = 'Fase Tidak Diketahui';
    desc = 'Data makro belum tersedia. Mulai dari tier Safety (dana darurat) sebagai fondasi.';
    budgeting = 'Gunakan pendekatan bertahap: penuhi Physiological & Safety dulu sebelum gaya hidup.';
  } else if (highInfl && lowGdp) {
    name = 'contraction'; label = 'Kontraksi / Stagflasi';
    desc = 'Inflasi tinggi diiringi pertumbuhan lambat. Daya beli tertekan.';
    budgeting = 'Perbesar tier Safety (dana darurat 6–12 bln), tahan pembelian aset besar (tanah/properti), kurangi Belonging. Emas/logam mulia jadi lindung nilai.';
  } else if (highInfl && !strongGdp) {
    name = 'peak'; label = 'Puncak Siklus (Inflasi Tinggi)';
    desc = 'Ekonomi tumbuh tapi inflasi merangkak; bank sentral cenderung naikkan suku bunga.';
    budgeting = 'Kunci dana darurat, hindari utang konsumtif baru, jaga likuiditas. Alokasi ke logam mulia & SBN sebagai pelindung.';
  } else if (strongGdp && !highInfl) {
    name = 'expansion'; label = 'Ekspansi';
    desc = 'Pertumbuhan kuat, inflasi terkendali. Waktu membangun kekayaan.';
    budgeting = 'Setelah dana darurat aman, naikkan tier Esteem & Self-Actualization: investasi, aset, proteksi diri.';
  } else {
    name = 'recovery'; label = 'Pemulihan';
    desc = 'Ekonomi mulai bangkit dari fase lemah, inflasi mulai dingin.';
    budgeting = 'Bangun kembali dana darurat, diversifikasi ke emas & instrumen negara (SBN), naikkan investasi bertahap.';
  }
  return { name, label, desc, budgeting };
}

async function fetchJSON(url, ms = 9000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    const r = await fetch(url, { signal: ctrl.signal });
    if (!r.ok) throw new Error('http');
    return await r.json();
  } finally {
    clearTimeout(t);
  }
}

const marketCache = { at: 0, data: null };
async function fetchMarket() {
  const now = Date.now();
  if (marketCache.data && now - marketCache.at < 60000) return { ...marketCache.data, cached: true };
  try {
    const [g, sx, fx, cg] = await Promise.allSettled([
      fetchJSON('https://api.gold-api.com/price/XAU'),
      fetchJSON('https://api.gold-api.com/price/XAG'),
      fetchJSON('https://open.er-api.com/v6/latest/USD'),
      fetchJSON('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=idr'),
    ]);
    const gold = g.status === 'fulfilled' ? g.value : null;
    const silv = sx.status === 'fulfilled' ? sx.value : null;
    const fxj = fx.status === 'fulfilled' ? fx.value : null;
    const cgj = cg.status === 'fulfilled' ? cg.value : null;
    const usdIdr = (fxj && fxj.rates && fxj.rates.IDR) || 15500;
    const ozToGram = 31.1035;
    const data = {
      updatedAt: new Date().toISOString(),
      usdIdr,
      gold: gold ? { usdPerOz: gold.price, idrPerGram: Math.round((gold.price / ozToGram) * usdIdr), changePct: gold.change } : null,
      silver: silv ? { usdPerOz: silv.price, idrPerGram: Math.round((silv.price / ozToGram) * usdIdr), changePct: silv.change } : null,
      crypto: {
        btc: cgj && cgj.bitcoin ? Math.round(cgj.bitcoin.idr) : null,
        eth: cgj && cgj.ethereum ? Math.round(cgj.ethereum.idr) : null,
      },
      status: gold || silv || cgj ? 'live' : 'fallback',
    };
    marketCache.data = data;
    marketCache.at = now;
    return { ...data, cached: false };
  } catch (e) {
    return marketCache.data || { updatedAt: new Date().toISOString(), usdIdr: 15500, gold: null, crypto: { btc: null, eth: null }, status: 'fallback' };
  }
}

async function fetchWB(ind) {
  const j = await fetchJSON(`https://api.worldbank.org/v2/country/IDN/indicator/${ind}?format=json&date=2000:2024&per_page=100`);
  if (!Array.isArray(j) || !j[1]) return null;
  const rows = j[1].filter((x) => x.value != null).sort((a, b) => Number(b.date) - Number(a.date));
  return rows.length ? { year: rows[0].date, value: rows[0].value } : null;
}

const macroCache = { at: 0, data: null };
async function fetchMacro() {
  const now = Date.now();
  if (macroCache.data && now - macroCache.at < 600000) return { ...macroCache.data, cached: true };
  try {
    const [inf, gdp, ur, rt] = await Promise.allSettled([
      fetchWB('FP.CPI.TOTL.ZG'),
      fetchWB('NY.GDP.MKTP.KD.ZG'),
      fetchWB('SL.UEM.TOTL.ZS'),
      fetchWB('FR.INR.RINR'),
    ]);
    const ind = {
      inflation: inf.status === 'fulfilled' && inf.value ? inf.value.value : null,
      gdpGrowth: gdp.status === 'fulfilled' && gdp.value ? gdp.value.value : null,
      unemployment: ur.status === 'fulfilled' && ur.value ? ur.value.value : null,
      interestRate: rt.status === 'fulfilled' && rt.value ? rt.value.value : null,
    };
    ind.years = {
      inflation: inf.value?.year,
      gdpGrowth: gdp.value?.year,
      unemployment: ur.value?.year,
      interestRate: rt.value?.year,
    };
    ind.phase = computePhase(ind);
    macroCache.data = ind;
    macroCache.at = now;
    return { ...ind, cached: false, updatedAt: new Date().toISOString() };
  } catch (e) {
    return macroCache.data || { inflation: null, gdpGrowth: null, unemployment: null, interestRate: null, phase: computePhase({}), updatedAt: new Date().toISOString() };
  }
}

/* ----------------------------------------------------------------- *
 * HTTP / API
 * ----------------------------------------------------------------- */
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

function sendJson(res, code, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(code, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  res.end(body);
}

function readBody(req) {
  return new Promise((resolve) => {
    let data = '';
    req.on('data', (c) => (data += c));
    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch {
        resolve({});
      }
    });
  });
}

function serveStatic(req, res, urlPath) {
  let filePath = path.join(PUBLIC_DIR, urlPath === '/' ? 'index.html' : urlPath);
  // cegah path traversal
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    return res.end('Forbidden');
  }
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    return res.end('Not found');
  }
  const ext = path.extname(filePath);
  res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
  fs.createReadStream(filePath).pipe(res);
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    return res.end();
  }

  // ---- API ----
  if (pathname.startsWith('/api/')) {
    try {
      if (pathname === '/api/state' && req.method === 'GET') {
        return sendJson(res, 200, computeState());
      }

      if (pathname === '/api/household' && req.method === 'POST') {
        const body = await readBody(req);
        db.household = {
          name: String(body.name ?? db.household.name).slice(0, 80),
          income: Math.max(0, Number(body.income) || 0),
          currency: String(body.currency ?? db.household.currency).slice(0, 5) || 'IDR',
        };
        saveDb();
        return sendJson(res, 200, { ok: true, household: db.household });
      }

      if (pathname === '/api/transaction' && req.method === 'POST') {
        const body = await readBody(req);
        const amount = Math.max(0, Number(body.amount) || 0);
        const tier = TIER_IDS.includes(body.tier) ? body.tier : 'physiological';
        const kind = body.kind === 'income' ? 'income' : 'expense';
        const block = createBlock(db.chain.length, db.chain[db.chain.length - 1].hash, {
          type: 'tx',
          kind,
          amount,
          tier,
          category: String(body.category ?? '').slice(0, 60),
          note: String(body.note ?? '').slice(0, 200),
        });
        db.chain.push(block);
        saveDb();
        return sendJson(res, 201, { ok: true, block, state: computeState() });
      }

      if (pathname === '/api/chain' && req.method === 'GET') {
        const valid = verifyChain(db.chain);
        return sendJson(res, 200, { chain: db.chain, valid, blockCount: db.chain.length });
      }

      if (pathname === '/api/ai/advice' && req.method === 'POST') {
        return sendJson(res, 200, aiAdvice());
      }

      if (pathname === '/api/marketing' && req.method === 'GET') {
        const weakest = computeState().allocations.slice().sort((a, b) => a.score - b.score)[0];
        return sendJson(res, 200, marketingStrategy(weakest ? weakest.id : null));
      }

      if (pathname === '/api/market' && req.method === 'GET') {
        return sendJson(res, 200, await fetchMarket());
      }

      if (pathname === '/api/macro' && req.method === 'GET') {
        return sendJson(res, 200, await fetchMacro());
      }

      if (pathname === '/api/reset' && req.method === 'DELETE') {
        db = blankDb();
        saveDb();
        return sendJson(res, 200, { ok: true });
      }

      return sendJson(res, 404, { error: 'Endpoint tidak ditemukan' });
    } catch (err) {
      return sendJson(res, 500, { error: err.message });
    }
  }

  // ---- STATIC ----
  return serveStatic(req, res, pathname);
});

/* ----------------------------------------------------------------- *
 * Verifikasi integritas rantai
 * ----------------------------------------------------------------- */
function verifyChain(chain) {
  for (let i = 1; i < chain.length; i += 1) {
    const prev = chain[i - 1];
    const cur = chain[i];
    const base = JSON.stringify(cur.data);
    const payload = cur.index + cur.timestamp + base + cur.previousHash;
    const { hash } = mineHash(payload);
    if (hash !== cur.hash) return false;
    if (cur.previousHash !== prev.hash) return false;
    if (!cur.hash.startsWith('0'.repeat(DIFFICULTY))) return false;
  }
  return true;
}

/* ----------------------------------------------------------------- *
 * START
 * ----------------------------------------------------------------- */
loadDb();
server.listen(PORT, () => {
  console.log(`\n  PyraBudget berjalan di  http://localhost:${PORT}`);
  console.log(`  Blockchain: ${db.chain.length} blok  |  Difficulty PoW: ${DIFFICULTY}`);
  console.log(`  DB: ${DB_FILE}\n`);
});
