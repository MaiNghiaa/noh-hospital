import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ADMISSION_NEWS_ITEMS } from '../utils/constants'
import { mapNewsRowToAdmissionListItem } from '../utils/admissionMappers'
import { cn } from '../utils/helpers'
import newsService from '../services/newsService'

const CAROUSEL_MS = 6000
const GRID_PAGE_SIZE = 6
const BASE = '/danh-cho-hoc-vien/thong-tin-tuyen-sinh'

function admissionThumbUrl(item) {
  return item.imageThumb || item.imageHero || ''
}

function parseDateParts(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  return {
    day: String(d).padStart(2, '0'),
    monthYear: `T${String(m).padStart(2, '0')} ${y}`
  }
}

export default function AdmissionsPage() {
  const [admissionItems, setAdmissionItems] = useState(ADMISSION_NEWS_ITEMS)

  useEffect(() => {
    let cancel = false
    async function load() {
      try {
        const res = await newsService.getByCategory('tuyen-sinh', 1, 200)
        const rows = res.data
        if (cancel || !Array.isArray(rows) || rows.length === 0) return
        setAdmissionItems(rows.map(mapNewsRowToAdmissionListItem))
      } catch {
        /* giữ dữ liệu từ constants */
      }
    }
    load()
    return () => { cancel = true }
  }, [])

  const topThree = useMemo(() => admissionItems.slice(0, 3), [admissionItems])
  const rest = useMemo(() => admissionItems.slice(3), [admissionItems])

  const [sort, setSort] = useState('new')
  const sortedRest = useMemo(() => {
    const copy = [...rest]
    copy.sort((a, b) => {
      const ta = new Date(a.date).getTime()
      const tb = new Date(b.date).getTime()
      return sort === 'new' ? tb - ta : ta - tb
    })
    return copy
  }, [rest, sort])

  const [page, setPage] = useState(1)
  const pageCount = Math.max(1, Math.ceil(sortedRest.length / GRID_PAGE_SIZE))
  const gridSlice = useMemo(() => {
    const start = (page - 1) * GRID_PAGE_SIZE
    return sortedRest.slice(start, start + GRID_PAGE_SIZE)
  }, [sortedRest, page])

  useEffect(() => {
    setPage(1)
  }, [sort])

  const [active, setActive] = useState(0)
  const nTop = topThree.length

  useEffect(() => {
    if (nTop <= 1) return undefined
    const t = window.setInterval(() => setActive((i) => (i + 1) % nTop), CAROUSEL_MS)
    return () => window.clearInterval(t)
  }, [nTop])

  const current = topThree[active] ?? topThree[0]

  return (
    <div className="min-h-0 bg-white pb-12 pt-6 sm:pb-16 sm:pt-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="font-display text-2xl font-bold text-gray-900 md:text-3xl">
            Thông tin tuyển sinh
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
            <span className="whitespace-nowrap font-medium uppercase tracking-wide">Lọc tin theo:</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-[#148dd6] focus:ring-1 focus:ring-[#148dd6]"
              aria-label="Sắp xếp tin"
            >
              <option value="new">Mới nhất</option>
              <option value="old">Cũ nhất</option>
            </select>
          </div>
        </div>

        {/* Khối trên: carousel + danh sách 3 tin */}
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-10">
          <div>
            {current && (
              <Link
                to={`${BASE}/${current.slug}`}
                className="group block overflow-hidden rounded-sm border border-gray-200 bg-gray-50 shadow-sm outline-none transition-shadow hover:shadow-md focus-visible:ring-2 focus-visible:ring-[#148dd6]"
              >
                <div className="relative aspect-[564/320] w-full overflow-hidden">
                  <img
                    src={current.imageHero}
                    alt={current.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    loading="lazy"
                  />
                </div>
                <div className="border-t border-gray-100 px-1 py-4 sm:px-2">
                  <div className="flex items-start gap-3">
                    <div className="flex shrink-0 items-baseline gap-1.5">
                      <span className="text-3xl font-bold leading-none text-[#0b66c3] sm:text-4xl">
                        {parseDateParts(current.date).day}
                      </span>
                      <span className="text-[11px] font-medium leading-tight text-gray-800 sm:text-xs">
                        {parseDateParts(current.date).monthYear.split(' ')[0]}
                        <br />
                        {parseDateParts(current.date).monthYear.split(' ')[1]}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[15px] font-bold leading-snug text-[#1f4d8e] sm:text-base">
                        {current.title}
                      </p>
                      <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[#0b66c3]">
                        XEM CHI TIẾT <span aria-hidden>→</span>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {nTop > 1 && (
              <div className="mt-4 flex justify-center gap-2">
                {topThree.map((row, i) => (
                  <button
                    key={row.slug}
                    type="button"
                    aria-label={`Slide ${i + 1}`}
                    aria-current={i === active}
                    onClick={() => setActive(i)}
                    className={cn(
                      'h-2 rounded-full transition-all',
                      i === active ? 'w-7 bg-[#0b66c3]' : 'w-2 bg-gray-300 hover:bg-gray-400'
                    )}
                  />
                ))}
              </div>
            )}
          </div>

          <ul className="flex flex-col divide-y divide-gray-200 border-t border-gray-200 lg:border-t-0">
            {topThree.map((item) => {
              const { day, monthYear } = parseDateParts(item.date)
              const [tMon, tYear] = monthYear.split(' ')
              return (
                <li key={item.slug} className="py-5 first:pt-0 lg:first:pt-0">
                  <Link
                    to={`${BASE}/${item.slug}`}
                    className="group flex gap-4 outline-none focus-visible:ring-2 focus-visible:ring-[#148dd6] focus-visible:ring-offset-2"
                  >
                    <div className="relative h-[88px] w-[120px] shrink-0 overflow-hidden rounded-sm border border-gray-200 bg-gray-100 sm:h-[96px] sm:w-[132px]">
                      <img
                        src={admissionThumbUrl(item)}
                        alt=""
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-bold uppercase tracking-wide text-[#0b66c3]">
                        Thông tin tuyển sinh
                      </p>
                      <p className="mt-1 text-[13px] font-bold uppercase leading-snug text-gray-900 sm:text-[14px]">
                        {item.title}
                      </p>
                      <div className="mt-2 flex items-baseline gap-2 text-[11px] text-gray-500">
                        <span className="text-lg font-bold text-[#0b66c3]">{day}</span>
                        <span>
                          {tMon} {tYear}
                        </span>
                      </div>
                      
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>

        {/* Lưới + phân trang */}
        <h2 className="mb-6 mt-14 border-b border-gray-200 pb-3 text-center text-lg font-bold uppercase tracking-wide text-gray-900">
          Thông tin tuyển sinh
        </h2>

        <ul className="grid gap-6 sm:grid-cols-2 lg:gap-8">
          {gridSlice.map((item) => (
            <li key={item.slug}>
              <Link
                to={`${BASE}/${item.slug}`}
                className="group flex gap-4 rounded-sm border border-gray-100 bg-white p-3 shadow-sm outline-none transition-shadow hover:shadow-md focus-visible:ring-2 focus-visible:ring-[#148dd6] sm:p-4"
              >
                <div className="relative h-[100px] w-[140px] shrink-0 overflow-hidden rounded-sm border border-gray-200 bg-gray-50">
                  <img
                    src={admissionThumbUrl(item)}
                    alt=""
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-bold uppercase text-[#0b66c3]">Thông tin tuyển sinh</p>
                  <p className="mt-1 text-[13px] font-bold leading-snug text-gray-900 sm:text-[14px]">{item.title}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-[13px] font-medium text-gray-700 group-hover:text-[#0b66c3]">
                    Xem chi tiết <span aria-hidden>→</span>
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        {pageCount > 1 && (
          <nav
            className="mt-10 flex flex-wrap items-center justify-center gap-2"
            aria-label="Phân trang"
          >
            {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPage(p)}
                className={cn(
                  'min-h-9 min-w-9 rounded border px-3 py-1.5 text-sm font-medium transition-colors',
                  p === page
                    ? 'border-[#0b66c3] bg-[#0b66c3] text-white'
                    : 'border-gray-300 bg-gray-100 text-gray-800 hover:bg-gray-200'
                )}
              >
                {p}
              </button>
            ))}
            <button
              type="button"
              disabled={page >= pageCount}
              onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
              className="rounded border border-gray-300 bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-800 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-40"
            >
              sau &gt;
            </button>
            <button
              type="button"
              disabled={page >= pageCount}
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
