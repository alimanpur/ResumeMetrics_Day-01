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
    };
    this.atsScores = [
      { name: 'Workable', parser: 'Standard', score: analysis.atsScore || 0, issues: [] },
      { name: 'Greenhouse', parser: 'Standard', score: Math.max(0, (analysis.atsScore || 0) + 5), issues: [] },
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
    this.score = analysis.overallScore || analysis.atsScore;
    this.createdAt = analysis.createdAt;
    this.completedAt = analysis.completedAt || analysis.approvedAt;
    this.fileName = analysis.resume?.title || 'Untitled';
    this.targetRole = analysis.targetRole;
    this.latestScore = analysis.atsScore || 0;
    this.resume = analysis.resume ? {
      id: analysis.resume.id,
      title: analysis.resume.title,
    } : undefined;
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