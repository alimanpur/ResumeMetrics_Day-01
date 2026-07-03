/**
 * Metadata Extractor - Extracts comprehensive metadata from resumes
 * Identifies skills, experience level, education, and other key attributes
 */

class MetadataExtractor {
  constructor() {
    // Education levels in hierarchy
    this.educationLevels = {
      'phd': 5,
      'doctorate': 5,
      'doctor of philosophy': 5,
      'masters': 4,
      'master': 4,
      'mba': 4,
      'master of science': 4,
      'master of arts': 4,
      'bachelors': 3,
      'bachelor': 3,
      'bs': 3,
      'ba': 3,
      'btech': 3,
      'b.tech': 3,
      'associates': 2,
      'associate': 2,
      'high school': 1,
      'diploma': 1,
    };

    // Experience level indicators
    this.experienceLevels = {
      'senior': { level: 'senior', years: 5 },
      'lead': { level: 'lead', years: 4 },
      'principal': { level: 'principal', years: 8 },
      'staff': { level: 'staff', years: 6 },
      'manager': { level: 'manager', years: 4 },
      'director': { level: 'director', years: 7 },
      'vp': { level: 'executive', years: 10 },
      'vice president': { level: 'executive', years: 10 },
      'cto': { level: 'executive', years: 12 },
      'ceo': { level: 'executive', years: 15 },
      'junior': { level: 'junior', years: 1 },
      'entry': { level: 'entry', years: 0 },
      'intern': { level: 'intern', years: 0 },
    };

    // Common skill categories
    this.skillCategories = {
      programming: [
        'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'ruby', 'go', 'rust',
        'php', 'swift', 'kotlin', 'scala', 'r', 'matlab', 'perl', 'haskell',
      ],
      frontend: [
        'react', 'angular', 'vue', 'svelte', 'next.js', 'nuxt', 'gatsby',
        'html', 'css', 'sass', 'less', 'tailwind', 'bootstrap', 'material-ui',
        'jquery', 'webpack', 'vite', 'babel',
      ],
      backend: [
        'node.js', 'express', 'django', 'flask', 'spring', 'rails', 'laravel',
        'asp.net', 'fastapi', 'nestjs', 'graphql', 'rest', 'soap',
      ],
      database: [
        'sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch',
        'cassandra', 'oracle', 'sql server', 'dynamodb', 'firebase',
      ],
      cloud: [
        'aws', 'azure', 'gcp', 'google cloud', 'cloud', 'docker', 'kubernetes',
        'terraform', 'ansible', 'jenkins', 'ci/cd',
      ],
      data: [
        'machine learning', 'deep learning', 'tensorflow', 'pytorch', 'keras',
        'pandas', 'numpy', 'scikit-learn', 'data analysis', 'statistics',
        'tableau', 'power bi', 'spark', 'hadoop',
      ],
      devops: [
        'linux', 'unix', 'bash', 'shell', 'git', 'github', 'gitlab',
        'monitoring', 'logging', 'security', 'networking',
      ],
      soft: [
        'leadership', 'communication', 'teamwork', 'problem solving',
        'critical thinking', 'time management', 'adaptability', 'creativity',
        'collaboration', 'mentoring', 'coaching',
      ],
    };

    // Certification patterns
    this.certificationPatterns = [
      /certified\s+\w+/i,
      /certification\s+in\s+\w+/i,
      /\w+\s+certification/i,
      /aws\s+certified/i,
      /google\s+certified/i,
      /microsoft\s+certified/i,
      /cisco\s+certified/i,
      /pmp/i,
      /scrum\s+master/i,
      /cissp/i,
      /cisa/i,
    ];
  }

  /**
   * Extract all metadata from resume
   * @param {string} text - Resume text
   * @param {Object} sections - Detected sections
   * @returns {Object} Extracted metadata
   */
  extract(text, sections) {
    if (!text || typeof text !== 'string') {
      return this.getEmptyMetadata();
    }

    const lowerText = text.toLowerCase();

    return {
      contact: this.extractContactInfo(text),
      skills: this.extractSkills(lowerText),
      experience: this.extractExperienceInfo(text, sections),
      education: this.extractEducationInfo(text, sections),
      certifications: this.extractCertifications(text),
      languages: this.extractLanguages(text),
      summary: this.generateSummary(text, sections),
      extractedAt: new Date().toISOString(),
    };
  }

  /**
   * Extract contact information
   */
  extractContactInfo(text) {
    const contact = {
      email: this.extractEmail(text),
      phone: this.extractPhone(text),
      linkedin: this.extractLinkedIn(text),
      github: this.extractGitHub(text),
      location: this.extractLocation(text),
      website: this.extractWebsite(text),
    };

    const filledCount = Object.values(contact).filter(v => v !== null).length;
    contact.completeness = Math.round((filledCount / Object.keys(contact).length) * 100);

    return contact;
  }

  extractEmail(text) {
    const regex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    const match = text.match(regex);
    return match ? match[0] : null;
  }

