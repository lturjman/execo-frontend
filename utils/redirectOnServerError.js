export function redirectToErrorPage (reason = 'server') {
  window.location.href = `/error?reason=${reason}`
  return true
}

export function redirectOnServerError (response) {
  if (response && response.status >= 500) {
    redirectToErrorPage('server')
    return true
  }
  return false
}

export function redirectOnNetworkError () {
  return redirectToErrorPage('network')
}
