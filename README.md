# 🔺 PyraBudget — SaaS Budgeting (Maslow × Keuangan + AI Blockchain)

Tools SaaS untuk budgeting yang menyusun ulang keuangan pribadi mengikuti
**Piramida Maslow** dipadukan dengan **Piramida Keuangan**. Dilengkapi
**AI Advisor** untuk saran alokasi otomatis dan **Blockchain Ledger (Proof-of-Budget)**
berbasis SHA-256 nyata. Dibangun dengan *vibes coding + AI Blockchain* — tanpa
dependency npm (murni modul bawaan Node).

## ✨ Fitur

- **Setup rumah tangga** — pemasukan, mata uang, nama.
- **5 Tier Piramida** — Physiological → Safety → Belonging → Esteem → Self-Actualization,
  dipetakan ke lapisan keuangan (cash flow, dana darurat, proteksi, pertumbuhan, akumulasi).
- **Catat transaksi = tambang blok** — setiap pengeluaran/pemasukan dicatat sebagai blok
  blockchain dengan *proof-of-work* ringan & hash SHA-256.
- **Dashboard alokasi** — bandingkan realokasi vs target ideal per tier + skor kesehatan.
- **Visualisasi piramida** interaktif (SVG).
- **AI Advisor** — analisis gap, rekomendasi naik/turun tier, confidence score.
- **Blockchain Ledger** — lihat rantai blok & verifikasi integritas (tamper-proof).
- **Strategi Konten Marketing** — auto-generate pillars, funnel, calendar & copy templates.
- **Data Riil (KHL + Makro)** — harga emas/perak & aset (BTC/ETH) real-time +
  indikator makro Indonesia (inflasi, PDB, pengangguran) + **fase ekonomi & fase
  penghasilan** yang menentukan arah budgeting (bukan sekadar 50/30/20).
- **Profil & Tanggungan** — input Data Diri (tgl lahir), Anak (tgl lahir / thn mulai
  sekolah), & Tanggungan Lain; hitung **Kebutuhan Dana Darurat** & **Tujuan Investasi**
  (dana pendidikan) otomatis.
- **Screening Investasi** — Top-Down (makro → sektor potensial), Fundamental
  (skor manajemen, afiliasi, red flag laporan keuangan, corporate action), &
  Teknikal (MA20/MA50, RSI14 + sinyal entry/exit dari data riil CoinGecko).
- **Sumber Penghasilan & Kewajiban** — multi-sumber penghasilan + manajemen
  **Hutang & Piutang** (pokok, bunga, tenor, Debt-to-Income, strategi pelunasan).
- **Asuransi** — daftar polis (jiwa/kesehatan/properti) & cek kecukupan
  pertanggungan vs kebutuhan.
- **Dana Pensiun, Waris & Hibah** — proyeksi dana pensiun (future value),
  serta inflow **waris / hibah** masa depan.
- **Tujuan Investasi Lengkap** — pendidikan, rumah, pensiun, waris & tujuan
  lain dengan target & horizon; ringkasan **Kesehatan Keuangan Holistik**
  (net worth, DTI, coverage, readiness).

## 🚀 Cara Menjalankan

### Opsi A — Server (backend Node, butuh install)
```bash
node server.js
# atau
npm start
```
Buka **http://localhost:3000** di browser.

> Butuh Node.js ≥ 18. Tidak perlu `npm install` karena hanya memakai modul bawaan
> (`http`, `fs`, `crypto`, `path`).

### Opsi B — Preview client-side (langsung dibuka)
`preview.html` adalah **satu file mandiri** (tanpa server): semua logika,
hashing SHA-256, blockchain, AI Advisor & marketing berjalan di browser.
Cukup buka file tersebut di browser (double-click) atau lewat preview di chat.
Data tersimpan di `localStorage`. Klik **✨ Muat Data Contoh** untuk langsung
melihat piramida terisi. Cocok untuk iterasi fitur dengan cepat.

## 🧱 Arsitektur

```
server.js              # HTTP + REST API + Blockchain + AI Advisor + Marketing
public/
  index.html           # UI SPA (tabs: Dashboard, Piramida, Ledger, AI, Marketing)
  css/styles.css       # tema glassmorphism + aurora
  js/app.js            # logika frontend & render SVG piramida
docs/marketing-strategy.md  # dokumen strategi konten lengkap
data/db.json           # persistensi (digenerate otomatis)
```

## 🔌 REST API

