// Format ngày tháng theo tiếng Việt
export function formatDate(dateStr) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

// Format ngày ngắn (cho card tin tức)
export function formatShortDate(dateStr) {
  const date = new Date(dateStr)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return { day, month, year }
}

// Cắt chuỗi dài
export function truncateText(text, maxLength = 150) {
  if (!text || text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}

// Tạo slug từ tiêu đề
export function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

// Scroll to top
export function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Class name combiner
export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}
