// frontend/user/src/pages/auth/MyAppointmentsPage.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, ChevronLeft, X, Clock, MapPin } from 'lucide-react';
import patientService from '../../services/patientService';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  confirmed: 'bg-blue-100 text-blue-700 border-blue-200',
  in_progress: 'bg-purple-100 text-purple-700 border-purple-200',
  completed: 'bg-green-100 text-green-700 border-green-200',
  cancelled: 'bg-red-100 text-red-700 border-red-200',
};

const statusLabels = {
  pending: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  in_progress: 'Đang khám',
  completed: 'Hoàn thành',
  cancelled: 'Đã hủy',
};

export default function MyAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await patientService.getMyAppointments();
      setAppointments(res.data || []);
    } catch (err) {
      console.error('Failed to fetch appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy lịch hẹn này?')) return;
    try {
      setCancellingId(id);
      await patientService.cancelAppointment(id, 'Bệnh nhân tự hủy');
      await fetchAppointments();
    } catch (err) {
      alert(err.message || 'Không thể hủy lịch hẹn');
    } finally {
      setCancellingId(null);
    }
  };

  const filtered = filter === 'all' ? appointments : appointments.filter((a) => a.status === filter);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link to="/tai-khoan" className="p-2 hover:bg-gray-200 rounded-lg transition">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Lịch hẹn của tôi</h1>
            <p className="text-sm text-gray-500">{appointments.length} lịch hẹn</p>
          </div>
        </div>

        {/* Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
          {[
            { key: 'all', label: 'Tất cả' },
            { key: 'pending', label: 'Chờ xác nhận' },
            { key: 'confirmed', label: 'Đã xác nhận' },
            { key: 'completed', label: 'Hoàn thành' },
            { key: 'cancelled', label: 'Đã hủy' },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                filter === f.key ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* List */}
        {filtered.length > 0 ? (
          <div className="space-y-4">
            {filtered.map((appt) => (
              <div key={appt.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[appt.status]}`}>
                          {statusLabels[appt.status]}
                        </span>
                        <span className="text-xs text-gray-400">#{appt.id}</span>
                      </div>
                      <h3 className="font-semibold text-gray-900">{appt.department_name || appt.department}</h3>
                      {appt.doctor_name && (
                        <p className="text-sm text-gray-600 mt-1">
                          {appt.doctor_title} {appt.doctor_name}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <CalendarDays className="w-4 h-4" />
                          {new Date(appt.appointment_date).toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })}
                        </span>
                        {appt.appointment_time && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {appt.appointment_time.slice(0, 5)}
                          </span>
                        )}
                      </div>
                      {appt.reason && <p className="text-sm text-gray-500 mt-2 italic">"{appt.reason}"</p>}
                    </div>

                    {/* Cancel button */}
                    {['pending', 'confirmed'].includes(appt.status) && (
                      <button
                        onClick={() => handleCancel(appt.id)}
                        disabled={cancellingId === appt.id}
                        className="flex items-center gap-1 px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition disabled:opacity-50"
                      >
                        <X className="w-4 h-4" />
                        {cancellingId === appt.id ? 'Đang hủy...' : 'Hủy'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-12 text-center border border-gray-100">
            <CalendarDays className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">Không có lịch hẹn nào</p>
            <Link to="/dat-lich-kham" className="inline-block px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm">
              Đặt lịch khám
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
