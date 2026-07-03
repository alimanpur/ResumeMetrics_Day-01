import api from './client'

export const getBillingInfo = () => api.get('/billing')
export const createCheckoutSession = (data) => api.post('/billing/checkout', data)
export const getInvoices = (params) => api.get('/billing/invoices', { params })
export const cancelSubscription = () => api.post('/billing/cancel')