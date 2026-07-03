/**
 * Technical Score Engine
 * Evaluates technical competency and skill depth
 */

class TechnicalScoreEngine {
  constructor() {
    // Technical skill categories with weights
    this.technicalCategories = {
      programming: {
        weight: 10,
        keywords: [
          'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'ruby', 'go', 'rust',
          'php', 'swift', 'kotlin', 'scala', 'r', 'matlab', 'perl', 'sql', 'nosql',
        ],
      },
      frontend: {
        weight: 9,
        keywords: [
          'react', 'angular', 'vue', 'svelte', 'next.js', 'nuxt', 'html', 'css',
          'sass', 'less', 'tailwind', 'bootstrap', 'redux', 'mobx', 'zustand',
          'webpack', 'vite', 'babel', 'typescript',
        ],
      },
      backend: {
        weight: 9,
        keywords: [
          'node.js', 'express', 'django', 'flask', 'spring', 'spring boot', 'rails',
          'laravel', 'asp.net', 'fastapi', 'nestjs', 'graphql', 'rest', 'soap',
          'microservices', 'api', 'serverless',
        ],
      },
      databases: {
        weight: 8,
        keywords: [
          'sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch',
          'cassandra', 'oracle', 'sql server', 'dynamodb', 'firebase', 'supabase',
          'mariadb', 'sqlite', 'nosql',
        ],
      },
      cloud: {
        weight: 9,
        keywords: [
          'aws', 'azure', 'gcp', 'google cloud', 'cloud', 'docker', 'kubernetes',
          'terraform', 'ansible', 'jenkins', 'ci/cd', 'github actions', 'gitlab ci',
          'devops', 'infrastructure',
        ],
      },
      dataScience: {
        weight: 8,
        keywords: [
          'machine learning', 'deep learning', 'tensorflow', 'pytorch', 'keras',
          'pandas', 'numpy', 'scikit-learn', 'data analysis', 'statistics',
          'tableau', 'power bi', 'spark', 'hadoop', 'airflow', 'dbt',
        ],
      },
      mobile: {
        weight: 7,
        keywords: [
          'react native', 'flutter', 'swift', 'kotlin', 'objective-c',
          'xamarin', 'ionic', 'cordova', 'android', 'ios',
        ],
      },
      tools: {
        weight: 6,
        keywords: [
          'git', 'github', 'gitlab', 'bitbucket', 'jira', 'confluence',
          'figma', 'sketch', 'postman', 'swagger', 'notion', 'slack',
        ],
      },
      methodologies: {
        weight: 7,
        keywords: [
          'agile', 'scrum', 'kanban', 'waterfall', 'devops', 'ci/cd',
          'tdd', 'bdd', 'pair programming', 'code review', 'microservices',
          'monolith', 'serverless',
        ],
      },
      security: {
        weight: 8,
        keywords: [
          'security', 'cybersecurity', 'encryption', 'authentication', 'authorization',
          'oauth', 'jwt', 'ssl', 'tls', 'firewall', 'vulnerability', 'penetration testing',
          'owasp', 'compliance', 'gdpr', 'hipaa',
        ],
      },
    };

    // Technical depth indicators
    this.depthIndicators = {
      expert: [
        'architected', 'designed', 'led', 'spearheaded', 'pioneered',
        'mastered', 'expert', 'advanced', 'senior', 'principal',
      ],
      proficient: [
        'developed', 'implemented', 'built', 'created', 'engineered',
        'experienced', 'proficient', 'skilled', 'strong',
      ],
      familiar: [
        'used', 'worked with', 'familiar', 'basic', 'intermediate',
        'exposed to', 'touched',
      ],
    };
  }

  /**
   * Analyze technical competency
   * @param {string} text - Resume text
   * @returns {Object} Technical score analysis
   */
  analyze(text) {
    if (!text || typeof text !== 'string') {
      return this.getEmptyAnalysis();
    }

    const lowerText = text.toLowerCase();

    // Analyze technical skills
    const skillAnalysis = this.analyzeSkills(lowerText);

    // Analyze technical depth
    const depthAnalysis = this.analyzeDepth(text, lowerText);

    // Analyze technical breadth
    const breadthAnalysis = this.analyzeBreadth(skillAnalysis);

    // Analyze technical relevance
    const relevanceAnalysis = this.analyzeRelevance(skillAnalysis, lowerText);

    // Calculate scores
    const skillScore = this.calculateSkillScore(skillAnalysis);
    const depthScore = this.calculateDepthScore(depthAnalysis);
    const breadthScore = breadthAnalysis.score;
    const relevanceScore = relevanceAnalysis.score;

    const overallScore = Math.round(
      (skillScore * 0.30 + depthScore * 0.25 + breadthScore * 0.25 + relevanceScore * 0.20)
    );

    return {
      overallScore,
      grade: this.getGrade(overallScore),
      skillScore,
      depthScore,
      breadthScore,
      relevanceScore,
      categories: skillAnalysis.categories,
      topSkills: skillAnalysis.topSkills,
      depth: depthAnalysis,
      breadth: breadthAnalysis,
      relevance: relevanceAnalysis,
      strengths: this.identifyStrengths({
        skillScore,
        depthScore,
        breadthScore,
        relevanceScore,
        skillAnalysis,
      }),
      weaknesses: this.identifyWeaknesses({
        skillScore,
        depthScore,
        breadthScore,
        relevanceScore,
        skillAnalysis,
      }),
      recommendations: this.generateRecommendations({
        skillAnalysis,
        depthAnalysis,
        breadthAnalysis,
        relevanceAnalysis,
      }),
      analyzedAt: new Date().toISOString(),
    };
  }

