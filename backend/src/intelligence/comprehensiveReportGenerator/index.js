/**
 * Comprehensive Report Generator V2
 * Generates enterprise-level resume intelligence reports with all required metrics
 * Every score includes: reason, evidence, recommendation
 */

class ComprehensiveReportGenerator {
  constructor() {
    this.gradeScale = {
      A: { min: 90, max: 100, label: 'Exceptional' },
      B: { min: 80, max: 89, label: 'Strong' },
      C: { min: 70, max: 79, label: 'Good' },
      D: { min: 60, max: 69, label: 'Fair' },
      F: { min: 0, max: 59, label: 'Needs Improvement' },
    };
  }

  /**
   * Generate comprehensive intelligence report
   * @param {Object} allResults - Complete analysis from all engines
   * @returns {Object} Enterprise-level report
   */
  generateReport(allResults) {
    if (!allResults) {
      return this.getEmptyReport();
    }

    const {
      ats,
      keywords,
      semantic,
      achievements,
      grammar,
      readability,
      actionVerbs,
      quantification,
      recruiterConfidence,
      technicalScore,
      benchmark,
      jobMatch,
      normalizedDoc,
    } = allResults;

    // Generate all report sections
    const executiveSummary = this.generateExecutiveSummary(allResults);
    const atsReport = this.generateATSReport(ats);
    const keywordReport = this.generateKeywordReport(keywords);
    const formattingReport = this.generateFormattingReport(ats);
    const grammarReport = this.generateGrammarReport(grammar);
    const readabilityReport = this.generateReadabilityReport(readability);
    const leadershipReport = this.generateLeadershipReport(semantic);
    const impactReport = this.generateImpactReport(semantic, quantification);
    const achievementReport = this.generateAchievementReport(achievements);
    const technicalReport = this.generateTechnicalReport(technicalScore);
    const recruiterConfidenceReport = this.generateRecruiterConfidenceReport(recruiterConfidence);
    const hiringProbability = this.calculateHiringProbability(allResults);
    const industryBenchmark = this.generateIndustryBenchmarkReport(benchmark);
    const roleReadiness = this.generateRoleReadinessReport(allResults);
    const strengths = this.identifyStrengths(allResults);
    const weaknesses = this.identifyWeaknesses(allResults);
    const topPriorityFixes = this.generateTopPriorityFixes(allResults);
    const actionVerbAnalysis = this.generateActionVerbAnalysis(actionVerbs);
    const quantificationAnalysis = this.generateQuantificationAnalysis(quantification);
    const keywordHeatmap = this.generateKeywordHeatmap(keywords);
    const missingKeywords = this.identifyMissingKeywords(keywords);
    const matchedKeywords = this.identifyMatchedKeywords(keywords);
    const sectionAnalysis = this.generateSectionAnalysis(normalizedDoc);
    const timelineAnalysis = this.generateTimelineAnalysis(normalizedDoc);
    const resumeFlow = this.analyzeResumeFlow(readability, semantic);
    const skillDistribution = this.analyzeSkillDistribution(keywords, technicalScore);
    const experienceDistribution = this.analyzeExperienceDistribution(semantic, achievements);
    const educationAnalysis = this.analyzeEducation(normalizedDoc);
    const projectsAnalysis = this.analyzeProjects(normalizedDoc);
    const certificationAnalysis = this.analyzeCertifications(normalizedDoc);
    const atsCompatibility = this.generateATSCompatibilityReport(ats);
    const aiRewriteSuggestions = this.generateAIRewriteSuggestions(achievements, quantification);
    const beforeAfterExamples = this.generateBeforeAfterExamples(achievements);
    const recruiterNotes = this.generateRecruiterNotes(recruiterConfidence, allResults);
    const interviewReadiness = this.generateInterviewReadiness(allResults);
    const careerGrowthSuggestions = this.generateCareerGrowthSuggestions(allResults);

    return {
      success: true,
      generatedAt: new Date().toISOString(),
      version: '2.0',
      
      // Core Metrics
      executiveSummary,
      atsScore: atsReport,
      keywordScore: keywordReport,
      formattingScore: formattingReport,
      grammarScore: grammarReport,
      readabilityScore: readabilityReport,
      leadershipScore: leadershipReport,
      impactScore: impactReport,
      achievementScore: achievementReport,
      technicalScore: technicalReport,
      recruiterConfidence: recruiterConfidenceReport,
      hiringProbability,
      industryBenchmark,
      roleReadiness,
      
      // Analysis
      strengths,
      weaknesses,
      topPriorityFixes,
      actionVerbAnalysis,
      quantificationAnalysis,
      keywordHeatmap,
      missingKeywords,
      matchedKeywords,
      sectionAnalysis,
      timelineAnalysis,
      resumeFlow,
      skillDistribution,
      experienceDistribution,
      educationAnalysis,
      projectsAnalysis,
      certificationAnalysis,
      atsCompatibility,
      
      // Suggestions
      aiRewriteSuggestions,
      beforeAfterExamples,
      recruiterNotes,
      interviewReadiness,
      careerGrowthSuggestions,
      
      // Metadata
      metadata: {
        processingTime: allResults.metadata?.processingTime || 0,
        enginesUsed: this.getEnginesUsed(allResults),
        confidence: this.calculateOverallConfidence(allResults),
        exportReady: true,
      },
    };
  }

  /**
   * Generate executive summary
   */
  generateExecutiveSummary(allResults) {
    const { ats, keywords, semantic, achievements, grammar, readability, technicalScore, recruiterConfidence } = allResults;

    const scores = {
      ats: ats?.atsScore || 0,
      keywords: keywords?.overallCoverage || 0,
      semantic: semantic?.overallScore || 0,
      achievements: achievements?.overallScore || 0,
      grammar: grammar?.overallScore || 0,
      readability: readability?.overallScore || 0,
      technical: technicalScore?.overallScore || 0,
      recruiterConfidence: recruiterConfidence?.overallConfidence || 0,
    };

    const averageScore = Math.round(
      (scores.ats + scores.keywords + scores.semantic + scores.achievements +
       scores.grammar + scores.readability + scores.technical + scores.recruiterConfidence) / 8
    );

    const overallGrade = this.getGrade(averageScore);

    // Identify top strengths
    const strengths = [];
    if (scores.ats >= 80) strengths.push({ area: 'ATS Compatibility', score: scores.ats, reason: 'Resume is well-optimized for automated screening systems' });
    if (scores.keywords >= 75) strengths.push({ area: 'Keyword Coverage', score: scores.keywords, reason: 'Strong industry-relevant keyword usage' });
    if (scores.semantic >= 75) strengths.push({ area: 'Content Quality', score: scores.semantic, reason: 'High-quality, impactful content' });
    if (scores.achievements >= 70) strengths.push({ area: 'Achievements', score: scores.achievements, reason: 'Well-quantified accomplishments' });
    if (scores.technical >= 70) strengths.push({ area: 'Technical Skills', score: scores.technical, reason: 'Strong technical competency demonstration' });

    // Identify critical weaknesses
    const weaknesses = [];
    if (scores.ats < 60) weaknesses.push({ area: 'ATS Compatibility', score: scores.ats, reason: 'Resume may fail automated screening', severity: 'critical' });
    if (scores.keywords < 60) weaknesses.push({ area: 'Keywords', score: scores.keywords, reason: 'Missing critical industry keywords', severity: 'high' });
    if (scores.achievements < 60) weaknesses.push({ area: 'Achievements', score: scores.achievements, reason: 'Insufficient quantifiable results', severity: 'high' });
    if (scores.grammar < 60) weaknesses.push({ area: 'Grammar', score: scores.grammar, reason: 'Language quality issues detected', severity: 'medium' });

    // Generate overall assessment
    let overallAssessment;
    if (averageScore >= 85) {
      overallAssessment = 'Exceptional resume that demonstrates strong qualifications, quantified achievements, and professional presentation. Ready for competitive roles.';
    } else if (averageScore >= 75) {
      overallAssessment = 'Strong resume with solid foundations. Minor improvements in identified areas will make it exceptional.';
    } else if (averageScore >= 65) {
      overallAssessment = 'Good resume with clear potential. Addressing the priority fixes will significantly strengthen its effectiveness.';
    } else if (averageScore >= 55) {
      overallAssessment = 'Resume needs improvement in key areas. Following the recommendations will enhance its competitiveness.';
    } else {
      overallAssessment = 'Resume requires significant revisions. Critical issues must be addressed before submission.';
    }

    return {
      overallAssessment,
      averageScore,
      overallGrade,
      scoreBreakdown: scores,
      topStrengths: strengths.slice(0, 5),
      criticalWeaknesses: weaknesses.slice(0, 5),
      recommendation: this.generateExecutiveRecommendation(scores, weaknesses),
    };
  }

  /**
   * Generate executive recommendation
   */
  generateExecutiveRecommendation(scores, weaknesses) {
    if (weaknesses.some(w => w.severity === 'critical')) {
      return 'Address critical issues immediately before using this resume for job applications.';
    } else if (scores.ats >= 80 && scores.achievements >= 70) {
      return 'Resume is in good shape. Consider minor optimizations for specific roles.';
    } else {
      return 'Focus on the top priority fixes to significantly improve resume effectiveness.';
    }
  }

  /**
   * Generate ATS report
   */
  generateATSReport(ats) {
    if (!ats) return this.getEmptyScore('ATS');

    return {
      score: ats.atsScore,
      grade: this.getGrade(ats.atsScore),
      status: ats.summary?.status || 'unknown',
      reason: this.getATSReason(ats),
      evidence: this.getATSEvidence(ats),
      recommendation: this.getATSRecommendation(ats),
      checks: ats.checks || {},
      issues: ats.recommendations?.slice(0, 5) || [],
    };
  }

