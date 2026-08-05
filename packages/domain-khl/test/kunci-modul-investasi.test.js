import test from 'node:test';
import assert from 'node:assert/strict';
import { kunciModulInvestasi, periksaKalimat, MODUL_INVESTASI } from '../src/aturan/kunci-modul-investasi.js';

test('di bawah KHL: seluruh modul investasi terkunci', () => {
  const k = kunciModulInvestasi({ rasioPemenuhan: 0.712 });
  assert.equal(k.terkunci, true);
  assert.deepEqual(k.modul, MODUL_INVESTASI);
  assert.ok(k.alasan.length > 30);
});

test('tepat di 100% KHL: modul investasi terbuka', () => {
  assert.equal(kunciModulInvestasi({ rasioPemenuhan: 1 }).terkunci, false);
  assert.equal(kunciModulInvestasi({ rasioPemenuhan: 0.9999 }).terkunci, true);
});

test('daftar modul yang dikunci mencakup dividen', () => {
  assert.ok(MODUL_INVESTASI.includes('dividen'));
  assert.ok(MODUL_INVESTASI.includes('fundamental'));
});

test('penyaring kalimat menolak nasihat yang menyalahkan pengguna', () => {
  assert.equal(periksaKalimat('Coba kurangi ngopi supaya bisa nabung').aman, false);
  assert.equal(periksaKalimat('Penghasilan Anda belum menutup KHL provinsi.').aman, true);
});
