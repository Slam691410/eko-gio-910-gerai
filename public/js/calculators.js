// -------------------------------------------------------------
// DYNAMIC FLEXIBLE BUDGET SLIDERS & FINANCIAL CALCULATORS

function balanceBudgetSliders(changedId) {
  const needsSlider = document.getElementById('budget-slider-needs');
  const wantsSlider = document.getElementById('budget-slider-wants');
  const savingsSlider = document.getElementById('budget-slider-savings');
  
  let needs = parseInt(needsSlider.value, 10);
  let wants = parseInt(wantsSlider.value, 10);
  let savings = parseInt(savingsSlider.value, 10);

  const total = needs + wants + savings;

  if (total !== 100) {
    const diff = 100 - total;
    if (changedId === 'needs') {
      // Distribute difference to wants & savings
      wants += Math.round(diff * 0.5);
      savings = 100 - needs - wants;
    } else if (changedId === 'wants') {
      needs += Math.round(diff * 0.5);
      savings = 100 - needs - wants;
    } else {
      needs += Math.round(diff * 0.5);
      wants = 100 - needs - savings;
    }

    // Clamp values
    needs = Math.max(0, Math.min(100, needs));
    wants = Math.max(0, Math.min(100, wants));
    savings = 100 - needs - wants;

    // Set slider values back
    needsSlider.value = needs;
    wantsSlider.value = wants;
    savingsSlider.value = savings;
  }

  // Update labels
  document.getElementById('budget-val-needs').innerText = `${needs}%`;
  document.getElementById('budget-val-wants').innerText = `${wants}%`;
  document.getElementById('budget-val-savings').innerText = `${savings}%`;

  // Calculate actual rupiah values based on total income
  const totalIncome = Object.values(appState.db.income).reduce((a, b) => a + b, 0);
  document.getElementById('budget-rp-needs').innerText = `Rp ${(totalIncome * needs / 100).toLocaleString('id-ID')}`;
  document.getElementById('budget-rp-wants').innerText = `Rp ${(totalIncome * wants / 100).toLocaleString('id-ID')}`;
  document.getElementById('budget-rp-savings').innerText = `Rp ${(totalIncome * savings / 100).toLocaleString('id-ID')}`;

  // Trigger AI advice based on income brackets
  generateContextualBudgetAdvice(totalIncome, needs, wants, savings);
}

function generateContextualBudgetAdvice(income, needs, wants, savings) {
  const el = document.getElementById('budget-ai-advice-box');
  if (!el) return;

  let advice = "";
  if (income > 100000000) { // Miliaran vs Pas-Pasan
    advice = `💡 **Rekomendasi AI (Kelompok Pendapatan Tinggi):** Mengingat pendapatan Anda yang luar biasa (Rp ${income.toLocaleString('id-ID')}), alokasi Keinginan (${wants}%) dan Kebutuhan (${needs}%) Anda dapat ditekan lebih lanjut. Kami menyarankan meningkatkan alokasi **Tabungan/Investasi hingga >50%** guna mempercepat ekspansi Smart Treasury emas Anda di blockchain.`;
  } else if (income < 10000000) {
    advice = `⚠️ **Rekomendasi AI (Kelompok Pendapatan Ketat):** Dengan total pendapatan Rp ${income.toLocaleString('id-ID')}, alokasi kebutuhan pokok (${needs}%) sangat menyita anggaran Anda. Prioritaskan alokasi Tabungan (${savings}%) khusus untuk **Dana Darurat** terlebih dahulu sebelum membeli instrumen berisiko.`;
  } else {
    advice = `✅ **Rekomendasi AI (Kelompok Pendapatan Menengah):** Alokasi anggaran Anda yang seimbang (${needs}/${wants}/${savings}) menunjukkan ketahanan kas yang prima. Pertahankan konsistensi investasi bulanan ke emas fisik.`;
  }
  
  el.innerHTML = advice;
}

// -------------------------------------------------------------
// KHL & DYNAMIC AUTO-FEED GOALS CALCULATOR
function calculateKHL() {
  if (!appState.db) return;

  const dependents = appState.db.profile.dependents || [];
  const marriageStatus = appState.db.profile.maritalStatus;

  // Formula KHL: Jumlah Orang * KHL per Orang (KHL per person is Rp 3.200.000)
  let totalPeople = 1; // Mandiri
  if (marriageStatus !== 'Belum Menikah') {
    totalPeople += 1; // Spouse
  }
  totalPeople += dependents.length; // Kids/Dependents

  const baseKhlPerPerson = 3200000;
  const estimatedKhlFamily = totalPeople * baseKhlPerPerson;

  document.getElementById('khl-count-people').innerText = `${totalPeople} Orang`;
  document.getElementById('khl-total-rupiah').innerText = `Rp ${estimatedKhlFamily.toLocaleString('id-ID')}`;

  // Dynamically configure Emergency Fund target: 6 months for single, 12 months for married
  const requiredMonths = marriageStatus === 'Belum Menikah' ? 6 : 12;
  const efTarget = estimatedKhlFamily * requiredMonths;
  
  appState.db.emergencyFund.targetMonths = requiredMonths;
  appState.db.emergencyFund.target = efTarget;

  document.getElementById('ef-target-months').innerText = `${requiredMonths} Bulan KHL`;
  document.getElementById('ef-target-rupiah').innerText = `Rp ${efTarget.toLocaleString('id-ID')}`;

  // Automatically render dynamically compiled cards (SD, SMP, SMA, Kuliah, Wedding, Haji) with 8% p.a. FV inflation
  renderDynamicSaaSTargets(estimatedKhlFamily);
}

