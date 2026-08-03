/**
 * M-01 · Menghitung KHL rumah tangga dari angka acuan provinsi.
 *
 * KHL = KEBUTUHAN HIDUP LAYAK -> standar PENGELUARAN layak per bulan.
 * Ini BUKAN aset, BUKAN logam mulia.
 *
 * Rumus Kemnaker (metode berbasis studi ILO 2025):
 *     KHL = (konsumsi per kapita x jumlah ART) / jumlah ART yang bekerja
 *
 * Angka KHL yang dirilis Kemnaker memakai rumah tangga acuan. Untuk menyesuaikan
 * dengan rumah tangga pengguna, konsumsi per kapita diturunkan lebih dulu:
 *     konsumsi_per_kapita = KHL_provinsi x ART_bekerja_acuan / ART_acuan
 *
 * Catatan jujur: ART acuan (4 orang, 1 bekerja) adalah ASUMSI aplikasi karena
 * Kemnaker tidak merinci komposisi rumah tangga per provinsi. Asumsi ini terbuka
 * untuk diubah pengguna dan selalu ditampilkan di layar.
 */

export const ART_ACUAN = 4;
export const ART_BEKERJA_ACUAN = 1;

export function konsumsiPerKapita(khlProvinsi, artAcuan = ART_ACUAN, artBekerjaAcuan = ART_BEKERJA_ACUAN) {
  if (!(khlProvinsi > 0)) throw new Error('khlProvinsi harus lebih besar dari 0');
  if (!(artAcuan > 0)) throw new Error('artAcuan harus lebih besar dari 0');
  return (khlProvinsi * artBekerjaAcuan) / artAcuan;
}

/**
 * @param {object} p
 * @param {number} p.khlProvinsi   angka KHL resmi provinsi (rupiah/bulan)
 * @param {number} p.jumlahArt     jumlah anggota rumah tangga pengguna
 * @param {number} p.artBekerja    jumlah anggota rumah tangga yang bekerja
 * @returns {{khlRumahTangga:number, khlPerPekerja:number, konsumsiPerKapita:number,
 *            jumlahArt:number, artBekerja:number, disesuaikan:boolean}}
 */
export function hitungKhlAcuan({ khlProvinsi, jumlahArt = ART_ACUAN, artBekerja = ART_BEKERJA_ACUAN }) {
  if (!(khlProvinsi > 0)) throw new Error('khlProvinsi harus lebih besar dari 0');
  if (!Number.isFinite(jumlahArt) || jumlahArt < 1) throw new Error('jumlahArt minimal 1');
  if (!Number.isFinite(artBekerja) || artBekerja < 0) throw new Error('artBekerja tidak boleh negatif');
  if (artBekerja > jumlahArt) throw new Error('artBekerja tidak boleh melebihi jumlahArt');

  const perKapita = konsumsiPerKapita(khlProvinsi);
  const khlRumahTangga = Math.round(perKapita * jumlahArt);
  const pembagi = Math.max(artBekerja, 1);

  return {
    khlRumahTangga,
    khlPerPekerja: Math.round(khlRumahTangga / pembagi),
    konsumsiPerKapita: Math.round(perKapita),
    jumlahArt,
    artBekerja,
    disesuaikan: jumlahArt !== ART_ACUAN || artBekerja !== ART_BEKERJA_ACUAN
  };
}
