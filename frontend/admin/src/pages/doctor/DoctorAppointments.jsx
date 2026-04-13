// frontend/src/pages/doctor/DoctorAppointments.jsx
import { useState, useEffect, useCallback } from 'react';
import { ClipboardEdit } from 'lucide-react';
import api from '../../utils/api';
import { DataTable, StatusBadge } from '../../components/admin';

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [showRecordForm, setShowRecordForm] = useState(null);
  const [recordForm, setRecordForm] = useState({ symptoms: '', diagnosis: '', treatment: '', notes: '', follow_up_date: '' });
  const [formLoading, setFormLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/doctor/appointments', { params: { status: statusFilter || undefined } });
      setAppointments(res.data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [statusFilter]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleCreateRecord = async () => {
    setFormLoading(true);
    try {
      await api.post('/doctor/records', {
        appointment_id: showRecordForm.id,
        patient_id: showRecordForm.patient_id,
        ...recordForm,
      });
      setShowRecordForm(null);
      setRecordForm({ symptoms: '', diagnosis: '', treatment: '', notes: '', follow_up_date: '' });
      fetchData();
    } catch (err) { alert(err.response?.data?.message || 'Có lỗi'); }
    finally { setFormLoading(false); }
  };

  const columns = [
    { key: 'patient_name', title: 'Bệnh nhân', render: (val, row) => (
      <div><p className="font-medium text-gray-800">{val}</p><p className="text-xs text-gray-400">{row.patient_phone}</p></div>
    )},
    { key: 'appointment_date', title: 'Ngày khám', render: (val) => val ? new Date(val).toLocaleDateString('vi-VN') : '—' },
    { key: 'appointment_time', title: 'Giờ khám' },
    { key: 'department_name', title: 'Chuyên khoa', render: (val) => val || '—' },
    { key: 'status', title: 'Trạng thái', render: (val) => <StatusBadge status={val} /> },
    { key: 'actions', title: 'Thao tác', render: (_, row) => (
      (row.status === 'confirmed' || row.status === 'in_progress') && (
        <button onClick={() => { setShowRecordForm(row); setRecordForm({ symptoms: row.symptoms || '', diagnosis: '', treatment: '', notes: '', follow_up_date: '' }); }}
          className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg">
          <ClipboardEdit size={16} /> Nhập kết quả
        </button>
      )
    )},
  ];

  const statuses = [
    { value: '', label: 'Tất cả' },
    { value: 'confirmed', label: 'Đã xác nhận' },
    { value: 'in_progress', label: 'Đang khám' },
    { value: 'completed', label: 'Hoàn thành' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Lịch hẹn của tôi</h1>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <div className="flex gap-2 mb-4">
          {statuses.map(s => (
            <button key={s.value} onClick={() => setStatusFilter(s.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${statusFilter === s.value ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {s.label}
            </button>
          ))}
        </div>
        <DataTable columns={columns} data={appointments} loading={loading} />
      </div>

      {/* Record Form */}
      {showRecordForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowRecordForm(null)} />
          <div className="relative bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Nhập kết quả khám</h3>
            <p className="text-sm text-gray-500 mb-4">Bệnh nhân: <span className="font-medium">{showRecordForm.patient_name}</span></p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Triệu chứng</label>
                <textarea value={recordForm.symptoms} onChange={(e) => setRecordForm({ ...recordForm, symptoms: e.target.value })} rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Chẩn đoán *</label>
                <textarea value={recordForm.diagnosis} onChange={(e) => setRecordForm({ ...recordForm, diagnosis: e.target.value })} rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phương pháp điều trị</label>
                <textarea value={recordForm.treatment} onChange={(e) => setRecordForm({ ...recordForm, treatment: e.target.value })} rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
                <textarea value={recordForm.notes} onChange={(e) => setRecordForm({ ...recordForm, notes: e.target.value })} rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ngày tái khám</label>
                <input type="date" value={recordForm.follow_up_date} onChange={(e) => setRecordForm({ ...recordForm, follow_up_date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <button onClick={() => setShowRecordForm(null)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Hủy</button>
              <button onClick={handleCreateRecord} disabled={formLoading || !recordForm.diagnosis}
                className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50">
                {formLoading ? 'Đang lưu...' : 'Lưu kết quả'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorAppointments;
