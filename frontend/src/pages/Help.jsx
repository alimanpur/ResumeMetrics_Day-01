import { useState } from 'react'
import { Link } from 'react-router'
import { BookOpen, MessageCircle, Mail, Search, ChevronDown, ChevronUp, ExternalLink, LifeBuoy, FileText, Video, Users } from 'lucide-react'
import { useNotification } from '../components/ui/Notification'

export default function Help() {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedFaq, setExpandedFaq] = useState(null)
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' })
  const notification = useNotification()

  const categories = [
    { icon: BookOpen, title: 'Documentation', description: 'Guides, parser notes, and best practices.', link: '/faq', count: 24 },
    { icon: Video, title: 'Video Tutorials', description: 'Step-by-step walkthroughs and demos.', link: '/case-studies', count: 12 },
    { icon: FileText, title: 'API Reference', description: 'Technical documentation for developers.', link: '/privacy', count: 8 },
    { icon: Users, title: 'Community', description: 'Join discussions and share insights.', link: '/contact', count: 156 },
  ]

  const faqs = [
    {
      category: 'Getting Started',
      questions: [
        { q: 'How do I upload my resume?', a: 'Navigate to the Upload page and drag & drop your resume file (PDF, DOCX, or TXT). The system will automatically analyze it and provide you with a detailed ATS score report.' },
        { q: 'What file formats are supported?', a: 'We support PDF, DOCX, and plain text files up to 5MB. For best results, use PDF or DOCX format.' },
        { q: 'How long does analysis take?', a: 'Most analyses complete within 10-30 seconds. Complex resumes may take up to a minute.' },
      ]
    },
    {
      category: 'Analysis & Scoring',
      questions: [
        { q: 'What is an ATS score?', a: 'ATS (Applicant Tracking System) score measures how well your resume will perform when parsed by automated recruitment systems. We simulate 400+ ATS variations to give you a comprehensive score.' },
        { q: 'Why is my score different from other tools?', a: 'Our scoring is based on actual ATS parser simulations, not keyword matching alone. We analyze formatting, structure, semantic clarity, and parser compatibility.' },
        { q: 'What do the score categories mean?', a: 'Overall: Your total ATS compatibility score. Keywords: How well your resume matches target role keywords. Structure: Document formatting and section organization. Formatting: Font, layout, and visual stability.' },
      ]
    },
    {
      category: 'Account & Billing',
      questions: [
        { q: 'Is there a free plan?', a: 'Yes! Our Free plan includes 5 analyses per month and 3 stored resumes. No credit card required.' },
        { q: 'How do I upgrade my plan?', a: 'Visit the Billing page to view available plans. Pro and Enterprise plans will be available soon with Razorpay integration.' },
        { q: 'Can I cancel my subscription?', a: 'Yes, you can cancel anytime from the Billing page. Your access will continue until the end of your billing period.' },
      ]
    },
    {
      category: 'Privacy & Security',
      questions: [
        { q: 'Is my data secure?', a: 'Yes, we use industry-standard encryption and security practices. Your resumes are processed securely and never shared with third parties.' },
        { q: 'Do you store my resumes?', a: 'Resumes are stored temporarily for analysis. You can delete them anytime from the History page.' },
        { q: 'Can I export my data?', a: 'Yes, visit Settings > Data to export all your resumes, analyses, and account data.' },
      ]
    },
  ]

  const handleContactSubmit = (e) => {
    e.preventDefault()
    notification.success('Message sent! We\'ll get back to you within 24 hours.')
    setContactForm({ name: '', email: '', subject: '', message: '' })
  }

  const filteredFaqs = searchQuery 
    ? faqs.map(cat => ({
        ...cat,
        questions: cat.questions.filter(q => 
          q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.a.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(cat => cat.questions.length > 0)
    : faqs

  return (
    <div className="px-8 py-10">
      <div className="mb-10">
        <span className="font-mono text-[11px] uppercase tracking-widest text-ink/40">Support</span>
        <h1 className="mt-2 font-serif text-4xl italic">How can we help?</h1>
        <p className="mt-2 text-sm text-ink/60">Search our knowledge base or get in touch with our team.</p>
      </div>

      {/* Search Bar */}
      <div className="mb-10">
        <div className="flex items-center gap-2 border border-border bg-paper px-4 py-3">
          <Search className="size-5 text-ink/40" />
          <input
            type="text"
            placeholder="Search for help..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent outline-none placeholder:text-ink/40"
          />
        </div>
      </div>

      {/* Categories */}
      {!searchQuery && (
        <div className="mb-12">
          <h2 className="mb-6 font-serif text-2xl italic">Browse by Category</h2>
          <div className="grid gap-px border border-border bg-border md:grid-cols-4">
            {categories.map((cat, i) => {
              const Icon = cat.icon
              return (
                <Link
                  key={i}
                  to={cat.link}
                  className="bg-paper p-6 transition-colors hover:bg-paper-2"
                >
                  <Icon className="size-6 text-accent" />
                  <h3 className="mt-4 font-serif text-xl italic">{cat.title}</h3>
                  <p className="mt-2 text-sm text-ink/60">{cat.description}</p>
                  <div className="mt-4 font-mono text-xs text-ink/40">{cat.count} articles</div>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* FAQ Section */}
      <div className="mb-12">
        <h2 className="mb-6 font-serif text-2xl italic">Frequently Asked Questions</h2>
        {filteredFaqs.length === 0 ? (
          <div className="border border-border bg-paper p-12 text-center">
            <p className="text-sm text-ink/60">No FAQs found matching your search.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {filteredFaqs.map((category, catIndex) => (
              <div key={catIndex}>
                <h3 className="mb-4 font-mono text-xs uppercase tracking-widest text-ink/40">{category.category}</h3>
                <div className="space-y-2">
                  {category.questions.map((faq, qIndex) => {
                    const isExpanded = expandedFaq === `${catIndex}-${qIndex}`
                    return (
                      <div key={qIndex} className="border border-border bg-paper">
                        <button
                          onClick={() => setExpandedFaq(isExpanded ? null : `${catIndex}-${qIndex}`)}
                          className="flex w-full items-center justify-between p-4 text-left"
                        >
                          <span className="font-medium">{faq.q}</span>
                          {isExpanded ? <ChevronUp className="size-4 shrink-0" /> : <ChevronDown className="size-4 shrink-0" />}
                        </button>
                        {isExpanded && (
                          <div className="border-t border-border bg-paper-2 p-4">
                            <p className="text-sm text-ink/70">{faq.a}</p>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Contact Section */}
      <div className="mb-12">
        <h2 className="mb-6 font-serif text-2xl italic">Contact Us</h2>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="border border-border bg-paper p-6">
            <h3 className="mb-4 font-serif text-xl italic">Send us a message</h3>
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-ink/40">Name</label>
                <input
                  type="text"
                  required
                  value={contactForm.name}
                  onChange={(e) => setContactForm((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full rounded border border-border bg-paper px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-ink/40">Email</label>
                <input
                  type="email"
                  required
                  value={contactForm.email}
                  onChange={(e) => setContactForm((prev) => ({ ...prev, email: e.target.value }))}
                  className="w-full rounded border border-border bg-paper px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-ink/40">Subject</label>
                <input
                  type="text"
                  required
                  value={contactForm.subject}
                  onChange={(e) => setContactForm((prev) => ({ ...prev, subject: e.target.value }))}
                  className="w-full rounded border border-border bg-paper px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-ink/40">Message</label>
                <textarea
                  required
                  rows={6}
                  value={contactForm.message}
                  onChange={(e) => setContactForm((prev) => ({ ...prev, message: e.target.value }))}
                  className="w-full rounded border border-border bg-paper px-3 py-2 text-sm"
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center gap-2 bg-ink px-4 py-2 text-sm font-medium text-paper hover:bg-ink/90"
              >
                Send Message
              </button>
            </form>
          </div>

          <div className="space-y-6">
            {/* Support Options */}
            <div className="border border-border bg-paper p-6">
              <h3 className="mb-4 font-serif text-xl italic">Other Ways to Reach Us</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 size-5 text-accent" />
                  <div>
                    <div className="font-medium">Email Support</div>
                    <div className="mt-1 text-sm text-ink/60">support@resumetrics.co</div>
                    <div className="mt-1 text-xs text-ink/50">Response time: 1 business day</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MessageCircle className="mt-0.5 size-5 text-accent" />
                  <div>
                    <div className="font-medium">Live Chat</div>
                    <div className="mt-1 text-sm text-ink/60">Available during business hours</div>
                    <div className="mt-1 text-xs text-ink/50">Median response: 8 minutes</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Page */}
            <div className="border border-border bg-paper p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-xl italic">System Status</h3>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="size-2 rounded-full bg-emerald-600 animate-pulse" />
                    <span className="text-sm text-emerald-600">All systems operational</span>
                  </div>
                </div>
                <LifeBuoy className="size-6 text-ink/40" />
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-ink/60">API Services</span>
                  <span className="text-emerald-600">Operational</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-ink/60">Analysis Engine</span>
                  <span className="text-emerald-600">Operational</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-ink/60">File Processing</span>
                  <span className="text-emerald-600">Operational</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}