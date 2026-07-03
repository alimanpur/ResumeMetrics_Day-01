/**
 * Explainability Engine
 * Ensures every score and recommendation is justified with evidence
 * Makes AI decisions transparent and auditable
 */

class ExplainabilityEngine {
  constructor() {
    // Explanation templates
    this.explanationTemplates = {
      ats: {
        high: 'Critical ATS issue detected: {issue}. {evidence}. This will cause ATS systems to {impact}.',
        medium: 'ATS compatibility concern: {issue}. {evidence}. May affect parsing in some ATS systems.',
        low: 'Minor ATS consideration: {issue}. {evidence}. Not critical but could be optimized.',
      },
      keyword: {
        high: 'Critical skill gap: {skill} is {status}. {context}. This skill appears in {percentage}% of job descriptions.',
        medium: 'Keyword opportunity: {skill} is {status}. Adding this could improve match score.',
        low: 'Keyword suggestion: {skill} could strengthen your profile.',
      },
      semantic: {
        high: 'Content quality issue: {issue}. {evidence}. This significantly impacts how recruiters perceive your experience.',
        medium: 'Content improvement opportunity: {issue}. {evidence}. Enhancing this would strengthen your resume.',
        low: 'Content note: {issue}. {evidence}. Minor improvement possible.',
      },
      achievement: {
        high: 'Achievement weakness: {issue}. {evidence}. Strong achievements are critical for demonstrating impact.',
        medium: 'Achievement opportunity: {issue}. {evidence}. Could be strengthened with quantifiable metrics.',
        low: 'Achievement suggestion: {issue}. {evidence}. Consider enhancement.',
      },
    };
  }

  /**
   * Generate explanation for ATS score
   * @param {Object} atsResult - ATS analysis result
   * @returns {Object} Explained ATS score
   */
  explainATSScore(atsResult) {
    if (!atsResult) {
      return this.getEmptyExplanation('ats');
    }

    const { atsScore, checks, recommendations, summary } = atsResult;

    // Generate detailed explanations for each check
    const checkExplanations = {};
    for (const [category, check] of Object.entries(checks)) {
      checkExplanations[category] = this.explainCheck(category, check);
    }

    // Generate top recommendations with explanations
    const explainedRecommendations = recommendations.slice(0, 10).map(rec => ({
      ...rec,
      explanation: this.explainRecommendation(rec),
      impactExplanation: this.explainImpact(rec.impact, rec.severity),
    }));

    return {
      score: atsScore,
      grade: this.getGrade(atsScore),
      summary: summary.message,
      status: summary.status,
      checkExplanations,
      recommendations: explainedRecommendations,
      topIssues: this.extractTopIssues(recommendations, 5),
      confidence: this.calculateConfidence(atsResult),
      explainedAt: new Date().toISOString(),
    };
  }

  /**
   * Explain a specific check result
   */
  explainCheck(category, check) {
    const explanation = {
      score: check.score,
      passed: check.passed,
      severity: check.passed ? 'none' : this.getCheckSeverity(check),
      reason: this.getCheckReason(category, check),
      evidence: this.extractEvidence(check),
      details: check.details || {},
    };

    return explanation;
  }

  /**
   * Get reason for check result
   */
  getCheckReason(category, check) {
    if (check.passed) {
      return `${category} check passed - no issues found`;
    }

    const failedIssues = check.issues || [];
    const criticalCount = failedIssues.filter(i => i.severity === 'critical').length;
    const highCount = failedIssues.filter(i => i.severity === 'high').length;

    if (criticalCount > 0) {
      return `Critical ${category} issues detected: ${criticalCount} critical problem(s) must be fixed`;
    } else if (highCount > 0) {
      return `${category} has ${highCount} high-priority issue(s) that need attention`;
    } else {
      return `${category} has ${failedIssues.length} issue(s) that could be improved`;
    }
  }

