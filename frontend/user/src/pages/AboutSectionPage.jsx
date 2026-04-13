import { Link, Navigate, useParams } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { ABOUT_INTRO_PAGES, ABOUT_INTRO_TEXT_BY_SLUG } from '../utils/constants'
import AboutHistoryPage from './AboutHistoryPage'
import AboutYouthPage from './AboutYouthPage'

export default function AboutSectionPage() {
  const { slug } = useParams()
  const page = ABOUT_INTRO_PAGES.find((p) => p.slug === slug)

  if (!page) {
    return <Navigate to="/gioi-thieu" replace />
  }

  if (page.historyPage) {
    return <AboutHistoryPage />
  }

  if (page.youthPage) {
    return <AboutYouthPage />
  }

  if (!page.images?.length) {
    return <Navigate to="/gioi-thieu" replace />
  }

  const extra = ABOUT_INTRO_TEXT_BY_SLUG[slug]

  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-gray-500">
          <Link to="/" className="transition-colors hover:text-hospital-teal">
            Trang chủ
          </Link>
          <ChevronRight size={14} className="shrink-0" />
          <Link to="/gioi-thieu" className="transition-colors hover:text-hospital-teal">
            Giới thiệu
          </Link>
          <ChevronRight size={14} className="shrink-0" />
          <span className="font-semibold text-hospital-dark">{page.title}</span>
        </nav>

        <h1 className="font-display mb-8 text-center text-2xl font-bold text-[#1e5691] sm:text-3xl">
          {page.title}
        </h1>

        {extra?.intro ? (
          <p className="dept-card-appear mb-8 text-justify text-[15px] font-medium leading-relaxed text-gray-900 sm:text-base">
            {extra.intro}
          </p>
        ) : null}

        <div className="space-y-6">
          {page.images.map((src, index) => (
            <figure
              key={src}
              className="dept-card-appear overflow-hidden rounded-xl bg-white shadow-md ring-1 ring-gray-200/80"
              style={{ animationDelay: `${Math.min(index, 12) * 70}ms` }}
            >
              <img
                src={src}
                alt=""
                className="block w-full h-auto"
                loading={index === 0 ? 'eager' : 'lazy'}
              />
            </figure>
          ))}
        </div>

        {extra?.bodyAfter?.length ? (
          <div className="dept-card-appear mt-8 space-y-4 rounded-xl bg-white p-5 text-justify text-[15px] leading-relaxed text-gray-800 shadow-sm ring-1 ring-gray-200/80 sm:p-8 sm:text-base sm:leading-[1.75]">
            {extra.bodyAfter.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}
