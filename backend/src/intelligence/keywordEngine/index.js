/**
 * Keyword Intelligence Engine
 * Extracts, categorizes, and analyzes keywords from resumes
 * Compares against job descriptions for matching
 */

class KeywordEngine {
  constructor() {
    // Technical skills taxonomy
    this.skillTaxonomy = {
      programmingLanguages: {
        name: 'Programming Languages',
        keywords: [
          'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'ruby', 'go', 'rust',
          'php', 'swift', 'kotlin', 'scala', 'r', 'matlab', 'perl', 'haskell', 'clojure',
          'elixir', 'dart', 'objective-c', 'assembly', 'cobol', 'fortran',
        ],
        weight: 10,
      },
      frontend: {
        name: 'Frontend Technologies',
        keywords: [
          'react', 'angular', 'vue', 'svelte', 'next.js', 'nuxt', 'gatsby', 'remix',
          'html', 'css', 'sass', 'less', 'tailwind', 'bootstrap', 'material-ui',
          'jquery', 'webpack', 'vite', 'babel', 'redux', 'mobx', 'zustand',
          'react query', 'swr', 'axios', 'fetch',
        ],
        weight: 9,
      },
      backend: {
        name: 'Backend Technologies',
        keywords: [
          'node.js', 'express', 'django', 'flask', 'spring', 'spring boot', 'rails',
          'laravel', 'asp.net', 'fastapi', 'nestjs', 'graphql', 'rest', 'soap',
          'fastify', 'koa', 'hapi', 'phoenix', 'actix',
        ],
        weight: 9,
      },
      databases: {
        name: 'Databases',
        keywords: [
          'sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch',
          'cassandra', 'oracle', 'sql server', 'dynamodb', 'firebase', 'supabase',
          'planetscale', 'cockroachdb', 'mariadb', 'sqlite',
        ],
        weight: 8,
      },
      cloud: {
        name: 'Cloud & DevOps',
        keywords: [
          'aws', 'azure', 'gcp', 'google cloud', 'cloud', 'docker', 'kubernetes',
          'terraform', 'ansible', 'jenkins', 'ci/cd', 'github actions', 'gitlab ci',
          'circleci', 'travis ci', 'argo cd', 'helm',
        ],
        weight: 9,
      },
      dataScience: {
        name: 'Data Science & ML',
        keywords: [
          'machine learning', 'deep learning', 'tensorflow', 'pytorch', 'keras',
          'pandas', 'numpy', 'scikit-learn', 'data analysis', 'statistics',
          'tableau', 'power bi', 'spark', 'hadoop', 'airflow', 'dbt',
          'jupyter', 'matplotlib', 'seaborn',
        ],
        weight: 8,
      },
      mobile: {
        name: 'Mobile Development',
        keywords: [
          'react native', 'flutter', 'swift', 'kotlin', 'objective-c',
          'xamarin', 'ionic', 'cordova', 'android', 'ios',
        ],
        weight: 7,
      },
      tools: {
        name: 'Development Tools',
        keywords: [
          'git', 'github', 'gitlab', 'bitbucket', 'jira', 'confluence',
          'figma', 'sketch', 'adobe', 'photoshop', 'illustrator',
          'postman', 'swagger', 'notion', 'slack', 'trello', 'asana',
        ],
        weight: 6,
      },
      methodologies: {
        name: 'Methodologies',
        keywords: [
          'agile', 'scrum', 'kanban', 'waterfall', 'devops', 'ci/cd',
          'tdd', 'bdd', 'pair programming', 'code review', 'microservices',
          'monolith', 'serverless', 'rest api', 'graphql',
        ],
        weight: 7,
      },
      softSkills: {
        name: 'Soft Skills',
        keywords: [
          'leadership', 'communication', 'teamwork', 'problem solving',
          'critical thinking', 'time management', 'adaptability', 'creativity',
          'collaboration', 'mentoring', 'coaching', 'negotiation', 'presentation',
          'stakeholder management', 'conflict resolution',
        ],
        weight: 5,
      },
    };

    // Action verbs for achievement analysis
    this.actionVerbs = [
      'achieved', 'improved', 'trained', 'managed', 'created', 'resolved',
      'developed', 'launched', 'led', 'increased', 'decreased', 'optimized',
      'designed', 'implemented', 'delivered', 'executed', 'coordinated',
      'analyzed', 'built', 'established', 'streamlined', 'spearheaded',
      'orchestrated', 'pioneered', 'transformed', 'accelerated', 'drove',
      'mentored', 'negotiated', 'presented', 'authored', 'engineered',
    ];
  }

