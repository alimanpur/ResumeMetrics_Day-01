/**
 * Professional Report Generator
 * Creates comprehensive, recruiter-quality analysis reports
 * Generates executive summaries, radar charts data, and actionable insights
 */

class ReportGenerator {
  constructor() {
    this.explainabilityEngine = require('../explainabilityEngine');
  }

  /**
   * Generate comprehensive analysis report
   * @param {Object} analysisResults - Complete analysis from all engines
   * @returns {Object} Professional report
   */
  generateReport(analysisResults) {
    if (!analysisResults) {
      return this.getEmptyReport();
    }

    const { ats, keywords, semantic, achievements, benchmark, jobMatch, normalizedDoc } = analysisResults;

    // Generate all report sections
    const executiveSummary = this.generateExecutiveSummary(analysisResults);
    const atsAnalysis = this.generateATSAnalysis(ats);
    const keywordAnalysis = this.generateKeywordAnalysis(keywords);
    const semanticAnalysis = this.generateSemanticAnalysis(semantic);
    const achievementAnalysis = this.generateAchievementAnalysis(achievements);
    const benchmarkAnalysis = this.generateBenchmarkAnalysis(benchmark);
    const jobMatchAnalysis = this.generateJobMatchAnalysis(jobMatch);
    const radarChartData = this.generateRadarChartData(analysisResults);
    const resumeHealth = this.calculateResumeHealth(analysisResults);
    const sectionQuality = this.analyzeSectionQuality(normalizedDoc);
    const improvementTimeline = this.generateImprovementTimeline(analysisResults);
    const hiringProbability = this.calculateHiringProbability(analysisResults);
    const topRecommendations = this.generateTopRecommendations(analysisResults);

    return {
      executiveSummary,
      atsAnalysis,
      keywordAnalysis,
      semanticAnalysis,
      achievementAnalysis,
      benchmarkAnalysis,
      jobMatchAnalysis,
      radarChartData,
      resumeHealth,
      sectionQuality,
      improvementTimeline,
      hiringProbability,
      topRecommendations,
      metadata: {
        generatedAt: new Date().toISOString(),
        version: '1.0',
        engines: ['ATS', 'Keyword', 'Semantic', 'Achievement', 'Benchmark', 'JobMatch'],
      },
    };
  }

  /**
   * Generate executive summary
   */
  generateExecutiveSummary(analysisResults) {
    const { ats, keywords, semantic, achievements } = analysisResults;

    const scores = {
      ats: ats?.atsScore || 0,
      keywords: keywords?.overallCoverage || 0,
      semantic: semantic?.overallScore || 0,
      achievements: achievements?.overallScore || 0,
    };

    const averageScore = Math.round(
      (scores.ats + scores.keywords + scores.semantic + scores.achievements) / 4
    );

    const strengths = [];
    const weaknesses = [];
    const criticalIssues = [];

    // Identify strengths
    if (scores.ats >= 80) strengths.push('Strong ATS compatibility');
    if (scores.keywords >= 75) strengths.push('Good keyword coverage');
    if (scores.semantic >= 75) strengths.push('Solid content quality');
    if (scores.achievements >= 70) strengths.push('Strong achievements');

    // Identify weaknesses
    if (scores.ats < 60) weaknesses.push('ATS compatibility issues');
    if (scores.keywords < 60) weaknesses.push('Keyword gaps');
    if (scores.semantic < 60) weaknesses.push('Content quality concerns');
    if (scores.achievements < 60) weaknesses.push('Weak achievements');

    // Collect critical issues
    if (ats?.recommendations) {
      const critical = ats.recommendations.filter(r => r.severity === 'critical');
      criticalIssues.push(...critical.slice(0, 3).map(r => r.issue));
    }

    // Generate overall assessment
    let overallAssessment;
    if (averageScore >= 85) {
      overallAssessment = 'Your resume is strong and competitive. Minor refinements will make it exceptional.';
    } else if (averageScore >= 70) {
      overallAssessment = 'Your resume has solid foundations. Focus on the identified weaknesses to strengthen it.';
    } else if (averageScore >= 60) {
      overallAssessment = 'Your resume needs improvement in key areas. Addressing the critical issues will significantly enhance its effectiveness.';
    } else {
      overallAssessment = 'Your resume requires major revisions. Follow the priority actions to make it competitive.';
    }

    // Priority actions
    const priorityActions = this.generatePriorityActions(scores, weaknesses, analysisResults);

    return {
      overallAssessment,
      averageScore,
      grade: this.getGrade(averageScore),
      strengths: strengths.slice(0, 5),
      weaknesses: weaknesses.slice(0, 5),
      criticalIssues: criticalIssues.slice(0, 5),
      priorityActions,
      scoreBreakdown: scores,
    };
  }

