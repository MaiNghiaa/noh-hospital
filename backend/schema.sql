-- ================================================================
-- NOH Hospital - Unified Database Schema (User + Admin)
-- ================================================================
-- Cách chạy:
--   mysql -u root -p < backend/schema.sql
-- ================================================================

CREATE DATABASE IF NOT EXISTS noh_hospital
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE noh_hospital;

-- NOTE:
-- This file is intentionally kept as a single source of truth.
-- It matches the combined schema used by both:
--   - backend/hospital (public website APIs)
--   - backend/admin    (admin APIs)

-- ═══════════════════════════════════════════════════════════════
-- PHẦN 1: CÁC BẢNG CƠ SỞ (Public Website)
-- ═══════════════════════════════════════════════════════════════

-- ─── 1.1 Departments (Chuyên khoa) ───
CREATE TABLE IF NOT EXISTS departments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(200) NOT NULL,
  slug VARCHAR(200) UNIQUE NOT NULL,
  type ENUM('lam-sang', 'can-lam-sang') NOT NULL DEFAULT 'lam-sang',
  description TEXT,
  image VARCHAR(500),
  phone VARCHAR(20),
  head_doctor VARCHAR(100),
  is_active TINYINT(1) DEFAULT 1,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_dept_type (type),
  INDEX idx_dept_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── 1.2 Doctors (Bác sĩ / Chuyên gia) ───
