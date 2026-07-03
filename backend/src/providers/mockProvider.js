const AIProvider = require('./aiProvider');
const { deterministicScore, deterministicSeed } = require('../utils/deterministic');

class MockAIProvider extends AIProvider {
  constructor() {
    super('mock');
  }

  _scores(text) {
    const seed = deterministicSeed(text || 'default-resume')
    const s = (suffix) => deterministicScore(seed + suffix)
    return {
      atsScore: s('ats'),
      overallScore: s('overall'),
      keywordScore: s('keywords'),
      formattingScore: s('formatting'),
      readabilityScore: s('readability'),
      qualityScore: s('quality'),
      domainExperience: s('domain'),
      leadershipImpact: s('leadership'),
      technicalProwess: s('technical'),
      actionVerbScore: s('action'),
      quantificationScore: s('quant'),
    }
  }

  _keywords(seed) {
    const s = (suffix, found) => {
      const kw = ['javascript', 'react', 'node.js', 'typescript', 'sql', 'docker', 'aws', 'kubernetes', 'ci/cd', 'python', 'agile', 'rest', 'git'][deterministicScore(seed + suffix) % 13]
      return { keyword: kw, found, relevance: found ? 0.7 + Math.floor(deterministicScore(seed + suffix + 'r') % 30) / 100 : 0.3 }
    }
    return {
      matched: ['javascript', 'react', 'node.js', 'typescript', 'sql', 'python', 'agile', 'git'],
      missing: ['docker', 'aws', 'kubernetes', 'ci/cd'],
      totalKeywords: 20,
      matchedCount: 12,
    }
  }

