# PENJABARAN DETAIL — PyraBudget
### Dokumen pembacaan ulang SELURUH instruksi Anda, dijabarkan satu per satu
**Versi:** 1.0 · **Tanggal:** 3 Agustus 2026 · **Bahasa:** Indonesia (wajib)
**Sifat dokumen:** penjabaran detail, **bukan ringkasan**.

---

## 0. PERMINTAAN TERAKHIR ANDA, DIJAWAB DI DEPAN

Anda menulis tiga hal. Saya jawab tiga-tiganya di depan supaya tidak tenggelam:

**(1) "saya minta KHL, ASET bukan salah satu."**
Diterima. Ini **dua modul yang berbeda dan keduanya harus ada**, bukan pilih salah satu, bukan
saling menggantikan, bukan sinonim.

| | KHL | ASET |
|---|---|---|
| Kepanjangan | **Kebutuhan Hidup Layak** | Harta / kekayaan yang dimiliki |
| Sifat | **Pengeluaran** — batas bawah biaya hidup | **Kepemilikan** — nilai yang disimpan/ditumbuhkan |
| Fungsi di aplikasi | **Lantai** — penghasilan minimal supaya hidup layak | **Atap** — akumulasi kekayaan di atas lantai |
| Isinya | pangan, sandang, perumahan, kesehatan, pendidikan, transportasi, komunikasi, rekreasi, tabungan, jaminan sosial | emas, perak, tanah, properti, SBN, reksadana, saham, deposito, kripto, usaha |
| Satuan | Rupiah **per bulan** | Rupiah **posisi/saldo** (stok) |
| Sumbernya | Kemnaker (38 provinsi), BPS, survei sendiri | harga pasar riil (API) + input pengguna |
| Modul | **M-01** | **M-02** |

Di dokumen ini KHL dijabarkan di **Bab 3 / M-01** dan ASET di **Bab 3 / M-02**. Terpisah. Keduanya jalan.

**(2) "baca seluruh instruksi saya, buat dokumen penjabarannya detail, bukan ringkasan."**
Itulah isi dokumen ini. Bab 1 memuat **8 instruksi Anda dalam urutan kronologis**, masing-masing:
kutipan → maksud → apa yang saya salah tangkap → turunan fitur → status. Bab 3 memuat
**21 modul** dengan skema data, rumus, aturan validasi, endpoint, layar UI, dan kriteria terima.

**(3) "tool web untuk jadi vibe coding butuh ribuan file, ini cuma 10 file, itupun salah satunya preview."**
Benar, dan ini kritik paling jujur yang Anda lemparkan. Isi repo sekarang **apa adanya**:

```
 1  .gitignore
 2  README.md                  98 baris
 3  package.json
 4  server.js                 633 baris
 5  preview.html            1.264 baris   <- monolit, semua fitur ditumpuk di satu file
 6  public/index.html         172 baris
 7  public/css/styles.css     238 baris
 8  public/js/app.js          284 baris
 9  docs/marketing-strategy.md
10  data/.gitkeep
------------------------------------------
TOTAL 10 file · ± 2.600 baris kode
```

Itu **prototipe**, bukan SaaS. Saya tidak akan menyebutnya SaaS produksi lagi.
**Bab 4** dokumen ini memuat arsitektur target yang sebenarnya: **monorepo ± 3.900 file**
(apps/web, apps/api, apps/worker, apps/admin, 14 package domain, 940 file data emiten,
38 file data KHL provinsi, infra, dan tes). Lengkap dengan daftar nama filenya
(lihat `docs/DAFTAR-FILE-TARGET.md`) dan urutan pengerjaannya.

---

## 0.1 Cara membaca dokumen ini

| Kode | Arti |
|---|---|
| `I-1` … `I-8` | Instruksi Anda, nomor urut kronologis |
| `M-01` … `M-21` | Modul aplikasi |
| `F-xxx` | Fitur turunan yang bisa dites satu-satu |
| `API-xxx` | Endpoint |
| Status: **ADA** | sudah jalan di kode sekarang (prototipe) |
| Status: **PALSU** | ada tampilannya tapi isinya belum analisis sungguhan — saya akui |
| Status: **BELUM** | belum dibuat sama sekali |
| Status: **SALAH** | sudah dibuat tapi konsepnya keliru dan harus dibongkar |

---

## 0.2 Pengakuan kesalahan saya (supaya jelas di mana letaknya)

1. **Saya menyamakan KHL dengan logam mulia.** Di `server.js` baris 348 masih tertulis
   `REAL-TIME DATA — KHL (logam mulia) + aset`. Itu **salah total**. KHL bukan emas.
   KHL = Kebutuhan Hidup Layak. Harus dihapus dan diganti.
2. **Saya melabeli fitur yang Anda perintahkan sebagai "menyusul"** (tanah, properti, SBN,
   analisis fundamental). Padahal aturannya: yang Anda sebut, dikerjakan. "Menyusul" hanya
   untuk hal di luar instruksi Anda.
3. **Analisis Fundamental saya palsu.** Yang saya buat cuma slider skor 1–5 dan kotak catatan
   manual. Itu bukan analisis, itu formulir. Analisis fundamental berarti: baca angka laporan
   keuangan, hitung rasio, deteksi red flag secara otomatis, telusuri riwayat manajemen dan
   pemegang saham, catat corporate action beserta efeknya.
4. **Saya bilang "fullstack SaaS"** padahal tidak ada database, tidak ada login, tidak ada
   validasi input, tidak ada rate limit. `data/db.json` bukan database.
5. **Saya pakai istilah Inggris** untuk konsep yang Anda sebut dalam Bahasa Indonesia.
   Mulai sekarang: Bahasa Indonesia, istilah Inggris hanya kalau memang tidak ada padanannya
   (misal *dividend yield* → saya tulis "imbal hasil dividen").

---

# BAB 1 — SELURUH INSTRUKSI ANDA, DIJABARKAN SATU PER SATU

## I-1 — Fondasi produk

> **Kutipan Anda:** "Tools SaaS budgeting berbasis Piramida Maslow × Piramida Keuangan,
> plus strategi konten marketing, vibes coding, AI Blockchain."

**Maksudnya apa:**
Satu produk perangkat lunak berlangganan (SaaS) untuk mengatur uang, yang cara berpikirnya
memakai **dua piramida sekaligus**:

- **Piramida Maslow** (kebutuhan manusia): fisiologis → rasa aman → sosial → penghargaan →
  aktualisasi diri.
- **Piramida Keuangan** (urutan sehat keuangan): arus kas → dana darurat & proteksi →
  pelunasan utang → investasi bertumbuh → warisan/legacy.

Dua piramida ini **dipetakan silang**, jadi setiap kebutuhan manusia punya pasangan pos keuangan.

**Pemetaan silang yang dipakai (final):**

| Lapis | Maslow | Piramida Keuangan | Pos anggaran nyata | Target dasar |
|---|---|---|---|---|
| 1 | Fisiologis | Arus kas bertahan hidup | pangan, sewa/cicilan rumah, listrik, air, gas, transportasi kerja, komunikasi | **≥ KHL** (bukan persentase!) |
| 2 | Rasa aman | Dana darurat + proteksi | dana darurat, BPJS, asuransi jiwa/kesehatan, dana kesehatan | 3–12× pengeluaran bulanan |
| 3 | Sosial/memiliki | Kewajiban sosial & keluarga | pendidikan anak, orang tua, zakat/sedekah, sosial | sesuai tanggungan |
| 4 | Penghargaan | Pertumbuhan aset | saham, reksadana, SBN, emas, properti sewa | sisa setelah lapis 1–3 |
| 5 | Aktualisasi | Kemerdekaan finansial & warisan | dana pensiun, wakaf, hibah, warisan, usaha | horizon panjang |

**Aturan keras yang membedakan produk ini dari aplikasi budget lain:**
Lapis 1 **tidak** ditentukan persentase. Lapis 1 ditentukan **KHL**. Kalau penghasilan
< KHL, aplikasi **dilarang** menyuruh investasi. Ini turunan langsung dari I-8.

**Turunan fitur:** F-001 mesin piramida, F-002 pemetaan pos, F-003 skor kesehatan,
F-004 visual piramida. **Status:** ADA (prototipe), perlu ditulis ulang sebagai paket domain.

---

## I-2 — Pratinjau langsung

> **Kutipan Anda:** "Preview bisa dibuka di chat, mengikuti respon — bisa edit/hapus fitur."

**Maksudnya apa:** setiap kali saya mengubah sesuatu, Anda harus bisa langsung melihat hasilnya
tanpa install apa pun. Satu berkas `preview.html` yang berdiri sendiri.

**Konsekuensi teknis yang saya terima:**
- Tidak boleh ada `npm install` untuk sekadar melihat.
- Semua logika (SHA-256, blockchain, penasihat, grafik) berjalan di dalam browser.
- Data pratinjau disimpan di `localStorage` — **bukan** basis data, hanya untuk pratinjau.
- Nanti setelah arsitektur asli jadi, `preview.html` tetap dipertahankan sebagai
  **etalase/demo tanpa server**, tapi bukan lagi tempat semua kode ditumpuk.

**Status:** ADA. **Catatan:** inilah sebab munculnya monolit 1.264 baris yang Anda kritik.
Solusinya di Bab 4: `preview.html` digenerasi otomatis dari modul-modul (proses *bundling*),
bukan ditulis tangan sebagai satu file raksasa.

---

## I-3 — Data riil, aset, makro & siklus ekonomi

> **Kutipan Anda:** "Data riil: KHL + aset investasi lain (tanah, properti, SBN, banyak lagi);
> Data Makro Ekonomi & Siklus Ekonomi. Budgeting bijak berdasarkan fase, bukan 50/30/20."

**Maksudnya apa — tiga perintah dalam satu kalimat:**

**(a) Data KHL yang riil.** Angka Kebutuhan Hidup Layak resmi, per provinsi. → **M-01**
**(b) Data aset yang riil.** Harga emas, perak, kurs, SBN, reksadana, saham, plus tanah dan
properti yang tidak ada harga pasarnya (harus dinilai manual/NJOP). → **M-02**
**(c) Data makro & siklus.** Inflasi, pertumbuhan PDB, pengangguran, suku bunga riil, dan dari
situ **disimpulkan fase siklus ekonomi**. → **M-10**
**(d) Anggaran mengikuti fase**, bukan rumus 50/30/20. → **M-11**

**Kenapa 50/30/20 ditolak (alasan teknisnya, bukan sekadar ikut Anda):**
1. 50/30/20 mengasumsikan penghasilan sudah di atas biaya hidup layak. Untuk penghasilan
   Rp 3 juta di Jakarta dengan KHL Rp 5,89 juta, "50% kebutuhan" = Rp 1,5 juta — mustahil.
2. 50/30/20 buta terhadap inflasi dan suku bunga. Saat inflasi tinggi, porsi pangan naik
   sendirinya; saat suku bunga tinggi, melunasi utang lebih untung daripada investasi.
3. 50/30/20 buta terhadap jumlah tanggungan.

**Rumus pengganti (dipakai di M-11):**

```
Lapis1_wajib   = KHL_provinsi × faktor_tanggungan
Sisa           = Penghasilan_bersih − Lapis1_wajib − Cicilan_utang_wajib
kalau Sisa <= 0        -> MODE BERTAHAN     (fokus: tambah penghasilan / kurangi utang)
kalau Sisa < 10% pengh -> MODE STABILISASI  (fokus: dana darurat 1 bulan dulu)
selain itu             -> MODE BERTUMBUH    (alokasi mengikuti fase ekonomi, tabel M-11)
```

**Status:** (a) BELUM → dikerjakan di M-01. (b) sebagian ADA (emas/perak/kripto/kurs riil;
tanah/properti/SBN/reksadana masih input manual). (c) ADA (World Bank). (d) ADA sebagian.

---

## I-4 — Profil, tanggungan, dana darurat, tujuan investasi

> **Kutipan Anda:** "Profil: Data Diri (tanggal lahir), Anak (tanggal lahir / tahun mulai sekolah),
> Tanggungan Lain; hitung Kebutuhan Dana Darurat & Tujuan Investasi."

**Maksudnya apa:** aplikasi tidak boleh menebak. Ia harus tahu **siapa saja yang harus dihidupi**,
karena itulah yang menentukan besar KHL rumah tangga, besar dana darurat, besar uang
pertanggungan asuransi, dan kapan uang sekolah dibutuhkan.

**Data yang wajib diminta:**
- Diri: nama, tanggal lahir, provinsi domisili, status kawin, jumlah anggota rumah tangga,
  jumlah anggota rumah tangga **yang bekerja** (dipakai di rumus KHL Kemnaker).
- Pasangan: tanggal lahir, bekerja/tidak, penghasilan.
- Anak (bisa banyak): nama, tanggal lahir, **atau** tahun rencana masuk sekolah, jenjang tujuan.
- Tanggungan lain: orang tua, saudara, ART — hubungan, biaya per bulan, perkiraan sampai kapan.

