// frontend/src/pages/doctor/DoctorPrescriptions.jsx
import { useState, useEffect } from 'react';
import { Plus, Trash2, Send } from 'lucide-react';
import api from '../../utils/api';

const DoctorPrescriptions = () => {
  const [medicines, setMedicines] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState('');
  const [items, setItems] = useState([{ medicine_id: '', quantity: 1, dosage: '', duration_days: 7, instruction: '' }]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [medRes, aptRes] = await Promise.all([
          api.get('/admin/medicines'),
          api.get('/doctor/appointments', { params: { status: 'in_progress' } }),
        ]);
        setMedicines(medRes.data.data);
        setAppointments(aptRes.data.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const addItem = () => {
    setItems([...items, { medicine_id: '', quantity: 1, dosage: '', duration_days: 7, instruction: '' }]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const handleSubmit = async () => {
    if (!selectedAppointment) {
      alert('Vui lòng chọn lịch hẹn');
      return;
    }

    const validItems = items.filter(item => item.medicine_id && item.dosage);
    if (validItems.length === 0) {
      alert('Vui lòng thêm ít nhất 1 thuốc với đầy đủ thông tin');
      return;
    }

    setSubmitting(true);
    try {
      // First, get or create a medical record for this appointment
      const apt = appointments.find(a => a.id === parseInt(selectedAppointment));

      // Create a basic record if needed
      const recordRes = await api.post('/doctor/records', {
        appointment_id: parseInt(selectedAppointment),
        patient_id: apt?.patient_id,
        diagnosis: 'Kê đơn thuốc',
        symptoms: apt?.symptoms || '',
      });

      const recordId = recordRes.data.recordId;

      // Create prescriptions
      await api.post('/doctor/prescriptions', {
        record_id: recordId,
        items: validItems.map(item => ({
          ...item,
          medicine_id: parseInt(item.medicine_id),
          quantity: parseInt(item.quantity),
          duration_days: parseInt(item.duration_days) || null,
        })),
      });

      setSuccess('Kê đơn thuốc thành công!');
      setItems([{ medicine_id: '', quantity: 1, dosage: '', duration_days: 7, instruction: '' }]);
      setSelectedAppointment('');

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Kê Đơn Thuốc</h1>

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">{success}</div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        {/* Select appointment */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Chọn lịch hẹn đang khám *</label>
          <select value={selectedAppointment} onChange={(e) => setSelectedAppointment(e.target.value)}
            className="w-full max-w-md px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none">
            <option value="">-- Chọn lịch hẹn --</option>
            {appointments.map(apt => (
              <option key={apt.id} value={apt.id}>
                {apt.patient_name} - {apt.appointment_date ? new Date(apt.appointment_date).toLocaleDateString('vi-VN') : ''} {apt.appointment_time || ''}
              </option>
            ))}
          </select>
          {appointments.length === 0 && (
            <p className="text-sm text-gray-400 mt-2">Không có lịch hẹn đang khám. Vui lòng nhập kết quả khám trước.</p>
          )}
        </div>

        {/* Prescription items */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">Danh sách thuốc</h2>
            <button onClick={addItem} className="flex items-center gap-1 text-sm text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg">
              <Plus size={16} /> Thêm thuốc
            </button>
          </div>

          {items.map((item, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Thuốc #{index + 1}</span>
                {items.length > 1 && (
                  <button onClick={() => removeItem(index)} className="p-1 text-red-500 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Tên thuốc *</label>
                  <select value={item.medicine_id} onChange={(e) => updateItem(index, 'medicine_id', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                    <option value="">Chọn thuốc</option>
                    {medicines.filter(m => m.is_active).map(m => (
                      <option key={m.id} value={m.id}>{m.name} ({m.unit})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Số lượng</label>
                  <input type="number" min="1" value={item.quantity} onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Liều dùng *</label>
                  <input type="text" value={item.dosage} onChange={(e) => updateItem(index, 'dosage', e.target.value)}
                    placeholder="VD: 1 viên x 3 lần/ngày"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Số ngày</label>
                  <input type="number" min="1" value={item.duration_days} onChange={(e) => updateItem(index, 'duration_days', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs text-gray-500 mb-1">Hướng dẫn sử dụng</label>
                  <input type="text" value={item.instruction} onChange={(e) => updateItem(index, 'instruction', e.target.value)}
                    placeholder="VD: Uống sau ăn 30 phút"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <button onClick={handleSubmit} disabled={submitting || !selectedAppointment}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed">
            <Send size={18} /> {submitting ? 'Đang xử lý...' : 'Kê đơn thuốc'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorPrescriptions;
