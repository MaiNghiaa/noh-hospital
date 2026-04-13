import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import { HOSPITAL_INFO } from '../utils/constants'
import { cn } from '../utils/helpers'

const FAQ_ITEMS = [
  {
    q: 'Làm thế nào để đặt lịch khám online?',
    a: 'Vào mục Đặt khám online trên website, chọn thời gian và điền thông tin theo hướng dẫn. Sau khi gửi thành công, bạn nên lưu lại xác nhận (nếu có) và đến đúng giờ hẹn kèm giấy tờ tùy thân và thẻ BHYT (nếu có). Chi tiết xem thêm trang Hướng dẫn đặt lịch khám.'
  },
  {
    q: 'Giờ làm việc và tiếp nhận khám của bệnh viện?',
    a: `Bệnh viện thường tiếp nhận trong khung ${HOSPITAL_INFO.workingHours}. Giờ cụ thể từng quầy có thể thay đổi theo quy định nội bộ; nên đến sớm và liên hệ tổng đài nếu cần xác nhận.`
  },
  {
    q: 'Khám có BHYT cần mang những gì?',
    a: 'Thẻ BHYT còn hiệu lực, giấy tờ tùy thân có ảnh, và các giấy tờ chuyển tuyến/giới thiệu (nếu theo quy định BHYT). Quy trình các bước tại viện được minh họa trong mục Quy trình khám có BHYT.'
  },
  {
    q: 'Khám dịch vụ tự nguyện (không dùng BHYT) khác gì?',
    a: 'Thường thu viện phí theo dịch vụ tại quầy tiếp đón trước khi vào khám lâm sàng. Luồng đi được mô tả trong Quy trình khám không có BHYT (dịch vụ tự nguyện).'
  },
  {
    q: 'Có thể hủy hoặc đổi lịch khám đã đặt không?',
    a: 'Có. Bạn nên liên hệ tổng đài càng sớm càng tốt để được hướng dẫn hủy/đổi lịch theo quy định và tránh chiếm suất khám.'
  },
  {
    q: 'Tôi cần làm xét nghiệm cận lâm sàng — quy trình ra sao?',
    a: 'Sau khi bác sĩ chỉ định, bạn nộp phí (nếu có) và thực hiện xét nghiệm tại các khoa cận lâm sàng, sau đó mang kết quả quay lại phòng khám theo hướng dẫn. Chi tiết từng nhánh được thể hiện trên sơ đồ quy trình khám tương ứng (có BHYT / tự nguyện).'
  },
  {
    q: 'Liên hệ tổng đài khi cần hỗ trợ?',
    a: `Gọi ${HOSPITAL_INFO.hotline} (Tổng đài đặt hẹn khám & CSKH) trong giờ làm việc để được tư vấn.`
  }
]

export default function PatientFAQPage() {
  const [open, setOpen] = useState(0)

  return (
    <div className="bg-[#f8fafc] pb-14 pt-6 sm:pb-16 sm:pt-8">
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

        <h1 className="font-display text-2xl font-bold text-gray-900 sm:text-3xl">Hỏi đáp chung</h1>
        <p className="mt-2 text-[15px] text-gray-600">
          Một số câu hỏi thường gặp dành cho người bệnh. Nội dung mang tính tham khảo; trường hợp cụ thể vui lòng liên hệ tổng
          đài.
        </p>

        <div className="mt-8 space-y-2">
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = open === i
            return (
              <div key={item.q} className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left text-[15px] font-semibold text-gray-900 transition-colors hover:bg-gray-50 sm:px-5 sm:py-4"
                  aria-expanded={isOpen}
                >
                  <span>{item.q}</span>
                  <ChevronDown
                    size={20}
                    className={cn('shrink-0 text-gray-500 transition-transform', isOpen && 'rotate-180')}
                    aria-hidden
                  />
                </button>
                {isOpen && (
                  <div className="border-t border-gray-100 px-4 py-3 text-[15px] leading-relaxed text-gray-700 sm:px-5 sm:py-4">
                    {item.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <p className="mt-10 text-center text-sm text-gray-600">
          Cần đặt lịch?{' '}
          <Link to="/dat-lich-kham" className="font-semibold text-[#0b66c3] hover:underline">
            Đặt khám online
          </Link>
        </p>

        <Link
          to="/danh-cho-nguoi-benh/huong-dan"
          className="mt-6 inline-block text-sm font-semibold text-[#148dd6] hover:underline"
        >
          ← Quay lại Hướng dẫn
        </Link>
      </div>
    </div>
  )
}
