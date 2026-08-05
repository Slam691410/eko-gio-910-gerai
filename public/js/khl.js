// ============================================================================
// KHL 2026 — DATA RESMI 38 PROVINSI + ANALISIS (backend /api/khl/*)
// Diintegrasikan dari modul M-01 KHL (data Kemnaker, Permenaker 18/2020).
// ============================================================================

let khlDataCache = null; // { provinsi: [...], asumsi, komponen }

async function initKHLPanel() {
  const panel = document.getElementById('tab-budget');
  if (!panel) return;

  try {
    const res = await fetch('/api/khl/provinsi');
    if (!res.ok) throw new Error('Gagal memuat data KHL');
    const data = await res.json();
    khlDataCache = data;

    // Isi dropdown provinsi
    const sel = document.getElementById('khl26-provinsi');
    if (sel && data.provinsi) {
      sel.innerHTML = '';
      data.provinsi.forEach((p) => {
        const opt = document.createElement('option');
        opt.value = p.kode;
        opt.textContent = `${p.nama} — KHL ${fmtRp(p.khl)} / UMP ${fmtRp(p.ump)}`;
        sel.appendChild(opt);
      });
      // Default: provinsi dari profil pengguna bila ada
      const userProv = appState?.db?.profile?.province || 'DKI Jakarta';
      const match = data.provinsi.find((p) => p.nama.toLowerCase() === userProv.toLowerCase());
      if (match) sel.value = match.kode;
    }

    // Info sumber
    const info = document.getElementById('khl26-sumber');
    if (info && data.sumber) {
      info.textContent = `Sumber: ${data.sumber.sumber || 'Kemnaker'} — ${data.sumber.metode || ''} (rilis ${data.sumber.tanggal_rilis || '2025'})`;
    }

    // Muat komponen 64
    loadKomponenKHL();
  } catch (err) {
    console.error('initKHLPanel error:', err);
    const box = document.getElementById('khl26-error');
    if (box) box.textContent = 'Gagal memuat data KHL 2026 dari server.';
  }
}

async function loadKomponenKHL() {
  try {
    const res = await fetch('/api/khl/komponen');
    if (!res.ok) throw new Error('komponen gagal');
    const komponen = await res.json();
    renderKomponenKHL(komponen);
  } catch (err) {
    console.error('loadKomponenKHL error:', err);
  }
}

function renderKomponenKHL(komponen) {
  const container = document.getElementById('khl26-komponen-list');
  if (!container) return;

  container.innerHTML = '';
  const header = document.createElement('div');
  header.className = 'text-[10px] text-slate-500 mb-2';
  header.innerHTML = `Dasar hukum: <span class="text-slate-300 font-semibold">${komponen.dasar_hukum || 'Permenaker 18/2020'}</span> • ${komponen.jumlah_komponen} komponen • ${komponen.tanggal_penetapan || ''}`;
  container.appendChild(header);

  (komponen.kelompok || []).forEach((kel) => {
    const block = document.createElement('div');
    block.className = 'mb-3';
    block.innerHTML = `
      <div class="flex items-center gap-2 mb-1">
        <span class="text-[11px] font-bold text-brand-400">${kel.nama}</span>
        <span class="text-[9px] bg-slate-800 rounded-full px-2 py-0.5 text-slate-400">${kel.jumlah} item</span>
      </div>`;
    const wrap = document.createElement('div');
    wrap.className = 'flex flex-wrap gap-1';
    (kel.komponen || []).forEach((item) => {
      const chip = document.createElement('span');
      chip.className = 'text-[9px] bg-slate-900 border border-cyber-border rounded-lg px-2 py-1 text-slate-300';
      chip.textContent = item.nama || item;
      wrap.appendChild(chip);
    });
    block.appendChild(wrap);
    container.appendChild(block);
  });
}

function bacaInputKHL() {
  const kode = document.getElementById('khl26-provinsi')?.value || '32';
  const jumlahArt = parseInt(document.getElementById('khl26-art')?.value, 10) || 4;
  const artBekerja = parseInt(document.getElementById('khl26-bekerja')?.value, 10) || 1;
  const penghasilan = parseInt(document.getElementById('khl26-penghasilan')?.value, 10) || 0;
  const cicilan = parseInt(document.getElementById('khl26-cicilan')?.value, 10) || 0;
  const fase = document.getElementById('khl26-fase')?.value || 'ekspansi';
  const punyaBpjs = document.getElementById('khl26-bpjs')?.checked || false;
  return { kode_provinsi: kode, jumlah_art: jumlahArt, art_bekerja: artBekerja, penghasilan_bersih_rt: penghasilan, cicilan_wajib: cicilan, fase_ekonomi: fase, punya_bpjs: punyaBpjs };
}

async function hitungKHL2026() {
  const hasilBox = document.getElementById('khl26-hasil');
  if (!hasilBox) return;
  hasilBox.innerHTML = '<div class="text-xs text-slate-500">Menghitung analisis KHL...</div>';

  try {
    const res = await fetch('/api/khl/hitung', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bacaInputKHL())
    });
    const data = await res.json();
    if (!res.ok) {
      hasilBox.innerHTML = `<div class="text-xs text-red-400">Error: ${data.error || 'Masukan tidak valid'}${data.rincian ? '<br>• ' + data.rincian.join('<br>• ') : ''}</div>`;
      return;
    }
    renderHasilKHL(data);
  } catch (err) {
    hasilBox.innerHTML = `<div class="text-xs text-red-400">Gagal menghitung: ${err.message}</div>`;
  }
}

