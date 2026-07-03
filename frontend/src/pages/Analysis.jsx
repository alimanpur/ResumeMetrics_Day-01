import { Link, useParams } from 'react-router'
import { useState, Fragment, useRef, useEffect } from 'react'
import { Download, Check, AlertTriangle, X, Clock, ChevronDown, FileText, FileJson, FileType } from 'lucide-react'
import { Bar, BarChart, Cell, PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useQuery } from '@tanstack/react-query'
import { getAnalysis } from '../api/analysis'
import { getResume } from '../api/resume'
import { CardSkeleton, ChartSkeleton } from '../components/ui/loading'
import { ErrorState } from '../components/ui/error-state'
import { useCountUp } from '../hooks/useAnimation'

const tabs = ["Overview", "ATS Compatibility", "Keywords", "Structure", "Patches"]

const processingStages = [
  "Uploading Resume",
  "Validating File",
  "Extracting Text",
  "OCR Verification",
  "Section Detection",
  "Experience Parsing",
  "Education Parsing",
  "Skills Extraction",
  "Keyword Matching",
  "ATS Rule Engine",
  "Semantic Intelligence",
  "Achievement Detection",
  "Job Match Engine",
  "Benchmarking",
  "Generating Suggestions",
  "Preparing Report",
  "Complete",
]

