import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Sparkles } from '@react-three/drei'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import confetti from 'canvas-confetti'
import GiftBox from '../components/GiftBox'
import Bubbles from '../components/Bubbles'
import { startMusic } from '../lib/music'

const COLORS = ['#ff6fa5', '#d9c8ff', '#fff3b8', '#c8f5e4', '#ffd9c2']

function burst() {
  const shoot = (x) =>
    confetti({
      particleCount: 70,
      spread: 90,
      startVelocity: 45,
      origin: { x, y: 0.6 },
      colors: COLORS,
    })
  shoot(0.5)
  setTimeout(() => shoot(0.3), 250)
  setTimeout(() => shoot(0.7), 450)
}

export default function Gate() {
  const [opened, setOpened] = useState(false)
  const navigate = useNavigate()

  const handleOpen = () => {
  if (opened) return
  setOpened(true)
  startMusic()
  document.documentElement.requestFullscreen?.().catch(() => {})
  burst()
  setTimeout(() => navigate('/cake'), 2600)
}

  return (
    <div className="relative h-full w-full">
      <Canvas camera={{ position: [0, 1.5, 8], fov: 45 }} dpr={[1, 1.75]}>
        <hemisphereLight args={['#ffffff', '#d9c8ff', 1.1]} />
        <directionalLight position={[4, 6, 5]} intensity={1.6} />
        <Bubbles />
        <Sparkles count={50} scale={[12, 7, 6]} size={7} speed={0.4} color="#ffffff" />
        <Sparkles count={30} scale={[12, 7, 6]} size={5} speed={0.3} color="#ff6fa5" />
        <GiftBox opened={opened} onOpen={handleOpen} />
      </Canvas>

      {/* Text sits on top but lets taps through to the 3D scene */}
      <motion.div
        className="pointer-events-none absolute inset-x-0 top-10 text-center px-6"
        animate={{ opacity: opened ? 0 : 1, y: opened ? -20 : 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-5xl font-bold text-berry drop-shadow-sm">For Chathurya 💖</h1>
        <p className="mt-2 font-hand text-3xl text-plum">I made you something magical</p>
      </motion.div>

      <motion.p
        className="pointer-events-none absolute inset-x-0 bottom-12 text-center text-2xl font-semibold text-plum"
        animate={{ opacity: opened ? 0 : [0.4, 1, 0.4] }}
        transition={opened ? { duration: 0.3 } : { repeat: Infinity, duration: 2 }}
      >
        Tap the gift ✨
      </motion.p>
    </div>
  )
}