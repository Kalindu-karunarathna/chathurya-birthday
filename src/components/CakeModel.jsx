import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const TAU = Math.PI * 2

const ring = (count, radius, y, offset = 0) =>
  Array.from({ length: count }, (_, i) => {
    const a = (i / count) * TAU + offset
    return { i, pos: [Math.cos(a) * radius, y, Math.sin(a) * radius] }
  })

function Tier({ radius, height, y, sponge, icing, pearls }) {
  const drips = Math.round(radius * 9)
  return (
    <group position={[0, y, 0]}>
      <mesh position={[0, height / 2, 0]}>
        <cylinderGeometry args={[radius, radius, height, 64]} />
        <meshStandardMaterial color={sponge} roughness={0.7} />
      </mesh>
      <mesh position={[0, height, 0]}>
        <cylinderGeometry args={[radius + 0.06, radius + 0.06, 0.2, 64]} />
        <meshStandardMaterial color={icing} roughness={0.35} />
      </mesh>
      {ring(drips, radius + 0.04, height, 0.2).map(({ i, pos }) => {
        const len = 0.12 + ((i * 37) % 5) * 0.07
        return (
          <mesh key={`d${i}`} position={[pos[0], height - len / 2 + 0.02, pos[2]]}>
            <capsuleGeometry args={[0.07, len, 6, 10]} />
            <meshStandardMaterial color={icing} roughness={0.35} />
          </mesh>
        )
      })}
      {ring(pearls, radius + 0.02, 0.1).map(({ i, pos }) => (
        <mesh key={`p${i}`} position={pos}>
          <sphereGeometry args={[0.11, 16, 16]} />
          <meshStandardMaterial color={icing} roughness={0.3} />
        </mesh>
      ))}
    </group>
  )
}

function Candle({ position, color, progress, out, seed }) {
  const flame = useRef()

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime
    const flicker = 1 + Math.sin(t * 9 + seed) * 0.08 + Math.sin(t * 17 + seed * 2) * 0.05
    const target = out ? 0 : (1 + progress.get() * 0.9) * flicker
    const s = THREE.MathUtils.damp(flame.current.scale.x, target, out ? 9 : 14, dt)
    flame.current.scale.set(s, s * 1.4, s)
    flame.current.visible = s > 0.02
  })

  return (
    <group position={position}>
      <mesh position={[0, 0.275, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.55, 16]} />
        <meshStandardMaterial color={color} roughness={0.5} />
      </mesh>
      <group ref={flame} position={[0, 0.7, 0]}>
        <mesh>
          <sphereGeometry args={[0.09, 16, 16]} />
          <meshBasicMaterial color="#fff1b0" toneMapped={false} />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.22, 16, 16]} />
          <meshBasicMaterial
            color="#ffb347"
            transparent
            opacity={0.25}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </mesh>
      </group>
    </group>
  )
}

const CANDLE_COLORS = ['#ff6fa5', '#9ff0d4', '#ffd166', '#a78bfa', '#ff9a76']
const SPRINKLES = ['#fff3b8', '#9ff0d4', '#c9b3ff', '#ffd1e3']

export default function CakeModel({ progress, out }) {
  const light = useRef()

  useFrame((_, dt) => {
    const target = out ? 0 : 10 + progress.get() * 22
    light.current.intensity = THREE.MathUtils.damp(light.current.intensity, target, 5, dt)
  })

  return (
    <group>
      {/* Plate */}
      <mesh position={[0, 0.06, 0]}>
        <cylinderGeometry args={[2.7, 2.9, 0.12, 64]} />
        <meshStandardMaterial color="#fff1f8" roughness={0.3} />
      </mesh>

      <Tier radius={1.95} height={1.0} y={0.12} sponge="#ffb3d1" icing="#fff6fb" pearls={22} />
      <Tier radius={1.4} height={0.9} y={1.22} sponge="#c9b3ff" icing="#fff6fb" pearls={16} />
      <Tier radius={0.9} height={0.8} y={2.22} sponge="#9ff0d4" icing="#fff6fb" pearls={11} />

      {/* Sprinkles on the bottom tier */}
      {ring(14, 1.7, 1.27).map(({ i, pos }) => (
        <mesh key={`s${i}`} position={pos}>
          <sphereGeometry args={[0.07, 12, 12]} />
          <meshStandardMaterial color={SPRINKLES[i % 4]} roughness={0.4} />
        </mesh>
      ))}

      {/* Cherries on the middle tier */}
      {ring(8, 1.15, 2.36, 0.3).map(({ i, pos }) => (
        <mesh key={`c${i}`} position={pos}>
          <sphereGeometry args={[0.14, 20, 20]} />
          <meshStandardMaterial color={i % 2 ? '#ff9ac1' : '#ff4f7b'} roughness={0.25} />
        </mesh>
      ))}

      {/* Candles on the top tier */}
      {ring(5, 0.42, 3.12).map(({ i, pos }) => (
        <Candle key={i} position={pos} color={CANDLE_COLORS[i]} progress={progress} out={out} seed={i * 1.7} />
      ))}

      <pointLight ref={light} position={[0, 4.2, 0]} color="#ffb86b" intensity={10} decay={2} />
    </group>
  )
}