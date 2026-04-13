// frontend/src/pages/admin/AdminLayout.jsx
import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, Stethoscope, Users, Calendar, Building2,
  Newspaper, Pill, Shield, BarChart3, ClipboardList, CalendarCheck,
  LogOut, Menu, X, ChevronDown
} from 'lucide-react';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const adminMenuItems = [
    { label: 'Tổng quan', icon: LayoutDashboard, path: '/admin/dashboard', roles: ['admin', 'super_admin'] },
    { label: 'Quản lý Bác sĩ', icon: Stethoscope, path: '/admin/doctors', roles: ['admin', 'super_admin'] },
    { label: 'Quản lý Bệnh nhân', icon: Users, path: '/admin/patients', roles: ['admin', 'super_admin'] },
    { label: 'Lịch Khám', icon: Calendar, path: '/admin/appointments', roles: ['admin', 'super_admin', 'doctor'] },
    { label: 'Chuyên Khoa', icon: Building2, path: '/admin/departments', roles: ['admin', 'super_admin'] },
    { label: 'Tin Tức', icon: Newspaper, path: '/admin/news', roles: ['admin', 'super_admin'] },
    { label: 'Danh mục Thuốc', icon: Pill, path: '/admin/medicines', roles: ['admin', 'super_admin', 'doctor'] },
    { label: 'Người Dùng', icon: Shield, path: '/admin/users', roles: ['super_admin'] },
    { label: 'Báo Cáo', icon: BarChart3, path: '/admin/reports', roles: ['admin', 'super_admin'] },
  ];

  const doctorMenuItems = [
    { label: 'Dashboard Bác sĩ', icon: ClipboardList, path: '/doctor/dashboard', roles: ['doctor'] },
    { label: 'Lịch hẹn của tôi', icon: CalendarCheck, path: '/doctor/appointments', roles: ['doctor'] },
  ];

  const allMenuItems = [...adminMenuItems, ...doctorMenuItems];
  const filteredMenuItems = allMenuItems.filter((item) => item.roles.includes(user?.role));

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-blue-800">
        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
          <span className="text-blue-900 font-bold text-lg">N</span>
        </div>
        {sidebarOpen && (
          <div>
            <h1 className="text-white font-bold text-lg leading-tight">NOH Hospital</h1>
            <p className="text-blue-300 text-xs">Hệ thống quản trị</p>
          </div>
        )}
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {filteredMenuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-700 text-white'
                  : 'text-blue-200 hover:bg-blue-800 hover:text-white'
              }`
            }
          >
            <item.icon size={20} />
            {sidebarOpen && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User info */}
      <div className="border-t border-blue-800 px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-700 rounded-full flex items-center justify-center text-white font-semibold text-sm">
            {user?.full_name?.charAt(0) || 'A'}
          </div>
          {sidebarOpen && (
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{user?.full_name}</p>
              <p className="text-blue-300 text-xs capitalize">{user?.role?.replace('_', ' ')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col bg-blue-900 transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-20'
        } fixed inset-y-0 left-0 z-30`}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="fixed inset-y-0 left-0 w-64 bg-blue-900 z-50">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
        {/* Header */}
        <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-20">
          <div className="flex items-center justify-between px-4 lg:px-6 py-3">
            <div className="flex items-center gap-3">
              <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <Menu size={20} />
              </button>
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="hidden lg:block p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <Menu size={20} />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 hidden md:block">
                Xin chào, <span className="font-medium text-gray-800">{user?.full_name}</span>
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline">Đăng xuất</span>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
