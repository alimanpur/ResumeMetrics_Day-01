/**
 * Intelligence Layer Orchestrator
 * Main entry point for the AI analysis pipeline
 * Coordinates all engines and produces structured JSON output
 * Phase 19: Enhanced with comprehensive intelligence modules
 */

class IntelligenceOrchestrator {
  constructor() {
    this.documentNormalizer = require('./resumeIntelligence/documentNormalizer');
    this.atsEngine = require('./atsEngine');
    this.keywordEngine = require('./keywordEngine');
    this.semanticEngine = require('./semanticEngine');
    this.achievementEngine = require('./achievementEngine');
    this.rewriteEngine = require('./rewriteEngine');
    this.jobMatchEngine = require('./jobMatchEngine');
    this.benchmarkEngine = require('./benchmarkEngine');
    this.promptOrchestrator = require('./promptOrchestrator');
    this.explainabilityEngine = require('./explainabilityEngine');
    this.reportGenerator = require('./reportGenerator');
    this.evaluationEngine = require('./evaluation');
    
    this.grammarEngine = require('./grammarEngine');
    this.readabilityEngine = require('./readabilityEngine');
    this.actionVerbEngine = require('./actionVerbEngine');
    this.quantificationEngine = require('./quantificationEngine');
    this.recruiterConfidenceEngine = require('./recruiterConfidenceEngine');
    this.technicalScoreEngine = require('./technicalScoreEngine');
    this.comprehensiveReportGenerator = require('./comprehensiveReportGenerator');
    
    this.resumeIdentityEngine = require('./resumeIdentityEngine');
    this.credibilityEngine = require('./credibilityEngine');
    this.skillsEvidenceEngine = require('./skillsEvidenceEngine');
    this.experienceIntelligenceEngine = require('./experienceIntelligenceEngine');
    this.projectIntelligenceEngine = require('./projectIntelligenceEngine');
    this.interviewPrepEngine = require('./interviewPrepEngine');
    this.learningRoadmapEngine = require('./learningRoadmapEngine');
    this.resumeEvolutionEngine = require('./resumeEvolutionEngine');
  }

