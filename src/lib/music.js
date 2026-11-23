let audio

export function startMusic() {
  if (!audio) {
    audio = new Audio(`${import.meta.env.BASE_URL}music.mp3`)
    audio.loop = true
    audio.volume = 0.5
  }
  audio.play().catch(() => {})
}