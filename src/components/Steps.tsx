import { motion } from 'motion/react'
import { Check, Loader2 } from 'lucide-react'

export type StepStatus = 'todo' | 'active' | 'done'

export function Steps({ steps }: { steps: { label: string; status: StepStatus }[] }) {
  return (
    <ul className="space-y-4">
      {steps.map((s) => (
        <li key={s.label} className={`flex items-center gap-3 text-[15px] font-medium transition-colors duration-300 ${s.status === 'todo' ? 'text-[#55555f]' : 'text-white'}`}>
          <span className={`grid h-6 w-6 place-items-center rounded-full border transition-colors ${s.status === 'done' ? 'border-ok/50 bg-ok/10 text-ok' : s.status === 'active' ? 'border-violet text-violet-soft' : 'border-[#3a3a44]'}`}>
            {s.status === 'done' ? (
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 20 }}><Check size={13} strokeWidth={3} /></motion.span>
            ) : s.status === 'active' ? <Loader2 size={13} className="animate-spin" /> : null}
          </span>
          {s.label}
        </li>
      ))}
    </ul>
  )
}
