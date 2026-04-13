import { Link } from 'react-router-dom'
import { FileText } from 'lucide-react'
import { HOME_LEGAL_DOC_CARDS } from '../../utils/constants'

/** Khối “Văn bản” trang chủ: 3 thẻ, icon tròn chồng lên viền, không nút “Xem thêm”. */
export default function HomeLegalDocumentsSection() {
  return (
    <section className="bg-[#fafbfc] py-12 md:py-16" aria-labelledby="home-legal-docs-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2
          id="home-legal-docs-heading"
          className="text-center font-display text-2xl font-bold text-gray-900 md:text-3xl"
        >
          Văn bản
        </h2>

        <div className="mt-10 grid gap-8 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
          {HOME_LEGAL_DOC_CARDS.map((item) => (
            <Link
              key={item.slug}
              to={`/vbpl/${item.slug}`}
              className="group relative mx-auto block w-full max-w-sm pt-7 outline-none focus-visible:ring-2 focus-visible:ring-[#148dd6] focus-visible:ring-offset-2 sm:max-w-none"
            >
              <span
                className="absolute left-1/2 top-0 z-10 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full border-2 border-[#b8d4f0] bg-white text-[#148dd6] shadow-sm transition-colors group-hover:border-[#148dd6]"
                aria-hidden
              >
                <FileText className="h-7 w-7" strokeWidth={1.5} />
              </span>
              <div className="flex min-h-[140px] flex-col justify-center rounded-sm border border-gray-200 bg-white px-4 pb-6 pt-10 text-center text-sm leading-snug text-gray-800 shadow-sm transition-shadow group-hover:shadow-md md:min-h-[160px] md:text-[15px] md:leading-relaxed">
                {item.title}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