export default function Analysis() {
  const { id } = useParams()
  const analysisId = id
  const [tab, setTab] = useState("Overview")
  const [exportOpen, setExportOpen] = useState(false)
  const exportRef = useRef(null)

  const { data: analysisData, isLoading: analysisLoading, error: analysisError } = useQuery({
    queryKey: ['analysis', analysisId],
    queryFn: () => getAnalysis(analysisId),
    enabled: !!analysisId,
    refetchInterval: (query) => {
      const state = query?.state
      if (!state) return false
      const responseData = state.data
      const status = responseData?.data?.data?.status || responseData?.data?.status
      if (status === 'PENDING' || status === 'PROCESSING') {
        return 2000
      }
      return false
    },
  })

  const analysisResponse = analysisData?.data?.data || analysisData?.data || {}
  const resumeId = analysisResponse.resumeId || analysisResponse?.resume?.id
  const analysisStatus = analysisResponse.status

  const { data: resumeData } = useQuery({
    queryKey: ['resume', resumeId],
    queryFn: () => getResume(resumeId),
    enabled: !!resumeId && !analysisLoading,
  })

  useEffect(() => {
    function handleClickOutside(e) {
      if (exportRef.current && !exportRef.current.contains(e.target)) {
        setExportOpen(false)
      }
    }
    if (exportOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [exportOpen])

  if (analysisLoading) {
    return (
      <div className="px-8 py-10">
        <div className="mb-8">
          <div className="h-6 w-32 animate-pulse bg-ink/10" />
          <div className="mt-2 h-10 w-64 animate-pulse bg-ink/10" />
          <div className="mt-2 h-4 w-96 animate-pulse bg-ink/10" />
        </div>
        <div className="mb-8 grid grid-cols-4 gap-px border border-border bg-border">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
        <ChartSkeleton />
      </div>
    )
  }

  if (analysisError || !analysisResponse || !analysisResponse.id) {
    return (
      <div className="px-8 py-10">
        <ErrorState
          title="Analysis not found"
          message="This analysis doesn't exist or has been deleted."
          action={() => window.location.href = '/history'}
          actionLabel="Go to History"
        />
      </div>
    )
  }

  if (analysisStatus === 'PENDING' || analysisStatus === 'PROCESSING') {
    const currentStage = analysisStatus === 'PROCESSING' ? Math.min(processingStages.length - 1, Math.floor(processingStages.length * 0.6)) : 2
    return (
      <div className="px-8 py-10">
        <div className="mb-10 max-w-3xl">
          <span className="font-mono text-[11px] uppercase tracking-widest text-ink/40">Analysis in Progress</span>
          <h1 className="mt-2 font-serif text-4xl italic">Processing your resume...</h1>
          <p className="mt-2 text-sm text-ink/60">
            Our AI engine is analyzing your resume. This usually takes a few seconds.
          </p>
        </div>

        <div className="rounded-sm bg-ink p-6">
          <div className="mb-4 flex items-center justify-between font-mono text-xs text-paper">
            <span className="flex items-center gap-2">
              <Clock className="size-3 animate-spin" />
              AI Analysis Engine
            </span>
            <span className="text-paper/40">status: {analysisStatus}</span>
          </div>

          <div className="space-y-2 font-mono text-xs">
            {processingStages.map((stage, i) => {
              const done = i < currentStage
              const active = i === currentStage
              return (
                <div key={i} className={`flex items-center justify-between ${
                  done ? "text-paper/80" : active ? "text-accent" : "text-paper/30"
                }`}>
                  <span className="flex items-center gap-2">
                    {done ? <Check className="size-3" /> : active ? <Clock className="size-3 animate-spin" /> : <Clock className="size-3" />}
                    {stage}
                  </span>
                  {active && <span className="animate-pulse">processing...</span>}
                  {done && <span className="text-paper/60">done</span>}
                </div>
              )
            })}
          </div>

          <div className="mt-5 h-1 bg-paper/10">
            <div className="h-full bg-accent transition-all duration-500" style={{ width: `${(currentStage / processingStages.length) * 100}%` }} />
          </div>
        </div>
      </div>
    )
  }

  if (analysisStatus === 'FAILED') {
    return (
      <div className="px-8 py-10">
        <ErrorState
          title="Analysis Failed"
          message={analysisResponse.errorMessage || 'The analysis could not be completed. Please try uploading your resume again.'}
          action={() => window.location.href = '/upload'}
          actionLabel="Try Again"
        />
      </div>
    )
  }

  const analysis = analysisResponse
  const resume = resumeData?.data?.data || resumeData?.data?.resume || {}
  const scores = analysis.scores || {}
  const atsScores = analysis.atsScores || []
  const semantic = analysis.semanticScores || []
  const keywords = analysis.keywords || { aligned: [], missing: [] }
  const structure = analysis.structure || []
  const patches = analysis.patches || []

  function exportAsJSON() {
    const exportData = {
      resumeName: resume.fileName || analysis.resume?.fileName || 'Untitled Resume',
      atsScore: analysis.atsScore,
      overallScore: analysis.overallScore,
      scores: {
        ats: analysis.atsScore,
        keyword: analysis.keywordScore,
        formatting: analysis.formattingScore,
        readability: analysis.readabilityScore,
        overall: analysis.overallScore,
        quality: analysis.qualityScore,
      },
      semanticScores: semantic,
      atsScores: atsScores,
      strengths: analysis.strengths,
      weaknesses: analysis.weaknesses,
      keywords: keywords,
      missingKeywords: analysis.missingKeywords,
      missingSkills: analysis.missingSkills,
      structure: structure,
      suggestions: analysis.suggestionsData || analysis.improvementSuggestions,
      recommendations: analysis.improvementSuggestions,
      date: analysis.createdAt ? new Date(analysis.createdAt).toISOString() : new Date().toISOString(),
      userName: resume.user?.name || analysis.user?.name || 'User',
    }
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    downloadBlob(blob, `${resume.fileName || 'resume'}-analysis.json`)
    setExportOpen(false)
  }

  function exportAsMarkdown() {
    const date = analysis.createdAt ? new Date(analysis.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : new Date().toLocaleDateString()
    const md = `# Resume Analysis Report

**Resume:** ${resume.fileName || 'Untitled Resume'}
**Date:** ${date}
**ATS Score:** ${analysis.atsScore || 0}/100
**Overall Score:** ${analysis.overallScore || 0}/100

## Scores

| Metric | Score |
|--------|-------|
| Overall | ${analysis.overallScore || 0}/100 |
| ATS Pass-rate | ${analysis.atsScore || 0}/100 |
| Keyword Density | ${analysis.keywordScore || 0}/100 |
| Formatting | ${analysis.formattingScore || 0}/100 |
| Readability | ${analysis.readabilityScore || 0}/100 |
| Quality | ${analysis.qualityScore || 0}/100 |

## Semantic Analysis

${(semantic || []).map(s => `- **${s.axis}**: ${s.v}/100`).join('\n')}

## Strengths

${(analysis.strengths?.skills || []).map(s => `- ${s}`).join('\n') || '- No strengths recorded'}

## Weaknesses

${(analysis.weaknesses || []).map(w => `- **${w.area}**: ${w.suggestion}`).join('\n') || '- No weaknesses recorded'}

## Keywords Aligned

${(keywords.aligned || []).map(k => `- ${k}`).join('\n') || '- None'}

## Missing Keywords

${(keywords.missing || []).map(k => `- ${k}`).join('\n') || '- None'}

## Recommendations

${(analysis.improvementSuggestions || []).map((r, i) => `${i + 1}. **${r.category}** (${r.severity || 'medium'}): ${r.suggestion}`).join('\n') || '- None'}

---
*Generated by ResuMetrics*
`
    const blob = new Blob([md], { type: 'text/markdown' })
    downloadBlob(blob, `${resume.fileName || 'resume'}-analysis.md`)
    setExportOpen(false)
  }

  function exportAsPDF() {
    const date = analysis.createdAt ? new Date(analysis.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : new Date().toLocaleDateString()
    const semanticRows = (semantic || []).map(s => `<tr><td>${s.axis}</td><td>${s.v}/100</td></tr>`).join('')
    const strengthsList = (analysis.strengths?.skills || []).map(s => `<li>${s}</li>`).join('')
    const weaknessesList = (analysis.weaknesses || []).map(w => `<li><strong>${w.area}</strong>: ${w.suggestion}</li>`).join('')
    const alignedKeywords = (keywords.aligned || []).map(k => `<span class="kw ok">${k}</span>`).join(' ')
    const missingKeywordsList = (keywords.missing || []).map(k => `<span class="kw warn">${k}</span>`).join(' ')
    const recsList = (analysis.improvementSuggestions || []).map(r => `<li><strong>${r.category}</strong> (${r.severity || 'medium'}): ${r.suggestion}</li>`).join('')

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Resume Analysis Report</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Georgia, 'Times New Roman', serif; color: #1a1a1a; padding: 48px; max-width: 800px; margin: 0 auto; }
    h1 { font-size: 28px; font-style: italic; margin-bottom: 8px; }
    h2 { font-size: 18px; font-style: italic; margin: 24px 0 12px; padding-bottom: 8px; border-bottom: 1px solid #e5e5e1; }
    h3 { font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em; color: #666; margin-bottom: 8px; }
    .meta { color: #666; font-size: 13px; margin-bottom: 24px; }
    .score-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin: 16px 0; }
    .score-card { border: 1px solid #e5e5e1; padding: 16px; text-align: center; }
    .score-value { font-size: 36px; font-style: italic; }
    .score-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.15em; color: #999; margin-top: 4px; }
    table { width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 13px; }
    th, td { padding: 8px 12px; text-align: left; border-bottom: 1px solid #e5e5e1; }
    th { font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #999; }
    ul { margin: 8px 0 8px 20px; font-size: 13px; line-height: 1.8; }
    .kw { display: inline-block; padding: 2px 8px; border-radius: 2px; font-size: 12px; margin: 2px; }
    .kw.ok { background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0; }
    .kw.warn { background: #fffbeb; color: #92400e; border: 1px solid #fde68a; }
    .footer { margin-top: 48px; padding-top: 16px; border-top: 1px solid #e5e5e1; font-size: 11px; color: #999; }
    @media print { body { padding: 0; } }
  </style>
</head>
<body>
  <h1>Resume Analysis Report</h1>
  <div class="meta">
    <strong>Resume:</strong> ${resume.fileName || 'Untitled Resume'}<br/>
    <strong>Date:</strong> ${date}<br/>
    <strong>Target Role:</strong> ${analysis.targetRole || 'Not specified'}
  </div>

  <div class="score-grid">
    <div class="score-card">
      <div class="score-value">${analysis.overallScore || 0}</div>
      <div class="score-label">Overall</div>
    </div>
    <div class="score-card">
      <div class="score-value">${analysis.atsScore || 0}</div>
      <div class="score-label">ATS Score</div>
    </div>
    <div class="score-card">
      <div class="score-value">${analysis.keywordScore || 0}</div>
      <div class="score-label">Keywords</div>
    </div>
    <div class="score-card">
      <div class="score-value">${analysis.formattingScore || 0}</div>
      <div class="score-label">Formatting</div>
    </div>
  </div>

  <h2>ATS Score Breakdown</h2>
  <table>
    <thead><tr><th>System</th><th>Score</th><th>Issues</th></tr></thead>
    <tbody>
      ${(atsScores || []).map(s => `<tr><td>${s.name}</td><td>${s.score}%</td><td>${(s.issues || []).join(', ') || 'None'}</td></tr>`).join('')}
    </tbody>
  </table>

  <h2>Semantic Analysis</h2>
  <table>
    <thead><tr><th>Axis</th><th>Score</th></tr></thead>
    <tbody>${semanticRows}</tbody>
  </table>

  <h2>Strengths</h2>
  <ul>${strengthsList}</ul>

  <h2>Weaknesses</h2>
  <ul>${weaknessesList}</ul>

  <h2>Keyword Analysis</h2>
  <h3>Aligned</h3>
  <div>${alignedKeywords}</div>
  <h3 style="margin-top: 12px;">Missing</h3>
  <div>${missingKeywordsList}</div>

  <h2>Recommendations</h2>
  <ul>${recsList}</ul>

  <div class="footer">
    Generated by ResuMetrics on ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
  </div>
</body>
</html>`
    const printWindow = window.open('', '_blank', 'width=900,height=700')
    printWindow.document.write(html)
    printWindow.document.close()
    setTimeout(() => printWindow.print(), 300)
    setExportOpen(false)
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="px-8 py-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link to="/history" className="font-mono text-[11px] uppercase tracking-widest text-ink/40 hover:text-ink">
            ← History
          </Link>
          <h1 className="mt-2 font-serif text-4xl italic">{resume.fileName || analysis.resume?.fileName || 'Resume Analysis'}</h1>
          <div className="mt-2 flex items-center gap-3 text-xs text-ink/60">
            <span className="font-mono">ID {resume.id || analysis.resume?.id}</span>
            <span>·</span>
            <span>{resume.targetRole || analysis.targetRole || 'No target role'}</span>
            <span>·</span>
            <span>{analysis.createdAt ? new Date(analysis.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="relative" ref={exportRef}>
            <button
              onClick={() => setExportOpen(!exportOpen)}
              className="inline-flex items-center gap-2 border border-border bg-paper px-4 py-2 text-sm hover:bg-paper-2"
            >
              <Download className="size-4" /> Export <ChevronDown className="size-3" />
            </button>
            {exportOpen && (
              <div className="absolute right-0 top-full z-50 mt-1 w-44 rounded border border-border bg-paper py-1 shadow-lg">
                <button
                  onClick={exportAsPDF}
                  className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm hover:bg-paper-2"
                >
                  <FileText className="size-4" /> PDF Report
                </button>
                <button
                  onClick={exportAsJSON}
                  className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm hover:bg-paper-2"
                >
                  <FileJson className="size-4" /> JSON Data
                </button>
                <button
                  onClick={exportAsMarkdown}
                  className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm hover:bg-paper-2"
                >
                  <FileType className="size-4" /> Markdown
                </button>
              </div>
            )}
          </div>
          <Link to="/compare" className="inline-flex items-center gap-2 bg-ink px-4 py-2 text-sm text-paper hover:bg-ink/90">
            Compare versions
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-px border border-border bg-border">
        <ScoreCell label="Overall" value={scores.overall || 0} />
        <ScoreCell label="ATS Pass-rate" value={scores.ats || 0} />
        <ScoreCell label="Keyword Density" value={scores.keyword || 0} />
        <ScoreCell label="Structural Health" value={scores.structure || 0} />
      </div>

      <div className="mt-10 border-b border-border">
        <div className="flex flex-wrap gap-6 text-sm">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`-mb-px border-b-2 pb-3 transition-colors ${
                tab === t ? "border-ink text-ink" : "border-transparent text-ink/40 hover:text-ink"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-10">
        {tab === "Overview" && (
          <div className="grid gap-6 lg:grid-cols-2">
            <section className="border border-border bg-paper p-6">
              <h2 className="font-serif text-2xl italic">Semantic strengths</h2>
              <p className="mt-1 text-xs text-ink/50">Mapped against target role descriptions</p>
              <div className="mt-4 h-72">
                {semantic.length > 0 ? (
                  <ResponsiveContainer>
                    <RadarChart data={semantic}>
                      <PolarGrid stroke="#E5E5E1" />
                      <PolarAngleAxis dataKey="axis" tick={{ fill: "rgba(0,0,0,.6)", fontSize: 11 }} />
                      <Radar dataKey="v" stroke="oklch(0.55 0.21 262)" fill="oklch(0.55 0.21 262)" fillOpacity={0.2} />
                    </RadarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-ink/40">
                    No semantic data available
                  </div>
                )}
              </div>
            </section>
            <section className="border border-border bg-paper p-6">
              <h2 className="font-serif text-2xl italic">ATS pass-rate by system</h2>
              <p className="mt-1 text-xs text-ink/50">Largest parser families</p>
              <div className="mt-4 h-72">
                {atsScores.length > 0 ? (
                  <ResponsiveContainer>
                    <BarChart data={atsScores}>
                      <XAxis dataKey="name" tick={{ fill: "rgba(0,0,0,.5)", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: "rgba(0,0,0,.4)", fontSize: 10 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                      <Tooltip cursor={{ fill: "rgba(0,0,0,.04)" }} contentStyle={{ border: "1px solid #E5E5E1", borderRadius: 0, fontSize: 12 }} />
                      <Bar dataKey="score">
                        {atsScores.map((d, i) => (
                          <Cell key={i} fill={d.score >= 80 ? "oklch(0.55 0.21 262)" : d.score >= 70 ? "#0F0F0F" : "#B45309"} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-ink/40">
                    No ATS data available
                  </div>
                )}
              </div>
            </section>
          </div>
        )}

        {tab === "ATS Compatibility" && (
          <div className="border border-border bg-paper">
            {atsScores.length === 0 ? (
              <div className="p-12 text-center text-sm text-ink/60">
                No ATS compatibility data available
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left font-mono text-[10px] uppercase tracking-widest text-ink/40">
                    <th className="p-4">System</th>
                    <th>Parser</th>
                    <th>Pass-rate</th>
                    <th>Issues</th>
                  </tr>
                </thead>
                <tbody>
                  {atsScores.map((r, i) => (
                    <tr key={i} className="border-b border-border last:border-0">
                      <td className="p-4 font-medium">{r.name}</td>
                      <td className="font-mono text-xs text-ink/60">{r.parser || 'Standard'}</td>
                      <td className="font-mono">{r.score}%</td>
                      <td>
                        <div className="flex flex-wrap gap-2">
                          {r.issues && r.issues.length > 0 ? r.issues.map((x) => (
                            <span key={x} className="border border-border bg-paper-2 px-2 py-0.5 font-mono text-[10px]">
                              {x}
                            </span>
                          )) : <span className="text-xs text-emerald-600">No issues</span>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {tab === "Keywords" && (
          <div className="grid gap-6 md:grid-cols-2">
            <KeywordBlock title="Aligned with target" tone="ok" items={keywords.aligned || []} />
            <KeywordBlock title="Missing or underweighted" tone="warn" items={keywords.missing || []} />
          </div>
        )}

        {tab === "Structure" && (
          <div className="border border-border bg-paper p-6">
            <h2 className="font-serif text-2xl italic">Document structure</h2>
            {structure.length === 0 ? (
              <p className="mt-6 text-sm text-ink/60">No structure data available</p>
            ) : (
              <div className="mt-6 grid grid-cols-[160px_1fr] gap-y-3 font-mono text-xs">
                {structure.map((item) => (
                  <Fragment key={item.section}>
                    <div className="text-ink/40 uppercase tracking-widest">{item.section}</div>
                    <div>{item.status}</div>
                  </Fragment>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "Patches" && (
          <div className="space-y-3">
            {patches.length === 0 ? (
              <div className="border border-border bg-paper p-12 text-center text-sm text-ink/60">
                No patches suggested. Great job!
              </div>
            ) : (
              patches.map((p, i) => (
                <details key={i} className="group border border-border bg-paper">
                  <summary className="flex cursor-pointer items-center gap-4 p-4">
                    <span className={`grid size-8 place-items-center ${p.severity === "high" ? "bg-accent text-paper" : p.severity === "medium" ? "bg-ink text-paper" : "bg-paper-2"}`}>
                      {p.severity === "high" ? <AlertTriangle className="size-4" /> : <Check className="size-4" />}
                    </span>
                    <div className="flex-1">
                      <div className="font-medium">{p.title}</div>
                      <div className="text-xs text-ink/50">{p.description}</div>
                    </div>
                    <span className="font-mono text-xs text-accent">{p.impact}</span>
                  </summary>
                  <div className="border-t border-border bg-paper-2 p-4 font-mono text-xs text-ink/70">
                    Suggested diff preview · apply automatically or export as instructions.
                  </div>
                </details>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function ScoreCell({ label, value }) {
  const { count } = useCountUp(value, 0, 800)
  return (
    <div className="bg-paper p-6 transition-all duration-200 hover:bg-paper-2">
      <div className="font-mono text-[10px] uppercase tracking-widest text-ink/40">{label}</div>
      <div className="mt-3 font-serif text-5xl">{Math.round(count)}</div>
      <div className="mt-3 h-1 bg-paper-2">
        <div className="h-full bg-accent transition-all duration-1000" style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}

function KeywordBlock({ title, tone, items }) {
  return (
    <section className="border border-border bg-paper p-6">
      <h3 className="font-serif text-2xl italic">{title}</h3>
      {items.length === 0 ? (
        <p className="mt-4 text-sm text-ink/60">No keywords in this category</p>
      ) : (
        <div className="mt-4 flex flex-wrap gap-2">
          {items.map((k) => (
            <span
              key={k}
              className={`inline-flex items-center gap-1 border px-2.5 py-1 font-mono text-xs ${
                tone === "ok" ? "border-accent/30 bg-accent/5 text-accent" : "border-amber-500/30 bg-amber-50 text-amber-800"
              }`}
            >
              {tone === "ok" ? <Check className="size-3" /> : <X className="size-3" />} {k}
            </span>
          ))}
        </div>
      )}
    </section>
  );
}
