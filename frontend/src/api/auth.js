import api from './client'

export const register = (data) => api.post('/auth/register', data)
export const login = (data) => api.post('/auth/login', data)
export const logout = () => api.post('/auth/logout')
export const refreshToken = (refreshToken) => api.post('/auth/refresh', { refreshToken })
export const forgotPassword = (data) => api.post('/auth/forgot-password', data)
export const resetPassword = (data) => api.post('/auth/reset-password', data)
export const verifyEmail = (token) => api.get(`/auth/verify-email?token=${token}`)
export const getProfile = () => api.get('/auth/profile')
export const updateProfile = (data) => api.patch('/auth/profile', data)
export const changePassword = (data) => api.post('/auth/change-password', data)
export const deleteAccount = () => api.delete('/auth/account')