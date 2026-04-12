import { Link, useParams } from 'react-router-dom'
import { HOME_TRAINING_LINE_ITEMS } from '../utils/constants'

export default function TrainingLineArticlePage() {
  const { slug } = useParams()
  const item = HOME_TRAINING_LINE_ITEMS.find((x) => x.slug === slug)

  if (!item) {
    return (
      <div className="bg-[#f5f6f8] px-4 py-16 text-center">
        <p className="text-gray-600">Không tìm thấy bài viết.</p>
        <Link to="/" className="mt-4 inline-block text-[#148dd6] hover:underline">
          Về trang chủ
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-[#f5f6f8] pb-10 pt-4 sm:pb-12 sm:pt-5">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <nav className="mb-4 text-sm text-gray-500">
          <Link to="/" className="hover:text-[#148dd6]">
            Trang chủ
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700">Đào tạo - Chỉ đạo tuyến</span>
        </nav>

        <article className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="aspect-[564/278] w-full bg-gray-100">
            <img src={item.imageHero} alt={item.title} className="h-full w-full object-cover" />
          </div>
          <div className="p-5 sm:p-6">
            <h1 className="font-display text-xl font-bold text-[#1f4d8e] sm:text-2xl">{item.title}</h1>
            <p className="mt-4 text-[15px] leading-relaxed text-gray-600">
              Nội dung chi tiết đang được cập nhật. Vui lòng quay lại sau hoặc tham khảo thông tin trên cổng
              thông tin chính thức của bệnh viện.
            </p>
            <Link
              to="/"
              className="mt-6 inline-block text-[15px] font-medium text-[#148dd6] hover:underline"
            >
              ← Về trang chủ
            </Link>
          </div>
        </article>
      </div>
    </div>
  )
}
