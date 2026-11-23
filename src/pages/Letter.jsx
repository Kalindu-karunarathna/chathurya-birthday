import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import confetti from 'canvas-confetti'
import FloatingHearts from '../components/FloatingHearts'
import { greeting, paragraphs, signoff } from '../data/letter'

const DAWN = 'linear-gradient(180deg, #9ec5ff 0%, #d4b0ff 40%, #ffc4dc 74%, #ffe6bd 100%)'
const GLOW = 'drop-shadow-[0_2px_14px_rgba(91,58,110,0.6)]'
const START = 1.0 // seconds before the first paragraph
const STEP = 1.4 // seconds between paragraphs

function heartsBurst() {
  const heart = confetti.shapeFromText?.({ text: '💖', scalar: 2 })
  const opts = {
    particleCount: 35,
    spread: 80,
    startVelocity: 35,
    scalar: 2,
    shapes: heart ? [heart] : ['circle'],
    colors: ['#ff6fa5', '#ffb3d1', '#c9b3ff', '#ffd166'],
  }
  confetti({ ...opts, origin: { x: 0.5, y: 0.6 } })
  setTimeout(() => confetti({ ...opts, origin: { x: 0.25, y: 0.7 } }), 250)
  setTimeout(() => confetti({ ...opts, origin: { x: 0.75, y: 0.7 } }), 450)
}

