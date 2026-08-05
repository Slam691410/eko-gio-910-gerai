/**
 * 64 KOMPONEN KEBUTUHAN HIDUP LAYAK
 * Dasar: Permenaker No. 18 Tahun 2020 tentang Perubahan atas Permenaker No. 21 Tahun 2016
 *        tentang Kebutuhan Hidup Layak (ditetapkan 9 Oktober 2020).
 *        Sebelumnya 60 komponen (Permenakertrans 13/2012), ditambah menjadi 64.
 *
 * Secara resmi disebut 7 kelompok; pada rilis Kemnaker komunikasi dicatat terpisah,
 * sehingga di sini ditulis 8 judul agar mudah dibaca. Total tetap 64 jenis.
 *
 * `kuantitas` = kuantitas acuan per pekerja lajang per bulan bila diketahui publik,
 * `null` bila tidak diketahui pasti — pengguna mengisi sendiri. Tidak ada angka karangan.
 */

export const KELOMPOK = [
  { kode: 'makanan_minuman', nama: 'Makanan & Minuman', jumlah: 13 },
  { kode: 'sandang', nama: 'Sandang', jumlah: 13 },
  { kode: 'perumahan', nama: 'Perumahan', jumlah: 26 },
  { kode: 'pendidikan', nama: 'Pendidikan', jumlah: 2 },
  { kode: 'kesehatan', nama: 'Kesehatan', jumlah: 5 },
  { kode: 'transportasi', nama: 'Transportasi', jumlah: 1 },
  { kode: 'komunikasi', nama: 'Komunikasi', jumlah: 1 },
  { kode: 'rekreasi_tabungan', nama: 'Rekreasi, Tabungan & Jaminan Sosial', jumlah: 3 }
];

const K = (kelompok, nama, satuan, kuantitas, catatan) =>
  ({ kelompok, nama, satuan, kuantitas: kuantitas === undefined ? null : kuantitas, catatan: catatan || '' });

