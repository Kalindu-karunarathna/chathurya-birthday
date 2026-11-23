import { useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { AnimatePresence, motion, useMotionValue, useTransform } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import confetti from 'canvas-confetti'
import CakeScene from '../components/CakeScene'

const NIGHT = 'linear-gradient(180deg, #120a2e 0%, #2d1b69 42%, #7b3fa0 78%, #ff8fc0 100%)'
const DAWN = 'linear-gradient(180deg, #9ec5ff 0%, #d4b0ff 40%, #ffc4dc 74%, #ffe6bd 100%)'
const COLORS = ['#ff6fa5', '#ffd166', '#9ff0d4', '#c9b3ff', '#ffffff']
const TEXT_GLOW = 'drop-shadow-[0_2px_14px_rgba(91,58,110,0.7)]'

export default function Cake() {
  const navigate = useNavigate()
  const holding = useRef(false)
  const progress = useMotionValue(0)
  const burst = useMotionValue(0)
  const ringOpacity = useTransform(progress, [0, 0.03], [0, 1])
  const [wished, setWished] = useState(false)

  useEffect(() => {
    const release = () => (holding.current = false)
    window.addEventListener('pointerup', release)
    window.addEventListener('pointercancel', release)
    return () => {
      window.removeEventListener('pointerup', release)
      window.removeEventListener('pointercancel', release)
    }
  }, [])

  const handleWish = () => {
    setWished(true)
    navigator.vibrate?.([30, 40, 70])
    const shoot = (x, y) =>
      confetti({
        particleCount: 80,
        spread: 100,
        startVelocity: 40,
        origin: { x, y },
        colors: COLORS,
        shapes: ['star'],
        scalar: 1.3,
      })
    shoot(0.5, 0.55)
    setTimeout(() => shoot(0.2, 0.7), 300)
    setTimeout(() => shoot(0.8, 0.7), 500)
  }

  return (
    <div
      className="relative h-full w-full touch-none select-none overflow-hidden"
      onPointerDown={() => (holding.current = true)}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Dawn sits underneath, night fades away on wish */}
      <div className="absolute inset-0" style={{ background: DAWN }} />
      <motion.div
        className="absolute inset-0"
        style={{ background: NIGHT }}
        animate={{ opacity: wished ? 0 : 1 }}
        transition={{ duration: 3, ease: 'easeInOut' }}
      />

      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 3, 11], fov: 40 }} dpr={[1, 1.75]}>
          <CakeScene
            holding={holding}
            progress={progress}
            burst={burst}
            wished={wished}
            onWish={handleWish}
          />
        </Canvas>
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-8 px-6 text-center">
        <AnimatePresence mode="wait">
          {!wished ? (
            <motion.div
              key="before"
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
            >
              <h1 className={`text-5xl font-bold text-white ${TEXT_GLOW}`}>Make a wish, Chathurya</h1>
              <p className={`mt-2 font-hand text-3xl text-[#ffe9a8] ${TEXT_GLOW}`}>
                Press and hold anywhere, and think of something beautiful
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="after"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <h1 className={`text-5xl font-bold text-white ${TEXT_GLOW}`}>Your wish is on its way ✨</h1>
              <p className={`mt-2 font-hand text-3xl text-white ${TEXT_GLOW}`}>
                Happy 23rd Birthday, my love
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="absolute inset-x-0 bottom-8 flex justify-center">
        {!wished ? (
          <div className="pointer-events-none relative flex h-28 w-28 items-center justify-center">
            <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90">
              <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="6" />
              <motion.circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="#ffd1e3"
                strokeWidth="6"
                strokeLinecap="round"
                style={{ pathLength: progress, opacity: ringOpacity }}
              />
            </svg>
            <motion.span
              className="text-4xl"
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              🌠
            </motion.span>
          </div>
        ) : (
          <motion.button
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 2.8, type: 'spring', stiffness: 200, damping: 16 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => navigate('/memories')}
            className="rounded-full bg-berry px-10 py-5 text-2xl font-semibold text-white shadow-xl"
          >
            Our memories 📸
          </motion.button>
        )}
      </div>
    </div>
  )
}