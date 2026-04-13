import { WEBSITE_PARTNER_LINKS } from '../../utils/constants'

/** Hàng logo “Liên kết website” — nền xám nhạt, phía trên footer (layout noh.vn). */
export default function WebsitePartnerLinks() {
  return (
    <section
      className="bg-[#edf1f4] py-8 md:py-10"
      aria-labelledby="website-partners-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2
          id="website-partners-heading"
          className="text-center text-lg font-semibold text-gray-900 md:text-xl"
        >
          Liên kết website
        </h2>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-8 sm:gap-x-14 md:gap-x-16">
          {WEBSITE_PARTNER_LINKS.map((item) => (
            <a
              key={item.href + item.image}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-[#148dd6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#edf1f4]"
            >
              <img
                src={item.image}
                alt={item.label}
                loading="lazy"
                decoding="async"
                className="h-auto max-h-[91px] w-auto max-w-[248px] object-contain"
              />
            </a>
          ))}
        </div>

        <div className="mx-auto mt-8 max-w-4xl border-t border-gray-200" />

        <div className="mt-4 flex justify-center" aria-hidden="true">
          <span className="block h-2 w-2 rounded-full border-2 border-[#148dd6] bg-transparent" />
        </div>
      </div>
    </section>
  )
}
