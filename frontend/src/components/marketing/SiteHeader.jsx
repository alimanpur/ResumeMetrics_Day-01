import { Link, NavLink } from 'react-router'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

const nav = [
  { to: "/ats-intelligence", label: "ATS Intelligence" },
  { to: "/case-studies", label: "Case Studies" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-10">
          <Link to="/" className="font-mono text-base font-bold uppercase tracking-tighter">
            ResuMetrics
          </Link>
          <div className="hidden items-center gap-7 md:flex">
            {nav.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors hover:text-ink ${
                    isActive ? "text-ink" : "text-ink/60"
                  }`
                }
              >
                {n.label}
              </NavLink>
            ))}
          </div>
        </div>
        <div className="hidden items-center gap-2 md:flex">
          <Link
            to="/sign-in"
            className="rounded-sm px-4 py-2 text-sm font-medium transition-colors hover:bg-ink/5"
          >
            Sign in
          </Link>
          <Link
            to="/sign-up"
            className="rounded-sm bg-ink px-5 py-2 text-sm font-medium text-paper transition-colors hover:bg-ink/90"
          >
            Analyze Resume
          </Link>
        </div>
        <button
          aria-label="Toggle menu"
          className="md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>
      {open && (
        <div className="border-t border-border bg-paper px-6 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {nav.map((n) => (
              <Link key={n.to} to={n.to} className="py-1 text-sm" onClick={() => setOpen(false)}>
                {n.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t border-border pt-3">
              <Link to="/sign-in" className="py-1 text-sm font-medium">Sign in</Link>
              <Link to="/sign-up" className="rounded-sm bg-ink px-4 py-2 text-center text-sm font-medium text-paper">Analyze Resume</Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
