/**
 * ATS Rule Engine - Evaluates resume compatibility with Applicant Tracking Systems
 * Checks formatting, structure, and content against ATS best practices
 */

class ATSEngine {
  constructor() {
    // ATS-friendly font recommendations
    this.atsFriendlyFonts = [
      'arial', 'calibri', 'helvetica', 'times new roman', 'georgia',
      'garamond', 'trebuchet ms', 'verdana', 'roboto', 'open sans',
    ];

    // ATS-unfriendly fonts
    this.atsUnfriendlyFonts = [
      'script', 'decorative', 'symbol', 'wingdings', 'webdings',
      'papyrus', 'comic sans', 'cursive',
    ];

    // Standard section order for ATS
    this.standardSectionOrder = [
      'contact', 'summary', 'experience', 'education', 'skills',
      'certifications', 'projects', 'awards',
    ];

    // Bullet point styles
    this.acceptedBullets = ['-', '•', '·', '*', '→', '▪'];
  }

  /**
   * Evaluate resume against ATS rules
   * @param {Object} normalizedDoc - Normalized document from documentNormalizer
   * @returns {Object} ATS evaluation results
   */
  evaluate(normalizedDoc) {
    if (!normalizedDoc || !normalizedDoc.cleanedText) {
      return this.getEmptyEvaluation();
    }

    const { cleanedText, sections, sectionAnalysis, metadata, statistics } = normalizedDoc;

    // Run all ATS checks
    const checks = {
      formatting: this.checkFormatting(cleanedText, sections),
      structure: this.checkStructure(sections, sectionAnalysis),
      content: this.checkContent(cleanedText, metadata, statistics),
      keywords: this.checkKeywords(cleanedText),
      readability: this.checkReadability(statistics),
      contact: this.checkContactInfo(metadata.contact),
      sections: this.checkSections(sectionAnalysis),
      length: this.checkLength(statistics),
    };

    // Calculate overall ATS score
    const atsScore = this.calculateATSScore(checks);

    // Generate recommendations
    const recommendations = this.generateRecommendations(checks);

    // Determine severity of issues
    const severity = this.determineSeverity(checks);

    return {
      atsScore,
      checks,
      recommendations,
      severity,
      summary: this.generateSummary(atsScore, checks),
      evaluatedAt: new Date().toISOString(),
    };
  }

  /**
   * Check formatting issues
   */
  checkFormatting(text, sections) {
    const issues = [];
    let score = 100;

    // Check for tables (ATS often can't read tables)
    const tableIndicators = text.match(/\|.*\|/g) || [];
    if (tableIndicators.length > 0) {
      issues.push({
        rule: 'no_tables',
        severity: 'high',
        issue: 'Tables detected in resume',
        evidence: `Found ${tableIndicators.length} table-like structures`,
        recommendation: 'Replace tables with bullet points or simple lists for better ATS compatibility',
        impact: -15,
      });
      score -= 15;
    }

    // Check for columns (multi-column layouts)
    const columnIndicators = text.match(/\s{3,}[A-Z][a-z]+/g) || [];
    if (columnIndicators.length > 5) {
      issues.push({
        rule: 'single_column',
        severity: 'medium',
        issue: 'Possible multi-column layout detected',
        evidence: 'Text appears to be arranged in multiple columns',
        recommendation: 'Use single-column layout for optimal ATS parsing',
        impact: -10,
      });
      score -= 10;
    }

    // Check for images/graphics
    const imageIndicators = text.match(/(image|img|picture|graphic|icon|emoji)/i) || [];
    if (imageIndicators.length > 0) {
      issues.push({
        rule: 'no_images',
        severity: 'high',
        issue: 'Images or graphics detected',
        evidence: 'References to images found in text',
        recommendation: 'Remove images and graphics - ATS cannot read them',
        impact: -20,
      });
      score -= 20;
    }

    // Check for headers/footers
    const headerFooterPatterns = [
      /page\s+\d+/i,
      /continued\s+on\s+next\s+page/i,
    ];
    const headerFooterIssues = headerFooterPatterns.filter(p => p.test(text));
    if (headerFooterIssues.length > 0) {
      issues.push({
        rule: 'no_headers_footers',
        severity: 'low',
        issue: 'Headers or footers detected',
        evidence: 'Page numbers or continuation text found',
        recommendation: 'Remove headers and footers - they can confuse ATS parsing',
        impact: -5,
      });
      score -= 5;
    }

    // Check for special characters
    const specialChars = text.match(/[^\x00-\x7F]/g) || [];
    if (specialChars.length > 10) {
      issues.push({
        rule: 'standard_characters',
        severity: 'medium',
        issue: 'Non-standard characters detected',
        evidence: `Found ${specialChars.length} special characters`,
        recommendation: 'Replace special characters with standard ASCII equivalents',
        impact: -8,
      });
      score -= 8;
    }

    // Check bullet consistency
    const bullets = text.match(/^[-•·*]/gm) || [];
    const uniqueBullets = [...new Set(bullets)];
    if (uniqueBullets.length > 2) {
      issues.push({
        rule: 'bullet_consistency',
        severity: 'low',
        issue: 'Inconsistent bullet point styles',
        evidence: `Found ${uniqueBullets.length} different bullet styles: ${uniqueBullets.join(', ')}`,
        recommendation: 'Use consistent bullet points throughout (recommended: - or •)',
        impact: -3,
      });
      score -= 3;
    }

    return {
      score: Math.max(0, score),
      issues,
      passed: issues.length === 0,
      details: {
        hasTables: tableIndicators.length > 0,
        hasImages: imageIndicators.length > 0,
        hasSpecialChars: specialChars.length > 10,
        bulletStyles: uniqueBullets,
      },
    };
  }

