/**
 * Document Normalizer - Normalizes resume documents into consistent format
 * Handles different input formats and produces standardized output
 */

class DocumentNormalizer {
  constructor() {
    this.textCleaner = require('./textCleaner');
    this.sectionDetector = require('./sectionDetector');
    this.metadataExtractor = require('./metadataExtractor');
  }

  /**
   * Normalize a resume document
   * @param {string} rawText - Raw resume text
   * @param {string} format - Document format (pdf, docx, txt, html)
   * @returns {Object} Normalized document
   */
  normalize(rawText, format = 'txt') {
    if (!rawText || typeof rawText !== 'string') {
      throw new Error('Invalid resume text provided');
    }

    // Step 1: Clean the text
    const cleaningResult = this.textCleaner.clean(rawText);
    const cleanedText = cleaningResult.cleanedText;

    // Step 2: Remove duplicate lines
    const deduplicatedText = this.textCleaner.removeDuplicateLines(cleanedText);

    // Step 3: Detect sections
    const sectionResult = this.sectionDetector.detect(deduplicatedText);

    // Step 4: Extract metadata
    const metadata = this.metadataExtractor.extract(deduplicatedText, sectionResult.sections);

    // Step 5: Calculate document statistics
    const statistics = this.calculateDocumentStatistics(deduplicatedText, sectionResult);

    // Step 6: Identify formatting issues
    const formattingIssues = this.identifyFormattingIssues(deduplicatedText, sectionResult);

    return {
      rawText,
      cleanedText: deduplicatedText,
      format,
      sections: sectionResult.sections,
      sectionAnalysis: sectionResult.analysis,
      metadata,
      statistics,
      formattingIssues,
      processingInfo: {
        originalLength: rawText.length,
        cleanedLength: deduplicatedText.length,
        reductionPercentage: cleaningResult.reductionPercentage,
        processedAt: new Date().toISOString(),
      },
    };
  }

  /**
   * Calculate comprehensive document statistics
   */
  calculateDocumentStatistics(text, sectionResult) {
    const words = text.split(/\s+/).filter(w => w.length > 0);
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 0);
    const lines = text.split('\n').filter(l => l.trim().length > 0);

    const stats = {
      wordCount: words.length,
      characterCount: text.length,
      sentenceCount: sentences.length,
      paragraphCount: paragraphs.length,
      lineCount: lines.length,
      averageWordsPerSentence: sentences.length > 0 ? Math.round(words.length / sentences.length) : 0,
      averageWordsPerParagraph: paragraphs.length > 0 ? Math.round(words.length / paragraphs.length) : 0,
      averageLinesPerSection: sectionResult.sections.length > 0 ? Math.round(lines.length / sectionResult.sections.length) : 0,
    };

    // Add text quality metrics
    const textQuality = this.textCleaner.calculateStatistics(text, text);
    stats.quality = textQuality;

    // Add achievement metrics
    stats.achievements = {
      quantifiableCount: this.countQuantifiableAchievements(text),
      actionVerbCount: textQuality.actionVerbCount,
      weakPhraseCount: textQuality.weakPhraseCount,
    };

