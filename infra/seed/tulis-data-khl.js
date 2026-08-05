#!/usr/bin/env node
/**
 * Menulis data acuan KHL & UMP menjadi berkas per provinsi.
 * Satu provinsi = satu berkas, supaya perubahan angkanya terlacak di git
 * dan bisa diverifikasi satu per satu.
 *
 * Jalankan: node infra/seed/tulis-data-khl.js
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { META, PROVINSI } from './sumber-khl-ump-2026.js';
import { KELOMPOK, KOMPONEN } from './sumber-komponen-khl.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const AKAR = path.resolve(__dirname, '..', '..');
const DIR_KHL = path.join(AKAR, 'data', 'khl', String(META.tahun));
const DIR_UMP = path.join(AKAR, 'data', 'ump', String(META.tahun));

fs.mkdirSync(DIR_KHL, { recursive: true });
fs.mkdirSync(DIR_UMP, { recursive: true });

const tulis = (berkas, isi) =>
  fs.writeFileSync(berkas, JSON.stringify(isi, null, 2) + '\n', 'utf8');

const asumsi = META.asumsi_rumah_tangga_acuan;
const indeksKhl = [];
const indeksUmp = [];
let jumlahBerkas = 0;

for (const [kode, nama, slug, khl, ump, pulau] of PROVINSI) {
  const konsumsiPerKapita = Math.round((khl * asumsi.art_bekerja) / asumsi.jumlah_art);
  const selisih = ump - khl;

  tulis(path.join(DIR_KHL, `${kode}-${slug}.json`), {
    tahun: META.tahun,
    kode_provinsi: kode,
    nama_provinsi: nama,
    slug,
    pulau,
    khl_bulanan: khl,
    konsumsi_per_kapita_turunan: konsumsiPerKapita,
    asumsi_rumah_tangga: asumsi,
    sumber: META.khl.sumber,
    metode: META.khl.metode,
    kelompok_konsumsi: META.khl.kelompok_konsumsi,
    tanggal_rilis: META.khl.tanggal_rilis,
    terverifikasi: false,
    catatan_verifikasi: 'Salinan dari rilis Kemnaker. Cocokkan ulang dengan dokumen resmi.'
  });

  tulis(path.join(DIR_UMP, `${kode}-${slug}.json`), {
    tahun: META.tahun,
    kode_provinsi: kode,
    nama_provinsi: nama,
    slug,
    ump_bulanan: ump,
    khl_bulanan: khl,
    selisih_ump_khl: selisih,
    rasio_ump_terhadap_khl: Number((ump / khl).toFixed(4)),
    ump_menutupi_khl: ump >= khl,
    sumber: META.ump.sumber,
    dasar_hukum: META.ump.dasar,
    tanggal_rilis: META.ump.tanggal_rilis,
    terverifikasi: false
  });

  jumlahBerkas += 2;
  indeksKhl.push({ kode, nama, slug, pulau, khl, ump, konsumsiPerKapita });
  indeksUmp.push({ kode, nama, ump, khl, selisih });
}

// Indeks gabungan — dipakai aplikasi & skrip pembangun preview
tulis(path.join(DIR_KHL, 'indeks.json'), {
  tahun: META.tahun,
  jumlah_provinsi: indeksKhl.length,
  meta: META,
  provinsi: indeksKhl
});
tulis(path.join(DIR_UMP, 'indeks.json'), {
  tahun: META.tahun,
  jumlah_provinsi: indeksUmp.length,
  sumber: META.ump.sumber,
  provinsi: indeksUmp
});
tulis(path.join(DIR_KHL, 'komponen-64.json'), {
  dasar_hukum: 'Permenaker No. 18 Tahun 2020 (perubahan atas Permenaker No. 21 Tahun 2016)',
  tanggal_penetapan: '2020-10-09',
  jumlah_komponen: KOMPONEN.length,
  kelompok: KELOMPOK,
  komponen: KOMPONEN
});
tulis(path.join(DIR_KHL, 'asumsi.json'), {
  asumsi_rumah_tangga: asumsi,
  garis_kemiskinan_nasional: META.garis_kemiskinan_nasional,
  standar_hidup_layak_bps: META.standar_hidup_layak_bps
});
jumlahBerkas += 4;

// Ringkasan untuk dicetak
const dibawahKhl = indeksKhl.filter((p) => p.ump < p.khl);
console.log(`✔ ${jumlahBerkas} berkas data ditulis`);
console.log(`  data/khl/${META.tahun}/  (38 provinsi + indeks + komponen-64 + asumsi)`);
console.log(`  data/ump/${META.tahun}/  (38 provinsi + indeks)`);
console.log(`✔ Jumlah komponen KHL: ${KOMPONEN.length} (harus 64)`);
console.log(
  `⚠ ${dibawahKhl.length} dari ${indeksKhl.length} provinsi punya UMP DI BAWAH KHL` +
    ` — artinya upah minimum resmi pun belum mencapai kebutuhan hidup layak.`
);
