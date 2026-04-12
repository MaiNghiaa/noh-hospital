import { useState } from 'react'
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react'
import Input from '../components/common/Input'
import Button from '../components/common/Button'
import { HOSPITAL_INFO } from '../utils/constants'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Simulate send
    setTimeout(() => {
      setSent(true)
      setForm({ name: '', email: '', phone: '', subject: '', message: '' })
    }, 800)
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Info Cards */}
          <div className="space-y-4">
            {[
              { icon: MapPin, title: 'Địa chỉ', content: HOSPITAL_INFO.address, color: 'bg-blue-50 text-blue-600' },
              { icon: Phone, title: 'Điện thoại', content: `${HOSPITAL_INFO.phone}\nHotline: ${HOSPITAL_INFO.hotline}`, color: 'bg-green-50 text-green-600' },
              { icon: Mail, title: 'Email', content: HOSPITAL_INFO.email, color: 'bg-purple-50 text-purple-600' },
              { icon: Clock, title: 'Giờ làm việc', content: HOSPITAL_INFO.workingHours, color: 'bg-amber-50 text-amber-600' }
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-2xl shadow-md p-5 flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center shrink-0`}>
                  <item.icon size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-hospital-dark">{item.title}</h3>
                  <p className="text-sm text-gray-600 mt-1 whitespace-pre-line">{item.content}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-md p-6 lg:p-8">
              {sent ? (
                <div className="text-center py-12">
                  <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
                  <h3 className="font-display text-xl font-bold text-hospital-dark">Gửi thành công!</h3>
                  <p className="text-gray-500 mt-2">Chúng tôi sẽ phản hồi sớm nhất có thể.</p>
                  <Button variant="accent" className="mt-6" onClick={() => setSent(false)}>
                    Gửi tin nhắn khác
                  </Button>
                </div>
              ) : (
                <>
                  <h2 className="font-display text-xl font-bold text-hospital-dark mb-6">Gửi tin nhắn</h2>
                  <form onSubmit={handleSubmit}>
                    <div className="grid sm:grid-cols-2 gap-x-5">
                      <Input label="Họ tên" name="name" value={form.name} onChange={handleChange} required />
                      <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
                      <Input label="Số điện thoại" name="phone" value={form.phone} onChange={handleChange} />
                      <Input label="Tiêu đề" name="subject" value={form.subject} onChange={handleChange} required />
                    </div>
                    <Input.Textarea label="Nội dung" name="message" value={form.message} onChange={handleChange} rows={5} required />
                    <Button type="submit" variant="accent" size="lg" icon={Send}>
                      Gửi tin nhắn
                    </Button>
                  </form>
                </>
              )}
            </div>

            {/* Map */}
            <div className="mt-6 bg-white rounded-2xl shadow-md overflow-hidden">
              <iframe
                title="Bệnh viện TMH TW"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.6963076839!2d105.83!3d21.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z78+8IEdp4bqjaSBQaMOzbmc!5e0!3m2!1svi!2svn!4v1"
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale hover:grayscale-0 transition-all duration-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