  /**
   * Check structural elements
   */
  checkStructure(sections, sectionAnalysis) {
    const issues = [];
    let score = 100;

    // Check for required sections
    const requiredSections = ['contact', 'experience', 'education', 'skills'];
    const missingRequired = requiredSections.filter(s => !sectionAnalysis.detectedSections.includes(s));

    if (missingRequired.length > 0) {
      issues.push({
        rule: 'required_sections',
        severity: 'critical',
        issue: 'Missing required sections',
        evidence: `Missing: ${missingRequired.join(', ')}`,
        recommendation: 'Add all required sections: Contact, Experience, Education, Skills',
        impact: -25,
      });
      score -= 25 * missingRequired.length;
    }

    // Check section order
    if (sectionAnalysis.orderScore < 70) {
      issues.push({
        rule: 'section_order',
        severity: 'medium',
        issue: 'Suboptimal section order',
        evidence: `Section order score: ${sectionAnalysis.orderScore}/100`,
        recommendation: 'Reorder sections to match standard resume format',
        impact: -10,
      });
      score -= 10;
    }

    // Check for empty sections
    if (sectionAnalysis.emptySections.length > 0) {
      issues.push({
        rule: 'no_empty_sections',
        severity: 'medium',
        issue: 'Empty sections present',
        evidence: `Empty sections: ${sectionAnalysis.emptySections.join(', ')}`,
        recommendation: 'Remove empty sections or add content to them',
        impact: -8,
      });
      score -= 8;
    }

    return {
      score: Math.max(0, score),
      issues,
      passed: issues.length === 0,
      details: {
        totalSections: sections.length,
        requiredSectionsPresent: requiredSections.length - missingRequired.length,
        orderScore: sectionAnalysis.orderScore,
      },
    };
  }

