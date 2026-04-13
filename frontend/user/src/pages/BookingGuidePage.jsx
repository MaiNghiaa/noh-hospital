import { Link } from 'react-router-dom'
import { HOSPITAL_INFO } from '../utils/constants'

export default function BookingGuidePage() {
  const hotline = HOSPITAL_INFO.hotline
  const tel = hotline.replace(/\s/g, '')

  return (
    <div className="bg-white pb-14 pt-6 sm:pb-16 sm:pt-8">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <nav className="mb-6 text-sm text-gray-500">
          <Link to="/" className="hover:text-[#148dd6]">
            Trang chủ
          </Link>
          <span className="mx-2">/</span>
          <Link to="/danh-cho-nguoi-benh/huong-dan" className="hover:text-[#148dd6]">
            Hướng dẫn
          </Link>
        </nav>

        <h1 className="font-display text-2xl font-bold text-[#1f4d8e] sm:text-3xl">
          Hướng dẫn đặt lịch khám
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-gray-600">
          Hướng dẫn này giúp quý người bệnh đặt lịch khám tại {HOSPITAL_INFO.name} nhanh chóng và đúng quy trình.
        </p>

        <section className="mt-10">
          <h2 className="text-lg font-bold text-gray-900">1. Chuẩn bị trước khi đặt lịch</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-gray-700">
            <li>Thông tin cá nhân: họ tên, ngày sinh, số điện thoại liên hệ.</li>
            <li>Giấy tờ: CMND/CCCD hoặc thẻ BHYT (nếu khám theo BHYT).</li>
            <li>
              Xác định nhu cầu: khám chuyên khoa Tai Mũi Họng, tái khám, hoặc dịch vụ cụ thể (nếu có).
            </li>
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="text-lg font-bold text-gray-900">2. Các bước đặt lịch khám online</h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-[15px] leading-relaxed text-gray-700">
            <li>
              Vào mục <Link className="font-semibold text-[#0b66c3] hover:underline" to="/dat-lich-kham">Đặt khám online</Link>{' '}
              trên website.
            </li>
            <li>Chọn ngày giờ khám trong khung giờ bệnh viện mở tiếp nhận (thường trong giờ hành chính theo thông báo).</li>
            <li>Điền đầy đủ thông tin theo biểu mẫu và gửi yêu cầu đặt lịch.</li>
            <li>
              Ghi nhận mã hoặc xác nhận từ hệ thống (SMS/email nếu có). Khi đến viện, mang theo giấy tờ và đến khu vực tiếp đón
              theo hướng dẫn.
            </li>
          </ol>
        </section>

        <section className="mt-10">
          <h2 className="text-lg font-bold text-gray-900">3. Khi đến khám</h2>
          <p className="mt-3 text-[15px] leading-relaxed text-gray-700">
            Đến đúng giờ hẹn, xuất trình giấy tờ tại quầy tiếp đón. Người bệnh có BHYT vui lòng tham khảo thêm{' '}
            <Link className="font-semibold text-[#0b66c3] hover:underline" to="/danh-cho-nguoi-benh/huong-dan/quy-trinh-kham-co-bhyt">
              Quy trình khám có BHYT
            </Link>
            ; khám dịch vụ tự nguyện xem{' '}
            <Link
              className="font-semibold text-[#0b66c3] hover:underline"
              to="/danh-cho-nguoi-benh/huong-dan/quy-trinh-kham-khong-bhyt"
            >
              Quy trình khám không có BHYT
            </Link>
            .
          </p>
        </section>

        <section className="mt-10 rounded-lg border border-amber-100 bg-amber-50/80 p-4 sm:p-5">
          <h2 className="text-lg font-bold text-amber-900">Lưu ý</h2>
          <ul className="mt-2 list-disc space-y-2 pl-5 text-[14px] leading-relaxed text-amber-950/90">
            <li>Trong giờ cao điểm, thời gian chờ có thể kéo dài; nên đến sớm 15–20 phút.</li>
            <li>Nếu cần hủy hoặc đổi lịch, liên hệ tổng đài sớm để được hỗ trợ.</li>
            <li>Thông tin trên website mang tính hướng dẫn; quy định cụ thể có thể được cập nhật theo từng thời điểm.</li>
          </ul>
        </section>

        <section className="mt-10 border-t border-gray-200 pt-8">
          <h2 className="text-lg font-bold text-gray-900">Hỗ trợ</h2>
          <p className="mt-2 text-[15px] text-gray-700">
            Tổng đài đặt hẹn khám &amp; CSKH:{' '}
            <a href={`tel:${tel}`} className="font-bold text-[#d92128] hover:underline">
              {hotline}
            </a>
            <br />
            Giờ làm việc: {HOSPITAL_INFO.workingHours}
          </p>
        </section>

        <Link
          to="/danh-cho-nguoi-benh/huong-dan"
          className="mt-10 inline-block text-sm font-semibold text-[#148dd6] hover:underline"
        >
          ← Quay lại Hướng dẫn
        </Link>
      </div>
    </div>
  )
}
