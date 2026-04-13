// frontend/src/pages/admin/Reports.jsx
import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import api from '../../utils/api';

const COLORS = ['#2563eb', '#0891b2', '#059669', '#d97706', '#dc2626', '#7c3aed', '#db2777', '#ea580c'];
const MONTHS = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];

const Reports = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [appointmentData, setAppointmentData] = useState([]);
  const [deptData, setDeptData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [growthData, setGrowthData] = useState([]);
  const [topDoctors, setTopDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [aptRes, deptRes, statusRes, growthRes, topRes] = await Promise.all([
          api.get('/admin/stats/appointments', { params: { year } }),
          api.get('/admin/stats/by-department', { params: { year } }),
          api.get('/admin/stats/by-status', { params: { year } }),
          api.get('/admin/stats/patients-growth', { params: { year } }),
          api.get('/admin/stats/top-doctors', { params: { year, limit: 5 } }),
        ]);
        setAppointmentData(aptRes.data.data.map(d => ({ name: MONTHS[d.month - 1], value: d.count })));
        setDeptData(deptRes.data.data.map(d => ({ name: d.name || 'Khác', value: d.count })));

        const statusLabels = { pending: 'Chờ xác nhận', confirmed: 'Đã xác nhận', in_progress: 'Đang khám', completed: 'Hoàn thành', cancelled: 'Đã hủy' };
        setStatusData(statusRes.data.data.map(d => ({ name: statusLabels[d.status] || d.status, value: d.count })));
        setGrowthData(growthRes.data.data.map(d => ({ name: MONTHS[d.month - 1], value: d.count })));
        setTopDoctors(topRes.data.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchAll();
  }, [year]);

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Báo Cáo & Thống Kê</h1>
        <select value={year} onChange={(e) => setYear(parseInt(e.target.value))}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none">
          {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Appointments */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Lịch khám theo tháng</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={appointmentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* By Department */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Theo chuyên khoa</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={deptData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {deptData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* By Status */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Trạng thái lịch hẹn</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Patient Growth */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Bệnh nhân mới theo tháng</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#059669" strokeWidth={2} dot={{ fill: '#059669' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Doctors */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Top bác sĩ nhiều lịch hẹn nhất</h2>
        <div className="space-y-3">
          {topDoctors.map((doc, i) => (
            <div key={i} className="flex items-center gap-4">
              <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">{i + 1}</span>
              <div className="flex-1">
                <p className="font-medium text-gray-800">{doc.title} {doc.name}</p>
                <p className="text-xs text-gray-400">{doc.department || ''}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-blue-600">{doc.appointment_count}</p>
                <p className="text-xs text-gray-400">lịch hẹn</p>
              </div>
            </div>
          ))}
          {topDoctors.length === 0 && <p className="text-gray-400 text-center py-4">Chưa có dữ liệu</p>}
        </div>
      </div>
    </div>
  );
};

export default Reports;