  /**
   * Extract all keywords from resume text
   * @param {string} text - Resume text
   * @returns {Object} Extracted keywords by category
   */
  extractKeywords(text) {
    if (!text || typeof text !== 'string') {
      return this.getEmptyKeywords();
    }

    const lowerText = text.toLowerCase();
    const extracted = {};

    // Extract from each category
    for (const [categoryKey, category] of Object.entries(this.skillTaxonomy)) {
      const found = [];
      const missing = [];

      for (const keyword of category.keywords) {
        if (lowerText.includes(keyword.toLowerCase())) {
          found.push(keyword);
        } else {
          missing.push(keyword);
        }
      }

      extracted[categoryKey] = {
        name: category.name,
        weight: category.weight,
        found,
        missing,
        foundCount: found.length,
        totalCount: category.keywords.length,
        coverage: Math.round((found.length / category.keywords.length) * 100),
      };
    }

    // Calculate totals
    const totalFound = Object.values(extracted).reduce((sum, cat) => sum + cat.foundCount, 0);
    const totalKeywords = Object.values(extracted).reduce((sum, cat) => sum + cat.totalCount, 0);

    return {
      categories: extracted,
      summary: {
        totalFound,
        totalKeywords,
        overallCoverage: Math.round((totalFound / totalKeywords) * 100),
        categoriesFound: Object.values(extracted).filter(c => c.foundCount > 0).length,
        totalCategories: Object.keys(extracted).length,
      },
    };
  }

  /**
   * Compare resume keywords with job description
   * @param {Object} resumeKeywords - Extracted resume keywords
   * @param {string} jobDescription - Job description text
   * @returns {Object} Keyword comparison results
   */
  compareWithJobDescription(resumeKeywords, jobDescription) {
    if (!resumeKeywords || !jobDescription) {
      return this.getEmptyComparison();
    }

    const lowerJobDesc = jobDescription.toLowerCase();

    // Extract job keywords
    const jobKeywords = this.extractKeywords(jobDescription);

    // Compare each category
    const comparison = {};
    let totalMatchScore = 0;
    let totalWeight = 0;

    for (const [categoryKey, resumeCategory] of Object.entries(resumeKeywords.categories)) {
      const jobCategory = jobKeywords.categories[categoryKey];

      if (!jobCategory) continue;

      // Find matches and gaps
      const matched = resumeCategory.found.filter(kw =>
        jobCategory.found.includes(kw)
      );

      const missingFromResume = jobCategory.found.filter(kw =>
        !resumeCategory.found.includes(kw)
      );

      const extraInResume = resumeCategory.found.filter(kw =>
        !jobCategory.found.includes(kw)
      );

      // Calculate match score for this category
      const categoryMatchScore = jobCategory.found.length > 0
        ? (matched.length / jobCategory.found.length) * 100
        : 100;

      // Weight the score
      const weightedScore = categoryMatchScore * resumeCategory.weight;
      totalMatchScore += weightedScore;
      totalWeight += resumeCategory.weight;

      comparison[categoryKey] = {
        name: resumeCategory.name,
        weight: resumeCategory.weight,
        jobRequires: jobCategory.found.length,
        resumeHas: resumeCategory.found.length,
        matched: matched,
        missing: missingFromResume,
        extra: extraInResume,
        matchScore: Math.round(categoryMatchScore),
        importance: this.calculateImportance(jobCategory.found.length, resumeCategory.weight),
      };
    }

    // Calculate overall match
    const overallMatch = totalWeight > 0 ? Math.round(totalMatchScore / totalWeight) : 0;

    // Identify critical gaps
    const criticalGaps = Object.entries(comparison)
      .filter(([_, cat]) => cat.matchScore < 50 && cat.importance === 'high')
      .map(([key, cat]) => ({
        category: key,
        name: cat.name,
        missing: cat.missing,
        matchScore: cat.matchScore,
      }));

    // Generate priority list
    const priorityMissing = this.generatePriorityList(comparison);

    return {
      overallMatch,
      comparison,
      criticalGaps,
      priorityMissing,
      summary: {
        totalCategoriesCompared: Object.keys(comparison).length,
        strongMatches: Object.values(comparison).filter(c => c.matchScore >= 80).length,
        weakMatches: Object.values(comparison).filter(c => c.matchScore < 50).length,
        totalMissingKeywords: Object.values(comparison).reduce((sum, c) => sum + c.missing.length, 0),
      },
    };
  }

