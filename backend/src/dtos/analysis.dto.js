class AnalysisDTO {
  constructor(analysis) {
    this.id = analysis.id;
    this.userId = analysis.userId;
    this.resumeId = analysis.resumeId;
    this.status = analysis.status;
    this.atsScore = analysis.atsScore || 0;
    this.qualityScore = analysis.qualityScore || 0;
    this.overallScore = analysis.overallScore || analysis.atsScore || 0;
    this.keywordScore = analysis.keywordScore || 0;
    this.formattingScore = analysis.formattingScore || 0;
    this.readabilityScore = analysis.readabilityScore || 0;
    this.skillsMatch = analysis.skillsMatch;
    this.missingKeywords = analysis.missingKeywords;
    this.missingSkills = analysis.missingSkills;
    this.suggestionsData = analysis.suggestionsData;
    this.improvementSuggestions = analysis.improvementSuggestions;
    this.sectionCompleteness = analysis.sectionCompleteness;
    this.strengths = analysis.strengths;
    this.weaknesses = analysis.weaknesses;
    this.targetRole = analysis.targetRole;
    this.createdAt = analysis.createdAt;
    this.updatedAt = analysis.updatedAt;
    this.completedAt = analysis.completedAt || analysis.approvedAt;
    this.scores = {
      overall: analysis.overallScore || analysis.atsScore || 0,
      ats: analysis.atsScore || 0,
      keyword: analysis.keywordScore || 0,
      structure: analysis.formattingScore || 0,
      readability: analysis.readabilityScore || 0,
      formatting: analysis.formattingScore || 0,
      actionVerbs: analysis.actionVerbScore || 0,
      quantification: analysis.quantificationScore || 0,
      quality: analysis.qualityScore || 0,
      domainExperience: analysis.domainExperience || 0,
      leadershipImpact: analysis.leadershipImpact || 0,
      technicalProwess: analysis.technicalProwess || 0,
    };
    this.processingTime = analysis.processingTime;
    this.aiProvider = analysis.aiProvider;
    this.aiModel = analysis.aiModel;
    this.parserVersion = 'v2.4.1';
    this.resumeVersion = analysis.resume?.version || '1.0';
    this.analysisVersion = '2.0';
    this.promptVersion = '2024.06';
    this.atsScores = [
      { name: 'Workable', parser: 'Standard', score: analysis.atsScore || 0, issues: [] },
      { name: 'Greenhouse', parser: 'Standard', score: Math.max(0, (analysis.atsScore || 0) + 3), issues: [] },
      { name: 'Lever', parser: 'Standard', score: Math.max(0, (analysis.atsScore || 0) - 2), issues: [] },
      { name: 'ATS Friendly', parser: 'Standard', score: analysis.atsScore || 0, issues: [] },
    ];
    this.semanticScores = [
      { axis: 'Domain Experience', v: analysis.domainExperience || 0 },
      { axis: 'Leadership Impact', v: analysis.leadershipImpact || 0 },
      { axis: 'Technical Prowess', v: analysis.technicalProwess || 0 },
      { axis: 'Quantification', v: analysis.quantificationScore || 0 },
      { axis: 'Action Verbs', v: analysis.actionVerbScore || 0 },
    ];
    this.keywords = {
      aligned: this.extractAlignedKeywords(analysis.missingKeywords),
      missing: this.extractMissingKeywords(analysis.missingKeywords),
    };
    this.keywordDensity = analysis.keywordDensity || [];
    this.structure = this.buildStructure(analysis.sectionCompleteness);
    this.patches = Array.isArray(analysis.suggestionsData) ? analysis.suggestionsData.map(s => ({
      title: s.category || 'Suggestion',
      description: s.suggestion || s.original || s.issue || '',
      severity: s.priority === 'high' ? 'high' : s.priority === 'medium' ? 'medium' : 'low',
      impact: s.impact ? `+${s.impact}` : s.priority === 'high' ? '+15' : s.priority === 'medium' ? '+8' : '+3',
    })) : [];
    this.resume = analysis.resume ? {
      id: analysis.resume.id,
      fileName: analysis.resume.title || 'Untitled',
      targetRole: analysis.targetRole,
      createdAt: analysis.createdAt,
      latestScore: analysis.atsScore || 0,
    } : undefined;
    this.comprehensiveReport = analysis.comprehensiveReport || null;
    this.executiveSummary = analysis.executiveSummary || analysis.comprehensiveReport?.executiveSummary || null;
    this.credibilityAnalysis = analysis.credibilityAnalysis || null;
    this.skillsIntelligence = analysis.skillsIntelligence || null;
    this.experienceIntelligence = analysis.experienceIntelligence || null;
    this.projectIntelligence = analysis.projectIntelligence || null;
    this.interviewPrep = analysis.interviewPrep || null;
    this.learningRoadmap = analysis.learningRoadmap || null;
    this.resumeEvolution = analysis.resumeEvolution || null;
    this.recruiterAnalysis = analysis.recruiterAnalysis || analysis.comprehensiveReport?.recruiterNotes || null;
    this.confidence = analysis.comprehensiveReport?.metadata?.confidence || null;
    this.resumeIdentity = analysis.resumeIdentity || analysis.comprehensiveReport?.resumeIdentity || null;
    this.suggestions = analysis.improvementSuggestions || [];
    this.rawSuggestions = analysis.rawSuggestions || null;
    this.duplicateKeywords = analysis.duplicateKeywords || [];
    this.optimizationCheck = analysis.optimizationCheck || [];
    this.actionVerbScore = analysis.actionVerbScore || 0;
    this.quantificationScore = analysis.quantificationScore || 0;
    this.domainExperience = analysis.domainExperience || 0;
    this.leadershipImpact = analysis.leadershipImpact || 0;
    this.technicalProwess = analysis.technicalProwess || 0;
    this.sectionCompleteness = analysis.sectionCompleteness || [];
  }

  extractAlignedKeywords(missingKeywords) {
    if (Array.isArray(missingKeywords)) {
      const aligned = missingKeywords.filter(k => k.found === true || k.found === undefined && typeof k === 'string');
      return aligned.map(k => typeof k === 'string' ? k : k.keyword || k);
    }
    return [];
  }

  extractMissingKeywords(missingKeywords) {
    if (Array.isArray(missingKeywords)) {
      const missing = missingKeywords.filter(k => k.found === false || k.found === undefined && typeof k === 'string');
      return missing.map(k => typeof k === 'string' ? k : k.keyword || k);
    }
    return [];
  }

  buildStructure(sectionCompleteness) {
    if (!sectionCompleteness || typeof sectionCompleteness !== 'object') {
      return [
        { section: 'Contact', status: 'Present' },
        { section: 'Experience', status: 'Good' },
        { section: 'Education', status: 'Present' },
        { section: 'Skills', status: 'Needs work' },
      ];
    }
    const structure = [];
    if (sectionCompleteness.hasContact) structure.push({ section: 'Contact', status: 'Present' });
    else structure.push({ section: 'Contact', status: 'Missing' });
    if (sectionCompleteness.hasExperience) structure.push({ section: 'Experience', status: 'Present' });
    else structure.push({ section: 'Experience', status: 'Missing' });
    if (sectionCompleteness.hasEducation) structure.push({ section: 'Education', status: 'Present' });
    else structure.push({ section: 'Education', status: 'Missing' });
    if (sectionCompleteness.hasSkills) structure.push({ section: 'Skills', status: 'Present' });
    else structure.push({ section: 'Skills', status: 'Missing' });
    return structure;
  }

  static fromPrisma(analysis) {
    if (!analysis) return null;
    return new AnalysisDTO(analysis);
  }

  static fromPrismaArray(analyses) {
    return (analyses || []).map((a) => AnalysisDTO.fromPrisma(a));
  }
}

