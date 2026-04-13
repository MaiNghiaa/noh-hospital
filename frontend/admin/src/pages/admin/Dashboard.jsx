// frontend/src/pages/admin/Dashboard.jsx
import { useState, useEffect } from 'react';
import { Users, Calendar, Stethoscope, Clock, TrendingUp, Building2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api from '../../utils/api';

const COLORS = ['#2563eb', '#0891b2', '#059669', '#d97706', '#dc2626', '#7c3aed'];
const MONTHS = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];

const StatsCard = ({ title, value, icon: Icon, color, trend }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500 mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value ?? '—'}</p>
        {trend && <p className="text-xs text-green-600 mt-1">{trend}</p>}
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={24} className="text-white" />
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [deptData, setDeptData] = useState([]);
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [overviewRes, appointmentRes, deptRes, recentRes] = await Promise.all([
          api.get('/admin/stats/overview'),
          api.get('/admin/stats/appointments'),
          api.get('/admin/stats/by-department'),
          api.get('/admin/stats/recent-appointments'),
        ]);

        setStats(overviewRes.data.data);
        setChartData(appointmentRes.data.data.map((d) => ({ name: MONTHS[d.month - 1], value: d.count })));
        setDeptData(deptRes.data.data.map((d) => ({ name: d.name || 'Khác', value: d.count })));
        setRecentAppointments(recentRes.data.data);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statusLabel = { pending: 'Chờ xác nhận', confirmed: 'Đã xác nhận', in_progress: 'Đang khám', completed: 'Hoàn thành', cancelled: 'Đã hủy' };
  const statusColor = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    in_progress: 'bg-blue-100 text-blue-800',
    completed: 'bg-gray-100 text-gray-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Tổng quan</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatsCard title="Tổng bệnh nhân" value={stats?.totalPatients} icon={Users} color="bg-blue-600" />
        <StatsCard title="Lịch hẹn hôm nay" value={stats?.todayAppointments} icon={Calendar} color="bg-cyan-600" />
        <StatsCard title="Bác sĩ hoạt động" value={stats?.totalDoctors} icon={Stethoscope} color="bg-green-600" />
        <StatsCard title="Chờ xác nhận" value={stats?.pendingAppointments} icon={Clock} color="bg-yellow-600" />
        <StatsCard title="Tổng lịch hẹn" value={stats?.totalAppointments} icon={TrendingUp} color="bg-purple-600" />
        <StatsCard title="Chuyên khoa" value={stats?.totalDepartments} icon={Building2} color="bg-pink-600" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Lịch khám theo tháng</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Tỷ lệ theo chuyên khoa</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={deptData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {deptData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Appointments Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Lịch hẹn gần nhất</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bệnh nhân</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bác sĩ</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày khám</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentAppointments.map((apt) => (
                <tr key={apt.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-800">{apt.patient_name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{apt.doctor_name || '—'}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {apt.appointment_date ? new Date(apt.appointment_date).toLocaleDateString('vi-VN') : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor[apt.status] || 'bg-gray-100'}`}>
                      {statusLabel[apt.status] || apt.status}
                    </span>
                  </td>
                </tr>
              ))}
              {recentAppointments.length === 0 && (
                <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-400">Chưa có lịch hẹn</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
