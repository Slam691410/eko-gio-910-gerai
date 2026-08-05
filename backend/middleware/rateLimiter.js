const { logEvent } = require('../config/db');

const rateLimitMap = new Map(); 
const RATE_LIMIT_WINDOW_MS = 10000; 
const RATE_LIMIT_MAX_REQUESTS = 15;
const RATE_LIMIT_MAP_MAX = 10000; // batas atas entri sebelum pruning

function apiRateLimiter(req, res, next) {
  const ip = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';
  const now = Date.now();

  // Prune entri yang sudah kadaluarsa jika map membesar (cegah memory leak)
  if (rateLimitMap.size > RATE_LIMIT_MAP_MAX) {
    for (const [key, value] of rateLimitMap) {
      if (now - value.windowStart > RATE_LIMIT_WINDOW_MS) {
        rateLimitMap.delete(key);
      }
    }
  }

  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, { count: 1, windowStart: now });
    return next();
  }

  const clientData = rateLimitMap.get(ip);
  if (now - clientData.windowStart > RATE_LIMIT_WINDOW_MS) {
    clientData.count = 1;
    clientData.windowStart = now;
    return next();
  }

  clientData.count++;
  if (clientData.count > RATE_LIMIT_MAX_REQUESTS) {
    logEvent('WARN', `Rate Limit Exceeded for IP: ${ip} on path: ${req.path}`);
    return res.status(429).json({
      error: 'Too Many Requests',
      message: 'Deteksi Aktivitas Tidak Wajar: Server Komputasi Awan (Cloud Compute) memblokir sementara IP Anda karena melebihi kuota pemanggilan aman (Maksimum 15 pemanggilan per 10 detik). Silakan tunggu beberapa detik.'
    });
  }

  next();
}

module.exports = apiRateLimiter;
