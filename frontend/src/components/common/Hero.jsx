import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { HOME_HERO_SLIDES, SHARED_HERO_BANNER_IMAGE } from '../../utils/constants'
import { cn } from '../../utils/helpers'
import MainNav from '../layout/MainNav'
import Button from './Button'

const HERO_SLIDE_INTERVAL_MS = 6000

/** `variant=page`: không truyền `imageSrc` → dùng SHARED_HERO_BANNER_IMAGE; `imageSrc={null}` → chỉ gradient */
function resolvePageImageSrc(imageSrc) {
  if (imageSrc === null || imageSrc === '') return undefined
  return imageSrc ?? SHARED_HERO_BANNER_IMAGE
}

/**
 * Chiều cao hero trang chủ:
 * - Mobile: 78svh; sm/md: cố định như cũ.
 * - lg+: tỉ lệ ~2550×1000 (màn 2K ~2560px ngang → cao ~1000px), trần 1000px, sàn 580px.
 */
const HOME_SECTION =
  'relative overflow-hidden flex flex-col min-h-[78svh] h-[78svh] sm:min-h-[520px] sm:h-[520px] md:min-h-[580px] md:h-[580px] lg:min-h-[max(580px,min(1000px,39.236vw))] lg:h-[max(580px,min(1000px,39.236vw))]'

/**
 * Hero dùng chung:
 * - `home`: slider ảnh (`slides`) hoặc một `imageSrc`; dot dọc phải; optional MainNav + CTA
 * - `page`: khối đầu trang — mặc định ảnh SHARED_HERO_BANNER_IMAGE; `imageSrc={null}` chỉ dùng gradient
 * - `cover`: banner canh đáy — mặc định cùng ảnh banner site (truyền `imageSrc` để đổi)
 */
