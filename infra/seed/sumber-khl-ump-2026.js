/**
 * SUMBER DATA KHL & UMP 2026 — 38 PROVINSI
 * =========================================
 * KHL = Kebutuhan Hidup Layak (standar PENGELUARAN layak per bulan).
 *       BUKAN aset, BUKAN logam mulia.
 * UMP = Upah Minimum Provinsi (yang ditetapkan pemerintah).
 *
 * Sumber KHL : Kementerian Ketenagakerjaan RI, rilis 20-21 Desember 2025.
 *              Metode baru berbasis studi ILO "Minimum Wage Study: Developing a Formula
 *              and Methodology for Minimum Wage Determination in Indonesia" (2025).
 *              Rumus: (konsumsi per kapita x jumlah ART) / jumlah ART yang bekerja.
 * Sumber UMP : Rekapitulasi penetapan UMP 2026 yang berlaku 1 Januari 2026.
 *
 * CATATAN KEJUJURAN: angka-angka ini disalin dari rilis/rekap pemberitaan resmi.
 * Sebelum dipakai untuk keputusan penting, verifikasi ke SK Gubernur & rilis Kemnaker.
 * Setiap berkas provinsi yang dihasilkan memuat field `terverifikasi: false`.
 */

export const META = {
  tahun: 2026,
  khl: {
    sumber: 'Kementerian Ketenagakerjaan RI',
    metode: 'Berbasis studi ILO 2025 — (konsumsi per kapita x ART) / ART bekerja',
    kelompok_konsumsi: ['makanan', 'kesehatan dan pendidikan', 'perumahan', 'kebutuhan pokok lainnya'],
    tanggal_rilis: '2025-12-20',
    catatan: 'Dipakai sebagai acuan penetapan UMP 2026 secara bertahap mendekati KHL.'
  },
  ump: {
    sumber: 'Penetapan UMP 2026 oleh gubernur, berlaku 1 Januari 2026',
    tanggal_rilis: '2025-12-24',
    dasar: 'UU 6/2023, PP 51/2023, dan Putusan MK 168/PUU-XXI/2023'
  },
  garis_kemiskinan_nasional: {
    nilai_per_kapita_per_bulan: 609160,
    sumber: 'BPS, Susenas Maret 2025',
    catatan: 'Ambang MISKIN, bukan ambang LAYAK. Jauh di bawah KHL.'
  },
  standar_hidup_layak_bps: {
    nilai_per_kapita_per_bulan: 1028333,
    sumber: 'BPS 2024 (pengeluaran riil per kapita Rp 12,34 juta/tahun untuk komponen IPM)',
    catatan: 'BPS menegaskan angka ini BUKAN kriteria layak/tidak layak, hanya komponen IPM.'
  },
  asumsi_rumah_tangga_acuan: {
    jumlah_art: 4,
    art_bekerja: 1,
    catatan:
      'Asumsi yang dipakai aplikasi untuk menurunkan konsumsi per kapita dari angka KHL provinsi. ' +
      'Kemnaker tidak mempublikasikan angka ART per provinsi secara rinci, jadi ini ASUMSI ' +
      'yang bisa diubah pengguna, bukan angka resmi.'
  }
};

