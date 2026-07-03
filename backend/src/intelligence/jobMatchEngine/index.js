/**
 * Job Match Engine
 * Compares resume against job descriptions
 * Generates comprehensive match analysis
 */

class JobMatchEngine {
  constructor() {
    this.keywordEngine = require('../keywordEngine');
    this.semanticEngine = require('../semanticEngine');
    this.achievementEngine = require('../achievementEngine');
  }

  /**
   * Match resume against job description
   * @param {Object} normalizedDoc - Normalized resume document
   * @param {string} jobDescription - Job description text
   * @returns {Object} Job match analysis
   */
  match(normalizedDoc, jobDescription) {
    if (!normalizedDoc || !normalizedDoc.cleanedText || !jobDescription) {
      return this.getEmptyMatch();
    }

    const { cleanedText, metadata } = normalizedDoc;

    // Extract keywords from both
    const resumeKeywords = this.keywordEngine.extractKeywords(cleanedText);
    const keywordComparison = this.keywordEngine.compareWithJobDescription(resumeKeywords, jobDescription);

    // Analyze semantic fit
    const semanticAnalysis = this.semanticEngine.analyze(normalizedDoc);

    // Analyze achievements
    const achievementAnalysis = this.achievementEngine.analyze(normalizedDoc);

    // Calculate match scores
    const technicalMatch = this.calculateTechnicalMatch(keywordComparison, resumeKeywords);
    const softSkillMatch = this.calculateSoftSkillMatch(keywordComparison);
    const experienceMatch = this.calculateExperienceMatch(normalizedDoc, jobDescription);
    const educationMatch = this.calculateEducationMatch(normalizedDoc, jobDescription);

    // Calculate overall match
    const overallMatch = this.calculateOverallMatch({
      technicalMatch,
      softSkillMatch,
      experienceMatch,
      educationMatch,
      keywordComparison,
    });

    // Identify missing skills
    const missingSkills = this.identifyMissingSkills(keywordComparison, resumeKeywords);

    // Identify critical gaps
    const criticalGaps = this.identifyCriticalGaps(keywordComparison, normalizedDoc);

    // Calculate hiring risk
    const hiringRisk = this.calculateHiringRisk(overallMatch, criticalGaps, normalizedDoc);

    // Calculate interview probability
    const interviewProbability = this.calculateInterviewProbability(overallMatch, hiringRisk, normalizedDoc);

    // Generate recommendations
    const recommendations = this.generateRecommendations({
      keywordComparison,
      technicalMatch,
      softSkillMatch,
      experienceMatch,
      educationMatch,
      missingSkills,
      criticalGaps,
    });

    return {
      overallMatch,
      technicalMatch,
      softSkillMatch,
      experienceMatch,
      educationMatch,
      missingSkills,
      criticalGaps,
      hiringRisk,
      interviewProbability,
      keywordAnalysis: keywordComparison,
      recommendations,
      matchedAt: new Date().toISOString(),
    };
  }

  /**
   * Calculate technical match score
   */
  calculateTechnicalMatch(keywordComparison, resumeKeywords) {
    const technicalCategories = [
      'programmingLanguages',
      'frontend',
      'backend',
      'databases',
      'cloud',
      'dataScience',
      'mobile',
      'tools',
      'methodologies',
    ];

    let totalScore = 0;
    let totalWeight = 0;

    for (const category of technicalCategories) {
      const comparison = keywordComparison.comparison[category];
      if (comparison) {
        totalScore += comparison.matchScore * comparison.weight;
        totalWeight += comparison.weight;
      }
    }

    const score = totalWeight > 0 ? Math.round(totalScore / totalWeight) : 0;

    return {
      score,
      grade: this.getGrade(score),
      matchedKeywords: this.getMatchedKeywords(keywordComparison, technicalCategories),
      missingKeywords: this.getMissingKeywords(keywordComparison, technicalCategories),
    };
  }