  /**
   * Check content quality
   */
  checkContent(text, metadata, statistics) {
    const issues = [];
    let score = 100;

    // Check for action verbs
    const actionVerbCount = statistics.quality.actionVerbCount;
    if (actionVerbCount < 5) {
      issues.push({
        rule: 'action_verbs',
        severity: 'high',
        issue: 'Insufficient action verbs',
        evidence: `Only ${actionVerbCount} action verbs found (recommended: 10+)`,
        recommendation: 'Add more action verbs like "achieved", "led", "developed", "implemented"',
        impact: -15,
      });
      score -= 15;
    }

    // Check for weak phrases
    const weakPhraseCount = statistics.quality.weakPhraseCount;
    if (weakPhraseCount > 3) {
      issues.push({
        rule: 'no_weak_phrases',
        severity: 'high',
        issue: 'Weak phrases detected',
        evidence: `Found ${weakPhraseCount} weak phrases (e.g., "responsible for", "worked on")`,
        recommendation: 'Replace weak phrases with strong action verbs',
        impact: -12,
      });
      score -= 12;
    }

    // Check for quantifiable achievements
    const quantifiableCount = statistics.achievements.quantifiableCount;
    if (quantifiableCount < 3) {
      issues.push({
        rule: 'quantifiable_achievements',
        severity: 'high',
        issue: 'Insufficient quantifiable achievements',
        evidence: `Only ${quantifiableCount} quantifiable achievements found (recommended: 5+)`,
        recommendation: 'Add metrics and numbers to demonstrate impact (e.g., "increased sales by 25%")',
        impact: -15,
      });
      score -= 15;
    }

    // Check for skills
    if (metadata.skills.totalSkills < 5) {
      issues.push({
        rule: 'sufficient_skills',
        severity: 'medium',
        issue: 'Limited skills listed',
        evidence: `Only ${metadata.skills.totalSkills} skills found (recommended: 10+)`,
        recommendation: 'Add more relevant technical and soft skills',
        impact: -10,
      });
      score -= 10;
    }

    return {
      score: Math.max(0, score),
      issues,
      passed: issues.length === 0,
      details: {
        actionVerbCount,
        weakPhraseCount,
        quantifiableCount,
        skillsCount: metadata.skills.totalSkills,
      },
    };
  }

  /**
   * Check keyword optimization
   */
  checkKeywords(text) {
    const issues = [];
    let score = 100;

    const lowerText = text.toLowerCase();
    const words = lowerText.split(/\s+/).filter(w => w.length > 3);

    // Check for keyword density
    const uniqueWords = [...new Set(words)];
    const keywordDensity = uniqueWords.length / words.length;

    if (keywordDensity < 0.3) {
      issues.push({
        rule: 'keyword_diversity',
        severity: 'medium',
        issue: 'Low keyword diversity',
        evidence: `Keyword diversity: ${Math.round(keywordDensity * 100)}% (recommended: 30%+)`,
        recommendation: 'Use more varied vocabulary and industry-specific terms',
        impact: -8,
      });
      score -= 8;
    }

    // Check for industry keywords
    const industryKeywords = this.getIndustryKeywords();
    const foundKeywords = industryKeywords.filter(kw => lowerText.includes(kw));

    if (foundKeywords.length < 5) {
      issues.push({
        rule: 'industry_keywords',
        severity: 'medium',
        issue: 'Limited industry-specific keywords',
        evidence: `Only ${foundKeywords.length} industry keywords found`,
        recommendation: 'Add more industry-specific keywords and technical terms',
        impact: -10,
      });
      score -= 10;
    }

    return {
      score: Math.max(0, score),
      issues,
      passed: issues.length === 0,
      details: {
        keywordDiversity: Math.round(keywordDensity * 100),
        industryKeywordsFound: foundKeywords.length,
        totalUniqueWords: uniqueWords.length,
      },
    };
  }

  /**
   * Get common industry keywords
   */
  getIndustryKeywords() {
    return [
      'agile', 'scrum', 'kanban', 'ci/cd', 'devops', 'cloud', 'aws', 'azure',
      'docker', 'kubernetes', 'microservices', 'api', 'rest', 'graphql',
      'javascript', 'python', 'java', 'react', 'node', 'sql', 'nosql',
      'leadership', 'management', 'collaboration', 'communication',
      'problem solving', 'analytical', 'strategic', 'innovation',
    ];
  }

  /**
   * Check readability
   */
  checkReadability(statistics) {
    const issues = [];
    let score = 100;

    const readabilityScore = statistics.quality.readabilityScore;

    if (readabilityScore < 30) {
      issues.push({
        rule: 'readability',
        severity: 'medium',
        issue: 'Low readability score',
        evidence: `Readability score: ${readabilityScore}/100`,
        recommendation: 'Simplify language and use shorter sentences for better readability',
        impact: -10,
      });
      score -= 10;
    }

    // Check average sentence length
    const avgSentenceLength = statistics.averageWordsPerSentence;
    if (avgSentenceLength > 20) {
      issues.push({
        rule: 'sentence_length',
        severity: 'low',
        issue: 'Sentences too long',
        evidence: `Average sentence length: ${avgSentenceLength} words (recommended: 15-20)`,
        recommendation: 'Break long sentences into shorter, clearer statements',
        impact: -5,
      });
      score -= 5;
    }

    return {
      score: Math.max(0, score),
      issues,
      passed: issues.length === 0,
      details: {
        readabilityScore,
        averageSentenceLength: avgSentenceLength,
      },
    };
  }

