import { useState, useEffect } from 'react'
import { AuthShell, AuthInput, AuthButton } from '../components/auth/AuthShell.jsx'
import { useNavigate, useSearchParams } from 'react-router'
import { useResetPassword } from '../hooks/useApi'

export default function ResetPassword() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const resetPassword = useResetPassword()
  const [formData, setFormData] = useState({ password: '', confirmPassword: '' })
  const token = searchParams.get('token')
  const email = searchParams.get('email')

  useEffect(() => {
    if (!token || !email) {
      navigate('/forgot-password')
    }
  }, [token, email, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    try {
      await resetPassword.mutateAsync({
        token,
        email,
        password: formData.password,
      })
      navigate('/sign-in')
    } catch (error) {
      // Error is handled by the mutation's error state
    }
  }

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  if (!token || !email) {
    return null
  }

  return (
    <AuthShell title="New password." subtitle="Choose something secure.">
      <form className="space-y-5" onSubmit={handleSubmit}>
        <AuthInput
          label="New password"
          type="password"
          name="password"
          required
          value={formData.password}
          onChange={handleChange}
        />
        <AuthInput
          label="Confirm password"
          type="password"
          name="confirmPassword"
          required
          value={formData.confirmPassword}
          onChange={handleChange}
        />
        <AuthButton type="submit" disabled={resetPassword.isPending}>
          {resetPassword.isPending ? 'Setting password...' : 'Set password'}
        </AuthButton>
      </form>
    </AuthShell>
  );
}
