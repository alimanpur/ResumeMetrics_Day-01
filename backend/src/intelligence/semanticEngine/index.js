/**
 * Semantic Intelligence Engine
 * Evaluates the quality and impact of resume content
 * Analyzes experience descriptions, achievements, and communication quality
 */

class SemanticEngine {
  constructor() {
    // Experience quality indicators
    this.experienceIndicators = {
      leadership: [
        'led', 'led a team', 'managed', 'managed a team', 'supervised', 'directed',
        'orchestrated', 'spearheaded', 'headed', 'chaired', 'governed',
        'team lead', 'tech lead', 'project manager', 'program manager',
      ],
      ownership: [
        'owned', 'responsible for', 'accountable for', 'pioneered', 'initiated',
        'conceived', 'founded', 'established', 'created', 'built from scratch',
        'end-to-end', 'full ownership', 'complete ownership',
      ],
      communication: [
        'presented', 'communicated', 'documented', 'authored', 'published',
        'trained', 'mentored', 'coached', 'facilitated', 'negotiated',
        'liaised', 'coordinated with', 'collaborated with',
      ],
      impact: [
        'increased', 'decreased', 'improved', 'reduced', 'enhanced', 'optimized',
        'accelerated', 'streamlined', 'transformed', 'revolutionized',
        'delivered', 'achieved', 'exceeded', 'surpassed',
      ],
      problemSolving: [
        'solved', 'resolved', 'troubleshot', 'debugged', 'fixed', 'addressed',
        'overcame', 'navigated', 'mitigated', 'remediated', 'recovered',
        'analyzed', 'diagnosed', 'identified', 'discovered',
      ],
      innovation: [
        'innovated', 'pioneered', 'invented', 'designed', 'architected',
        'conceptualized', 'envisioned', 'imagined', 'created new',
        'developed novel', 'introduced', 'launched first',
      ],
      collaboration: [
        'collaborated', 'partnered', 'worked with', 'teamed with',
        'cross-functional', 'multi-disciplinary', 'stakeholder',
        'interdepartmental', 'inter-team', 'jointly',
      ],
    };

    // Achievement strength patterns
    this.achievementPatterns = {
      strong: [
        /\d+%/g, // Percentages
        /\$\d+[KMB]?/g, // Dollar amounts
        /\d+[KMB]?\+?/g, // Numbers with scale
        /\d+x/g, // Multipliers
        /\d+\s*(users|customers|clients|employees|team members|projects|products|transactions|requests)/gi,
        /top\s+\d+%/i, // Top percentile
        /#\d+/i, // Rankings
        /first\s+to/i, // First achievements
        /award/i, // Awards
        /patent/i, // Patents
      ],
      average: [
        /improved/i,
        /developed/i,
        /implemented/i,
        /created/i,
        /designed/i,
        /built/i,
        /launched/i,
      ],
      weak: [
        /responsible\s+for/i,
        /worked\s+on/i,
        /helped\s+with/i,
        /assisted\s+in/i,
        /participated\s+in/i,
        /involved\s+in/i,
        /tasked\s+with/i,
        /duties\s+included/i,
      ],
    };

    // Business value indicators
    this.businessValueKeywords = {
      revenue: ['revenue', 'sales', 'income', 'earnings', 'profit', 'roi', 'return on investment'],
      cost: ['cost', 'expense', 'budget', 'savings', 'reduced costs', 'cut costs'],
      efficiency: ['efficiency', 'productivity', 'throughput', 'performance', 'optimization'],
      growth: ['growth', 'scalability', 'expansion', 'market share', 'user growth'],
      quality: ['quality', 'reliability', 'uptime', 'availability', 'satisfaction', 'nps'],
      risk: ['risk', 'compliance', 'security', 'audit', 'governance'],
    };
  }

