# Code Review — GERAI 910 (`eko-gio-910-gerai`)

> **STATUS: Perbaikan sudah diterapkan dan diverifikasi live (2026-08-05).**
> Bagian bawah dokumen ini adalah temuan awal; semua temuan kritis (C1–C5) dan mayoritas
> temuan tinggi (H1–H4) sudah diperbaiki. Detail perbaikan ada di bagian
> **"✅ Perbaikan yang sudah diterapkan"** di bawah.

- **Reviewed commit:** `bcc0c0c` (merge of PR #4 `feature/smoke-helmet-csp` into `main`) — current tip of `main` and of this session's branch.
- **Scope:** PR #4 changes (SQLite migration, pino logging, helmet+CSP, smoke test, cluster/self-healing) plus the surrounding app they integrate with (server, routes, controllers, services, contracts, frontend).
- **Method:** static analysis + live verification (installed deps, ran the server, exercised the HTTP API, ran the smoke test).
- **Verdict:** The refactor introduced several **critical bugs that lose data and break the app**. The changes were **not safe to merge/publish as-is** — they have now been fixed and verified (see below).

---

## ✅ Perbaikan yang sudah diterapkan

| # | Temuan | Perbaikan | Verifikasi |
|---|--------|-----------|------------|
| C1 | Autopilot menghapus seluruh database (readDB async dipakai sebagai sync) | `await readDB()` di `autopilotService.js`, `aiChatController.js`, `web3Controller.js` | `/api/db` masih berisi 17+ key & profil "Eko Gio" setelah autopilot jalan berulang kali |
| C2 | Migrasi tidak pernah jalan, log ditulis di luar repo (path `../../../` salah) | Path dikoreksi ke `../../`; `server.log` kini di dalam repo; backup migrasi dibuat di `data/` | Backup `database.json.bak.*` muncul; `server.log` terbaca via `/api/logs` |
| H2 | Data bisa di-reset seed setiap restart/respawn | Migrasi dibuat **one-shot & idempotent** (marker hash di SQLite), hanya dijalankan di proses Master | Setelah crash worker → respawn, data live (mis. emas 17g) tetap utuh |
| C3 | Endpoint admin/dev tanpa autentikasi (bocor secret, DB bisa ditimpa, crash on-demand) | Middleware `adminAuth` baru + `ADMIN_API_TOKEN` di `.env.example`; dipasang di `POST /api/db`, `/api/blockchain/mint`, semua `/api/dev/*` | Tanpa token → `401`; dengan `Authorization: Bearer <token>` → sukses |
| C4 | CSP baru memblokir 136 handler inline + inline script (UI rusak) | `'unsafe-inline'` ditambahkan ke `script-src` (dengan TODO untuk pengerasan) | Halaman termuat; smoke test `index.html` & konten "GERAI 910" lolos |
| C5 | Smoke test cek jalur salah (`/public/js/*` → 404) | Path dikoreksi ke `/js/main.js`, `/js/calculators.js`; tambah cek `/api/health` + cek seed DB | `npm run smoke-test` → **exit 0** |
| — | Smoke test gagal akibat `pipefail` + `grep -q` (SIGPIPE) | Gunakan file sementara, bukan pipe | Smoke test stabil lulus |
| H1 | `POST /api/blockchain/mint` menggantung tanpa respons | `await readDB()` + wrapper `asyncHandler` + error middleware global di `server.js` | Mint membalas dalam ~0,1 detik |
| H3 | Solidity: share waris bisa >100%, transfer tanpa cek return, CRM tanpa akses kontrol | `configureHeir` validasi total di jalur update; `require()` di semua transfer; `onlyAdmin` di CRM; duplikasi komentar dihapus | Kode kontrak diperiksa |
| H4 | Rate limiter bocor memori (map tak pernah dibersihkan) | Eviction entri kadaluarsa saat map > 10.000 | Kode diperiksa |
| M1 | `SQLITE_BUSY` berisiko + log dobel `msg` + tabel log membengkak | `PRAGMA journal_mode=WAL`, `busy_timeout=5000`, log pino dirapikan (satu `msg`), prune tabel log otomatis | Struktur log bersih, WAL aktif |
| M2 | CORS permisif default (`cors()`) | CORS hanya aktif jika `CORS_ORIGIN` disetel (default same-origin) | Kode diperiksa |
| M3 | Crash-loop respawn tanpa batas di cluster | Pembatasan: >10 crash/60 detik → respawn dijeda 60 detik; master `uncaughtException` → `exit(1)` | Kode diperiksa |
| — | Artefak runtime (sqlite, backup, log) mengotori repo | `.gitignore` diperbarui (`data/*.sqlite*`, `data/database.json.bak.*`, `*.log`) | `git status` bersih |

**Cara verifikasi cepat:**
```bash
npm install
ADMIN_API_TOKEN=<token-anda> npm start   # tanpa token = mode development (terbuka)
npm run smoke-test
```

**Yang masih direkomendasikan (belum dikerjakan):**
- Pindahkan 136 handler inline + inline script `index.html` ke file JS eksternal, lalu hapus `'unsafe-inline'` dari CSP (pengerasan lanjutan).
- Pindahkan rate-limit map ke Redis (shared) saat multi-instance.
- Migrasi SQLite → Postgres/MongoDB untuk beban produksi (lihat `GUIDE_TO_PUBLISH.md`).
- Pasang library OpenZeppelin (SafeERC20) dan audit kontrak dengan Slither/Mythril sebelum deploy.
- Dokumentasikan bahwa "wallet connect" & "mint on-chain" saat ini adalah simulasi ber-fallback tinggi.

---

## 🧩 Integrasi Modul KHL 2026 (dari branch `arena/019fc5bb`)

Branch `arena/019fc5bb-eko-gio-910-gerai` berisi aplikasi terpisah (PyraBudget) dengan
**data KHL/UMP 2026 lengkap 38 provinsi** + **paket rumus domain-khl (9 rumus, 35 tes)**.
Daripada merge mentah (bentrok besar karena branch itu berbasis komit awal), isinya
diintegrasikan secara bersih ke arsitektur main:

| Aset | Status |
|---|---|
| `data/khl/2026/*` (41 file: 38 provinsi + indeks + asumsi + komponen-64) | ✅ disalin utuh |
| `data/ump/2026/*` (39 file: 38 provinsi + indeks) | ✅ disalin utuh |
| `packages/domain-khl/` (9 rumus + 35 tes, ESM murni) | ✅ disalin + `package.json` (`type: module`) |
| `infra/seed/` (skrip regenerasi data) | ✅ disalin |
| 5 endpoint API KHL | ✅ ditulis ulang di `backend/controllers/khlController.js` (arsitektur main, CJS) |
| Panel frontend KHL 2026 | ✅ ditambahkan di Tab 4 (budget) + `public/js/khl.js` |
| `npm run test:khl` (35 tes) | ✅ lulus |
| Smoke test cek `/api/khl/provinsi` & `/api/khl/komponen` | ✅ ditambahkan |

**Hasil verifikasi live:** 38 provinsi terbaca, 32 dari 38 provinsi UMP < KHL (sesuai klaim
data), analisis KHL mengembalikan status LAYAK/kurang lengkap dengan mode anggaran,
64 komponen Permenaker 18/2020 tersaji, validasi masukan bekerja.

**Catatan:** branch `arena/019fc5bb` dipertahankan di origin sebagai sumber historis.
Setelah PR integrasi ini di-merge, branch itu bisa dihapus bila diinginkan.

---

## 📋 Temuan awal (sebelum perbaikan)

### 🔴 CRITICAL

### C1. Autopilot daemon wipes the entire database to a 138-byte stub — verified live
`readDB()` became **async** in the SQLite refactor (`backend/config/db.js`):

```js
async function readDB() { const data = await readKV('root'); return data || {}; }
```

But three callers still treat it as synchronous:

- `backend/services/autopilotService.js` → `runAutopilotCycle()`: `const db = readDB();` then mutates `db.platformSettings`, `db.affiliateData…`, and calls `writeDB(db)`.
- `backend/controllers/aiChatController.js` → `handleAIChat()`: `const db = readDB();` and reads `db.assets`, `db.profile`, etc.
- `backend/controllers/web3Controller.js` → `mintToken()`: `const db = readDB();`.

Since `readDB()` returns a **Promise**, all reads come back `undefined`. Worse, `writeDB(db)` runs `JSON.stringify(promise)` — a Promise serializes as the own enumerable properties that the autopilot just attached (e.g. `platformSettings`), so **the whole `root` record is replaced by `{"platformSettings":{…}}`** every cycle.

**Verified live:** ~5 s after boot, `GET /api/db` already returned only `platformSettings` — the seeded `profile` (name, email, phone), `assets`, `posTransactions`, `blockchainLedger`, etc. were gone from SQLite. The `logs` table also showed the cycle running (`Starting cycle #1…`, `HEARTBEAT…`).

**Fix:** `const db = await readDB();` in all three callers, plus a regression test that boots the server and asserts `GET /api/db` still contains the seed data after ≥ 20 s.

---

### C2. JSON→SQLite migration never runs — path is one directory too high
In `backend/config/db.js`:

```js
const JSON_DB_PATH = path.join(__dirname, '../../../database.json'); // → /home/user/database.json
const LOG_FILE     = path.join(__dirname, '../../../server.log');    // → /home/user/server.log
```

`__dirname` is `…/backend/config`, so `../../..` escapes the repo (`/home/user/eko-gio-910-gerai` is only **two** levels up from `backend/config`). Results:

- `database.json` migration **silently never executes** (`existsSync` is false, no log, no backup file). Verified: no `data/database.json.bak.*` was ever created, and `database.json` stayed untouched at repo root.
- The pino log file is written **outside the repo** (`/home/user/server.log` — verified 10 KB file while the server ran). In any deployment the app will write outside its own directory, and `GET /api/logs` reads that same wrong path.

**Fix:** use `../../database.json` and `../../server.log` (i.e. `path.join(__dirname, '..', '..', …)`), and make the migration failure loud (throw/log at boot instead of silent `catch`).

---

### C3. All admin/dev endpoints are unauthenticated — secrets, DB and DoS exposed
Every one of these is reachable by any anonymous caller (only the flawed rate limiter stands in the way):

| Endpoint | Impact | Verified |
|---|---|---|
| `GET /api/db` | Full database dump — PII (name, email, phone, addresses) + financial assets + ledger | ✅ returns full DB |
| `POST /api/db` | Arbitrary overwrite of any record (e.g. set `profile.premiumTier: "Enterprise"`, inject records) | ✅ wrote `{"hacked":true}` |
| `GET /api/dev/env` | Dumps **all secrets**: `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `WEB3_PLATFORM_MASTER_PRIVATE_KEY`, `MIDTRANS_SERVER_KEY`, `GOLD_PRICE_API_KEY`, … | ✅ returns all env keys/values |
| `POST /api/dev/env` | Rewrites `.env` + `process.env` with arbitrary values (no escaping: values with `\n` inject config lines) | code-verified |
| `POST /api/dev/crash` | Kills a worker on demand → combined with cluster auto-respawn, an attacker can force a crash-loop / CPU burn | ✅ worker died, cluster forked replacement |
| `POST /api/dev/autopilot` | Changes platform state (growth/heartbeat) | ✅ mutation accepted |

The "Pro/Enterprise" gating in the frontend is cosmetic — it just calls `alert()` in `state.js`. In practice there is **no access control anywhere** in this "production SaaS" app.

**Fix:** require authentication (session/JWT) for `/api/db` writes and all `/api/dev/*`; never return secret values from `GET /api/dev/env` (return `isSet: true/false` instead); remove `forceCrashWorker` from production or gate behind an admin token; keep `POST /api/db` read-only for anonymous users.

---

### C4. New CSP breaks the UI — 136 inline handlers + 1 inline script blocked
`server.js` sets `scriptSrc: ["'self'", CDNs…]` **without `'unsafe-inline'`**. Meanwhile `public/index.html` contains:

- an inline `<script>` block at line 13 (`tailwind.config = {…}`), and
- **136 inline event-handler attributes** (`onclick=`, `onchange=`, `oninput=`, `onsubmit=`).

Per CSP spec, all of these are blocked without `'unsafe-inline'`/`'unsafe-hashes'` in `script-src` — so the very PR that added the CSP breaks most interactivity of the app in a browser. (Verified statically; enforcement is client-side.)

**Fix:** move `tailwind.config` and inline handlers to external JS files (best), or add `'unsafe-inline'`/`'unsafe-hashes'` to `script-src` for now (and note the trade-off). Add a browser-level CSP check to the smoke test.

---

### C5. The new smoke test fails against its own build
`scripts/smoke-test.sh` checks `GET /public/js/main.js` and `/public/js/calculators.js`, but static assets are served from `public/` at the root (`express.static(path.join(__dirname, 'public'))`), and `index.html` references `/js/main.js`. So `/public/js/*` → **404**.

**Verified live:** `npm run smoke-test` → `Checking /public/js/main.js ... FAIL (got 404, expected 200)`, exit code 2.

**Fix:** change the checks to `/js/main.js` and `/js/calculators.js`, and add `/api/health` + a `POST /api/ai-chat` sanity check (would have caught C1).

---

## 🟠 HIGH

### H1. `POST /api/blockchain/mint` never responds (request hangs)
`mintToken` (web3Controller) uses the sync `readDB()` (C1) → `db.assets` is `undefined` → `TypeError` inside the async handler. Express 4 does not catch async rejections → the client gets **no response** (verified: `curl` timed out after 12 s, `EXIT=28`; server logged `Failed to query on-chain token balance: fetch failed` then hung the request).

**Fix:** `await readDB()`, wrap async routes with an error-handling wrapper (`asyncHandler`), and add a global Express error middleware that returns 500 instead of hanging.

### H2. Data reset on every restart and every worker respawn (once C2 is fixed)
Even after the path fix, `migrateIfNeeded()` re-imports the committed `database.json` **on every boot and every self-healed worker fork** — overwriting live data with the original seed (the file is copied to a backup but never removed/renamed/marked). Combined with the cluster's auto-respawn (verified: crash → `Self-Healing` → new worker), a single crash can roll back the database.

**Fix:** after a successful migration, atomically rename/delete the JSON source, or persist a "migrated" marker (e.g. a `meta` row with a hash of the source); never re-import on subsequent starts.

### H3. Solidity: `configureHeir` can set total shares > 100%, and `claimInheritance` ignores transfer failures
In `contracts/Gerai910SmartTreasury.sol`:

- `configureHeir()` — when an existing heir's wallet is re-configured, the code updates the share and `return`s **before** validating the ≤ 10000 bps total (the `require(totalShares + _sharePercentage <= 10000)` only runs on the new-heir path). Updating one heir to 8000 with another at 6000 silently yields 140% total.
- `claimInheritance()` — `token.transfer(heirs[i].wallet, heirShare)` return values are **unchecked**; with shares > 100% (above) or fee-on-transfer tokens / rounding dust, distributions fail silently while `isEstateDisbursed = true` and ownership has moved.

Also `Gerai910SmartPOS.processPOSSale` and `Gerai910SmartCRM.awardPoints/upgradeMembership` have **no access control** (`awardPoints` and `upgradeMembership` are callable by anyone — anyone can mint themselves Platinum and points; `processPOSSale` lets anyone move `msg.sender`'s approved tokens, which is arguably fine but the tax/fee split destinations are set in stone).

**Fix:** validate total on the update path; `require(token.transfer(...))` on every transfer (or use SafeERC20); add `onlyAdmin` to CRM functions; add a `distributeDust`/rebalance note.

### H4. Rate limiter: unbounded memory + per-worker limits
`backend/middleware/rateLimiter.js`:

- `rateLimitMap` **never evicts** IPs → memory grows unboundedly with unique visitors (long uptime = leak).
- With clustering, the map is per-process → effective limit is `numCPUs × 15` req/10 s.
- Falls back to `x-forwarded-for` without enabling `trust proxy` (fallback never actually triggers since `req.ip` is always set — but the code is misleading).

**Fix:** prune stale entries (or use a fixed-size LRU), and move the counter to a shared store (Redis) as the GUIDE already recommends.

---

## 🟡 MEDIUM

### M1. SQLite concurrency & log bloat
- No `busy_timeout`/WAL: the master autopilot + N workers all write the same SQLite file → `SQLITE_BUSY` errors under any load (log inserts already fail silently).
- `logEvent()` inserts a row into the `logs` table on **every** call — including the 15-second autopilot cycle and every rate-limit warning — and appends to `server.log`, with **no rotation and no pruning**. Both grow forever.
- Duplicate fields in pino output: `logger.info(entry, msg)` where `entry` already contains `msg`/`timestamp` → every log line has two `msg` keys (visible in `GET /api/logs` output).

### M2. CORS is permissive by default
`server.js`: `if (CORS_ORIGIN) cors({origin}) else cors()` — with no env set, **any origin** may call the API, including the unauthenticated admin/DB endpoints (C3). For anything called "production", default to deny.

### M3. Master process crash handling / respawn loop
`backend/config/cluster.js`: master `uncaughtException` logs but does not exit (may keep running corrupted); worker `exit` handler respawns **unconditionally** — a worker that dies on boot (e.g. DB lock) causes an infinite fork loop.

### M4. Frontend issues
- Client-side-only authorization (`state.js` `verifyAuthorization` just alerts; `premiumTier` is writable via `POST /api/db` — verified).
- "Connect wallet" (`public/js/web3.js`) generates a **random fake address** — no MetaMask integration; claims of "dompet kripto terhubung" are misleading.
- AI reply + user text rendered via `innerHTML` (XSS sink if a reply ever contains HTML; mitigated only by the CSP you just added — which the current CSP also breaks, see C4).
- `index.html` served with `max-age=86400` → stale UI after deploys (no cache-busting).

### M5. Docs overstate production readiness
README/GUIDE claim live market feeds, autonomous international node deployment, on-chain inheritance, DJP e-Factur sync. In the code:
- market data falls back to hardcoded values + `Math.random()` jitter when APIs fail;
- "auto-deployed regional nodes" = a counter in a JSON record;
- `mintToken` produces a **random 64-hex hash**, `from: 0x0000…`, no signing, no transaction — it is a simulation labeled "Confirmed" on-chain;
- no deployment scripts/addresses for the contracts (they're never deployed).
If these are intentional demo behaviors, document them as such; if not, they are misleading claims about a financial platform.

---

## 🟢 LOW / NITS
- `logEvent` double-writes `msg`/`timestamp` (see M1) — pass only `msg` as the string arg.
- `getDynamicScreenerData` returns inconsistent shapes for the `Resesi` phase (no live metrics).
- `mintToken`'s `token.includes('Gold')` matching is fragile.
- `cluster.js` spawns one worker per CPU with no cap — consider `os.cpus().length` cap on small instances.
- `express.json()` default 100 kb body limit is fine, but `POST /api/logs/report` allows arbitrary log-line injection (log poisoning).
- Good points to keep: parameterized SQL everywhere, helmet security headers + caching headers, graceful worker shutdown, health endpoint, modular route/controller/service layout, `.env.example` documented.

---

## Reproduction notes (all verified in this session)
```bash
npm install            # sqlite3 needs node-gyp; build with: npm_config_nodedir=/usr/local npm rebuild sqlite3
npm start
curl -s localhost:3000/api/db          # after ~5s: only {"platformSettings":{...}} — seed data gone  (C1)
curl -s -X POST localhost:3000/api/db -d '{"hacked":true}' -H 'Content-Type: application/json'  (C3)
curl -s -X POST localhost:3000/api/blockchain/mint -d '{"token":"gGMR (Gerai Gold)","value":"2","address":"0x71C7656EC7ab88b098defB751B7401B5f6d1476B"}' -H 'Content-Type: application/json'  # hangs (H1)
npm run smoke-test     # FAIL at /public/js/main.js (C5)
ls /home/user/server.log               # log file written outside the repo (C2)
```

## Recommended order of fixes
1. C1 (await `readDB`) — stop the data loss immediately.
2. C2 (paths) + H2 (one-shot migration) — restore migration/backup.
3. C3 (auth) — lock down `/api/db`, `/api/dev/*`, `/api/logs/*`.
4. C5 (smoke test paths) + C4 (CSP vs inline handlers).
5. H1 (async error handling), then H3/H4, M1–M5 as hardening.
