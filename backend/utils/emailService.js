const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

const sendMedicalRecordEmail = async (email, appointmentData, recordData, prescriptionsData) => {
  if (!email) return;

  try {
    let prescriptionsHtml = '';
    if (prescriptionsData && prescriptionsData.length > 0) {
      prescriptionsHtml = `
        <h3>Đơn thuốc</h3>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <thead>
            <tr style="background-color: #f3f4f6;">
              <th style="padding: 10px; border: 1px solid #e5e7eb; text-align: left;">Tên thuốc</th>
              <th style="padding: 10px; border: 1px solid #e5e7eb; text-align: left;">Liều dùng</th>
              <th style="padding: 10px; border: 1px solid #e5e7eb; text-align: left;">Số lượng</th>
              <th style="padding: 10px; border: 1px solid #e5e7eb; text-align: left;">Hướng dẫn</th>
            </tr>
          </thead>
          <tbody>
            ${prescriptionsData.map(p => `
              <tr>
                <td style="padding: 10px; border: 1px solid #e5e7eb;">
                  <strong>${p.medicine_name}</strong>
                  ${p.active_ingredient ? `<br><small style="color: #6b7280;">(${p.active_ingredient})</small>` : ''}
                </td>
                <td style="padding: 10px; border: 1px solid #e5e7eb;">
                  ${p.dosage} x ${p.duration_days} ngày
                </td>
                <td style="padding: 10px; border: 1px solid #e5e7eb;">
                  ${p.quantity} ${p.medicine_unit}
                </td>
                <td style="padding: 10px; border: 1px solid #e5e7eb;">
                  ${p.instruction || ''}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    }

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <div style="text-align: center; padding: 20px 0; border-bottom: 2px solid #00a099;">
          <h1 style="color: #00a099; margin: 0;">NOH Hospital</h1>
          <p style="margin: 5px 0 0; color: #666;">Bệnh viện Tai Mũi Họng NOH</p>
        </div>
        
        <div style="padding: 20px 0;">
          <p>Kính chào <strong>${appointmentData.full_name}</strong>,</p>
          <p>Cảm ơn bạn đã thăm khám tại NOH Hospital. Dưới đây là thông tin kết quả khám bệnh và đơn thuốc của bạn.</p>
          
          <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="margin-top: 0; color: #111827;">Thông tin ca khám</h3>
            <p style="margin: 5px 0;"><strong>Chuyên khoa:</strong> ${appointmentData.department_name}</p>
            <p style="margin: 5px 0;"><strong>Bác sĩ:</strong> ${appointmentData.doctor_name || 'Bác sĩ chuyên khoa'}</p>
            <p style="margin: 5px 0;"><strong>Ngày khám:</strong> ${new Date(appointmentData.appointment_date).toLocaleDateString('vi-VN')}</p>
          </div>

          <div style="margin-bottom: 20px;">
            <h3 style="color: #111827;">Kết quả khám bệnh</h3>
            <p style="margin: 5px 0;"><strong>Triệu chứng:</strong> ${recordData.symptoms || 'Không ghi nhận'}</p>
            <p style="margin: 5px 0; color: #b91c1c;"><strong>Chẩn đoán:</strong> ${recordData.diagnosis}</p>
            <p style="margin: 5px 0;"><strong>Hướng điều trị:</strong> ${recordData.treatment || 'Không ghi nhận'}</p>
            <p style="margin: 5px 0;"><strong>Lời dặn của bác sĩ:</strong> ${recordData.notes || 'Không có'}</p>
            ${recordData.follow_up_date ? `<p style="margin: 5px 0;"><strong>Ngày tái khám:</strong> ${new Date(recordData.follow_up_date).toLocaleDateString('vi-VN')}</p>` : ''}
          </div>

          ${prescriptionsHtml}
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 0.9em; color: #6b7280; text-align: center;">
          <p>Đây là email tự động từ hệ thống NOH Hospital. Vui lòng không trả lời email này.</p>
          <p>Nếu bạn có thắc mắc, vui lòng liên hệ hotline: <strong>1900 1234</strong>.</p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: '"NOH Hospital" <' + process.env.EMAIL_USER + '>',
      to: email,
      subject: 'Kết quả khám bệnh & Đơn thuốc - NOH Hospital',
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
    console.log(`[EmailService] Sent medical record to ${email}`);
  } catch (error) {
    console.error(`[EmailService] Error sending email to ${email}:`, error);
  }
};

module.exports = {
  sendMedicalRecordEmail,
};