  /**
   * Generate priority actions
   */
  generatePriorityActions(scores, weaknesses, analysisResults) {
    const actions = [];

    if (scores.ats < 70 && analysisResults.ats?.recommendations) {
      const criticalIssues = analysisResults.ats.recommendations.filter(r => r.severity === 'critical');
      if (criticalIssues.length > 0) {
        actions.push({
          priority: 1,
          action: 'Fix critical ATS issues',
          details: criticalIssues[0].recommendation,
          impact: 'Critical for passing automated screening',
        });
      }
    }

    if (scores.keywords < 70 && analysisResults.keywords) {
      actions.push({
        priority: 2,
        action: 'Add missing technical skills',
        details: 'Review job descriptions and add relevant keywords',
        impact: 'Improves match with job requirements',
      });
    }

    if (scores.achievements < 70 && analysisResults.achievements) {
      actions.push({
        priority: 3,
        action: 'Strengthen achievements with metrics',
        details: 'Add quantifiable results to weak bullet points',
        impact: 'Demonstrates clear impact and value',
      });
    }

    if (scores.semantic < 70 && analysisResults.semantic) {
      actions.push({
        priority: 4,
        action: 'Improve content quality',
        details: 'Use stronger action verbs and more specific language',
        impact: 'Enhances recruiter perception',
      });
    }

    if (analysisResults.benchmark) {
      const highPriorityGaps = analysisResults.benchmark.recommendations?.filter(r => r.priority === 'high' || r.priority === 'critical');
      if (highPriorityGaps && highPriorityGaps.length > 0 && actions.length < 5) {
        actions.push({
          priority: 5,
          action: 'Address industry benchmark gaps',
          details: highPriorityGaps[0].recommendation,
          impact: 'Meets industry standards',
        });
      }
    }

    return actions.slice(0, 7);
  }

  /**
   * Generate ATS analysis section
   */
  generateATSAnalysis(ats) {
    if (!ats) return this.getEmptySection('ats');

    return {
      score: ats.atsScore,
      grade: this.getGrade(ats.atsScore),
      status: ats.summary?.status || 'unknown',
      message: ats.summary?.message || '',
      checks: ats.checks || {},
      recommendations: ats.recommendations?.slice(0, 10) || [],
      topIssues: ats.recommendations?.filter(r => r.severity === 'critical' || r.severity === 'high').slice(0, 5) || [],
    };
  }

  /**
   * Generate keyword analysis section
   */
  generateKeywordAnalysis(keywords) {
    if (!keywords) return this.getEmptySection('keywords');

    return {
      overallCoverage: keywords.overallCoverage,
      grade: this.getGrade(keywords.overallCoverage),
      summary: keywords.summary,
      categories: this.summarizeKeywordCategories(keywords.categories),
      topMissing: keywords.priorityMissing?.slice(0, 10) || [],
      recommendations: this.generateKeywordRecommendations(keywords),
    };
  }

  /**
   * Summarize keyword categories
   */
  summarizeKeywordCategories(categories) {
    if (!categories) return [];

    return Object.entries(categories).map(([key, category]) => ({
      key,
      name: category.name,
      coverage: category.coverage,
      found: category.foundCount,
      total: category.totalCount,
      grade: this.getGrade(category.coverage),
    }));
  }

