/**
 * Dữ liệu tin tức + tuyển sinh: đọc từ file dùng chung với frontend
 * `frontend/user/src/data/news-mock.json`
 *
 * Cập nhật nội dung: sửa JSON (hoặc tạo lại từ script), rồi:
 *   cd backend && npm run seed:news -- --wipe
 */
const path = require('path');
const fs = require('fs');

const NEWS_MOCK_PATH = path.join(__dirname, '../../../frontend/user/src/data/news-mock.json');

function loadNewsMock() {
  const raw = fs.readFileSync(NEWS_MOCK_PATH, 'utf8');
  return JSON.parse(raw);
}

const { general: MOCK_NEWS, admission: ADMISSION_NEWS_ITEMS } = loadNewsMock();

function buildAdmissionContent(row) {
  const esc = (s) =>
    String(s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  let html = `<p>${esc(row.detailIntro)}</p>`;
  if (row.attachmentHref && row.attachmentLabel) {
    const href = esc(row.attachmentHref);
    const lab = esc(row.attachmentLabel);
    html += `<p>- Tải file để xem chi tiết: <a href="${href}" download>${lab}</a></p>`;
  }
  return html;
}

function flattenForSeed() {
  const general = MOCK_NEWS.map((n) => ({
    type: 'general',
    title: n.title,
    slug: n.slug,
    category: n.category,
    date: n.date,
    excerpt: n.excerpt,
    content: n.content,
    image: n.image,
    is_featured: n.is_featured
  }));

  const admission = ADMISSION_NEWS_ITEMS.map((a) => ({
    type: 'admission',
    title: a.title,
    slug: a.slug,
    category: 'tuyen-sinh',
    date: a.date,
    excerpt: a.excerpt,
    content: buildAdmissionContent(a),
    image: a.imageHero,
    is_featured: 0
  }));

  return { general, admission, all: [...general, ...admission] };
}

module.exports = {
  NEWS_MOCK_PATH,
  loadNewsMock,
  MOCK_NEWS,
  ADMISSION_NEWS_ITEMS,
  buildAdmissionContent,
  flattenForSeed
};
