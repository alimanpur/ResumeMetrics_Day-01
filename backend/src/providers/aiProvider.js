/**
 * @typedef {Object} AIAnalysisResult
 * @property {number} atsScore
 * @property {Object} keywordMatch
 * @property {Object} formattingAnalysis
 * @property {Object} semanticAnalysis
 * @property {Array} improvementSuggestions
 * @property {Object} roleMatch
 * @property {string} summary
 * @property {number} score
 */

/**
 * @typedef {Object} AIProvider
 * @property {function(string, Object): Promise<AIAnalysisResult>} analyzeResume
 * @property {function(string, string, Object): Promise<Object>} compareResumeWithJob
 * @property {function(): Promise<boolean>} healthCheck
 * @property {string} name
 */

/**
 * Abstract base AI provider - all providers must implement these methods
 */
class AIProvider {
  constructor(name) {
    this.name = name;
    if (new.target === AIProvider) {
      throw new Error('AIProvider is abstract and cannot be instantiated directly');
    }
  }

  async analyzeResume(resumeContent, options = {}) {
    throw new Error('analyzeResume must be implemented by subclass');
  }

  async compareResumeWithJob(resumeContent, jobDescription, options = {}) {
    throw new Error('compareResumeWithJob must be implemented by subclass');
  }

  async healthCheck() {
    throw new Error('healthCheck must be implemented by subclass');
  }
}

module.exports = AIProvider;