function renderDynamicSaaSTargets(estimatedKhl) {
  const container = document.getElementById('goals-cards-container');
  if (!container) return;

  container.innerHTML = '';
  const db = appState.db;
  const t = Date.now();

  const currentYear = 2026;
  const schoolInflationRate = 0.08; // 8% p.a.

  // Build educational milestones for dependents
  db.profile.dependents.forEach(dep => {
    let schoolingMilestones = [];
    if (dep.age < 7) {
      schoolingMilestones.push({ school: 'SD (Target Usia 7)', cost: 18000000, targetYear: currentYear + (7 - dep.age) });
    }
    if (dep.age < 13) {
      schoolingMilestones.push({ school: 'SMP (Target Usia 13)', cost: 25000000, targetYear: currentYear + (13 - dep.age) });
    }
    if (dep.age < 16) {
      schoolingMilestones.push({ school: 'SMA (Target Usia 16)', cost: 35000000, targetYear: currentYear + (16 - dep.age) });
    }
    if (dep.age < 18) {
      schoolingMilestones.push({ school: 'Kuliah (Target Usia 18)', cost: 120000000, targetYear: currentYear + (18 - dep.age) });
    }

    schoolingMilestones.forEach(m => {
      const yearsWait = m.targetYear - currentYear;
      // Formula FV: Cost * (1 + inflation)^years
      const inflatedCost = Math.round(m.cost * Math.pow(1 + schoolInflationRate, yearsWait));
      
      const card = document.createElement('div');
      card.className = "bg-cyber-card border border-cyber-border rounded-xl p-4 space-y-3 relative";
      card.innerHTML = `
        <span class="absolute top-2 right-2 bg-blue-950 text-blue-400 border border-blue-800 text-[8px] font-extrabold px-2 py-0.5 rounded-full uppercase">PENDIDIKAN</span>
        <div class="space-y-1">
          <h4 class="font-bold text-sm text-slate-200">${m.school} - ${dep.name}</h4>
          <span class="text-[9px] text-slate-500 font-bold uppercase block">Target Tahun: ${m.targetYear} (${yearsWait} tahun lagi)</span>
        </div>
        <div class="pt-2 border-t border-cyber-border/40">
          <div class="flex justify-between text-xs">
            <span class="text-slate-400">Estimasi Biaya Saat Ini:</span>
            <span class="font-mono text-slate-400">Rp ${m.cost.toLocaleString('id-ID')}</span>
          </div>
          <div class="flex justify-between text-xs mt-1">
            <span class="text-slate-200 font-bold">FV Terinflasi (8% p.a.):</span>
            <strong class="font-mono text-brand-500 font-black">Rp ${inflatedCost.toLocaleString('id-ID')}</strong>
          </div>
          <button onclick="topUpSystemGoal('edu-${dep.id}-${m.school.split(' ')[0].toLowerCase()}', ${m.cost})" class="w-full bg-slate-900 hover:bg-slate-800 border border-cyber-border/60 text-slate-300 font-bold py-1.5 rounded-xl text-[10px] uppercase mt-3 transition">Tabung Alokasi</button>
        </div>
      `;
      container.appendChild(card);
    });
  });

  // Append Wedding and Haji targets if configured
  if (db.profile.weddingPlan?.hasPlan) {
    const w = db.profile.weddingPlan;
    const yearsWait = w.targetYear - currentYear;
    const inflatedCost = Math.round(w.estimatedCost * Math.pow(1 + 0.05, yearsWait)); // 5% inflation for lifestyle/wedding

    const card = document.createElement('div');
    card.className = "bg-cyber-card border border-cyber-border rounded-xl p-4 space-y-3 relative";
    card.innerHTML = `
      <span class="absolute top-2 right-2 bg-rose-950 text-rose-400 border border-rose-800 text-[8px] font-extrabold px-2 py-0.5 rounded-full uppercase">Pernikahan</span>
      <div class="space-y-1">
        <h4 class="font-bold text-sm text-slate-200">Rencana Resepsi Pernikahan</h4>
        <span class="text-[9px] text-slate-500 font-bold uppercase block">Target Tahun: ${w.targetYear} (${yearsWait} tahun lagi)</span>
      </div>
      <div class="pt-2 border-t border-cyber-border/40">
        <div class="flex justify-between text-xs">
          <span class="text-slate-400">Biaya Standar Saat Ini:</span>
          <span class="font-mono text-slate-400">Rp ${w.estimatedCost.toLocaleString('id-ID')}</span>
        </div>
        <div class="flex justify-between text-xs mt-1">
          <span class="text-slate-200 font-bold">FV Terinflasi (5% p.a.):</span>
          <strong class="font-mono text-rose-400 font-black">Rp ${inflatedCost.toLocaleString('id-ID')}</strong>
        </div>
        <button onclick="topUpSystemGoal('wedding', ${w.estimatedCost})" class="w-full bg-slate-900 hover:bg-slate-800 border border-cyber-border/60 text-slate-300 font-bold py-1.5 rounded-xl text-[10px] uppercase mt-3 transition">Tabung Alokasi</button>
      </div>
    `;
    container.appendChild(card);
  }

  if (db.profile.hajiPlan?.hasPlan) {
    const h = db.profile.hajiPlan;
    const yearsWait = h.targetYear - currentYear;
    const inflatedCost = Math.round(h.estimatedCost * Math.pow(1 + 0.04, yearsWait));

    const card = document.createElement('div');
    card.className = "bg-cyber-card border border-cyber-border rounded-xl p-4 space-y-3 relative";
    card.innerHTML = `
      <span class="absolute top-2 right-2 bg-emerald-950 text-emerald-400 border border-emerald-800 text-[8px] font-extrabold px-2 py-0.5 rounded-full uppercase">Haji</span>
      <div class="space-y-1">
        <h4 class="font-bold text-sm text-slate-200">Keberangkatan Haji Reguler</h4>
        <span class="text-[9px] text-slate-500 font-bold uppercase block">Masa tunggu: ${h.waitingTimeYears} Tahun (Tahun ${currentYear + h.waitingTimeYears})</span>
      </div>
      <div class="pt-2 border-t border-cyber-border/40">
        <div class="flex justify-between text-xs">
          <span class="text-slate-400">Biaya Kemenag Saat Ini:</span>
          <span class="font-mono text-slate-400">Rp ${h.estimatedCost.toLocaleString('id-ID')}</span>
        </div>
        <div class="flex justify-between text-xs mt-1">
          <span class="text-slate-200 font-bold">FV Terinflasi (4% p.a.):</span>
          <strong class="font-mono text-emerald-400 font-black">Rp ${inflatedCost.toLocaleString('id-ID')}</strong>
        </div>
        <button onclick="topUpSystemGoal('haji', ${h.estimatedCost})" class="w-full bg-slate-900 hover:bg-slate-800 border border-cyber-border/60 text-slate-300 font-bold py-1.5 rounded-xl text-[10px] uppercase mt-3 transition">Tabung Alokasi</button>
      </div>
    `;
    container.appendChild(card);
  }

  // 3. Render Custom added Goals from database.json
  if (db.goals && db.goals.length > 0) {
    db.goals.forEach(goal => {
      const card = document.createElement('div');
      card.className = "bg-cyber-card border border-cyber-border rounded-xl p-4 space-y-3 relative";
      
      const pct = Math.min(100, (goal.saved / goal.target) * 100);
      
      card.innerHTML = `
        <span class="absolute top-2 right-2 bg-purple-950 text-purple-400 border border-purple-800 text-[8px] font-extrabold px-2 py-0.5 rounded-full uppercase">CUSTOM</span>
        <div class="space-y-1">
          <h4 class="font-bold text-sm text-slate-200">${goal.name}</h4>
          <span class="text-[9px] text-slate-500 font-bold uppercase block">Target Tahun: ${goal.targetYear}</span>
        </div>
        <div class="pt-2 border-t border-cyber-border/40 space-y-2">
          <div class="flex justify-between text-xs">
            <span class="text-slate-400">Target Nominal:</span>
            <span class="font-mono text-slate-300">Rp ${goal.target.toLocaleString('id-ID')}</span>
          </div>
          <div class="flex justify-between text-xs">
            <span class="text-slate-400">Telah Terkumpul:</span>
            <strong class="font-mono text-brand-400">Rp ${goal.saved.toLocaleString('id-ID')} (${pct.toFixed(1)}%)</strong>
          </div>
          <div class="w-full bg-slate-900 rounded-full h-1">
            <div class="bg-brand-500 h-1 rounded-full" style="width: ${pct}%"></div>
          </div>
          <div class="flex gap-2 pt-1">
            <button onclick="topUpGoal(${goal.id})" class="flex-1 bg-brand-600/20 hover:bg-brand-600/30 text-brand-400 border border-brand-600/30 font-bold py-1.5 rounded-xl text-[10px] uppercase transition">Tabung</button>
            <button onclick="deleteGoal(${goal.id})" class="bg-slate-900 hover:bg-red-900/20 text-slate-500 hover:text-red-400 border border-cyber-border hover:border-red-800/40 py-1.5 px-3 rounded-xl text-[10px] uppercase transition">Hapus</button>
          </div>
        </div>
      `;
      container.appendChild(card);
    });
  }
}