  /**
   * Get ATS reason
   */
  getATSReason(ats) {
    if (ats.atsScore >= 90) return 'Resume is highly optimized for ATS systems with excellent formatting and structure';
    if (ats.atsScore >= 80) return 'Resume has good ATS compatibility with minor improvements needed';
    if (ats.atsScore >= 70) return 'Resume has fair ATS compatibility but needs several improvements';
    if (ats.atsScore >= 60) return 'Resume has poor ATS compatibility and may be rejected by some systems';
    return 'Resume has critical ATS issues that will likely cause rejection';
  }

  /**
   * Get ATS evidence
   */
  getATSEvidence(ats) {
    const issues = ats.recommendations || [];
    const criticalIssues = issues.filter(i => i.severity === 'critical').length;
    const highIssues = issues.filter(i => i.severity === 'high').length;

    return {
      totalIssues: issues.length,
      criticalIssues,
      highIssues,
      topIssues: issues.slice(0, 3).map(i => i.issue),
    };
  }

  /**
   * Get ATS recommendation
   */
  getATSRecommendation(ats) {
    if (ats.atsScore >= 90) return 'Maintain current format. Minor optimizations possible but not critical.';
    if (ats.atsScore >= 80) return 'Address high-priority issues to ensure optimal ATS parsing across all systems.';
    return 'Fix critical and high-priority ATS issues immediately to avoid resume rejection.';
  }

  /**
   * Generate keyword report
   */
  generateKeywordReport(keywords) {
    if (!keywords) return this.getEmptyScore('Keywords');

    return {
      score: keywords.overallCoverage,
      grade: this.getGrade(keywords.overallCoverage),
      reason: this.getKeywordReason(keywords),
      evidence: this.getKeywordEvidence(keywords),
      recommendation: this.getKeywordRecommendation(keywords),
      coverage: keywords.overallCoverage,
      categoriesFound: keywords.summary?.categoriesFound || 0,
      totalCategories: keywords.summary?.totalCategories || 0,
      topCategories: this.getTopKeywordCategories(keywords.categories),
    };
  }

  /**
   * Get keyword reason
   */
  getKeywordReason(keywords) {
    if (keywords.overallCoverage >= 80) return 'Excellent keyword coverage demonstrates strong industry alignment';
    if (keywords.overallCoverage >= 60) return 'Good keyword coverage with room for improvement';
    if (keywords.overallCoverage >= 40) return 'Moderate keyword coverage - several important skills missing';
    return 'Poor keyword coverage - resume lacks critical industry keywords';
  }

  /**
   * Get keyword evidence
   */
  getKeywordEvidence(keywords) {
    return {
      totalFound: keywords.summary?.totalFound || 0,
      overallCoverage: keywords.overallCoverage,
      categoriesWithCoverage: Object.values(keywords.categories || {}).filter(c => c.coverage > 0).length,
    };
  }

  /**
   * Get keyword recommendation
   */
  getKeywordRecommendation(keywords) {
    if (keywords.overallCoverage >= 75) return 'Add niche skills to further strengthen keyword profile';
    if (keywords.overallCoverage >= 60) return 'Focus on high-weight categories with low coverage';
    return 'Add critical missing keywords from priority list to improve ATS match';
  }

  /**
   * Get top keyword categories
   */
  getTopKeywordCategories(categories) {
    if (!categories) return [];

    return Object.entries(categories)
      .sort((a, b) => b[1].coverage - a[1].coverage)
      .slice(0, 5)
      .map(([key, cat]) => ({
        name: cat.name,
        coverage: cat.coverage,
        found: cat.foundCount,
        total: cat.totalCount,
      }));
  }

  /**
   * Generate formatting report
   */
  generateFormattingReport(ats) {
    if (!ats?.checks?.formatting) return this.getEmptyScore('Formatting');

    const formatting = ats.checks.formatting;
    return {
      score: formatting.score,
      grade: this.getGrade(formatting.score),
      reason: this.getFormattingReason(formatting),
      evidence: this.getFormattingEvidence(formatting),
      recommendation: this.getFormattingRecommendation(formatting),
      details: formatting.details || {},
    };
  }

  /**
   * Get formatting reason
   */
  getFormattingReason(formatting) {
    if (formatting.passed) return 'Resume follows ATS-friendly formatting guidelines';
    if (formatting.score >= 80) return 'Good formatting with minor issues';
    if (formatting.score >= 60) return 'Several formatting issues that may affect ATS parsing';
    return 'Critical formatting issues that will cause ATS parsing problems';
  }

  /**
   * Get formatting evidence
   */
  getFormattingEvidence(formatting) {
    const issues = formatting.issues || [];
    return {
      issueCount: issues.length,
      issues: issues.slice(0, 3).map(i => ({ rule: i.rule, issue: i.issue })),
    };
  }

  /**
   * Get formatting recommendation
   */
  getFormattingRecommendation(formatting) {
    if (formatting.passed) return 'Maintain current formatting';
    const criticalIssues = formatting.issues?.filter(i => i.severity === 'critical' || i.severity === 'high');
    if (criticalIssues && criticalIssues.length > 0) {
      return `Fix ${criticalIssues.length} critical/high-priority formatting issues: ${criticalIssues[0].recommendation}`;
    }
    return 'Address formatting issues for better ATS compatibility';
  }

  /**
   * Generate grammar report
   */
  generateGrammarReport(grammar) {
    if (!grammar) return this.getEmptyScore('Grammar');

    return {
      score: grammar.overallScore,
      grade: this.getGrade(grammar.overallScore),
      reason: this.getGrammarReason(grammar),
      evidence: this.getGrammarEvidence(grammar),
      recommendation: this.getGrammarRecommendation(grammar),
      subscores: {
        grammar: grammar.grammarScore,
        clarity: grammar.clarityScore,
        professionalism: grammar.professionalismScore,
      },
      issues: grammar.issues || {},
    };
  }

  /**
   * Get grammar reason
   */
  getGrammarReason(grammar) {
    if (grammar.overallScore >= 90) return 'Excellent grammar and language quality';
    if (grammar.overallScore >= 80) return 'Good language quality with minor issues';
    if (grammar.overallScore >= 70) return 'Adequate language quality but needs improvement';
    if (grammar.overallScore >= 60) return 'Several language issues that need attention';
    return 'Critical language quality issues that must be fixed';
  }

  /**
   * Get grammar evidence
   */
  getGrammarEvidence(grammar) {
    return {
      passiveVoice: grammar.issues?.passiveVoice || 0,
      weakPhrases: grammar.issues?.weakPhrases || 0,
      vagueLanguage: grammar.issues?.vagueLanguage || 0,
      spellingErrors: grammar.issues?.spellingErrors || 0,
      examples: grammar.details?.spellingErrors?.slice(0, 3) || [],
    };
  }

  /**
   * Get grammar recommendation
   */
  getGrammarRecommendation(grammar) {
    const issues = [];
    if (grammar.issues?.spellingErrors > 0) issues.push('correct spelling errors');
    if (grammar.issues?.weakPhrases > 2) issues.push('replace weak phrases with strong verbs');
    if (grammar.issues?.passiveVoice > 3) issues.push('convert passive voice to active');
    if (grammar.issues?.vagueLanguage > 3) issues.push('replace vague terms with specifics');

    if (issues.length === 0) return 'Maintain current language quality';
    return `Improve language quality: ${issues.join(', ')}`;
  }

  /**
   * Generate readability report
   */
  generateReadabilityReport(readability) {
    if (!readability) return this.getEmptyScore('Readability');

    return {
      score: readability.overallScore,
      grade: this.getGrade(readability.overallScore),
      reason: this.getReadabilityReason(readability),
      evidence: this.getReadabilityEvidence(readability),
      recommendation: this.getReadabilityRecommendation(readability),
      metrics: readability.metrics || {},
      dimensions: readability.dimensions || {},
    };
  }

  /**
   * Get readability reason
   */
  getReadabilityReason(readability) {
    if (readability.overallScore >= 90) return 'Excellent readability - clear, concise, and well-structured';
    if (readability.overallScore >= 80) return 'Good readability with clear communication';
    if (readability.overallScore >= 70) return 'Adequate readability but could be improved';
    if (readability.overallScore >= 60) return 'Readability issues may hinder comprehension';
    return 'Poor readability that may confuse recruiters';
  }

  /**
   * Get readability evidence
   */
  getReadabilityEvidence(readability) {
    return {
      wordCount: readability.metrics?.wordCount || 0,
      avgSentenceLength: readability.metrics?.avgSentenceLength || 0,
      strengths: readability.strengths?.slice(0, 3) || [],
      weaknesses: readability.weaknesses?.slice(0, 3) || [],
    };
  }

  /**
   * Get readability recommendation
   */
  getReadabilityRecommendation(readability) {
    const recommendations = [];
    if (readability.metrics?.wordCount < 200) recommendations.push('expand content');
    if (readability.metrics?.avgSentenceLength > 25) recommendations.push('shorten sentences');
    if (readability.dimensions?.sentenceVariety?.variety === 'low') recommendations.push('vary sentence structure');
    if (readability.dimensions?.flow?.flow === 'poor') recommendations.push('improve logical flow');

    if (recommendations.length === 0) return 'Maintain current readability';
    return `Improve readability: ${recommendations.join(', ')}`;
  }