  /**
   * Calculate importance level
   */
  calculateImportance(keywordCount, weight) {
    if (keywordCount >= 5 && weight >= 8) return 'high';
    if (keywordCount >= 3 && weight >= 6) return 'medium';
    return 'low';
  }

  /**
   * Generate priority list of missing keywords
   */
  generatePriorityList(comparison) {
    const priorities = [];

    for (const [categoryKey, category] of Object.entries(comparison)) {
      for (const keyword of category.missing) {
        priorities.push({
          keyword,
          category: category.name,
          importance: category.importance,
          matchScore: category.matchScore,
          reason: this.getKeywordImportanceReason(keyword, category),
        });
      }
    }

    // Sort by importance
    const importanceOrder = { high: 0, medium: 1, low: 2 };
    priorities.sort((a, b) => {
      const importanceDiff = importanceOrder[a.importance] - importanceOrder[b.importance];
      if (importanceDiff !== 0) return importanceDiff;
      return b.matchScore - a.matchScore;
    });

    return priorities.slice(0, 20); // Top 20
  }

  /**
   * Get reason why keyword is important
   */
  getKeywordImportanceReason(keyword, category) {
    const reasons = {
      high: `Critical skill required for ${category.name}. This keyword appears frequently in job descriptions.`,
      medium: `Important skill in ${category.name}. Adding this will improve your match score.`,
      low: `Nice-to-have skill in ${category.name}. Consider adding if you have experience with it.`,
    };
    return reasons[category.importance] || reasons.low;
  }

  /**
   * Analyze keyword density and distribution
   * @param {string} text - Resume text
   * @returns {Object} Keyword density analysis
   */
  analyzeDensity(text) {
    if (!text || typeof text !== 'string') {
      return this.getEmptyDensity();
    }

    const words = text.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    const wordFreq = {};

    // Count word frequencies
    for (const word of words) {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    }

    // Sort by frequency
    const sorted = Object.entries(wordFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 30);

    // Calculate density
    const totalWords = words.length;
    const topKeywords = sorted.map(([word, count]) => ({
      word,
      count,
      density: Math.round((count / totalWords) * 100),
    }));

    return {
      totalWords,
      uniqueWords: Object.keys(wordFreq).length,
      topKeywords,
      averageFrequency: Math.round(totalWords / Object.keys(wordFreq).length),
      keywordRichness: Math.round((Object.keys(wordFreq).length / totalWords) * 100),
    };
  }

  /**
   * Get missing skills for a specific job
   * @param {Object} resumeKeywords - Resume keywords
   * @param {string} jobDescription - Job description
   * @param {number} limit - Max results to return
   * @returns {Array} Missing skills with priority
   */
  getMissingSkills(resumeKeywords, jobDescription, limit = 10) {
    const comparison = this.compareWithJobDescription(resumeKeywords, jobDescription);
    return comparison.priorityMissing.slice(0, limit);
  }

  /**
   * Calculate weighted importance score
   * @param {Object} resumeKeywords - Resume keywords
   * @returns {number} Weighted score
   */
  calculateWeightedScore(resumeKeywords) {
    if (!resumeKeywords || !resumeKeywords.categories) return 0;

    let totalScore = 0;
    let totalWeight = 0;

    for (const category of Object.values(resumeKeywords.categories)) {
      totalScore += category.coverage * category.weight;
      totalWeight += category.weight * 100;
    }

    return totalWeight > 0 ? Math.round((totalScore / totalWeight) * 100) : 0;
  }

