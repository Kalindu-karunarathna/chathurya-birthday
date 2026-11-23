import { Float } from '@react-three/drei'

const BUBBLES = [
  { p: [-4.2, 1.8, -2], s: 0.45, c: '#d9c8ff' },
  { p: [4.0, 2.2, -1], s: 0.35, c: '#c8f5e4' },
  { p: [-3.4, -1.4, -1], s: 0.3, c: '#fff3b8' },
  { p: [3.6, -1.2, -2], s: 0.5, c: '#ffd9c2' },
  { p: [0.8, 3.2, -3], s: 0.28, c: '#ffd1e3' },
  { p: [-1.6, 3.0, -2], s: 0.22, c: '#c8f5e4' },
]

export default function Bubbles() {
  return BUBBLES.map((b, i) => (
    <Float key={i} speed={1.5 + i * 0.2} floatIntensity={2} rotationIntensity={0.5}>
      <mesh position={b.p} scale={b.s}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color={b.c} roughness={0.35} />
      </mesh>
    </Float>
  ))
}