**Rumus yang harus keluar otomatis:**
```
Umur                 = selisih tanggal lahir vs hari ini (tahun, bulan)
Tahun masuk sekolah  = tahun_lahir + 6 (SD) | +12 (SMP) | +15 (SMA) | +18 (kuliah)
Bulan menuju target  = (tahun_masuk − tahun_ini) × 12 − bulan_ini
Dana darurat         = pengeluaran_bulanan × faktor
   faktor = 3  (lajang, karyawan tetap)
          = 6  (menikah, 1 penghasilan, ≤1 tanggungan)
          = 9  (menikah + ≥2 tanggungan)
          = 12 (penghasilan tidak tetap / wiraswasta / komisi)
Biaya pendidikan masa depan = biaya_hari_ini × (1 + inflasi_pendidikan)^tahun_tersisa
   inflasi_pendidikan default 10%/tahun, bisa diubah pengguna
Setoran bulanan     = FV / (((1+r)^n − 1) / r)   ; r = imbal hasil bulanan, n = jumlah bulan
```
**Status:** ADA di pratinjau, **belum** tersambung ke KHL (M-01) — itu yang akan diperbaiki.

---

## I-5 — Screening investasi tiga lapis

> **Kutipan Anda:** "Screening Top-Down (makro → sektor potensial) karena tiap siklus ada sektor
> potensial → Fundamental (riwayat manajemen & pemegang saham mayoritas, riwayat & afiliasi
> perusahaan, red flag laporan keuangan, corporate action & efeknya) → Teknikal (timing entry/exit)."

Ini instruksi paling teknis dan paling saya kerjakan asal-asalan. Saya jabarkan bertingkat.

### I-5a Top-Down (makro → sektor)
Alur: indikator makro → tentukan fase siklus → keluarkan daftar sektor yang secara historis
unggul di fase itu → saring emiten di sektor itu. → **M-12**

### I-5b Fundamental — INI YANG ANDA BILANG PALSU
Anda menyebut **empat hal spesifik**, dan tiap-tiapnya harus jadi perhitungan, bukan catatan:

| Yang Anda minta | Artinya secara data | Yang harus dihitung mesin |
|---|---|---|
| riwayat manajemen | direksi & komisaris: sejak kapan, pernah di perusahaan mana, pernah kena sanksi/PKPU/pailit | skor integritas & pengalaman, penanda merah kalau ada sanksi OJK/BEI |
| pemegang saham mayoritas | struktur kepemilikan, pengendali akhir, porsi publik, saham digadaikan | konsentrasi kepemilikan (HHI), porsi publik < 7,5% = penanda merah, gadai saham pengendali = penanda merah |
| riwayat & afiliasi perusahaan | grup usaha, transaksi pihak berelasi, anak/induk usaha | nilai transaksi pihak berelasi ÷ pendapatan; > 30% = penanda merah |
| red flag laporan keuangan | angka riil dari laporan keuangan | 14 pemeriksaan otomatis, lihat tabel di M-13 |
| corporate action & efeknya | dividen, right issue, stock split, buyback, merger, private placement | efek dilusi, efek harga, riwayat dan tanggalnya |

**Status:** **PALSU**. Harus dibongkar total. Rancangan penggantinya lengkap di **M-13**.

### I-5c Teknikal (waktu masuk/keluar)
Rata-rata bergerak, RSI, MACD, volume, support/resistance, ATR untuk *stop loss*. → **M-14**

---

## I-6 — "dan lain itu"

> **Kutipan Anda:** "dan lain itu: manajemen hutang piutang, asuransi, tujuan investasi lengkap,
> sumber penghasilan, waris/hibah/dana pensiun."

Lima modul, semuanya wajib, tidak ada yang boleh dilabeli "menyusul":

| Modul | Isi minimal |
|---|---|
| **M-07 Hutang & Piutang** | pokok, bunga (flat/efektif/anuitas), tenor, jatuh tempo, denda, rasio cicilan terhadap penghasilan, strategi longsor/salju, simulasi pelunasan dipercepat, piutang: siapa, berapa, jatuh tempo, risiko macet |
| **M-08 Asuransi** | jenis (jiwa/kesehatan/kecelakaan/properti/kendaraan), penanggung, premi, periode bayar, uang pertanggungan, masa berlaku, hitung **kebutuhan uang pertanggungan** vs yang dimiliki = kesenjangan proteksi |
| **M-05 Tujuan Investasi** | pendidikan, rumah, kendaraan, haji/umrah, pensiun, modal usaha, warisan — masing-masing: target nominal, tanggal target, dana terkumpul, setoran bulanan yang dibutuhkan, tingkat prioritas |
| **M-06 Sumber Penghasilan** | gaji, usaha, sewa, dividen, kupon SBN, bagi hasil, komisi, pekerja lepas — masing-masing: nominal, kepastian (tetap/tidak), pajak, frekuensi. Menghasilkan **skor diversifikasi penghasilan** |
| **M-09 Pensiun, Waris & Hibah** | usia pensiun target, saldo BPJS TK/DPLK sekarang, iuran, proyeksi nilai akhir, kebutuhan dana pensiun, kesenjangan; waris/hibah yang akan diterima & yang akan diberikan, catatan wasiat |

**Status:** ADA semua di pratinjau sebagai formulir + hitungan dasar. Perlu dipindah ke modul
tersendiri dengan validasi dan penyimpanan di basis data.

---

## I-7 — Larangan melabeli "menyusul"

> **Kutipan Anda:** "crosscheck seluruh instruksi; fitur yang diinstruksikan jangan dilabeli
> 'menyusul'."

**Aturan yang saya pakai sekarang:**
- Anda menyebutnya → **saya bangun**. Kalau belum sanggup penuh, saya bangun versi paling
  jujur yang bisa jalan, dan saya tulis apa yang belum lengkap **di dalam dokumen ini**,
  bukan sebagai label pengelak di UI.
- "Menyusul" hanya boleh untuk hal yang **tidak pernah Anda minta** dan saya usulkan sendiri.

**Status:** dipatuhi mulai dokumen ini. Bab 3 tidak memuat satu pun kata "menyusul" untuk
fitur yang Anda perintahkan; yang ada adalah status BELUM/PALSU/SALAH + rencana pengerjaannya.

---

## I-8 — Koreksi terakhir dan yang paling penting

> **Kutipan Anda (inti):** "Fundamental Analysis cuma poin manual, bukan analisis sungguhan.
> Bedakan ASET dan KHL. Miris, gaji banyak orang di bawah KHL (Kebutuhan Hidup Layak) — untuk
> satu orang saja kurang, apalagi seluruh tanggungan. Tambah menu daftar emiten yang rutin bagi
> dividen supaya pengguna dapat penghasilan bulanan dari dividen, daftarnya ada riwayat yang
> membuktikan. Vibes coding, perhatikan keamanan, API, dll. KHL = Kebutuhan Hidup Layak,
> BUKAN aset."

Lima perintah terpisah:

**I-8.1 Fundamental harus analisis sungguhan** → dibongkar dan dirancang ulang di **M-13**.

**I-8.2 KHL ≠ ASET, dan keduanya harus ada** → **M-01** dan **M-02**, terpisah.

**I-8.3 Kenyataan gaji di bawah KHL harus jadi fitur, bukan basa-basi.**
Ini bukan kalimat empati, ini spesifikasi. Aplikasi harus:
- Menghitung **kesenjangan KHL** = KHL rumah tangga − penghasilan bersih rumah tangga.
- Kalau kesenjangan positif, aplikasi **berganti mode**: berhenti bicara investasi, ganti
  bicara **cara menutup kesenjangan** (tambah penghasilan, bantuan sosial yang berhak,
  turunkan biaya terbesar, negosiasi utang).
- Data pembanding nyata: **UMP 2026 DKI Jakarta Rp 5,73 juta, sedangkan KHL DKI Jakarta
  Rp 5.898.511** — artinya upah minimum resmi pun **masih di bawah** KHL.
  Di DI Yogyakarta jaraknya jauh lebih lebar: UMP 2026 Rp 2,41 juta vs KHL Rp 4.604.982.
  Angka-angka ini masuk ke dalam aplikasi sebagai data, supaya pengguna melihat bahwa
  kekurangannya **bukan karena dia boros**.
  (Sumber: rilis Kemnaker, Desember 2025.)

**I-8.4 Menu daftar emiten yang rutin bagi dividen, dengan riwayat sebagai bukti** → **M-15**.
Termasuk: penyusunan **kalender dividen 12 bulan** supaya penghasilan dividen bisa diatur
masuk hampir tiap bulan, dan penghitungan **berapa lot yang perlu dibeli** untuk mendapat
target rupiah per bulan.

**I-8.5 Keamanan, API, autentikasi — jangan asal** → **M-19** + Bab 5.

---

# BAB 2 — GLOSARIUM RESMI (supaya tidak salah lagi)

| Istilah | Definisi yang dipakai di proyek ini | Bukan ini |
|---|---|---|
| **KHL** | Kebutuhan Hidup Layak — standar rupiah per bulan agar pekerja **dan keluarganya** hidup layak. Dasar: Permenaker 21/2016 jo. Permenaker 18/2020 (64 komponen, 7 kelompok); sejak 2025 Kemnaker memakai metode berbasis studi ILO dengan 4 kelompok konsumsi. | **Bukan** logam mulia. **Bukan** aset. **Bukan** kekayaan. |
| **ASET** | Segala yang dimiliki dan punya nilai: kas, emas, perak, tanah, properti, SBN, reksadana, saham, deposito, kripto, kendaraan, usaha. | Bukan pengeluaran. |
| **Logam mulia** | Bagian **dari** ASET: emas, perak, platinum. | Bukan KHL. |
| **UMP** | Upah Minimum Provinsi — angka yang **ditetapkan pemerintah**, sering **di bawah** KHL. | Bukan KHL. |
| **Garis kemiskinan BPS** | Rp 609.160 per orang per bulan (Maret 2025) — ambang **miskin**, jauh di bawah "layak". | Bukan KHL, bukan standar layak. |
| **Standar Hidup Layak BPS** | Rata-rata pengeluaran riil per kapita untuk hitung IPM (± Rp 1,02 juta/bulan, 2024). BPS sendiri menegaskan ini **bukan** kriteria layak/tidak layak. | Bukan KHL Kemnaker. |
| **Kekayaan bersih** | Total ASET − Total Utang. | Bukan penghasilan. |
| **Arus kas** | Penghasilan masuk − pengeluaran keluar per bulan. | Bukan kekayaan. |

**Kalimat kunci yang dipakai di seluruh UI:**
> "KHL adalah **berapa yang harus keluar** supaya hidup layak.
> Aset adalah **berapa yang Anda punya**. Dua-duanya dihitung di sini."

---

# BAB 3 — PENJABARAN PER MODUL

Setiap modul ditulis dengan pola yang sama: **Tujuan → Dasar/Sumber Data → Skema Data →
Rumus → Aturan Validasi → Layar UI → Endpoint → Kriteria Terima → Status.**

---

## M-01 — KHL (KEBUTUHAN HIDUP LAYAK)

### M-01.1 Tujuan
Menjawab satu pertanyaan yang tidak dijawab aplikasi keuangan mana pun di Indonesia:
**"Penghasilan saya cukup untuk hidup layak atau tidak — bukan menurut perasaan saya,
tapi menurut standar resmi?"**

Modul ini adalah **lantai** seluruh aplikasi. Semua nasihat lain (investasi, dividen, saham)
**tidak boleh keluar** sebelum lantai ini diperiksa.

### M-01.2 Dasar hukum & metode
1. **Permenakertrans 13/2012** — 60 komponen KHL.
2. **Permenaker 21/2016** — menggantikan aturan sebelumnya.
3. **Permenaker 18/2020** — merevisi jadi **64 komponen** dalam **7 kelompok**:
   makanan & minuman (13 jenis), sandang (13), perumahan (26), pendidikan (2),
   kesehatan (5), transportasi (1: angkutan umum), komunikasi (1: paket pulsa & data ± 2 GB),
   serta rekreasi/tabungan/jaminan sosial (3: rekreasi, tabungan 2% total pengeluaran,
   jaminan sosial 2% total pengeluaran).
4. **UU 11/2020 & PP 36/2021** — KHL sempat **dikeluarkan** dari formula upah minimum.
5. **Putusan MK 168/PUU-XXI/2023** — mengembalikan keharusan mempertimbangkan kebutuhan hidup layak.
6. **Metode baru Kemnaker (dirilis Desember 2025)** — mengacu studi ILO
   *"Minimum Wage Study: Developing a Formula and Methodology for Minimum Wage Determination
   in Indonesia" (2025)*, memakai **4 kelompok konsumsi**: (a) makanan, (b) kesehatan &
   pendidikan, (c) perumahan, (d) kebutuhan pokok lainnya.

**Rumus resmi Kemnaker (metode 2025):**
```
KHL_provinsi = (konsumsi_per_kapita × jumlah_anggota_rumah_tangga) ÷ jumlah_anggota_yang_bekerja
```
Perhatikan penyebutnya: **jumlah anggota rumah tangga yang bekerja**. Artinya KHL versi
Kemnaker sudah mengandaikan beban dibagi antar pencari nafkah. Aplikasi harus meminta angka
ini, tidak boleh mengasumsikan 1.

