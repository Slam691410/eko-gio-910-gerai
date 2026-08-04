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
  const container = document.getElementById('goals-dynamic-container');
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
        <span class="text-[9px] text-slate-500 font-bold uppercase block">Masa tunggu: ${h.waitingTimeYears} Tahun (Tahun ${w = currentYear + h.waitingTimeYears})</span>
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
      </div>
    `;
    container.appendChild(card);
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
