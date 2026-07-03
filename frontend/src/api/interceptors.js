import { refreshToken, logout } from './auth'

export const setupInterceptors = (api) => {
  // Request interceptor to attach JWT
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('accessToken')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error) => Promise.reject(error)
  )

  // Response interceptor for token refresh
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config

      // If error is 401 and we haven't retried yet
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true

        try {
          const refreshTokenValue = localStorage.getItem('refreshToken')
          if (!refreshTokenValue) {
            throw new Error('No refresh token')
          }

          const response = await refreshToken(refreshTokenValue)
          const { accessToken, refreshToken: newRefreshToken } = response.data

          localStorage.setItem('accessToken', accessToken)
          localStorage.setItem('refreshToken', newRefreshToken)

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`
          return api(originalRequest)
        } catch (refreshError) {
          // Refresh failed, logout
          await logout()
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          window.location.href = '/sign-in'
          return Promise.reject(refreshError)
        }
      }

      return Promise.reject(error)
    }
  )
}