### M-01.3 Data KHL 38 provinsi (rilis Kemnaker, Desember 2025, rupiah/bulan)

| # | Provinsi | KHL | # | Provinsi | KHL |
|---:|---|---:|---:|---|---:|
| 1 | DKI Jakarta | 5.898.511 | 20 | Sulawesi Utara | 3.864.224 |
| 2 | Kalimantan Timur | 5.735.353 | 21 | Bengkulu | 3.714.932 |
| 3 | Kepulauan Riau | 5.717.082 | 22 | Sulawesi Selatan | 3.670.085 |
| 4 | Papua | 5.314.281 | 23 | Aceh | 3.654.466 |
| 5 | Papua Selatan | 5.314.281 | 24 | Sulawesi Tenggara | 3.645.086 |
| 6 | Papua Tengah | 5.314.281 | 25 | Sumatera Utara | 3.599.803 |
| 7 | Papua Pegunungan | 5.314.281 | 26 | Jawa Timur | 3.575.938 |
| 8 | Bali | 5.253.107 | 27 | Sulawesi Tengah | 3.546.013 |
| 9 | Papua Barat | 5.246.172 | 28 | Jawa Tengah | 3.512.997 |
| 10 | Papua Barat Daya | 5.246.172 | 29 | Nusa Tenggara Barat | 3.410.833 |
| 11 | Kalimantan Utara | 4.968.935 | 30 | Gorontalo | 3.398.395 |
| 12 | Kep. Bangka Belitung | 4.714.805 | 31 | Lampung | 3.343.494 |
| 13 | DI Yogyakarta | 4.604.982 | 32 | Sumatera Selatan | 3.299.907 |
| 14 | Maluku Utara | 4.431.339 | 33 | Sulawesi Barat | 3.091.442 |
| 15 | Banten | 4.295.985 | 34 | Nusa Tenggara Timur | 3.054.508 |
| 16 | Kalimantan Tengah | 4.279.888 | 35 | Jambi | 3.931.596 |
| 17 | Maluku | 4.168.498 | 36 | Sumatera Barat | 4.076.173 |
| 18 | Riau | 4.158.948 | 37 | Kalimantan Barat | 4.083.420 |
| 19 | Jawa Barat | 4.122.871 | 38 | Kalimantan Selatan | 4.112.552 |

Disimpan sebagai `data/khl/2026/khl-provinsi.json` + satu berkas per provinsi
`data/khl/2026/id-jk.json`, `id-jb.json`, … (38 berkas) supaya bisa diperbarui satu-satu
tanpa menyentuh yang lain, dan supaya riwayat perubahannya terbaca di git.

### M-01.4 Kesenjangan KHL vs UMP (fakta yang harus ditampilkan)

| Provinsi | UMP 2026 | KHL 2026 | Kesenjangan | Rasio UMP/KHL |
|---|---:|---:|---:|---:|
| DKI Jakarta | 5.730.000 | 5.898.511 | −168.511 | 97,1% |
| DI Yogyakarta | 2.410.000 | 4.604.982 | −2.194.982 | 52,3% |
| Bali | 3.200.000 | 5.253.107 | −2.053.107 | 60,9% |

Artinya: **bahkan pekerja yang digaji sesuai upah minimum resmi pun belum tentu mencapai
Kebutuhan Hidup Layak.** Ini yang Anda sebut "miris", dan ini yang dijadikan fitur, bukan
kalimat penghibur. (Angka UMP di atas adalah angka yang diumumkan pada Desember 2025;
di dalam aplikasi angka UMP disimpan per provinsi dan bisa diperbarui.)

### M-01.5 Skema data

```jsonc
// khl_reference (data acuan, dari pemerintah)
{
  "tahun": 2026,
  "kode_provinsi": "31",
  "nama_provinsi": "DKI Jakarta",
  "khl_bulanan": 5898511,
  "ump": 5730000,
  "sumber": "Kemnaker (metode ILO 2025)",
  "tanggal_rilis": "2025-12-20",
  "metode": "konsumsi_per_kapita x ART / ART_bekerja"
}

// khl_rumah_tangga (hasil hitung untuk pengguna)
{
  "id": "uuid",
  "user_id": "uuid",
  "kode_provinsi": "31",
  "jumlah_art": 4,             // anggota rumah tangga
  "art_bekerja": 1,
  "mode": "acuan | survei_sendiri",
  "khl_acuan": 5898511,
  "khl_survei": null,          // kalau pengguna isi 64 komponen sendiri
  "khl_dipakai": 5898511,
  "penghasilan_bersih_rt": 4200000,
  "kesenjangan": 1698511,      // positif = kurang
  "rasio_pemenuhan": 0.712,
  "status": "DI BAWAH KHL",
  "dihitung_pada": "2026-08-03T10:00:00+07:00"
}

// khl_komponen (kalau pengguna mau survei mandiri 64 komponen)
{
  "kelompok": "makanan_minuman",   // 7 kelompok Permenaker 18/2020
  "nomor": 1,
  "nama": "Beras kualitas sedang",
  "satuan": "kg",
  "kuantitas_bulanan": 10,
  "harga_satuan": 14000,
  "nilai": 140000
}
```

### M-01.6 Rumus

```
(1) KHL acuan
    KHL_rt = KHL_provinsi                       // sudah termasuk keluarga (metode Kemnaker)

(2) KHL disesuaikan tanggungan (kalau ART pengguna beda dari asumsi Kemnaker = 4 orang)
    KHL_rt = KHL_provinsi × (ART_pengguna / 4) × (1 / maks(ART_bekerja,1)) × ART_bekerja
    // disederhanakan: KHL_rt = konsumsi_kapita_prov × ART_pengguna
    // konsumsi_kapita_prov = KHL_provinsi × ART_bekerja_asumsi / ART_asumsi

(3) KHL survei mandiri
    KHL_rt = Σ (kuantitas × harga) untuk 64 komponen
             × (1 + 2% tabungan) × (1 + 2% jaminan sosial)

(4) Kesenjangan
    kesenjangan       = KHL_rt − penghasilan_bersih_rt
    rasio_pemenuhan   = penghasilan_bersih_rt / KHL_rt
    status = rasio < 0,60 -> "KRITIS"
             0,60–0,85    -> "DI BAWAH KHL"
             0,85–1,00    -> "MENDEKATI KHL"
             1,00–1,50    -> "LAYAK"
             > 1,50       -> "LAYAK + SURPLUS"

(5) Berapa lama lagi tercapai (kalau penghasilan naik x% / tahun)
    tahun = ln(KHL_rt / penghasilan) / ln(1 + kenaikan_tahunan)
```

### M-01.7 Aturan bisnis (WAJIB, ini pembeda produk)

| Kondisi | Yang aplikasi lakukan | Yang aplikasi DILARANG lakukan |
|---|---|---|
| rasio < 0,85 | Masuk **Mode Bertahan**. Tampilkan rencana menutup kesenjangan: daftar biaya terbesar, opsi penghasilan tambahan, program bantuan pemerintah yang mungkin berhak (PKH, BPJS PBI, KIP), negosiasi/restrukturisasi utang. | Menyarankan beli saham, reksadana, emas, apalagi kripto. Menyalahkan pengguna ("kurangi ngopi"). |
| 0,85 ≤ rasio < 1,0 | **Mode Stabilisasi**. Target: dana darurat 1 bulan, BPJS aktif, hentikan utang konsumtif baru. | Menyuruh investasi agresif. |
| rasio ≥ 1,0 | **Mode Bertumbuh**. Baru boleh membuka modul investasi (M-12 s/d M-15). | — |

### M-01.8 Layar UI
`/khl` — "Kebutuhan Hidup Layak"
1. **Kartu utama**: KHL provinsi Anda vs penghasilan Anda, batang berdampingan, selisih besar
   di tengah, status berwarna (merah/kuning/hijau).
2. **Kartu perbandingan**: KHL vs UMP provinsi vs Garis Kemiskinan BPS vs penghasilan Anda —
   empat batang, supaya kelihatan bahwa "tidak miskin" ≠ "hidup layak".
3. **Tabel 38 provinsi** yang bisa diurutkan, dengan penanda provinsi Anda.
4. **Rincian 7 kelompok / 64 komponen** — bisa diisi sendiri untuk survei mandiri.
5. **Simulasi**: "kalau penghasilan naik Rp X" / "kalau pindah ke provinsi Y" / "kalau
   pasangan ikut bekerja" → berapa rasio pemenuhannya.
6. **Rencana menutup kesenjangan** — daftar langkah dengan estimasi rupiah per langkah.

### M-01.9 Endpoint
```
GET  /api/v1/khl/provinsi                 -> daftar 38 provinsi + KHL + UMP
GET  /api/v1/khl/provinsi/:kode           -> detail 1 provinsi + riwayat tahunan
GET  /api/v1/khl/komponen?tahun=2026      -> 64 komponen + kuantitas acuan
POST /api/v1/khl/hitung                   -> body: provinsi, ART, ART_bekerja, penghasilan
                                             resp: khl, kesenjangan, rasio, status, mode
POST /api/v1/khl/survei                   -> simpan survei mandiri 64 komponen
GET  /api/v1/khl/rencana-tutup-kesenjangan-> langkah + estimasi dampak rupiah
```

### M-01.10 Kriteria terima
- [ ] Pilih "DKI Jakarta", ART 4, bekerja 1, penghasilan Rp 4.200.000 → hasil harus:
      KHL 5.898.511, kesenjangan 1.698.511, rasio 71,2%, status "DI BAWAH KHL", Mode Bertahan.
- [ ] Dalam Mode Bertahan, tab Investasi/Dividen **terkunci** dengan penjelasan sopan.
- [ ] Data 38 provinsi tersimpan di berkas, bukan di dalam kode HTML.
- [ ] Ada tanggal & sumber di setiap angka.

### M-01.11 Status
**SUDAH DIBUAT (T-1 selesai).** Rinciannya:
- `data/khl/2026/` — 38 berkas provinsi + `indeks.json` + `komponen-64.json` + `asumsi.json`
- `data/ump/2026/` — 38 berkas provinsi + `indeks.json` (pembanding UMP 2026)
- `packages/domain-khl/src/` — 9 berkas rumus/aturan, tiap rumus satu berkas
- `packages/domain-khl/test/` — 6 berkas tes, **35 tes lulus** (`npm test`)
- `apps/preview/bangun-preview.js` — menyuntik rumus & data ke `preview.html`
  sehingga satu rumus hanya ada di satu berkas
- `preview.html` — tab **🏠 KHL**
- `server.js` — `GET /api/khl/provinsi`, `GET /api/khl/provinsi/:kode`,
  `GET /api/khl/komponen`, `POST /api/khl/hitung`, `POST /api/khl/survei` (dengan validasi masukan)

**Temuan dari data sendiri:** **32 dari 38 provinsi** punya UMP 2026 **di bawah** KHL 2026.
Jarak terlebar di DI Yogyakarta (UMP Rp 2.417.495 vs KHL Rp 4.604.982 = 52,5%), lalu Jawa Barat
(56,2%) dan Bali (61,1%). Hanya 6 provinsi yang UMP-nya sudah menutup KHL: Gorontalo,
Sulawesi Utara, Sulawesi Selatan, Sulawesi Barat, Aceh, dan Sumatera Selatan.

---

## M-02 — ASET (HARTA / KEKAYAAN)

### M-02.1 Tujuan
Mendata **semua yang Anda miliki**, menilainya dengan harga sedekat mungkin ke harga pasar,
lalu menghitung kekayaan bersih dan sebaran risikonya. **Ini bukan KHL.**

### M-02.2 Delapan golongan aset (semua wajib ada)

| Kode | Golongan | Cara menilai | Sumber harga | Likuiditas |
|---|---|---|---|---|
| A1 | Kas & setara | nominal | input | sangat tinggi |
| A2 | Logam mulia (emas, perak) | gram × harga/gram | `api.gold-api.com/price/XAU`, `/XAG` + kurs | tinggi |
| A3 | Surat Berharga Negara (ORI, SR, ST, SBR, FR) | nominal × harga pasar% + kupon berjalan | input + jadwal kupon | sedang |
| A4 | Reksa dana | unit × NAB | input NAB / API manajer investasi | sedang–tinggi |
| A5 | Saham | lot × 100 × harga | input / API harga | tinggi |
| A6 | Tanah | luas × harga/m² (NJOP atau pembanding) | input + NJOP | rendah |
| A7 | Properti/bangunan | nilai pasar, dikurangi penyusutan | input + pembanding | rendah |
| A8 | Lainnya: kendaraan, usaha, piutang, kripto | input / API | input, CoinGecko | beragam |

**Catatan jujur:** tanah dan properti **tidak punya harga pasar harian**. Tidak ada API yang
bisa memberi harga rumah Anda. Maka penilaiannya: input pengguna + acuan NJOP + catatan
tanggal penilaian + pengingat menilai ulang tiap 12 bulan. Ini bukan kekurangan aplikasi,
ini sifat asetnya. Yang penting **jangan berpura-pura otomatis**.

