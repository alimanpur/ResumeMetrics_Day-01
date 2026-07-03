import api from './client'

export const createAnalysis = (data) => api.post('/analyses', data)
export const getAnalyses = (params) => api.get('/analyses', { params })
export const getAnalysis = (id) => api.get(`/analyses/${id}`)
export const getAnalysisByResume = (resumeId) => api.get(`/analyses/resume/${resumeId}`)
export const cancelAnalysis = (id) => api.post(`/analyses/${id}/cancel`)