  /**
   * Get empty keywords object
   */
  getEmptyKeywords() {
    const emptyCategories = {};
    for (const [key, category] of Object.entries(this.skillTaxonomy)) {
      emptyCategories[key] = {
        name: category.name,
        weight: category.weight,
        found: [],
        missing: category.keywords,
        foundCount: 0,
        totalCount: category.keywords.length,
        coverage: 0,
      };
    }

    return {
      categories: emptyCategories,
      summary: {
        totalFound: 0,
        totalKeywords: 0,
        overallCoverage: 0,
        categoriesFound: 0,
        totalCategories: Object.keys(this.skillTaxonomy).length,
      },
    };
  }

  /**
   * Get empty comparison object
   */
  getEmptyComparison() {
    return {
      overallMatch: 0,
      comparison: {},
      criticalGaps: [],
      priorityMissing: [],
      summary: {
        totalCategoriesCompared: 0,
        strongMatches: 0,
        weakMatches: 0,
        totalMissingKeywords: 0,
      },
    };
  }

  /**
   * Get empty density object
   */
  getEmptyDensity() {
    return {
      totalWords: 0,
      uniqueWords: 0,
      topKeywords: [],
      averageFrequency: 0,
      keywordRichness: 0,
    };
  }

  /**
   * Get skill recommendations
   * @param {Object} resumeKeywords - Resume keywords
   * @param {string} targetRole - Target job role
   * @returns {Array} Recommended skills to add
   */
  getSkillRecommendations(resumeKeywords, targetRole) {
    const recommendations = [];
    const roleSkills = this.getRoleSpecificSkills(targetRole);

    for (const skill of roleSkills) {
      const found = this.skillExistsInResume(skill, resumeKeywords);
      if (!found) {
        recommendations.push({
          skill,
          reason: `Important for ${targetRole} roles`,
          priority: 'high',
          learningResources: this.getLearningResources(skill),
        });
      }
    }

    return recommendations.slice(0, 10);
  }

  /**
   * Get role-specific skills
   */
  getRoleSpecificSkills(role) {
    const roleSkills = {
      'software engineer': ['git', 'agile', 'rest api', 'sql', 'testing', 'ci/cd'],
      'frontend developer': ['react', 'typescript', 'css', 'html', 'webpack', 'testing'],
      'backend developer': ['node.js', 'sql', 'rest api', 'docker', 'microservices', 'testing'],
      'full stack developer': ['react', 'node.js', 'sql', 'docker', 'git', 'agile'],
      'data scientist': ['python', 'machine learning', 'sql', 'statistics', 'pandas', 'tensorflow'],
      'devops engineer': ['docker', 'kubernetes', 'aws', 'terraform', 'ci/cd', 'linux'],
      'product manager': ['agile', 'scrum', 'jira', 'analytics', 'user research', 'roadmapping'],
      'ui/ux designer': ['figma', 'sketch', 'user research', 'prototyping', 'wireframing', 'adobe'],
    };

    const lowerRole = role.toLowerCase();
    for (const [key, skills] of Object.entries(roleSkills)) {
      if (lowerRole.includes(key)) {
        return skills;
      }
    }

    return ['git', 'agile', 'communication', 'problem solving'];
  }

  /**
   * Check if skill exists in resume
   */
  skillExistsInResume(skill, resumeKeywords) {
    if (!resumeKeywords || !resumeKeywords.categories) return false;

    for (const category of Object.values(resumeKeywords.categories)) {
      if (category.found.some(kw => kw.toLowerCase().includes(skill.toLowerCase()))) {
        return true;
      }
    }

    return false;
  }

  /**
   * Get learning resources for a skill
   */
  getLearningResources(skill) {
    const resources = {
      'react': 'https://react.dev/learn',
      'python': 'https://docs.python.org/3/tutorial/',
      'docker': 'https://docs.docker.com/get-started/',
      'kubernetes': 'https://kubernetes.io/docs/tutorials/',
      'aws': 'https://aws.amazon.com/training/',
      'git': 'https://git-scm.com/doc',
    };

    return resources[skill.toLowerCase()] || 'https://www.coursera.org/search?query=' + skill;
  }
}

module.exports = new KeywordEngine();