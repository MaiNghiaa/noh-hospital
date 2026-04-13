// frontend/src/pages/admin/AppointmentManagement.jsx
import { useState, useEffect, useCallback } from 'react';
import { Check, X, Eye, Filter } from 'lucide-react';
import api from '../../utils/api';
import { DataTable, SearchInput, Pagination, ConfirmModal, StatusBadge } from '../../components/admin';

const AppointmentManagement = () => {
  const [appointments, setAppointments] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [confirmAction, setConfirmAction] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [detail, setDetail] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/appointments', {
        params: { page: pagination.page, status: statusFilter || undefined, search: search || undefined },
      });
      setAppointments(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, statusFilter, search]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleConfirm = async (id) => {
    try {
      await api.patch(`/admin/appointments/${id}/confirm`);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const handleCancel = async () => {
    try {
      await api.patch(`/admin/appointments/${confirmAction.id}/cancel`, { cancel_reason: cancelReason });
      setConfirmAction(null);
      setCancelReason('');
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const viewDetail = async (id) => {
    try {
      const res = await api.get(`/admin/appointments/${id}`);
      setDetail(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const columns = [
    { key: 'patient_name', title: 'Bệnh nhân', render: (val, row) => (
      <div>
        <p className="font-medium text-gray-800">{val}</p>
        <p className="text-xs text-gray-400">{row.patient_phone}</p>
      </div>
    )},
    { key: 'doctor_name', title: 'Bác sĩ', render: (val) => val || '—' },
    { key: 'department_name', title: 'Chuyên khoa', render: (val) => val || '—' },
    { key: 'appointment_date', title: 'Ngày khám', render: (val, row) => (
      <div>
        <p className="text-sm">{val ? new Date(val).toLocaleDateString('vi-VN') : '—'}</p>
        <p className="text-xs text-gray-400">{row.appointment_time || ''}</p>
      </div>
    )},
    { key: 'status', title: 'Trạng thái', render: (val) => <StatusBadge status={val} /> },
    { key: 'actions', title: 'Thao tác', render: (_, row) => (
      <div className="flex items-center gap-1">
        <button onClick={() => viewDetail(row.id)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"><Eye size={16} /></button>
        {row.status === 'pending' && (
          <>
            <button onClick={() => handleConfirm(row.id)} className="p-2 text-green-600 hover:bg-green-50 rounded-lg" title="Xác nhận"><Check size={16} /></button>
            <button onClick={() => setConfirmAction(row)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Hủy"><X size={16} /></button>
          </>
        )}
      </div>
    )},
  ];

  const statuses = [
    { value: '', label: 'Tất cả' },
    { value: 'pending', label: 'Chờ xác nhận' },
    { value: 'confirmed', label: 'Đã xác nhận' },
    { value: 'in_progress', label: 'Đang khám' },
    { value: 'completed', label: 'Hoàn thành' },
    { value: 'cancelled', label: 'Đã hủy' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Quản lý Lịch Khám</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="max-w-sm flex-1">
            <SearchInput value={search} onChange={(v) => { setSearch(v); setPagination(p => ({ ...p, page: 1 })); }} placeholder="Tìm tên, SĐT, email..." />
          </div>
          <div className="flex gap-2 flex-wrap">
            {statuses.map((s) => (
              <button
                key={s.value}
                onClick={() => { setStatusFilter(s.value); setPagination(p => ({ ...p, page: 1 })); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  statusFilter === s.value ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <DataTable columns={columns} data={appointments} loading={loading} />
        <Pagination currentPage={pagination.page} totalPages={pagination.totalPages} onPageChange={(p) => setPagination(prev => ({ ...prev, page: p }))} />
      </div>

      {/* Cancel Modal */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={() => setConfirmAction(null)} />
          <div className="relative bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Hủy lịch hẹn</h3>
            <p className="text-sm text-gray-600 mb-3">Lý do hủy lịch hẹn của "{confirmAction.patient_name}":</p>
            <textarea value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none mb-4" placeholder="Nhập lý do..." />
            <div className="flex gap-3 justify-end">
              <button onClick={() => setConfirmAction(null)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Đóng</button>
              <button onClick={handleCancel} className="px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 rounded-lg">Xác nhận hủy</button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={() => setDetail(null)} />
          <div className="relative bg-white rounded-xl shadow-xl p-6 w-full max-w-lg mx-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Chi tiết lịch hẹn #{detail.id}</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Bệnh nhân:</span><span className="font-medium">{detail.patient_name}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">SĐT:</span><span>{detail.patient_phone}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Email:</span><span>{detail.patient_email}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Bác sĩ:</span><span>{detail.doctor_name || '—'}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Chuyên khoa:</span><span>{detail.department_name || '—'}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Ngày khám:</span><span>{detail.appointment_date ? new Date(detail.appointment_date).toLocaleDateString('vi-VN') : '—'}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Giờ khám:</span><span>{detail.appointment_time || '—'}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Trạng thái:</span><StatusBadge status={detail.status} /></div>
              {detail.symptoms && <div><span className="text-gray-500">Triệu chứng:</span><p className="mt-1">{detail.symptoms}</p></div>}
              {detail.cancel_reason && <div><span className="text-gray-500">Lý do hủy:</span><p className="mt-1 text-red-600">{detail.cancel_reason}</p></div>}
            </div>
            <div className="mt-6 text-right">
              <button onClick={() => setDetail(null)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Đóng</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentManagement;
