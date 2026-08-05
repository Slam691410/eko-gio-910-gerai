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

# Static asset checks
check_http "/public/js/main.js" 200
check_http "/public/js/calculators.js" 200

# API root or health endpoint (if available)
code=$(curl -s -o /dev/null -w '%{http_code}' --max-time $TIMEOUT "$BASE_URL/api/" || echo "000")
if [ "$code" = "200" ] || [ "$code" = "404" ]; then
  echo "API endpoint check OK (got $code)"
else
  echo "API endpoint check FAILED (got $code)"
  exit 2
fi

# Quick content checks (look for strings that indicate UI loaded)
echo -n "Verifying index content contains 'GERAI 910' ... "
if curl -s --max-time $TIMEOUT "$BASE_URL/index.html" | grep -q "GERAI 910"; then
  echo "FOUND"
else
  echo "MISSING"
  exit 3
fi

echo
echo "Smoke tests passed."
