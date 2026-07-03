const crypto = require('crypto');

function deterministicScore(seed, min = 60, max = 100) {
  const hash = crypto.createHash('sha256').update(String(seed)).digest('hex')
  const num = parseInt(hash.substring(0, 8), 16)
  return Math.floor(min + (num % (max - min + 1)))
}

function deterministicSeed(content, suffix = '') {
  const normalized = String(content || '').toLowerCase().replace(/\s+/g, ' ').trim()
  const hash = crypto.createHash('sha256').update(normalized + '|' + suffix).digest('hex')
  return hash
}

module.exports = { deterministicScore, deterministicSeed }
