/* PyraBudget frontend — vibes coding + AI Blockchain client */

const API = {
  get: (u) => fetch(u).then((r) => r.json()),
  post: (u, b) => fetch(u, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(b || {}) }).then((r) => r.json()),
  del: (u) => fetch(u, { method: 'DELETE' }).then((r) => r.json()),
};

const TIERS = [
  { id: 'physiological', icon: '🍚', maslow: 'Kebutuhan Fisiologis', finance: 'Arus Kas & Survival' },
  { id: 'safety', icon: '🛡️', maslow: 'Rasa Aman', finance: 'Dana Darurat, Utang & Proteksi' },
  { id: 'belonging', icon: '💞', maslow: 'Cinta & Keterikatan', finance: 'Gaya Hidup & Relasi' },
  { id: 'esteem', icon: '🎓', maslow: 'Penghargaan Diri', finance: 'Pertumbuhan & Kapabilitas' },
  { id: 'selfactualization', icon: '🌟', maslow: 'Aktualisasi Diri', finance: 'Akumulasi & Warisan' },
];

let STATE = null;
const fmtCache = {};
function fmt(n, cur = 'IDR') {
  const key = cur + Math.round(n);
  if (fmtCache[key]) return fmtCache[key];
  const v = new Intl.NumberFormat('id-ID', { style: 'currency', currency: cur, maximumFractionDigits: 0 }).format(n || 0);
  fmtCache[key] = v;
  return v;
}

function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._t);
  t._t = setTimeout(() => t.classList.remove('show'), 2200);
}

