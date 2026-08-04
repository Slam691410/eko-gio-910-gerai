require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { initCluster } = require('./backend/config/cluster');
const { logEvent } = require('./backend/config/db');
const apiRateLimiter = require('./backend/middleware/rateLimiter');
const apiRouter = require('./backend/routes/api');

function bootWorkerApp() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(cors());
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

  // Serve Solidity Contracts statically
  app.use('/contracts', express.static(path.join(__dirname, 'contracts')));

  // Apply Security Rate Limiter and Mount Organized Router Modules
  app.use('/api/', apiRateLimiter);
  app.use('/api/', apiRouter);

  app.listen(PORT, '0.0.0.0', () => {
    logEvent('INFO', `[Worker Process] Active on PID: ${process.pid}. Server is running at http://0.0.0.0:${PORT}`);
  });
}

// Start Enterprise Horizontal Clustering Node Engine
initCluster(bootWorkerApp);
