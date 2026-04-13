import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Clock, Phone, Facebook, Youtube, UserSearch } from 'lucide-react'
import { HOSPITAL_INFO } from '../../utils/constants'
import { cn } from '../../utils/helpers'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const { workingTime, workingDays } = useMemo(() => {
    // Expected format: "07h30 - 16h30 (Thứ 2 đến Thứ 7)"
    const raw = HOSPITAL_INFO.workingHours || ''
    const openParenIdx = raw.indexOf('(')
    const closeParenIdx = raw.lastIndexOf(')')
    const time = openParenIdx > 0 ? raw.slice(0, openParenIdx).trim() : raw.trim()
    const days =
      openParenIdx >= 0 && closeParenIdx > openParenIdx
        ? raw.slice(openParenIdx, closeParenIdx + 1).trim()
        : ''
    return { workingTime: time, workingDays: days }
  }, [])

  return (
    <header className={cn(
      'sticky top-0 z-40 transition-all duration-300',
      scrolled
        ? 'bg-white/95 backdrop-blur-md shadow-lg shadow-black/5'
        : 'bg-white'
    )}>
      {/* ─── Top Bar ─── */}
      <div className="bg-white border-b border-[#ddd]">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-[12px] sm:text-[14px] min-h-[46px] py-2 sm:py-0 sm:h-[46px]">
          {/* Left */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 min-w-0">
            <Clock size={14} className="text-black shrink-0" />
            <span className="text-black">Giờ làm việc</span>
            <span className="font-bold text-[#1f4d8e]">{workingTime}</span>
            <span className="text-black hidden sm:inline">/</span>
            <span className="text-black">Đặt lịch khám:</span>
            <span className="font-bold text-[#1f4d8e]">{HOSPITAL_INFO.hotline}</span>
            {workingDays ? <span className="text-[#c2c2c2] text-[11px] sm:text-[13px] w-full sm:w-auto">{workingDays}</span> : null}
          </div>

          {/* Right — desktop */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            <a
              href={`tel:${HOSPITAL_INFO.hotline}`}
              className="inline-flex items-center gap-2 whitespace-nowrap"
            >
              <Phone size={14} className="text-black" />
              <span className="text-black">Hotline hỗ trợ:</span>
              <span className="font-bold text-[#d92128]">{HOSPITAL_INFO.hotline}</span>
            </a>

            <div className="flex items-center gap-2 pl-3 border-l border-[#ddd]">
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noreferrer"
                className="text-black hover:opacity-80 transition-opacity"
                aria-label="Facebook"
              >
                <Facebook size={14} />
              </a>
              <a
                href="https://www.youtube.com"
                target="_blank"
                rel="noreferrer"
                className="text-black hover:opacity-80 transition-opacity"
                aria-label="YouTube"
              >
                <Youtube size={14} />
              </a>
            </div>

            <Link
              to="/doi-ngu-chuyen-gia"
              className="inline-flex items-center gap-2 whitespace-nowrap bg-[#1f4d8e] text-white h-[46px] px-4 font-semibold"
            >
              <UserSearch size={16} />
              Tìm kiếm bác sĩ
            </Link>
          </div>

          {/* Right — mobile: hotline + CTA gọn */}
          <div className="flex md:hidden items-center justify-between gap-2 w-full sm:w-auto">
            <a
              href={`tel:${HOSPITAL_INFO.hotline}`}
              className="inline-flex items-center gap-1.5 font-bold text-[#d92128] text-[13px]"
            >
              <Phone size={14} />
              {HOSPITAL_INFO.hotline}
            </a>
            <Link
              to="/doi-ngu-chuyen-gia"
              className="inline-flex items-center gap-1.5 bg-[#1f4d8e] text-white text-[12px] px-3 py-2 font-semibold shrink-0"
            >
              <UserSearch size={14} />
              Bác sĩ
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
