#!/usr/bin/env node
/**
 * PEMBANGUN PREVIEW
 * =================
 * preview.html harus tetap satu berkas yang bisa dibuka langsung (termasuk lewat file://),
 * TAPI rumus tidak boleh lagi ditulis ulang di dalamnya. Skrip ini menyuntikkan:
 *
 *   1. Data acuan KHL & UMP 38 provinsi + 64 komponen  -> dari data/khl, data/ump
 *   2. Seluruh rumus paket packages/domain-khl          -> dibungkus menjadi objek global `KHL`
 *
 * Dengan begini satu rumus hanya ada di SATU berkas (dan punya tesnya sendiri),
 * sementara preview tetap bisa Anda buka langsung di chat.
 *
 * Jalankan: node apps/preview/bangun-preview.js
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const AKAR = path.resolve(__dirname, '..', '..');
const BERKAS_PREVIEW = path.join(AKAR, 'preview.html');

const MULAI = '/* PB:SUNTIK-KHL:MULAI */';
const SELESAI = '/* PB:SUNTIK-KHL:SELESAI */';

/** Urutan berkas penting: konstanta dulu, baru yang memakainya. */
const BERKAS_DOMAIN = [
  'packages/domain-khl/src/rumus/hitung-khl-acuan.js',
  'packages/domain-khl/src/rumus/hitung-kesenjangan.js',
  'packages/domain-khl/src/rumus/tentukan-status.js',
  'packages/domain-khl/src/rumus/hitung-khl-survei.js',
  'packages/domain-khl/src/rumus/proyeksi-tahun-tercapai.js',
  'packages/domain-khl/src/rumus/rencana-tutup-kesenjangan.js',
  'packages/domain-khl/src/aturan/mode-anggaran.js',
  'packages/domain-khl/src/aturan/kunci-modul-investasi.js',
  'packages/domain-khl/src/index.js'
];

const namaEkspor = new Set();

function bersihkanModul(isi) {
  const baris = isi.split('\n');
  const keluar = [];
  for (const b of baris) {
    // buang seluruh baris import & re-export
    if (/^\s*import\s/.test(b)) continue;
    if (/^\s*export\s*\{/.test(b)) continue;
    if (/^\s*export\s+\*/.test(b)) continue;
    // catat nama yang diekspor lalu hapus kata kunci export
    const m = b.match(/^\s*export\s+(?:async\s+)?(function|const|let|class)\s+([A-Za-z0-9_$]+)/);
    if (m) namaEkspor.add(m[2]);
    keluar.push(b.replace(/^(\s*)export\s+/, '$1'));
  }
  return keluar.join('\n');
}

function bacaJson(rel) {
  return JSON.parse(fs.readFileSync(path.join(AKAR, rel), 'utf8'));
}

// ---------- 1. Data ----------
const indeksKhl = bacaJson('data/khl/2026/indeks.json');
const komponen = bacaJson('data/khl/2026/komponen-64.json');
const asumsi = bacaJson('data/khl/2026/asumsi.json');

const DATA = {
  tahun: indeksKhl.tahun,
  meta: indeksKhl.meta,
  provinsi: indeksKhl.provinsi,
  komponen,
  asumsi
};

// ---------- 2. Rumus ----------
const potongan = BERKAS_DOMAIN.map((rel) => {
  const isi = fs.readFileSync(path.join(AKAR, rel), 'utf8');
  return `/* --- ${rel} --- */\n${bersihkanModul(isi)}`;
}).join('\n\n');

const daftarEkspor = [...namaEkspor].sort();

const blok = `${MULAI}
      /* ==========================================================================
         DISUNTIK OTOMATIS oleh apps/preview/bangun-preview.js — JANGAN EDIT DI SINI.
         Sumber rumus : packages/domain-khl/src/**  (punya tes di packages/domain-khl/test)
         Sumber data  : data/khl/2026/**, data/ump/2026/**
         Dibangun     : ${new Date().toISOString()}

         KHL = KEBUTUHAN HIDUP LAYAK (standar pengeluaran layak per bulan).
         KHL BUKAN aset. Emas/perak/tanah/properti/SBN/reksadana = ASET (modul M-02).
         Keduanya ada di aplikasi ini, bukan salah satu.
         ========================================================================== */
      const KHL = (function () {
        const DATA_KHL = ${JSON.stringify(DATA)};

${potongan
  .split('\n')
  .map((b) => (b.trim() ? '        ' + b : b))
  .join('\n')}

        return { DATA_KHL, ${daftarEkspor.join(', ')} };
      })();
      ${SELESAI}`;

// ---------- 3. Suntik ----------
let html = fs.readFileSync(BERKAS_PREVIEW, 'utf8');
const iMulai = html.indexOf(MULAI);
const iSelesai = html.indexOf(SELESAI);
if (iMulai === -1 || iSelesai === -1) {
  console.error(`✖ Penanda ${MULAI} / ${SELESAI} tidak ditemukan di preview.html`);
  process.exit(1);
}
html = html.slice(0, iMulai) + blok + html.slice(iSelesai + SELESAI.length);
fs.writeFileSync(BERKAS_PREVIEW, html, 'utf8');

console.log('✔ preview.html diperbarui');
console.log(`  • ${BERKAS_DOMAIN.length} berkas rumus disuntik (${daftarEkspor.length} nama diekspor)`);
console.log(`  • ${DATA.provinsi.length} provinsi + ${komponen.jumlah_komponen} komponen KHL`);
console.log(`  • ukuran preview.html: ${(html.length / 1024).toFixed(1)} KB`);