export default function Letter() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [flapBehind, setFlapBehind] = useState(false)
  const [reading, setReading] = useState(false)
  const paraRefs = useRef([])
  const endRef = useRef(null)

  const handleOpen = () => {
    if (open) return
    setOpen(true)
    navigator.vibrate?.(30)
    heartsBurst()
    setTimeout(() => setFlapBehind(true), 350)
    setTimeout(() => setReading(true), 2300)
  }

  // Keep the newest paragraph in view if the letter is taller than the screen
  useEffect(() => {
    if (!reading) return
    const timers = paragraphs.map((_, i) =>
      setTimeout(
        () => paraRefs.current[i]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }),
        (START + i * STEP) * 1000 + 300
      )
    )
    timers.push(
      setTimeout(
        () => endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }),
        (START + (paragraphs.length + 1) * STEP) * 1000 + 600
      )
    )
    return () => timers.forEach(clearTimeout)
  }, [reading])

  return (
    <div className="relative h-full w-full overflow-hidden select-none" style={{ background: DAWN }}>
      <div className="pointer-events-none absolute inset-0">
        <FloatingHearts />
      </div>

      {/* Envelope stage */}
      {!reading && (
        <motion.div
          className="pointer-events-none absolute inset-x-0 top-8 px-6 text-center"
          animate={{ opacity: open ? 0 : 1 }}
        >
          <h1 className={`text-5xl font-bold text-white ${GLOW}`}>A letter for you 💌</h1>
          <p className={`mt-1 font-hand text-3xl text-white ${GLOW}`}>Tap the seal to open it</p>
        </motion.div>
      )}

      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="relative"
          style={{ width: 'min(82vw, 640px)', aspectRatio: '3 / 2', perspective: 1200 }}
          animate={
            reading
              ? { y: 260, opacity: 0, scale: 0.9 }
              : open
              ? { y: 0 }
              : { y: [0, -10, 0], rotate: [-1, 1, -1] }
          }
          transition={
            reading
              ? { duration: 0.6 }
              : open
              ? { duration: 0.4 }
              : { repeat: Infinity, duration: 4, ease: 'easeInOut' }
          }
        >
          {/* Back of the envelope */}
          <div className="absolute inset-0 rounded-xl bg-[#ff9ac1] shadow-[0_20px_40px_rgba(91,58,110,0.35)]" />

          {/* Paper sliding out */}
          <motion.div
            className="absolute rounded-md bg-[#fffaf0] shadow-md"
            style={{ left: '5%', top: '6%', width: '90%', height: '88%', zIndex: 2 }}
            animate={{ y: open ? '-62%' : '0%' }}
            transition={{ delay: 0.7, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="space-y-3 p-6 opacity-30">
              <div className="h-2 w-2/5 rounded-full bg-berry" />
              <div className="h-2 w-full rounded-full bg-plum" />
              <div className="h-2 w-4/5 rounded-full bg-plum" />
              <div className="h-2 w-11/12 rounded-full bg-plum" />
            </div>
          </motion.div>

          {/* Front pocket */}
          <div
            className="absolute inset-0 rounded-xl"
            style={{
              zIndex: 3,
              background: 'linear-gradient(160deg, #ffb3d1, #ff9ac1)',
              clipPath: 'polygon(0 0, 50% 55%, 100% 0, 100% 100%, 0 100%)',
            }}
          />
          <div
            className="absolute inset-0"
            style={{ zIndex: 3, background: '#ffc4dc', clipPath: 'polygon(0 100%, 50% 55%, 100% 100%)' }}
          />

          {/* Flap */}
          <motion.div
            className="absolute left-0 top-0 w-full"
            style={{
              height: '55%',
              transformOrigin: 'top',
              zIndex: flapBehind ? 1 : 4,
              background: 'linear-gradient(180deg, #ff8fbd, #ffa8cc)',
              clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
            }}
            animate={{ rotateX: open ? 180 : 0 }}
            transition={{ duration: 0.7, ease: 'easeInOut' }}
          />

          {/* Wax seal */}
          <div className="absolute left-1/2 top-[55%] z-[5] -translate-x-1/2 -translate-y-1/2">
            <motion.button
              aria-label="Open the letter"
              onClick={handleOpen}
              className="flex aspect-square items-center justify-center rounded-full text-3xl text-white shadow-lg"
              style={{
                width: 'clamp(60px, 10vmin, 88px)',
                background: 'radial-gradient(circle at 30% 30%, #ff8fb0, #e0245e)',
              }}
              animate={open ? { scale: 1.8, opacity: 0 } : { scale: [1, 1.12, 1] }}
              transition={open ? { duration: 0.35 } : { repeat: Infinity, duration: 1.6 }}
              whileTap={{ scale: 0.9 }}
            >
              ♥
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* The letter itself */}
      {reading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center p-4">
          <motion.div
            className="max-h-full w-[min(92vw,800px)] touch-pan-y overflow-y-auto rounded-3xl border-4 border-white/70 bg-[#fffaf2] shadow-[0_25px_60px_rgba(91,58,110,0.45)]"
            style={{ padding: 'clamp(20px, 4.5vmin, 48px)' }}
            initial={{ scale: 0.5, y: 140, rotate: -3, opacity: 0 }}
            animate={{ scale: 1, y: 0, rotate: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 120, damping: 16 }}
          >
            <motion.h2
              className="font-hand font-bold text-berry"
              style={{ fontSize: 'clamp(32px, 6vmin, 52px)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {greeting}
            </motion.h2>

            {paragraphs.map((text, i) => (
              <motion.p
                key={i}
                ref={(el) => (paraRefs.current[i] = el)}
                className="mt-[1em] font-hand text-plum"
                style={{ fontSize: 'clamp(22px, 3.4vmin, 32px)', lineHeight: 1.35 }}
                initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ delay: START + i * STEP, duration: 0.9 }}
              >
                {text}
              </motion.p>
            ))}

            <motion.div
              className="mt-6 font-hand font-bold text-berry"
              style={{ fontSize: 'clamp(28px, 5vmin, 44px)', lineHeight: 1.2 }}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: START + paragraphs.length * STEP, duration: 0.9 }}
            >
              {signoff.map((line) => (
                <div key={line}>{line}</div>
              ))}
            </motion.div>

            <motion.div
              ref={endRef}
              className="mt-8 flex justify-center pb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: START + (paragraphs.length + 1) * STEP, type: 'spring', stiffness: 200, damping: 16 }}
            >
              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={() => navigate('/finale')}
                className="rounded-full bg-berry px-10 py-5 text-2xl font-semibold text-white shadow-xl"
              >
                One last surprise 🌟
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      )}
    </div>
  )
}