import { useParams, Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import Button from '../components/common/Button'
import { MOCK_DEPARTMENTS, MOCK_DOCTORS } from '../utils/constants'

export default function DepartmentDetailPage() {
  const { slug } = useParams()
  const department = MOCK_DEPARTMENTS.find((d) => d.slug === slug)

  if (!department) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-display text-2xl font-bold text-gray-400">Không tìm thấy chuyên khoa</h2>
          <Link to="/chuyen-khoa" className="text-hospital-teal mt-4 inline-block font-semibold">
            ← Quay lại danh sách
          </Link>
        </div>
      </div>
    )
  }

  // Lọc bác sĩ thuộc khoa
  const relatedDoctors = MOCK_DOCTORS.filter((d) => d.departmentId === department.id)

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8">
          <nav className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-4">
            <Link to="/" className="hover:text-hospital-teal transition-colors">Trang chủ</Link>
            <ChevronRight size={14} className="shrink-0" />
            <Link to="/chuyen-khoa" className="hover:text-hospital-teal transition-colors">Chuyên khoa</Link>
            <ChevronRight size={14} className="shrink-0" />
            <span className="text-hospital-dark font-semibold">{department.name}</span>
          </nav>
          <h1 className="font-display text-3xl lg:text-4xl font-bold text-hospital-dark">{department.name}</h1>
          <span className="inline-block mt-3 px-3 py-1 bg-hospital-teal/10 text-hospital-teal rounded-lg text-sm font-semibold">
            {department.type === 'lam-sang' ? 'Khối lâm sàng' : 'Khối cận lâm sàng'}
          </span>
        </div>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-md p-6 lg:p-8">
              <h2 className="font-display text-2xl font-bold text-hospital-dark mb-4">Chức năng nhiệm vụ</h2>
              <div className="text-gray-600 leading-relaxed space-y-3">
                <p>Khám, chẩn đoán, tư vấn và điều trị các bệnh lý thuộc chuyên khoa bằng các phương pháp nội khoa và ngoại khoa tiên tiến nhất.</p>
                <p>Nghiên cứu khoa học, ứng dụng các kỹ thuật mới trong chẩn đoán và điều trị. Đào tạo nhân lực y tế cho các tuyến dưới.</p>
                <p>Chỉ đạo tuyến, hỗ trợ kỹ thuật cho các bệnh viện tuyến tỉnh trong phạm vi chuyên môn.</p>
              </div>
            </div>

            {/* Related Doctors */}
            {relatedDoctors.length > 0 && (
              <div className="mt-8">
                <h3 className="font-display text-xl font-bold text-hospital-dark mb-5">
                  Đội ngũ bác sĩ ({relatedDoctors.length})
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {relatedDoctors.map((doctor) => (
                    <Link key={doctor.id} to={`/doi-ngu-chuyen-gia/${doctor.id}`} className="group">
                      <div className="bg-white rounded-2xl shadow-md p-4 flex items-center gap-4 hover-lift">
                        <img
                          src={doctor.image}
                          alt={doctor.name}
                          className="w-16 h-16 rounded-xl object-cover"
                        />
                        <div>
                          <h4 className="font-bold text-sm text-hospital-dark group-hover:text-hospital-teal transition-colors">
                            {doctor.name}
                          </h4>
                          <p className="text-xs text-gray-500 mt-0.5">{doctor.specialty}</p>
                          <p className="text-xs text-accent-600 font-medium mt-1">{doctor.experience}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="font-display text-lg font-bold text-hospital-dark mb-4">Đặt lịch khám</h3>
              <p className="text-sm text-gray-500 mb-4">
                Đặt lịch khám trực tuyến để được ưu tiên và giảm thời gian chờ đợi.
              </p>
              <Link to="/dat-lich-kham">
                <Button variant="accent" className="w-full">
                  Đặt lịch ngay
                </Button>
              </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="font-display text-lg font-bold text-hospital-dark mb-4">Chuyên khoa khác</h3>
              <div className="space-y-2">
                {MOCK_DEPARTMENTS.filter((d) => d.id !== department.id).slice(0, 5).map((d) => (
                  <Link
                    key={d.id}
                    to={`/chuyen-khoa/${d.slug}`}
                    className="block px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-accent-50 hover:text-hospital-teal transition-colors"
                  >
                    {d.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
