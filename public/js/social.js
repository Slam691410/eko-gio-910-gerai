// -------------------------------------------------------------
// GERAI TOK VERTICAL VIDEO & DUAL-SIDED REFERRAL LOOP

// Renders TikTok-style short vertical videos feed
function renderUGCFeed() {
  const container = document.getElementById('ugc-video-container');
  if (!container || !appState.db?.posts) return;

  container.innerHTML = '';
  const posts = appState.db.posts;

  posts.forEach(post => {
    const card = document.createElement('div');
    card.className = "flex-shrink-0 w-80 bg-slate-950 border border-cyber-border rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between relative";
    card.style.height = "520px";

    // Random walk views calculation
    const views = Math.floor(Math.random() * 20000) + 1200;

    card.innerHTML = `
      <!-- Video Simulator Canvas -->
      <div class="relative flex-1 bg-slate-900 flex items-center justify-center overflow-hidden group">
        <div class="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-transparent to-slate-950/90 z-10 pointer-events-none"></div>
        <div class="text-slate-600 group-hover:text-brand-500 transition duration-300 flex flex-col items-center gap-2">
          <i data-lucide="play" class="w-12 h-12 text-slate-500 animate-pulse"></i>
          <span class="text-[9px] uppercase tracking-wider font-mono-tech">Short Video Stream Playback</span>
        </div>

        <!-- Overlay Text & Author details -->
        <div class="absolute bottom-4 left-4 right-4 z-20 space-y-2 text-xs">
          <div class="flex items-center gap-2">
            <div class="w-7 h-7 rounded-full bg-slate-800 border border-brand-500 flex items-center justify-center font-bold text-slate-200">@</div>
            <div>
              <strong class="text-slate-200 block">@${post.author}</strong>
              <span class="text-[9px] text-slate-500 font-bold block">${views.toLocaleString()} views</span>
            </div>
          </div>
          <p class="text-slate-300 leading-relaxed text-[11px]">${post.content}</p>
        </div>
      </div>

      <!-- YELLOW BASKET AFILIASI GLOBAL (100% SEPARATED FROM MERCHANT POS) -->
      <div class="p-4 bg-slate-950 border-t border-cyber-border/40 z-30 space-y-3">
        <div class="bg-yellow-500/10 border border-yellow-500/20 p-2.5 rounded-xl flex items-center gap-2.5 justify-between">
          <div class="flex items-center gap-2">
            <div class="p-1.5 bg-yellow-500/20 rounded-lg text-yellow-500">
              <i data-lucide="shopping-bag" class="w-4 h-4"></i>
            </div>
            <div>
              <strong class="text-slate-200 text-[11px] block">${post.productName}</strong>
              <span class="text-[10px] text-yellow-500 font-mono font-bold block">Rp ${post.price.toLocaleString('id-ID')}</span>
            </div>
          </div>
          <span class="text-[9px] bg-yellow-950 text-yellow-400 font-extrabold px-1.5 py-0.5 rounded border border-yellow-800 uppercase">GERAI AFFILIATE</span>
        </div>

        <!-- Call to action redirects -->
        <div class="flex gap-2">
          <button onclick="triggerTikTokCartPurchase('${post.productName}', '${post.redirectUrl}', ${post.price}, '${post.author}')" class="flex-1 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-extrabold py-2 rounded-xl text-[10px] uppercase tracking-wider flex items-center justify-center gap-1 transition">
            <i data-lucide="shopping-cart" class="w-3.5 h-3.5"></i> Beli Di Keranjang Kuning
          </button>
          <button onclick="shareTikTokVideo('${post.author}', '${post.redirectUrl}')" class="bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-cyber-border p-2 rounded-xl transition">
            <i data-lucide="share-2" class="w-3.5 h-3.5"></i>
          </button>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
  
  lucide.createIcons();
}

function renderMembershipAffiliate() {
  const db = appState.db;
  if (!db) return;

  const earnings = db.affiliateData.earnings || 0;
  const clicks = db.affiliateData.clicks || 0;
  const signups = db.affiliateData.signups || 0;

  document.getElementById('aff-unpaid-earnings').innerText = `Rp ${earnings.toLocaleString('id-ID')}`;
  document.getElementById('dev-referral-khl').innerText = `Rp ${(db.khl?.totalKhl || 9600000).toLocaleString('id-ID')} / bln`;

  const tbody = document.getElementById('affiliate-tbody');
  if (tbody && db.affiliateData.history) {
    tbody.innerHTML = '';
    
    db.affiliateData.history.forEach(item => {
      const row = document.createElement('tr');
      row.className = "hover:bg-slate-900/30 transition duration-150";
      
      let statusClass = "text-yellow-400 bg-yellow-950/40 border border-yellow-800";
      if (item.status === 'Approved') {
        statusClass = "text-emerald-400 bg-emerald-950/40 border border-emerald-800";
      }

      row.innerHTML = `
        <td class="p-3 text-slate-400 font-mono">${item.date}</td>
        <td class="p-3 text-slate-200 font-semibold">${item.source}</td>
        <td class="p-3 text-right font-bold text-slate-200 font-mono">Rp ${item.amount.toLocaleString('id-ID')}</td>
        <td class="p-3 text-center">
          <span class="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide ${statusClass}">
            ${item.status}
          </span>
        </td>
      `;
      tbody.appendChild(row);
    });
  }
}
