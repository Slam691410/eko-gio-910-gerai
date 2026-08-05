/**
 * M-01 · Berapa lama lagi penghasilan mencapai KHL bila naik x% per tahun.
 *
 *   tahun = ln(KHL / penghasilan) / ln(1 + kenaikan_tahunan)
 *
 * KHL sendiri ikut naik tiap tahun. Kalau `kenaikanKhlTahunan` diisi, yang dipakai
 * adalah selisih pertumbuhan (pertumbuhan riil penghasilan terhadap KHL) — kalau
 * penghasilan naik lebih lambat daripada KHL, jaraknya justru melebar dan itu
 * dikatakan apa adanya.
 */

export function proyeksiTahunTercapai({
  khlRumahTangga,
  penghasilanBersihRt,
  kenaikanPenghasilanTahunan = 0.06,
  kenaikanKhlTahunan = 0
}) {
  if (!(khlRumahTangga > 0)) throw new Error('khlRumahTangga harus lebih besar dari 0');
  if (penghasilanBersihRt <= 0) {
    return { tercapai: false, tahun: null, alasan: 'Belum ada penghasilan tercatat.' };
  }
  if (penghasilanBersihRt >= khlRumahTangga) {
    return { tercapai: true, tahun: 0, alasan: 'Penghasilan sudah mencapai KHL.' };
  }

  const g = (1 + kenaikanPenghasilanTahunan) / (1 + kenaikanKhlTahunan) - 1;
  if (g <= 0) {
    return {
      tercapai: false,
      tahun: null,
      pertumbuhanRiil: Number(g.toFixed(4)),
      alasan:
        'Kenaikan penghasilan tidak melampaui kenaikan KHL. Dengan laju ini jaraknya tidak ' +
        'akan tertutup — yang dibutuhkan bukan berhemat, tapi menaikkan penghasilan atau ' +
        'menambah anggota rumah tangga yang bekerja.'
    };
  }

  const tahun = Math.log(khlRumahTangga / penghasilanBersihRt) / Math.log(1 + g);
  return {
    tercapai: true,
    tahun: Number(tahun.toFixed(1)),
    bulan: Math.round(tahun * 12),
    pertumbuhanRiil: Number(g.toFixed(4)),
    alasan: `Dengan kenaikan penghasilan ${(kenaikanPenghasilanTahunan * 100).toFixed(1)}% per tahun.`
  };
}

/** Berapa kenaikan penghasilan per bulan yang dibutuhkan agar KHL tercapai dalam N bulan. */
export function kenaikanDibutuhkan({ kesenjangan, bulanTarget = 12 }) {
  if (!(bulanTarget > 0)) throw new Error('bulanTarget harus lebih besar dari 0');
  if (kesenjangan <= 0) return { perluTambahan: 0, catatan: 'Sudah tidak ada kekurangan.' };
  return {
    perluTambahan: Math.round(kesenjangan),
    perBulanNaikBertahap: Math.round(kesenjangan / bulanTarget),
    catatan: `Untuk menutup kekurangan dalam ${bulanTarget} bulan.`
  };
}