// Helper to delete goals
async function deleteGoal(id) {
  const idx = appState.db?.goals.findIndex(g => g.id === id);
  if (idx !== -1) {
    appState.db.goals.splice(idx, 1);
    await saveDatabase();
    calculateKHL(); // Reload list
    alert('✓ Target sasaran berhasil dihapus.');
  }
}

// -------------------------------------------------------------
// FARAID / SHARIAH INHERITANCE MATH ENGINE (KHI INDONESIA)
function calculateInheritance() {
  if (!appState.db) return;

  const estateValue = parseFloat(document.getElementById('war-estate').value) || 0;
  const hasWife = document.getElementById('war-has-wife').checked;
  const wifeCount = parseInt(document.getElementById('war-wife-count').value, 10) || 1;
  const hasHusband = document.getElementById('war-has-husband').checked;
  const hasFather = document.getElementById('war-has-father').checked;
  const hasMother = document.getElementById('war-has-mother').checked;
  const sons = parseInt(document.getElementById('war-sons').value, 10) || 0;
  const daughters = parseInt(document.getElementById('war-daughters').value, 10) || 0;

  const hasChildren = (sons > 0 || daughters > 0);
  
  let shares = {};
  let remainder = estateValue;

  // 1. Wife share (Pasal 180 KHI): 1/8 if there are children, 1/4 if none
  if (hasWife && !hasHusband) {
    const fraction = hasChildren ? (1/8) : (1/4);
    const amount = estateValue * fraction;
    shares["Istri (bersama)"] = { porsi: hasChildren ? "1/8" : "1/4", rupiah: amount };
    remainder -= amount;
  }

  // 2. Husband share (Pasal 179 KHI): 1/4 if there are children, 1/2 if none
  if (hasHusband && !hasWife) {
    const fraction = hasChildren ? (1/4) : (1/2);
    const amount = estateValue * fraction;
    shares["Suami"] = { porsi: hasChildren ? "1/4" : "1/2", rupiah: amount };
    remainder -= amount;
  }

  // 3. Father share (Pasal 177 KHI): 1/6 if there are children, 1/3 if none (or ashabah)
  if (hasFather) {
    const fraction = hasChildren ? (1/6) : (1/3);
    const amount = estateValue * fraction;
    shares["Ayah Kandung"] = { porsi: hasChildren ? "1/6" : "1/3", rupiah: amount };
    remainder -= amount;
  }

  // 4. Mother share (Pasal 178 KHI): 1/6 if there are children, 1/3 if none
  if (hasMother) {
    const fraction = hasChildren ? (1/6) : (1/3);
    const amount = estateValue * fraction;
    shares["Ibu Kandung"] = { porsi: hasChildren ? "1/6" : "1/3", rupiah: amount };
    remainder -= amount;
  }

  // 5. Children share (Pasal 176 KHI): Ashabah (remainder). Son gets 2x daughter.
  if (hasChildren && remainder > 0) {
    const totalSharesKids = (sons * 2) + daughters;
    if (totalSharesKids > 0) {
      const sharePerPart = remainder / totalSharesKids;
      
      if (sons > 0) {
        shares["Anak Laki-Laki (per orang)"] = { 
          porsi: `2/n Ashabah (Rasio 2:1)`, 
          rupiah: sharePerPart * 2 
        };
      }
      if (daughters > 0) {
        shares["Anak Perempuan (per orang)"] = { 
          porsi: `1/n Ashabah (Rasio 2:1)`, 
          rupiah: sharePerPart 
        };
      }
    }
  }

  // Render table rows
  const tbody = document.getElementById('waris-tbody');
  if (tbody) {
    tbody.innerHTML = '';
    
    if (Object.keys(shares).length === 0) {
      tbody.innerHTML = `<tr><td colspan="3" class="p-4 text-center text-slate-500 italic">Pilih ahli waris untuk melihat pembagian.</td></tr>`;
      return;
    }

    Object.entries(shares).forEach(([role, data]) => {
      const row = document.createElement('tr');
      row.className = "hover:bg-slate-900/30 transition duration-150";
      row.innerHTML = `
        <td class="p-3 font-semibold text-slate-200">${role}</td>
        <td class="p-3 text-slate-400 font-mono">${data.porsi}</td>
        <td class="p-3 text-right font-bold font-mono text-brand-500">Rp ${data.rupiah.toLocaleString('id-ID', {maximumFractionDigits: 0})}</td>
      `;
      tbody.appendChild(row);
    });
  }
}

