/**
 * Industry Benchmark Engine
 * Compares resume against industry standards and expectations
 * Supports multiple roles and industries
 */

class BenchmarkEngine {
  constructor() {
    // Industry benchmarks by role
    this.roleBenchmarks = {
      'software engineer': {
        name: 'Software Engineer',
        category: 'Engineering',
        expectedSkills: ['javascript', 'python', 'java', 'react', 'node.js', 'sql', 'git', 'agile', 'ci/cd', 'testing'],
        expectedSections: ['experience', 'education', 'skills', 'projects'],
        minExperience: 2,
        preferredExperience: 5,
        keyMetrics: ['lines of code', 'features shipped', 'bugs fixed', 'performance improvements'],
        leadershipWeight: 0.3,
        technicalWeight: 0.7,
      },
      'frontend developer': {
        name: 'Frontend Developer',
        category: 'Engineering',
        expectedSkills: ['react', 'angular', 'vue', 'javascript', 'typescript', 'html', 'css', 'git', 'responsive design', 'testing'],
        expectedSections: ['experience', 'education', 'skills', 'projects'],
        minExperience: 2,
        preferredExperience: 4,
        keyMetrics: ['user engagement', 'page load time', 'accessibility score', 'component reusability'],
        leadershipWeight: 0.2,
        technicalWeight: 0.8,
      },
      'backend developer': {
        name: 'Backend Developer',
        category: 'Engineering',
        expectedSkills: ['node.js', 'python', 'java', 'sql', 'mongodb', 'redis', 'api', 'docker', 'aws', 'microservices'],
        expectedSections: ['experience', 'education', 'skills', 'projects'],
        minExperience: 2,
        preferredExperience: 5,
        keyMetrics: ['api response time', 'uptime', 'queries optimized', 'data processed'],
        leadershipWeight: 0.25,
        technicalWeight: 0.75,
      },
      'full stack developer': {
        name: 'Full Stack Developer',
        category: 'Engineering',
        expectedSkills: ['javascript', 'react', 'node.js', 'sql', 'mongodb', 'git', 'docker', 'aws', 'agile', 'testing'],
        expectedSections: ['experience', 'education', 'skills', 'projects'],
        minExperience: 3,
        preferredExperience: 5,
        keyMetrics: ['features delivered', 'performance improvements', 'cost savings', 'user satisfaction'],
        leadershipWeight: 0.3,
        technicalWeight: 0.7,
      },
      'data scientist': {
        name: 'Data Scientist',
        category: 'Data',
        expectedSkills: ['python', 'machine learning', 'sql', 'pandas', 'numpy', 'tensorflow', 'statistics', 'data analysis', 'visualization'],
        expectedSections: ['experience', 'education', 'skills', 'projects'],
        minExperience: 2,
        preferredExperience: 4,
        keyMetrics: ['models deployed', 'accuracy improved', 'revenue generated', 'cost reduced'],
        leadershipWeight: 0.2,
        technicalWeight: 0.8,
      },
      'devops engineer': {
        name: 'DevOps Engineer',
        category: 'Engineering',
        expectedSkills: ['docker', 'kubernetes', 'aws', 'azure', 'terraform', 'jenkins', 'ci/cd', 'linux', 'python', 'git'],
        expectedSections: ['experience', 'education', 'skills', 'certifications', 'projects'],
        minExperience: 3,
        preferredExperience: 5,
        keyMetrics: ['deployment frequency', 'uptime', 'incident reduction', 'cost optimization'],
        leadershipWeight: 0.25,
        technicalWeight: 0.75,
      },
      'product manager': {
        name: 'Product Manager',
        category: 'Product',
        expectedSkills: ['agile', 'scrum', 'jira', 'roadmapping', 'user research', 'analytics', 'communication', 'leadership', 'strategy'],
        expectedSections: ['experience', 'education', 'skills'],
        minExperience: 3,
        preferredExperience: 5,
        keyMetrics: ['revenue growth', 'user engagement', 'market share', 'product launches'],
        leadershipWeight: 0.6,
        technicalWeight: 0.4,
      },
      'ui/ux designer': {
        name: 'UI/UX Designer',
        category: 'Design',
        expectedSkills: ['figma', 'sketch', 'adobe', 'user research', 'prototyping', 'wireframing', 'visual design', 'accessibility'],
        expectedSections: ['experience', 'education', 'skills', 'projects'],
        minExperience: 2,
        preferredExperience: 4,
        keyMetrics: ['user satisfaction', 'conversion rate', 'design system adoption', 'accessibility score'],
        leadershipWeight: 0.2,
        technicalWeight: 0.8,
      },
      'marketing manager': {
        name: 'Marketing Manager',
        category: 'Marketing',
        expectedSkills: ['digital marketing', 'seo', 'sem', 'content marketing', 'social media', 'analytics', 'communication', 'strategy'],
        expectedSections: ['experience', 'education', 'skills'],
        minExperience: 3,
        preferredExperience: 5,
        keyMetrics: ['lead generation', 'conversion rate', 'brand awareness', 'roi'],
        leadershipWeight: 0.5,
        technicalWeight: 0.5,
      },
      'data analyst': {
        name: 'Data Analyst',
        category: 'Data',
        expectedSkills: ['sql', 'python', 'excel', 'tableau', 'power bi', 'data analysis', 'statistics', 'visualization'],
        expectedSections: ['experience', 'education', 'skills', 'projects'],
        minExperience: 2,
        preferredExperience: 4,
        keyMetrics: ['reports delivered', 'insights generated', 'decisions supported', 'time saved'],
        leadershipWeight: 0.15,
        technicalWeight: 0.85,
      },
      'ai engineer': {
        name: 'AI Engineer',
        category: 'Engineering',
        expectedSkills: ['python', 'machine learning', 'deep learning', 'tensorflow', 'pytorch', 'nlp', 'computer vision', 'sql', 'docker'],
        expectedSections: ['experience', 'education', 'skills', 'projects'],
        minExperience: 2,
        preferredExperience: 4,
        keyMetrics: ['models deployed', 'accuracy improved', 'latency reduced', 'automation achieved'],
        leadershipWeight: 0.2,
        technicalWeight: 0.8,
      },
      'sales': {
        name: 'Sales Representative',
        category: 'Sales',
        expectedSkills: ['communication', 'negotiation', 'crm', 'salesforce', 'prospecting', 'closing', 'relationship building'],
        expectedSections: ['experience', 'education', 'skills'],
        minExperience: 1,
        preferredExperience: 3,
        keyMetrics: ['revenue generated', 'deals closed', 'client retention', 'quota achievement'],
        leadershipWeight: 0.3,
        technicalWeight: 0.7,
      },
      'finance': {
        name: 'Finance Professional',
        category: 'Finance',
        expectedSkills: ['financial analysis', 'excel', 'accounting', 'budgeting', 'forecasting', 'risk management', 'compliance'],
        expectedSections: ['experience', 'education', 'skills', 'certifications'],
        minExperience: 2,
        preferredExperience: 5,
        keyMetrics: ['cost savings', 'process improvements', 'compliance rate', 'forecast accuracy'],
        leadershipWeight: 0.4,
        technicalWeight: 0.6,
      },
      'hr': {
        name: 'HR Professional',
        category: 'Human Resources',
        expectedSkills: ['recruiting', 'employee relations', 'hrIS', 'benefits', 'compliance', 'communication', 'leadership'],
        expectedSections: ['experience', 'education', 'skills'],
        minExperience: 2,
        preferredExperience: 4,
        keyMetrics: ['time to hire', 'retention rate', 'employee satisfaction', 'cost per hire'],
        leadershipWeight: 0.5,
        technicalWeight: 0.5,
      },
    };

    // Default benchmark for unknown roles
    this.defaultBenchmark = {
      name: 'Professional',
      category: 'General',
      expectedSkills: ['communication', 'teamwork', 'problem solving', 'leadership', 'project management'],
      expectedSections: ['experience', 'education', 'skills'],
      minExperience: 1,
      preferredExperience: 3,
      keyMetrics: ['achievements', 'impact', 'efficiency'],
      leadershipWeight: 0.4,
      technicalWeight: 0.6,
    };
  }

