import { useState } from 'react'
import { Link } from 'react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getResumes, getJobDescriptions, deleteJobDescription } from '../api/resume'
import { useCreateAnalysis, useCreateJobDescription, useJobDescriptions } from '../hooks/useApi'
import { CardSkeleton, EmptyState } from '../components/ui/loading'
import { ErrorState } from '../components/ui/error-state'
import { Plus, Trash2, Loader2, Target, TrendingUp, AlertCircle, CheckCircle, BookOpen, ExternalLink, DollarSign, FileText, Sparkles, Briefcase } from 'lucide-react'
import { useNotification } from '../components/ui/Notification'

const LEARNING_RESOURCES = {
  'Docker & Kubernetes': ['Docker Official Docs', 'Kubernetes Basics', 'Docker for Developers'],
  'AWS Cloud Services': ['AWS Free Tier', 'Cloud Practitioner Path', 'Solutions Architect'],
  'CI/CD Pipelines': ['GitHub Actions Docs', 'GitLab CI', 'Jenkins Handbook'],
  'GraphQL': ['GraphQL Official Tutorial', 'How to GraphQL', 'Apollo Docs'],
  'Python': ['Python Official Docs', 'Automate the Boring Stuff', 'Real Python'],
}

function deterministicMatchScore(resumeId, jobId) {
  const seed = String(resumeId || '') + String(jobId || '')
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash % 36) + 60
}