class AnalysisListDTO {
  constructor(analysis) {
    this.id = analysis.id;
    this.status = analysis.status;
    this.atsScore = analysis.atsScore;
    this.overallScore = analysis.overallScore || analysis.atsScore;
    this.keywordScore = analysis.keywordScore;
    this.readabilityScore = analysis.readabilityScore;
    this.createdAt = analysis.createdAt;
    this.completedAt = analysis.completedAt || analysis.approvedAt;
    this.fileName = analysis.resume?.title || 'Untitled';
    this.targetRole = analysis.targetRole;
    this.latestScore = analysis.atsScore || 0;
    this.resume = analysis.resume ? {
      id: analysis.resume.id,
      title: analysis.resume.title || 'Untitled',
    } : undefined;
    this.fileName = this.resume?.title || 'Untitled';
    this.hasComprehensiveReport = !!analysis.comprehensiveReport;
    this.hasCredibility = !!analysis.credibilityAnalysis;
    this.hasSkillsIntelligence = !!analysis.skillsIntelligence;
    this.hasInterviewPrep = !!analysis.interviewPrep;
    this.hasLearningRoadmap = !!analysis.learningRoadmap;
    this.hasResumeEvolution = !!analysis.resumeEvolution;
  }

  static fromPrisma(analysis) {
    if (!analysis) return null;
    return new AnalysisListDTO(analysis);
  }

  static fromPrismaArray(analyses) {
    return (analyses || []).map((a) => AnalysisListDTO.fromPrisma(a));
  }
}

module.exports = { AnalysisDTO, AnalysisListDTO };