  /**
   * Benchmark resume against industry standards
   * @param {Object} normalizedDoc - Normalized document
   * @param {string} targetRole - Target job role (optional)
   * @returns {Object} Benchmark analysis
   */
  benchmark(normalizedDoc, targetRole = null) {
    if (!normalizedDoc || !normalizedDoc.cleanedText) {
      return this.getEmptyBenchmark();
    }

    const { metadata, sections, statistics } = normalizedDoc;

    // Detect role or use provided target
    const detectedRole = targetRole || this.detectRole(normalizedDoc);
    const benchmark = this.getBenchmarkForRole(detectedRole);

    // Compare against benchmark
    const skillsComparison = this.compareSkills(metadata.skills, benchmark.expectedSkills);
    const sectionsComparison = this.compareSections(sections, benchmark.expectedSections);
    const experienceComparison = this.compareExperience(metadata.experience, benchmark);
    const educationComparison = this.compareEducation(metadata.education, benchmark);
    const achievementComparison = this.compareAchievements(normalizedDoc, benchmark);

    // Calculate overall benchmark score
    const overallScore = this.calculateOverallScore({
      skillsComparison,
      sectionsComparison,
      experienceComparison,
      educationComparison,
      achievementComparison,
    }, benchmark);

    // Identify gaps
    const gaps = this.identifyGaps({
      skillsComparison,
      sectionsComparison,
      experienceComparison,
      educationComparison,
      achievementComparison,
    }, benchmark);

    // Generate recommendations
    const recommendations = this.generateRecommendations({
      skillsComparison,
      sectionsComparison,
      experienceComparison,
      educationComparison,
      achievementComparison,
    }, benchmark, gaps);

    // Determine competitiveness
    const competitiveness = this.assessCompetitiveness(overallScore, gaps, normalizedDoc);

    return {
      overallScore,
      grade: this.getGrade(overallScore),
      role: {
        detected: detectedRole,
        benchmark: benchmark.name,
        category: benchmark.category,
      },
      comparisons: {
        skills: skillsComparison,
        sections: sectionsComparison,
        experience: experienceComparison,
        education: educationComparison,
        achievements: achievementComparison,
      },
      gaps,
      recommendations,
      competitiveness,
      benchmarkedAt: new Date().toISOString(),
    };
  }