  /**
   * Generate leadership report
   */
  generateLeadershipReport(semantic) {
    if (!semantic?.dimensions?.leadership) return this.getEmptyScore('Leadership');

    const leadership = semantic.dimensions.leadership;
    return {
      score: leadership.score,
      grade: this.getGrade(leadership.score),
      reason: this.getLeadershipReason(leadership),
      evidence: this.getLeadershipEvidence(leadership),
      recommendation: this.getLeadershipRecommendation(leadership),
      indicators: leadership.indicators || [],
      teamSize: leadership.teamSize || 0,
      hasLeadershipTitle: leadership.hasLeadershipTitle || false,
    };
  }

  /**
   * Get leadership reason
   */
  getLeadershipReason(leadership) {
    if (leadership.score >= 90) return 'Exceptional leadership experience clearly demonstrated';
    if (leadership.score >= 80) return 'Strong leadership indicators present';
    if (leadership.score >= 70) return 'Good leadership experience shown';
    if (leadership.score >= 60) return 'Some leadership experience but could be stronger';
    return 'Limited leadership experience demonstrated';
  }

  /**
   * Get leadership evidence
   */
  getLeadershipEvidence(leadership) {
    return {
      indicatorCount: leadership.indicatorCount || 0,
      indicators: leadership.indicators?.slice(0, 5) || [],
      teamSize: leadership.teamSize || 0,
      hasTitle: leadership.hasLeadershipTitle || false,
    };
  }

  /**
   * Get leadership recommendation
   */
  getLeadershipRecommendation(leadership) {
    if (leadership.score >= 80) return 'Highlight leadership achievements more prominently';
    if (leadership.hasLeadershipTitle) return 'Add more details about team size and leadership scope';
    return 'Add leadership experience, even for IC roles (mentoring, leading projects, etc.)';
  }

  /**
   * Generate impact report
   */
  generateImpactReport(semantic, quantification) {
    if (!semantic?.dimensions?.impact) return this.getEmptyScore('Impact');

    const impact = semantic.dimensions.impact;
    return {
      score: impact.score,
      grade: this.getGrade(impact.score),
      reason: this.getImpactReason(impact, quantification),
      evidence: this.getImpactEvidence(impact, quantification),
      recommendation: this.getImpactRecommendation(impact, quantification),
      quantifiedAchievements: impact.quantifiedAchievements || 0,
      beforeAfterPatterns: impact.beforeAfter || false,
    };
  }

  /**
   * Get impact reason
   */
  getImpactReason(impact, quantification) {
    const metricCount = quantification?.totalMetrics || 0;
    if (impact.score >= 90) return 'Exceptional impact demonstration with strong metrics';
    if (impact.score >= 80) return 'Strong impact with good use of quantifiable results';
    if (metricCount >= 5) return 'Good impact demonstration with metrics';
    if (impact.score >= 60) return 'Moderate impact - more quantification needed';
    return 'Weak impact demonstration - insufficient metrics';
  }

  /**
   * Get impact evidence
   */
  getImpactEvidence(impact, quantification) {
    return {
      quantifiedAchievements: impact.quantifiedAchievements || 0,
      totalMetrics: quantification?.totalMetrics || 0,
      beforeAfter: impact.beforeAfter || false,
      impactVerbs: impact.indicators?.slice(0, 5) || [],
    };
  }

  /**
   * Get impact recommendation
   */
  getImpactRecommendation(impact, quantification) {
    const metricCount = quantification?.totalMetrics || 0;
    if (metricCount >= 8) return 'Add more before/after comparisons to strengthen impact narrative';
    if (metricCount >= 5) return 'Add more specific metrics to quantify achievements';
    return 'Add quantifiable metrics (%, $, numbers) to all major achievements';
  }

  /**
   * Generate achievement report
   */
  generateAchievementReport(achievements) {
    if (!achievements) return this.getEmptyScore('Achievements');

    return {
      score: achievements.overallScore,
      grade: this.getGrade(achievements.overallScore),
      reason: this.getAchievementReason(achievements),
      evidence: this.getAchievementEvidence(achievements),
      recommendation: this.getAchievementRecommendation(achievements),
      breakdown: {
        strong: achievements.strongCount || 0,
        average: achievements.averageCount || 0,
        weak: achievements.weakCount || 0,
        strongPercentage: achievements.strongPercentage || 0,
      },
    };
  }

  /**
   * Get achievement reason
   */
  getAchievementReason(achievements) {
    const strongPct = achievements.strongPercentage || 0;
    if (strongPct >= 70) return 'Excellent achievement quality with mostly strong, metric-driven statements';
    if (strongPct >= 50) return 'Good achievement quality with room for improvement';
    if (strongPct >= 30) return 'Moderate achievement quality - several need strengthening';
    return 'Poor achievement quality - most need to be rewritten';
  }

  /**
   * Get achievement evidence
   */
  getAchievementEvidence(achievements) {
    return {
      total: achievements.total || 0,
      strong: achievements.strongCount || 0,
      average: achievements.averageCount || 0,
      weak: achievements.weakCount || 0,
      strongPercentage: achievements.strongPercentage || 0,
    };
  }

  /**
   * Get achievement recommendation
   */
  getAchievementRecommendation(achievements) {
    const weakCount = achievements.weakCount || 0;
    if (weakCount === 0) return 'Maintain strong achievement quality';
    if (weakCount <= 2) return `Rewrite ${weakCount} weak achievement(s) with stronger language and metrics`;
    return `Rewrite ${weakCount} weak achievements - focus on adding quantifiable results`;
  }

  /**
   * Generate technical report
   */
  generateTechnicalReport(technicalScore) {
    if (!technicalScore) return this.getEmptyScore('Technical');

    return {
      score: technicalScore.overallScore,
      grade: this.getGrade(technicalScore.overallScore),
      reason: this.getTechnicalReason(technicalScore),
      evidence: this.getTechnicalEvidence(technicalScore),
      recommendation: this.getTechnicalRecommendation(technicalScore),
      topSkills: technicalScore.topSkills?.slice(0, 10) || [],
      depth: technicalScore.depth?.depth || 'unknown',
      breadth: technicalScore.breadth?.breadth || 'unknown',
    };
  }

  /**
   * Get technical reason
   */
  getTechnicalReason(technicalScore) {
    if (technicalScore.overallScore >= 90) return 'Exceptional technical competency with deep expertise across multiple areas';
    if (technicalScore.overallScore >= 80) return 'Strong technical skills with good depth and breadth';
    if (technicalScore.overallScore >= 70) return 'Good technical foundation with some gaps';
    if (technicalScore.overallScore >= 60) return 'Moderate technical skills - needs strengthening';
    return 'Limited technical skills - significant gaps identified';
  }

  /**
   * Get technical evidence
   */
  getTechnicalEvidence(technicalScore) {
    return {
      overallCoverage: technicalScore.skillScore || 0,
      depth: technicalScore.depth?.depth || 'unknown',
      breadth: technicalScore.breadth?.breadth || 'unknown',
      topSkills: technicalScore.topSkills?.slice(0, 5) || [],
      categoriesCovered: technicalScore.breadth?.categoriesCovered || 0,
    };
  }

  /**
   * Get technical recommendation
   */
  getTechnicalRecommendation(technicalScore) {
    if (technicalScore.overallScore >= 80) return 'Add emerging technologies to stay current';
    if (technicalScore.breadth?.breadth === 'limited') return 'Expand technical skill set with complementary technologies';
    if (technicalScore.depth?.depth === 'beginner') return 'Deepen technical expertise through projects and certifications';
    return 'Strengthen technical skills and add more context to technical achievements';
  }

  /**
   * Generate recruiter confidence report
   */
  generateRecruiterConfidenceReport(recruiterConfidence) {
    if (!recruiterConfidence) return this.getEmptyScore('Recruiter Confidence');

    return {
      score: recruiterConfidence.overallConfidence,
      grade: this.getGrade(recruiterConfidence.overallConfidence),
      level: recruiterConfidence.level,
      reason: this.getConfidenceReason(recruiterConfidence),
      evidence: this.getConfidenceEvidence(recruiterConfidence),
      recommendation: this.getConfidenceRecommendation(recruiterConfidence),
      perspective: recruiterConfidence.recruiterPerspective,
      concerns: recruiterConfidence.concerns?.slice(0, 3) || [],
      positiveSignals: recruiterConfidence.positiveSignals?.slice(0, 3) || [],
    };
  }

  /**
   * Get confidence reason
   */
  getConfidenceReason(recruiterConfidence) {
    if (recruiterConfidence.overallConfidence >= 85) return 'Very high confidence - resume is clear, credible, and complete';
    if (recruiterConfidence.overallConfidence >= 75) return 'High confidence - strong candidate profile with minor gaps';
    if (recruiterConfidence.overallConfidence >= 65) return 'Moderate confidence - some concerns may cause hesitation';
    if (recruiterConfidence.overallConfidence >= 55) return 'Low confidence - multiple issues may lead to rejection';
    return 'Very low confidence - critical issues must be fixed';
  }

  /**
   * Get confidence evidence
   */
  getConfidenceEvidence(recruiterConfidence) {
    return {
      factors: recruiterConfidence.factors || {},
      concerns: recruiterConfidence.concerns?.length || 0,
      positiveSignals: recruiterConfidence.positiveSignals?.length || 0,
    };
  }

