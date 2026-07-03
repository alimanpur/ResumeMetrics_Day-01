import { Link } from 'react-router'

export function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="grid min-h-screen bg-paper md:grid-cols-2">
      <div className="flex flex-col px-6 py-10 md:px-16">
        <Link to="/" className="font-mono text-base font-bold uppercase tracking-tighter">
          ResuMetrics
        </Link>
        <div className="my-auto max-w-md py-12">
          <h1 className="font-serif text-4xl italic md:text-5xl">{title}</h1>
          {subtitle && <p className="mt-3 text-base text-ink/60">{subtitle}</p>}
          <div className="mt-10">{children}</div>
          {footer && <div className="mt-8 text-sm text-ink/60">{footer}</div>}
        </div>
        <div className="font-mono text-[10px] uppercase tracking-widest text-ink/40">
          © {new Date().getFullYear()} ResuMetrics
        </div>
      </div>
      <div className="relative hidden overflow-hidden border-l border-border bg-ink md:block">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(37,99,235,0.25),transparent_50%)]" />
        <div className="relative flex h-full flex-col justify-between p-16 text-paper">
          <div className="font-mono text-[10px] uppercase tracking-widest text-paper/40">
            Engine v0.8.4 · Operational
          </div>
          <div>
            <p className="font-serif text-3xl italic leading-snug text-paper/90">
              "The most useful thing software can tell you is what it didn't understand about you."
            </p>
            <p className="mt-6 font-mono text-[10px] uppercase tracking-widest text-paper/40">
              — ResuMetrics manual, 1.0
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4 border-t border-paper/10 pt-8 font-mono text-[10px] uppercase tracking-widest text-paper/40">
            <div>Scans / day · 24,118</div>
            <div>ATS models · 412</div>
            <div>Uptime · 99.98%</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AuthInput({ label, type = "text", name, required, placeholder, value, onChange }) {
  return (
    <label className="block">
      <span className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-ink/50">{label}</span>
      <input
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full border border-border bg-paper px-3 py-2.5 text-sm focus:border-accent focus:outline-none"
      />
    </label>
  );
}

export function AuthButton({ children, ...p }) {
  return (
    <button
      {...p}
      className="w-full bg-ink py-3 text-sm font-medium text-paper transition-colors hover:bg-ink/90 disabled:opacity-50"
    >
      {children}
    </button>
  );
}