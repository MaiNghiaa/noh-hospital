import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Search } from 'lucide-react'
import Card from '../components/common/Card'
import Input from '../components/common/Input'
import doctorService from '../services/doctorService'

export default function DoctorsPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [limit] = useState(12)
  const [items, setItems] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setPage(1)
  }, [search])

  useEffect(() => {
    let cancelled = false
    async function fetch() {
      setLoading(true)
      try {
        const res = search.trim()
          ? await doctorService.search({ q: search.trim(), page, limit })
          : await doctorService.getAll({ page, limit })
        if (cancelled) return
        setItems(res.data || [])
        setTotal(res.total || 0)
      } catch (e) {
        if (cancelled) return
        setItems([])
        setTotal(0)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [search, page, limit])

  const pageCount = useMemo(() => Math.max(1, Math.ceil((total || 0) / limit)), [total, limit])
  const safePage = Math.min(page, pageCount)

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="max-w-md mb-8">
          <Input
            name="search"
            placeholder="Tìm kiếm bác sĩ theo tên, chuyên khoa..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={Search}
          />
        </div>
        <p className="text-sm text-gray-500 mb-6">
          Tìm thấy <strong>{total}</strong> chuyên gia
        </p>

        {loading ? (
          <div className="py-20 text-center text-gray-400">Đang tải...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((doctor) => (
              <Link key={doctor.id} to={`/doi-ngu-chuyen-gia/${doctor.id}`} className="group">
                <Card padding={false} className="h-full">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={doctor.image}
                      alt={doctor.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <span className="absolute bottom-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-xs font-semibold text-hospital-blue">
                      {doctor.department_name}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-base font-bold text-hospital-dark group-hover:text-hospital-teal transition-colors">
                      {doctor.title ? `${doctor.title} ` : ''}{doctor.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">{doctor.specialty}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-accent-600 font-medium">{doctor.experience}</span>
                      <span className="inline-flex items-center gap-1 text-hospital-teal text-sm font-semibold group-hover:gap-2 transition-all">
                        Chi tiết <ChevronRight size={14} />
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && pageCount > 1 && (
          <div className="mt-10 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage <= 1}
              className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm font-semibold text-gray-600 disabled:opacity-50"
            >
              Trước
            </button>
            <span className="text-sm text-gray-500 px-2">
              Trang <strong>{safePage}</strong> / {pageCount}
            </span>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
              disabled={safePage >= pageCount}
              className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm font-semibold text-gray-600 disabled:opacity-50"
            >
              Sau
            </button>
          </div>
        )}

        {!loading && items.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg">Không tìm thấy bác sĩ phù hợp.</p>
          </div>
        )}
      </div>
    </div>
  )
}