  /**
   * Get confidence recommendation
   */
  getConfidenceRecommendation(recruiterConfidence) {
    const concerns = recruiterConfidence.concerns || [];
    if (concerns.length === 0) return 'Resume gives strong confidence to recruiters';
    const criticalConcerns = concerns.filter(c => c.severity === 'critical');
    if (criticalConcerns.length > 0) {
      return `Address ${criticalConcerns.length} critical concern(s) to improve recruiter confidence`;
    }
    return 'Address identified concerns to strengthen recruiter impression';
  }

  /**
   * Calculate hiring probability
   */
  calculateHiringProbability(allResults) {
    const { ats, keywords, semantic, achievements, jobMatch } = allResults;

    let probability = 50; // Base probability

    // ATS contribution (30%)
    if (ats) {
      probability += (ats.atsScore - 50) * 0.3;
    }

    // Keywords contribution (15%)
    if (keywords) {
      probability += (keywords.overallCoverage - 50) * 0.15;
    }

    // Semantic contribution (15%)
    if (semantic) {
      probability += (semantic.overallScore - 50) * 0.15;
    }

    // Achievements contribution (20%)
    if (achievements) {
      probability += (achievements.overallScore - 50) * 0.20;
    }

    // Job match contribution (20%)
    if (jobMatch) {
      probability += (jobMatch.overallMatch - 50) * 0.20;
      probability -= (jobMatch.hiringRisk?.score || 0) * 0.1;
    }

    const percentage = Math.max(0, Math.min(100, Math.round(probability)));

    return {
      percentage,
      grade: this.getGrade(percentage),
      reason: this.getHiringReason(percentage),
      evidence: this.getHiringEvidence(allResults),
      recommendation: this.getHiringRecommendation(percentage),
      factors: this.getHiringFactors(allResults),
    };
  }

  /**
   * Get hiring reason
   */
  getHiringReason(percentage) {
    if (percentage >= 85) return 'Very high probability of getting interviews and offers';
    if (percentage >= 75) return 'High probability of advancing to interview stage';
    if (percentage >= 65) return 'Good probability with competitive profile';
    if (percentage >= 55) return 'Moderate probability - improvements needed';
    if (percentage >= 45) return 'Low probability without significant improvements';
    return 'Very low probability - major revisions required';
  }

  /**
   * Get hiring evidence
   */
  getHiringEvidence(allResults) {
    const factors = [];
    if (allResults.ats?.atsScore >= 80) factors.push('Strong ATS compatibility');
    if (allResults.keywords?.overallCoverage >= 70) factors.push('Good keyword match');
    if (allResults.achievements?.strongPercentage >= 60) factors.push('Strong achievements');
    if (allResults.recruiterConfidence?.overallConfidence >= 75) factors.push('High recruiter confidence');

    return {
      positiveFactors: factors,
      score: Math.round(
        (allResults.ats?.atsScore || 0) * 0.3 +
        (allResults.keywords?.overallCoverage || 0) * 0.15 +
        (allResults.semantic?.overallScore || 0) * 0.15 +
        (allResults.achievements?.overallScore || 0) * 0.2 +
        (allResults.jobMatch?.overallMatch || 50) * 0.2
      ),
    };
  }

  /**
   * Get hiring recommendation
   */
  getHiringRecommendation(percentage) {
    if (percentage >= 80) return 'Resume is ready for top-tier applications';
    if (percentage >= 70) return 'Apply with confidence to well-matched roles';
    if (percentage >= 60) return 'Apply after addressing priority improvements';
    return 'Improve resume before applying to increase chances';
  }

  /**
   * Get hiring factors
   */
  getHiringFactors(allResults) {
    const factors = [];

    if (allResults.ats?.atsScore >= 80) factors.push('Passes ATS screening');
    if (allResults.keywords?.overallCoverage >= 70) factors.push('Matches job requirements');
    if (allResults.achievements?.strongPercentage >= 60) factors.push('Demonstrates impact');
    if (allResults.recruiterConfidence?.overallConfidence >= 75) factors.push('Builds recruiter trust');

    return factors;
  }

  /**
   * Generate industry benchmark report
   */
  generateIndustryBenchmarkReport(benchmark) {
    if (!benchmark) return this.getEmptyScore('Industry Benchmark');

    return {
      score: benchmark.overallScore,
      grade: this.getGrade(benchmark.overallScore),
      reason: this.getBenchmarkReason(benchmark),
      evidence: this.getBenchmarkEvidence(benchmark),
      recommendation: this.getBenchmarkRecommendation(benchmark),
      role: benchmark.role,
      competitiveness: benchmark.competitiveness,
      gaps: benchmark.gaps?.slice(0, 5) || [],
    };
  }

  /**
   * Get benchmark reason
   */
  getBenchmarkReason(benchmark) {
    if (benchmark.overallScore >= 90) return 'Exceptional - exceeds industry standards';
    if (benchmark.overallScore >= 80) return 'Strong - meets or exceeds most industry standards';
    if (benchmark.overallScore >= 70) return 'Good - meets basic industry standards';
    if (benchmark.overallScore >= 60) return 'Fair - below industry standards in some areas';
    return 'Below average - significant gaps vs. industry standards';
  }

  /**
   * Get benchmark evidence
   */
  getBenchmarkEvidence(benchmark) {
    return {
      role: benchmark.role?.detected || 'Unknown',
      competitiveness: benchmark.competitiveness?.level || 'unknown',
      gaps: benchmark.gaps?.length || 0,
      comparisons: benchmark.comparisons || {},
    };
  }

  /**
   * Get benchmark recommendation
   */
  getBenchmarkRecommendation(benchmark) {
    const gaps = benchmark.gaps || [];
    if (gaps.length === 0) return 'Resume meets or exceeds industry standards';
    if (gaps.length <= 2) return `Address ${gaps.length} key gap(s) to meet industry standards`;
    return `Address ${gaps.length} gaps to align with industry expectations`;
  }

  /**
   * Generate role readiness report
   */
  generateRoleReadinessReport(allResults) {
    const { benchmark, jobMatch, technicalScore } = allResults;

    const benchmarkScore = benchmark?.overallScore || 0;
    const jobMatchScore = jobMatch?.overallMatch || 0;
    const technicalScoreVal = technicalScore?.overallScore || 0;

    const readinessScore = Math.round((benchmarkScore * 0.4 + jobMatchScore * 0.35 + technicalScoreVal * 0.25));

    return {
      score: readinessScore,
      grade: this.getGrade(readinessScore),
      reason: this.getReadinessReason(readinessScore, benchmarkScore, jobMatchScore),
      evidence: {
        benchmarkScore,
        jobMatchScore,
        technicalScore: technicalScoreVal,
      },
      recommendation: this.getReadinessRecommendation(readinessScore),
      targetRole: benchmark?.role?.detected || 'Not specified',
    };
  }

  /**
   * Get readiness reason
   */
  getReadinessReason(score, benchmark, jobMatch) {
    if (score >= 85) return 'Highly ready for target role - exceeds expectations';
    if (score >= 75) return 'Well-prepared for target role with strong qualifications';
    if (score >= 65) return 'Moderately ready - meets basic requirements';
    if (score >= 55) return 'Partially ready - some gaps need addressing';
    return 'Not yet ready - significant preparation needed';
  }

  /**
   * Get readiness recommendation
   */
  getReadinessRecommendation(score) {
    if (score >= 80) return 'Apply to target roles with confidence';
    if (score >= 70) return 'Address minor gaps then apply';
    if (score >= 60) return 'Strengthen key areas before applying';
    return 'Significant preparation needed before applying to target roles';
  }

  /**
   * Identify strengths
   */
  identifyStrengths(allResults) {
    const strengths = [];

    if (allResults.ats?.atsScore >= 80) {
      strengths.push({
        area: 'ATS Compatibility',
        score: allResults.ats.atsScore,
        reason: 'Resume passes automated screening systems',
        impact: 'Increases chances of reaching human reviewers',
      });
    }

    if (allResults.achievements?.strongPercentage >= 60) {
      strengths.push({
        area: 'Achievements',
        score: allResults.achievements.strongPercentage,
        reason: 'Majority of achievements are strong and metric-driven',
        impact: 'Demonstrates clear impact and value to employers',
      });
    }

    if (allResults.technicalScore?.overallScore >= 75) {
      strengths.push({
        area: 'Technical Skills',
        score: allResults.technicalScore.overallScore,
        reason: 'Strong technical competency with broad skill coverage',
        impact: 'Shows ability to handle technical responsibilities',
      });
    }

    if (allResults.grammar?.overallScore >= 80) {
      strengths.push({
        area: 'Language Quality',
        score: allResults.grammar.overallScore,
        reason: 'Professional grammar and clear communication',
        impact: 'Creates positive first impression',
      });
    }

    if (allResults.recruiterConfidence?.overallConfidence >= 75) {
      strengths.push({
        area: 'Recruiter Appeal',
        score: allResults.recruiterConfidence.overallConfidence,
        reason: 'Resume builds trust and credibility',
        impact: 'Increases likelihood of interview invitation',
      });
    }

    return strengths.slice(0, 8);
  }

