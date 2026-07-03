/**
 * Credibility Engine
 * Verifies every resume claim with evidence.
 * Prevents false claims and hallucinations.
 */

class CredibilityEngine {
  constructor() {
    this.strongIndicators = [
      'architected', 'designed', 'led', 'spearheaded', 'pioneered',
      'mastered', 'deployed', 'shipped', 'launched', 'delivered',
      'increased revenue', 'reduced costs', 'improved performance',
    ]
    this.weakIndicators = [
      'familiar with', 'exposed to', 'basic knowledge', 'touched',
      'worked on', 'helped', 'assisted',
    ]
  }

  analyze(normalizedDoc, skillsData = {}) {
    const claims = this.extractClaims(normalizedDoc)
    const credibilityReport = claims.map(claim => this.evaluateClaim(claim, normalizedDoc, skillsData))
    const riskScore = this.calculateRiskScore(credibilityReport)
    const overallCredibility = this.getOverallCredibility(riskScore)

    return {
      totalClaims: claims.length,
      verifiedClaims: credibilityReport.filter(c => c.credibility === 'verified').length,
      unverifiedClaims: credibilityReport.filter(c => c.credibility === 'unverified').length,
      suspiciousClaims: credibilityReport.filter(c => c.credibility === 'suspicious').length,
      criticalClaims: credibilityReport.filter(c => c.credibility === 'critical').length,
      overallCredibility,
      riskScore,
      claims: credibilityReport,
      summary: this.generateSummary(credibilityReport),
      recommendations: this.generateRecommendations(credibilityReport),
      generatedAt: new Date().toISOString(),
    }
  }

  extractClaims(normalizedDoc) {
    const claims = []
    const text = normalizedDoc.cleanedText || ''
    const sections = normalizedDoc.sections || []

    for (const section of sections) {
      const sentences = section.content.split(/[.!?]+/).filter(s => s.trim().length > 10)
      for (const sentence of sentences) {
        const technologies = this.extractTechnologies(sentence)
        const achievements = this.extractAchievementClaims(sentence)
        const roles = this.extractRoleClaims(sentence)
        if (technologies.length > 0 || achievements.length > 0 || roles.length > 0) {
          claims.push({
            text: sentence.trim(),
            section: section.type,
            technologies,
            achievements,
            roles,
          })
        }
      }
    }

    return claims.slice(0, 50)
  }

  extractTechnologies(text) {
    const techKeywords = ['javascript', 'typescript', 'python', 'java', 'react', 'node.js', 'sql', 'docker', 'aws', 'kubernetes', 'ci/cd', 'graphql', 'mongodb', 'redis', 'gcp', 'azure']
    const found = []
    const lower = text.toLowerCase()
    for (const tech of techKeywords) {
      if (lower.includes(tech.toLowerCase())) found.push(tech)
    }
    return found
  }

  extractAchievementClaims(text) {
    const claims = []
    const patterns = [
      /(?:increased|improved|reduced|decreased|saved|generated|delivered)\s+(?:revenue|costs|time|efficiency|performance|growth|sales|output)\s+(?:by\s+)?\d+%?/i,
      /\d+%?\s+(?:increase|improvement|reduction|decrease|growth)/i,
      /\$\d+([km])?/i,
    ]
    for (const pattern of patterns) {
      const match = text.match(pattern)
      if (match) claims.push({ text: match[0], type: 'quantifiable' })
    }
    return claims
  }

  extractRoleClaims(text) {
    const roles = ['manager', 'lead', 'senior', 'principal', 'director', 'head', 'chief', 'architect']
    const found = []
    const lower = text.toLowerCase()
    for (const role of roles) {
      if (lower.includes(role)) found.push(role)
    }
    return found
  }

