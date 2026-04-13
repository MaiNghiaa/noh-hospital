// frontend/src/pages/admin/NewsManagement.jsx
import { useState, useEffect, useCallback } from 'react';
import { Plus, Edit, Trash2, Globe, GlobeLock } from 'lucide-react';
import api from '../../utils/api';
import { DataTable, ConfirmModal, FormModal } from '../../components/admin';

const NEWS_CATEGORIES = [
  { value: 'tin-tuc-su-kien', label: 'Tin tức - Sự kiện' },
  { value: 'nghien-cuu-khoa-hoc', label: 'Nghiên cứu Khoa học' },
  { value: 'thong-tin-thuoc', label: 'Thông tin Thuốc' },
  { value: 'hop-tac-quoc-te', label: 'Hợp tác Quốc tế' },
  { value: 'dao-tao-chi-dao-tuyen', label: 'Đào tạo - Chỉ đạo tuyến' },
];

const NewsManagement = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [form, setForm] = useState({ title: '', slug: '', content: '', category: '', summary: '', thumbnail: '' });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/news');
      setNews(res.data.data || res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openAdd = () => { setEditing(null); setForm({ title: '', slug: '', content: '', category: '', summary: '', thumbnail: '' }); setShowForm(true); };
  const openEdit = (n) => { setEditing(n); setForm({ title: n.title, slug: n.slug || '', content: n.content || '', category: n.category || '', summary: n.summary || '', thumbnail: n.thumbnail || '' }); setShowForm(true); };

  const handleSubmit = async () => {
    setFormLoading(true);
    try {
      if (editing) await api.put(`/admin/news/${editing.id}`, form);
      else await api.post('/admin/news', { ...form, published: false });
      setShowForm(false); fetchData();
    } catch (err) { alert(err.response?.data?.message || 'Có lỗi'); }
    finally { setFormLoading(false); }
  };

  const handleDelete = async () => {
    try { await api.delete(`/admin/news/${confirmDelete.id}`); setConfirmDelete(null); fetchData(); }
    catch (err) { alert(err.response?.data?.message || 'Có lỗi'); }
  };

  const handleTogglePublish = async (id) => {
    try { await api.patch(`/admin/news/${id}/publish`); fetchData(); }
    catch (err) { alert(err.response?.data?.message || 'Có lỗi'); }
  };

  const columns = [
    { key: 'title', title: 'Tiêu đề', render: (val) => <span className="font-medium text-gray-800 line-clamp-1">{val}</span> },
    { key: 'category', title: 'Danh mục', render: (val) => NEWS_CATEGORIES.find(c => c.value === val)?.label || val || '—' },
    { key: 'published', title: 'Xuất bản', render: (val) => (
      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${val ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
        {val ? 'Đã xuất bản' : 'Bản nháp'}
      </span>
    )},
    { key: 'created_at', title: 'Ngày tạo', render: (val) => val ? new Date(val).toLocaleDateString('vi-VN') : '—' },
    { key: 'actions', title: 'Thao tác', render: (_, row) => (
      <div className="flex items-center gap-1">
        <button onClick={() => openEdit(row)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={16} /></button>
        <button onClick={() => handleTogglePublish(row.id)} className="p-2 text-green-600 hover:bg-green-50 rounded-lg" title={row.published ? 'Gỡ bài' : 'Xuất bản'}>
          {row.published ? <GlobeLock size={16} /> : <Globe size={16} />}
        </button>
        <button onClick={() => setConfirmDelete(row)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Tin Tức</h1>
        <button onClick={openAdd} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition">
          <Plus size={18} /> Tạo bài viết
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <DataTable columns={columns} data={news} loading={loading} />
      </div>
      <FormModal isOpen={showForm} title={editing ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới'} onClose={() => setShowForm(false)} onSubmit={handleSubmit} loading={formLoading}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề *</label>
            <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none">
              <option value="">Chọn danh mục</option>
              {NEWS_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tóm tắt</label>
            <textarea value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung</label>
            <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Nhập nội dung bài viết..." />
          </div>
        </div>
      </FormModal>
      <ConfirmModal isOpen={!!confirmDelete} title="Xóa bài viết" message={`Bạn có chắc muốn xóa bài viết "${confirmDelete?.title}"?`}
        onConfirm={handleDelete} onClose={() => setConfirmDelete(null)} confirmText="Xóa" danger />
    </div>
  );
};

export default NewsManagement;
