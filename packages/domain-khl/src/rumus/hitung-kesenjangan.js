/**
 * M-01 · Kesenjangan antara penghasilan rumah tangga dan Kebutuhan Hidup Layak.
 *
 *   kesenjangan     = KHL rumah tangga - penghasilan bersih rumah tangga
 *   rasio pemenuhan = penghasilan bersih rumah tangga / KHL rumah tangga
 *
 * Kesenjangan POSITIF berarti KURANG (penghasilan belum menutup kebutuhan hidup layak).
 */

export function hitungKesenjangan({ khlRumahTangga, penghasilanBersihRt }) {
  if (!(khlRumahTangga > 0)) throw new Error('khlRumahTangga harus lebih besar dari 0');
  const penghasilan = Number(penghasilanBersihRt) || 0;
  if (penghasilan < 0) throw new Error('penghasilan tidak boleh negatif');

  const kesenjangan = khlRumahTangga - penghasilan;
  const rasio = penghasilan / khlRumahTangga;

  return {
    khlRumahTangga: Math.round(khlRumahTangga),
    penghasilanBersihRt: Math.round(penghasilan),
    kesenjangan: Math.round(kesenjangan),
    kurang: kesenjangan > 0,
    surplus: kesenjangan < 0 ? Math.round(-kesenjangan) : 0,
    rasioPemenuhan: Number(rasio.toFixed(4)),
    persenPemenuhan: Number((rasio * 100).toFixed(1))
  };
}

/**
 * Kesenjangan per orang: berapa rupiah kekurangan yang ditanggung tiap anggota rumah tangga.
 * Dipakai untuk kalimat "untuk satu orang saja masih kurang, apalagi seluruh tanggungan".
 */
export function kesenjanganPerOrang({ kesenjangan, jumlahArt }) {
  if (!(jumlahArt >= 1)) throw new Error('jumlahArt minimal 1');
  return Math.round(kesenjangan / jumlahArt);
}
