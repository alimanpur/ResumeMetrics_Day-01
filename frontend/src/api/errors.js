export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response
    return {
      status,
      message: data?.message || data?.error || 'An error occurred',
      errors: data?.errors || {},
    }
  } else if (error.request) {
    // Request made but no response
    return {
      status: 0,
      message: 'Network error. Please check your connection.',
      errors: {},
    }
  } else {
    // Error in request setup
    return {
      status: 0,
      message: error.message || 'An unexpected error occurred',
      errors: {},
    }
  }
}

export const isAuthError = (error) => {
  return error.response?.status === 401 || error.response?.status === 403
}

export const isNetworkError = (error) => {
  return !error.response && error.request
}