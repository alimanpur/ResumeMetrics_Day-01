import api from './client'

export const getSettings = () => api.get('/settings')
export const updateSettings = (data) => api.patch('/settings', data)
export const updateNotificationSettings = (data) => api.patch('/settings/notifications', data)
export const updatePassword = (data) => api.post('/settings/password', data)