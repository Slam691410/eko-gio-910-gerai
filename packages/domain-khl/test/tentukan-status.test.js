import test from 'node:test';
import assert from 'node:assert/strict';
import { tentukanStatus, STATUS_KHL } from '../src/rumus/tentukan-status.js';

test('batas-batas status sesuai spesifikasi M-01.6', () => {
  assert.equal(tentukanStatus(0).kode, 'KRITIS');
  assert.equal(tentukanStatus(0.59).kode, 'KRITIS');
  assert.equal(tentukanStatus(0.6).kode, 'DI_BAWAH_KHL');
  assert.equal(tentukanStatus(0.712).kode, 'DI_BAWAH_KHL');
  assert.equal(tentukanStatus(0.85).kode, 'MENDEKATI_KHL');
  assert.equal(tentukanStatus(0.999).kode, 'MENDEKATI_KHL');
  assert.equal(tentukanStatus(1).kode, 'LAYAK');
  assert.equal(tentukanStatus(1.49).kode, 'LAYAK');
  assert.equal(tentukanStatus(1.5).kode, 'LAYAK_SURPLUS');
  assert.equal(tentukanStatus(10).kode, 'LAYAK_SURPLUS');
});

test('setiap status punya penjelasan Bahasa Indonesia yang tidak kosong', () => {
  for (const s of STATUS_KHL) {
    assert.ok(s.penjelasan.length > 40, `penjelasan ${s.kode} terlalu pendek`);
    assert.ok(!/\b(you|your|the|budget)\b/i.test(s.label), `label ${s.kode} memakai istilah Inggris`);
  }
});

test('penjelasan tidak menyalahkan gaya hidup pengguna', () => {
  const semua = STATUS_KHL.map((s) => s.penjelasan.toLowerCase()).join(' ');
  for (const kalimat of ['boros', 'ngopi', 'jajan', 'malas']) {
    assert.ok(!semua.includes(kalimat), `penjelasan tidak boleh memuat kata "${kalimat}"`);
  }
});

test('menolak rasio tidak valid', () => {
  assert.throws(() => tentukanStatus(-1));
  assert.throws(() => tentukanStatus('abc'));
});
