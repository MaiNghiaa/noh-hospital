# Backend (NOH Monorepo)

## Chạy server

```bash
npm install
npm run dev
```

Mặc định backend chạy theo biến `PORT` trong `.env` (hiện tại là `5001`).

## Seed dữ liệu

Chạy seed để tạo dữ liệu mẫu cho toàn hệ thống (departments, doctors, users, patients, appointments, records, prescriptions, ...):

```bash
npm run seed:all
```

File seed: `backend/scripts/seedAll.js`

Tin tức + tuyển sinh dùng **một file dùng chung** với frontend: `frontend/user/src/data/news-mock.json`. Khi sửa nội dung, cập nhật file đó, rồi chạy `npm run seed:news -- --wipe` (hoặc `npm run seed:all` để reset cả DB). Ảnh từ URL được tải / ảnh từ đường dẫn `/...` trong `public` được copy vào `uploads/news/seed`.

## Tài khoản mẫu (sau khi seed)

Sau khi chạy `npm run seed:all`, bạn có thể đăng nhập bằng các tài khoản sau:

- **Admin (super_admin)**:
  - **Email**: `admin@noh.vn`
  - **Password**: `Admin@2026`

- **Doctor (doctor portal)**:
  - **Email**: `pgsts.pham.tuan.canh@noh.vn`
  - **Password**: `Doctor@2026`

- **Patient (user portal)**:
  - **Email**: `patient1@gmail.com`
  - **Password**: `Patient@2026`

Ghi chú:

- Các bác sĩ khác cũng được seed với format email: `<slugify(name) với dấu '-' đổi thành '.'>@noh.vn`
- Các bệnh nhân được seed: `patient1@gmail.com` ... `patient25@gmail.com` (cùng password)

## Test

```bash
npm test
```

Hoặc theo nhóm:

```bash
npm run test:hospital
npm run test:admin
npm run test:doctor
npm run test:user
npm run test:integration
```

