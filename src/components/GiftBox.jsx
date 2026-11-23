import { useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Float, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'

const BODY = '#ff8fb8'
const LID = '#ff6fa5'
const RIBBON = '#fff3b8'

export default function GiftBox({ opened, onOpen }) {
  const wrapper = useRef()
  const wiggle = useRef()
  const lid = useRef()
  const [hovered, setHovered] = useState(false)
  const { viewport } = useThree()

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime

    // Lid pops up and tilts away when opened
    lid.current.position.y = THREE.MathUtils.damp(lid.current.position.y, opened ? 3.4 : 1.05, 4, delta)
    lid.current.rotation.z = THREE.MathUtils.damp(lid.current.rotation.z, opened ? 0.7 : 0, 4, delta)

    // Cute wiggle while waiting to be tapped
    wiggle.current.rotation.z = opened ? 0 : Math.sin(t * 3) * 0.05

    // Slight grow on hover or touch
    const target = hovered && !opened ? 1.07 : 1
    const s = THREE.MathUtils.damp(wrapper.current.scale.x, target, 6, delta)
    wrapper.current.scale.setScalar(s)
  })

  // Smaller box on narrow (portrait) screens
  const fit = Math.min(1, viewport.aspect * 0.95)

  return (
    <group scale={fit}>
      <Float speed={2} rotationIntensity={0.25} floatIntensity={1}>
        <group
          ref={wrapper}
          onClick={onOpen}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <group ref={wiggle}>
            {/* Body */}
            <RoundedBox args={[2, 1.6, 2]} radius={0.12} smoothness={4}>
              <meshStandardMaterial color={BODY} roughness={0.55} />
            </RoundedBox>
            <RoundedBox args={[0.36, 1.62, 2.04]} radius={0.05}>
              <meshStandardMaterial color={RIBBON} roughness={0.5} />
            </RoundedBox>
            <RoundedBox args={[2.04, 1.62, 0.36]} radius={0.05}>
              <meshStandardMaterial color={RIBBON} roughness={0.5} />
            </RoundedBox>

            {/* Lid with bow */}
            <group ref={lid} position={[0, 1.05, 0]}>
              <RoundedBox args={[2.3, 0.5, 2.3]} radius={0.12} smoothness={4}>
                <meshStandardMaterial color={LID} roughness={0.55} />
              </RoundedBox>
              <RoundedBox args={[0.36, 0.52, 2.34]} radius={0.05}>
                <meshStandardMaterial color={RIBBON} roughness={0.5} />
              </RoundedBox>
              <RoundedBox args={[2.34, 0.52, 0.36]} radius={0.05}>
                <meshStandardMaterial color={RIBBON} roughness={0.5} />
              </RoundedBox>
              <mesh position={[-0.4, 0.5, 0]} rotation={[0, 0, 0.5]} scale={[1.4, 0.8, 0.8]}>
                <sphereGeometry args={[0.35, 32, 32]} />
                <meshStandardMaterial color={RIBBON} roughness={0.5} />
              </mesh>
              <mesh position={[0.4, 0.5, 0]} rotation={[0, 0, -0.5]} scale={[1.4, 0.8, 0.8]}>
                <sphereGeometry args={[0.35, 32, 32]} />
                <meshStandardMaterial color={RIBBON} roughness={0.5} />
              </mesh>
              <mesh position={[0, 0.45, 0]}>
                <sphereGeometry args={[0.2, 32, 32]} />
                <meshStandardMaterial color="#ffe27a" roughness={0.5} />
              </mesh>
            </group>
          </group>
        </group>
      </Float>

      {/* Soft shadow on the ground */}
      <mesh position={[0, -2.1, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[1, 0.6, 1]}>
        <circleGeometry args={[1.6, 48]} />
        <meshBasicMaterial color="#5b3a6e" transparent opacity={0.14} />
      </mesh>
    </group>
  )
}