  /**
   * Identify weaknesses
   */
  identifyWeaknesses(allResults) {
    const weaknesses = [];

    if (allResults.ats?.atsScore < 60) {
      weaknesses.push({
        area: 'ATS Compatibility',
        score: allResults.ats.atsScore,
        reason: 'Critical ATS issues may cause automatic rejection',
        severity: 'critical',
        impact: 'Resume may never reach human reviewers',
      });
    }

    if (allResults.achievements?.strongPercentage < 40) {
      weaknesses.push({
        area: 'Achievements',
        score: allResults.achievements.strongPercentage,
        reason: 'Most achievements lack quantifiable metrics',
        severity: 'high',
        impact: 'Fails to demonstrate concrete impact',
      });
    }

    if (allResults.keywords?.overallCoverage < 50) {
      weaknesses.push({
        area: 'Keywords',
        score: allResults.keywords.overallCoverage,
        reason: 'Missing critical industry keywords',
        severity: 'high',
        impact: 'Poor ATS matching and recruiter searchability',
      });
    }

    if (allResults.grammar?.overallScore < 60) {
      weaknesses.push({
        area: 'Grammar',
        score: allResults.grammar.overallScore,
        reason: 'Language quality issues detected',
        severity: 'medium',
        impact: 'Creates unprofessional impression',
      });
    }

    return weaknesses.slice(0, 8);
  }

  /**
   * Generate top priority fixes
   */
  generateTopPriorityFixes(allResults) {
    const fixes = [];

    // Critical ATS fixes
    if (allResults.ats?.recommendations) {
      const criticalIssues = allResults.ats.recommendations.filter(r => r.severity === 'critical');
      criticalIssues.forEach((issue, index) => {
        fixes.push({
          priority: index + 1,
          category: 'ATS',
          severity: 'critical',
          issue: issue.issue,
          fix: issue.recommendation,
          reason: issue.recommendation,
          impact: 'Critical for passing automated screening',
        });
      });
    }

    // Achievement fixes
    if (allResults.achievements?.rewriteCandidates && allResults.achievements.rewriteCandidates.length > 0) {
      fixes.push({
        priority: fixes.length + 1,
        category: 'Achievements',
        severity: 'high',
        issue: `${allResults.achievements.rewriteCandidates.length} weak achievements need rewriting`,
        fix: 'Rewrite weak achievements with strong action verbs and metrics',
        reason: 'Strong achievements significantly improve resume effectiveness',
        impact: 'Better demonstrates your value and impact',
      });
    }

    // Keyword fixes
    if (allResults.keywords?.priorityMissing && allResults.keywords.priorityMissing.length > 0) {
      const highPriority = allResults.keywords.priorityMissing.filter(k => k.importance === 'high');
      if (highPriority.length > 0) {
        fixes.push({
          priority: fixes.length + 1,
          category: 'Keywords',
          severity: 'high',
          issue: `${highPriority.length} high-priority keywords missing`,
          fix: `Add keywords: ${highPriority.slice(0, 5).map(k => k.keyword).join(', ')}`,
          reason: 'Critical for ATS matching and recruiter search',
          impact: 'Improves match with job requirements',
        });
      }
    }

    // Grammar fixes
    if (allResults.grammar?.issues?.spellingErrors > 0) {
      fixes.push({
        priority: fixes.length + 1,
        category: 'Grammar',
        severity: 'critical',
        issue: `Spelling errors detected: ${allResults.grammar.details?.spellingErrors?.map(e => e.incorrect).join(', ')}`,
        fix: 'Correct all spelling errors',
        reason: 'Spelling errors create unprofessional impression',
        impact: 'Maintains credibility and attention to detail',
      });
    }

    return fixes.slice(0, 10);
  }

  /**
   * Generate action verb analysis
   */
  generateActionVerbAnalysis(actionVerbs) {
    if (!actionVerbs) return this.getEmptyScore('Action Verbs');

    return {
      score: actionVerbs.overallScore,
      grade: this.getGrade(actionVerbs.overallScore),
      reason: this.getActionVerbReason(actionVerbs),
      evidence: this.getActionVerbEvidence(actionVerbs),
      recommendation: this.getActionVerbRecommendation(actionVerbs),
      verbCounts: actionVerbs.verbCounts || {},
      topVerbs: actionVerbs.topVerbs?.slice(0, 10) || [],
      variety: actionVerbs.variety || {},
    };
  }

  /**
   * Get action verb reason
   */
  getActionVerbReason(actionVerbs) {
    const strongCount = actionVerbs.verbCounts?.strong || 0;
    if (strongCount >= 10) return 'Excellent use of strong, varied action verbs';
    if (strongCount >= 7) return 'Good action verb usage with adequate variety';
    if (strongCount >= 5) return 'Moderate action verb usage - could be stronger';
    return 'Limited action verbs - achievements lack impact';
  }

  /**
   * Get action verb evidence
   */
  getActionVerbEvidence(actionVerbs) {
    return {
      totalVerbs: actionVerbs.verbCounts?.total || 0,
      strongVerbs: actionVerbs.verbCounts?.strong || 0,
      exceptionalVerbs: actionVerbs.verbCounts?.exceptional || 0,
      weakPhrases: actionVerbs.verbCounts?.weak || 0,
      variety: actionVerbs.variety?.uniqueVerbs || 0,
    };
  }

  /**
   * Get action verb recommendation
   */
  getActionVerbRecommendation(actionVerbs) {
    const weakCount = actionVerbs.verbCounts?.weak || 0;
    const strongCount = actionVerbs.verbCounts?.strong || 0;

    if (weakCount > 2) return `Replace ${weakCount} weak phrases with strong action verbs`;
    if (strongCount < 5) return 'Add more strong action verbs to achievements';
    if (actionVerbs.variety?.uniqueVerbs < 8) return 'Use more varied action verbs to avoid repetition';
    return 'Maintain strong action verb usage';
  }

  /**
   * Generate quantification analysis
   */
  generateQuantificationAnalysis(quantification) {
    if (!quantification) return this.getEmptyScore('Quantification');

    return {
      score: quantification.overallScore,
      grade: this.getGrade(quantification.overallScore),
      reason: this.getQuantificationReason(quantification),
      evidence: this.getQuantificationEvidence(quantification),
      recommendation: this.getQuantificationRecommendation(quantification),
      metrics: quantification.metrics || {},
      breakdown: quantification.breakdown || {},
    };
  }

  /**
   * Get quantification reason
   */
  getQuantificationReason(quantification) {
    const total = quantification.metrics?.totalMetrics || 0;
    if (total >= 10) return 'Exceptional use of quantifiable metrics throughout';
    if (total >= 7) return 'Strong quantification with good metric variety';
    if (total >= 5) return 'Good use of metrics but could be stronger';
    if (total >= 3) return 'Limited quantification - more metrics needed';
    return 'Very few quantifiable achievements';
  }

  /**
   * Get quantification evidence
   */
  getQuantificationEvidence(quantification) {
    return {
      totalMetrics: quantification.metrics?.totalMetrics || 0,
      percentages: quantification.metrics?.percentages || 0,
      monetary: quantification.metrics?.monetary || 0,
      numbers: quantification.metrics?.numbers || 0,
      density: quantification.metrics?.metricsPerSentence || 0,
    };
  }

  /**
   * Get quantification recommendation
   */
  getQuantificationRecommendation(quantification) {
    const total = quantification.metrics?.totalMetrics || 0;
    if (total >= 8) return 'Add more before/after comparisons to strengthen impact';
    if (total >= 5) return 'Add more specific metrics to key achievements';
    return 'Add quantifiable metrics (%, $, numbers) to all major achievements';
  }

  /**
   * Generate keyword heatmap
   */
  generateKeywordHeatmap(keywords) {
    if (!keywords?.categories) return this.getEmptyScore('Keyword Heatmap');

    const heatmap = Object.entries(keywords.categories).map(([key, category]) => ({
      category: category.name,
      coverage: category.coverage,
      found: category.foundCount,
      total: category.totalCount,
      heat: this.getHeatLevel(category.coverage),
    }));

    return {
      data: heatmap,
      reason: 'Visual representation of keyword coverage by category',
      recommendation: 'Focus on categories with low coverage (red/yellow zones)',
    };
  }

  /**
   * Get heat level
   */
  getHeatLevel(coverage) {
    if (coverage >= 70) return { level: 'hot', color: 'green', label: 'Strong' };
    if (coverage >= 50) return { level: 'warm', color: 'yellow', label: 'Moderate' };
    if (coverage >= 30) return { level: 'lukewarm', color: 'orange', label: 'Weak' };
    return { level: 'cold', color: 'red', label: 'Missing' };
  }

  /**
   * Identify missing keywords
   */
  identifyMissingKeywords(keywords) {
    if (!keywords?.priorityMissing) return [];

    return {
      total: keywords.priorityMissing.length,
      high: keywords.priorityMissing.filter(k => k.importance === 'high').length,
      medium: keywords.priorityMissing.filter(k => k.importance === 'medium').length,
      low: keywords.priorityMissing.filter(k => k.importance === 'low').length,
      topMissing: keywords.priorityMissing.slice(0, 15),
      reason: 'Keywords that are commonly required but missing from resume',
      recommendation: 'Add high-priority missing keywords to improve ATS match',
    };
  }

  /**
   * Identify matched keywords
   */
  identifyMatchedKeywords(keywords) {
    if (!keywords?.categories) return { total: 0, keywords: [] };

    const matched = [];
    for (const category of Object.values(keywords.categories)) {
      matched.push(...category.found);
    }

    const uniqueMatched = [...new Set(matched)];

    return {
      total: uniqueMatched.length,
      keywords: uniqueMatched.slice(0, 20),
      reason: 'Keywords successfully included in resume',
      recommendation: 'Maintain these keywords and add complementary skills',
    };
  }