  /**
   * Generate keyword recommendations
   */
  generateKeywordRecommendations(keywords) {
    const recommendations = [];

    if (keywords.overallCoverage < 60) {
      recommendations.push({
        priority: 'high',
        category: 'keywords',
        issue: `Low keyword coverage (${keywords.overallCoverage}%)`,
        recommendation: 'Add more industry-relevant keywords and skills',
      });
    }

    const weakCategories = Object.entries(keywords.categories)
      .filter(([_, cat]) => cat.coverage < 50)
      .slice(0, 3);

    for (const [key, category] of weakCategories) {
      recommendations.push({
        priority: 'medium',
        category: key,
        issue: `Low ${category.name} coverage (${category.coverage}%)`,
        recommendation: `Add more ${category.name.toLowerCase()} keywords`,
      });
    }

    return recommendations;
  }

  /**
   * Generate semantic analysis section
   */
  generateSemanticAnalysis(semantic) {
    if (!semantic) return this.getEmptySection('semantic');

    return {
      overallScore: semantic.overallScore,
      grade: semantic.grade,
      dimensions: this.summarizeDimensions(semantic.dimensions),
      insights: semantic.insights?.slice(0, 5) || [],
      recommendations: semantic.recommendations?.slice(0, 7) || [],
    };
  }

  /**
   * Summarize semantic dimensions
   */
  summarizeDimensions(dimensions) {
    if (!dimensions) return [];

    return Object.entries(dimensions).map(([key, dim]) => ({
      key,
      name: this.formatDimensionName(key),
      score: dim.score,
      grade: dim.grade,
    }));
  }

  /**
   * Format dimension name
   */
  formatDimensionName(key) {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  }

  /**
   * Generate achievement analysis section
   */
  generateAchievementAnalysis(achievements) {
    if (!achievements) return this.getEmptySection('achievements');

    return {
      overallScore: achievements.overallScore,
      grade: achievements.grade,
      strongCount: achievements.strongCount,
      averageCount: achievements.averageCount,
      weakCount: achievements.weakCount,
      strongPercentage: achievements.strongPercentage,
      topAchievements: achievements.achievements?.slice(0, 5) || [],
      rewriteCandidates: achievements.rewriteCandidates?.slice(0, 5) || [],
      recommendations: achievements.recommendations?.slice(0, 5) || [],
    };
  }

  /**
   * Generate benchmark analysis section
   */
  generateBenchmarkAnalysis(benchmark) {
    if (!benchmark) return this.getEmptySection('benchmark');

    return {
      overallScore: benchmark.overallScore,
      grade: benchmark.grade,
      role: benchmark.role,
      comparisons: benchmark.comparisons,
      gaps: benchmark.gaps?.slice(0, 5) || [],
      recommendations: benchmark.recommendations?.slice(0, 5) || [],
      competitiveness: benchmark.competitiveness,
    };
  }

  /**
   * Generate job match analysis section
   */
  generateJobMatchAnalysis(jobMatch) {
    if (!jobMatch) return this.getEmptySection('jobMatch');

    return {
      overallMatch: jobMatch.overallMatch,
      technicalMatch: jobMatch.technicalMatch,
      softSkillMatch: jobMatch.softSkillMatch,
      experienceMatch: jobMatch.experienceMatch,
      educationMatch: jobMatch.educationMatch,
      missingSkills: jobMatch.missingSkills?.slice(0, 10) || [],
      criticalGaps: jobMatch.criticalGaps?.slice(0, 5) || [],
      hiringRisk: jobMatch.hiringRisk,
      interviewProbability: jobMatch.interviewProbability,
      recommendations: jobMatch.recommendations?.slice(0, 5) || [],
    };
  }

  /**
   * Generate radar chart data
   */
  generateRadarChartData(analysisResults) {
    const { ats, keywords, semantic, achievements, benchmark } = analysisResults;

    const data = {
      labels: [],
      datasets: [
        {
          label: 'Your Resume',
          data: [],
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 2,
        },
      ],
    };

    // ATS Score
    if (ats) {
      data.labels.push('ATS Compatibility');
      data.datasets[0].data.push(ats.atsScore);
    }

    // Keyword Coverage
    if (keywords) {
      data.labels.push('Keyword Coverage');
      data.datasets[0].data.push(keywords.overallCoverage);
    }

    // Semantic Score
    if (semantic) {
      data.labels.push('Content Quality');
      data.datasets[0].data.push(semantic.overallScore);
    }

    // Achievement Score
    if (achievements) {
      data.labels.push('Achievements');
      data.datasets[0].data.push(achievements.overallScore);
    }

    // Benchmark Score
    if (benchmark) {
      data.labels.push('Industry Fit');
      data.datasets[0].data.push(benchmark.overallScore);
    }

    // Job Match (if available)
    if (analysisResults.jobMatch) {
      data.labels.push('Job Match');
      data.datasets[0].data.push(analysisResults.jobMatch.overallMatch);
    }

    return data;
  }

