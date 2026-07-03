/**
 * Achievement Engine
 * Detects, classifies, and evaluates achievements in resumes
 * Identifies quantifiable results and strong bullet points
 */

class AchievementEngine {
  constructor() {
    // Achievement type patterns
    this.achievementTypes = {
      revenue: {
        patterns: [/\$\d+[KMB]?/g, /revenue\s+\d+%/i, /sales\s+\d+%/i, /profit\s+\d+%/i],
        weight: 10,
        label: 'Revenue Generation',
      },
      growth: {
        patterns: [/\d+%\s*growth/i, /increased\s+\d+%/i, /grew\s+\d+%/i, /scaled\s+\d+x/i],
        weight: 9,
        label: 'Growth',
      },
      efficiency: {
        patterns: [/\d+%\s*reduction/i, /improved\s+\d+%/i, /optimized\s+\d+%/i, /reduced\s+time\s+by\s+\d+/i],
        weight: 8,
        label: 'Efficiency Improvement',
      },
      cost: {
        patterns: [/\$\d+[KMB]?\s*savings/i, /saved\s+\$\d+/i, /cut\s+costs\s+\d+%/i, /reduced\s+budget\s+by/i],
        weight: 9,
        label: 'Cost Savings',
      },
      scale: {
        patterns: [/\d+\s*(users|customers|clients|employees)/i, /served\s+\d+/i, /managed\s+\d+/i],
        weight: 8,
        label: 'Scale',
      },
      leadership: {
        patterns: [/led\s+team\s+of\s+\d+/i, /managed\s+\d+\s+people/i, /supervised\s+\d+/i],
        weight: 7,
        label: 'Leadership',
      },
      time: {
        patterns: [/\d+%\s*faster/i, /reduced\s+time\s+by/i, /accelerated\s+\d+%/i, /shortened\s+by\s+\d+/i],
        weight: 7,
        label: 'Time Reduction',
      },
      quality: {
        patterns: [/\d+%\s*improvement/i, /quality\s+\d+%/i, /uptime\s+\d+%/i, /reliability\s+\d+%/i],
        weight: 7,
        label: 'Quality Improvement',
      },
    };

    // Weak achievement patterns
    this.weakPatterns = [
      /responsible\s+for/i,
      /worked\s+on/i,
      /helped\s+with/i,
      /assisted\s+in/i,
      /participated\s+in/i,
      /involved\s+in/i,
      /tasked\s+with/i,
      /duties\s+included/i,
      /various\s+tasks/i,
      /multiple\s+projects/i,
    ];

    // Strong action verbs
    this.strongVerbs = [
      'achieved', 'improved', 'trained', 'managed', 'created', 'resolved',
      'developed', 'launched', 'led', 'increased', 'decreased', 'optimized',
      'designed', 'implemented', 'delivered', 'executed', 'coordinated',
      'analyzed', 'built', 'established', 'streamlined', 'spearheaded',
      'orchestrated', 'pioneered', 'transformed', 'accelerated', 'drove',
    ];
  }

  /**
   * Analyze all achievements in resume
   * @param {Object} normalizedDoc - Normalized document
   * @returns {Object} Achievement analysis
   */
  analyze(normalizedDoc) {
    if (!normalizedDoc || !normalizedDoc.cleanedText) {
      return this.getEmptyAnalysis();
    }

    const { cleanedText, sections } = normalizedDoc;
    const experienceSection = sections.find(s => s.type === 'experience');
    const content = experienceSection ? experienceSection.content : cleanedText;

    // Extract achievements
    const achievements = this.extractAchievements(content);

    // Classify achievements
    const classified = this.classifyAchievements(achievements);

    // Detect achievement types
    const typesDetected = this.detectAchievementTypes(content);

    // Calculate scores
    const scores = this.calculateScores(classified, typesDetected);

    // Generate rewrite candidates
    const rewriteCandidates = this.generateRewriteCandidates(classified);

    // Generate recommendations
    const recommendations = this.generateRecommendations(scores, classified, typesDetected);

    return {
      ...scores,
      achievements: classified,
      typesDetected,
      rewriteCandidates,
      recommendations,
      analyzedAt: new Date().toISOString(),
    };
  }

  /**
   * Extract achievement statements from text
   */
  extractAchievements(text) {
    const sentences = text.split(/[.!?\n]+/).filter(s => s.trim().length > 10);
    const achievements = [];

    for (const sentence of sentences) {
      const trimmed = sentence.trim();
      if (this.isAchievementStatement(trimmed)) {
        achievements.push(trimmed);
      }
    }

    return achievements;
  }

