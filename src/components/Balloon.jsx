import { useId } from 'react'
import { motion } from 'framer-motion'

export default function Balloon({ color, light, w, left, top, delay = 0, released = false }) {
  const id = 'b' + useId().replace(/[^a-zA-Z0-9]/g, '')

  return (
    <motion.div
      className="absolute"
      style={{ left, top, width: w }}
      initial={{ y: 120, opacity: 0 }}
      animate={released ? { y: -1500, opacity: 1 } : { y: 0, opacity: 1 }}
      transition={
        released
          ? { duration: 2.6, delay: delay * 0.6, ease: 'easeIn' }
          : { type: 'spring', stiffness: 60, damping: 12, delay: 0.3 + delay }
      }
    >
      <motion.svg
        viewBox="0 0 100 190"
        className="block w-full overflow-visible"
        style={{ transformOrigin: '50% 100%' }}
        animate={{ y: [0, -14, 0], rotate: [-3, 3, -3] }}
        transition={{ repeat: Infinity, duration: 3.6 + delay, ease: 'easeInOut' }}
      >
        <defs>
          <radialGradient id={id} cx="35%" cy="30%" r="75%">
            <stop offset="0" stopColor={light} />
            <stop offset="1" stopColor={color} />
          </radialGradient>
        </defs>
        {/* string */}
        <path d="M50 136 C42 150 58 164 50 188" stroke="rgba(91,58,110,0.35)" strokeWidth="1.6" fill="none" />
        {/* body */}
        <path
          d="M50 4 C20 4 6 30 6 56 C6 90 32 118 50 126 C68 118 94 90 94 56 C94 30 80 4 50 4 Z"
          fill={`url(#${id})`}
        />
        {/* shine */}
        <ellipse cx="31" cy="36" rx="8" ry="15" fill="white" opacity="0.5" transform="rotate(22 31 36)" />
        {/* knot */}
        <path d="M50 124 L43 136 L57 136 Z" fill={color} />
      </motion.svg>
    </motion.div>
  )
}