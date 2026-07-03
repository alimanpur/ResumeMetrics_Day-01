import { Link } from 'react-router'

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-paper">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="font-mono text-sm font-bold uppercase tracking-tighter">ResuMetrics</div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink/60">
              A forensic diagnostic tool for the modern resume. We don't write your resume.
              We tell you what the machine sees when it reads it.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 border border-border px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-ink/50">
              <span className="size-1.5 rounded-full bg-emerald-500" /> Engine v0.8.4 — Operational
            </div>
          </div>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-ink/40">Product</div>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link to="/ats-intelligence" className="hover:text-accent">ATS Intelligence</Link></li>
              <li><Link to="/pricing" className="hover:text-accent">Pricing</Link></li>
              <li><Link to="/case-studies" className="hover:text-accent">Case Studies</Link></li>
              <li><Link to="/faq" className="hover:text-accent">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-ink/40">Company</div>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link to="/contact" className="hover:text-accent">Contact</Link></li>
              <li><Link to="/privacy" className="hover:text-accent">Privacy</Link></li>
              <li><Link to="/terms" className="hover:text-accent">Terms</Link></li>
               <li><Link to="/help" className="hover:text-accent">Help Center</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-border pt-6 md:flex-row md:items-center">
          <div className="font-mono text-[10px] uppercase tracking-widest text-ink/40">
            ResuMetrics © {new Date().getFullYear()} — Formal Analysis Protocol
          </div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-ink/40">
            System ID: 8849-RX // EST_2024
          </div>
        </div>
      </div>
    </footer>
  )
}