/**
 * Recruiter Confidence Engine
 * Calculates how confident recruiters would be when reviewing this resume
 */

class RecruiterConfidenceEngine {
  constructor() {
    this.confidenceFactors = {
      clarity: {
        weight: 0.20,
        indicators: ['clear structure', 'concise language', 'logical flow', 'easy to scan'],
      },
      credibility: {
        weight: 0.25,
        indicators: ['quantified achievements', 'specific metrics', 'verifiable claims', 'consistent timeline'],
      },
      professionalism: {
        weight: 0.20,
        indicators: ['proper grammar', 'no errors', 'professional tone', 'appropriate language'],
      },
      completeness: {
        weight: 0.20,
        indicators: ['all sections present', 'contact info', 'relevant experience', 'education included'],
      },
      relevance: {
        weight: 0.15,
        indicators: ['industry keywords', 'role alignment', 'skills match', 'experience fit'],
      },
    };
  }

  /**
   * Calculate recruiter confidence
   * @param {Object} analysisResults - Complete analysis results
   * @returns {Object} Recruiter confidence analysis
   */
  calculate(analysisResults) {
    if (!analysisResults) {
      return this.getEmptyConfidence();
    }

    const { ats, keywords, semantic, achievements, grammar, readability } = analysisResults;

    // Calculate confidence factors
    const clarity = this.assessClarity(readability, semantic);
    const credibility = this.assessCredibility(achievements, analysisResults.quantification);
    const professionalism = this.assessProfessionalism(grammar, ats);
    const completeness = this.assessCompleteness(ats, keywords);
    const relevance = this.assessRelevance(keywords, semantic);

    // Calculate overall confidence
    const overallConfidence = Math.round(
      clarity.score * this.confidenceFactors.clarity.weight +
      credibility.score * this.confidenceFactors.credibility.weight +
      professionalism.score * this.confidenceFactors.professionalism.weight +
      completeness.score * this.confidenceFactors.completeness.weight +
      relevance.score * this.confidenceFactors.relevance.weight
    );

    // Determine confidence level
    const level = this.getConfidenceLevel(overallConfidence);

    // Generate concerns
    const concerns = this.identifyConcerns({
      clarity,
      credibility,
      professionalism,
      completeness,
      relevance,
    });

    // Generate positive signals
    const positiveSignals = this.identifyPositiveSignals({
      clarity,
      credibility,
      professionalism,
      completeness,
      relevance,
    });

    return {
      overallConfidence,
      level,
      factors: {
        clarity: { score: clarity.score, details: clarity.details },
        credibility: { score: credibility.score, details: credibility.details },
        professionalism: { score: professionalism.score, details: professionalism.details },
        completeness: { score: completeness.score, details: completeness.details },
        relevance: { score: relevance.score, details: relevance.details },
      },
      concerns: concerns.slice(0, 5),
      positiveSignals: positiveSignals.slice(0, 5),
      recruiterPerspective: this.generateRecruiterPerspective(overallConfidence, concerns, positiveSignals),
      recommendations: this.generateRecommendations(concerns),
      calculatedAt: new Date().toISOString(),
    };
  }

  /**
   * Assess clarity
   */
  assessClarity(readability, semantic) {
    const details = [];
    let score = 70; // Base score

    if (readability) {
      if (readability.overallScore >= 80) {
        score += 15;
        details.push('Excellent readability');
      } else if (readability.overallScore >= 60) {
        score += 5;
        details.push('Adequate readability');
      } else {
        score -= 15;
        details.push('Poor readability may confuse recruiters');
      }

      if (readability.metrics?.avgSentenceLength >= 10 && readability.metrics?.avgSentenceLength <= 20) {
        score += 5;
        details.push('Good sentence length');
      }
    }

    if (semantic) {
      if (semantic.dimensions?.experienceQuality?.hasContext) {
        score += 10;
        details.push('Clear context provided');
      }
    }

    return {
      score: Math.min(100, Math.max(0, score)),
      details,
    };
  }