    return stats;
  }

  /**
   * Count quantifiable achievements
   */
  countQuantifiableAchievements(text) {
    const patterns = [
      { pattern: /\d+%/g, type: 'percentage' },
      { pattern: /\$\d+[KMB]?/g, type: 'currency' },
      { pattern: /\d+[KMB]?\+?/g, type: 'number' },
      { pattern: /\d+x/g, type: 'multiplier' },
      { pattern: /\d+\s*(users|customers|clients|employees|team members|projects|products)/gi, type: 'scale' },
    ];

    const achievements = [];
    for (const { pattern, type } of patterns) {
      const matches = text.match(pattern) || [];
      for (const match of matches) {
        achievements.push({
          type,
          value: match,
          context: this.getContext(text, match),
        });
      }
    }

    return {
      total: achievements.length,
      byType: this.groupByType(achievements),
      items: achievements.slice(0, 20), // Limit to top 20
    };
  }

  /**
   * Get context around a match
   */
  getContext(text, match, contextLength = 50) {
    const index = text.indexOf(match);
    if (index === -1) return '';

    const start = Math.max(0, index - contextLength);
    const end = Math.min(text.length, index + match.length + contextLength);

    return text.substring(start, end).trim();
  }

  /**
   * Group achievements by type
   */
  groupByType(achievements) {
    const grouped = {};
    for (const achievement of achievements) {
      grouped[achievement.type] = (grouped[achievement.type] || 0) + 1;
    }
    return grouped;
  }

  /**
   * Identify formatting issues
   */
  identifyFormattingIssues(text, sectionResult) {
    const issues = [];

    // Check for missing critical sections
    if (!sectionResult.analysis.hasContact) {
      issues.push({
        severity: 'critical',
        category: 'structure',
        issue: 'Missing contact information section',
        recommendation: 'Add a contact section with email, phone, and LinkedIn URL',
      });
    }

    if (!sectionResult.analysis.hasExperience) {
      issues.push({
        severity: 'critical',
        category: 'structure',
        issue: 'Missing work experience section',
        recommendation: 'Add a work experience section with your professional history',
      });
    }

    if (!sectionResult.analysis.hasEducation) {
      issues.push({
        severity: 'high',
        category: 'structure',
        issue: 'Missing education section',
        recommendation: 'Add an education section with your academic credentials',
      });
    }

    if (!sectionResult.analysis.hasSkills) {
      issues.push({
        severity: 'high',
        category: 'structure',
        issue: 'Missing skills section',
        recommendation: 'Add a skills section highlighting your technical and soft skills',
      });
    }

    // Check section order
    if (sectionResult.analysis.orderScore < 80) {
      issues.push({
        severity: 'medium',
        category: 'structure',
        issue: 'Suboptimal section order',
        recommendation: 'Reorder sections to follow standard resume format: Contact → Summary → Experience → Education → Skills',
        currentScore: sectionResult.analysis.orderScore,
      });
    }

    // Check for empty sections
    if (sectionResult.analysis.emptySections.length > 0) {
      issues.push({
        severity: 'medium',
        category: 'content',
        issue: `Empty sections detected: ${sectionResult.analysis.emptySections.join(', ')}`,
        recommendation: 'Fill in empty sections or remove them to maintain a concise resume',
      });
    }

    // Check for weak phrases
    const weakPhrases = this.textCleaner.countWeakPhrases(text);
    if (weakPhrases > 3) {
      issues.push({
        severity: 'high',
        category: 'content',
        issue: `Found ${weakPhrases} weak phrases (e.g., "responsible for", "worked on")`,
        recommendation: 'Replace weak phrases with strong action verbs like "achieved", "led", "developed"',
        count: weakPhrases,
      });
    }

    // Check for action verbs
    const actionVerbs = this.textCleaner.countActionVerbs(text);
    if (actionVerbs < 5) {
      issues.push({
        severity: 'medium',
        category: 'content',
        issue: 'Limited use of action verbs',
        recommendation: 'Start bullet points with strong action verbs to demonstrate impact',
        count: actionVerbs,
      });
    }

    // Check document length
    const wordCount = text.split(/\s+/).filter(w => w.length > 0).length;
    if (wordCount < 200) {
      issues.push({
        severity: 'high',
        category: 'content',
        issue: 'Resume is too short',
        recommendation: 'Expand your resume to at least 300-400 words to provide sufficient detail',
        currentWordCount: wordCount,
      });
    } else if (wordCount > 1000) {
      issues.push({
        severity: 'medium',
        category: 'content',
        issue: 'Resume may be too long',
        recommendation: 'Consider condensing your resume to 1-2 pages (400-800 words)',
        currentWordCount: wordCount,
      });
    }

    return {
      total: issues.length,
      critical: issues.filter(i => i.severity === 'critical').length,
      high: issues.filter(i => i.severity === 'high').length,
      medium: issues.filter(i => i.severity === 'medium').length,
      low: issues.filter(i => i.severity === 'low').length,
      issues,
    };
  }

  /**
   * Validate normalized document
   */
  validate(normalizedDoc) {
    const validation = {
      isValid: true,
      errors: [],
      warnings: [],
    };

    if (!normalizedDoc.cleanedText || normalizedDoc.cleanedText.length < 50) {
      validation.errors.push('Document too short to analyze');
      validation.isValid = false;
    }

    if (normalizedDoc.sections.length === 0) {
      validation.errors.push('No sections detected in document');
      validation.isValid = false;
    }

    if (!normalizedDoc.metadata.contact.email && !normalizedDoc.metadata.contact.phone) {
      validation.warnings.push('No contact information found');
    }

    return validation;
  }

  /**
   * Get normalization summary
   */
  getSummary(normalizedDoc) {
    return {
      sectionsDetected: normalizedDoc.sections.length,
      missingSections: normalizedDoc.sectionAnalysis.missingSections.length,
      formattingIssues: normalizedDoc.formattingIssues.total,
      criticalIssues: normalizedDoc.formattingIssues.critical,
      wordCount: normalizedDoc.statistics.wordCount,
      skillsFound: normalizedDoc.metadata.skills.totalSkills,
      experienceYears: normalizedDoc.metadata.experience.estimatedYears,
      educationLevel: normalizedDoc.metadata.education.highestDegree,
      overallCompleteness: this.calculateCompleteness(normalizedDoc),
    };
  }

  /**
   * Calculate overall document completeness
   */
  calculateCompleteness(normalizedDoc) {
    let score = 0;
    let maxScore = 0;

    // Contact info (20 points)
    maxScore += 20;
    score += normalizedDoc.metadata.contact.completeness * 0.2;

    // Sections (30 points)
    maxScore += 30;
    const requiredSections = ['contact', 'summary', 'experience', 'education', 'skills'];
    const presentSections = requiredSections.filter(s =>
      normalizedDoc.sectionAnalysis.detectedSections.includes(s)
    ).length;
    score += (presentSections / requiredSections.length) * 30;

    // Content quality (30 points)
    maxScore += 30;
    score += Math.min(30, normalizedDoc.statistics.quality.readabilityScore * 0.3);

    // Metadata richness (20 points)
    maxScore += 20;
    score += Math.min(20, normalizedDoc.metadata.skills.totalSkills * 2);
    score += Math.min(10, normalizedDoc.metadata.experience.estimatedYears * 2);

    return Math.round((score / maxScore) * 100);
  }
}

module.exports = new DocumentNormalizer();