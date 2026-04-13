# 🏥 NOH Hospital - Bệnh viện Tai Mũi Họng Trung ương

Website fullstack hiện đại cho Bệnh viện Tai Mũi Họng Trung ương, được thiết kế lại dựa trên phân tích website gốc [noh.vn](https://noh.vn).

## 📁 Cấu trúc Project (Monorepo)

```
noh-hospital/
├── frontend/
│   ├── user/                    # React + Vite (user-facing)
│   └── admin/                   # React + Vite (admin)
│
├── backend/                     # 1 API server (Express)
│   ├── server.js                # Entry point (mounts both hospital + admin routes)
│   ├── config/                  # Shared config (env, db)
│   ├── controllers/             # controllers/hospital + controllers/admin
│   ├── routes/                  # routes/hospital + routes/admin
│   ├── models/                  # models/hospital
│   ├── middleware/              # middleware/admin
│   ├── scripts/                 # scripts/admin
│   └── uploads/                 # runtime uploads
│
└── README.md
```

## 🚀 Cài đặt & Chạy

### Chạy tất cả (Backend + 2 Frontend)

```bash
npm install

# Tạo env cho backend (chung cho cả user+admin API)
cp backend/.env.example backend/.env

npm run dev
# Backend: http://localhost:5001
# Frontend user:  http://localhost:5173
# Frontend admin: http://localhost:5174
```

### Chạy riêng từng phần

```bash
# Backend
npm run dev:backend

# Frontend user
npm run dev:user

# Frontend admin
npm run dev:admin
```

### Database

```bash
# Schema chung (user + admin)
mysql -u root -p < backend/schema.sql
```

## 🎯 Các trang

| Route                      | Mô tả                    |
|----------------------------|---------------------------|
| `/`                        | Trang chủ                 |
| `/gioi-thieu`              | Giới thiệu bệnh viện     |
| `/chuyen-khoa`             | Danh sách chuyên khoa     |
| `/chuyen-khoa/:slug`       | Chi tiết chuyên khoa      |
| `/doi-ngu-chuyen-gia`      | Danh sách bác sĩ          |
| `/doi-ngu-chuyen-gia/:id`  | Chi tiết bác sĩ           |
| `/tin-tuc`                 | Danh sách tin tức          |
| `/tin-tuc/:slug`           | Chi tiết bài viết          |
| `/dat-lich-kham`           | Đặt lịch khám online      |
| `/lien-he`                 | Liên hệ                   |

## ⚙️ Công nghệ

**Frontend:** React 18 (Vite), React Router DOM v6, Context API + useReducer, TailwindCSS, Axios, Lucide React Icons

**Backend:** Express.js, MySQL2 (promise), CORS, dotenv

## 🔌 API Endpoints

| Method | Endpoint              | Mô tả               |
|--------|-----------------------|----------------------|
| GET    | /api/departments      | Danh sách chuyên khoa|
| GET    | /api/departments/:id  | Chi tiết chuyên khoa |
| GET    | /api/doctors          | Danh sách bác sĩ     |
| GET    | /api/doctors/search   | Tìm kiếm bác sĩ     |
| GET    | /api/doctors/:id      | Chi tiết bác sĩ      |
| GET    | /api/news             | Danh sách tin tức     |
| GET    | /api/news/:id         | Chi tiết tin tức      |
| POST   | /api/appointments     | Đặt lịch khám        |
| GET    | /api/health           | Health check          |

### Admin API (tóm tắt)

- **Auth**: `/api/auth/*`
- **Admin**: `/api/admin/*`
- **Doctor**: `/api/doctor/*`

## 💡 Đặc điểm

- **Responsive** — Hoạt động tốt trên mobile, tablet, desktop
- **Mock data** — Frontend chạy độc lập không cần backend
- **Fallback** — Backend hoạt động cả khi MySQL chưa kết nối
- **Modern UI** — Glassmorphism, gradients, animations, micro-interactions
- **Production-ready** — Structure rõ ràng, có interceptor, error handling
