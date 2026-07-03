/**
 * Resume Parser - Extracts structured data from raw resume text
 * Handles multiple formats: PDF, DOCX, TXT, HTML
 */

class ResumeParser {
  constructor() {
    this.sectionPatterns = {
      contact: /^(contact|personal\s+information|profile|contact\s+details)/i,
      summary: /^(summary|professional\s+summary|profile|objective|about\s+me)/i,
      experience: /^(experience|work\s+experience|professional\s+experience|employment|work\s+history)/i,
      education: /^(education|academic|qualifications|educational\s+background)/i,
      skills: /^(skills|technical\s+skills|competencies|expertise|core\s+competencies)/i,
      certifications: /^(certifications|certificates|professional\s+certifications|credentials)/i,
      projects: /^(projects|personal\s+projects|key\s+projects|portfolio)/i,
      awards: /^(awards|honors|achievements|recognition)/i,
      languages: /^(languages|language\s+proficiency)/i,
      interests: /^(interests|hobbies|additional\s+information)/i,
      references: /^(references|professional\s+references)/i,
    };
  }

  /**
   * Parse raw resume text into structured format
   * @param {string} rawText - Raw resume text
   * @param {string} format - Format type: 'pdf', 'docx', 'txt', 'html'
   * @returns {Object} Parsed resume structure
   */
  parse(rawText, format = 'txt') {
    if (!rawText || typeof rawText !== 'string') {
      throw new Error('Invalid resume text provided');
    }

    // Step 1: Normalize based on format
    const normalizedText = this.normalizeByFormat(rawText, format);

    // Step 2: Extract sections
    const sections = this.extractSections(normalizedText);

    // Step 3: Extract metadata
    const metadata = this.extractMetadata(normalizedText, sections);

    // Step 4: Calculate document statistics
    const statistics = this.calculateStatistics(normalizedText, sections);

    return {
      rawText,
      normalizedText,
      format,
      sections,
      metadata,
      statistics,
      parsedAt: new Date().toISOString(),
    };
  }

  /**
   * Normalize text based on file format
   */
  normalizeByFormat(text, format) {
    switch (format.toLowerCase()) {
      case 'pdf':
        return this.normalizePDF(text);
      case 'docx':
        return this.normalizeDOCX(text);
      case 'html':
        return this.normalizeHTML(text);
      case 'txt':
      default:
        return this.normalizeText(text);
    }
  }

  /**
   * Normalize plain text
   */
  normalizeText(text) {
    return text
      .replace(/\r\n/g, '\n') // Normalize line endings
      .replace(/\r/g, '\n')
      .replace(/\t/g, ' ') // Replace tabs with spaces
      .replace(/[ ]+/g, ' ') // Collapse multiple spaces
      .trim();
  }

  /**
   * Normalize PDF extracted text
   */
  normalizePDF(text) {
    return this.normalizeText(text)
      .replace(/[\u00A0]/g, ' ') // Replace non-breaking spaces
      .replace(/[\u2013\u2014]/g, '-') // Normalize dashes
      .replace(/[\u2018\u2019]/g, "'") // Normalize quotes
      .replace(/[\u201C\u201D]/g, '"')
      .replace(/•/g, '-') // Normalize bullets
      .replace(/[●○■□▪▫]/g, '-');
  }

  /**
   * Normalize DOCX extracted text
   */
  normalizeDOCX(text) {
    return this.normalizeText(text)
      .replace(/\n{3,}/g, '\n\n') // Limit consecutive newlines
      .replace(/[^\x00-\x7F]/g, ' '); // Remove special characters
  }

  /**
   * Normalize HTML extracted text
   */
  normalizeHTML(text) {
    return this.normalizeText(text)
      .replace(/<[^>]*>/g, ' ') // Remove HTML tags
      .replace(/&nbsp;/g, ' ')
      .replace(/&/g, '&')
      .replace(/</g, '<')
      .replace(/>/g, '>')
      .replace(/"/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, ' ');
  }

  /**
   * Extract sections from normalized text
   */
  extractSections(text) {
    const lines = text.split('\n').filter(line => line.trim().length > 0);
    const sections = [];
    let currentSection = null;
    let currentContent = [];

    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Check if line is a section header
      const sectionType = this.identifySectionHeader(trimmedLine);
      
      if (sectionType) {
        // Save previous section
        if (currentSection) {
          sections.push({
            type: currentSection,
            content: currentContent.join('\n').trim(),
            lineCount: currentContent.length,
          });
        }
        
        // Start new section
        currentSection = sectionType;
        currentContent = [];
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
      });
    }

