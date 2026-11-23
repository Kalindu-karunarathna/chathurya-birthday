let lock = null
let started = false

async function request() {
  try {
    if ('wakeLock' in navigator && document.visibilityState === 'visible') {
      lock = await navigator.wakeLock.request('screen')
      lock.addEventListener('release', () => {
        lock = null
      })
    }
  } catch {
    // Not supported or denied: the site still works normally
  }
}

export function keepScreenAwake() {
  if (started) return
  started = true
  request()
  // The lock is released when the tab is hidden, so ask again when she returns
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && !lock) request()
  })
  // Retry on her first tap in case the first request was refused
  window.addEventListener('pointerdown', () => !lock && request(), { once: true })
}