// -------------------------------------------------------------
// DYNAMIC INTERACTIVE TOP-DOWN STOCK SCREENING & AUDIT ENGINE

const screenerDatabase = {
  Boom: {
    sector: "Sektor Perbankan, Finansial & Teknologi",
    desc: "Pada fase Boom/Ekspansi, konsumsi domestik bertumbuh kuat, kredit meningkat, dan perbankan mendapatkan marjin bunga bersih (NIM) yang sangat lebar di tengah iklim investasi yang bergairah.",
    icon: "landmark",
    stocks: [
      { code: "BBRI", pe: "11.2", pbv: "1.9", der: "0.8", roe: "16.5%", yield: "6.2%", name: "Bank Rakyat Indonesia" },
      { code: "BBCA", pe: "24.5", pbv: "4.8", der: "0.1", roe: "20.2%", yield: "3.5%", name: "Bank Central Asia" },
      { code: "BMRI", pe: "10.4", pbv: "2.1", der: "0.7", roe: "18.5%", yield: "5.8%", name: "Bank Mandiri" },
      { code: "TLKM", pe: "13.8", pbv: "2.5", der: "0.4", roe: "17.2%", yield: "5.1%", name: "Telkom Indonesia" }
    ],
    audits: {
      BBRI: {
        accounting: "Lancar. Cash Flow Operation (CFO) positif konsisten di atas tingkat laba bersih terlapor (EBITDA), menandakan tidak ada manipulasi piutang. Debt Service Coverage Ratio (DSCR) di atas 2.5x.",
        management: "Sangat Prima. Dikendalikan oleh Pemerintah RI dengan pengawasan regulasi OJK yang ketat. Komisaris independen menguasai >30% kursi pengambil keputusan.",
        actions: "Penyebaran dividen tunai stabil dengan payout ratio >75%. Risiko dilusi saham melalui rights issue ditiadakan untuk 3 tahun ke depan."
      },
      BBCA: {
        accounting: "Sangat Bersih. Tingkat Loan-to-Deposit Ratio (LDR) terjaga aman di 68%, rasio kredit bermasalah (NPL) gross di bawah 1.5% (terendah di industri perbankan).",
        management: "Luar Biasa. Dikendalikan oleh Grup Djarum dengan rekam jejak tata kelola tata modal (GCG) terbaik di Asia Tenggara selama 20 tahun berturut-turut.",
        actions: "Tidak ada rights issue atau rencana utang obligasi baru. Kenaikan modal organik murni dari akumulasi laba ditahan."
      },
      BMRI: {
        accounting: "Sehat. Marjin Bunga Bersih (NIM) stabil tinggi di 5.6%. Pencadangan provisi NPL mencukupi (coverage ratio >200%).",
        management: "Prima. Pengendali Pemerintah RI dengan integrasi digitalisasi korporat Bank Mandiri (Livin') yang sangat agresif.",
        actions: "Rencana stock-split selesai dengan sukses untuk meningkatkan likuiditas ritel di bursa."
      },
      TLKM: {
        accounting: "Lancar. Rasio EBITDA margin stabil tinggi di atas 50%, free cash flow stabil untuk mendukung belanja modal pembangunan infrastruktur fiber optik nasional.",
        management: "Sangat Prima. Manajemen dikepalai oleh profesional berpengalaman telekomunikasi global di bawah naungan BUMN RI.",
        actions: "Investasi pada infrastruktur pusat data (data center) berpotensi memicu spin-off anak usaha (Indibiz) di masa mendatang."
      }
    },
    tech: {
      BBRI: { trend: "BULLISH UPTREND", rsi: "42 (Neutral / Accumulation)", sr: "Support: Rp 4.600 / Resistance: Rp 5.200", action: "BUY ON WEAKNESS" },
      BBCA: { trend: "BULLISH UPTREND", rsi: "58 (Neutral / Fair Value)", sr: "Support: Rp 9.800 / Resistance: Rp 10.500", action: "HOLD / ACCUMULATE" },
      BMRI: { trend: "SIDEWAYS ACCUMULATION", rsi: "48 (Neutral / Accumulation)", sr: "Support: Rp 6.200 / Resistance: Rp 6.850", action: "BUY / ACCUMULATE" },
      TLKM: { trend: "BEARISH REVERSAL", rsi: "35 (Oversold / Buy Zone)", sr: "Support: Rp 3.050 / Resistance: Rp 3.450", action: "STRONG BUY" }
    }
  },
  Stagflasi: {
    sector: "Sektor Consumer Staples & Utilitas Publik",
    desc: "Dalam iklim Stagflasi di mana inflasi tinggi diiringi pelambatan ekonomi, masyarakat mengurangi belanja sekunder dan beralih ke barang kebutuhan pokok wajib. Emiten bahan pangan dan utilitas publik berkinerja paling tangguh.",
    icon: "shopping-bag",
    stocks: [
      { code: "ICBP", pe: "14.2", pbv: "2.8", der: "0.6", roe: "19.1%", yield: "3.2%", name: "Indofood CBP Sukses Makmur" },
      { code: "INDF", pe: "8.5", pbv: "1.1", der: "0.7", roe: "13.5%", yield: "4.8%", name: "Indofood Sukses Makmur" },
      { code: "UNVR", pe: "19.4", pbv: "12.2", der: "0.3", roe: "65.2%", yield: "6.8%", name: "Unilever Indonesia" },
      { code: "MYOR", pe: "15.2", pbv: "3.1", der: "0.4", roe: "21.0%", yield: "3.0%", name: "Mayora Indah" }
    ],
    audits: {
      ICBP: {
        accounting: "Stabil. Persediaan bahan baku ter-hedge dengan baik terhadap fluktuasi gandum global. Arus kas operasi setara dengan 1.2x laba bersih.",
        management: "Sangat Prima. Dikendalikan oleh Grup Salim dengan jaringan distribusi ritel raksasa (Indomaret) terintegrasi.",
        actions: "Rencana ekspansi pabrik ke Timur Tengah meningkatkan potensi ekspor non-rupiah."
      },
      INDF: {
        accounting: "Sangat Murah. PBV mendekati 1.1x dengan kepemilikan saham ICBP yang bernilai jauh di atas kapitalisasi pasar induknya.",
        management: "Sehat. Tata kelola solid dengan diversifikasi usaha mulai dari perkebunan hingga pengemasan tepung.",
        actions: "Pembagian dividen tunai konsisten tumbuh rata-rata 10% per tahun."
      },
      UNVR: {
        accounting: "Lancar. Modal kerja negatif yang efisien khas retail besar. ROE sangat fantastis di 65% karena efisiensi aset yang ekstrem.",
        management: "Luar Biasa. Manajemen multinasional Unilever NV dengan kepatuhan ESG global peringkat emas.",
        actions: "Restrukturisasi portofolio produk ke arah produk premium bermargin tebal selesai dilaksanakan."
      },
      MYOR: {
        accounting: "Bersih. Rasio piutang usaha terkontrol dengan perputaran persediaan (*inventory turnover*) di bawah 45 hari.",
        management: "Prima. Manajemen keluarga Mayora yang legendaris dengan pangsa pasar ekspor biskuit terbesar di Asia Pasifik.",
        actions: "Rencana penambahan lini mesin produksi baru untuk produk kopi instan siap bergulir."
      }
    },
    tech: {
      ICBP: { trend: "BULLISH UPTREND", rsi: "52 (Neutral)", sr: "Support: Rp 10.800 / Resistance: Rp 11.500", action: "BUY / HOLD" },
      INDF: { trend: "SIDEWAYS ACCUMULATION", rsi: "44 (Neutral)", sr: "Support: Rp 6.100 / Resistance: Rp 6.600", action: "BUY ON WEAKNESS" },
      UNVR: { trend: "BEARISH REVERSAL", rsi: "28 (Oversold / Buy Zone)", sr: "Support: Rp 2.400 / Resistance: Rp 2.850", action: "BUY / ACCUMULATE" },
      MYOR: { trend: "BULLISH UPTREND", rsi: "56 (Neutral)", sr: "Support: Rp 2.350 / Resistance: Rp 2.650", action: "HOLD" }
    }
  },
  Resesi: {
    sector: "Instrumen Defensif (SBN & Deposito Berjangka)",
    desc: "Saat terjadi Kontraksi/Resesi, pasar saham mengalami penurunan tajam. Melindungi modal rill dengan mengalihkan aset ke instrumen defensif berpendapatan tetap yang dijamin negara seperti SBN dan deposito berjangka adalah prioritas tertinggi.",
    icon: "shield",
    stocks: [
      { code: "SBN ORI025", pe: "N/A", pbv: "N/A", der: "Bebas Risiko", roe: "6.25%", yield: "6.25%", name: "Obligasi Ritel Indonesia 025" },
      { code: "SBN SR020", pe: "N/A", pbv: "N/A", der: "Bebas Risiko", roe: "6.30%", yield: "6.30%", name: "Sukuk Ritel 020" },
      { code: "BSI Deposito", pe: "N/A", pbv: "N/A", der: "Bebas Risiko", roe: "5.50%", yield: "5.50%", name: "Deposito Mudharabah Bank Syariah" },
      { code: "Kas Rupiah", pe: "N/A", pbv: "N/A", der: "Bebas Risiko", roe: "1.00%", yield: "1.00%", name: "Likuiditas Kas / Giro Bank BUMN" }
    ],
    audits: {
      "SBN ORI025": {
        accounting: "Sempurna. Kupon dijamin 100% oleh Undang-Undang APBN Republik Indonesia. Tidak ada risiko gagal bayar (*sovereign risk zero*).",
        management: "Mutlak. Di bawah kelola Direktorat Jenderal Pengelolaan Pembiayaan dan Risiko Kementerian Keuangan RI.",
        actions: "Dapat diperdagangkan (*tradable*) di pasar sekunder setelah masa hold minimum terpenuhi."
      },
      "SBN SR020": {
        accounting: "Sempurna. Struktur akad Wakalah syariah yang dijamin penuh APBN RI dan diawasi oleh DSN-MUI.",
        management: "Mutlak. Pengelolaan profesional Kementerian Keuangan RI untuk pembiayaan proyek ramah lingkungan.",
        actions: "Penerimaan kupon bulanan langsung ditransfer otomatis ke dompet kas holding."
      },
      "BSI Deposito": {
        accounting: "Sangat Aman. Dijamin oleh Lembaga Penjamin Simpanan (LPS) hingga Rp 2 Miliar per nasabah.",
        management: "Sangat Prima. Bank BUMN Syariah terbesar di Indonesia dengan kepatuhan audit syariah berlapis.",
        actions: "Opsi perpanjangan otomatis (*Automatic Roll Over*) dengan bagi hasil bulanan kompetitif."
      },
      "Kas Rupiah": {
        accounting: "Sempurna. Likuiditas instan untuk kebutuhan dana darurat tak terduga.",
        management: "Prima. Disimpan di bank kustodian BUMN berskala sistemik nasional.",
        actions: "Bebas dari fluktuasi nilai pasar modal, menjaga stabilitas net worth portofolio."
      }
    },
    tech: {
      "SBN ORI025": { trend: "STABLE INCOME", rsi: "N/A", sr: "Support: 100.0% / Resistance: 101.5%", action: "BUY & HOLD" },
      "SBN SR020": { trend: "STABLE INCOME", rsi: "N/A", sr: "Support: 100.0% / Resistance: 101.5%", action: "BUY & HOLD" },
      "BSI Deposito": { trend: "STABLE FIXED", rsi: "N/A", sr: "Support: Rp 2M / Resistance: Rp 2M", action: "ALLOCATE" },
      "Kas Rupiah": { trend: "STABLE CASH", rsi: "N/A", sr: "Support: Instan / Resistance: Instan", action: "LIQUID RESERVE" }
    }
  },
  Reflasi: {
    sector: "Sektor Pertambangan, Energi & Komoditas",
    desc: "Pada fase Reflasi/Pemulihan awal, roda industri kembali berputar, permintaan komoditas energi melesat tajam, memicu ledakan harga barang mentah dan keuntungan besar bagi emiten energi.",
    icon: "trending-up",
    stocks: [
      { code: "ADRO", pe: "3.8", pbv: "0.8", der: "0.2", roe: "25.1%", yield: "12.4%", name: "Adaro Energy Indonesia" },
      { code: "PTBA", pe: "4.2", pbv: "1.2", der: "0.3", roe: "28.5%", yield: "14.1%", name: "Bukit Asam" },
      { code: "ITMG", pe: "3.5", pbv: "1.0", der: "0.1", roe: "30.2%", yield: "16.5%", name: "Indo Tambangraya Megah" },
      { code: "PGAS", pe: "6.8", pbv: "0.9", der: "0.5", roe: "14.2%", yield: "8.5%", name: "Perusahaan Gas Negara" }
    ],
    audits: {
      ADRO: {
        accounting: "Sangat Murah. Valuasi P/E di bawah 4x dengan saldo kas bersih setara dengan 35% total asetnya. EBITDA tebal konsisten.",
        management: "Sangat Prima. Tata kelola kelas dunia dipimpin oleh Boy Thohir dengan komitmen diversifikasi energi hijau (Adaro Green).",
        actions: "Rencana spin-off bisnis batu bara thermal untuk fokus penuh pada pembangunan smelter aluminium hijau."
      },
      PTBA: {
        accounting: "Sehat. Struktur modal bebas utang bank jangka panjang. Rasio lancar (*current ratio*) di atas 200%.",
        management: "Prima. BUMN pertambangan bagian dari MIND ID dengan kepatuhan royalti negara yang patuh.",
        actions: "Pembagian dividen jumbo tahunan dengan payout ratio konsisten mendekati 100%."
      },
      ITMG: {
        accounting: "Sangat Likuid. Perusahaan tanpa utang bank sama sekali (*zero interest-bearing debt*). Marjin keuntungan bersih di atas 22%.",
        management: "Luar Biasa. Manajemen multinasional Banpu Group Thailand dengan standar audit GCG internasional.",
        actions: "Peningkatan porsi ekspor batubara kalori tinggi ke Jepang meningkatkan pendapatan valas."
      },
      PGAS: {
        accounting: "Lancar. Monopoli jaringan transmisi pipa gas nasional menjamin pendapatan berulang (*recurring cash flow*) yang solid.",
        management: "Prima. Anak usaha Pertamina (Persero) dengan sinergi infrastruktur hilir migas nasional.",
        actions: "Penyelesaian sengketa pajak masa lalu memulihkan marjin profitabilitas korporasi."
      }
    },
    tech: {
      ADRO: { trend: "BULLISH UPTREND", rsi: "48 (Neutral / Accumulation)", sr: "Support: Rp 2.500 / Resistance: Rp 2.850", action: "BUY / ACCUMULATE" },
      PTBA: { trend: "SIDEWAYS ACCUMULATION", rsi: "45 (Neutral)", sr: "Support: Rp 2.450 / Resistance: Rp 2.750", action: "BUY ON WEAKNESS" },
      ITMG: { trend: "BULLISH REVERSAL", rsi: "41 (Neutral)", sr: "Support: Rp 24.500 / Resistance: Rp 26.800", action: "BUY / ACCUMULATE" },
      PGAS: { trend: "BULLISH UPTREND", rsi: "55 (Neutral)", sr: "Support: Rp 1.150 / Resistance: Rp 1.350", action: "HOLD" }
    }
  }
};

