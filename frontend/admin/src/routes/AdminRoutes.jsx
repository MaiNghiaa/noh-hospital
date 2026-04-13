// frontend/src/routes/AdminRoutes.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import AdminLogin from '../pages/admin/AdminLogin';
import AdminLayout from '../pages/admin/AdminLayout';
import Dashboard from '../pages/admin/Dashboard';
import DoctorManagement from '../pages/admin/DoctorManagement';
import PatientManagement from '../pages/admin/PatientManagement';
import AppointmentManagement from '../pages/admin/AppointmentManagement';
import DepartmentManagement from '../pages/admin/DepartmentManagement';
import NewsManagement from '../pages/admin/NewsManagement';
import UserManagement from '../pages/admin/UserManagement';
import MedicineManagement from '../pages/admin/MedicineManagement';
import Reports from '../pages/admin/Reports';
import DoctorDashboard from '../pages/doctor/DoctorDashboard';
import DoctorAppointments from '../pages/doctor/DoctorAppointments';
import DoctorPrescriptions from '../pages/doctor/DoctorPrescriptions';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={['admin', 'super_admin', 'doctor']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />

        {/* Admin routes */}
        <Route path="doctors" element={
          <ProtectedRoute roles={['admin', 'super_admin']}><DoctorManagement /></ProtectedRoute>
        } />
        <Route path="patients" element={
          <ProtectedRoute roles={['admin', 'super_admin']}><PatientManagement /></ProtectedRoute>
        } />
        <Route path="appointments" element={
          <ProtectedRoute roles={['admin', 'super_admin', 'doctor']}><AppointmentManagement /></ProtectedRoute>
        } />
        <Route path="departments" element={
          <ProtectedRoute roles={['admin', 'super_admin']}><DepartmentManagement /></ProtectedRoute>
        } />
        <Route path="news" element={
          <ProtectedRoute roles={['admin', 'super_admin']}><NewsManagement /></ProtectedRoute>
        } />
        <Route path="medicines" element={
          <ProtectedRoute roles={['admin', 'super_admin', 'doctor']}><MedicineManagement /></ProtectedRoute>
        } />
        <Route path="users" element={
          <ProtectedRoute roles={['super_admin']}><UserManagement /></ProtectedRoute>
        } />
        <Route path="reports" element={
          <ProtectedRoute roles={['admin', 'super_admin']}><Reports /></ProtectedRoute>
        } />
      </Route>

      <Route path="/" element={<Navigate to="/admin/login" replace />} />

      {/* Doctor routes */}
      <Route
        path="/doctor"
        element={
          <ProtectedRoute roles={['doctor']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<DoctorDashboard />} />
        <Route path="appointments" element={<DoctorAppointments />} />
        <Route path="prescriptions" element={<DoctorPrescriptions />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
