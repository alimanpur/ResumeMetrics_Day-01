import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import * as authApi from '../api/auth'
import * as resumeApi from '../api/resume'
import * as analysisApi from '../api/analysis'
import * as comparisonApi from '../api/comparison'
import * as billingApi from '../api/billing'
import * as profileApi from '../api/profile'
import * as settingsApi from '../api/settings'
import { handleApiError } from '../api/errors'

// Auth hooks
export const useRegister = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (response) => {
      const { user, accessToken, refreshToken } = response.data.data
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
      toast.success('Registration successful! Welcome to ResumeMetrics.')
      queryClient.invalidateQueries()
    },
    onError: (error) => {
      const { message } = handleApiError(error)
      toast.error(message)
    },
  })
}

export const useLogin = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (response) => {
      const { user, accessToken, refreshToken } = response.data.data
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
      toast.success('Login successful!')
      queryClient.invalidateQueries()
    },
    onError: (error) => {
      const { message } = handleApiError(error)
      toast.error(message)
    },
  })
}

export const useLogout = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      queryClient.clear()
      toast.success('Logged out successfully')
    },
    onError: () => {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      queryClient.clear()
    },
  })
}

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: authApi.forgotPassword,
    onSuccess: () => {
      toast.success('Password reset email sent! Please check your inbox.')
    },
    onError: (error) => {
      const { message } = handleApiError(error)
      toast.error(message)
    },
  })
}

export const useResetPassword = () => {
  return useMutation({
    mutationFn: authApi.resetPassword,
    onSuccess: () => {
      toast.success('Password reset successful! You can now log in.')
    },
    onError: (error) => {
      const { message } = handleApiError(error)
      toast.error(message)
    },
  })
}

export const useVerifyEmail = () => {
  return useMutation({
    mutationFn: authApi.verifyEmail,
    onSuccess: () => {
      toast.success('Email verified successfully!')
    },
    onError: (error) => {
      const { message } = handleApiError(error)
      toast.error(message)
    },
  })
}

export const useChangePassword = () => {
  return useMutation({
    mutationFn: authApi.changePassword,
    onSuccess: () => {
      toast.success('Password changed successfully!')
    },
    onError: (error) => {
      const { message } = handleApiError(error)
      toast.error(message)
    },
  })
}

export const useProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: authApi.getProfile,
    retry: false,
  })
}

export const useUpdateProfile = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: authApi.updateProfile,
    onSuccess: () => {
      toast.success('Profile updated successfully!')
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
    onError: (error) => {
      const { message } = handleApiError(error)
      toast.error(message)
    },
  })
}

export const useDeleteAccount = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: authApi.deleteAccount,
    onSuccess: () => {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      queryClient.clear()
      toast.success('Account deleted successfully')
      window.location.href = '/'
    },
    onError: (error) => {
      const { message } = handleApiError(error)
      toast.error(message)
    },
  })
}

export const useCreateJobDescription = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ title, description, company, skills }) => 
      import('../api/resume').then(m => m.createJobDescription({ title, description, company, skills })),
    onSuccess: () => {
      toast.success('Job description saved!')
      queryClient.invalidateQueries({ queryKey: ['jobDescriptions'] })
    },
    onError: (error) => {
      const { message } = handleApiError(error)
      toast.error(message)
    },
  })
}

// Job description hooks
export const useJobDescriptions = (params) => {
  return useQuery({
    queryKey: ['jobDescriptions', params],
    queryFn: () => import('../api/resume').then(m => m.getJobDescriptions(params)),
  })
}

// Resume hooks
export const useUploadResume = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ formData, onUploadProgress }) => resumeApi.uploadResume(formData, onUploadProgress),
    onSuccess: (response) => {
      toast.success('Resume uploaded successfully!')
      // Invalidate ALL related queries so every page updates automatically
      queryClient.invalidateQueries({ queryKey: ['resumes'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'resumes'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'analyses'] })
      queryClient.invalidateQueries({ queryKey: ['analyses'] })
      queryClient.invalidateQueries({ queryKey: ['comparisons'] })
      queryClient.invalidateQueries({ queryKey: ['analysis'] })
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      queryClient.invalidateQueries({ queryKey: ['jobDescriptions'] })
      // Return the response data so the component's onSuccess can use it
      return response
    },
    onError: (error) => {
      const { message } = handleApiError(error)
      toast.error(message)
    },
  })
}

export const useResumes = (params) => {
  return useQuery({
    queryKey: ['resumes', params],
    queryFn: () => resumeApi.getResumes(params),
  })
}

export const useResume = (id) => {
  return useQuery({
    queryKey: ['resume', id],
    queryFn: () => resumeApi.getResume(id),
    enabled: !!id,
  })
}

export const useDeleteResume = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: resumeApi.deleteResume,
    onSuccess: () => {
      toast.success('Resume deleted successfully!')
      queryClient.invalidateQueries({ queryKey: ['resumes'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
    onError: (error) => {
      const { message } = handleApiError(error)
      toast.error(message)
    },
  })
}

// Analysis hooks
export const useCreateAnalysis = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: analysisApi.createAnalysis,
    onSuccess: () => {
      toast.success('Analysis created successfully!')
      queryClient.invalidateQueries({ queryKey: ['analyses'] })
    },
    onError: (error) => {
      const { message } = handleApiError(error)
      toast.error(message)
    },
  })
}

export const useAnalyses = (params) => {
  return useQuery({
    queryKey: ['analyses', params],
    queryFn: () => analysisApi.getAnalyses(params),
  })
}

