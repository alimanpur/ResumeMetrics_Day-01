const layers = [
  { n: "L1", t: "Ingestion & OCR", d: "Files are converted to plain text. PDFs are flattened; embedded fonts and graphics frequently lose data here. Resumes saved as images are reconstructed by OCR with non-trivial error rates." },
  { n: "L2", t: "Structural Parsing", d: "The parser segments the document into headers (Experience, Education, Skills). Non-standard headings or design-led layouts are routinely missegmented." },
  { n: "L3", t: "Entity Extraction", d: "Companies, titles, dates, and skills are normalized against proprietary ontologies. 'Sr. Eng.' may or may not collapse to 'Senior Engineer'." },
  { n: "L4", t: "Semantic Vectoring", d: "Modern systems embed your resume in a vector space alongside the job description and rank by cosine similarity, not literal keyword matches." },
  { n: "L5", t: "Ranking & Filtering", d: "A composite score determines whether your resume reaches a human. Rules vary per company, per role, per recruiter." },
];

export default function AtsIntelligence() {
  return (
    <>
      <header className="border-b border-border px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <span className="font-mono text-[11px] uppercase tracking-widest text-ink/40">Field Guide</span>
          <h1 className="mt-4 font-serif text-5xl italic leading-tight md:text-7xl">
            How an ATS reads a resume.
          </h1>
          <p className="mt-8 max-w-2xl text-lg text-ink/70">
            ATS is not one system. It is a class of pipelines, each composed of layers that
            interpret your document in a different way. Most failures are silent.
          </p>
        </div>
      </header>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="space-y-px">
            {layers.map((l) => (
              <div key={l.n} className="grid gap-8 border-t border-border py-10 md:grid-cols-[120px_200px_1fr] last:border-b">
                <span className="font-mono text-sm text-accent">{l.n}</span>
                <h3 className="font-serif text-2xl italic">{l.t}</h3>
                <p className="text-base leading-relaxed text-ink/70">{l.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-paper-2 px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-serif text-4xl italic">Common silent failures.</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {[
              ["Two-column layouts", "Text from the right column gets interleaved with the left, scrambling sentence order."],
              ["Icons as bullets", "Decorative icons are read as glyphs or skipped entirely, breaking list parsing."],
              ["Tables for skills", "Skills inside tables are often extracted as a single concatenated string."],
              ["Headers in images", "Section headers exported as images vanish for the parser — your Experience section may not exist."],
              ["Custom fonts", "Non-standard fonts can map to private-use Unicode and produce garbled output."],
              ["Date ranges as 'Now'", "Many parsers can't normalize 'Now' or 'Present-day' to an active date."],
            ].map(([t, d]) => (
              <div key={t} className="border border-border bg-paper p-6">
                <h4 className="font-serif text-xl italic">{t}</h4>
                <p className="mt-2 text-sm text-ink/70">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
