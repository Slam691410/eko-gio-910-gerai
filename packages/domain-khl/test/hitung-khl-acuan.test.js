import test from 'node:test';
import assert from 'node:assert/strict';
import { hitungKhlAcuan, konsumsiPerKapita, ART_ACUAN } from '../src/rumus/hitung-khl-acuan.js';

const KHL_JAKARTA = 5898511;

test('konsumsi per kapita = KHL / ART acuan', () => {
  assert.equal(konsumsiPerKapita(KHL_JAKARTA), KHL_JAKARTA / 4);
});

test('rumah tangga acuan (4 orang, 1 bekerja) menghasilkan KHL provinsi apa adanya', () => {
  const h = hitungKhlAcuan({ khlProvinsi: KHL_JAKARTA, jumlahArt: 4, artBekerja: 1 });
  assert.equal(h.khlRumahTangga, KHL_JAKARTA);
  assert.equal(h.khlPerPekerja, KHL_JAKARTA);
  assert.equal(h.disesuaikan, false);
});

test('rumah tangga lebih besar menaikkan KHL secara proporsional', () => {
  const h = hitungKhlAcuan({ khlProvinsi: KHL_JAKARTA, jumlahArt: 6, artBekerja: 2 });
  assert.equal(h.khlRumahTangga, Math.round((KHL_JAKARTA / 4) * 6));
  assert.equal(h.khlPerPekerja, Math.round(h.khlRumahTangga / 2));
  assert.equal(h.disesuaikan, true);
});

test('lajang (1 orang) memakai satu bagian konsumsi per kapita', () => {
  const h = hitungKhlAcuan({ khlProvinsi: KHL_JAKARTA, jumlahArt: 1, artBekerja: 1 });
  assert.equal(h.khlRumahTangga, Math.round(KHL_JAKARTA / 4));
});

test('ART bekerja tidak boleh melebihi jumlah ART', () => {
  assert.throws(() => hitungKhlAcuan({ khlProvinsi: KHL_JAKARTA, jumlahArt: 2, artBekerja: 3 }));
});

test('menolak KHL provinsi tidak masuk akal', () => {
  assert.throws(() => hitungKhlAcuan({ khlProvinsi: 0 }));
  assert.throws(() => hitungKhlAcuan({ khlProvinsi: -1 }));
});

test('ART acuan aplikasi adalah 4 orang', () => {
  assert.equal(ART_ACUAN, 4);
});
