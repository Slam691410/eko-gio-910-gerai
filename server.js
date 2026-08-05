require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet'); // security headers
const { initCluster } = require('./backend/config/cluster');
const { logEvent } = require('./backend/config/db');
const apiRateLimiter = require('./backend/middleware/rateLimiter');
const apiRouter = require('./backend/routes/api');

function bootWorkerApp() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  // SECURITY HEADERS - helmet defaults
  app.use(helmet());

  // Content Security Policy
  // Catatan: index.html masih memakai inline <script> (tailwind.config) dan
  // 136 atribut handler inline (onclick=...), sehingga script-src harus
  // mengizinkan 'unsafe-inline'. TODO: pindahkan handler ke file JS eksternal
  // lalu hapus 'unsafe-inline' untuk memperketat CSP.
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.tailwindcss.com", "https://cdn.jsdelivr.net", "https://unpkg.com"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.tailwindcss.com"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'", 'https:', 'wss:'],
        fontSrc: ["'self'", 'https:'],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: []
      }
    })
  );

  // CORS: hanya diaktifkan jika CORS_ORIGIN disetel di env.
  // Default TIDAK mengirim header CORS (same-origin saja) — lebih aman.
  const allowedOrigin = process.env.CORS_ORIGIN || null;
  if (allowedOrigin) {
    app.use(cors({ origin: allowedOrigin }));
  }

  app.use(express.json());

  // GLOBAL ERROR TRACKING FOR UNCAUGHT WORKER EXCEPTIONS
  process.on('uncaughtException', (err) => {
    logEvent('CRITICAL', `Uncaught Exception on Worker: ${err.message}`, err.stack);
    process.exit(1);
  });

  process.on('unhandledRejection', (reason, promise) => {
    logEvent('ERROR', `Unhandled Promise Rejection at: ${promise}, reason: ${reason}`);
  });

  // ADVANCED HTTP STATIC ASSETS CACHING & ETAG MANAGEMENT
  const STATIC_CACHE_AGE_MS = 24 * 60 * 60 * 1000;
  app.use(express.static(path.join(__dirname, 'public'), {
    maxAge: STATIC_CACHE_AGE_MS,
    etag: true,
    lastModified: true,
    setHeaders: (res, filePath, stat) => {
      res.setHeader('Cache-Control', 'public, max-age=86400');
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    }
  }));

  // Health endpoint
  app.get('/api/health', async (req, res) => {
    try {
      const uptime = process.uptime();
      res.json({ status: 'ok', uptimeSeconds: Math.floor(uptime), env: process.env.NODE_ENV || 'development' });
    } catch (err) {
      res.status(500).json({ status: 'error', error: err.message });
    }
  });

  // Serve Solidity Contracts statically
  app.use('/contracts', express.static(path.join(__dirname, 'contracts')));

  // Apply Security Rate Limiter and Mount Organized Router Modules
  app.use('/api/', apiRateLimiter);
  app.use('/api/', apiRouter);

  // Global error middleware: pastikan request yang gagal selalu dapat respons
  // (sebelumnya async handler yang error bisa menggantung tanpa balasan).
  app.use((err, req, res, next) => {
    logEvent('ERROR', `Unhandled error on ${req.method} ${req.path}: ${err.message}`, err.stack);
    if (res.headersSent) return next(err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  });

  const server = app.listen(PORT, '0.0.0.0', () => {
    logEvent('INFO', `[Worker Process] Active on PID: ${process.pid}. Server is running at http://0.0.0.0:${PORT}`);
  });

  // Graceful shutdown
  const SHUTDOWN_TIMEOUT = parseInt(process.env.SHUTDOWN_TIMEOUT_MS || '10000', 10);
  process.on('SIGTERM', () => {
    logEvent('INFO', 'SIGTERM received, shutting down gracefully');
    server.close(() => {
      logEvent('INFO', 'HTTP server closed, exiting');
      process.exit(0);
    });
    setTimeout(() => {
      logEvent('CRITICAL', 'Forcing shutdown after timeout');
      process.exit(1);
    }, SHUTDOWN_TIMEOUT);
  });
}

// Start Enterprise Horizontal Clustering Node Engine
initCluster(bootWorkerApp);