### M-02.3 Skema data
```jsonc
{
  "id": "uuid", "user_id": "uuid",
  "golongan": "A6",
  "nama": "Tanah Ciputat 200 m2",
  "kuantitas": 200, "satuan": "m2",
  "harga_perolehan": 1500000,      // per satuan, saat beli
  "tanggal_perolehan": "2019-04-10",
  "harga_sekarang": 3200000,       // per satuan
  "sumber_harga": "manual|api|njop",
  "tanggal_penilaian": "2026-08-01",
  "nilai_sekarang": 640000000,
  "mata_uang": "IDR",
  "likuiditas": "rendah",
  "menghasilkan_arus_kas": false,
  "arus_kas_bulanan": 0,           // sewa/kupon/dividen
  "dijaminkan": false,
  "utang_terkait_id": null,
  "catatan": "SHM, sudah balik nama"
}
```

### M-02.4 Rumus
```
nilai_sekarang    = kuantitas × harga_sekarang
untung_rugi       = nilai_sekarang − (kuantitas × harga_perolehan)
imbal_hasil_thn   = (nilai_sekarang / nilai_perolehan)^(1/lama_tahun) − 1     // CAGR
kekayaan_bersih   = Σ nilai_sekarang_aset − Σ sisa_pokok_utang
rasio_likuid      = Σ aset_likuiditas_tinggi / pengeluaran_bulanan            // dalam bulan
sebaran_risiko    = porsi tiap golongan terhadap total (untuk deteksi terlalu menumpuk)
penghasilan_pasif = Σ arus_kas_bulanan dari aset
rasio_kemerdekaan = penghasilan_pasif / pengeluaran_bulanan                   // 1,0 = merdeka
```

### M-02.5 Aturan validasi
- `kuantitas > 0`, `harga_sekarang ≥ 0`, `tanggal_penilaian ≤ hari ini`.
- Kalau `sumber_harga = manual` dan `tanggal_penilaian` lebih dari 365 hari lalu →
  beri tanda "perlu dinilai ulang", dan **jangan** ikutkan penuh dalam grafik kekayaan.
- Kalau `dijaminkan = true`, aset tidak boleh dihitung sebagai bagian dana darurat.
- Emas: pastikan konversi troy ounce → gram = **31,1034768**, jangan pakai 31,1.

### M-02.6 Layar UI
`/aset` — ringkasan kekayaan bersih, grafik komposisi 8 golongan, tabel aset,
tombol tambah per golongan (formulirnya beda-beda: emas minta gram & kadar; tanah minta luas,
sertifikat, NJOP; SBN minta seri, kupon, jatuh tempo), garis waktu perubahan kekayaan,
dan **peringatan konsentrasi** kalau satu golongan > 60%.

### M-02.7 Endpoint
```
GET    /api/v1/aset                 POST /api/v1/aset
PATCH  /api/v1/aset/:id             DELETE /api/v1/aset/:id
POST   /api/v1/aset/:id/nilai-ulang
GET    /api/v1/aset/ringkasan       -> kekayaan bersih, komposisi, penghasilan pasif
GET    /api/v1/harga/logam-mulia    -> emas & perak dalam IDR/gram (cache 15 menit)
GET    /api/v1/harga/kripto         -> BTC, ETH (cache 5 menit)
GET    /api/v1/harga/kurs           -> USD/IDR
```

### M-02.8 Kriteria terima
- [ ] Emas 50 gram harus otomatis ternilai memakai harga riil hari itu, dan menampilkan
      tanggal + sumber harganya.
- [ ] Tanah tanpa penilaian ulang > 1 tahun diberi tanda kuning.
- [ ] Kekayaan bersih = total aset − total utang, angkanya cocok dengan modul utang (M-07).
- [ ] Kata "KHL" **tidak boleh muncul** di modul ini.

### M-02.9 Status
**ADA sebagian.** Emas, perak, kripto, kurs sudah riil. Tanah/properti/SBN/reksadana/saham
sudah bisa dicatat manual. Yang belum: perhitungan CAGR, penghasilan pasif, rasio kemerdekaan,
peringatan konsentrasi, dan pemisahan tegas dari KHL di tampilan.

---

## M-03 — PROFIL & TANGGUNGAN

**Tujuan:** mengetahui persis siapa yang harus dihidupi dan kapan uang dibutuhkan.

**Skema:**
```jsonc
profil      { nama, tanggal_lahir, jenis_kelamin, kode_provinsi, kota,
              status_kawin, pekerjaan, jumlah_art, art_bekerja, npwp_ada }
pasangan    { nama, tanggal_lahir, bekerja, penghasilan_bersih }
anak[]      { nama, tanggal_lahir, jenjang_sekarang, tahun_masuk_sd,
              rencana_kuliah, perkiraan_biaya_kuliah_hari_ini }
tanggungan[]{ nama, hubungan, biaya_bulanan, mulai, perkiraan_selesai, wajib }
```

**Rumus:**
```
umur(x)                  = beda_tahun(tanggal_lahir, hari_ini)
tahun_masuk(jenjang)     = tahun_lahir + {SD:6, SMP:12, SMA:15, S1:18}
bulan_tersisa            = (tahun_masuk − tahun_ini)×12 − bulan_berjalan
beban_tanggungan_bulanan = Σ tanggungan.biaya_bulanan
faktor_KHL               = jumlah_art / 4        // 4 = asumsi ART Kemnaker
```

**Aturan:** tanggal lahir tidak boleh di masa depan; umur anak > umur orang tua ditolak;
`art_bekerja ≤ jumlah_art`; perubahan profil **memicu hitung ulang** M-01, M-04, M-05, M-08.

**Endpoint:** `GET/PUT /api/v1/profil`, `CRUD /api/v1/profil/anak`, `/api/v1/profil/tanggungan`.

**Status:** ADA (pratinjau), belum memicu hitung ulang KHL karena M-01 belum ada.

---

## M-04 — DANA DARURAT

**Tujuan:** menentukan besar dana darurat berdasarkan kenyataan keluarga, bukan angka bulat.

**Rumus lengkap:**
```
pengeluaran_wajib_bulanan = maks(KHL_rt, pengeluaran_tercatat_3_bulan_terakhir_rata2)
faktor_dasar   = 3
faktor += 1 kalau menikah
faktor += 1 per anak (maksimal +3)
faktor += 1 per tanggungan lain (maksimal +2)
faktor += 3 kalau penghasilan tidak tetap (wiraswasta/komisi/lepas)
faktor += 1 kalau tidak punya asuransi kesehatan
faktor  = batasi antara 3 dan 12
target_dana_darurat = pengeluaran_wajib_bulanan × faktor
sudah_terkumpul     = Σ aset likuiditas tinggi yang tidak dijaminkan
kekurangan          = target − sudah_terkumpul
lama_terkumpul_bln  = kekurangan / setoran_bulanan_yang_mampu
```
**Catatan penting:** memakai `maks(KHL, realisasi)` — kalau realisasi pengeluaran seseorang
di bawah KHL, itu bukan tanda hemat, itu tanda ada kebutuhan yang tidak terpenuhi. Dana
daruratnya tetap harus dihitung dari KHL.

**Layar:** cincin kemajuan, target, kekurangan, perkiraan bulan tercapai, tempat menaruh
(kas/deposito/reksadana pasar uang/SBN ritel).
**Endpoint:** `GET /api/v1/dana-darurat`, `POST /api/v1/dana-darurat/simulasi`.
**Status:** ADA sebagian; faktor belum selengkap ini; belum tersambung ke KHL.

---

## M-05 — TUJUAN INVESTASI (LENGKAP)

**Jenis tujuan yang wajib disediakan:** pendidikan anak (per anak per jenjang), rumah pertama,
renovasi, kendaraan, haji/umrah, pernikahan, modal usaha, pensiun, warisan/wakaf, liburan,
dana kesehatan orang tua, dan tujuan bebas.

**Skema:**
```jsonc
{ id, nama, jenis, nilai_hari_ini, tanggal_target, prioritas /*1-5*/,
  inflasi_khusus /*pendidikan 10%, properti 8%, umum = inflasi BPS*/,
  dana_terkumpul, instrumen /*kas|emas|SBN|RD pasar uang|RD saham|saham*/,
  asumsi_imbal_hasil, status }
```

**Rumus:**
```
n_bulan   = selisih_bulan(hari_ini, tanggal_target)
FV        = nilai_hari_ini × (1 + inflasi_khusus)^(n_bulan/12)
r_bulanan = (1 + asumsi_imbal_hasil)^(1/12) − 1
setoran   = (FV − dana_terkumpul × (1+r_bulanan)^n_bulan) × r_bulanan
            / ((1+r_bulanan)^n_bulan − 1)
kalau r = 0 -> setoran = (FV − dana_terkumpul) / n_bulan
```
**Pemilihan instrumen otomatis berdasarkan horizon:**
`< 1 thn` → kas/deposito/RD pasar uang · `1–3 thn` → SBN ritel/RD pendapatan tetap ·
`3–5 thn` → campuran/emas · `> 5 thn` → saham/RD saham/properti.

**Aturan keras:** total seluruh `setoran` tujuan tidak boleh melebihi
`penghasilan − KHL_rt − cicilan_wajib`. Kalau melebihi, aplikasi **menurunkan tujuan
berprioritas rendah** dan mengatakan terus terang tujuan mana yang harus mundur, berapa tahun.

**Status:** ADA sebagian (pendidikan & beberapa tujuan), pembatas terhadap KHL BELUM.

---

## M-06 — SUMBER PENGHASILAN

**Tujuan:** memisahkan penghasilan yang **pasti** dari yang **tidak pasti**, dan mengukur
seberapa rapuh keuangan pengguna kalau satu sumber hilang.

**Skema:** `{ nama, jenis(gaji|usaha|sewa|dividen|kupon|komisi|lepas|bantuan),
nominal_bulanan, frekuensi(bulanan|triwulan|semester|tahunan|tidak tentu),
kepastian(tetap|semi|tidak tetap), dipotong_pajak, pph_persen, aktif_sejak }`

**Rumus:**
```
penghasilan_bersih_bulanan = Σ (nominal_setara_bulanan × (1 − pph_persen))
setara_bulanan: tahunan/12, triwulan/3, semester/6, tidak tentu = rata-rata 6 bulan terakhir
porsi_i          = penghasilan_i / total
skor_konsentrasi = Σ porsi_i²            // HHI; 1,0 = hanya satu sumber
skor_diversifikasi = (1 − skor_konsentrasi) × 100
risiko_kehilangan_terbesar = porsi terbesar × total
bulan_bertahan_kalau_sumber_utama_hilang = dana_darurat / (KHL_rt − penghasilan_sisa)
```
**Layar:** daftar sumber, grafik porsi, "kalau gaji hilang besok, Anda bertahan N bulan".
**Status:** ADA sebagian; skor konsentrasi & simulasi kehilangan BELUM.

---

## M-07 — MANAJEMEN HUTANG & PIUTANG

### Hutang
**Skema:** `{ nama, pemberi, jenis(KPR|KKB|KTA|kartu kredit|paylater|pinjol|koperasi|keluarga),
pokok_awal, sisa_pokok, bunga_persen_tahun, jenis_bunga(flat|efektif|anuitas),
tenor_bulan, cicilan_bulanan, tanggal_mulai, tanggal_jatuh_tempo, denda_telat, jaminan }`

**Rumus:**
```
Anuitas:  cicilan = P × i / (1 − (1+i)^-n)        ; i = bunga_tahun/12
Flat:     cicilan = P/n + P × bunga_tahun/12      ; bunga efektif ≈ 1,8 × bunga flat
Efektif:  bunga_bulan_ini = sisa_pokok × bunga_tahun/12
RCTP (rasio cicilan terhadap penghasilan) = Σ cicilan_wajib / penghasilan_bersih
   < 30% sehat · 30–40% waspada · 40–50% berat · > 50% darurat
Total bunga dibayar = Σ (cicilan × n) − P
Strategi longsor (avalanche): urutkan bunga tertinggi -> hemat bunga terbanyak
Strategi salju  (snowball) : urutkan sisa terkecil    -> menang cepat secara psikologis
Simulasi pelunasan dipercepat: tambah X per bulan -> hitung ulang n dan penghematan bunga
```
**Peringatan otomatis:** pinjol/paylater dengan bunga efektif > 40%/tahun ditandai merah dan
selalu diletakkan paling atas antrean pelunasan, mengalahkan urutan strategi mana pun.

### Piutang
**Skema:** `{ nama_peminjam, hubungan, nominal, tanggal_pinjam, jatuh_tempo, sudah_dibayar,
kemungkinan_tertagih(tinggi|sedang|rendah), catatan, bukti }`
**Rumus:** `nilai_wajar_piutang = sisa × faktor(kemungkinan)`, faktor 0,9 / 0,5 / 0,1.
Hanya `nilai_wajar` yang masuk kekayaan bersih — supaya pengguna tidak merasa kaya karena
uang yang tidak akan kembali.

**Status:** ADA sebagian; bunga flat vs efektif, simulasi percepatan, dan penilaian piutang BELUM.

---

## M-08 — ASURANSI

**Skema:** `{ jenis(jiwa|kesehatan|kecelakaan|penyakit kritis|properti|kendaraan|BPJS),
penanggung, nomor_polis, premi, periode_bayar, uang_pertanggungan, mulai, berakhir,
tertanggung, penerima_manfaat, unit_link(true/false) }`

