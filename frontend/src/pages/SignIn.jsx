import { useState } from 'react'
import { AuthShell, AuthInput, AuthButton } from '../components/auth/AuthShell.jsx'
import { Link, useNavigate } from 'react-router'
import { useLogin } from '../hooks/useApi'
import { useAuthStore } from '../stores/authStore'
import { useNotification } from '../components/ui/Notification'
import { Chrome } from 'lucide-react'

export default function SignIn() {
  const navigate = useNavigate()
  const login = useLogin()
  const notification = useNotification()
  const setCredentials = useAuthStore((state) => state.setCredentials)
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [rememberMe, setRememberMe] = useState(false)

  const handleGoogleAuth = () => {
    notification.info('Google authentication is not configured yet. Please use email and password to sign in.')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log('SignIn payload:', JSON.stringify(formData, null, 2))
    try {
      const response = await login.mutateAsync(formData)
      const { user, accessToken, refreshToken } = response.data.data
      setCredentials(user, accessToken, refreshToken)
      navigate('/dashboard')
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

  return (
    <AuthShell
      title="Sign in."
      subtitle="Resume your diagnostic session."
      footer={
        <>
          New here? <Link to="/sign-up" className="text-accent underline-offset-2 hover:underline">Create an account</Link>
        </>
      }
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <button
          type="button"
          onClick={handleGoogleAuth}
          className="flex w-full items-center justify-center gap-2 border border-border bg-paper px-4 py-2.5 text-sm font-medium hover:bg-paper-2"
        >
          <Chrome className="size-4" />
          Continue with Google
        </button>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-paper px-2 text-ink/40">Or continue with email</span>
          </div>
        </div>
        <AuthInput
          label="Email"
          type="email"
          name="email"
          required
          placeholder="you@work.com"
          value={formData.email}
          onChange={handleChange}
        />
        <AuthInput
          label="Password"
          type="password"
          name="password"
          required
          value={formData.password}
          onChange={handleChange}
        />
        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 text-ink/60">
            <input
              type="checkbox"
              className="accent-accent"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            Remember
          </label>
          <Link to="/forgot-password" className="text-ink/70 hover:text-accent">
            Forgot password?
          </Link>
        </div>
        <AuthButton type="submit" disabled={login.isPending}>
          {login.isPending ? 'Signing in...' : 'Sign in'}
        </AuthButton>
      </form>
    </AuthShell>
  );
}
