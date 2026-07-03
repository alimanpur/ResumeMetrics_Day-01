/**
 * Action Verb Analysis Engine
 * Analyzes the strength and variety of action verbs used in resumes
 */

class ActionVerbEngine {
  constructor() {
    // Action verbs categorized by strength
    this.actionVerbs = {
      exceptional: [
        'spearheaded', 'orchestrated', 'pioneered', 'revolutionized', 'transformed',
        'architected', 'conceptualized', 'envisioned', 'masterminded', 'championed',
        'spearheaded', 'inaugurated', 'established', 'founded',
      ],
      strong: [
        'achieved', 'accelerated', 'exceeded', 'surpassed', 'outperformed',
        'delivered', 'executed', 'implemented', 'launched', 'deployed',
        'led', 'managed', 'directed', 'headed', 'commanded',
        'developed', 'engineered', 'designed', 'created', 'built',
        'improved', 'enhanced', 'optimized', 'streamlined', 'refined',
        'increased', 'grew', 'expanded', 'scaled', 'multiplied',
        'reduced', 'decreased', 'eliminated', 'minimized', 'cut',
        'solved', 'resolved', 'overcame', 'conquered', 'triumphed',
        'negotiated', 'persuaded', 'influenced', 'convinced', 'secured',
        'trained', 'mentored', 'coached', 'guided', 'cultivated',
        'authored', 'published', 'presented', 'delivered', 'showcased',
      ],
      moderate: [
        'worked', 'helped', 'assisted', 'supported', 'facilitated',
        'participated', 'contributed', 'involved', 'engaged', 'joined',
        'used', 'applied', 'employed', 'utilized', 'leveraged',
        'maintained', 'managed', 'handled', 'operated', 'ran',
        'updated', 'modified', 'changed', 'adjusted', 'adapted',
        'monitored', 'tracked', 'reviewed', 'evaluated', 'assessed',
        'coordinated', 'organized', 'arranged', 'planned', 'scheduled',
      ],
      weak: [
        'responsible for', 'worked on', 'helped with', 'assisted in',
        'tasked with', 'duties included', 'in charge of', 'accountable for',
        'involved in', 'participated in', 'contributed to',
      ],
    };

    // Industry-specific action verbs
    this.industryVerbs = {
      technology: ['coded', 'programmed', 'debugged', 'tested', 'deployed', 'integrated'],
      sales: ['sold', 'closed', 'prospected', 'pitched', 'converted', 'acquired'],
      marketing: ['promoted', 'advertised', 'campaign', 'branded', 'marketed', 'launched'],
      finance: ['analyzed', 'forecasted', 'budgeted', 'audited', 'reconciled', 'invested'],
      management: ['led', 'directed', 'oversaw', 'supervised', 'guided', 'mentored'],
    };
  }

  /**
   * Analyze action verbs in resume
   * @param {string} text - Resume text
   * @returns {Object} Action verb analysis results
   */
  analyze(text) {
    if (!text || typeof text !== 'string') {
      return this.getEmptyAnalysis();
    }

    const lowerText = text.toLowerCase();
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);

    // Detect action verbs by category
    const exceptionalVerbs = this.detectVerbs(lowerText, this.actionVerbs.exceptional);
    const strongVerbs = this.detectVerbs(lowerText, this.actionVerbs.strong);
    const moderateVerbs = this.detectVerbs(lowerText, this.actionVerbs.moderate);
    const weakPhrases = this.detectWeakPhrases(lowerText);

    // Calculate variety score
    const allStrongVerbs = [...new Set([...exceptionalVerbs.verbs, ...strongVerbs.verbs])];
    const varietyScore = this.calculateVarietyScore(allStrongVerbs);

    // Calculate strength score
    const strengthScore = this.calculateStrengthScore(
      exceptionalVerbs.count,
      strongVerbs.count,
      moderateVerbs.count,
      weakPhrases.count
    );

    // Calculate distribution score
    const distributionScore = this.calculateDistributionScore(sentences, allStrongVerbs);

    // Detect industry-specific verbs
    const industryVerbs = this.detectIndustryVerbs(lowerText);

