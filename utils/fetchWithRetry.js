const RETRYABLE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS'])
const RETRY_DELAY_MS = 500

function sleep (ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function request (url, options = {}) {
  const method = (options.method || 'GET').toUpperCase()
  const retries = RETRYABLE_METHODS.has(method) ? 1 : 0

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, { ...options, method })
      if (response.status >= 500 && attempt < retries) {
        await sleep(RETRY_DELAY_MS)
        continue
      }
      return response
    } catch (e) {
      if (attempt < retries) {
        await sleep(RETRY_DELAY_MS)
        continue
      }
      throw e
    }
  }
}
