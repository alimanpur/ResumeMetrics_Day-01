const studies = [
  { role: "Staff Engineer, Fintech", before: 42, after: 91, days: 9, note: "Three multi-column sections were silently destroying section parsing." },
  { role: "Principal Designer", before: 58, after: 88, days: 14, note: "Icon-based skills list extracted as a single concatenated string. Replaced with structured text." },
  { role: "VP Marketing", before: 64, after: 94, days: 6, note: "Executive summary lacked semantic overlap with Workday's leadership ontology." },
  { role: "Data Scientist", before: 51, after: 89, days: 11, note: "Custom font mapped to private Unicode. Single export change recovered all entity extraction." },
]

function Stat({ k, v, accent }) {
  return (
    <div>
      <div className="font-mono text-[10px] uppercase tracking-widest text-ink/40">{k}</div>
      <div className={`mt-1 font-serif text-3xl ${accent ? "text-accent" : ""}`}>{v}</div>
    </div>
  );
}

export default function CaseStudies() {
  return (
    <div>
      <header className="border-b border-border px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <span className="font-mono text-[11px] uppercase tracking-widest text-ink/40">Selected Records</span>
          <h1 className="mt-4 font-serif text-5xl italic md:text-7xl">Case studies.</h1>
          <p className="mt-6 max-w-2xl text-lg text-ink/70">
            Anonymized diagnostics from the field. Names withheld; numbers verbatim.
          </p>
        </div>
      </header>
      <section className="px-6 py-16">
        <div className="mx-auto max-w-5xl space-y-px">
          {studies.map((s, i) => (
            <article key={i} className="grid gap-8 border-t border-border py-12 last:border-b md:grid-cols-[1fr_280px]">
              <div>
                <span className="font-mono text-[11px] uppercase tracking-widest text-ink/40">
                  Case № {String(i + 1).padStart(3, "0")}
                </span>
                <h2 className="mt-3 font-serif text-3xl italic">{s.role}</h2>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-ink/70">{s.note}</p>
              </div>
              <div className="grid grid-cols-3 gap-2 border border-border bg-paper p-4">
                <Stat k="Before" v={`${s.before}`} />
                <Stat k="After" v={`${s.after}`} accent />
                <Stat k="Days" v={`${s.days}`} />
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}