  /**
   * Check contact information
   */
  checkContactInfo(contact) {
    const issues = [];
    let score = 0;
    const maxScore = 100;

    // Email (required)
    if (contact.email) {
      score += 40;
    } else {
      issues.push({
        rule: 'email_required',
        severity: 'critical',
        issue: 'Email address missing',
        recommendation: 'Add a professional email address',
        impact: -40,
      });
    }

    // Phone (required)
    if (contact.phone) {
      score += 30;
    } else {
      issues.push({
        rule: 'phone_required',
        severity: 'critical',
        issue: 'Phone number missing',
        recommendation: 'Add a phone number for contact',
        impact: -30,
      });
    }

    // LinkedIn (recommended)
    if (contact.linkedin) {
      score += 15;
    } else {
      issues.push({
        rule: 'linkedin_recommended',
        severity: 'medium',
        issue: 'LinkedIn profile not included',
        recommendation: 'Add your LinkedIn profile URL',
        impact: -15,
      });
    }

    // Location (recommended)
    if (contact.location) {
      score += 10;
    } else {
      issues.push({
        rule: 'location_recommended',
        severity: 'low',
        issue: 'Location not specified',
        recommendation: 'Add your city and state',
        impact: -5,
      });
    }

    // GitHub/Portfolio (bonus)
    if (contact.github || contact.website) {
      score += 5;
    }

    return {
      score: Math.min(maxScore, score),
      issues,
      passed: issues.filter(i => i.severity === 'critical').length === 0,
      details: {
        hasEmail: !!contact.email,
        hasPhone: !!contact.phone,
        hasLinkedIn: !!contact.linkedin,
        hasLocation: !!contact.location,
        completeness: contact.completeness,
      },
    };
  }

  /**
   * Check sections
   */
  checkSections(sectionAnalysis) {
    const issues = [];
    let score = 100;

    // Check for critical sections
    if (!sectionAnalysis.hasContact) {
      issues.push({
        rule: 'contact_section',
        severity: 'critical',
        issue: 'Contact section missing',
        recommendation: 'Add a contact section at the top of your resume',
        impact: -30,
      });
      score -= 30;
    }

    if (!sectionAnalysis.hasExperience) {
      issues.push({
        rule: 'experience_section',
        severity: 'critical',
        issue: 'Experience section missing',
        recommendation: 'Add a work experience section',
        impact: -30,
      });
      score -= 30;
    }

    if (!sectionAnalysis.hasEducation) {
      issues.push({
        rule: 'education_section',
        severity: 'high',
        issue: 'Education section missing',
        recommendation: 'Add an education section',
        impact: -20,
      });
      score -= 20;
    }

    if (!sectionAnalysis.hasSkills) {
      issues.push({
        rule: 'skills_section',
        severity: 'high',
        issue: 'Skills section missing',
        recommendation: 'Add a skills section',
        impact: -20,
      });
      score -= 20;
    }

    // Bonus for additional sections
    if (sectionAnalysis.detectedSections.includes('certifications')) {
      score += 5;
    }
    if (sectionAnalysis.detectedSections.includes('projects')) {
      score += 5;
    }

    return {
      score: Math.max(0, Math.min(100, score)),
      issues,
      passed: issues.filter(i => i.severity === 'critical').length === 0,
      details: {
        totalSections: sectionAnalysis.totalSections,
        hasContact: sectionAnalysis.hasContact,
        hasExperience: sectionAnalysis.hasExperience,
        hasEducation: sectionAnalysis.hasEducation,
        hasSkills: sectionAnalysis.hasSkills,
      },
    };
  }

