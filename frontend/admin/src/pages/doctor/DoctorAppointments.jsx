// frontend/src/pages/doctor/DoctorAppointments.jsx
import { useState, useEffect, useCallback } from 'react';
import { ClipboardEdit, PlayCircle, CheckCircle, Plus, Trash2 } from 'lucide-react';
import api from '../../utils/api';
import { DataTable, StatusBadge } from '../../components/admin';

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [showRecordForm, setShowRecordForm] = useState(null);
  const [recordForm, setRecordForm] = useState({ symptoms: '', diagnosis: '', treatment: '', notes: '', follow_up_date: '' });
  const [medicines, setMedicines] = useState([]);
  const [rxItems, setRxItems] = useState([{ medicine_id: '', quantity: 1, dosage: '', duration_days: '', instruction: '' }]);
  const [quickMed, setQuickMed] = useState({ name: '', unit: 'viên' });
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

  const fetchMedicines = useCallback(async () => {
    try {
      const res = await api.get('/admin/medicines');
      // Only show active + in-stock medicines for prescribing
      setMedicines((res.data.data || []).filter((m) => m.is_active === 1 && (m.stock_quantity ?? 0) > 0));
    } catch (err) {
      console.error(err);
      setMedicines([]);
    }
  }, []);

  const handleCreateRecord = async () => {
    setFormLoading(true);
    try {
      // Ensure appointment is in progress before recording results
      if (showRecordForm.status === 'confirmed') {
        await api.patch(`/doctor/appointments/${showRecordForm.id}/start`);
      }
      const recordRes = await api.post('/doctor/records', {
        appointment_id: showRecordForm.id,
        patient_id: showRecordForm.patient_id,
        ...recordForm,
      });

      const recordId = recordRes.data?.recordId;
      const validItems = rxItems
        .filter((it) => it.medicine_id && it.dosage)
        .map((it) => ({
          medicine_id: Number(it.medicine_id),
          quantity: Number(it.quantity) || 1,
          dosage: String(it.dosage || '').trim(),
          duration_days: it.duration_days === '' ? null : Number(it.duration_days) || null,
          instruction: String(it.instruction || ''),
        }));

      if (recordId && validItems.length > 0) {
        await api.post('/doctor/prescriptions', { record_id: recordId, items: validItems });
      }

      setShowRecordForm(null);
      setRecordForm({ symptoms: '', diagnosis: '', treatment: '', notes: '', follow_up_date: '' });
      setRxItems([{ medicine_id: '', quantity: 1, dosage: '', duration_days: '', instruction: '' }]);
      setQuickMed({ name: '', unit: 'viên' });
      fetchData();
    } catch (err) { alert(err.response?.data?.message || 'Có lỗi'); }
    finally { setFormLoading(false); }
  };

  const handleQuickAddMedicine = async () => {
    if (!quickMed.name.trim()) return;
    setFormLoading(true);
    try {
      await api.post('/doctor/medicines', { name: quickMed.name.trim(), unit: quickMed.unit || 'viên' });
      await fetchMedicines();
      setQuickMed({ name: '', unit: quickMed.unit || 'viên' });
    } catch (err) {
      alert(err.response?.data?.message || 'Thêm thuốc thất bại');
    } finally {
      setFormLoading(false);
    }
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
      <div className="flex items-center gap-2">
        {row.status === 'confirmed' && (
          <button
            onClick={async () => {
              try {
                await api.patch(`/doctor/appointments/${row.id}/start`)
                fetchData()
              } catch (err) {
                alert(err.response?.data?.message || 'Có lỗi')
              }
            }}
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-purple-700 hover:bg-purple-50 rounded-lg"
          >
            <PlayCircle size={16} /> Đang khám
          </button>
        )}
        {row.status === 'in_progress' && (
          <button
            onClick={async () => {
              try {
                await api.patch(`/doctor/appointments/${row.id}/complete`)
                fetchData()
              } catch (err) {
                alert(err.response?.data?.message || 'Có lỗi')
              }
            }}
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-green-700 hover:bg-green-50 rounded-lg"
          >
            <CheckCircle size={16} /> Hoàn thành
          </button>
        )}
        {row.status === 'in_progress' && (
          <button
            onClick={() => {
              setShowRecordForm(row)
              setRecordForm({ symptoms: row.symptoms || '', diagnosis: '', treatment: '', notes: '', follow_up_date: '' })
              setRxItems([{ medicine_id: '', quantity: 1, dosage: '', duration_days: '', instruction: '' }])
              setQuickMed({ name: '', unit: 'viên' })
              fetchMedicines()
            }}
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg"
          >
            <ClipboardEdit size={16} /> Nhập kết quả
          </button>
        )}
      </div>
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

              {/* Medicines */}
              <div className="pt-2 border-t border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-800">Đơn thuốc</h4>
                  <button
                    type="button"
                    onClick={() =>
                      setRxItems((prev) => [...prev, { medicine_id: '', quantity: 1, dosage: '', duration_days: '', instruction: '' }])
                    }
                    className="inline-flex items-center gap-1 text-sm text-blue-600 hover:bg-blue-50 px-2 py-1 rounded-lg"
                  >
                    <Plus size={16} /> Thêm thuốc
                  </button>
                </div>

                <div className="space-y-3">
                  {rxItems.map((item, idx) => (
                    <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-2 bg-gray-50 p-3 rounded-lg">
                      <div className="md:col-span-5">
                        <label className="block text-xs font-medium text-gray-600 mb-1">Thuốc</label>
                        <select
                          value={item.medicine_id}
                          onChange={(e) => {
                            const v = e.target.value;
                            setRxItems((prev) => prev.map((it, i) => (i === idx ? { ...it, medicine_id: v } : it)));
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                          <option value="">-- Chọn thuốc --</option>
                          {medicines.map((m) => (
                            <option key={m.id} value={m.id}>
                              {m.name} {m.unit ? `(${m.unit})` : ''}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-gray-600 mb-1">SL</label>
                        <input
                          type="number"
                          min={1}
                          value={item.quantity}
                          onChange={(e) => setRxItems((prev) => prev.map((it, i) => (i === idx ? { ...it, quantity: e.target.value } : it)))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                      <div className="md:col-span-3">
                        <label className="block text-xs font-medium text-gray-600 mb-1">Liều dùng *</label>
                        <input
                          type="text"
                          value={item.dosage}
                          onChange={(e) => setRxItems((prev) => prev.map((it, i) => (i === idx ? { ...it, dosage: e.target.value } : it)))}
                          placeholder="VD: 1v x 2 lần/ngày"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                      <div className="md:col-span-2 flex items-end gap-2">
                        <div className="flex-1">
                          <label className="block text-xs font-medium text-gray-600 mb-1">Số ngày</label>
                          <input
                            type="number"
                            min={0}
                            value={item.duration_days}
                            onChange={(e) => setRxItems((prev) => prev.map((it, i) => (i === idx ? { ...it, duration_days: e.target.value } : it)))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => setRxItems((prev) => prev.filter((_, i) => i !== idx))}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          title="Xóa"
                          disabled={rxItems.length === 1}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="md:col-span-12">
                        <label className="block text-xs font-medium text-gray-600 mb-1">Hướng dẫn</label>
                        <input
                          type="text"
                          value={item.instruction}
                          onChange={(e) => setRxItems((prev) => prev.map((it, i) => (i === idx ? { ...it, instruction: e.target.value } : it)))}
                          placeholder="VD: Uống sau ăn"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quick add medicine */}
                <div className="mt-3 bg-white border border-gray-100 rounded-lg p-3">
                  <p className="text-sm font-medium text-gray-800 mb-2">Không có thuốc? Thêm nhanh</p>
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                    <div className="sm:col-span-8">
                      <input
                        type="text"
                        value={quickMed.name}
                        onChange={(e) => setQuickMed((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="Tên thuốc"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        value={quickMed.unit}
                        onChange={(e) => setQuickMed((prev) => ({ ...prev, unit: e.target.value }))}
                        placeholder="ĐVT"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <button
                        type="button"
                        onClick={handleQuickAddMedicine}
                        disabled={formLoading || !quickMed.name.trim()}
                        className="w-full px-3 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50"
                      >
                        Thêm
                      </button>
                    </div>
                  </div>
                </div>
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
