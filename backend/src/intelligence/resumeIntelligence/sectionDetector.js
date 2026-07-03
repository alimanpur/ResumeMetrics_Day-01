/**
 * Section Detector - Identifies and extracts resume sections
 * Detects section boundaries, order, and missing sections
 */

class SectionDetector {
  constructor() {
    // Standard resume sections in expected order
    this.standardSections = [
      'contact',
      'summary',
      'experience',
      'education',
      'skills',
      'certifications',
      'projects',
      'awards',
      'languages',
      'interests',
      'references',
    ];

    // Section header patterns
    this.sectionPatterns = {
      contact: /^(contact|personal\s+information|profile|contact\s+details|personal\s+details)/i,
      summary: /^(summary|professional\s+summary|profile|objective|about\s+me|career\s+objective)/i,
      experience: /^(experience|work\s+experience|professional\s+experience|employment|work\s+history|professional\s+background)/i,
      education: /^(education|academic|qualifications|educational\s+background|academic\s+background)/i,
      skills: /^(skills|technical\s+skills|competencies|expertise|core\s+competencies|technical\s+competencies)/i,
      certifications: /^(certifications|certificates|professional\s+certifications|credentials|certification)/i,
      projects: /^(projects|personal\s+projects|key\s+projects|portfolio|personal\s+projects)/i,
      awards: /^(awards|honors|achievements|recognition|accomplishments)/i,
      languages: /^(languages|language\s+proficiency|language\s+skills)/i,
      interests: /^(interests|hobbies|additional\s+information|additional\s+details|personal\s+interests)/i,
      references: /^(references|professional\s+references)/i,
    };

    // Indicators of section headers
    this.headerIndicators = [
      /^[A-Z\s]+$/, // All caps
      /^[A-Z][a-zA-Z\s]+$/, // Title case
      /^[A-Z][a-zA-Z\s]+:$/, // Title case with colon
    ];
  }

  /**
   * Detect all sections in resume text
   * @param {string} text - Resume text
   * @returns {Object} Section detection results
   */
  detect(text) {
    if (!text || typeof text !== 'string') {
      return this.getEmptyResult();
    }

    const lines = text.split('\n');
    const sections = [];
    let currentSection = null;
    let currentContent = [];
    let sectionStartLine = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmedLine = line.trim();

      if (trimmedLine.length === 0) continue;

      // Check if this line is a section header
      const sectionType = this.identifySection(trimmedLine);

      if (sectionType) {
        // Save previous section
        if (currentSection) {
          sections.push({
            type: currentSection,
            content: currentContent.join('\n').trim(),
            lineCount: currentContent.length,
            startLine: sectionStartLine,
            endLine: i - 1,
            isEmpty: currentContent.join('\n').trim().length === 0,
          });
        }

        // Start new section
        currentSection = sectionType;
        currentContent = [];
        sectionStartLine = i;
      } else if (currentSection) {
        currentContent.push(trimmedLine);
      }
    }

    // Save last section
    if (currentSection) {
      sections.push({
        type: currentSection,
        content: currentContent.join('\n').trim(),
        lineCount: currentContent.length,
        startLine: sectionStartLine,
        endLine: lines.length - 1,
        isEmpty: currentContent.join('\n').trim().length === 0,
      });
    }

    // Analyze sections
    const analysis = this.analyzeSections(sections);

    return {
      sections,
      analysis,
      detectedAt: new Date().toISOString(),
    };
  }

  /**
   * Identify section type from line
   */
  identifySection(line) {
    // Check against known patterns
    for (const [type, pattern] of Object.entries(this.sectionPatterns)) {
      if (pattern.test(line)) {
        return type;
      }
    }

    // Check for header indicators
    for (const indicator of this.headerIndicators) {
      if (indicator.test(line) && line.length < 50) {
        const normalized = line.toLowerCase().replace(/[^a-z\s]/g, '').trim();
        for (const [type, pattern] of Object.entries(this.sectionPatterns)) {
          if (pattern.test(normalized)) {
            return type;
          }
        }
      }
    }

    return null;
  }

  /**
   * Analyze detected sections
   */
  analyzeSections(sections) {
    const detectedTypes = sections.map(s => s.type);
    const missingSections = this.standardSections.filter(
      s => !detectedTypes.includes(s)
    );

    // Check section order
    const orderScore = this.calculateOrderScore(detectedTypes);

    // Check for empty sections
    const emptySections = sections.filter(s => s.isEmpty).map(s => s.type);

    // Calculate section quality
    const quality = this.calculateSectionQuality(sections);

    return {
      totalSections: sections.length,
      detectedSections: detectedTypes,
      missingSections,
      orderScore,
      emptySections,
      quality,
      hasContact: detectedTypes.includes('contact'),
      hasSummary: detectedTypes.includes('summary'),
      hasExperience: detectedTypes.includes('experience'),
      hasEducation: detectedTypes.includes('education'),
      hasSkills: detectedTypes.includes('skills'),
      isComplete: missingSections.length === 0,
    };
  }

  /**
   * Calculate section order score (0-100)
   */
  calculateOrderScore(detectedTypes) {
    if (detectedTypes.length === 0) return 0;

    // Find positions of standard sections in detected array
    const positions = detectedTypes.map(type =>
      this.standardSections.indexOf(type)
    ).filter(pos => pos !== -1);

    if (positions.length === 0) return 0;

    // Count how many are in correct relative order
    let correctOrder = 0;
    for (let i = 0; i < positions.length - 1; i++) {
      if (positions[i] < positions[i + 1]) {
        correctOrder++;
      }
    }

    const maxOrder = positions.length - 1;
    return maxOrder > 0 ? Math.round((correctOrder / maxOrder) * 100) : 100;
  }

  /**
   * Calculate overall section quality score
   */
  calculateSectionQuality(sections) {
    if (sections.length === 0) return 0;

    let score = 0;
    const maxScore = sections.length * 10;

    for (const section of sections) {
      // Base score for having the section
      score += 5;

      // Bonus for having content
      if (!section.isEmpty && section.content.length > 50) {
        score += 3;
      }

      // Bonus for reasonable length
      if (section.lineCount >= 3 && section.lineCount <= 50) {
        score += 2;
      }
    }

    return Math.round((score / maxScore) * 100);
  }

  /**
   * Get empty result
   */
  getEmptyResult() {
    return {
      sections: [],
      analysis: {
        totalSections: 0,
        detectedSections: [],
        missingSections: [...this.standardSections],
        orderScore: 0,
        emptySections: [],
        quality: 0,
        hasContact: false,
        hasSummary: false,
        hasExperience: false,
        hasEducation: false,
        hasSkills: false,
        isComplete: false,
      },
      detectedAt: new Date().toISOString(),
    };
  }

  /**
   * Get recommended section order
   */
  getRecommendedOrder() {
    return this.standardSections;
  }

  /**
   * Check if section order is optimal
   */
  isOptimalOrder(sections) {
    const detectedTypes = sections.map(s => s.type);
    const positions = detectedTypes.map(type =>
      this.standardSections.indexOf(type)
    ).filter(pos => pos !== -1);

    for (let i = 0; i < positions.length - 1; i++) {
      if (positions[i] > positions[i + 1]) {
        return false;
      }
    }

    return true;
  }
}

module.exports = new SectionDetector();