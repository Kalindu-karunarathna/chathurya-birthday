import { motion } from 'framer-motion'

const GOLD = 'linear-gradient(90deg, #ffd35a, #fff1a8 50%, #ffd35a)'
const RISERS = [
  ['💖', -30, 0],
  ['✨', 10, 0.1],
  ['🌸', -10, 0.2],
  ['⭐', 30, 0.3],
  ['💗', -45, 0.15],
  ['🎀', 45, 0.25],
]

function Bow() {
  return (
    <svg
      viewBox="0 0 200 120"
      className="absolute left-1/2 w-[52%] -translate-x-1/2 overflow-visible"
      style={{ bottom: '41%' }}
    >
      {/* tails */}
      <path d="M94 86 L62 116 L88 112 L100 92 Z" fill="#f5b83d" />
      <path d="M106 86 L138 116 L112 112 L100 92 Z" fill="#f5b83d" />
      {/* loops */}
      <path d="M100 80 C60 8 8 18 18 62 C26 98 78 92 100 80 Z" fill="#ffd35a" />
      <path d="M100 80 C140 8 192 18 182 62 C174 98 122 92 100 80 Z" fill="#ffd35a" />
      <path d="M100 80 C70 44 40 44 32 64 C56 70 84 74 100 80 Z" fill="#f5b83d" opacity="0.55" />
      <path d="M100 80 C130 44 160 44 168 64 C144 70 116 74 100 80 Z" fill="#f5b83d" opacity="0.55" />
      <path d="M92 70 C66 30 36 30 36 56" stroke="white" strokeOpacity="0.55" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M108 70 C134 30 164 30 164 56" stroke="white" strokeOpacity="0.55" strokeWidth="4" fill="none" strokeLinecap="round" />
      {/* knot */}
      <ellipse cx="100" cy="82" rx="17" ry="15" fill="#ffd35a" />
      <ellipse cx="95" cy="77" rx="6" ry="5" fill="white" opacity="0.55" />
    </svg>
  )
}

export default function GiftBox({ opened, onOpen }) {
  return (
    <motion.button
      type="button"
      aria-label="Open your gift"
      onClick={onOpen}
      className="relative z-10 block"
      style={{ width: 'min(48vmin, 380px)', aspectRatio: '1 / 1', background: 'none', border: 0, padding: 0 }}
      animate={
        opened
          ? { y: 0, rotate: 0, scale: [1, 0.92, 1.06, 1] }
          : { y: [0, -12, 0], rotate: [-1.5, 1.5, -1.5] }
      }
      transition={opened ? { duration: 0.6 } : { repeat: Infinity, duration: 3.2, ease: 'easeInOut' }}
      whileTap={opened ? undefined : { scale: 0.95 }}
    >
      {/* warm glow that bursts out when opened */}
      <motion.div
        className="pointer-events-none absolute -inset-[35%]"
        style={{ background: 'radial-gradient(circle, rgba(255,240,170,0.95), rgba(255,200,230,0.4) 40%, transparent 68%)' }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={opened ? { opacity: 1, scale: 1.15 } : { opacity: 0, scale: 0.5 }}
        transition={{ duration: 0.9, delay: opened ? 0.3 : 0 }}
      />

      {/* shadow on the ground */}
      <div className="absolute -bottom-[3%] left-[12%] right-[12%] h-[8%] rounded-[50%] bg-[#5b3a6e]/25 blur-md" />

      {/* body */}
      <div
        className="absolute bottom-[4%] left-[8%] right-[8%] top-[36%] overflow-hidden rounded-b-[22px] rounded-t-[10px]"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(255,255,255,0.38) 3px, transparent 4px), linear-gradient(160deg, #ff9ec6, #ff6fa5)',
          backgroundSize: '26px 26px, 100% 100%',
          boxShadow: 'inset -10px -12px 24px rgba(0,0,0,0.1), inset 8px 8px 20px rgba(255,255,255,0.35)',
        }}
      >
        <div className="absolute bottom-0 left-1/2 top-0 w-[18%] -translate-x-1/2" style={{ background: GOLD }} />
      </div>

      {/* the dark inside you see once the lid is gone */}
      <div className="absolute left-[10%] right-[10%] top-[35%] h-[5%] rounded-full bg-[#c23a73]" />

      {/* things that float out */}
      {opened &&
        RISERS.map(([emoji, dx, delay], i) => (
          <motion.span
            key={i}
            className="pointer-events-none absolute left-1/2 top-[30%] text-4xl"
            initial={{ y: 0, x: 0, opacity: 0, scale: 0.4 }}
            animate={{ y: -230 - i * 28, x: dx * 3, opacity: [0, 1, 1, 0], scale: [0.4, 1.3, 1, 0.8] }}
            transition={{ duration: 2.2, delay: 0.4 + delay }}
          >
            {emoji}
          </motion.span>
        ))}

      {/* lid with the bow */}
      <motion.div
        className="absolute left-[2%] right-[2%] top-[24%] h-[16%]"
        animate={
          opened
            ? { y: '-260%', x: '22%', rotate: -24 }
            : { rotate: [0, -3, 3, -3, 0], y: [0, -5, 0, -5, 0] }
        }
        transition={
          opened
            ? { type: 'spring', stiffness: 90, damping: 11 }
            : { repeat: Infinity, duration: 0.9, repeatDelay: 1.8 }
        }
      >
        <div
          className="absolute inset-0 overflow-hidden rounded-[14px]"
          style={{
            background: 'linear-gradient(160deg, #ff86b6, #ff5c98)',
            boxShadow: '0 6px 14px rgba(91,58,110,0.25), inset 6px 6px 14px rgba(255,255,255,0.35)',
          }}
        >
          <div className="absolute bottom-0 left-1/2 top-0 w-[18%] -translate-x-1/2" style={{ background: GOLD }} />
        </div>
        <Bow />
      </motion.div>
    </motion.button>
  )
}