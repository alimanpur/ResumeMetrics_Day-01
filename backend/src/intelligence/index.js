/**
 * Intelligence Layer Orchestrator
 * Main entry point for the AI analysis pipeline
 * Coordinates all engines and produces structured JSON output
 * Phase 17: Enhanced with comprehensive intelligence metrics
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
    
    // Phase 17 Enhanced Engines
    this.grammarEngine = require('./grammarEngine');
    this.readabilityEngine = require('./readabilityEngine');
    this.actionVerbEngine = require('./actionVerbEngine');
    this.quantificationEngine = require('./quantificationEngine');
    this.recruiterConfidenceEngine = require('./recruiterConfidenceEngine');
    this.technicalScoreEngine = require('./technicalScoreEngine');
    this.comprehensiveReportGenerator = require('./comprehensiveReportGenerator');
  }

  /**
   * Run complete analysis pipeline
   * @param {string} resumeText - Raw resume text
   * @param {Object} options - Analysis options
   * @returns {Object} Complete analysis results
   */
  async analyze(resumeText, options = {}) {
    const startTime = Date.now();

    try {
      // Step 1: Document Normalization
      const normalizedDoc = this.documentNormalizer.normalize(resumeText);

      // Step 2: ATS Analysis
      const atsResult = this.atsEngine.evaluate(normalizedDoc);

      // Step 3: Keyword Analysis
      const keywordResult = this.keywordEngine.extractKeywords(normalizedDoc.cleanedText);

      // Step 4: Semantic Analysis
      const semanticResult = this.semanticEngine.analyze(normalizedDoc);

      // Step 5: Achievement Analysis
      const achievementResult = this.achievementEngine.analyze(normalizedDoc);

      // Step 6: Industry Benchmark
      const benchmarkResult = this.benchmarkEngine.benchmark(normalizedDoc, options.targetRole);

      // Step 7: Job Match (if job description provided)
      let jobMatchResult = null;
      if (options.jobDescription) {
        jobMatchResult = this.jobMatchEngine.match(normalizedDoc, options.jobDescription);
      }

      // Step 8: Generate Rewrites for weak achievements
      const rewriteResults = this.generateRewrites(achievementResult);

      // Step 9: Generate Explanations
      const explainedResults = this.explainabilityEngine.generateFullExplanation({
        ats: atsResult,
        keywords: keywordResult,
        semantic: semanticResult,
        achievements: achievementResult,
      });

      // Step 10: Generate Professional Report
      const report = this.reportGenerator.generateReport({
        ats: atsResult,
        keywords: keywordResult,
        semantic: semanticResult,
        achievements: achievementResult,
        benchmark: benchmarkResult,
        jobMatch: jobMatchResult,
        normalizedDoc,
      });

      // PHASE 17: Enhanced Analysis Engines
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

      // Generate Comprehensive Report V2
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
        metadata: {
          processingTime: Date.now() - startTime,
        },
      });

      const processingTime = Date.now() - startTime;

      // Return comprehensive analysis with all engines
      return {
        success: true,
        // Original engines
        ats: atsResult,
        keywords: keywordResult,
        semantic: semanticResult,
        achievements: achievementResult,
        rewrite: rewriteResults,
        benchmark: benchmarkResult,
        jobMatch: jobMatchResult,
        summary: report.executiveSummary,
        
        // Phase 17 Enhanced engines
        grammar: grammarResult,
        readability: readabilityResult,
        actionVerbs: actionVerbResult,
        quantification: quantificationResult,
        recruiterConfidence: recruiterConfidenceResult,
        technicalScore: technicalScoreResult,
        
        // Comprehensive report
        comprehensiveReport,
        
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
        }),
        metadata: {
          processingTime,
          normalizedDoc,
          options,
          generatedAt: new Date().toISOString(),
          version: '2.0',
          phase: 17,
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

  /**
   * Generate rewrites for weak achievements
   */
  generateRewrites(achievementResult) {
    if (!achievementResult || !achievementResult.rewriteCandidates) {
      return {
        totalCandidates: 0,
        rewrites: [],
      };
    }

    const rewrites = achievementResult.rewriteCandidates.map(candidate => {
      return this.rewriteEngine.rewrite({
        text: candidate.original,
        issues: candidate.issues,
      });
    });

    return {
      totalCandidates: rewrites.length,
      rewrites,
    };
  }

  /**
   * Calculate overall confidence
   */
  calculateOverallConfidence(results) {
    let confidence = 0;
    let total = 0;

    if (results.ats) {
      confidence += results.ats.confidence === 'high' ? 3 : results.ats.confidence === 'medium' ? 2 : 1;
      total += 3;
    }

    if (results.keywords) {
      confidence += results.keywords.confidence === 'high' ? 3 : results.keywords.confidence === 'medium' ? 2 : 1;
      total += 3;
    }

    if (results.semantic) {
      confidence += results.semantic.confidence === 'high' ? 3 : results.semantic.confidence === 'medium' ? 2 : 1;
      total += 3;
    }

    if (results.achievements) {
      confidence += results.achievements.confidence === 'high' ? 3 : results.achievements.confidence === 'medium' ? 2 : 1;
      total += 3;
    }

    const percentage = total > 0 ? Math.round((confidence / total) * 100) : 0;

    return {
      score: percentage,
      level: percentage >= 80 ? 'high' : percentage >= 60 ? 'medium' : 'low',
    };
  }

  /**
   * Run evaluation suite
   * @returns {Object} Evaluation results
   */
  runEvaluation() {
    return this.evaluationEngine.evaluate();
  }

  /**
   * Get available analysis options
   */
  getAvailableOptions() {
    return {
      targetRole: {
        type: 'string',
        required: false,
        description: 'Target job role for benchmarking',
        examples: ['software engineer', 'data scientist', 'product manager'],
      },
      jobDescription: {
        type: 'string',
        required: false,
        description: 'Job description for matching',
      },
      includeRewrite: {
        type: 'boolean',
        required: false,
        default: true,
        description: 'Include rewrite suggestions for weak achievements',
      },
      includeBenchmark: {
        type: 'boolean',
        required: false,
        default: true,
        description: 'Include industry benchmark comparison',
      },
    };
  }

  /**
   * Validate analysis options
   */
  validateOptions(options) {
    const validation = {
      isValid: true,
      errors: [],
      warnings: [],
    };

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

  /**
   * Get pipeline status
   */
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
      ],
      pipeline: [
        'Document Normalization',
        'ATS Analysis',
        'Keyword Extraction',
        'Semantic Analysis',
        'Achievement Analysis',
        'Industry Benchmarking',
        'Job Matching (optional)',
        'Rewrite Generation',
        'Explanation Generation',
        'Grammar Analysis',
        'Readability Analysis',
        'Action Verb Analysis',
        'Quantification Analysis',
        'Recruiter Confidence Calculation',
        'Technical Score Analysis',
        'Comprehensive Report Generation V2',
      ],
      status: 'operational',
      version: '2.0',
      phase: 17,
    };
  }
}

module.exports = new IntelligenceOrchestrator();