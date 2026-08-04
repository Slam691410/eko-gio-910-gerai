// Simulator for real-time gold/silver spot prices and local macro indicators per August 2026
function getMarketData(req, res) {
  const t = Date.now();
  const goldBase = 2610000; 
  const silverBase = 39450; 
  const ihsgBase = 7248.5; 
  const usdidrBase = 16350; 
  const btcBase = 64250; 
  const ethBase = 3420; 
  const sbnBaseYield = 6.25; 

  const randGold = Math.sin(t / 10000) * 1500 + (Math.random() - 0.5) * 500;
  const randSilver = Math.sin(t / 12000) * 40 + (Math.random() - 0.5) * 15;
  const randIhsg = Math.cos(t / 15000) * 12 + (Math.random() - 0.5) * 4;
  const randUsdidr = Math.sin(t / 20000) * 15 + (Math.random() - 0.5) * 5;
  const randBtc = Math.cos(t / 8000) * 80 + (Math.random() - 0.5) * 30;
  const randEth = Math.sin(t / 9000) * 5 + (Math.random() - 0.5) * 2;

  res.json({
    timestamp: new Date().toISOString(),
    gold: Math.round(goldBase + randGold),
    goldBuyback: Math.round((goldBase * 0.911) + (randGold * 0.9)),
    silver: Math.round(silverBase + randSilver),
    silverBuyback: Math.round((silverBase * 0.88) + (randSilver * 0.85)),
    ihsg: parseFloat((ihsgBase + randIhsg).toFixed(2)),
    usdidr: Math.round(usdidrBase + randUsdidr),
    btc: parseFloat((btcBase + randBtc).toFixed(2)),
    eth: parseFloat((ethBase + randEth).toFixed(2)),
    sbnYield: parseFloat((sbnBaseYield + Math.sin(t / 30000) * 0.05).toFixed(3)),
    interestRateBI: 6.00, 
    inflationID: 2.42, 
    gdpGrowthID: 4.95, 
    fedRate: 3.50 
  });
}

module.exports = {
  getMarketData
};
