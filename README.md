# 🏥 NOH Hospital - Bệnh viện Tai Mũi Họng Trung ương

Website fullstack hiện đại cho Bệnh viện Tai Mũi Họng Trung ương, được thiết kế lại dựa trên phân tích website gốc [noh.vn](https://noh.vn).

## 📁 Cấu trúc Project

```
noh-hospital/
├── frontend/                    # React + Vite + TailwindCSS
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/          # Button, Card, Input, Modal, Loader, SectionTitle
│   │   │   └── layout/          # Header, Footer, MainLayout
│   │   ├── pages/               # 9 pages: Home, Departments, Doctors, News, ...
│   │   ├── routes/              # AppRoutes (React Router DOM)
│   │   ├── services/            # Axios API services
│   │   ├── context/             # Context API + useReducer (Global state)
│   │   ├── hooks/               # useFetch custom hook
│   │   └── utils/               # helpers, constants, mock data
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── backend/                     # NodeJS + Express + MySQL
│   ├── config/
│   │   ├── database.js          # MySQL connection pool
│   │   └── schema.sql           # Full DB schema + sample data
│   ├── controllers/             # Department, Doctor, News, Appointment
│   ├── models/                  # Database query models
│   ├── routes/                  # API route definitions
│   ├── server.js                # Express entry point
│   ├── .env.example
│   └── package.json
│
└── README.md
```

## 🚀 Cài đặt & Chạy

### Frontend

```bash
cd frontend
npm install
npm run dev
# → http://localhost:3000
```

### Backend

```bash
cd backend
cp .env.example .env        # Sửa thông tin MySQL
npm install
npm run dev
# → http://localhost:5000
```

### Database

```bash
mysql -u root -p < backend/config/schema.sql
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

## 💡 Đặc điểm

- **Responsive** — Hoạt động tốt trên mobile, tablet, desktop
- **Mock data** — Frontend chạy độc lập không cần backend
- **Fallback** — Backend hoạt động cả khi MySQL chưa kết nối
- **Modern UI** — Glassmorphism, gradients, animations, micro-interactions
- **Production-ready** — Structure rõ ràng, có interceptor, error handling
