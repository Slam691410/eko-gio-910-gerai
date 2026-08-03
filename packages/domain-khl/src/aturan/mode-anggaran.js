/**
 * M-11 · Mode anggaran ditentukan oleh rasio pemenuhan KHL — BUKAN oleh rumus 50/30/20.
 *
 * Alasan 50/30/20 ditolak:
 *  1. Mengandaikan penghasilan sudah di atas biaya hidup layak.
 *     Untuk penghasilan Rp 3 juta di Jakarta (KHL Rp 5,89 juta), "50% kebutuhan" = Rp 1,5 juta:
 *     mustahil dipakai hidup.
 *  2. Buta terhadap inflasi dan suku bunga.
 *  3. Buta terhadap jumlah tanggungan.
 *
 * Persentase di MODE BERTUMBUH dihitung dari SISA setelah KHL dan cicilan wajib,
 * bukan dari penghasilan kotor.
 */

export const MODE = {
  BERTAHAN: 'BERTAHAN',
  STABILISASI: 'STABILISASI',
  BERTUMBUH: 'BERTUMBUH'
};

/** Alokasi sisa (setelah KHL & cicilan wajib) menurut fase ekonomi. Jumlah tiap baris = 100. */
export const ALOKASI_PER_FASE = {
  pemulihan:  { danaDarurat: 10, lunasiUtang: 15, investasiBertumbuh: 60, lindungNilai: 15 },
  ekspansi:   { danaDarurat: 10, lunasiUtang: 10, investasiBertumbuh: 65, lindungNilai: 15 },
  puncak:     { danaDarurat: 20, lunasiUtang: 30, investasiBertumbuh: 30, lindungNilai: 20 },
  kontraksi:  { danaDarurat: 35, lunasiUtang: 25, investasiBertumbuh: 25, lindungNilai: 15 },
  stagflasi:  { danaDarurat: 25, lunasiUtang: 30, investasiBertumbuh: 15, lindungNilai: 30 }
};

export const PRIORITAS_BAWAH_KHL = [
  'Pangan, tempat tinggal, air, listrik — tidak boleh dipangkas',
  'BPJS Kesehatan (kelas 3, atau PBI bila memenuhi syarat)',
  'Transportasi kerja & pulsa/data untuk mencari penghasilan',
  'Cicilan berbunga tertinggi — ajukan restrukturisasi bila perlu',
  'Tabung berapa pun yang bisa, sekecil apa pun'
];

export function tentukanMode({ rasioPemenuhan, sisaSetelahKhl }) {
  const r = Number(rasioPemenuhan);
  if (!Number.isFinite(r) || r < 0) throw new Error('rasioPemenuhan tidak valid');
  if (r < 0.85) return MODE.BERTAHAN;
  if (r < 1.0) return MODE.STABILISASI;
  if (Number.isFinite(sisaSetelahKhl) && sisaSetelahKhl <= 0) return MODE.STABILISASI;
  return MODE.BERTUMBUH;
}

/**
 * Rencana alokasi rupiah. Untuk mode BERTAHAN/STABILISASI, alokasi investasi = 0.
 * @returns {{mode:string, sisa:number, alokasi:object, prioritas:string[], investasiDibuka:boolean}}
 */
export function susunAlokasi({
  penghasilanBersihRt,
  khlRumahTangga,
  cicilanWajib = 0,
  faseEkonomi = 'ekspansi',
  rasioPemenuhan
}) {
  const rasio = Number.isFinite(rasioPemenuhan)
    ? rasioPemenuhan
    : penghasilanBersihRt / khlRumahTangga;
  const sisa = Math.round(penghasilanBersihRt - khlRumahTangga - cicilanWajib);
  const mode = tentukanMode({ rasioPemenuhan: rasio, sisaSetelahKhl: sisa });

  if (mode !== MODE.BERTUMBUH) {
    return {
      mode,
      sisa,
      alokasi: { danaDarurat: 0, lunasiUtang: 0, investasiBertumbuh: 0, lindungNilai: 0 },
      prioritas: PRIORITAS_BAWAH_KHL,
      investasiDibuka: false,
      catatan:
        mode === MODE.BERTAHAN
          ? 'Penghasilan belum menutup Kebutuhan Hidup Layak. Modul investasi ditutup sementara.'
          : 'Sudah dekat/di atas KHL tapi belum ada sisa. Amankan dana darurat satu bulan dulu.'
    };
  }

  const persen = ALOKASI_PER_FASE[faseEkonomi] || ALOKASI_PER_FASE.ekspansi;
  const alokasi = {};
  for (const [pos, p] of Object.entries(persen)) alokasi[pos] = Math.round((sisa * p) / 100);

  return {
    mode,
    sisa,
    alokasi,
    persen,
    prioritas: [],
    investasiDibuka: true,
    catatan: `Alokasi dihitung dari SISA setelah KHL & cicilan wajib, mengikuti fase ekonomi "${faseEkonomi}".`
  };
}