export const useAnalysis = (id) => {
  return useQuery({
    queryKey: ['analysis', id],
    queryFn: () => analysisApi.getAnalysis(id),
    enabled: !!id,
    refetchInterval: (query) => {
      const status = query?.state?.data?.data?.data?.status || query?.state?.data?.data?.status
      if (status === 'PENDING' || status === 'PROCESSING') {
        return 2000
      }
      return false
    },
  })
}

export const useAnalysisByResume = (resumeId) => {
  return useQuery({
    queryKey: ['analysis', 'resume', resumeId],
    queryFn: () => analysisApi.getAnalysisByResume(resumeId),
    enabled: !!resumeId,
  })
}

export const useComprehensiveReport = (id) => {
  return useQuery({
    queryKey: ['analysis', id, 'comprehensiveReport'],
    queryFn: () => analysisApi.getComprehensiveReport(id),
    enabled: !!id,
  })
}

export const useCredibilityAnalysis = (id) => {
  return useQuery({
    queryKey: ['analysis', id, 'credibility'],
    queryFn: () => analysisApi.getCredibilityAnalysis(id),
    enabled: !!id,
  })
}

export const useSkillsIntelligence = (id) => {
  return useQuery({
    queryKey: ['analysis', id, 'skillsIntelligence'],
    queryFn: () => analysisApi.getSkillsIntelligence(id),
    enabled: !!id,
  })
}

export const useExperienceIntelligence = (id) => {
  return useQuery({
    queryKey: ['analysis', id, 'experienceIntelligence'],
    queryFn: () => analysisApi.getExperienceIntelligence(id),
    enabled: !!id,
  })
}

export const useProjectIntelligence = (id) => {
  return useQuery({
    queryKey: ['analysis', id, 'projectIntelligence'],
    queryFn: () => analysisApi.getProjectIntelligence(id),
    enabled: !!id,
  })
}

export const useInterviewPrep = (id) => {
  return useQuery({
    queryKey: ['analysis', id, 'interviewPrep'],
    queryFn: () => analysisApi.getInterviewPrep(id),
    enabled: !!id,
  })
}

export const useLearningRoadmap = (id) => {
  return useQuery({
    queryKey: ['analysis', id, 'learningRoadmap'],
    queryFn: () => analysisApi.getLearningRoadmap(id),
    enabled: !!id,
  })
}

// Comparison hooks
export const useCreateComparison = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: comparisonApi.createComparison,
    onSuccess: () => {
      toast.success('Comparison created successfully!')
      queryClient.invalidateQueries({ queryKey: ['comparisons'] })
    },
    onError: (error) => {
      const { message } = handleApiError(error)
      toast.error(message)
    },
  })
}

export const useComparisons = (params) => {
  return useQuery({
    queryKey: ['comparisons', params],
    queryFn: () => comparisonApi.getComparisons(params),
  })
}

export const useComparison = (id) => {
  return useQuery({
    queryKey: ['comparison', id],
    queryFn: () => comparisonApi.getComparison(id),
    enabled: !!id,
  })
}

export const useDeleteComparison = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: comparisonApi.deleteComparison,
    onSuccess: () => {
      toast.success('Comparison deleted successfully!')
      queryClient.invalidateQueries({ queryKey: ['comparisons'] })
    },
    onError: (error) => {
      const { message } = handleApiError(error)
      toast.error(message)
    },
  })
}

// Billing hooks
export const useBillingInfo = () => {
  return useQuery({
    queryKey: ['billing'],
    queryFn: billingApi.getBillingInfo,
  })
}

export const useInvoices = (params) => {
  return useQuery({
    queryKey: ['invoices', params],
    queryFn: () => billingApi.getInvoices(params),
  })
}

export const useCreateCheckoutSession = () => {
  return useMutation({
    mutationFn: billingApi.createCheckoutSession,
    onSuccess: (data) => {
      window.location.href = data.data.data.url
    },
    onError: (error) => {
      const { message } = handleApiError(error)
      toast.error(message)
    },
  })
}

export const useCancelSubscription = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: billingApi.cancelSubscription,
    onSuccess: () => {
      toast.success('Subscription cancelled successfully!')
      queryClient.invalidateQueries({ queryKey: ['billing'] })
    },
    onError: (error) => {
      const { message } = handleApiError(error)
      toast.error(message)
    },
  })
}

// Settings hooks
export const useSettings = () => {
  return useQuery({
    queryKey: ['settings'],
    queryFn: settingsApi.getSettings,
  })
}

export const useUpdateSettings = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: settingsApi.updateSettings,
    onSuccess: () => {
      toast.success('Settings updated successfully!')
      queryClient.invalidateQueries({ queryKey: ['settings'] })
    },
    onError: (error) => {
      const { message } = handleApiError(error)
      toast.error(message)
    },
  })
}

export const useUpdateNotificationSettings = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: settingsApi.updateNotificationSettings,
    onSuccess: () => {
      toast.success('Notification settings updated!')
      queryClient.invalidateQueries({ queryKey: ['settings'] })
    },
    onError: (error) => {
      const { message } = handleApiError(error)
      toast.error(message)
    },
  })
}

export const useUpdatePassword = () => {
  return useMutation({
    mutationFn: settingsApi.updatePassword,
    onSuccess: () => {
      toast.success('Password updated successfully!')
    },
    onError: (error) => {
      const { message } = handleApiError(error)
      toast.error(message)
    },
  })
}