/* ---------- Tabs ---------- */
document.getElementById('tabs').addEventListener('click', (e) => {
  const btn = e.target.closest('.tab');
  if (!btn) return;
  document.querySelectorAll('.tab').forEach((t) => t.classList.remove('active'));
  document.querySelectorAll('.view').forEach((v) => v.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('view-' + btn.dataset.view).classList.add('active');
});

/* ---------- Populate tier select ---------- */
const txTier = document.getElementById('tx-tier');
TIERS.forEach((t) => {
  const o = document.createElement('option');
  o.value = t.id;
  o.textContent = `${t.icon} ${t.maslow}`;
  txTier.appendChild(o);
});

/* ---------- Household ---------- */
document.getElementById('btn-save-household').addEventListener('click', async () => {
  const body = {
    name: document.getElementById('in-name').value,
    income: Number(document.getElementById('in-income').value) || 0,
    currency: document.getElementById('in-currency').value || 'IDR',
  };
  await API.post('/api/household', body);
  toast('Rumah tangga tersimpan ✅');
  await refresh();
});

/* ---------- Sample data ---------- */
document.getElementById('btn-sample').addEventListener('click', async () => {
  await API.post('/api/household', { name: 'Keluarga Contoh', income: 15000000, currency: 'IDR' });
  const samples = [
    { kind: 'expense', amount: 7000000, tier: 'physiological', category: 'Sewa rumah' },
    { kind: 'expense', amount: 1500000, tier: 'physiological', category: 'Makanan' },
    { kind: 'expense', amount: 1500000, tier: 'safety', category: 'Dana darurat' },
    { kind: 'expense', amount: 2500000, tier: 'belonging', category: 'Makan luar' },
    { kind: 'expense', amount: 1000000, tier: 'esteem', category: 'Kursus' },
    { kind: 'expense', amount: 500000, tier: 'selfactualization', category: 'Investasi' },
  ];
  for (const s of samples) await API.post('/api/transaction', s);
  toast('Data contoh dimuat ✨');
  await refresh();
  renderLedger();
});

/* ---------- Transaction ---------- */
document.getElementById('btn-add-tx').addEventListener('click', async () => {
  const amount = Number(document.getElementById('tx-amount').value) || 0;
  if (amount <= 0) return toast('Masukkan jumlah > 0');
  const body = {
    kind: document.getElementById('tx-kind').value,
    amount,
    tier: document.getElementById('tx-tier').value,
    category: document.getElementById('tx-category').value,
    note: document.getElementById('tx-note').value,
  };
  const res = await API.post('/api/transaction', body);
  if (res.ok) {
    toast(`Blok #${res.block.index} ditambang ⛏️`);
    document.getElementById('tx-amount').value = '';
    document.getElementById('tx-category').value = '';
    document.getElementById('tx-note').value = '';
    await refresh();
    renderLedger();
  }
});

/* ---------- AI ---------- */
document.getElementById('btn-ai').addEventListener('click', async () => {
  const res = await API.post('/api/ai/advice', {});
  document.getElementById('aiSummary').textContent = res.summary;
  const wrap = document.getElementById('aiTips');
  wrap.innerHTML = '';
  res.tips.forEach((t) => {
    const el = document.createElement('div');
    el.className = 'tip';
    el.innerHTML = `<h3><span class="sev ${t.severity}">${t.severity}</span>${t.title}</h3><p>${t.message}${
      t.suggestAmount ? ` <b>(≈ ${fmt(t.suggestAmount, STATE?.household.currency)})</b>` : ''
    }</p>`;
    wrap.appendChild(el);
  });
  toast(`AI confidence ${Math.round(res.confidence * 100)}%`);
});

/* ---------- Marketing ---------- */
document.getElementById('btn-mkt').addEventListener('click', async () => {
  const m = await API.get('/api/marketing');
  const body = document.getElementById('mktBody');
  body.innerHTML = '';

  body.insertAdjacentHTML('beforeend', `
    <div class="mkt-section">
      <h3>🎯 Posisi & Audiens</h3>
      <div class="mkt-card">${m.position}</div>
      <div class="mkt-card">👥 ${m.audience}</div>
    </div>`);

  body.insertAdjacentHTML('beforeend', `
    <div class="mkt-section"><h3>🔻 Content Pillars (Piramida)</h3>
      <div class="mkt-grid">${m.pillars
        .map((p) => `<div class="mkt-card"><b>${p.pillar}</b><br><span class="muted">${p.angle}</span></div>`)
        .join('')}</div></div>`);

  body.insertAdjacentHTML('beforeend', `
    <div class="mkt-section"><h3>🚰 Funnel & Channel</h3>
      <div class="mkt-grid">${m.funnel
        .map((f) => `<div class="mkt-card"><span class="pill">${f.stage}</span><br><b>${f.channel}</b><br><span class="muted">${f.goal}</span></div>`)
        .join('')}</div></div>`);

  body.insertAdjacentHTML('beforeend', `
    <div class="mkt-section"><h3>🗓️ Content Calendar (4 Minggu)</h3>
      <div class="calendar">${m.calendar
        .map(
          (c) => `<div class="cal-week"><strong>${c.week}</strong> — 💡 ${c.theme}
            <ul>${c.posts.map((p) => `<li><b>${p.type}:</b> ${p.hook}</li>`).join('')}</ul></div>`
        )
        .join('')}</div></div>`);

  body.insertAdjacentHTML('beforeend', `
    <div class="mkt-section"><h3>✍️ Copy Templates</h3>
      ${m.copyTemplates
        .map((t) => `<div class="copy-tpl"><b>[${t.platform}]</b><br>${t.template}</div>`)
        .join('')}</div>`);

  body.insertAdjacentHTML('beforeend', `
    <div class="mkt-section"><h3>📊 KPI</h3>
      <div class="mkt-grid">${m.kpis.map((k) => `<div class="mkt-card">📈 ${k}</div>`).join('')}</div></div>`);
});

/* ---------- Ledger ---------- */
document.getElementById('btn-verify').addEventListener('click', async () => {
  const res = await API.get('/api/chain');
  document.getElementById('chainStatus').textContent = res.valid
    ? `✔️ Rantai valid — ${res.blockCount} blok, hash konsisten & tamper-proof.`
    : `✖️ Rantai rusak!`;
  document.getElementById('chainStatus').style.color = res.valid ? 'var(--good)' : 'var(--bad)';
});

async function renderLedger() {
  const res = await API.get('/api/chain');
  document.getElementById('chainBadge').textContent = `⛓️ ${res.blockCount} blok`;
  const list = document.getElementById('chainList');
  list.innerHTML = '';
  res.chain
    .slice()
    .reverse()
    .forEach((b) => {
      const d = b.data;
      const isGen = d.type === 'genesis';
      const meta = isGen
        ? d.note
        : `${d.kind === 'income' ? '➕ Pemasukan' : '➖ Pengeluaran'} · ${TIERS.find((t) => t.id === d.tier)?.icon || ''} ${
            TIERS.find((t) => t.id === d.tier)?.maslow || ''
          } · ${fmt(d.amount, STATE?.household.currency)} ${d.category ? '· ' + d.category : ''}`;
      const el = document.createElement('div');
      el.className = 'block' + (isGen ? ' genesis' : '');
      el.innerHTML = `
        <div class="bhead"><span>#${b.index} ${isGen ? 'GENESIS' : 'TX'}</span><span>${new Date(b.timestamp).toLocaleString('id-ID')}</span></div>
        <div class="meta">${meta}</div>
        <div class="meta">nonce: ${b.nonce}</div>
        <div class="hash">🔗 prev: ${b.previousHash.slice(0, 24)}…</div>
        <div class="hash"># hash: ${b.hash}</div>`;
      list.appendChild(el);
    });
}

/* ---------- Pyramid SVG ---------- */
function renderPyramid() {
  const wrap = document.getElementById('pyramidSvg');
  const W = 760, H = 500, cx = W / 2;
  // lebar per level dari bawah ke atas (Maslow: dasar terlebar)
  const widths = [620, 500, 380, 260, 140];
  const levelH = 88, gap = 6, top = 20;
  let svg = `<svg viewBox="0 0 ${W} ${H + 20}" xmlns="http://www.w3.org/2000/svg">`;
  const colors = ['#7c5cff', '#18d6c9', '#ff7ac6', '#fbbd23', '#36d399'];
  let y = top;
  // gambar dari atas (selfactualization) ke bawah
  for (let i = 4; i >= 0; i--) {
    const wTop = widths[i] / 2;
    const wBot = widths[i - 1 !== -1 ? i - 1 : i] / 2; // untuk level teratas pakai diri sendiri
    const halfTop = i === 4 ? 0 : widths[i + 1] / 2; // level di atasnya (lebih sempit)
    const halfBot = widths[i] / 2;
    const yTop = y;
    const yBot = y + levelH;
    const tier = TIERS[i];
    const alloc = STATE?.allocations.find((a) => a.id === tier.id);
    const pct = alloc ? Math.round(alloc.actualPct) : 0;
    svg += `<polygon points="${cx - halfTop},${yTop} ${cx + halfTop},${yTop} ${cx + halfBot},${yBot} ${cx - halfBot},${yBot}"
      fill="${colors[i]}" fill-opacity="0.22" stroke="${colors[i]}" stroke-width="2"/>`;
    svg += `<text x="${cx}" y="${yTop + levelH / 2 - 6}" text-anchor="middle" fill="#fff" font-size="15" font-family="Space Grotesk, sans-serif">${tier.icon} ${tier.maslow}</text>`;
    svg += `<text x="${cx}" y="${yTop + levelH / 2 + 16}" text-anchor="middle" fill="#cdd6ef" font-size="12">${tier.finance} · ${pct}%</text>`;
    y = yBot + gap;
  }
  svg += `</svg>`;
  wrap.innerHTML = svg;
}

/* ---------- Dashboard render ---------- */
function renderDashboard() {
  if (!STATE) return;
  const h = STATE.household;
  document.getElementById('in-name').value = h.name;
  document.getElementById('in-income').value = h.income;
  document.getElementById('in-currency').value = h.currency;

  document.getElementById('stat-income').textContent = fmt(STATE.income, h.currency);
  document.getElementById('stat-expense').textContent = fmt(STATE.totalExpense, h.currency);
  document.getElementById('stat-leftover').textContent = fmt(STATE.leftover, h.currency);
  const health = document.getElementById('stat-health');
  health.textContent = STATE.health + '/100';
  health.style.color = STATE.health >= 70 ? 'var(--good)' : STATE.health >= 45 ? 'var(--warn)' : 'var(--bad)';

  const bars = document.getElementById('allocBars');
  bars.innerHTML = '';
  STATE.allocations.forEach((a) => {
    const tier = TIERS.find((t) => t.id === a.id);
    const el = document.createElement('div');
    el.className = 'alloc';
    el.innerHTML = `
      <div class="label">${tier.icon} ${a.maslow}<small>${tier.finance}</small></div>
      <div class="bar-track">
        <div class="bar-fill" style="width:${Math.min(100, a.actualPct)}%"></div>
        <div class="bar-target" style="left:${a.target}%"></div>
      </div>
      <div class="pct">${a.actualPct}% <span class="muted">/ ${a.target}%</span></div>`;
    bars.appendChild(el);
  });
}

/* ---------- Refresh all ---------- */
async function refresh() {
  STATE = await API.get('/api/state');
  renderDashboard();
  renderPyramid();
}

/* ---------- Reset ---------- */
document.getElementById('btn-reset').addEventListener('click', async () => {
  if (!confirm('Hapus semua data & blockchain?')) return;
  await API.del('/api/reset');
  toast('Data direset 🔄');
  await refresh();
  renderLedger();
});

/* ---------- Init ---------- */
refresh().then(renderLedger);
