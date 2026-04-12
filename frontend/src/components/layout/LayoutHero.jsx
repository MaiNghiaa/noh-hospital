import Hero from '../common/Hero'
import { HOME_HERO } from '../../utils/constants'

/** Hero trang chủ — render từ layout (chung với Header), dùng cho mọi trang. */
export default function LayoutHero() {
  return (
    <Hero
      variant="home"
      showMainNav
      slides={HOME_HERO.slides}
      title={(
        <h1 className="text-[20px] leading-tight sm:text-[28px] md:text-[32px] lg:text-[35px] font-bold text-white tracking-tight px-1 sm:px-2">
          {HOME_HERO.title}
        </h1>
      )}
      description={(
        <p className="mt-2 sm:mt-3 text-[14px] sm:text-[17px] md:text-[18px] lg:text-[19px] text-white/85 px-1 sm:px-2 max-w-xl mx-auto">
          {HOME_HERO.subtitle}
        </p>
      )}
      ctaTo={HOME_HERO.ctaTo}
      ctaLabel={HOME_HERO.ctaLabel}
    />
  )
}
