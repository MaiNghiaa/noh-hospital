import { useState } from 'react'
import { Lock, Save } from 'lucide-react'
import api from '../../utils/api'

export default function DoctorChangePassword() {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setMessage({ type: '', text: '' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.currentPassword || !form.newPassword) {
      setMessage({ type: 'error', text: 'Vui lòng nhập đầy đủ thông tin' })
      return
    }
    if (form.newPassword.length < 8) {
      setMessage({ type: 'error', text: 'Mật khẩu mới phải có ít nhất 8 ký tự' })
      return
    }
    if (form.newPassword !== form.confirmPassword) {
      setMessage({ type: 'error', text: 'Mật khẩu xác nhận không khớp' })
      return
    }

    setLoading(true)
    try {
      await api.put('/auth/change-password', {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      })
      setMessage({ type: 'success', text: 'Đổi mật khẩu thành công' })
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Đổi mật khẩu thất bại' })
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition'

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Đổi mật khẩu</h1>

      {message.text && (
        <div
          className={`rounded-lg px-4 py-3 mb-4 text-sm ${
            message.type === 'success'
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu hiện tại</label>
          <input
            type="password"
            name="currentPassword"
            value={form.currentPassword}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu mới</label>
          <input
            type="password"
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
            className={inputClass}
            placeholder="Tối thiểu 8 ký tự"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu mới</label>
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {loading ? 'Đang lưu...' : 'Đổi mật khẩu'}
        </button>
      </form>

      <p className="mt-3 text-xs text-gray-500 flex items-center gap-2">
        <Lock className="w-4 h-4" />
        Chỉ hỗ trợ đổi mật khẩu. Thông tin khác không chỉnh sửa tại cổng bác sĩ.
      </p>
    </div>
  )
}

