import { useState } from 'react'
import { AuthShell, AuthInput, AuthButton } from '../components/auth/AuthShell.jsx'
import { Link } from 'react-router'
import { useForgotPassword } from '../hooks/useApi'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const forgotPassword = useForgotPassword()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await forgotPassword.mutateAsync({ email })
    } catch (error) {
      // Error is handled by the mutation's error state
    }
  }

  return (
    <AuthShell
      title="Reset password."
      subtitle="We'll send a recovery link to your inbox."
      footer={<Link to="/sign-in" className="text-accent hover:underline">Return to sign in</Link>}
    >
      {forgotPassword.isSuccess ? (
        <div className="border-l-2 border-accent bg-accent/5 p-4 text-sm">
          A recovery link is on its way. The link expires in 30 minutes.
        </div>
      ) : (
        <form className="space-y-5" onSubmit={handleSubmit}>
          <AuthInput
            label="Email"
            type="email"
            name="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <AuthButton type="submit" disabled={forgotPassword.isPending}>
            {forgotPassword.isPending ? 'Sending...' : 'Send recovery link'}
          </AuthButton>
        </form>
      )}
    </AuthShell>
  );
}