  evaluateClaim(claim, normalizedDoc, skillsData) {
    const evidenceLevel = this.getEvidenceLevel(claim)
    const projectSupport = this.getProjectSupport(claim, normalizedDoc)
    const experienceSupport = this.getExperienceSupport(claim, normalizedDoc)
    const overallCredibility = this.calculateClaimCredibility(evidenceLevel, projectSupport, experienceSupport)
    const interviewRisk = this.getInterviewRisk(overallCredibility, claim)
    const recommendation = this.getRecommendation(overallCredibility, claim, projectSupport, experienceSupport)
    const likelyConcern = this.getLikelyConcern(overallCredibility, claim)
    const likelyQuestion = this.getLikelyQuestion(claim, overallCredibility)

    return {
      claim: claim.text.slice(0, 200),
      technologies: claim.technologies,
      evidenceLevel,
      projectSupport,
      experienceSupport,
      credibility: overallCredibility,
      confidence: this.getConfidenceScore(evidenceLevel, projectSupport, experienceSupport),
      interviewRisk,
      recommendation,
      likelyConcern,
      likelyQuestion,
      section: claim.section,
    }
  }

  getEvidenceLevel(claim) {
    let score = 0
    for (const indicator of this.strongIndicators) {
      if (claim.text.toLowerCase().includes(indicator.toLowerCase())) score += 2
    }
    for (const indicator of this.weakIndicators) {
      if (claim.text.toLowerCase().includes(indicator.toLowerCase())) score -= 1
    }
    if (claim.achievements.length > 0) score += 2
    if (claim.technologies.length > 0) score += 1
    if (score >= 3) return 'strong'
    if (score >= 1) return 'moderate'
    if (score === 0) return 'limited'
    return 'mention_only'
  }

  getProjectSupport(claim, normalizedDoc) {
    const projectSection = (normalizedDoc.sections || []).find(s => s.type === 'projects')
    if (!projectSection) return { score: 0, level: 'none', projects: [] }
    const projectNames = projectSection.content.split('\n').filter(line => line.trim().length > 2)
    const supported = claim.technologies.filter(tech =>
      projectSection.content.toLowerCase().includes(tech.toLowerCase())
    )
    return {
      score: supported.length > 0 ? 80 : 20,
      level: supported.length > 0 ? 'supported' : 'unsupported',
      projects: projectNames.slice(0, 5),
      supportedTechnologies: supported,
    }
  }

  getExperienceSupport(claim, normalizedDoc) {
    const expSection = (normalizedDoc.sections || []).find(s => s.type === 'experience')
    if (!expSection) return { score: 0, level: 'none', evidence: [] }
    const supported = claim.technologies.filter(tech =>
      expSection.content.toLowerCase().includes(tech.toLowerCase())
    )
    return {
      score: supported.length > 0 ? 80 : 20,
      level: supported.length > 0 ? 'supported' : 'unsupported',
      evidence: claim.achievements,
      supportedTechnologies: supported,
    }
  }

  calculateClaimCredibility(evidenceLevel, projectSupport, experienceSupport) {
    const supportScore = (projectSupport.score + experienceSupport.score) / 2
    const evidenceScores = { strong: 90, moderate: 70, limited: 40, mention_only: 20 }
    const evidenceScore = evidenceScores[evidenceLevel] || 20
    const combined = Math.round((evidenceScore * 0.6 + supportScore * 0.4))
    if (combined >= 80) return 'verified'
    if (combined >= 60) return 'unverified'
    if (combined >= 40) return 'suspicious'
    return 'critical'
  }

  getInterviewRisk(credibility, claim) {
    if (credibility === 'verified') return { level: 'low', reason: 'Well-supported claim with strong evidence' }
    if (credibility === 'unverified') return { level: 'medium', reason: 'Claim may be questioned — lacks project or experience support' }
    if (credibility === 'suspicious') return { level: 'high', reason: 'Weakly supported claim — recruiters may probe deeply' }
    return { level: 'very_high', reason: 'Very weak claim — likely to be rejected if questioned' }
  }

