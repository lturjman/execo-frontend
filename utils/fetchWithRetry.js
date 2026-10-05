const RETRYABLE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS'])
const MAX_RETRIES = 2
const BASE_DELAY_MS = 500

function sleep (ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// Backoff exponentiel avec jitter, pour que six requêtes parallèles qui échouent
// ensemble ne retombent pas en vague au même instant.
function retryDelay (attempt) {
  const exponential = BASE_DELAY_MS * 2 ** attempt
  return exponential + Math.random() * BASE_DELAY_MS
}

export async function request (url, options = {}) {
  const method = (options.method || 'GET').toUpperCase()
  // Les écritures ne sont pas rejouées : le serveur a pu les appliquer partially.
  const retries = RETRYABLE_METHODS.has(method) ? MAX_RETRIES : 0

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, { ...options, method })
      if (response.status >= 500 && attempt < retries) {
        await sleep(retryDelay(attempt))
        continue
      }
      return response
    } catch (e) {
      if (attempt < retries) {
        await sleep(retryDelay(attempt))
        continue
      }
      throw e
    }
  }
}