  /**
   * Assess credibility
   */
  assessCredibility(achievements, quantification) {
    const details = [];
    let score = 70; // Base score

    if (achievements) {
      if (achievements.strongPercentage >= 60) {
        score += 20;
        details.push(`${achievements.strongPercentage}% strong achievements with metrics`);
      } else if (achievements.strongPercentage >= 40) {
        score += 10;
        details.push('Moderate number of quantified achievements');
      } else {
        score -= 20;
        details.push('Insufficient quantified achievements');
      }
    }

    if (quantification) {
      if (quantification.totalMetrics >= 8) {
        score += 10;
        details.push('Excellent use of metrics');
      } else if (quantification.totalMetrics >= 5) {
        score += 5;
        details.push('Good metric usage');
      } else {
        score -= 10;
        details.push('Limited metrics reduce credibility');
      }
    }

    return {
      score: Math.min(100, Math.max(0, score)),
      details,
    };
  }

  /**
   * Assess professionalism
   */
  assessProfessionalism(grammar, ats) {
    const details = [];
    let score = 70; // Base score

    if (grammar) {
      if (grammar.overallScore >= 80) {
        score += 20;
        details.push('Excellent grammar and language quality');
      } else if (grammar.overallScore >= 60) {
        score += 10;
        details.push('Adequate language quality');
      } else {
        score -= 20;
        details.push('Grammar issues detected');
      }

      if (grammar.issues?.spellingErrors === 0) {
        score += 10;
        details.push('No spelling errors');
      }
    }

    if (ats) {
      if (ats.atsScore >= 80) {
        score += 10;
        details.push('Professional formatting');
      } else if (ats.atsScore < 60) {
        score -= 10;
        details.push('Formatting issues');
      }
    }

    return {
      score: Math.min(100, Math.max(0, score)),
      details,
    };
  }

  /**
   * Assess completeness
   */
  assessCompleteness(ats, keywords) {
    const details = [];
    let score = 70; // Base score

    if (ats?.checks?.contact) {
      if (ats.checks.contact.score >= 80) {
        score += 15;
        details.push('Complete contact information');
      } else {
        score -= 15;
        details.push('Missing contact information');
      }
    }

    if (ats?.checks?.sections) {
      if (ats.checks.sections.score >= 80) {
        score += 15;
        details.push('All essential sections present');
      } else {
        score -= 10;
        details.push('Some sections missing');
      }
    }

    if (keywords?.summary?.categoriesFound >= 5) {
      score += 10;
      details.push('Good skill coverage');
    }

    return {
      score: Math.min(100, Math.max(0, score)),
      details,
    };
  }

  /**
   * Assess relevance
   */
  assessRelevance(keywords, semantic) {
    const details = [];
    let score = 70; // Base score

    if (keywords?.overallCoverage >= 70) {
      score += 15;
      details.push('Strong keyword coverage');
    } else if (keywords?.overallCoverage >= 50) {
      score += 5;
      details.push('Moderate keyword coverage');
    } else {
      score -= 15;
      details.push('Low keyword coverage');
    }

    if (semantic?.dimensions?.impact?.score >= 70) {
      score += 10;
      details.push('Clear impact demonstration');
    }

    if (semantic?.dimensions?.achievements?.strongPercentage >= 50) {
      score += 5;
      details.push('Strong achievements');
    }

    return {
      score: Math.min(100, Math.max(0, score)),
      details,
    };
  }

  /**
   * Get confidence level
   */
  getConfidenceLevel(score) {
    if (score >= 85) return 'very_high';
    if (score >= 75) return 'high';
    if (score >= 65) return 'moderate';
    if (score >= 55) return 'low';
    return 'very_low';
  }

