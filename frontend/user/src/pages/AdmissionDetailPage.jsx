import { Link, useParams } from 'react-router-dom'
import { ADMISSION_NEWS_ITEMS } from '../utils/constants'

const BASE = '/danh-cho-hoc-vien/thong-tin-tuyen-sinh'

function parseDateParts(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  return {
    day: String(d).padStart(2, '0'),
    monthYear: `T${String(m).padStart(2, '0')} ${y}`
  }
}

export default function AdmissionDetailPage() {
  const { slug } = useParams()
  const item = ADMISSION_NEWS_ITEMS.find((x) => x.slug === slug)

  if (!item) {
    return (
      <div className="bg-[#f5f6f8] px-4 py-16 text-center">
        <p className="text-gray-600">Không tìm thấy bài viết.</p>
        <Link to={BASE} className="mt-4 inline-block text-[#148dd6] hover:underline">
          Về Thông tin tuyển sinh
        </Link>
      </div>
    )
  }

  const { day, monthYear } = parseDateParts(item.date)
  const [tMon, tYear] = monthYear.split(' ')

  return (
    <div className="bg-white pb-12 pt-6 sm:pb-16 sm:pt-8">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <nav className="mb-6 text-sm text-gray-500">
          <Link to="/" className="hover:text-[#148dd6]">
            Trang chủ
          </Link>
          <span className="mx-2">/</span>
          <Link to={BASE} className="hover:text-[#148dd6]">
            Thông tin tuyển sinh
          </Link>
        </nav>

        <div className="flex items-start gap-3">
          <span className="text-4xl font-bold leading-none text-[#0b66c3] sm:text-5xl">{day}</span>
          <span className="pt-1 text-xs font-medium leading-tight text-gray-900">
            {tMon}
            <br />
            {tYear}
          </span>
        </div>

        <h1 className="mt-4 font-display text-xl font-bold leading-snug text-[#1f4d8e] sm:text-2xl md:text-[26px]">
          {item.title}
        </h1>

        <hr className="my-6 border-gray-200" />

        <p className="text-base font-bold text-gray-900">{item.title}</p>

        <p className="mt-4 text-[15px] leading-relaxed text-gray-700">{item.detailIntro}</p>

        {item.attachmentHref && item.attachmentLabel && (
          <p className="mt-6 text-[15px] text-gray-800">
            - Tải file để xem chi tiết:{' '}
            <a
              href={item.attachmentHref}
              download
              className="font-bold text-[#0b66c3] underline decoration-[#0b66c3]/40 underline-offset-2 hover:text-[#148dd6]"
            >
              {item.attachmentLabel}
            </a>
          </p>
        )}

        <Link
          to={BASE}
          className="mt-10 inline-block text-sm font-semibold text-[#148dd6] hover:underline"
        >
          ← Quay lại danh sách
        </Link>
      </div>
    </div>
  )
}
