import { useState } from 'react'
import { CalendarPlus, CheckCircle, Phone, User, Mail, Clock } from 'lucide-react'
import Input from '../components/common/Input'
import Button from '../components/common/Button'
import Modal from '../components/common/Modal'
import { MOCK_DEPARTMENTS, HOSPITAL_INFO } from '../utils/constants'

const initialForm = {
  fullName: '',
  phone: '',
  email: '',
  department: '',
  date: '',
  time: '',
  reason: ''
}

export default function AppointmentPage() {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const errs = {}
    if (!form.fullName.trim()) errs.fullName = 'Vui lòng nhập họ tên'
    if (!form.phone.trim()) errs.phone = 'Vui lòng nhập số điện thoại'
    else if (!/^(0[3-9])\d{8}$/.test(form.phone)) errs.phone = 'Số điện thoại không hợp lệ'
    if (!form.department) errs.department = 'Vui lòng chọn chuyên khoa'
    if (!form.date) errs.date = 'Vui lòng chọn ngày khám'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    setLoading(true)
    // Simulate API call
    try {
      await new Promise((r) => setTimeout(r, 1500))
      // Thực tế: await appointmentService.create(form)
      setShowSuccess(true)
      setForm(initialForm)
    } catch {
      alert('Có lỗi xảy ra, vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  const deptOptions = MOCK_DEPARTMENTS.map((d) => ({ value: d.slug, label: d.name }))
  const timeOptions = [
    { value: '07:30', label: '07:30' },
    { value: '08:00', label: '08:00' },
    { value: '08:30', label: '08:30' },
    { value: '09:00', label: '09:00' },
    { value: '09:30', label: '09:30' },
    { value: '10:00', label: '10:00' },
    { value: '10:30', label: '10:30' },
    { value: '14:00', label: '14:00' },
    { value: '14:30', label: '14:30' },
    { value: '15:00', label: '15:00' },
    { value: '15:30', label: '15:30' }
  ]

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-md p-6 lg:p-8">
              <h2 className="font-display text-xl font-bold text-hospital-dark mb-6 flex items-center gap-2">
                <CalendarPlus size={22} className="text-hospital-teal" />
                Thông tin đặt lịch
              </h2>

              <form onSubmit={handleSubmit}>
                <div className="grid sm:grid-cols-2 gap-x-5">
                  <Input
                    label="Họ và tên"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder="Nguyễn Văn A"
                    error={errors.fullName}
                    required
                    icon={User}
                  />
                  <Input
                    label="Số điện thoại"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="0912 345 678"
                    error={errors.phone}
                    required
                    icon={Phone}
                  />
                  <Input
                    label="Email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="email@example.com"
                    icon={Mail}
                  />
                  <Input.Select
                    label="Chuyên khoa"
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                    options={deptOptions}
                    placeholder="Chọn chuyên khoa"
                    error={errors.department}
                    required
                  />
                  <Input
                    label="Ngày khám"
                    name="date"
                    type="date"
                    value={form.date}
                    onChange={handleChange}
                    error={errors.date}
                    required
                  />
                  <Input.Select
                    label="Giờ khám"
                    name="time"
                    value={form.time}
                    onChange={handleChange}
                    options={timeOptions}
                    placeholder="Chọn giờ"
                  />
                </div>

                <Input.Textarea
                  label="Lý do khám / Triệu chứng"
                  name="reason"
                  value={form.reason}
                  onChange={handleChange}
                  placeholder="Mô tả ngắn gọn triệu chứng hoặc lý do khám..."
                  rows={4}
                />

                <Button
                  type="submit"
                  variant="accent"
                  size="lg"
                  loading={loading}
                  className="mt-2 w-full sm:w-auto"
                >
                  Xác nhận đặt lịch
                </Button>
              </form>
            </div>
          </div>

          {/* Sidebar info */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="font-display text-lg font-bold text-hospital-dark mb-4">Lưu ý khi đặt lịch</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-accent-100 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-accent-700">1</span>
                  </div>
                  <p>Mang theo CMND/CCCD và thẻ BHYT (nếu có) khi đến khám.</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-accent-100 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-accent-700">2</span>
                  </div>
                  <p>Đến trước giờ hẹn 15-30 phút để hoàn tất thủ tục.</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-accent-100 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-accent-700">3</span>
                  </div>
                  <p>Liên hệ hotline nếu cần thay đổi hoặc hủy lịch hẹn.</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-hospital-teal to-accent-600 rounded-2xl shadow-md p-6 text-white">
              <h3 className="font-display text-lg font-bold mb-2">Hotline hỗ trợ</h3>
              <p className="text-white/80 text-sm mb-4">Gọi ngay để được tư vấn miễn phí</p>
              <a
                href={`tel:${HOSPITAL_INFO.hotline}`}
                className="inline-flex items-center gap-2 px-5 py-3 bg-white text-hospital-teal font-bold rounded-xl hover:shadow-lg transition-all"
              >
                <Phone size={18} />
                {HOSPITAL_INFO.hotline}
              </a>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="font-display text-lg font-bold text-hospital-dark mb-3">Giờ làm việc</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock size={16} className="text-accent-600" />
                {HOSPITAL_INFO.workingHours}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <Modal isOpen={showSuccess} onClose={() => setShowSuccess(false)} title="Đặt lịch thành công">
        <div className="text-center py-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-4">
            <CheckCircle size={32} className="text-green-600" />
          </div>
          <h3 className="font-display text-xl font-bold text-hospital-dark">Cảm ơn bạn!</h3>
          <p className="text-gray-600 mt-2 max-w-sm mx-auto">
            Lịch hẹn của bạn đã được ghi nhận. Chúng tôi sẽ liên hệ xác nhận qua số điện thoại đã đăng ký.
          </p>
          <Button
            variant="accent"
            className="mt-6"
            onClick={() => setShowSuccess(false)}
          >
            Đóng
          </Button>
        </div>
      </Modal>
    </div>
  )
}
