import { useState } from 'react'
import { toast } from 'sonner'

function Item({ k, v }) {
  return (
    <div>
      <div className="font-mono text-[10px] uppercase tracking-widest text-ink/40">{k}</div>
      <div className="mt-2 whitespace-pre-line font-serif text-2xl italic">{v}</div>
    </div>
  );
}

function Field({ label, name, type = "text", required }) {
  return (
    <div>
      <label className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-ink/50">{label}</label>
      <input
        type={type}
        name={name}
        required={required}
        className="w-full border border-border bg-paper px-3 py-2 text-sm focus:border-accent focus:outline-none"
      />
    </div>
  );
}

export default function Contact() {
  const [sent, setSent] = useState(false)
  return (
    <div>
      <header className="border-b border-border px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <span className="font-mono text-[11px] uppercase tracking-widest text-ink/40">Correspondence</span>
          <h1 className="mt-4 font-serif text-5xl italic md:text-7xl">Get in touch.</h1>
        </div>
      </header>
      <section className="px-6 py-16">
        <div className="mx-auto grid max-w-5xl gap-16 md:grid-cols-2">
          <div className="space-y-8">
            <Item k="Press" v="press@resumetrics.io" />
            <Item k="Institutional Sales" v="institutions@resumetrics.io" />
            <Item k="Security Disclosure" v="security@resumetrics.io" />
            <Item k="Mail" v={"ResuMetrics Labs\n450 Greenwich St, Floor 4\nNew York, NY 10013"} />
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              setSent(true)
              toast.success("Message received. We respond within one business day.")
            }}
            className="space-y-6 border border-border bg-paper p-8"
          >
            <Field label="Name" name="name" required />
            <Field label="Email" name="email" type="email" required />
            <Field label="Organization" name="org" />
            <div>
              <label className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-ink/50">
                Message
              </label>
              <textarea
                required
                rows={5}
                className="w-full border border-border bg-paper px-3 py-2 text-sm focus:border-accent focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={sent}
              className="w-full bg-ink py-3 text-sm font-medium text-paper transition-colors hover:bg-ink/90 disabled:opacity-50"
            >
              {sent ? "Sent" : "Send message"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}