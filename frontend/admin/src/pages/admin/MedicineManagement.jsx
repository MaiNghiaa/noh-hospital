// frontend/src/pages/admin/MedicineManagement.jsx
import { useState, useEffect, useCallback } from 'react';
import { Plus, Edit, PackagePlus } from 'lucide-react';
import api from '../../utils/api';
import { DataTable, SearchInput, FormModal } from '../../components/admin';

const MedicineManagement = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [stockInTarget, setStockInTarget] = useState(null);
  const [stockInQty, setStockInQty] = useState(0);
  const [formLoading, setFormLoading] = useState(false);
  const [form, setForm] = useState({ name: '', active_ingredient: '', unit: 'viên', category: '', description: '', stock_quantity: 0 });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/medicines', { params: { search: search || undefined } });
      setMedicines(res.data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [search]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openAdd = () => { setEditing(null); setForm({ name: '', active_ingredient: '', unit: 'viên', category: '', description: '', stock_quantity: 0 }); setShowForm(true); };
  const openEdit = (m) => { setEditing(m); setForm({ name: m.name, active_ingredient: m.active_ingredient || '', unit: m.unit, category: m.category || '', description: m.description || '', stock_quantity: m.stock_quantity ?? 0 }); setShowForm(true); };

  const handleSubmit = async () => {
    setFormLoading(true);
    try {
      if (editing) await api.put(`/admin/medicines/${editing.id}`, form);
      else await api.post('/admin/medicines', form);
      setShowForm(false); fetchData();
    } catch (err) { alert(err.response?.data?.message || 'Có lỗi'); }
    finally { setFormLoading(false); }
  };

  const handleStockIn = async () => {
    if (!stockInTarget) return;
    setFormLoading(true);
    try {
      await api.patch(`/admin/medicines/${stockInTarget.id}/stock-in`, { quantity: Number(stockInQty) || 0 });
      setStockInTarget(null);
      setStockInQty(0);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Có lỗi');
    } finally {
      setFormLoading(false);
    }
  };

  const columns = [
    { key: 'name', title: 'Tên thuốc', render: (val) => <span className="font-medium text-gray-800">{val}</span> },
    { key: 'active_ingredient', title: 'Hoạt chất' },
    { key: 'unit', title: 'Đơn vị' },
    { key: 'category', title: 'Phân loại' },
    { key: 'stock_quantity', title: 'Tồn kho', render: (val) => <span className="font-medium text-gray-800">{val ?? 0}</span> },
    { key: 'is_active', title: 'Trạng thái', render: (val) => (
      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${val ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
        {val ? 'Hoạt động' : 'Ngừng'}
      </span>
    )},
    { key: 'actions', title: 'Thao tác', render: (_, row) => (
      <div className="flex items-center gap-1">
        <button onClick={() => openEdit(row)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="Chỉnh sửa">
          <Edit size={16} />
        </button>
        <button
          onClick={() => { setStockInTarget(row); setStockInQty(0); }}
          className="p-2 text-green-700 hover:bg-green-50 rounded-lg"
          title="Nhập kho"
        >
          <PackagePlus size={16} />
        </button>
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Danh mục Thuốc</h1>
        <button onClick={openAdd} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition">
          <Plus size={18} /> Thêm thuốc
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <div className="mb-4 max-w-sm">
          <SearchInput value={search} onChange={setSearch} placeholder="Tìm thuốc..." />
        </div>
        <DataTable columns={columns} data={medicines} loading={loading} />
      </div>
      <FormModal isOpen={showForm} title={editing ? 'Chỉnh sửa thuốc' : 'Thêm thuốc mới'} onClose={() => setShowForm(false)} onSubmit={handleSubmit} loading={formLoading}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tên thuốc *</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hoạt chất</label>
              <input type="text" value={form.active_ingredient} onChange={(e) => setForm({ ...form, active_ingredient: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Đơn vị *</label>
              <select value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="viên">Viên</option>
                <option value="lọ">Lọ</option>
                <option value="gói">Gói</option>
                <option value="ml">ml</option>
                <option value="ống">Ống</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tồn kho</label>
            <input
              type="number"
              min={0}
              value={form.stock_quantity}
              onChange={(e) => setForm({ ...form, stock_quantity: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phân loại</label>
            <input type="text" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="VD: Kháng sinh, Giảm đau..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
        </div>
      </FormModal>

      <FormModal
        isOpen={!!stockInTarget}
        title={`Nhập kho: ${stockInTarget?.name || ''}`}
        onClose={() => setStockInTarget(null)}
        onSubmit={handleStockIn}
        loading={formLoading}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng nhập</label>
            <input
              type="number"
              min={1}
              value={stockInQty}
              onChange={(e) => setStockInQty(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <p className="text-xs text-gray-500">Hệ thống sẽ cộng thêm vào tồn kho hiện tại.</p>
        </div>
      </FormModal>
    </div>
  );
};

export default MedicineManagement;
