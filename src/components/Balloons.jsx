import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const BALLOONS = [
  { x: -0.44, z: -1.0, h: 5.2, c: '#ff6fa5', d: 0.0 },
  { x: -0.3, z: -3.0, h: 6.4, c: '#ffd166', d: 0.25 },
  { x: -0.4, z: 1.5, h: 2.6, c: '#7ee8c7', d: 0.5 },
  { x: 0.44, z: -1.0, h: 5.0, c: '#a78bfa', d: 0.15 },
  { x: 0.3, z: -3.0, h: 6.6, c: '#ff9a76', d: 0.4 },
  { x: 0.4, z: 1.5, h: 2.9, c: '#6ec6ff', d: 0.65 },
  { x: -0.12, z: -6.0, h: 7.0, c: '#ffb3d1', d: 0.8 },
  { x: 0.12, z: -6.0, h: 6.0, c: '#fff3b8', d: 0.9 },
]

function Balloon({ x, z, h, c, d, active }) {
  const ref = useRef()
  const age = useRef(0)

  useFrame((state, dt) => {
    if (!active) return
    age.current += dt
    if (age.current < d) return
    const t = state.clock.elapsedTime
    const target = h + Math.sin(t * 0.9 + d * 10) * 0.2
    ref.current.position.y = THREE.MathUtils.damp(ref.current.position.y, target, 0.9, dt)
    ref.current.rotation.z = Math.sin(t * 0.7 + d * 8) * 0.08
  })

  return (
    <group position={[x, 0, z]}>
      <group ref={ref} position={[0, -8, 0]} scale={0.7}>
        <mesh scale={[1, 1.2, 1]}>
          <sphereGeometry args={[0.85, 32, 32]} />
          <meshStandardMaterial color={c} roughness={0.25} emissive={c} emissiveIntensity={0.28} />
        </mesh>
        <mesh position={[0, -1.1, 0]}>
          <coneGeometry args={[0.14, 0.22, 12]} />
          <meshStandardMaterial color={c} />
        </mesh>
        <mesh position={[0, -2.0, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 1.7, 6]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.55} />
        </mesh>
      </group>
    </group>
  )
}

export default function Balloons({ active }) {
  const { viewport } = useThree()
  return BALLOONS.map((b, i) => (
    <Balloon key={i} {...b} x={b.x * viewport.width} active={active} />
  ))
}