  /**
   * Generate section analysis
   */
  generateSectionAnalysis(normalizedDoc) {
    if (!normalizedDoc?.sections) return this.getEmptySectionAnalysis();

    const sections = normalizedDoc.sections.map(section => ({
      type: section.type,
      present: true,
      hasContent: !section.isEmpty,
      lineCount: section.lineCount,
      quality: this.assessSectionQuality(section),
    }));

    const missingSections = normalizedDoc.sectionAnalysis?.missingSections || [];

    return {
      totalSections: sections.length + missingSections.length,
      presentSections: sections.length,
      missingSections: missingSections.length,
      sections,
      missing: missingSections,
      averageQuality: Math.round(
        sections.reduce((sum, s) => sum + s.quality, 0) / Math.max(sections.length, 1)
      ),
      reason: 'Analysis of resume structure and section completeness',
      recommendation: this.getSectionRecommendation(sections, missingSections),
    };
  }

  /**
   * Assess section quality
   */
  assessSectionQuality(section) {
    let score = 0;
    if (!section.isEmpty) score += 40;
    if (section.lineCount >= 3 && section.lineCount <= 50) score += 30;
    else if (section.lineCount >= 2) score += 20;
    if (section.content.length >= 100) score += 30;
    else if (section.content.length >= 50) score += 20;

    return Math.min(100, score);
  }

  /**
   * Get section recommendation
   */
  getSectionRecommendation(sections, missingSections) {
    if (missingSections.length > 0) {
      return `Add missing sections: ${missingSections.join(', ')}`;
    }
    const lowQuality = sections.filter(s => s.quality < 60);
    if (lowQuality.length > 0) {
      return `Improve content in ${lowQuality.length} section(s) with low quality`;
    }
    return 'All essential sections present with good quality';
  }

  /**
   * Generate timeline analysis
   */
  generateTimelineAnalysis(normalizedDoc) {
    if (!normalizedDoc?.sections) return this.getEmptyTimelineAnalysis();

    const experienceSection = normalizedDoc.sections.find(s => s.type === 'experience');
    if (!experienceSection) {
      return {
        hasTimeline: false,
        reason: 'No experience section found',
        recommendation: 'Add experience section with clear timeline',
      };
    }

    // Check for date patterns
    const datePattern = /\b(20\d{2}|19\d{2})\b/g;
    const dates = experienceSection.content.match(datePattern) || [];

    const hasProgression = /promot|advanc|progress|senior|lead/i.test(experienceSection.content);

    return {
      hasTimeline: dates.length >= 2,
      dateCount: dates.length,
      hasProgression,
      reason: hasProgression ? 'Clear career progression shown' : 'Limited career progression evidence',
      recommendation: hasProgression ? 'Add more timeline details' : 'Show career progression with dates and promotions',
    };
  }

  /**
   * Get empty timeline analysis
   */
  getEmptyTimelineAnalysis() {
    return {
      hasTimeline: false,
      reason: 'Unable to analyze timeline',
      recommendation: 'Add experience section with clear dates',
    };
  }

  /**
   * Analyze resume flow
   */
  analyzeResumeFlow(readability, semantic) {
    const flowScore = readability?.dimensions?.flow?.score || 0;
    const structureScore = readability?.dimensions?.structure?.score || 0;

    const overallScore = Math.round((flowScore + structureScore) / 2);

    return {
      score: overallScore,
      grade: this.getGrade(overallScore),
      reason: this.getFlowReason(overallScore),
      evidence: {
        flow: flowScore,
        structure: structureScore,
        transitions: readability?.dimensions?.flow?.transitionCount || 0,
      },
      recommendation: this.getFlowRecommendation(overallScore),
    };
  }

  /**
   * Get flow reason
   */
  getFlowReason(score) {
    if (score >= 85) return 'Excellent logical flow and structure';
    if (score >= 75) return 'Good flow with clear organization';
    if (score >= 65) return 'Adequate flow but could be improved';
    if (score >= 55) return 'Weak flow - difficult to follow narrative';
    return 'Poor structure - confusing organization';
  }

  /**
   * Get flow recommendation
   */
  getFlowRecommendation(score) {
    if (score >= 80) return 'Maintain current structure';
    if (score >= 65) return 'Add transition words and improve paragraph structure';
    return 'Reorganize content for better logical flow and readability';
  }

  /**
   * Analyze skill distribution
   */
  analyzeSkillDistribution(keywords, technicalScore) {
    const keywordCoverage = keywords?.overallCoverage || 0;
    const technicalCoverage = technicalScore?.skillScore || 0;

    const overallScore = Math.round((keywordCoverage + technicalCoverage) / 2);

    return {
      score: overallScore,
      grade: this.getGrade(overallScore),
      reason: this.getSkillDistributionReason(overallScore),
      evidence: {
        keywordCoverage,
        technicalCoverage,
        topSkills: technicalScore?.topSkills?.slice(0, 10) || [],
      },
      recommendation: this.getSkillDistributionRecommendation(overallScore),
    };
  }

  /**
   * Get skill distribution reason
   */
  getSkillDistributionReason(score) {
    if (score >= 80) return 'Excellent skill distribution across categories';
    if (score >= 70) return 'Good skill coverage with minor gaps';
    if (score >= 60) return 'Moderate skill distribution';
    if (score >= 50) return 'Limited skill variety';
    return 'Very limited skill set';
  }

  /**
   * Get skill distribution recommendation
   */
  getSkillDistributionRecommendation(score) {
    if (score >= 75) return 'Add complementary skills to broaden expertise';
    if (score >= 60) return 'Add skills in underrepresented categories';
    return 'Significantly expand technical and soft skill coverage';
  }

  /**
   * Analyze experience distribution
   */
  analyzeExperienceDistribution(semantic, achievements) {
    const experienceScore = semantic?.dimensions?.experienceQuality?.score || 0;
    const achievementScore = achievements?.overallScore || 0;

    const overallScore = Math.round((experienceScore + achievementScore) / 2);

    return {
      score: overallScore,
      grade: this.getGrade(overallScore),
      reason: this.getExperienceDistributionReason(overallScore),
      evidence: {
        experienceQuality: experienceScore,
        achievementScore,
        strongAchievements: achievements?.strongCount || 0,
      },
      recommendation: this.getExperienceDistributionRecommendation(overallScore),
    };
  }

  /**
   * Get experience distribution reason
   */
  getExperienceDistributionReason(score) {
    if (score >= 85) return 'Excellent experience presentation with strong achievements';
    if (score >= 75) return 'Good experience section with solid achievements';
    if (score >= 65) return 'Adequate experience but needs more impact';
    if (score >= 55) return 'Experience section needs significant improvement';
    return 'Poor experience presentation';
  }

  /**
   * Get experience distribution recommendation
   */
  getExperienceDistributionRecommendation(score) {
    if (score >= 80) return 'Add more recent achievements to show continued impact';
    if (score >= 65) return 'Strengthen achievements with more metrics and impact';
    return 'Rewrite experience section with stronger action verbs and quantifiable results';
  }

  /**
   * Analyze education
   */
  analyzeEducation(normalizedDoc) {
    if (!normalizedDoc?.sections) return this.getEmptyEducationAnalysis();

    const educationSection = normalizedDoc.sections.find(s => s.type === 'education');
    if (!educationSection) {
      return {
        present: false,
        reason: 'Education section not found',
        recommendation: 'Add education section with degree, institution, and graduation year',
      };
    }

    const hasDegree = /bachelor|master|phd|doctorate|associate|diploma|certificate/i.test(educationSection.content);
    const hasInstitution = /university|college|institute|school/i.test(educationSection.content);
    const hasYear = /\d{4}/.test(educationSection.content);

    const qualityScore = (hasDegree ? 40 : 0) + (hasInstitution ? 30 : 0) + (hasYear ? 20 : 0) + 10;

    return {
      present: true,
      hasContent: !educationSection.isEmpty,
      qualityScore: Math.min(100, qualityScore),
      grade: this.getGrade(Math.min(100, qualityScore)),
      reason: this.getEducationReason(hasDegree, hasInstitution, hasYear),
      evidence: {
        hasDegree,
        hasInstitution,
        hasYear,
        contentLength: educationSection.content.length,
      },
      recommendation: this.getEducationRecommendation(hasDegree, hasInstitution, hasYear),
    };
  }

  /**
   * Get education reason
   */
  getEducationReason(hasDegree, hasInstitution, hasYear) {
    if (hasDegree && hasInstitution && hasYear) return 'Complete education information provided';
    if (hasDegree && hasInstitution) return 'Education details mostly complete';
    if (hasDegree) return 'Basic education information present';
    return 'Education section needs more detail';
  }

  /**
   * Get education recommendation
   */
  getEducationRecommendation(hasDegree, hasInstitution, hasYear) {
    const missing = [];
    if (!hasDegree) missing.push('degree type');
    if (!hasInstitution) missing.push('institution name');
    if (!hasYear) missing.push('graduation year');

    if (missing.length === 0) return 'Education section is complete';
    return `Add ${missing.join(', ')} to education section`;
  }

  /**
   * Get empty education analysis
   */
  getEmptyEducationAnalysis() {
    return {
      present: false,
      reason: 'Unable to analyze education',
      recommendation: 'Add education section',
    };
  }

