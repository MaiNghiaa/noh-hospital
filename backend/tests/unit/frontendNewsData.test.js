// Dữ liệu seed tin tức + tuyển sinh (scripts/data/frontendNewsData.js)

const { flattenForSeed, buildAdmissionContent, ADMISSION_NEWS_ITEMS } = require('../../scripts/data/frontendNewsData');

describe('frontendNewsData (seed payload)', () => {
  it('có 5 bài mock + 12 bài tuyển sinh = 17 bài', () => {
    const { all, general, admission } = flattenForSeed();
    expect(general.length).toBe(5);
    expect(admission.length).toBe(12);
    expect(admission.every((a) => a.category === 'tuyen-sinh')).toBe(true);
    expect(all.length).toBe(17);
  });

  it('mỗi bài có slug, title, category, image', () => {
    const { all } = flattenForSeed();
    for (const row of all) {
      expect(row.slug).toEqual(expect.any(String));
      expect(row.title.length).toBeGreaterThan(0);
      expect(row.category).toMatch(/^(su-kien|nghien-cuu|hop-tac|thong-bao|hoi-dap|tuyen-sinh)$/);
      expect(row.image).toEqual(expect.any(String));
    }
  });

  it('nội dung tuyển sinh gắn file mẫu khi có', () => {
    const withAtt = ADMISSION_NEWS_ITEMS.find((x) => x.attachmentHref);
    expect(withAtt).toBeDefined();
    const html = buildAdmissionContent(withAtt);
    expect(html).toContain('mau-don-xin-hoc');
    expect(html).toContain('download');
  });
});
