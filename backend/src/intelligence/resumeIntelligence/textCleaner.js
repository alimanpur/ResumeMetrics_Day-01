/**
 * Text Cleaner - Normalizes and cleans resume text
 * Handles whitespace normalization, duplicate removal, and formatting cleanup
 */

class TextCleaner {
  constructor() {
    // Common patterns to clean
    this.patterns = {
      multipleSpaces: /\s{2,}/g,
      multipleNewlines: /\n{3,}/g,
      tabs: /\t/g,
      nonBreakingSpaces: /[\u00A0]/g,
      smartQuotes: /[\u2018\u2019\u201C\u201D]/g,
      emDashes: /[\u2014]/g,
      enDashes: /[\u2013]/g,
      bulletPoints: /[•●○■□▪▫●]/g,
      specialChars: /[^\x00-\x7F]/g,
      duplicatePunctuation: /([!?.]){2,}/g,
      trailingSpaces: /\s+$/gm,
      leadingSpaces: /^\s+/gm,
    };

    // Action verbs for quality assessment
    this.actionVerbs = [
      'achieved', 'improved', 'trained', 'managed', 'created', 'resolved',
      'developed', 'launched', 'led', 'increased', 'decreased', 'optimized',
      'designed', 'implemented', 'delivered', 'executed', 'coordinated',
      'analyzed', 'built', 'established', 'streamlined', 'spearheaded',
      'orchestrated', 'pioneered', 'transformed', 'accelerated', 'drove',
      'mentored', 'negotiated', 'presented', 'authored', 'engineered',
    ];

    // Weak words to avoid
    this.weakWords = [
      'responsible for', 'worked on', 'helped with', 'assisted in',
      'participated in', 'involved in', 'tasked with', 'duties included',
    ];
  }

  /**
   * Clean and normalize text
   * @param {string} text - Raw text to clean
   * @returns {Object} Cleaned text with statistics
   */
  clean(text) {
    if (!text || typeof text !== 'string') {
      return { cleanedText: '', statistics: this.getEmptyStatistics() };
    }

    let cleaned = text;

    // Step 1: Normalize line endings
    cleaned = cleaned.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

    // Step 2: Replace tabs with spaces
    cleaned = cleaned.replace(this.patterns.tabs, ' ');

    // Step 3: Remove non-breaking spaces
    cleaned = cleaned.replace(this.patterns.nonBreakingSpaces, ' ');

    // Step 4: Normalize smart quotes to straight quotes
    cleaned = cleaned.replace(this.patterns.smartQuotes, "'");

    // Step 5: Normalize dashes
    cleaned = cleaned.replace(this.patterns.emDashes, '-');
    cleaned = cleaned.replace(this.patterns.enDashes, '-');

    // Step 6: Normalize bullet points
    cleaned = cleaned.replace(this.patterns.bulletPoints, '-');

    // Step 7: Collapse multiple spaces
    cleaned = cleaned.replace(this.patterns.multipleSpaces, ' ');

    // Step 8: Limit consecutive newlines to max 2
    cleaned = cleaned.replace(this.patterns.multipleNewlines, '\n\n');

    // Step 9: Remove trailing/leading spaces from each line
    cleaned = cleaned.replace(this.patterns.trailingSpaces, '');
    cleaned = cleaned.replace(this.patterns.leadingSpaces, '');

    // Step 10: Remove duplicate punctuation
    cleaned = cleaned.replace(this.patterns.duplicatePunctuation, '$1');

    // Step 11: Final trim
    cleaned = cleaned.trim();

    // Calculate statistics
    const statistics = this.calculateStatistics(text, cleaned);

    return {
      cleanedText: cleaned,
      originalLength: text.length,
      cleanedLength: cleaned.length,
      reductionPercentage: Math.round((1 - cleaned.length / text.length) * 100),
      statistics,
    };
  }

  /**
   * Calculate text statistics
   */
  calculateStatistics(original, cleaned) {
    const words = cleaned.split(/\s+/).filter(w => w.length > 0);
    const sentences = cleaned.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const lines = cleaned.split('\n').filter(l => l.trim().length > 0);

    return {
      wordCount: words.length,
      sentenceCount: sentences.length,
      lineCount: lines.length,
      averageWordsPerSentence: sentences.length > 0 ? Math.round(words.length / sentences.length) : 0,
      averageSentenceLength: Math.round(words.length / Math.max(sentences.length, 1)),
      actionVerbCount: this.countActionVerbs(cleaned),
      weakPhraseCount: this.countWeakPhrases(cleaned),
      readabilityScore: this.calculateReadabilityScore(words, sentences),
    };
  }

  /**
   * Count action verbs in text
   */
  countActionVerbs(text) {
    const lowerText = text.toLowerCase();
    return this.actionVerbs.filter(verb => lowerText.includes(verb)).length;
  }

  /**
   * Count weak phrases in text
   */
  countWeakPhrases(text) {
    const lowerText = text.toLowerCase();
    return this.weakWords.filter(phrase => lowerText.includes(phrase)).length;
  }

  /**
   * Calculate basic readability score (0-100)
   */
  calculateReadabilityScore(words, sentences) {
    if (words.length === 0 || sentences.length === 0) return 0;

    const avgWordsPerSentence = words.length / sentences.length;
    const avgSyllablesPerWord = this.estimateAverageSyllables(words);

    // Simplified Flesch Reading Ease formula
    const score = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord);

    return Math.max(0, Math.min(100, Math.round(score)));
  }

  /**
   * Estimate average syllables per word
   */
  estimateAverageSyllables(words) {
    if (words.length === 0) return 0;

    const totalSyllables = words.reduce((sum, word) => {
      return sum + this.countSyllables(word);
    }, 0);

    return totalSyllables / words.length;
  }

  /**
   * Count syllables in a word (simplified)
   */
  countSyllables(word) {
    word = word.toLowerCase().replace(/[^a-z]/g, '');
    if (word.length <= 3) return 1;

    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    word = word.replace(/^y/, '');
    const matches = word.match(/[aeiouy]{1,2}/g);
    return matches ? matches.length : 1;
  }

  /**
   * Get empty statistics object
   */
  getEmptyStatistics() {
    return {
      wordCount: 0,
      sentenceCount: 0,
      lineCount: 0,
      averageWordsPerSentence: 0,
      averageSentenceLength: 0,
      actionVerbCount: 0,
      weakPhraseCount: 0,
      readabilityScore: 0,
    };
  }

  /**
   * Remove duplicate lines
   */
  removeDuplicateLines(text) {
    const lines = text.split('\n');
    const seen = new Set();
    const unique = [];

    for (const line of lines) {
      const normalized = line.trim().toLowerCase();
      if (normalized && !seen.has(normalized)) {
        seen.add(normalized);
        unique.push(line);
      } else if (!normalized) {
        unique.push(line); // Keep empty lines
      }
    }

    return unique.join('\n');
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
    };

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
}

module.exports = new TextCleaner();