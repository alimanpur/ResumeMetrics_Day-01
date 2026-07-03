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
  Moon,
  Sun,
  Keyboard,
  Menu,
  X,
  Github,
  BookOpen,
  Globe,
  Activity,
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
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light')
  const menuRef = useRef(null)
  const searchInputRef = useRef(null)
  const { data: profileData } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
  })
  const user = profileData?.data?.data

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('theme', theme)
  }, [theme])
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
    function handleKeyDown(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current?.focus()
    }
  }, [searchOpen])

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light')

  const searchItems = [
    { title: 'Dashboard', to: '/dashboard', keywords: ['dashboard', 'home'] },
    { title: 'Upload Resume', to: '/upload', keywords: ['upload', 'resume', 'diagnostic'] },
    { title: 'History', to: '/history', keywords: ['history', 'archive'] },
    { title: 'Compare', to: '/compare', keywords: ['compare', 'versions', 'diff'] },
    { title: 'Job Match', to: '/job-match', keywords: ['job', 'match', 'career'] },
    { title: 'Settings', to: '/settings', keywords: ['settings', 'profile', 'account'] },
    { title: 'Billing', to: '/billing', keywords: ['billing', 'plan', 'subscription'] },
    { title: 'Help Center', to: '/help', keywords: ['help', 'support', 'faq'] },
  ]

  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    window.location.href = '/sign-in'
  }

  return (
    <div className="grid min-h-screen bg-paper text-ink md:grid-cols-[auto_1fr]">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-ink/50 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 w-60 border-r border-border bg-paper-2 transition-transform md:static md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-16 items-center justify-between border-b border-border px-6">
          <Link to="/" className="font-mono text-base font-bold uppercase tracking-tighter">
            ResuMetrics
          </Link>
          <button className="md:hidden text-ink/60 hover:text-ink" onClick={() => setSidebarOpen(false)}>
            <X className="size-5" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 text-sm">
          <div className="mb-2 px-2 font-mono text-[10px] uppercase tracking-widest text-ink/40">Workspace</div>
          {nav.map((n) => {
            const active = n.exact ? pathname === n.to : pathname.startsWith(n.to)
            return (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setSidebarOpen(false)}
                className={`mb-0.5 flex items-center gap-3 rounded-sm px-2 py-2 transition-colors ${
                  active ? "bg-ink text-paper" : "text-ink/70 hover:bg-ink/5 hover:text-ink"
                }`}
              >
                <n.icon className="size-4" />
                {n.label}
              </Link>
            )
          })}
          <div className="mb-2 mt-6 px-2 font-mono text-[10px] uppercase tracking-widest text-ink/40">Account</div>
          {settingsNav.map((n) => {
            const active = pathname.startsWith(n.to);
            return (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setSidebarOpen(false)}
                className={`mb-0.5 flex items-center gap-3 rounded-sm px-2 py-2 transition-colors ${
                  active ? "bg-ink text-paper" : "text-ink/70 hover:bg-ink/5 hover:text-ink"
                }`}
              >
                <n.icon className="size-4" />
                {n.label}
              </Link>
            )
          })}
        </nav>
        <div className="border-t border-border p-4">
          <div className="rounded-sm border border-border bg-paper p-3">
            <div className="font-mono text-[10px] uppercase tracking-widest text-ink/40">Plan</div>
            <div className="mt-1 font-serif text-xl italic">{subscription?.tier || 'FREE'}</div>
            <button onClick={() => {}} className="mt-2 inline-block text-xs text-accent hover:underline">
              Manage subscription
            </button>
          </div>
        </div>
      </aside>

      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-30 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-b border-border bg-paper/80 px-4 py-3 backdrop-blur-sm md:px-6">
          <div className="flex items-center gap-2">
            <button className="md:hidden rounded-sm border border-border bg-paper p-2" onClick={() => setSidebarOpen(true)}>
              <Menu className="size-4" />
            </button>
            <div className="flex min-w-0 items-center gap-2 rounded-sm border border-border bg-paper-2 px-3 py-2 text-sm text-ink/60">
              <Search className="size-4 shrink-0" />
              <input
                readOnly
                placeholder="Search diagnostics, comparisons, suggestions…"
                className="w-full min-w-0 cursor-pointer bg-transparent outline-none placeholder:text-ink/40"
                onClick={() => setSearchOpen(true)}
              />
              <span className="hidden font-mono text-[10px] text-ink/40 md:inline">⌘K</span>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2 md:gap-3">
            <button aria-label="Search" className="rounded-sm border border-border bg-paper p-2 hover:bg-ink/5" onClick={() => setSearchOpen(true)}>
              <Search className="size-4" />
            </button>
            <button aria-label="Notifications" className="rounded-sm border border-border bg-paper p-2 hover:bg-ink/5">
              <Bell className="size-4" />
            </button>
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 rounded-sm border border-border bg-paper px-2 py-1.5 text-sm hover:bg-paper-2"
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

                   <div className="py-2">
                     <LinkItem to="/settings" icon={User} label="My Profile" onClick={() => setMenuOpen(false)} />
                     <LinkItem to="/settings" icon={Settings} label="Account Settings" onClick={() => setMenuOpen(false)} />
                     <LinkItem to="/settings" icon={Bell} label="Notifications" onClick={() => setMenuOpen(false)} />
                     <div className="mx-4 my-1 border-t border-border" />
                      <LinkItem to="/billing" icon={CreditCard} label="Billing" onClick={() => setMenuOpen(false)} />
                      <LinkItem to="/settings" icon={HelpCircle} label="Help Center" onClick={() => setMenuOpen(false)} />
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

        {/* Command Palette */}
        {searchOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4">
            <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" onClick={() => setSearchOpen(false)} />
            <div className="relative w-full max-w-xl rounded-lg border border-border bg-paper shadow-2xl">
              <div className="flex items-center gap-3 border-b border-border p-4">
                <Search className="size-4 text-ink/40" />
                <input
                  ref={searchInputRef}
                  autoFocus
                  placeholder="Type a command or search..."
                  className="w-full bg-transparent outline-none placeholder:text-ink/40 text-sm"
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') setSearchOpen(false)
                  }}
                />
                <kbd className="rounded border border-border bg-paper-2 px-2 py-0.5 font-mono text-[10px] text-ink/40">ESC</kbd>
              </div>
              <div className="max-h-80 overflow-y-auto p-2">
                <div className="mb-2 px-2 font-mono text-[10px] uppercase tracking-widest text-ink/40">Recent</div>
                {searchItems.length === 0 && (
                  <div className="p-4 text-center text-sm text-ink/60">No results found</div>
                )}
                {searchItems.slice(0, 6).map((item, i) => (
                  <button
                    key={i}
                    onClick={() => { window.location.href = item.to; setSearchOpen(false) }}
                    className="flex w-full items-center gap-3 rounded-sm px-3 py-2 text-left text-sm hover:bg-paper-2"
                  >
                    <Search className="size-3 text-ink/40" />
                    {item.title}
                  </button>
                ))}
              </div>
              <div className="border-t border-border p-3">
                <div className="flex items-center justify-between text-[10px] font-mono text-ink/40">
                  <span>↑↓ to navigate</span>
                  <span>↵ to select</span>
                  <span>esc to close</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <main className="flex-1">
          {children}
        </main>

        <footer className="border-t border-border bg-paper-2 px-6 py-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-4 text-xs text-ink/50">
              <span className="font-mono font-bold uppercase tracking-tighter">ResuMetrics</span>
              <span>·</span>
              <span>v2.4.1</span>
              <span className="inline-flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                All systems operational
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs text-ink/50">
              <span className="hidden md:inline">© 2025 ResuMetrics</span>
              <a href="#" className="hover:text-ink/80">Documentation</a>
              <a href="#" className="hover:text-ink/80">API</a>
              <a href="#" className="hover:text-ink/80">Changelog</a>
              <span className="hidden md:inline">GitHub</span>
            </div>
          </div>
        </footer>
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
