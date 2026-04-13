import { Link } from 'react-router-dom'

const cards = [
  {
    title: 'Đặt khám online',
    desc: 'Đặt lịch khám trực tuyến, chọn thời gian và chuyên khoa phù hợp.',
    to: '/dat-lich-kham',
    cta: 'Đặt lịch ngay'
  },
  {
    title: 'Hướng dẫn',
    desc: 'Quy trình khám BHYT / không BHYT, đặt lịch và hỏi đáp chung.',
    to: '/danh-cho-nguoi-benh/huong-dan',
    cta: 'Xem hướng dẫn'
  }
]

export default function PatientHubPage() {
  return (
    <div className="bg-[#f5f6f8] pb-14 pt-8 sm:pt-10">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <h1 className="font-display text-2xl font-bold text-gray-900 sm:text-3xl">Dành cho người bệnh</h1>
        <p className="mt-2 text-[15px] text-gray-600">
          Chọn dịch vụ hoặc tài liệu bạn cần bên dưới.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {cards.map((c) => (
            <Link
              key={c.to}
              to={c.to}
              className="group flex flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <h2 className="text-lg font-bold text-[#1f4d8e] group-hover:text-[#0b66c3]">{c.title}</h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-600">{c.desc}</p>
              <span className="mt-4 inline-flex text-sm font-semibold text-[#0b66c3]">
                {c.cta} <span className="ml-1 transition-transform group-hover:translate-x-0.5">→</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
