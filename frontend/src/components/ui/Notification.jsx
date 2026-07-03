import { useEffect, useCallback, useState, createContext, useContext } from 'react'
import { X, CheckCircle, AlertCircle, AlertTriangle, Info, Loader2 } from 'lucide-react'
import { useMotionPreference } from '../../hooks/useAnimation'

const NotificationContext = createContext(null)

export function useNotification() {
  const ctx = useContext(NotificationContext)
  if (!ctx) throw new Error('useNotification must be used within NotificationProvider')
  return ctx
}

export function NotificationProvider({ children }) {
  const prefersReduced = useMotionPreference()
  const [notifications, setNotifications] = useState([])

  const addNotification = useCallback(({ type = 'info', title, message, duration = 5000 }) => {
    const id = crypto.randomUUID?.() || Math.random().toString(36).slice(2)
    setNotifications(prev => [...prev, { id, type, title, message, duration, paused: false }])
    return id
  }, [])

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  const pauseNotification = useCallback((id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, paused: true } : n))
  }, [])

  const resumeNotification = useCallback((id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, paused: false } : n))
  }, [])

  const success = useCallback((message, opts = {}) => 
    addNotification({ type: 'success', title: 'Success', message, ...opts }), [addNotification])
  const error = useCallback((message, opts = {}) => 
    addNotification({ type: 'error', title: 'Error', message, ...opts }), [addNotification])
  const warning = useCallback((message, opts = {}) => 
    addNotification({ type: 'warning', title: 'Warning', message, ...opts }), [addNotification])
  const info = useCallback((message, opts = {}) => 
    addNotification({ type: 'info', title: 'Info', message, ...opts }), [addNotification])
  const loading = useCallback((message, opts = {}) => 
    addNotification({ type: 'loading', title: 'Loading', message, duration: Infinity, ...opts }), [addNotification])

  const confirm = useCallback(({ title, message, confirmLabel = 'Confirm', cancelLabel = 'Cancel', onConfirm, onCancel }) => {
    const id = crypto.randomUUID?.() || Math.random().toString(36).slice(2)
    setNotifications(prev => [...prev, {
      id,
      type: 'confirm',
      title,
      message,
      duration: Infinity,
      paused: false,
      confirmLabel,
      cancelLabel,
      onConfirm: () => { removeNotification(id); onConfirm?.() },
      onCancel: () => { removeNotification(id); onCancel?.() },
    }])
  }, [removeNotification])

  return (
    <NotificationContext.Provider value={{ addNotification, removeNotification, success, error, warning, info, loading, confirm }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3" style={{ maxWidth: '400px' }} role="region" aria-label="Notifications">
        {notifications.map(n => (
          <NotificationItem
            key={n.id}
            notification={n}
            onDismiss={() => removeNotification(n.id)}
            onPause={() => pauseNotification(n.id)}
            onResume={() => resumeNotification(n.id)}
            prefersReduced={prefersReduced}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  )
}

const typeStyles = {
  success: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-800',
    icon: <CheckCircle className="size-5 text-emerald-500" />,
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-800',
    icon: <AlertCircle className="size-5 text-red-500" />,
  },
  warning: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-800',
    icon: <AlertTriangle className="size-5 text-amber-500" />,
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-800',
    icon: <Info className="size-5 text-blue-500" />,
  },
  loading: {
    bg: 'bg-paper',
    border: 'border-border',
    text: 'text-ink',
    icon: <Loader2 className="size-5 text-accent animate-spin" />,
  },
  confirm: {
    bg: 'bg-paper',
    border: 'border-border',
    text: 'text-ink',
    icon: <AlertCircle className="size-5 text-accent" />,
  },
}

function NotificationItem({ notification, onDismiss, onPause, onResume, prefersReduced }) {
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    if (notification.duration === Infinity || notification.paused || notification.type === 'confirm') return
    const timer = setTimeout(() => {
      setIsExiting(true)
      setTimeout(onDismiss, 300)
    }, notification.duration)
    return () => clearTimeout(timer)
  }, [notification.duration, notification.paused, notification.type, onDismiss])

  const style = typeStyles[notification.type] || typeStyles.info

  const handleDismiss = () => {
    setIsExiting(true)
    setTimeout(onDismiss, 300)
  }

  if (notification.type === 'confirm') {
    return (
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={`confirm-title-${notification.id}`}
        className={`rounded-lg border-2 shadow-lg transition-all duration-300 ${style.bg} ${style.border} ${isExiting ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}`}
      >
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 shrink-0">{style.icon}</div>
            <div className="min-w-0 flex-1">
              <p id={`confirm-title-${notification.id}`} className={`font-mono text-xs font-semibold uppercase tracking-wider ${style.text}`}>{notification.title}</p>
              <p className={`mt-1 text-sm ${style.text}`}>{notification.message}</p>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => { notification.onCancel?.() }}
                  className="rounded border border-border bg-paper px-4 py-1.5 text-xs font-medium text-ink hover:bg-paper-2 focus-visible-ring"
                >
                  {notification.cancelLabel}
                </button>
                <button
                  onClick={() => { notification.onConfirm?.() }}
                  className="rounded bg-accent px-4 py-1.5 text-xs font-medium text-white hover:bg-accent/90 focus-visible-ring"
                >
                  {notification.confirmLabel}
                </button>
              </div>
            </div>
            <button onClick={handleDismiss} className="shrink-0 text-ink/40 hover:text-ink focus-visible-ring" aria-label="Close">
              <X className="size-4" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      role="status"
      aria-live={notification.type === 'error' ? 'assertive' : 'polite'}
      onMouseEnter={onPause}
      onMouseLeave={onResume}
      className={`rounded-lg border-2 shadow-lg transition-all duration-300 ${style.bg} ${style.border} ${isExiting ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}`}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 shrink-0">{style.icon}</div>
          <div className="min-w-0 flex-1">
            <p className={`font-mono text-xs font-semibold uppercase tracking-wider ${style.text}`}>{notification.title}</p>
            <p className={`mt-1 text-sm ${style.text}`}>{notification.message}</p>
          </div>
          <button onClick={handleDismiss} className="shrink-0 text-ink/40 hover:text-ink focus-visible-ring" aria-label="Close">
            <X className="size-4" />
          </button>
        </div>
      </div>
    </div>
  )
}