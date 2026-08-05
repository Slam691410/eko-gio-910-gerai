/**
 * M-01 · KHL versi survei mandiri, memakai 64 komponen Permenaker 18/2020.
 *
 *   subtotal = jumlah (kuantitas x harga) seluruh komponen non-persentase
 *   tabungan        = 2% dari subtotal
 *   jaminan sosial  = 2% dari subtotal
 *   KHL survei      = subtotal + tabungan + jaminan sosial
 *
 * Komponen tahunan (satuan mengandung "/tahun") otomatis dibagi 12 supaya
 * semuanya setara per bulan.
 */

export const PERSEN_TABUNGAN = 0.02;
export const PERSEN_JAMINAN_SOSIAL = 0.02;

function setaraBulanan(nilai, satuan) {
  const s = String(satuan || '').toLowerCase();
  if (s.includes('/tahun')) return nilai / 12;
  return nilai;
}

/**
 * @param {Array<{kelompok:string,nama:string,satuan:string,kuantitas:number,harga:number}>} isian
 */
export function hitungKhlSurvei(isian = []) {
  const perKelompok = {};
  let subtotal = 0;
  let terisi = 0;

  for (const item of isian) {
    const kuantitas = Number(item.kuantitas) || 0;
    const harga = Number(item.harga) || 0;
    if (kuantitas < 0 || harga < 0) throw new Error(`Nilai negatif pada komponen "${item.nama}"`);
    const satuan = String(item.satuan || '').toLowerCase();
    if (satuan === 'persen') continue; // tabungan & jaminan sosial dihitung terpisah
    const nilai = setaraBulanan(kuantitas * harga, item.satuan);
    if (nilai > 0) terisi += 1;
    subtotal += nilai;
    perKelompok[item.kelompok] = (perKelompok[item.kelompok] || 0) + nilai;
  }

  const tabungan = subtotal * PERSEN_TABUNGAN;
  const jaminanSosial = subtotal * PERSEN_JAMINAN_SOSIAL;

  return {
    subtotal: Math.round(subtotal),
    tabungan: Math.round(tabungan),
    jaminanSosial: Math.round(jaminanSosial),
    khlSurvei: Math.round(subtotal + tabungan + jaminanSosial),
    perKelompok: Object.fromEntries(Object.entries(perKelompok).map(([k, v]) => [k, Math.round(v)])),
    komponenTerisi: terisi,
    lengkap: terisi >= 40,
    catatan:
      terisi >= 40
        ? 'Survei cukup lengkap untuk dipakai sebagai pembanding angka acuan Kemnaker.'
        : 'Survei belum lengkap. Angka acuan Kemnaker tetap dipakai sebagai dasar perhitungan.'
  };
}
