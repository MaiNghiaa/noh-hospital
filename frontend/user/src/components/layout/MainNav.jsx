import { useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, ChevronDown, Search } from 'lucide-react'
import { NAV_ITEMS } from '../../utils/constants'
import { cn } from '../../utils/helpers'
import { useAppDispatch, useAppState, ACTIONS } from '../../context/AppContext'

/**
 * @param {'hero' | 'default'} variant — hero: chữ trắng trên ảnh nền; default: nền trắng cho các trang trong site
 */
export default function MainNav({ variant = 'default' }) {
  const location = useLocation()
  const { mobileMenuOpen } = useAppState()
  const dispatch = useAppDispatch()
  const [activeDropdown, setActiveDropdown] = useState(null)
  const timeoutRef = useRef(null)

  const isHero = variant === 'hero'

  const handleMouseEnter = (index) => {
    clearTimeout(timeoutRef.current)
    setActiveDropdown(index)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setActiveDropdown(null), 150)
  }

  const linkBase = isHero
    ? 'text-white/90 hover:text-white hover:border-white/70'
    : 'text-gray-800 hover:text-hospital-blue hover:border-hospital-blue/40'

  const linkActive = isHero ? 'text-white border-white' : 'text-hospital-blue border-hospital-blue'

  /** Subnav — cùng cỡ chữ / độ đậm / màu cho mọi menu xổ */
  const subnavLink =
    'block px-4 py-2.5 text-[13px] font-medium leading-snug text-gray-800 transition-colors hover:bg-accent-50 hover:text-hospital-teal'
  const subnavGroupTitle =
    'block px-4 py-2 text-[13px] font-semibold leading-snug text-gray-900 transition-colors hover:bg-accent-50 hover:text-hospital-teal'
  const subnavNestedLink =
    'block py-2 pl-6 pr-4 text-[13px] font-medium leading-snug text-gray-800 transition-colors hover:bg-accent-50 hover:text-hospital-teal'
  const subnavMobileLink =
    'block px-3 py-2 text-[13px] font-medium leading-snug text-gray-800 transition-colors hover:text-hospital-teal'
  const subnavMobileGroupTitle =
    'block px-3 py-2 text-[13px] font-semibold leading-snug text-gray-900 transition-colors hover:text-hospital-blue'
  const subnavMobileNestedLink =
    'block py-1.5 pl-3 text-[13px] font-medium leading-snug text-gray-800 transition-colors hover:text-hospital-teal'

  
  return (
    <div
      className={cn(
        'relative z-10 max-w-7xl mx-auto px-4 sm:px-6',
        isHero && 'pt-[20px]',
        !isHero && 'bg-white border-b border-gray-100'
      )}
    >
        <div className="flex min-h-14 items-center justify-between gap-2 sm:min-h-16 lg:min-h-20 py-[3px]">
        <Link to="/" className="flex shrink-0 items-center gap-3 pr-[30px]">
          <img
            src="https://noh.vn/sites/default/files/styles/quang_cao/public/file_anhquangcao/logo-bv.png?itok=LUjnYJ6m"
            alt="Logo"
            className="w-[56px] h-[56px] sm:w-[72px] sm:h-[72px] lg:w-[100px] lg:h-[100px]"
          />
        </Link>

        <nav className="hidden lg:flex flex-1 flex-nowrap items-center justify-center gap-0">
          {NAV_ITEMS.map((item, index) => (
            <div
              key={item.path}
              className="relative shrink-0"
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                to={item.path}
                className={cn(
                  'flex items-center gap-1 whitespace-nowrap px-[18px] py-[10px] text-[13px] xl:text-[14px] font-semibold leading-none transition-colors border-b-2 border-transparent',
                  location.pathname.startsWith(item.path) ? linkActive : linkBase
                )}
              >
                {item.label}
                {item.children && (
                  <ChevronDown
                    size={14}
                    className={cn(
                      'transition-transform duration-200',
                      activeDropdown === index && 'rotate-180'
                    )}
                  />
                )}
              </Link>

              {item.children && activeDropdown === index && (
                <div className="absolute top-full left-0 pt-2 animate-slide-down">
                  {(() => {
                    const twoCol = item.dropdownColumns === 2 && item.children.length > 1
                    const mid = twoCol ? Math.ceil(item.children.length / 2) : 0
                    const leftCol = twoCol ? item.children.slice(0, mid) : item.children
                    const rightCol = twoCol ? item.children.slice(mid) : []

                    const renderChild = (child) =>
                      child.children ? (
                        <div key={child.path || child.label} className="mt-1 border-t border-gray-100 pt-1">
                          <Link to={child.path} className={subnavGroupTitle}>
                            {child.label}
                          </Link>
                          {child.children.map((sub) => (
                            <Link key={sub.path} to={sub.path} className={subnavNestedLink}>
                              {sub.label}
                            </Link>
                          ))}
                        </div>
                      ) : child.href ? (
                        <a
                          key={child.label}
                          href={child.href}
                          download={child.download ? true : undefined}
                          className={subnavLink}
                        >
                          {child.label}
                        </a>
                      ) : (
                        <Link key={child.path} to={child.path} className={subnavLink}>
                          {child.label}
                        </Link>
                      )

                    if (twoCol) {
                      return (
                        <div className="grid min-w-[520px] max-w-[640px] grid-cols-2 gap-0 overflow-hidden rounded-xl border border-gray-100 bg-white py-2 shadow-xl">
                          <div className="border-r border-gray-100">{leftCol.map(renderChild)}</div>
                          <div>{rightCol.map(renderChild)}</div>
                        </div>
                      )
                    }

                    return (
                      <div className="min-w-[260px] overflow-hidden rounded-xl border border-gray-100 bg-white py-2 shadow-xl">
                        {item.children.map(renderChild)}
                      </div>
                    )
                  })()}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            to="/tim-kiem"
            className={cn(
              'hidden lg:inline-flex h-10 w-10 shrink-0 items-center justify-center transition-colors',
              isHero ? 'text-white/90 hover:text-white' : 'text-gray-600 hover:text-hospital-blue'
            )}
            aria-label="Tìm kiếm"
          >
            <Search size={18} />
          </Link>

          <button
            type="button"
            onClick={() => dispatch({ type: ACTIONS.TOGGLE_MOBILE_MENU })}
            className={cn(
              'lg:hidden p-2 rounded-lg transition-colors',
              isHero ? 'hover:bg-white/10 text-white' : 'hover:bg-gray-100 text-gray-800'
            )}
            aria-expanded={mobileMenuOpen}
            aria-label="Mở menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-md border border-gray-100 shadow-xl rounded-2xl animate-slide-down max-h-[70vh] overflow-y-auto mb-2">
          <nav className="px-4 py-4 space-y-1">
            {NAV_ITEMS.map((item) => (
              <div key={item.path}>
                <Link
                  to={item.path}
                  className="block px-4 py-3 rounded-lg text-gray-700 font-semibold hover:bg-primary-50 hover:text-hospital-blue transition-colors"
                >
                  {item.label}
                </Link>
                {item.children && (
                  <div className="ml-4 pl-4 border-l-2 border-gray-100 space-y-1">
                    {item.children.map((child) =>
                      child.children ? (
                        <div key={child.path || child.label} className="space-y-0.5">
                          <Link to={child.path} className={subnavMobileGroupTitle}>
                            {child.label}
                          </Link>
                          <div className="ml-3 space-y-0.5 border-l-2 border-gray-100 pl-3">
                            {child.children.map((sub) => (
                              <Link key={sub.path} to={sub.path} className={subnavMobileNestedLink}>
                                {sub.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ) : child.href ? (
                        <a
                          key={child.label}
                          href={child.href}
                          download={child.download ? true : undefined}
                          className={subnavMobileLink}
                        >
                          {child.label}
                        </a>
                      ) : (
                        <Link key={child.path} to={child.path} className={subnavMobileLink}>
                          {child.label}
                        </Link>
                      )
                    )}
                  </div>
                )}
              </div>
            ))}
            <Link
              to="/dat-lich-kham"
              className="block mt-4 text-center px-5 py-3 rounded-xl bg-gradient-to-r from-hospital-teal to-accent-600 text-white font-bold"
            >
              Đặt lịch khám
            </Link>
          </nav>
        </div>
      )}
    </div>
  )
}
