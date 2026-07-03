import { Link } from 'react-router'
import { Sparkles, ArrowLeft } from 'lucide-react'

export default function PricingComingSoon() {
  return (
    <div>
      <header className="border-b border-border px-6 py-24">
        <div className="mx-auto max-w-3xl text-center">
          <span className="font-mono text-[11px] uppercase tracking-widest text-ink/40">Coming Soon</span>
          <h1 className="mt-4 font-serif text-5xl italic leading-tight md:text-7xl">Pricing is currently under development.</h1>
          <p className="mt-6 text-lg text-ink/70">
            We're building flexible plans to fit every stage of your career. All users remain on the Free plan with full access to core features.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 bg-ink px-6 py-3 text-sm font-medium text-paper hover:bg-ink/90"
            >
              <ArrowLeft className="size-4" />
              Back to Dashboard
            </Link>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="inline-flex items-center gap-2 border border-border bg-paper px-6 py-3 text-sm hover:bg-paper-2"
            >
              <Sparkles className="size-4" />
              Join Waitlist
            </button>
          </div>
        </div>
      </header>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <div className="border border-border bg-paper p-8">
            <h2 className="font-serif text-2xl italic">Current plan</h2>
            <div className="mt-4 font-serif text-5xl text-accent">FREE</div>
            <p className="mt-2 text-sm text-ink/60">All features included. No credit card required.</p>
            <div className="mt-6">
              <Link to="/dashboard" className="text-sm text-accent hover:underline">
                Go to Dashboard →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