**Rumus kebutuhan uang pertanggungan jiwa — tiga metode, ditampilkan ketiganya:**
```
(1) Pengganti penghasilan:
    UP = penghasilan_tahunan × tahun_tanggungan_masih_butuh
(2) Nilai kini kebutuhan (lebih tepat):
    UP = Σ_t [ (KHL_rt + biaya_pendidikan_t) / (1+r)^t ] + sisa_utang − aset_likuid
(3) Metode bunga:
    UP = kebutuhan_tahunan / imbal_hasil_investasi_aman   (mis. 6%)
kesenjangan_proteksi = UP_dibutuhkan − Σ UP_polis_yang_ada
rasio_premi = Σ premi_bulanan / penghasilan_bersih   ; sehat 5–10%
```
**Peringatan:** kalau `rasio_premi > 15%` → tandai; kalau punya unit link sementara dana darurat
belum ada → tandai urutan prioritasnya terbalik; kalau BPJS tidak aktif → prioritas paling atas
karena preminya paling murah per rupiah pertanggungan.

**Status:** ADA sebagian (daftar polis + satu metode). Dua metode lain & peringatan BELUM.

---

## M-09 — DANA PENSIUN, WARIS & HIBAH

**Skema:** `pensiun { usia_sekarang, usia_pensiun_target, harapan_hidup(asumsi 75),
saldo_bpjs_tk, saldo_dplk, iuran_bulanan, asumsi_imbal_hasil, asumsi_inflasi }`
`waris_masuk[] { sumber, perkiraan_nilai, perkiraan_tahun, kepastian }`
`hibah_keluar[] { penerima, nilai, tahun_rencana, jenis(hibah|wakaf|warisan) }`

**Rumus:**
```
n_tahun_kumpul = usia_pensiun − usia_sekarang
n_tahun_pakai  = harapan_hidup − usia_pensiun
kebutuhan_bulanan_saat_pensiun = KHL_rt_sekarang × (1+inflasi)^n_tahun_kumpul × 0,8
   (0,8 = biaya turun karena anak mandiri & tidak ada biaya kerja; bisa diubah)
dana_dibutuhkan = kebutuhan_bulanan × 12 × [1 − (1+g)^-n_pakai] / g
   g = (1+imbal_hasil_pensiun)/(1+inflasi) − 1     // imbal hasil riil
proyeksi_saldo  = saldo_sekarang × (1+r)^n + iuran × [((1+r)^n − 1)/r] × 12
kesenjangan_pensiun = dana_dibutuhkan − proyeksi_saldo
iuran_tambahan_perlu = kesenjangan × r / (((1+r)^n − 1)) / 12
```
**Bagian waris:** pencatatan rencana, bukan nasihat hukum. Aplikasi menyediakan tempat
mencatat aset, ahli waris, dan wasiat, serta **mengingatkan** bahwa pembagian waris tunduk
pada hukum yang berlaku bagi pengguna dan sebaiknya dikonsultasikan ke notaris/ahli.
Tidak boleh mengklaim menghitung faraid/pembagian hukum secara otomatis.

**Status:** ADA sebagian (proyeksi nilai akhir). Imbal hasil riil, kebutuhan berbasis KHL,
dan kesenjangan pensiun BELUM.


---

## M-10 — DATA MAKRO & SIKLUS EKONOMI

### M-10.1 Indikator yang dipantau

| Indikator | Sumber | Kode/Endpoint | Frekuensi |
|---|---|---|---|
| Inflasi tahunan (IHK) | World Bank / BPS | `FP.CPI.TOTL.ZG` | tahunan (BPS bulanan) |
| Pertumbuhan PDB | World Bank / BPS | `NY.GDP.MKTP.KD.ZG` | tahunan/triwulan |
| Tingkat pengangguran | World Bank / BPS | `SL.UEM.TOTL.ZS` | tahunan/semester |
| Suku bunga riil | World Bank | `FR.INR.RINR` | tahunan |
| BI-Rate | Bank Indonesia | halaman resmi / unggah manual | bulanan |
| Kurs USD/IDR | open.er-api.com | `/v6/latest/USD` | harian |
| Harga emas & perak | api.gold-api.com | `/price/XAU`, `/price/XAG` | menit |
| IHSG | penyedia data pasar | — | harian |

**Catatan kejujuran:** BPS dan Bank Indonesia **tidak** menyediakan API publik terbuka tanpa
pendaftaran/CORS untuk semua data ini. Maka rancangannya: `apps/worker` mengambil data dari
sumber resmi (termasuk unggah berkas rilis BPS bila perlu), menyimpannya ke basis data, dan
`apps/api` menyajikannya. Browser **tidak** memanggil sumber luar langsung — itu juga alasan
keamanan (kunci API tidak boleh ada di sisi browser).

### M-10.2 Penentuan fase siklus (aturan yang dipakai)

```
skor_pertumbuhan = normalisasi(pdb, -3%..+7%)
skor_inflasi     = normalisasi(inflasi, 1%..8%)
skor_kerja       = normalisasi(-pengangguran, -8%..-3%)
arah_pdb         = pdb_sekarang − pdb_periode_lalu
arah_inflasi     = inflasi_sekarang − inflasi_periode_lalu

PEMULIHAN : pdb naik   & inflasi rendah/turun
EKSPANSI  : pdb tinggi & inflasi naik sedang
PUNCAK    : pdb melambat & inflasi tinggi & bunga naik
KONTRAKSI : pdb turun/negatif & pengangguran naik
STAGFLASI : pdb rendah/turun & inflasi tinggi   (kasus khusus, harus dikenali terpisah)
```
Stagflasi wajib punya penanganan sendiri karena saran anggarannya berbeda: lindungi daya beli
(emas, SBN indeks inflasi), jangan menambah utang berbunga mengambang.

### M-10.3 Status
ADA (World Bank, 4 indikator + penentuan fase). BELUM: BI-Rate, IHSG, data bulanan BPS,
riwayat fase, dan grafik siklus.

---

## M-11 — BUDGETING BERBASIS FASE (BUKAN 50/30/20)

### M-11.1 Dua fase yang digabung
1. **Fase ekonomi** (dari M-10): pemulihan / ekspansi / puncak / kontraksi / stagflasi.
2. **Fase hidup pengguna**: (a) belum mencapai KHL, (b) baru mencapai KHL,
   (c) mapan tanpa tanggungan, (d) mapan dengan tanggungan, (e) menjelang pensiun, (f) pensiun.

### M-11.2 Tabel alokasi (contoh untuk pengguna yang sudah di atas KHL)

| Fase ekonomi | Kebutuhan pokok | Dana darurat | Lunasi utang | Investasi bertumbuh | Lindung nilai (emas/SBN) |
|---|---:|---:|---:|---:|---:|
| Pemulihan | KHL | 10% | 15% | 60% | 15% |
| Ekspansi | KHL | 10% | 10% | 65% | 15% |
| Puncak | KHL | 20% | 30% | 30% | 20% |
| Kontraksi | KHL | 35% | 25% | 25% | 15% |
| Stagflasi | KHL | 25% | 30% | 15% | 30% |

Persentase dihitung dari **sisa setelah KHL dan cicilan wajib**, bukan dari penghasilan kotor.
Inilah bedanya dengan 50/30/20.

### M-11.3 Untuk pengguna di bawah KHL
Tabel di atas **tidak dipakai sama sekali**. Yang dipakai:
```
Prioritas 1: pangan & tempat tinggal & air/listrik   (tidak boleh dipangkas)
Prioritas 2: BPJS Kesehatan (kelas 3 / PBI kalau berhak)
Prioritas 3: transportasi kerja & pulsa/data untuk mencari penghasilan
Prioritas 4: cicilan berbunga tertinggi — dan bila perlu, restrukturisasi
Prioritas 5: tabung berapa pun yang bisa, sekecil apa pun
Investasi: DITUTUP sampai rasio pemenuhan KHL ≥ 100%
```
**Status:** ADA sebagian (5 fase ekonomi + saran). Tabel alokasi berbasis sisa-setelah-KHL BELUM.

---

## M-12 — SCREENING TOP-DOWN (MAKRO → SEKTOR → EMITEN)

**Alur 4 langkah:**
1. Ambil fase ekonomi dari M-10.
2. Petakan ke sektor yang secara historis unggul di fase itu.
3. Saring emiten di sektor tersebut dengan penyaring kuantitatif.
4. Serahkan kandidat ke M-13 (fundamental) lalu M-14 (waktu masuk).

**Peta fase → sektor (dasar penyusunan, bisa disetel):**

| Fase | Sektor cenderung unggul | Alasan ekonominya |
|---|---|---|
| Pemulihan | properti, konstruksi, otomotif, perbankan, ritel | bunga masih rendah, permintaan mulai naik |
| Ekspansi | teknologi, industri dasar, transportasi, barang konsumsi sekunder | belanja modal & konsumsi naik |
| Puncak | energi, pertambangan, komoditas, perkebunan | harga komoditas & inflasi puncak |
| Kontraksi | barang konsumsi primer, kesehatan, telekomunikasi, utilitas | permintaan tidak elastis |
| Stagflasi | emas & tambang emas, energi, barang konsumsi primer | lindung nilai inflasi |

**Penyaring kuantitatif langkah 3 (semua bisa diatur pengguna):**
```
kapitalisasi_pasar  >= 1 triliun          (hindari saham gorengan)
nilai_transaksi_hrn >= 5 miliar           (likuiditas)
PER  antara 0 dan PER_median_sektor × 1,2
PBV  <= 3 (kecuali sektor tertentu)
ROE  >= 10%
DER  <= 2 (bank dikecualikan, pakai CAR)
laba bersih positif 3 tahun terakhir
membagi dividen minimal 3 tahun terakhir  (kalau tujuan pengguna adalah dividen)
bukan saham dalam pemantauan khusus BEI
```
**Status:** ADA sebagian (peta fase → sektor). Penyaring kuantitatif BELUM karena butuh
data emiten (lihat Bab 4: 940 berkas data emiten).

---

## M-13 — ANALISIS FUNDAMENTAL (DIBONGKAR TOTAL DAN DIRANCANG ULANG)

> Anda benar. Yang lama: slider 1–5 dan kotak catatan. Itu **formulir**, bukan analisis.
> Berikut rancangan penggantinya.

### M-13.1 Prinsip
Analisis fundamental = **mengubah angka laporan keuangan menjadi kesimpulan**, plus
**menelusuri siapa yang menjalankan dan memiliki perusahaan**. Mesin harus menghitung sendiri;
pengguna hanya memasukkan/menyetujui data sumber.

### M-13.2 Data masukan (per emiten, per periode)
Diambil dari laporan keuangan (unduhan resmi BEI/situs emiten), disimpan sebagai berkas JSON
per emiten per tahun: `data/emiten/BBCA/laporan/2025-q4.json`.

```jsonc
{
  "emiten": "BBCA", "periode": "2025-Q4", "mata_uang": "IDR", "satuan": "juta",
  "laba_rugi": { "pendapatan": 0, "beban_pokok": 0, "laba_kotor": 0, "beban_usaha": 0,
                 "laba_usaha": 0, "beban_bunga": 0, "laba_sebelum_pajak": 0,
                 "pajak": 0, "laba_bersih": 0, "laba_pemilik_induk": 0 },
  "neraca":   { "kas": 0, "piutang_usaha": 0, "persediaan": 0, "aset_lancar": 0,
                "aset_tetap": 0, "goodwill": 0, "aset_tak_berwujud": 0, "total_aset": 0,
                "utang_usaha": 0, "utang_jangka_pendek": 0, "liabilitas_lancar": 0,
                "utang_jangka_panjang": 0, "total_liabilitas": 0, "ekuitas": 0,
                "saldo_laba": 0, "kepentingan_non_pengendali": 0 },
  "arus_kas": { "operasi": 0, "investasi": 0, "pendanaan": 0, "belanja_modal": 0 },
  "lainnya":  { "jumlah_saham_beredar": 0, "opini_audit": "wajar tanpa modifikasi",
                "auditor": "", "ada_paragraf_going_concern": false,
                "transaksi_pihak_berelasi": 0, "restatement": false }
}
```

### M-13.3 Rasio yang dihitung otomatis (25 rasio)

**Profitabilitas:** margin kotor, margin usaha, margin bersih, ROE, ROA, ROIC.
```
ROE  = laba_pemilik_induk / rata2_ekuitas
ROA  = laba_bersih / rata2_total_aset
ROIC = laba_usaha×(1−tarif_pajak) / (total_utang_berbunga + ekuitas)
```
**Solvabilitas:** DER, utang berbunga/EBITDA, rasio cakupan bunga, DSCR.
```
DER = total_liabilitas / ekuitas
Cakupan bunga = laba_usaha / beban_bunga        ; < 2 = bahaya
```
**Likuiditas:** rasio lancar, rasio cepat, siklus kas.
```
Rasio lancar = aset_lancar / liabilitas_lancar
Siklus kas   = hari_persediaan + hari_piutang − hari_utang
```
**Efisiensi & kualitas laba:**
```
Perputaran aset      = pendapatan / total_aset
Kualitas laba        = arus_kas_operasi / laba_bersih     ; < 0,8 selama 2 tahun = merah
Akrual               = (laba_bersih − arus_kas_operasi) / total_aset
Arus kas bebas (FCF) = arus_kas_operasi − belanja_modal
```
**Penilaian:** PER, PBV, PSR, EV/EBITDA, imbal hasil FCF, imbal hasil dividen, PEG.
**Pertumbuhan:** CAGR pendapatan & laba 3 dan 5 tahun, kestabilan (simpangan baku pertumbuhan).