  /**
   * Extract evidence from check
   */
  extractEvidence(check) {
    const evidence = [];
    const issues = check.issues || [];

    for (const issue of issues.slice(0, 3)) {
      if (issue.evidence) {
        evidence.push({
          issue: issue.issue,
          evidence: issue.evidence,
          rule: issue.rule,
        });
      }
    }

    return evidence;
  }

  /**
   * Get check severity
   */
  getCheckSeverity(check) {
    const issues = check.issues || [];
    if (issues.some(i => i.severity === 'critical')) return 'critical';
    if (issues.some(i => i.severity === 'high')) return 'high';
    if (issues.some(i => i.severity === 'medium')) return 'medium';
    return 'low';
  }

  /**
   * Explain a recommendation
   */
  explainRecommendation(recommendation) {
    const templates = {
      critical: `This is a critical issue that must be addressed. ${recommendation.recommendation}`,
      high: `This is a high-priority improvement. ${recommendation.recommendation}`,
      medium: `This would improve your resume. ${recommendation.recommendation}`,
      low: `Consider this optional improvement. ${recommendation.recommendation}`,
    };

    return templates[recommendation.severity] || recommendation.recommendation;
  }

  /**
   * Explain impact of issue
   */
  explainImpact(impact, severity) {
    if (!impact) return '';

    const impactExplanations = {
      critical: 'This will significantly reduce your chances of passing ATS screening.',
      high: 'This has a major negative impact on ATS compatibility.',
      medium: 'This moderately affects ATS parsing and should be addressed.',
      low: 'This has minimal impact but fixing it would be beneficial.',
    };

    return impactExplanations[severity] || '';
  }

  /**
   * Generate explanation for keyword match
   * @param {Object} keywordResult - Keyword analysis result
   * @returns {Object} Explained keyword match
   */
  explainKeywordMatch(keywordResult) {
    if (!keywordResult) {
      return this.getEmptyExplanation('keyword');
    }

    const { overallCoverage, categories, summary } = keywordResult;

    // Explain each category
    const categoryExplanations = {};
    for (const [key, category] of Object.entries(categories)) {
      categoryExplanations[key] = {
        name: category.name,
        coverage: category.coverage,
        found: category.foundCount,
        total: category.totalCount,
        explanation: this.explainCategoryCoverage(category),
        missingImportant: this.identifyImportantMissing(category),
      };
    }

    // Top missing keywords with explanations
    const missingExplanations = this.prioritizeMissingKeywords(categories);

    return {
      overallCoverage,
      grade: this.getGrade(overallCoverage),
      categoryExplanations,
      missingKeywords: missingExplanations,
      summary: this.generateKeywordSummary(keywordResult),
      confidence: this.calculateKeywordConfidence(keywordResult),
      explainedAt: new Date().toISOString(),
    };
  }

  /**
   * Explain category coverage
   */
  explainCategoryCoverage(category) {
    if (category.coverage >= 80) {
      return `Excellent coverage of ${category.name} - ${category.foundCount} out of ${category.totalCount} keywords found`;
    } else if (category.coverage >= 50) {
      return `Moderate ${category.name} coverage - ${category.foundCount} out of ${category.totalCount} keywords found. Consider adding more.`;
    } else if (category.coverage > 0) {
      return `Limited ${category.name} coverage - only ${category.foundCount} out of ${category.totalCount} keywords found. This is a significant gap.`;
    } else {
      return `No ${category.name} keywords found. This category is completely missing from your resume.`;
    }
  }

  /**
   * Identify important missing keywords
   */
  identifyImportantMissing(category) {
    return category.missing.slice(0, 5).map(keyword => ({
      keyword,
      importance: category.weight >= 8 ? 'high' : category.weight >= 6 ? 'medium' : 'low',
      reason: this.getKeywordImportanceReason(keyword, category),
    }));
  }

