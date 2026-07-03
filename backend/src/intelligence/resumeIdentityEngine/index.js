/**
 * Resume Identity Engine
 * Generates a premium identity card for each resume analysis.
 */

class ResumeIdentityEngine {
  constructor() {
    this.version = '2.0';
  }

  generateIdentity(analysis, resume, options = {}) {
    const name = resume?.user?.name || resume?.userName || 'Candidate'
    const targetRole = analysis.targetRole || resume?.targetRole || 'Not specified'
    const yearsExp = this.extractYearsExperience(resume)
    const resumeVersion = resume?.version || '1.0'
    const atsScore = analysis.atsScore || 0
    const overallScore = analysis.overallScore || 0
    const aiConfidence = this.calculateAIConfidence(analysis)
    const resumeHealth = this.calculateResumeHealth(analysis)
    const analysisVersion = '2.0'
    const analysisTime = analysis.createdAt ? new Date(analysis.createdAt).toISOString() : new Date().toISOString()
    const badge = this.getATSBadge(atsScore)
    const grade = this.getGrade(overallScore)

    return {
      candidateName: name,
      targetRole,
      yearsOfExperience: yearsExp,
      resumeVersion: resumeVersion,
      resumeGrade: grade,
      atsBadge: badge,
      aiConfidence,
      resumeHealth,
      analysisTime,
      analysisVersion,
      metadata: {
        processingTime: analysis.processingTime || 0,
        aiProvider: analysis.aiProvider || 'unknown',
        aiModel: analysis.aiModel || 'unknown',
        generatedAt: new Date().toISOString(),
      },
    }
  }

  extractYearsExperience(resume) {
    if (!resume) return 0
    const text = [resume.parsedData, resume.extractedText].filter(Boolean).join(' ')
    const matches = text.match(/(\d+)\+?\s*(?:years?|yrs?|y)\s+(?:of\s+)?experience/i)
    if (matches && matches[1]) return parseInt(matches[1])
    const dateMatches = text.match(/\b(19|20)\d{2}\b/g)
    if (dateMatches && dateMatches.length >= 2) {
      const years = dateMatches.map(d => parseInt(d)).filter(y => y > 1990 && y < 2030)
      if (years.length >= 2) return Math.max(0, Math.max(...years) - Math.min(...years))
    }
    return 0
  }

  calculateAIConfidence(analysis) {
    let score = 50
    if (analysis.processingTime && analysis.processingTime > 0) score += 20
    if (analysis.aiProvider && analysis.aiProvider !== 'unknown') score += 15
    if (analysis.aiModel && analysis.aiModel !== 'unknown') score += 10
    if (analysis.comprehensiveReport) score += 5
    return {
      score: Math.min(100, score),
      level: score >= 80 ? 'high' : score >= 60 ? 'medium' : 'low',
    }
  }

  calculateResumeHealth(analysis) {
    const ats = analysis.atsScore || 0
    const overall = analysis.overallScore || 0
    const grammar = analysis.qualityScore || (analysis.semanticAnalysis?.overallScore || 0)
    const health = Math.round(ats * 0.4 + overall * 0.35 + grammar * 0.25)
    return {
      score: health,
      status: health >= 80 ? 'healthy' : health >= 60 ? 'needs_attention' : 'critical',
      factors: {
        atsCompatibility: ats,
        contentQuality: overall,
        languageQuality: grammar,
      },
    }
  }

  getATSBadge(score) {
    if (score >= 90) return { level: 'platinum', label: 'ATS Platinum', icon: '🏆' }
    if (score >= 80) return { level: 'gold', label: 'ATS Gold', icon: '🥇' }
    if (score >= 70) return { level: 'silver', label: 'ATS Silver', icon: '🥈' }
    return { level: 'bronze', label: 'ATS Bronze', icon: '🥉' }
  }

  getGrade(score) {
    if (score >= 90) return 'A+'
    if (score >= 80) return 'A'
    if (score >= 70) return 'B+'
    if (score >= 60) return 'B'
    if (score >= 50) return 'C'
    return 'D'
  }

  getEmptyIdentity() {
    return {
      candidateName: 'Unknown',
      targetRole: 'Not specified',
      yearsOfExperience: 0,
      resumeVersion: '1.0',
      resumeGrade: 'D',
      atsBadge: { level: 'bronze', label: 'ATS Bronze', icon: '🥉' },
      aiConfidence: { score: 0, level: 'low' },
      resumeHealth: { score: 0, status: 'critical', factors: { atsCompatibility: 0, contentQuality: 0, languageQuality: 0 } },
      analysisTime: new Date().toISOString(),
      analysisVersion: this.version,
      metadata: { processingTime: 0, aiProvider: 'unknown', aiModel: 'unknown', generatedAt: new Date().toISOString() },
    }
  }
}

module.exports = new ResumeIdentityEngine()
