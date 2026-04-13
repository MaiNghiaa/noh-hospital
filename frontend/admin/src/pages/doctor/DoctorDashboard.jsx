// frontend/src/pages/doctor/DoctorDashboard.jsx
import { useState, useEffect } from 'react';
import { Calendar, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import api from '../../utils/api';
import { StatusBadge } from '../../components/admin';

const DoctorDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/doctor/dashboard');
        setData(res.data.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div></div>;

  const stats = data?.stats || {};

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard Bác sĩ</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-gray-500">Lịch hẹn hôm nay</p><p className="text-2xl font-bold text-gray-800">{stats.todayCount}</p></div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center"><Calendar className="text-blue-600" size={24} /></div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-gray-500">Tuần này</p><p className="text-2xl font-bold text-gray-800">{stats.weekCount}</p></div>
            <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center"><TrendingUp className="text-cyan-600" size={24} /></div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-gray-500">Chờ xử lý</p><p className="text-2xl font-bold text-gray-800">{stats.pendingCount}</p></div>
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center"><Clock className="text-yellow-600" size={24} /></div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-gray-500">Hoàn thành tháng này</p><p className="text-2xl font-bold text-gray-800">{stats.completedCount}</p></div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center"><CheckCircle className="text-green-600" size={24} /></div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Lịch hẹn hôm nay</h2>
        <div className="space-y-3">
          {data?.todayAppointments?.map((apt) => (
            <div key={apt.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
              <div>
                <p className="font-medium text-gray-800">{apt.patient_name}</p>
                <p className="text-sm text-gray-500">{apt.appointment_time} - {apt.department_name || ''}</p>
                {apt.symptoms && <p className="text-xs text-gray-400 mt-1">Triệu chứng: {apt.symptoms}</p>}
              </div>
              <StatusBadge status={apt.status} />
            </div>
          ))}
          {(!data?.todayAppointments || data.todayAppointments.length === 0) && (
            <p className="text-gray-400 text-center py-6">Không có lịch hẹn hôm nay</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
