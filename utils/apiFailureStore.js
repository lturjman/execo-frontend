'use client'

// Registre des requêtes API en échec.
//
// Rôle : une erreur réseau ou un 5xx est une panne *récupérable par requête*.
// On les enregistre ici au lieu de rediriger vers /error, ce qui relevait d'une
// panne de transport d'une erreur fatale de l'application et vidait l'état du
// store à chaque appel.

// Seuils d'escalade vers /error. Un blip isolé ne doit pas y mener : seule une
// panne soutenue du backend le justifie.
export const ESCALATION_FAILURE_THRESHOLD = 5
export const ESCALATION_WINDOW_MS = 15000

const listeners = new Set()

const state = {
  // method + url -> { method, url, options, kind, status, at }
  failures: new Map(),
  // timestamps des échecs récents, pour la fenêtre glissante
  recent: [],
  // Une escalade est définitive pour le cycle de vie de l'onglet.
  escalated: false
}

function keyOf (method, url) {
  return `${method} ${url}`
}

function emit () {
  for (const listener of listeners) listener(getSnapshot())
}

const FAILURE_TTL_MS = 30000

function pruneExpired (now) {
  for (const [key, failure] of state.failures) {
    if (now - failure.at > FAILURE_TTL_MS) state.failures.delete(key)
  }
}

export function getSnapshot () {
  const now = Date.now()
  pruneExpired(now)

  const failures = [...state.failures.values()]

  return {
    failures,
    isNetworkDown: failures.some((failure) => failure.kind === 'network')
  }
}

export function subscribe (listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function recordFailure ({ method, url, options, kind, status }) {
  const now = Date.now()

  state.failures.set(keyOf(method, url), {
    method,
    url,
    options,
    kind,
    status,
    at: now
  })

  state.recent = state.recent.filter((at) => now - at < ESCALATION_WINDOW_MS)
  state.recent.push(now)

  emit()

  maybeEscalate()
}

export function clearFailure (method, url) {
  if (state.failures.delete(keyOf(method, url))) emit()
}

// Masque la bannière sans résoudre la panne : les compteurs d'escalade sont
// conservés, sinon un simple "Ignorer" réinitialiserait le seuil.
export function clearAll () {
  state.failures.clear()
  emit()
}

// Rejoue les requêtes échouées via le fetcher fourni, pour éviter une
// dépendance circulaire entre ce module et fetchWithAuth.
export async function retryAll (fetcher) {
  pruneExpired(Date.now())
  const pending = [...state.failures.values()]
  if (pending.length === 0) return

  await Promise.allSettled(
    pending.map((failure) =>
      fetcher(failure.url, { ...failure.options, method: failure.method })
    )
  )
}

function maybeEscalate () {
  if (state.escalated) return
  if (typeof window === 'undefined') return
  if (state.recent.length < ESCALATION_FAILURE_THRESHOLD) return

  state.escalated = true
  // Différé : la redirection part d'une tâche pour ne pas interrompre le rendu
  // en cours ni masquer l'action que l'utilisateur vient de déclencher.
  setTimeout(() => {
    window.location.href = '/error?reason=server'
  }, 0)
}