  /**
   * Calculate soft skill match
   */
  calculateSoftSkillMatch(keywordComparison) {
    const comparison = keywordComparison.comparison.softSkills;

    if (!comparison) {
      return {
        score: 0,
        grade: 'F',
        matched: [],
        missing: [],
      };
    }

    return {
      score: comparison.matchScore,
      grade: this.getGrade(comparison.matchScore),
      matched: comparison.matched,
      missing: comparison.missing,
      importance: comparison.importance,
    };
  }

  /**
   * Calculate experience match
   */
  calculateExperienceMatch(normalizedDoc, jobDescription) {
    const { metadata } = normalizedDoc;
    const lowerJobDesc = jobDescription.toLowerCase();

    // Extract years required from job description
    const yearsRequired = this.extractYearsRequired(jobDescription);
    const candidateYears = metadata.experience.estimatedYears;

    // Calculate years match
    let yearsMatch = 100;
    if (yearsRequired > 0) {
      if (candidateYears >= yearsRequired) {
        yearsMatch = 100;
      } else if (candidateYears >= yearsRequired * 0.7) {
        yearsMatch = 80;
      } else if (candidateYears >= yearsRequired * 0.5) {
        yearsMatch = 60;
      } else {
        yearsMatch = 40;
      }
    }

    // Check level match
    const requiredLevel = this.extractRequiredLevel(jobDescription);
    const candidateLevel = metadata.experience.level;
    const levelMatch = this.compareLevels(requiredLevel, candidateLevel);

    // Check leadership requirements
    const leadershipRequired = /lead|manage|supervise|direct/i.test(jobDescription);
    const candidateHasLeadership = metadata.experience.hasLeadership;

    const leadershipMatch = leadershipRequired
      ? (candidateHasLeadership ? 100 : 40)
      : 100;

    // Calculate overall experience score
    const overallScore = Math.round(
      yearsMatch * 0.4 + levelMatch * 0.35 + leadershipMatch * 0.25
    );

    return {
      score: overallScore,
      grade: this.getGrade(overallScore),
      yearsRequired,
      candidateYears,
      yearsMatch,
      requiredLevel,
      candidateLevel,
      levelMatch,
      leadershipRequired,
      candidateHasLeadership,
      leadershipMatch,
    };
  }

  /**
   * Calculate education match
   */
  calculateEducationMatch(normalizedDoc, jobDescription) {
    const { metadata } = normalizedDoc;
    const lowerJobDesc = jobDescription.toLowerCase();

    // Extract education requirements
    const requiredDegree = this.extractRequiredDegree(jobDescription);
    const candidateDegree = metadata.education.highestDegree;
    const candidateDegreeLevel = metadata.education.highestDegreeLevel;

    // Calculate match
    let score = 50; // Base score

    if (requiredDegree) {
      const requiredLevel = this.getDegreeLevel(requiredDegree);
      if (candidateDegreeLevel >= requiredLevel) {
        score = 100;
      } else if (candidateDegreeLevel >= requiredLevel - 1) {
        score = 80;
      } else {
        score = 40;
      }
    } else {
      // No specific requirement, having any degree is good
      score = candidateDegree ? 80 : 50;
    }

    // Check for field relevance
    const requiredField = this.extractRequiredField(jobDescription);
    const candidateField = this.extractFieldFromDegree(candidateDegree);

    if (requiredField && candidateField) {
      const fieldMatch = requiredField.toLowerCase().includes(candidateField.toLowerCase()) ||
                        candidateField.toLowerCase().includes(requiredField.toLowerCase());
      if (fieldMatch) {
        score = Math.min(100, score + 10);
      }
    }

    return {
      score,
      grade: this.getGrade(score),
      requiredDegree,
      candidateDegree,
      requiredField,
      candidateField,
      meetsRequirements: score >= 70,
    };
  }

  /**
   * Calculate overall match score
   */
  calculateOverallMatch(scores) {
    const weights = {
      technicalMatch: 0.35,
      softSkillMatch: 0.15,
      experienceMatch: 0.30,
      educationMatch: 0.20,
    };

    let weightedScore = 0;
    for (const [category, weight] of Object.entries(weights)) {
      if (scores[category]) {
        weightedScore += scores[category].score * weight;
      }
    }

    // Bonus for keyword match
    if (scores.keywordComparison) {
      const keywordBonus = Math.min(5, scores.keywordComparison.overallMatch * 0.05);
      weightedScore += keywordBonus;
    }

    return Math.min(100, Math.round(weightedScore));
  }

