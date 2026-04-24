/** Map hàng từ GET /api/news?category=tuyen-sinh về dạng item dùng ở AdmissionsPage */
export function mapNewsRowToAdmissionListItem(row) {
  const d = row.published_at || row.created_at
  const dateStr = typeof d === 'string' ? d.slice(0, 10) : ''
  return {
    slug: row.slug,
    title: row.title,
    date: dateStr,
    imageHero: row.image,
    imageThumb: row.image,
    excerpt: row.excerpt
  }
}
