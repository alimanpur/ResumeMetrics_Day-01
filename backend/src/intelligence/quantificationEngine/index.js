/**
 * Quantification Analysis Engine
 * Analyzes the use of metrics, numbers, and quantifiable achievements
 */

class QuantificationEngine {
  constructor() {
    // Patterns for detecting quantifiable achievements
    this.quantificationPatterns = {
      percentages: [
        /\d+%/g,
        /\d+\.\d+%/g,
        /percent\s+increase/i,
        /percent\s+decrease/i,
        /percent\s+improvement/i,
        /growth\s+of\s+\d+/i,
        /reduction\s+of\s+\d+/i,
      ],
      monetary: [
        /\$\d+[KMB]?/gi,
        /\$\d+\.\d+[KMB]?/gi,
        /\$\d+-\d+[KMB]?/gi,
        /budget\s+of\s+\$/i,
        /revenue\s+of\s+\$/i,
        /savings\s+of\s+\$/i,
        /cost\s+reduction\s+of\s+\$/i,
      ],
      numbers: [
        /\d+[KMB]?\+?\s+(users|customers|clients|employees|team\s+members|projects|products|transactions|requests|orders|sales|accounts|patients|students|attendees|downloads|installs|views|impressions|followers|subscribers|leads|deals|contracts|proposals|interviews|offers|acceptances|promotions|awards|certifications|publications|patents|speeches|presentations|workshops|sessions|meetings|calls|emails|messages|tickets|issues|bugs|features|releases|deployments|updates|tests|reviews|iterations|sprints|milestones|goals|objectives|targets|initiatives|programs|campaigns|events|activities|tasks|responsibilities|duties|roles|positions|jobs|companies|organizations|departments|teams|groups|divisions|units|locations|offices|regions|markets|countries|states|cities|areas|territories|zones|sectors|industries|verticals|segments|niches|domains|fields|areas|disciplines|specialties|expertise|skills|abilities|competencies|qualifications|credentials|experience|knowledge|understanding|proficiency|mastery|expertise)/gi,
        /\d+x\s+(faster|slower|better|worse|more|less|higher|lower|increase|decrease|improvement|reduction|growth|expansion|scale|size)/gi,
        /top\s+\d+%/i,
        /#\d+/i,
        /ranked\s+#?\d+/i,
        /rated\s+\d+/i,
        /scored\s+\d+/i,
      ],
      time: [
        /\d+\s+(days?|weeks?|months?|years?)\s+(faster|sooner|earlier|ahead)/i,
        /reduced\s+by\s+\d+%/i,
        /increased\s+by\s+\d+%/i,
        /improved\s+by\s+\d+%/i,
        /cut\s+by\s+\d+%/i,
        /saved\s+\d+/i,
        /delivered\s+\d+\s+(days?|weeks?|months?)\s+(early|ahead|faster)/i,
      ],
      scale: [
        /team\s+of\s+\d+/i,
        /company\s+of\s+\d+/i,
        /organization\s+of\s+\d+/i,
        /budget\s+of\s+\$\d+/i,
        /managed\s+\$\d+/i,
        /oversaw\s+\d+/i,
        /directed\s+\d+/i,
        /led\s+a\s+team\s+of\s+\d+/i,
      ],
    };

    // Achievement strength indicators
    this.strengthIndicators = {
      exceptional: [
        /\d+%[^.]{0,50}(increase|improvement|growth|reduction|savings|revenue)/i,
        /\$\d+[KMB]?[^.]{0,50}(revenue|sales|profit|savings|budget)/i,
        /from\s+\d+[^.]{0,30}to\s+\d+/i,
        /\d+x[^.]{0,30}(faster|improvement|increase|growth)/i,
        /top\s+\d+%/i,
        /#\d+[^.]{0,30}(rank|position|performer)/i,
      ],
      strong: [
        /\d+%/i,
        /\$\d+/i,
        /\d+[KMB]?\+?/i,
        /\d+x/i,
        /team\s+of\s+\d+/i,
      ],
      weak: [
        /various/i,
        /several/i,
        /many/i,
        /some/i,
        /multiple/i,
        /numerous/i,
      ],
    };
  }

  /**
   * Analyze quantification in resume
   * @param {string} text - Resume text
   * @returns {Object} Quantification analysis results
   */
  analyze(text) {
    if (!text || typeof text !== 'string') {
      return this.getEmptyAnalysis();
    }

    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);

    // Detect all quantifications
    const percentages = this.detectQuantifications(text, this.quantificationPatterns.percentages);
    const monetary = this.detectQuantifications(text, this.quantificationPatterns.monetary);
    const numbers = this.detectQuantifications(text, this.quantificationPatterns.numbers);
    const time = this.detectQuantifications(text, this.quantificationPatterns.time);
    const scale = this.detectQuantifications(text, this.quantificationPatterns.scale);

