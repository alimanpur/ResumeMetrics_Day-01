/**
 * Prompt Orchestrator
 * Creates modular, focused prompts for different analysis tasks
 * Never uses one huge prompt - breaks into specialized prompts
 */

class PromptOrchestrator {
  constructor() {
    // Prompt templates for different analysis types
    this.prompts = {
      ats: {
        name: 'ATS Analysis',
        systemPrompt: `You are an ATS (Applicant Tracking System) expert. Analyze resumes for ATS compatibility.
Focus on: formatting, structure, keywords, readability, and ATS-specific issues.
Be specific and actionable. Never invent facts.`,
        userPromptTemplate: (resumeText) => `Analyze this resume for ATS compatibility:

RESUME:
${resumeText}

Provide analysis in JSON format with:
- atsScore (0-100)
- issues (array of specific problems found)
- recommendations (array of actionable fixes)
- severity (critical/high/medium/low)`,
      },
      semantic: {
        name: 'Semantic Analysis',
        systemPrompt: `You are a resume quality expert. Analyze the semantic quality and impact of resume content.
Focus on: action verbs, quantifiable achievements, clarity, professionalism.
Evaluate experience descriptions, not just keywords.`,
        userPromptTemplate: (resumeText) => `Analyze the semantic quality of this resume:

RESUME:
${resumeText}

Provide analysis in JSON format with:
- overallScore (0-100)
- dimensions (object with scores for: experienceQuality, leadership, impact, communication, problemSolving)
- strengths (array)
- weaknesses (array)
- recommendations (array)`,
      },
      keyword: {
        name: 'Keyword Analysis',
        systemPrompt: `You are a keyword optimization expert. Analyze resumes for keyword effectiveness.
Focus on: skill coverage, industry relevance, keyword density, and optimization opportunities.
Compare against job descriptions when provided.`,
        userPromptTemplate: (resumeText, jobDescription = null) => {
          let prompt = `Analyze keywords in this resume:

RESUME:
${resumeText}`;

          if (jobDescription) {
            prompt += `\n\nJOB DESCRIPTION:
${jobDescription}

Compare resume keywords against job requirements and identify gaps.`;
          }

          prompt += `\n\nProvide analysis in JSON format with:
- overallCoverage (0-100)
- categories (object with found/missing keywords by category)
- missingKeywords (array of high-priority missing keywords)
- recommendations (array)`;

          return prompt;
        },
      },
      achievement: {
        name: 'Achievement Analysis',
        systemPrompt: `You are an achievement analysis expert. Evaluate the strength and impact of resume achievements.
Focus on: quantifiable results, action verbs, specificity, and business impact.
Classify each achievement as strong/average/weak.`,
        userPromptTemplate: (resumeText) => `Analyze achievements in this resume:

RESUME:
${resumeText}

Provide analysis in JSON format with:
- overallScore (0-100)
- achievements (array with strength classification for each)
- strongCount, averageCount, weakCount
- rewriteCandidates (array of weak achievements that need improvement)
- recommendations (array)`,
      },
      rewrite: {
        name: 'Resume Rewrite',
        systemPrompt: `You are a professional resume writer. Improve weak bullet points while preserving all facts.
NEVER invent information. Only enhance wording, strengthen verbs, and suggest metric additions.
Maintain the original meaning and facts.`,
        userPromptTemplate: (achievementText) => `Improve this resume achievement statement:

ORIGINAL:
${achievementText}

Rules:
1. Never invent facts or metrics
2. Replace weak phrases with strong action verbs
3. Suggest where metrics could be added (but don't invent them)
4. Maintain the original meaning

Provide in JSON format:
- improved (string)
- reason (string explaining changes)
- suggestions (array of specific improvements)
- confidence (0-100)`,
      },
      benchmark: {
        name: 'Industry Benchmark',
        systemPrompt: `You are an industry standards expert. Compare resumes against role-specific benchmarks.
Focus on: expected skills, experience level, section completeness, and industry standards.
Provide realistic assessments based on current market expectations.`,
        userPromptTemplate: (resumeText, role = null) => {
          let prompt = `Benchmark this resume against industry standards:

RESUME:
${resumeText}`;

          if (role) {
            prompt += `\n\nTARGET ROLE: ${role}`;
          }

          prompt += `\n\nProvide analysis in JSON format with:
- overallScore (0-100)
- role (detected or specified)
- comparisons (skills, sections, experience, education, achievements)
- gaps (array of missing elements)
- recommendations (array)
- competitiveness (exceptional/strong/competitive/moderate/below_average/weak)`;

          return prompt;
        },
      },
      jobMatch: {
        name: 'Job Match Analysis',
        systemPrompt: `You are a job matching expert. Compare resumes against job descriptions.
Focus on: skill match, experience match, education match, and overall fit.
Identify critical gaps and provide specific recommendations.`,
        userPromptTemplate: (resumeText, jobDescription) => `Match this resume against the job description:

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

Provide analysis in JSON format with:
- overallMatch (0-100)
- technicalMatch (score and details)
- softSkillMatch (score and details)
- experienceMatch (score and details)
- educationMatch (score and details)
- missingSkills (array with priority)
- criticalGaps (array)
- hiringRisk (score and level)
- interviewProbability (percentage and confidence)
- recommendations (array)`,
      },
      summary: {
        name: 'Executive Summary',
        systemPrompt: `You are an executive resume analyst. Generate concise, actionable summaries.
Focus on: key strengths, critical issues, and priority recommendations.
Write like a senior recruiter - direct, professional, and specific.`,
        userPromptTemplate: (analysisData) => `Generate an executive summary based on this analysis:

ATS SCORE: ${analysisData.atsScore}
SEMANTIC SCORE: ${analysisData.semanticScore}
KEYWORD COVERAGE: ${analysisData.keywordCoverage}%
ACHIEVEMENT SCORE: ${analysisData.achievementScore}
BENCHMARK SCORE: ${analysisData.benchmarkScore}

TOP ISSUES:
${analysisData.topIssues}

Provide in JSON format:
- overallAssessment (2-3 sentences)
- topStrengths (array of 3-5)
- criticalIssues (array of 3-5)
- priorityActions (array of 5-7 specific actions)
- hiringProbability (percentage estimate)`,
      },
    };
  }