  /**
   * Analyze projects
   */
  analyzeProjects(normalizedDoc) {
    if (!normalizedDoc?.sections) return this.getEmptyProjectsAnalysis();

    const projectsSection = normalizedDoc.sections.find(s => s.type === 'projects');
    if (!projectsSection) {
      return {
        present: false,
        reason: 'Projects section not found',
        recommendation: 'Consider adding projects section to showcase relevant work',
      };
    }

    const hasDetails = projectsSection.content.length >= 100;
    const hasTechnologies = /react|python|node|aws|docker|sql|api/i.test(projectsSection.content);
    const hasImpact = /\d+%|\$\d+|\d+x/i.test(projectsSection.content);

    const qualityScore = (hasDetails ? 35 : 0) + (hasTechnologies ? 35 : 0) + (hasImpact ? 30 : 0);

    return {
      present: true,
      hasContent: !projectsSection.isEmpty,
      qualityScore: Math.min(100, qualityScore),
      grade: this.getGrade(Math.min(100, qualityScore)),
      reason: this.getProjectsReason(hasDetails, hasTechnologies, hasImpact),
      evidence: {
        hasDetails,
        hasTechnologies,
        hasImpact,
        contentLength: projectsSection.content.length,
      },
      recommendation: this.getProjectsRecommendation(hasDetails, hasTechnologies, hasImpact),
    };
  }

  /**
   * Get projects reason
   */
  getProjectsReason(hasDetails, hasTechnologies, hasImpact) {
    if (hasDetails && hasTechnologies && hasImpact) return 'Excellent project details with technologies and impact';
    if (hasDetails && hasTechnologies) return 'Good project details with technologies mentioned';
    if (hasDetails) return 'Basic project information present';
    return 'Projects section needs more detail';
  }

  /**
   * Get projects recommendation
   */
  getProjectsRecommendation(hasDetails, hasTechnologies, hasImpact) {
    const missing = [];
    if (!hasDetails) missing.push('more details');
    if (!hasTechnologies) missing.push('technologies used');
    if (!hasImpact) missing.push('quantifiable impact');

    if (missing.length === 0) return 'Projects section is strong';
    return `Add ${missing.join(', ')} to strengthen projects section`;
  }

  /**
   * Get empty projects analysis
   */
  getEmptyProjectsAnalysis() {
    return {
      present: false,
      reason: 'Unable to analyze projects',
      recommendation: 'Consider adding projects section',
    };
  }

  /**
   * Analyze certifications
   */
  analyzeCertifications(normalizedDoc) {
    if (!normalizedDoc?.sections) return this.getEmptyCertificationAnalysis();

    const certSection = normalizedDoc.sections.find(s => s.type === 'certifications');
    if (!certSection) {
      return {
        present: false,
        reason: 'Certifications section not found',
        recommendation: 'Add relevant certifications to strengthen credentials',
      };
    }

    const certCount = (certSection.content.match(/certification|certificate|certified/gi) || []).length;

    return {
      present: true,
      hasContent: !certSection.isEmpty,
      certificationCount: Math.min(certCount, 10),
      reason: certCount > 0 ? `${certCount} certification(s) found` : 'Certifications section present but may be empty',
      recommendation: certCount > 0 ? 'Add more relevant certifications' : 'Add industry-recognized certifications',
    };
  }

  /**
   * Get empty certification analysis
   */
  getEmptyCertificationAnalysis() {
    return {
      present: false,
      reason: 'Unable to analyze certifications',
      recommendation: 'Consider adding certifications section',
    };
  }

  /**
   * Generate ATS compatibility report
   */
  generateATSCompatibilityReport(ats) {
    if (!ats) return this.getEmptyATSCompatibility();

    return {
      overallScore: ats.atsScore,
      grade: this.getGrade(ats.atsScore),
      compatibility: ats.summary?.status || 'unknown',
      checks: {
        formatting: ats.checks?.formatting?.passed || false,
        structure: ats.checks?.structure?.passed || false,
        content: ats.checks?.content?.passed || false,
        keywords: ats.checks?.keywords?.passed || false,
        contact: ats.checks?.contact?.passed || false,
      },
      criticalIssues: ats.recommendations?.filter(r => r.severity === 'critical').length || 0,
      highIssues: ats.recommendations?.filter(r => r.severity === 'high').length || 0,
      reason: this.getATSCompatibilityReason(ats),
      recommendation: this.getATSCompatibilityRecommendation(ats),
    };
  }

  /**
   * Get ATS compatibility reason
   */
  getATSCompatibilityReason(ats) {
    if (ats.atsScore >= 90) return 'Fully compatible with all major ATS systems';
    if (ats.atsScore >= 80) return 'Compatible with most ATS systems';
    if (ats.atsScore >= 70) return 'Partially compatible - some ATS systems may have issues';
    if (ats.atsScore >= 60) return 'Low compatibility - likely to have parsing issues';
    return 'Incompatible with ATS systems - will likely be rejected';
  }

  /**
   * Get ATS compatibility recommendation
   */
  getATSCompatibilityRecommendation(ats) {
    if (ats.atsScore >= 90) return 'No ATS issues detected';
    const critical = ats.recommendations?.filter(r => r.severity === 'critical').length || 0;
    const high = ats.recommendations?.filter(r => r.severity === 'high').length || 0;
    return `Fix ${critical} critical and ${high} high-priority ATS issues`;
  }

  /**
   * Get empty ATS compatibility
   */
  getEmptyATSCompatibility() {
    return {
      overallScore: 0,
      grade: 'F',
      compatibility: 'unknown',
      checks: {},
      criticalIssues: 0,
      highIssues: 0,
      reason: 'Unable to assess ATS compatibility',
      recommendation: 'Unable to provide recommendation',
    };
  }

  /**
   * Generate AI rewrite suggestions
   */
  generateAIRewriteSuggestions(achievements, quantification) {
    if (!achievements?.rewriteCandidates) return this.getEmptyRewriteSuggestions();

    const rewrites = achievements.rewriteCandidates.slice(0, 5).map(candidate => ({
      original: candidate.original,
      issues: candidate.issues || [],
      reason: 'Weak achievement that needs stronger language and metrics',
      suggestions: [
        'Start with a strong action verb',
        'Add quantifiable metrics (%, $, numbers)',
        'Clarify the impact and business value',
      ],
    }));

    return {
      totalCandidates: achievements.rewriteCandidates.length,
      rewrites,
      reason: 'AI-powered suggestions to strengthen weak achievements',
      recommendation: 'Rewrite these achievements using the suggestions provided',
    };
  }

  /**
   * Get empty rewrite suggestions
   */
  getEmptyRewriteSuggestions() {
    return {
      totalCandidates: 0,
      rewrites: [],
      reason: 'No rewrite suggestions available',
      recommendation: 'All achievements are strong',
    };
  }

  /**
   * Generate before/after examples
   */
  generateBeforeAfterExamples(achievements) {
    if (!achievements?.achievements) return this.getEmptyBeforeAfter();

    const examples = achievements.achievements
      .filter(a => a.strength === 'weak' || a.strength === 'average')
      .slice(0, 3)
      .map(achievement => ({
        before: achievement.text,
        after: this.generateImprovedVersion(achievement.text),
        improvement: this.getImprovementDescription(achievement),
      }));

    return {
      examples,
      reason: 'Example transformations from weak to strong achievements',
      recommendation: 'Apply these patterns to your own achievements',
    };
  }

  /**
   * Generate improved version
   */
  generateImprovedVersion(original) {
    // Simple transformation examples
    if (original.toLowerCase().includes('responsible for')) {
      return original.replace(/responsible for/gi, 'Led');
    }
    if (original.toLowerCase().includes('worked on')) {
      return original.replace(/worked on/gi, 'Developed');
    }
    if (original.toLowerCase().includes('helped')) {
      return original.replace(/helped/gi, 'Contributed to');
    }

    return `[Enhanced version] ${original} - Add specific metrics and stronger action verbs`;
  }

  /**
   * Get improvement description
   */
  getImprovementDescription(achievement) {
    if (achievement.strength === 'weak') return 'Convert weak language to strong action verb and add metrics';
    return 'Strengthen by adding quantifiable results and impact metrics';
  }

  /**
   * Get empty before/after
   */
  getEmptyBeforeAfter() {
    return {
      examples: [],
      reason: 'No before/after examples available',
      recommendation: 'All achievements are already strong',
    };
  }

  /**
   * Generate recruiter notes
   */
  generateRecruiterNotes(recruiterConfidence, allResults) {
    if (!recruiterConfidence) return this.getEmptyRecruiterNotes();

    const notes = [];

    // Overall impression
    notes.push({
      category: 'Overall Impression',
      note: recruiterConfidence.recruiterPerspective || 'Resume assessment completed',
      sentiment: recruiterConfidence.overallConfidence >= 75 ? 'positive' : recruiterConfidence.overallConfidence >= 60 ? 'neutral' : 'negative',
    });

    // Specific observations
    if (allResults.ats?.atsScore >= 80) {
      notes.push({
        category: 'ATS Screening',
        note: 'Resume will pass automated screening systems',
        sentiment: 'positive',
      });
    }

    if (allResults.achievements?.strongPercentage >= 60) {
      notes.push({
        category: 'Achievements',
        note: 'Strong, quantified achievements demonstrate clear impact',
        sentiment: 'positive',
      });
    }

    if (recruiterConfidence.concerns?.length > 0) {
      notes.push({
        category: 'Concerns',
        note: recruiterConfidence.concerns[0].issue,
        sentiment: 'negative',
      });
    }

    return {
      notes: notes.slice(0, 5),
      overallSentiment: recruiterConfidence.overallConfidence >= 75 ? 'positive' : recruiterConfidence.overallConfidence >= 60 ? 'neutral' : 'negative',
      reason: 'Recruiter perspective on resume quality and appeal',
    };
  }

  /**
   * Get empty recruiter notes
   */
  getEmptyRecruiterNotes() {
    return {
      notes: [],
      overallSentiment: 'neutral',
      reason: 'Unable to generate recruiter notes',
    };
  }

