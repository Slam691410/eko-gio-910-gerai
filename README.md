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