  /**
   * Detect role from resume content
   */
  detectRole(normalizedDoc) {
    const { cleanedText, metadata } = normalizedDoc;
    const lowerText = cleanedText.toLowerCase();

    // Score each role based on keyword matches
    const roleScores = {};

    for (const [roleKey, benchmark] of Object.entries(this.roleBenchmarks)) {
      let score = 0;

      // Check for role-specific skills
      for (const skill of benchmark.expectedSkills) {
        if (lowerText.includes(skill.toLowerCase())) {
          score += 1;
        }
      }

      // Normalize score
      const maxPossible = benchmark.expectedSkills.length;
      roleScores[roleKey] = (score / maxPossible) * 100;
    }

    // Find best match
    let bestRole = 'software engineer';
    let bestScore = 0;

    for (const [role, score] of Object.entries(roleScores)) {
      if (score > bestScore) {
        bestScore = score;
        bestRole = role;
      }
    }

    return bestRole;
  }

  /**
   * Get benchmark for specific role
   */
  getBenchmarkForRole(role) {
    const normalizedRole = role.toLowerCase().trim();
    return this.roleBenchmarks[normalizedRole] || this.defaultBenchmark;
  }

/**
    * Compare skills against benchmark
    */
  compareSkills(resumeSkills, expectedSkills) {
    // Extract only the actual skill arrays, exclude numeric metadata properties
    const skillArrays = Object.entries(resumeSkills)
      .filter(([key]) => !['totalSkills', 'categorizedCount', 'uncategorizedCount', 'other'].includes(key))
      .map(([_, skills]) => skills);
    const lowerResumeSkills = skillArrays.flat().map(s => (typeof s === 'string' ? s.toLowerCase() : ''));
    const lowerExpected = expectedSkills.map(s => s.toLowerCase());

    const matched = lowerExpected.filter(skill => lowerResumeSkills.includes(skill));
    const missing = lowerExpected.filter(skill => !lowerResumeSkills.includes(skill));

    const matchScore = Math.round((matched.length / lowerExpected.length) * 100);

    return {
      matchScore,
      grade: this.getGrade(matchScore),
      expected: lowerExpected.length,
      matched: matched.length,
      missing: missing.length,
      matchedSkills: matched,
      missingSkills: missing,
    };
  }

  /**
   * Compare sections against benchmark
   */
  compareSections(resumeSections, expectedSections) {
    const sectionTypes = resumeSections.map(s => s.type);
    const matched = expectedSections.filter(s => sectionTypes.includes(s));
    const missing = expectedSections.filter(s => !sectionTypes.includes(s));

    const matchScore = Math.round((matched.length / expectedSections.length) * 100);

    return {
      matchScore,
      grade: this.getGrade(matchScore),
      expected: expectedSections.length,
      matched: matched.length,
      missing: missing.length,
      presentSections: matched,
      missingSections: missing,
    };
  }