| Method | Endpoint | Keterangan |
|---|---|---|
| GET | `/api/state` | Ringkasan anggaran & skor |
| POST | `/api/household` | Simpan pemasukan/metadata |
| POST | `/api/transaction` | Tambah tx → tambang blok |
| GET | `/api/chain` | Ambil & verifikasi rantai |
| POST | `/api/ai/advice` | Analisis AI Advisor |
| GET | `/api/marketing` | Generator strategi konten |
| GET | `/api/market` | Harga real-time: emas (logam mulia), kurs USD→IDR, BTC/ETH |
| GET | `/api/macro` | Makro Indonesia + fase siklus ekonomi |
| DELETE | `/api/reset` | Reset data |

## 🧠 Model Piramida

| Tier | Maslow | Keuangan | Target % |
|---|---|---|---|
| 1 | Kebutuhan Fisiologis | Arus Kas & Survival | 50% |
| 2 | Rasa Aman | Dana Darurat, Utang & Proteksi | 20% |
| 3 | Cinta & Keterikatan | Gaya Hidup & Relasi | 15% |
| 4 | Penghargaan Diri | Pertumbuhan & Kapabilitas | 10% |
| 5 | Aktualisasi Diri | Akumulasi & Warisan | 5% |

---

Dibuat dengan vibes coding + AI Blockchain 💜

## 🏠 Modul KHL — Kebutuhan Hidup Layak (M-01, selesai)

> **KHL = Kebutuhan Hidup Layak**, yaitu standar **pengeluaran** layak per bulan untuk pekerja
> dan keluarganya. **KHL bukan aset.** Emas, perak, tanah, properti, SBN, reksadana, saham
> adalah **ASET** (modul M-02, tab *Data Riil*). Keduanya ada di aplikasi ini, bukan salah satu.

- Data acuan **38 provinsi** (Kemnaker 2026, metode berbasis studi ILO) + pembanding **UMP 2026**
  dan **garis kemiskinan BPS**.
- Hitung **kesenjangan** penghasilan rumah tangga vs KHL, rasio pemenuhan, dan status.
- **Mode anggaran** ditentukan rasio KHL, bukan rumus 50/30/20. Bila penghasilan di bawah KHL,
  **modul investasi dikunci** dan aplikasi beralih ke rencana menutup kekurangan.
- **Survei mandiri 64 komponen** Permenaker 18/2020 sebagai pembanding angka acuan.
- Temuan dari data: **32 dari 38 provinsi punya UMP di bawah KHL.**

### Struktur berkas modul KHL

```
data/khl/2026/      38 berkas provinsi + indeks + komponen-64 + asumsi
data/ump/2026/      38 berkas provinsi + indeks
packages/domain-khl/src/    9 berkas rumus & aturan (satu rumus satu berkas)
packages/domain-khl/test/   6 berkas tes — 35 tes
apps/preview/bangun-preview.js   menyuntik rumus + data ke preview.html
infra/seed/         sumber data & penulis berkas
```

### Perintah

```bash
npm test              # 35 tes rumus KHL
npm run seed:khl      # tulis ulang 80 berkas data KHL & UMP
npm run build:preview # suntik rumus + data ke preview.html
npm start             # jalankan server + API
```

### API KHL

| Method | Endpoint | Keterangan |
|---|---|---|
| GET | `/api/khl/provinsi` | 38 provinsi + KHL + UMP + selisih |
| GET | `/api/khl/provinsi/:kode` | detail satu provinsi |
| GET | `/api/khl/komponen` | 64 komponen Permenaker 18/2020 |
| POST | `/api/khl/hitung` | analisis kesenjangan + mode anggaran (dengan validasi masukan) |
| POST | `/api/khl/survei` | hitung KHL versi survei mandiri |

## 📄 Dokumen

- **`docs/PENJABARAN-DETAIL.md`** — penjabaran detail seluruh instruksi (8 instruksi, 21 modul,
  rumus, skema data, kriteria terima, urutan pengerjaan).
- **`docs/DAFTAR-FILE-TARGET.md`** — daftar 1.526 nama berkas target arsitektur penuh.
- **`docs/marketing-strategy.md`** — strategi konten.

> **Status jujur:** ini masih **prototipe/MVP**, belum SaaS produksi. Belum ada autentikasi,
> belum ada basis data sungguhan, belum ada batas laju. Rancangan lengkapnya ada di
> `docs/PENJABARAN-DETAIL.md` Bab 5, dikerjakan pada tahap T-6.
