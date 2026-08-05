#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${1:-http://localhost:3000}"
TIMEOUT=10

echo "Running smoke tests against: $BASE_URL"
echo

check_http() {
  local path="$1"
  local expected="$2"
  printf "Checking %s ... " "$path"
  code=$(curl -s -o /dev/null -w '%{http_code}' --max-time $TIMEOUT "$BASE_URL$path" || echo "000")
  if [ "$code" = "$expected" ]; then
    echo "OK ($code)"
  else
    echo "FAIL (got $code, expected $expected)"
    exit 2
  fi
}

# Basic pages
check_http "/" 200
check_http "/index.html" 200
check_http "/preview.html" 200

# Static asset checks (assets disajikan dari public/ pada akar path)
check_http "/js/main.js" 200
check_http "/js/calculators.js" 200

# Health endpoint
check_http "/api/health" 200

# KHL 2026 endpoint (data 38 provinsi)
check_http "/api/khl/provinsi" 200
check_http "/api/khl/komponen" 200

# API root or health endpoint (if available)
code=$(curl -s -o /dev/null -w '%{http_code}' --max-time $TIMEOUT "$BASE_URL/api/" || echo "000")
if [ "$code" = "200" ] || [ "$code" = "404" ]; then
  echo "API endpoint check OK (got $code)"
else
  echo "API endpoint check FAILED (got $code)"
  exit 2
fi

# Quick content checks (look for strings that indicate UI loaded)
# CATATAN: jangan pakai `curl ... | grep -q` di dalam skrip pipefail —
# grep -q keluar lebih dulu setelah match, curl kena SIGPIPE, dan pipefail
# menganggap pipeline gagal. Gunakan file sementara.
TMP_FILE=$(mktemp)
trap 'rm -f "$TMP_FILE"' EXIT

echo -n "Verifying index content contains 'GERAI 910' ... "
curl -s --max-time $TIMEOUT "$BASE_URL/index.html" > "$TMP_FILE"
if grep -q "GERAI 910" "$TMP_FILE"; then
  echo "FOUND"
else
  echo "MISSING"
  exit 3
fi

# Sanity check: database seed masih utuh (mendeteksi bug readDB async)
echo -n "Verifying /api/db still contains profile data ... "
curl -s --max-time $TIMEOUT "$BASE_URL/api/db" > "$TMP_FILE"
if grep -q '"name"' "$TMP_FILE"; then
  echo "FOUND"
else
  echo "MISSING (data terhapus!)"
  exit 3
fi

echo
echo "Smoke tests passed."
