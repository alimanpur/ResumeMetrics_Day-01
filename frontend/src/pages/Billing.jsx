import { useState } from 'react'
import { Link } from 'react-router'
import { Sparkles, ArrowLeft, Bell } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { getBillingInfo } from '../api/billing'
import { CardSkeleton } from '../components/ui/loading'
import { ErrorState } from '../components/ui/error-state'
import { useNotification } from '../components/ui/Notification'

export default function Billing() {
  const notification = useNotification()
  const [notified, setNotified] = useState(false)
  const { data: billingData, isLoading, error, refetch } = useQuery({
    queryKey: ['billing'],
    queryFn: getBillingInfo,
  })

  const handleNotifyMe = () => {
    setNotified(true)
    notification.success('✨ Thanks for your interest', {
      description: 'Billing is currently under development. You\'ll automatically remain on the Free plan. We\'ll notify you when subscriptions launch.',
      duration: 6000,
    })
  }

  if (isLoading) {
    return (
      <div className="px-8 py-10">
        <div className="mb-8">
          <div className="h-8 w-48 animate-pulse bg-ink/10" />
          <div className="mt-2 h-4 w-96 animate-pulse bg-ink/10" />
        </div>
        <CardSkeleton />
      </div>
    )
  }

  if (error) {
    return (
      <div className="px-8 py-10">
        <ErrorState
          title="Failed to load billing information"
          message="We couldn't load your billing details. Please try again."
          onRetry={() => refetch()}
        />
      </div>
    )
  }

  const billing = billingData?.data?.data || {}
  const subscription = billing?.subscription || {}
  const currentPlan = subscription.tier || 'FREE'

  return (
    <div className="px-8 py-10">
      <div className="mb-8">
        <span className="font-mono text-[11px] uppercase tracking-widest text-ink/40">Account</span>
        <h1 className="mt-2 font-serif text-4xl italic">Billing.</h1>
      </div>

      {/* Coming Soon Banner */}
      <div className="mb-10 border border-border bg-paper">
        <div className="border-b border-border p-6">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center border border-border bg-accent/10">
              <Sparkles className="size-5 text-accent" />
            </div>
            <div>
              <h2 className="font-serif text-2xl italic">Billing is under development</h2>
              <p className="mt-1 text-sm text-ink/60">
                Subscriptions are coming soon. You're currently on the Free plan with full access to all features.
              </p>
            </div>
          </div>
        </div>

        {/* Current Plan */}
        <div className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-ink/40">Current Plan</div>
              <div className="mt-2 font-serif text-3xl italic text-accent">{currentPlan}</div>
              <div className="mt-1 text-sm text-ink/60">
                Free tier with all features. No credit card required.
              </div>
            </div>
            <span className="rounded-full bg-emerald-50 px-4 py-2">
              <span className="font-mono text-xs uppercase tracking-wider text-emerald-700">Active</span>
            </span>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 bg-ink px-5 py-2.5 text-sm font-medium text-paper hover:bg-ink/90"
            >
              <ArrowLeft className="size-4" />
              Back to Dashboard
            </Link>
            <button
              onClick={handleNotifyMe}
              disabled={notified}
              className="inline-flex items-center gap-2 border border-border bg-paper px-5 py-2.5 text-sm hover:bg-paper-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Bell className="size-4" />
              {notified ? 'You\'ll be notified' : 'Notify Me'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