  /**
   * Perform comprehensive semantic analysis
   * @param {Object} normalizedDoc - Normalized document
   * @returns {Object} Semantic analysis results
   */
  analyze(normalizedDoc) {
    if (!normalizedDoc || !normalizedDoc.cleanedText) {
      return this.getEmptyAnalysis();
    }

    const { cleanedText, sections, metadata } = normalizedDoc;

    // Analyze different dimensions
    const experienceQuality = this.analyzeExperienceQuality(cleanedText, sections);
    const leadership = this.analyzeLeadership(cleanedText, sections);
    const ownership = this.analyzeOwnership(cleanedText, sections);
    const communication = this.analyzeCommunication(cleanedText, sections);
    const impact = this.analyzeImpact(cleanedText, sections);
    const problemSolving = this.analyzeProblemSolving(cleanedText, sections);
    const achievements = this.analyzeAchievements(cleanedText, sections);
    const businessValue = this.analyzeBusinessValue(cleanedText, sections);

    // Calculate overall semantic score
    const overallScore = this.calculateOverallScore({
      experienceQuality,
      leadership,
      ownership,
      communication,
      impact,
      problemSolving,
      achievements,
      businessValue,
    });

    // Generate insights
    const insights = this.generateInsights({
      experienceQuality,
      leadership,
      ownership,
      communication,
      impact,
      problemSolving,
      achievements,
      businessValue,
    });

    // Generate recommendations
    const recommendations = this.generateRecommendations({
      experienceQuality,
      leadership,
      ownership,
      communication,
      impact,
      problemSolving,
      achievements,
      businessValue,
    });

    return {
      overallScore,
      dimensions: {
        experienceQuality,
        leadership,
        ownership,
        communication,
        impact,
        problemSolving,
        achievements,
        businessValue,
      },
      insights,
      recommendations,
      analyzedAt: new Date().toISOString(),
    };
  }

  /**
   * Analyze experience quality
   */
  analyzeExperienceQuality(text, sections) {
    const experienceSection = sections.find(s => s.type === 'experience');
    const content = experienceSection ? experienceSection.content : text;

    const lowerContent = content.toLowerCase();
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);

    // Check for specific quality indicators
    const hasSpecificTechnologies = this.checkForSpecificTechnologies(content);
    const hasQuantifiedResults = this.checkForQuantifiedResults(content);
    const hasProgression = this.checkForProgression(content);
    const hasActionVerbs = this.checkForActionVerbs(content);
    const hasContext = this.checkForContext(content);

    // Calculate quality score
    let score = 0;
    const maxScore = 100;

    score += hasSpecificTechnologies ? 20 : 0;
    score += hasQuantifiedResults ? 25 : 0;
    score += hasProgression ? 15 : 0;
    score += hasActionVerbs ? 20 : 0;
    score += hasContext ? 20 : 0;

    // Bonus for length and detail
    if (sentences.length >= 5) score += 10;
    if (sentences.length >= 10) score += 10;

    const normalizedScore = Math.min(maxScore, score);

