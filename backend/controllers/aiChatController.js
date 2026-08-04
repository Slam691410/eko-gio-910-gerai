const { readDB } = require('../config/db');

// NLP simulation of high-fidelity Shariah Wealth & Retail advice
function handleAIChat(req, res) {
  const { message } = req.body;
  const db = readDB();
  
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const prompt = message.toLowerCase();
  let reply = '';
  
  const goldGrams = db.assets?.gold?.grams || 0;
  const silverGrams = db.assets?.silver?.grams || 0;
  const goldVal = goldGrams * 2610000;
  const silverVal = silverGrams * 39450;
  
  let mfVal = 0;
  db.assets?.mutualFunds?.forEach(f => mfVal += f.balance);
  let sbnVal = 0;
  db.assets?.sbn?.forEach(s => sbnVal += s.balance);
  let depVal = 0;
  db.assets?.deposits?.forEach(d => depVal += d.balance);
  let propVal = 0;
  db.assets?.property?.forEach(p => propVal += p.balance);
  let stockVal = 0;
  db.assets?.stocks?.forEach(s => {
    const prices = { BBRI: 4750, TLKM: 3100, ASII: 4850 };
    const p = prices[s.code] || 1000;
    stockVal += s.shares * p;
  });

  const totalWealth = goldVal + silverVal + mfVal + sbnVal + depVal + propVal + stockVal;
  const mainIncome = db.income?.utama || 0;
  const businessIncome = db.income?.bisnis || 0;
  const passiveIncome = db.income?.passive || 0;
  const otherIncome = db.income?.lainnya || 0;
  const totalIncome = mainIncome + businessIncome + passiveIncome + otherIncome;

  const totalDebt = db.debts?.reduce((acc, curr) => acc + curr.remaining, 0) || 0;
  
  const familyMembers = 3; 
  const baseKhlPerPerson = 3200000; 
  const estimatedKhlFamily = familyMembers * baseKhlPerPerson;
  const emergencyFundCurrent = db.emergencyFund?.current || 0;

  // Intelligent Contextual Rules
  if (prompt.includes('halo') || prompt.includes('hi') || prompt.includes('pagi') || prompt.includes('siang')) {
    reply = `Assalamualaikum! Saya **GeraiAI Financial Advisor**, konsultan autopilot syariah dan kekayaan Anda. Ada yang bisa saya bantu menganalisis kekayaan atau rencana waris keluarga Anda hari ini?`;
  } else if (prompt.includes('waris') || prompt.includes('faraid') || prompt.includes('anak') || prompt.includes('keluarga')) {
    reply = `Berdasarkan data profil keluarga Anda di database rill, Anda memiliki status pernikahan **${db.profile?.maritalStatus || 'Belum Menikah'}** dengan **${db.profile?.dependents?.length || 0} anak**. Menurut hukum **Kompilasi Hukum Islam (KHI) Pasal 176 - 191**, jika pewaris wafat, anak laki-laki akan menerima bagian ashabah dengan rasio **2:1** dibandingkan anak perempuan. Kami sangat merekomendasikan menyambungkan dompet kripto Anda ke **Smart Treasury otonom** kami untuk mengunci warisan ini agar otomatis terdistribusi jika detak jantung pemilik (heartbeat) tidak terdeteksi dalam 365 hari, tanpa perlu melalui proses pengadilan sipil yang kaku dan lama.`;
  } else if (prompt.includes('pensiun') || prompt.includes('dana') || prompt.includes('compounding') || prompt.includes('swr')) {
    reply = `Target pengeluaran bulanan pensiun Anda adalah Rp 8.000.000 (disesuaikan dengan inflasi ~3.5% p.a.). Berdasarkan aturan **Safe Withdrawal Rate (SWR) 4%**, total dana pensiun yang harus Anda kumpulkan di instrumen berpendapatan tetap adalah sekitar **Rp 2,4 Miliar**. Saat ini total aset lancar Anda tercatat senilai **Rp ${totalWealth.toLocaleString('id-ID')}**. Saya menyarankan Anda terus melakukan alokasi otomatis PPN 12% dan menyisihkan pendapatan bisnis Anda sebesar 15% setiap bulan ke instrumen beraset keras seperti emas Antam fisik atau token emas PAXG di blockchain.`;
  } else if (prompt.includes('pajak') || prompt.includes('ppn') || prompt.includes('pemerintah')) {
    reply = `Sesuai UU Harmonisasi Peraturan Perpajakan (HPP) Indonesia, tarif PPN rill saat ini ditetapkan pada **12% per 2025/2026**. POS Kasir Gerai 910 Anda telah dikonfigurasi secara rill memotong PPN 12% dari setiap penjualan toko. Holding Singapura kami secara paralel melakukan komisi wrapping dan mendelegasikan pajak lokal tersebut langsung ke kas lokal Indonesia agar bisnis ritel Anda 100% aman dan patuh regulasi setempat.`;
  } else if (prompt.includes('aset') || prompt.includes('harta') || prompt.includes('emas')) {
    reply = `Analisis Portofolio Kekayaan Riil Anda:\n- **Total Aset Lancar**: Rp ${totalWealth.toLocaleString('id-ID')}\n- **Emas Antam**: ${goldGrams} Gram (avg Rp ${db.assets?.gold?.avgBuyPrice?.toLocaleString('id-ID') || 0}/gr)\n- **Utang/Liabilitas**: Rp ${totalDebt.toLocaleString('id-ID')}\n- **Rasio Utang**: ${totalWealth > 0 ? ((totalDebt / totalWealth) * 100).toFixed(1) : 0}% (Batas aman: <35%)\n\nAset Anda cukup terdiversifikasi, namun porsi emas fisik Anda perlu ditingkatkan guna menghadapi inflasi jangka panjang Indonesia.`;
  } else {
    reply = `Saya mengerti maksud Anda mengenai "${message}". Berdasarkan data portofolio riil Anda (Pendapatan Bulanan: Rp ${totalIncome.toLocaleString('id-ID')}, Aset: Rp ${totalWealth.toLocaleString('id-ID')}, KHL Keluarga: Rp ${estimatedKhlFamily.toLocaleString('id-ID')}), prioritas utama Anda adalah menjaga rasio likuiditas kas cadangan darurat (saat ini: Rp ${emergencyFundCurrent.toLocaleString('id-ID')}) serta mengunci sirkulasi waris menggunakan Smart Treasury di blockchain Polygon agar bebas dari risiko kepailitan. Apakah Anda ingin saya membuatkan skenario alokasi syariah otomatis?`;
  }

  res.json({ reply });
}

module.exports = {
  handleAIChat
};