  /**
   * Compare experience against benchmark
   */
  compareExperience(resumeExperience, benchmark) {
    const { estimatedYears, level, hasLeadership } = resumeExperience;

    // Years match
    let yearsScore = 100;
    if (estimatedYears < benchmark.minExperience) {
      yearsScore = Math.round((estimatedYears / benchmark.minExperience) * 100);
    }

    // Level match
    const levelHierarchy = ['intern', 'entry', 'junior', 'mid', 'senior', 'lead', 'principal', 'manager', 'director'];
    const candidateLevelIndex = levelHierarchy.indexOf(level);
    const minLevelIndex = levelHierarchy.indexOf('mid');
    const preferredLevelIndex = levelHierarchy.indexOf('senior');

    let levelScore = 100;
    if (candidateLevelIndex < minLevelIndex) {
      levelScore = 60;
    } else if (candidateLevelIndex < preferredLevelIndex) {
      levelScore = 80;
    }

    // Leadership match
    const leadershipScore = hasLeadership ? 100 : 60;

    // Overall experience score
    const overallScore = Math.round(
      yearsScore * 0.4 + levelScore * 0.35 + leadershipScore * 0.25
    );

    return {
      overallScore,
      grade: this.getGrade(overallScore),
      yearsScore,
      levelScore,
      leadershipScore,
      estimatedYears,
      minRequired: benchmark.minExperience,
      preferred: benchmark.preferredExperience,
      meetsMinimum: estimatedYears >= benchmark.minExperience,
      hasLeadership,
      leadershipExpected: benchmark.leadershipWeight > 0.4,
    };
  }

  /**
   * Compare education against benchmark
   */
  compareEducation(resumeEducation, benchmark) {
    const { highestDegree, highestDegreeLevel, hasDegree } = resumeEducation;

    // Basic education check
    let score = hasDegree ? 80 : 40;

    // Degree level bonus
    if (highestDegreeLevel >= 4) { // Masters or higher
      score = 100;
    } else if (highestDegreeLevel >= 3) { // Bachelors
      score = 90;
    }

    return {
      score,
      grade: this.getGrade(score),
      hasDegree,
      highestDegree,
      highestDegreeLevel,
      meetsRequirements: score >= 70,
    };
  }

  /**
   * Compare achievements against benchmark
   */
  compareAchievements(normalizedDoc, benchmark) {
    const { statistics } = normalizedDoc;

    // Check for quantifiable achievements
    const quantifiableCount = statistics.achievements.quantifiableCount;
    const expectedMin = 5;
    const expectedPreferred = 10;

    let score = 50;
    if (quantifiableCount >= expectedPreferred) {
      score = 100;
    } else if (quantifiableCount >= expectedMin) {
      score = 80;
    } else if (quantifiableCount >= 3) {
      score = 60;
    } else if (quantifiableCount >= 1) {
      score = 40;
    }

    return {
      score,
      grade: this.getGrade(score),
      quantifiableCount,
      expectedMin,
      expectedPreferred,
      meetsMinimum: quantifiableCount >= expectedMin,
      meetsPreferred: quantifiableCount >= expectedPreferred,
    };
  }

  /**
   * Calculate overall benchmark score
   */
  calculateOverallScore(comparisons, benchmark) {
    const weights = {
      skillsComparison: benchmark.technicalWeight * 0.4,
      sectionsComparison: 0.15,
      experienceComparison: benchmark.technicalWeight * 0.25 + benchmark.leadershipWeight * 0.1,
      educationComparison: 0.1,
      achievementComparison: benchmark.technicalWeight * 0.15 + benchmark.leadershipWeight * 0.05,
    };

    let weightedScore = 0;
    let totalWeight = 0;
    for (const [comparison, weight] of Object.entries(weights)) {
      if (comparisons[comparison]) {
        const score = comparisons[comparison].overallScore ?? comparisons[comparison].matchScore ?? comparisons[comparison].score ?? 0;
        weightedScore += score * weight;
        totalWeight += weight;
      }
    }

    return totalWeight > 0 ? Math.round(weightedScore) : 0;
  }