function updateEconomicPhaseAll(phase) {
  appState.economicPhase = phase;
  
  // 1. Update Phase selector buttons visual
  document.querySelectorAll('.phase-btn').forEach(btn => {
    btn.className = "phase-btn bg-slate-900 border border-cyber-border text-slate-400 p-3 rounded-xl text-xs font-bold text-center flex flex-col items-center gap-1 hover:border-blue-500";
    if (btn.id === `phase-btn-${phase}`) {
      btn.className = "phase-btn bg-slate-900 border border-brand-500/80 text-brand-400 p-3 rounded-xl text-xs font-bold text-center flex flex-col items-center gap-1";
    }
  });

  // 2. Update Sector Spotlight
  const data = screenerDatabase[phase];
  if (data) {
    document.getElementById('spotlight-sector-title').innerText = data.sector;
    document.getElementById('spotlight-sector-desc').innerText = data.desc;
    
    const iconBox = document.getElementById('sector-icon-box');
    if (iconBox) {
      iconBox.innerHTML = `<i data-lucide="${data.icon}" class="w-8 h-8"></i>`;
    }
    
    // 3. Render dynamic stock screener table
    renderScreenerStocks(phase);
  }
}

function renderScreenerStocks(phase) {
  const tbody = document.getElementById('screener-fundamental-tbody');
  if (!tbody) return;

  tbody.innerHTML = '';
  const data = screenerDatabase[phase];
  if (!data) return;

  data.stocks.forEach(stock => {
    const row = document.createElement('tr');
    row.className = "hover:bg-slate-900/30 transition duration-150 cursor-pointer text-xs";
    row.onclick = () => focusScreenerStock(stock.code, phase);
    
    row.innerHTML = `
      <td class="p-3 pl-4">
        <div class="flex items-center gap-2">
          <div class="w-2.5 h-2.5 rounded-full bg-brand-500"></div>
          <div>
            <strong class="text-slate-100 font-mono">${stock.code}</strong>
            <span class="text-[10px] text-slate-500 block">${stock.name}</span>
          </div>
        </div>
      </td>
      <td class="p-3 font-mono text-slate-300">${stock.pe}</td>
      <td class="p-3 font-mono text-slate-300">${stock.pbv}</td>
      <td class="p-3 font-mono text-slate-300">${stock.der}</td>
      <td class="p-3 font-mono text-slate-300">${stock.roe}</td>
      <td class="p-3 font-mono text-brand-500 font-bold">${stock.yield}</td>
      <td class="p-3 pr-4 text-right" onclick="event.stopPropagation()">
        <button onclick="openScreenerAuditDetails('${stock.code}', '${phase}')" class="bg-brand-600/20 text-brand-400 border border-brand-600/30 hover:bg-brand-600/40 font-bold text-[9px] px-2.5 py-1 rounded-lg uppercase transition">Detail Audit</button>
      </td>
    `;
    tbody.appendChild(row);
  });

  // Focus on the first stock in the list by default
  if (data.stocks.length > 0) {
    focusScreenerStock(data.stocks[0].code, phase);
  }
  
  lucide.createIcons();
}

