// frontend/user/src/pages/auth/MyPrescriptionsPage.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Pill, ChevronLeft, Calendar, Stethoscope } from 'lucide-react';
import patientService from '../../services/patientService';

export default function MyPrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await patientService.getMyPrescriptions();
        setPrescriptions(res.data || []);
      } catch (err) {
        console.error('Failed to fetch prescriptions:', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

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
            <h1 className="text-xl font-bold text-gray-900">Đơn thuốc</h1>
            <p className="text-sm text-gray-500">{prescriptions.length} đơn thuốc</p>
          </div>
        </div>

        {prescriptions.length > 0 ? (
          <div className="space-y-4">
            {prescriptions.map((rx) => (
              <Link
                key={rx.record_id}
                to={`/tai-khoan/benh-an`}
                className="block bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:border-purple-200 hover:shadow-md transition"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Pill className="w-4 h-4 text-purple-500" />
                  <span className="font-semibold text-gray-900">{rx.diagnosis}</span>
                </div>
                <p className="text-sm text-gray-600">
                  <Stethoscope className="w-3.5 h-3.5 inline mr-1" />
                  {rx.doctor_title} {rx.doctor_name}
                  {rx.department_name && ` · ${rx.department_name}`}
                </p>
                <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(rx.record_date).toLocaleDateString('vi-VN')}
                </div>
                {rx.medicines_summary && (
                  <div className="mt-3 bg-purple-50 rounded-lg p-3">
                    <p className="text-sm text-purple-800">{rx.medicines_summary}</p>
                  </div>
                )}
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-12 text-center border border-gray-100">
            <Pill className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Chưa có đơn thuốc nào</p>
          </div>
        )}
      </div>
    </div>
  );
}