  /**
   * Analyze technical skills
   */
  analyzeSkills(text) {
    const categories = {};
    let totalFound = 0;
    let totalKeywords = 0;

    for (const [categoryName, category] of Object.entries(this.technicalCategories)) {
      const found = [];
      const missing = [];

      for (const keyword of category.keywords) {
        if (text.includes(keyword.toLowerCase())) {
          found.push(keyword);
        } else {
          missing.push(keyword);
        }
      }

      totalFound += found.length;
      totalKeywords += category.keywords.length;

      categories[categoryName] = {
        name: categoryName,
        weight: category.weight,
        found,
        missing,
        foundCount: found.length,
        totalCount: category.keywords.length,
        coverage: Math.round((found.length / category.keywords.length) * 100),
      };
    }

    // Get top skills by frequency
    const topSkills = this.getTopSkills(text);

    return {
      categories,
      totalFound,
      totalKeywords,
      overallCoverage: Math.round((totalFound / totalKeywords) * 100),
      topSkills,
    };
  }

  /**
   * Get top skills by frequency
   */
  getTopSkills(text) {
    const skillFrequency = {};

    for (const category of Object.values(this.technicalCategories)) {
      for (const skill of category.keywords) {
        // Escape special regex characters in the skill name
        const escapedSkill = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`\\b${escapedSkill}\\b`, 'gi');
        const matches = text.match(regex) || [];
        if (matches.length > 0) {
          skillFrequency[skill] = matches.length;
        }
      }
    }

    return Object.entries(skillFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
      .map(([skill, count]) => ({ skill, count }));
  }

  /**
   * Analyze technical depth
   */
  analyzeDepth(text, lowerText) {
    const expertIndicators = this.detectIndicators(lowerText, this.depthIndicators.expert);
    const proficientIndicators = this.detectIndicators(lowerText, this.depthIndicators.proficient);
    const familiarIndicators = this.detectIndicators(lowerText, this.depthIndicators.familiar);

    // Calculate depth score
    let score = 0;
    score += Math.min(40, expertIndicators.count * 10);
    score += Math.min(35, proficientIndicators.count * 7);
    score += Math.min(25, familiarIndicators.count * 3);

    let depth = 'expert';
    if (expertIndicators.count >= 3) depth = 'expert';
    else if (expertIndicators.count >= 1 || proficientIndicators.count >= 3) depth = 'proficient';
    else if (proficientIndicators.count >= 1) depth = 'intermediate';
    else depth = 'beginner';

    return {
      score: Math.min(100, score),
      depth,
      expert: expertIndicators.count,
      proficient: proficientIndicators.count,
      familiar: familiarIndicators.count,
      indicators: {
        expert: expertIndicators.indicators,
        proficient: proficientIndicators.indicators,
        familiar: familiarIndicators.indicators,
      },
    };
  }

  /**
   * Detect indicators
   */
  detectIndicators(text, indicatorList) {
    const found = [];
    for (const indicator of indicatorList) {
      if (text.includes(indicator)) {
        found.push(indicator);
      }
    }
    return {
      indicators: found,
      count: found.length,
    };
  }

  /**
   * Analyze technical breadth
   */
  analyzeBreadth(skillAnalysis) {
    const categoriesWithSkills = Object.values(skillAnalysis.categories).filter(
      cat => cat.foundCount > 0
    ).length;

    const totalCategories = Object.keys(skillAnalysis.categories).length;
    const breadthScore = Math.round((categoriesWithSkills / totalCategories) * 100);

    return {
      score: breadthScore,
      categoriesCovered: categoriesWithSkills,
      totalCategories,
      breadth: categoriesWithSkills >= 7 ? 'extensive' : categoriesWithSkills >= 5 ? 'good' : categoriesWithSkills >= 3 ? 'moderate' : 'limited',
    };
  }

