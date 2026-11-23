import { useMemo } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { Float, Sparkles } from '@react-three/drei'
import * as THREE from 'three'

const COLORS = ['#ff6fa5', '#ffb3d1', '#c9b3ff', '#9ff0d4', '#ffd166', '#ff9a76']

function makeHeartGeometry() {
  const s = new THREE.Shape()
  s.moveTo(0, 0.25)
  s.bezierCurveTo(0, 0.25, -0.05, 0, -0.25, 0)
  s.bezierCurveTo(-0.55, 0, -0.55, 0.35, -0.55, 0.35)
  s.bezierCurveTo(-0.55, 0.55, -0.35, 0.77, 0, 0.95)
  s.bezierCurveTo(0.35, 0.77, 0.55, 0.55, 0.55, 0.35)
  s.bezierCurveTo(0.55, 0.35, 0.55, 0, 0.25, 0)
  s.bezierCurveTo(0.1, 0, 0, 0.25, 0, 0.25)
  const g = new THREE.ExtrudeGeometry(s, {
    depth: 0.2,
    bevelEnabled: true,
    bevelThickness: 0.08,
    bevelSize: 0.08,
    bevelSegments: 4,
  })
  g.center()
  return g
}

function Hearts() {
  const { viewport } = useThree()
  const geometry = useMemo(makeHeartGeometry, [])
  const hearts = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => ({
        fx: Math.random() - 0.5,
        y: Math.random() * 9 - 4,
        z: -1 - Math.random() * 5,
        scale: 0.3 + Math.random() * 0.5,
        color: COLORS[i % COLORS.length],
        speed: 1 + Math.random() * 1.5,
      })),
    []
  )

  return hearts.map((h, i) => (
    <Float key={i} speed={h.speed} rotationIntensity={1.2} floatIntensity={2.5}>
      <mesh geometry={geometry} position={[h.fx * viewport.width, h.y, h.z]} scale={h.scale}>
        <meshStandardMaterial color={h.color} roughness={0.35} emissive={h.color} emissiveIntensity={0.2} />
      </mesh>
    </Float>
  ))
}

export default function FloatingHearts() {
  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 45 }} dpr={[1, 1.5]}>
      <hemisphereLight args={['#ffffff', '#d9c8ff', 1.2]} />
      <directionalLight position={[3, 5, 6]} intensity={1.4} />
      <Hearts />
      <Sparkles count={50} scale={[14, 9, 6]} size={6} speed={0.35} color="#ffffff" />
    </Canvas>
  )
}