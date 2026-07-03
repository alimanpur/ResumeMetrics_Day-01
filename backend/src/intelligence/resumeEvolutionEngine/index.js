class ResumeEvolutionEngine {
  constructor() {
    this.reset()
  }

  reset() {
    this.versionHistory = []
    this.analysisHistory = []
    this.resumeVersions = []
  }

  analyze(currentAnalysis, resume, allAnalyses = [], allResumeVersions = []) {
    this.reset()

    if (!currentAnalysis || (!allAnalyses.length && !allResumeVersions.length)) {
      return this.getEmptyResult()
    }

    this.resumeVersions = this.buildResumeVersions(allResumeVersions, resume)
    this.analysisHistory = this.buildAnalysisHistory(allAnalyses, currentAnalysis)

    if (!this.analysisHistory.length) {
      return this.getEmptyResult()
    }

    this.versionHistory = this.buildVersionHistory()

    if (this.versionHistory.length === 0) {
      return this.getEmptyResult()
    }

    const totalVersions = this.versionHistory.length
    const sortedVersions = [...this.versionHistory].sort((a, b) => a.timestamp - b.timestamp)
    const firstVersion = sortedVersions[0]
    const latestVersion = sortedVersions[sortedVersions.length - 1]

    const atsProgression = this.calculateATSProgression(sortedVersions)
    const keywordGrowth = this.calculateKeywordGrowth(sortedVersions)
    const scoreImprovement = this.calculateScoreImprovement(firstVersion, latestVersion)
    const improvementCharts = this.calculateImprovementCharts(sortedVersions)
    const weeklyProgress = this.calculateWeeklyProgress(sortedVersions)
    const bestVersion = this.findBestVersion(sortedVersions)
    const currentStreak = this.calculateCurrentStreak(sortedVersions)
    const summary = this.generateSummary(
      atsProgression,
      keywordGrowth,
      scoreImprovement,
      bestVersion,
      currentStreak
    )

    return {
      totalVersions,
      evolutionTimeline: sortedVersions.map(v => this.formatTimelineEntry(v)),
      atsProgress: atsProgression,
      keywordGrowth,
      scoreImprovement,
      improvementCharts,
      weeklyProgress,
      bestVersion,
      currentStreak,
      summary
    }
  }

  buildResumeVersions(allResumeVersions, currentResume) {
    const versions = []
    if (allResumeVersions && Array.isArray(allResumeVersions)) {
      allResumeVersions.forEach((rv, index) => {
        if (rv && typeof rv === 'object') {
          versions.push({
            id: rv.id || `version_${index}`,
            date: this.parseTimestamp(rv.date || rv.createdAt || rv.timestamp),
            content: rv.content || rv.resume || {},
            changes: Array.isArray(rv.changes) ? rv.changes : [],
            label: rv.label || `Version ${index + 1}`
          })
        }
      })
    }
    if (currentResume && typeof currentResume === 'object') {
      const existingIndex = versions.findIndex(v => v.id === 'current')
      if (existingIndex >= 0) {
        versions[existingIndex] = {
          ...versions[existingIndex],
          content: currentResume,
          date: versions[existingIndex].date || Date.now()
        }
      } else {
        versions.push({
          id: 'current',
          date: Date.now(),
          content: currentResume,
          changes: [],
          label: 'Current'
        })
      }
    }
    return versions
  }

  buildAnalysisHistory(allAnalyses, currentAnalysis) {
    const analyses = []
    if (allAnalyses && Array.isArray(allAnalyses)) {
      allAnalyses.forEach((analysis, index) => {
        if (analysis && typeof analysis === 'object' && this.hasValidScores(analysis)) {
          analyses.push({
            id: analysis.id || `analysis_${index}`,
            timestamp: this.parseTimestamp(analysis.date || analysis.createdAt || analysis.timestamp),
            atsScore: this.extractScore(analysis.atsScore || analysis.ats || analysis.score),
            keywordScore: this.extractScore(analysis.keywordScore || analysis.keywords || analysis.keywordMatch),
            formattingScore: this.extractScore(analysis.formattingScore || analysis.formatting || analysis.format),
            overallScore: this.extractScore(
              analysis.overallScore || analysis.overall || analysis.totalScore
            ),
            scores: {
              ats: this.extractScore(analysis.atsScore || analysis.ats || analysis.score),
              keyword: this.extractScore(analysis.keywordScore || analysis.keywords || analysis.keywordMatch),
              formatting: this.extractScore(analysis.formattingScore || analysis.formatting || analysis.format),
              overall: this.extractScore(analysis.overallScore || analysis.overall || analysis.totalScore)
            },
            keywords: Array.isArray(analysis.keywords) ? analysis.keywords : [],
            details: analysis.details || {}
          })
        }
      })
    }
    if (currentAnalysis && typeof currentAnalysis === 'object' && this.hasValidScores(currentAnalysis)) {
      const existingIndex = analyses.findIndex(a => a.id === 'current')
      if (existingIndex >= 0) {
        analyses[existingIndex] = {
          ...analyses[existingIndex],
          timestamp: Date.now(),
          scores: {
            ats: this.extractScore(currentAnalysis.atsScore || currentAnalysis.ats || currentAnalysis.score),
            keyword: this.extractScore(currentAnalysis.keywordScore || currentAnalysis.keywords || currentAnalysis.keywordMatch),
            formatting: this.extractScore(currentAnalysis.formattingScore || currentAnalysis.formatting || currentAnalysis.format),
            overall: this.extractScore(currentAnalysis.overallScore || currentAnalysis.overall || currentAnalysis.totalScore)
          },
          keywords: Array.isArray(currentAnalysis.keywords) ? currentAnalysis.keywords : [],
          details: currentAnalysis.details || {}
        }
      } else {
        analyses.push({
          id: 'current',
          timestamp: Date.now(),
          scores: {
            ats: this.extractScore(currentAnalysis.atsScore || currentAnalysis.ats || currentAnalysis.score),
            keyword: this.extractScore(currentAnalysis.keywordScore || currentAnalysis.keywords || currentAnalysis.keywordMatch),
            formatting: this.extractScore(currentAnalysis.formattingScore || currentAnalysis.formatting || currentAnalysis.format),
            overall: this.extractScore(currentAnalysis.overallScore || currentAnalysis.overall || currentAnalysis.totalScore)
          },
          keywords: Array.isArray(currentAnalysis.keywords) ? currentAnalysis.keywords : [],
          details: currentAnalysis.details || {}
        })
      }
    }
    return analyses
  }

  hasValidScores(analysis) {
    const scoreFields = [
      analysis.atsScore, analysis.ats, analysis.score,
      analysis.keywordScore, analysis.keywords, analysis.keywordMatch,
      analysis.formattingScore, analysis.formatting, analysis.format,
      analysis.overallScore, analysis.overall, analysis.totalScore
    ]
    return scoreFields.some(field => field !== undefined && field !== null)
  }

  extractScore(value) {
    const num = Number(value)
    return Number.isFinite(num) ? Math.max(0, Math.min(100, num)) : 0
  }

  parseTimestamp(value) {
    if (!value) return Date.now()
    if (value instanceof Date) return value.getTime()
    const parsed = new Date(value).getTime()
    return Number.isFinite(parsed) ? parsed : Date.now()
  }

  buildVersionHistory() {
    const combined = []
    this.analysisHistory.forEach((analysis, index) => {
      const version = this.resumeVersions[index] || {
        id: `version_${index}`,
        date: analysis.timestamp,
        label: `Version ${index + 1}`
      }
      combined.push({
        version: index + 1,
        id: version.id,
        date: version.date,
        label: version.label || `Version ${index + 1}`,
        timestamp: analysis.timestamp,
        atsScore: analysis.scores.ats,
        keywordScore: analysis.scores.keyword,
        formattingScore: analysis.scores.formatting,
        overallScore: analysis.scores.overall,
        keywords: analysis.keywords || [],
        changes: version.changes || []
      })
    })
    return combined
  }

  formatTimelineEntry(version) {
    return {
      version: version.version,
      date: new Date(version.date).toISOString(),
      atsScore: version.atsScore,
      keywordScore: version.keywordScore,
      formattingScore: version.formattingScore,
      overallScore: version.overallScore,
      changes: version.changes
    }
  }

  calculateATSProgression(sortedVersions) {
    const versions = sortedVersions.map(v => ({
      version: v.version,
      score: v.atsScore,
      date: new Date(v.date).toISOString()
    }))

    const firstScore = versions[0]?.score || 0
    const latestScore = versions[versions.length - 1]?.score || 0
    const improvement = latestScore - firstScore

    let trend = 'stable'
    if (versions.length >= 2) {
      const increasing = this.countTrendDirection(versions, 'up')
      const decreasing = this.countTrendDirection(versions, 'down')
      if (increasing > decreasing) trend = 'improving'
      else if (decreasing > increasing) trend = 'declining'
    }

    return {
      trend,
      improvement: Math.round(improvement * 100) / 100,
      versions
    }
  }

  countTrendDirection(versions, direction) {
    let count = 0
    for (let i = 1; i < versions.length; i++) {
      const diff = versions[i].score - versions[i - 1].score
      if (direction === 'up' && diff > 0) count++
      if (direction === 'down' && diff < 0) count++
    }
    return count
  }

  calculateKeywordGrowth(sortedVersions) {
    const versions = sortedVersions.map(v => ({
      version: v.version,
      count: v.keywords ? v.keywords.length : 0,
      date: new Date(v.date).toISOString()
    }))

    const firstCount = versions[0]?.count || 0
    const latestCount = versions[versions.length - 1]?.count || 0
    const totalGrowth = latestCount - firstCount

    let trend = 'stable'
    if (versions.length >= 2) {
      const increasing = this.countTrendDirection(
        versions.map(v => ({ score: v.count })),
        'up'
      )
      const decreasing = this.countTrendDirection(
        versions.map(v => ({ score: v.count })),
        'down'
      )
      if (increasing > decreasing) trend = 'improving'
      else if (decreasing > increasing) trend = 'declining'
    }

    return {
      trend,
      totalGrowth,
      versions
    }
  }

  calculateScoreImprovement(firstVersion, latestVersion) {
    const from = {
      ats: firstVersion.atsScore,
      keyword: firstVersion.keywordScore,
      formatting: firstVersion.formattingScore,
      overall: firstVersion.overallScore
    }
    const to = {
      ats: latestVersion.atsScore,
      keyword: latestVersion.keywordScore,
      formatting: latestVersion.formattingScore,
      overall: latestVersion.overallScore
    }
    const delta = {
      ats: to.ats - from.ats,
      keyword: to.keyword - from.keyword,
      formatting: to.formatting - from.formatting,
      overall: to.overall - from.overall
    }
    const percentage = from.overall > 0 ? ((delta.overall / from.overall) * 100) : 0

    return {
      from: {
        ats: Math.round(from.ats * 100) / 100,
        keyword: Math.round(from.keyword * 100) / 100,
        formatting: Math.round(from.formatting * 100) / 100,
        overall: Math.round(from.overall * 100) / 100
      },
      to: {
        ats: Math.round(to.ats * 100) / 100,
        keyword: Math.round(to.keyword * 100) / 100,
        formatting: Math.round(to.formatting * 100) / 100,
        overall: Math.round(to.overall * 100) / 100
      },
      delta: {
        ats: Math.round(delta.ats * 100) / 100,
        keyword: Math.round(delta.keyword * 100) / 100,
        formatting: Math.round(delta.formatting * 100) / 100,
        overall: Math.round(delta.overall * 100) / 100
      },
      percentage: Math.round(percentage * 100) / 100
    }
  }

  calculateImprovementCharts(sortedVersions) {
    const timeline = sortedVersions.map(v => ({
      date: new Date(v.date).toISOString(),
      version: v.version,
      overallScore: v.overallScore
    }))

    const atsProgression = sortedVersions.map(v => ({
      version: v.version,
      score: v.atsScore,
      date: new Date(v.date).toISOString()
    }))

    const keywordProgression = sortedVersions.map(v => ({
      version: v.version,
      score: v.keywordScore,
      date: new Date(v.date).toISOString()
    }))

    return {
      timeline,
      atsProgression,
      keywordProgression
    }
  }

  calculateWeeklyProgress(sortedVersions) {
    if (sortedVersions.length === 0) return []

    const weeklyMap = new Map()
    sortedVersions.forEach(version => {
      const date = new Date(version.date)
      const weekStart = this.getWeekStart(date)
      const key = weekStart.toISOString()

      if (!weeklyMap.has(key)) {
        weeklyMap.set(key, {
          weekStart: key,
          versions: [],
          atsScores: [],
          keywordScores: [],
          formattingScores: [],
          overallScores: []
        })
      }

      const week = weeklyMap.get(key)
      week.versions.push(version.version)
      week.atsScores.push(version.atsScore)
      week.keywordScores.push(version.keywordScore)
      week.formattingScores.push(version.formattingScore)
      week.overallScores.push(version.overallScore)
    })

    return Array.from(weeklyMap.values()).map(week => ({
      weekStart: week.weekStart,
      versionCount: week.versions.length,
      versions: week.versions,
      averageAts: this.average(week.atsScores),
      averageKeyword: this.average(week.keywordScores),
      averageFormatting: this.average(week.formattingScores),
      averageOverall: this.average(week.overallScores)
    }))
  }

  getWeekStart(date) {
    const d = new Date(date)
    const day = d.getUTCDay()
    const diff = d.getUTCDate() - day + (day === 0 ? -6 : 1)
    d.setUTCDate(diff)
    d.setUTCHours(0, 0, 0, 0)
    return d
  }

  average(values) {
    if (!values || values.length === 0) return 0
    const sum = values.reduce((acc, val) => acc + val, 0)
    return Math.round((sum / values.length) * 100) / 100
  }

  findBestVersion(sortedVersions) {
    if (sortedVersions.length === 0) {
      return { version: 0, score: 0, date: new Date().toISOString() }
    }

    let best = sortedVersions[0]
    sortedVersions.forEach(v => {
      if (v.overallScore > best.overallScore) {
        best = v
      }
    })

    return {
      version: best.version,
      score: Math.round(best.overallScore * 100) / 100,
      date: new Date(best.date).toISOString()
    }
  }

  calculateCurrentStreak(sortedVersions) {
    if (sortedVersions.length < 2) return 0

    let streak = 0
    for (let i = sortedVersions.length - 1; i > 0; i--) {
      const current = sortedVersions[i].overallScore
      const previous = sortedVersions[i - 1].overallScore
      if (current >= previous) {
        streak++
      } else {
        break
      }
    }

    return streak
  }

  generateSummary(atsProgression, keywordGrowth, scoreImprovement, bestVersion, currentStreak) {
    const parts = []
    parts.push(`Total versions analyzed: ${this.versionHistory.length}`)

    if (scoreImprovement.delta.overall > 0) {
      parts.push(`Overall improvement of ${scoreImprovement.percentage}%`)
    } else if (scoreImprovement.delta.overall < 0) {
      parts.push(`Overall decline of ${Math.abs(scoreImprovement.percentage)}%`)
    } else {
      parts.push('No overall change in scores')
    }

    parts.push(`ATS trend: ${atsProgression.trend}`)
    parts.push(`Keyword trend: ${keywordGrowth.trend}`)
    parts.push(`Best version: v${bestVersion.version} with score ${bestVersion.score}`)

    if (currentStreak > 0) {
      parts.push(`Current improvement streak: ${currentStreak} versions`)
    }

    return parts.join('. ') + '.'
  }

  getEmptyResult() {
    return {
      totalVersions: 0,
      evolutionTimeline: [],
      atsProgress: { trend: 'stable', improvement: 0, versions: [] },
      keywordGrowth: { trend: 'stable', totalGrowth: 0, versions: [] },
      scoreImprovement: {
        from: { ats: 0, keyword: 0, formatting: 0, overall: 0 },
        to: { ats: 0, keyword: 0, formatting: 0, overall: 0 },
        delta: { ats: 0, keyword: 0, formatting: 0, overall: 0 },
        percentage: 0
      },
      improvementCharts: { timeline: [], atsProgression: [], keywordProgression: [] },
      weeklyProgress: [],
      bestVersion: { version: 0, score: 0, date: new Date().toISOString() },
      currentStreak: 0,
      summary: 'No analysis data available for evolution tracking.'
    }
  }
}

module.exports = new ResumeEvolutionEngine()
