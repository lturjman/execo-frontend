import { request } from './fetchWithRetry'
import {
  clearFailure,
  recordFailure
} from './apiFailureStore'

// Une réponse synthétique pour les échecs réseau : les ~40 appelants font tous
// `if (!response.ok)` puis `response.json()`, donc renvoyer undefined les
// faisait tous planter sur une TypeError.
function networkFailureResponse () {
  return {
    ok: false,
    status: 0,
    statusText: 'Network Error',
    json: async () => ({ status: 'error', message: 'Network Error' }),
    text: async () => '',
    headers: new Map()
  }
}

let redirectingToLogin = false

export const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem('token')
  const method = (options.method || 'GET').toUpperCase()

  // Les headers sont fusionnés ici et non dans l'appelant pour que le rejeu
  // par retryAll n'accumule pas un jeton périmé dans options.headers.
  const headers = {
    ...(options.headers || {}),
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
  const replayableOptions = { ...options, headers }

  let response
  try {
    response = await request(url, replayableOptions)
  } catch {
    recordFailure({ method, url, options: replayableOptions, kind: 'network', status: 0 })
    return networkFailureResponse()
  }

  if (response.status >= 500) {
    recordFailure({
      method,
      url,
      options: replayableOptions,
      kind: 'server',
      status: response.status
    })
    return response
  }

  clearFailure(method, url)

  // Garde anti-boucle : une page de groupe tire 6 requêtes en parallèle, et
  // chacune redirigeait vers /auth/login.
  if (response.status === 401 || response.status === 403) {
    if (!redirectingToLogin) {
      redirectingToLogin = true
      window.location.href = '/auth/login'
    }
    return response
  }

  return response
}
