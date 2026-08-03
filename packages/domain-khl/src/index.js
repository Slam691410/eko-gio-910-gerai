/**
 * PAKET DOMAIN: KHL (Kebutuhan Hidup Layak) — modul M-01.
 *
 * PENTING: KHL adalah standar PENGELUARAN layak per bulan.
 * KHL BUKAN aset. Emas, perak, tanah, properti, SBN, reksadana, saham = ASET (modul M-02).
 * Dua-duanya ada di aplikasi ini, bukan salah satu.
 *
 * Seluruh rumus di paket ini murni fungsi tanpa efek samping, supaya bisa dites
 * satu per satu dan dipakai baik di server (Node) maupun di dalam preview.html
 * (disuntik oleh apps/preview/bangun-preview.js).
 */

export { ART_ACUAN, ART_BEKERJA_ACUAN, konsumsiPerKapita, hitungKhlAcuan } from './rumus/hitung-khl-acuan.js';
export { hitungKesenjangan, kesenjanganPerOrang } from './rumus/hitung-kesenjangan.js';
export { STATUS_KHL, tentukanStatus } from './rumus/tentukan-status.js';
export { PERSEN_TABUNGAN, PERSEN_JAMINAN_SOSIAL, hitungKhlSurvei } from './rumus/hitung-khl-survei.js';
export { proyeksiTahunTercapai, kenaikanDibutuhkan } from './rumus/proyeksi-tahun-tercapai.js';
export { rencanaTutupKesenjangan } from './rumus/rencana-tutup-kesenjangan.js';
export { MODE, ALOKASI_PER_FASE, PRIORITAS_BAWAH_KHL, tentukanMode, susunAlokasi } from './aturan/mode-anggaran.js';
export { MODUL_INVESTASI, KALIMAT_TERLARANG, kunciModulInvestasi, periksaKalimat } from './aturan/kunci-modul-investasi.js';

import { hitungKhlAcuan } from './rumus/hitung-khl-acuan.js';
import { hitungKesenjangan, kesenjanganPerOrang } from './rumus/hitung-kesenjangan.js';
import { tentukanStatus } from './rumus/tentukan-status.js';
import { proyeksiTahunTercapai } from './rumus/proyeksi-tahun-tercapai.js';
import { rencanaTutupKesenjangan } from './rumus/rencana-tutup-kesenjangan.js';
import { susunAlokasi } from './aturan/mode-anggaran.js';
import { kunciModulInvestasi } from './aturan/kunci-modul-investasi.js';

/**
 * Satu pintu: dari data provinsi + data rumah tangga -> seluruh hasil M-01.
 */
export function analisisKhl({
  khlProvinsi,
  umpProvinsi = 0,
  namaProvinsi = '',
  jumlahArt = 4,
  artBekerja = 1,
  penghasilanBersihRt = 0,
  cicilanWajib = 0,
  faseEkonomi = 'ekspansi',
  punyaBpjs = false,
  kenaikanPenghasilanTahunan = 0.06,
  kenaikanKhlTahunan = 0.05
}) {
  const acuan = hitungKhlAcuan({ khlProvinsi, jumlahArt, artBekerja });
  const gap = hitungKesenjangan({
    khlRumahTangga: acuan.khlRumahTangga,
    penghasilanBersihRt
  });
  const status = tentukanStatus(gap.rasioPemenuhan);
  const kunci = kunciModulInvestasi({ rasioPemenuhan: gap.rasioPemenuhan });
  const alokasi = susunAlokasi({
    penghasilanBersihRt,
    khlRumahTangga: acuan.khlRumahTangga,
    cicilanWajib,
    faseEkonomi,
    rasioPemenuhan: gap.rasioPemenuhan
  });
  const proyeksi = proyeksiTahunTercapai({
    khlRumahTangga: acuan.khlRumahTangga,
    penghasilanBersihRt,
    kenaikanPenghasilanTahunan,
    kenaikanKhlTahunan
  });
  const rencana = rencanaTutupKesenjangan({
    kesenjangan: gap.kesenjangan,
    khlRumahTangga: acuan.khlRumahTangga,
    penghasilanBersihRt,
    jumlahArt,
    artBekerja,
    umpProvinsi,
    punyaBpjs
  });

  return {
    provinsi: namaProvinsi,
    khlProvinsi,
    umpProvinsi,
    umpMenutupiKhl: umpProvinsi > 0 ? umpProvinsi >= khlProvinsi : null,
    ...acuan,
    ...gap,
    kesenjanganPerOrang: kesenjanganPerOrang({ kesenjangan: gap.kesenjangan, jumlahArt }),
    status,
    kunciInvestasi: kunci,
    anggaran: alokasi,
    proyeksi,
    rencana,
    dihitungPada: new Date().toISOString()
  };
}