### M-13.4 Empat belas pemeriksaan penanda merah — OTOMATIS

| # | Penanda merah | Rumus/aturan pemicu | Bobot |
|---:|---|---|---:|
| 1 | Laba tidak didukung kas | arus_kas_operasi/laba_bersih < 0,8 selama ≥ 2 tahun | 10 |
| 2 | Piutang tumbuh jauh melebihi penjualan | Δpiutang% > Δpendapatan% + 20 pp | 9 |
| 3 | Persediaan menumpuk | Δpersediaan% > Δpendapatan% + 25 pp | 7 |
| 4 | Utang berbunga naik cepat | Δutang_berbunga% > 40% setahun | 8 |
| 5 | Cakupan bunga tipis | laba_usaha/beban_bunga < 2 | 9 |
| 6 | Opini audit bukan "wajar tanpa modifikasi" | teks opini | 10 |
| 7 | Ada paragraf keraguan kelangsungan usaha | penanda `going_concern` | 10 |
| 8 | Ganti auditor 2× dalam 3 tahun | riwayat auditor | 6 |
| 9 | Penyajian ulang laporan (restatement) | penanda `restatement` | 8 |
| 10 | Goodwill/aset tak berwujud > 30% total aset | rasio | 6 |
| 11 | Transaksi pihak berelasi > 30% pendapatan | rasio | 8 |
| 12 | Ekuitas negatif atau saldo laba negatif | nilai | 10 |
| 13 | Dividen dibayar melebihi arus kas bebas | dividen > FCF selama 2 tahun | 5 |
| 14 | Penerbitan saham baru terus-menerus (dilusi) | jumlah_saham naik > 10%/tahun tanpa akuisisi | 6 |

