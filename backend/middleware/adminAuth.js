/**
 * Proteksi endpoint admin/sensitif dengan token.
 *
 * Cara pakai:
 *   1. Set env ADMIN_API_TOKEN di .env (mis. nilai acak panjang).
 *   2. Semua request ke endpoint yang diproteksi wajib menyertakan header:
 *        Authorization: Bearer <ADMIN_API_TOKEN>
 *
 * Jika ADMIN_API_TOKEN TIDAK diset, endpoint tetap terbuka (mode development).
 * Untuk produksi, WAJIB menyetel ADMIN_API_TOKEN.
 */
function adminAuth(req, res, next) {
  const token = process.env.ADMIN_API_TOKEN;
  if (!token) return next(); // dev mode: belum ada token -> terbuka

  const provided = req.headers['authorization'] || '';
  if (provided === `Bearer ${token}`) {
    return next();
  }

  return res.status(401).json({
    error: 'Unauthorized',
    message: 'Endpoint ini memerlukan ADMIN_API_TOKEN. Sertakan header: Authorization: Bearer <token>'
  });
}

module.exports = adminAuth;