  /**
   * Check if sentence is an achievement statement
   */
  isAchievementStatement(sentence) {
    const lower = sentence.toLowerCase();

    // Must start with action verb or have quantifiable element
    const startsWithActionVerb = this.strongVerbs.some(verb =>
      lower.startsWith(verb)
    );

    const hasQuantifiable = /\d+%|\$\d+|\d+[KMB]?|\d+x/.test(sentence);

    // Must not be weak
    const isWeak = this.weakPatterns.some(pattern => pattern.test(sentence));

    return (startsWithActionVerb || hasQuantifiable) && !isWeak;
  }

  /**
   * Classify achievements by strength
   */
  classifyAchievements(achievements) {
    return achievements.map(achievement => {
      const classification = this.classifySingleAchievement(achievement);
      return {
        text: achievement,
        ...classification,
      };
    });
  }

  /**
   * Classify a single achievement
   */
  classifySingleAchievement(achievement) {
    const lower = achievement.toLowerCase();

    // Check for strong indicators
    const strongIndicators = this.countStrongIndicators(achievement);
    const hasMetrics = this.hasQuantifiableMetrics(achievement);
    const hasActionVerb = this.hasStrongActionVerb(achievement);
    const hasContext = this.hasContext(achievement);

    // Calculate strength
    let strength = 'weak';
    let reason = '';
    let score = 0;

    if (hasMetrics) score += 40;
    if (hasActionVerb) score += 30;
    if (strongIndicators > 0) score += 20;
    if (hasContext) score += 10;

    if (score >= 70) {
      strength = 'strong';
      reason = 'Contains quantifiable metrics, strong action verb, and clear context';
    } else if (score >= 40) {
      strength = 'average';
      reason = 'Has some strong elements but could be improved with metrics';
    } else {
      strength = 'weak';
      reason = 'Lacks quantifiable metrics or uses weak language';
    }

    return {
      strength,
      reason,
      score,
      hasMetrics,
      hasActionVerb,
      hasContext,
      metrics: this.extractMetrics(achievement),
      actionVerb: this.extractActionVerb(achievement),
    };
  }

  /**
   * Count strong indicators
   */
  countStrongIndicators(achievement) {
    const indicators = [
      /increased|decreased|improved|reduced|enhanced/i,
      /led|managed|directed|orchestrated/i,
      /designed|developed|created|built/i,
      /delivered|launched|implemented/i,
    ];

    return indicators.filter(pattern => pattern.test(achievement)).length;
  }

  /**
   * Check for quantifiable metrics
   */
  hasQuantifiableMetrics(achievement) {
    const patterns = [
      /\d+%/,
      /\$\d+[KMB]?/,
      /\d+[KMB]?\+?/,
      /\d+x/,
      /\d+\s*(users|customers|clients|employees|team members|projects)/i,
    ];

    return patterns.some(pattern => pattern.test(achievement));
  }

  /**
   * Extract metrics from achievement
   */
  extractMetrics(achievement) {
    const patterns = [
      /\d+%/g,
      /\$\d+[KMB]?/g,
      /\d+[KMB]?\+?/g,
      /\d+x/g,
    ];

    const metrics = [];
    for (const pattern of patterns) {
      const matches = achievement.match(pattern) || [];
      metrics.push(...matches);
    }

    return [...new Set(metrics)];
  }

  /**
   * Check for strong action verb
   */
  hasStrongActionVerb(achievement) {
    const lower = achievement.toLowerCase();
    return this.strongVerbs.some(verb => lower.startsWith(verb));
  }

  /**
   * Extract action verb
   */
  extractActionVerb(achievement) {
    const lower = achievement.toLowerCase().trim();
    for (const verb of this.strongVerbs) {
      if (lower.startsWith(verb)) {
        return verb;
      }
    }
    return null;
  }

  /**
   * Check for context (company, role, timeframe)
   */
  hasContext(achievement) {
    const contextPatterns = [
      /at\s+[A-Z][a-zA-Z\s]+/i,
      /for\s+[A-Z][a-zA-Z\s]+/i,
      /with\s+[A-Z][a-zA-Z\s]+/i,
      /\d+\+?\s*(years?|months?)/i,
      /as\s+(a|an)\s+[a-z\s]+/i,
    ];

    return contextPatterns.some(pattern => pattern.test(achievement));
  }