  /**
   * Identify missing skills
   */
  identifyMissingSkills(keywordComparison, resumeKeywords) {
    const missing = [];

    for (const [categoryKey, comparison] of Object.entries(keywordComparison.comparison)) {
      if (comparison.missing && comparison.missing.length > 0) {
        for (const skill of comparison.missing.slice(0, 5)) {
          missing.push({
            skill,
            category: comparison.name,
            importance: comparison.importance,
            matchScore: comparison.matchScore,
          });
        }
      }
    }

    // Sort by importance
    const importanceOrder = { high: 0, medium: 1, low: 2 };
    missing.sort((a, b) => {
      const importanceDiff = importanceOrder[a.importance] - importanceOrder[b.importance];
      if (importanceDiff !== 0) return importanceDiff;
      return b.matchScore - a.matchScore;
    });

    return missing.slice(0, 15);
  }

  /**
   * Identify critical gaps
   */
  identifyCriticalGaps(keywordComparison, normalizedDoc) {
    const gaps = [];

    // Check keyword gaps
    for (const gap of keywordComparison.criticalGaps) {
      gaps.push({
        type: 'keyword',
        category: gap.name,
        missing: gap.missing,
        matchScore: gap.matchScore,
        severity: 'high',
        impact: 'Critical skills missing for this role',
      });
    }

    // Check experience gaps
    const { metadata } = normalizedDoc;
    if (metadata.experience.estimatedYears < 2) {
      gaps.push({
        type: 'experience',
        category: 'Years of Experience',
        missing: 'Limited professional experience',
        severity: 'high',
        impact: 'Role may require more experience',
      });
    }

    // Check education gaps
    if (!metadata.education.hasDegree) {
      gaps.push({
        type: 'education',
        category: 'Education',
        missing: 'No degree listed',
        severity: 'medium',
        impact: 'Some roles require formal education',
      });
    }

    return gaps;
  }

  /**
   * Calculate hiring risk
   */
  calculateHiringRisk(overallMatch, criticalGaps, normalizedDoc) {
    let riskScore = 0;

    // Overall match contribution
    if (overallMatch < 50) riskScore += 40;
    else if (overallMatch < 70) riskScore += 25;
    else if (overallMatch < 85) riskScore += 10;

    // Critical gaps contribution
    const highSeverityGaps = criticalGaps.filter(g => g.severity === 'high').length;
    riskScore += highSeverityGaps * 15;

    // Resume quality contribution
    const { metadata } = normalizedDoc;
    if (metadata.experience.estimatedYears < 1) riskScore += 10;
    if (metadata.skills.totalSkills < 5) riskScore += 10;

    return {
      score: Math.min(100, riskScore),
      level: this.getRiskLevel(riskScore),
      factors: this.getRiskFactors(riskScore, criticalGaps, normalizedDoc),
    };
  }

  /**
   * Get risk level
   */
  getRiskLevel(riskScore) {
    if (riskScore >= 70) return 'very_high';
    if (riskScore >= 50) return 'high';
    if (riskScore >= 30) return 'medium';
    if (riskScore >= 15) return 'low';
    return 'very_low';
  }

  /**
   * Get risk factors
   */
  getRiskFactors(riskScore, criticalGaps, normalizedDoc) {
    const factors = [];

    if (riskScore >= 50) {
      factors.push('Significant skill gaps identified');
    }

    if (criticalGaps.length > 2) {
      factors.push(`${criticalGaps.length} critical gaps in qualifications`);
    }

    if (normalizedDoc.metadata.experience.estimatedYears < 2) {
      factors.push('Limited professional experience');
    }

    if (normalizedDoc.metadata.skills.totalSkills < 5) {
      factors.push('Limited technical skills demonstrated');
    }

    return factors;
  }

