import { motion } from 'framer-motion'

const variants = {
  initial: { opacity: 0, scale: 0.92, filter: 'blur(12px)' },
  animate: { opacity: 1, scale: 1, filter: 'blur(0px)' },
  exit: { opacity: 0, scale: 1.05, filter: 'blur(12px)' },
}

export default function PageTransition({ children }) {
  return (
    <motion.div
      className="h-full w-full"
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  )
}