  /**
   * Get prompt for specific analysis type
   * @param {string} type - Prompt type
   * @param {*} params - Parameters for prompt template
   * @returns {Object} Prompt configuration
   */
  getPrompt(type, ...params) {
    const promptConfig = this.prompts[type];

    if (!promptConfig) {
      throw new Error(`Unknown prompt type: ${type}`);
    }

    const userPrompt = promptConfig.userPromptTemplate(...params);

    return {
      type: promptConfig.name,
      systemPrompt: promptConfig.systemPrompt,
      userPrompt,
      metadata: {
        generatedAt: new Date().toISOString(),
        tokenEstimate: this.estimateTokens(userPrompt),
      },
    };
  }

  /**
   * Get multiple prompts for comprehensive analysis
   * @param {string} resumeText - Resume text
   * @param {string} jobDescription - Optional job description
   * @returns {Array} Array of prompt configurations
   */
  getAnalysisPrompts(resumeText, jobDescription = null) {
    const prompts = [];

    // ATS analysis
    prompts.push(this.getPrompt('ats', resumeText));

    // Semantic analysis
    prompts.push(this.getPrompt('semantic', resumeText));

    // Keyword analysis
    prompts.push(this.getPrompt('keyword', resumeText, jobDescription));

    // Achievement analysis
    prompts.push(this.getPrompt('achievement', resumeText));

    // Job match (if job description provided)
    if (jobDescription) {
      prompts.push(this.getPrompt('jobMatch', resumeText, jobDescription));
    }

    // Benchmark
    prompts.push(this.getPrompt('benchmark', resumeText));

    return prompts;
  }

  /**
   * Get rewrite prompts for weak achievements
   * @param {Array} achievements - List of weak achievements
   * @returns {Array} Array of rewrite prompts
   */
  getRewritePrompts(achievements) {
    return achievements.map(achievement =>
      this.getPrompt('rewrite', achievement.text)
    );
  }

  /**
   * Get summary prompt
   * @param {Object} analysisData - Combined analysis data
   * @returns {Object} Summary prompt
   */
  getSummaryPrompt(analysisData) {
    return this.getPrompt('summary', analysisData);
  }

  /**
   * Estimate token count for prompt
   */
  estimateTokens(text) {
    // Rough estimate: ~4 characters per token
    return Math.ceil(text.length / 4);
  }

  /**
   * Validate prompt configuration
   */
  validatePrompt(prompt) {
    const validation = {
      isValid: true,
      errors: [],
      warnings: [],
    };

    if (!prompt.systemPrompt || prompt.systemPrompt.length < 10) {
      validation.errors.push('System prompt is too short');
      validation.isValid = false;
    }

    if (!prompt.userPrompt || prompt.userPrompt.length < 10) {
      validation.errors.push('User prompt is too short');
      validation.isValid = false;
    }

    const totalTokens = this.estimateTokens(prompt.systemPrompt + prompt.userPrompt);
    if (totalTokens > 4000) {
      validation.warnings.push(`Prompt may be too long (${totalTokens} tokens estimated)`);
    }

    return validation;
  }

  /**
   * Get all available prompt types
   */
  getAvailablePromptTypes() {
    return Object.keys(this.prompts);
  }

  /**
   * Get prompt metadata
   */
  getPromptMetadata(type) {
    const prompt = this.prompts[type];
    if (!prompt) return null;

    return {
      name: prompt.name,
      description: prompt.systemPrompt.substring(0, 100) + '...',
    };
  }
}

module.exports = new PromptOrchestrator();