import { useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Stars, Sparkles } from '@react-three/drei'
import * as THREE from 'three'
import { AnimatePresence, motion, useAnimationControls } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import confetti from 'canvas-confetti'
import Fireworks from '../components/Fireworks'

const NIGHT = 'linear-gradient(180deg, #120a2e 0%, #2d1b69 42%, #7b3fa0 78%, #ff8fc0 100%)'
const GLOW = 'drop-shadow-[0_2px_14px_rgba(91,58,110,0.7)]'

function Moon() {
  return (
    <group position={[-4.2, 3.4, -8]}>
      <mesh>
        <sphereGeometry args={[1.1, 32, 32]} />
        <meshBasicMaterial color="#fff6d6" toneMapped={false} />
      </mesh>
      <mesh scale={1.9}>
        <sphereGeometry args={[1.1, 32, 32]} />
        <meshBasicMaterial
          color="#ffe9a8"
          transparent
          opacity={0.16}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}

export default function Finale() {
  const navigate = useNavigate()
  const fireRef = useRef(null)
  const timers = useRef([])
  const controls = useAnimationControls()
  const [phase, setPhase] = useState('wish') // wish -> show -> done

  const later = (fn, ms) => timers.current.push(setTimeout(fn, ms))

  useEffect(() => {
    const list = timers.current
    return () => list.forEach(clearTimeout)
  }, [])

  const launch = (nx) => {
    setPhase('show')
    const fire = (x, y, o) => fireRef.current?.(x, y, o)
    const seq = [
      [700, nx, 0.45, { palette: 0 }],
      [1500, -0.55, 0.25, { palette: 1 }],
      [2100, 0.55, 0.35, { palette: 3 }],
      [2700, -0.25, 0.5, { palette: 2 }],
      [3200, 0.3, 0.1, { palette: 1 }],
      [3900, 0, 0.25, { palette: 4, shape: 'heart' }],
    ]
    seq.forEach(([t, x, y, o]) => later(() => fire(x, y, o), t))
    later(() => setPhase('done'), 4400)
  }

  const handleDragEnd = (_, info) => {
    const passed = -info.offset.y > window.innerHeight * 0.3 || info.velocity.y < -900
    if (passed) {
      navigator.vibrate?.([30, 40, 80])
      controls.start({
        y: -window.innerHeight,
        scale: 0.3,
        opacity: 0,
        transition: { duration: 0.7, ease: 'easeIn' },
      })
      launch((info.point.x / window.innerWidth) * 2 - 1)
    } else {
      controls.start({ x: 0, y: 0, transition: { type: 'spring', stiffness: 250, damping: 18 } })
    }
  }

  // Once the show is done: random fireworks forever, plus a rain of stars
  useEffect(() => {
    if (phase !== 'done') return
    confetti({
      particleCount: 70,
      spread: 160,
      origin: { y: 0 },
      gravity: 0.6,
      scalar: 1.3,
      shapes: ['star'],
      colors: ['#ffd166', '#ff9ac1', '#ffffff', '#c9b3ff'],
    })
    const id = setInterval(() => {
      const heart = Math.random() < 0.15
      fireRef.current?.(Math.random() * 1.6 - 0.8, Math.random() * 0.5 - 0.05, {
        z: -2 - Math.random() * 3,
        palette: Math.floor(Math.random() * 5),
        shape: heart ? 'heart' : 'sphere',
      })
    }, 1400)
    return () => clearInterval(id)
  }, [phase])

  const handleSky = (e) => {
    if (phase !== 'done') return
    fireRef.current?.(
      (e.clientX / window.innerWidth) * 2 - 1,
      1 - (e.clientY / window.innerHeight) * 2,
      { palette: Math.floor(Math.random() * 5) }
    )
  }

  return (
    <div
      className="relative h-full w-full touch-none select-none overflow-hidden"
      style={{ background: NIGHT }}
      onPointerDown={handleSky}
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 0, 10], fov: 50 }} dpr={[1, 1.75]}>
          <Stars radius={50} depth={50} count={2200} factor={4} saturation={0.9} fade speed={1.2} />
          <Sparkles count={60} scale={[16, 9, 6]} size={6} speed={0.35} color="#ffe9a8" />
          <Moon />
          <Fireworks fireRef={fireRef} />
        </Canvas>
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-8 px-6 text-center">
        <AnimatePresence mode="wait">
          {phase === 'wish' && (
            <motion.div key="wish" initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <h1 className={`text-5xl font-bold text-white ${GLOW}`}>Wish upon a star ⭐</h1>
              <p className={`mt-2 font-hand text-3xl text-[#ffe9a8] ${GLOW}`}>
                Drag the star up into the sky
              </p>
            </motion.div>
          )}
          {phase === 'done' && (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.7, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 110, damping: 14 }}
            >
              <motion.h1
                className="font-bold"
                style={{
                  fontSize: 'clamp(40px, 9vmin, 84px)',
                  lineHeight: 1.1,
                  backgroundImage: 'linear-gradient(90deg, #ffd166, #fff3b8, #ff9ac1, #ffd166)',
                  backgroundSize: '200% 100%',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                  filter: 'drop-shadow(0 0 18px rgba(255,214,102,0.55))',
                }}
                animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                transition={{ repeat: Infinity, duration: 5, ease: 'linear' }}
              >
                Happy Birthday, Chathurya! 🎂
              </motion.h1>
              <p className={`mt-3 font-hand text-4xl text-white ${GLOW}`}>May every wish you make come true ✨</p>
              <p className="mt-2 font-hand text-2xl text-[#ffe9a8]">Tap the sky for more fireworks</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* The wishing star */}
      {phase !== 'done' && (
        <>
          {phase === 'wish' && (
            <motion.div
              className="pointer-events-none absolute inset-x-0 bottom-36 text-center font-hand text-3xl text-white"
              animate={{ y: [0, -14, 0], opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.8 }}
            >
              swipe up ↑
            </motion.div>
          )}
          <motion.div
            drag={phase === 'wish'}
            dragElastic={0.2}
            dragMomentum={false}
            animate={controls}
            onDragEnd={handleDragEnd}
            whileTap={{ scale: 1.15 }}
            className="absolute bottom-8 left-1/2 -ml-14 flex h-28 w-28 items-center justify-center"
            style={{ touchAction: 'none', filter: 'drop-shadow(0 0 24px rgba(255,214,102,0.95))' }}
          >
            <motion.span
              className="text-8xl"
              animate={{ scale: [1, 1.12, 1], rotate: [-6, 6, -6] }}
              transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
            >
              🌟
            </motion.span>
          </motion.div>
        </>
      )}

      {phase === 'done' && (
        <motion.div
          className="absolute inset-x-0 bottom-8 flex flex-wrap justify-center gap-4 px-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, type: 'spring', stiffness: 200, damping: 16 }}
        >
          <motion.button
            whileTap={{ scale: 0.92 }}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => navigate('/letter')}
            className="rounded-full border border-white/60 bg-white/20 px-8 py-4 text-xl font-semibold text-white backdrop-blur"
          >
            Read the letter again 💌
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.92 }}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => navigate('/')}
            className="rounded-full bg-berry px-10 py-4 text-xl font-semibold text-white shadow-xl"
          >
            Replay 💖
          </motion.button>
        </motion.div>
      )}
    </div>
  )
}