// frontend/user/src/pages/auth/MyRecordsPage.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, ChevronLeft, ChevronRight, Stethoscope, Calendar } from 'lucide-react';
import patientService from '../../services/patientService';

export default function MyRecordsPage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await patientService.getMyRecords();
        setRecords(res.data || []);
      } catch (err) {
        console.error('Failed to fetch records:', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const viewDetail = async (id) => {
    setDetailLoading(true);
    try {
      const res = await patientService.getRecordDetail(id);
      setSelectedRecord(res.data);
    } catch (err) {
      console.error('Failed to fetch record detail:', err);
    } finally {
      setDetailLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Link to="/tai-khoan" className="p-2 hover:bg-gray-200 rounded-lg transition">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Hồ sơ bệnh án</h1>
            <p className="text-sm text-gray-500">{records.length} hồ sơ</p>
          </div>
        </div>

        {/* Detail Modal */}
        {selectedRecord && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedRecord(null)}>
            <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900">Chi tiết bệnh án</h2>
                  <button onClick={() => setSelectedRecord(null)} className="p-1 hover:bg-gray-100 rounded-lg">✕</button>
                </div>

                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm text-blue-600 font-medium">Bác sĩ khám</p>
                    <p className="font-semibold text-gray-900">{selectedRecord.doctor_title} {selectedRecord.doctor_name}</p>
                    <p className="text-sm text-gray-600">{selectedRecord.department_name}</p>
                    <p className="text-sm text-gray-500 mt-1">{new Date(selectedRecord.created_at).toLocaleDateString('vi-VN')}</p>
                  </div>

                  {selectedRecord.symptoms && (
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Triệu chứng</p>
                      <p className="text-gray-900">{selectedRecord.symptoms}</p>
                    </div>
                  )}

                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Chẩn đoán</p>
                    <p className="text-gray-900 font-semibold">{selectedRecord.diagnosis}</p>
                  </div>

                  {selectedRecord.treatment && (
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Phương pháp điều trị</p>
                      <p className="text-gray-900">{selectedRecord.treatment}</p>
                    </div>
                  )}

                  {selectedRecord.follow_up_date && (
                    <div className="bg-orange-50 rounded-lg p-3">
                      <p className="text-sm text-orange-600 font-medium">📅 Tái khám</p>
                      <p className="text-gray-900">{new Date(selectedRecord.follow_up_date).toLocaleDateString('vi-VN')}</p>
                    </div>
                  )}

                  {/* Prescriptions */}
                  {selectedRecord.prescriptions?.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-2">Đơn thuốc ({selectedRecord.prescriptions.length} loại)</p>
                      <div className="space-y-2">
                        {selectedRecord.prescriptions.map((p, i) => (
                          <div key={i} className="bg-gray-50 rounded-lg p-3">
                            <p className="font-medium text-gray-900">{p.medicine_name}</p>
                            <p className="text-sm text-gray-600">SL: {p.quantity} {p.medicine_unit} · {p.dosage} · {p.duration_days} ngày</p>
                            {p.instruction && <p className="text-sm text-gray-500 italic mt-1">{p.instruction}</p>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Records List */}
        {records.length > 0 ? (
          <div className="space-y-3">
            {records.map((record) => (
              <button
                key={record.id}
                onClick={() => viewDetail(record.id)}
                className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-5 text-left hover:border-blue-200 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Stethoscope className="w-4 h-4 text-blue-500" />
                      <span className="font-semibold text-gray-900">{record.diagnosis}</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {record.doctor_title} {record.doctor_name}
                      {record.department_name && ` · ${record.department_name}`}
                    </p>
                    <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(record.created_at).toLocaleDateString('vi-VN')}
                    </div>
                    {record.treatment && (
                      <p className="text-sm text-gray-500 mt-2 line-clamp-1">{record.treatment}</p>
                    )}
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300 flex-shrink-0 mt-1" />
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-12 text-center border border-gray-100">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Chưa có hồ sơ bệnh án nào</p>
          </div>
        )}
      </div>
    </div>
  );
}
