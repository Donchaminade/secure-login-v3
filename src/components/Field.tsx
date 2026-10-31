import { useId, useState, type InputHTMLAttributes, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Check, Eye, EyeOff } from 'lucide-react'

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  icon?: ReactNode
  valid?: boolean
  error?: string
  password?: boolean
}

/** Dark text field: left icon (padded so it never overlaps the placeholder), live check, optional eye toggle. */
export function Field({ label, icon, valid, error, password, className = '', ...rest }: Props) {
  const id = useId()
  const [show, setShow] = useState(false)
  const [focus, setFocus] = useState(false)
  return (
    <div className={className}>
      <label htmlFor={id} className={`mb-2 block text-[13px] font-medium transition-colors ${focus ? 'text-violet-soft' : 'text-dim'}`}>{label}</label>
      <motion.div
        animate={error ? { x: [0, -7, 7, -5, 5, 0] } : { x: 0 }}
        transition={{ duration: 0.4 }}
        className={`relative flex h-12 items-center rounded-xl border transition-all duration-200 ${
          error ? 'border-bad/70 bg-bad/5' : valid && !focus ? 'border-transparent bg-[#e8edff] text-[#0b0b10]' : focus ? 'border-violet bg-[#e8edff] text-[#0b0b10] shadow-[0_0_0_4px_rgb(108_92_255/0.18)]' : 'border-edge bg-field'
        }`}
      >
        {icon && <span className={`pointer-events-none absolute left-4 ${valid || focus ? 'text-[#5b5b70]' : 'text-dim'}`}>{icon}</span>}
        <input
          id={id}
          type={password && !show ? 'password' : 'text'}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          aria-invalid={!!error}
          className={`h-full w-full bg-transparent pr-12 text-[15px] outline-none placeholder:text-[#7c7c8c] ${icon ? 'pl-11' : 'pl-4'}`}
          {...rest}
        />
        <span className="absolute right-3 flex items-center gap-2">
          <AnimatePresence>
            {valid && !password && (
              <motion.span initial={{ scale: 0, rotate: -40 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0 }} transition={{ type: 'spring', stiffness: 500, damping: 22 }} className="text-ok"><Check size={18} strokeWidth={2.6} /></motion.span>
            )}
          </AnimatePresence>
          {password && (
            <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? 'Hide password' : 'Show password'} className={`grid h-8 w-8 place-items-center rounded-lg transition hover:bg-black/10 ${valid || focus ? 'text-[#5b5b70]' : 'text-dim'}`}>
              {show ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          )}
        </span>
      </motion.div>
      <AnimatePresence>
        {error && <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-1.5 text-[12px] text-bad">{error}</motion.p>}
      </AnimatePresence>
    </div>
  )
}