export const KOMPONEN = [
  // --- Makanan & Minuman (13) ---
  K('makanan_minuman', 'Beras kualitas sedang', 'kg', null),
  K('makanan_minuman', 'Protein: daging kualitas sedang', 'kg', null),
  K('makanan_minuman', 'Protein: ikan segar kualitas baik', 'kg', null),
  K('makanan_minuman', 'Protein: telur ayam ras', 'kg', null),
  K('makanan_minuman', 'Kacang-kacangan (tahu/tempe)', 'kg', null),
  K('makanan_minuman', 'Susu bubuk kualitas sedang', 'gram', null),
  K('makanan_minuman', 'Gula pasir kualitas sedang', 'kg', null),
  K('makanan_minuman', 'Minyak goreng curah', 'liter', null),
  K('makanan_minuman', 'Sayuran kualitas baik', 'kg', null),
  K('makanan_minuman', 'Buah-buahan (setara pisang/pepaya)', 'kg', null),
  K('makanan_minuman', 'Karbohidrat lain (setara tepung terigu)', 'kg', null),
  K('makanan_minuman', 'Teh celup & kopi sachet', 'paket', null, 'Pada 2020 teh dan kopi dipisah'),
  K('makanan_minuman', 'Air minum galon curah/refill', 'galon', 3, 'Komponen baru pada Permenaker 18/2020'),

  // --- Sandang (13) ---
  K('sandang', 'Celana panjang / pakaian muslim katun', 'potong/tahun', null),
  K('sandang', 'Celana pendek katun', 'potong/tahun', null),
  K('sandang', 'Ikat pinggang kulit sintetis', 'buah/tahun', null),
  K('sandang', 'Kemeja lengan pendek katun', 'potong/tahun', null),
  K('sandang', 'Kaos oblong poliester', 'potong/tahun', null),
  K('sandang', 'Celana dalam poliester', 'potong/tahun', null),
  K('sandang', 'Sarung kualitas sedang', 'helai/tahun', null),
  K('sandang', 'Sepatu kulit sintetis', 'pasang/tahun', null),
  K('sandang', 'Kaos kaki polos', 'pasang/tahun', null),
  K('sandang', 'Perlengkapan pembersih sepatu (semir & sikat)', 'set/tahun', null),
  K('sandang', 'Sandal jepit karet', 'pasang/tahun', null),
  K('sandang', 'Handuk mandi 100 x 60 cm', 'helai/tahun', null),
  K('sandang', 'Perlengkapan ibadah (sajadah, kitab suci, peci)', 'set/tahun', null),

  // --- Perumahan (26) ---
  K('perumahan', 'Sewa/kontrak kamar 16 m2', 'bulan', 1),
  K('perumahan', 'Dipan / tempat tidur', 'buah', null),
  K('perumahan', 'Perlengkapan tidur (kasur & bantal busa)', 'set', null),
  K('perumahan', 'Sprei & sarung bantal katun', 'set', null),
  K('perumahan', 'Meja dan kursi (1 meja, 4 kursi)', 'set', null),
  K('perumahan', 'Lemari pakaian kayu', 'buah', null),
  K('perumahan', 'Sapu ijuk', 'buah', null),
  K('perumahan', 'Perlengkapan makan (piring, gelas, sendok, garpu)', 'set', null),
  K('perumahan', 'Ceret aluminium 1,5 liter', 'buah', null),
  K('perumahan', 'Wajan aluminium 26 cm', 'buah', null),
  K('perumahan', 'Panci aluminium 24 cm', 'buah', null),
  K('perumahan', 'Sendok masak aluminium', 'buah', null),
  K('perumahan', 'Rice cooker 0,5 liter SNI', 'buah', null),
  K('perumahan', 'Kompor gas 1 tungku + selang + regulator + tabung 3 kg', 'set', null),
  K('perumahan', 'Gas elpiji tabung 3 kg', 'tabung/bulan', null),
  K('perumahan', 'Ember plastik 20 liter', 'buah', null),
  K('perumahan', 'Gayung plastik', 'buah', null),
  K('perumahan', 'Listrik PLN 1.300 VA', 'bulan', 1),
  K('perumahan', 'Bola lampu hemat energi 14 watt', 'buah', null),
  K('perumahan', 'Air bersih standar PDAM', 'bulan', 1),
  K('perumahan', 'Sabun cuci pakaian (deterjen bubuk)', 'kg/bulan', null),
  K('perumahan', 'Sabun cuci piring cair refill', 'ml/bulan', null),
  K('perumahan', 'Setrika SNI', 'buah', null),
  K('perumahan', 'Rak piring portabel plastik', 'buah', null),
  K('perumahan', 'Pisau dapur stainless', 'buah', null),
  K('perumahan', 'Cermin 30 x 50 cm', 'buah', null),

  // --- Pendidikan (2) ---
  K('pendidikan', 'Bacaan / saluran informasi', 'bulan', 1),
  K('pendidikan', 'Ballpoint atau pensil non-refill', 'buah/bulan', null),

  // --- Kesehatan (5) ---
  K('kesehatan', 'Sarana kesehatan (pasta gigi, sabun mandi, sikat gigi, sampo, cotton bud, alat cukur)', 'paket/bulan', 1),
  K('kesehatan', 'Deodoran 100 ml/gram', 'buah', null),
  K('kesehatan', 'Obat anti nyamuk cair semprot 325 ml', 'buah', null),
  K('kesehatan', 'Potong rambut non-salon', 'kali/bulan', null),
  K('kesehatan', 'Sisir plastik', 'buah', null),

  // --- Transportasi (1) ---
  K('transportasi', 'Angkutan umum (kerja dan lainnya)', 'bulan', 1),

  // --- Komunikasi (1) ---
  K('komunikasi', 'Paket pulsa & data HP (setara 2 GB)', 'bulan', 1, 'Komponen baru pada Permenaker 18/2020'),

  // --- Rekreasi, Tabungan & Jaminan Sosial (3) ---
  K('rekreasi_tabungan', 'Rekreasi dalam kota/kabupaten', 'kali/bulan', null),
  K('rekreasi_tabungan', 'Tabungan (2% dari total pengeluaran)', 'persen', 2),
  K('rekreasi_tabungan', 'Jaminan sosial (2% dari total pengeluaran)', 'persen', 2)
];

