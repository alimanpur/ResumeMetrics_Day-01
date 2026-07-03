import { useState } from 'react'
import { AuthShell, AuthInput, AuthButton } from '../components/auth/AuthShell.jsx'
import { Link, useNavigate } from 'react-router'
import { useRegister } from '../hooks/useApi'
import { useNotification } from '../components/ui/Notification'
import { Chrome } from 'lucide-react'

export default function SignUp() {
  const navigate = useNavigate()
  const register = useRegister()
  const notification = useNotification()
  const [formData, setFormData] = useState({ name: '', email: '', password: '' })

  const handleGoogleAuth = () => {
    notification.info('Google authentication is not configured yet. Please use email and password to create an account.')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log('SignUp payload:', JSON.stringify(formData, null, 2))
    try {
      await register.mutateAsync(formData)
      navigate('/dashboard')
    } catch (error) {
      // Error is handled by the mutation's error state
      if (error.response?.status === 409) {
        navigate('/sign-in')
      }
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
      title="Create account."
      subtitle="Start with a free diagnostic. No card required."
      footer={
        <>
          Already registered? <Link to="/sign-in" className="text-accent underline-offset-2 hover:underline">Sign in</Link>
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
            <span className="bg-paper px-2 text-ink/40">Or create account with email</span>
          </div>
        </div>
        <AuthInput
          label="Full name"
          name="name"
          required
          value={formData.name}
          onChange={handleChange}
        />
        <AuthInput
          label="Work email"
          type="email"
          name="email"
          required
          value={formData.email}
          onChange={handleChange}
        />
        <AuthInput
          label="Password"
          type="password"
          name="password"
          required
          placeholder="At least 12 characters"
          value={formData.password}
          onChange={handleChange}
        />
        <p className="text-xs text-ink/50">
          By creating an account you agree to our <Link to="/terms" className="underline">Terms</Link> and <Link to="/privacy" className="underline">Privacy</Link>.
        </p>
        <AuthButton type="submit" disabled={register.isPending}>
          {register.isPending ? 'Creating account...' : 'Create account'}
        </AuthButton>
      </form>
    </AuthShell>
  );
}