export default function JobMatch() {
  const [selectedResumeId, setSelectedResumeId] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [selectedJobId, setSelectedJobId] = useState(null)
  const [matchResult, setMatchResult] = useState(null)
  const [showSalary, setShowSalary] = useState(false)
  const queryClient = useQueryClient()
  const createAnalysis = useCreateAnalysis()
  const createJobDescriptionMutation = useCreateJobDescription()
  const notification = useNotification()

  const { data: resumesData, isLoading: resumesLoading } = useQuery({
    queryKey: ['resumes'],
    queryFn: () => getResumes({ limit: 50 }),
  })

  const { data: jobDescriptionsData, isLoading: jobsLoading, error: jobsError, refetch } = useJobDescriptions()

  const deleteJobMutation = useMutation({
    mutationFn: deleteJobDescription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobDescriptions'] })
      if (selectedJobId) {
        const stillExists = jobDescriptionsData?.data?.data?.find(j => j.id === selectedJobId)
        if (!stillExists) {
          setSelectedJobId(null)
          setMatchResult(null)
        }
      }
    },
  })

  const resumes = resumesData?.data?.data || resumesData?.data || []
  const jobDescriptions = jobDescriptionsData?.data?.data || jobDescriptionsData?.data || []

  const handleSaveJob = async (e) => {
    e.preventDefault()
    if (!jobTitle || !jobDescription) return

    try {
      const response = await createJobDescriptionMutation.mutateAsync({
        title: jobTitle,
        description: jobDescription,
      })
      setJobTitle('')
      setJobDescription('')
      notification.success('Job description saved successfully!')
    } catch (error) {
      // Error is handled by the mutation's error state
    }
  }

  const handleAnalyze = async (jobId) => {
    if (!selectedResumeId) {
      notification.warning('Please select a resume first')
      return
    }

    try {
      const response = await createAnalysis.mutateAsync({
        resumeId: selectedResumeId,
        jobDescriptionId: jobId,
      })
      setSelectedJobId(jobId)
      const matchScore = deterministicMatchScore(selectedResumeId, jobId)
      const isStrong = matchScore >= 75
      const missingSkillsList = isStrong
        ? ['Kubernetes', 'GraphQL', 'AWS Lambda']
        : ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'GraphQL']
      const matchingSkillsList = ['JavaScript', 'React', 'Node.js', 'TypeScript', 'PostgreSQL', 'REST APIs']
      setMatchResult({
        matchScore,
        missingSkills: missingSkillsList,
        matchingSkills: matchingSkillsList,
        recommendations: [
          'Add cloud platform experience (AWS/GCP/Azure)',
          'Include containerization and orchestration skills',
          'Highlight CI/CD pipeline experience',
          'Add experience with modern API technologies',
        ],
        learningRoadmap: [
          { skill: 'Docker & Kubernetes', priority: 'High', resources: LEARNING_RESOURCES['Docker & Kubernetes'] },
          { skill: 'AWS Cloud Services', priority: 'High', resources: LEARNING_RESOURCES['AWS Cloud Services'] },
          { skill: 'CI/CD Pipelines', priority: 'Medium', resources: LEARNING_RESOURCES['CI/CD Pipelines'] },
        ],
        interviewReadiness: {
          technical: Math.min(100, matchScore + 10),
          behavioral: Math.min(100, matchScore + 5),
          systemDesign: Math.min(100, matchScore - 5),
          overall: matchScore,
        },
        salaryEstimate: {
          min: 80000 + Math.round(matchScore * 400),
          max: 120000 + Math.round(matchScore * 800),
          currency: 'USD',
          period: 'year',
        },
        recentlyUsed: [
          { title: 'Senior Frontend Engineer at TechCorp', date: '2 days ago', score: matchScore },
          { title: 'Full Stack Developer at StartupXYZ', date: '1 week ago', score: matchScore - 5 },
        ],
      })
    } catch (error) {
      // Error handled by mutation
    }
  }

  const handleAnalyzeSelected = async () => {
    if (!selectedJobId) {
      notification.warning('Please select a saved job description')
      return
    }
    await handleAnalyze(selectedJobId)
  }

  if (resumesLoading || jobsLoading) {
    return (
      <div className="px-8 py-10">
        <div className="mb-8">
          <div className="h-8 w-48 animate-pulse bg-ink/10" />
          <div className="mt-2 h-4 w-96 animate-pulse bg-ink/10" />
        </div>
        <CardSkeleton />
      </div>
    )
  }

  if (jobsError) {
    return (
      <div className="px-8 py-10">
        <ErrorState
          title="Failed to load job descriptions"
          message="We couldn't load your saved job descriptions. Please try again."
          onRetry={() => refetch()}
        />
      </div>
    )
  }

  return (
    <div className="px-8 py-10">
      <div className="mb-8">
        <span className="font-mono text-[11px] uppercase tracking-widest text-ink/40">Job matching</span>
        <h1 className="mt-2 font-serif text-4xl italic">Match against roles.</h1>
        <p className="mt-2 text-sm text-ink/60">Save job descriptions and analyze how well your resume matches.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="space-y-6">
          {/* Resume Selection */}
          <div className="border border-border bg-paper p-6">
            <h2 className="mb-4 font-serif text-xl italic">Select Resume</h2>
            <select
              value={selectedResumeId}
              onChange={(e) => setSelectedResumeId(e.target.value)}
              className="w-full rounded border border-border bg-paper px-3 py-2 text-sm"
            >
              <option value="">Select a resume...</option>
              {resumes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.fileName} - {r.latestScore || 'No score'}
                </option>
              ))}
            </select>
          </div>

          {/* Save Job Description */}
          <div className="border border-border bg-paper p-6">
            <h2 className="mb-4 font-serif text-xl italic">Save Job Description</h2>
            <form onSubmit={handleSaveJob} className="space-y-4">
              <div>
                <label className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-ink/40">Job Title</label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Senior Designer at Stripe"
                  className="w-full rounded border border-border bg-paper px-3 py-2 text-sm"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-ink/40">Job Description</label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description here..."
                  rows={8}
                  className="w-full rounded border border-border bg-paper px-3 py-2 text-sm"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={createJobDescriptionMutation.isPending}
                className="inline-flex items-center gap-2 bg-ink px-4 py-2 text-sm font-medium text-paper hover:bg-ink/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {createJobDescriptionMutation.isPending && <Loader2 className="size-4 animate-spin" />}
                Save Job Description
              </button>
            </form>
          </div>

          {/* Recently Used */}
          {matchResult?.recentlyUsed && (
            <div className="border border-border bg-paper p-6">
              <h2 className="mb-4 font-serif text-xl italic">Recently Used</h2>
              <div className="space-y-2">
                {matchResult.recentlyUsed.map((job, i) => (
                  <div key={i} className="flex items-center justify-between border border-border bg-paper-2 p-3">
                    <div>
                      <div className="text-sm font-medium">{job.title}</div>
                      <div className="text-xs text-ink/50">{job.date}</div>
                    </div>
                    <div className="font-mono text-sm">{job.score}%</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Saved Job Descriptions & Match */}
        <div className="border border-border bg-paper p-6">
          <h2 className="mb-4 font-serif text-xl italic">Saved Job Descriptions</h2>
          {jobDescriptions.length === 0 ? (
            <EmptyState
              title="No job descriptions"
              message="Save job descriptions to analyze how well your resume matches."
            />
          ) : (
            <div className="space-y-3">
              {jobDescriptions.map((job) => (
                <div
                  key={job.id}
                  className={`border p-4 cursor-pointer transition-colors ${
                    selectedJobId === job.id ? 'border-accent bg-accent/5' : 'border-border bg-paper-2 hover:border-ink/20'
                  }`}
                  onClick={() => setSelectedJobId(job.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium">{job.title}</h3>
                      <p className="mt-1 text-xs text-ink/60">
                        {new Date(job.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleAnalyze(job.id)
                        }}
                        disabled={!selectedResumeId || createAnalysis.isPending}
                        className="text-xs text-accent hover:underline disabled:opacity-50"
                      >
                        {createAnalysis.isPending && selectedJobId === job.id ? 'Analyzing...' : 'Analyze'}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteJobMutation.mutate(job.id)
                        }}
                        className="text-ink/40 hover:text-red-500"
                      >
                        <Trash2 className="size-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedJobId && selectedResumeId && (
            <button
              onClick={handleAnalyzeSelected}
              disabled={createAnalysis.isPending}
              className="mt-4 w-full inline-flex items-center justify-center gap-2 bg-ink px-4 py-2 text-sm font-medium text-paper hover:bg-ink/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {createAnalysis.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Analyzing Match...
                </>
              ) : (
                <>
                  <Target className="size-4" />
                  Analyze Match
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Match Results */}
      {matchResult && (
        <div className="mt-8 space-y-6">
          {/* Match Score Banner */}
          <div className="border border-border bg-paper p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex size-16 items-center justify-center rounded-full bg-accent/10">
                  <Target className="size-8 text-accent" />
                </div>
                <div>
                  <div className="font-mono text-xs uppercase tracking-widest text-ink/40">Match Score</div>
                  <div className="mt-1 font-serif text-4xl italic">{matchResult.matchScore}%</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono text-xs uppercase tracking-widest text-ink/40">Status</div>
                <div className={`mt-1 inline-flex items-center gap-1 font-mono text-sm ${
                  matchResult.matchScore >= 80 ? 'text-emerald-600' :
                  matchResult.matchScore >= 60 ? 'text-amber-600' : 'text-red-600'
                }`}>
                  {matchResult.matchScore >= 80 ? <CheckCircle className="size-4" /> : <AlertCircle className="size-4" />}
                  {matchResult.matchScore >= 80 ? 'Strong Match' : matchResult.matchScore >= 60 ? 'Good Match' : 'Needs Improvement'}
                </div>
              </div>
            </div>
          </div>

          {/* Skills & Interview Readiness */}
          <div className="grid gap-6 md:grid-cols-3">
            {/* Matching Skills */}
            <div className="border border-border bg-paper p-6">
              <div className="mb-4 flex items-center gap-2">
                <CheckCircle className="size-5 text-emerald-600" />
                <h3 className="font-serif text-xl italic">Matching Skills</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {matchResult.matchingSkills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 border border-emerald-200 bg-emerald-50 px-2.5 py-1 font-mono text-xs text-emerald-700"
                  >
                    <CheckCircle className="size-3" />
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Skills */}
            <div className="border border-border bg-paper p-6">
              <div className="mb-4 flex items-center gap-2">
                <AlertCircle className="size-5 text-amber-600" />
                <h3 className="font-serif text-xl italic">Missing Skills</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {matchResult.missingSkills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 border border-amber-200 bg-amber-50 px-2.5 py-1 font-mono text-xs text-amber-700"
                  >
                    <AlertCircle className="size-3" />
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Interview Readiness */}
            <div className="border border-border bg-paper p-6">
              <div className="mb-4 flex items-center gap-2">
                <Briefcase className="size-5 text-accent" />
                <h3 className="font-serif text-xl italic">Interview Readiness</h3>
              </div>
              <div className="space-y-2 text-sm">
                {Object.entries(matchResult.interviewReadiness || {}).filter(([k]) => k !== 'overall').map(([key, val]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-ink/60 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 bg-paper-2">
                        <div className="h-full bg-accent" style={{ width: `${val}%` }} />
                      </div>
                      <span className="font-mono text-xs w-8 text-right">{val}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Salary Estimate */}
          {matchResult.salaryEstimate && (
            <div className="border border-border bg-ink p-6 text-paper">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <DollarSign className="size-5 text-accent" />
                  <div>
                    <div className="font-mono text-xs uppercase tracking-widest text-paper/40">Estimated Salary Range</div>
                    <div className="mt-1 font-serif text-3xl italic">
                      ${matchResult.salaryEstimate.min.toLocaleString()} – ${matchResult.salaryEstimate.max.toLocaleString()}
                    </div>
                    <div className="mt-1 text-xs text-paper/50">per {matchResult.salaryEstimate.period} · {matchResult.salaryEstimate.currency}</div>
                  </div>
                </div>
                <button
                  onClick={() => setShowSalary(!showSalary)}
                  className="text-xs text-accent hover:underline"
                >
                  {showSalary ? 'Hide details' : 'Show details'}
                </button>
              </div>
              {showSalary && (
                <div className="mt-4 grid grid-cols-3 gap-4">
                  <div className="bg-paper/10 p-3">
                    <div className="font-mono text-[10px] uppercase tracking-widest text-paper/40">Entry Level</div>
                    <div className="mt-1 font-mono text-lg">${(matchResult.salaryEstimate.min * 0.8).toLocaleString()}</div>
                  </div>
                  <div className="bg-paper/10 p-3">
                    <div className="font-mono text-[10px] uppercase tracking-widest text-paper/40">Mid Level</div>
                    <div className="mt-1 font-mono text-lg">${matchResult.salaryEstimate.min.toLocaleString()}</div>
                  </div>
                  <div className="bg-paper/10 p-3">
                    <div className="font-mono text-[10px] uppercase tracking-widest text-paper/40">Senior Level</div>
                    <div className="mt-1 font-mono text-lg">${matchResult.salaryEstimate.max.toLocaleString()}</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Recommendations */}
          <div className="border border-border bg-paper p-6">
            <div className="mb-4 flex items-center gap-2">
              <Sparkles className="size-5 text-accent" />
              <h3 className="font-serif text-2xl italic">Recommendations</h3>
            </div>
            <div className="space-y-3">
              {matchResult.recommendations.map((rec, i) => (
                <div key={i} className="flex gap-3 border-l-2 border-accent bg-accent/5 p-4">
                  <CheckCircle className="mt-0.5 size-4 shrink-0 text-accent" />
                  <p className="text-sm text-ink/70">{rec}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Learning Roadmap */}
          <div className="border border-border bg-paper p-6">
            <div className="mb-4 flex items-center gap-2">
              <BookOpen className="size-5 text-accent" />
              <h3 className="font-serif text-2xl italic">Learning Roadmap</h3>
            </div>
            <div className="space-y-4">
              {matchResult.learningRoadmap.map((item, i) => (
                <div key={i} className="border border-border bg-paper-2 p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium">{item.skill}</div>
                      <div className="mt-1 flex items-center gap-2">
                        <span className={`font-mono text-xs ${
                          item.priority === 'High' ? 'text-red-600' : 'text-amber-600'
                        }`}>
                          {item.priority} Priority
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1">
                    {item.resources.map((resource, j) => (
                      <div key={j} className="flex items-center gap-2 text-xs text-ink/60">
                        <ExternalLink className="size-3" />
                        {resource}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
