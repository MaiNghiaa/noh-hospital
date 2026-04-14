import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ChevronRight, GraduationCap, Briefcase, Building2, CalendarPlus } from 'lucide-react'
import Button from '../components/common/Button'
import doctorService from '../services/doctorService'

export default function DoctorDetailPage() {
  const { id } = useParams()
  const [doctor, setDoctor] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function fetch() {
      setLoading(true)
      try {
        const res = await doctorService.getById(id)
        if (cancelled) return
        setDoctor(res.data)
      } catch {
        if (cancelled) return
        setDoctor(null)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400">Đang tải...</div>
      </div>
    )
  }

  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-display text-2xl font-bold text-gray-400">Không tìm thấy bác sĩ</h2>
          <Link to="/doi-ngu-chuyen-gia" className="text-hospital-teal mt-4 inline-block font-semibold">
            ← Quay lại danh sách
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-hospital-teal transition-colors">Trang chủ</Link>
            <ChevronRight size={14} />
            <Link to="/doi-ngu-chuyen-gia" className="hover:text-hospital-teal transition-colors">Đội ngũ chuyên gia</Link>
            <ChevronRight size={14} />
            <span className="text-hospital-dark font-semibold">{doctor.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-md overflow-hidden lg:sticky lg:top-[130px]">
              <div className="aspect-[4/3] overflow-hidden">
                <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-6 text-center">
                <h1 className="font-display text-xl font-bold text-hospital-dark">{doctor.name}</h1>
                {doctor.title && <p className="text-sm text-hospital-teal font-semibold mt-1">{doctor.title}</p>}
                <p className="text-sm text-gray-500 mt-1">{doctor.department_name}</p>

                <Link to="/dat-lich-kham" className="block mt-5">
                  <Button variant="accent" className="w-full" icon={CalendarPlus}>
                    Đặt lịch khám
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Detail Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-md p-6 lg:p-8">
              <h2 className="font-display text-2xl font-bold text-hospital-dark mb-6">Thông tin chuyên gia</h2>

              <div className="space-y-5">
                {[
                  { icon: Briefcase, label: 'Chuyên ngành', value: doctor.specialty },
                  { icon: Building2, label: 'Khoa', value: doctor.department_name },
                  { icon: GraduationCap, label: 'Đào tạo', value: doctor.education },
                  { icon: Briefcase, label: 'Kinh nghiệm', value: doctor.experience }
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-4 p-4 rounded-xl bg-gray-50">
                    <div className="w-10 h-10 rounded-lg bg-accent-100 flex items-center justify-center shrink-0">
                      <item.icon size={18} className="text-accent-600" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-wide">{item.label}</div>
                      <div className="text-base font-semibold text-hospital-dark mt-0.5">{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6 lg:p-8">
              <h2 className="font-display text-xl font-bold text-hospital-dark mb-4">Giới thiệu</h2>
              <div className="text-gray-600 leading-relaxed space-y-3">
                <p>
                  {doctor.name} là một trong những chuyên gia hàng đầu trong lĩnh vực {doctor.specialty}
                  tại Bệnh viện Tai Mũi Họng Trung ương. Với hơn {doctor.experience.replace('+', '')} kinh nghiệm,
                  bác sĩ đã điều trị thành công cho hàng nghìn bệnh nhân.
                </p>
                <p>
                  Bác sĩ tốt nghiệp {doctor.education}, hiện đang công tác tại {doctor.department_name}.
                  Ngoài công tác khám chữa bệnh, bác sĩ còn tham gia giảng dạy và nghiên cứu khoa học.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
