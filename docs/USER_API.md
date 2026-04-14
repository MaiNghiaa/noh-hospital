# User (Patient) API Docs

Tài liệu này mô tả nhóm API dành cho **User/Patient portal**.

## Base URL

- **Dev (Vite proxy)**: FE gọi `'/api'` → proxy sang backend (port 5001).
- **Backend mount**: tất cả endpoints trong tài liệu này đều có prefix: **`/api/user`**

Backend mount tại `backend/server.js`:

- `app.use('/api/user', userRoutes);`

Routes entry:

- `backend/routes/user/index.js`

## Auth model

- **Access token**: trả về từ `login/register/refresh`, FE lưu tại `localStorage.accessToken` và gửi qua header:
  - `Authorization: Bearer <accessToken>`
- **Refresh token**: backend set cookie `refreshToken` (httpOnly). FE cần gửi cookie khi gọi refresh:
  - Axios `withCredentials: true`

FE implementation:

- `frontend/user/src/services/api.js`
  - tự **refresh** khi gặp `401` (gọi `POST /api/user/auth/refresh`) và **retry** request.
- `frontend/user/src/context/AuthContext.jsx`
  - quản lý đăng nhập/đăng xuất, gọi `GET /auth/me` khi có token.

## Response conventions

Hầu hết API trả:

```json
{ "success": true, "message": "...", "data": ... }
```

Một số auth API trả:

```json
{ "success": true, "accessToken": "...", "user": { ... } }
```

Khi lỗi thường trả:

```json
{ "success": false, "message": "..." }
```

## Endpoints

### 1) Auth (Public)

#### POST `/api/user/auth/register`

- **Controller**: `backend/controllers/user/authController.js` → `register`
- **Route**: `backend/routes/user/index.js`
- **FE service**: `frontend/user/src/services/authService.js` → `register(data)`

Body:

```json
{
  "full_name": "Nguyễn Văn A",
  "email": "a@gmail.com",
  "password": "123456",
  "phone": "0912345678",
  "date_of_birth": "1999-01-01",
  "gender": "male",
  "address": "TP.HCM"
}
```

Response (201):

```json
{
  "success": true,
  "message": "Đăng ký thành công",
  "accessToken": "<jwt>",
  "user": { "id": 1, "email": "a@gmail.com", "role": "patient", "full_name": "Nguyễn Văn A", "phone": "0912345678" }
}
```

Notes:

- Tự tạo `users.role = 'patient'`
- Tự tạo `patients` row liên kết `user_id`
- Set cookie `refreshToken`

#### POST `/api/user/auth/login`

- **Controller**: `backend/controllers/user/authController.js` → `login`
- **FE service**: `authService.login(data)` (được gọi trong `AuthContext.login`)

Body:

```json
{ "email": "a@gmail.com", "password": "123456" }
```

Response:

```json
{
  "success": true,
  "accessToken": "<jwt>",
  "user": { "id": 1, "email": "a@gmail.com", "role": "patient", "full_name": "Nguyễn Văn A", "phone": "0912345678", "avatar_url": null }
}
```

Notes:

- Chỉ cho phép `users.role === 'patient'`
- Set cookie `refreshToken`

#### POST `/api/user/auth/refresh`

- **Controller**: `backend/controllers/user/authController.js` → `refresh`
- **FE**: tự gọi trong `frontend/user/src/services/api.js` khi gặp `401`

Requirements:

- Cookie `refreshToken` hợp lệ (httpOnly cookie)

Response:

```json
{ "success": true, "accessToken": "<new_jwt>" }
```

#### POST `/api/user/auth/logout`

- **Controller**: `backend/controllers/user/authController.js` → `logout`
- **FE**: `AuthContext.logout()` → `authService.logout()`

Behavior:

- Xóa refresh token trong DB (nếu có)
- `clearCookie('refreshToken')`

### 2) Authenticated routes (Require access token)

Các endpoint bên dưới được bảo vệ bởi middleware:

- `backend/middleware/user/auth.js`
- router: `backend/routes/user/index.js` → `router.use(userAuth)`

#### GET `/api/user/auth/me`

- **Controller**: `backend/controllers/user/authController.js` → `me`
- **FE**: `authService.getMe()` (được gọi khi khởi động app nếu có token)

Response:

```json
{
  "success": true,
  "user": {
    "id": 1,
    "email": "a@gmail.com",
    "role": "patient",
    "full_name": "Nguyễn Văn A",
    "phone": "0912345678",
    "patient_id": 10,
    "date_of_birth": "1999-01-01T00:00:00.000Z",
    "gender": "male",
    "address": "TP.HCM",
    "insurance_number": null,
    "blood_type": null,
    "allergies": null
  }
}
```

