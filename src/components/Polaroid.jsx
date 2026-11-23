import { useRef, useState } from 'react'
import { motion } from 'framer-motion'

export function PhotoImage({ src, alt }) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blush via-lavender to-mint text-6xl">
        💖
      </div>
    )
  }
  return (
    <img
      src={src}
      alt={alt}
      draggable={false}
      onError={() => setFailed(true)}
      className="pointer-events-none h-full w-full object-cover"
    />
  )
}

export default function Polaroid({ memory, index, slot, z, bounds, onFront, onOpen }) {
  const moved = useRef(false)

  return (
    <motion.div
      drag
      dragConstraints={bounds}
      dragElastic={0.15}
      dragMomentum={false}
      initial={{ y: 400, opacity: 0, scale: 0.6, rotate: slot.r * 4 }}
      animate={{ y: 0, opacity: 1, scale: 1, rotate: slot.r }}
      transition={{ type: 'spring', stiffness: 110, damping: 14, delay: 0.2 + index * 0.15 }}
      whileDrag={{ scale: 1.1 }}
      onPointerDown={() => {
        moved.current = false
        onFront()
      }}
      onDragStart={() => (moved.current = true)}
      onClick={() => {
        if (!moved.current) onOpen()
      }}
      className="absolute rounded-md bg-white p-[3%] pb-[4%] shadow-[0_12px_30px_rgba(91,58,110,0.35)]"
      style={{
        left: `${slot.l}%`,
        top: `${slot.t}%`,
        width: 'clamp(150px, 24vmin, 260px)',
        zIndex: z,
        touchAction: 'none',
      }}
    >
      <div className="aspect-square overflow-hidden rounded-sm">
        <PhotoImage src={memory.src} alt={memory.title} />
      </div>
      <p className="mt-2 text-center font-hand font-bold text-plum" style={{ fontSize: 'clamp(16px, 2.8vmin, 24px)' }}>
        {memory.title}
      </p>
    </motion.div>
  )
}