  /**
   * Identify gaps against benchmark
   */
  identifyGaps(comparisons, benchmark) {
    const gaps = [];

    // Skills gaps
    if (comparisons.skillsComparison.matchScore < 70) {
      gaps.push({
        type: 'skills',
        severity: comparisons.skillsComparison.matchScore < 50 ? 'high' : 'medium',
        category: 'Technical Skills',
        missing: comparisons.skillsComparison.missingSkills.slice(0, 5),
        impact: 'Missing key skills for this role',
      });
    }

    // Section gaps
    if (comparisons.sectionsComparison.missing.length > 0) {
      gaps.push({
        type: 'sections',
        severity: 'medium',
        category: 'Resume Sections',
        missing: comparisons.sectionsComparison.missingSections,
        impact: 'Missing recommended sections',
      });
    }

    // Experience gaps
    if (!comparisons.experienceComparison.meetsMinimum) {
      gaps.push({
        type: 'experience',
        severity: 'high',
        category: 'Experience',
        missing: `${comparisons.experienceComparison.estimatedYears} years (minimum: ${comparisons.experienceComparison.minRequired})`,
        impact: 'Below minimum experience requirement',
      });
    }

    // Achievement gaps
    if (!comparisons.achievementComparison.meetsMinimum) {
      const quantCount = comparisons.achievementComparison.quantifiableCount;
      const quantValue = typeof quantCount === 'object' ? quantCount.total || 0 : quantCount;
      gaps.push({
        type: 'achievements',
        severity: 'high',
        category: 'Achievements',
        missing: `Only ${quantValue} quantifiable achievements (minimum: ${comparisons.achievementComparison.expectedMin})`,
        impact: 'Insufficient quantifiable achievements',
      });
    }

    return gaps;
  }

  /**
   * Generate recommendations
   */
  generateRecommendations(comparisons, benchmark, gaps) {
    const recommendations = [];

    for (const gap of gaps) {
      switch (gap.type) {
        case 'skills':
          recommendations.push({
            priority: gap.severity,
            category: 'skills',
            issue: `Missing ${gap.missing.length} key skills for ${benchmark.name}`,
            recommendation: `Add these skills: ${gap.missing.join(', ')}`,
            impact: gap.impact,
          });
          break;

        case 'sections':
          recommendations.push({
            priority: 'medium',
            category: 'structure',
            issue: `Missing sections: ${gap.missing.join(', ')}`,
            recommendation: `Add ${gap.missing.join(' and ')} sections to your resume`,
            impact: gap.impact,
          });
          break;

        case 'experience':
          recommendations.push({
            priority: 'high',
            category: 'experience',
            issue: 'Below minimum experience requirement',
            recommendation: 'Highlight relevant experience and consider emphasizing transferable skills',
            impact: gap.impact,
          });
          break;

        case 'achievements':
          recommendations.push({
            priority: 'critical',
            category: 'achievements',
            issue: 'Insufficient quantifiable achievements',
            recommendation: 'Add metrics and numbers to demonstrate impact (%, $, scale)',
            impact: gap.impact,
          });
          break;
      }
    }

    return recommendations;
  }

  /**
   * Assess competitiveness
   */
  assessCompetitiveness(overallScore, gaps, normalizedDoc) {
    const highSeverityGaps = gaps.filter(g => g.severity === 'high').length;

    let level;
    if (overallScore >= 90 && highSeverityGaps === 0) {
      level = 'exceptional';
    } else if (overallScore >= 80 && highSeverityGaps <= 1) {
      level = 'strong';
    } else if (overallScore >= 70 && highSeverityGaps <= 2) {
      level = 'competitive';
    } else if (overallScore >= 60) {
      level = 'moderate';
    } else if (overallScore >= 50) {
      level = 'below_average';
    } else {
      level = 'weak';
    }

    return {
      level,
      score: overallScore,
      highSeverityGaps,
      totalGaps: gaps.length,
      description: this.getCompetitivenessDescription(level),
    };
  }

  /**
   * Get competitiveness description
   */
  getCompetitivenessDescription(level) {
    const descriptions = {
      exceptional: 'Your resume exceeds industry standards. You are a top-tier candidate.',
      strong: 'Your resume meets and exceeds most industry expectations. Very competitive.',
      competitive: 'Your resume meets industry standards. Some improvements could make it stronger.',
      moderate: 'Your resume partially meets industry standards. Several improvements recommended.',
      below_average: 'Your resume falls below industry standards. Significant improvements needed.',
      weak: 'Your resume does not meet industry standards. Major revisions required.',
    };

    return descriptions[level] || descriptions.moderate;
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
   * Get empty benchmark
   */
  getEmptyBenchmark() {
    return {
      overallScore: 0,
      grade: 'F',
      role: {
        detected: 'unknown',
        benchmark: 'Unknown',
        category: 'General',
      },
      comparisons: {},
      gaps: [],
      recommendations: [],
      competitiveness: {
        level: 'weak',
        score: 0,
        highSeverityGaps: 0,
        totalGaps: 0,
        description: 'Unable to benchmark - insufficient data',
      },
      benchmarkedAt: new Date().toISOString(),
    };
  }
}

module.exports = new BenchmarkEngine();