export default function Privacy() {
  return (
    <div>
      <article className="mx-auto max-w-3xl px-6 py-24">
        <span className="font-mono text-[11px] uppercase tracking-widest text-ink/40">Policy</span>
        <h1 className="mt-4 font-serif text-5xl italic">Privacy.</h1>
        <div className="mt-12 space-y-6 text-base leading-relaxed text-ink/75">
          <p>This page is maintained by ResuMetrics to summarize how customer data is handled. It is not a substitute for legal counsel.</p>
          <h2 className="font-serif text-2xl italic">Uploads</h2>
          <p>By default, uploaded resumes are processed in memory and discarded at session end. Professional users may opt in to history retention, which stores documents encrypted at rest.</p>
          <h2 className="font-serif text-2xl italic">Analytics</h2>
          <p>We collect minimal product analytics: page views, feature usage, and error reports. We do not sell data and do not run third-party advertising trackers.</p>
          <h2 className="font-serif text-2xl italic">Subprocessors</h2>
          <p>Hosting, email delivery, and payment processing are handled by named subprocessors disclosed in our DPA, available on request.</p>
          <h2 className="font-serif text-2xl italic">Requests</h2>
          <p>For data access, export, or deletion requests, contact privacy@resumetrics.io.</p>
        </div>
      </article>
    </div>
  );
}