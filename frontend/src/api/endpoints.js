export const API_ENDPOINTS = {
  // Auth
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REFRESH: '/auth/refresh',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  VERIFY_EMAIL: '/auth/verify-email',
  GET_PROFILE: '/auth/profile',
  UPDATE_PROFILE: '/auth/profile',
  CHANGE_PASSWORD: '/auth/change-password',
  DELETE_ACCOUNT: '/auth/account',

  // Resume
  UPLOAD_RESUME: '/resumes/upload',
  GET_RESUMES: '/resumes',
  GET_RESUME: (id) => `/resumes/${id}`,
  DELETE_RESUME: (id) => `/resumes/${id}`,
  GET_RESUME_ANALYSIS: (id) => `/resumes/${id}/analysis`,

  // Analysis
  CREATE_ANALYSIS: '/analyses',
  GET_ANALYSES: '/analyses',
  GET_ANALYSIS: (id) => `/analyses/${id}`,
  GET_ANALYSIS_BY_RESUME: (resumeId) => `/analyses/resume/${resumeId}`,
  CANCEL_ANALYSIS: (id) => `/analyses/${id}/cancel`,

  // Comparison
  CREATE_COMPARISON: '/comparisons',
  GET_COMPARISONS: '/comparisons',
  GET_COMPARISON: (id) => `/comparisons/${id}`,
  DELETE_COMPARISON: (id) => `/comparisons/${id}`,

  // Billing
  GET_BILLING: '/billing',
  CREATE_CHECKOUT: '/billing/checkout',
  GET_INVOICES: '/billing/invoices',
  CANCEL_SUBSCRIPTION: '/billing/cancel',

  // Settings
  GET_SETTINGS: '/settings',
  UPDATE_SETTINGS: '/settings',
  UPDATE_NOTIFICATIONS: '/settings/notifications',
  UPDATE_PASSWORD: '/settings/password',
}