  async analyze(resumeText, options = {}) {
    const startTime = Date.now();

    try {
      const normalizedDoc = this.documentNormalizer.normalize(resumeText);
      const atsResult = this.atsEngine.evaluate(normalizedDoc);
      const keywordResult = this.keywordEngine.extractKeywords(normalizedDoc.cleanedText);
      const semanticResult = this.semanticEngine.analyze(normalizedDoc);
      const achievementResult = this.achievementEngine.analyze(normalizedDoc);
      const benchmarkResult = this.benchmarkEngine.benchmark(normalizedDoc, options.targetRole);

      let jobMatchResult = null;
      if (options.jobDescription) {
        jobMatchResult = this.jobMatchEngine.match(normalizedDoc, options.jobDescription);
      }

      const rewriteResults = this.generateRewrites(achievementResult);

      const explainedResults = this.explainabilityEngine.generateFullExplanation({
        ats: atsResult,
        keywords: keywordResult,
        semantic: semanticResult,
        achievements: achievementResult,
      });

      const report = this.reportGenerator.generateReport({
        ats: atsResult,
        keywords: keywordResult,
        semantic: semanticResult,
        achievements: achievementResult,
        benchmark: benchmarkResult,
        jobMatch: jobMatchResult,
        normalizedDoc,
      });

      const grammarResult = this.grammarEngine.analyze(normalizedDoc.cleanedText);
      const readabilityResult = this.readabilityEngine.analyze(normalizedDoc.cleanedText);
      const actionVerbResult = this.actionVerbEngine.analyze(normalizedDoc.cleanedText);
      const quantificationResult = this.quantificationEngine.analyze(normalizedDoc.cleanedText);
      const recruiterConfidenceResult = this.recruiterConfidenceEngine.calculate({
        ats: atsResult,
        keywords: keywordResult,
        semantic: semanticResult,
        achievements: achievementResult,
        grammar: grammarResult,
        readability: readabilityResult,
        quantification: quantificationResult,
      });
      const technicalScoreResult = this.technicalScoreEngine.analyze(normalizedDoc.cleanedText);

      const credibilityResult = this.credibilityEngine.analyze(normalizedDoc, keywordResult);
      const skillsEvidenceResult = this.skillsEvidenceEngine.analyze(normalizedDoc, keywordResult);
      const experienceIntelligenceResult = this.experienceIntelligenceEngine.analyze(normalizedDoc);
      const projectIntelligenceResult = this.projectIntelligenceEngine.analyze(normalizedDoc);
      const interviewPrepResult = this.interviewPrepEngine.analyze(normalizedDoc, {
        semantic: semanticResult,
        achievements: achievementResult,
        technicalScore: technicalScoreResult,
        recruiterConfidence: recruiterConfidenceResult,
        overallScore: report.executiveSummary?.averageScore || 0,
      });
      const learningRoadmapResult = this.learningRoadmapEngine.analyze(normalizedDoc, keywordResult, {});

      const resumeEvolutionResult = this.resumeEvolutionEngine.analyze(
        normalizedDoc,
        null,
        options.allAnalyses || [],
        options.allResumeVersions || []
      );

      const resumeIdentityResult = this.resumeIdentityEngine.generateIdentity({
        atsScore: atsResult.atsScore,
        overallScore: report.executiveSummary?.averageScore || 0,
        qualityScore: grammarResult.overallScore,
        semanticAnalysis: semanticResult,
        processingTime: Date.now() - startTime,
      }, options.resume || {}, options);

      const comprehensiveReport = this.comprehensiveReportGenerator.generateReport({
        ats: atsResult,
        keywords: keywordResult,
        semantic: semanticResult,
        achievements: achievementResult,
        grammar: grammarResult,
        readability: readabilityResult,
        actionVerbs: actionVerbResult,
        quantification: quantificationResult,
        recruiterConfidence: recruiterConfidenceResult,
        technicalScore: technicalScoreResult,
        benchmark: benchmarkResult,
        jobMatch: jobMatchResult,
        normalizedDoc,
        credibility: credibilityResult,
        skillsEvidence: skillsEvidenceResult,
        experienceIntelligence: experienceIntelligenceResult,
        projectIntelligence: projectIntelligenceResult,
        interviewPrep: interviewPrepResult,
        learningRoadmap: learningRoadmapResult,
        resumeIdentity: resumeIdentityResult,
        metadata: {
          processingTime: Date.now() - startTime,
        },
      });

      const processingTime = Date.now() - startTime;

      return {
        success: true,
        ats: atsResult,
        keywords: keywordResult,
        semantic: semanticResult,
        achievements: achievementResult,
        rewrite: rewriteResults,
        benchmark: benchmarkResult,
        jobMatch: jobMatchResult,
        summary: report.executiveSummary,
        grammar: grammarResult,
        readability: readabilityResult,
        actionVerbs: actionVerbResult,
        quantification: quantificationResult,
        recruiterConfidence: recruiterConfidenceResult,
        technicalScore: technicalScoreResult,
        credibility: credibilityResult,
        skillsEvidence: skillsEvidenceResult,
        experienceIntelligence: experienceIntelligenceResult,
        projectIntelligence: projectIntelligenceResult,
        interviewPrep: interviewPrepResult,
        learningRoadmap: learningRoadmapResult,
        resumeIdentity: resumeIdentityResult,
        resumeEvolution: resumeEvolutionResult,
        comprehensiveReport,
        explainedResults,
        confidence: this.calculateOverallConfidence({
          ats: atsResult,
          keywords: keywordResult,
          semantic: semanticResult,
          achievements: achievementResult,
          grammar: grammarResult,
          readability: readabilityResult,
          actionVerbs: actionVerbResult,
          quantification: quantificationResult,
          recruiterConfidence: recruiterConfidenceResult,
          technicalScore: technicalScoreResult,
          credibility: credibilityResult,
          skillsEvidence: skillsEvidenceResult,
          experienceIntelligence: experienceIntelligenceResult,
          projectIntelligence: projectIntelligenceResult,
        }),
        metadata: {
          processingTime,
          normalizedDoc,
          options,
          generatedAt: new Date().toISOString(),
          version: '2.0',
          phase: 19,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        metadata: {
          processingTime: Date.now() - startTime,
          generatedAt: new Date().toISOString(),
        },
      };
    }
  }

  generateRewrites(achievementResult) {
    if (!achievementResult || !achievementResult.rewriteCandidates) {
      return { totalCandidates: 0, rewrites: [] };
    }

    const rewrites = achievementResult.rewriteCandidates.map(candidate => {
      return this.rewriteEngine.rewrite({
        text: candidate.original,
        issues: candidate.issues,
      });
    });

    return { totalCandidates: rewrites.length, rewrites };
  }

  calculateOverallConfidence(results) {
    let confidence = 0;
    let total = 0;

    const engines = Object.keys(results);
    for (const engine of engines) {
      if (results[engine]) {
        total++;
        const score = results[engine].overallScore || results[engine].confidence?.score || results[engine].score || 0;
        if (score >= 70) confidence += 3;
        else if (score >= 50) confidence += 2;
        else confidence += 1;
      }
    }

    const percentage = total > 0 ? Math.round((confidence / total) * 100) : 0;
    return { score: percentage, level: percentage >= 80 ? 'high' : percentage >= 60 ? 'medium' : 'low' };
  }

  runEvaluation() {
    return this.evaluationEngine.evaluate();
  }

  getAvailableOptions() {
    return {
      targetRole: { type: 'string', required: false, description: 'Target job role for benchmarking', examples: ['software engineer', 'data scientist', 'product manager'] },
      jobDescription: { type: 'string', required: false, description: 'Job description for matching' },
      includeRewrite: { type: 'boolean', required: false, default: true, description: 'Include rewrite suggestions for weak achievements' },
      includeBenchmark: { type: 'boolean', required: false, default: true, description: 'Include industry benchmark comparison' },
      includeCredibility: { type: 'boolean', required: false, default: true, description: 'Include credibility analysis' },
      includeInterviewPrep: { type: 'boolean', required: false, default: true, description: 'Include interview preparation' },
      includeLearningRoadmap: { type: 'boolean', required: false, default: true, description: 'Include personalized learning roadmap' },
    };
  }

  validateOptions(options) {
    const validation = { isValid: true, errors: [], warnings: [] };
    if (options.targetRole && typeof options.targetRole !== 'string') {
      validation.errors.push('targetRole must be a string');
      validation.isValid = false;
    }
    if (options.jobDescription && typeof options.jobDescription !== 'string') {
      validation.errors.push('jobDescription must be a string');
      validation.isValid = false;
    }
    if (options.jobDescription && options.jobDescription.length < 50) {
      validation.warnings.push('Job description is very short - analysis may be less accurate');
    }
    return validation;
  }

  getPipelineStatus() {
    return {
      engines: [
        { name: 'Document Normalizer', status: 'ready', module: 'resumeIntelligence/documentNormalizer' },
        { name: 'ATS Engine', status: 'ready', module: 'atsEngine' },
        { name: 'Keyword Engine', status: 'ready', module: 'keywordEngine' },
        { name: 'Semantic Engine', status: 'ready', module: 'semanticEngine' },
        { name: 'Achievement Engine', status: 'ready', module: 'achievementEngine' },
        { name: 'Rewrite Engine', status: 'ready', module: 'rewriteEngine' },
        { name: 'Job Match Engine', status: 'ready', module: 'jobMatchEngine' },
        { name: 'Benchmark Engine', status: 'ready', module: 'benchmarkEngine' },
        { name: 'Prompt Orchestrator', status: 'ready', module: 'promptOrchestrator' },
        { name: 'Explainability Engine', status: 'ready', module: 'explainabilityEngine' },
        { name: 'Report Generator', status: 'ready', module: 'reportGenerator' },
        { name: 'Evaluation Engine', status: 'ready', module: 'evaluation' },
        { name: 'Grammar Engine', status: 'ready', module: 'grammarEngine' },
        { name: 'Readability Engine', status: 'ready', module: 'readabilityEngine' },
        { name: 'Action Verb Engine', status: 'ready', module: 'actionVerbEngine' },
        { name: 'Quantification Engine', status: 'ready', module: 'quantificationEngine' },
        { name: 'Recruiter Confidence Engine', status: 'ready', module: 'recruiterConfidenceEngine' },
        { name: 'Technical Score Engine', status: 'ready', module: 'technicalScoreEngine' },
        { name: 'Comprehensive Report Generator V2', status: 'ready', module: 'comprehensiveReportGenerator' },
        { name: 'Resume Identity Engine', status: 'ready', module: 'resumeIdentityEngine' },
        { name: 'Credibility Engine', status: 'ready', module: 'credibilityEngine' },
        { name: 'Skills Evidence Engine', status: 'ready', module: 'skillsEvidenceEngine' },
        { name: 'Experience Intelligence Engine', status: 'ready', module: 'experienceIntelligenceEngine' },
        { name: 'Project Intelligence Engine', status: 'ready', module: 'projectIntelligenceEngine' },
        { name: 'Interview Prep Engine', status: 'ready', module: 'interviewPrepEngine' },
        { name: 'Learning Roadmap Engine', status: 'ready', module: 'learningRoadmapEngine' },
        { name: 'Resume Evolution Engine', status: 'ready', module: 'resumeEvolutionEngine' },
      ],
      pipeline: [
        'Document Normalization', 'ATS Analysis', 'Keyword Extraction', 'Semantic Analysis',
        'Achievement Analysis', 'Industry Benchmarking', 'Job Matching (optional)',
        'Rewrite Generation', 'Grammar Analysis', 'Readability Analysis', 'Action Verb Analysis',
        'Quantification Analysis', 'Recruiter Confidence', 'Technical Score',
        'Credibility Analysis', 'Skills Evidence', 'Experience Intelligence',
        'Project Intelligence', 'Interview Preparation', 'Learning Roadmap',
        'Resume Identity', 'Comprehensive Report Generation V2',
      ],
      status: 'operational',
      version: '2.0',
      phase: 19,
    };
  }
}

module.exports = new IntelligenceOrchestrator();
