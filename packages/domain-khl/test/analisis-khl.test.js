import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { analisisKhl } from '../src/index.js';
import { hitungKhlSurvei } from '../src/rumus/hitung-khl-survei.js';
import { proyeksiTahunTercapai } from '../src/rumus/proyeksi-tahun-tercapai.js';
import { rencanaTutupKesenjangan } from '../src/rumus/rencana-tutup-kesenjangan.js';

const AKAR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const indeks = JSON.parse(fs.readFileSync(path.join(AKAR, 'data/khl/2026/indeks.json'), 'utf8'));
const komponen = JSON.parse(fs.readFileSync(path.join(AKAR, 'data/khl/2026/komponen-64.json'), 'utf8'));

test('data acuan: 38 provinsi tersedia', () => {
  assert.equal(indeks.provinsi.length, 38);
  for (const p of indeks.provinsi) {
    assert.ok(p.khl > 1000000, `KHL ${p.nama} tidak masuk akal`);
    assert.ok(p.ump > 1000000, `UMP ${p.nama} tidak masuk akal`);
  }
});

test('data acuan: komponen KHL berjumlah 64 sesuai Permenaker 18/2020', () => {
  assert.equal(komponen.jumlah_komponen, 64);
  assert.equal(komponen.komponen.length, 64);
  const jumlahPerKelompok = komponen.kelompok.reduce((a, k) => a + k.jumlah, 0);
  assert.equal(jumlahPerKelompok, 64);
});

test('kenyataan pahit: mayoritas provinsi punya UMP di bawah KHL', () => {
  const dibawah = indeks.provinsi.filter((p) => p.ump < p.khl);
  assert.ok(dibawah.length >= 30, `hanya ${dibawah.length} provinsi yang UMP-nya di bawah KHL`);
  const jakarta = indeks.provinsi.find((p) => p.kode === '31');
  assert.ok(jakarta.ump < jakarta.khl, 'UMP Jakarta seharusnya masih di bawah KHL Jakarta');
});

test('kriteria terima M-01.10: Jakarta, 4 orang, 1 bekerja, penghasilan Rp 4,2 juta', () => {
  const jakarta = indeks.provinsi.find((p) => p.kode === '31');
  const h = analisisKhl({
    khlProvinsi: jakarta.khl,
    umpProvinsi: jakarta.ump,
    namaProvinsi: jakarta.nama,
    jumlahArt: 4,
    artBekerja: 1,
    penghasilanBersihRt: 4200000
  });
  assert.equal(h.khlRumahTangga, 5898511);
  assert.equal(h.kesenjangan, 1698511);
  assert.equal(h.persenPemenuhan, 71.2);
  assert.equal(h.status.kode, 'DI_BAWAH_KHL');
  assert.equal(h.anggaran.mode, 'BERTAHAN');
  assert.equal(h.kunciInvestasi.terkunci, true);
  assert.equal(h.rencana.perlu, true);
  assert.ok(h.rencana.langkah.length >= 3);
});

test('rumah tangga mapan di Jawa Tengah membuka mode bertumbuh', () => {
  const jateng = indeks.provinsi.find((p) => p.kode === '33');
  const h = analisisKhl({
    khlProvinsi: jateng.khl,
    umpProvinsi: jateng.ump,
    namaProvinsi: jateng.nama,
    jumlahArt: 3,
    artBekerja: 2,
    penghasilanBersihRt: 12000000,
    cicilanWajib: 1000000,
    faseEkonomi: 'pemulihan'
  });
  assert.equal(h.status.kode, 'LAYAK_SURPLUS');
  assert.equal(h.kunciInvestasi.terkunci, false);
  assert.equal(h.anggaran.investasiDibuka, true);
  assert.ok(h.anggaran.alokasi.investasiBertumbuh > 0);
});

test('survei mandiri 64 komponen menambahkan 2% tabungan + 2% jaminan sosial', () => {
  const isian = [
    { kelompok: 'makanan_minuman', nama: 'Beras', satuan: 'kg', kuantitas: 10, harga: 14000 },
    { kelompok: 'perumahan', nama: 'Sewa kamar', satuan: 'bulan', kuantitas: 1, harga: 1000000 },
    { kelompok: 'sandang', nama: 'Sepatu', satuan: 'pasang/tahun', kuantitas: 12, harga: 200000 },
    { kelompok: 'rekreasi_tabungan', nama: 'Tabungan', satuan: 'persen', kuantitas: 2, harga: 0 }
  ];
  const h = hitungKhlSurvei(isian);
  assert.equal(h.subtotal, 140000 + 1000000 + 200000);
  assert.equal(h.tabungan, Math.round(h.subtotal * 0.02));
  assert.equal(h.khlSurvei, Math.round(h.subtotal * 1.04));
  assert.equal(h.lengkap, false);
});

test('proyeksi jujur: kalau penghasilan naik lebih lambat dari KHL, jarak tidak tertutup', () => {
  const p = proyeksiTahunTercapai({
    khlRumahTangga: 5898511,
    penghasilanBersihRt: 4200000,
    kenaikanPenghasilanTahunan: 0.03,
    kenaikanKhlTahunan: 0.05
  });
  assert.equal(p.tercapai, false);
  assert.ok(p.alasan.includes('menaikkan penghasilan'));
});

test('rencana tidak menyuruh berhemat, tapi menambah penghasilan & hak', () => {
  const r = rencanaTutupKesenjangan({
    kesenjangan: 1698511,
    khlRumahTangga: 5898511,
    penghasilanBersihRt: 4200000,
    jumlahArt: 4,
    artBekerja: 1,
    umpProvinsi: 5729876,
    punyaBpjs: false
  });
  const kode = r.langkah.map((l) => l.kode);
  assert.ok(kode.includes('TAMBAH_PENCARI_NAFKAH'));
  assert.ok(kode.includes('NAIK_KE_UMP'));
  assert.ok(kode.includes('BPJS'));
  const teks = JSON.stringify(r).toLowerCase();
  for (const larangan of ['kurangi ngopi', 'jangan jajan', 'anda boros', 'makanya nabung']) {
    assert.ok(!teks.includes(larangan), `rencana tidak boleh memuat "${larangan}"`);
  }
  assert.ok(teks.includes('penghasilan tambahan'), 'rencana wajib menawarkan penghasilan tambahan');
});
