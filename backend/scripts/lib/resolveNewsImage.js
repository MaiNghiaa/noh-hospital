// Resolve news cover image: copy từ frontend/user/public (đường dẫn /...) hoặc tải URL về backend/uploads/news/seed
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const https = require('https');
const http = require('http');

const FRONTEND_PUBLIC = path.resolve(__dirname, '../../..', 'frontend', 'user', 'public');

function extFromUrlOrPath(s, contentType) {
  if (contentType) {
    if (contentType.includes('jpeg')) return '.jpg';
    if (contentType.includes('png')) return '.png';
    if (contentType.includes('gif')) return '.gif';
    if (contentType.includes('webp')) return '.webp';
  }
  const pathPart = s.split('?')[0];
  const m = pathPart.match(/\.([a-zA-Z0-9]+)$/);
  if (m) {
    const e = m[1].toLowerCase();
    return e === 'jpeg' ? '.jpg' : `.${e}`;
  }
  return '.jpg';
}

function downloadToFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http;
    const req = lib.get(
      url,
      { headers: { 'User-Agent': 'noh-hospital-seed/1.0' }, timeout: 25000 },
      (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return downloadToFile(new URL(res.headers.location, url).href, destPath)
            .then(resolve)
            .catch(reject);
        }
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode} for ${url}`));
          return;
        }
        const out = fs.createWriteStream(destPath);
        res.pipe(out);
        out.on('finish', () => {
          out.close();
          resolve({ contentType: res.headers['content-type'] || '' });
        });
        out.on('error', reject);
      }
    );
    req.on('error', reject);
    req.setTimeout(25000, () => req.destroy(new Error('timeout')));
  });
}

/**
 * @returns {Promise<string>} public path /uploads/... hoặc URL gốc nếu lỗi
 */
async function resolveNewsImage(imageOrUrl, slug, uploadDir, publicPathPrefix = '/uploads/news/seed') {
  if (!imageOrUrl || typeof imageOrUrl !== 'string') {
    return 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=420&fit=crop';
  }

  fs.mkdirSync(uploadDir, { recursive: true });
  const safeSlug = (slug || 'news').replace(/[^a-z0-9-]/gi, '-').slice(0, 60);
  const hash = crypto.createHash('md5').update(imageOrUrl).digest('hex').slice(0, 10);

  if (imageOrUrl.startsWith('http://') || imageOrUrl.startsWith('https://')) {
    const ext0 = extFromUrlOrPath(imageOrUrl);
    const baseName = `${safeSlug}-${hash}${ext0}`;
    const dest = path.join(uploadDir, baseName);
    if (fs.existsSync(dest) && fs.statSync(dest).size > 0) {
      return `${publicPathPrefix.replace(/\/$/, '')}/${baseName}`;
    }
    try {
      const tmp = path.join(uploadDir, `.tmp-${hash}`);
      const { contentType } = await downloadToFile(imageOrUrl, tmp);
      const ext = extFromUrlOrPath(imageOrUrl, contentType);
      const finalName = ext !== ext0 ? `${safeSlug}-${hash}${ext}` : baseName;
      const finalPath = path.join(uploadDir, finalName);
      if (finalPath !== tmp) {
        if (fs.existsSync(finalPath)) fs.unlinkSync(finalPath);
        fs.renameSync(tmp, finalPath);
      }
      return `${publicPathPrefix.replace(/\/$/, '')}/${path.basename(finalPath)}`;
    } catch (e) {
      console.warn(`[seed] Tải ảnh thất bại, giữ URL gốc: ${e.message}`);
      return imageOrUrl;
    }
  }

  if (imageOrUrl.startsWith('/')) {
    const rel = imageOrUrl.replace(/^\//, '');
    const src = path.join(FRONTEND_PUBLIC, rel);
    if (!fs.existsSync(src)) {
      console.warn(`[seed] Không tìm thấy file: ${src}`);
      return imageOrUrl;
    }
    const ext = path.extname(src) || '.jpg';
    const baseName = `${safeSlug}${ext}`;
    const dest = path.join(uploadDir, baseName);
    await fs.promises.copyFile(src, dest);
    return `${publicPathPrefix.replace(/\/$/, '')}/${baseName}`;
  }

  return imageOrUrl;
}

module.exports = { resolveNewsImage, FRONTEND_PUBLIC };