  async analyzeResume(resumeContent, options = {}) {
    const text = typeof resumeContent === 'string' ? resumeContent : ''
    const seed = deterministicSeed(text)
    const scores = this._scores(text)

    return {
      ...scores,
      skillsMatch: this._keywords(seed),
      missingKeywords: [
        { keyword: 'docker', found: false, relevance: 0.85 },
        { keyword: 'aws', found: false, relevance: 0.75 },
        { keyword: 'javascript', found: true, relevance: 0.95 },
        { keyword: 'react', found: true, relevance: 0.90 },
        { keyword: 'node.js', found: true, relevance: 0.88 },
        { keyword: 'typescript', found: true, relevance: 0.82 },
        { keyword: 'sql', found: true, relevance: 0.78 },
        { keyword: 'ci/cd', found: false, relevance: 0.72 },
      ],
      missingSkills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD'],
      sectionCompleteness: [
        { section: 'Contact', status: 'Complete', score: 100 },
        { section: 'Summary', status: 'Complete', score: 85 },
        { section: 'Experience', status: 'Complete', score: 90 },
        { section: 'Education', status: 'Complete', score: 88 },
        { section: 'Skills', status: 'Complete', score: 75 },
        { section: 'Certifications', status: 'Missing', score: 0 },
        { section: 'Projects', status: 'Missing', score: 0 },
      ],
      strengths: {
        skills: ['JavaScript', 'React', 'Node.js'],
        experience: 'Strong software engineering background',
        education: 'Relevant degree in Computer Science',
        actionVerbs: ['Developed', 'Implemented', 'Designed', 'Optimized'],
        quantifiableMetrics: ['Increased efficiency by 30%', 'Reduced costs by 20%'],
      },
      weaknesses: [
        { area: 'Missing Keywords', suggestion: 'Add Docker, AWS, CI/CD keywords' },
        { area: 'Formatting', suggestion: 'Consider adding a certifications section' },
        { area: 'Content', suggestion: 'Include more quantifiable achievements' },
      ],
      suggestionsData: [
        { category: 'keywords', priority: 'high', original: 'No cloud keywords', suggestion: 'Add missing industry keywords: docker, aws, kubernetes', reasoning: 'These keywords are commonly searched by ATS systems for software engineering roles' },
        { category: 'formatting', priority: 'medium', original: 'Missing certifications section', suggestion: 'Consider adding a certifications section to improve completeness', reasoning: 'Certifications section can improve ATS score by 5-10 points' },
        { category: 'content', priority: 'low', original: 'Few quantifiable achievements', suggestion: 'Include more quantifiable achievements with percentages and metrics', reasoning: 'Quantified achievements improve readability score by 10-15%' },
      ],
      improvementSuggestions: [
        { category: 'keywords', severity: 'high', suggestion: 'Add missing industry keywords: docker, aws' },
        { category: 'formatting', severity: 'medium', suggestion: 'Consider adding a certifications section' },
        { category: 'content', severity: 'low', suggestion: 'Include more quantifiable achievements' },
      ],
      formattingAnalysis: {
        sections: ['contact', 'summary', 'experience', 'education', 'skills'],
        missing: ['certifications', 'projects'],
        layout: 'professional',
        readability: 'excellent',
        formattingScore: scores.formattingScore,
        structureScore: 78,
      },
      semanticAnalysis: {
        overallScore: scores.qualityScore,
        clarity: 82,
        relevance: 75,
        impact: 72,
        depth: 70,
        breadth: 76,
        domainExpertise: scores.domainExperience,
        industryFit: 74,
        suggestions: ['Use more action verbs', 'Quantify achievements'],
      },
      roleMatch: {
        title: 'Software Engineer',
        matchPercentage: scores.overallScore,
        suggestedRoles: ['Senior Developer', 'Full Stack Engineer'],
        matchedSkills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'SQL'],
        missingSkills: ['Docker', 'AWS', 'Kubernetes', 'CI/CD'],
        industryComparison: {
          percentile: 65,
          averageScore: 70,
          topScore: 95,
          ranking: 'Above Average',
        },
      },
      industryBenchmark: {
        overall: scores.overallScore,
        formatting: scores.formattingScore,
        keywords: scores.keywordScore,
        experience: scores.domainExperience,
        education: 76,
        projects: 68,
        certifications: 45,
        recommendations: [
          'Add certifications to improve baseline score',
          'Include more project details with technologies used',
          'Consider adding a professional summary section',
        ],
      },
      timeline: {
        totalYears: 8,
        jobChanges: 3,
        averageTenure: 2.5,
        gaps: [],
        stabilityScore: 85,
        careerProgression: 'Good – consistent upward trajectory',
      },
      keywordDensity: {
        total: 42,
        unique: 28,
        density: 0.035,
        topKeywords: [
          { word: 'JavaScript', frequency: 12, density: 0.012 },
          { word: 'React', frequency: 8, density: 0.008 },
          { word: 'Node.js', frequency: 6, density: 0.006 },
          { word: 'TypeScript', frequency: 5, density: 0.005 },
          { word: 'SQL', frequency: 4, density: 0.004 },
        ],
      },
      summary: 'Your resume is well-structured and demonstrates strong technical skills. Consider adding more industry-specific keywords and quantifying your achievements to improve your ATS score.',
      score: scores.overallScore,
      executiveSummary: 'Overall, this is a strong resume for software engineering roles. The technical skills section is comprehensive, and the experience descriptions use action verbs effectively. Key areas for improvement include adding cloud computing keywords and quantifying achievements with specific metrics.',
      verdict: 'Good – Competitive for most roles with targeted improvements',
      overallVerdict: 'Good',
    }
  }

  async compareResumeWithJob(resumeContent, jobDescription, options = {}) {
    const text = typeof resumeContent === 'string' ? resumeContent : ''
    const seed = deterministicSeed(text + (jobDescription || ''))
    const matchScore = deterministicScore(seed + 'match', 60, 95)
    return {
      matchScore,
      missingSkills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD'],
      recommendations: [
        'Add Docker and containerization experience',
        'Include cloud platform experience (AWS/GCP/Azure)',
        'Highlight CI/CD pipeline experience',
      ],
      matchedSkills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'SQL'],
      matchBreakdown: {
        technical: 75,
        experience: 80,
        education: 70,
        certifications: 50,
      },
      summary: `Your resume matches ${matchScore}% of the job requirements. Consider adding experience with Docker, Kubernetes, AWS, CI/CD.`,
    }
  }

  async healthCheck() {
    return true;
  }
}

module.exports = MockAIProvider;