/** [kode BPS, nama, slug, KHL 2026, UMP 2026, pulau] */
export const PROVINSI = [
  ['11', 'Aceh',                     'aceh',                     3654466, 3932552, 'Sumatera'],
  ['12', 'Sumatera Utara',           'sumatera-utara',           3599803, 3228949, 'Sumatera'],
  ['13', 'Sumatera Barat',           'sumatera-barat',           4076173, 3182955, 'Sumatera'],
  ['14', 'Riau',                     'riau',                     4158948, 3780495, 'Sumatera'],
  ['15', 'Jambi',                    'jambi',                    3931596, 3471497, 'Sumatera'],
  ['16', 'Sumatera Selatan',         'sumatera-selatan',         3299907, 3942963, 'Sumatera'],
  ['17', 'Bengkulu',                 'bengkulu',                 3714932, 2827250, 'Sumatera'],
  ['18', 'Lampung',                  'lampung',                  3343494, 3047734, 'Sumatera'],
  ['19', 'Kepulauan Bangka Belitung','kep-bangka-belitung',      4714805, 4035000, 'Sumatera'],
  ['21', 'Kepulauan Riau',           'kep-riau',                 5717082, 3879520, 'Sumatera'],
  ['31', 'DKI Jakarta',              'dki-jakarta',              5898511, 5729876, 'Jawa'],
  ['32', 'Jawa Barat',               'jawa-barat',               4122871, 2317601, 'Jawa'],
  ['33', 'Jawa Tengah',              'jawa-tengah',              3512997, 2327386, 'Jawa'],
  ['34', 'DI Yogyakarta',            'di-yogyakarta',            4604982, 2417495, 'Jawa'],
  ['35', 'Jawa Timur',               'jawa-timur',               3575938, 2446880, 'Jawa'],
  ['36', 'Banten',                   'banten',                   4295985, 3100881, 'Jawa'],
  ['51', 'Bali',                     'bali',                     5253107, 3207459, 'Bali & Nusa Tenggara'],
  ['52', 'Nusa Tenggara Barat',      'nusa-tenggara-barat',      3410833, 2673861, 'Bali & Nusa Tenggara'],
  ['53', 'Nusa Tenggara Timur',      'nusa-tenggara-timur',      3054508, 2455898, 'Bali & Nusa Tenggara'],
  ['61', 'Kalimantan Barat',         'kalimantan-barat',         4083420, 3054552, 'Kalimantan'],
  ['62', 'Kalimantan Tengah',        'kalimantan-tengah',        4279888, 3686138, 'Kalimantan'],
  ['63', 'Kalimantan Selatan',       'kalimantan-selatan',       4112552, 3725000, 'Kalimantan'],
  ['64', 'Kalimantan Timur',         'kalimantan-timur',         5735353, 3762431, 'Kalimantan'],
  ['65', 'Kalimantan Utara',         'kalimantan-utara',         4968935, 3775243, 'Kalimantan'],
  ['71', 'Sulawesi Utara',           'sulawesi-utara',           3864224, 4002630, 'Sulawesi'],
  ['72', 'Sulawesi Tengah',          'sulawesi-tengah',          3546013, 3179565, 'Sulawesi'],
  ['73', 'Sulawesi Selatan',         'sulawesi-selatan',         3670085, 3921088, 'Sulawesi'],
  ['74', 'Sulawesi Tenggara',        'sulawesi-tenggara',        3645086, 3306496, 'Sulawesi'],
  ['75', 'Gorontalo',                'gorontalo',                3398395, 3405144, 'Sulawesi'],
  ['76', 'Sulawesi Barat',           'sulawesi-barat',           3091442, 3315934, 'Sulawesi'],
  ['81', 'Maluku',                   'maluku',                   4168498, 3334490, 'Maluku & Papua'],
  ['82', 'Maluku Utara',             'maluku-utara',             4431339, 3510240, 'Maluku & Papua'],
  ['91', 'Papua Barat',              'papua-barat',              5246172, 3841000, 'Maluku & Papua'],
  ['92', 'Papua Barat Daya',         'papua-barat-daya',         5246172, 3766000, 'Maluku & Papua'],
  ['94', 'Papua',                    'papua',                    5314281, 4436283, 'Maluku & Papua'],
  ['95', 'Papua Selatan',            'papua-selatan',            5314281, 4508100, 'Maluku & Papua'],
  ['96', 'Papua Tengah',             'papua-tengah',             5314281, 4285848, 'Maluku & Papua'],
  ['97', 'Papua Pegunungan',         'papua-pegunungan',         5314281, 4508714, 'Maluku & Papua']
];

