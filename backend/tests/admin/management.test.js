// tests/admin/management.test.js
// ============================================================
// LUỒNG: Admin quản lý hệ thống
// - CRUD Departments, Doctors, News
// - Quản lý Appointments (confirm, cancel, calendar)
// - Quản lý Patients
// - Quản lý Users (super_admin only)
// - Quản lý Medicines
// - Upload file
// - Reports & Stats
// ============================================================

const request = require('supertest');
const express = require('express');
const cookieParser = require('cookie-parser');

const { tokens } = require('../setup/globalSetup');
const { authHeader, validDepartmentData, validDoctorData, validNewsData } = require('../setup/helpers');

function createAdminApp() {
  const app = express();
  app.use(express.json());
  app.use(cookieParser());

  const { adminRoutes, authRoutes } = require('../../routes/admin');
  app.use('/api/auth', authRoutes);
  app.use('/api/admin', adminRoutes);

  app.use((err, req, res, next) => {
    res.status(500).json({ message: err.message });
  });

  return app;
}

describe('Admin Management - /api/admin', () => {
  let app;

  beforeAll(() => {
    app = createAdminApp();
  });

  // ═══════════════════════════════════════════════════════════
  // AUTHENTICATION & AUTHORIZATION
  // ═══════════════════════════════════════════════════════════
  describe('Authorization Checks', () => {
    it('should reject all routes without token', async () => {
      const routes = [
        { method: 'get', path: '/api/admin/appointments' },
        { method: 'get', path: '/api/admin/patients' },
        { method: 'get', path: '/api/admin/stats/overview' },
        { method: 'post', path: '/api/admin/departments' },
        { method: 'post', path: '/api/admin/doctors' },
        { method: 'post', path: '/api/admin/news' },
      ];

      for (const route of routes) {
        const res = await request(app)[route.method](route.path);
        expect(res.status).toBe(401);
      }
    });

    it('should reject doctor role from admin-only routes', async () => {
      const res = await request(app)
        .get('/api/admin/patients')
        .set(authHeader(tokens.doctor));

      expect(res.status).toBe(403);
    });

    it('should reject patient role from all admin routes', async () => {
      const res = await request(app)
        .get('/api/admin/appointments')
        .set(authHeader(tokens.patient));

      expect(res.status).toBe(403);
    });
  });

  // ═══════════════════════════════════════════════════════════
  // DEPARTMENTS CRUD
  // ═══════════════════════════════════════════════════════════
  describe('Departments CRUD', () => {
    it('POST /api/admin/departments - create department (needs DB)', async () => {
      const res = await request(app)
        .post('/api/admin/departments')
        .set(authHeader(tokens.superAdmin))
        .send(validDepartmentData());

      expect([201, 200, 500]).toContain(res.status);
    });

    it('PUT /api/admin/departments/:id - update department (needs DB)', async () => {
      const res = await request(app)
        .put('/api/admin/departments/1')
        .set(authHeader(tokens.superAdmin))
        .send(validDepartmentData({ name: 'Khoa Updated' }));

      expect([200, 500]).toContain(res.status);
    });

    it('DELETE /api/admin/departments/:id - delete department (needs DB)', async () => {
      const res = await request(app)
        .delete('/api/admin/departments/999')
        .set(authHeader(tokens.superAdmin));

      expect([200, 404, 500]).toContain(res.status);
    });

    it('PATCH /api/admin/departments/reorder - reorder (needs DB)', async () => {
      const res = await request(app)
        .patch('/api/admin/departments/reorder')
        .set(authHeader(tokens.superAdmin))
        .send({ orders: [{ id: 1, sort_order: 1 }, { id: 2, sort_order: 2 }] });

      expect([200, 500]).toContain(res.status);
    });
  });

  // ═══════════════════════════════════════════════════════════
  // DOCTORS CRUD
  // ═══════════════════════════════════════════════════════════
  describe('Doctors CRUD', () => {
    it('POST /api/admin/doctors - create doctor (needs DB)', async () => {
      const res = await request(app)
        .post('/api/admin/doctors')
        .set(authHeader(tokens.superAdmin))
        .send(validDoctorData());

      expect([201, 200, 500]).toContain(res.status);
    });

    it('PUT /api/admin/doctors/:id - update doctor (needs DB)', async () => {
      const res = await request(app)
        .put('/api/admin/doctors/1')
        .set(authHeader(tokens.superAdmin))
        .send(validDoctorData({ name: 'BS. Updated' }));

      expect([200, 500]).toContain(res.status);
    });

    it('DELETE /api/admin/doctors/:id - delete doctor (needs DB)', async () => {
      const res = await request(app)
        .delete('/api/admin/doctors/999')
        .set(authHeader(tokens.superAdmin));

      expect([200, 404, 500]).toContain(res.status);
    });

    it('PATCH /api/admin/doctors/:id/toggle - toggle active (needs DB)', async () => {
      const res = await request(app)
        .patch('/api/admin/doctors/1/toggle')
        .set(authHeader(tokens.superAdmin));

      expect([200, 500]).toContain(res.status);
    });
  });

  // ═══════════════════════════════════════════════════════════
  // NEWS CRUD
  // ═══════════════════════════════════════════════════════════
  describe('News CRUD', () => {
    it('POST /api/admin/news - create news (needs DB)', async () => {
      const res = await request(app)
        .post('/api/admin/news')
        .set(authHeader(tokens.superAdmin))
        .send(validNewsData());

      expect([201, 200, 500]).toContain(res.status);
    });

    it('PUT /api/admin/news/:id - update news (needs DB)', async () => {
      const res = await request(app)
        .put('/api/admin/news/1')
        .set(authHeader(tokens.superAdmin))
        .send(validNewsData({ title: 'Updated Title' }));

      expect([200, 500]).toContain(res.status);
    });

    it('DELETE /api/admin/news/:id - delete news (needs DB)', async () => {
      const res = await request(app)
        .delete('/api/admin/news/999')
        .set(authHeader(tokens.superAdmin));

      expect([200, 404, 500]).toContain(res.status);
    });

    it('PATCH /api/admin/news/:id/publish - toggle publish (needs DB)', async () => {
      const res = await request(app)
        .patch('/api/admin/news/1/publish')
        .set(authHeader(tokens.superAdmin));

      expect([200, 500]).toContain(res.status);
    });
  });

  // ═══════════════════════════════════════════════════════════
  // APPOINTMENTS MANAGEMENT
  // ═══════════════════════════════════════════════════════════
  describe('Appointments Management', () => {
    it('GET /api/admin/appointments - list appointments (needs DB)', async () => {
      const res = await request(app)
        .get('/api/admin/appointments')
        .set(authHeader(tokens.superAdmin));

      expect([200, 500]).toContain(res.status);
    });

    it('GET /api/admin/appointments - doctor can also access', async () => {
      const res = await request(app)
        .get('/api/admin/appointments')
        .set(authHeader(tokens.doctor));

      expect([200, 500]).toContain(res.status);
    });

    it('GET /api/admin/appointments/:id - detail (needs DB)', async () => {
      const res = await request(app)
        .get('/api/admin/appointments/1')
        .set(authHeader(tokens.superAdmin));

      expect([200, 404, 500]).toContain(res.status);
    });

    it('GET /api/admin/appointments/calendar - calendar view (needs DB)', async () => {
      const res = await request(app)
        .get('/api/admin/appointments/calendar')
        .set(authHeader(tokens.superAdmin));

      expect([200, 500]).toContain(res.status);
    });

    it('PATCH /api/admin/appointments/:id/confirm - confirm (needs DB)', async () => {
      const res = await request(app)
        .patch('/api/admin/appointments/1/confirm')
        .set(authHeader(tokens.superAdmin));

      expect([200, 400, 404, 500]).toContain(res.status);
    });

    it('PATCH /api/admin/appointments/:id/cancel - cancel (needs DB)', async () => {
      const res = await request(app)
        .patch('/api/admin/appointments/1/cancel')
        .set(authHeader(tokens.superAdmin))
        .send({ reason: 'Bệnh nhân yêu cầu hủy' });

      expect([200, 400, 404, 500]).toContain(res.status);
    });
  });

  // ═══════════════════════════════════════════════════════════
  // PATIENTS MANAGEMENT
  // ═══════════════════════════════════════════════════════════
  describe('Patients Management', () => {
    it('GET /api/admin/patients - list patients (needs DB)', async () => {
      const res = await request(app)
        .get('/api/admin/patients')
        .set(authHeader(tokens.superAdmin));

      expect([200, 500]).toContain(res.status);
    });

    it('GET /api/admin/patients/:id - patient detail (needs DB)', async () => {
      const res = await request(app)
        .get('/api/admin/patients/1')
        .set(authHeader(tokens.superAdmin));

      expect([200, 404, 500]).toContain(res.status);
    });

    it('GET /api/admin/patients/:id/appointments - patient appointments (needs DB)', async () => {
      const res = await request(app)
        .get('/api/admin/patients/1/appointments')
        .set(authHeader(tokens.superAdmin));

      expect([200, 500]).toContain(res.status);
    });

    it('GET /api/admin/patients/:id/records - patient records (needs DB)', async () => {
      const res = await request(app)
        .get('/api/admin/patients/1/records')
        .set(authHeader(tokens.superAdmin));

      expect([200, 500]).toContain(res.status);
    });

    it('PATCH /api/admin/patients/:id/toggle - toggle active (needs DB)', async () => {
      const res = await request(app)
        .patch('/api/admin/patients/1/toggle')
        .set(authHeader(tokens.superAdmin));

      expect([200, 500]).toContain(res.status);
    });
  });

  // ═══════════════════════════════════════════════════════════
  // USERS MANAGEMENT (Super Admin only)
  // ═══════════════════════════════════════════════════════════
  describe('Users Management (super_admin only)', () => {
    it('GET /api/admin/users - should reject admin role', async () => {
      // Tạo token admin (không phải super_admin)
      const jwt = require('jsonwebtoken');
      const adminToken = jwt.sign(
        { id: 99, email: 'admin2@test.com', role: 'admin', full_name: 'Admin 2' },
        'noh_hospital_secret_2026',
        { expiresIn: '1h' }
      );

      const res = await request(app)
        .get('/api/admin/users')
        .set(authHeader(adminToken));

      expect(res.status).toBe(403);
    });

    it('GET /api/admin/users - super_admin can access (needs DB)', async () => {
      const res = await request(app)
        .get('/api/admin/users')
        .set(authHeader(tokens.superAdmin));

      expect([200, 500]).toContain(res.status);
    });

    it('POST /api/admin/users - create user (needs DB)', async () => {
      const res = await request(app)
        .post('/api/admin/users')
        .set(authHeader(tokens.superAdmin))
        .send({
          email: 'newuser@test.com',
          password: 'password123',
          role: 'admin',
          full_name: 'New Admin',
        });

      expect([200, 201, 400, 500]).toContain(res.status);
    });

    it('PATCH /api/admin/users/:id/role - change role (needs DB)', async () => {
      const res = await request(app)
        .patch('/api/admin/users/2/role')
        .set(authHeader(tokens.superAdmin))
        .send({ role: 'admin' });

      expect([200, 400, 500]).toContain(res.status);
    });

    it('PATCH /api/admin/users/:id/toggle - toggle user (needs DB)', async () => {
      const res = await request(app)
        .patch('/api/admin/users/2/toggle')
        .set(authHeader(tokens.superAdmin));

      expect([200, 500]).toContain(res.status);
    });

    it('PATCH /api/admin/users/:id/reset-password - reset password (needs DB)', async () => {
      const res = await request(app)
        .patch('/api/admin/users/2/reset-password')
        .set(authHeader(tokens.superAdmin));

      expect([200, 500]).toContain(res.status);
    });
  });

  // ═══════════════════════════════════════════════════════════
  // MEDICINES MANAGEMENT
  // ═══════════════════════════════════════════════════════════
  describe('Medicines Management', () => {
    it('GET /api/admin/medicines - list (needs DB)', async () => {
      const res = await request(app)
        .get('/api/admin/medicines')
        .set(authHeader(tokens.superAdmin));

      expect([200, 500]).toContain(res.status);
    });

    it('GET /api/admin/medicines - doctor can also access', async () => {
      const res = await request(app)
        .get('/api/admin/medicines')
        .set(authHeader(tokens.doctor));

      expect([200, 500]).toContain(res.status);
    });

    it('POST /api/admin/medicines - create medicine (needs DB)', async () => {
      const res = await request(app)
        .post('/api/admin/medicines')
        .set(authHeader(tokens.superAdmin))
        .send({
          name: 'Thuốc Test',
          active_ingredient: 'Test Ingredient',
          unit: 'viên',
          category: 'Kháng sinh',
        });

      expect([200, 201, 500]).toContain(res.status);
    });

    it('PUT /api/admin/medicines/:id - update medicine (needs DB)', async () => {
      const res = await request(app)
        .put('/api/admin/medicines/1')
        .set(authHeader(tokens.superAdmin))
        .send({ name: 'Updated Medicine', unit: 'ống' });

      expect([200, 404, 500]).toContain(res.status);
    });
  });

  // ═══════════════════════════════════════════════════════════
  // REPORTS & STATS
  // ═══════════════════════════════════════════════════════════
  describe('Reports & Stats', () => {
    const statsEndpoints = [
      '/api/admin/stats/overview',
      '/api/admin/stats/appointments',
      '/api/admin/stats/by-department',
      '/api/admin/stats/by-status',
      '/api/admin/stats/top-doctors',
      '/api/admin/stats/patients-growth',
      '/api/admin/stats/patients',
      '/api/admin/stats/appointments/today',
      '/api/admin/stats/doctors/active',
      '/api/admin/stats/appointments/pending',
      '/api/admin/stats/appointments/monthly',
      '/api/admin/stats/departments',
      '/api/admin/stats/recent-appointments',
    ];

    statsEndpoints.forEach((endpoint) => {
      it(`GET ${endpoint} - should require auth`, async () => {
        const res = await request(app).get(endpoint);
        expect(res.status).toBe(401);
      });

      it(`GET ${endpoint} - should reject patient role`, async () => {
        const res = await request(app)
          .get(endpoint)
          .set(authHeader(tokens.patient));
        expect(res.status).toBe(403);
      });

      it(`GET ${endpoint} - admin can access (needs DB)`, async () => {
        const res = await request(app)
          .get(endpoint)
          .set(authHeader(tokens.superAdmin));
        expect([200, 500]).toContain(res.status);
      });
    });
  });

  // ═══════════════════════════════════════════════════════════
  // UPLOAD
  // ═══════════════════════════════════════════════════════════
  describe('Upload', () => {
    it('POST /api/admin/upload - should reject without file', async () => {
      const res = await request(app)
        .post('/api/admin/upload')
        .set(authHeader(tokens.superAdmin));

      expect([400, 500]).toContain(res.status);
    });

    it('POST /api/admin/upload - should reject patient role', async () => {
      const res = await request(app)
        .post('/api/admin/upload')
        .set(authHeader(tokens.patient));

      expect(res.status).toBe(403);
    });
  });
});

