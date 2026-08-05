#!/usr/bin/env node
/**
 * GERAI 910 repository cross-checker.
 *
 * Purpose: make the integration state measurable instead of relying on claims.
 * It verifies tracked file inventory, README-advertised paths, frontend script
 * references, API route declarations, and suspicious snippet-sized modules.
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const MIN_EXPECTED_TRACKED_FILES = Number(process.env.MIN_EXPECTED_TRACKED_FILES || 100);
const SNIPPET_LINE_THRESHOLD = Number(process.env.SNIPPET_LINE_THRESHOLD || 40);

function rel(file) {
  return path.relative(ROOT, file).replace(/\\/g, '/');
}

function read(file) {
  return fs.readFileSync(path.join(ROOT, file), 'utf8');
}

function exists(file) {
  return fs.existsSync(path.join(ROOT, file));
}

function gitTrackedFiles() {
  try {
    return execSync('git ls-files', { cwd: ROOT, encoding: 'utf8' })
      .split(/\r?\n/)
      .filter(Boolean)
      .sort();
  } catch (err) {
    return [];
  }
}

function lineCount(file) {
  const text = read(file);
  if (!text) return 0;
  return text.split(/\r?\n/).length;
}

function fileSize(file) {
  return fs.statSync(path.join(ROOT, file)).size;
}

function pathIndex() {
  const index = new Map();
  for (const file of gitTrackedFiles()) {
    const base = path.basename(file);
    if (!index.has(base)) index.set(base, []);
    index.get(base).push(file);
  }
  return index;
}

function normalizeReadmeCandidate(candidate, index) {
  candidate = candidate.replace(/^\.\//, '');
  if (candidate === '.env' || candidate === 'server.log' || candidate === 'Chart.js') return null;
  if (candidate === 'localhost:3000/index.html') return 'public/index.html';
  if (candidate === 'localhost:3000/preview.html') return 'public/preview.html';
  if (exists(candidate)) return candidate;

  // README tree sections often mention only the basename while indentation gives
  // visual context. Resolve unique basenames to their tracked path to avoid
  // false missing-path alarms.
  if (!candidate.includes('/')) {
    const matches = index.get(candidate) || [];
    if (matches.length === 1) return matches[0];
  }
  return candidate;
}

function extractReadmePaths() {
  const md = read('README.md');
  const candidates = new Set();
  const index = pathIndex();
  const regex = /(?:^|[\s`(])([A-Za-z0-9_.\/-]+\.(?:js|json|html|sol|md|env|example))(?:[\s`),]|$)/gm;
  let match;
  while ((match = regex.exec(md))) {
    const normalized = normalizeReadmeCandidate(match[1], index);
    if (normalized) candidates.add(normalized);
  }
  return [...candidates].sort();
}

function extractFrontendScripts() {
  const htmlFiles = ['public/index.html', 'public/preview.html'].filter(exists);
  const refs = [];
  for (const htmlFile of htmlFiles) {
    const html = read(htmlFile);
    const regex = /<script[^>]+src=["']([^"']+)["']/g;
    let match;
    while ((match = regex.exec(html))) {
      const src = match[1];
      if (/^https?:\/\//.test(src)) continue;
      const normalized = path.posix.normalize(path.posix.join(path.posix.dirname(htmlFile), src)).replace(/^public\/public\//, 'public/');
      refs.push({ from: htmlFile, src, path: normalized });
    }
  }
  return refs;
}

function extractApiRoutes() {
  if (!exists('backend/routes/api.js')) return [];
  const api = read('backend/routes/api.js');
  const regex = /router\.(get|post|put|patch|delete)\(['"]([^'"]+)['"]/g;
  const routes = [];
  let match;
  while ((match = regex.exec(api))) {
    routes.push(`${match[1].toUpperCase()} /api${match[2]}`);
  }
  return routes.sort();
}

function analyze() {
  const tracked = gitTrackedFiles();
  const sourceFiles = tracked.filter((file) => /\.(js|html|sol|json|md|env|example)$/.test(file));
  const snippetSized = sourceFiles
    .map((file) => ({ file, lines: lineCount(file), bytes: fileSize(file) }))
    .filter((item) => item.lines > 0 && item.lines < SNIPPET_LINE_THRESHOLD)
    .sort((a, b) => a.lines - b.lines || a.file.localeCompare(b.file));

  const readmePaths = extractReadmePaths();
  const missingReadmePaths = readmePaths.filter((file) => !exists(file));

  const frontendScripts = extractFrontendScripts();
  const missingFrontendScripts = frontendScripts.filter((ref) => !exists(ref.path));

  const routes = extractApiRoutes();

  const warnings = [];
  if (tracked.length < MIN_EXPECTED_TRACKED_FILES) {
    warnings.push(`Tracked file count ${tracked.length} is below MIN_EXPECTED_TRACKED_FILES=${MIN_EXPECTED_TRACKED_FILES}.`);
  }
  if (snippetSized.length) {
    warnings.push(`${snippetSized.length} tracked source/config files are under ${SNIPPET_LINE_THRESHOLD} lines.`);
  }
  if (missingReadmePaths.length) {
    warnings.push(`${missingReadmePaths.length} README-referenced paths are missing.`);
  }
  if (missingFrontendScripts.length) {
    warnings.push(`${missingFrontendScripts.length} frontend script references are missing.`);
  }

  return {
    generatedAt: new Date().toISOString(),
    policy: {
      minExpectedTrackedFiles: MIN_EXPECTED_TRACKED_FILES,
      snippetLineThreshold: SNIPPET_LINE_THRESHOLD,
    },
    totals: {
      trackedFiles: tracked.length,
      sourceLikeFiles: sourceFiles.length,
      apiRoutes: routes.length,
      frontendScriptReferences: frontendScripts.length,
    },
    warnings,
    snippetSized,
    missingReadmePaths,
    missingFrontendScripts,
    apiRoutes: routes,
    frontendScripts,
  };
}

function printReport(report) {
  console.log('GERAI 910 INTEGRATION CROSSCHECK');
  console.log('=================================');
  console.log(`Generated at          : ${report.generatedAt}`);
  console.log(`Tracked files         : ${report.totals.trackedFiles}`);
  console.log(`Source/config files   : ${report.totals.sourceLikeFiles}`);
  console.log(`API routes declared   : ${report.totals.apiRoutes}`);
  console.log(`Frontend script refs  : ${report.totals.frontendScriptReferences}`);
  console.log('');

  if (report.warnings.length) {
    console.log('WARNINGS');
    for (const warning of report.warnings) console.log(`- ${warning}`);
    console.log('');
  } else {
    console.log('No structural warnings found.');
    console.log('');
  }

  if (report.snippetSized.length) {
    console.log(`SNIPPET-SIZED FILES (<${report.policy.snippetLineThreshold} lines)`);
    for (const item of report.snippetSized) {
      console.log(`- ${item.file}: ${item.lines} lines, ${item.bytes} bytes`);
    }
    console.log('');
  }

  if (report.missingReadmePaths.length) {
    console.log('MISSING README-REFERENCED PATHS');
    for (const file of report.missingReadmePaths) console.log(`- ${file}`);
    console.log('');
  }

  if (report.missingFrontendScripts.length) {
    console.log('MISSING FRONTEND SCRIPT REFERENCES');
    for (const ref of report.missingFrontendScripts) console.log(`- ${ref.from} -> ${ref.src} (${ref.path})`);
    console.log('');
  }

  console.log('API ROUTES');
  for (const route of report.apiRoutes) console.log(`- ${route}`);
}

const report = analyze();
printReport(report);

const outArg = process.argv.find((arg) => arg.startsWith('--json='));
if (outArg) {
  const outFile = path.resolve(ROOT, outArg.slice('--json='.length));
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, JSON.stringify(report, null, 2));
}

if (process.env.CROSSCHECK_STRICT === '1' && report.warnings.length) {
  process.exitCode = 1;
}