  /**
   * Calculate resume health
   */
  calculateResumeHealth(analysisResults) {
    const { ats, keywords, semantic, achievements, normalizedDoc } = analysisResults;

    let healthScore = 0;
    const factors = [];

    // ATS health (25%)
    if (ats) {
      const atsWeight = 0.25;
      healthScore += ats.atsScore * atsWeight;
      factors.push({
        category: 'ATS Compatibility',
        score: ats.atsScore,
        weight: 25,
        status: ats.atsScore >= 80 ? 'healthy' : ats.atsScore >= 60 ? 'warning' : 'critical',
      });
    }

    // Keyword health (25%)
    if (keywords) {
      const kwWeight = 0.25;
      healthScore += keywords.overallCoverage * kwWeight;
      factors.push({
        category: 'Keyword Optimization',
        score: keywords.overallCoverage,
        weight: 25,
        status: keywords.overallCoverage >= 75 ? 'healthy' : keywords.overallCoverage >= 50 ? 'warning' : 'critical',
      });
    }

    // Semantic health (25%)
    if (semantic) {
      const semWeight = 0.25;
      healthScore += semantic.overallScore * semWeight;
      factors.push({
        category: 'Content Quality',
        score: semantic.overallScore,
        weight: 25,
        status: semantic.overallScore >= 75 ? 'healthy' : semantic.overallScore >= 60 ? 'warning' : 'critical',
      });
    }

    // Achievement health (25%)
    if (achievements) {
      const achWeight = 0.25;
      healthScore += achievements.overallScore * achWeight;
      factors.push({
        category: 'Achievement Strength',
        score: achievements.overallScore,
        weight: 25,
        status: achievements.overallScore >= 70 ? 'healthy' : achievements.overallScore >= 50 ? 'warning' : 'critical',
      });
    }

    const grade = this.getGrade(healthScore);
    const status = healthScore >= 80 ? 'healthy' : healthScore >= 60 ? 'needs_improvement' : 'critical';

    return {
      score: Math.round(healthScore),
      grade,
      status,
      factors,
      description: this.getHealthDescription(status, healthScore),
    };
  }

  /**
   * Get health description
   */
  getHealthDescription(status, score) {
    switch (status) {
      case 'healthy':
        return `Your resume is healthy (${Math.round(score)}/100). It meets most quality standards.`;
      case 'needs_improvement':
        return `Your resume needs improvement (${Math.round(score)}/100). Several areas need attention.`;
      case 'critical':
        return `Your resume requires immediate attention (${Math.round(score)}/100). Critical issues must be fixed.`;
      default:
        return `Resume health score: ${Math.round(score)}/100`;
    }
  }

  /**
   * Analyze section quality
   */
  analyzeSectionQuality(normalizedDoc) {
    if (!normalizedDoc || !normalizedDoc.sections) {
      return this.getEmptySectionQuality();
    }

    const { sections, sectionAnalysis } = normalizedDoc;

    const sectionScores = sections.map(section => ({
      type: section.type,
      present: true,
      hasContent: !section.isEmpty,
      lineCount: section.lineCount,
      quality: this.assessSectionQuality(section),
    }));

    const missingSections = sectionAnalysis.missingSections || [];
    const missingSectionObjects = missingSections.map(type => ({
      type,
      present: false,
      hasContent: false,
      quality: 0,
    }));

    const allSections = [...sectionScores, ...missingSectionObjects];

    return {
      totalSections: allSections.length,
      presentSections: sectionScores.length,
      missingSections: missingSections.length,
      sections: allSections,
      averageQuality: Math.round(
        sectionScores.reduce((sum, s) => sum + s.quality, 0) / Math.max(sectionScores.length, 1)
      ),
    };
  }

