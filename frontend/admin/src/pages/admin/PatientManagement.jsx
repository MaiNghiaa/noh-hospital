// frontend/src/pages/admin/PatientManagement.jsx
import { useState, useEffect, useCallback } from 'react';
import { Eye, ToggleLeft, ToggleRight } from 'lucide-react';
import api from '../../utils/api';
import { DataTable, SearchInput, Pagination, StatusBadge } from '../../components/admin';

const PatientManagement = () => {
  const [patients, setPatients] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [detail, setDetail] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/patients', { params: { page: pagination.page, search: search || undefined } });
      setPatients(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [pagination.page, search]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleToggle = async (id) => {
    try { await api.patch(`/admin/patients/${id}/toggle`); fetchData(); }
    catch (err) { alert(err.response?.data?.message || 'Có lỗi'); }
  };

  const viewDetail = async (id) => {
    try {
      const [patientRes, appointmentsRes] = await Promise.all([
        api.get(`/admin/patients/${id}`),
        api.get(`/admin/patients/${id}/appointments`),
      ]);
      setDetail({ ...patientRes.data.data, appointments: appointmentsRes.data.data });
    } catch (err) { console.error(err); }
  };

  const columns = [
    { key: 'full_name', title: 'Họ tên', render: (val) => <span className="font-medium text-gray-800">{val}</span> },
    { key: 'email', title: 'Email' },
    { key: 'phone', title: 'SĐT' },
    { key: 'gender', title: 'Giới tính', render: (val) => ({ male: 'Nam', female: 'Nữ', other: 'Khác' }[val] || '—') },
    { key: 'is_active', title: 'Trạng thái', render: (val) => <StatusBadge status={val ? 'active' : 'inactive'} type="user" /> },
    { key: 'created_at', title: 'Ngày tạo', render: (val) => val ? new Date(val).toLocaleDateString('vi-VN') : '—' },
    { key: 'actions', title: 'Thao tác', render: (_, row) => (
      <div className="flex items-center gap-1">
        <button onClick={() => viewDetail(row.id)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Eye size={16} /></button>
        <button onClick={() => handleToggle(row.id)} className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg">
          {row.is_active ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
        </button>
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Quản lý Bệnh nhân</h1>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <div className="mb-4 max-w-sm">
          <SearchInput value={search} onChange={(v) => { setSearch(v); setPagination(p => ({ ...p, page: 1 })); }} placeholder="Tìm tên, SĐT, email..." />
        </div>
        <DataTable columns={columns} data={patients} loading={loading} />
        <Pagination currentPage={pagination.page} totalPages={pagination.totalPages} onPageChange={(p) => setPagination(prev => ({ ...prev, page: p }))} />
      </div>

      {/* Detail */}
      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={() => setDetail(null)} />
          <div className="relative bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Hồ sơ bệnh nhân: {detail.full_name}</h3>
            <div className="grid grid-cols-2 gap-4 text-sm mb-6">
              <div><span className="text-gray-500">Email:</span> {detail.email}</div>
              <div><span className="text-gray-500">SĐT:</span> {detail.phone || '—'}</div>
              <div><span className="text-gray-500">Ngày sinh:</span> {detail.date_of_birth ? new Date(detail.date_of_birth).toLocaleDateString('vi-VN') : '—'}</div>
              <div><span className="text-gray-500">Giới tính:</span> {({ male: 'Nam', female: 'Nữ' }[detail.gender]) || '—'}</div>
              <div><span className="text-gray-500">BHYT:</span> {detail.insurance_number || '—'}</div>
              <div><span className="text-gray-500">Nhóm máu:</span> {detail.blood_type || '—'}</div>
              <div className="col-span-2"><span className="text-gray-500">Địa chỉ:</span> {detail.address || '—'}</div>
              {detail.allergies && <div className="col-span-2"><span className="text-gray-500">Dị ứng:</span> <span className="text-red-600">{detail.allergies}</span></div>}
            </div>
            {detail.appointments?.length > 0 && (
              <>
                <h4 className="font-semibold text-gray-800 mb-2">Lịch sử khám ({detail.appointments.length})</h4>
                <div className="space-y-2">
                  {detail.appointments.slice(0, 5).map((apt) => (
                    <div key={apt.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg text-sm">
                      <div>
                        <p className="font-medium">{apt.doctor_name || '—'} - {apt.department_name || '—'}</p>
                        <p className="text-xs text-gray-400">{apt.appointment_date ? new Date(apt.appointment_date).toLocaleDateString('vi-VN') : ''}</p>
                      </div>
                      <StatusBadge status={apt.status} />
                    </div>
                  ))}
                </div>
              </>
            )}
            <div className="mt-6 text-right">
              <button onClick={() => setDetail(null)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Đóng</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientManagement;
