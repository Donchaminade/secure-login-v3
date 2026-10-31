import { AnimatePresence, motion } from 'motion/react'
import { Check, Lock, LockOpen } from 'lucide-react'

export type ShieldState = 'idle' | 'watching' | 'locked' | 'scanning' | 'unlocked' | 'success' | 'error'

/** Animated security "shield" orb: dashed outer ring, glowing violet core, lock → unlock → check. */
export function Shield({ state }: { state: ShieldState }) {
  const active = state !== 'idle'
  const ok = state === 'success'
  const color = state === 'error' ? '#ff5a6a' : ok ? '#22c58b' : '#6c5cff'
  return (
    <div className="relative grid h-44 w-44 place-items-center">
      <motion.div
        className="absolute inset-0 rounded-full border border-dashed"
        style={{ borderColor: active ? `${color}66` : 'rgb(255 255 255 / .12)' }}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: state === 'scanning' ? 4 : 24, ease: 'linear' }}
      />
      {(state === 'scanning' || ok) && (
        <motion.div className="absolute inset-0 rounded-full" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: [0.5, 0], scale: [0.92, 1.25] }} transition={{ repeat: Infinity, duration: 1.6, ease: 'easeOut' }} style={{ boxShadow: `0 0 0 2px ${color}` }} />
      )}
      {state === 'scanning' && (
        <motion.div className="absolute inset-3 rounded-full" style={{ background: `conic-gradient(from 0deg, ${color} 0 18%, transparent 18%)`, mask: 'radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 2px))', WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 2px))' }} animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} />
      )}
      <motion.div
        className="relative grid h-32 w-32 place-items-center rounded-full bg-[#09090d]"
        animate={{ boxShadow: active ? `0 0 0 2px ${color}, 0 0 40px ${color}55, inset 0 0 30px ${color}22` : '0 0 0 1px rgb(255 255 255 / .06), 0 0 0 transparent, inset 0 0 0 transparent', scale: ok ? [1, 1.06, 1] : 1 }}
        transition={{ duration: 0.5 }}
      >
        <AnimatePresence mode="wait">
          {state === 'idle' || state === 'watching' ? (
            <motion.span key="dot" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="grid h-8 w-8 place-items-center rounded-full border" style={{ borderColor: `${color}55` }}>
              <motion.span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} animate={state === 'watching' ? { scale: [1, 1.8, 1] } : {}} transition={{ repeat: Infinity, duration: 1.2 }} />
            </motion.span>
          ) : ok ? (
            <motion.span key="ok" initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 18 }} className="text-ok"><Check size={40} strokeWidth={2.4} /></motion.span>
          ) : state === 'unlocked' ? (
            <motion.span key="open" initial={{ y: 6, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ scale: 0.6, opacity: 0 }} className="text-violet-soft"><LockOpen size={34} /></motion.span>
          ) : (
            <motion.span key="lock" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1, x: state === 'error' ? [0, -6, 6, -4, 4, 0] : 0 }} exit={{ y: -6, opacity: 0 }} style={{ color }}><Lock size={32} /></motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
