import axios from 'axios'

// API基础配置
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'

// 创建axios实例
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器 - 添加认证token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器 - 处理错误
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token过期，清除本地存储
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user_info')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// API接口定义
export const apiService = {
  // 项目相关API
  projects: {
    getAll: (params?: { category?: string; featured?: boolean; limit?: number }) =>
      api.get('/projects', { params }),
    getById: (id: string) => api.get(`/projects/${id}`),
    create: (data: any) => api.post('/projects', data),
    update: (id: string, data: any) => api.put(`/projects/${id}`, data),
    delete: (id: string) => api.delete(`/projects/${id}`),
    getStats: () => api.get('/projects/stats/summary'),
  },

  // 用户相关API
  users: {
    getCurrentUser: () => api.get('/users/me'),
    updateProfile: (data: any) => api.put('/users/profile', data),
    getStats: () => api.get('/users/stats'),
  },

  // 联系表单API
  contact: {
    submit: (data: { name: string; email: string; subject: string; message: string }) =>
      api.post('/contact', data),
    getInfo: () => api.get('/contact/info'),
  },

  // 技能相关API
  skills: {
    getAll: () => api.get('/skills'),
    getByCategory: (category: string) => api.get(`/skills?category=${category}`),
  },

  // 认证相关API
  auth: {
    githubLogin: () => {
      window.location.href = `${API_BASE_URL}/auth/github`
    },
    logout: () => api.post('/auth/logout'),
    getMe: () => api.get('/auth/me'),
  },

  // 设置相关API
  settings: {
    getAll: () => api.get('/settings'),
    update: (key: string, value: string) => api.put('/settings', { key, value }),
  },
}

export default api