function focusScreenerStock(code, phase) {
  const p = phase || appState.economicPhase;
  const data = screenerDatabase[p];
  if (!data) return;

  const tech = data.tech[code];
  if (tech) {
    document.getElementById('tech-stock-code').innerText = code;
    document.getElementById('tech-trend-status').innerText = tech.trend;
    
    const trendEl = document.getElementById('tech-trend-status');
    if (tech.trend.includes('BEARISH')) {
      trendEl.className = "text-red-400 font-bold";
    } else if (tech.trend.includes('BULLISH')) {
      trendEl.className = "text-green-400 font-bold";
    } else {
      trendEl.className = "text-yellow-400 font-bold";
    }

    document.getElementById('tech-rsi-status').innerText = tech.rsi;
    document.getElementById('tech-support-resistance').innerText = tech.sr;
    document.getElementById('tech-action-signal').innerText = tech.action;
    
    const sigEl = document.getElementById('tech-action-signal');
    if (tech.action.includes('STRONG BUY') || tech.action.includes('BUY')) {
      sigEl.className = "px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-green-950 text-green-400 border border-green-800 text-center animate-pulse";
    } else if (tech.action.includes('HOLD')) {
      sigEl.className = "px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-blue-950 text-blue-400 border border-blue-800 text-center";
    } else {
      sigEl.className = "px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-slate-900 text-slate-400 border border-cyber-border text-center";
    }
  }
}

