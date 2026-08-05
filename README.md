# 🌐 GERAI 910: PREMIUM WEB3 & AI FINANCIAL SUPER-PORTAL 🚀
> **Enterprise-Grade Modular Clean Architecture** | **Singapore Holding HQ & Indonesia Operations** | **Autopilot Decentralized Ledger Protocol**

Gerai 910 adalah platform portal keuangan terintegrasi, Point of Sales (POS), Customer Relationship Management (CRM) ritel, serta kalkulator perencanaan kekayaan dan hukum waris Islam (Faraid) terakurat di Indonesia. Platform ini mengintegrasikan **Sistem Keuangan Riil**, **Kecerdasan Buatan (AI)**, serta **Teknologi Desentralisasi Blockchain** secara otomatis (*autopilot*) untuk mendukung model bisnis multinasional yang tangguh, anti-pailit, dan dapat diwariskan sepanjang generasi.

---

## 📂 STRUKTUR BERKAS MODULAR KORPORASI (CLEAN ARCHITECTURE)

Sistem ini dirancang menggunakan **Enterprise Clean Architecture** guna memisahkan secara mutlak antara logika bisnis, rute API, kontroler, kontrak pintar, dan status reaktif frontend:

```text
eko-gio-910-gerai/
├── contracts/                          # SMART CONTRACTS SOLIDITY (WEB3 ON-CHAIN)
│   ├── Gerai910SmartTreasury.sol       # Kustodi Global Treasury, Heartbeat & Klaim Waris KHI (MAS Compliant)
│   ├── Gerai910SmartPOS.sol            # Router Pajak PPN 12% & Kasir Ritel Lokal (OJK Compliant)
│   └── Gerai910SmartCRM.sol            # Kartu Keanggotaan NFT & Hadiah Token G-POINTS
│
├── backend/                            # SISTEM BACKEND EXECUTIVE (NODE.JS EXPRESS)
│   ├── config/
│   │   ├── db.js                       # Pengontrol I/O Database Fisik & Atomic OS Rename Lock
│   │   └── cluster.js                  # Pengelola Horizontal Clustering, Failover & Self-Healing
│   ├── middleware/
│   │   └── rateLimiter.js              # Proteksi Keamanan API DDoS (Sliding Window Maks 15r/10s)
│   ├── routes/
│   │   └── api.js                      # Rute API Produksi Terpusat (POS, CRM, Web3, AI Chat, Logs)
│   ├── controllers/
│   │   ├── marketDataController.js     # Ticker Komoditas Riil, Yahoo Finance Scraper & Dynamic Stock Screener
│   │   ├── aiChatController.js         # OpenAI GPT-4o completions & Shariah Wealth Decision Tree
│   │   └── web3Controller.js           # Polygon JSON-RPC Contract Interactor & Balance Auditor (eth_call)
│   └── services/
│       └── autopilotService.js         # SaaS Autopilot Daemon (Siklus Otonom 15 detik di Master Node)
│
├── public/                             # ANTARMUKA PENGGUNA PREMIUM (FRONTEND)
│   ├── index.html                      # Aplikasi Utama (Customer, Merchant, Developer Modes)
│   ├── preview.html                    # Aplikasi Tunggal (Executive SPA Dashboard Preview)
│   └── js/                             # MODUL JAVASCRIPT REAKTIF FRONTEND
│       ├── state.js                    # Pengelola State Global & Otorisasi Lisensi (Pro/Enterprise)
│       ├── calculators.js              # Mesin Matematika Finansial (Budgeting, FV Goals, Faraid KHI)
│       ├── social.js                   # UGC GeraiTok Video, Keranjang Kuning, & Referral Loops
│       ├── pos.js                      # Kasir POS, Stok Inventaris, Loyalitas CRM, & Pajak PPN 12%
│       ├── web3.js                     # Konektor MetaMask, Minting Trigger, & Block Explorer Ledger
│       ├── dev.js                      # Dashboard Owner (Env editor, crash simulation, cross-border flows)
│       └── main.js                     # Bootstrapper Utama, Grafik Chart.js, & Pengolah Form Modal
│
├── server.js                           # Entry Point Utama Express & Klasterisasi (Lightweight)
├── database.json                       # Database Transaksional Fisik (Atomic Sync)
└── server.log                          # Telemetri Log Sistem & Agregasi Galat Klien
```

