#!/usr/bin/env bash
set -euo pipefail

# slim.sh
# Skrip utilitas untuk "slimming" proyek sebelum dipakai di production atau saat membuat image Docker.
# - menghapus artefak pengembangan
# - menghapus sourcemap
# - mengurangi file di node_modules yang tidak diperlukan
# - mengompres aset statis yang umum

echo "=> slim.sh: mulai proses pengecilan artefak"

# Safety: jangan jalan jika dijalankan dari direktori home secara tidak sengaja
ROOT_DIR="$(pwd)"
echo "Working dir: ${ROOT_DIR}"

# Hapus artefak umum
echo "=> menghapus file log, coverage, dan temp..."
rm -rf *.log coverage .nyc_output tmp dist_build || true

# Node.js projects: hapus devDependencies dan file yang tidak perlu
if [ -f package.json ]; then
  echo "=> ditemukan package.json — akan membersihkan node_modules untuk production"

  # Jika ada package-lock.json atau npm tersedia, gunakan npm prune untuk menghapus dev deps
  if command -v npm >/dev/null 2>&1; then
    echo "=> menjalankan npm ci --only=production (jika CI) atau npm prune --production"
    # Jika ini ada di CI, npm ci --only=production lebih deterministik; jika tidak, prune
    if [ -f package-lock.json ] || [ -f package-lock ]; then
      npm ci --only=production || npm install --only=production || true
    else
      npm prune --production || true
    fi
  elif command -v yarn >/dev/null 2>&1; then
    echo "=> yarn detected — menginstal hanya production dependencies"
    yarn install --production --frozen-lockfile 2>/dev/null || yarn install --production || true
  else
    echo "=> tidak menemukan npm/yarn — melewatkan langkah instalasi production deps"
  fi

  echo "=> menghapus direktori uji dan dokumentasi di node_modules"
  find node_modules -type d \( -iname test -o -iname tests -o -iname example -o -iname examples -o -iname doc -o -iname docs \) -prune -exec rm -rf {} + 2>/dev/null || true
  echo "=> menghapus file sourcemap (*.map)"
  find . -type f -name "*.map" -delete || true
fi

# Hapus sourcemap dan file dev untuk file JS/HTML/CSS
echo "=> menghapus sourcemap di repo"
find . -type f -name "*.js.map" -o -name "*.css.map" -o -name "*.map" -print0 | xargs -0 -r rm -f || true

# Build & kompres aset statis bila ada script build
if [ -f package.json ] && npm run | grep -q " build"; then
  echo "=> menjalankan npm run build"
  npm run build || true
fi

# Kompres aset statis yang ditemukan di folder build/dist/public
for DIR in build dist public assets; do
  if [ -d "${DIR}" ]; then
    echo "=> mengompres aset statis di ${DIR}"
    # Buat gzip file agar webserver dapat melayani precompressed assets
    find "${DIR}" -type f \( -name "*.js" -o -name "*.css" -o -name "*.html" -o -name "*.svg" \) -print0 \
      | xargs -0 -n1 -I{} bash -c 'gzip -9 -c "{}" > "{}.gz" || true'
  fi
done

# Opsi pembersihan tambahan: hapus file yang sering tidak perlu di production
echo "=> menghapus README, changelog, dan licence kecil dari bundle (opsional)"
find node_modules -type f \( -iname "readme*" -o -iname "changelog*" -o -iname "license*" \) -delete 2>/dev/null || true

# Reminder
cat <<EOF
=> slim.sh selesai — hasil:
   - artefak pengembangan dihapus (log, coverage, sourcemap)
   - node_modules dikurangi jika npm/yarn tersedia
   - aset statis dikompres ke .gz bila ditemukan

Tips:
 - Jalankan skrip ini di CI/CD sebelum membuat image Docker atau zip untuk deployment.
 - Untuk Docker, gunakan multi-stage build dan jalankan slim.sh di stage akhir jika perlu.
EOF
