import { useSyncExternalStore } from 'react'
import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { subscribe, getStatus, toggleMusic } from '../lib/music'

export default function MusicButton() {
  const status = useSyncExternalStore(subscribe, getStatus)
  const { pathname } = useLocation()

  // The gift gate has its own "tap" moment that starts the music
  if (pathname === '/') return null

  const on = status === 'on'

  return (
    <motion.button
      aria-label={on ? 'Mute music' : 'Play music'}
      onClick={toggleMusic}
      whileTap={{ scale: 0.88 }}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed right-4 top-4 z-[2000] flex h-14 w-14 items-center justify-center rounded-full border border-white/60 bg-white/25 text-2xl shadow-lg backdrop-blur"
    >
      {on ? '🔊' : '🔇'}
    </motion.button>
  )
}