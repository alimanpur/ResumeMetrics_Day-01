import { useState, useEffect } from 'react'
import { AuthShell } from '../components/auth/AuthShell.jsx'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { Mail, CheckCircle, AlertCircle } from 'lucide-react'
import { useVerifyEmail } from '../hooks/useApi'

export default function VerifyEmail() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const verifyEmail = useVerifyEmail()
  const [status, setStatus] = useState('idle') // idle, verifying, success, error
  const token = searchParams.get('token')

  useEffect(() => {
    if (token) {
      handleVerifyEmail(token)
    }
  }, [token])

  const handleVerifyEmail = async (verificationToken) => {
    setStatus('verifying')
    try {
      await verifyEmail.mutateAsync(verificationToken)
      setStatus('success')
      setTimeout(() => {
        navigate('/sign-in')
      }, 3000)
    } catch (error) {
      setStatus('error')
    }
  }

  if (!token) {
    return (
      <AuthShell
        title="Check your inbox."
        subtitle="We sent a verification link to your email address."
        footer={<Link to="/sign-in" className="text-accent hover:underline">Already verified? Sign in</Link>}
      >
        <div className="flex items-start gap-4 border-l-2 border-accent bg-accent/5 p-4 text-sm">
          <Mail className="mt-0.5 size-4 shrink-0 text-accent" />
          <div>
            <div className="font-medium">Verification email sent.</div>
            <div className="text-ink/60">Please check your inbox and click the verification link.</div>
          </div>
        </div>
      </AuthShell>
    )
  }

  if (status === 'verifying') {
    return (
      <AuthShell
        title="Verifying..."
        subtitle="Please wait while we verify your email address."
      >
        <div className="flex flex-col items-center justify-center py-12">
          <div className="mb-4 size-12 animate-spin rounded-full border-4 border-ink/20 border-t-ink" />
          <p className="text-sm text-ink/60">Verifying your email...</p>
        </div>
      </AuthShell>
    )
  }

  if (status === 'success') {
    return (
      <AuthShell
        title="Email verified!"
        subtitle="Your email has been successfully verified."
        footer={<Link to="/sign-in" className="text-accent hover:underline">Continue to sign in</Link>}
      >
        <div className="flex items-start gap-4 border-l-2 border-emerald-500 bg-emerald-50 p-4 text-sm">
          <CheckCircle className="mt-0.5 size-4 shrink-0 text-emerald-600" />
          <div>
            <div className="font-medium text-emerald-900">Verification successful!</div>
            <div className="text-emerald-700">Redirecting you to sign in...</div>
          </div>
        </div>
      </AuthShell>
    )
  }

  if (status === 'error') {
    return (
      <AuthShell
        title="Verification failed"
        subtitle="We couldn't verify your email address."
        footer={<Link to="/sign-in" className="text-accent hover:underline">Back to sign in</Link>}
      >
        <div className="flex items-start gap-4 border-l-2 border-red-500 bg-red-50 p-4 text-sm">
          <AlertCircle className="mt-0.5 size-4 shrink-0 text-red-600" />
          <div>
            <div className="font-medium text-red-900">Verification failed</div>
            <div className="text-red-700">The verification link may be invalid or expired. Please try again.</div>
          </div>
        </div>
      </AuthShell>
    )
  }

  return null
}