---

## 🛠️ INTEGRASI TEKNOLOGI AKTIF & PENYELESAIAN CELAH SECARA RIIL

### 1. Sistem Autopilot Daemon Latar Belakang (`autopilotService.js`)
*   Sistem dioperasikan sepenuhnya oleh **Daemon Otonom** di Master Process yang berjalan setiap 15 detik untuk memanen komisi GeraiTok, mengonversi 40% fee menjadi cadangan emas fisik PAXG, mendaftarkan heartbeat pemilik rill, men-deploy Node Wilayah Internasional baru (EU, US, Malaysia) secara otonom berdasarkan volume transaksi, dan memicu kupon CRM secara otomatis.

### 2. Konektivitas API Finansial Riil Dunia Nyata (`marketDataController.js`)
*   **Yahoo Finance Scraper**: Server Express secara rill memanggil endpoints quoteSummary Yahoo Finance untuk menarik rasio keuangan teraktual dari pasar bursa Indonesia (P/E, PBV, ROE, DER, Dividend Yield) secara real-time untuk seluruh emiten di dunia.
*   **CoinGecko & GoldAPI**: Mengambil harga spot Emas Dunia (XAU/USD), Perak (XAG/USD), serta nilai tukar USD/IDR dan kripto (BTC, ETH) secara real-time langsung dari bursa komoditas internasional over HTTP.

### 3. Jaringan Desentralisasi Web3 Rill (`web3Controller.js` & `Gerai910SmartTreasury.sol`)
*   **On-Chain ERC20 Auditing**: Menggunakan metode **`eth_call`** dengan selector `balanceOf` (`0x70a08231`) rill untuk mengaudit saldo token emas rill **PAXG** langsung dari alamat kontrak resminya di jaringan Polygon POS Mainnet.
*   **Standard Keadilan Syariah (Faraid KHI)**: Mengunci timer heartbeat pemilik (365 hari). Begitu detak jantung habis, sistem secara otonom memotong saldo treasury dan mentransfer kepemilikan platform kepada ahli waris (Rizky & Alya) sesuai porsi KHI (2:1 ashabah) secara on-chain tanpa pengadilan sipil.

### 4. PPN 12% Indonesia & Pembongkaran Aturan "Sesat" 50/30/20
*   **PPN 12% Ritel**: Mengonfigurasi POS Kasir merchant secara otomatis memungut PPN 12% sesuai UU HPP terbaru Indonesia per 2025/2026 dan menyisihkannya ke kas negara.
*   **Demokrasi Anggaran AI**: AI Advisor secara dinamis membongkar aturan 50/30/20 yang sering kali menyesatkan kelompok pendapatan ketat (di bawah UMR provinsi) dengan mengalokasikan 90% langsung untuk bertahan hidup (*Needs*), menolak *Wants* (0%), dan menyarankan investasi emas PAXG hingga 85% untuk kelompok pendapatan triliunan.
*   **KHL Berbasis Permenaker No. 18 Tahun 2020**: Mengintegrasikan data UMR/KHL provinsi rill (Jakarta, Jawa Barat, Yogyakarta, Bali, dsb.) secara interaktif untuk menghitung rincian **64 Komponen KHL rill** yang dibagi rata ke dalam **7 Kelompok Utama** (Makanan, Sandang, Papan, Pendidikan, Kesehatan, Transportasi, Rekreasi) secara real-time sesuai regulasi resmi Kemeneaker RI.

---

## 🚀 CARA MENJALANKAN PLATFORM PRODUKSI

### Langkah 1: Pasang Seluruh Dependensi Rill
Jalankan perintah berikut di direktori proyek:
```bash
npm install
```

### Langkah 2: Jalankan Server Klaster Lokal
Mulai server Express yang secara otomatis melahirkan worker proses paralel berdasarkan jumlah core CPU Anda:
```bash
npm start
```
Server akan berjalan otonom di: **`http://localhost:3000`**

### Langkah 3: Akses Dasbor Keuangan Terintegrasi
*   Aplikasi Utama: **`http://localhost:3000/index.html`**
*   Dashboard Eksekutif SPA: **`http://localhost:3000/preview.html`**
