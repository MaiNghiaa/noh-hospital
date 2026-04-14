import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from '../components/layout/MainLayout'
import AuthLayout from '../components/layout/AuthLayout'
import PatientLayout from '../components/layout/PatientLayout'
import HomePage from '../pages/HomePage'
import DepartmentsPage from '../pages/DepartmentsPage'
import DepartmentDetailPage from '../pages/DepartmentDetailPage'
import DoctorsPage from '../pages/DoctorsPage'
import DoctorDetailPage from '../pages/DoctorDetailPage'
import NewsPage from '../pages/NewsPage'
import NewsDetailPage from '../pages/NewsDetailPage'
import AppointmentPage from '../pages/AppointmentPage'
import ContactPage from '../pages/ContactPage'
import AboutPage from '../pages/AboutPage'
import AboutSectionPage from '../pages/AboutSectionPage'
import NotFoundPage from '../pages/NotFoundPage'
import LegalDocumentPage from '../pages/LegalDocumentPage'
import TrainingLineArticlePage from '../pages/TrainingLineArticlePage'
import AdmissionsPage from '../pages/AdmissionsPage'
import AdmissionDetailPage from '../pages/AdmissionDetailPage'
import DocumentTemplatePage from '../pages/DocumentTemplatePage'
import PatientHubPage from '../pages/PatientHubPage'
import PatientGuideIndexPage from '../pages/PatientGuideIndexPage'
import PatientGuideSlugRouter from '../pages/PatientGuideSlugRouter'

import ProtectedRoute from '../components/auth/ProtectedRoute'
import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'
import PatientDashboard from '../pages/auth/PatientDashboard'
import MyAppointmentsPage from '../pages/auth/MyAppointmentsPage'
import MyRecordsPage from '../pages/auth/MyRecordsPage'
import MyPrescriptionsPage from '../pages/auth/MyPrescriptionsPage'
import ProfilePage from '../pages/auth/ProfilePage'

export default function AppRoutes() {
  return (
    <Routes>
      {/* Auth routes use a dedicated layout (no Header/Footer/Hero) */}
      <Route element={<AuthLayout />}>
        <Route path="/dang-nhap" element={<LoginPage />} />
        <Route path="/dang-ky" element={<RegisterPage />} />
      </Route>

      {/* Patient portal uses a dedicated layout (not the public website layout) */}
      <Route element={<ProtectedRoute><PatientLayout /></ProtectedRoute>}>
        <Route path="/tai-khoan" element={<PatientDashboard />} />
        <Route path="/tai-khoan/lich-hen" element={<MyAppointmentsPage />} />
        <Route path="/tai-khoan/benh-an" element={<MyRecordsPage />} />
        <Route path="/tai-khoan/don-thuoc" element={<MyPrescriptionsPage />} />
        <Route path="/tai-khoan/ho-so" element={<ProfilePage />} />
      </Route>

      {/* Main website routes use the main layout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />

        {/* Chuyên khoa */}
        <Route path="/chuyen-khoa" element={<DepartmentsPage />} />
        <Route path="/chuyen-khoa/:slug" element={<DepartmentDetailPage />} />

        {/* Đội ngũ chuyên gia */}
        <Route path="/doi-ngu-chuyen-gia" element={<DoctorsPage />} />
        <Route path="/doi-ngu-chuyen-gia/:id" element={<DoctorDetailPage />} />

        {/* Tin tức */}
        <Route path="/tin-tuc" element={<NewsPage />} />
        <Route path="/tin-tuc/:slug" element={<NewsDetailPage />} />

        {/* Đặt lịch khám */}
        <Route path="/dat-lich-kham" element={<AppointmentPage />} />

        {/* Liên hệ */}
        <Route path="/lien-he" element={<ContactPage />} />

        {/* Giới thiệu */}
        <Route path="/gioi-thieu/:slug" element={<AboutSectionPage />} />
        <Route path="/gioi-thieu" element={<AboutPage />} />

        {/* Văn bản pháp lý (chi tiết từng mục trên trang chủ) */}
        <Route path="/vbpl/:slug" element={<LegalDocumentPage />} />

        {/* Đào tạo - Chỉ đạo tuyến (tin từ khối trang chủ) */}
        <Route path="/dao-tao-chi-dao-tuyen/:slug" element={<TrainingLineArticlePage />} />

        {/* Dành cho học viên — tuyển sinh */}
        <Route path="/danh-cho-hoc-vien/thong-tin-tuyen-sinh/:slug" element={<AdmissionDetailPage />} />
        <Route path="/danh-cho-hoc-vien/thong-tin-tuyen-sinh" element={<AdmissionsPage />} />
        <Route path="/danh-cho-hoc-vien/mau-van-ban-giay-to" element={<DocumentTemplatePage />} />
        <Route
          path="/danh-cho-hoc-vien"
          element={<Navigate to="/danh-cho-hoc-vien/thong-tin-tuyen-sinh" replace />}
        />

        {/* Dành cho người bệnh */}
        <Route path="/danh-cho-nguoi-benh/huong-dan/:slug" element={<PatientGuideSlugRouter />} />
        <Route path="/danh-cho-nguoi-benh/huong-dan" element={<PatientGuideIndexPage />} />
        <Route path="/danh-cho-nguoi-benh" element={<PatientHubPage />} />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>

    </Routes>
  )
}
