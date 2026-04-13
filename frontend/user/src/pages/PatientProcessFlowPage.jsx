import { Link, useParams } from 'react-router-dom'
import { PATIENT_PROCESS_FLOW_BY_SLUG } from '../utils/constants'

export default function PatientProcessFlowPage() {
  const { slug } = useParams()
  const meta = slug ? PATIENT_PROCESS_FLOW_BY_SLUG[slug] : null

  if (!meta) {
    return (
      <div className="bg-[#f5f6f8] px-4 py-16 text-center">
        <p className="text-gray-600">Không tìm thấy nội dung.</p>
        <Link to="/danh-cho-nguoi-benh/huong-dan" className="mt-4 inline-block text-[#148dd6] hover:underline">
          Về mục Hướng dẫn
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-white pb-12 pt-6 sm:pb-16 sm:pt-8">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <nav className="mb-6 text-sm text-gray-500">
          <Link to="/" className="hover:text-[#148dd6]">
            Trang chủ
          </Link>
          <span className="mx-2">/</span>
          <Link to="/danh-cho-nguoi-benh" className="hover:text-[#148dd6]">
            Dành cho người bệnh
          </Link>
          <span className="mx-2">/</span>
          <Link to="/danh-cho-nguoi-benh/huong-dan" className="hover:text-[#148dd6]">
            Hướng dẫn
          </Link>
        </nav>

        <h1 className="font-display text-2xl font-bold text-[#1f4d8e] sm:text-3xl">{meta.title}</h1>
        <p className="mt-2 max-w-3xl text-[15px] leading-relaxed text-gray-600">{meta.subtitle}</p>

        <p className="mt-6 text-center text-sm text-gray-500">
          <a
            href={meta.image}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0b66c3] hover:underline"
          >
          </a>
        </p>

        <a
          href={meta.image}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 block overflow-hidden rounded-lg border border-gray-200 bg-gray-50 shadow-sm outline-none ring-offset-2 hover:opacity-95 focus-visible:ring-2 focus-visible:ring-[#148dd6]"
        >
          <img src={meta.image} alt={meta.title} className="w-full object-contain" loading="lazy" />
        </a>

        <Link
          to="/danh-cho-nguoi-benh/huong-dan"
          className="mt-8 inline-block text-sm font-semibold text-[#148dd6] hover:underline"
        >
          ← Quay lại Hướng dẫn
        </Link>
      </div>
    </div>
  )
}