**Keluaran:** daftar penanda merah yang menyala, total bobot, dan penjelasan bahasa manusia
untuk tiap penanda (misal: "Laba naik 30% tapi kas dari operasi turun 12%. Artinya laba
tercatat belum tentu jadi uang. Periksa piutang.").

**Tambahan model kecurangan (opsional, sebagai pembanding):**
skor **Beneish M-Score** (8 variabel) dan **Altman Z-Score** (kebangkrutan) — keduanya rumus
publik, bisa dihitung dari data di atas. Ini analisis sungguhan, bukan slider.

### M-13.5 Riwayat manajemen & pemegang saham (yang Anda minta eksplisit)

```jsonc
// data/emiten/XXXX/tata-kelola.json
{
  "direksi": [ { "nama": "", "jabatan": "", "menjabat_sejak": "",
                 "riwayat": [ {"perusahaan":"", "jabatan":"", "periode":""} ],
                 "catatan_sanksi": [ {"otoritas":"OJK|BEI|pengadilan", "perkara":"", "tahun":0} ] } ],
  "komisaris": [ /* sama */ ],
  "pemegang_saham": [ { "nama":"", "porsi":0.0, "jenis":"pengendali|institusi|publik|asing",
                        "digadaikan":false } ],
  "pengendali_akhir": "",
  "grup_usaha": "",
  "afiliasi": [ { "perusahaan":"", "hubungan":"induk|anak|saudara|ventura", "porsi":0.0 } ]
}
```
**Yang dihitung mesin:**
```
porsi_publik            -> < 7,5% = penanda merah (likuiditas & tata kelola)
konsentrasi_kepemilikan -> HHI = Σ porsi²
saham_pengendali_digadaikan -> penanda merah (risiko jual paksa)
lama_rata2_direksi_menjabat -> < 2 tahun = manajemen tidak stabil
jumlah_sanksi_pengurus  -> > 0 = penanda merah berat
kepadatan_afiliasi      -> banyak transaksi antar afiliasi = risiko penggerogotan
```

### M-13.6 Corporate action & efeknya (juga Anda minta eksplisit)

```jsonc
// data/emiten/XXXX/aksi-korporasi.json
[ { "jenis":"dividen|right issue|stock split|reverse split|buyback|private placement|merger|akuisisi|delisting",
    "tanggal_pengumuman":"", "cum_date":"", "ex_date":"", "recording_date":"", "tanggal_bayar":"",
    "nilai":0, "rasio":"", "harga_pelaksanaan":0, "keterangan":"" } ]
```
**Efek yang dihitung mesin:**
```
Right issue  : dilusi% = saham_baru / (saham_lama + saham_baru)
               harga teoretis (TERP) = (saham_lama×harga + saham_baru×harga_pelaksanaan)
                                       / (saham_lama + saham_baru)
Stock split  : harga & dividen per saham disesuaikan otomatis untuk perbandingan riwayat
Dividen      : harga cenderung turun sebesar dividen pada ex-date -> ditampilkan sebagai catatan
Buyback      : EPS naik = laba / (saham − saham_dibeli)
Private placement: dilusi + pertanyaan siapa pembelinya (afiliasi atau bukan)
```
Semua aksi ditampilkan dalam **garis waktu** beserta pergerakan harga sesudahnya
(H+1, H+7, H+30) supaya pengguna melihat efek nyatanya, bukan teori.

### M-13.7 Skor akhir
```
skor_fundamental = 0,30×profitabilitas + 0,20×kesehatan_neraca + 0,20×kualitas_laba
                 + 0,15×pertumbuhan + 0,15×penilaian
skor_akhir = skor_fundamental × (1 − total_bobot_penanda_merah / 100)
Kalau ada penanda merah berbobot 10 -> skor dipaksa maksimal 40 dan diberi label
"JANGAN DULU — ada masalah mendasar".
```

### M-13.8 Dari mana datanya (jujur)
Tidak ada API publik gratis yang memberi laporan keuangan lengkap seluruh emiten Indonesia.
Maka jalurnya bertahap:
1. **Tahap 1** — pengguna/admin memasukkan angka laporan keuangan lewat formulir terstruktur
   (bukan catatan bebas), mesin menghitung 25 rasio + 14 penanda merah. **Ini sudah analisis
   sungguhan** karena kesimpulannya dihitung, bukan diketik.
2. **Tahap 2** — unggah berkas laporan keuangan (PDF/XBRL) → pengurai otomatis mengisi angka.
   BEI menyediakan XBRL untuk laporan emiten; ini jalur paling benar.
3. **Tahap 3** — penarikan terjadwal oleh `apps/worker` + penyimpanan riwayat per emiten.

**Status:** **PALSU → dirancang ulang.** Yang lama akan dihapus.

---

## M-14 — ANALISIS TEKNIKAL (WAKTU MASUK & KELUAR)

**Indikator:** MA20/MA50/MA200, EMA12/26, MACD, RSI14, Bollinger, volume rata-rata,
support/resistance dari titik balik, ATR14.

**Rumus:**
```
RSI  = 100 − 100/(1+RS) ;  RS = rata2_naik14 / rata2_turun14  (Wilder smoothing)
MACD = EMA12 − EMA26 ; sinyal = EMA9(MACD)
ATR  = rata2(maks(H−L, |H−Cprev|, |L−Cprev|), 14)
Stop loss disarankan = harga_masuk − 2×ATR
Ukuran posisi = (modal × risiko_per_transaksi%) / (harga_masuk − stop_loss)
```
**Aturan sinyal:**
```
BELI      : harga > MA50 & MA20 > MA50 & RSI 40–65 & MACD memotong ke atas & volume > rata2
TAHAN     : tren naik tapi RSI > 70 (jangan menambah)
KURANGI   : harga menembus MA50 ke bawah atau MACD memotong ke bawah
JUAL/STOP : harga < stop loss, atau muncul penanda merah baru dari M-13
```
**Aturan penting:** sinyal teknikal **tidak berlaku** kalau skor fundamental < 50.
Waktu masuk yang bagus untuk perusahaan bermasalah tetap keputusan buruk.

**Status:** ADA (MA20/MA50/RSI14 dari data kripto CoinGecko). Untuk saham Indonesia
butuh sumber harga harian — masuk pekerjaan `apps/worker`.

---

## M-15 — DAFTAR EMITEN RUTIN BAGI DIVIDEN (permintaan I-8.4)

### M-15.1 Tujuan
Menjawab kalimat Anda: *"supaya pengguna dapat penghasilan bulanan dari dividen, daftarnya ada
riwayat yang membuktikan."* Maka modul ini wajib punya **bukti riwayat**, bukan sekadar daftar.

### M-15.2 Sumber semesta emiten
1. **Indeks IDX High Dividend 20** — indeks resmi BEI (sejak 2018) berisi 20 saham yang
   rutin membagi dividen tunai minimal 3 tahun terakhir, dinilai dari imbal hasil dividen,
   rasio pembayaran, dan nilai dividen per saham.
2. **Indeks IDX ESG / LQ45 / KOMPAS100** sebagai pembanding likuiditas.
3. **Seluruh emiten** yang punya riwayat dividen ≥ 5 tahun berturut-turut (dihitung sendiri
   dari data aksi korporasi di M-13.6).

### M-15.3 Skema data (satu berkas per emiten)
```jsonc
// data/emiten/PTBA/dividen.json
{
  "kode": "PTBA", "nama": "Bukit Asam Tbk", "sektor": "energi",
  "riwayat": [
    { "tahun_buku": 2024, "jenis": "final", "dps": 3473, "cum_date": "2025-05-xx",
      "tanggal_bayar": "2025-06-xx", "rasio_pembayaran": 1.3128,
      "imbal_hasil_saat_itu": 0.1507, "sumber": "keterbukaan informasi BEI" }
  ],
  "ringkasan": {
    "tahun_berturut_bagi_dividen": 0,
    "rata2_imbal_hasil_5thn": 0,
    "rata2_rasio_pembayaran_5thn": 0,
    "pertumbuhan_dps_5thn": 0,
    "kestabilan_dps": 0,        // 1 − (simpangan baku / rata-rata)
    "bulan_pembayaran_biasanya": [6]
  }
}
```
**Catatan verifikasi:** setiap baris riwayat **wajib** punya `sumber` dan tanggal. Angka yang
tidak bisa saya verifikasi tidak boleh dimasukkan sebagai fakta. Contoh angka di atas
(PTBA DPS Rp 3.473, rasio pembayaran 131,28%, imbal hasil 15,07%) berasal dari pemberitaan
pasar 2025 dan **harus diverifikasi ulang** ke keterbukaan informasi BEI sebelum ditayangkan
sebagai data resmi aplikasi. Aplikasi akan menandai baris yang belum terverifikasi.

### M-15.4 Yang dihitung mesin
```
tahun_berturut       = hitung rangkaian tahun tanpa putus
imbal_hasil_berjalan = DPS_12_bulan_terakhir / harga_sekarang
imbal_hasil_atas_biaya = DPS / harga_beli_pengguna     (yield on cost)
kestabilan           = 1 − simpangan_baku(DPS 5thn)/rata2(DPS 5thn)
keberlanjutan        = rasio_pembayaran < 0,8 DAN dividen < arus_kas_bebas
skor_dividen = 0,30×tahun_berturut(dinormalkan) + 0,25×imbal_hasil + 0,20×kestabilan
             + 0,15×keberlanjutan + 0,10×pertumbuhan_DPS
```
**Peringatan jebakan dividen (dividend trap):** imbal hasil tinggi karena harga jatuh, atau
rasio pembayaran > 100% (membayar dividen dari kas cadangan/utang). Contoh rasio 131% di atas
justru **harus** memicu peringatan ini — tinggi belum tentu sehat.

### M-15.5 Kalender dividen & perencana penghasilan bulanan
1. Kumpulkan bulan pembayaran biasanya dari tiap emiten.
2. Susun **portofolio 12 bulan**: pilih kombinasi emiten sehingga hampir setiap bulan ada
   pembayaran masuk (mayoritas emiten Indonesia membayar sekali setahun sekitar April–Juli,
   sebagian membayar interim di Oktober–Desember — maka pemerataan penuh 12 bulan tidak
   selalu mungkin; aplikasi harus mengatakan ini apa adanya, bukan menjanjikan).
3. Hitung modal yang dibutuhkan:
```
target_dividen_tahunan = target_bulanan × 12
modal_dibutuhkan       = target_dividen_tahunan / imbal_hasil_rata2_portofolio
lot_per_emiten         = ceil( (modal × bobot_emiten) / (harga × 100) )
pajak dividen orang pribadi: 0% bila diinvestasikan kembali sesuai PP 9/2021
                             (syarat & pelaporan berlaku), selain itu 10% final
dividen_bersih         = dividen_kotor × (1 − tarif_pajak_yang_berlaku)
```
**Contoh yang harus tampil apa adanya:** target Rp 2.000.000/bulan = Rp 24.000.000/tahun.
Dengan imbal hasil rata-rata 6%, modal yang dibutuhkan **Rp 400.000.000**. Aplikasi
menampilkan angka ini terus terang, tidak menjual mimpi.

### M-15.6 Layar UI
`/dividen`
1. Tabel emiten: kode, nama, sektor, tahun berturut, imbal hasil, rasio pembayaran,
   skor dividen, penanda jebakan. Bisa diurut & disaring.
2. Halaman detail emiten: **grafik batang riwayat DPS 10 tahun** (inilah "riwayat yang
   membuktikan"), tabel per tahun beserta tanggal cum/bayar dan sumbernya, plus ringkasan
   fundamental dari M-13.
3. **Kalender dividen** — 12 bulan, tampilan kalender.
4. **Perencana penghasilan dividen** — masukkan target rupiah per bulan, keluar: modal
   dibutuhkan, komposisi emiten, jumlah lot, perkiraan penerimaan tiap bulan.
5. **Portofolio dividen saya** — pembelian yang sudah dilakukan, imbal hasil atas biaya,
   penerimaan yang sudah masuk (bisa dicatat sebagai blok di M-17).

### M-15.7 Endpoint
```
GET /api/v1/dividen/emiten                 GET /api/v1/dividen/emiten/:kode
GET /api/v1/dividen/emiten/:kode/riwayat   GET /api/v1/dividen/kalender?tahun=2026
POST /api/v1/dividen/perencana             { target_bulanan, toleransi_risiko, sektor_dihindari }
GET /api/v1/dividen/portofolio             POST /api/v1/dividen/portofolio
```

### M-15.8 Kriteria terima
- [ ] Minimal 20 emiten terisi dengan riwayat ≥ 5 tahun dan sumber tercantum.
- [ ] Emiten dengan rasio pembayaran > 100% otomatis diberi peringatan jebakan dividen.
- [ ] Perencana menghasilkan angka modal yang benar secara aritmetika dan menyatakan asumsinya.
- [ ] Setiap angka punya tanggal & sumber; yang belum terverifikasi diberi tanda.

### M-15.9 Status
**BELUM DIBUAT.** Prioritas kedua setelah M-01.

---

## M-16 — AI ADVISOR (PENASIHAT)

**Cara kerja (jujur):** ini **mesin aturan + skoring**, bukan model bahasa. Saya tidak akan
menyebutnya "AI" seolah-olah ada model besar di belakangnya kalau yang ada adalah aturan.

**Masukan:** hasil M-01 (rasio KHL), M-02 (aset), M-04 (dana darurat), M-06 (penghasilan),
M-07 (utang), M-08 (asuransi), M-10 (fase ekonomi), M-11 (mode).
**Keluaran:** daftar saran berurutan prioritas, masing-masing: judul, alasan berbasis angka
pengguna, nominal rupiah yang disarankan, tingkat keyakinan, dan **dampaknya kalau dijalankan**.

**Aturan urutan (tidak boleh dilanggar):**
```
1. rasio KHL < 1        -> hanya saran menutup kesenjangan
2. tidak ada BPJS       -> aktifkan dulu
3. dana darurat < 1 bln -> kumpulkan 1 bulan
4. ada utang bunga >24%/thn -> lunasi dulu (matematis mengalahkan investasi mana pun)
5. dana darurat < target-> lanjutkan sampai target
6. proteksi jiwa kurang & punya tanggungan -> tutup kesenjangan proteksi
7. baru investasi, sesuai fase ekonomi (M-11)
```
**Kalimat terlarang:** menyalahkan gaya hidup pengguna yang penghasilannya di bawah KHL,
menjanjikan imbal hasil, menyebut saham tertentu "pasti untung".
**Status:** ADA sebagai mesin aturan sederhana. Perlu ditata ulang mengikuti urutan di atas.

---

## M-17 — BLOCKCHAIN LEDGER (PROOF-OF-BUDGET)

**Untuk apa (harus jujur):** ini bukan untuk desentralisasi dan bukan mata uang. Gunanya:
**catatan keuangan yang tidak bisa diubah diam-diam**. Setiap transaksi jadi satu blok
berantai; kalau ada baris lama diubah, verifikasi rantai langsung gagal.

**Struktur blok:**
```jsonc
{ "index": 12, "timestamp": "...", "data": { transaksi }, "previousHash": "...",
  "nonce": 4821, "hash": "..." }
hash = SHA256( index + timestamp + JSON(data) + previousHash + nonce )
proof-of-work ringan: hash harus diawali "00" (2 nol) — cukup untuk pembuktian,
tidak membebani perangkat pengguna
```
**Yang sudah divalidasi:** implementasi SHA-256 (FIPS 180-4) yang saya tulis sudah dicocokkan
dengan modul `crypto` bawaan Node, termasuk pesan multi-blok dan teks UTF-8 — hasilnya identik.
Bug lama pada `verifyChain` (lupa mengikutkan `nonce`) sudah diperbaiki.

**Untuk versi berbasis server:** rantai disimpan di basis data, ditambah
**tanda tangan digital** per pengguna (Ed25519) supaya blok tidak bisa dibuat pihak lain,
dan **akar Merkle harian** yang dicatat terpisah sebagai jangkar.
**Status:** ADA (sisi browser). Tanda tangan & akar Merkle BELUM.

---

## M-18 — STRATEGI KONTEN MARKETING

**Isi:** posisi produk, sasaran, pilar konten (satu pilar per lapis piramida), corong
(kenal → tertarik → coba → bayar → setia), kalender 4 minggu, contoh naskah per kanal
(TikTok, Instagram, YouTube, LinkedIn, X, blog SEO), dan indikator keberhasilan.

**Sudut pandang utama yang sekarang jadi inti pesan:**
> "Cek dulu: gaji Anda sudah di atas Kebutuhan Hidup Layak provinsi Anda atau belum?"
Ini pesan yang jujur, relevan, dan langsung menyentuh kenyataan banyak orang — sekaligus
membedakan produk ini dari aplikasi pencatat pengeluaran biasa.

**Status:** ADA (`docs/marketing-strategy.md` + pembuat otomatis di aplikasi).
Perlu diperbarui memakai sudut pandang KHL di atas.

---

## M-19 — AUTENTIKASI & KEAMANAN

Dijabarkan lengkap di **Bab 5**.

---

## M-20 — MESIN PIRAMIDA (INTI)

Menyatukan M-01 s/d M-09 menjadi satu penilaian: posisi pengguna ada di lapis berapa,
lapis mana yang bolong, dan berapa rupiah untuk menambalnya.
```
lapis1_terpenuhi = penghasilan_bersih >= KHL_rt
lapis2_terpenuhi = dana_darurat >= target AND BPJS aktif AND kesenjangan_proteksi <= 0
lapis3_terpenuhi = seluruh biaya tanggungan & pendidikan tahun berjalan tertutup
lapis4_terpenuhi = ada investasi bertumbuh yang rutin > 10% dari sisa
lapis5_terpenuhi = rasio_kemerdekaan >= 1 (penghasilan pasif menutup pengeluaran)
lapis_saat_ini   = lapis terisi tertinggi yang berurutan dari bawah
skor_kesehatan   = Σ bobot_lapis × tingkat_pemenuhan (0..100)
```
**Aturan:** lapis atas tidak dianggap "terpenuhi" kalau lapis bawahnya bolong. Orang yang
punya saham tapi penghasilannya di bawah KHL **tetap** berada di lapis 1.

---

## M-21 — MODUL DI LUAR INSTRUKSI ANDA (usulan saya, boleh ditolak)

Ini satu-satunya bagian yang boleh berlabel "usulan": zakat/pajak pribadi (PPh 21 & SPT),
pencatatan struk otomatis, ekspor ke Excel, mode keluarga (banyak pengguna satu rumah tangga),
notifikasi WhatsApp. **Tidak dikerjakan** kecuali Anda minta.


---

# BAB 4 — ARSITEKTUR FILE: DARI 10 FILE MENJADI ± 3.900 FILE

> **Kritik Anda:** "tool web untuk jadi vibe coding butuh ribuan file, ini cuma 10 file,
> itupun salah satunya preview."
> **Jawaban saya:** benar. Yang ada sekarang prototipe satu-berkas. Berikut bentuk aslinya.

## 4.1 Kenapa sebuah SaaS memang butuh ribuan berkas

Bukan karena banyak berkas itu bagus, tapi karena **satu berkas = satu tanggung jawab**:
satu rumus, satu layar, satu endpoint, satu tabel, satu tes, satu data emiten. Manfaatnya
konkret: bisa diuji satu-satu, bisa diubah tanpa merusak yang lain, bisa dikerjakan banyak
orang bersamaan, dan riwayat perubahannya terbaca di git. Monolit `preview.html` 1.264 baris
tidak punya satu pun keuntungan itu — persis seperti yang Anda tunjuk.

## 4.2 Bentuk monorepo

```
pyrabudget/
├── apps/
│   ├── web/            Aplikasi pengguna (React + TypeScript + Vite)
│   ├── api/            REST + WebSocket (Fastify/NestJS + TypeScript)
│   ├── worker/         Pengambil data terjadwal (harga, makro, laporan keuangan)
│   ├── admin/          Panel admin: verifikasi data emiten, KHL, pengguna
│   └── preview/        Pembangkit preview.html satu-berkas (tetap dipertahankan untuk Anda)
├── packages/
│   ├── domain-khl/         M-01
│   ├── domain-aset/        M-02
│   ├── domain-profil/      M-03, M-04
│   ├── domain-tujuan/      M-05
│   ├── domain-penghasilan/ M-06
│   ├── domain-utang/       M-07
│   ├── domain-proteksi/    M-08
│   ├── domain-pensiun/     M-09
│   ├── domain-makro/       M-10, M-11
│   ├── domain-screening/   M-12
│   ├── domain-fundamental/ M-13
│   ├── domain-teknikal/    M-14
│   ├── domain-dividen/     M-15
│   ├── domain-advisor/     M-16
│   ├── blockchain/         M-17
│   ├── piramida/           M-20
│   ├── ui/                 komponen tampilan bersama
│   ├── utils/ types/ config/ i18n/
├── data/
│   ├── khl/2026/           38 berkas provinsi + 1 indeks
│   ├── ump/2026/           38 berkas
│   ├── emiten/XXXX/        4 berkas × ± 235 emiten aktif
│   └── makro/              seri waktu indikator
├── infra/                  Docker, migrasi basis data, CI, pemantauan
├── tests/                  unit, integrasi, e2e
└── docs/                   dokumen ini + spesifikasi per modul
```

## 4.3 Perkiraan jumlah berkas

Kolom **"tercantum"** = berkas yang sudah saya sebutkan namanya satu per satu di
`docs/DAFTAR-FILE-TARGET.md`. Kolom **"target penuh"** = setelah data & komponen dilengkapi.

| Bagian | Isi | Tercantum | Target penuh |
|---|---|---:|---:|
| Konfigurasi akar | pengaturan repo, lint, CI lokal | 18 | 18 |
| `apps/web` | 30 halaman × 4 berkas + pustaka & gaya (target: + ± 5 sub-komponen per halaman) | 135 | 435 |
| `apps/api` | 26 modul × 6 berkas + plugin keamanan | 174 | 174 |
| `apps/worker` | 14 tugas terjadwal + pengurai XBRL/PDF + klien | 39 | 39 |
| `apps/admin` | 12 layar verifikasi data (belum dirinci) | 0 | 60 |
| `apps/preview` | pembangkit `preview.html` satu-berkas | 0 | 20 |
| `packages/domain-*` + `blockchain` | 16 paket, tiap rumus satu berkas + tesnya | 352 | 352 |
| `packages/ui` | 42 komponen tercantum, target 120 komponen × 3 berkas | 128 | 362 |
| `packages/utils`,`types`,`config`,`i18n` | pemformat, tipe bersama, teks Bahasa Indonesia | 0 | 120 |
| `data/khl` + `data/ump` + `data/makro` | 38 provinsi × 2 + 8 seri makro | 86 | 86 |
| `data/emiten` | 99 emiten × 5 berkas → target 235 emiten aktif + laporan 5 tahun | 495 | 2.115 |
| `infra` | Docker, CI, pemantauan, cadangan, 38 migrasi SQL | 52 | 52 |
| `tests` | 15 alur × (integrasi + e2e) + perkakas | 35 | 35 |
| `docs` | dokumen ini + spesifikasi per modul + ADR | 12 | 54 |
| **TOTAL** | | **1.526** | **± 3.922** |

Dua-duanya jauh dari **10**. Daftar nama berkasnya ada di **`docs/DAFTAR-FILE-TARGET.md`**
(1.526 nama berkas, bukan angka kosong).

## 4.4 Contoh: satu modul dipecah jadi berapa berkas

Modul **M-01 KHL** saja:
```
packages/domain-khl/src/
  entitas/khl-provinsi.ts            entitas/khl-rumah-tangga.ts
  entitas/khl-komponen.ts            nilai/rupiah.ts
  rumus/hitung-khl-acuan.ts          rumus/hitung-khl-survei.ts
  rumus/hitung-kesenjangan.ts        rumus/tentukan-status.ts
  rumus/proyeksi-tahun-tercapai.ts   aturan/mode-anggaran.ts
  aturan/kunci-modul-investasi.ts    data/pemuat-khl.ts
  index.ts  types.ts
packages/domain-khl/test/            (8 berkas tes, satu per rumus/aturan)
apps/api/src/modul/khl/              rute.ts pengendali.ts layanan.ts skema.ts repo.ts tes.ts
apps/web/src/halaman/khl/            Halaman.tsx KartuUtama.tsx TabelProvinsi.tsx
                                     Perbandingan.tsx Simulasi.tsx RencanaTutup.tsx
                                     SurveiKomponen.tsx state.ts gaya.css tes.tsx
data/khl/2026/                       indeks.json + 38 berkas provinsi
```
= **± 75 berkas untuk satu modul.** Dikalikan 21 modul, angka ribuan itu masuk akal —
bukan mengada-ada.

## 4.5 Perpindahan bertahap (tanpa mematikan preview Anda)

| Tahap | Yang dikerjakan | preview.html |
|---|---|---|
| 0 (sekarang) | dokumen ini | tetap seperti sekarang |
| 1 | pecah logika dari `preview.html` ke `packages/domain-*` + `apps/preview` sebagai pembangkit | tetap bisa dibuka, isinya hasil bangun otomatis |
| 2 | `apps/api` + basis data + autentikasi | preview tetap jalan (mode tanpa server) |
| 3 | `apps/web` menggantikan `public/` | preview jadi mode demo |
| 4 | `apps/worker` + `apps/admin` + data emiten | preview memakai data contoh |

Janji saya: **`preview.html` tidak akan pernah mati** selama proses ini, karena itu satu-satunya
cara Anda melihat hasil kerja saya langsung di chat.

---

# BAB 5 — KEAMANAN, AUTENTIKASI, DAN API

> **Kritik Anda:** "database server gak ada", "gak perhatikan keamanan, API, dll."
> Benar. `data/db.json` bukan basis data, dan tidak ada satu baris pun kode autentikasi.

## 5.1 Keadaan sekarang (apa adanya)

| Aspek | Sekarang | Risikonya |
|---|---|---|
| Autentikasi | **tidak ada** | siapa pun bisa memanggil semua endpoint |
| Otorisasi | tidak ada | data pengguna satu bercampur pengguna lain |
| Penyimpanan | `data/db.json` | rusak kalau ditulis bersamaan, tidak ada transaksi |
| Validasi masukan | seadanya | bisa dikirimi tipe data apa saja |
| Batas laju (rate limit) | tidak ada | mudah dibanjiri permintaan |
| Rahasia/kunci API | belum dipakai | kalau nanti dipakai di browser, bocor |
| HTTPS | tidak | data lewat jaringan terbuka |
| Log & jejak audit | tidak ada | tidak tahu siapa mengubah apa |

## 5.2 Rancangan yang benar

**Autentikasi**
- Daftar/masuk dengan surel + kata sandi; kata sandi disimpan dengan **Argon2id**
  (memory 64 MB, iterasi 3) — bukan MD5/SHA biasa.
- Token akses berumur 15 menit + token penyegar 30 hari, disimpan di **cookie HttpOnly,
  Secure, SameSite=Strict** — bukan localStorage (supaya tidak bisa dicuri lewat XSS).
- Verifikasi surel, lupa kata sandi dengan token sekali pakai (kedaluwarsa 30 menit).
- Autentikasi dua langkah TOTP (opsional) — penting karena aplikasi ini memuat data harta.
- Batas percobaan masuk: 5 kali gagal → tunda bertingkat + kunci sementara.

**Otorisasi**
- Setiap data punya `user_id`; setiap kueri **wajib** menyaring berdasarkan pengguna yang login.
- Peran: `pengguna`, `admin_data` (verifikasi KHL/emiten), `admin_sistem`.

**Perlindungan data**
- Basis data **PostgreSQL** dengan migrasi bernomor.
- Kolom sensitif (NPWP, nomor polis, nilai aset) dienkripsi di tingkat kolom (AES-256-GCM),
  kunci dari pengelola rahasia, bukan di dalam kode.
- Cadangan harian + uji pemulihan.

**Keamanan API**
- Validasi skema (Zod) di **setiap** endpoint; tolak field tak dikenal.
- Batas laju: 100 permintaan/menit per pengguna; 10/menit untuk masuk & lupa sandi.
- CORS daftar putih; CSRF token untuk permintaan yang mengubah data.
- Header keamanan: HSTS, CSP ketat (tanpa `unsafe-inline`), X-Content-Type-Options,
  Referrer-Policy.
- Semua panggilan ke sumber data luar dilakukan **server**, bukan browser — kunci API tidak
  pernah sampai ke sisi pengguna.
- Log audit: siapa, kapan, mengubah apa, dari IP mana — dan ini disambungkan ke M-17
  (rantai blok) supaya log-nya sendiri tidak bisa diubah diam-diam.

**Privasi**
- Data keuangan pribadi: hanya pengguna yang bisa melihat. Tidak dijual, tidak dibagikan.
- Ekspor data & hapus akun (hak pengguna) tersedia.
- Selaras dengan UU 27/2022 Perlindungan Data Pribadi: dasar pemrosesan, retensi, dan
  pemberitahuan kebocoran.

**Batasan yang harus tertulis di aplikasi**
> PyraBudget adalah alat bantu hitung dan pencatat. Bukan penasihat investasi berizin,
> bukan lembaga jasa keuangan. Angka pasar bisa terlambat atau salah. Keputusan ada pada Anda.

## 5.3 Status
**BELUM ADA SATU PUN.** Ini pekerjaan Tahap 2 di Bab 6.

---

# BAB 6 — URUTAN PENGERJAAN

| Tahap | Isi | Hasil yang Anda lihat |
|---|---|---|
| **T-0** | Dokumen ini | `docs/PENJABARAN-DETAIL.md`, `docs/DAFTAR-FILE-TARGET.md` |
| **T-1** ✅ | **M-01 KHL** — SELESAI: data 38 provinsi, kesenjangan, mode anggaran, kunci modul investasi, survei 64 komponen, 35 tes lulus | tab **🏠 KHL** sudah ada di preview |
| **T-2** | **M-02 ASET** dirapikan & dipisah tegas dari KHL: CAGR, penghasilan pasif, rasio kemerdekaan, peringatan konsentrasi | tab **Aset** yang bersih |
| **T-3** | **M-15 Emiten Dividen** — 20+ emiten, riwayat DPS, kalender, perencana penghasilan bulanan, peringatan jebakan dividen | tab **Dividen** |
| **T-4** | **M-13 Fundamental sungguhan** — 25 rasio, 14 penanda merah, tata kelola, aksi korporasi + efek dilusi | tab **Fundamental** ditulis ulang |
| **T-5** | Pemecahan monolit → `packages/domain-*` + `apps/preview` sebagai pembangkit | jumlah berkas naik drastis, preview tetap jalan |
| **T-6** | `apps/api` + PostgreSQL + autentikasi + validasi + batas laju | akun & login sungguhan |
| **T-7** | `apps/web` menggantikan `public/`, `apps/worker`, `apps/admin` | aplikasi utuh |

**Aturan kerja saya mulai sekarang:**
1. Satu tahap = satu commit yang bisa dilihat hasilnya di `preview.html`.
2. Tidak ada klaim "sudah produksi" sebelum T-6 selesai.
3. Setiap angka yang saya tampilkan wajib punya sumber & tanggal.
4. Kalau ada yang tidak bisa saya ambil datanya, saya tulis terus terang, bukan dibuat-buat.

---

# BAB 7 — MATRIKS KEPATUHAN TERHADAP INSTRUKSI ANDA

| # | Instruksi Anda | Modul | Status | Tahap |
|---|---|---|---|---|
| I-1 | Piramida Maslow × Piramida Keuangan | M-20 | ADA | — |
| I-1 | Strategi konten marketing | M-18 | ADA | perbarui T-3 |
| I-1 | Blockchain (SHA-256) | M-17 | ADA | tanda tangan T-6 |
| I-2 | Preview mengikuti tiap respon | apps/preview | ADA | dijaga |
| I-3 | **KHL data riil** | M-01 | **ADA** ✅ | T-1 selesai |
| I-3 | Aset: tanah, properti, SBN, reksadana, dll | M-02 | ADA sebagian | T-2 |
| I-3 | Logam mulia (emas/perak) riil | M-02 | ADA | — |
| I-3 | Makro & siklus ekonomi | M-10 | ADA | lengkapi T-4 |
| I-3 | Anggaran per fase, bukan 50/30/20 | M-11 | ADA sebagian | T-1 |
| I-4 | Data diri, anak, tanggungan | M-03 | ADA | sambung T-1 |
| I-4 | Dana darurat | M-04 | ADA sebagian | T-1 |
| I-4 | Tujuan investasi | M-05 | ADA sebagian | T-2 |
| I-5 | Screening top-down | M-12 | ADA sebagian | T-4 |
| I-5 | **Fundamental sungguhan** | M-13 | **PALSU** | **T-4** |
| I-5 | Riwayat manajemen & pemegang saham | M-13.5 | BELUM | T-4 |
| I-5 | Riwayat & afiliasi perusahaan | M-13.5 | BELUM | T-4 |
| I-5 | Red flag laporan keuangan | M-13.4 | BELUM | T-4 |
| I-5 | Corporate action & efeknya | M-13.6 | BELUM | T-4 |
| I-5 | Teknikal (waktu masuk/keluar) | M-14 | ADA (kripto) | saham T-7 |
| I-6 | Hutang & piutang | M-07 | ADA sebagian | T-2 |
| I-6 | Asuransi | M-08 | ADA sebagian | T-2 |
| I-6 | Sumber penghasilan | M-06 | ADA sebagian | T-1 |
| I-6 | Pensiun, waris, hibah | M-09 | ADA sebagian | T-2 |
| I-7 | Jangan melabeli "menyusul" | — | dipatuhi | — |
| I-8 | KHL ≠ aset, **keduanya ada** | M-01 + M-02 | **diperbaiki** | T-1, T-2 |
| I-8 | Gaji di bawah KHL jadi fitur | M-01.7, M-11.3 | **ADA** ✅ | T-1 selesai |
| I-8 | **Daftar emiten rutin dividen + riwayat** | M-15 | **BELUM** | **T-3** |
| I-8 | Keamanan, autentikasi, API | M-19, Bab 5 | **BELUM** | T-6 |
| I-8 | Ribuan berkas, bukan 10 | Bab 4 | rencana siap | T-5 |

**Rekap jujur (diperbarui setelah T-1):** dari 29 butir — **11 ada**, **11 ada sebagian**, **6 belum**, **1 palsu**.
Tidak ada yang saya sembunyikan.

---

# LAMPIRAN A — SUMBER DATA & TANGGALNYA

| Data | Sumber | Tanggal | Catatan |
|---|---|---|---|
| KHL 38 provinsi | Kemnaker (metode berbasis studi ILO 2025) | rilis Desember 2025 | dipakai sebagai acuan UMP 2026 |
| 64 komponen KHL | Permenaker 18/2020 (mengubah Permenaker 21/2016) | 9 Oktober 2020 | 7 kelompok; status aturan sudah berubah tapi komponennya tetap rujukan teknis terbaik |
| Garis kemiskinan | BPS, Susenas Maret 2025 | Juli 2025 | Rp 609.160/orang/bulan |
| Standar Hidup Layak (IPM) | BPS | 2024 | ± Rp 1,02 juta/bulan; BPS menegaskan ini bukan kriteria layak |
| Inflasi, PDB, pengangguran, bunga riil | World Bank API | berjalan | `FP.CPI.TOTL.ZG`, `NY.GDP.MKTP.KD.ZG`, `SL.UEM.TOTL.ZS`, `FR.INR.RINR` |
| Emas & perak | api.gold-api.com | waktu nyata | XAU, XAG; konversi 1 oz t = 31,1034768 gram |
| Kurs USD/IDR | open.er-api.com | harian | |
| BTC/ETH | CoinGecko | waktu nyata | |
| Emiten dividen | IDX High Dividend 20 + keterbukaan informasi BEI | per emiten | wajib diverifikasi sebelum ditayangkan |

# LAMPIRAN B — ISTILAH INGGRIS YANG SAYA GANTI

| Sebelumnya | Dipakai sekarang |
|---|---|
| dividend yield | imbal hasil dividen |
| payout ratio | rasio pembayaran dividen |
| red flag | penanda merah |
| net worth | kekayaan bersih |
| emergency fund | dana darurat |
| debt to income | rasio cicilan terhadap penghasilan |
| cash flow | arus kas |
| entry/exit timing | waktu masuk/keluar |
| screening | penyaringan |
| corporate action | aksi korporasi |
| dividend trap | jebakan dividen |
| rate limit | batas laju |
| free cash flow | arus kas bebas |

---

**Akhir dokumen.** Kalau ada instruksi Anda yang belum tercatat di Bab 1 atau salah saya
tangkap di Bab 3, tunjuk nomornya — saya perbaiki dokumennya dulu sebelum menulis kode lagi.