  extractPhone(text) {
    const regex = /(\+?1?[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}/;
    const match = text.match(regex);
    return match ? match[0] : null;
  }

  extractLinkedIn(text) {
    const regex = /linkedin\.com\/in\/[a-zA-Z0-9-]+/;
    const match = text.match(regex);
    return match ? `https://${match[0]}` : null;
  }

  extractGitHub(text) {
    const regex = /github\.com\/[a-zA-Z0-9-]+/;
    const match = text.match(regex);
    return match ? `https://${match[0]}` : null;
  }

  extractLocation(text) {
    const regex = /[A-Z][a-z]+,\s*[A-Z]{2}/;
    const match = text.match(regex);
    return match ? match[0] : null;
  }

  extractWebsite(text) {
    const regex = /https?:\/\/(?!linkedin\.com|github\.com)[a-zA-Z0-9-]+\.[a-zA-Z]{2,}/;
    const match = text.match(regex);
    return match ? match[0] : null;
  }

  /**
   * Extract skills from text
   */
  extractSkills(text) {
    const foundSkills = {
      programming: [],
      frontend: [],
      backend: [],
      database: [],
      cloud: [],
      data: [],
      devops: [],
      soft: [],
      other: [],
    };

    // Check each category
    for (const [category, skills] of Object.entries(this.skillCategories)) {
      for (const skill of skills) {
        if (skill && typeof skill === 'string' && text.includes(skill)) {
          foundSkills[category].push(skill);
        }
      }
    }

    // Calculate totals
    const totalSkills = Object.values(foundSkills).flat().length;
    const categorizedCount = Object.entries(foundSkills)
      .filter(([cat]) => cat !== 'other')
      .reduce((sum, [, skills]) => sum + skills.length, 0);

    return {
      ...foundSkills,
      totalSkills,
      categorizedCount,
      uncategorizedCount: totalSkills - categorizedCount,
    };
  }

  /**
   * Extract experience information
   */
  extractExperienceInfo(text, sections) {
    const experienceSection = sections.find(s => s.type === 'experience');
    const content = experienceSection ? experienceSection.content : text;

    // Estimate years of experience
    const yearsPattern = /(\d+)\+?\s*years?/i;
    const yearsMatch = content.match(yearsPattern);
    const estimatedYears = yearsMatch ? parseInt(yearsMatch[1]) : this.estimateYearsFromContent(content);

    // Detect experience level
    const level = this.detectExperienceLevel(content);

    // Count positions
    const positionPattern = /(?:senior|junior|lead|principal|staff)?\s*(?:software|frontend|backend|full\s+stack|devops|data|product|design|marketing|sales|manager|director|engineer|developer|designer|analyst|consultant|architect)/i;
    const positions = content.match(positionPattern) || [];

    return {
      estimatedYears,
      level: level.level,
      levelConfidence: level.confidence,
      positionsCount: positions.length,
      hasLeadership: this.detectLeadership(content),
      hasQuantifiedAchievements: this.detectQuantifiedAchievements(content),
    };
  }

  estimateYearsFromContent(content) {
    // Look for date ranges
    const datePattern = /(20\d{2})\s*[-–]\s*(present|20\d{2})/gi;
    const matches = content.match(datePattern) || [];

    if (matches.length === 0) return 0;

    let totalYears = 0;
    const currentYear = new Date().getFullYear();

    for (const match of matches) {
      const years = match.match(/(20\d{2})/g);
      if (years && years.length >= 1) {
        const startYear = parseInt(years[0]);
        const endYear = years[1] ? (years[1].toLowerCase() === 'present' ? currentYear : parseInt(years[1])) : currentYear;
        totalYears += Math.max(0, endYear - startYear);
      }
    }

    return Math.min(totalYears, 40); // Cap at 40 years
  }

  detectExperienceLevel(content) {
    const lowerContent = content.toLowerCase();

    for (const [keyword, info] of Object.entries(this.experienceLevels)) {
      if (lowerContent.includes(keyword)) {
        return {
          level: info.level,
          confidence: 0.8,
          indicator: keyword,
        };
      }
    }

    // Infer from years
    const years = this.estimateYearsFromContent(content);
    if (years >= 10) return { level: 'senior', confidence: 0.6 };
    if (years >= 5) return { level: 'mid', confidence: 0.6 };
    if (years >= 2) return { level: 'junior', confidence: 0.6 };
    return { level: 'entry', confidence: 0.5 };
  }

  detectLeadership(content) {
    const leadershipKeywords = [
      'led', 'led a team', 'managed', 'managed a team', 'supervised',
      'mentored', 'coached', 'directed', 'orchestrated', 'spearheaded',
      'team lead', 'tech lead', 'project manager', 'head of',
    ];

    const lowerContent = content.toLowerCase();
    return leadershipKeywords.some(keyword => lowerContent.includes(keyword));
  }

  detectQuantifiedAchievements(content) {
    const patterns = [
      /\d+%/,
      /\$\d+[KMB]?/,
      /\d+[KMB]?\+?/,
      /\d+x/,
      /\d+\s*(users|customers|clients|employees|team members)/i,
    ];

    return patterns.filter(pattern => pattern.test(content)).length;
  }

  /**
   * Extract education information
   */
  extractEducationInfo(text, sections) {
    const educationSection = sections.find(s => s.type === 'education');
    const content = educationSection ? educationSection.content : text;

    const degrees = this.extractDegrees(content);
    const institutions = this.extractInstitutions(content);
    const highestDegree = this.determineHighestDegree(degrees);

    return {
      degrees,
      institutions,
      highestDegree,
      highestDegreeLevel: highestDegree ? this.educationLevels[highestDegree] || 0 : 0,
      hasDegree: degrees.length > 0,
    };
  }

  extractDegrees(text) {
    const degrees = [];
    const degreePatterns = [
      /(ph\.?d|doctor\s+of\s+philosophy)/i,
      /(master['']?s?\s+of\s+\w+|mba|m\.?s\.?|m\.?a\.?|m\.?tech)/i,
      /(bachelor['']?s?\s+of\s+\w+|b\.?s\.?|b\.?a\.?|b\.?tech)/i,
      /(associate['']?s?\s+degree)/i,
    ];

    for (const pattern of degreePatterns) {
      const match = text.match(pattern);
      if (match) {
        degrees.push(match[1].toLowerCase());
      }
    }

    return [...new Set(degrees)];
  }

  extractInstitutions(text) {
    // Look for university/college patterns
    const institutionPatterns = [
      /(?:university|college|institute|school)\s+of\s+[\w\s]+/gi,
      /(?:university|college|institute)\s+[\w\s]+/gi,
    ];

    const institutions = [];
    for (const pattern of institutionPatterns) {
      const matches = text.match(pattern) || [];
      institutions.push(...matches.map(m => m.trim()));
    }

    return [...new Set(institutions)];
  }

  determineHighestDegree(degrees) {
    if (degrees.length === 0) return null;

    let highest = null;
    let highestLevel = 0;

    for (const degree of degrees) {
      for (const [key, level] of Object.entries(this.educationLevels)) {
        if (degree.includes(key) && level > highestLevel) {
          highest = key;
          highestLevel = level;
        }
      }
    }

    return highest;
  }

  /**
   * Extract certifications
   */
  extractCertifications(text) {
    const certifications = [];

    for (const pattern of this.certificationPatterns) {
      const matches = text.match(pattern) || [];
      certifications.push(...matches.map(m => m.trim()));
    }

    return [...new Set(certifications)];
  }

  /**
   * Extract languages
   */
  extractLanguages(text) {
    const languages = [];
    const commonLanguages = [
      'english', 'spanish', 'french', 'german', 'chinese', 'japanese', 'korean',
      'portuguese', 'italian', 'russian', 'arabic', 'hindi', 'mandarin', 'cantonese',
    ];

    const lowerText = text.toLowerCase();
    for (const lang of commonLanguages) {
      if (lowerText.includes(lang)) {
        languages.push(lang);
      }
    }

    return languages;
  }

  /**
   * Generate resume summary
   */
  generateSummary(text, sections) {
    const wordCount = text.split(/\s+/).filter(w => w.length > 0).length;
    const sectionCount = sections.length;
    const hasExperience = sections.some(s => s.type === 'experience');
    const hasEducation = sections.some(s => s.type === 'education');
    const hasSkills = sections.some(s => s.type === 'skills');

    return {
      wordCount,
      sectionCount,
      hasExperience,
      hasEducation,
      hasSkills,
      isComplete: sectionCount >= 5,
      estimatedReadTime: Math.ceil(wordCount / 200), // minutes
    };
  }

  /**
   * Get empty metadata
   */
  getEmptyMetadata() {
    return {
      contact: this.getEmptyContact(),
      skills: this.getEmptySkills(),
      experience: this.getEmptyExperience(),
      education: this.getEmptyEducation(),
      certifications: [],
      languages: [],
      summary: this.getEmptySummary(),
      extractedAt: new Date().toISOString(),
    };
  }

  getEmptyContact() {
    return {
      email: null,
      phone: null,
      linkedin: null,
      github: null,
      location: null,
      website: null,
      completeness: 0,
    };
  }

  getEmptySkills() {
    return {
      programming: [],
      frontend: [],
      backend: [],
      database: [],
      cloud: [],
      data: [],
      devops: [],
      soft: [],
      other: [],
      totalSkills: 0,
      categorizedCount: 0,
      uncategorizedCount: 0,
    };
  }

  getEmptyExperience() {
    return {
      estimatedYears: 0,
      level: 'unknown',
      levelConfidence: 0,
      positionsCount: 0,
      hasLeadership: false,
      hasQuantifiedAchievements: 0,
    };
  }

  getEmptyEducation() {
    return {
      degrees: [],
      institutions: [],
      highestDegree: null,
      highestDegreeLevel: 0,
      hasDegree: false,
    };
  }

  getEmptySummary() {
    return {
      wordCount: 0,
      sectionCount: 0,
      hasExperience: false,
      hasEducation: false,
      hasSkills: false,
      isComplete: false,
      estimatedReadTime: 0,
    };
  }
}

module.exports = new MetadataExtractor();