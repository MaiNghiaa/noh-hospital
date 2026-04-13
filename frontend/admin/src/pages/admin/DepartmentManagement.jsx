// frontend/src/pages/admin/DepartmentManagement.jsx
import { useState, useEffect, useCallback } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import api from '../../utils/api';
import { DataTable, ConfirmModal, FormModal, StatusBadge } from '../../components/admin';

const DepartmentManagement = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', image: '', display_order: 0 });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/departments');
      setDepartments(res.data.data || res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openAdd = () => { setEditing(null); setForm({ name: '', description: '', image: '', display_order: 0 }); setShowForm(true); };
  const openEdit = (d) => { setEditing(d); setForm({ name: d.name, description: d.description || '', image: d.image || '', display_order: d.display_order || 0 }); setShowForm(true); };

  const handleSubmit = async () => {
    setFormLoading(true);
    try {
      if (editing) await api.put(`/admin/departments/${editing.id}`, form);
      else await api.post('/admin/departments', form);
      setShowForm(false); fetchData();
    } catch (err) { alert(err.response?.data?.message || 'Có lỗi'); }
    finally { setFormLoading(false); }
  };

  const handleDelete = async () => {
    try { await api.delete(`/admin/departments/${confirmDelete.id}`); setConfirmDelete(null); fetchData(); }
    catch (err) { alert(err.response?.data?.message || 'Có lỗi'); }
  };

  const columns = [
    { key: 'name', title: 'Tên chuyên khoa', render: (val) => <span className="font-medium text-gray-800">{val}</span> },
    { key: 'description', title: 'Mô tả', render: (val) => <span className="text-sm text-gray-500 line-clamp-2">{val || '—'}</span> },
    { key: 'display_order', title: 'Thứ tự' },
    { key: 'status', title: 'Trạng thái', render: (val) => <StatusBadge status={val === 'active' ? 'active' : 'inactive'} type="user" /> },
    { key: 'actions', title: 'Thao tác', render: (_, row) => (
      <div className="flex items-center gap-1">
        <button onClick={() => openEdit(row)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={16} /></button>
        <button onClick={() => setConfirmDelete(row)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Chuyên Khoa</h1>
        <button onClick={openAdd} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition">
          <Plus size={18} /> Thêm chuyên khoa
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <DataTable columns={columns} data={departments} loading={loading} />
      </div>
      <FormModal isOpen={showForm} title={editing ? 'Chỉnh sửa chuyên khoa' : 'Thêm chuyên khoa'} onClose={() => setShowForm(false)} onSubmit={handleSubmit} loading={formLoading}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tên chuyên khoa *</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Thứ tự hiển thị</label>
            <input type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
        </div>
      </FormModal>
      <ConfirmModal isOpen={!!confirmDelete} title="Xóa chuyên khoa" message={`Bạn có chắc muốn ẩn chuyên khoa "${confirmDelete?.name}"?`}
        onConfirm={handleDelete} onClose={() => setConfirmDelete(null)} confirmText="Xóa" danger />
    </div>
  );
};

export default DepartmentManagement;