export default function Hero({
  variant = 'page',
  /** Chỉ variant home: [{ src, alt? }, ...]; nếu không có thì dùng `imageSrc` hoặc HOME_HERO_SLIDES */
  slides,
  /** Chỉ áp dụng variant home */
  showMainNav = true,
  imageSrc,
  imageAlt = '',
  imageClassName,
  overlayClassName,
  /** Trang page: lớp gradient khi không có ảnh (`imageSrc={null}` hoặc `''`) */
  gradientClassName = 'bg-gradient-to-br from-primary-50 via-white to-accent-50',
  breadcrumb,
  title,
  description,
  /** Giữa khối home — ưu tiên hơn ctaTo/ctaLabel */
  actions,
  ctaTo,
  ctaLabel,
  children,
  className,
  /** Trang `page`: nội dung trải full chiều ngang (chỉ padding hai bên), không giới hạn max-w-7xl */
  fullWidth = false
}) {
  const pageImageSrc = variant === 'page' ? resolvePageImageSrc(imageSrc) : undefined
  const coverImageSrc =
    variant === 'cover' ? (imageSrc ?? SHARED_HERO_BANNER_IMAGE) : undefined

  const homeSlides =
    variant === 'home'
      ? slides?.length
        ? slides
        : imageSrc
          ? [{ src: imageSrc, alt: imageAlt || '' }]
          : HOME_HERO_SLIDES
      : []

  const [homeSlideIndex, setHomeSlideIndex] = useState(0)
  const goHomeSlide = useCallback((i) => {
    setHomeSlideIndex(i % homeSlides.length)
  }, [homeSlides.length])

  useEffect(() => {
    if (variant !== 'home' || homeSlides.length <= 1) return
    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
    if (reduceMotion) return

    const id = window.setInterval(() => {
      setHomeSlideIndex((i) => (i + 1) % homeSlides.length)
    }, HERO_SLIDE_INTERVAL_MS)
    return () => window.clearInterval(id)
  }, [variant, homeSlides.length])

  if (variant === 'home') {
    return (
      <section
        className={cn(HOME_SECTION, className)}
        role="region"
        aria-roledescription="carousel"
        aria-label="Banner trang chủ"
      >
        <div className="absolute inset-0 z-0">
          {homeSlides.map((slide, i) => (
            <img
              key={slide.src}
              src={slide.src}
              alt={slide.alt || imageAlt || ''}
              className={cn(
                'absolute inset-0 h-full w-full object-cover object-[center_22%] sm:object-center md:object-[center_30%] lg:object-center transition-opacity duration-700 ease-out',
                i === homeSlideIndex ? 'z-[1] opacity-100' : 'z-0 opacity-0',
                imageClassName
              )}
              loading={i === 0 ? 'eager' : 'lazy'}
              fetchPriority={i === 0 ? 'high' : undefined}
            />
          ))}
         
        </div>

        {homeSlides.length > 1 && (
          <nav
            className="absolute right-3 top-1/2 z-30 flex -translate-y-1/2 flex-col gap-3 sm:right-5 lg:right-8"
            aria-label="Chọn ảnh banner"
          >
            {homeSlides.map((slide, i) => (
              <button
                key={slide.src}
                type="button"
                onClick={() => goHomeSlide(i)}
                className={cn(
                  'flex h-[14px] w-[14px] shrink-0 items-center justify-center rounded-full border-2 border-white/85 transition-all duration-200',
                  'hover:border-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/30',
                  i === homeSlideIndex ? 'border-white bg-white/15 shadow-[0_0_0_1px_rgba(255,255,255,0.35)]' : 'bg-black/25'
                )}
                aria-label={`Ảnh ${i + 1} trong ${homeSlides.length}`}
                aria-current={i === homeSlideIndex ? 'true' : undefined}
              >
                <span
                  className={cn(
                    'block rounded-full',
                    i === homeSlideIndex ? 'h-2 w-2 bg-white' : 'h-1.5 w-1.5 bg-transparent'
                  )}
                />
              </button>
            ))}
          </nav>
        )}

        {showMainNav && <MainNav variant="hero" />}
        <div className="relative z-0 flex-1 max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-center text-center pb-8 sm:pb-10 lg:pb-12">
          <div className="max-w-3xl w-full">
            {title}
            {description}
            {(actions || (ctaTo && ctaLabel)) && (
              <div className="mt-5 sm:mt-6 flex justify-center">
                {actions ?? (
                  <Link to={ctaTo}>
                    <Button
                      variant="accent"
                      size="lg"
                      className="!bg-[#0b66c3] hover:!bg-[#0a5aad] !text-white !shadow-none text-[13px] sm:text-base !px-5 sm:!px-8 !py-2.5 sm:!py-3"
                    >
                      {ctaLabel}
                    </Button>
                  </Link>
                )}
              </div>
            )}
            {children}
          </div>
        </div>
      </section>
    )
  }

  if (variant === 'cover') {
    return (
      <section className={cn('relative h-[300px] lg:h-[400px] overflow-hidden', className)}>
        <img
          src={coverImageSrc}
          alt={imageAlt || ''}
          className={cn('absolute inset-0 w-full h-full object-cover', imageClassName)}
          loading="lazy"
        />
        <div
          className={cn(
            'absolute inset-0 bg-gradient-to-t from-hospital-dark/80 via-hospital-dark/40 to-transparent',
            overlayClassName
          )}
        />
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-6 sm:pb-8">
            {breadcrumb}
            {title}
            {children}
          </div>
        </div>
      </section>
    )
  }

  /* page */
  return (
    <section
      className={cn(
        'relative overflow-hidden',
        pageImageSrc
          ? 'min-h-[220px] sm:min-h-[300px] lg:min-h-[360px]'
          : cn(gradientClassName, 'py-10 sm:py-12 lg:py-16'),
        className
      )}
    >
      {pageImageSrc && (
        <div className="absolute inset-0">
          <img
            src={pageImageSrc}
            alt={imageAlt}
            className={cn(
              'h-full w-full object-cover object-[center_22%] sm:object-center md:object-[center_30%] lg:object-center',
              imageClassName
            )}
            loading="lazy"
          />
          <div className={cn('absolute inset-0', overlayClassName || 'bg-black/45')} />
        </div>
      )}

      <div
        className={cn(
          'relative z-10 px-4 sm:px-6 lg:px-8',
          fullWidth ? 'w-full max-w-none' : 'max-w-7xl mx-auto',
          pageImageSrc &&
            cn(
              'py-10 sm:py-12 lg:py-16 text-white',
              /* Breadcrumb/title các trang vốn dùng màu tối — đồng bộ khi có ảnh nền */
              '[&_nav]:text-white/75 [&_nav_a]:!text-white/75 [&_nav_a:hover]:!text-white',
              '[&_nav_span]:!text-white [&_h1]:!text-white',
              '[&_p.text-gray-600]:!text-white/90 [&_p]:text-white/90'
            )
        )}
      >
        {breadcrumb}
        {title}
        {description}
        {children}
      </div>
    </section>
  )
}
