const { readDB, writeDB, logEvent } = require('../config/db');

// Blockchain Ledger Minting and Transaction Simulator (Polygon)
function mintToken(req, res) {
  const { token, value, address } = req.body;
  const db = readDB();
  
  if (!token || !value || !address) {
    return res.status(400).json({ error: 'Missing token, value or address' });
  }

  const latestBlock = db.blockchainLedger?.length > 0 
    ? db.blockchainLedger[0].block + Math.floor(Math.random() * 5) + 1 
    : 3284103;

  const characters ='abcdef0123456789';
  let txHash = '0x';
  for ( let i = 0; i < 64; i++ ) {
    txHash += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  const newTx = {
    block: latestBlock,
    hash: txHash,
    from: '0x0000000000000000000000000000000000000000',
    to: address,
    token: token,
    value: parseFloat(value).toFixed(4) + ' g',
    status: 'Confirmed',
    timestamp: new Date().toISOString()
  };

  if (!db.blockchainLedger) {
    db.blockchainLedger = [];
  }
  db.blockchainLedger.unshift(newTx); 

  if (token.includes('Gold') || token.includes('gGMR')) {
    if (!db.assets.gold) db.assets.gold = { grams: 0, avgBuyPrice: 0 };
    db.assets.gold.grams = parseFloat((parseFloat(db.assets.gold.grams) + parseFloat(value)).toFixed(4));
  } else if (token.includes('Silver') || token.includes('gSLV')) {
    if (!db.assets.silver) db.assets.silver = { grams: 0, avgBuyPrice: 0 };
    db.assets.silver.grams = parseFloat((parseFloat(db.assets.silver.grams) + parseFloat(value)).toFixed(4));
  }

  writeDB(db);
  logEvent('INFO', `Successfully minted ${value} of ${token} to address ${address}`);

  res.json({
    success: true,
    transaction: newTx,
    updatedAssets: db.assets
  });
}

module.exports = {
  mintToken
};
