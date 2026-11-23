const VOLUME = 0.55

let audio = null
let muted = false
let fadeId = 0
let resumeAfterHidden = false
const listeners = new Set()

const emit = () => listeners.forEach((l) => l())

function getAudio() {
  if (!audio) {
    audio = new Audio(`${import.meta.env.BASE_URL}music.mp3`)
    audio.loop = true
    audio.preload = 'auto'
    audio.volume = 0
    audio.addEventListener('play', emit)
    audio.addEventListener('pause', emit)
  }
  return audio
}

function fadeTo(target, ms) {
  const a = getAudio()
  const from = a.volume
  const begin = performance.now()
  const id = ++fadeId
  const step = (now) => {
    if (id !== fadeId) return
    const t = Math.min(1, (now - begin) / ms)
    a.volume = from + (target - from) * t
    if (t < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

// Creates the audio element early so the file can download before she taps the gift
export function preloadMusic() {
  getAudio()
}

// Must be called from a tap or click (browsers block autoplay otherwise)
export function startMusic() {
  const a = getAudio()
  if (!a.paused) return
  a.play()
    .then(() => fadeTo(muted ? 0 : VOLUME, 2000))
    .catch(() => {})
}

export function toggleMusic() {
  const a = getAudio()
  if (a.paused) {
    muted = false
    startMusic()
  } else {
    muted = !muted
    fadeTo(muted ? 0 : VOLUME, 400)
  }
  emit()
}

export const subscribe = (cb) => {
  listeners.add(cb)
  return () => listeners.delete(cb)
}

export const getStatus = () => (!audio || audio.paused ? 'off' : muted ? 'muted' : 'on')

// Pause when she switches apps or locks the tablet, resume when she returns
if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (!audio) return
    if (document.hidden) {
      resumeAfterHidden = !audio.paused
      audio.pause()
    } else if (resumeAfterHidden) {
      resumeAfterHidden = false
      audio.play().catch(() => {})
    }
  })
}