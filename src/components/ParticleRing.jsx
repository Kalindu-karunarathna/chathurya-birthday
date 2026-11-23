import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const COUNT = 5000

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uProgress;
  uniform float uBurst;
  uniform float uTilt;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uRadius;
  uniform vec3 uCenter;
  attribute vec4 aRandom;
  varying vec3 vColor;
  varying float vAlpha;

  vec3 palette(float t) {
    vec3 phase = vec3(0.08, 0.42, 0.76);
    return 0.5 + 0.5 * cos(6.283185 * (t + phase));
  }

  void main() {
    float speed = 0.16 + aRandom.y * 0.14;
    float phase = aRandom.x * 6.283185 + uTime * speed;

    float pull = uProgress * 0.85;
    float radius = mix(uRadius, 1.1, pull)
                 + (aRandom.z - 0.5) * mix(1.1, 0.25, pull)
                 + uBurst * aRandom.y * 7.0;
    float height = (aRandom.w - 0.5) * mix(1.8, 0.5, pull)
                 + uBurst * (aRandom.w - 0.3) * 5.0;

    vec3 p = vec3(cos(phase) * radius, height, sin(phase) * radius);

    float c = cos(uTilt);
    float s = sin(uTilt);
    p = vec3(p.x, p.y * c - p.z * s, p.y * s + p.z * c);
    p += uCenter;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    float sizeRand = 0.5 + fract(aRandom.x * 13.7) * 1.1;
    gl_PointSize = uSize * uPixelRatio * sizeRand * (1.0 + uBurst * 0.6) * (11.0 / -mv.z);

    vColor = mix(palette(phase / 6.283185 + aRandom.z * 0.1 + uTime * 0.02), vec3(1.0), 0.2);
    vAlpha = (0.55 + 0.45 * fract(aRandom.w * 7.3)) * (1.0 - uBurst * 0.3);
  }
`

const fragmentShader = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    if (d > 1.0) discard;
    float a = 1.0 - smoothstep(0.0, 1.0, d);
    a *= a;
    gl_FragColor = vec4(vColor, a * vAlpha);
  }
`

export default function ParticleRing({ progress, burst }) {
  const material = useRef()
  const time = useRef(0)

  const { positions, randoms } = useMemo(() => {
    const randoms = new Float32Array(COUNT * 4)
    for (let i = 0; i < randoms.length; i++) randoms[i] = Math.random()
    return { positions: new Float32Array(COUNT * 3), randoms }
  }, [])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uBurst: { value: 0 },
      uTilt: { value: 0.3 },
      uSize: { value: 10 },
      uPixelRatio: { value: 1 },
      uRadius: { value: 3.5 },
      uCenter: { value: new THREE.Vector3(0, 1.9, 0) },
    }),
    []
  )

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05)
    const p = progress.get()
    time.current += dt * (1 + p * 3.5)
    burst.set(THREE.MathUtils.damp(burst.get(), 0, 1.3, dt))

    const u = material.current.uniforms
    u.uTime.value = time.current
    u.uProgress.value = p
    u.uBurst.value = burst.get()
    u.uTilt.value = THREE.MathUtils.damp(u.uTilt.value, 0.3 + state.pointer.y * 0.25, 3, dt)
    u.uPixelRatio.value = state.gl.getPixelRatio()
  })

  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aRandom" args={[randoms, 4]} />
      </bufferGeometry>
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}