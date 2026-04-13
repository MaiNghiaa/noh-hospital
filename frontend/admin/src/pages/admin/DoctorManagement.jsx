// frontend/src/pages/admin/DoctorManagement.jsx
import { useState, useEffect, useCallback } from 'react';
import { Plus, Edit, Trash2, Image as ImageIcon, ToggleLeft, ToggleRight } from 'lucide-react';
import api from '../../utils/api';
import { DataTable, SearchInput, Pagination, ConfirmModal, FormModal, StatusBadge } from '../../components/admin';

const DOCTOR_TITLES = [
  'GS.TS',
  'PGS.TS',
  'TS.BS',
  'ThS.BS',
  'BSCKII',
  'BSCKI',
  'BS',
];

const DOCTOR_SPECIALTIES = [
  'Tai mũi họng',
  'Họng - Thanh quản',
  'Mũi Xoang',
  'Tai - Phẫu thuật tai',
  'Tai thần kinh',
  'TMH Trẻ em',
  'Ung bướu Đầu Cổ',
  'Nội soi TMH',
  'Thính - Thanh học',
  'Cấp cứu TMH',
  'Gây mê hồi sức',
  'Chẩn đoán hình ảnh TMH',
  'Xét nghiệm TMH',
];

const DoctorManagement = () => {
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [form, setForm] = useState({ name: '', title: '', department_id: '', specialty: '', phone: '', email: '', password: '', description: '' });
  const [avatarFile, setAvatarFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fetchDoctors = useCallback(async () => {
    setLoading(true);
    try {
      const [docRes, deptRes] = await Promise.all([
        api.get('/doctors', { params: { search } }),
        api.get('/departments'),
      ]);
      setDoctors(docRes.data.data || docRes.data);
      setDepartments(deptRes.data.data || deptRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => { fetchDoctors(); }, [fetchDoctors]);

  const openAddForm = () => {
    setEditingDoctor(null);
    setForm({ name: '', title: '', department_id: '', specialty: '', phone: '', email: '', password: '', description: '' });
    setAvatarFile(null);
    setShowForm(true);
  };

  const openEditForm = (doc) => {
    setEditingDoctor(doc);
    setForm({ name: doc.name, title: doc.title || '', department_id: doc.department_id || '', specialty: doc.specialty || '', phone: doc.phone || '', email: doc.email || '', password: '', description: doc.description || '' });
    setAvatarFile(null);
    setShowForm(true);
  };

  const uploadAvatarIfNeeded = async () => {
    if (!avatarFile) return null;
    const fd = new FormData();
    fd.append('image', avatarFile);
    setUploading(true);
    try {
      const res = await api.post('/admin/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      return res.data.url;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    setFormLoading(true);
    try {
      const avatarUrl = await uploadAvatarIfNeeded();
      if (editingDoctor) {
        await api.put(`/admin/doctors/${editingDoctor.id}`, { ...form, image: avatarUrl || form.image });
      } else {
        await api.post('/admin/doctors', { full_name: form.name, ...form, avatar_url: avatarUrl || '' });
      }
      setShowForm(false);
      fetchDoctors();
    } catch (err) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/admin/doctors/${confirmDelete.id}`);
      setConfirmDelete(null);
      fetchDoctors();
    } catch (err) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const handleToggle = async (id) => {
    try {
      await api.patch(`/admin/doctors/${id}/toggle`);
      fetchDoctors();
    } catch (err) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const columns = [
    { key: 'name', title: 'Họ và tên', render: (val, row) => (
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">
          {val?.charAt(0)}
        </div>
        <div>
          <p className="font-medium text-gray-800">{val}</p>
          <p className="text-xs text-gray-400">{row.title}</p>
        </div>
      </div>
    )},
    { key: 'specialty', title: 'Chuyên ngành' },
    { key: 'email', title: 'Email' },
    { key: 'phone', title: 'SĐT' },
    { key: 'status', title: 'Trạng thái', render: (val) => <StatusBadge status={val === 'active' ? 'active' : 'inactive'} type="user" /> },
    { key: 'actions', title: 'Thao tác', render: (_, row) => (
      <div className="flex items-center gap-1">
        <button onClick={() => openEditForm(row)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={16} /></button>
        <button
          onClick={() => handleToggle(row.id)}
          className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg"
          title={row.status === 'active' ? 'Ngừng hoạt động' : 'Kích hoạt'}
        >
          {(row.is_active ?? (row.status === 'active')) ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
        </button>
        <button onClick={() => setConfirmDelete(row)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Bác sĩ</h1>
        <button onClick={openAddForm} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition">
          <Plus size={18} /> Thêm bác sĩ
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <div className="mb-4 max-w-sm">
          <SearchInput value={search} onChange={setSearch} placeholder="Tìm theo tên, email..." />
        </div>
        <DataTable columns={columns} data={doctors} loading={loading} />
      </div>

      {/* Form Modal */}
      <FormModal isOpen={showForm} title={editingDoctor ? 'Chỉnh sửa bác sĩ' : 'Thêm bác sĩ mới'} onClose={() => setShowForm(false)} onSubmit={handleSubmit} loading={formLoading}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên *</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Học hàm/Học vị</label>
            <select
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Chọn</option>
              {DOCTOR_TITLES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
              <option value="Khác">Khác</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Chuyên khoa</label>
            <select value={form.department_id} onChange={(e) => setForm({ ...form, department_id: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none">
              <option value="">Chọn chuyên khoa</option>
              {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Chuyên ngành</label>
            <select
              value={form.specialty}
              onChange={(e) => setForm({ ...form, specialty: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Chọn</option>
              {DOCTOR_SPECIALTIES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
              <option value="Khác">Khác</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
            <input type="text" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          {!editingDoctor && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu *</label>
              <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          )}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Ảnh đại diện</label>
            <div className="flex items-center gap-3">
              <label className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm cursor-pointer hover:bg-gray-50">
                <ImageIcon size={16} />
                {uploading ? 'Đang upload...' : 'Chọn ảnh'}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={uploading}
                  onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
                />
              </label>
              <span className="text-sm text-gray-500">
                {avatarFile ? avatarFile.name : 'Chưa chọn ảnh'}
              </span>
            </div>
          </div>
        </div>
      </FormModal>

      {/* Confirm Delete */}
      <ConfirmModal isOpen={!!confirmDelete} title="Xóa bác sĩ" message={`Bạn có chắc chắn muốn ẩn bác sĩ "${confirmDelete?.name}"?`}
        onConfirm={handleDelete} onClose={() => setConfirmDelete(null)} confirmText="Xóa" danger />
    </div>
  );
};

export default DoctorManagement;
