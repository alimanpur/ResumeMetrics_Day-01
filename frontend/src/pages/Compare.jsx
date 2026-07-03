import { useState, useRef } from 'react'
import { Link } from 'react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getResumes } from '../api/resume'
import { createComparison, getComparison } from '../api/comparison'
import { useCreateComparison } from '../hooks/useApi'
import { CardSkeleton, EmptyState } from '../components/ui/loading'
import { ErrorState } from '../components/ui/error-state'
import {
  Trophy, TrendingUp, FileText, Target, Sparkles,
  CheckCircle, XCircle, AlertTriangle, Loader2, ChevronDown,
  FileJson, FileType, Download
} from 'lucide-react'
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts'

export default function Compare() {
  const [selectedA, setSelectedA] = useState('')
  const [selectedB, setSelectedB] = useState('')
  const [comparisonId, setComparisonId] = useState(null)
  const [exportOpen, setExportOpen] = useState(false)
  const exportRef = useRef(null)
  const createComparisonMutation = useCreateComparison()
  const queryClient = useQueryClient()

  const { data: resumesData, isLoading: resumesLoading, error: resumesError, refetch: refetchResumes } = useQuery({
    queryKey: ['resumes'],
    queryFn: () => getResumes({ limit: 50 }),
  })

  const { data: comparisonData, isLoading: comparisonLoading, error: comparisonError } = useQuery({
    queryKey: ['comparison', comparisonId],
    queryFn: () => getComparison(comparisonId),
    enabled: !!comparisonId,
  })

  const resumes = resumesData?.data?.data || resumesData?.data || []
  const comparison = comparisonData?.data?.data || comparisonData?.data || {}

  const handleCompare = async () => {
    if (!selectedA || !selectedB) return
    try {
      const response = await createComparisonMutation.mutateAsync({
        resumeAId: selectedA,
        resumeBId: selectedB,
      })
      setComparisonId(response.data.data.id)
    } catch (error) {
      // Error is handled by the mutation's error state
    }
  }

  const handleReset = () => {
    setSelectedA('')
    setSelectedB('')
    setComparisonId(null)
    setExportOpen(false)
    queryClient.invalidateQueries({ queryKey: ['comparison'] })
  }

  if (resumesLoading) {
    return (
      <div className="px-8 py-10">
        <div className="mb-8">
          <div className="h-8 w-48 animate-pulse bg-ink/10" />
          <div className="mt-2 h-4 w-96 animate-pulse bg-ink/10" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    )
  }

  if (resumesError) {
    return (
      <div className="px-8 py-10">
        <ErrorState
          title="Failed to load resumes"
          message="We couldn't load your resumes for comparison. Please try again."
          onRetry={() => refetchResumes()}
        />
      </div>
    )
  }

  if (resumes.length < 2) {
    return (
      <div className="px-8 py-10">
        <EmptyState
          title="Not enough resumes"
          message="You need at least 2 resumes to compare. Upload more resumes to get started."
          action={() => window.location.href = '/upload'}
          actionLabel="Upload resume"
        />
      </div>
    )
  }

// Show comparison results
  if (comparisonId && comparison) {
    const resumeA = resumes.find(r => r.id === selectedA)
    const resumeB = resumes.find(r => r.id === selectedB)

    const scoreA = resumeA?.latestScore || comparison.atsScoreA || 0
    const scoreB = resumeB?.latestScore || comparison.atsScoreB || 0
    const winner = scoreA > scoreB ? 'A' : scoreB > scoreA ? 'B' : 'Tie'
    const improvement = Math.abs(scoreB - scoreA)
    const improvementPercent = scoreA > 0 ? Math.round((improvement / scoreA) * 100) : 0

    const comparisonMetrics = [
      { label: 'ATS Score', a: scoreA, b: scoreB, category: 'ATS' },
      { label: 'Keywords', a: comparison.keywordScoreA || 75, b: comparison.keywordScoreB || 75, category: 'Keywords' },
      { label: 'Formatting', a: comparison.formattingScoreA || 80, b: comparison.formattingScoreB || 80, category: 'Formatting' },
      { label: 'Grammar', a: comparison.grammarScoreA || 85, b: comparison.grammarScoreB || 85, category: 'Grammar' },
      { label: 'Experience', a: comparison.experienceScoreA || 70, b: comparison.experienceScoreB || 70, category: 'Experience' },
      { label: 'Education', a: comparison.educationScoreA || 75, b: comparison.educationScoreB || 75, category: 'Education' },
      { label: 'Skills', a: comparison.skillsScoreA || 72, b: comparison.skillsScoreB || 72, category: 'Skills' },
    ]

    const atsMetrics = comparisonMetrics.filter(m => ['ATS', 'Formatting', 'Grammar'].includes(m.category))
    const skillMetrics = comparisonMetrics.filter(m => ['Keywords', 'Skills'].includes(m.category))
    const expEduMetrics = comparisonMetrics.filter(m => ['Experience', 'Education'].includes(m.category))

    const radarData = comparisonMetrics.map(m => ({
      metric: m.label,
      A: m.a,
      B: m.b,
    }))

    const alignedKeywordsA = ['javascript', 'react', 'node.js', 'typescript']
    const alignedKeywordsB = ['javascript', 'react', 'node.js', 'typescript', 'graphql']
    const missingKeywordsA = ['docker', 'aws', 'kubernetes', 'ci/cd']
    const missingKeywordsB = ['docker', 'aws']
    const allMissing = [...new Set([...missingKeywordsA, ...missingKeywordsB])]
    const overlapKeywords = alignedKeywordsA.filter(k => alignedKeywordsB.includes(k))

    function exportComparison(format) {
      const data = {
        resumeA: { name: resumeA?.fileName, score: scoreA },
        resumeB: { name: resumeB?.fileName, score: scoreB },
        winner,
        improvement,
        improvementPercent,
        metrics: comparisonMetrics,
        keywordOverlap: overlapKeywords,
        missingKeywordsA,
        missingKeywordsB,
        allMissingKeywords: allMissing,
        recommendations: comparison.recommendations || [],
        exportedAt: new Date().toISOString(),
      }

      if (format === 'json') {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
        downloadBlob(blob, `comparison-${selectedA.slice(0,4)}-vs-${selectedB.slice(0,4)}.json`)
      } else if (format === 'markdown') {
        const md = `# Resume Comparison Report

## Overview
- **Version A:** ${resumeA?.fileName} — ${scoreA}/100
- **Version B:** ${resumeB?.fileName} — ${scoreB}/100
- **Winner:** Version ${winner} (+${improvement} pts, +${improvementPercent}%)
- **Date:** ${new Date().toLocaleDateString()}

## Detailed Comparison

| Category | Version A | Version B | Difference |
|----------|-----------|-----------|------------|
${comparisonMetrics.map(m => `| ${m.label} | ${m.a}% | ${m.b}% | ${m.b > m.a ? '+' : ''}${m.b - m.a}% |`).join('\n')}

## Keyword Overlap
${overlapKeywords.map(k => `- ${k}`).join('\n') || '- None'}

## Missing Keywords (Version A)
${missingKeywordsA.map(k => `- ${k}`).join('\n') || '- None'}

## Missing Keywords (Version B)
${missingKeywordsB.map(k => `- ${k}`).join('\n') || '- None'}

## Recommendations
${(comparison.recommendations || []).map((r, i) => `${i + 1}. ${r}`).join('\n') || '- None'}

---
*Generated by ResuMetrics*
`
        const blob = new Blob([md], { type: 'text/markdown' })
        downloadBlob(blob, `comparison-${selectedA.slice(0,4)}-vs-${selectedB.slice(0,4)}.md`)
      } else if (format === 'pdf') {
        const metricsTable = comparisonMetrics.map(m => `<tr><td>${m.label}</td><td>${m.a}%</td><td>${m.b}%</td><td>${m.b > m.a ? '+' : ''}${m.b - m.a}%</td></tr>`).join('')
        const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Comparison Report</title>
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: Georgia, serif; color: #1a1a1a; padding: 48px; max-width: 800px; margin: 0 auto; }
h1 { font-size: 28px; font-style: italic; margin-bottom: 8px; }
h2 { font-size: 18px; font-style: italic; margin: 24px 0 12px; }
.meta { color: #666; font-size: 13px; margin-bottom: 24px; }
.scores { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 16px 0; }
.score-card { border: 1px solid #e5e5e1; padding: 24px; text-align: center; }
.score-value { font-size: 48px; font-style: italic; }
.score-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.15em; color: #999; margin-top: 4px; }
table { width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 13px; }
th, td { padding: 8px 12px; text-align: left; border-bottom: 1px solid #e5e5e1; }
th { font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #999; }
.kw { display: inline-block; padding: 2px 8px; font-size: 12px; margin: 2px; border-radius: 2px; }
.kw.ok { background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0; }
.kw.warn { background: #fffbeb; color: #92400e; border: 1px solid #fde68a; }
ul { margin: 8px 0 8px 20px; font-size: 13px; line-height: 1.8; }
.footer { margin-top: 48px; padding-top: 16px; border-top: 1px solid #e5e5e1; font-size: 11px; color: #999; }
@media print { body { padding: 0; } }
</style></head><body>
<h1>Resume Comparison Report</h1>
<div class="meta">
  <strong>Version A:</strong> ${resumeA?.fileName}<br/>
  <strong>Version B:</strong> ${resumeB?.fileName}<br/>
  <strong>Winner:</strong> Version ${winner} (+${improvement} pts)<br/>
  <strong>Improvement:</strong> +${improvementPercent}%
</div>
<div class="scores">
  <div class="score-card"><div class="score-value">${scoreA}</div><div class="score-label">Version A</div></div>
  <div class="score-card"><div class="score-value">${scoreB}</div><div class="score-label">Version B</div></div>
</div>
<h2>Detailed Comparison</h2>
<table><thead><tr><th>Category</th><th>A</th><th>B</th><th>Diff</th></tr></thead>
<tbody>${metricsTable}</tbody></table>
<h2>Keyword Overlap</h2>
<div>${overlapKeywords.map(k => `<span class="kw ok">${k}</span>`).join(' ') || 'None'}</div>
<h2>Missing Keywords</h2>
<div><strong>A:</strong> ${missingKeywordsA.map(k => `<span class="kw warn">${k}</span>`).join(' ')}</div>
<div style="margin-top: 8px;"><strong>B:</strong> ${missingKeywordsB.map(k => `<span class="kw warn">${k}</span>`).join(' ')}</div>
<h2>Recommendations</h2>
<ul>${(comparison.recommendations || []).map(r => `<li>${r}</li>`).join('')}</ul>
<div class="footer">Generated by ResuMetrics on ${new Date().toLocaleDateString()}</div>
</body></html>`
        const w = window.open('', '_blank', 'width=900,height=700')
        w.document.write(html)
        w.document.close()
        setTimeout(() => w.print(), 300)
      }
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
        <div className="mb-8 flex items-center justify-between">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-widest text-ink/40">Comparison Results</span>
            <h1 className="mt-2 font-serif text-4xl italic">Head-to-head analysis</h1>
          </div>
          <div className="flex gap-2">
            <div className="relative" ref={exportRef}>
              <button
                onClick={() => setExportOpen(!exportOpen)}
                className="inline-flex items-center gap-2 border border-border bg-paper px-3 py-2 text-sm hover:bg-paper-2"
              >
                <Download className="size-4" /> Export <ChevronDown className="size-3" />
              </button>
              {exportOpen && (
                <div className="absolute right-0 top-full z-50 mt-1 w-44 rounded border border-border bg-paper py-1 shadow-lg">
                  <button onClick={() => exportComparison('pdf')} className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm hover:bg-paper-2"><FileText className="size-4" /> PDF Report</button>
                  <button onClick={() => exportComparison('json')} className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm hover:bg-paper-2"><FileJson className="size-4" /> JSON Data</button>
                  <button onClick={() => exportComparison('markdown')} className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm hover:bg-paper-2"><FileType className="size-4" /> Markdown</button>
                </div>
              )}
            </div>
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 border border-border bg-paper px-4 py-2 text-sm hover:bg-paper-2"
            >
              New Comparison
            </button>
          </div>
        </div>

        {comparisonLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="size-8 animate-spin text-ink/40" />
          </div>
        ) : comparisonError ? (
          <ErrorState
            title="Failed to load comparison"
            message="We couldn't load the comparison results. Please try again."
            onRetry={() => queryClient.invalidateQueries({ queryKey: ['comparison', comparisonId] })}
          />
        ) : (
          <>
            {/* Winner Banner */}
            <div className="mb-8 rounded-lg border-2 border-accent bg-accent/5 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Trophy className="size-8 text-accent" />
                  <div>
                    <div className="font-mono text-xs uppercase tracking-widest text-ink/40">Winner</div>
                    <div className="mt-1 font-serif text-3xl italic">
                      Version {winner} {winner !== 'Tie' && <span className="text-accent">+{improvement} pts</span>}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-xs uppercase tracking-widest text-ink/40">Improvement</div>
                  <div className="mt-1 flex items-center gap-2 font-serif text-2xl text-emerald-600">
                    <TrendingUp className="size-5" />
                    +{improvementPercent}%
                  </div>
                </div>
              </div>
            </div>

            {/* Score Comparison */}
            <div className="mb-8 grid gap-px border border-border bg-border md:grid-cols-2">
              <ScoreCard label="Version A" name={resumeA?.fileName || 'Resume A'} score={scoreA} color="oklch(0.55 0.21 262)" />
              <ScoreCard label="Version B" name={resumeB?.fileName || 'Resume B'} score={scoreB} color="#B45309" />
            </div>

            {/* Radar Chart */}
            <div className="mb-8 border border-border bg-paper p-6">
              <h2 className="mb-4 font-serif text-2xl italic">Performance Radar</h2>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#E5E5E1" />
                    <PolarAngleAxis dataKey="metric" tick={{ fill: "rgba(0,0,0,.6)", fontSize: 12 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "rgba(0,0,0,.4)", fontSize: 10 }} />
                    <Radar name="Version A" dataKey="A" stroke="oklch(0.55 0.21 262)" fill="oklch(0.55 0.21 262)" fillOpacity={0.3} />
                    <Radar name="Version B" dataKey="B" stroke="#B45309" fill="#B45309" fillOpacity={0.3} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Detailed Metrics - ATS Comparison */}
            <div className="mb-8 border border-border bg-paper">
              <div className="border-b border-border p-6">
                <h2 className="font-serif text-2xl italic">ATS Comparison</h2>
                <p className="mt-1 text-xs text-ink/50">How each version performs against ATS systems</p>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left font-mono text-[10px] uppercase tracking-widest text-ink/40">
                    <th className="p-4">Category</th>
                    <th className="text-right">Version A</th>
                    <th className="text-right">Version B</th>
                    <th className="text-right">Difference</th>
                  </tr>
                </thead>
                <tbody>
                  {atsMetrics.map((metric) => {
                    const diff = metric.b - metric.a
                    return (
                      <tr key={metric.label} className="border-b border-border last:border-0">
                        <td className="p-4 font-medium">{metric.label}</td>
                        <td className="p-4 text-right font-mono">{metric.a}%</td>
                        <td className="p-4 text-right font-mono">{metric.b}%</td>
                        <td className={`p-4 text-right font-mono ${diff > 0 ? 'text-emerald-600' : diff < 0 ? 'text-red-600' : 'text-ink/60'}`}>
                          {diff > 0 ? '+' : ''}{diff}%
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Skill Comparison */}
            <div className="mb-8 grid gap-6 md:grid-cols-2">
              <div className="border border-border bg-paper p-6">
                <h3 className="font-serif text-xl italic mb-4">Keyword Overlap</h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs font-mono uppercase tracking-widest text-ink/40 mb-2">Shared Keywords</div>
                    <div className="flex flex-wrap gap-2">
                      {overlapKeywords.length > 0 ? overlapKeywords.map(k => (
                        <span key={k} className="border border-accent/30 bg-accent/5 px-2 py-0.5 font-mono text-xs text-accent">{k}</span>
                      )) : <span className="text-xs text-ink/40">No overlap found</span>}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-mono uppercase tracking-widest text-ink/40 mb-2">Missing in Both</div>
                    <div className="flex flex-wrap gap-2">
                      {allMissing.map(k => (
                        <span key={k} className="border border-amber-500/30 bg-amber-50 px-2 py-0.5 font-mono text-xs text-amber-800">{k}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-border bg-paper p-6">
                <h3 className="font-serif text-xl italic mb-4">Experience & Education</h3>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left font-mono text-[10px] uppercase tracking-widest text-ink/40">
                      <th className="p-2">Area</th>
                      <th className="text-right">Version A</th>
                      <th className="text-right">Version B</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expEduMetrics.map((metric) => (
                      <tr key={metric.label} className="border-b border-border last:border-0">
                        <td className="p-2 text-sm">{metric.label}</td>
                        <td className="p-2 text-right font-mono">{metric.a}%</td>
                        <td className="p-2 text-right font-mono">{metric.b}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Full Metrics Table */}
            <div className="mb-8 border border-border bg-paper">
              <div className="border-b border-border p-6">
                <h2 className="font-serif text-2xl italic">Full Metrics Comparison</h2>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left font-mono text-[10px] uppercase tracking-widest text-ink/40">
                    <th className="p-4">Category</th>
                    <th className="text-right">Version A</th>
                    <th className="text-right">Version B</th>
                    <th className="text-right">Difference</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonMetrics.map((metric) => {
                    const diff = metric.b - metric.a
                    return (
                      <tr key={metric.label} className="border-b border-border last:border-0">
                        <td className="p-4 font-medium">{metric.label}</td>
                        <td className="p-4 text-right font-mono">{metric.a}%</td>
                        <td className="p-4 text-right font-mono">{metric.b}%</td>
                        <td className={`p-4 text-right font-mono ${diff > 0 ? 'text-emerald-600' : diff < 0 ? 'text-red-600' : 'text-ink/60'}`}>
                          {diff > 0 ? '+' : ''}{diff}%
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Recommendations */}
            {comparison.recommendations && comparison.recommendations.length > 0 && (
              <div className="border border-border bg-paper p-6">
                <div className="mb-4 flex items-center gap-2">
                  <Sparkles className="size-5 text-accent" />
                  <h2 className="font-serif text-2xl italic">Recommendation Summary</h2>
                </div>
                <div className="space-y-3">
                  {comparison.recommendations.map((rec, i) => (
                    <div key={i} className="flex gap-3 border-l-2 border-accent bg-accent/5 p-4">
                      <CheckCircle className="mt-0.5 size-4 shrink-0 text-accent" />
                      <p className="text-sm text-ink/70">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    )
  }

  // Show selection UI
  const resumeA = resumes.find(r => r.id === selectedA)
  const resumeB = resumes.find(r => r.id === selectedB)

  return (
    <div className="px-8 py-10">
      <div className="mb-8">
        <span className="font-mono text-[11px] uppercase tracking-widest text-ink/40">Side by side</span>
        <h1 className="mt-2 font-serif text-4xl italic">Compare versions.</h1>
        <p className="mt-2 text-sm text-ink/60">Select two resumes to compare their scores and improvements.</p>
      </div>

      <div className="mb-8 grid gap-6 md:grid-cols-2">
        <ResumeSelectCard
          label="Version A"
          selected={selectedA}
          onChange={setSelectedA}
          resumes={resumes}
          selectedResume={resumeA}
        />
        <ResumeSelectCard
          label="Version B"
          selected={selectedB}
          onChange={setSelectedB}
          resumes={resumes}
          selectedResume={resumeB}
        />
      </div>

      {selectedA && selectedB && resumeA && resumeB && (
        <div className="flex justify-center">
          <button
            onClick={handleCompare}
            disabled={createComparisonMutation.isPending || selectedA === selectedB}
            className="inline-flex items-center gap-2 bg-ink px-6 py-3 text-sm font-medium text-paper hover:bg-ink/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {createComparisonMutation.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Comparing...
              </>
            ) : (
              <>
                <Target className="size-4" />
                Compare these versions
              </>
            )}
          </button>
        </div>
      )}
    </div>
  )
}

function ScoreCard({ label, name, score, color }) {
  return (
    <div className="bg-paper p-6">
      <div className="font-mono text-xs uppercase tracking-widest text-ink/40">{label}</div>
      <div className="mt-2 font-serif text-xl italic truncate">{name}</div>
      <div className="mt-4 font-serif text-6xl" style={{ color }}>{score}</div>
      <div className="mt-2 text-sm text-ink/60">ATS Score</div>
    </div>
  )
}

function ResumeSelectCard({ label, selected, onChange, resumes, selectedResume }) {
  return (
    <div className="border border-border bg-paper p-6">
      <label className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-ink/40">{label}</label>
      <select
        value={selected}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded border border-border bg-paper px-3 py-2 text-sm"
      >
        <option value="">Select a resume...</option>
        {resumes.map((r) => (
          <option key={r.id} value={r.id}>
            {r.fileName} - {r.latestScore || 'No score'}
          </option>
        ))}
      </select>
      {selectedResume && (
        <div className="mt-4 rounded border border-border bg-paper-2 p-4">
          <div className="font-mono text-xs text-ink/60">Selected Resume</div>
          <div className="mt-1 font-medium">{selectedResume.fileName}</div>
          <div className="mt-1 font-mono text-2xl">{selectedResume.latestScore || '—'}/100</div>
        </div>
      )}
    </div>
  )
}
