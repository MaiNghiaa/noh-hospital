import { Link } from 'react-router-dom'
import { NAV_ITEMS } from '../utils/constants'

function findPatientNavChildren() {
  const block = NAV_ITEMS.find((x) => x.path === '/danh-cho-nguoi-benh')
  const huongDan = block?.children?.find((c) => c.label === 'Hướng dẫn')
  return huongDan?.children ?? []
}

export default function PatientGuideIndexPage() {
  const links = findPatientNavChildren()

  return (
    <div className="bg-[#f8fafc] pb-12 pt-6 sm:pb-16 sm:pt-8">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <nav className="mb-6 text-sm text-gray-500">
          <Link to="/" className="hover:text-[#148dd6]">
            Trang chủ
          </Link>
          <span className="mx-2">/</span>
          <Link to="/danh-cho-nguoi-benh" className="hover:text-[#148dd6]">
            Dành cho người bệnh
          </Link>
        </nav>

        <h1 className="font-display text-2xl font-bold text-gray-900 sm:text-3xl">Hướng dẫn</h1>
        <p className="mt-2 text-gray-600">
          Tài liệu hướng dẫn quy trình khám, đặt lịch và câu hỏi thường gặp dành cho người bệnh.
        </p>

        <ul className="mt-8 space-y-2 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
          {links.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className="flex items-center justify-between rounded-lg px-4 py-3 text-[15px] font-medium text-gray-800 transition-colors hover:bg-[#eef4fc] hover:text-[#0b66c3]"
              >
                {item.label}
                <span className="text-gray-400" aria-hidden>
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
