import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const BURSTS = 14
const PER = 160
const TOTAL = BURSTS * PER

const hex = (h) => [
  parseInt(h.slice(1, 3), 16) / 255,
  parseInt(h.slice(3, 5), 16) / 255,
  parseInt(h.slice(5, 7), 16) / 255,
]

const PALETTES = [
  ['#ff6fa5', '#ffd166', '#ffffff'],
  ['#9ff0d4', '#c9b3ff', '#ffffff'],
  ['#ffb3d1', '#ffe08a', '#ff8fc0'],
  ['#6ec6ff', '#ff9ac1', '#fff3b8'],
  ['#ff6fa5', '#ff8fc0', '#ffd1e3'],
].map((p) => p.map(hex))

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  attribute vec3 aOrigin;
  attribute vec3 aDir;
  attribute vec3 aColor;
  attribute float aBirth;
  attribute float aSeed;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float age = uTime - aBirth;
    float life = 2.6 + aSeed * 0.8;

    if (age < 0.0 || age > life) {
      gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
      gl_PointSize = 0.0;
      vAlpha = 0.0;
      vColor = vec3(0.0);
      return;
    }

    float travel = (1.0 - exp(-age * 2.2)) / 2.2;
    vec3 p = aOrigin + aDir * travel * 6.0;
    p.y -= 0.22 * age * age;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    float fade = 1.0 - smoothstep(0.55, 1.0, age / life);
    float twinkle = 0.75 + 0.25 * sin(age * 30.0 + aSeed * 40.0);
    gl_PointSize = (9.0 + aSeed * 5.0) * uPixelRatio * fade * (10.0 / -mv.z);

    vColor = mix(vec3(1.0), aColor, smoothstep(0.0, 0.35, age));
    vAlpha = fade * twinkle;
  }
`

const fragmentShader = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    if (d > 1.0) discard;
    float core = 1.0 - smoothstep(0.0, 0.35, d);
    float glow = pow(1.0 - d, 2.0);
    gl_FragColor = vec4(vColor * (0.6 + core * 0.8), (glow * 0.9 + core) * vAlpha);
  }
`

export default function Fireworks({ fireRef }) {
  const { camera, size } = useThree()
  const geo = useRef()
  const mat = useRef()
  const timeRef = useRef(0)
  const next = useRef(0)

  const data = useMemo(() => {
    const seed = new Float32Array(TOTAL)
    for (let i = 0; i < TOTAL; i++) seed[i] = Math.random()
    return {
      positions: new Float32Array(TOTAL * 3),
      origin: new Float32Array(TOTAL * 3),
      dir: new Float32Array(TOTAL * 3),
      color: new Float32Array(TOTAL * 3),
      birth: new Float32Array(TOTAL).fill(-1000),
      seed,
    }
  }, [])

  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uPixelRatio: { value: 1 } }), [])

  // nx, ny are screen coordinates from -1 to 1
  const fire = (nx, ny, { z = -3, shape = 'sphere', palette = 0 } = {}) => {
    const attrs = geo.current.attributes
    const slot = next.current++ % BURSTS
    const halfH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * (camera.position.z - z)
    const ox = nx * halfH * (size.width / size.height)
    const oy = ny * halfH
    const colors = PALETTES[palette % PALETTES.length]
    const now = timeRef.current

    for (let k = 0; k < PER; k++) {
      const i = slot * PER + k
      let dx, dy, dz
      if (shape === 'heart') {
        const t = (k / PER) * Math.PI * 2
        const j = 0.85 + Math.random() * 0.15
        dx = ((16 * Math.sin(t) ** 3) / 17) * j
        dy = ((13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) / 17 + 0.1) * j
        dz = (Math.random() - 0.5) * 0.15
      } else {
        const u = Math.random() * 2 - 1
        const a = Math.random() * Math.PI * 2
        const r = Math.sqrt(1 - u * u)
        const sp = 0.55 + Math.random() * 0.6
        dx = r * Math.cos(a) * sp
        dy = u * sp
        dz = r * Math.sin(a) * sp
      }
      const c = colors[Math.floor(Math.random() * colors.length)]
      data.origin.set([ox, oy, z], i * 3)
      data.dir.set([dx, dy, dz], i * 3)
      data.color.set(c, i * 3)
      data.birth[i] = now
    }

    attrs.aOrigin.needsUpdate = true
    attrs.aDir.needsUpdate = true
    attrs.aColor.needsUpdate = true
    attrs.aBirth.needsUpdate = true
  }

  useEffect(() => {
    fireRef.current = fire
    return () => {
      fireRef.current = null
    }
  })

  useFrame((state) => {
    timeRef.current = state.clock.elapsedTime
    mat.current.uniforms.uTime.value = state.clock.elapsedTime
    mat.current.uniforms.uPixelRatio.value = state.gl.getPixelRatio()
  })

  return (
    <points frustumCulled={false}>
      <bufferGeometry ref={geo}>
        <bufferAttribute attach="attributes-position" args={[data.positions, 3]} />
        <bufferAttribute attach="attributes-aOrigin" args={[data.origin, 3]} />
        <bufferAttribute attach="attributes-aDir" args={[data.dir, 3]} />
        <bufferAttribute attach="attributes-aColor" args={[data.color, 3]} />
        <bufferAttribute attach="attributes-aBirth" args={[data.birth, 1]} />
        <bufferAttribute attach="attributes-aSeed" args={[data.seed, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={mat}
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