  /**
   * Detect achievement types
   */
  detectAchievementTypes(text) {
    const detected = [];

    for (const [typeKey, typeConfig] of Object.entries(this.achievementTypes)) {
      const matches = [];
      for (const pattern of typeConfig.patterns) {
        const patternMatches = text.match(pattern) || [];
        matches.push(...patternMatches);
      }

      if (matches.length > 0) {
        detected.push({
          type: typeKey,
          label: typeConfig.label,
          weight: typeConfig.weight,
          count: matches.length,
          examples: [...new Set(matches)].slice(0, 5),
        });
      }
    }

    // Sort by weight
    detected.sort((a, b) => b.weight - a.weight);

    return {
      types: detected,
      totalTypes: detected.length,
      totalAchievements: detected.reduce((sum, t) => sum + t.count, 0),
    };
  }

  /**
   * Calculate achievement scores
   */
  calculateScores(classified, typesDetected) {
    const total = classified.length;
    if (total === 0) {
      return {
        overallScore: 0,
        strongCount: 0,
        averageCount: 0,
        weakCount: 0,
        strongPercentage: 0,
        averagePercentage: 0,
        weakPercentage: 0,
        achievementDensity: 0,
        typeCoverage: 0,
      };
    }

    const strong = classified.filter(a => a.strength === 'strong').length;
    const average = classified.filter(a => a.strength === 'average').length;
    const weak = classified.filter(a => a.strength === 'weak').length;

    const strongPercentage = Math.round((strong / total) * 100);
    const averagePercentage = Math.round((average / total) * 100);
    const weakPercentage = Math.round((weak / total) * 100);

    // Overall score (weighted)
    const overallScore = Math.round(
      (strong * 100 + average * 60 + weak * 30) / total
    );

    // Achievement density (achievements per 100 words)
    const wordCount = classified.reduce((sum, a) => sum + a.text.split(/\s+/).length, 0);
    const achievementDensity = Math.round((total / wordCount) * 100);

    // Type coverage
    const maxTypes = Object.keys(this.achievementTypes).length;
    const typeCoverage = Math.round((typesDetected.totalTypes / maxTypes) * 100);

    return {
      overallScore,
      strongCount: strong,
      averageCount: average,
      weakCount: weak,
      strongPercentage,
      averagePercentage,
      weakPercentage,
      achievementDensity,
      typeCoverage,
      grade: this.getGrade(overallScore),
    };
  }

  /**
   * Generate rewrite candidates
   */
  generateRewriteCandidates(classified) {
    return classified
      .filter(a => a.strength === 'weak')
      .slice(0, 5)
      .map(achievement => ({
        original: achievement.text,
        issues: this.identifyIssues(achievement.text),
        suggestions: this.generateSuggestions(achievement.text),
      }));
  }

  /**
   * Identify issues in achievement
   */
  identifyIssues(text) {
    const issues = [];
    const lower = text.toLowerCase();

    if (this.weakPatterns.some(p => p.test(text))) {
      issues.push('Uses weak or passive language');
    }

    if (!this.hasQuantifiableMetrics(text)) {
      issues.push('Lacks quantifiable metrics');
    }

    if (!this.hasStrongActionVerb(text)) {
      issues.push('Does not start with strong action verb');
    }

    if (!this.hasContext(text)) {
      issues.push('Missing context (company, role, or timeframe)');
    }

    return issues;
  }

  /**
   * Generate improvement suggestions
   */
  generateSuggestions(text) {
    const suggestions = [];
    const lower = text.toLowerCase();

    // Suggest action verb replacement
    if (!this.hasStrongActionVerb(text)) {
      const weakStarters = ['responsible for', 'worked on', 'helped with', 'assisted in'];
      const matchedWeak = weakStarters.find(w => lower.startsWith(w));
      if (matchedWeak) {
        suggestions.push({
          type: 'action_verb',
          current: matchedWeak,
          suggested: this.suggestActionVerb(text),
          reason: 'Replace weak phrase with strong action verb',
        });
      }
    }

    // Suggest adding metrics
    if (!this.hasQuantifiableMetrics(text)) {
      suggestions.push({
        type: 'metrics',
        suggestion: 'Add quantifiable metrics (%, $, numbers) to demonstrate impact',
        examples: [
          'Increased efficiency by 25%',
          'Managed budget of $500K',
          'Led team of 10 engineers',
        ],
      });
    }

    // Suggest adding context
    if (!this.hasContext(text)) {
      suggestions.push({
        type: 'context',
        suggestion: 'Add context about the role, company, or timeframe',
        examples: [
          'At [Company Name] as [Role]',
          'During 2022-2024 period',
          'For enterprise clients',
        ],
      });
    }

    return suggestions;
  }

