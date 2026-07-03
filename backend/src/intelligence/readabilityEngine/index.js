/**
 * Readability Analysis Engine
 * Evaluates resume readability, clarity, and communication effectiveness
 */

class ReadabilityEngine {
  constructor() {
    // Readability benchmarks
    this.benchmarks = {
      optimalSentenceLength: 15, // words
      maxSentenceLength: 25,
      optimalParagraphLength: 3, // sentences
      minWordCount: 200,
      maxWordCount: 800,
      idealWordCount: 500,
    };

    // Complex words that reduce readability
    this.complexWords = [
      'utilize', 'implement', 'facilitate', 'leverage', 'synergize',
      'optimize', 'streamline', 'orchestrate', 'paradigm', 'methodology',
      'comprehensive', 'extensive', 'numerous', 'various', 'significant',
    ];
  }

  /**
   * Analyze readability of resume text
   * @param {string} text - Resume text
   * @returns {Object} Readability analysis results
   */
  analyze(text) {
    if (!text || typeof text !== 'string') {
      return this.getEmptyAnalysis();
    }

    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = text.split(/\s+/).filter(w => w.length > 0);
    const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 0);

    // Calculate metrics
    const wordCount = words.length;
    const sentenceCount = sentences.length;
    const avgSentenceLength = sentenceCount > 0 ? wordCount / sentenceCount : 0;
    const avgParagraphLength = paragraphs.length > 0 ? sentenceCount / paragraphs.length : 0;

    // Analyze readability dimensions
    const sentenceVariety = this.analyzeSentenceVariety(sentences);
    const wordComplexity = this.analyzeWordComplexity(words);
    const structure = this.analyzeStructure(text, paragraphs, sentences);
    const flow = this.analyzeFlow(sentences);

    // Calculate scores
    const lengthScore = this.calculateLengthScore(wordCount);
    const sentenceScore = this.calculateSentenceScore(avgSentenceLength, sentenceVariety);
    const complexityScore = this.calculateComplexityScore(wordComplexity);
    const structureScore = this.calculateStructureScore(structure);
    const flowScore = this.calculateFlowScore(flow);

    const overallScore = Math.round(
      (lengthScore + sentenceScore + complexityScore + structureScore + flowScore) / 5
    );

