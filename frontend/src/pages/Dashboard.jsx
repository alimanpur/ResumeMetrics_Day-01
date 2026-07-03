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

  if (error) {
    return (
      <div className="px-8 py-10">
        <ErrorState
          title="Failed to load dashboard"
          message="We couldn't load your dashboard data. Please try again."
          onRetry={() => window.location.reload()}
        />
      </div>
    )
  }

  const resumes = resumesData?.data?.data || resumesData?.data || []
  const analyses = analysesData?.data?.data || analysesData?.data || []
  
  const totalResumes = resumesData?.data?.meta?.total || resumes.length
  const avgScore = resumes.length > 0 
    ? Math.round(resumes.reduce((sum, r) => sum + (r.latestScore || 0), 0) / resumes.length)
    : 0
  const recentAnalyses = analyses.length

  const trendData = resumes.slice(0, 7).reverse().map((r, i) => ({
    d: r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : `Item ${i}`,
    score: r.latestScore || 0,
  }))

  const userName = profileData?.data?.data?.name?.split(' ')[0] || 'User'
  const plan = billingData?.data?.data?.subscription?.tier || 'Free'

  // Calculate weekly progress
  const weeklyData = resumes.slice(0, 7).reverse().map((r, i) => ({
    day: r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-US', { weekday: 'short' }) : `Day ${i + 1}`,
    score: r.latestScore || 0,
  }))

  // AI Suggestions based on data
  const aiSuggestions = []
  if (avgScore < 60) {
    aiSuggestions.push({
      icon: AlertTriangle,
      title: 'Critical: Low ATS Score',
      description: 'Your average score is below 60. Focus on adding relevant keywords and improving formatting.',
      priority: 'high'
    })
  }
  if (resumes.length === 0) {
    aiSuggestions.push({
      icon: Target,
      title: 'Upload Your First Resume',
      description: 'Start your journey by uploading a resume to get personalized insights.',
      priority: 'high'
    })
  }
  if (avgScore >= 80) {
    aiSuggestions.push({
      icon: Sparkles,
      title: 'Excellent Performance',
      description: 'Your resume is well-optimized. Consider comparing versions to track improvements.',
      priority: 'low'
    })
  }
  if (recentAnalyses > 0) {
    aiSuggestions.push({
      icon: TrendingUp,
      title: 'Track Your Progress',
      description: `You've run ${recentAnalyses} analysis${recentAnalyses > 1 ? 'es' : ''}. Keep iterating to improve your score.`,
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
            {recentAnalyses > 0 
              ? `You have ${recentAnalyses} recent analysis${recentAnalyses > 1 ? 'es' : ''}. Keep improving!`
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

      {/* Stats Grid */}
      <div className="grid gap-px border border-border bg-border md:grid-cols-4">
        <Stat label="Current score" value={avgScore.toString()} suffix="/100" trend={avgScore > 0 ? `${Math.min(avgScore, 10)} avg` : 'No data'} />
        <Stat label="Diagnostics run" value={totalResumes.toString()} trend={totalResumes > 0 ? `${recentAnalyses} recent` : 'Start now'} />
        <Stat label="Resumes" value={totalResumes.toString()} trend={totalResumes > 0 ? 'In archive' : 'Upload one'} />
        <Stat label="Plan" value={plan} trend="Upgrade available" mono />
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
            {trendData.length > 1 && (
              <span className="inline-flex items-center gap-1 font-mono text-xs text-emerald-600">
                <TrendingUp className="size-3" /> Improving
              </span>
            )}
          </div>
          <div className="h-72">
            {trendData.length > 1 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
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
          {/* Recent Activity / Latest Reports */}
          <section className="border border-border bg-paper p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="font-serif text-2xl italic">Latest Reports</h2>
                <p className="mt-1 text-xs text-ink/50">Your most recent diagnostics</p>
              </div>
              <Link to="/history" className="text-xs text-accent hover:underline">View all</Link>
            </div>
            <div className="space-y-3">
              {resumes.slice(0, 4).map((r) => (
                <Link
                  key={r.id}
                  to={r.analysisId ? `/analysis/${r.analysisId}` : `/analysis?resumeId=${r.id}`}
                  className="flex items-center justify-between border border-border bg-paper-2 p-3 hover:border-ink/20"
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

          {/* Resume Health & Insights */}
          <section className="border border-border bg-ink p-6 text-paper">
            <div className="flex items-center gap-2">
              <Activity className="size-4 text-accent" />
              <h2 className="font-serif text-2xl italic">Resume Health</h2>
            </div>
            {resumes.length > 0 && avgScore > 0 ? (
              <>
                <p className="mt-4 text-sm leading-relaxed text-paper/70">
                  Your résumé average score is {avgScore}/100. 
                  {avgScore >= 80 
                    ? ' Great job! Your resume is well-optimized for ATS systems.'
                    : avgScore >= 60
                    ? ' Good start! Consider improving keyword matching and formatting.'
                    : ' There\'s room for improvement. Focus on ATS-friendly formatting and relevant keywords.'}
                </p>
                <div className="mt-8 grid grid-cols-3 gap-px bg-paper/10">
                  <div className="bg-ink p-3">
                    <div className="font-mono text-[10px] uppercase tracking-widest text-paper/40">Resumes</div>
                    <div className="mt-1 font-serif text-2xl">{totalResumes}</div>
                  </div>
                  <div className="bg-ink p-3">
                    <div className="font-mono text-[10px] uppercase tracking-widest text-paper/40">Avg Score</div>
                    <div className="mt-1 font-serif text-2xl">{avgScore}</div>
                  </div>
                  <div className="bg-ink p-3">
                    <div className="font-mono text-[10px] uppercase tracking-widest text-paper/40">Analyses</div>
                    <div className="mt-1 font-serif text-2xl">{recentAnalyses}</div>
                  </div>
                </div>
              </>
            ) : (
              <p className="mt-4 text-sm leading-relaxed text-paper/70">
                Upload your first resume to get personalized insights and recommendations for improvement.
              </p>
            )}
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
  const { count } = useCountUp(parseFloat(value) || 0, 0, 1200)
  
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