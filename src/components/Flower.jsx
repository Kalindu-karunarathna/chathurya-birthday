import { motion } from 'framer-motion'

export default function Flower({ color, center = '#ffd166', w, left, delay = 0, petals = 6 }) {
  return (
    <motion.div
      className="absolute"
      style={{ left, bottom: -12, width: w, transformOrigin: '50% 100%' }}
      initial={{ scaleY: 0, opacity: 0 }}
      animate={{ scaleY: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 90, damping: 12, delay: 0.4 + delay }}
    >
      <motion.svg
        viewBox="0 0 100 200"
        className="block w-full overflow-visible"
        style={{ transformOrigin: '50% 100%' }}
        animate={{ rotate: [-3, 3, -3] }}
        transition={{ repeat: Infinity, duration: 4 + delay, ease: 'easeInOut' }}
      >
        {/* stem and leaves */}
        <path d="M50 68 C47 110 54 150 50 200" stroke="#6fcf97" strokeWidth="5" fill="none" strokeLinecap="round" />
        <path d="M50 150 C30 138 14 146 12 158 C28 166 44 162 50 150 Z" fill="#7ddba0" />
        <path d="M50 125 C70 113 86 121 88 133 C72 141 56 137 50 125 Z" fill="#6fcf97" />

        {/* petals */}
        {Array.from({ length: petals }, (_, i) => {
          const angle = (i * 360) / petals
          return (
            <g key={i} transform={`rotate(${angle} 50 50)`}>
              <ellipse cx="50" cy="29" rx="14" ry="22" fill={color} />
              <ellipse cx="50" cy="31" rx="5" ry="11" fill="white" opacity="0.35" />
            </g>
          )
        })}

        {/* middle */}
        <circle cx="50" cy="50" r="13" fill={center} />
        <circle cx="46" cy="46" r="4" fill="white" opacity="0.5" />
      </motion.svg>
    </motion.div>
  )
}