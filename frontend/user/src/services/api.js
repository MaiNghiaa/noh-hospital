import axios from 'axios'

// ─── Axios Instance ───
const baseURL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

// A bare client for refresh (no interceptors recursion)
const refreshClient = axios.create({
  baseURL,
  timeout: 10000,
  withCredentials: true,
})

let isRefreshing = false
let refreshWaitQueue = []

function resolveRefreshQueue(error, newToken) {
  refreshWaitQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error)
    else resolve(newToken)
  })
  refreshWaitQueue = []
}

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
  async (error) => {
    const message = error.response?.data?.message || error.message || 'Có lỗi xảy ra'
    console.error(`[API Error] ${message}`)

    const originalRequest = error.config
    const status = error.response?.status
    const is401 = status === 401
    const isRefreshCall = originalRequest?.url?.includes('/user/auth/refresh')

    if (is401 && originalRequest && !originalRequest._retry && !isRefreshCall) {
      originalRequest._retry = true

      if (isRefreshing) {
        try {
          const newToken = await new Promise((resolve, reject) => {
            refreshWaitQueue.push({ resolve, reject })
          })
          originalRequest.headers.Authorization = `Bearer ${newToken}`
          return api(originalRequest)
        } catch (e) {
          // fallthrough to logout below
        }
      }

      isRefreshing = true
      try {
        const res = await refreshClient.post('/user/auth/refresh')
        const newToken = res?.data?.accessToken
        if (!newToken) {
          throw new Error('Refresh token failed')
        }

        localStorage.setItem('accessToken', newToken)
        api.defaults.headers.common.Authorization = `Bearer ${newToken}`
        resolveRefreshQueue(null, newToken)
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return api(originalRequest)
      } catch (e) {
        resolveRefreshQueue(e, null)
      } finally {
        isRefreshing = false
      }
    }

    if (is401) {
      localStorage.removeItem('accessToken')
      window.location.href = '/dang-nhap'
    }

    return Promise.reject({ message, status })
  }
)

export default api
