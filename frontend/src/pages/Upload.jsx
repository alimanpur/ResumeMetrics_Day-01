import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Upload as UploadIcon, FileText, X, Loader2, CheckCircle, AlertCircle, Clock, FileWarning } from 'lucide-react'
import { toast } from 'sonner'
import { useUploadResume, useAnalysis } from '../hooks/useApi'

const analysisStages = [
  { id: 'uploading', label: 'Uploading Resume' },
  { id: 'validating', label: 'Validating File' },
  { id: 'extracting', label: 'Extracting Text' },
  { id: 'ocr', label: 'OCR Verification' },
  { id: 'sections', label: 'Section Detection' },
  { id: 'experience', label: 'Experience Parsing' },
  { id: 'education', label: 'Education Parsing' },
  { id: 'skills', label: 'Skills Extraction' },
  { id: 'keywords', label: 'Keyword Matching' },
  { id: 'ats', label: 'ATS Rule Engine' },
  { id: 'semantic', label: 'Semantic Intelligence' },
  { id: 'achievements', label: 'Achievement Detection' },
  { id: 'job_match', label: 'Job Match Engine' },
  { id: 'benchmarking', label: 'Benchmarking' },
  { id: 'recommendations', label: 'Generating Suggestions' },
  { id: 'report', label: 'Preparing Report' },
  { id: 'complete', label: 'Complete' },
]

const stageIndexMap = {}
analysisStages.forEach((s, i) => { stageIndexMap[s.id] = i })

const MAX_FILE_SIZE = 5 * 1024 * 1024
const ACCEPTED_TYPES = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']