#### PUT `/api/user/auth/profile`

- **Controller**: `backend/controllers/user/authController.js` → `updateProfile`
- **FE**: `frontend/user/src/pages/auth/ProfilePage.jsx` → `authService.updateProfile(form)`

Body (ví dụ):

```json
{
  "full_name": "Nguyễn Văn A",
  "phone": "0912345678",
  "date_of_birth": "1999-01-01",
  "gender": "male",
  "address": "TP.HCM",
  "insurance_number": "BHYT-123",
  "blood_type": "O+",
  "allergies": "Penicillin"
}
```

#### PUT `/api/user/auth/change-password`

- **Controller**: `backend/controllers/user/authController.js` → `changePassword`
- **FE**: `ProfilePage.jsx` → `authService.changePassword({ currentPassword, newPassword })`

Body:

```json
{ "currentPassword": "123456", "newPassword": "1234567" }
```

### 3) Dashboard

#### GET `/api/user/dashboard`

- **Controller**: `backend/controllers/user/patientController.js` → `getDashboard`
- **FE**: `frontend/user/src/pages/auth/PatientDashboard.jsx` → `patientService.getDashboard()`

Response:

```json
{
  "success": true,
  "data": {
    "totalAppointments": 5,
    "upcomingAppointments": 1,
    "totalRecords": 2,
    "recentAppointments": [
      { "id": 1, "department": "Nội", "appointment_date": "2026-04-13T00:00:00.000Z", "appointment_time": "09:00:00", "status": "confirmed", "doctor_name": "BS A" }
    ]
  }
}
```

### 4) Appointments (Lịch hẹn)

#### GET `/api/user/appointments`

- **Controller**: `backend/controllers/user/patientController.js` → `getMyAppointments`
- **FE**: `frontend/user/src/pages/auth/MyAppointmentsPage.jsx`

#### POST `/api/user/appointments`

- **Controller**: `backend/controllers/user/patientController.js` → `createAppointment`
- **FE**: `frontend/user/src/pages/AppointmentPage.jsx` (khi đã đăng nhập)

Body:

```json
{
  "department": "Nội tổng quát",
  "doctor_id": 1,
  "appointment_date": "2026-04-20",
  "appointment_time": "09:00",
  "reason": "Đau đầu"
}
```

Notes:

- Backend tự lấy `full_name/phone/email` từ `users`
- Tạo appointment với `status = 'pending'`

#### GET `/api/user/appointments/:id`

- **Controller**: `backend/controllers/user/patientController.js` → `getAppointmentDetail`
- **FE**: gọi qua `patientService.getAppointmentDetail(id)` (nếu cần chi tiết)

#### PATCH `/api/user/appointments/:id/cancel`

- **Controller**: `backend/controllers/user/patientController.js` → `cancelAppointment`
- **Rule**: chỉ hủy được khi status thuộc `('pending','confirmed')`

Body:

```json
{ "reason": "Bệnh nhân tự hủy" }
```

### 5) Medical Records (Bệnh án)

#### GET `/api/user/medical-records`

- **Controller**: `backend/controllers/user/patientController.js` → `getMyRecords`
- **FE**: `frontend/user/src/pages/auth/MyRecordsPage.jsx`

#### GET `/api/user/medical-records/:id`

- **Controller**: `backend/controllers/user/patientController.js` → `getRecordDetail`
- **FE**: `MyRecordsPage.jsx` (mở modal chi tiết)

Response includes `prescriptions` array.

### 6) Prescriptions (Đơn thuốc)

#### GET `/api/user/prescriptions`

- **Controller**: `backend/controllers/user/patientController.js` → `getMyPrescriptions`
- **FE**: `frontend/user/src/pages/auth/MyPrescriptionsPage.jsx`

## Frontend service map

- Auth:
  - `frontend/user/src/services/authService.js`
  - `frontend/user/src/context/AuthContext.jsx`
- Patient:
  - `frontend/user/src/services/patientService.js`
- Public hospital APIs (không thuộc `/api/user`):
  - `frontend/user/src/services/departmentService.js` → `/api/departments`
  - `frontend/user/src/services/doctorService.js` → `/api/doctors`
  - `frontend/user/src/services/newsService.js` → `/api/news`
  - `frontend/user/src/services/appointmentService.js` → `/api/appointments` (guest booking)

## Quick test with curl (dev)

Ví dụ đăng nhập và gọi `me` (thay base host/port nếu cần):

```bash
curl -i -X POST "http://localhost:5001/api/user/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"a@gmail.com","password":"123456"}'
```

Lấy `accessToken` từ response JSON, rồi:

```bash
curl -s "http://localhost:5001/api/user/auth/me" \
  -H "Authorization: Bearer <accessToken>"
```

