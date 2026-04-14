import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import departmentService from '../services/departmentService'

const PAGE_SIZE = 6

/** Số hàng lưới tối đa (theo trang) để giữ chiều cao vùng danh sách ổn định khi đổi tab */
function maxGridRows(itemCount, cols, pageSize) {
  if (itemCount <= 0) return 1
  const pages = Math.ceil(itemCount / pageSize)
  let maxRows = 1
  for (let p = 0; p < pages; p += 1) {
    const n = Math.min(pageSize, itemCount - p * pageSize)
    maxRows = Math.max(maxRows, Math.ceil(n / cols))
  }
  return maxRows
}

export default function DepartmentsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const typeParam = searchParams.get('type')
  const [allItems, setAllItems] = useState([])
  const [loading, setLoading] = useState(true)

  const activeTabId = useMemo(() => {
    if (typeParam === 'can-lam-sang') return 'can-lam-sang'
    return 'lam-sang'
  }, [typeParam])

  const clinicalItems = useMemo(() => allItems.filter((d) => d.type === 'lam-sang'), [allItems])
  const paraclinicalItems = useMemo(() => allItems.filter((d) => d.type === 'can-lam-sang'), [allItems])

  const tabs = useMemo(
    () => ([
      { id: 'lam-sang', label: 'Khối lâm sàng', items: clinicalItems },
      { id: 'can-lam-sang', label: 'Khối cận lâm sàng', items: paraclinicalItems },
    ]),
    [clinicalItems, paraclinicalItems]
  )

  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0]
  const [page, setPage] = useState(0)

  useEffect(() => {
    let cancelled = false
    async function fetch() {
      setLoading(true)
      try {
        const res = await departmentService.getAll()
        if (cancelled) return
        setAllItems(res.data || [])
      } catch {
        if (cancelled) return
        setAllItems([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [])

  const setTab = useCallback(
    (id) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          if (id === 'lam-sang') next.delete('type')
          else next.set('type', id)
          return next
        },
        { replace: true },
      )
    },
    [setSearchParams],
  )

  useEffect(() => {
    setPage(0)
  }, [activeTabId])

  const filtered = activeTab.items
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))

  useEffect(() => {
    setPage((p) => Math.min(p, pageCount - 1))
  }, [pageCount])

  const safePage = Math.min(page, pageCount - 1)
  const pagedItems = filtered.slice(
    safePage * PAGE_SIZE,
    safePage * PAGE_SIZE + PAGE_SIZE,
  )

  const shellRowsMobile = Math.max(
    maxGridRows(clinicalItems.length, 1, PAGE_SIZE),
    maxGridRows(paraclinicalItems.length, 1, PAGE_SIZE),
  )
  const shellRowsDesktop = Math.max(
    maxGridRows(clinicalItems.length, 2, PAGE_SIZE),
    maxGridRows(paraclinicalItems.length, 2, PAGE_SIZE),
  )

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-center text-2xl font-bold text-[#0b66c3] sm:text-3xl">
          Chuyên khoa
        </h1>

        <div className="mb-8 flex justify-center gap-10 border-b border-gray-200">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTabId
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setTab(tab.id)}
                className={`relative pb-3 text-base font-semibold transition-colors sm:text-lg ${
                  isActive
                    ? 'text-[#0b66c3]'
                    : 'text-gray-700 hover:text-[#0b66c3]'
                }`}
              >
                {tab.label}
                {isActive ? (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-[#0b66c3]" />
                ) : null}
              </button>
            )
          })}
        </div>

        {loading ? (
          <div className="py-20 text-center text-gray-400">Đang tải...</div>
        ) : (
        <div
          className="dept-grid-shell"
          style={{
            '--dept-rows-mobile': shellRowsMobile,
            '--dept-rows-desktop': shellRowsDesktop,
          }}
        >
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
            {pagedItems.map((dept, index) => {
              const delayMs = Math.min(index, 11) * 55
              return (
                <li
                  key={`${activeTabId}-${dept.slug}-${safePage}-${index}`}
                  className="dept-card-appear"
                  style={{ animationDelay: `${delayMs}ms` }}
                >
                  <Link
                    to={`/chuyen-khoa/${dept.slug}`}
                    className="group relative block min-h-[280px] overflow-hidden rounded-lg shadow-md ring-1 ring-black/5 transition-shadow hover:shadow-lg sm:min-h-[300px]"
                  >
                    <img
                      src={dept.image}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-[#0b66c3]/75" />
                    <div className="relative flex h-full min-h-[280px] flex-col items-center justify-center gap-3 p-6 text-center text-white sm:min-h-[300px]">
                      <h2 className="text-lg font-bold leading-snug sm:text-xl">
                        {dept.name}
                      </h2>
                      <p className="max-w-md text-sm leading-relaxed text-white/90 line-clamp-4">
                        {dept.description}
                      </p>
                      <span className="mt-1 inline-flex items-center rounded-md bg-[#148dd6] px-8 py-2.5 text-xs font-bold uppercase tracking-wide text-white shadow-sm transition-colors group-hover:bg-[#0f7bb8]">
                        XEM CHI TIẾT
                      </span>
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
        )}

        {pageCount > 1 ? (
          <div className="mt-8 flex justify-center gap-2">
            {Array.from({ length: pageCount }, (_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Trang ${i + 1}`}
                onClick={() => setPage(i)}
                className={`h-2.5 w-2.5 rounded-full transition-colors ${
                  i === safePage
                    ? 'bg-[#0b66c3]'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        ) : (
          <div className="mt-8 flex justify-center">
            <span
              className="h-2.5 w-2.5 rounded-full bg-[#0b66c3]"
              aria-hidden
            />
          </div>
        )}
      </div>
    </div>
  )
}