function openScreenerAuditDetails(code, phase) {
  const p = phase || appState.economicPhase;
  const data = screenerDatabase[p];
  if (!data) return;

  const audit = data.audits[code];
  if (audit) {
    document.getElementById('audit-stock-title').innerText = `Laporan Audit Emiten ${code}`;
    document.getElementById('audit-accounting-desc').innerText = audit.accounting;
    document.getElementById('audit-management-desc').innerText = audit.management;
    document.getElementById('audit-actions-desc').innerText = audit.actions;
    
    openModal('modal-audit-details');
  }
}

// -------------------------------------------------------------
// DYNAMIC HUMAN LIFE VALUE INSURANCE ADEQUACY CALCULATOR

function calculateInsuranceAdequacy() {
  if (!appState.db) return;

  const dependents = appState.db.profile.dependents || [];
  const marriageStatus = appState.db.profile.maritalStatus;

  // KHL calculation
  let totalPeople = 1;
  if (marriageStatus !== 'Belum Menikah') {
    totalPeople += 1;
  }
  totalPeople += dependents.length;

  const baseKhlPerPerson = 3200000;
  const estimatedKhlFamily = totalPeople * baseKhlPerPerson;
  const annualKHL = estimatedKhlFamily * 12;

  // Yield for Capital Utilization (defaults to 6%)
  const calcYieldInput = document.getElementById('ins-calc-yield');
  const calcYield = calcYieldInput ? parseFloat(calcYieldInput.value) || 6 : 6;

  // Required UP = Annual Expense / Yield
  const requiredUP = annualKHL / (calcYield / 100);

  // Sum active insurance cover Amount
  let activeUP = 0;
  const insList = appState.db.insurance || [];
  insList.forEach(ins => {
    activeUP += ins.coverAmount || 0;
  });

  // Update UI
  const requiredUP_el = document.getElementById('ins-calculated-up');
  const currentUP_el = document.getElementById('ins-current-up');
  const statusBadge_el = document.getElementById('ins-status-badge');

  if (requiredUP_el) requiredUP_el.innerText = `Rp ${requiredUP.toLocaleString('id-ID')}`;
  if (currentUP_el) currentUP_el.innerText = `Rp ${activeUP.toLocaleString('id-ID')}`;

  if (statusBadge_el) {
    if (activeUP >= requiredUP) {
      statusBadge_el.innerText = "UP JIWA SANGAT MEMADAI (SURPLUS)";
      statusBadge_el.className = "text-[10px] text-emerald-400 font-bold uppercase mt-1";
    } else {
      const deficit = requiredUP - activeUP;
      statusBadge_el.innerText = `BELUM MEMADAI (Defisit Rp ${deficit.toLocaleString('id-ID')})`;
      statusBadge_el.className = "text-[10px] text-rose-500 font-bold uppercase mt-1";
    }
  }

  // Render Active Policies Table
  const tbody = document.getElementById('insurance-tbody');
  if (tbody) {
    tbody.innerHTML = '';
    if (insList.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" class="p-4 text-center text-slate-500 italic">Belum ada asuransi aktif terdaftar. Klik tombol Tambah Polis.</td></tr>`;
      return;
    }

    insList.forEach(ins => {
      const row = document.createElement('tr');
      row.className = "hover:bg-slate-900/30 transition duration-150 text-xs";
      row.innerHTML = `
        <td class="p-3 text-slate-200 font-semibold">${ins.type}</td>
        <td class="p-3 text-slate-300 font-mono">${ins.provider}</td>
        <td class="p-3 text-slate-400 font-mono">Rp ${ins.premium.toLocaleString('id-ID')} / bln</td>
        <td class="p-3 text-emerald-400 font-bold">UP Rp ${ins.coverAmount.toLocaleString('id-ID')}</td>
        <td class="p-3 text-right">
          <button onclick="removeInsurance(${ins.id})" class="text-red-400 hover:text-red-300 font-bold text-[10px] uppercase">Hapus</button>
        </td>
      `;
      tbody.appendChild(row);
    });
  }
}

