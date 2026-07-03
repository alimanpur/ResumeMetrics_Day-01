import api from './client'

export const uploadResume = (formData, onUploadProgress) =>
  api.post('/resumes/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress,
  })

export const getResumes = (params) => api.get('/resumes', { params })
export const getResume = (id) => api.get(`/resumes/${id}`)
export const deleteResume = (id) => api.delete(`/resumes/${id}`)
export const getResumeAnalysis = (id) => api.get(`/resumes/${id}/analysis`)

export const getAnalyses = (params) => api.get('/analyses', { params })
export const getAnalysisByResume = (resumeId) => api.get(`/analyses/resume/${resumeId}`)
export const cancelAnalysis = (id) => api.post(`/analyses/${id}/cancel`)

export const getJobDescriptions = (params) => api.get('/job-descriptions', { params })
export const createJobDescription = (data) => api.post('/job-descriptions', data)
export const deleteJobDescription = (id) => api.delete(`/job-descriptions/${id}`)
