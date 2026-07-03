import { Link } from 'react-router'
import { Check } from 'lucide-react'

const tiers = [
  {
    name: "Basic Scan",
    price: "$0",
    sub: "For a single check",
    features: ["1 active diagnostic", "Structural parsing report", "ATS compatibility score", "Keyword overlap (single role)"],
    cta: "Start free",
    to: "/sign-up",
  },
  {
    name: "Professional",
    price: "$24",
    period: "/month",
    sub: "For active job seekers",
    features: [
      "Unlimited diagnostics",
      "Semantic vector mapping",
      "Job description matching",
      "Version-tracked history",
      "Side-by-side comparison",
      "Patch suggestions",
    ],
    highlight: true,
    cta: "Initialize Pro",
    to: "/sign-up",
  },
  {
    name: "Institutional",
    price: "Contact",
    sub: "For universities & teams",
    features: ["API access", "Bulk analysis", "Custom ontologies", "Cohort dashboards", "SSO", "Dedicated support"],
    cta: "Request quote",
    to: "/contact",
  },
]

export default function Pricing() {
  return (
    <div>
      <header className="border-b border-border px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <span className="font-mono text-[11px] uppercase tracking-widest text-ink/40">Calibration Plans</span>
          <h1 className="mt-4 font-serif text-5xl italic leading-tight md:text-7xl">Pricing.</h1>
          <p className="mt-6 max-w-xl text-lg text-ink/70">
            One subscription. Every diagnostic layer. Cancel anytime.
          </p>
        </div>
      </header>

      <section className="px-6 py-16">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`flex flex-col border p-8 ${
                t.highlight ? "border-ink bg-ink text-paper" : "border-border bg-paper"
              }`}
            >
              <span className={`font-mono text-[10px] uppercase tracking-widest ${t.highlight ? "text-paper/50" : "text-ink/40"}`}>
                {t.name}
              </span>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="font-serif text-5xl">{t.price}</span>
                {t.period && <span className={t.highlight ? "text-paper/50" : "text-ink/40"}>{t.period}</span>}
              </div>
              <p className={`mt-2 text-sm ${t.highlight ? "text-paper/60" : "text-ink/60"}`}>{t.sub}</p>
              <ul className="mt-8 flex-1 space-y-3 text-sm">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className={`mt-0.5 size-4 shrink-0 ${t.highlight ? "text-accent" : "text-accent"}`} />
                    <span className={t.highlight ? "text-paper/85" : "text-ink/75"}>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                to={t.to}
                className={`mt-8 inline-flex items-center justify-center px-4 py-3 text-sm font-medium ${
                  t.highlight
                    ? "bg-paper text-ink hover:bg-paper/90"
                    : "border border-ink text-ink hover:bg-ink hover:text-paper"
                }`}
              >
                {t.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}