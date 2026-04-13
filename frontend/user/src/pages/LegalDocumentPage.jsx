import { Link, useParams } from 'react-router-dom'
import { LEGAL_DOCUMENTS_BY_SLUG } from '../utils/constants'

const rows = [
  { key: 'code', label: 'Số/Ký hiệu' },
  { key: 'issued', label: 'Ngày ban hành' },
  { key: 'effective', label: 'Ngày hiệu lực' },
  { key: 'summary', label: 'Trích yếu' },
  { key: 'field', label: 'Lĩnh vực' },
  { key: 'agency', label: 'Cơ quan' }
]

export default function LegalDocumentPage() {
  const { slug } = useParams()
  const doc = slug ? LEGAL_DOCUMENTS_BY_SLUG[slug] : null

  if (!doc) {
    return (
      <div className="min-h-[50vh] bg-gray-50/80 px-4 py-16 text-center">
        <p className="text-gray-600">Không tìm thấy văn bản.</p>
        <Link to="/" className="mt-4 inline-block text-[#148dd6] hover:underline">
          Về trang chủ
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-[#f5f6f8] pb-8 pt-4 sm:pb-10 sm:pt-5">
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-5 lg:px-6">
        <nav className="mb-3 text-sm text-gray-500">
          <Link to="/" className="hover:text-[#148dd6]">
            Trang chủ
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700">Văn bản</span>
        </nav>

        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-5 md:p-6">
          <h1 className="font-display text-[1.35rem] font-bold leading-snug text-[#1f4d8e] sm:text-2xl md:text-[1.65rem]">
            Văn bản: {doc.code}
          </h1>

          <table className="mt-4 w-full table-fixed border-collapse border border-gray-300 text-left text-[15px] leading-relaxed md:mt-5 md:text-base">
            <tbody>
              {rows.map(({ key, label }) => (
                <tr key={key} className="border-b border-gray-300 last:border-b-0">
                  <th className="w-[30%] align-top border-r border-gray-300 bg-gray-50 px-3 py-3 font-semibold text-gray-800 sm:w-[28%] sm:px-4 sm:py-3.5 md:text-[17px]">
                    {label}
                  </th>
                  <td className="break-words px-3 py-3 text-gray-800 sm:px-4 sm:py-3.5 md:text-[17px]">
                    {doc[key]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
