import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function PlaceholderPage({ emoji, title, next, label }) {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-8 text-center px-6">
      <motion.div
        className="text-8xl"
        animate={{ y: [0, -16, 0] }}
        transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
      >
        {emoji}
      </motion.div>
      <h1 className="text-5xl font-bold text-berry">{title}</h1>
      <motion.div whileTap={{ scale: 0.92 }} whileHover={{ scale: 1.05 }}>
        <Link
          to={next}
          className="inline-block rounded-full bg-berry px-10 py-5 text-2xl font-semibold text-white shadow-lg"
        >
          {label}
        </Link>
      </motion.div>
    </div>
  )
}