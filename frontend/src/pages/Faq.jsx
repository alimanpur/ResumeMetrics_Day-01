import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion.jsx'

const qa = [
  ["Is ResuMetrics a resume builder?", "No. We don't write or generate resumes. We diagnose the one you already have and tell you exactly what an ATS pipeline does with it."],
  ["How is this different from a simple keyword checker?", "Keyword checkers compare two text blobs. We simulate the full pipeline: ingestion, parsing, entity extraction, semantic embedding, and ranking. The score is a model of the real system, not a string match."],
  ["Do you store my resume?", "By default, no. Uploaded files are held in memory for the duration of the diagnostic and discarded. Professional users can opt in to history retention for version tracking."],
  ["Which ATS systems do you simulate?", "Greenhouse, Workday, Lever, Taleo, Ashby, iCIMS, SmartRecruiters, and 400+ smaller variants. Each is calibrated against observed behavior, not vendor claims."],
  ["Will my score change over time?", "Yes. ATS vendors update their models. We re-calibrate quarterly and your historical scores are re-scored against the current models for accurate trend data."],
  ["Can I export the diagnostic report?", "Yes. Every diagnostic exports as PDF or structured JSON for downstream tooling."],
  ["Do you support languages other than English?", "Currently English. Spanish, French, and German are on the roadmap for Q3."],
]

export default function Faq() {
  return (
    <div>
      <header className="border-b border-border px-6 py-24">
        <div className="mx-auto max-w-3xl">
          <span className="font-mono text-[11px] uppercase tracking-widest text-ink/40">Reference</span>
          <h1 className="mt-4 font-serif text-5xl italic md:text-7xl">Questions.</h1>
        </div>
      </header>
      <section className="px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <Accordion type="single" collapsible className="space-y-px">
            {qa.map(([q, a], i) => (
              <AccordionItem key={i} value={`i-${i}`} className="border-t border-border last:border-b">
                <AccordionTrigger className="py-6 text-left font-serif text-xl italic hover:no-underline">
                  {q}
                </AccordionTrigger>
                <AccordionContent className="pb-6 text-base leading-relaxed text-ink/70">{a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </div>
  );
}
