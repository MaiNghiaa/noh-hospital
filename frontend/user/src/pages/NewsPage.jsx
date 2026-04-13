import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import Card from '../components/common/Card'
import { MOCK_NEWS } from '../utils/constants'
import { formatShortDate, cn } from '../utils/helpers'

const CATEGORIES = [
  { value: 'all', label: 'Tất cả' },
  { value: 'su-kien', label: 'Tin tức – Sự kiện' },
  { value: 'nghien-cuu', label: 'Nghiên cứu khoa học' },
  { value: 'hop-tac', label: 'Hợp tác quốc tế' }
]

export default function NewsPage() {
  const [searchParams] = useSearchParams()
  const catParam = searchParams.get('cat') || 'all'
  const [activeCat, setActiveCat] = useState(catParam)

  const filtered = activeCat === 'all'
    ? MOCK_NEWS
    : MOCK_NEWS.filter((n) => n.category === activeCat)

  return (
    <div className="min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-gray-50/50">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 py-10">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCat(cat.value)}
              className={cn(
                'px-5 py-2.5 rounded-xl text-sm font-semibold transition-all',
                activeCat === cat.value
                  ? 'bg-hospital-teal text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-hospital-teal hover:text-hospital-teal'
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filtered.map((news) => {
            const { day, month, year } = formatShortDate(news.date)
            return (
              <Link key={news.id} to={`/tin-tuc/${news.slug}`} className="group">
                <Card padding={false} className="h-full">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={news.image}
                      alt={news.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3 bg-white rounded-lg px-2.5 py-1.5 shadow-md text-center">
                      <div className="text-lg font-bold text-hospital-blue leading-none">{day}</div>
                      <div className="text-xs text-gray-500">T{month}/{year}</div>
                    </div>
                  </div>
                  <div className="p-5">
                    <span className="text-xs text-hospital-teal font-semibold">{news.categoryLabel}</span>
                    <h3 className="font-display text-base font-bold text-hospital-dark mt-2 leading-snug line-clamp-2 group-hover:text-hospital-teal transition-colors">
                      {news.title}
                    </h3>
                    <p className="text-gray-500 text-sm mt-2 line-clamp-2">{news.excerpt}</p>
                    <span className="inline-flex items-center gap-1 text-hospital-teal text-sm font-semibold mt-3 group-hover:gap-2 transition-all">
                      Đọc tiếp <ChevronRight size={14} />
                    </span>
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg">Không có tin tức nào.</p>
          </div>
        )}
      </div>
    </div>
  )
}
