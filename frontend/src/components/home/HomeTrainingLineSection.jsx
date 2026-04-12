import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { HOME_TRAINING_LINE_ITEMS } from '../../utils/constants'

const INTERVAL_MS = 6500

function trainingPath(slug) {
  return `/dao-tao-chi-dao-tuyen/${slug}`
}

/** Hai cột: trái = slider ảnh + chú thích xanh; phải = 2 tin (thumb + tiêu đề + Xem chi tiết). */
export default function HomeTrainingLineSection() {
  const items = HOME_TRAINING_LINE_ITEMS
  const [active, setActive] = useState(0)
  const n = items.length

  useEffect(() => {
    if (n <= 1) return undefined
    const t = window.setInterval(() => {
      setActive((i) => (i + 1) % n)
    }, INTERVAL_MS)
    return () => window.clearInterval(t)
  }, [n])

  const current = items[active] ?? items[0]

  return (
    <section className="bg-white py-10 lg:py-14" aria-labelledby="training-line-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h2
            id="training-line-heading"
            className="font-display text-xl font-bold text-gray-900 sm:text-2xl md:text-[26px]"
          >
            Đào tạo - Chỉ đạo tuyến
          </h2>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-10">
          {/* Cột trái — slider */}
          <div>
            <Link
              to={trainingPath(current.slug)}
              className="group block overflow-hidden rounded-sm bg-gray-100 shadow-sm outline-none ring-gray-200 transition-shadow hover:shadow-md focus-visible:ring-2 focus-visible:ring-[#148dd6]"
            >
              <div className="relative aspect-[564/278] w-full">
                <img
                  src={current.imageHero}
                  alt={current.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  loading="lazy"
                />
                <div className="absolute inset-x-0 bottom-0 bg-[#0b66c3] px-4 py-3 sm:py-3.5">
                  <p className="text-left text-[13px] font-semibold leading-snug text-white sm:text-sm md:text-[15px] md:leading-relaxed">
                    {current.title}
                  </p>
                </div>
              </div>
            </Link>

            {n > 1 && (
              <div className="mt-4 flex justify-center gap-2" role="tablist" aria-label="Chọn tin nổi bật">
                {items.map((item, i) => (
                  <button
                    key={item.slug}
                    type="button"
                    role="tab"
                    aria-selected={i === active}
                    aria-label={`Tin ${i + 1}`}
                    onClick={() => setActive(i)}
                    className={
                      i === active
                        ? 'h-2 w-7 rounded-full bg-[#0b66c3] transition-all'
                        : 'h-2 w-2 rounded-full bg-gray-300 transition-all hover:bg-gray-400'
                    }
                  />
                ))}
              </div>
            )}
          </div>

          {/* Cột phải — danh sách 2 mục */}
          <ul className="flex flex-col gap-8 lg:gap-10">
            {items.map((item) => (
              <li key={item.slug}>
                <Link
                  to={trainingPath(item.slug)}
                  className="group flex gap-4 outline-none focus-visible:ring-2 focus-visible:ring-[#148dd6] focus-visible:ring-offset-2 sm:gap-5"
                >
                  <div className="relative h-[100px] w-[140px] shrink-0 overflow-hidden rounded-sm border border-gray-200 bg-gray-50 sm:h-[110px] sm:w-[155px]">
                    <img
                      src={item.imageThumb}
                      alt=""
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="min-w-0 flex-1 pt-0.5">
                    <p className="text-[13px] font-semibold leading-snug text-gray-900 sm:text-[14px] md:leading-relaxed">
                      {item.titleSidebar ?? item.title}
                    </p>
                    <span className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-medium text-gray-700 group-hover:text-[#0b66c3]">
                      Xem chi tiết <span aria-hidden>→</span>
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
