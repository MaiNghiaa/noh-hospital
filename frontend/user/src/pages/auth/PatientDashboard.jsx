// frontend/user/src/pages/auth/PatientDashboard.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, FileText, Pill, Clock, ChevronRight, User, Activity } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import patientService from '../../services/patientService';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  in_progress: 'bg-purple-100 text-purple-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const statusLabels = {
  pending: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  in_progress: 'Đang khám',
  completed: 'Hoàn thành',
  cancelled: 'Đã hủy',
};

export default function PatientDashboard() {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await patientService.getDashboard();
        setDashboard(res.data);
      } catch (err) {
        console.error('Failed to fetch dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const stats = [
    { label: 'Tổng lịch hẹn', value: dashboard?.totalAppointments || 0, icon: CalendarDays, color: 'blue' },
    { label: 'Sắp tới', value: dashboard?.upcomingAppointments || 0, icon: Clock, color: 'orange' },
    { label: 'Hồ sơ bệnh án', value: dashboard?.totalRecords || 0, icon: FileText, color: 'green' },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Xin chào, {user?.full_name}!</h1>
          <p className="text-gray-500 mt-1">Quản lý lịch khám và hồ sơ sức khỏe của bạn</p>
        </div>
      </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-${stat.color}-100`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Link to="/dat-lich-kham" className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl p-5 transition group">
            <CalendarDays className="w-8 h-8 mb-3" />
            <p className="font-semibold">Đặt lịch khám</p>
            <p className="text-blue-200 text-sm mt-1">Đặt lịch khám mới</p>
          </Link>
          <Link to="/tai-khoan/lich-hen" className="bg-white hover:bg-gray-50 rounded-xl p-5 border border-gray-200 transition group">
            <Clock className="w-8 h-8 mb-3 text-orange-500" />
            <p className="font-semibold text-gray-900">Lịch hẹn của tôi</p>
            <p className="text-gray-500 text-sm mt-1">Xem & quản lý lịch hẹn</p>
          </Link>
          <Link to="/tai-khoan/benh-an" className="bg-white hover:bg-gray-50 rounded-xl p-5 border border-gray-200 transition group">
            <FileText className="w-8 h-8 mb-3 text-green-500" />
            <p className="font-semibold text-gray-900">Hồ sơ bệnh án</p>
            <p className="text-gray-500 text-sm mt-1">Xem lịch sử khám bệnh</p>
          </Link>
          <Link to="/tai-khoan/don-thuoc" className="bg-white hover:bg-gray-50 rounded-xl p-5 border border-gray-200 transition group">
            <Pill className="w-8 h-8 mb-3 text-purple-500" />
            <p className="font-semibold text-gray-900">Đơn thuốc</p>
            <p className="text-gray-500 text-sm mt-1">Xem đơn thuốc đã kê</p>
          </Link>
        </div>

        {/* Recent Appointments */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-500" />
              Lịch hẹn gần đây
            </h2>
            <Link to="/tai-khoan/lich-hen" className="text-blue-600 text-sm hover:underline flex items-center gap-1">
              Xem tất cả <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {dashboard?.recentAppointments?.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {dashboard.recentAppointments.map((appt) => (
                <div key={appt.id} className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{appt.department}</p>
                    <p className="text-sm text-gray-500">
                      {appt.doctor_name && `${appt.doctor_name} · `}
                      {new Date(appt.appointment_date).toLocaleDateString('vi-VN')}
                      {appt.appointment_time && ` · ${appt.appointment_time.slice(0, 5)}`}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[appt.status] || 'bg-gray-100 text-gray-600'}`}>
                    {statusLabels[appt.status] || appt.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-10 text-center text-gray-400">
              <CalendarDays className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Chưa có lịch hẹn nào</p>
              <Link to="/dat-lich-kham" className="text-blue-600 text-sm hover:underline mt-2 inline-block">
                Đặt lịch khám ngay
              </Link>
            </div>
          )}
        </div>

        {/* Profile Link */}
        <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <Link to="/tai-khoan/ho-so" className="flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-gray-500" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{user?.full_name}</p>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition" />
          </Link>
        </div>
    </div>
  );
}