async function removeInsurance(id) {
  const idx = appState.db?.insurance.findIndex(i => i.id === id);
  if (idx !== -1) {
    appState.db.insurance.splice(idx, 1);
    await saveDatabase();
    calculateInsuranceAdequacy();
    alert('✓ Polis asuransi berhasil dihapus.');
  }
}

// -------------------------------------------------------------
// DYNAMIC COMPOUND INTEREST GOALS FORECASTER

function forecastCompounding() {
  const principalInput = document.getElementById('goal-compound-principal');
  const monthlyInput = document.getElementById('goal-compound-monthly');
  const rateInput = document.getElementById('goal-compound-rate');
  const yearsInput = document.getElementById('goal-compound-years');

  if (!principalInput || !monthlyInput || !rateInput || !yearsInput) return;

  const P = parseFloat(principalInput.value) || 0;
  const PMT = parseFloat(monthlyInput.value) || 0;
  const annualRate = parseFloat(rateInput.value) || 0;
  const t = parseFloat(yearsInput.value) || 0;

  const r = annualRate / 100 / 12; // monthly rate
  const n = t * 12; // total months

  let totalFutureValue = 0;
  let totalInvestedPrincipal = P + (PMT * n);

  if (r === 0) {
    totalFutureValue = P + (PMT * n);
  } else {
    // Compound initial principal: P * (1 + r)^n
    const fvPrincipal = P * Math.pow(1 + r, n);
    
    // Compound monthly additions
    const fvAdditions = PMT * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    
    totalFutureValue = fvPrincipal + fvAdditions;
  }

  const totalInterest = Math.max(0, totalFutureValue - totalInvestedPrincipal);

  document.getElementById('goal-forecast-result').innerText = `Rp ${Math.round(totalFutureValue).toLocaleString('id-ID')}`;
  document.getElementById('goal-forecast-principal-only').innerText = `Rp ${Math.round(totalInvestedPrincipal).toLocaleString('id-ID')}`;
  document.getElementById('goal-forecast-interest-only').innerText = `Rp ${Math.round(totalInterest).toLocaleString('id-ID')}`;
}

