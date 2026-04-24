/** Nhãn hiển thị cho `news.category` (ENUM từ API) */
export const NEWS_CATEGORY_LABELS = {
  'su-kien': 'Tin tức – Sự kiện',
  'nghien-cuu': 'Nghiên cứu khoa học',
  'hop-tac': 'Hợp tác quốc tế',
  'thong-bao': 'Thông báo',
  'hoi-dap': 'Hỏi đáp',
  'tuyen-sinh': 'Tuyển sinh'
}

export function newsCategoryLabel(category) {
  if (!category) return ''
  return NEWS_CATEGORY_LABELS[category] || category
}
