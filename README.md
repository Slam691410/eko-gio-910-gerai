# Gerai 910: Premium Web3 & AI-Powered Financial Super-Portal 🚀

Gerai 910 adalah platform portal keuangan terintegrasi, Point of Sales (POS), Customer Relationship Management (CRM), serta kalkulator kekayaan dan hukum waris Islam (Faraid) terlengkap yang dirancang untuk pasar ritel dan UMKM Indonesia. Platform ini mengintegrasikan **Sistem Keuangan Riil**, **Kecerdasan Buatan (AI)**, serta **Teknologi Desentralisasi Blockchain** secara *real-time*.

## 🌟 Fitur Utama (11 Modul Terintegrasi)

Platform ini mengintegrasikan 11 modul penting sesuai kebutuhan proyek profesional:

1. **UGC & Komunitas:** Forum terbuka di mana pengguna dapat mempublikasikan analisis pasar, membaca artikel makro, berdiskusi di grup khusus (Emas, Dividen, POS), dan menyalin tautan rujukan afiliasi.
2. **POS & CRM Ritel:** Aplikasi kasir ritel fungsional dengan perhitungan pajak PPN 11%, diskon otomatis berdasarkan tingkatan loyalitas pelanggan CRM (*Regular, Gold, Platinum*), pencatatan transaksi terintegrasi, serta modul panduan pengoperasian yang lengkap.
3. **Aliran Kas & Aset:** Pelacak pendapatan bulanan (Utama, Bisnis, Sampingan) dan portofolio aset riil terlengkap (Emas, Perak, Reksa Dana, SBN, Saham, Deposito, Properti) dengan visualisasi bagan alokasi aset.
4. **KHL & Budgeting:** Kalkulator Standar Kebutuhan Hidup Layak (KHL) berdasarkan provinsi Indonesia, pelacak anggaran otomatis (Metode 50/30/20), pengelola utang aktif (*Debt Snowball*), serta simulator dana darurat (*Emergency Fund*).
5. **Proteksi Asuransi:** Evaluasi kecukupan uang pertanggungan asuransi jiwa menggunakan metode *Capital Utilization* (Human Life Value) dibandingkan dengan polis aktif yang dimiliki (BPJS, swasta).
6. **Rencana Keuangan (Goals):** Penentu target impian keuangan (Pendidikan anak, Haji/Umrah, Rumah) lengkap dengan simulator bunga majemuk (*Compounding Interest Forecast*).
7. **Makro & Screener:** Dasbor indikator makroekonomi riil Indonesia (Inflasi YoY 2.42%, BI-Rate 6.00%, USD-IDR Rp 16.350, Fed Rate 3.5%) serta penyaring (*screener*) saham bluechip, kripto syariah, dan reksa dana berkinerja tinggi.
8. **Dividen & Senarai:** Kalender dividen emiten (BBRI, TLKM, ASII), estimasi yield portofolio bulanan, dan simulator pertumbuhan aset berbasis *Dividend Reinvestment Plan (DRIP)*.
9. **Pensiun & Faraid/Waris:** Perencana dana pensiun (*Safe Withdrawal Rate* SWR) disesuaikan inflasi, pencatat hibah, dan **Kalkulator Hukum Waris Islam (Faraid)** otomatis yang mematuhi aturan Kompilasi Hukum Islam (KHI) Indonesia.
10. **Profil & Jaringan Web3:** Pengaturan profil risiko finansial (*Conservative, Moderate, Aggressive*), manajemen kunci API, serta konsol integrasi dompet Web3 MetaMask.
11. **Kemitraan & Afiliasi:** Dasbor billing membership (Free, Pro, Whale), generator kupon promosi gerai, dan pencatatan komisi kemitraan afiliasi langsung ke ledger server.

---

## 🛠️ Integrasi Teknologi Canggih

### 1. Sinkronisasi Data Riil & Aktual (Real-Time Feed)
Platform ini memadukan data dari pasar keuangan aktual Indonesia per **Agustus 2026**:
* Harga dasar Emas Antam rujukan riil **Rp 2.610.000 / Gram** dan Buyback **Rp 2.379.000 / Gram**.
* Harga Perak Murni rujukan riil **Rp 39.450 / Gram**.
* Indeks IHSG, nilai tukar USD/IDR, serta kupon imbal hasil SBN (SR020 / ORI025) yang terus berfluktuasi secara dinamis melalui interval polling API server lokal.

### 2. Kecerdasan Buatan (AI Assistant - GeraiAI)
Platform ini menyertakan asisten ahli finansial cerdas (**GeraiAI Expert Advisor**). Bukan sekadar mock-up statis, mesin NLP di backend (`server.js`) membaca kondisi finansial riil Anda secara dinamis dari database, seperti:
* Menganalisis ketahanan dana darurat Anda terhadap pengeluaran aktual Anda.
* Memberikan rekomendasi alokasi kelas aset berdasarkan hasil kuis profil risiko Anda.
* Menyarankan strategi promosi kasir POS kepada pelanggan platinum CRM berdasarkan histori belanjanya.

### 3. Jaringan Blockchain & Desentralisasi (Web3)
Integrasi blockchain yang kuat meliputi:
* **Web3 MetaMask Connector:** Simulasi koneksi dompet kriptografi standar (`0x71C7...476B`) dengan proses verifikasi tanda tangan digital.
* **Tokenisasi Aset Fisik:** Pengguna dapat mendepositokan emas/perak fisik mereka di gerai dan mencetaknya (**minting**) menjadi token kriptografi **gGMR (geraiGold)** atau **gSLV (geraiSilver)** secara *on-chain*.
* **Live Block Explorer Console:** Menampilkan visualisasi penambahan blok, hash transaksi kriptografi, gas limit, dan status konsensus secara langsung di layar dasbor Anda.

---

## ⚙️ Cara Menjalankan Aplikasi di Lokal

Aplikasi ini sepenuhnya mandiri, ringan, dan portabel karena menggunakan basis **Node.js Express** dan **JSON database file** untuk persistensi snapshot Git yang aman.

### Langkah 1: Pasang Dependensi
Pastikan Node.js sudah terpasang, lalu jalankan perintah berikut di direktori proyek:
```bash
npm install
```

### Langkah 2: Jalankan Server Lokal
Mulai server Express:
```bash
npm start
```
Server akan berjalan di: **`http://localhost:3000`**

### Langkah 3: Akses Dasbor Keuangan
Buka peramban (*browser*) Anda dan akses `http://localhost:3000`. Nikmati seluruh fitur interaktif dasbor secara penuh!

---

## 📂 Struktur Berkas Proyek

```text
eko-gio-910-gerai/
├── database.json        # Database lokal (menyimpan profil, transaksi POS, data CRM, asuransi, dll.)
├── package.json         # Konfigurasi dependensi npm & skrip start
├── server.js            # Express backend (Simulasi API Makro, NLP AI Engine, Ledger Blockchain & REST API)
└── public/
    ├── index.html       # Antarmuka SPA premium dengan Tailwind CSS, Chart.js & Lucide Icons
    └── app.js           # Pengelola state reaktif frontend, visualisasi grafik & kalkulator finansial
```

Platform ini dirancang sebagai proyek berkelas industri nyata yang menggabungkan kemudahan audit kode, desain antarmuka modern bernuansa *cyberpunk dark mode*, serta kalkulasi matematika finansial dan hukum syariah Indonesia yang sangat akurat.