  /**
   * Get keyword importance reason
   */
  getKeywordImportanceReason(keyword, category) {
    if (category.weight >= 9) {
      return `Critical skill in ${category.name} - essential for most roles`;
    } else if (category.weight >= 7) {
      return `Important skill in ${category.name} - highly valued by employers`;
    } else if (category.weight >= 5) {
      return `Useful skill in ${category.name} - adds value to your profile`;
    }
    return `Nice-to-have skill in ${category.name}`;
  }

  /**
   * Prioritize missing keywords across all categories
   */
  prioritizeMissingKeywords(categories) {
    const missing = [];

    for (const [key, category] of Object.entries(categories)) {
      for (const keyword of category.missing.slice(0, 5)) {
        missing.push({
          keyword,
          category: category.name,
          importance: category.weight >= 8 ? 'high' : category.weight >= 6 ? 'medium' : 'low',
          reason: this.getKeywordImportanceReason(keyword, category),
        });
      }
    }

    // Sort by importance
    const importanceOrder = { high: 0, medium: 1, low: 2 };
    missing.sort((a, b) => {
      const importanceDiff = importanceOrder[a.importance] - importanceOrder[b.importance];
      if (importanceDiff !== 0) return importanceDiff;
      return 0;
    });

    return missing.slice(0, 20);
  }

  /**
   * Generate keyword summary
   */
  generateKeywordSummary(keywordResult) {
    const { overallCoverage, summary } = keywordResult;

    if (overallCoverage >= 80) {
      return `Strong keyword coverage at ${overallCoverage}%. Your resume includes most relevant skills.`;
    } else if (overallCoverage >= 60) {
      return `Moderate keyword coverage at ${overallCoverage}%. Several important skills are missing.`;
    } else if (overallCoverage >= 40) {
      return `Limited keyword coverage at ${overallCoverage}%. Many key skills need to be added.`;
    } else {
      return `Poor keyword coverage at ${overallCoverage}%. Significant skill gaps identified.`;
    }
  }

  /**
   * Calculate keyword confidence
   */
  calculateKeywordConfidence(keywordResult) {
    if (!keywordResult || !keywordResult.categories) return 'low';

    const categoriesWithData = Object.values(keywordResult.categories).filter(
      cat => cat.totalCount > 0
    ).length;

    if (categoriesWithData >= 8) return 'high';
    if (categoriesWithData >= 5) return 'medium';
    return 'low';
  }

  /**
   * Generate explanation for semantic score
   * @param {Object} semanticResult - Semantic analysis result
   * @returns {Object} Explained semantic score
   */
  explainSemanticScore(semanticResult) {
    if (!semanticResult) {
      return this.getEmptyExplanation('semantic');
    }

    const { overallScore, dimensions, insights, recommendations } = semanticResult;

    // Explain each dimension
    const dimensionExplanations = {};
    for (const [key, dimension] of Object.entries(dimensions)) {
      dimensionExplanations[key] = {
        score: dimension.score,
        grade: dimension.grade,
        explanation: this.explainDimensionScore(key, dimension),
        evidence: dimension.evidence || [],
        strengths: this.extractDimensionStrengths(dimension),
        weaknesses: this.extractDimensionWeaknesses(dimension),
      };
    }

    // Explain insights
    const explainedInsights = insights.map(insight => ({
      ...insight,
      explanation: this.explainInsight(insight),
    }));

    // Explain recommendations
    const explainedRecommendations = recommendations.map(rec => ({
      ...rec,
      explanation: this.explainSemanticRecommendation(rec),
      rationale: this.generateRationale(rec),
    }));

    return {
      score: overallScore,
      grade: this.getGrade(overallScore),
      dimensionExplanations,
      insights: explainedInsights,
      recommendations: explainedRecommendations,
      confidence: this.calculateSemanticConfidence(semanticResult),
      explainedAt: new Date().toISOString(),
    };
  }

