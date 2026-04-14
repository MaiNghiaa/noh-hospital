import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Phone } from 'lucide-react'
import SectionTitle from '../components/common/SectionTitle'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import HomeLegalDocumentsSection from '../components/home/HomeLegalDocumentsSection'
import HomeTrainingLineSection from '../components/home/HomeTrainingLineSection'
import { QUICK_LINKS, MOCK_DEPARTMENTS, MOCK_DOCTORS, MOCK_NEWS, HOSPITAL_INFO } from '../utils/constants'
import departmentService from '../services/departmentService'
import doctorService from '../services/doctorService'
import newsService from '../services/newsService'
import { truncateText, formatShortDate } from '../utils/helpers'
import { cn } from '../utils/helpers'
import WebsitePartnerLinks from '../components/layout/WebsitePartnerLinks'

const DEPT_CAROUSEL_GAP = 10

function deptCardsPerView(clientWidth) {
  if (clientWidth >= 1024) return 4
  if (clientWidth >= 768) return 3
  if (clientWidth >= 640) return 2
  return 1
}

export default function HomePage() {
  const [homeDepartments, setHomeDepartments] = useState(MOCK_DEPARTMENTS)
  const [homeDoctors, setHomeDoctors] = useState(MOCK_DOCTORS)
  const [homeNews, setHomeNews] = useState(MOCK_NEWS)
  useEffect(() => {
    let cancelled = false
    async function fetchHome() {
      try {
        const [depRes, docRes, newsRes] = await Promise.all([
          departmentService.getAll(),
          doctorService.getAll({ page: 1, limit: 6 }),
          newsService.getAll(1, 5),
        ])
        if (cancelled) return
        setHomeDepartments(depRes.data || MOCK_DEPARTMENTS)
        setHomeDoctors(docRes.data || MOCK_DOCTORS)
        setHomeNews(newsRes.data || MOCK_NEWS)
      } catch {
        // keep MOCK as fallback
      }
    }
    fetchHome()
    return () => { cancelled = true }
  }, [])
  const deptScrollRef = useRef(null)
  const [deptPagination, setDeptPagination] = useState({
    pageCount: 0,
    activePage: 0,
    pageWidth: 0,
    itemStep: 0,
    cardWidth: 0
  })

  useLayoutEffect(() => {
    const el = deptScrollRef.current
    if (!el) return

    const measure = () => {
      const W = el.clientWidth
      const track = el.firstElementChild
      const itemCount = track?.children?.length ?? 0
      const perView = deptCardsPerView(W)

      const cardW =
        perView === 1
          ? Math.min(W * 0.85, W - 16)
          : (W - DEPT_CAROUSEL_GAP * (perView - 1)) / perView

      if (cardW <= 0) {
        setDeptPagination({
          pageCount: 0,
          activePage: 0,
          pageWidth: 0,
          itemStep: 0,
          cardWidth: 0
        })
        return
      }

      const itemStep = cardW + DEPT_CAROUSEL_GAP
      const pageWidth = perView * cardW + (perView - 1) * DEPT_CAROUSEL_GAP
      const pageCount = Math.max(1, Math.ceil(itemCount / perView))
      const activePage = pageWidth
        ? Math.min(pageCount - 1, Math.round(el.scrollLeft / pageWidth))
        : 0

      setDeptPagination({
        pageCount,
        activePage,
        pageWidth,
        itemStep,
        cardWidth: cardW
      })
    }

    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = window.requestAnimationFrame(() => {
        raf = 0
        setDeptPagination((prev) => {
          if (!prev.pageWidth || prev.pageCount <= 1) return prev
          const activePage = Math.min(prev.pageCount - 1, Math.round(el.scrollLeft / prev.pageWidth))
          return activePage === prev.activePage ? prev : { ...prev, activePage }
        })
      })
    }

    const ro = new ResizeObserver(() => measure())
    ro.observe(el)
    measure()
    el.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      if (raf) window.cancelAnimationFrame(raf)
      ro.disconnect()
      el.removeEventListener('scroll', onScroll)
    }
  }, [])

  useEffect(() => {
    const el = deptScrollRef.current
    if (!el) return

    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
    if (reduceMotion) return

    if (!deptPagination.itemStep) return

    let intervalId = null

    const tick = () => {
      const step = deptPagination.itemStep
      if (!step) return

      const maxScrollLeft = el.scrollWidth - el.clientWidth
      if (maxScrollLeft <= 0) return

      const next = el.scrollLeft + step

      if (next >= maxScrollLeft - 1) {
        el.scrollTo({ left: 0, behavior: 'smooth' })
      } else {
        el.scrollTo({ left: next, behavior: 'smooth' })
      }
    }

    const start = () => {
      if (intervalId) return
      intervalId = window.setInterval(tick, 2500)
    }

    const stop = () => {
      if (!intervalId) return
      window.clearInterval(intervalId)
      intervalId = null
    }

    el.addEventListener('mouseenter', stop)
    el.addEventListener('mouseleave', start)
    start()

    return () => {
      stop()
      el.removeEventListener('mouseenter', stop)
      el.removeEventListener('mouseleave', start)
    }
  }, [deptPagination.itemStep])

  return (
    <div>
      {/* ════════════════ QUICK LINKS (tiện ích — layout 2 tầng như noh.vn) ════════════════ */}
      <section className="relative z-10 -mt-8">
        <div className="w-full max-w-full border border-[#ddd] bg-[#ddd]">
          <div className="grid grid-cols-2 gap-px sm:grid-cols-3 lg:grid-cols-6">
            {QUICK_LINKS.map((link, i) => (
              <Link
                key={link.path}
                to={link.path}
                className="group flex min-h-[148px] flex-col bg-white text-center outline-none transition-colors hover:bg-[#f8fbfd] border-[2px] border-white focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#1f4d8e] hover:border-[#1f4d8e]"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <span className="flex h-[80px] shrink-0 items-center justify-center px-2">
                  <img
                    src={link.image}
                    alt=""
                    className="h-[50px] w-[50px] object-contain"
                    loading="lazy"
                  />
                </span>
                <span className="flex min-h-[68px] flex-1 items-center justify-center px-3 py-3 text-[14px] font-normal leading-snug text-black">
                  {link.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ DEPARTMENTS ════════════════ */}
      <section className="py-16 lg:py-20">
        <div className="max-w-full mx-auto">
          <div className="text-center mb-10 px-4 sm:px-6">
            <div className="text-[36px]">Chuyên khoa</div>
            <Link
              to="/chuyen-khoa"
              className="inline-block mt-1 text-[11px] tracking-wide text-gray-600 hover:text-gray-900"
            >
              XEM TẤT CẢ
            </Link>
          </div>

          <div
            ref={deptScrollRef}
            className="w-full overflow-x-auto scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory"
          >
            <div className="flex w-max gap-[10px]">
              {homeDepartments.slice(0, 8).map((dept, i) => (
              <Link
                key={dept.id}
                to={`/chuyen-khoa/${dept.slug}`}
                className="group shrink-0 snap-start"
                style={{
                  flex: `0 0 ${deptPagination.cardWidth > 0 ? deptPagination.cardWidth : 280}px`,
                  animationDelay: `${i * 0.05}s`
                }}
              >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-none">
                    <img
                      src={dept.image}
                      alt={dept.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-[#1f4d8e]/55" />

                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
                      <div className="text-white font-bold text-[22px] leading-snug">
                        {dept.name}
                      </div>
                      <div className="mt-3 text-white/85 text-[12px] leading-relaxed line-clamp-2 max-w-[300px]">
                        {dept.description}
                      </div>
                      <div className="mt-4">
                        <span className="inline-flex items-center justify-center h-[34px] px-6 rounded-full bg-[#0b66c3] text-white text-[11px] font-semibold">
                          XEM CHI TIẾT
                        </span>
                      </div>
                    </div>
                  </div>
              </Link>
            ))}
            </div>
          </div>

          {deptPagination.pageCount > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              {Array.from({ length: deptPagination.pageCount }).map((_, idx) => {
                const active = idx === deptPagination.activePage
                return (
                  <button
                    key={idx}
                    type="button"
                    aria-label={`Trang ${idx + 1}`}
                    aria-current={active ? 'true' : undefined}
                    onClick={() => {
                      const el = deptScrollRef.current
                      if (!el || !deptPagination.pageWidth) return
                      el.scrollTo({ left: idx * deptPagination.pageWidth, behavior: 'smooth' })
                    }}
                    className={cn(
                      'h-2 rounded-full transition-all',
                      active ? 'w-6 bg-[#0b66c3]' : 'w-2 bg-gray-300 hover:bg-gray-400'
                    )}
                  />
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* ════════════════ SPECIALTY ACTIVITIES + ANNOUNCEMENTS ════════════════ */}
      <section className="py-10 lg:py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            {/* Left: Specialty activities */}
            <div className="grid grid-cols-[140px_1fr] gap-6 items-start">
              <div className="text-center">
                <div className="text-[18px] font-semibold text-gray-900">Hoạt động chuyên khoa</div>
              </div>

              <div className="flex items-start gap-6">
                <div className="shrink-0 w-[110px] h-[110px] rounded-full overflow-hidden border border-gray-200 bg-gray-50">
                  <img
                    src={MOCK_NEWS?.[0]?.image}
                    alt=""
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                <div className="min-w-0">
                  <div className="text-[14px] font-bold text-gray-900 uppercase leading-snug">
                    {MOCK_NEWS?.[0]?.title ?? 'VIÊM TAI GIỮA MẠN TÍNH: CẢNH BÁO BIẾN CHỨNG NGUY HIỂM VÀ CÁCH'}
                  </div>
                  <div className="mt-2 text-[12px] text-gray-600 leading-relaxed line-clamp-3">
                    {MOCK_NEWS?.[0]?.excerpt ??
                      'Viêm tai giữa mạn tính là tình trạng viêm nhiễm kéo dài ở tai giữa...'}
                  </div>
                  <div className="mt-2">
                    <Link
                      to={MOCK_NEWS?.[0]?.slug ? `/tin-tuc/${MOCK_NEWS[0].slug}` : '/tin-tuc'}
                      className="inline-flex items-center gap-2 text-[12px] text-gray-800 hover:text-[#0b66c3] font-medium"
                    >
                      Xem chi tiết <span aria-hidden>→</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Announcements */}
            <div className="grid grid-cols-[120px_1fr] gap-6 items-start">
              <div className="text-center">
                <div className="text-[18px] font-semibold text-gray-900">Thông báo</div>
                <Link
                  to="/tin-tuc"
                  className="inline-block mt-2 text-[11px] tracking-wide text-gray-600 hover:text-gray-900"
                >
                  XEM THÊM
                </Link>
              </div>

              <div className="space-y-6">
                {MOCK_NEWS.slice(1, 3).map((n) => (
                  <Link key={n.id} to={`/tin-tuc/${n.slug}`} className="group block">
                    <div className="text-[13px] font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-[#0b66c3] transition-colors">
                      {n.title}
                    </div>
                    <div className="mt-2 text-[11px] text-gray-600 line-clamp-2">
                      {truncateText(n.excerpt ?? '', 120)}
                    </div>
                    <div className="mt-2 inline-flex items-center gap-2 text-[12px] text-gray-800 group-hover:text-[#0b66c3] font-medium">
                      Xem chi tiết <span aria-hidden>→</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════ ĐÀO TẠO - CHỈ ĐẠO TUYẾN ════════════════ */}
      <HomeTrainingLineSection />

      {/* ════════════════ Q&A BANNER ════════════════ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://noh.vn/sites/all/themes/custom_theme/images/bg-banhoi.jpg"
            alt=""
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-[#1f4d8e]/65" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
          <div className="text-white flex flex-col items-center text-center font-sans">
            <div className="text-[22px] sm:text-[26px] lg:text-[30px] font-bold tracking-tight">
              Bạn hỏi - Chúng tôi trả lời
            </div>

            <div className="mt-4 relative w-full max-w-4xl">
              <div className=" text-center">
                <div className="text-[18px] sm:text-[20px] lg:text-[22px] italic font-semibold leading-snug">
                  Những hiểu lầm người Việt thường mắc phải về bệnh viêm xoang
                </div>
                <div className="mt-2 text-white/85 text-[12px] sm:text-[13px] leading-relaxed">
                  Theo thạc sĩ, bác sĩ Lê Anh Tuấn, Trưởng khoa Mũi Xoang, Bệnh viện Tai Mũi Họng Trung ương,
                  viêm xoang là một trong những bệnh lý thường gặp trong…
                </div>
              </div>
            </div>

            <div className="mt-5">
              <Link
                to="/danh-cho-nguoi-benh/huong-dan/hoi-dap-chung"
                className="inline-flex items-center justify-center h-10 px-7 rounded-full bg-[#0b66c3] hover:bg-[#0a5aad] text-white text-[12px] font-semibold"
              >
                XEM THÊM HỎI ĐÁP
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════ NEWS ════════════════ */}
      <section className="py-16 lg:py-20 bg-gradient-to-b from-gray-50 to-white w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10">
          <SectionTitle
            title="Tin tức - Sự kiện"
            subtitle="Cập nhật thông tin mới nhất từ bệnh viện"
            viewAllLink="/tin-tuc"
          />

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Featured news */}
            <div className="lg:col-span-2">
              {homeNews[0] && (
                <Link to={`/tin-tuc/${homeNews[0].slug}`} className="group block">
                  <Card padding={false} className="h-full overflow-hidden">
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <img
                        src={homeNews[0].image}
                        alt={homeNews[0].title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <span className="inline-block px-3 py-1 bg-hospital-teal text-white text-xs font-bold rounded-lg mb-3">
                          {homeNews[0].category}
                        </span>
                        <h3 className="font-display text-xl lg:text-2xl font-bold text-white leading-snug">
                          {homeNews[0].title}
                        </h3>
                        <p className="text-white/80 text-sm mt-2 line-clamp-2">
                          {homeNews[0].excerpt}
                        </p>
                      </div>
                    </div>
                  </Card>
                </Link>
              )}
            </div>

            {/* News list */}
            <div className="space-y-4">
              {homeNews.slice(1, 5).map((news) => {
                const { day, month } = formatShortDate(news.published_at || news.created_at)
                return (
                  <Link key={news.id} to={`/tin-tuc/${news.slug}`} className="group block">
                    <Card className="!p-4 flex gap-4 items-start">
                      <div className="shrink-0 w-14 h-14 rounded-xl bg-primary-50 flex flex-col items-center justify-center">
                        <span className="text-lg font-bold text-hospital-blue leading-none">{day}</span>
                        <span className="text-xs text-gray-500">T{month}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs text-hospital-teal font-semibold">{news.category}</span>
                        <h4 className="text-sm font-bold text-hospital-dark leading-snug mt-1 line-clamp-2 group-hover:text-hospital-teal transition-colors">
                          {news.title}
                        </h4>
                      </div>
                    </Card>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════ DOCTORS ════════════════ */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionTitle
            title="Đội ngũ chuyên gia"
            subtitle="Đội ngũ y bác sĩ đầu ngành với trình độ chuyên môn cao và kinh nghiệm dày dặn"
            viewAllLink="/doi-ngu-chuyen-gia"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {homeDoctors.slice(0, 6).map((doctor, i) => (
              <Link
                key={doctor.id}
                to={`/doi-ngu-chuyen-gia/${doctor.id}`}
                className="group"
              >
                <Card padding={false} className="h-full">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={doctor.image}
                      alt={doctor.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-3 left-3">
                      <span className="inline-block px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-xs font-semibold text-hospital-blue">
                        {doctor.department_name || doctor.department}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-base font-bold text-hospital-dark group-hover:text-hospital-teal transition-colors">
                      {doctor.title ? `${doctor.title} ` : ''}{doctor.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">{doctor.specialty}</p>
                    <p className="text-xs text-accent-600 font-medium mt-2">{doctor.experience}</p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ Văn bản ════════════════ */}
      <HomeLegalDocumentsSection />
      {/* ════════════════ WEBSITE PARTNERS ════════════════ */}
      <WebsitePartnerLinks />

      {/* ════════════════ CTA APPOINTMENT ════════════════ */}
      <section className="py-16 lg:py-20 relative overflow-hidden">
        <div className="absolute inset-0 gradient-primary opacity-95" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyem0wLTMwVjBoLTEydjRoMTJ6TTI0IDI0aDEydi0ySDI0djJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center text-white">
          <h2 className="font-display text-3xl lg:text-4xl font-bold">
            Đặt lịch khám ngay hôm nay
          </h2>
          <p className="mt-4 text-white/80 max-w-2xl mx-auto text-lg">
            Đội ngũ chuyên gia hàng đầu sẵn sàng tư vấn và chăm sóc sức khỏe Tai Mũi Họng cho bạn và gia đình.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/dat-lich-kham">
              <Button variant="secondary" size="lg" className="!bg-white !text-hospital-blue !border-white hover:!bg-gray-100">
                Đặt lịch online
              </Button>
            </Link>
            <a href={`tel:${HOSPITAL_INFO.hotline}`}>
              <Button variant="ghost" size="lg" className="!text-white !border-2 !border-white/30 hover:!bg-white/10" icon={Phone}>
                {HOSPITAL_INFO.hotline}
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