function renderHasilKHL(h) {
  const box = document.getElementById('khl26-hasil');
  if (!box) return;

  const warna = h.status?.warna === 'hijau' ? 'text-emerald-400' : h.status?.warna === 'kuning' ? 'text-yellow-400' : 'text-red-400';
  const badge = h.status?.warna === 'hijau' ? 'bg-emerald-950 border-emerald-800' : h.status?.warna === 'kuning' ? 'bg-yellow-950 border-yellow-800' : 'bg-red-950 border-red-800';

  const alokasi = h.anggaran?.alokasi || {};
  const barisAlokasi = Object.entries(alokasi)
    .map(([k, v]) => `<tr><td class="p-1.5 text-[10px] text-slate-400 capitalize">${k.replace(/([A-Z])/g, ' $1')}</td><td class="p-1.5 text-right font-mono text-[10px] text-slate-200">${fmtRp(v)}</td></tr>`)
    .join('');

  box.innerHTML = `
    <div class="space-y-3">
      <div class="flex flex-wrap items-center gap-2">
        <span class="text-[11px] font-bold px-3 py-1 rounded-full border ${badge} ${warna}">${h.status?.label || h.status?.kode || '—'}</span>
        <span class="text-[10px] text-slate-400">${h.provinsi} — ART ${h.jumlahArt} (${h.artBekerja} bekerja)</span>
      </div>
      <p class="text-[11px] text-slate-400 leading-relaxed">${h.status?.penjelasan || ''}</p>

      <div class="grid grid-cols-2 gap-2 text-[10px]">
        <div class="bg-slate-900 rounded-xl p-2.5"><span class="text-slate-500 block">KHL Rumah Tangga</span><b class="font-mono text-brand-400">${fmtRp(h.khlRumahTangga)}</b></div>
        <div class="bg-slate-900 rounded-xl p-2.5"><span class="text-slate-500 block">UMP Provinsi</span><b class="font-mono ${h.umpMenutupiKhl ? 'text-emerald-400' : 'text-red-400'}">${fmtRp(h.umpProvinsi)}</b></div>
        <div class="bg-slate-900 rounded-xl p-2.5"><span class="text-slate-500 block">Penghasilan RT Bersih</span><b class="font-mono text-slate-200">${fmtRp(h.penghasilanBersihRt)}</b></div>
        <div class="bg-slate-900 rounded-xl p-2.5"><span class="text-slate-500 block">${h.surplus ? 'Surplus' : 'Kesenjangan'}</span><b class="font-mono ${h.surplus ? 'text-emerald-400' : 'text-red-400'}">${fmtRp(Math.abs(h.kesenjangan || 0))}</b></div>
      </div>

      <div>
        <div class="text-[10px] font-bold text-slate-400 mb-1">Tingkat Pemenuhan KHL</div>
        <div class="bg-slate-900 h-2 rounded-full overflow-hidden">
          <div class="h-full ${h.persenPemenuhan >= 100 ? 'bg-emerald-500' : 'bg-red-500'}" style="width:${Math.min(100, h.persenPemenuhan || 0)}%"></div>
        </div>
        <div class="text-[9px] text-slate-500 mt-0.5">${(h.persenPemenuhan || 0).toFixed(1)}% — ${h.rasioPemenuhan ? 'rasio ' + h.rasioPemenuhan.toFixed(3) : ''}</div>
      </div>

      <div class="bg-slate-900/60 rounded-xl p-3">
        <div class="text-[10px] font-bold text-slate-400 mb-1">Mode Anggaran: <span class="text-brand-400">${h.anggaran?.mode || '—'}</span></div>
        ${h.anggaran?.catatan ? `<p class="text-[10px] text-slate-500 mb-2">${h.anggaran.catatan}</p>` : ''}
        <table class="w-full">${barisAlokasi}</table>
        <ol class="mt-2 space-y-0.5">
          ${(h.anggaran?.prioritas || []).map((pr, i) => `<li class="text-[9px] text-slate-400">${i + 1}. ${pr}</li>`).join('')}
        </ol>
      </div>

      ${h.kunciInvestasi?.terkunci ? `<div class="p-2.5 bg-red-950/40 border border-red-900 rounded-xl text-[10px] text-red-300">${h.kunciInvestasi.pesanSopan || 'Modul investasi terkunci sampai KHL terpenuhi.'}</div>` : ''}
      ${h.rencana?.perlu ? `<div class="p-2.5 bg-blue-950/40 border border-blue-900 rounded-xl text-[10px] text-blue-300">${h.rencana.ringkasan || ''}</div>` : ''}
      <p class="text-[9px] text-slate-600">Dihitung: ${new Date(h.dihitungPada).toLocaleString('id-ID')}</p>
    </div>`;
}

function fmtRp(n) {
  return 'Rp ' + Math.round(n || 0).toLocaleString('id-ID');
}

// Inisialisasi saat DOM siap (dipanggil juga oleh main.js bila perlu)
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initKHLPanel);
  } else {
    initKHLPanel();
  }
}
