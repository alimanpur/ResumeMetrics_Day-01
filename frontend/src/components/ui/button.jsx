import { useMotionPreference } from '../../hooks/useAnimation'

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  type = 'button',
  onClick,
  ...props
}) {
  const prefersReduced = useMotionPreference()
  
  const baseStyles =
    'inline-flex items-center justify-center rounded-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'

  const variants = {
    primary: 'bg-ink text-paper hover:bg-ink/90',
    outline: 'border border-border bg-paper hover:bg-ink/5',
    ghost: 'hover:bg-ink/5',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  }

  const motionClasses = prefersReduced 
    ? '' 
    : 'active:scale-95 transition-transform duration-150'

  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${motionClasses} ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}