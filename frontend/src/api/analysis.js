import api from './client'

export const createAnalysis = (data) => api.post('/analyses', data)
export const getAnalyses = (params) => api.get('/analyses', { params })
export const getAnalysis = (id) => api.get(`/analyses/${id}`)
export const getAnalysisByResume = (resumeId) => api.get(`/analyses/resume/${resumeId}`)
export const cancelAnalysis = (id) => api.post(`/analyses/${id}/cancel`)
export const getComprehensiveReport = (id) => api.get(`/analyses/${id}/comprehensive-report`)
export const getCredibilityAnalysis = (id) => api.get(`/analyses/${id}/credibility`)
export const getSkillsIntelligence = (id) => api.get(`/analyses/${id}/skills-intelligence`)
export const getExperienceIntelligence = (id) => api.get(`/analyses/${id}/experience`)
export const getProjectIntelligence = (id) => api.get(`/analyses/${id}/projects`)
export const getInterviewPrep = (id) => api.get(`/analyses/${id}/interview-prep`)
export const getLearningRoadmap = (id) => api.get(`/analyses/${id}/learning-roadmap`)
