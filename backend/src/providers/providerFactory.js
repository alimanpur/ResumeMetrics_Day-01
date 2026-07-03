const MockAIProvider = require('./mockProvider');
const OpenAIProvider = require('./openaiProvider');
const env = require('../config/env');

/**
 * Provider factory for AI analysis.
 * To add a new provider, create a new file in providers/ and add it to the factory.
 * No service changes needed.
 */
const providers = {
  mock: MockAIProvider,
  openai: OpenAIProvider,
};

let cachedProvider = null;

const getAIProvider = () => {
  if (cachedProvider) return cachedProvider;

  // Use environment variable to select provider, default to mock
  const providerName = env.AI_PROVIDER || 'mock';
  const ProviderClass = providers[providerName];

  if (!ProviderClass) {
    const availableProviders = Object.keys(providers).join(', ');
    throw new Error(`AI provider "${providerName}" not found. Available: ${availableProviders}`);
  }

  cachedProvider = new ProviderClass();
  return cachedProvider;
};

const listProviders = () => Object.keys(providers);

module.exports = { getAIProvider, listProviders };