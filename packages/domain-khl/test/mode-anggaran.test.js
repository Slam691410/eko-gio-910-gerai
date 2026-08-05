import test from 'node:test';
import assert from 'node:assert/strict';
import { tentukanMode, susunAlokasi, ALOKASI_PER_FASE, MODE } from '../src/aturan/mode-anggaran.js';

test('mode ditentukan rasio KHL, bukan rumus 50/30/20', () => {
  assert.equal(tentukanMode({ rasioPemenuhan: 0.5, sisaSetelahKhl: -100 }), MODE.BERTAHAN);
  assert.equal(tentukanMode({ rasioPemenuhan: 0.9, sisaSetelahKhl: -50 }), MODE.STABILISASI);
  assert.equal(tentukanMode({ rasioPemenuhan: 1.4, sisaSetelahKhl: 2000000 }), MODE.BERTUMBUH);
});

test('di atas KHL tapi tanpa sisa tetap masuk stabilisasi', () => {
  assert.equal(tentukanMode({ rasioPemenuhan: 1.1, sisaSetelahKhl: 0 }), MODE.STABILISASI);
});

test('setiap fase ekonomi berjumlah 100 persen', () => {
  for (const [fase, pos] of Object.entries(ALOKASI_PER_FASE)) {
    const jml = Object.values(pos).reduce((a, b) => a + b, 0);
    assert.equal(jml, 100, `fase ${fase} berjumlah ${jml}, seharusnya 100`);
  }
});

test('di bawah KHL: investasi ditutup dan alokasi investasi nol', () => {
  const r = susunAlokasi({
    penghasilanBersihRt: 4200000,
    khlRumahTangga: 5898511,
    cicilanWajib: 0,
    faseEkonomi: 'ekspansi'
  });
  assert.equal(r.mode, MODE.BERTAHAN);
  assert.equal(r.investasiDibuka, false);
  assert.equal(r.alokasi.investasiBertumbuh, 0);
  assert.ok(r.prioritas.length >= 5);
});

test('di atas KHL: alokasi dihitung dari SISA setelah KHL dan cicilan', () => {
  const r = susunAlokasi({
    penghasilanBersihRt: 15000000,
    khlRumahTangga: 5898511,
    cicilanWajib: 2000000,
    faseEkonomi: 'kontraksi'
  });
  assert.equal(r.mode, MODE.BERTUMBUH);
  assert.equal(r.sisa, 15000000 - 5898511 - 2000000);
  assert.equal(r.alokasi.danaDarurat, Math.round(r.sisa * 0.35));
  const total = Object.values(r.alokasi).reduce((a, b) => a + b, 0);
  assert.ok(Math.abs(total - r.sisa) <= 2, 'pembulatan alokasi tidak boleh meleset lebih dari 2 rupiah');
});

test('fase tak dikenal jatuh ke ekspansi, tidak melempar galat', () => {
  const r = susunAlokasi({
    penghasilanBersihRt: 10000000,
    khlRumahTangga: 4000000,
    faseEkonomi: 'entah-apa'
  });
  assert.equal(r.persen.investasiBertumbuh, 65);
});
