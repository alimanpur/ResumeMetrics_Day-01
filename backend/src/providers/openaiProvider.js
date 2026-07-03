const AIProvider = require('./aiProvider');

class OpenAIProvider extends AIProvider {
  constructor() {
    super('openai');
  }

  async analyzeResume(resumeContent, options = {}) {
    // TODO: Implement actual OpenAI integration
    throw new Error('OpenAI provider not yet configured');
  }

  async compareResumeWithJob(resumeContent, jobDescription, options = {}) {
    throw new Error('OpenAI provider not yet configured');
  }

  async healthCheck() {
    return false;
  }
}

module.exports = OpenAIProvider;