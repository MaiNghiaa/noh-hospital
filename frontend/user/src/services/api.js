import axios from 'axios'

// ─── Axios Instance ───
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// ─── Request Interceptor ───
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => Promise.reject(error)
)

// ─── Response Interceptor ───
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Có lỗi xảy ra'
    console.error(`[API Error] ${message}`)

    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken')
      window.location.href = '/dang-nhap'
    }

    return Promise.reject({ message, status: error.response?.status })
  }
)

export default api
