/**
 * Resume Rewrite Engine
 * Improves weak bullet points while preserving facts
 * Never invents information - only enhances wording
 */

class RewriteEngine {
  constructor() {
    // Weak phrase replacements
    this.weakPhraseReplacements = {
      'responsible for': ['Managed', 'Led', 'Oversaw', 'Directed', 'Coordinated'],
      'worked on': ['Developed', 'Built', 'Implemented', 'Contributed to', 'Executed'],
      'helped with': ['Supported', 'Assisted', 'Contributed to', 'Facilitated', 'Enabled'],
      'assisted in': ['Supported', 'Contributed to', 'Participated in', 'Helped execute'],
      'participated in': ['Contributed to', 'Engaged in', 'Collaborated on', 'Supported'],
      'involved in': ['Engaged in', 'Contributed to', 'Participated in', 'Collaborated on'],
      'tasked with': ['Assigned to', 'Responsible for', 'Led', 'Managed'],
      'duties included': ['Responsibilities included', 'Key contributions', 'Achievements'],
    };

    // Weak verbs to replace
    this.weakVerbs = {
      'did': 'Executed',
      'made': 'Created',
      'used': 'Utilized',
      'helped': 'Contributed to',
      'worked': 'Collaborated',
      'got': 'Achieved',
      'put': 'Implemented',
      'set': 'Established',
      'ran': 'Managed',
      'handled': 'Managed',
    };

    // Strong action verbs by category
    this.actionVerbsByCategory = {
      leadership: ['Led', 'Directed', 'Orchestrated', 'Spearheaded', 'Championed', 'Guided'],
      development: ['Developed', 'Built', 'Engineered', 'Architected', 'Constructed', 'Programmed'],
      improvement: ['Improved', 'Enhanced', 'Optimized', 'Refined', 'Upgraded', 'Modernized'],
      creation: ['Created', 'Established', 'Launched', 'Introduced', 'Pioneered', 'Founded'],
      analysis: ['Analyzed', 'Evaluated', 'Assessed', 'Examined', 'Investigated', 'Researched'],
      management: ['Managed', 'Coordinated', 'Oversaw', 'Supervised', 'Administered', 'Directed'],
      achievement: ['Achieved', 'Delivered', 'Exceeded', 'Surpassed', 'Accomplished', 'Attained'],
    };

    // Metric templates
    this.metricTemplates = {
      percentage: [
        'increased {metric} by {value}%',
        'decreased {metric} by {value}%',
        'improved {metric} by {value}%',
        'reduced {metric} by {value}%',
      ],
      currency: [
        'generated ${value} in {metric}',
        'saved ${value} in {metric}',
        'managed budget of ${value}',
        'drove ${value} in {metric}',
      ],
      scale: [
        'served {value} {metric}',
        'managed {value} {metric}',
        'led team of {value} {metric}',
        'supported {value} {metric}',
      ],
      time: [
        'reduced time by {value}%',
        'accelerated {metric} by {value}%',
        'completed {metric} {value}x faster',
      ],
    };
  }

  /**
   * Rewrite weak achievements
   * @param {Object} achievement - Achievement to rewrite
   * @returns {Object} Rewrite suggestions
   */
  rewrite(achievement) {
    if (!achievement || !achievement.text) {
      return this.getEmptyRewrite();
    }

    const original = achievement.text;
    const issues = this.identifyIssues(original);
    const improved = this.generateImproved(original, issues);
    const reason = this.generateReason(original, improved, issues);

    return {
      original,
      improved,
      reason,
      issues,
      confidence: this.calculateConfidence(original, improved),
    };
  }

  /**
   * Identify issues in text
   */
  identifyIssues(text) {
    const issues = [];
    const lower = text.toLowerCase();

    // Check for weak phrases
    for (const [weak, _] of Object.entries(this.weakPhraseReplacements)) {
      if (lower.includes(weak)) {
        issues.push({
          type: 'weak_phrase',
          issue: `Weak phrase: "${weak}"`,
          severity: 'high',
        });
      }
    }

    // Check for weak verbs
    for (const [weak, _] of Object.entries(this.weakVerbs)) {
      if (lower.startsWith(weak)) {
        issues.push({
          type: 'weak_verb',
          issue: `Weak verb: "${weak}"`,
          severity: 'high',
        });
      }
    }

    // Check for missing metrics
    if (!this.hasMetrics(text)) {
      issues.push({
        type: 'missing_metrics',
        issue: 'No quantifiable metrics',
        severity: 'high',
      });
    }

    // Check for vague language
    const vagueTerms = ['various', 'several', 'many', 'some', 'multiple', 'numerous'];
    const vagueFound = vagueTerms.filter(term => lower.includes(term));
    if (vagueFound.length > 0) {
      issues.push({
        type: 'vague_language',
        issue: `Vague terms: ${vagueFound.join(', ')}`,
        severity: 'medium',
      });
    }

    // Check for passive voice
    if (/\b(was|were|been|being)\s+\w+ed\b/i.test(text)) {
      issues.push({
        type: 'passive_voice',
        issue: 'Uses passive voice',
        severity: 'medium',
      });
    }

    return issues;
  }

  /**
   * Generate improved version
   */
  generateImproved(original, issues) {
    let improved = original;

    // Fix weak phrases
    for (const [weak, replacements] of Object.entries(this.weakPhraseReplacements)) {
      if (improved.toLowerCase().includes(weak)) {
        const replacement = replacements[0]; // Use first (strongest) option
        improved = improved.replace(new RegExp(weak, 'i'), replacement);
      }
    }

    // Fix weak verbs at start
    for (const [weak, strong] of Object.entries(this.weakVerbs)) {
      if (improved.toLowerCase().startsWith(weak)) {
        improved = strong + improved.slice(weak.length);
        break;
      }
    }

    // Capitalize first letter
    improved = improved.charAt(0).toUpperCase() + improved.slice(1);

    // Ensure it ends with period
    if (!improved.endsWith('.')) {
      improved += '.';
    }

    return improved;
  }

