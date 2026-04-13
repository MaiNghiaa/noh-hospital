import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Search } from 'lucide-react'
import Card from '../components/common/Card'
import Input from '../components/common/Input'
import { MOCK_DOCTORS } from '../utils/constants'

export default function DoctorsPage() {
  const [search, setSearch] = useState('')

  const filtered = MOCK_DOCTORS.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.department.toLowerCase().includes(search.toLowerCase()) ||
    d.specialty.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="max-w-md mb-8">
          <Input
            name="search"
            placeholder="Tìm kiếm bác sĩ theo tên, chuyên khoa..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={Search}
          />
        </div>
        <p className="text-sm text-gray-500 mb-6">Tìm thấy <strong>{filtered.length}</strong> chuyên gia</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((doctor) => (
            <Link key={doctor.id} to={`/doi-ngu-chuyen-gia/${doctor.id}`} className="group">
              <Card padding={false} className="h-full">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <span className="absolute bottom-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-xs font-semibold text-hospital-blue">
                    {doctor.department}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-display text-base font-bold text-hospital-dark group-hover:text-hospital-teal transition-colors">
                    {doctor.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">{doctor.specialty}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-accent-600 font-medium">{doctor.experience}</span>
                    <span className="inline-flex items-center gap-1 text-hospital-teal text-sm font-semibold group-hover:gap-2 transition-all">
                      Chi tiết <ChevronRight size={14} />
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg">Không tìm thấy bác sĩ phù hợp.</p>
          </div>
        )}
      </div>
    </div>
  )
}
