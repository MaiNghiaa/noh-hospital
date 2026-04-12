import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { ABOUT_HISTORY_META, ABOUT_HISTORY_SECTIONS } from '../utils/constants'

const titleBlue = 'text-[#1e5691]'

export default function AboutHistoryPage() {
  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <nav className="mb-8 flex flex-wrap items-center gap-2 text-sm text-gray-500">
          <Link to="/" className="transition-colors hover:text-hospital-teal">
            Trang chủ
          </Link>
          <ChevronRight size={14} className="shrink-0" />
          <Link to="/gioi-thieu" className="transition-colors hover:text-hospital-teal">
            Giới thiệu
          </Link>
          <ChevronRight size={14} className="shrink-0" />
          <span className="font-semibold text-gray-800">{ABOUT_HISTORY_META.title}</span>
        </nav>

        <header className="dept-card-appear border-b border-gray-200 pb-8">
          <div className="flex flex-wrap items-start gap-5 sm:gap-8">
            <div className={`flex items-start gap-3 ${titleBlue}`}>
              <span className="font-display text-5xl font-bold leading-none tracking-tight sm:text-6xl">
                {ABOUT_HISTORY_META.dateDay}
              </span>
              <div className="flex flex-col justify-center pt-1 text-xs font-semibold uppercase leading-tight sm:text-sm">
                {ABOUT_HISTORY_META.dateMonthYear.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <h1
                className={`font-display text-2xl font-bold leading-tight sm:text-3xl lg:text-[2rem] ${titleBlue}`}
              >
                {ABOUT_HISTORY_META.title}
              </h1>
            </div>
          </div>
        </header>

        <div className="mt-10 space-y-14 lg:space-y-16">
          {ABOUT_HISTORY_SECTIONS.map((section, index) => (
            <section
              key={section.image}
              className="dept-card-appear"
              style={{ animationDelay: `${Math.min(index, 10) * 80}ms` }}
            >
              <h2 className="mb-6 text-lg font-bold leading-snug text-gray-900 sm:text-xl">
                {section.heading}
              </h2>

              <div className="overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-gray-200/80">
                <img
                  src={section.image}
                  alt=""
                  className="block w-full h-auto"
                  loading={index === 0 ? 'eager' : 'lazy'}
                />
                {section.caption ? (
                  <p className="border-t border-gray-100 px-4 py-4 text-center text-sm italic leading-relaxed text-gray-600 sm:px-6">
                    {section.caption}
                  </p>
                ) : null}
                {section.body?.length ? (
                  <div className="space-y-5 border-t border-gray-100 px-4 py-6 text-[15px] leading-[1.75] text-gray-800 sm:px-8 sm:text-base sm:leading-[1.8]">
                    {section.body.map((block, i) => (
                      <p key={i} className="text-justify">
                        {block.leadBold ? (
                          <>
                            <strong className="font-semibold text-gray-900">{block.leadBold}</strong>
                            {block.text}
                          </>
                        ) : (
                          block.text
                        )}
                      </p>
                    ))}
                  </div>
                ) : null}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
