// tests/setup/helpers.js
// ============================================================
// Helper functions dùng chung cho tất cả test files
// ============================================================

/**
 * Tạo header Authorization Bearer
 */
function authHeader(token) {
  return { Authorization: `Bearer ${token}` };
}

/**
 * Tạo dữ liệu appointment hợp lệ
 */
function validAppointmentData(overrides = {}) {
  return {
    full_name: 'Trần Văn Test',
    phone: '0987654321',
    email: 'test@example.com',
    department: 'Khoa Tai',
    date: '2026-05-01',
    time: '09:00',
    reason: 'Kiểm tra thính lực',
    ...overrides,
  };
}

/**
 * Tạo dữ liệu đăng ký bệnh nhân hợp lệ
 */
function validRegisterData(overrides = {}) {
  const unique = Date.now();
  return {
    full_name: 'Nguyễn Văn Test',
    email: `test_${unique}@example.com`,
    password: 'password123',
    phone: `09${String(unique).slice(-8)}`,
    date_of_birth: '1995-01-15',
    gender: 'male',
    address: '456 Lê Lợi, Hà Nội',
    ...overrides,
  };
}

/**
 * Tạo dữ liệu bệnh án hợp lệ
 */
function validRecordData(overrides = {}) {
  return {
    patient_id: 1,
    appointment_id: 1,
    symptoms: 'Đau đầu, sổ mũi, nghẹt mũi',
    diagnosis: 'Viêm xoang cấp',
    treatment: 'Kháng sinh + rửa mũi',
    notes: 'Tái khám sau 2 tuần',
    follow_up_date: '2026-05-15',
    ...overrides,
  };
}

/**
 * Tạo dữ liệu đơn thuốc hợp lệ
 */
function validPrescriptionData(overrides = {}) {
  return {
    record_id: 1,
    items: [
      { medicine_id: 1, quantity: 21, dosage: '3 lần/ngày x 1 viên', duration_days: 7, instruction: 'Uống sau ăn' },
      { medicine_id: 2, quantity: 10, dosage: '2 lần/ngày khi đau', duration_days: 5, instruction: 'Uống khi cần' },
    ],
    ...overrides,
  };
}

/**
 * Tạo dữ liệu department hợp lệ
 */
function validDepartmentData(overrides = {}) {
  return {
    name: 'Khoa Test Mới',
    slug: 'khoa-test-moi',
    type: 'lam-sang',
    description: 'Mô tả khoa test',
    ...overrides,
  };
}

/**
 * Tạo dữ liệu doctor hợp lệ
 */
function validDoctorData(overrides = {}) {
  return {
    name: 'TS. Trần Văn Test',
    slug: 'tran-van-test',
    title: 'Tiến sĩ',
    specialty: 'Tai Mũi Họng',
    department_id: 1,
    experience: '10+ năm',
    education: 'ĐH Y Hà Nội',
    ...overrides,
  };
}

/**
 * Tạo dữ liệu news hợp lệ
 */
function validNewsData(overrides = {}) {
  return {
    title: 'Bài viết test',
    slug: `bai-viet-test-${Date.now()}`,
    category: 'su-kien',
    excerpt: 'Tóm tắt bài viết test',
    content: '<p>Nội dung đầy đủ bài viết test</p>',
    ...overrides,
  };
}

module.exports = {
  authHeader,
  validAppointmentData,
  validRegisterData,
  validRecordData,
  validPrescriptionData,
  validDepartmentData,
  validDoctorData,
  validNewsData,
};

