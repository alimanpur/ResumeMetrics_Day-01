import { Button } from './button'
import { AlertCircle, RefreshCw } from 'lucide-react'

export function ErrorState({ 
  title = 'Something went wrong', 
  message = 'An error occurred while loading this content.',
  onRetry,
  retryLabel = 'Try again'
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-paper p-12 text-center" role="alert" aria-live="polite">
      <AlertCircle className="mb-4 size-12 text-red-500" aria-hidden="true" />
      <h3 className="mb-2 font-serif text-xl">{title}</h3>
      <p className="mb-6 max-w-md text-sm text-ink/60">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" className="gap-2 focus-visible-ring">
          <RefreshCw className="size-4" aria-hidden="true" />
          {retryLabel}
        </Button>
      )}
    </div>
  )
}

export function EmptyState({ 
  title = 'No data found', 
  message = 'There is no data to display at the moment.',
  action,
  actionLabel
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-paper p-12 text-center">
      <div className="mb-4 text-ink/30">
        <svg className="size-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      </div>
      <h3 className="mb-2 font-serif text-xl">{title}</h3>
      <p className="mb-6 max-w-md text-sm text-ink/60">{message}</p>
      {action && actionLabel && (
        <Button onClick={action} className="gap-2">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

export function OfflineMessage() {
  return (
    <div className="fixed bottom-4 right-4 rounded-lg border border-yellow-500 bg-yellow-50 p-4 shadow-lg">
      <div className="flex items-center gap-3">
        <AlertCircle className="size-5 text-yellow-600" />
        <div>
          <p className="font-medium text-yellow-900">You are offline</p>
          <p className="text-sm text-yellow-700">Please check your internet connection</p>
        </div>
      </div>
    </div>
  )
}