  /**
   * Generate reason for rewrite
   */
  generateReason(original, improved, issues) {
    const reasons = [];

    if (issues.some(i => i.type === 'weak_phrase' || i.type === 'weak_verb')) {
      reasons.push('Replaced weak language with strong action verbs');
    }

    if (issues.some(i => i.type === 'missing_metrics')) {
      reasons.push('Note: Consider adding quantifiable metrics for stronger impact');
    }

    if (issues.some(i => i.type === 'vague_language')) {
      reasons.push('Note: Replace vague terms with specific numbers');
    }

    if (reasons.length === 0) {
      reasons.push('Enhanced wording for clarity and impact');
    }

    return reasons.join('. ') + '.';
  }

  /**
   * Calculate confidence in rewrite
   */
  calculateConfidence(original, improved) {
    let confidence = 50;

    // Higher confidence if we fixed clear issues
    if (original.toLowerCase() !== improved.toLowerCase()) {
      confidence += 30;
    }

    // Higher confidence if improved starts with strong verb
    const firstWord = improved.split(' ')[0].toLowerCase();
    const allStrongVerbs = Object.values(this.actionVerbsByCategory).flat();
    if (allStrongVerbs.some(v => v.toLowerCase() === firstWord)) {
      confidence += 20;
    }

    return Math.min(100, confidence);
  }

  /**
   * Check if text has metrics
   */
  hasMetrics(text) {
    const patterns = [
      /\d+%/,
      /\$\d+[KMB]?/,
      /\d+[KMB]?\+?/,
      /\d+x/,
    ];

    return patterns.some(pattern => pattern.test(text));
  }

  /**
   * Batch rewrite multiple achievements
   * @param {Array} achievements - List of achievements
   * @returns {Array} Rewritten achievements
   */
  rewriteBatch(achievements) {
    return achievements.map(achievement => ({
      original: achievement.text,
      ...this.rewrite(achievement),
    }));
  }

  /**
   * Suggest alternative action verbs
   * @param {string} text - Original text
   * @returns {Array} Alternative verbs
   */
  suggestActionVerbs(text) {
    const lower = text.toLowerCase();
    const context = this.detectContext(text);
    const verbs = this.actionVerbsByCategory[context] || this.actionVerbsByCategory.development;

    return verbs.slice(0, 5);
  }

  /**
   * Detect context/category of achievement
   */
  detectContext(text) {
    const lower = text.toLowerCase();

    if (/led|managed|directed|team/i.test(lower)) return 'leadership';
    if (/developed|built|created|engineered/i.test(lower)) return 'development';
    if (/improved|optimized|enhanced|increased/i.test(lower)) return 'improvement';
    if (/analyzed|evaluated|assessed|researched/i.test(lower)) return 'analysis';
    if (/managed|coordinated|oversaw/i.test(lower)) return 'management';
    if (/achieved|delivered|exceeded|accomplished/i.test(lower)) return 'achievement';

    return 'development';
  }

  /**
   * Generate multiple rewrite options
   * @param {string} text - Original text
   * @returns {Array} Multiple rewrite options
   */
  generateOptions(text) {
    const options = [];
    const lower = text.toLowerCase();

    // Option 1: Replace weak phrase
    for (const [weak, replacements] of Object.entries(this.weakPhraseReplacements)) {
      if (lower.includes(weak)) {
        for (const replacement of replacements.slice(0, 2)) {
          const option = text.replace(new RegExp(weak, 'i'), replacement);
          options.push({
            text: option.charAt(0).toUpperCase() + option.slice(1),
            approach: `Replace "${weak}" with "${replacement}"`,
            strength: 'high',
          });
        }
        break;
      }
    }

    // Option 2: Add metric placeholder
    if (!this.hasMetrics(text)) {
      options.push({
        text: text + ' (Add specific metric: %, $, or number)',
        approach: 'Add quantifiable metrics',
        strength: 'medium',
      });
    }

    // Option 3: Stronger verb
    const currentVerb = this.extractFirstVerb(text);
    if (currentVerb) {
      const alternatives = this.getAlternativeVerbs(currentVerb);
      for (const alt of alternatives.slice(0, 2)) {
        const option = text.replace(currentVerb, alt);
        options.push({
          text: option,
          approach: `Replace "${currentVerb}" with "${alt}"`,
          strength: 'medium',
        });
      }
    }

    return options.slice(0, 3);
  }

  /**
   * Extract first verb from text
   */
  extractFirstVerb(text) {
    const firstWord = text.split(' ')[0].toLowerCase();
    return firstWord;
  }

  /**
   * Get alternative verbs
   */
  getAlternativeVerbs(verb) {
    const alternatives = {
      'managed': ['Directed', 'Orchestrated', 'Spearheaded'],
      'developed': ['Engineered', 'Architected', 'Built'],
      'created': ['Established', 'Launched', 'Pioneered'],
      'improved': ['Enhanced', 'Optimized', 'Upgraded'],
      'led': ['Directed', 'Orchestrated', 'Championed'],
    };

    return alternatives[verb.toLowerCase()] || ['Led', 'Drove', 'Executed'];
  }

  /**
   * Get empty rewrite
   */
  getEmptyRewrite() {
    return {
      original: '',
      improved: '',
      reason: 'Unable to rewrite - insufficient content',
      issues: [],
      confidence: 0,
    };
  }
}

module.exports = new RewriteEngine();