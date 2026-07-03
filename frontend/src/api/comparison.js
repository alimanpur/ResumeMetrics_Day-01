import api from './client'

export const createComparison = (data) => api.post('/comparisons', data)
export const getComparisons = (params) => api.get('/comparisons', { params })
export const getComparison = (id) => api.get(`/comparisons/${id}`)
export const deleteComparison = (id) => api.delete(`/comparisons/${id}`)