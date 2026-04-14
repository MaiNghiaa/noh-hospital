// tests/middleware/auth.test.js
// ============================================================
// LUỒNG: Middleware xác thực & phân quyền
// - Admin auth middleware
// - User auth middleware
// - Role middleware
// ============================================================

const jwt = require('jsonwebtoken');
const express = require('express');
const request = require('supertest');

const JWT_SECRET = 'noh_hospital_secret_2026';

// ─── Tạo app test cho middleware ─────────────────────────────
function createMiddlewareApp(middleware, successHandler) {
  const app = express();
  app.use(express.json());
  app.get('/test', middleware, successHandler || ((req, res) => {
    res.json({ success: true, user: req.user });
  }));
  app.use((err, req, res, next) => {
    res.status(500).json({ message: err.message });
  });
  return app;
}

describe('Admin Auth Middleware', () => {
  const adminAuth = require('../../middleware/admin/auth');

  it('should reject request without Authorization header', async () => {
    const app = createMiddlewareApp(adminAuth);
    const res = await request(app).get('/test');

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('message');
  });

  it('should reject request with empty Bearer token', async () => {
    const app = createMiddlewareApp(adminAuth);
    const res = await request(app).get('/test').set('Authorization', 'Bearer ');

    expect(res.status).toBe(401);
  });

  it('should reject invalid token', async () => {
    const app = createMiddlewareApp(adminAuth);
    const res = await request(app).get('/test').set('Authorization', 'Bearer invalid.token.here');

    expect(res.status).toBe(401);
  });

  it('should reject expired token', async () => {
    const token = jwt.sign({ id: 1, email: 'test@test.com', role: 'admin', full_name: 'Test' }, JWT_SECRET, { expiresIn: '0s' });

    await new Promise((r) => setTimeout(r, 1100));

    const app = createMiddlewareApp(adminAuth);
    const res = await request(app).get('/test').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('code', 'TOKEN_EXPIRED');
  });

  it('should accept valid token and set req.user', async () => {
    const token = jwt.sign(
      { id: 1, email: 'admin@test.com', role: 'super_admin', full_name: 'Admin', doctor_id: null },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    const app = createMiddlewareApp(adminAuth);
    const res = await request(app).get('/test').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.user).toHaveProperty('id', 1);
    expect(res.body.user).toHaveProperty('role', 'super_admin');
    expect(res.body.user).toHaveProperty('email', 'admin@test.com');
    expect(res.body.user).toHaveProperty('full_name', 'Admin');
  });

  it('should reject non-Bearer auth scheme', async () => {
    const app = createMiddlewareApp(adminAuth);
    const res = await request(app).get('/test').set('Authorization', 'Basic dXNlcjpwYXNz');

    expect(res.status).toBe(401);
  });
});

describe('User Auth Middleware', () => {
  const userAuth = require('../../middleware/user/auth');

  it('should reject request without token', async () => {
    const app = createMiddlewareApp(userAuth);
    const res = await request(app).get('/test');

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('should reject expired token with code TOKEN_EXPIRED', async () => {
    const token = jwt.sign({ id: 3, email: 'p@test.com', role: 'patient', full_name: 'P' }, JWT_SECRET, { expiresIn: '0s' });

    await new Promise((r) => setTimeout(r, 1100));

    const app = createMiddlewareApp(userAuth);
    const res = await request(app).get('/test').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('code', 'TOKEN_EXPIRED');
  });

  it('should accept valid patient token', async () => {
    const token = jwt.sign(
      { id: 3, email: 'patient@test.com', role: 'patient', full_name: 'Patient Test' },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    const app = createMiddlewareApp(userAuth);
    const res = await request(app).get('/test').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.user).toHaveProperty('role', 'patient');
  });
});

describe('Role Middleware', () => {
  const adminAuth = require('../../middleware/admin/auth');
  const { requireRole } = require('../../middleware/admin/role');

  function createRoleApp(...roles) {
    const app = express();
    app.get('/test', adminAuth, requireRole(...roles), (req, res) => {
      res.json({ success: true, role: req.user.role });
    });
    return app;
  }

  it('should allow super_admin to access admin routes', async () => {
    const token = jwt.sign({ id: 1, email: 'sa@t.c', role: 'super_admin', full_name: 'SA' }, JWT_SECRET, { expiresIn: '1h' });
    const app = createRoleApp('admin', 'super_admin');
    const res = await request(app).get('/test').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
  });

  it('should allow admin to access admin routes', async () => {
    const token = jwt.sign({ id: 2, email: 'a@t.c', role: 'admin', full_name: 'A' }, JWT_SECRET, { expiresIn: '1h' });
    const app = createRoleApp('admin', 'super_admin');
    const res = await request(app).get('/test').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
  });

  it('should reject doctor from admin-only routes', async () => {
    const token = jwt.sign({ id: 3, email: 'd@t.c', role: 'doctor', full_name: 'D', doctor_id: 1 }, JWT_SECRET, { expiresIn: '1h' });
    const app = createRoleApp('admin', 'super_admin');
    const res = await request(app).get('/test').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty('required');
    expect(res.body).toHaveProperty('current', 'doctor');
  });

  it('should reject patient from all admin routes', async () => {
    const token = jwt.sign({ id: 4, email: 'p@t.c', role: 'patient', full_name: 'P' }, JWT_SECRET, { expiresIn: '1h' });
    const app = createRoleApp('admin', 'super_admin');
    const res = await request(app).get('/test').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(403);
  });

  it('should allow doctor to access doctor-only routes', async () => {
    const token = jwt.sign({ id: 3, email: 'd@t.c', role: 'doctor', full_name: 'D', doctor_id: 1 }, JWT_SECRET, { expiresIn: '1h' });
    const app = createRoleApp('doctor');
    const res = await request(app).get('/test').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
  });

  it('should allow doctor & admin to access shared routes', async () => {
    const doctorToken = jwt.sign({ id: 3, email: 'd@t.c', role: 'doctor', full_name: 'D', doctor_id: 1 }, JWT_SECRET, { expiresIn: '1h' });
    const adminToken = jwt.sign({ id: 1, email: 'a@t.c', role: 'admin', full_name: 'A' }, JWT_SECRET, { expiresIn: '1h' });

    const app = createRoleApp('admin', 'super_admin', 'doctor');

    const res1 = await request(app).get('/test').set('Authorization', `Bearer ${doctorToken}`);
    const res2 = await request(app).get('/test').set('Authorization', `Bearer ${adminToken}`);

    expect(res1.status).toBe(200);
    expect(res2.status).toBe(200);
  });

  it('should reject unauthenticated request', async () => {
    const app = createRoleApp('admin');
    const res = await request(app).get('/test');

    expect(res.status).toBe(401);
  });
});

