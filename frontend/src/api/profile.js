import api from './client'

export const getProfile = () => api.get('/auth/profile')
export const updateProfile = (data) => api.patch('/auth/profile', data)
export const deleteAccount = () => api.delete('/auth/account')