  /**
   * Identify concerns
   */
  identifyConcerns(factors) {
    const concerns = [];

    if (factors.clarity.score < 60) {
      concerns.push({
        factor: 'clarity',
        severity: 'high',
        issue: 'Resume may be difficult to understand',
        impact: 'Recruiters may miss key qualifications',
      });
    }

    if (factors.credibility.score < 60) {
      concerns.push({
        factor: 'credibility',
        severity: 'critical',
        issue: 'Insufficient evidence of achievements',
        impact: 'Claims appear unsubstantiated',
      });
    }

    if (factors.professionalism.score < 60) {
      concerns.push({
        factor: 'professionalism',
        severity: 'high',
        issue: 'Professionalism concerns detected',
        impact: 'May create negative impression',
      });
    }

    if (factors.completeness.score < 60) {
      concerns.push({
        factor: 'completeness',
        severity: 'medium',
        issue: 'Missing important information',
        impact: 'Recruiters cannot make informed decision',
      });
    }

    if (factors.relevance.score < 60) {
      concerns.push({
        factor: 'relevance',
        severity: 'medium',
        issue: 'Limited relevance to target role',
        impact: 'May not pass initial screening',
      });
    }

    return concerns;
  }

  /**
   * Identify positive signals
   */
  identifyPositiveSignals(factors) {
    const signals = [];

    if (factors.clarity.score >= 80) {
      signals.push({
        factor: 'clarity',
        strength: 'Clear and easy to understand',
        impact: 'Recruiters quickly grasp qualifications',
      });
    }

    if (factors.credibility.score >= 80) {
      signals.push({
        factor: 'credibility',
        strength: 'Strong, evidence-based achievements',
        impact: 'Builds trust and credibility',
      });
    }

    if (factors.professionalism.score >= 80) {
      signals.push({
        factor: 'professionalism',
        strength: 'Professional presentation',
        impact: 'Creates positive first impression',
      });
    }

    if (factors.completeness.score >= 80) {
      signals.push({
        factor: 'completeness',
        strength: 'Comprehensive information',
        impact: 'Recruiters have all needed details',
      });
    }

    if (factors.relevance.score >= 80) {
      signals.push({
        factor: 'relevance',
        strength: 'Highly relevant to role',
        impact: 'Strong match for position',
      });
    }

    return signals;
  }

  /**
   * Generate recruiter perspective
   */
  generateRecruiterPerspective(score, concerns, positiveSignals) {
    if (score >= 85) {
      return 'This resume would give recruiters very high confidence. It is clear, credible, complete, and professional. Likely to advance to interview stage.';
    } else if (score >= 75) {
      return 'This resume would give recruiters high confidence. Minor improvements could make it exceptional. Strong candidate profile.';
    } else if (score >= 65) {
      return 'This resume would give recruiters moderate confidence. Some concerns may cause hesitation. Address identified issues to strengthen impression.';
    } else if (score >= 55) {
      return 'This resume would give recruiters low confidence. Multiple concerns may lead to rejection. Significant improvements needed.';
    } else {
      return 'This resume would give recruiters very low confidence. Critical issues must be fixed before submission.';
    }
  }

  /**
   * Generate recommendations
   */
  generateRecommendations(concerns) {
    const recommendations = [];

    for (const concern of concerns.slice(0, 3)) {
      recommendations.push({
        priority: concern.severity,
        factor: concern.factor,
        issue: concern.issue,
        recommendation: this.getRecommendationForFactor(concern.factor),
        reason: concern.impact,
      });
    }

    return recommendations;
  }

  /**
   * Get recommendation for factor
   */
  getRecommendationForFactor(factor) {
    const recommendations = {
      clarity: 'Simplify language and improve structure for better comprehension',
      credibility: 'Add more quantifiable achievements with specific metrics',
      professionalism: 'Fix grammar errors and improve overall presentation',
      completeness: 'Add missing sections and complete all required information',
      relevance: 'Include more role-specific keywords and relevant experience',
    };

    return recommendations[factor] || 'Review and improve this aspect';
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
   * Get empty confidence
   */
  getEmptyConfidence() {
    return {
      overallConfidence: 0,
      level: 'very_low',
      factors: {},
      concerns: [],
      positiveSignals: [],
      recruiterPerspective: 'Unable to assess recruiter confidence',
      recommendations: [],
      calculatedAt: new Date().toISOString(),
    };
  }
}

module.exports = new RecruiterConfidenceEngine();