  getRecommendation(credibility, claim, projectSupport, experienceSupport) {
    if (credibility === 'verified') return 'Maintain current level of detail — claim is well-supported'
    if (projectSupport.level === 'unsupported' && claim.technologies.length > 0) return `Add a project demonstrating ${claim.technologies.slice(0, 2).join(', ')} to support this claim`
    if (experienceSupport.level === 'unsupported') return 'Add more context about your role in this achievement'
    if (credibility === 'suspicious' || credibility === 'critical') return 'Consider removing or significantly strengthening this claim'
    return 'Add more specific details and evidence to support this claim'
  }

  getLikelyConcern(credibility, claim) {
    if (credibility === 'verified') return null
    const concerns = []
    const techs = claim.technologies.filter(t => !this.isCommonTech(t))
    if (techs.length > 0) concerns.push(`Unexplained expertise in ${techs.slice(0, 3).join(', ')}`)
    if (claim.achievements.length === 0) concerns.push('No quantifiable results provided')
    if (credibility === 'critical') concerns.push('Very weak evidence — likely to be rejected by experienced interviewers')
    return concerns[0] || 'Limited evidence for claim'
  }

  getLikelyQuestion(claim, credibility) {
    if (credibility === 'verified') return null
    if (credibility === 'critical') return `Can you walk me through a specific project where you used ${claim.technologies.slice(0, 2).join(', ')}?`
    if (credibility === 'suspicious') return `What was your specific role in that ${claim.section}?`
    if (claim.achievements.length === 0) return 'What measurable impact did you have?'
    return 'Can you provide more details about that achievement?'
  }

  getConfidenceScore(evidenceLevel, projectSupport, experienceSupport) {
    const scores = { strong: 85, moderate: 65, limited: 35, mention_only: 15 }
    const supportScore = (projectSupport.score + experienceSupport.score) / 2
    return Math.round((scores[evidenceLevel] || 15) * 0.6 + supportScore * 0.4)
  }

  isCommonTech(tech) {
    const common = ['javascript', 'python', 'git', 'sql', 'html', 'css', 'react']
    return common.includes(tech.toLowerCase())
  }

  calculateRiskScore(claims) {
    if (claims.length === 0) return 0
    const riskWeights = { verified: 0, unverified: 1, suspicious: 2, critical: 3 }
    const totalRisk = claims.reduce((sum, c) => sum + (riskWeights[c.credibility] || 1), 0)
    return Math.min(100, Math.round((totalRisk / (claims.length * 3)) * 100))
  }

  getOverallCredibility(riskScore) {
    if (riskScore <= 15) return 'high'
    if (riskScore <= 40) return 'medium'
    if (riskScore <= 70) return 'low'
    return 'very_low'
  }

  generateSummary(claims) {
    const critical = claims.filter(c => c.credibility === 'critical').length
    const suspicious = claims.filter(c => c.credibility === 'suspicious').length
    if (critical > 0) return `Critical: ${critical} claims have no evidence and are likely to be rejected by interviewers.`
    if (suspicious > 0) return `Warning: ${suspicious} claims have weak evidence. Consider strengthening them.`
    return 'Good credibility — most claims are supported with evidence.'
  }

  generateRecommendations(claims) {
    const recs = []
    const unsupported = claims.filter(c => c.credibility === 'critical' || c.credibility === 'suspicious')
    for (const claim of unsupported.slice(0, 5)) {
      recs.push({
        priority: claim.credibility === 'critical' ? 'high' : 'medium',
        claim: claim.text.slice(0, 100),
        recommendation: claim.recommendation,
        technologies: claim.technologies,
      })
    }
    return recs
  }

  getEmptyCredibility() {
    return {
      totalClaims: 0,
      verifiedClaims: 0,
      unverifiedClaims: 0,
      suspiciousClaims: 0,
      criticalClaims: 0,
      overallCredibility: 'low',
      riskScore: 0,
      claims: [],
      summary: 'Insufficient data to perform credibility analysis.',
      recommendations: [],
      generatedAt: new Date().toISOString(),
    }
  }
}

module.exports = new CredibilityEngine()
