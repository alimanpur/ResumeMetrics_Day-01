import { Link } from 'react-router'
import { ArrowRight, FileText, Microscope, GitCompare, LineChart } from 'lucide-react'

export default function Landing() {
  return (
    <div>
      <Hero />
      <SignatureExperience />
      <WhyResumesFail />
      <HowItWorks />
      <Dashboard />
      <Trust />
      <CTA />
    </div>
  );
}

function Hero() {
  return (
    <header className="px-6 pt-24 pb-20">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-ink/10 px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-ink/50">
          <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Release 0.8.4 — Semantic Engine Live
        </div>
        <h1 className="font-serif text-5xl italic leading-[0.95] md:text-8xl">
          Stop guessing.<br />
          <span className="text-accent">See what the machine sees.</span>
        </h1>
        <p className="mt-10 max-w-2xl text-lg leading-relaxed text-ink/70 md:text-2xl">
          ResuMetrics isn't a builder. It's a forensic diagnostic tool that reverse-engineers
          how modern recruitment algorithms interpret your professional history.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Link
            to="/upload"
            className="inline-flex items-center gap-2 bg-ink px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-ink/90"
          >
            Run a diagnostic <ArrowRight className="size-4" />
          </Link>
          <Link
            to="/ats-intelligence"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-ink/70 hover:text-ink"
          >
            How ATS systems read resumes
          </Link>
        </div>
      </div>
    </header>
  );
}

