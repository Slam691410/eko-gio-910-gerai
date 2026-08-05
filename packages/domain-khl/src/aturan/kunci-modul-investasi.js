/**
 * M-01.7 · Aturan keras produk ini:
 * selama penghasilan rumah tangga belum menutup Kebutuhan Hidup Layak,
 * modul investasi DITUTUP.
 *
 * Alasannya bukan moral, tapi matematis: menyisihkan uang untuk investasi
 * sementara kebutuhan dasar belum tertutup berarti menambal kekurangan itu
 * dengan utang berbunga, dan bunga utang konsumtif hampir selalu lebih besar
 * daripada imbal hasil investasi.
 *
 * Aplikasi juga DILARANG menyalahkan gaya hidup pengguna yang penghasilannya
 * di bawah KHL. Di 32 dari 38 provinsi, upah minimum resmi pun masih di bawah KHL.
 */

export const MODUL_INVESTASI = ['screening', 'fundamental', 'teknikal', 'dividen'];

export function kunciModulInvestasi({ rasioPemenuhan }) {
  const terkunci = Number(rasioPemenuhan) < 1;
  return {
    terkunci,
    modul: terkunci ? MODUL_INVESTASI.slice() : [],
    alasan: terkunci
      ? 'Penghasilan rumah tangga belum mencapai Kebutuhan Hidup Layak. ' +
        'Menutup kekurangan kebutuhan dasar lebih mendesak — dan lebih menguntungkan — ' +
        'daripada mengejar imbal hasil investasi.'
      : '',
    pesanSopan: terkunci
      ? 'Modul investasi dibuka otomatis begitu rasio pemenuhan KHL mencapai 100%.'
      : 'Modul investasi terbuka. Urutannya tetap: dana darurat dan proteksi dulu.'
  };
}

/** Kalimat yang tidak boleh dipakai aplikasi kepada pengguna di bawah KHL. */
export const KALIMAT_TERLARANG = [
  'kurangi ngopi',
  'berhenti jajan',
  'kamu boros',
  'makanya nabung',
  'investasi sekarang atau menyesal'
];

export function periksaKalimat(teks) {
  const rendah = String(teks).toLowerCase();
  const melanggar = KALIMAT_TERLARANG.filter((k) => rendah.includes(k));
  return { aman: melanggar.length === 0, melanggar };
}
