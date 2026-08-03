/**
 * M-01.8 · Rencana menutup kesenjangan KHL.
 *
 * Ini pengganti nasihat "hemat" yang tidak berguna bagi orang yang penghasilannya
 * memang di bawah kebutuhan hidup layak. Isinya langkah yang menambah penghasilan,
 * memindahkan beban, atau mengambil hak yang memang tersedia — masing-masing
 * dengan perkiraan rupiahnya, bukan sekadar imbauan.
 */

export function rencanaTutupKesenjangan({
  kesenjangan,
  khlRumahTangga,
  penghasilanBersihRt,
  jumlahArt = 1,
  artBekerja = 1,
  umpProvinsi = 0,
  punyaBpjs = false
}) {
  if (kesenjangan <= 0) {
    return {
      perlu: false,
      langkah: [],
      ringkasan: 'Penghasilan sudah menutup Kebutuhan Hidup Layak rumah tangga Anda.'
    };
  }

  const langkah = [];
  const konsumsiPerKapita = khlRumahTangga / Math.max(jumlahArt, 1);

  // 1. Menambah pencari nafkah — dampaknya paling besar dan paling langsung
  const artTidakBekerja = Math.max(jumlahArt - artBekerja, 0);
  if (artTidakBekerja > 0 && umpProvinsi > 0) {
    langkah.push({
      kode: 'TAMBAH_PENCARI_NAFKAH',
      judul: 'Tambah satu anggota rumah tangga yang bekerja',
      penjelasan:
        `Ada ${artTidakBekerja} anggota rumah tangga yang belum berpenghasilan. ` +
        'Satu penghasilan setara upah minimum provinsi akan mengubah posisi rumah tangga secara langsung.',
      perkiraanDampak: Math.round(umpProvinsi),
      satuan: 'per bulan',
      tingkat: 'besar'
    });
  }

  // 2. Menaikkan penghasilan utama sampai setidaknya UMP
  if (umpProvinsi > 0 && penghasilanBersihRt < umpProvinsi) {
    langkah.push({
      kode: 'NAIK_KE_UMP',
      judul: 'Penghasilan Anda masih di bawah upah minimum provinsi',
      penjelasan:
        'Upah minimum adalah batas terendah yang sah untuk pekerja formal. Bila Anda pekerja ' +
        'formal dan dibayar di bawah angka ini, itu bisa diadukan ke dinas ketenagakerjaan setempat.',
      perkiraanDampak: Math.round(umpProvinsi - penghasilanBersihRt),
      satuan: 'per bulan',
      tingkat: 'besar'
    });
  }

  // 3. Penghasilan tambahan
  langkah.push({
    kode: 'PENGHASILAN_TAMBAHAN',
    judul: 'Bangun satu sumber penghasilan tambahan',
    penjelasan:
      'Kekurangan sebesar ini tidak bisa ditutup dengan berhemat, karena yang kurang adalah ' +
      'kebutuhan dasar. Yang bisa menutup hanyalah penghasilan tambahan.',
    perkiraanDampak: Math.round(kesenjangan),
    satuan: 'per bulan (target)',
    tingkat: 'besar'
  });

  // 4. Jaminan kesehatan — premi kecil, dampak besar
  if (!punyaBpjs) {
    langkah.push({
      kode: 'BPJS',
      judul: 'Aktifkan BPJS Kesehatan (atau daftar PBI bila memenuhi syarat)',
      penjelasan:
        'Satu kali sakit tanpa jaminan kesehatan bisa menghapus tabungan bertahun-tahun. ' +
        'Bagi rumah tangga tidak mampu, iurannya ditanggung pemerintah lewat skema PBI.',
      perkiraanDampak: 0,
      satuan: 'mencegah kerugian besar',
      tingkat: 'wajib'
    });
  }

  // 5. Program bantuan yang mungkin menjadi hak
  const dibawahGarisKemiskinan = konsumsiPerKapita > 0 && penghasilanBersihRt / Math.max(jumlahArt, 1) < 800000;
  if (dibawahGarisKemiskinan) {
    langkah.push({
      kode: 'BANTUAN_PEMERINTAH',
      judul: 'Periksa hak atas program bantuan pemerintah',
      penjelasan:
        'Pengeluaran per orang di rumah tangga Anda berada di kisaran garis kemiskinan. ' +
        'Periksa kepesertaan di DTKS untuk PKH, bantuan pangan, KIP, dan BPJS PBI. ' +
        'Ini hak, bukan belas kasihan.',
      perkiraanDampak: 0,
      satuan: 'bervariasi',
      tingkat: 'periksa'
    });
  }

  // 6. Restrukturisasi utang
  langkah.push({
    kode: 'RESTRUKTURISASI_UTANG',
    judul: 'Ajukan restrukturisasi bila ada cicilan berbunga tinggi',
    penjelasan:
      'Bunga pinjaman jangka pendek bisa menghabiskan porsi besar penghasilan. ' +
      'Perpanjangan tenor atau penurunan bunga memberi napas bulanan.',
    perkiraanDampak: 0,
    satuan: 'tergantung utang',
    tingkat: 'sedang'
  });

  const totalDampak = langkah.reduce((a, l) => a + (l.perkiraanDampak || 0), 0);

  return {
    perlu: true,
    kesenjangan: Math.round(kesenjangan),
    langkah,
    totalPerkiraanDampak: Math.round(totalDampak),
    cukup: totalDampak >= kesenjangan,
    ringkasan:
      `Kekurangan Rp ${Math.round(kesenjangan).toLocaleString('id-ID')} per bulan. ` +
      'Kekurangan kebutuhan dasar tidak bisa ditutup dengan berhemat — yang menutup adalah ' +
      'penghasilan tambahan dan hak-hak yang memang tersedia.'
  };
}
