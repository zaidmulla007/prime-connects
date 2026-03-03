import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080'

const client = axios.create({
  baseURL: API_BASE,
  withCredentials: false,
})

// Attach Bearer token on every request
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('user_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// On 401 → clear auth and redirect to login
client.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('user_token')
      localStorage.removeItem('userData')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default client
