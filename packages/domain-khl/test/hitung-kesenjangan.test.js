import test from 'node:test';
import assert from 'node:assert/strict';
import { hitungKesenjangan, kesenjanganPerOrang } from '../src/rumus/hitung-kesenjangan.js';

test('kasus nyata: Jakarta, penghasilan Rp 4,2 juta vs KHL Rp 5.898.511', () => {
  const h = hitungKesenjangan({ khlRumahTangga: 5898511, penghasilanBersihRt: 4200000 });
  assert.equal(h.kesenjangan, 1698511);
  assert.equal(h.kurang, true);
  assert.equal(h.persenPemenuhan, 71.2);
});

test('penghasilan di atas KHL menghasilkan surplus, bukan kekurangan', () => {
  const h = hitungKesenjangan({ khlRumahTangga: 4000000, penghasilanBersihRt: 6000000 });
  assert.equal(h.kurang, false);
  assert.equal(h.surplus, 2000000);
  assert.equal(h.kesenjangan, -2000000);
});

test('penghasilan tepat sama dengan KHL: rasio 1,0', () => {
  const h = hitungKesenjangan({ khlRumahTangga: 3500000, penghasilanBersihRt: 3500000 });
  assert.equal(h.rasioPemenuhan, 1);
  assert.equal(h.kesenjangan, 0);
});

test('tanpa penghasilan, kekurangan sama dengan seluruh KHL', () => {
  const h = hitungKesenjangan({ khlRumahTangga: 3054508, penghasilanBersihRt: 0 });
  assert.equal(h.kesenjangan, 3054508);
  assert.equal(h.persenPemenuhan, 0);
});

test('kekurangan dibagi rata per anggota rumah tangga', () => {
  assert.equal(kesenjanganPerOrang({ kesenjangan: 1698511, jumlahArt: 4 }), 424628);
});

test('menolak penghasilan negatif dan KHL nol', () => {
  assert.throws(() => hitungKesenjangan({ khlRumahTangga: 0, penghasilanBersihRt: 1 }));
  assert.throws(() => hitungKesenjangan({ khlRumahTangga: 100, penghasilanBersihRt: -5 }));
});