function SignatureExperience() {
  return (
    <section className="px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="grid overflow-hidden border border-border bg-border gap-px lg:grid-cols-12">
          <div className="bg-paper p-8 lg:col-span-7">
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="size-2 bg-accent animate-pulse" />
                <span className="font-mono text-xs uppercase tracking-tight">
                  Live Parse: sr_product_designer_2024.pdf
                </span>
              </div>
              <span className="font-mono text-xs text-ink/40">Layer: Structural Analysis</span>
            </div>

            <div className="relative aspect-[8.5/11] border border-border bg-white p-12 shadow-sm">
              <div className="mb-2 h-4 w-1/3 bg-ink/10" />
              <div className="mb-8 h-3 w-1/4 bg-ink/5" />
              <div className="space-y-4">
                <div className="group relative">
                  <div className="absolute -left-4 top-0 bottom-0 w-1 bg-accent/30 transition-colors group-hover:bg-accent" />
                  <div className="h-3 w-full bg-ink/5" />
                  <div className="mt-2 h-3 w-5/6 bg-ink/5" />
                  <div className="absolute -right-2 top-0 bg-accent/5 px-1 font-mono text-[10px] text-accent">
                    PARSER_FLAG: NON_STANDARD_GLYPH
                  </div>
                </div>
                <div className="h-3 w-full bg-ink/5" />
                <div className="h-3 w-2/3 bg-ink/5" />
              </div>
              <div className="mt-12 border-t border-dashed border-border pt-8">
                <div className="grid grid-cols-2 gap-8">
                  <div className="h-24 bg-ink/5" />
                  <div className="h-24 bg-ink/5" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-paper-2 p-8 lg:col-span-5">
            <h3 className="mb-10 font-mono text-xs uppercase tracking-widest text-ink/40">
              Diagnostic Output
            </h3>
            <div className="space-y-12">
              <div>
                <div className="mb-2 flex items-end justify-between">
                  <span className="text-sm font-medium">Semantic Clarity</span>
                  <span className="font-mono text-2xl">88%</span>
                </div>
                <div className="h-1 w-full bg-border">
                  <div className="h-full bg-accent" style={{ width: "88%" }} />
                </div>
                <p className="mt-4 text-xs leading-relaxed text-ink/60">
                  Your "Experience" headers are successfully mapped to ISO-9001 standards.
                  Semantic overlap with Senior IC roles is high.
                </p>
              </div>

              <div className="border-l-2 border-accent bg-accent/5 p-4">
                <span className="font-mono text-[10px] uppercase tracking-tighter text-accent">
                  Optimization Found
                </span>
                <h4 className="mt-1 text-sm font-bold">Format Instability Detected</h4>
                <p className="mt-2 text-xs text-ink/70">
                  Multi-column layouts in "Skills" cause a 14% character drop-rate in Greenhouse parsers.
                </p>
                <button className="mt-4 border-b border-accent/30 pb-0.5 font-mono text-[10px] font-bold uppercase tracking-widest text-accent">
                  View Patch Suggestion
                </button>
              </div>

              <div className="rounded-sm bg-ink p-4">
                <div className="mb-3 flex gap-1.5">
                  <div className="size-1.5 rounded-full bg-red-500/40" />
                  <div className="size-1.5 rounded-full bg-yellow-500/40" />
                  <div className="size-1.5 rounded-full bg-green-500/40" />
                </div>
                <div className="space-y-1 font-mono text-[11px] text-paper/40">
                  <div className="text-paper/80">$ rm-analyze --deep structure.json</div>
                  <div>{">"} Initializing OCR verification... DONE</div>
                  <div>{">"} Mapping keyword hierarchy... [##########] 100%</div>
                  <div className="text-accent">! WARNING: Circular reference in "Summary"</div>
                  <div>{">"} Outputting result...</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function WhyResumesFail() {
  const items = [
    { stat: "75%", label: "of resumes are filtered out before reaching a human reviewer." },
    { stat: "400+", label: "distinct ATS variations parse documents using different schemas." },
    { stat: "14%", label: "average character loss in multi-column resume layouts." },
    { stat: "3.7s", label: "median time a recruiter spends with a resume that passes filtering." },
  ];
  return (
    <section className="border-y border-border bg-paper-2 px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 grid gap-12 md:grid-cols-2">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-widest text-ink/40">
              § 01 — The Problem
            </span>
            <h2 className="mt-4 font-serif text-4xl italic leading-tight md:text-5xl">
              Most resumes never reach a human.
            </h2>
          </div>
          <p className="text-lg leading-relaxed text-ink/70">
            Modern hiring is a tiered pipeline. A resume passes through parsers, normalizers,
            taxonomies, and ranking models long before a recruiter sees it. Each layer can
            silently discard signal — a misread heading, an embedded font, a column you didn't
            know shouldn't be there.
          </p>
        </div>
        <div className="grid gap-px border border-border bg-border md:grid-cols-4">
          {items.map((i) => (
            <div key={i.stat} className="bg-paper p-8">
              <div className="font-serif text-5xl">{i.stat}</div>
              <p className="mt-4 text-sm text-ink/60">{i.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { n: "01", title: "Upload", icon: FileText, body: "Drop your resume in PDF, DOCX, or plain text. We never share or sell what you upload." },
    { n: "02", title: "Parse", icon: Microscope, body: "The engine simulates parsers from Greenhouse, Workday, Lever, Taleo, and Ashby." },
    { n: "03", title: "Compare", icon: GitCompare, body: "Paste a job description. We map semantic overlap and identify missing concept clusters." },
    { n: "04", title: "Improve", icon: LineChart, body: "Track every revision over time. Watch your alignment score climb as you patch issues." },
  ];
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16">
          <span className="font-mono text-[11px] uppercase tracking-widest text-ink/40">
            § 02 — The Method
          </span>
          <h2 className="mt-4 max-w-2xl font-serif text-4xl italic leading-tight md:text-5xl">
            Four layers of forensic analysis.
          </h2>
        </div>
        <div className="grid gap-px border border-border bg-border md:grid-cols-4">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
            <div key={s.n} className="bg-paper p-8">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-widest text-ink/40">{s.n}</span>
                <Icon className="size-4 text-accent" />
              </div>
              <h3 className="mt-8 font-serif text-2xl">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink/60">{s.body}</p>
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Dashboard() {
  return (
    <section className="bg-ink px-6 py-24 text-paper">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 grid gap-12 md:grid-cols-2">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-widest text-paper/40">
              § 03 — The Hub
            </span>
            <h2 className="mt-4 font-serif text-4xl italic leading-tight md:text-5xl">
              The Intelligence Hub.
            </h2>
          </div>
          <p className="text-lg leading-relaxed text-paper/60">
            Aggregated data from over 400 unique ATS variations. Every diagnostic is a
            timestamped record. Every change is a measurable delta against your last version.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="border border-paper/10 bg-paper/5 p-8">
            <span className="font-mono text-[10px] uppercase tracking-widest text-paper/40">Market Alignment</span>
            <div className="mt-4 mb-8 font-serif text-5xl">Gold</div>
            <div className="flex h-32 items-end gap-1">
              <div className="flex-1 bg-accent/20" style={{ height: "30%" }} />
              <div className="flex-1 bg-accent/20" style={{ height: "45%" }} />
              <div className="flex-1 bg-accent/20" style={{ height: "40%" }} />
              <div className="flex-1 bg-accent/20" style={{ height: "70%" }} />
              <div className="flex-1 bg-accent" style={{ height: "100%" }} />
            </div>
            <p className="mt-6 text-xs italic text-paper/40">
              Ranking top 5% for "Staff Level" keywords in Fintech.
            </p>
          </div>

          <div className="flex flex-col justify-between border border-paper/10 bg-paper/5 p-8">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-paper/40">Stability Score</span>
              <div className="mt-4">
                <span className="font-serif text-6xl">9.4</span>
                <span className="text-xl text-paper/30">/10</span>
              </div>
            </div>
            <div className="mt-12 space-y-3">
              <Row k="Parser Integrity" v="Excellent" />
              <Row k="Font Embed Check" v="Pass" tone="ok" />
              <Row k="Metadata Cleanliness" v="Warning" tone="warn" last />
            </div>
          </div>

          <div className="border border-paper/10 bg-paper/5 p-8">
            <span className="font-mono text-[10px] uppercase tracking-widest text-paper/40">Action Items</span>
            <div className="mt-6 space-y-4">
              {[
                "Replace graphical skill bars with semantic text lists.",
                'Increase density of "Leadership" LSI keywords by 15%.',
                "Clean invisible metadata from PDF export.",
              ].map((t, i) => (
                <div key={i} className="flex gap-3">
                  <span className="font-mono text-accent">{String(i + 1).padStart(2, "0")}</span>
                  <p className="text-xs leading-relaxed">{t}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Row({ k, v, tone, last }) {
  const color = tone === "ok" ? "text-emerald-400" : tone === "warn" ? "text-yellow-400" : "text-paper";
  return (
    <div className={`flex justify-between text-xs ${last ? "" : "border-b border-paper/10 pb-2"}`}>
      <span className="text-paper/60">{k}</span>
      <span className={color}>{v}</span>
    </div>
  );
}

function Trust() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-5xl text-center">
        <span className="font-mono text-[11px] uppercase tracking-widest text-ink/40">
          § 04 — On Trust
        </span>
        <p className="mt-6 font-serif text-3xl italic leading-snug text-ink/80 md:text-4xl">
          "We don't generate language. We don't rewrite your story. We don't store your resume
          beyond your session. We measure, we report, and we leave the prose to you."
        </p>
        <div className="mt-8 font-mono text-[11px] uppercase tracking-widest text-ink/40">
          — ResuMetrics Engineering Protocol
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="border-t border-border bg-paper-2 px-6 py-24">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 md:flex-row md:items-end">
        <div>
          <h2 className="font-serif text-4xl italic md:text-6xl">Run your first diagnostic.</h2>
          <p className="mt-4 max-w-xl text-ink/60">Free. No card. The first scan is yours to keep.</p>
        </div>
        <Link
          to="/upload"
          className="inline-flex items-center gap-2 bg-ink px-8 py-4 text-sm font-medium text-paper hover:bg-ink/90"
        >
          Upload resume <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  );
}