import { Link } from 'react-router'
import { AlertTriangle, WifiOff } from 'lucide-react'

export default function ErrorPage({ code = 404, title = 'Page not found', message = '', showGoHome = true }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4">
      <div className="max-w-lg text-center">
        <div className="mb-6 text-ink/20">
          {code === 'offline' ? (
            <WifiOff className="mx-auto size-20" />
          ) : (
            <span className="font-serif text-8xl italic">{code}</span>
          )}
        </div>
        <h1 className="font-serif text-3xl italic">{title}</h1>
        <p className="mt-4 text-sm text-ink/60">{message || 'Something went wrong. Please try again or contact support if the problem persists.'}</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {showGoHome && (
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-ink px-5 py-2.5 text-sm font-medium text-paper hover:bg-ink/90"
            >
              Go home
            </Link>
          )}
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 border border-border bg-paper px-5 py-2.5 text-sm font-medium text-ink hover:bg-paper-2"
          >
            Retry
          </button>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 border border-border bg-paper px-5 py-2.5 text-sm font-medium text-ink hover:bg-paper-2"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
