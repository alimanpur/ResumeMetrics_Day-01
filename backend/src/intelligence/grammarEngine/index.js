/**
 * Grammar & Language Quality Engine
 * Analyzes grammar, spelling, and language quality of resumes
 */

class GrammarEngine {
  constructor() {
    // Common grammar issues to detect
    this.grammarPatterns = {
      passiveVoice: [
        /\bwas\s+\w+ed\b/gi,
        /\bwere\s+\w+ed\b/gi,
        /\bbeen\s+\w+ed\b/gi,
        /\bis\s+\w+ed\b/gi,
        /\bare\s+\w+ed\b/gi,
      ],
      weakPhrases: [
        /\bresponsible\s+for\b/gi,
        /\bworked\s+on\b/gi,
        /\bhelped\s+with\b/gi,
        /\bassisted\s+in\b/gi,
        /\bparticipated\s+in\b/gi,
        /\binvolved\s+in\b/gi,
        /\bduties\s+included\b/gi,
        /\btasked\s+with\b/gi,
      ],
      vagueLanguage: [
        /\bvarious\b/gi,
        /\bseveral\b/gi,
        /\bmany\b/gi,
        /\bsome\b/gi,
        /\bmultiple\b/gi,
        /\bnumerous\b/gi,
        /\ba\s+lot\s+of\b/gi,
        /\blots\s+of\b/gi,
      ],
      fillerWords: [
        /\bvery\s+\w+\b/gi,
        /\breally\s+\w+\b/gi,
        /\bbasically\b/gi,
        /\bactually\b/gi,
        /\bjust\b/gi,
        /\bquite\b/gi,
        /\bsomewhat\b/gi,
      ],
      tenseInconsistency: [
        /\bcurrently\s+\w+ing\b/gi,
        /\bcurrently\s+\w+ed\b/gi,
      ],
    };

    // Common spelling errors in resumes
    this.commonSpellingErrors = {
      'acheived': 'achieved',
      'recieved': 'received',
      'perfomed': 'performed',
      'managment': 'management',
      'developement': 'development',
      'experiance': 'experience',
      'responsable': 'responsible',
      'succesful': 'successful',
      'improvment': 'improvement',
      'leaderships': 'leadership',
    };
  }

  /**
   * Analyze grammar and language quality
   * @param {string} text - Resume text
   * @returns {Object} Grammar analysis results
   */
  analyze(text) {
    if (!text || typeof text !== 'string') {
      return this.getEmptyAnalysis();
    }

    const lowerText = text.toLowerCase();
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);

    // Detect grammar issues
    const passiveVoice = this.detectPassiveVoice(text);
    const weakPhrases = this.detectWeakPhrases(text);
    const vagueLanguage = this.detectVagueLanguage(text);
    const fillerWords = this.detectFillerWords(text);
    const spellingErrors = this.detectSpellingErrors(text);

    // Calculate scores
    const grammarScore = this.calculateGrammarScore(passiveVoice, weakPhrases, vagueLanguage, fillerWords);
    const clarityScore = this.calculateClarityScore(vagueLanguage, fillerWords, sentences);
    const professionalismScore = this.calculateProfessionalismScore(weakPhrases, spellingErrors);

    const overallScore = Math.round((grammarScore + clarityScore + professionalismScore) / 3);