CREATE TABLE IF NOT EXISTS doctors (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(200) NOT NULL,
  slug VARCHAR(200) UNIQUE NOT NULL,
  title VARCHAR(100) COMMENT 'PGS-TS, BSCKII, etc.',
  specialty VARCHAR(200),
  department_id INT,
  image VARCHAR(500),
  experience VARCHAR(100),
  education VARCHAR(300),
  bio TEXT,
  email VARCHAR(100),
  phone VARCHAR(20),
  is_active TINYINT(1) DEFAULT 1,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL,
  INDEX idx_doctor_department (department_id),
  INDEX idx_doctor_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── 1.3 Doctor Schedules (Lịch khám bác sĩ) ───
CREATE TABLE IF NOT EXISTS doctor_schedules (
  id INT PRIMARY KEY AUTO_INCREMENT,
  doctor_id INT NOT NULL,
  day_of_week TINYINT NOT NULL COMMENT '1=Mon, 7=Sun',
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  max_patients INT DEFAULT 20,
  is_active TINYINT(1) DEFAULT 1,
  FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
  INDEX idx_schedule_doctor_day (doctor_id, day_of_week)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── 1.4 News (Tin tức) ───
CREATE TABLE IF NOT EXISTS news (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(500) UNIQUE NOT NULL,
  category ENUM('su-kien', 'nghien-cuu', 'hop-tac', 'thong-bao', 'hoi-dap') NOT NULL DEFAULT 'su-kien',
  excerpt TEXT,
  content LONGTEXT,
  image VARCHAR(500),
  author VARCHAR(100),
  view_count INT DEFAULT 0,
  is_featured TINYINT(1) DEFAULT 0,
  is_published TINYINT(1) DEFAULT 1,
  published_at DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_news_category (category),
  INDEX idx_news_published (is_published, published_at),
  INDEX idx_news_slug (slug),
  FULLTEXT idx_news_search (title, excerpt, content)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── 1.5 Documents / Văn bản pháp luật ───
CREATE TABLE IF NOT EXISTS documents (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(500) UNIQUE NOT NULL,
  document_number VARCHAR(100),
  category VARCHAR(100),
  file_url VARCHAR(500),
  published_at DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_doc_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── 1.6 Videos ───
CREATE TABLE IF NOT EXISTS videos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(500) NOT NULL,
  youtube_url VARCHAR(500) NOT NULL,
  thumbnail VARCHAR(500),
  description TEXT,
  is_featured TINYINT(1) DEFAULT 0,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── 1.7 Contact Messages (Liên hệ) ───
CREATE TABLE IF NOT EXISTS contact_messages (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(200) NOT NULL,
  email VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  subject VARCHAR(300),
  message TEXT NOT NULL,
  is_read TINYINT(1) DEFAULT 0,
  replied_at DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_contact_read (is_read)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ═══════════════════════════════════════════════════════════════
-- PHẦN 2: HỆ THỐNG ADMIN & QUẢN LÝ
-- ═══════════════════════════════════════════════════════════════

-- ─── 2.1 Users (Xác thực tập trung) ───
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(200) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('super_admin', 'admin', 'doctor', 'patient') NOT NULL DEFAULT 'patient',
  full_name VARCHAR(200) NOT NULL,
  phone VARCHAR(15) NULL,
  avatar_url VARCHAR(500) NULL,
  doctor_id INT NULL,
  is_active TINYINT(1) DEFAULT 1,
  last_login DATETIME NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE SET NULL,
  INDEX idx_users_email (email),
  INDEX idx_users_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── 2.2 Patients (Bệnh nhân) ───
CREATE TABLE IF NOT EXISTS patients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  date_of_birth DATE NULL,
  gender ENUM('male', 'female', 'other') NULL,
  address TEXT NULL,
  insurance_number VARCHAR(50) NULL,
  emergency_contact VARCHAR(200) NULL,
  blood_type VARCHAR(5) NULL,
  allergies TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── 2.3 Appointments (Đặt lịch khám) ───
CREATE TABLE IF NOT EXISTS appointments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  full_name VARCHAR(200) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(100),
  department VARCHAR(200) NOT NULL,
  doctor_id INT,
  appointment_date DATE NOT NULL,
  appointment_time TIME,
  reason TEXT,
  patient_id INT NULL,
  status ENUM('pending', 'confirmed', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
  cancel_reason TEXT NULL,
  confirmed_at DATETIME NULL,
  confirmed_by INT NULL,
  notes TEXT COMMENT 'Ghi chú từ staff',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE SET NULL,
  INDEX idx_appt_phone (phone),
  INDEX idx_appt_date (appointment_date),
  INDEX idx_appt_status (status),
  INDEX idx_appt_patient_id (patient_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── 2.4 Medical Records (Hồ sơ bệnh án) ───
CREATE TABLE IF NOT EXISTS medical_records (
  id INT AUTO_INCREMENT PRIMARY KEY,
  appointment_id INT NULL,
  patient_id INT NOT NULL,
  doctor_id INT NOT NULL,
  symptoms TEXT NULL,
  diagnosis TEXT NOT NULL,
  treatment TEXT NULL,
  notes TEXT NULL,
  follow_up_date DATE NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE SET NULL,
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
  FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
  INDEX idx_record_patient (patient_id),
  INDEX idx_record_doctor (doctor_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── 2.5 Medicines (Thuốc) ───
CREATE TABLE IF NOT EXISTS medicines (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(300) NOT NULL,
  active_ingredient VARCHAR(300) NULL,
  unit VARCHAR(50) NOT NULL,
  category VARCHAR(100) NULL,
  description TEXT NULL,
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── 2.6 Prescriptions (Đơn thuốc) ───
CREATE TABLE IF NOT EXISTS prescriptions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  record_id INT NOT NULL,
  medicine_id INT NOT NULL,
  quantity INT NOT NULL,
  dosage VARCHAR(200) NOT NULL,
  duration_days INT NULL,
  instruction TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (record_id) REFERENCES medical_records(id) ON DELETE CASCADE,
  FOREIGN KEY (medicine_id) REFERENCES medicines(id) ON DELETE CASCADE,
  INDEX idx_prescription_record (record_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── 2.7 Refresh Tokens (JWT Refresh) ───
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  token VARCHAR(500) NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ═══════════════════════════════════════════════════════════════
-- PHẦN 3: DỮ LIỆU MẪU (SAMPLE DATA)
-- ═══════════════════════════════════════════════════════════════

INSERT INTO departments (name, slug, type, description) VALUES
('Khoa Họng - Thanh quản', 'khoa-hong-thanh-quan', 'lam-sang', 'Khám chữa bệnh, điều trị bằng phương pháp nội khoa và ngoại khoa các bệnh lý vùng họng – thanh quản'),
('Khoa Tai', 'khoa-tai', 'lam-sang', 'Khám, chữa bệnh chuyên sâu về tai, tai thần kinh, nền sọ ở tuyến cao nhất'),
('Khoa Khám bệnh', 'khoa-kham-benh', 'lam-sang', 'Khám, chẩn đoán bệnh và tư vấn điều trị cho người bệnh'),
('Khoa Gây mê hồi sức', 'khoa-gay-me-hoi-suc', 'lam-sang', 'Gây mê hồi sức cho các phẫu thuật cấp cứu chuyên khoa TMH'),
('Khoa Cấp cứu', 'khoa-cap-cuu', 'lam-sang', 'Điều trị người bệnh nặng, nguy hiểm chức năng sống về TMH'),
('Trung tâm Ung Bướu và Phẫu thuật Đầu-Cổ', 'trung-tam-ung-buou', 'lam-sang', 'Điều trị bệnh lý TMH và chuyên sâu khối u đầu cổ'),
('Khoa Tai Mũi Họng Trẻ em', 'khoa-tmh-tre-em', 'lam-sang', 'Khám và điều trị tất cả các bệnh lý chuyên khoa TMH trẻ em'),
('Khoa Tai thần kinh', 'khoa-tai-than-kinh', 'lam-sang', 'Khám chữa bệnh chủ yếu về tai, tai-thần kinh'),
('Khoa Mũi Xoang', 'khoa-mui-xoang', 'lam-sang', 'Khám chẩn đoán, tư vấn và điều trị các bệnh lý về mũi xoang'),
('Khoa Thính - Thanh học', 'khoa-thinh-thanh-hoc', 'lam-sang', 'Khám, chữa bệnh tai mũi họng và tiền đình'),
('Khoa Phẫu thuật Tạo hình Thẩm Mỹ', 'khoa-phau-thuat-tao-hinh', 'lam-sang', 'Khám và điều trị các trường hợp cần tạo hình, phẫu thuật thẩm mỹ'),
('Khoa Nội soi', 'khoa-noi-soi', 'lam-sang', 'Khám, chẩn đoán, điều trị bệnh về TMH bằng nội soi'),
('Khoa Xét nghiệm Tổng hợp', 'khoa-xet-nghiem', 'can-lam-sang', 'Xét nghiệm về bệnh học, tế bào học'),
('Khoa Kiểm soát nhiễm khuẩn', 'khoa-kiem-soat-nhiem-khuan', 'can-lam-sang', 'Giám sát công tác kiểm soát nhiễm khuẩn trong toàn bệnh viện'),
('Khoa Chẩn đoán hình ảnh', 'khoa-chan-doan-hinh-anh', 'can-lam-sang', 'Thực hiện kỹ thuật chẩn đoán hình ảnh cho chuyên khoa'),
('Khoa Dược', 'khoa-duoc', 'can-lam-sang', 'Tổ chức, triển khai hoạt động của Hội đồng thuốc và điều trị'),
('Khoa Dinh dưỡng', 'khoa-dinh-duong', 'can-lam-sang', 'Tư vấn và điều trị bằng chế độ dinh dưỡng cho người bệnh');

INSERT INTO doctors (name, slug, title, specialty, department_id, experience, education) VALUES
('PGS-TS, GVCC. Phạm Tuấn Cảnh', 'pham-tuan-canh', 'Phó Giáo sư - Tiến sĩ', 'Chuyên ngành Tai mũi họng', 11, '30+ năm kinh nghiệm', 'Đại học Y Hà Nội'),
('TTƯT.TS.BSCC. Lê Anh Tuấn', 'le-anh-tuan', 'Tiến sĩ - Bác sĩ Cao cấp', 'Chuyên khoa Tai Mũi Họng', 7, '25+ năm kinh nghiệm', 'Đại học Y Hà Nội'),
('PGS-TS. Nguyễn Quang Trung', 'nguyen-quang-trung', 'Phó Giáo sư - Tiến sĩ', 'Chuyên ngành Tai mũi họng', 6, '20+ năm kinh nghiệm', 'Đại học Y Hà Nội'),
('BSCKII. Hà Minh Lợi', 'ha-minh-loi', 'Bác sĩ Chuyên khoa II', 'Chuyên Khoa Tai Mũi Họng', 9, '18+ năm kinh nghiệm', 'Đại học Y Hà Nội'),
('TS. BSC. Đào Đình Thi', 'dao-dinh-thi', 'Tiến sĩ - Bác sĩ', 'Chuyên Khoa Tai Mũi Họng', 12, '15+ năm kinh nghiệm', 'Đại học Y Hà Nội'),
('TTND, PGS-TS Quách Thị Cần', 'quach-thi-can', 'Phó Giáo sư - Tiến sĩ', 'Chuyên ngành Tai mũi họng', 5, '28+ năm kinh nghiệm', 'Đại học Y Hà Nội');

INSERT INTO news (title, slug, category, excerpt, published_at) VALUES
('Hàng trăm bác sĩ ra quân, khám và sàng lọc miễn phí cho hơn 10.000 người', 'hang-tram-bac-si-ra-quan', 'su-kien', 'Hàng nghìn người đổ về phố đi bộ Trần Nhân Tông từ sáng sớm 5/4', '2026-04-07 08:00:00'),
('Người dân háo hức tham gia khám sức khỏe miễn phí', 'nguoi-dan-hao-hung', 'su-kien', 'Chương trình khám sức khỏe miễn phí tại phố đi bộ', '2026-04-07 10:00:00'),
('BV TMH TW khám, tư vấn miễn phí tại Ngày hội Vì một Việt Nam khỏe mạnh', 'ngay-hoi-vi-mot-viet-nam-khoe-manh', 'su-kien', 'Hưởng ứng Ngày Sức khỏe toàn dân 7/4', '2026-04-06 09:00:00'),
('Viêm tai giữa mãn tính: Cảnh báo biến chứng nguy hiểm', 'viem-tai-giua-man-tinh', 'nghien-cuu', 'Viêm tai giữa mãn tính chiếm khoảng 2-4% dân số', '2026-03-25 14:00:00'),
('Những hiểu lầm người Việt thường mắc phải về bệnh viêm xoang', 'hieu-lam-viem-xoang', 'hoi-dap', 'Viêm xoang chiếm khoảng 15% dân số', '2026-03-20 10:00:00');

-- Default Super Admin (password: admin123 - ĐỔI NGAY SAU KHI DEPLOY)
-- Password hash cho 'admin123' dùng bcrypt
INSERT INTO users (email, password_hash, role, full_name, phone) VALUES
('admin@nohhospital.vn', '$2b$10$YourBcryptHashHere', 'super_admin', 'System Admin', '0243.8533.427');

