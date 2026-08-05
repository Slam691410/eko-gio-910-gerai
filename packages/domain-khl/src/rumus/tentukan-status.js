/**
 * M-01 · Status pemenuhan Kebutuhan Hidup Layak.
 *
 *   rasio < 0,60  -> KRITIS
 *   0,60 - 0,85   -> DI BAWAH KHL
 *   0,85 - 1,00   -> MENDEKATI KHL
 *   1,00 - 1,50   -> LAYAK
 *   > 1,50        -> LAYAK + SURPLUS
 */

export const STATUS_KHL = [
  {
    kode: 'KRITIS',
    label: 'KRITIS — jauh di bawah hidup layak',
    batasBawah: 0,
    batasAtas: 0.6,
    warna: 'merah',
    penjelasan:
      'Penghasilan rumah tangga belum menutup 60% kebutuhan hidup layak. Ini bukan soal gaya hidup; ' +
      'ini soal penghasilan yang memang belum cukup. Fokus: menambah penghasilan dan mengamankan ' +
      'pangan, tempat tinggal, serta jaminan kesehatan.'
  },
  {
    kode: 'DI_BAWAH_KHL',
    label: 'DI BAWAH KHL',
    batasBawah: 0.6,
    batasAtas: 0.85,
    warna: 'oranye',
    penjelasan:
      'Penghasilan masih di bawah standar Kebutuhan Hidup Layak provinsi Anda. Investasi ditunda ' +
      'dulu; yang lebih mendesak adalah menutup kekurangan kebutuhan dasar.'
  },
  {
    kode: 'MENDEKATI_KHL',
    label: 'MENDEKATI KHL',
    batasBawah: 0.85,
    batasAtas: 1.0,
    warna: 'kuning',
    penjelasan:
      'Tinggal sedikit lagi mencapai kebutuhan hidup layak. Amankan BPJS dan kumpulkan dana ' +
      'darurat satu bulan sebelum bicara investasi.'
  },
  {
    kode: 'LAYAK',
    label: 'LAYAK',
    batasBawah: 1.0,
    batasAtas: 1.5,
    warna: 'hijau',
    penjelasan:
      'Penghasilan sudah menutup Kebutuhan Hidup Layak. Sisa di atas KHL bisa mulai dialokasikan ' +
      'ke dana darurat, pelunasan utang, lalu investasi sesuai fase ekonomi.'
  },
  {
    kode: 'LAYAK_SURPLUS',
    label: 'LAYAK + SURPLUS',
    batasBawah: 1.5,
    batasAtas: Infinity,
    warna: 'biru',
    penjelasan:
      'Penghasilan jauh di atas Kebutuhan Hidup Layak. Ruang untuk membangun aset besar — ' +
      'dan untuk membantu orang lain yang penghasilannya masih di bawah KHL.'
  }
];

export function tentukanStatus(rasioPemenuhan) {
  const r = Number(rasioPemenuhan);
  if (!Number.isFinite(r) || r < 0) throw new Error('rasioPemenuhan tidak valid');
  const s = STATUS_KHL.find((x) => r >= x.batasBawah && r < x.batasAtas) || STATUS_KHL[STATUS_KHL.length - 1];
  return { kode: s.kode, label: s.label, warna: s.warna, penjelasan: s.penjelasan };
}