  /**
   * Assess section quality
   */
  assessSectionQuality(section) {
    let score = 0;

    // Has content
    if (!section.isEmpty) score += 40;

    // Good length
    if (section.lineCount >= 3 && section.lineCount <= 50) score += 30;
    else if (section.lineCount >= 2) score += 20;

    // Has substance
    if (section.content.length >= 100) score += 30;
    else if (section.content.length >= 50) score += 20;

    return Math.min(100, score);
  }

  /**
   * Generate improvement timeline
   */
  generateImprovementTimeline(analysisResults) {
    const { ats, keywords, semantic, achievements } = analysisResults;

    const timeline = [];
    let currentWeek = 1;

    // Week 1: Critical fixes
    const criticalIssues = [];
    if (ats?.recommendations) {
      const critical = ats.recommendations.filter(r => r.severity === 'critical');
      criticalIssues.push(...critical);
    }
    if (criticalIssues.length > 0) {
      timeline.push({
        week: currentWeek++,
        phase: 'Critical Fixes',
        tasks: criticalIssues.slice(0, 3).map(r => r.recommendation),
        expectedImpact: 'Resolves blocking issues',
      });
    }

    // Week 2: Structure and keywords
    const structureIssues = [];
    if (ats?.recommendations) {
      const structure = ats.recommendations.filter(r => r.category === 'structure' || r.category === 'keywords');
      structureIssues.push(...structure);
    }
    if (structureIssues.length > 0) {
      timeline.push({
        week: currentWeek++,
        phase: 'Structure & Keywords',
        tasks: structureIssues.slice(0, 3).map(r => r.recommendation),
        expectedImpact: 'Improves ATS score and keyword match',
      });
    }

    // Week 3: Content quality
    const contentIssues = [];
    if (semantic?.recommendations) {
      contentIssues.push(...semantic.recommendations);
    }
    if (contentIssues.length > 0) {
      timeline.push({
        week: currentWeek++,
        phase: 'Content Enhancement',
        tasks: contentIssues.slice(0, 3).map(r => r.recommendation),
        expectedImpact: 'Improves semantic quality and recruiter perception',
      });
    }

    // Week 4: Achievement strengthening
    if (achievements?.rewriteCandidates && achievements.rewriteCandidates.length > 0) {
      timeline.push({
        week: currentWeek++,
        phase: 'Achievement Optimization',
        tasks: achievements.rewriteCandidates.slice(0, 3).map(a => `Rewrite: "${a.original.substring(0, 50)}..."`),
        expectedImpact: 'Strengthens impact demonstration',
      });
    }

    return {
      totalWeeks: timeline.length,
      timeline,
      estimatedCompletion: currentWeek > 0 ? `${currentWeek} weeks` : 'Immediate',
    };
  }

  /**
   * Calculate hiring probability
   */
  calculateHiringProbability(analysisResults) {
    const { ats, keywords, semantic, achievements, jobMatch } = analysisResults;

    let probability = 50; // Base probability

    // ATS contribution
    if (ats) {
      probability += (ats.atsScore - 50) * 0.3;
    }

    // Keywords contribution
    if (keywords) {
      probability += (keywords.overallCoverage - 50) * 0.2;
    }

    // Semantic contribution
    if (semantic) {
      probability += (semantic.overallScore - 50) * 0.2;
    }

    // Achievements contribution
    if (achievements) {
      probability += (achievements.overallScore - 50) * 0.2;
    }

    // Job match contribution
    if (jobMatch) {
      probability += (jobMatch.overallMatch - 50) * 0.3;
      probability -= jobMatch.hiringRisk?.score * 0.2 || 0;
    }

    const percentage = Math.max(0, Math.min(100, Math.round(probability)));

    return {
      percentage,
      grade: this.getGrade(percentage),
      factors: this.getHiringProbabilityFactors(analysisResults),
      confidence: this.calculateHiringConfidence(analysisResults),
    };
  }

