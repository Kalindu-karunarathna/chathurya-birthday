import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import FloatingHearts from '../components/FloatingHearts'
import Polaroid, { PhotoImage } from '../components/Polaroid'
import { memories, slots } from '../data/memories'

const DAWN = 'linear-gradient(180deg, #9ec5ff 0%, #d4b0ff 40%, #ffc4dc 74%, #ffe6bd 100%)'
const GLOW = 'drop-shadow-[0_2px_14px_rgba(91,58,110,0.6)]'

export default function Memories() {
  const navigate = useNavigate()
  const bounds = useRef(null)
  const items = memories.slice(0, slots.length)
  const [z, setZ] = useState(() => items.map((_, i) => i + 1))
  const [active, setActive] = useState(null)

  const bringToFront = (index) =>
    setZ((prev) => {
      const next = [...prev]
      next[index] = Math.max(...prev) + 1
      return next
    })

  return (
    <div className="relative h-full w-full touch-none select-none overflow-hidden" style={{ background: DAWN }}>
      <div className="pointer-events-none absolute inset-0">
        <FloatingHearts />
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-6 z-[500] px-6 text-center">
        <h1 className={`text-5xl font-bold text-white ${GLOW}`}>Our little memories 📸</h1>
        <p className={`mt-1 font-hand text-3xl text-white ${GLOW}`}>Drag them around, tap one to look closer</p>
      </div>

      <div ref={bounds} className="absolute inset-0">
        {items.map((m, i) => (
          <Polaroid
            key={i}
            memory={m}
            index={i}
            slot={slots[i]}
            z={z[i]}
            bounds={bounds}
            onFront={() => bringToFront(i)}
            onOpen={() => setActive(i)}
          />
        ))}
      </div>

      <div className="absolute inset-x-0 bottom-6 z-[500] flex justify-center">
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, type: 'spring', stiffness: 200, damping: 16 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => navigate('/letter')}
          className="rounded-full bg-berry px-10 py-5 text-2xl font-semibold text-white shadow-xl"
        >
          A letter for you 💌
        </motion.button>
      </div>

      <AnimatePresence>
        {active !== null && (
          <motion.div
            className="absolute inset-0 z-[1000] flex items-center justify-center bg-[rgba(60,30,90,0.45)] p-6 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
          >
            <motion.div
              className="rounded-md bg-white p-4 pb-6 shadow-2xl"
              style={{ width: 'min(86vw, 58vh)' }}
              initial={{ scale: 0.7, rotate: -6, y: 40 }}
              animate={{ scale: 1, rotate: -2, y: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 220, damping: 18 }}
            >
              <div className="aspect-square overflow-hidden rounded-sm">
                <PhotoImage src={items[active].src} alt={items[active].title} />
              </div>
              <h2 className="mt-4 text-center font-hand text-4xl font-bold text-berry">{items[active].title}</h2>
              <p className="mt-1 text-center font-hand text-2xl text-plum">{items[active].note}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}