  /**
   * Check document length
   */
  checkLength(statistics) {
    const issues = [];
    let score = 100;

    const wordCount = statistics.wordCount;

    if (wordCount < 200) {
      issues.push({
        rule: 'minimum_length',
        severity: 'high',
        issue: 'Resume too short',
        evidence: `Word count: ${wordCount} (minimum: 200)`,
        recommendation: 'Expand your resume to at least 300 words',
        impact: -20,
      });
      score -= 20;
    } else if (wordCount > 1000) {
      issues.push({
        rule: 'maximum_length',
        severity: 'medium',
        issue: 'Resume too long',
        evidence: `Word count: ${wordCount} (recommended max: 800)`,
        recommendation: 'Condense your resume to 1-2 pages',
        impact: -10,
      });
      score -= 10;
    }

    return {
      score: Math.max(0, score),
      issues,
      passed: issues.length === 0,
      details: {
        wordCount,
        characterCount: statistics.characterCount,
        pageEstimate: Math.ceil(wordCount / 500), // ~500 words per page
      },
    };
  }

  /**
   * Calculate overall ATS score
   */
  calculateATSScore(checks) {
    const weights = {
      formatting: 0.20,
      structure: 0.25,
      content: 0.25,
      keywords: 0.15,
      readability: 0.10,
      contact: 0.05,
    };

    let weightedScore = 0;
    for (const [category, weight] of Object.entries(weights)) {
      if (checks[category]) {
        weightedScore += checks[category].score * weight;
      }
    }

    return Math.round(weightedScore);
  }

  /**
   * Generate recommendations
   */
  generateRecommendations(checks) {
    const recommendations = [];

    for (const [category, check] of Object.entries(checks)) {
      if (check.issues && check.issues.length > 0) {
        for (const issue of check.issues) {
          recommendations.push({
            category,
            severity: issue.severity,
            rule: issue.rule,
            issue: issue.issue,
            evidence: issue.evidence,
            recommendation: issue.recommendation,
            impact: issue.impact,
          });
        }
      }
    }

    // Sort by severity and impact
    const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    recommendations.sort((a, b) => {
      const severityDiff = severityOrder[a.severity] - severityOrder[b.severity];
      if (severityDiff !== 0) return severityDiff;
      return b.impact - a.impact;
    });

    return recommendations;
  }

  /**
   * Determine overall severity
   */
  determineSeverity(checks) {
    const allIssues = Object.values(checks).flatMap(c => c.issues || []);
    const criticalCount = allIssues.filter(i => i.severity === 'critical').length;
    const highCount = allIssues.filter(i => i.severity === 'high').length;

    if (criticalCount > 0) return 'critical';
    if (highCount > 2) return 'high';
    if (highCount > 0) return 'medium';
    return 'low';
  }

  /**
   * Generate summary
   */
  generateSummary(atsScore, checks) {
    const allIssues = Object.values(checks).flatMap(c => c.issues || []);
    const totalIssues = allIssues.length;
    const criticalIssues = allIssues.filter(i => i.severity === 'critical').length;

    let status;
    if (atsScore >= 90) status = 'excellent';
    else if (atsScore >= 80) status = 'good';
    else if (atsScore >= 70) status = 'fair';
    else if (atsScore >= 60) status = 'poor';
    else status = 'critical';

    return {
      status,
      atsScore,
      totalIssues,
      criticalIssues,
      message: this.getStatusMessage(atsScore, criticalIssues),
    };
  }

  /**
   * Get status message
   */
  getStatusMessage(atsScore, criticalIssues) {
    if (criticalIssues > 0) {
      return `Your resume has ${criticalIssues} critical ATS compatibility issue(s) that must be fixed. ATS systems may reject or misread your resume.`;
    } else if (atsScore >= 90) {
      return 'Excellent! Your resume is highly optimized for ATS systems. It should parse correctly across all major ATS platforms.';
    } else if (atsScore >= 80) {
      return 'Good ATS compatibility. Minor improvements recommended to ensure optimal parsing across all ATS systems.';
    } else if (atsScore >= 70) {
      return 'Fair ATS compatibility. Several improvements needed to ensure your resume is properly parsed by ATS systems.';
    } else {
      return 'Poor ATS compatibility. Significant changes required to make your resume ATS-friendly and avoid rejection.';
    }
  }

  /**
   * Get empty evaluation
   */
  getEmptyEvaluation() {
    return {
      atsScore: 0,
      checks: {},
      recommendations: [],
      severity: 'critical',
      summary: {
        status: 'critical',
        atsScore: 0,
        totalIssues: 0,
        criticalIssues: 0,
        message: 'Unable to evaluate resume - insufficient data',
      },
      evaluatedAt: new Date().toISOString(),
    };
  }
}

module.exports = new ATSEngine();