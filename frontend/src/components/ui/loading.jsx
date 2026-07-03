import { useState, useEffect, useRef, useCallback } from 'react'
import { Check, CheckCircle, Loader2 } from 'lucide-react'
import { useMotionPreference } from '../../hooks/useAnimation'

const PulseDot = ({ className = '' }) => {
  const prefersReduced = useMotionPreference()
  if (prefersReduced) {
    return <div className={`size-2 rounded-full bg-accent ${className}`} />
  }
  return (
    <div className={`size-2 rounded-full bg-accent ${className}`}>
      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.8); }
        }
        .pulse-dot { animation: pulse-dot 1.2s ease-in-out infinite; }
      `}</style>
      <div className="pulse-dot" />
    </div>
  )
}

export function Spinner({ size = 'md', className = '', label = '' }) {
  const prefersReduced = useMotionPreference()
  const sizeClasses = {
    sm: 'size-4',
    md: 'size-8',
    lg: 'size-12',
  }

  if (prefersReduced) {
    return (
      <div className={`${sizeClasses[size]} ${className}`} aria-label={label || 'Loading'}>
        <div className="flex items-center justify-center">
          <div className="size-2 rounded-full bg-accent" />
        </div>
      </div>
    )
  }

  return (
    <div className={`${sizeClasses[size]} ${className}`} aria-label={label || 'Loading'}>
      <svg
        className="animate-spin text-ink/40"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        role="status"
        aria-label={label || 'Loading'}
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  )
}

export function Skeleton({ className = '', shimmer = false }) {
  const prefersReduced = useMotionPreference()
  
  if (prefersReduced) {
    return <div className={`bg-ink/15 ${className}`} />
  }
  
  return (
    <div className={`relative overflow-hidden bg-ink/10 ${className}`}>
      {shimmer && (
        <>
          <style>{`
            @keyframes shimmer {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(100%); }
            }
            .skeleton-shimmer { animation: shimmer 1.5s ease-in-out infinite; }
          `}</style>
          <div className="skeleton-shimmer absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </>
      )}
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="border border-border bg-paper p-6">
      <Skeleton className="mb-4 h-4 w-1/4" shimmer />
      <Skeleton className="mb-2 h-8 w-1/2" shimmer />
      <Skeleton className="h-4 w-3/4" shimmer />
    </div>
  )
}

export function TableSkeleton({ rows = 5 }) {
  return (
    <div className="w-full">
      <div className="border-b border-border pb-2">
        <Skeleton className="h-4 w-full" shimmer />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="border-b border-border py-4">
          <Skeleton className="h-4 w-full" shimmer />
        </div>
      ))}
    </div>
  )
}

export function ChartSkeleton() {
  return (
    <div className="flex h-72 items-center justify-center" role="status" aria-label="Loading chart">
      <div className="text-center">
        <Spinner size="lg" className="mx-auto mb-3" />
        <p className="font-mono text-xs text-ink/50">Preparing visualization...</p>
      </div>
    </div>
  )
}

export function EmptyState({ 
  title = 'No data found', 
  message = 'There is no data to display at the moment.',
  action,
  actionLabel,
  icon
}) {
  const prefersReduced = useMotionPreference()
  const Icon = icon || (() => (
    <svg className="size-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
    </svg>
  ))
  
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-paper p-12 text-center" role="status" aria-live="polite">
      <div className="mb-4 text-ink/30" aria-hidden="true">
        {icon ? <Icon /> : <svg className="size-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>}
      </div>
      <h3 className="mb-2 font-serif text-xl">{title}</h3>
      <p className="mb-6 max-w-md text-sm text-ink/60">{message}</p>
      {action && actionLabel && (
        <button 
          onClick={action}
          className="inline-flex items-center gap-2 bg-ink px-5 py-2.5 text-sm font-medium text-paper hover:bg-ink/90 transition-all duration-200 hover:scale-105 active:scale-95 focus-visible-ring touch-target"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}

export function ProcessingPipeline({ stages = [] }) {
  const prefersReduced = useMotionPreference()
  const [currentStage, setCurrentStage] = useState(0)
  
  useEffect(() => {
    if (stages.length === 0) return
    if (prefersReduced) {
      setCurrentStage(stages.length - 1)
      return
    }
    
    const interval = setInterval(() => {
      setCurrentStage(prev => {
        if (prev >= stages.length - 1) {
          clearInterval(interval)
          return prev
        }
        return prev + 1
      })
    }, 800)
    
    return () => clearInterval(interval)
  }, [stages, prefersReduced])
  
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="mb-6 flex items-center gap-2">
        <Loader2 className="size-5 text-accent animate-spin" />
        <span className="font-mono text-sm uppercase tracking-widest">Processing</span>
      </div>
      <div className="flex items-center gap-3">
        {stages.map((stage, i) => (
          <div key={i} className="flex items-center">
            <div className={`flex size-8 items-center justify-center rounded-full border-2 transition-all duration-300 ${
              i <= currentStage ? 'border-accent bg-accent text-paper' : 'border-border bg-paper text-ink/40'
            }`}>
              {i < currentStage ? (
                <Check className="size-4" />
              ) : (
                <span className="text-xs font-medium">{i + 1}</span>
              )}
            </div>
            <span className={`ml-2 text-xs ${i <= currentStage ? 'text-ink' : 'text-ink/40'}`}>
              {stage}
            </span>
            {i < stages.length - 1 && (
              <div className={`mx-4 h-px w-8 transition-all duration-300 ${
                i < currentStage ? 'bg-accent' : 'bg-border'
              }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export function SuccessCheck({ size = 'lg', className = '' }) {
  const prefersReduced = useMotionPreference()
  const [showConfetti, setShowConfetti] = useState(false)
  
  if (prefersReduced) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <CheckCircle className="size-12 text-emerald-500" />
      </div>
    )
  }
  
  useEffect(() => {
    setShowConfetti(true)
  }, [])
  
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <div className="flex items-center justify-center rounded-full bg-emerald-50 p-6">
        <CheckCircle className="size-12 text-emerald-500" />
      </div>
      {showConfetti && (
        <div className="absolute inset-0">
          <style>{`
            @keyframes confetti {
              0% { transform: translateY(0) rotate(0); opacity: 1; }
              100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
            }
            .confetti-particle {
              position: absolute;
              width: 6px;
              height: 6px;
              background: oklch(0.55 0.21 262);
              animation: confetti 1s ease-out forwards;
            }
          `}</style>
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="confetti-particle"
              style={{
                left: `${50 + Math.random() * 40}%`,
                top: '50%',
                animationDelay: `${i * 0.05}s`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
