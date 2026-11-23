import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Float, Stars, Sparkles } from '@react-three/drei'
import * as THREE from 'three'
import CakeModel from './CakeModel'
import ParticleRing from './ParticleRing'
import Balloons from './Balloons'

const HOLD_SECONDS = 2.2

export default function CakeScene({ holding, progress, burst, wished, onWish }) {
  const hold = useRef(0)
  const fired = useRef(false)
  const spin = useRef()
  const { viewport } = useThree()

  useFrame((state, dt) => {
    // Hold-to-wish logic
    if (!fired.current) {
      hold.current = holding.current
        ? Math.min(HOLD_SECONDS, hold.current + dt)
        : Math.max(0, hold.current - dt * 1.8)
      progress.set(hold.current / HOLD_SECONDS)
      if (hold.current >= HOLD_SECONDS) {
        fired.current = true
        burst.set(1)
        onWish()
      }
    } else {
      progress.set(THREE.MathUtils.damp(progress.get(), 0, 3, dt))
    }

    // Camera parallax follows the finger
    const { camera, pointer } = state
    camera.position.x = THREE.MathUtils.damp(camera.position.x, pointer.x * 1.2, 2.5, dt)
    camera.position.y = THREE.MathUtils.damp(camera.position.y, 3 + pointer.y * 0.5, 2.5, dt)
    camera.lookAt(0, 1.7, 0)

    spin.current.rotation.y += dt * 0.2
  })

  // Shrink the cake on narrow (portrait) screens
  const fit = THREE.MathUtils.clamp(viewport.width / 8.2, 0.55, 1)

  return (
    <>
      <hemisphereLight args={['#c9b8ff', '#3b1d6b', 0.9]} />
      <directionalLight position={[4, 6, 6]} intensity={1.1} color="#ffd9ec" />

      <Stars radius={40} depth={40} count={1800} factor={4} saturation={0.9} fade speed={1.2} />
      <Sparkles count={60} scale={[14, 8, 8]} position={[0, 3, 0]} size={6} speed={0.35} color="#ffe9a8" />
      <Sparkles count={40} scale={[14, 8, 8]} position={[0, 3, 0]} size={5} speed={0.3} color="#ff9ad5" />

      <group scale={fit}>
        <Float speed={1.4} floatIntensity={0.5} rotationIntensity={0.08}>
          <group ref={spin}>
            <CakeModel progress={progress} out={wished} />
          </group>
        </Float>
        <ParticleRing progress={progress} burst={burst} />
      </group>

      <Balloons active={wished} />
    </>
  )
}