  /**
   * Suggest action verb
   */
  suggestActionVerb(text) {
    const lower = text.toLowerCase();

    if (lower.includes('responsible for')) return 'Managed';
    if (lower.includes('worked on')) return 'Developed';
    if (lower.includes('helped with')) return 'Contributed to';
    if (lower.includes('assisted in')) return 'Supported';

    return 'Led'; // Default strong verb
  }

  /**
   * Calculate scores
   */
  calculateScores(classified, typesDetected) {
    const total = classified.length;
    if (total === 0) {
      return {
        overallScore: 0,
        strongCount: 0,
        averageCount: 0,
        weakCount: 0,
        strongPercentage: 0,
        averagePercentage: 0,
        weakPercentage: 0,
        achievementDensity: 0,
        typeCoverage: 0,
      };
    }

    const strong = classified.filter(a => a.strength === 'strong').length;
    const average = classified.filter(a => a.strength === 'average').length;
    const weak = classified.filter(a => a.strength === 'weak').length;

    const strongPercentage = Math.round((strong / total) * 100);
    const averagePercentage = Math.round((average / total) * 100);
    const weakPercentage = Math.round((weak / total) * 100);

    // Overall score (weighted)
    const overallScore = Math.round(
      (strong * 100 + average * 60 + weak * 30) / total
    );

    // Achievement density (achievements per 100 words)
    const wordCount = classified.reduce((sum, a) => sum + a.text.split(/\s+/).length, 0);
    const achievementDensity = Math.round((total / wordCount) * 100);

    // Type coverage
    const maxTypes = Object.keys(this.achievementTypes).length;
    const typeCoverage = Math.round((typesDetected.totalTypes / maxTypes) * 100);

    return {
      overallScore,
      strongCount: strong,
      averageCount: average,
      weakCount: weak,
      strongPercentage,
      averagePercentage,
      weakPercentage,
      achievementDensity,
      typeCoverage,
      grade: this.getGrade(overallScore),
    };
  }

  /**
   * Generate recommendations
   */
  generateRecommendations(scores, classified, typesDetected) {
    const recommendations = [];

    // Weak achievements
    if (scores.weakPercentage > 30) {
      recommendations.push({
        priority: 'critical',
        category: 'achievements',
        issue: `${scores.weakCount} weak achievement statements found (${scores.weakPercentage}%)`,
        recommendation: 'Rewrite weak bullet points using strong action verbs and quantifiable metrics',
        impact: 'High - weak achievements significantly reduce resume effectiveness',
      });
    }

    // Low strong percentage
    if (scores.strongPercentage < 40) {
      recommendations.push({
        priority: 'high',
        category: 'achievements',
        issue: `Only ${scores.strongPercentage}% of achievements are strong`,
        recommendation: 'Convert more achievements to metric-driven statements',
        impact: 'High - strong achievements demonstrate clear impact',
      });
    }

    // Limited achievement types
    if (typesDetected.totalTypes < 3) {
      recommendations.push({
        priority: 'medium',
        category: 'achievements',
        issue: `Only ${typesDetected.totalTypes} types of achievements demonstrated`,
        recommendation: 'Showcase diverse achievements across revenue, growth, efficiency, leadership, etc.',
        impact: 'Medium - diverse achievements show well-rounded experience',
      });
    }

    // Missing achievement types
    const missingTypes = Object.keys(this.achievementTypes).filter(
      type => !typesDetected.types.some(t => t.type === type)
    );

    if (missingTypes.length > 0) {
      recommendations.push({
        priority: 'medium',
        category: 'achievements',
        issue: `Missing achievement types: ${missingTypes.slice(0, 3).join(', ')}`,
        recommendation: `Add achievements demonstrating ${missingTypes.slice(0, 3).join(', ')}`,
        impact: 'Medium - broader achievement types show diverse impact',
      });
    }

    return recommendations;
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
      strongCount: 0,
      averageCount: 0,
      weakCount: 0,
      strongPercentage: 0,
      averagePercentage: 0,
      weakPercentage: 0,
      achievementDensity: 0,
      typeCoverage: 0,
      grade: 'F',
      achievements: [],
      typesDetected: {
        types: [],
        totalTypes: 0,
        totalAchievements: 0,
      },
      rewriteCandidates: [],
      recommendations: [],
      analyzedAt: new Date().toISOString(),
    };
  }
}

module.exports = new AchievementEngine();