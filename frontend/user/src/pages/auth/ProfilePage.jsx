// frontend/user/src/pages/auth/ProfilePage.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Save, User, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/authService';

export default function ProfilePage() {
  const { user, updateUser, refreshUser } = useAuth();
  const [tab, setTab] = useState('profile'); // profile | password
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [form, setForm] = useState({
    full_name: '',
    phone: '',
    date_of_birth: '',
    gender: '',
    address: '',
    insurance_number: '',
    blood_type: '',
    allergies: '',
  });

  const [pwForm, setPwForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (user) {
      setForm({
        full_name: user.full_name || '',
        phone: user.phone || '',
        date_of_birth: user.date_of_birth ? user.date_of_birth.split('T')[0] : '',
        gender: user.gender || '',
        address: user.address || '',
        insurance_number: user.insurance_number || '',
        blood_type: user.blood_type || '',
        allergies: user.allergies || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setMessage({ type: '', text: '' });
  };

  const handlePwChange = (e) => {
    setPwForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setMessage({ type: '', text: '' });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.updateProfile(form);
      updateUser({ full_name: form.full_name, phone: form.phone });
      setMessage({ type: 'success', text: 'Cập nhật thông tin thành công!' });
      refreshUser();
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Cập nhật thất bại' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setMessage({ type: 'error', text: 'Mật khẩu xác nhận không khớp' });
      return;
    }
    if (pwForm.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Mật khẩu mới tối thiểu 6 ký tự' });
      return;
    }
    setLoading(true);
    try {
      await authService.changePassword({
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      });
      setMessage({ type: 'success', text: 'Đổi mật khẩu thành công!' });
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Đổi mật khẩu thất bại' });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition';

  return (
    <div>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link to="/tai-khoan" className="p-2 hover:bg-gray-200 rounded-lg transition">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Hồ sơ cá nhân</h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg mb-6">
          <button
            onClick={() => { setTab('profile'); setMessage({ type: '', text: '' }); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition ${tab === 'profile' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <User className="w-4 h-4" /> Thông tin
          </button>
          <button
            onClick={() => { setTab('password'); setMessage({ type: '', text: '' }); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition ${tab === 'password' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Lock className="w-4 h-4" /> Đổi mật khẩu
          </button>
        </div>

        {/* Message */}
        {message.text && (
          <div className={`rounded-lg px-4 py-3 mb-6 text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {message.text}
          </div>
        )}

        {/* Profile Form */}
        {tab === 'profile' && (
          <form onSubmit={handleProfileSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
              <input type="text" name="full_name" value={form.full_name} onChange={handleChange} className={inputClass} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={user?.email || ''} disabled className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                <input type="tel" name="phone" value={form.phone} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ngày sinh</label>
                <input type="date" name="date_of_birth" value={form.date_of_birth} onChange={handleChange} className={inputClass} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Giới tính</label>
                <select name="gender" value={form.gender} onChange={handleChange} className={inputClass}>
                  <option value="">-- Chọn --</option>
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                  <option value="other">Khác</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nhóm máu</label>
                <select name="blood_type" value={form.blood_type} onChange={handleChange} className={inputClass}>
                  <option value="">-- Chọn --</option>
                  {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((bt) => (
                    <option key={bt} value={bt}>{bt}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
              <input type="text" name="address" value={form.address} onChange={handleChange} className={inputClass} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Số BHYT</label>
              <input type="text" name="insurance_number" value={form.insurance_number} onChange={handleChange} className={inputClass} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dị ứng (nếu có)</label>
              <input type="text" name="allergies" value={form.allergies} onChange={handleChange} placeholder="VD: Penicillin, Aspirin..." className={inputClass} />
            </div>

            <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition disabled:opacity-50">
              <Save className="w-4 h-4" />
              {loading ? 'Đang lưu...' : 'Lưu thông tin'}
            </button>
          </form>
        )}

        {/* Password Form */}
        {tab === 'password' && (
          <form onSubmit={handlePasswordSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu hiện tại</label>
              <input type="password" name="currentPassword" value={pwForm.currentPassword} onChange={handlePwChange} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu mới</label>
              <input type="password" name="newPassword" value={pwForm.newPassword} onChange={handlePwChange} placeholder="Tối thiểu 6 ký tự" className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu mới</label>
              <input type="password" name="confirmPassword" value={pwForm.confirmPassword} onChange={handlePwChange} className={inputClass} />
            </div>
            <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition disabled:opacity-50">
              <Lock className="w-4 h-4" />
              {loading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