    return sections;
  }

  /**
   * Identify if a line is a section header
   */
  identifySectionHeader(line) {
    // Check for all-caps headers (common in resumes)
    if (line === line.toUpperCase() && line.length > 2 && line.length < 50) {
      const normalized = line.toLowerCase().replace(/[^a-z\s]/g, '');
      for (const [type, pattern] of Object.entries(this.sectionPatterns)) {
        if (pattern.test(normalized)) {
          return type;
        }
      }
    }

    // Check for title-case headers
    for (const [type, pattern] of Object.entries(this.sectionPatterns)) {
      if (pattern.test(line)) {
        return type;
      }
    }

    return null;
  }

  /**
   * Extract metadata from resume
   */
  extractMetadata(text, sections) {
    const metadata = {
      email: this.extractEmail(text),
      phone: this.extractPhone(text),
      linkedin: this.extractLinkedIn(text),
      github: this.extractGitHub(text),
      location: this.extractLocation(text),
      totalSections: sections.length,
      sectionOrder: sections.map(s => s.type),
    };

    return metadata;
  }

  /**
   * Extract email address
   */
  extractEmail(text) {
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    const match = text.match(emailRegex);
    return match ? match[0] : null;
  }

  /**
   * Extract phone number
   */
  extractPhone(text) {
    const phoneRegex = /(\+?1?[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}/;
    const match = text.match(phoneRegex);
    return match ? match[0] : null;
  }

  /**
   * Extract LinkedIn URL
   */
  extractLinkedIn(text) {
    const linkedinRegex = /linkedin\.com\/in\/[a-zA-Z0-9-]+/;
    const match = text.match(linkedinRegex);
    return match ? `https://${match[0]}` : null;
  }

  /**
   * Extract GitHub URL
   */
  extractGitHub(text) {
    const githubRegex = /github\.com\/[a-zA-Z0-9-]+/;
    const match = text.match(githubRegex);
    return match ? `https://${match[0]}` : null;
  }

  /**
   * Extract location (city, state)
   */
  extractLocation(text) {
    const locationRegex = /[A-Z][a-z]+,\s*[A-Z]{2}/;
    const match = text.match(locationRegex);
    return match ? match[0] : null;
  }

  /**
   * Calculate document statistics
   */
  calculateStatistics(text, sections) {
    const words = text.split(/\s+/).filter(w => w.length > 0);
    const characters = text.length;
    const lines = text.split('\n').length;

    return {
      wordCount: words.length,
      characterCount: characters,
      lineCount: lines,
      averageWordsPerLine: lines > 0 ? Math.round(words.length / lines) : 0,
      sectionCount: sections.length,
      hasQuantifiableAchievements: this.detectQuantifiableAchievements(text),
      actionVerbCount: this.countActionVerbs(text),
    };
  }

  /**
   * Detect quantifiable achievements (numbers, percentages, etc.)
   */
  detectQuantifiableAchievements(text) {
    const patterns = [
      /\d+%/, // Percentages
      /\$\d+[KMB]?/, // Dollar amounts
      /\d+[KMB]?\+?/, // Numbers with K/M/B suffix
      /\d+x/, // Multipliers
    ];

    const matches = patterns.map(pattern => text.match(pattern) || []);
    return matches.flat().length;
  }

  /**
   * Count action verbs
   */
  countActionVerbs(text) {
    const actionVerbs = [
      'achieved', 'improved', 'trained', 'managed', 'created', 'resolved',
      'developed', 'launched', 'led', 'increased', 'decreased', 'optimized',
      'designed', 'implemented', 'delivered', 'executed', 'coordinated',
      'analyzed', 'built', 'established', 'streamlined', 'spearheaded',
    ];

    const lowerText = text.toLowerCase();
    return actionVerbs.filter(verb => lowerText.includes(verb)).length;
  }
}

module.exports = new ResumeParser();

</parameter>
</write_to_file>