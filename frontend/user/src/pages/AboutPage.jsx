import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ABOUT_HISTORY_SECTIONS, ABOUT_INTRO_PAGES, ABOUT_YOUTH_UNION } from '../utils/constants'
import { cn, formatShortDate, truncateText } from '../utils/helpers'

const GRID_PAGE_SIZE = 6

function aboutItemCover(page) {
  if (page.historyPage) return ABOUT_HISTORY_SECTIONS?.[0]?.image || ''
  if (page.youthPage) return ABOUT_YOUTH_UNION?.image || ''
  return page.images?.[0] || ''
}

function aboutItemGroupLabel(page) {
  if (page.historyPage) return 'CÁC KHOA TRUNG TÂM'
  if (page.youthPage) return 'CÁC PHÒNG BAN, CHỨC NĂNG'
  return 'CÁC PHÒNG BAN, CHỨC NĂNG'
}

function aboutItemDate(index) {
  // chỉ để hiển thị giống noh.vn (màn hình mẫu). Không phụ thuộc DB.
  const base = new Date('2021-02-02T00:00:00.000Z')
  base.setDate(base.getDate() + index * 14)
  return base.toISOString().slice(0, 10)
}

export default function AboutPage() {
  const [sort, setSort] = useState('new')
  const [page, setPage] = useState(1)

  const list = useMemo(() => {
    const arr = ABOUT_INTRO_PAGES.map((p, idx) => ({
      ...p,
      date: aboutItemDate(idx),
      cover: aboutItemCover(p),
      groupLabel: aboutItemGroupLabel(p),
      excerpt:
        'Bệnh viện Tai Mũi Họng Trung ương là bệnh viện chuyên khoa đầu ngành, không ngừng đổi mới để nâng cao chất lượng khám chữa bệnh, đào tạo và chỉ đạo tuyến.'
    }))
    arr.sort((a, b) => {
      const ta = new Date(a.date).getTime()
      const tb = new Date(b.date).getTime()
      return sort === 'new' ? tb - ta : ta - tb
    })
    return arr
  }, [sort])

  useEffect(() => {
    setPage(1)
  }, [sort])

  const pageCount = Math.max(1, Math.ceil(list.length / GRID_PAGE_SIZE))
  const safePage = Math.min(page, pageCount)

  const featured = list[0] || null
  const sideList = list.slice(1, 4)
  const start = (safePage - 1) * GRID_PAGE_SIZE
  const gridSlice = list.slice(start, start + GRID_PAGE_SIZE)

  return (
    <div className="min-h-0 bg-white pb-12 pt-6 sm:pb-16 sm:pt-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="font-display text-3xl font-medium text-gray-900">Giới thiệu</h1>

          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
            <span className="whitespace-nowrap font-medium uppercase tracking-wide">LỌC TIN THEO:</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-[#148dd6] focus:ring-1 focus:ring-[#148dd6]"
              aria-label="Sắp xếp"
            >
              <option value="new">Sắp xếp</option>
              <option value="old">Cũ nhất</option>
            </select>
          </div>
        </div>

        {/* Khối trên: bài nổi bật + danh sách bên phải */}
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-10">
          <div>
            {featured ? (
              <Link
                to={`/gioi-thieu/${featured.slug}`}
                className="group block overflow-hidden rounded-sm border border-gray-200 bg-gray-50 shadow-sm outline-none transition-shadow hover:shadow-md focus-visible:ring-2 focus-visible:ring-[#148dd6]"
              >
                <div className="relative aspect-[564/320] w-full overflow-hidden">
                  <img
                    src={featured.cover}
                    alt={featured.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    loading="eager"
                  />
                </div>
                <div className="border-t border-gray-100 px-1 py-4 sm:px-2">
                  <div className="flex items-start gap-3">
                    <div className="flex shrink-0 items-baseline gap-1.5">
                      <span className="text-3xl font-bold leading-none text-[#0b66c3] sm:text-4xl">
                        {formatShortDate(featured.date).day}
                      </span>
                      <span className="text-[11px] font-medium leading-tight text-gray-800 sm:text-xs">
                        T{formatShortDate(featured.date).month}
                        <br />
                        {formatShortDate(featured.date).year}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[12px] font-bold uppercase tracking-wide text-[#0b66c3]">
                        {featured.groupLabel}
                      </p>
                      <p className="mt-1 text-[15px] font-bold leading-snug text-gray-900 sm:text-base">
                        {featured.title}
                      </p>
                      <p className="mt-2 text-[12px] text-gray-600 leading-relaxed line-clamp-2">
                        {truncateText(featured.excerpt, 180)}
                      </p>
                      <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[#0b66c3]">
                        XEM CHI TIẾT <span aria-hidden>→</span>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ) : null}
          </div>

          <ul className="flex flex-col divide-y divide-gray-200 border-t border-gray-200 lg:border-t-0">
            {sideList.map((item) => (
              <li key={item.slug} className="py-5 first:pt-0 lg:first:pt-0">
                <Link
                  to={`/gioi-thieu/${item.slug}`}
                  className="group flex gap-4 outline-none focus-visible:ring-2 focus-visible:ring-[#148dd6] focus-visible:ring-offset-2"
                >
                  <div className="relative h-[88px] w-[120px] shrink-0 overflow-hidden rounded-sm border border-gray-200 bg-gray-100 sm:h-[96px] sm:w-[132px]">
                    <img
                      src={item.cover}
                      alt=""
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-bold uppercase tracking-wide text-[#0b66c3]">
                      {item.groupLabel}
                    </p>
                    <p className="mt-1 text-[13px] font-bold uppercase leading-snug text-gray-900 sm:text-[14px]">
                      {item.title}
                    </p>
                    <div className="mt-2 inline-flex items-center gap-2 text-[12px] text-gray-800 group-hover:text-[#0b66c3] font-medium">
                      Xem chi tiết <span aria-hidden>→</span>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Lưới + phân trang */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:gap-8">
          {gridSlice.map((item) => (
            <Link
              key={item.slug}
              to={`/gioi-thieu/${item.slug}`}
              className="group flex gap-4 rounded-sm border border-gray-100 bg-white p-3 shadow-sm outline-none transition-shadow hover:shadow-md focus-visible:ring-2 focus-visible:ring-[#148dd6] sm:p-4"
            >
              <div className="relative h-[100px] w-[140px] shrink-0 overflow-hidden rounded-sm border border-gray-200 bg-gray-50">
                <img
                  src={item.cover}
                  alt=""
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold uppercase text-[#0b66c3]">{item.groupLabel}</p>
                <p className="mt-1 text-[15px] font-bold leading-snug text-gray-900">{item.title}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-[13px] font-medium text-gray-700 group-hover:text-[#0b66c3]">
                  Xem chi tiết <span aria-hidden>→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>

        {pageCount > 1 && (
          <nav className="mt-10 flex flex-wrap items-center justify-center gap-2" aria-label="Phân trang">
            {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPage(p)}
                className={cn(
                  'min-h-9 min-w-9 rounded border px-3 py-1.5 text-sm font-medium transition-colors',
                  p === safePage
                    ? 'border-[#0b66c3] bg-[#0b66c3] text-white'
                    : 'border-gray-300 bg-gray-100 text-gray-800 hover:bg-gray-200'
                )}
              >
                {p}
              </button>
            ))}
            <button
              type="button"
              disabled={safePage >= pageCount}
              onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
              className="rounded border border-gray-300 bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-800 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-40"
            >
              sau &gt;
            </button>
            <button
              type="button"
              disabled={safePage >= pageCount}
              onClick={() => setPage(pageCount)}
              className="rounded border border-gray-300 bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-800 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-40"
            >
              cuối &raquo;
            </button>
          </nav>
        )}
      </div>
    </div>
  )
}