  /**
   * Analyze technical relevance
   */
  analyzeRelevance(skillAnalysis, text) {
    // Check if skills are mentioned in context of achievements
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const skillsInContext = this.checkSkillsInContext(sentences, skillAnalysis.topSkills);

    const relevanceScore = Math.min(100, Math.round(
      (skillAnalysis.overallCoverage * 0.5) + (skillsInContext * 10)
    ));

    return {
      score: relevanceScore,
      skillsInContext,
      isRelevant: skillsInContext >= 3,
    };
  }

  /**
   * Check if skills are used in context
   */
  checkSkillsInContext(sentences, topSkills) {
    let contextCount = 0;

    for (const skill of topSkills.slice(0, 10)) {
      const skillSentences = sentences.filter(s =>
        s.toLowerCase().includes(skill.skill.toLowerCase())
      );

      // Check if skill is mentioned with action verbs or achievements
      const inContext = skillSentences.filter(s => {
        const actionVerbs = ['developed', 'built', 'created', 'implemented', 'designed', 'used', 'worked with'];
        return actionVerbs.some(verb => s.toLowerCase().includes(verb));
      }).length;

      if (inContext > 0) contextCount++;
    }

    return contextCount;
  }

  /**
   * Calculate skill score
   */
  calculateSkillScore(skillAnalysis) {
    return Math.min(100, skillAnalysis.overallCoverage);
  }

  /**
   * Calculate depth score
   */
  calculateDepthScore(depthAnalysis) {
    return depthAnalysis.score;
  }

  /**
   * Identify strengths
   */
  identifyStrengths(data) {
    const strengths = [];

    if (data.skillScore >= 70) strengths.push('Strong technical skill coverage');
    if (data.depthScore >= 70) strengths.push('Demonstrates technical depth');
    if (data.breadthScore >= 60) strengths.push('Broad technical expertise');
    if (data.relevanceScore >= 70) strengths.push('Skills used in relevant contexts');

    if (data.skillAnalysis?.topSkills?.length >= 10) {
      strengths.push('Extensive technical toolkit');
    }

    return strengths.slice(0, 5);
  }

  /**
   * Identify weaknesses
   */
  identifyWeaknesses(data) {
    const weaknesses = [];

    if (data.skillScore < 50) weaknesses.push('Limited technical skills listed');
    if (data.depthScore < 50) weaknesses.push('Lacks demonstration of technical depth');
    if (data.breadthScore < 40) weaknesses.push('Narrow technical expertise');
    if (data.relevanceScore < 50) weaknesses.push('Skills not demonstrated in context');

    return weaknesses.slice(0, 5);
  }

  /**
   * Generate recommendations
   */
  generateRecommendations(data) {
    const recommendations = [];

    if (data.skillAnalysis.overallCoverage < 50) {
      recommendations.push({
        priority: 'high',
        category: 'technical_skills',
        issue: `Low technical skill coverage (${data.skillAnalysis.overallCoverage}%)`,
        recommendation: 'Add more relevant technical skills to your resume',
        reason: 'Technical skills are critical for passing ATS and recruiter screening',
      });
    }

    if (data.depthAnalysis.depth === 'beginner' || data.depthAnalysis.depth === 'intermediate') {
      recommendations.push({
        priority: 'high',
        category: 'technical_depth',
        issue: 'Limited demonstration of technical depth',
        recommendation: 'Showcase deeper technical expertise through project details and achievements',
        reason: 'Technical depth differentiates you from other candidates',
      });
    }

    if (data.breadthAnalysis.breadth === 'limited' || data.breadthAnalysis.breadth === 'moderate') {
      recommendations.push({
        priority: 'medium',
        category: 'technical_breadth',
        issue: 'Narrow technical skill set',
        recommendation: 'Expand your technical toolkit with complementary skills',
        reason: 'Broader technical skills increase versatility and marketability',
      });
    }

    // Find weak categories
    const weakCategories = Object.values(data.skillAnalysis.categories)
      .filter(cat => cat.coverage < 30 && cat.weight >= 8)
      .slice(0, 3);

    for (const category of weakCategories) {
      recommendations.push({
        priority: 'medium',
        category: category.name,
        issue: `Low ${category.name} coverage (${category.coverage}%)`,
        recommendation: `Add more ${category.name.toLowerCase()} skills`,
        reason: `${category.name} are important for your target role`,
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
      skillScore: 0,
      depthScore: 0,
      breadthScore: 0,
      relevanceScore: 0,
      categories: {},
      topSkills: [],
      depth: {
        score: 0,
        depth: 'unknown',
        expert: 0,
        proficient: 0,
        familiar: 0,
      },
      breadth: {
        score: 0,
        categoriesCovered: 0,
        totalCategories: 0,
        breadth: 'unknown',
      },
      relevance: {
        score: 0,
        skillsInContext: 0,
        isRelevant: false,
      },
      strengths: [],
      weaknesses: [],
      recommendations: [],
      analyzedAt: new Date().toISOString(),
    };
  }
}

module.exports = new TechnicalScoreEngine();