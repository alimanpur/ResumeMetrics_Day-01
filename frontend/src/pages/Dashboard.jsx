import { Link } from 'react-router'
import { ArrowUpRight, TrendingUp, FileText, Sparkles, Loader2, Activity, Zap, Target, BarChart3, GitCompare, AlertTriangle } from 'lucide-react'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, BarChart, Bar, Cell, RadarChart, PolarAngleAxis, PolarGrid, Radar } from 'recharts'
import { useQuery } from '@tanstack/react-query'
import { getResumes } from '../api/resume'
import { getAnalyses } from '../api/analysis'
import { getBillingInfo } from '../api/billing'
import { getProfile } from '../api/auth'
import { CardSkeleton, ChartSkeleton } from '../components/ui/loading'
import { ErrorState } from '../components/ui/error-state'
import { useCountUp } from '../hooks/useAnimation'

export default function Dashboard() {
  const { data: profileData } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
  })

  const { data: resumesData, isLoading: resumesLoading, error: resumesError } = useQuery({
    queryKey: ['dashboard', 'resumes'],
    queryFn: () => getResumes({ limit: 10, sortBy: 'createdAt', sortOrder: 'desc' }),
  })

  const { data: analysesData, isLoading: analysesLoading, error: analysesError } = useQuery({
    queryKey: ['dashboard', 'analyses'],
    queryFn: () => getAnalyses({ limit: 10 }),
  })

  const { data: billingData } = useQuery({
    queryKey: ['billing'],
    queryFn: getBillingInfo,
  })

  const isLoading = resumesLoading || analysesLoading
  const error = resumesError || analysesError

  if (isLoading) {
    return (
      <div className="px-8 py-10">
        <div className="mb-10">
          <div className="h-10 w-64 animate-pulse bg-ink/10" />
          <div className="mt-2 h-4 w-96 animate-pulse bg-ink/10" />
        </div>
        <div className="mb-10 grid gap-px border border-border bg-border md:grid-cols-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_360px]">
          <ChartSkeleton />
          <CardSkeleton />
        </div>
      </div>
    )
  }

  const resErr = resumesError?.response?.data?.message || resumesError?.message
  const anErr = analysesError?.response?.data?.message || analysesError?.message

  if (error) {
    return (
      <div className="px-8 py-10">
        <ErrorState
          title="Failed to load dashboard"
          message={
            resErr && anErr
              ? `Resumes: ${resErr}. Analyses: ${anErr}.`
              : resErr
              ? `Resumes: ${resErr}`
              : anErr
              ? `Analyses: ${anErr}`
              : "We couldn't load your dashboard data. Please try again."
          }
          onRetry={() => window.location.reload()}
        />
      </div>
    )
  }

  const resumes = resumesData?.data?.data || resumesData?.data || []
  const analyses = analysesData?.data?.data || analysesData?.data || []
  
  const totalResumes = resumesData?.data?.meta?.total || resumes.length
  // Dashboard metrics (Phase 19)
  const latestAnalysis = analyses.length > 0 ? analyses[0] : null
  const latestScore = latestAnalysis?.atsScore ?? latestAnalysis?.overallScore ?? (resumes.length > 0 ? resumes[0]?.latestScore : 0)
  const avgScore = resumes.length > 0
    ? Math.round(resumes.reduce((sum, r) => sum + (r.latestScore || 0), 0) / resumes.length)
    : 0

  const bestScore = latestAnalysis?.hasComprehensiveReport ? Math.round(latestAnalysis.overallScore || latestAnalysis.atsScore || 0) : latestScore
  const hasIntelligence = latestAnalysis?.hasComprehensiveReport || false
  const credibilityLevel = latestAnalysis?.credibilityAnalysis?.overallCredibility || 'unknown'
  const resumeHealthScore = latestAnalysis?.resumeIdentity?.resumeHealth?.score || bestScore
  const analysisVersion = latestAnalysis?.analysisVersion || '1.0'

  const weeklyData = resumes.slice(0, 7).reverse().map((r, i) => ({
    day: r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-US', { weekday: 'short' }) : `Day ${i + 1}`,
    score: r.latestScore || 0,
  }))

  const userName = profileData?.data?.data?.name ? profileData.data.data.name.split(' ')[0] : 'User'
  const plan = (() => {
    try {
      return billingData?.data?.data?.subscription?.tier || 'Free'
    } catch {
      return 'Free'
    }
  })()

  const aiSuggestions = []
  if (avgScore < 60) {
    aiSuggestions.push({
      icon: AlertTriangle,
      title: 'Critical: Low ATS Score',
      description: 'Your score is below 60. Add relevant keywords and improve formatting.',
      priority: 'high'
    })
  }
  if (resumes.length === 0) {
    aiSuggestions.push({
      icon: Target,
      title: 'Upload Your First Resume',
      description: 'Start your journey by uploading a resume to get intelligence insights.',
      priority: 'high'
    })
  }
  if (avgScore >= 80) {
    aiSuggestions.push({
      icon: Sparkles,
      title: 'Excellent Performance',
      description: hasIntelligence ? 'Phase 19 intelligence report generated successfully.' : 'Your resume is well-optimized. Consider comparing versions.',
      priority: 'low'
    })
  }
  if (hasIntelligence) {
    aiSuggestions.push({
      icon: TrendingUp,
      title: 'Intelligence Report Ready',
      description: `Phase 19 analysis complete. Credibility: ${credibilityLevel}. Resume Health: ${resumeHealthScore}/100.`,
      priority: 'medium'
    })
  }

  return (
    <div className="px-8 py-10">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
        <div>
          <span className="font-mono text-[11px] uppercase tracking-widest text-ink/40">
            Session · {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </span>
          <h1 className="mt-2 font-serif text-4xl italic">Good morning, {userName}.</h1>
          <p className="mt-2 text-sm text-ink/60">
            {analyses.length > 0 
              ? `You have ${analyses.length} recent analysis${analyses.length > 1 ? 'es' : ''}. Keep improving!`
              : 'Ready to start your first diagnostic?'}
          </p>
        </div>
        <Link
          to="/upload"
          className="inline-flex items-center gap-2 bg-ink px-5 py-3 text-sm font-medium text-paper hover:bg-ink/90"
        >
          New diagnostic <ArrowUpRight className="size-4" />
        </Link>
      </div>

      {/* Stats Grid Phase 19 */}
      <div className="grid gap-px border border-border bg-border md:grid-cols-4">
        <Stat label="Latest ATS score" value={Number.isFinite(latestScore) ? latestScore.toString() : '0'} suffix="/100" trend={hasIntelligence ? 'Phase 19 Intelligence' : 'Standard'} />
        <Stat label="Resume Health" value={Number.isFinite(resumeHealthScore) ? resumeHealthScore.toString() : '0'} suffix="/100" trend={resumeHealthScore >= 80 ? 'Healthy' : resumeHealthScore >= 60 ? 'Needs Attention' : 'Critical'} />
        <Stat label="Diagnostics run" value={totalResumes.toString()} trend={`${analysisVersion} · Latest`} />
        <Stat label="Plan" value={plan} trend="Currently Free Beta · Premium Coming Soon" mono />
      </div>

      {/* Main Content Grid */}
      <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Score Trajectory Chart */}
        <section className="border border-border bg-paper p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="font-serif text-2xl italic">Score trajectory</h2>
              <p className="mt-1 text-xs text-ink/50">Your diagnostic history over time</p>
            </div>
            {weeklyData.length > 1 && (
              <span className="inline-flex items-center gap-1 font-mono text-xs text-emerald-600">
                <TrendingUp className="size-3" /> Improving
              </span>
            )}
          </div>
          <div className="h-72">
            {weeklyData.length > 1 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyData}>
                  <defs>
                    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.55 0.21 262)" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="oklch(0.55 0.21 262)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="d" tick={{ fill: "rgba(0,0,0,.4)", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "rgba(0,0,0,.4)", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{ background: "white", border: "1px solid #E5E5E1", borderRadius: 0, fontSize: 12 }}
                    labelStyle={{ fontFamily: "JetBrains Mono", fontSize: 10, textTransform: "uppercase" }}
                  />
                  <Area type="monotone" dataKey="score" stroke="oklch(0.55 0.21 262)" strokeWidth={2} fill="url(#g)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-ink/40">
                Upload more resumes to see your score trajectory
              </div>
            )}
          </div>
        </section>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* AI Suggestions */}
          <section className="border border-border bg-paper p-6">
            <div className="mb-4 flex items-center gap-2">
              <Sparkles className="size-4 text-accent" />
              <h2 className="font-serif text-xl italic">AI Suggestions</h2>
            </div>
            {aiSuggestions.length > 0 ? (
              <div className="space-y-3">
                {aiSuggestions.slice(0, 3).map((suggestion, i) => (
                  <div key={i} className="border-l-2 border-accent bg-accent/5 p-3">
                    <div className="flex items-start gap-2">
                      <suggestion.icon className="mt-0.5 size-3.5 shrink-0 text-accent" />
                      <div>
                        <div className="text-sm font-medium">{suggestion.title}</div>
                        <div className="mt-1 text-xs text-ink/60">{suggestion.description}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-ink/60">Upload a resume to get personalized suggestions.</p>
            )}
          </section>

          {/* Quick Actions */}
          <section className="border border-border bg-paper p-6">
            <h2 className="mb-4 font-serif text-xl italic">Quick Actions</h2>
            <div className="space-y-2">
              <Link to="/upload" className="flex items-center gap-3 border border-border bg-paper-2 p-3 hover:border-ink/20">
                <div className="flex size-8 items-center justify-center border border-border bg-paper">
                  <FileText className="size-4 text-ink/60" />
                </div>
                <div>
                  <div className="text-sm font-medium">Upload Resume</div>
                  <div className="text-xs text-ink/50">Start new analysis</div>
                </div>
              </Link>
              <Link to="/compare" className="flex items-center gap-3 border border-border bg-paper-2 p-3 hover:border-ink/20">
                <div className="flex size-8 items-center justify-center border border-border bg-paper">
                  <GitCompare className="size-4 text-ink/60" />
                </div>
                <div>
                  <div className="text-sm font-medium">Compare Versions</div>
                  <div className="text-xs text-ink/50">Side-by-side analysis</div>
                </div>
              </Link>
              <Link to="/job-match" className="flex items-center gap-3 border border-border bg-paper-2 p-3 hover:border-ink/20">
                <div className="flex size-8 items-center justify-center border border-border bg-paper">
                  <Target className="size-4 text-ink/60" />
                </div>
                <div>
                  <div className="text-sm font-medium">Job Match</div>
                  <div className="text-xs text-ink/50">Match against roles</div>
                </div>
              </Link>
            </div>
          </section>
        </div>
      </div>

      {/* Bottom Section */}
      {resumes.length > 0 && (
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {/* Latest Resume Upload */}
          <section className="border border-border bg-paper p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="font-serif text-2xl italic">Latest Upload</h2>
                <p className="mt-1 text-xs text-ink/50">Most recently added resume</p>
              </div>
              <Link to="/history" className="text-xs text-accent hover:underline">View all</Link>
            </div>
            <div className="space-y-3">
              {resumes.slice(0, 1).map((r) => (
                <Link
                  key={r.id}
                  to={r.analysisId ? `/analysis/${r.analysisId}` : `/history`}
                  className="flex items-center justify-between border border-border bg-paper-2 p-4 hover:border-ink/20"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="size-4 text-ink/40" />
                    <div>
                      <div className="text-sm font-medium">{r.fileName}</div>
                      <div className="text-xs text-ink/50">
                        {new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-sm">{r.latestScore || '—'}/100</div>
                    <div className={`text-xs ${r.latestScore >= 80 ? 'text-emerald-600' : r.latestScore >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
                      {r.latestScore >= 80 ? 'Strong' : r.latestScore >= 60 ? 'Good' : 'Needs work'}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Activity Timeline */}
          <section className="border border-border bg-paper p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="font-serif text-2xl italic">Activity Timeline</h2>
                <p className="mt-1 text-xs text-ink/50">Recent interventions</p>
              </div>
            </div>
            <div className="space-y-4">
              {resumes.slice(0, 4).map((r, i) => (
                <div key={r.id} className="flex items-start gap-3">
                  <div className="relative mt-1">
                    <div className="size-2 rounded-full bg-accent" />
                    {i < (resumes.length - 1) && <div className="absolute left-1/2 top-2 h-full w-px -translate-x-1/2 bg-border" />}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="text-sm">
                      <span className="font-medium">Uploaded</span> {r.fileName}
                    </div>
                    <div className="text-xs text-ink/50">
                      {new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                </div>
              ))}
              {resumes.length === 0 && (
                <p className="text-sm text-ink/60">No activity yet. Upload a resume to get started.</p>
              )}
            </div>
          </section>
        </div>
      )}

      {/* Upcoming Features & Recommendations */}
      {resumes.length > 0 && (
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {/* Top Recommendation */}
          <section className="border border-border bg-paper p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="font-serif text-2xl italic">Top Recommendation</h2>
                <p className="mt-1 text-xs text-ink/50">Highest priority action</p>
              </div>
            </div>
            {analyses.length > 0 && analyses[0].improvementSuggestions?.length > 0 ? (
              <div className="border-l-2 border-accent bg-accent/5 p-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-accent" />
                  <div>
                    <div className="text-sm font-medium">{analyses[0].improvementSuggestions[0].category || 'Optimize Resume'}</div>
                    <div className="mt-1 text-xs text-ink/60">{analyses[0].improvementSuggestions[0].suggestion || analyses[0].improvementSuggestions[0].issue || 'Focus on adding missing keywords and improving formatting.'}</div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-ink/60">Upload a resume to get personalized recommendations.</p>
            )}
          </section>

          {/* Upcoming Features */}
          <section className="border border-border bg-paper p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="font-serif text-2xl italic">Upcoming Features</h2>
                <p className="mt-1 text-xs text-ink/50">What's coming next</p>
              </div>
            </div>
            <div className="space-y-3">
              {[
                { title: 'AI Resume Rewriter', desc: 'Auto-rewrite sections with better ATS language',soon: 'Q3 2025' },
                { title: 'LinkedIn Integration', desc: 'Sync your profile directly', soon: 'Q3 2025' },
                { title: 'Cover Letter Analysis', desc: 'Evaluate your cover letters too', soon: 'Q4 2025' },
                { title: 'Interview Prep', desc: 'Generate interview questions from JD', soon: 'Q4 2025' },
              ].map((feature, i) => (
                <div key={i} className="flex items-center justify-between border border-border bg-paper-2 p-3">
                  <div>
                    <div className="text-sm font-medium">{feature.title}</div>
                    <div className="text-xs text-ink/50">{feature.desc}</div>
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-ink/40">{feature.soon}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* Weekly Progress */}
      {weeklyData.length > 0 && (
        <div className="mt-10 border border-border bg-paper p-6">
          <h2 className="mb-4 font-serif text-2xl italic">Weekly Progress</h2>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <XAxis dataKey="day" tick={{ fill: "rgba(0,0,0,.4)", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "rgba(0,0,0,.4)", fontSize: 10 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ background: "white", border: "1px solid #E5E5E1", borderRadius: 0, fontSize: 12 }}
                  labelStyle={{ fontFamily: "JetBrains Mono", fontSize: 10 }}
                />
                <Bar dataKey="score" radius={[2, 2, 0, 0]}>
                  {weeklyData.map((entry, index) => (
                    <Cell key={index} fill={entry.score >= 80 ? "oklch(0.55 0.21 262)" : entry.score >= 60 ? "#0F0F0F" : "#B45309"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, suffix, trend, mono }) {
  const safeValue = (() => {
    const n = parseFloat(value)
    return Number.isFinite(n) ? n : 0
  })()
  const { count } = useCountUp(safeValue, 0, 1200)
  
  return (
    <div className="bg-paper p-6 transition-all duration-200 hover:bg-paper-2 focus-visible-ring">
      <div className="font-mono text-[10px] uppercase tracking-widest text-ink/40">{label}</div>
      <div className="mt-3 flex items-baseline gap-1">
        <span className={mono ? "font-mono text-3xl" : "font-serif text-5xl"}>{Math.round(count)}</span>
        {suffix && <span className="text-ink/40">{suffix}</span>}
      </div>
      {trend && <div className="mt-2 font-mono text-[10px] uppercase tracking-widest text-emerald-600">{trend}</div>}
    </div>
  )
}