    const overallScore = Math.round(
      (strengthScore * 0.4 + varietyScore * 0.3 + distributionScore * 0.3)
    );

    return {
      overallScore,
      grade: this.getGrade(overallScore),
      strengthScore,
      varietyScore,
      distributionScore,
      verbCounts: {
        exceptional: exceptionalVerbs.count,
        strong: strongVerbs.count,
        moderate: moderateVerbs.count,
        weak: weakPhrases.count,
        total: exceptionalVerbs.count + strongVerbs.count + moderateVerbs.count,
      },
      verbs: {
        exceptional: exceptionalVerbs.verbs,
        strong: strongVerbs.verbs,
        moderate: moderateVerbs.verbs,
        weak: weakPhrases.phrases,
        industry: industryVerbs,
      },
      topVerbs: this.getTopVerbs(allStrongVerbs, lowerText),
      variety: {
        uniqueVerbs: allStrongVerbs.length,
        varietyScore,
        isVaried: allStrongVerbs.length >= 8,
      },
      distribution: {
        sentencesWithVerbs: distributionScore,
        coverage: Math.round((distributionScore / Math.max(sentences.length, 1)) * 100),
      },
      strengths: this.identifyStrengths({
        exceptionalVerbs,
        strongVerbs,
        varietyScore,
        distributionScore,
      }),
      weaknesses: this.identifyWeaknesses({
        exceptionalVerbs,
        strongVerbs,
        moderateVerbs,
        weakPhrases,
        varietyScore,
        distributionScore,
      }),
      recommendations: this.generateRecommendations({
        exceptionalVerbs,
        strongVerbs,
        moderateVerbs,
        weakPhrases,
        varietyScore,
        distributionScore,
      }),
      analyzedAt: new Date().toISOString(),
    };
  }

  /**
   * Detect verbs from a list
   */
  detectVerbs(text, verbList) {
    const found = [];
    for (const verb of verbList) {
      if (text.includes(verb)) {
        found.push(verb);
      }
    }
    return {
      verbs: found,
      count: found.length,
    };
  }

  /**
   * Detect weak phrases
   */
  detectWeakPhrases(text) {
    const found = [];
    for (const phrase of this.actionVerbs.weak) {
      if (text.includes(phrase)) {
        found.push(phrase);
      }
    }
    return {
      phrases: found,
      count: found.length,
    };
  }

  /**
   * Detect industry-specific verbs
   */
  detectIndustryVerbs(text) {
    const detected = {};

    for (const [industry, verbs] of Object.entries(this.industryVerbs)) {
      const found = verbs.filter(verb => text.includes(verb));
      if (found.length > 0) {
        detected[industry] = found;
      }
    }

    return detected;
  }

  /**
   * Calculate variety score
   */
  calculateVarietyScore(verbs) {
    const uniqueCount = verbs.length;

    if (uniqueCount >= 12) return 95;
    if (uniqueCount >= 10) return 85;
    if (uniqueCount >= 8) return 75;
    if (uniqueCount >= 6) return 65;
    if (uniqueCount >= 4) return 55;
    if (uniqueCount >= 2) return 45;
    return uniqueCount > 0 ? 35 : 0;
  }

  /**
   * Calculate strength score
   */
  calculateStrengthScore(exceptional, strong, moderate, weak) {
    const totalVerbs = exceptional + strong + moderate + weak;
    if (totalVerbs === 0) return 0;

    const weightedScore = (exceptional * 100) + (strong * 80) + (moderate * 50) + (weak * 20);
    const maxPossible = totalVerbs * 100;

    return Math.round((weightedScore / maxPossible) * 100);
  }

  /**
   * Calculate distribution score
   */
  calculateDistributionScore(sentences, verbs) {
    if (sentences.length === 0 || verbs.length === 0) return 0;

    const sentencesWithVerbs = sentences.filter(sentence => {
      const lowerSentence = sentence.toLowerCase();
      return verbs.some(verb => lowerSentence.includes(verb));
    }).length;

    return Math.round((sentencesWithVerbs / sentences.length) * 100);
  }

  /**
   * Get top verbs with frequency
   */
  getTopVerbs(verbs, text) {
    const verbFrequency = {};

    for (const verb of verbs) {
      const regex = new RegExp(`\\b${verb}\\b`, 'gi');
      const matches = text.match(regex) || [];
      verbFrequency[verb] = matches.length;
    }

    return Object.entries(verbFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([verb, count]) => ({ verb, count }));
  }

  /**
   * Identify strengths
   */
  identifyStrengths(data) {
    const strengths = [];

    if (data.exceptionalVerbs.count >= 2) strengths.push('Uses exceptional action verbs');
    if (data.strongVerbs.count >= 5) strengths.push('Strong action verb usage');
    if (data.varietyScore >= 75) strengths.push('Good verb variety');
    if (data.distributionScore >= 60) strengths.push('Action verbs well-distributed');

    return strengths.slice(0, 5);
  }

  /**
   * Identify weaknesses
   */
  identifyWeaknesses(data) {
    const weaknesses = [];

    if (data.exceptionalVerbs.count === 0) weaknesses.push('No exceptional action verbs');
    if (data.strongVerbs.count < 3) weaknesses.push('Limited strong action verbs');
    if (data.varietyScore < 60) weaknesses.push('Low verb variety - repetitive language');
    if (data.distributionScore < 50) weaknesses.push('Action verbs not well-distributed');
    if (data.weakPhrases.count > 2) weaknesses.push('Too many weak phrases');

    return weaknesses.slice(0, 5);
  }

  /**
   * Generate recommendations
   */
  generateRecommendations(data) {
    const recommendations = [];

    if (data.exceptionalVerbs.count < 2) {
      recommendations.push({
        priority: 'high',
        category: 'action_verbs',
        issue: 'Limited exceptional action verbs',
        recommendation: 'Incorporate more powerful verbs like "spearheaded", "orchestrated", "pioneered"',
        reason: 'Exceptional verbs demonstrate leadership and initiative',
      });
    }

    if (data.strongVerbs.count < 5) {
      recommendations.push({
        priority: 'high',
        category: 'action_verbs',
        issue: `Only ${data.strongVerbs.count} strong action verbs found (recommended: 8+)`,
        recommendation: 'Add more strong action verbs: "achieved", "led", "developed", "improved", "increased"',
        reason: 'Strong action verbs make achievements more impactful',
      });
    }

    if (data.varietyScore < 60) {
      recommendations.push({
        priority: 'medium',
        category: 'variety',
        issue: 'Low verb variety - language appears repetitive',
        recommendation: 'Use a wider variety of action verbs to avoid repetition',
        reason: 'Varied vocabulary demonstrates communication skills and keeps reader engaged',
      });
    }

    if (data.weakPhrases.count > 2) {
      recommendations.push({
        priority: 'high',
        category: 'weak_phrases',
        issue: `${data.weakPhrases.count} weak phrases detected`,
        recommendation: `Replace weak phrases: ${data.weakPhrases.phrases.slice(0, 3).join(', ')}`,
        reason: 'Weak phrases undermine the impact of your achievements',
      });
    }

    if (data.distributionScore < 50) {
      recommendations.push({
        priority: 'medium',
        category: 'distribution',
        issue: 'Action verbs not well-distributed across resume',
        recommendation: 'Ensure each bullet point starts with a strong action verb',
        reason: 'Consistent use of action verbs improves readability and impact',
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
      strengthScore: 0,
      varietyScore: 0,
      distributionScore: 0,
      verbCounts: {
        exceptional: 0,
        strong: 0,
        moderate: 0,
        weak: 0,
        total: 0,
      },
      verbs: {
        exceptional: [],
        strong: [],
        moderate: [],
        weak: [],
        industry: {},
      },
      topVerbs: [],
      variety: {
        uniqueVerbs: 0,
        varietyScore: 0,
        isVaried: false,
      },
      distribution: {
        sentencesWithVerbs: 0,
        coverage: 0,
      },
      strengths: [],
      weaknesses: [],
      recommendations: [],
      analyzedAt: new Date().toISOString(),
    };
  }
}

module.exports = new ActionVerbEngine();