export default function Upload() {
  const navigate = useNavigate()
  const uploadResume = useUploadResume()
  const [file, setFile] = useState(null)
  const [filePreview, setFilePreview] = useState(null)
  const [drag, setDrag] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadedResumeId, setUploadedResumeId] = useState(null)
  const [analysisId, setAnalysisId] = useState(null)
  const [fileError, setFileError] = useState(null)
  const [isDuplicate, setIsDuplicate] = useState(false)
  const fileInputRef = useRef(null)

  const { data: analysisData, isLoading: analysisLoading, isError: analysisError } = useAnalysis(analysisId)
  const analysis = analysisData?.data?.data
  const analysisStatus = analysis?.status

  if (analysisStatus === 'COMPLETED' && analysisId) {
    setTimeout(() => {
      navigate(`/analysis/${analysisId}`, { replace: true })
    }, 500)
    return null
  }

  if (analysisStatus === 'FAILED' && analysisId) {
    toast.error('Analysis failed. Please try again.')
    setAnalysisId(null)
    setUploadedResumeId(null)
    uploadResume.reset()
  }

  function validateFile(selectedFile) {
    setFileError(null)
    setIsDuplicate(false)
    if (!selectedFile) return false
    if (selectedFile.size > MAX_FILE_SIZE) {
      setFileError(`File too large. Maximum size is 5MB. Your file is ${(selectedFile.size / 1024 / 1024).toFixed(1)}MB.`)
      return false
    }
    const ext = selectedFile.name.split('.').pop().toLowerCase()
    if (!['pdf', 'docx', 'txt'].includes(ext)) {
      setFileError('Invalid file type. Please upload a PDF, DOCX, or TXT file.')
      return false
    }
    return true
  }

  function handleFileSelect(selectedFile) {
    if (!selectedFile) return
    if (!validateFile(selectedFile)) {
      setFilePreview(null)
      setFile(null)
      return
    }
    setFile(selectedFile.name)
    setFilePreview(selectedFile)
    setFileError(null)
  }

  function start() {
    if (!filePreview || fileError) return
    setUploadProgress(0)
    setAnalysisId(null)
    setUploadedResumeId(null)

    const formData = new FormData()
    formData.append('resume', filePreview)

    uploadResume.mutate(
      {
        formData,
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          setUploadProgress(percentCompleted)
        }
      },
      {
        onSuccess: (response) => {
          const data = response?.data?.data
          const resumeId = data?.id
          const newAnalysisId = data?.analysisId

          setUploadedResumeId(resumeId)
          setAnalysisId(newAnalysisId)

          if (!newAnalysisId) {
            toast.success('Resume uploaded!')
            navigate('/history')
          }
        },
        onError: () => {
          setUploadProgress(0)
          toast.error('Upload failed. Please try again.')
        }
      }
    )
  }

  const handleFileChange = (e) => {
    handleFileSelect(e.target.files?.[0])
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDrag(false)
    handleFileSelect(e.dataTransfer.files?.[0])
  }

  function getCurrentStage() {
    if (uploadResume.isPending || uploadProgress < 100) return stageIndexMap['uploading']
    if (analysisLoading || !analysisStatus) return stageIndexMap['validating']
    if (analysisStatus === 'COMPLETED') return stageIndexMap['complete']

    const statusStageMap = {
      'PENDING': 'extracting',
      'PROCESSING': 'ats',
    }
    const stage = statusStageMap[analysisStatus] || 'extracting'
    return stageIndexMap[stage] || 1
  }

  const currentStage = getCurrentStage()
  const isProcessing = uploadResume.isPending || analysisLoading || analysisStatus === 'PENDING' || analysisStatus === 'PROCESSING'
  const progressPercent = isProcessing
    ? Math.min(((currentStage + 1) / analysisStages.length) * 100, 100)
    : 100

  return (
    <div className="px-8 py-10">
      <div className="mb-10 max-w-3xl">
        <span className="font-mono text-[11px] uppercase tracking-widest text-ink/40">New Session</span>
        <h1 className="mt-2 font-serif text-4xl italic">Upload & Analyze Resume</h1>
        <p className="mt-2 text-sm text-ink/60">
          Drop a resume to begin. PDF, DOCX, or TXT up to 5MB. Analysis runs automatically.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div>
          {!file ? (
            <label
              onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
              onDragLeave={() => setDrag(false)}
              onDrop={handleDrop}
              onDragEnter={(e) => { e.preventDefault(); setDrag(true); }}
              className={`flex aspect-video cursor-pointer flex-col items-center justify-center border-2 border-dashed text-center transition-all ${
                drag ? "border-accent bg-accent/5 scale-[1.01]" : "border-border bg-paper-2 hover:border-ink/30"
              }`}
            >
              <UploadIcon className={`size-8 text-ink/40 transition-transform ${drag ? 'scale-110' : ''}`} />
              <div className="mt-4 font-serif text-2xl italic">Drop resume here</div>
              <div className="mt-2 text-xs text-ink/50">or click to browse · PDF · DOCX · TXT</div>
              <div className="mt-4 text-[10px] font-mono text-ink/30">Max file size: 5MB</div>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf,.docx,.txt"
                onChange={handleFileChange}
              />
            </label>
          ) : (
            <div className="border border-border bg-paper p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="grid size-10 place-items-center border border-border bg-paper-2">
                    <FileText className="size-4" />
                  </div>
                  <div>
                    <div className="font-medium">{file}</div>
                    <div className="font-mono text-xs text-ink/40">
                      {isProcessing
                        ? 'Processing...'
                        : uploadResume.isError
                          ? 'Upload failed'
                          : 'Ready to analyze'}
                    </div>
                  </div>
                </div>
                {!isProcessing && (
                  <button
                    onClick={() => {
                      setFile(null)
                      setFilePreview(null)
                      setUploadProgress(0)
                      setFileError(null)
                      uploadResume.reset()
                    }}
                    className="text-ink/40 hover:text-ink"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </div>

              {fileError && (
                <div className="mt-4 flex items-center gap-2 border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  <FileWarning className="size-4 shrink-0" />
                  {fileError}
                </div>
              )}

              {isProcessing ? (
                <div className="mt-8">
                  <div className="rounded-sm bg-ink p-5">
                    <div className="mb-4 flex items-center justify-between font-mono text-xs text-paper">
                      <span className="flex items-center gap-2">
                        <Loader2 className="size-3 animate-spin" />
                        {analysisStatus === 'COMPLETED' ? 'Analysis Complete' : 'Processing Resume...'}
                      </span>
                      {uploadResume.isPending && <span>{uploadProgress}% uploaded</span>}
                      {analysisStatus === 'PROCESSING' && <span className="text-accent">AI Engine Active</span>}
                    </div>

                    <div className="space-y-1.5 font-mono text-xs">
                      {analysisStages.map((stage, i) => {
                        const done = i < currentStage
                        const active = i === currentStage
                        const isComplete = currentStage >= analysisStages.length - 1 && analysisStatus === 'COMPLETED'
                        return (
                          <div
                            key={stage.id}
                            className={`flex items-center justify-between py-1 transition-colors duration-300 ${
                              done || (isComplete && i === currentStage)
                                ? "text-paper/80"
                                : active
                                  ? "text-accent"
                                  : "text-paper/30"
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              {done || (isComplete && i === currentStage) ? (
                                <CheckCircle className="size-3" />
                              ) : active ? (
                                <Loader2 className="size-3 animate-spin" />
                              ) : (
                                <Clock className="size-3" />
                              )}
                              {stage.label}
                            </span>
                            {active && !isComplete && <span className="animate-pulse text-accent">processing...</span>}
                            {(done || (isComplete && i === currentStage)) && <span className="text-paper/60">done</span>}
                          </div>
                        )
                      })}
                    </div>

                    <div className="mt-5 h-1 bg-paper/10">
                      <div
                        className="h-full bg-accent transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>

                    <div className="mt-3 font-mono text-[10px] text-paper/40">
                      {analysisStatus === 'COMPLETED'
                        ? '✓ Analysis complete. Redirecting to report...'
                        : analysisStatus === 'FAILED'
                          ? '✗ Analysis failed. Please try again.'
                          : `Stage ${currentStage + 1} of ${analysisStages.length}`}
                    </div>
                  </div>
                </div>
              ) : uploadResume.isError ? (
                <div className="mt-8 rounded-sm border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="size-4" />
                    <span>Upload failed. Please try again.</span>
                  </div>
                  <button
                    onClick={start}
                    className="mt-3 bg-red-700 px-4 py-2 text-xs text-white hover:bg-red-800"
                  >
                    Retry upload
                  </button>
                </div>
              ) : (
                <button
                  onClick={start}
                  disabled={!filePreview || !!fileError}
                  className="mt-8 w-full bg-ink py-3 text-sm font-medium text-paper hover:bg-ink/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Upload & Analyze
                </button>
              )}
            </div>
          )}
        </div>

        <aside className="border border-border bg-paper-2 p-6">
          <h2 className="font-serif text-xl italic">What we check</h2>
          <ul className="mt-4 space-y-3 text-sm text-ink/70">
            {[
              "Structural parsing",
              "Entity extraction",
              "Semantic vector mapping",
              "Keyword overlap",
              "Format stability across 400+ ATS variants",
              "Embedded font & metadata health",
              "OCR fallback for scanned PDFs",
              "Section completeness scoring"
            ].map((x) => (
              <li key={x} className="flex items-start gap-2">
                <span className="mt-1.5 size-1 rounded-full bg-accent" />
                {x}
              </li>
            ))}
          </ul>
          <div className="mt-6 border-t border-border pt-4">
            <div className="font-mono text-[10px] uppercase tracking-widest text-ink/40">Supported formats</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {['PDF', 'DOCX', 'TXT'].map(f => (
                <span key={f} className="border border-border bg-paper px-2 py-0.5 font-mono text-[10px] text-ink/60">{f}</span>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