  /**
   * Explain dimension score
   */
  explainDimensionScore(dimension, data) {
    const explanations = {
      experienceQuality: `Experience quality score: ${data.score}/100. ${data.hasSpecificTechnologies ? 'Uses specific technologies' : 'Lacks specific technology mentions'}. ${data.hasQuantifiedResults ? 'Includes quantifiable results' : 'Missing quantifiable achievements'}.`,
      leadership: `Leadership score: ${data.score}/100. ${data.hasLeadershipTitle ? 'Has leadership title' : 'No leadership title found'}. ${data.teamSize > 0 ? `Manages team of ${data.teamSize}` : 'No team size mentioned'}.`,
      ownership: `Ownership score: ${data.score}/100. ${data.fromScratch ? 'Demonstrates building from scratch' : 'No from-scratch projects'}. ${data.endToEnd ? 'Shows end-to-end ownership' : 'Limited ownership language'}.`,
      communication: `Communication score: ${data.score}/100. ${data.documentation ? 'Includes documentation' : 'No documentation mentioned'}. ${data.training ? 'Shows training/mentoring' : 'No training experience'}.`,
      impact: `Impact score: ${data.score}/100. ${data.quantifiedAchievements > 0 ? `${data.quantifiedAchievements} quantifiable achievements` : 'No quantifiable achievements'}. ${data.beforeAfter ? 'Uses before/after patterns' : 'No before/after comparisons'}.`,
      problemSolving: `Problem-solving score: ${data.score}/100. ${data.complexProblems ? 'Addresses complex problems' : 'No complex problems mentioned'}. ${data.solutionOriented ? 'Solution-oriented language' : 'Limited solution focus'}.`,
      achievements: `Achievements score: ${data.score}/100. ${data.strongPercentage}% are strong achievements. ${data.strong} strong, ${data.average} average, ${data.weak} weak.`,
      businessValue: `Business value score: ${data.score}/100. ${data.demonstratesBusinessImpact ? 'Demonstrates business impact' : 'Limited business impact shown'}. ${data.categoriesWithValue}/${data.totalCategories} value categories present.`,
    };

    return explanations[dimension] || `${dimension} score: ${data.score}/100`;
  }

  /**
   * Extract dimension strengths
   */
  extractDimensionStrengths(dimension) {
    const strengths = [];
    const data = dimension;

    if (data.hasSpecificTechnologies) strengths.push('Uses specific technologies');
    if (data.hasQuantifiedResults) strengths.push('Includes quantifiable results');
    if (data.hasLeadershipTitle) strengths.push('Has leadership title');
    if (data.fromScratch) strengths.push('Built from scratch');
    if (data.documentation) strengths.push('Documentation experience');
    if (data.quantifiedAchievements > 0) strengths.push('Quantifiable achievements');

    return strengths;
  }

  /**
   * Extract dimension weaknesses
   */
  extractDimensionWeaknesses(dimension) {
    const weaknesses = [];
    const data = dimension;

    if (!data.hasSpecificTechnologies) weaknesses.push('Lacks specific technologies');
    if (!data.hasQuantifiedResults) weaknesses.push('Missing quantifiable results');
    if (!data.hasLeadershipTitle) weaknesses.push('No leadership title');
    if (!data.fromScratch) weaknesses.push('No from-scratch projects');
    if (!data.documentation) weaknesses.push('No documentation');
    if (data.quantifiedAchievements === 0) weaknesses.push('No quantifiable achievements');

    return weaknesses;
  }

  /**
   * Explain insight
   */
  explainInsight(insight) {
    switch (insight.type) {
      case 'strength':
        return `Positive finding: ${insight.message}. This gives you a competitive advantage.`;
      case 'weakness':
        return `Area for improvement: ${insight.message}. Addressing this will strengthen your resume.`;
      case 'gap':
        return `Moderate performance: ${insight.message}. Enhancement recommended.`;
      default:
        return insight.message;
    }
  }

  /**
   * Explain semantic recommendation
   */
  explainSemanticRecommendation(rec) {
    return `${rec.recommendation}. ${rec.reason}`;
  }