    return {
      score: normalizedScore,
      grade: this.getGrade(normalizedScore),
      hasSpecificTechnologies,
      hasQuantifiedResults,
      hasProgression,
      hasActionVerbs,
      hasContext,
      sentenceCount: sentences.length,
      details: this.getExperienceQualityDetails(content),
    };
  }

  checkForSpecificTechnologies(content) {
    const techPatterns = [
      /\b(react|angular|vue|node|python|java|aws|azure|docker|kubernetes|sql|mongodb|redis)\b/i,
      /\b(api|rest|graphql|microservices|ci\/cd|devops|agile|scrum)\b/i,
    ];

    const matches = techPatterns.flatMap(pattern => content.match(pattern) || []);
    return matches.length >= 3;
  }

  checkForQuantifiedResults(content) {
    const patterns = [
      /\d+%/,
      /\$\d+[KMB]?/,
      /\d+[KMB]?\+?/,
      /\d+x/,
    ];

    const matches = patterns.flatMap(pattern => content.match(pattern) || []);
    return matches.length >= 2;
  }

  checkForProgression(content) {
    // Look for indicators of career progression
    const progressionPatterns = [
      /promoted/i,
      /advanced/i,
      /progressed/i,
      /senior/i,
      /lead/i,
      /principal/i,
      /(20\d{2})\s*[-–]\s*(20\d{2}|present)/gi,
    ];

    const matches = progressionPatterns.flatMap(pattern => content.match(pattern) || []);
    return matches.length >= 2;
  }

  checkForActionVerbs(content) {
    const lowerContent = content.toLowerCase();
    const actionVerbs = [
      'achieved', 'improved', 'trained', 'managed', 'created', 'resolved',
      'developed', 'launched', 'led', 'increased', 'decreased', 'optimized',
      'designed', 'implemented', 'delivered', 'executed', 'coordinated',
    ];

    return actionVerbs.filter(verb => lowerContent.includes(verb)).length >= 3;
  }

  checkForContext(content) {
    // Check if there's context about the role/company
    const contextPatterns = [
      /at\s+[A-Z][a-zA-Z\s]+/i,
      /for\s+[A-Z][a-zA-Z\s]+/i,
      /with\s+[A-Z][a-zA-Z\s]+/i,
      /\d+\+?\s*(years?|months?)/i,
    ];

    const matches = contextPatterns.flatMap(pattern => content.match(pattern) || []);
    return matches.length >= 2;
  }

  getExperienceQualityDetails(content) {
    const details = {
      technicalDepth: this.assessTechnicalDepth(content),
      scope: this.assessScope(content),
      clarity: this.assessClarity(content),
      specificity: this.assessSpecificity(content),
    };

    return details;
  }

  assessTechnicalDepth(content) {
    const techTerms = content.match(/\b[A-Z][a-zA-Z]+\b/g) || [];
    const uniqueTech = [...new Set(techTerms)];
    return {
      score: Math.min(100, uniqueTech.length * 5),
      termsFound: uniqueTech.length,
      examples: uniqueTech.slice(0, 5),
    };
  }

  assessScope(content) {
    const scopeIndicators = [
      /team\s+of\s+\d+/i,
      /department/i,
      /organization/i,
      /company\s*[-–]\s*\d+/i,
      /budget\s+of/i,
      /managed\s+\$\d+/i,
    ];

    const matches = scopeIndicators.flatMap(p => content.match(p) || []);
    return {
      score: Math.min(100, matches.length * 25),
      indicators: matches.length,
      examples: matches.slice(0, 3),
    };
  }

  assessClarity(content) {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const avgLength = content.split(/\s+/).length / Math.max(sentences.length, 1);

    let score = 100;
    if (avgLength > 25) score -= 20;
    if (avgLength > 35) score -= 20;

    return {
      score: Math.max(0, score),
      averageSentenceLength: Math.round(avgLength),
      isClear: avgLength < 25,
    };
  }

  assessSpecificity(content) {
    const vagueTerms = ['various', 'several', 'many', 'some', 'multiple', 'numerous'];
    const lowerContent = content.toLowerCase();

    const vagueCount = vagueTerms.filter(term => lowerContent.includes(term)).length;

    return {
      score: Math.max(0, 100 - vagueCount * 15),
      vagueTermsFound: vagueCount,
      isSpecific: vagueCount < 2,
    };
  }

  /**
   * Analyze leadership capabilities
   */
  analyzeLeadership(text, sections) {
    const experienceSection = sections.find(s => s.type === 'experience');
    const content = experienceSection ? experienceSection.content : text;
    const lowerContent = content.toLowerCase();

    const indicators = this.experienceIndicators.leadership;
    const found = indicators.filter(indicator => lowerContent.includes(indicator));

    // Check for team size mentions
    const teamSizePattern = /team\s+of\s+(\d+)/i;
    const teamSizeMatch = content.match(teamSizePattern);
    const teamSize = teamSizeMatch ? parseInt(teamSizeMatch[1]) : 0;

    // Check for leadership titles
    const leadershipTitles = ['manager', 'director', 'lead', 'head', 'chief', 'vp', 'president'];
    const hasLeadershipTitle = leadershipTitles.some(title => lowerContent.includes(title));

    const score = this.calculateLeadershipScore(found.length, teamSize, hasLeadershipTitle);

    return {
      score,
      grade: this.getGrade(score),
      indicators: found,
      indicatorCount: found.length,
      teamSize,
      hasLeadershipTitle,
      evidence: this.extractEvidence(content, found),
    };
  }

  calculateLeadershipScore(indicatorCount, teamSize, hasTitle) {
    let score = 0;
    score += Math.min(40, indicatorCount * 10);
    score += teamSize > 0 ? Math.min(30, teamSize * 3) : 0;
    score += hasTitle ? 30 : 0;
    return Math.min(100, score);
  }

  /**
   * Analyze ownership and initiative
   */
  analyzeOwnership(text, sections) {
    const experienceSection = sections.find(s => s.type === 'experience');
    const content = experienceSection ? experienceSection.content : text;
    const lowerContent = content.toLowerCase();

    const indicators = this.experienceIndicators.ownership;
    const found = indicators.filter(indicator => lowerContent.includes(indicator));

    // Check for "from scratch" or "built" indicators
    const fromScratch = /from\s+scratch|built\s+from\s+ground|started\s+from\s+zero/i.test(content);

    // Check for end-to-end ownership
    const endToEnd = /end[- ]to[- ]end|full\s+ownership|complete\s+ownership/i.test(content);

    const score = this.calculateOwnershipScore(found.length, fromScratch, endToEnd);

    return {
      score,
      grade: this.getGrade(score),
      indicators: found,
      indicatorCount: found.length,
      fromScratch,
      endToEnd,
      evidence: this.extractEvidence(content, found),
    };
  }

  calculateOwnershipScore(indicatorCount, fromScratch, endToEnd) {
    let score = 0;
    score += Math.min(50, indicatorCount * 10);
    score += fromScratch ? 25 : 0;
    score += endToEnd ? 25 : 0;
    return Math.min(100, score);
  }

  /**
   * Analyze communication skills
   */
  analyzeCommunication(text, sections) {
    const experienceSection = sections.find(s => s.type === 'experience');
    const content = experienceSection ? experienceSection.content : text;
    const lowerContent = content.toLowerCase();

    const indicators = this.experienceIndicators.communication;
    const found = indicators.filter(indicator => lowerContent.includes(indicator));

    // Check for documentation
    const documentation = /documented|wrote|authored|published|created\s+documentation/i.test(content);

    // Check for training/mentoring
    const training = /trained|mentored|coached|taught|onboarded/i.test(content);

    // Check for presentations
    const presentations = /presented|demonstrated|showcased|pitched/i.test(content);

    const score = this.calculateCommunicationScore(found.length, documentation, training, presentations);

    return {
      score,
      grade: this.getGrade(score),
      indicators: found,
      indicatorCount: found.length,
      documentation,
      training,
      presentations,
      evidence: this.extractEvidence(content, found),
    };
  }

  calculateCommunicationScore(indicatorCount, documentation, training, presentations) {
    let score = 0;
    score += Math.min(40, indicatorCount * 10);
    score += documentation ? 20 : 0;
    score += training ? 20 : 0;
    score += presentations ? 20 : 0;
    return Math.min(100, score);
  }

  /**
   * Analyze impact and results
   */
  analyzeImpact(text, sections) {
    const experienceSection = sections.find(s => s.type === 'experience');
    const content = experienceSection ? experienceSection.content : text;

    const indicators = this.experienceIndicators.impact;
    const lowerContent = content.toLowerCase();
    const found = indicators.filter(indicator => lowerContent.includes(indicator));

    // Count quantified achievements
    const quantifiedAchievements = this.countQuantifiedAchievements(content);

    // Check for before/after patterns
    const beforeAfter = /from\s+[\d\s]+to\s+[\d\s]+|increased\s+from|reduced\s+from/i.test(content);

    const score = this.calculateImpactScore(found.length, quantifiedAchievements, beforeAfter);

    return {
      score,
      grade: this.getGrade(score),
      indicators: found,
      indicatorCount: found.length,
      quantifiedAchievements,
      beforeAfter,
      evidence: this.extractEvidence(content, found),
    };
  }

  calculateImpactScore(indicatorCount, quantifiedAchievements, beforeAfter) {
    let score = 0;
    score += Math.min(30, indicatorCount * 8);
    score += Math.min(40, quantifiedAchievements * 8);
    score += beforeAfter ? 30 : 0;
    return Math.min(100, score);
  }

  countQuantifiedAchievements(content) {
    const patterns = [
      /\d+%/g,
      /\$\d+[KMB]?/g,
      /\d+[KMB]?\+?/g,
      /\d+x/g,
    ];

    const matches = patterns.flatMap(pattern => content.match(pattern) || []);
    return matches.length;
  }

  /**
   * Analyze problem-solving skills
   */
  analyzeProblemSolving(text, sections) {
    const experienceSection = sections.find(s => s.type === 'experience');
    const content = experienceSection ? experienceSection.content : text;
    const lowerContent = content.toLowerCase();

    const indicators = this.experienceIndicators.problemSolving;
    const found = indicators.filter(indicator => lowerContent.includes(indicator));

    // Check for complex problem indicators
    const complexProblems = /challenge|challenging|complex|difficult|critical|urgent|crisis/i.test(content);

    // Check for solution-oriented language
    const solutionOriented = /solution|solved|resolved|fixed|addressed|overcame/i.test(content);

    const score = this.calculateProblemSolvingScore(found.length, complexProblems, solutionOriented);

    return {
      score,
      grade: this.getGrade(score),
      indicators: found,
      indicatorCount: found.length,
      complexProblems,
      solutionOriented,
      evidence: this.extractEvidence(content, found),
    };
  }

  calculateProblemSolvingScore(indicatorCount, complexProblems, solutionOriented) {
    let score = 0;
    score += Math.min(40, indicatorCount * 10);
    score += complexProblems ? 30 : 0;
    score += solutionOriented ? 30 : 0;
    return Math.min(100, score);
  }

  /**
   * Analyze achievements
   */
  analyzeAchievements(text, sections) {
    const experienceSection = sections.find(s => s.type === 'experience');
    const content = experienceSection ? experienceSection.content : text;

    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const achievements = [];

    // Classify each sentence
    for (const sentence of sentences) {
      const classification = this.classifyAchievement(sentence);
      if (classification) {
        achievements.push({
          text: sentence.trim(),
          ...classification,
        });
      }
    }

    // Calculate statistics
    const strong = achievements.filter(a => a.strength === 'strong').length;
    const average = achievements.filter(a => a.strength === 'average').length;
    const weak = achievements.filter(a => a.strength === 'weak').length;

    const score = this.calculateAchievementsScore(strong, average, weak, achievements.length);

    return {
      score,
      grade: this.getGrade(score),
      total: achievements.length,
      strong,
      average,
      weak,
      strongPercentage: achievements.length > 0 ? Math.round((strong / achievements.length) * 100) : 0,
      achievements: achievements.slice(0, 10), // Top 10
      rewriteCandidates: achievements.filter(a => a.strength === 'weak').slice(0, 5),
    };
  }

  classifyAchievement(sentence) {
    const lowerSentence = sentence.toLowerCase().trim();
    if (lowerSentence.length < 10) return null;

    // Check for strong patterns
    const strongMatches = this.achievementPatterns.strong.flatMap(p => lowerSentence.match(p) || []);
    if (strongMatches.length > 0) {
      return {
        strength: 'strong',
        reason: 'Contains quantifiable metrics and specific results',
        metrics: strongMatches,
      };
    }

    // Check for average patterns
    const averageMatches = this.achievementPatterns.average.flatMap(p => lowerSentence.match(p) || []);
    if (averageMatches.length > 0) {
      return {
        strength: 'average',
        reason: 'Uses action verbs but lacks quantifiable results',
        metrics: [],
      };
    }

    // Check for weak patterns
    const weakMatches = this.achievementPatterns.weak.flatMap(p => lowerSentence.match(p) || []);
    if (weakMatches.length > 0) {
      return {
        strength: 'weak',
        reason: 'Uses passive or vague language',
        metrics: [],
      };
    }

    return null;
  }

  calculateAchievementsScore(strong, average, weak, total) {
    if (total === 0) return 0;

    const weightedScore = (strong * 100) + (average * 60) + (weak * 30);
    return Math.round((weightedScore / total) * (total / 10)); // Normalize
  }

  /**
   * Analyze business value
   */
  analyzeBusinessValue(text, sections) {
    const experienceSection = sections.find(s => s.type === 'experience');
    const content = experienceSection ? experienceSection.content : text;
    const lowerContent = content.toLowerCase();

    const businessValue = {};

    for (const [category, keywords] of Object.entries(this.businessValueKeywords)) {
      const found = keywords.filter(kw => lowerContent.includes(kw));
      businessValue[category] = {
        keywords: found,
        count: found.length,
        hasValue: found.length > 0,
      };
    }

    // Calculate overall business value score
    const categoriesWithValue = Object.values(businessValue).filter(bv => bv.hasValue).length;
    const totalCategories = Object.keys(businessValue).length;
    const score = Math.round((categoriesWithValue / totalCategories) * 100);

    return {
      score,
      grade: this.getGrade(score),
      categories: businessValue,
      categoriesWithValue,
      totalCategories,
      demonstratesBusinessImpact: categoriesWithValue >= 3,
    };
  }

  /**
   * Calculate overall semantic score
   */
  calculateOverallScore(dimensions) {
    const weights = {
      experienceQuality: 0.20,
      leadership: 0.15,
      ownership: 0.15,
      communication: 0.10,
      impact: 0.20,
      problemSolving: 0.10,
      achievements: 0.10,
    };

    let weightedScore = 0;
    for (const [dimension, weight] of Object.entries(weights)) {
      if (dimensions[dimension]) {
        weightedScore += dimensions[dimension].score * weight;
      }
    }

    return Math.round(weightedScore);
  }

  /**
   * Generate insights
   */
  generateInsights(dimensions) {
    const insights = [];

    // Identify strengths
    const strengths = Object.entries(dimensions)
      .filter(([_, dim]) => dim.score >= 80)
      .map(([key, _]) => key);

    if (strengths.length > 0) {
      insights.push({
        type: 'strength',
        message: `Strong ${strengths.join(' and ')} demonstrated in resume`,
        dimensions: strengths,
      });
    }

    // Identify weaknesses
    const weaknesses = Object.entries(dimensions)
      .filter(([_, dim]) => dim.score < 50)
      .map(([key, _]) => key);

    if (weaknesses.length > 0) {
      insights.push({
        type: 'weakness',
        message: `Areas for improvement: ${weaknesses.join(', ')}`,
        dimensions: weaknesses,
      });
    }

    // Identify gaps
    const gaps = Object.entries(dimensions)
      .filter(([_, dim]) => dim.score >= 50 && dim.score < 70)
      .map(([key, _]) => key);

    if (gaps.length > 0) {
      insights.push({
        type: 'gap',
        message: `Moderate performance in: ${gaps.join(', ')}`,
        dimensions: gaps,
      });
    }

    return insights;
  }

  /**
   * Generate recommendations
   */
  generateRecommendations(dimensions) {
    const recommendations = [];

    // Experience quality
    if (dimensions.experienceQuality.score < 70) {
      const details = dimensions.experienceQuality.details;
      if (!details.technicalDepth || details.technicalDepth.score < 50) {
        recommendations.push({
          dimension: 'experienceQuality',
          priority: 'high',
          recommendation: 'Add more specific technologies and tools to your experience descriptions',
          reason: 'Technical depth is insufficient - recruiters look for specific technology mentions',
        });
      }
      if (!details.specificity || !details.specificity.isSpecific) {
        recommendations.push({
          dimension: 'experienceQuality',
          priority: 'high',
          recommendation: 'Replace vague terms like "various", "several", "many" with specific numbers',
          reason: 'Specificity demonstrates clarity of thought and attention to detail',
        });
      }
    }

    // Leadership
    if (dimensions.leadership.score < 60) {
      recommendations.push({
        dimension: 'leadership',
        priority: 'high',
        recommendation: 'Highlight leadership experience and team management',
        reason: 'Leadership experience is highly valued, even for individual contributor roles',
      });
    }

    // Impact
    if (dimensions.impact.score < 70) {
      recommendations.push({
        dimension: 'impact',
        priority: 'critical',
        recommendation: 'Add quantifiable achievements with metrics (%, $, numbers)',
        reason: 'Quantified impact demonstrates your ability to drive results and adds credibility',
      });
    }

    // Achievements
    if (dimensions.achievements.strongPercentage < 50) {
      recommendations.push({
        dimension: 'achievements',
        priority: 'high',
        recommendation: 'Convert weak bullet points to strong, metric-driven statements',
        reason: 'Strong achievements significantly improve resume effectiveness',
      });
    }

    // Problem solving
    if (dimensions.problemSolving.score < 60) {
      recommendations.push({
        dimension: 'problemSolving',
        priority: 'medium',
        recommendation: 'Highlight problem-solving experiences and complex challenges overcome',
        reason: 'Problem-solving skills are critical for most technical roles',
      });
    }

    return recommendations;
  }

  /**
   * Extract evidence from text
   */
  extractEvidence(text, indicators) {
    const evidence = [];
    const lowerText = text.toLowerCase();

    for (const indicator of indicators.slice(0, 5)) {
      const index = lowerText.indexOf(indicator);
      if (index !== -1) {
        const start = Math.max(0, index - 30);
        const end = Math.min(text.length, index + indicator.length + 50);
        evidence.push(text.substring(start, end).trim());
      }
    }

    return evidence;
  }

  /**
   * Get grade from score
   */
  getGrade(score) {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  }

  /**
   * Get empty analysis
   */
  getEmptyAnalysis() {
    return {
      overallScore: 0,
      dimensions: {},
      insights: [],
      recommendations: [],
      analyzedAt: new Date().toISOString(),
    };
  }
}

module.exports = new SemanticEngine();