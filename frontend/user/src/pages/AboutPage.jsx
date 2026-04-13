import { Award, Users, Heart, Building2 } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="bg-white rounded-2xl shadow-md p-6 lg:p-10">
          <div className="grid lg:grid-cols-2 gap-10 items-center mb-12">
            <div>
              <h2 className="font-display text-2xl font-bold text-hospital-dark mb-4">
                Bệnh viện Tai Mũi Họng Trung ương
              </h2>
              <div className="text-gray-600 leading-relaxed space-y-3">
                <p>
                  Bệnh viện Tai Mũi Họng Trung ương là bệnh viện chuyên khoa đầu ngành
                  về Tai Mũi Họng tại Việt Nam, tọa lạc tại số 78 đường Giải Phóng, Hà Nội.
                </p>
                <p>
                  Với hơn 50 năm xây dựng và phát triển, bệnh viện đã trở thành địa chỉ
                  tin cậy hàng đầu trong lĩnh vực chẩn đoán và điều trị các bệnh lý
                  Tai Mũi Họng, phẫu thuật đầu cổ, và thẩm mỹ.
                </p>
                <p>
                  Bệnh viện quy tụ đội ngũ hơn 200 chuyên gia, bác sĩ có trình độ chuyên
                  môn cao, nhiều người là giáo sư, phó giáo sư, tiến sĩ — những chuyên gia
                  đầu ngành trong lĩnh vực Tai Mũi Họng.
                </p>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&h=400&fit=crop"
                alt="Bệnh viện TMH TW"
                className="w-full h-[300px] object-cover"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {[
              { icon: Building2, value: '50+', label: 'Năm hoạt động', color: 'bg-blue-50 text-blue-600' },
              { icon: Users, value: '200+', label: 'Chuyên gia', color: 'bg-green-50 text-green-600' },
              { icon: Heart, value: '1M+', label: 'Bệnh nhân/năm', color: 'bg-red-50 text-red-600' },
              { icon: Award, value: '18', label: 'Chuyên khoa', color: 'bg-amber-50 text-amber-600' }
            ].map((stat) => (
              <div key={stat.label} className="text-center p-6 rounded-2xl bg-gray-50">
                <div className={`w-14 h-14 mx-auto rounded-xl ${stat.color} flex items-center justify-center mb-3`}>
                  <stat.icon size={24} />
                </div>
                <div className="text-3xl font-display font-bold text-hospital-dark">{stat.value}</div>
                <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>

          <h3 className="font-display text-xl font-bold text-hospital-dark mb-4">Sứ mệnh</h3>
          <p className="text-gray-600 leading-relaxed">
            Chăm sóc sức khỏe Tai Mũi Họng toàn diện cho nhân dân với chất lượng cao nhất,
            ứng dụng công nghệ tiên tiến, đào tạo nhân lực chuyên khoa cho cả nước và hội nhập quốc tế.
          </p>
        </div>
      </div>
    </div>
  )
}