  /**
   * Calculate interview probability
   */
  calculateInterviewProbability(overallMatch, hiringRisk, normalizedDoc) {
    let probability = overallMatch;

    // Adjust for hiring risk
    probability -= hiringRisk.score * 0.3;

    // Adjust for resume quality
    const { metadata } = normalizedDoc;
    if (metadata.experience.hasLeadership) {
      probability += 5;
    }
    if (metadata.skills.totalSkills >= 10) {
      probability += 5;
    }
    if (metadata.experience.estimatedYears >= 3) {
      probability += 5;
    }

    return {
      percentage: Math.max(0, Math.min(100, Math.round(probability))),
      confidence: this.calculateProbabilityConfidence(overallMatch, hiringRisk),
      factors: this.getProbabilityFactors(overallMatch, hiringRisk, normalizedDoc),
    };
  }

  /**
   * Calculate probability confidence
   */
  calculateProbabilityConfidence(overallMatch, hiringRisk) {
    if (overallMatch >= 80 && hiringRisk.score < 30) return 'high';
    if (overallMatch >= 70 && hiringRisk.score < 50) return 'medium';
    return 'low';
  }

  /**
   * Get probability factors
   */
  getProbabilityFactors(overallMatch, hiringRisk, normalizedDoc) {
    const factors = [];

    if (overallMatch >= 80) {
      factors.push('Strong overall match with job requirements');
    } else if (overallMatch >= 60) {
      factors.push('Moderate match - some gaps to address');
    } else {
      factors.push('Low match - significant improvements needed');
    }

    if (hiringRisk.score < 30) {
      factors.push('Low hiring risk');
    } else if (hiringRisk.score >= 50) {
      factors.push('High hiring risk due to qualification gaps');
    }

    const { metadata } = normalizedDoc;
    if (metadata.experience.hasLeadership) {
      factors.push('Demonstrates leadership experience');
    }

    return factors;
  }

  /**
   * Generate recommendations
   */
  generateRecommendations(data) {
    const recommendations = [];

    // Technical skills
    if (data.technicalMatch.score < 70) {
      recommendations.push({
        priority: 'critical',
        category: 'technical_skills',
        issue: `Technical skill match: ${data.technicalMatch.score}%`,
        recommendation: `Add missing technical skills: ${data.technicalMatch.missingKeywords.slice(0, 5).join(', ')}`,
        impact: 'Critical - technical skills are primary requirement',
      });
    }

    // Soft skills
    if (data.softSkillMatch.score < 70) {
      recommendations.push({
        priority: 'high',
        category: 'soft_skills',
        issue: `Soft skill match: ${data.softSkillMatch.score}%`,
        recommendation: `Add soft skills: ${data.softSkillMatch.missing.slice(0, 3).join(', ')}`,
        impact: 'High - soft skills differentiate candidates',
      });
    }

    // Experience
    if (data.experienceMatch.score < 70) {
      recommendations.push({
        priority: 'high',
        category: 'experience',
        issue: `Experience match: ${data.experienceMatch.score}%`,
        recommendation: 'Highlight relevant experience and quantifiable achievements',
        impact: 'High - experience is critical for most roles',
      });
    }

    // Missing skills
    if (data.missingSkills.length > 0) {
      const highPriority = data.missingSkills.filter(s => s.importance === 'high');
      if (highPriority.length > 0) {
        recommendations.push({
          priority: 'critical',
          category: 'missing_skills',
          issue: `${highPriority.length} high-priority skills missing`,
          recommendation: `Add these critical skills: ${highPriority.slice(0, 5).map(s => s.skill).join(', ')}`,
          impact: 'Critical - these skills are essential for the role',
        });
      }
    }

    return recommendations;
  }

  /**
   * Helper: Extract years required from job description
   */
  extractYearsRequired(jobDescription) {
    const patterns = [
      /(\d+)\+?\s*years?\s+(?:of\s+)?experience/i,
      /minimum\s+(\d+)\s+years/i,
      /at\s+least\s+(\d+)\s+years/i,
      /(\d+)-(\d+)\s+years/i,
    ];

    for (const pattern of patterns) {
      const match = jobDescription.match(pattern);
      if (match) {
        return parseInt(match[1]);
      }
    }

    return 0;
  }