  /**
   * Get hiring probability factors
   */
  getHiringProbabilityFactors(analysisResults) {
    const factors = [];

    if (analysisResults.ats?.atsScore >= 80) {
      factors.push('Strong ATS compatibility increases chances');
    }
    if (analysisResults.keywords?.overallCoverage >= 75) {
      factors.push('Good keyword match with industry standards');
    }
    if (analysisResults.achievements?.strongPercentage >= 60) {
      factors.push('Strong achievements demonstrate impact');
    }
    if (analysisResults.jobMatch?.overallMatch >= 75) {
      factors.push('High job match score');
    }

    if (analysisResults.jobMatch?.hiringRisk?.score >= 50) {
      factors.push('Hiring risk factors present');
    }

    return factors;
  }

  /**
   * Calculate hiring confidence
   */
  calculateHiringConfidence(analysisResults) {
    let confidence = 0;

    if (analysisResults.ats) confidence++;
    if (analysisResults.keywords) confidence++;
    if (analysisResults.semantic) confidence++;
    if (analysisResults.achievements) confidence++;
    if (analysisResults.jobMatch) confidence++;

    if (confidence >= 4) return 'high';
    if (confidence >= 3) return 'medium';
    return 'low';
  }

  /**
   * Generate top recommendations
   */
  generateTopRecommendations(analysisResults) {
    const allRecommendations = [];

    // Collect from all analyses
    if (analysisResults.ats?.recommendations) {
      allRecommendations.push(...analysisResults.ats.recommendations.map(r => ({ ...r, source: 'ATS' })));
    }
    if (analysisResults.keywords) {
      // Add keyword recommendations
    }
    if (analysisResults.semantic?.recommendations) {
      allRecommendations.push(...analysisResults.semantic.recommendations.map(r => ({ ...r, source: 'Content' })));
    }
    if (analysisResults.achievements?.recommendations) {
      allRecommendations.push(...analysisResults.achievements.recommendations.map(r => ({ ...r, source: 'Achievements' })));
    }
    if (analysisResults.benchmark?.recommendations) {
      allRecommendations.push(...analysisResults.benchmark.recommendations.map(r => ({ ...r, source: 'Benchmark' })));
    }
    if (analysisResults.jobMatch?.recommendations) {
      allRecommendations.push(...analysisResults.jobMatch.recommendations.map(r => ({ ...r, source: 'Job Match' })));
    }

    // Sort by priority
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    allRecommendations.sort((a, b) => {
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return 0;
    });

    return allRecommendations.slice(0, 10);
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
   * Get empty section
   */
  getEmptySection(type) {
    return {
      type,
      score: 0,
      grade: 'F',
      message: 'No data available',
    };
  }

  /**
   * Get empty section quality
   */
  getEmptySectionQuality() {
    return {
      totalSections: 0,
      presentSections: 0,
      missingSections: 0,
      sections: [],
      averageQuality: 0,
    };
  }

  /**
   * Get empty report
   */
  getEmptyReport() {
    return {
      executiveSummary: this.getEmptySection('executiveSummary'),
      atsAnalysis: this.getEmptySection('ats'),
      keywordAnalysis: this.getEmptySection('keywords'),
      semanticAnalysis: this.getEmptySection('semantic'),
      achievementAnalysis: this.getEmptySection('achievements'),
      benchmarkAnalysis: this.getEmptySection('benchmark'),
      jobMatchAnalysis: this.getEmptySection('jobMatch'),
      radarChartData: { labels: [], datasets: [] },
      resumeHealth: this.getEmptyResumeHealth(),
      sectionQuality: this.getEmptySectionQuality(),
      improvementTimeline: { totalWeeks: 0, timeline: [] },
      hiringProbability: { percentage: 0, grade: 'F', factors: [], confidence: 'low' },
      topRecommendations: [],
      metadata: {
        generatedAt: new Date().toISOString(),
        version: '1.0',
        engines: [],
      },
    };
  }

  /**
   * Get empty resume health
   */
  getEmptyResumeHealth() {
    return {
      score: 0,
      grade: 'F',
      status: 'critical',
      factors: [],
      description: 'Unable to assess resume health',
    };
  }
}

module.exports = new ReportGenerator();