    // Calculate metrics
    const totalMetrics = percentages.count + monetary.count + numbers.count + time.count + scale.count;
    const metricsPerSentence = sentences.length > 0 ? totalMetrics / sentences.length : 0;

    // Classify achievements
    const achievementAnalysis = this.analyzeAchievements(sentences);

    // Calculate scores
    const densityScore = this.calculateDensityScore(totalMetrics, sentences.length);
    const varietyScore = this.calculateVarietyScore({
      percentages,
      monetary,
      numbers,
      time,
      scale,
    });
    const strengthScore = this.calculateStrengthScore(achievementAnalysis);
    const impactScore = this.calculateImpactScore(achievementAnalysis);

    const overallScore = Math.round(
      (densityScore * 0.25 + varietyScore * 0.25 + strengthScore * 0.25 + impactScore * 0.25)
    );

    return {
      overallScore,
      grade: this.getGrade(overallScore),
      metrics: {
        totalMetrics,
        metricsPerSentence: Math.round(metricsPerSentence * 100) / 100,
        percentages: percentages.count,
        monetary: monetary.count,
        numbers: numbers.count,
        time: time.count,
        scale: scale.count,
      },
      breakdown: {
        percentages: this.summarizeQuantification(percentages),
        monetary: this.summarizeQuantification(monetary),
        numbers: this.summarizeQuantification(numbers),
        time: this.summarizeQuantification(time),
        scale: this.summarizeQuantification(scale),
      },
      achievements: achievementAnalysis,
      strengths: this.identifyStrengths({
        densityScore,
        varietyScore,
        strengthScore,
        impactScore,
        totalMetrics,
      }),
      weaknesses: this.identifyWeaknesses({
        densityScore,
        varietyScore,
        strengthScore,
        impactScore,
        totalMetrics,
        metricsPerSentence,
      }),
      recommendations: this.generateRecommendations({
        totalMetrics,
        metricsPerSentence,
        achievementAnalysis,
        densityScore,
        varietyScore,
      }),
      analyzedAt: new Date().toISOString(),
    };
  }

  /**
   * Detect quantifications using patterns
   */
  detectQuantifications(text, patterns) {
    const matches = [];
    for (const pattern of patterns) {
      const found = text.match(pattern) || [];
      matches.push(...found);
    }

    return {
      matches: [...new Set(matches)],
      count: [...new Set(matches)].length,
    };
  }

  /**
   * Summarize quantification results
   */
  summarizeQuantification(quantification) {
    return {
      count: quantification.count,
      examples: quantification.matches.slice(0, 5),
    };
  }

  /**
   * Analyze achievements for strength
   */
  analyzeAchievements(sentences) {
    const strong = [];
    const moderate = [];
    const weak = [];

    for (const sentence of sentences) {
      const lowerSentence = sentence.toLowerCase().trim();
      if (lowerSentence.length < 10) continue;

      // Check for exceptional patterns
      const exceptionalMatches = this.strengthIndicators.exceptional
        .filter(p => p.test(sentence))
        .length;

      // Check for strong patterns
      const strongMatches = this.strengthIndicators.strong
        .filter(p => p.test(sentence))
        .length;

      // Check for weak patterns
      const weakMatches = this.strengthIndicators.weak
        .filter(p => p.test(sentence))
        .length;

      if (exceptionalMatches > 0) {
        strong.push({ text: sentence, score: exceptionalMatches });
      } else if (strongMatches > 0) {
        moderate.push({ text: sentence, score: strongMatches });
      } else if (weakMatches > 0 || sentence.length < 20) {
        weak.push({ text: sentence });
      }
    }

    return {
      strong: strong.length,
      moderate: moderate.length,
      weak: weak.length,
      total: strong.length + moderate.length + weak.length,
      strongPercentage: (strong.length + moderate.length) / Math.max(sentences.length, 1) * 100,
      examples: {
        strong: strong.slice(0, 3).map(s => s.text),
        moderate: moderate.slice(0, 3).map(s => s.text),
        weak: weak.slice(0, 3).map(s => s.text),
      },
    };
  }

  /**
   * Calculate density score
   */
  calculateDensityScore(totalMetrics, sentenceCount) {
    if (sentenceCount === 0) return 0;

    const density = totalMetrics / sentenceCount;

    if (density >= 1.5) return 95;
    if (density >= 1.0) return 85;
    if (density >= 0.7) return 75;
    if (density >= 0.5) return 65;
    if (density >= 0.3) return 55;
    if (density >= 0.1) return 45;
    return totalMetrics > 0 ? 35 : 0;
  }

  /**
   * Calculate variety score
   */
  calculateVarietyScore(breakdown) {
    const categoriesUsed = Object.entries(breakdown).filter(([_, data]) => data.count > 0).length;
    const totalCategories = Object.keys(breakdown).length;

    return Math.round((categoriesUsed / totalCategories) * 100);
  }

  /**
   * Calculate strength score
   */
  calculateStrengthScore(achievementAnalysis) {
    if (achievementAnalysis.total === 0) return 0;

    const strongPercentage = (achievementAnalysis.strong / achievementAnalysis.total) * 100;

    if (strongPercentage >= 50) return 95;
    if (strongPercentage >= 35) return 85;
    if (strongPercentage >= 25) return 75;
    if (strongPercentage >= 15) return 65;
    if (strongPercentage >= 10) return 55;
    return 45;
  }

  /**
   * Calculate impact score
   */
  calculateImpactScore(achievementAnalysis) {
    if (achievementAnalysis.total === 0) return 0;

    const quantifiedPercentage = ((achievementAnalysis.strong + achievementAnalysis.moderate) / achievementAnalysis.total) * 100;

    if (quantifiedPercentage >= 70) return 95;
    if (quantifiedPercentage >= 55) return 85;
    if (quantifiedPercentage >= 40) return 75;
    if (quantifiedPercentage >= 30) return 65;
    if (quantifiedPercentage >= 20) return 55;
    return 45;
  }

  /**
   * Identify strengths
   */
  identifyStrengths(data) {
    const strengths = [];

    if (data.totalMetrics >= 8) strengths.push('Excellent use of quantifiable metrics');
    else if (data.totalMetrics >= 5) strengths.push('Good use of quantifiable metrics');
    if (data.varietyScore >= 60) strengths.push('Varied metric types (percentages, dollar amounts, etc.)');
    if (data.strengthScore >= 75) strengths.push('Strong, impactful achievements');
    if (data.impactScore >= 75) strengths.push('Clear demonstration of impact');

    return strengths.slice(0, 5);
  }

  /**
   * Identify weaknesses
   */
  identifyWeaknesses(data) {
    const weaknesses = [];

    if (data.totalMetrics < 3) weaknesses.push('Very few quantifiable achievements');
    else if (data.totalMetrics < 5) weaknesses.push('Limited quantifiable achievements');
    if (data.metricsPerSentence < 0.3) weaknesses.push('Low metric density - achievements lack numbers');
    if (data.varietyScore < 40) weaknesses.push('Limited variety in metric types');
    if (data.strengthScore < 60) weaknesses.push('Achievements lack strong impact');

    return weaknesses.slice(0, 5);
  }

  /**
   * Generate recommendations
   */
  generateRecommendations(data) {
    const recommendations = [];

    if (data.totalMetrics < 3) {
      recommendations.push({
        priority: 'critical',
        category: 'quantification',
        issue: `Only ${data.totalMetrics} quantifiable metrics found (recommended: 5+)`,
        recommendation: 'Add metrics to your achievements: percentages, dollar amounts, numbers, timeframes',
        reason: 'Quantified achievements demonstrate concrete impact and are 40% more memorable',
      });
    } else if (data.totalMetrics < 5) {
      recommendations.push({
        priority: 'high',
        category: 'quantification',
        issue: `Only ${data.totalMetrics} quantifiable metrics found (recommended: 8+)`,
        recommendation: 'Add more metrics to strengthen your achievements',
        reason: 'More metrics provide stronger evidence of your impact',
      });
    }

    if (data.metricsPerSentence < 0.5) {
      recommendations.push({
        priority: 'high',
        category: 'density',
        issue: 'Low metric density in achievements',
        recommendation: 'Add at least one metric to each major achievement',
        reason: 'Every achievement should demonstrate measurable impact',
      });
    }

    if (data.varietyScore < 50) {
      recommendations.push({
        priority: 'medium',
        category: 'variety',
        issue: 'Limited variety in metric types',
        recommendation: 'Use different types of metrics: percentages, dollar amounts, team sizes, timeframes',
        reason: 'Varied metrics demonstrate well-rounded impact',
      });
    }

    if (data.densityScore < 60) {
      recommendations.push({
        priority: 'high',
        category: 'density',
        issue: 'Insufficient quantification of achievements',
        recommendation: 'Convert more achievements to metric-driven statements',
        reason: 'Quantified achievements are significantly more impactful',
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
        totalMetrics: 0,
        metricsPerSentence: 0,
        percentages: 0,
        monetary: 0,
        numbers: 0,
        time: 0,
        scale: 0,
      },
      breakdown: {},
      achievements: {
        strong: 0,
        moderate: 0,
        weak: 0,
        total: 0,
        strongPercentage: 0,
        examples: {},
      },
      strengths: [],
      weaknesses: [],
      recommendations: [],
      analyzedAt: new Date().toISOString(),
    };
  }
}

module.exports = new QuantificationEngine();