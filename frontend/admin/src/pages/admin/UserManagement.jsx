// frontend/src/pages/admin/UserManagement.jsx
import { useState, useEffect, useCallback } from 'react';
import { Plus, ToggleLeft, ToggleRight, KeyRound } from 'lucide-react';
import api from '../../utils/api';
import { DataTable, SearchInput, Pagination, FormModal, StatusBadge, ConfirmModal } from '../../components/admin';

const ROLES = [
  { value: 'super_admin', label: 'Super Admin' },
  { value: 'admin', label: 'Admin' },
  { value: 'doctor', label: 'Bác sĩ' },
  { value: 'patient', label: 'Bệnh nhân' },
];

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(null);
  const [form, setForm] = useState({ email: '', password: '', role: 'admin', full_name: '', phone: '' });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/users', { params: { page: pagination.page, search: search || undefined, role: roleFilter || undefined } });
      setUsers(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [pagination.page, search, roleFilter]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleCreate = async () => {
    setFormLoading(true);
    try {
      await api.post('/admin/users', form);
      setShowForm(false); fetchData();
    } catch (err) { alert(err.response?.data?.message || 'Có lỗi'); }
    finally { setFormLoading(false); }
  };

  const handleToggle = async (id) => {
    try { await api.patch(`/admin/users/${id}/toggle`); fetchData(); }
    catch (err) { alert(err.response?.data?.message || 'Có lỗi'); }
  };

  const handleResetPassword = async () => {
    try {
      const res = await api.patch(`/admin/users/${resetConfirm.id}/reset-password`);
      alert(`Mật khẩu mới: ${res.data.temporaryPassword}`);
      setResetConfirm(null);
    } catch (err) { alert(err.response?.data?.message || 'Có lỗi'); }
  };

  const columns = [
    { key: 'full_name', title: 'Họ tên', render: (val) => <span className="font-medium text-gray-800">{val}</span> },
    { key: 'email', title: 'Email' },
    { key: 'role', title: 'Vai trò', render: (val) => (
      <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        {ROLES.find(r => r.value === val)?.label || val}
      </span>
    )},
    { key: 'is_active', title: 'Trạng thái', render: (val) => <StatusBadge status={val ? 'active' : 'inactive'} type="user" /> },
    { key: 'last_login', title: 'Lần đăng nhập cuối', render: (val) => val ? new Date(val).toLocaleString('vi-VN') : 'Chưa đăng nhập' },
    { key: 'actions', title: 'Thao tác', render: (_, row) => (
      <div className="flex items-center gap-1">
        <button onClick={() => handleToggle(row.id)} className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg">
          {row.is_active ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
        </button>
        <button onClick={() => setResetConfirm(row)} className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg" title="Reset mật khẩu">
          <KeyRound size={16} />
        </button>
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Người Dùng</h1>
        <button onClick={() => { setForm({ email: '', password: '', role: 'admin', full_name: '', phone: '' }); setShowForm(true); }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition">
          <Plus size={18} /> Tạo tài khoản
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="max-w-sm flex-1">
            <SearchInput value={search} onChange={(v) => { setSearch(v); setPagination(p => ({ ...p, page: 1 })); }} placeholder="Tìm tên, email..." />
          </div>
          <select value={roleFilter} onChange={(e) => { setRoleFilter(e.target.value); setPagination(p => ({ ...p, page: 1 })); }}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none">
            <option value="">Tất cả vai trò</option>
            {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
        </div>
        <DataTable columns={columns} data={users} loading={loading} />
        <Pagination currentPage={pagination.page} totalPages={pagination.totalPages} onPageChange={(p) => setPagination(prev => ({ ...prev, page: p }))} />
      </div>

      <FormModal isOpen={showForm} title="Tạo tài khoản mới" onClose={() => setShowForm(false)} onSubmit={handleCreate} loading={formLoading}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên *</label>
            <input type="text" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu *</label>
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vai trò *</label>
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none">
              <option value="admin">Admin</option>
              <option value="doctor">Bác sĩ</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
            <input type="text" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
        </div>
      </FormModal>

      <ConfirmModal isOpen={!!resetConfirm} title="Reset mật khẩu" message={`Reset mật khẩu cho tài khoản "${resetConfirm?.full_name}"? Mật khẩu mới sẽ là NOH@2026.`}
        onConfirm={handleResetPassword} onClose={() => setResetConfirm(null)} confirmText="Reset" />
    </div>
  );
};

export default UserManagement;