  /**
   * Generate rationale for recommendation
   */
  generateRationale(rec) {
    const rationales = {
      critical: 'This is essential for demonstrating your value to employers.',
      high: 'This significantly improves your resume effectiveness.',
      medium: 'This enhances your resume but is not critical.',
      low: 'This is a nice-to-have improvement.',
    };

    return rationales[rec.priority] || '';
  }

  /**
   * Calculate semantic confidence
   */
  calculateSemanticConfidence(semanticResult) {
    if (!semanticResult || !semanticResult.dimensions) return 'low';

    const dimensionsWithData = Object.values(semanticResult.dimensions).filter(
      dim => dim.score > 0
    ).length;

    if (dimensionsWithData >= 6) return 'high';
    if (dimensionsWithData >= 4) return 'medium';
    return 'low';
  }

  /**
   * Extract top issues from recommendations
   */
  extractTopIssues(recommendations, count = 5) {
    return recommendations.slice(0, count).map(rec => ({
      category: rec.category,
      issue: rec.issue,
      severity: rec.severity,
    }));
  }

  /**
   * Calculate overall confidence
   */
  calculateConfidence(result) {
    if (!result) return 'low';

    // Higher confidence if we have detailed data
    let confidence = 50;

    if (result.checks && Object.keys(result.checks).length > 0) {
      confidence += 20;
    }

    if (result.recommendations && result.recommendations.length > 0) {
      confidence += 20;
    }

    if (result.summary) {
      confidence += 10;
    }

    return confidence >= 80 ? 'high' : confidence >= 60 ? 'medium' : 'low';
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
   * Get empty explanation
   */
  getEmptyExplanation(type) {
    return {
      type,
      score: 0,
      grade: 'F',
      explanation: 'Insufficient data to generate explanation',
      recommendations: [],
      confidence: 'low',
      explainedAt: new Date().toISOString(),
    };
  }

  /**
   * Generate comprehensive explanation for entire analysis
   * @param {Object} fullAnalysis - Complete analysis result
   * @returns {Object} Fully explained analysis
   */
  generateFullExplanation(fullAnalysis) {
    const explained = {
      ats: this.explainATSScore(fullAnalysis.ats),
      keywords: this.explainKeywordMatch(fullAnalysis.keywords),
      semantic: this.explainSemanticScore(fullAnalysis.semantic),
      achievements: this.explainAchievements(fullAnalysis.achievements),
      overall: this.generateOverallExplanation(fullAnalysis),
      generatedAt: new Date().toISOString(),
    };

    return explained;
  }

  /**
   * Explain achievements
   */
  explainAchievements(achievementResult) {
    if (!achievementResult) {
      return this.getEmptyExplanation('achievements');
    }

    const { overallScore, strongCount, averageCount, weakCount, achievements } = achievementResult;

    const explainedAchievements = achievements.slice(0, 10).map(achievement => ({
      text: achievement.text,
      strength: achievement.strength,
      reason: achievement.reason,
      explanation: this.explainAchievementStrength(achievement),
      improvementSuggestions: achievement.strength === 'weak' ? this.suggestImprovements(achievement) : [],
    }));

    return {
      score: overallScore,
      grade: this.getGrade(overallScore),
      strongCount,
      averageCount,
      weakCount,
      strongPercentage: achievementResult.strongPercentage,
      achievements: explainedAchievements,
      summary: this.generateAchievementSummary(achievementResult),
      confidence: overallScore > 0 ? 'high' : 'low',
      explainedAt: new Date().toISOString(),
    };
  }

  /**
   * Explain achievement strength
   */
  explainAchievementStrength(achievement) {
    switch (achievement.strength) {
      case 'strong':
        return 'This is a strong achievement with quantifiable metrics and clear impact.';
      case 'average':
        return 'This achievement uses action verbs but lacks quantifiable results. Could be stronger.';
      case 'weak':
        return 'This achievement uses weak or passive language and lacks measurable impact.';
      default:
        return '';
    }
  }

  /**
   * Suggest improvements for weak achievement
   */
  suggestImprovements(achievement) {
    const suggestions = [];

    if (!achievement.hasMetrics) {
      suggestions.push('Add quantifiable metrics (%, $, numbers) to demonstrate impact');
    }
    if (!achievement.hasActionVerb) {
      suggestions.push('Start with a strong action verb');
    }
    if (!achievement.hasContext) {
      suggestions.push('Add context (company, role, timeframe)');
    }

    return suggestions;
  }

  /**
   * Generate achievement summary
   */
  generateAchievementSummary(result) {
    if (result.strongPercentage >= 70) {
      return `Excellent! ${result.strongPercentage}% of your achievements are strong and metric-driven.`;
    } else if (result.strongPercentage >= 50) {
      return `Good achievement quality. ${result.strongPercentage}% are strong. Consider strengthening the rest.`;
    } else if (result.strongPercentage >= 30) {
      return `Moderate achievement quality. ${result.weakCount} achievements need improvement.`;
    } else {
      return `Weak achievement quality. Most achievements need to be rewritten with stronger language and metrics.`;
    }
  }

  /**
   * Generate overall explanation
   */
  generateOverallExplanation(fullAnalysis) {
    const scores = {
      ats: fullAnalysis.ats?.atsScore || 0,
      keywords: fullAnalysis.keywords?.overallCoverage || 0,
      semantic: fullAnalysis.semantic?.overallScore || 0,
      achievements: fullAnalysis.achievements?.overallScore || 0,
    };

    const averageScore = Math.round(
      (scores.ats + scores.keywords + scores.semantic + scores.achievements) / 4
    );

    const strengths = Object.entries(scores)
      .filter(([_, score]) => score >= 75)
      .map(([key, _]) => key);

    const weaknesses = Object.entries(scores)
      .filter(([_, score]) => score < 60)
      .map(([key, _]) => key);

    return {
      averageScore,
      grade: this.getGrade(averageScore),
      strengths,
      weaknesses,
      overallAssessment: this.generateOverallAssessment(scores, strengths, weaknesses),
      priorityActions: this.generatePriorityActions(scores, weaknesses),
    };
  }

  /**
   * Generate overall assessment
   */
  generateOverallAssessment(scores, strengths, weaknesses) {
    const avgScore = Math.round(
      (scores.ats + scores.keywords + scores.semantic + scores.achievements) / 4
    );

    if (avgScore >= 85) {
      return 'Your resume is strong across all dimensions. Minor refinements could make it exceptional.';
    } else if (avgScore >= 70) {
      return 'Your resume is solid with clear strengths. Focus on the identified weaknesses for improvement.';
    } else if (avgScore >= 60) {
      return 'Your resume has potential but needs significant improvements in key areas.';
    } else {
      return 'Your resume requires major revisions to be competitive. Focus on the critical issues identified.';
    }
  }

  /**
   * Generate priority actions
   */
  generatePriorityActions(scores, weaknesses) {
    const actions = [];

    if (weaknesses.includes('ats')) {
      actions.push({
        priority: 1,
        action: 'Fix ATS compatibility issues',
        reason: 'ATS score is critical for getting past automated screening',
      });
    }

    if (weaknesses.includes('keywords')) {
      actions.push({
        priority: 2,
        action: 'Add missing technical skills and keywords',
        reason: 'Keyword gaps reduce your match with job requirements',
      });
    }

    if (weaknesses.includes('achievements')) {
      actions.push({
        priority: 3,
        action: 'Rewrite weak achievements with quantifiable metrics',
        reason: 'Strong achievements demonstrate your impact and value',
      });
    }

    if (weaknesses.includes('semantic')) {
      actions.push({
        priority: 4,
        action: 'Improve content quality with stronger action verbs',
        reason: 'Semantic quality affects how recruiters perceive your experience',
      });
    }

    if (actions.length === 0) {
      actions.push({
        priority: 1,
        action: 'Fine-tune your resume for specific job applications',
        reason: 'Your resume is strong - optimize for target roles',
      });
    }

    return actions;
  }
}

module.exports = new ExplainabilityEngine();