import { Link } from 'react-router-dom'
import { Phone, Facebook, Youtube } from 'lucide-react'
import { HOSPITAL_INFO } from '../../utils/constants'
import { cn } from '../../utils/helpers'

const footerBarLink = cn(
  'inline-flex items-center gap-1.5 text-[19px] font-normal text-gray-900 transition-colors',
  'whitespace-nowrap hover:text-[#0066CC]'
)

const COLUMN_LINKS_A = [
  { label: 'Dành cho bệnh nhân', path: '/danh-cho-nguoi-benh' },
  { label: 'Chuyên khoa', path: '/chuyen-khoa' },
  { label: 'Đội ngũ chuyên gia', path: '/doi-ngu-chuyen-gia' },
  { label: 'Bạn hỏi chúng tôi trả lời', path: '/danh-cho-nguoi-benh/huong-dan/hoi-dap-chung' },
]

const COLUMN_LINKS_B = [
  { label: 'Tin tức', path: '/tin-tuc' },
  { label: 'Video clip', path: '/tin-tuc' },
  { label: 'Liên hệ', path: '/lien-he' },
  { label: 'Dành cho học viên', path: '/danh-cho-hoc-vien/thong-tin-tuyen-sinh' },
  { label: 'Hóa đơn điện tử', path: '/lien-he' }
]

/** Footer 3 cột (mong muốn): trắng, viền trên xanh; cột phải = 2 danh sách dọc. */
export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <>
      <footer className="border-t border-[#1f4d8e] bg-white text-gray-900">
        <div className="pt-[40px] pb-[30px]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 lg:items-start lg:gap-0">
              {/* Cột 1 — Hotline + thống kê + MXH */}
              <div className="space-y-6 lg:pr-[65px]">
                <div className="border-[4px] border-[#1f4d8e] bg-white px-4 py-4">
                  <div className="flex items-start gap-3">
                    <Phone className="mt-0.5 h-[30px] w-[30px] shrink-0 text-gray-900" strokeWidth={1.75} />
                    <div>
                      <div className="text-[14px] font-medium uppercase tracking-wide text-gray-900">
                        Hotline
                      </div>
                      <a
                        href={`tel:${HOSPITAL_INFO.hotline.replace(/\s/g, '')}`}
                        className="mt-1 block text-[28px] font-bold leading-none text-[#d92128] sm:text-[30px]"
                      >
                        {HOSPITAL_INFO.hotline}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="space-y-1 text-[15px] text-gray-700">
                  <p>
                    Online: <span className="font-semibold text-gray-900">8</span>
                  </p>
                  <p>
                    Tổng lượt: <span className="font-semibold text-gray-900">4,983,860</span>
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {[
                    { href: 'https://www.facebook.com', label: 'Facebook', Icon: Facebook },
                    { href: 'https://www.youtube.com', label: 'YouTube', Icon: Youtube }
                  ].map(({ href, label, Icon }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-[#5a8fd0] text-[#1f4d8e] transition-colors hover:bg-[#eef4fc] hover:text-[#0066CC]"
                      aria-label={label}
                    >
                      <Icon className="h-5 w-5" strokeWidth={1.75} />
                    </a>
                  ))}
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-[#5a8fd0] text-[15px] font-semibold text-[#1f4d8e] transition-colors hover:bg-[#eef4fc]"
                    aria-label="X / Twitter"
                  >
                    X
                  </a>
                  <a
                    href="https://www.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-[#5a8fd0] text-[14px] font-bold text-[#1f4d8e] transition-colors hover:bg-[#eef4fc]"
                    aria-label="Google+"
                  >
                    G+
                  </a>
                </div>
              </div>

              {/* Cột 2 — Địa chỉ + kẻ ngang giữa các dòng */}
              <div className="text-[16px] leading-relaxed text-gray-800 lg:pr-[120px]">
                <p className="pb-3 font-bold text-[#1f4d8e]">Địa chỉ duy nhất:</p>
                <div className="divide-y divide-gray-200 border-t border-gray-200">
                  <p className="py-3">{HOSPITAL_INFO.address}</p>
                  <p className="py-3">Điện thoại: {HOSPITAL_INFO.phone}</p>
                  <p className="py-3">Fax: {HOSPITAL_INFO.fax}</p>
                  <p className="py-3 text-[16px] font-semibold text-[#d92128]">
                    Tổng đài Đặt hẹn khám &amp; CSKH: {HOSPITAL_INFO.hotline}
                  </p>
                </div>
              </div>

              {/* Cột 3 — hai danh sách dọc cạnh nhau (không flow dạng lưới nhiều cột) */}
              <div className="flex min-w-0 flex-col gap-8 sm:flex-row sm:gap-12 lg:gap-10 xl:gap-16">
                <nav aria-label="Liên kết chân trang" className="flex min-w-0 flex-col gap-2.5">
                  {COLUMN_LINKS_A.map((item) => (
                    <Link key={item.path + item.label} to={item.path} className={footerBarLink}>
                      {item.label}
                      <span aria-hidden className="text-[19px] text-gray-500">
                        →
                      </span>
                    </Link>
                  ))}
                </nav>
                <nav aria-label="Liên kết chân trang bổ sung" className="flex min-w-0 flex-col gap-2.5">
                  {COLUMN_LINKS_B.map((item) => (
                    <Link key={item.path + item.label} to={item.path} className={footerBarLink}>
                      {item.label}
                      <span aria-hidden className="text-[19px] text-gray-500">
                        →
                      </span>
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        </div>

        <div className="flex h-[65px] items-center justify-center bg-[#1f4d8e] px-[20px] text-center">
          <p className="text-[19px] font-bold leading-snug text-white">
            Bệnh viện Tai Mũi Họng TW. Thiết kế bởi 3SSOFT {year} ©
          </p>
        </div>
      </footer>

      <Link to="/dat-lich-kham" className="link-dangkykham">
        <svg
          className="h-[15px] w-[15px] shrink-0 text-white"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
        ĐĂNG KÝ KHÁM
      </Link>
    </>
  )
}
