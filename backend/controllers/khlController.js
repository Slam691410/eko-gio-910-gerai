/**
 * KHL (Kebutuhan Hidup Layak) 2026 — Controller
 * ------------------------------------------------------------------
 * Diintegrasikan dari branch arena/019fc5bb (modul M-01 KHL):
 *   - Data resmi 38 provinsi (data/khl/2026 + data/ump/2026)
 *   - Paket rumus murni (packages/domain-khl, 9 rumus + 35 tes)
 *   - 5 endpoint: /api/khl/provinsi, /api/khl/provinsi/:kode,
 *     /api/khl/komponen, /api/khl/hitung, /api/khl/survei
 * Semua endpoint bersifat BACA & HITUNG (tidak menulis data), jadi
 * tidak diproteksi adminAuth — aman untuk publik.
 */
const fs = require('fs');
const path = require('path');
const { logEvent } = require('../config/db');
const { analisisKhl, hitungKhlSurvei } = require('../../packages/domain-khl/src/index.js');

const DATA_KHL_DIR = path.join(__dirname, '../../data/khl/2026');
const DATA_UMP_DIR = path.join(__dirname, '../../data/ump/2026');

let _cache = null;

function muatDataKhl() {
  if (_cache) return _cache;
  const baca = (dir, rel) => JSON.parse(fs.readFileSync(path.join(dir, rel), 'utf8'));

  const indeks = baca(DATA_KHL_DIR, 'indeks.json');
  const umpIndeks = baca(DATA_UMP_DIR, 'indeks.json');

  // Gabungkan nilai UMP dari indeks UMP 2026 ke daftar provinsi KHL
  // (data/ump/2026/indeks.json adalah sumber UMP resmi per provinsi).
  const umpByKode = new Map((umpIndeks.provinsi || []).map((p) => [p.kode, p]));
  indeks.provinsi = (indeks.provinsi || []).map((p) => {
    const u = umpByKode.get(p.kode);
    if (u) {
      return { ...p, ump: u.ump, selisih_ump_khl: u.selisih !== undefined ? u.selisih : u.ump - p.khl };
    }
    return p;
  });

  _cache = {
    indeks,
    komponen: baca(DATA_KHL_DIR, 'komponen-64.json'),
    asumsi: baca(DATA_KHL_DIR, 'asumsi.json')
  };
  return _cache;
}

// Validasi masukan untuk POST /api/khl/hitung (meniru perilaku asli)
function validasiMasukanKhl(body) {
  const galat = [];
  const angka = (v, nama, { min = 0, max = Number.MAX_SAFE_INTEGER, wajib = false } = {}) => {
    if (v === undefined || v === null || v === '') {
      if (wajib) galat.push(`${nama} wajib diisi`);
      return undefined;
    }
    const n = Number(v);
    if (!Number.isFinite(n)) { galat.push(`${nama} harus berupa angka`); return undefined; }
    if (n < min) { galat.push(`${nama} tidak boleh kurang dari ${min}`); return undefined; }
    if (n > max) { galat.push(`${nama} melebihi batas wajar`); return undefined; }
    return n;
  };

  const kode = typeof body.kode_provinsi === 'string' ? body.kode_provinsi.trim() : '';
  if (!/^\d{2}$/.test(kode)) galat.push('kode_provinsi harus 2 digit angka');

  const jumlahArt = angka(body.jumlah_art, 'jumlah_art', { min: 1, max: 20 }) ?? 4;
  const artBekerja = angka(body.art_bekerja, 'art_bekerja', { min: 0, max: 20 }) ?? 1;
  if (artBekerja > jumlahArt) galat.push('art_bekerja tidak boleh melebihi jumlah_art');

  const penghasilan = angka(body.penghasilan_bersih_rt, 'penghasilan_bersih_rt', { min: 0, max: 1e12 }) ?? 0;
  const cicilan = angka(body.cicilan_wajib, 'cicilan_wajib', { min: 0, max: 1e12 }) ?? 0;

  const faseSah = ['pemulihan', 'ekspansi', 'puncak', 'kontraksi', 'stagflasi'];
  const fase = typeof body.fase_ekonomi === 'string' && faseSah.includes(body.fase_ekonomi)
    ? body.fase_ekonomi : 'ekspansi';

  return {
    galat,
    nilai: { kode, jumlahArt, artBekerja, penghasilan, cicilan, fase, punyaBpjs: body.punya_bpjs === true }
  };
}

// GET /api/khl/provinsi — daftar 38 provinsi + selisih UMP vs KHL
function getProvinsiList(req, res) {
  const d = muatDataKhl();
  res.json({
    tahun: d.indeks.tahun,
    sumber: d.indeks.meta?.khl,
    sumber_ump: d.indeks.meta?.ump,
    asumsi: d.asumsi,
    jumlah: d.indeks.provinsi.length,
    provinsi: d.indeks.provinsi.map((p) => ({
      ...p,
      selisih_ump_khl: p.ump - p.khl,
      ump_menutupi_khl: p.ump >= p.khl
    }))
  });
}

// GET /api/khl/provinsi/:kode — detail satu provinsi
function getProvinsiDetail(req, res) {
  const kode = req.params.kode;
  if (!/^\d{2}$/.test(kode)) {
    return res.status(400).json({ error: 'kode provinsi harus 2 digit' });
  }
  const d = muatDataKhl();
  const p = d.indeks.provinsi.find((x) => x.kode === kode);
  if (!p) {
    return res.status(404).json({ error: 'Provinsi tidak ditemukan' });
  }
  res.json({ ...p, selisih_ump_khl: p.ump - p.khl, sumber: d.indeks.meta });
}

// GET /api/khl/komponen — 64 komponen KHL Permenaker 18/2020
function getKomponen(req, res) {
  res.json(muatDataKhl().komponen);
}

// POST /api/khl/hitung — analisis KHL rumah tangga
function hitungKhl(req, res) {
  const { galat, nilai } = validasiMasukanKhl(req.body || {});
  if (galat.length) {
    return res.status(400).json({ error: 'Masukan tidak valid', rincian: galat });
  }
  const d = muatDataKhl();
  const prov = d.indeks.provinsi.find((x) => x.kode === nilai.kode);
  if (!prov) {
    return res.status(404).json({ error: 'Provinsi tidak ditemukan' });
  }
  const hasil = analisisKhl({
    khlProvinsi: prov.khl,
    umpProvinsi: prov.ump,
    namaProvinsi: prov.nama,
    jumlahArt: nilai.jumlahArt,
    artBekerja: nilai.artBekerja,
    penghasilanBersihRt: nilai.penghasilan,
    cicilanWajib: nilai.cicilan,
    faseEkonomi: nilai.fase,
    punyaBpjs: nilai.punyaBpjs
  });
  logEvent('INFO', `[KHL 2026] Analisis KHL dihitung untuk ${prov.nama} (ART ${nilai.jumlahArt}, penghasilan Rp ${nilai.penghasilan}).`);
  res.json(hasil);
}

// POST /api/khl/survei — hitung KHL dari isian survei
function surveiKhl(req, res) {
  const body = req.body || {};
  if (!Array.isArray(body.isian)) {
    return res.status(400).json({ error: 'isian harus berupa array' });
  }
  if (body.isian.length > 200) {
    return res.status(400).json({ error: 'isian terlalu banyak' });
  }
  try {
    res.json(hitungKhlSurvei(body.isian));
  } catch (e) {
    res.status(400).json({ error: String(e.message || e) });
  }
}

module.exports = {
  getProvinsiList,
  getProvinsiDetail,
  getKomponen,
  hitungKhl,
  surveiKhl
};
