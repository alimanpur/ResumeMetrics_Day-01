export default function Terms() {
  return (
    <div>
      <article className="mx-auto max-w-3xl px-6 py-24">
        <span className="font-mono text-[11px] uppercase tracking-widest text-ink/40">Agreement</span>
        <h1 className="mt-4 font-serif text-5xl italic">Terms.</h1>
        <div className="mt-12 space-y-6 text-base leading-relaxed text-ink/75">
          <p>By using ResuMetrics you agree to use the service for lawful purposes, not to attempt to reverse-engineer the diagnostic engine, and not to use the service to evaluate or rank candidates without their consent.</p>
          <h2 className="font-serif text-2xl italic">Use of Output</h2>
          <p>Diagnostic output is provided for informational purposes. ResuMetrics makes no guarantee that improving any score will result in employment outcomes.</p>
          <h2 className="font-serif text-2xl italic">Billing</h2>
          <p>Paid plans are billed monthly. Cancellations take effect at the end of the current billing period.</p>
          <h2 className="font-serif text-2xl italic">Contact</h2>
          <p>For questions about these terms, contact legal@resumetrics.io.</p>
        </div>
      </article>
    </div>
  );
}