    return {
      overallScore,
      grade: this.getGrade(overallScore),
      metrics: {
        wordCount,
        sentenceCount,
        paragraphCount: paragraphs.length,
        avgSentenceLength: Math.round(avgSentenceLength * 10) / 10,
        avgParagraphLength: Math.round(avgParagraphLength * 10) / 10,
      },
      dimensions: {
        length: { score: lengthScore, details: this.getLengthDetails(wordCount) },
        sentenceVariety: { score: sentenceScore, ...sentenceVariety },
        wordComplexity: { score: complexityScore, ...wordComplexity },
        structure: { score: structureScore, ...structure },
        flow: { score: flowScore, ...flow },
      },
      strengths: this.identifyStrengths({
        lengthScore,
        sentenceScore,
        complexityScore,
        structureScore,
        flowScore,
      }),
      weaknesses: this.identifyWeaknesses({
        lengthScore,
        sentenceScore,
        complexityScore,
        structureScore,
        flowScore,
      }),
      recommendations: this.generateRecommendations({
        wordCount,
        avgSentenceLength,
        sentenceVariety,
        wordComplexity,
        structure,
        flow,
      }),
      analyzedAt: new Date().toISOString(),
    };
  }

  /**
   * Analyze sentence variety
   */
  analyzeSentenceVariety(sentences) {
    if (sentences.length === 0) {
      return { variety: 'none', score: 0 };
    }

    const lengths = sentences.map(s => s.split(/\s+/).length);
    const avgLength = lengths.reduce((a, b) => a + b, 0) / lengths.length;
    const variance = lengths.reduce((sum, len) => sum + Math.pow(len - avgLength, 2), 0) / lengths.length;
    const stdDev = Math.sqrt(variance);

    let variety = 'low';
    let score = 50;

    if (stdDev > 10) {
      variety = 'high';
      score = 90;
    } else if (stdDev > 5) {
      variety = 'medium';
      score = 75;
    }

    return {
      variety,
      score,
      avgLength: Math.round(avgLength * 10) / 10,
      stdDev: Math.round(stdDev * 10) / 10,
      shortSentences: lengths.filter(l => l < 10).length,
      longSentences: lengths.filter(l => l > 25).length,
    };
  }

  /**
   * Analyze word complexity
   */
  analyzeWordComplexity(words) {
    const complexWordCount = words.filter(w =>
      this.complexWords.includes(w.toLowerCase())
    ).length;

    const totalWords = words.length;
    const complexPercentage = totalWords > 0 ? (complexWordCount / totalWords) * 100 : 0;

    let complexity = 'low';
    let score = 90;

    if (complexPercentage > 15) {
      complexity = 'high';
      score = 50;
    } else if (complexPercentage > 8) {
      complexity = 'medium';
      score = 70;
    }

    return {
      complexity,
      score,
      complexWordCount,
      complexPercentage: Math.round(complexPercentage * 10) / 10,
      examples: words.filter(w => this.complexWords.includes(w.toLowerCase())).slice(0, 5),
    };
  }

  /**
   * Analyze structure
   */
  analyzeStructure(text, paragraphs, sentences) {
    const hasBulletPoints = /^[-•·*]/gm.test(text);
    const hasHeadings = /^[A-Z][A-Z\s]+$/gm.test(text);
    const hasWhiteSpace = text.includes('\n\n');

    let structure = 'poor';
    let score = 40;

    if (hasBulletPoints && hasHeadings && hasWhiteSpace) {
      structure = 'excellent';
      score = 95;
    } else if (hasBulletPoints || hasHeadings) {
      structure = 'good';
      score = 75;
    } else if (hasWhiteSpace) {
      structure = 'fair';
      score = 60;
    }

    return {
      structure,
      score,
      hasBulletPoints,
      hasHeadings,
      hasWhiteSpace,
      paragraphCount: paragraphs.length,
    };
  }

  /**
   * Analyze flow
   */
  analyzeFlow(sentences) {
    if (sentences.length < 2) {
      return { flow: 'insufficient', score: 0 };
    }

    // Check for transition words
    const transitionWords = [
      'however', 'therefore', 'furthermore', 'moreover', 'additionally',
      'consequently', 'meanwhile', 'subsequently', 'previously', 'additionally',
    ];

    const transitionCount = sentences.filter(s =>
      transitionWords.some(tw => s.toLowerCase().includes(tw))
    ).length;

    const transitionRatio = (transitionCount / sentences.length) * 100;

    let flow = 'poor';
    let score = 40;

    if (transitionRatio > 15) {
      flow = 'excellent';
      score = 95;
    } else if (transitionRatio > 8) {
      flow = 'good';
      score = 75;
    } else if (transitionRatio > 3) {
      flow = 'fair';
      score = 60;
    }

    return {
      flow,
      score,
      transitionCount,
      transitionRatio: Math.round(transitionRatio * 10) / 10,
    };
  }

  /**
   * Calculate length score
   */
  calculateLengthScore(wordCount) {
    if (wordCount >= this.benchmarks.minWordCount && wordCount <= this.benchmarks.maxWordCount) {
      if (wordCount >= this.benchmarks.idealWordCount - 50 && wordCount <= this.benchmarks.idealWordCount + 100) {
        return 95;
      }
      return 80;
    } else if (wordCount < this.benchmarks.minWordCount) {
      return Math.max(0, 50 - (this.benchmarks.minWordCount - wordCount) / 10);
    } else {
      return Math.max(0, 70 - (wordCount - this.benchmarks.maxWordCount) / 20);
    }
  }

  /**
   * Calculate sentence score
   */
  calculateSentenceScore(avgLength, sentenceVariety) {
    let score = 100;

    // Penalize long average sentences
    if (avgLength > this.benchmarks.maxSentenceLength) {
      score -= 20;
    } else if (avgLength > this.benchmarks.optimalSentenceLength) {
      score -= 10;
    }

    // Factor in sentence variety
    score = (score + sentenceVariety.score) / 2;

    return Math.round(score);
  }

  /**
   * Calculate complexity score
   */
  calculateComplexityScore(wordComplexity) {
    return wordComplexity.score;
  }

  /**
   * Calculate structure score
   */
  calculateStructureScore(structure) {
    return structure.score;
  }

  /**
   * Calculate flow score
   */
  calculateFlowScore(flow) {
    return flow.score;
  }

  /**
   * Get length details
   */
  getLengthDetails(wordCount) {
    if (wordCount < 200) {
      return { status: 'too_short', recommendation: 'Expand resume to at least 200 words' };
    } else if (wordCount > 800) {
      return { status: 'too_long', recommendation: 'Condense to 1-2 pages' };
    } else {
      return { status: 'optimal', recommendation: 'Good length' };
    }
  }

  /**
   * Identify strengths
   */
  identifyStrengths(scores) {
    const strengths = [];

    if (scores.lengthScore >= 80) strengths.push('Appropriate resume length');
    if (scores.sentenceScore >= 80) strengths.push('Good sentence structure and variety');
    if (scores.complexityScore >= 80) strengths.push('Clear, accessible language');
    if (scores.structureScore >= 80) strengths.push('Well-structured content');
    if (scores.flowScore >= 80) strengths.push('Smooth logical flow');

    return strengths.slice(0, 5);
  }

  /**
   * Identify weaknesses
   */
  identifyWeaknesses(scores) {
    const weaknesses = [];

    if (scores.lengthScore < 60) weaknesses.push('Resume length needs adjustment');
    if (scores.sentenceScore < 60) weaknesses.push('Sentence structure needs improvement');
    if (scores.complexityScore < 60) weaknesses.push('Language too complex or vague');
    if (scores.structureScore < 60) weaknesses.push('Poor content structure');
    if (scores.flowScore < 60) weaknesses.push('Weak logical flow');

    return weaknesses.slice(0, 5);
  }

  /**
   * Generate recommendations
   */
  generateRecommendations(metrics) {
    const recommendations = [];

    if (metrics.wordCount < 200) {
      recommendations.push({
        priority: 'high',
        category: 'length',
        issue: `Resume too short (${metrics.wordCount} words)`,
        recommendation: 'Expand your resume to at least 300 words with more detailed achievements',
        reason: 'Short resumes lack sufficient detail to demonstrate qualifications',
      });
    } else if (metrics.wordCount > 800) {
      recommendations.push({
        priority: 'medium',
        category: 'length',
        issue: `Resume too long (${metrics.wordCount} words)`,
        recommendation: 'Condense your resume to 1-2 pages (400-600 words)',
        reason: 'Long resumes may lose recruiter attention',
      });
    }

    if (metrics.avgSentenceLength > 25) {
      recommendations.push({
        priority: 'medium',
        category: 'sentences',
        issue: `Average sentence length too long (${metrics.avgSentenceLength} words)`,
        recommendation: 'Break long sentences into shorter, clearer statements',
        reason: 'Shorter sentences improve readability and comprehension',
      });
    }

    if (metrics.sentenceVariety.variety === 'low') {
      recommendations.push({
        priority: 'medium',
        category: 'variety',
        issue: 'Low sentence variety',
        recommendation: 'Vary sentence length and structure for better readability',
        reason: 'Varied sentence structure maintains reader engagement',
      });
    }

    if (metrics.wordComplexity.complexPercentage > 10) {
      recommendations.push({
        priority: 'low',
        category: 'language',
        issue: `High use of complex words (${metrics.wordComplexity.complexPercentage}%)`,
        recommendation: 'Simplify language where possible without losing meaning',
        reason: 'Simple, clear language is more accessible and professional',
      });
    }

    if (metrics.flow.transitionRatio < 5) {
      recommendations.push({
        priority: 'low',
        category: 'flow',
        issue: 'Limited use of transition words',
        recommendation: 'Add transition words to improve logical flow between ideas',
        reason: 'Transitions help recruiters follow your career narrative',
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
      grade: 'F',
      metrics: {
        wordCount: 0,
        sentenceCount: 0,
        paragraphCount: 0,
        avgSentenceLength: 0,
        avgParagraphLength: 0,
      },
      dimensions: {},
      strengths: [],
      weaknesses: [],
      recommendations: [],
      analyzedAt: new Date().toISOString(),
    };
  }
}

module.exports = new ReadabilityEngine();