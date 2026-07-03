import { Link, useLocation } from 'react-router'
import { useState, useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getProfile } from '../../api/auth'
import {
  LayoutDashboard,
  Upload,
  History,
  GitCompare,
  Target,
  Settings,
  CreditCard,
  LifeBuoy,
  Search,
  Bell,
  ChevronDown,
  User,
  LogOut,
  Shield,
  HelpCircle,
  Palette,
  Mail,
  CheckCircle2,
} from 'lucide-react'

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/upload", label: "New Diagnostic", icon: Upload },
  { to: "/history", label: "History", icon: History },
  { to: "/compare", label: "Compare", icon: GitCompare },
  { to: "/job-match", label: "Job Match", icon: Target },
]

const settingsNav = [
  { to: "/settings", label: "Settings", icon: Settings },
  { to: "/billing", label: "Billing", icon: CreditCard },
  { to: "/help", label: "Help Center", icon: LifeBuoy },
]

export function AppShell({ children }) {
  const pathname = useLocation().pathname
  const { data: profileData } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
  })
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)
  const user = profileData?.data?.data
  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U'
  const subscription = profileData?.data?.data?.subscription || { tier: 'FREE' }
  const isEmailVerified = user?.isEmailVerified

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    window.location.href = '/sign-in'
  }

  return (
    <div className="grid min-h-screen bg-paper text-ink md:grid-cols-[240px_1fr]">
      <aside className="hidden border-r border-border bg-paper-2 md:flex md:flex-col">
        <div className="flex h-16 items-center border-b border-border px-6">
          <Link to="/" className="font-mono text-base font-bold uppercase tracking-tighter">
            ResuMetrics
          </Link>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 text-sm">
          <div className="mb-2 px-2 font-mono text-[10px] uppercase tracking-widest text-ink/40">Workspace</div>
          {nav.map((n) => {
            const active = n.exact ? pathname === n.to : pathname.startsWith(n.to)
            return (
            <Link
                key={n.to}
                to={n.to}
                className={`mb-0.5 flex items-center gap-3 rounded-sm px-2 py-2 transition-colors ${
                  active ? "bg-ink text-paper" : "text-ink/70 hover:bg-ink/5 hover:text-ink"
                }`}
              >
                <n.icon className="size-4" />
                {n.label}
              </Link>
            );
          })}
          <div className="mb-2 mt-6 px-2 font-mono text-[10px] uppercase tracking-widest text-ink/40">Account</div>
          {settingsNav.map((n) => {
            const active = pathname.startsWith(n.to);
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`mb-0.5 flex items-center gap-3 rounded-sm px-2 py-2 transition-colors ${
                  active ? "bg-ink text-paper" : "text-ink/70 hover:bg-ink/5 hover:text-ink"
                }`}
              >
                <n.icon className="size-4" />
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-border p-4">
          <div className="rounded-sm border border-border bg-paper p-3">
            <div className="font-mono text-[10px] uppercase tracking-widest text-ink/40">Plan</div>
            <div className="mt-1 font-serif text-xl italic">{subscription?.tier || 'FREE'}</div>
            <Link to="/billing" className="mt-2 inline-block text-xs text-accent hover:underline">
              Manage subscription →
            </Link>
          </div>
        </div>
      </aside>

      <div className="flex min-h-screen flex-col">
        <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-b border-border bg-paper px-6 py-3">
          <div className="flex min-w-0 items-center gap-2 rounded-sm border border-border bg-paper-2 px-3 py-2 text-sm text-ink/60">
            <Search className="size-4 shrink-0" />
            <input
              placeholder="Search diagnostics, comparisons, suggestions…"
              className="w-full min-w-0 bg-transparent outline-none placeholder:text-ink/40"
            />
            <span className="hidden font-mono text-[10px] text-ink/40 md:inline">⌘K</span>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <button aria-label="Notifications" className="rounded-sm border border-border bg-paper p-2 hover:bg-ink/5">
              <Bell className="size-4" />
            </button>
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 rounded-sm border border-border bg-paper px-3 py-1.5 text-sm hover:bg-paper-2"
              >
                <div className="grid size-7 place-items-center rounded-sm bg-ink font-mono text-[10px] text-paper">{initials}</div>
                <div className="hidden md:block text-left">
                  <div className="flex items-center gap-1.5 text-xs font-medium leading-tight">
                    {user?.name || 'Loading...'}
                    {isEmailVerified && <CheckCircle2 className="size-3 text-accent" />}
                  </div>
                  <div className="font-mono text-[10px] text-ink/40">{subscription?.tier || 'FREE'}</div>
                </div>
                <ChevronDown className={`size-4 text-ink/40 transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-full z-50 mt-2 w-72 rounded border border-border bg-paper shadow-lg">
                  {/* User Info Header */}
                  <div className="border-b border-border p-4">
                    <div className="flex items-start gap-3">
                      <div className="grid size-12 place-items-center rounded-sm bg-ink font-mono text-sm text-paper">
                        {initials}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-medium truncate">{user?.name || 'User'}</span>
                          {isEmailVerified && <CheckCircle2 className="size-3.5 shrink-0 text-accent" />}
                        </div>
                        <div className="mt-0.5 flex items-center gap-1.5 text-xs text-ink/60">
                          <Mail className="size-3 shrink-0" />
                          <span className="truncate">{user?.email || 'user@example.com'}</span>
                        </div>
                        <div className="mt-1.5">
                          <span className="inline-flex items-center rounded border border-border bg-paper-2 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-ink/60">
                            {subscription?.tier || 'FREE'} Plan
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <LinkItem to="/settings" icon={User} label="My Profile" onClick={() => setMenuOpen(false)} />
                    <LinkItem to="/settings" icon={Settings} label="Account Settings" onClick={() => setMenuOpen(false)} />
                    <LinkItem to="/settings" icon={Bell} label="Notifications" onClick={() => setMenuOpen(false)} />
                    <div className="mx-4 my-1 border-t border-border" />
                    <button
                      onClick={() => { setMenuOpen(false) }}
                      className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-ink/60 hover:bg-paper-2"
                    >
                      <CreditCard className="size-4" />
                      Billing
                      <span className="ml-auto rounded-full bg-amber-50 px-1.5 py-0.5 font-mono text-[10px] text-amber-700">Coming Soon</span>
                    </button>
                    <LinkItem to="/help" icon={HelpCircle} label="Help Center" onClick={() => setMenuOpen(false)} />
                    <button
                      onClick={() => setMenuOpen(false)}
                      className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-ink/60 hover:bg-paper-2"
                    >
                      <Palette className="size-4" />
                      Theme
                      <span className="ml-auto font-mono text-[10px] text-ink/40">Soon</span>
                    </button>
                  </div>

                  <div className="border-t border-border py-2">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="size-4" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}

function LinkItem({ to, icon: Icon, label, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-2 text-sm text-ink/70 hover:bg-paper-2 hover:text-ink"
    >
      <Icon className="size-4" />
      {label}
    </Link>
  )
}