  /**
   * Helper: Extract required level
   */
  extractRequiredLevel(jobDescription) {
    const lower = jobDescription.toLowerCase();

    if (/senior|sr\./i.test(lower)) return 'senior';
    if (/lead|tech\s+lead/i.test(lower)) return 'lead';
    if (/principal|staff/i.test(lower)) return 'principal';
    if (/manager|director/i.test(lower)) return 'manager';
    if (/junior|jr\.|entry\s+level/i.test(lower)) return 'junior';
    if (/intern/i.test(lower)) return 'intern';

    return 'mid';
  }

  /**
   * Helper: Compare levels
   */
  compareLevels(required, candidate) {
    const levels = { 'intern': 0, 'entry': 1, 'junior': 2, 'mid': 3, 'senior': 4, 'lead': 5, 'principal': 6, 'manager': 7, 'director': 8 };
    const requiredLevel = levels[required] || 3;
    const candidateLevel = levels[candidate] || 3;

    if (candidateLevel >= requiredLevel) return 100;
    if (candidateLevel >= requiredLevel - 1) return 80;
    if (candidateLevel >= requiredLevel - 2) return 60;
    return 40;
  }

  /**
   * Helper: Extract required degree
   */
  extractRequiredDegree(jobDescription) {
    const lower = jobDescription.toLowerCase();

    if (/ph\.?d|doctorate/i.test(lower)) return 'phd';
    if (/master['']?s?|mba|m\.s\.|m\.a\./i.test(lower)) return 'masters';
    if (/bachelor['']?s?|b\.s\.|b\.a\.|b\.tech/i.test(lower)) return 'bachelors';
    if (/associate/i.test(lower)) return 'associates';

    return null;
  }

  /**
   * Helper: Get degree level
   */
  getDegreeLevel(degree) {
    const levels = {
      'phd': 5,
      'masters': 4,
      'bachelors': 3,
      'associates': 2,
    };
    return levels[degree] || 0;
  }

  /**
   * Helper: Extract required field
   */
  extractRequiredField(jobDescription) {
    const fields = ['computer science', 'engineering', 'business', 'marketing', 'design', 'data science', 'mathematics'];
    const lower = jobDescription.toLowerCase();

    for (const field of fields) {
      if (lower.includes(field)) {
        return field;
      }
    }

    return null;
  }

  /**
   * Helper: Extract field from degree
   */
  extractFieldFromDegree(degree) {
    if (!degree) return null;
    const lower = degree.toLowerCase();

    if (lower.includes('computer') || lower.includes('cs')) return 'computer science';
    if (lower.includes('engineering') || lower.includes('eng')) return 'engineering';
    if (lower.includes('business') || lower.includes('mba')) return 'business';
    if (lower.includes('marketing')) return 'marketing';

    return null;
  }

  /**
   * Helper: Get matched keywords
   */
  getMatchedKeywords(keywordComparison, categories) {
    const matched = [];
    for (const category of categories) {
      const comparison = keywordComparison.comparison[category];
      if (comparison && comparison.matched) {
        matched.push(...comparison.matched);
      }
    }
    return [...new Set(matched)].slice(0, 20);
  }

  /**
   * Helper: Get missing keywords
   */
  getMissingKeywords(keywordComparison, categories) {
    const missing = [];
    for (const category of categories) {
      const comparison = keywordComparison.comparison[category];
      if (comparison && comparison.missing) {
        missing.push(...comparison.missing);
      }
    }
    return [...new Set(missing)].slice(0, 20);
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
   * Get empty match
   */
  getEmptyMatch() {
    return {
      overallMatch: 0,
      technicalMatch: { score: 0, grade: 'F', matchedKeywords: [], missingKeywords: [] },
      softSkillMatch: { score: 0, grade: 'F', matched: [], missing: [] },
      experienceMatch: { score: 0, grade: 'F' },
      educationMatch: { score: 0, grade: 'F' },
      missingSkills: [],
      criticalGaps: [],
      hiringRisk: { score: 100, level: 'very_high', factors: ['Insufficient data'] },
      interviewProbability: { percentage: 0, confidence: 'low', factors: [] },
      recommendations: [],
      matchedAt: new Date().toISOString(),
    };
  }
}

module.exports = new JobMatchEngine();