  /**
   * Generate interview readiness
   */
  generateInterviewReadiness(allResults) {
    const { semantic, achievements, technicalScore, recruiterConfidence } = allResults;

    const semanticScore = semantic?.overallScore || 0;
    const achievementScore = achievements?.overallScore || 0;
    const technicalScoreVal = technicalScore?.overallScore || 0;
    const confidenceScore = recruiterConfidence?.overallConfidence || 0;

    const readinessScore = Math.round(
      (semanticScore * 0.3 + achievementScore * 0.3 + technicalScoreVal * 0.25 + confidenceScore * 0.15)
    );

    return {
      score: readinessScore,
      grade: this.getGrade(readinessScore),
      reason: this.getInterviewReadinessReason(readinessScore),
      evidence: {
        contentQuality: semanticScore,
        achievements: achievementScore,
        technicalSkills: technicalScoreVal,
        recruiterConfidence: confidenceScore,
      },
      recommendation: this.getInterviewReadinessRecommendation(readinessScore),
      likelyQuestions: this.generateLikelyQuestions(allResults),
      talkingPoints: this.generateTalkingPoints(allResults),
    };
  }

  /**
   * Get interview readiness reason
   */
  getInterviewReadinessReason(score) {
    if (score >= 85) return 'Very well prepared for interviews - strong resume supports discussion';
    if (score >= 75) return 'Well prepared - resume provides good interview material';
    if (score >= 65) return 'Moderately prepared - some areas need strengthening';
    if (score >= 55) return 'Limited preparation - resume has gaps that may be questioned';
    return 'Not prepared - significant resume issues will be questioned';
  }

  /**
   * Get interview readiness recommendation
   */
  getInterviewReadinessRecommendation(score) {
    if (score >= 80) return 'Ready for interviews - practice articulating achievements';
    if (score >= 70) return 'Strengthen weak areas before interviews';
    if (score >= 60) return 'Improve resume and prepare for potential questions';
    return 'Major resume improvements needed before interviewing';
  }

  /**
   * Generate likely questions
   */
  generateLikelyQuestions(allResults) {
    const questions = [];

    if (allResults.achievements?.strongPercentage < 50) {
      questions.push('Can you tell me more about your achievements at [Company]?');
    }

    if (allResults.technicalScore?.overallScore < 70) {
      questions.push('What technologies are you most proficient in?');
    }

    if (allResults.grammar?.issues?.weakPhrases > 2) {
      questions.push('What specific contributions did you make to [project]?');
    }

    return questions.slice(0, 5);
  }

  /**
   * Generate talking points
   */
  generateTalkingPoints(allResults) {
    const points = [];

    if (allResults.achievements?.strongPercentage >= 60) {
      points.push('Highlight quantified achievements and business impact');
    }

    if (allResults.technicalScore?.topSkills?.length >= 5) {
      points.push('Discuss technical expertise with specific examples');
    }

    if (allResults.semantic?.dimensions?.leadership?.score >= 70) {
      points.push('Emphasize leadership experience and team management');
    }

    return points.slice(0, 5);
  }

  /**
   * Generate career growth suggestions
   */
  generateCareerGrowthSuggestions(allResults) {
    const { technicalScore, semantic, benchmark } = allResults;

    const suggestions = [];

    // Skill development
    if (technicalScore?.overallScore < 80) {
      const weakCategories = Object.values(technicalScore.categories || {})
        .filter(cat => cat.coverage < 40 && cat.weight >= 8)
        .slice(0, 3);

      for (const category of weakCategories) {
        suggestions.push({
          area: 'Skill Development',
          suggestion: `Strengthen ${category.name} skills`,
          reason: `Low coverage (${category.coverage}%) in important category`,
          priority: 'high',
        });
      }
    }

    // Experience enhancement
    if (semantic?.dimensions?.impact?.score < 70) {
      suggestions.push({
        area: 'Impact Demonstration',
        suggestion: 'Focus on roles with quantifiable impact',
        reason: 'Need more achievements with measurable results',
        priority: 'high',
      });
    }

    // Career progression
    if (semantic?.dimensions?.leadership?.score < 60) {
      suggestions.push({
        area: 'Leadership Growth',
        suggestion: 'Seek leadership opportunities or team lead roles',
        reason: 'Leadership experience accelerates career growth',
        priority: 'medium',
      });
    }

    // Industry alignment
    if (benchmark?.gaps?.length > 0) {
      suggestions.push({
        area: 'Industry Alignment',
        suggestion: `Address gaps: ${benchmark.gaps.slice(0, 2).map(g => g.area).join(', ')}`,
        reason: 'Meet industry standards for target role',
        priority: 'medium',
      });
    }

    return {
      totalSuggestions: suggestions.length,
      suggestions: suggestions.slice(0, 8),
      reason: 'Career growth recommendations based on resume analysis',
    };
  }

  /**
   * Get engines used
   */
  getEnginesUsed(allResults) {
    const engines = ['ATS', 'Keyword', 'Semantic', 'Achievement'];

    if (allResults.grammar) engines.push('Grammar');
    if (allResults.readability) engines.push('Readability');
    if (allResults.actionVerbs) engines.push('Action Verbs');
    if (allResults.quantification) engines.push('Quantification');
    if (allResults.technicalScore) engines.push('Technical Score');
    if (allResults.recruiterConfidence) engines.push('Recruiter Confidence');
    if (allResults.benchmark) engines.push('Benchmark');
    if (allResults.jobMatch) engines.push('Job Match');

    return engines;
  }

  /**
   * Calculate overall confidence
   */
  calculateOverallConfidence(allResults) {
    let confidence = 0;
    let total = 0;

    const engines = ['ats', 'keywords', 'semantic', 'achievements', 'grammar', 'readability',
                     'actionVerbs', 'quantification', 'technicalScore', 'recruiterConfidence'];

    for (const engine of engines) {
      if (allResults[engine]) {
        total++;
        const score = allResults[engine].overallScore || allResults[engine].overallConfidence || 0;
        if (score >= 70) confidence += 3;
        else if (score >= 50) confidence += 2;
        else confidence += 1;
      }
    }

    const percentage = total > 0 ? Math.round((confidence / total) * 100) : 0;

    return {
      score: percentage,
      level: percentage >= 80 ? 'high' : percentage >= 60 ? 'medium' : 'low',
    };
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
   * Get empty score
   */
  getEmptyScore(type) {
    return {
      score: 0,
      grade: 'F',
      reason: `Unable to assess ${type}`,
      evidence: {},
      recommendation: 'Unable to provide recommendation',
    };
  }

  /**
   * Get empty section analysis
   */
  getEmptySectionAnalysis() {
    return {
      totalSections: 0,
      presentSections: 0,
      missingSections: 0,
      sections: [],
      averageQuality: 0,
      reason: 'Unable to analyze sections',
      recommendation: 'Unable to provide recommendation',
    };
  }

  /**
   * Get empty report
   */
  getEmptyReport() {
    return {
      success: false,
      generatedAt: new Date().toISOString(),
      version: '2.0',
      executiveSummary: this.getEmptyScore('Executive Summary'),
      atsScore: this.getEmptyScore('ATS'),
      keywordScore: this.getEmptyScore('Keywords'),
      formattingScore: this.getEmptyScore('Formatting'),
      grammarScore: this.getEmptyScore('Grammar'),
      readabilityScore: this.getEmptyScore('Readability'),
      leadershipScore: this.getEmptyScore('Leadership'),
      impactScore: this.getEmptyScore('Impact'),
      achievementScore: this.getEmptyScore('Achievements'),
      technicalScore: this.getEmptyScore('Technical'),
      recruiterConfidence: this.getEmptyScore('Recruiter Confidence'),
      hiringProbability: this.getEmptyScore('Hiring Probability'),
      industryBenchmark: this.getEmptyScore('Industry Benchmark'),
      roleReadiness: this.getEmptyScore('Role Readiness'),
      strengths: [],
      weaknesses: [],
      topPriorityFixes: [],
      actionVerbAnalysis: this.getEmptyScore('Action Verbs'),
      quantificationAnalysis: this.getEmptyScore('Quantification'),
      keywordHeatmap: this.getEmptyScore('Keyword Heatmap'),
      missingKeywords: this.getEmptyScore('Missing Keywords'),
      matchedKeywords: this.getEmptyScore('Matched Keywords'),
      sectionAnalysis: this.getEmptySectionAnalysis(),
      timelineAnalysis: this.getEmptyTimelineAnalysis(),
      resumeFlow: this.getEmptyScore('Resume Flow'),
      skillDistribution: this.getEmptyScore('Skill Distribution'),
      experienceDistribution: this.getEmptyScore('Experience Distribution'),
      educationAnalysis: this.getEmptyEducationAnalysis(),
      projectsAnalysis: this.getEmptyProjectsAnalysis(),
      certificationAnalysis: this.getEmptyCertificationAnalysis(),
      atsCompatibility: this.getEmptyATSCompatibility(),
      aiRewriteSuggestions: this.getEmptyRewriteSuggestions(),
      beforeAfterExamples: this.getEmptyBeforeAfter(),
      recruiterNotes: this.getEmptyRecruiterNotes(),
      interviewReadiness: this.getEmptyScore('Interview Readiness'),
      careerGrowthSuggestions: {
        totalSuggestions: 0,
        suggestions: [],
        reason: 'Unable to generate career growth suggestions',
      },
      metadata: {
        processingTime: 0,
        enginesUsed: [],
        confidence: { score: 0, level: 'low' },
        exportReady: false,
      },
    };
  }
}

module.exports = new ComprehensiveReportGenerator();
