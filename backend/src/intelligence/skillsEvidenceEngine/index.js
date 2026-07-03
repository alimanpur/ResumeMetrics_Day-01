/**
 * Skills Evidence Intelligence Engine
 * Analyzes every skill and classifies evidence level.
 * Avoids false claims like "Expert."
 */

class SkillsEvidenceEngine {
  constructor() {
    this.evidenceLevels = {
      strong: {
        label: 'Strong Evidence',
        score: 90,
        description: 'Skill demonstrated with specific achievements, projects, and measurable outcomes',
        indicators: ['developed', 'implemented', 'led', 'architected', 'designed', 'shipped', 'deployed'],
      },
      moderate: {
        label: 'Moderate Evidence',
        score: 70,
        description: 'Skill mentioned with some context but lacking strong validation',
        indicators: ['used', 'worked with', 'applied', 'experienced'],
      },
      limited: {
        label: 'Limited Evidence',
        score: 40,
        description: 'Skill appears in list but no contextual evidence',
        indicators: [],
      },
      mention_only: {
        label: 'Mention Only',
        score: 20,
        description: 'Skill listed but no supporting evidence in resume content',
        indicators: [],
      },
    }
  }

  analyze(normalizedDoc, skillsData = {}) {
    const text = normalizedDoc.cleanedText || ''
    const sections = normalizedDoc.sections || []
    const rawSkills = this.extractAllSkills(text, sections)
    const analyzedSkills = rawSkills.map(skill => this.analyzeSkill(skill, text, sections))
    const summary = this.generateSummary(analyzedSkills)
    const recommendations = this.generateRecommendations(analyzedSkills)
    const skillProfile = this.buildSkillProfile(analyzedSkills)

    return {
      totalSkills: analyzedSkills.length,
      strongEvidence: analyzedSkills.filter(s => s.evidenceLevel === 'strong').length,
      moderateEvidence: analyzedSkills.filter(s => s.evidenceLevel === 'moderate').length,
      limitedEvidence: analyzedSkills.filter(s => s.evidenceLevel === 'limited').length,
      mentionOnly: analyzedSkills.filter(s => s.evidenceLevel === 'mention_only').length,
      skillProfile,
      skills: analyzedSkills,
      summary,
      recommendations,
      visibility: this.getVisibility(analyzedSkills),
      credibility: this.getCredibility(analyzedSkills),
      topSkills: analyzedSkills
        .filter(s => s.evidenceLevel === 'strong')
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, 10),
      weakSkills: analyzedSkills.filter(s => s.evidenceLevel === 'mention_only' || s.evidenceLevel === 'limited')
        .slice(0, 10),
      generatedAt: new Date().toISOString(),
    }
  }

  extractAllSkills(text, sections) {
    const knownSkills = new Set([
      'javascript', 'typescript', 'python', 'java', 'react', 'angular', 'vue', 'svelte',
      'node.js', 'express', 'django', 'flask', 'spring', 'nest', 'graphql', 'rest',
      'sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch', 'firebase',
      'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'ansible',
      'git', 'github', 'gitlab', 'ci/cd', 'agile', 'scrum', 'kanban',
      'machine learning', 'deep learning', 'tensorflow', 'pytorch', 'pandas',
      'figma', 'sketch', 'jira', 'confluence', 'notion', 'slack',
      'leadership', 'communication', 'teamwork', 'problem solving', 'mentoring',
      'html', 'css', 'sass', 'tailwind', 'redux', 'mobx', 'zustand',
      'webpack', 'vite', 'babel', 'jest', 'cypress', 'swagger', 'postman',
    ])
    const found = new Set()
    const lower = text.toLowerCase()
    for (const skill of knownSkills) {
      if (lower.includes(skill.toLowerCase())) found.add(skill)
    }
    const skillsSection = sections.find(s => s.type === 'skills')
    if (skillsSection) {
      const listed = skillsSection.content.split(/[,\n•·*]+/).map(s => s.trim()).filter(s => s.length > 1)
      for (const skill of listed) found.add(skill)
    }
    return Array.from(found).map(skill => ({
      name: skill,
      category: this.categorizeSkill(skill),
      technicalDepth: this.assessTechnicalDepth(skill),
    }))
  }

  categorizeSkill(skill) {
    const programming = ['javascript', 'typescript', 'python', 'java', 'ruby', 'go', 'rust', 'php', 'swift', 'kotlin', 'scala', 'r', 'c++', 'c#']
    const frontend = ['react', 'angular', 'vue', 'svelte', 'next.js', 'nuxt', 'html', 'css', 'sass', 'tailwind', 'redux', 'zustand']
    const backend = ['node.js', 'express', 'django', 'flask', 'spring', 'nest', 'graphql', 'rest', 'fastapi', 'rails', 'laravel']
    const data = ['sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch', 'firebase', 'dynamodb', 'cassandra']
    const cloud = ['aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'ansible', 'jenkins', 'ci/cd']
    const tools = ['git', 'github', 'gitlab', 'figma', 'jira', 'confluence', 'notion', 'slack', 'postman', 'swagger']
    const soft = ['leadership', 'communication', 'teamwork', 'problem solving', 'mentoring', 'collaboration', 'adaptability']
    const methodology = ['agile', 'scrum', 'kanban', 'devops', 'microservices', 'serverless', 'tdd', 'bdd']
    const ml = ['machine learning', 'deep learning', 'tensorflow', 'pytorch', 'keras', 'pandas', 'numpy']

    const skillLower = skill.toLowerCase()
    if (programming.some(p => skillLower.includes(p))) return 'Programming Languages'
    if (frontend.some(f => skillLower.includes(f))) return 'Frontend'
    if (backend.some(b => skillLower.includes(b))) return 'Backend'
    if (data.some(d => skillLower.includes(d))) return 'Databases'
    if (cloud.some(c => skillLower.includes(c))) return 'Cloud & DevOps'
    if (tools.some(t => skillLower.includes(t))) return 'Tools'
    if (soft.some(s => skillLower.includes(s))) return 'Soft Skills'
    if (methodology.some(m => skillLower.includes(m))) return 'Methodologies'
    if (ml.some(m => skillLower.includes(m))) return 'Data Science & ML'
    return 'Other'
  }

  assessTechnicalDepth(skill) {
    return 'Not Assessed'
  }

  analyzeSkill(skill, text, sections) {
    const mentionCount = this.countMentions(text, skill.name)
    const projectSupport = this.getProjectSupport(skill, text)
    const experienceSupport = this.getExperienceSupport(skill, text)
    const verbContext = this.getVerbContext(text, skill.name)
    const evidenceLevel = this.classifyEvidenceLevel(mentionCount, projectSupport, experienceSupport, verbContext)
    const confidence = this.calculateConfidence(evidenceLevel, mentionCount, projectSupport, experienceSupport)
    const reason = this.getEvidenceReason(evidenceLevel, mentionCount, projectSupport, experienceSupport)

    return {
      name: skill.name,
      category: skill.category,
      technicalDepth: skill.technicalDepth,
      evidenceLevel,
      confidence,
      reason,
      mentionCount,
      projectSupport,
      experienceSupport,
      verbContext,
    }
  }

  countMentions(text, skill) {
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(`\\b${escaped}\\b`, 'gi')
    return (text.match(regex) || []).length
  }

  getProjectSupport(skill, text) {
    const projectSection = text.toLowerCase().includes('project') ? text : ''
    const mentions = this.countMentions(projectSection || text, skill.name)
    if (mentions >= 2) return { score: 90, level: 'strong', count: mentions }
    if (mentions === 1) return { score: 60, level: 'moderate', count: mentions }
    return { score: 20, level: 'weak', count: mentions }
  }

  getExperienceSupport(skill, text) {
    const experienceSection = text.toLowerCase().includes('experience') ? text : ''
    const mentions = this.countMentions(experienceSection || text, skill.name)
    if (mentions >= 2) return { score: 90, level: 'strong', count: mentions }
    if (mentions === 1) return { score: 60, level: 'moderate', count: mentions }
    return { score: 20, level: 'weak', count: mentions }
  }

  getVerbContext(text, skill) {
    const contextVerbs = ['developed', 'implemented', 'built', 'designed', 'led', 'used', 'applied', 'worked with']
    const matchingVerbs = contextVerbs.filter(verb => {
      const pattern = new RegExp(`${verb}[^.!?]*${skill}`, 'i')
      return pattern.test(text)
    })
    return {
      hasStrongContext: matchingVerbs.some(v => ['developed', 'implemented', 'built', 'designed', 'led'].includes(v)),
      verbs: matchingVerbs,
    }
  }

  classifyEvidenceLevel(mentionCount, projectSupport, experienceSupport, verbContext) {
    if (mentionCount >= 3 && (projectSupport.level === 'strong' || experienceSupport.level === 'strong')) return 'strong'
    if (mentionCount >= 2 && verbContext.hasStrongContext) return 'moderate'
    if (mentionCount >= 1) return 'limited'
    return 'mention_only'
  }

  calculateConfidence(evidenceLevel, mentionCount, projectSupport, experienceSupport) {
    const baseScores = { strong: 85, moderate: 65, limited: 40, mention_only: 20 }
    const supportBonus = (projectSupport.score + experienceSupport.score) / 40
    return Math.min(100, Math.round(baseScores[evidenceLevel] + supportBonus))
  }

  getEvidenceReason(level, mentionCount, projectSupport, experienceSupport) {
    const reasons = {
      strong: `Skill mentioned ${mentionCount}x in resume with strong project and experience support.`,
      moderate: `Skill appears ${mentionCount}x with some contextual evidence.`,
      limited: `Skill mentioned ${mentionCount}x in resume but lacks supporting evidence.`,
      mention_only: `Skill appears in list only — no supporting context found.`,
    }
    return reasons[level] || 'Insufficient evidence.'
  }

  generateSummary(skills) {
    const strong = skills.filter(s => s.evidenceLevel === 'strong').length
    const moderate = skills.filter(s => s.evidenceLevel === 'moderate').length
    const limited = skills.filter(s => s.evidenceLevel === 'limited').length
    const mention = skills.filter(s => s.evidenceLevel === 'mention_only').length
    if (strong + moderate >= skills.length * 0.7) return 'Strong skill credibility — most skills are well-supported.'
    if (limited + mention > skills.length * 0.5) return 'Weak skill credibility — many skills lack evidence.'
    return 'Moderate skill credibility — some skills need more evidence.'
  }

  generateRecommendations(skills) {
    const recs = []
    const weakSkills = skills.filter(s => s.evidenceLevel === 'mention_only' || s.evidenceLevel === 'limited')
    if (weakSkills.length > 0) {
      recs.push({
        priority: 'high',
        category: 'skill_evidence',
        issue: `${weakSkills.length} skills lack sufficient evidence`,
        recommendation: `Add project or experience context for: ${weakSkills.slice(0, 5).map(s => s.name).join(', ')}`,
        reason: 'Skills without evidence trigger recruiter skepticism',
      })
    }
    return recs
  }

  buildSkillProfile(skills) {
    const categories = {}
    for (const skill of skills) {
      if (!categories[skill.category]) categories[skill.category] = { total: 0, strong: 0, weak: 0 }
      categories[skill.category].total += 1
      if (skill.evidenceLevel === 'strong') categories[skill.category].strong += 1
      if (skill.evidenceLevel === 'mention_only' || skill.evidenceLevel === 'limited') categories[skill.category].weak += 1
    }
    return {
      totalCategories: Object.keys(categories).length,
      categories,
      distribution: Object.entries(categories).map(([name, data]) => ({
        category: name,
        total: data.total,
        strong: data.strong,
        weak: data.weak,
        healthScore: data.total > 0 ? Math.round((data.strong / data.total) * 100) : 0,
      })),
    }
  }

  getVisibility(skills) {
    const visible = skills.filter(s => s.evidenceLevel === 'strong' || s.evidenceLevel === 'moderate').length
    const percentage = skills.length > 0 ? Math.round((visible / skills.length) * 100) : 0
    return { score: percentage, visible, hidden: skills.length - visible }
  }

  getCredibility(skills) {
    const avgConfidence = skills.length > 0 ? Math.round(skills.reduce((sum, s) => sum + s.confidence, 0) / skills.length) : 0
    return { score: avgConfidence, level: avgConfidence >= 70 ? 'high' : avgConfidence >= 50 ? 'medium' : 'low' }
  }
}

module.exports = new SkillsEvidenceEngine()