    return {
      overallScore,
      grade: this.getGrade(overallScore),
      grammarScore,
      clarityScore,
      professionalismScore,
      issues: {
        passiveVoice: passiveVoice.count,
        weakPhrases: weakPhrases.count,
        vagueLanguage: vagueLanguage.count,
        fillerWords: fillerWords.count,
        spellingErrors: spellingErrors.count,
      },
      details: {
        passiveVoiceExamples: passiveVoice.examples.slice(0, 3),
        weakPhraseExamples: weakPhrases.examples.slice(0, 3),
        vagueLanguageExamples: vagueLanguage.examples.slice(0, 3),
        fillerWordExamples: fillerWords.examples.slice(0, 3),
        spellingErrors: spellingErrors.errors.slice(0, 5),
      },
      recommendations: this.generateRecommendations(overallScore, {
        passiveVoice,
        weakPhrases,
        vagueLanguage,
        fillerWords,
        spellingErrors,
      }),
      analyzedAt: new Date().toISOString(),
    };
  }

  /**
   * Detect passive voice usage
   */
  detectPassiveVoice(text) {
    const examples = [];
    let count = 0;

    for (const pattern of this.grammarPatterns.passiveVoice) {
      const matches = text.match(pattern) || [];
      count += matches.length;
      examples.push(...matches.slice(0, 2));
    }

    return {
      count,
      examples: [...new Set(examples)].slice(0, 5),
      severity: count > 5 ? 'high' : count > 2 ? 'medium' : 'low',
    };
  }

  /**
   * Detect weak phrases
   */
  detectWeakPhrases(text) {
    const examples = [];
    let count = 0;

    for (const pattern of this.grammarPatterns.weakPhrases) {
      const matches = text.match(pattern) || [];
      count += matches.length;
      examples.push(...matches.slice(0, 2));
    }

    return {
      count,
      examples: [...new Set(examples)].slice(0, 5),
      severity: count > 3 ? 'high' : count > 1 ? 'medium' : 'low',
    };
  }

  /**
   * Detect vague language
   */
  detectVagueLanguage(text) {
    const examples = [];
    let count = 0;

    for (const pattern of this.grammarPatterns.vagueLanguage) {
      const matches = text.match(pattern) || [];
      count += matches.length;
      examples.push(...matches.slice(0, 2));
    }

    return {
      count,
      examples: [...new Set(examples)].slice(0, 5),
      severity: count > 5 ? 'high' : count > 2 ? 'medium' : 'low',
    };
  }

  /**
   * Detect filler words
   */
  detectFillerWords(text) {
    const examples = [];
    let count = 0;

    for (const pattern of this.grammarPatterns.fillerWords) {
      const matches = text.match(pattern) || [];
      count += matches.length;
      examples.push(...matches.slice(0, 2));
    }

    return {
      count,
      examples: [...new Set(examples)].slice(0, 5),
      severity: count > 5 ? 'high' : count > 2 ? 'medium' : 'low',
    };
  }

  /**
   * Detect spelling errors
   */
  detectSpellingErrors(text) {
    const errors = [];
    const lowerText = text.toLowerCase();
    const words = lowerText.split(/\s+/);

    for (const word of words) {
      const cleanWord = word.replace(/[^a-z]/g, '');
      if (this.commonSpellingErrors[cleanWord]) {
        errors.push({
          incorrect: cleanWord,
          correct: this.commonSpellingErrors[cleanWord],
        });
      }
    }

    return {
      count: errors.length,
      errors: [...new Map(errors.map(e => [e.incorrect, e])).values()],
      severity: errors.length > 3 ? 'high' : errors.length > 0 ? 'medium' : 'low',
    };
  }

  /**
   * Calculate grammar score
   */
  calculateGrammarScore(passiveVoice, weakPhrases, vagueLanguage, fillerWords) {
    let score = 100;

    // Passive voice penalty
    score -= passiveVoice.count * 3;
    // Weak phrases penalty
    score -= weakPhrases.count * 5;
    // Vague language penalty
    score -= vagueLanguage.count * 4;
    // Filler words penalty
    score -= fillerWords.count * 2;

    return Math.max(0, score);
  }

  /**
   * Calculate clarity score
   */
  calculateClarityScore(vagueLanguage, fillerWords, sentences) {
    let score = 100;

    // Vague language reduces clarity
    score -= vagueLanguage.count * 5;
    // Filler words reduce clarity
    score -= fillerWords.count * 3;

    // Check sentence length variety
    if (sentences.length > 0) {
      const avgLength = sentences.reduce((sum, s) => sum + s.split(/\s+/).length, 0) / sentences.length;
      if (avgLength > 25) score -= 10;
    }

    return Math.max(0, score);
  }

  /**
   * Calculate professionalism score
   */
  calculateProfessionalismScore(weakPhrases, spellingErrors) {
    let score = 100;

    // Weak phrases reduce professionalism
    score -= weakPhrases.count * 5;
    // Spelling errors reduce professionalism
    score -= spellingErrors.count * 8;

    return Math.max(0, score);
  }

  /**
   * Generate recommendations
   */
  generateRecommendations(overallScore, issues) {
    const recommendations = [];

    if (issues.passiveVoice.count > 3) {
      recommendations.push({
        priority: 'high',
        category: 'grammar',
        issue: `Passive voice detected ${issues.passiveVoice.count} times`,
        recommendation: 'Replace passive voice with active voice to make your resume more dynamic and impactful',
        reason: 'Active voice demonstrates ownership and initiative',
      });
    }

    if (issues.weakPhrases.count > 2) {
      recommendations.push({
        priority: 'high',
        category: 'language',
        issue: `Weak phrases detected ${issues.weakPhrases.count} times`,
        recommendation: 'Replace weak phrases like "responsible for" with strong action verbs like "led", "managed", "achieved"',
        reason: 'Strong action verbs demonstrate proactivity and achievement',
      });
    }

    if (issues.vagueLanguage.count > 3) {
      recommendations.push({
        priority: 'high',
        category: 'specificity',
        issue: `Vague language detected ${issues.vagueLanguage.count} times`,
        recommendation: 'Replace vague terms like "various", "several", "many" with specific numbers and metrics',
        reason: 'Specificity demonstrates clarity and attention to detail',
      });
    }

    if (issues.spellingErrors.count > 0) {
      recommendations.push({
        priority: 'critical',
        category: 'spelling',
        issue: `Spelling errors detected: ${issues.spellingErrors.errors.map(e => e.incorrect).join(', ')}`,
        recommendation: 'Correct spelling errors to maintain professionalism',
        reason: 'Spelling errors create a negative impression and suggest lack of attention to detail',
      });
    }

    if (issues.fillerWords.count > 3) {
      recommendations.push({
        priority: 'medium',
        category: 'conciseness',
        issue: `Filler words detected ${issues.fillerWords.count} times`,
        recommendation: 'Remove filler words like "very", "really", "basically" to make your resume more concise',
        reason: 'Concise writing is more professional and easier to read',
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
      grammarScore: 0,
      clarityScore: 0,
      professionalismScore: 0,
      issues: {
        passiveVoice: 0,
        weakPhrases: 0,
        vagueLanguage: 0,
        fillerWords: 0,
        spellingErrors: 0,
      },
      details: {},
      recommendations: [],
      analyzedAt: new Date().toISOString(),
    };
  }
}

module.exports = new GrammarEngine();