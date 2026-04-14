import { Link, Outlet, useLocation } from 'react-router-dom'
import { CalendarDays, ClipboardList, FileText, Home, LogOut, Pill, User } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const nav = [
  { to: '/tai-khoan', label: 'Tổng quan', icon: ClipboardList },
  { to: '/tai-khoan/lich-hen', label: 'Lịch hẹn', icon: CalendarDays },
  { to: '/tai-khoan/benh-an', label: 'Bệnh án', icon: FileText },
  { to: '/tai-khoan/don-thuoc', label: 'Đơn thuốc', icon: Pill },
  { to: '/tai-khoan/ho-so', label: 'Hồ sơ', icon: User },
]

export default function PatientLayout() {
  const { user, logout } = useAuth()
  const location = useLocation()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-700 hover:text-blue-700 font-semibold">
            <Home className="w-5 h-5" />
            Trang chủ
          </Link>
          <div className="ml-auto flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-semibold text-gray-900">{user?.full_name}</div>
              <div className="text-xs text-gray-500">{user?.email}</div>
            </div>
            <button
              onClick={logout}
              className="inline-flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition text-sm font-medium"
            >
              <LogOut className="w-4 h-4" />
              Đăng xuất
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
        <aside className="bg-white border border-gray-100 rounded-xl p-3 h-fit">
          <nav className="space-y-1">
            {nav.map((item) => {
              const active = location.pathname === item.to
              const Icon = item.icon
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ${
                    active ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </aside>

        <main>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

