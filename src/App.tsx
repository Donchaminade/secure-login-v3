import { useEffect, useRef, useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, Lock, Mail, KeyRound, ShieldCheck, RotateCcw } from 'lucide-react'
import { Field } from './components/Field'
import { Shield, type ShieldState } from './components/Shield'
import { Steps, type StepStatus } from './components/Steps'

type Phase = 'form' | 'auth' | 'done'
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export default function App() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [touched, setTouched] = useState(false)
  const [phase, setPhase] = useState<Phase>('form')
  const [stage, setStage] = useState(0) // 0 none, 1 credentials, 2 security, 3 auth, 4 all done
  const [error, setError] = useState('')
  const alive = useRef(true)
  useEffect(() => () => { alive.current = false }, [])

  const emailOk = EMAIL_RE.test(email)
  const passOk = password.length >= 8
  const emailErr = touched && !emailOk ? 'Enter a valid email address' : ''
  const passErr = touched && !passOk ? 'At least 8 characters' : error

  const shield: ShieldState =
    phase === 'done' ? 'success' : error ? 'error' : stage === 3 ? 'unlocked' : stage >= 1 ? 'scanning' : passOk && emailOk ? 'locked' : email || password ? 'watching' : 'idle'

  const status = (i: number): StepStatus => (stage > i + 1 || phase === 'done' ? 'done' : stage === i + 1 ? 'active' : 'todo')

  async function submit(e: FormEvent) {
    e.preventDefault()
    setTouched(true); setError('')
    if (!emailOk || !passOk) return
    setPhase('auth')
    for (const s of [1, 2, 3]) { setStage(s); await sleep(s === 3 ? 700 : 900); if (!alive.current) return }
    // Demo rule: any password containing "wrong" fails, so the error state can be shown.
    if (password.toLowerCase().includes('wrong')) { setStage(0); setPhase('form'); setError('Authentication failed — try another password'); return }
    setStage(4); setPhase('done')
  }

  function reset() { setPhase('form'); setStage(0); setPassword(''); setTouched(false); setError('') }

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden px-4 py-10">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-violet/15 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -left-20 h-[380px] w-[380px] rounded-full bg-emerald-500/5 blur-[100px]" />

      <motion.main initial={{ opacity: 0, y: 24, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 160, damping: 22 }} className="relative grid w-full max-w-[880px] overflow-hidden rounded-[22px] border border-edge bg-panel/90 shadow-[0_40px_120px_rgb(0_0_0/0.6)] backdrop-blur md:grid-cols-[1.15fr_1fr]">
        <section className="relative flex min-h-[460px] flex-col justify-center p-7 sm:p-10">
          <AnimatePresence mode="wait">
            {phase !== 'done' ? (
              <motion.form key="form" onSubmit={submit} noValidate initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, filter: 'blur(6px)', scale: 0.97 }} transition={{ duration: 0.3 }}>
                <h1 className="text-[28px] font-bold tracking-tight">Welcome Back</h1>
                <p className="mt-1 text-[14px] text-dim">Sign in to continue to your account.</p>
                <Field className="mt-7" label="Email" type="email" autoComplete="email" placeholder="you@example.com" icon={<Mail size={17} />} value={email} onChange={(e) => setEmail(e.target.value)} valid={emailOk} error={emailErr} disabled={phase === 'auth'} />
                <Field className="mt-4" label="Password" password autoComplete="current-password" placeholder="Enter your password" icon={<KeyRound size={17} />} value={password} onChange={(e) => { setPassword(e.target.value); setError('') }} valid={passOk && !error} error={passErr} disabled={phase === 'auth'} />
                <motion.button type="submit" disabled={phase === 'auth'} whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }} className="relative mt-7 flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-violet text-[15px] font-semibold shadow-[0_10px_30px_rgb(108_92_255/0.45)] transition-colors hover:bg-[#7a6bff] disabled:cursor-wait disabled:bg-[#5446c9]">
                  {phase === 'auth' && <motion.span className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent" animate={{ x: ['-120%', '320%'] }} transition={{ repeat: Infinity, duration: 1.1, ease: 'easeInOut' }} />}
                  {phase === 'auth' ? <><Lock size={16} />Authenticating…</> : 'Login'}
                </motion.button>
                <div className="mt-6 space-y-2 text-center text-[13px] text-dim">
                  <a href="#" className="block hover:text-white">Forgot password?</a>
                  <p>Don&apos;t have an account? <a href="#" className="font-medium text-white hover:text-violet-soft">Sign up</a></p>
                </div>
                <p className="mt-5 rounded-lg border border-dashed border-edge px-3 py-2 text-center text-[11.5px] text-dim">Demo only · no real authentication. Any valid email + 8-char password works; include “wrong” in the password to see the error state.</p>
              </motion.form>
            ) : (
              <motion.div key="done" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-col items-center text-center">
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.15 }} className="grid h-16 w-16 place-items-center rounded-full bg-ok/10">
                  <ShieldCheck size={30} className="text-ok" />
                </motion.span>
                <h2 className="mt-6 text-[30px] font-bold tracking-tight">Welcome Back!</h2>
                <p className="mt-1 text-[14px] text-dim">You&apos;re successfully signed in.</p>
                <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }} className="mt-8 flex h-12 w-full max-w-[340px] items-center justify-center gap-2 rounded-xl bg-violet text-[15px] font-semibold shadow-[0_10px_30px_rgb(108_92_255/0.45)] hover:bg-[#7a6bff]">Continue <ArrowRight size={17} /></motion.button>
                <button onClick={reset} className="mt-4 flex items-center gap-1.5 text-[12.5px] text-dim hover:text-white"><RotateCcw size={13} />Replay demo</button>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        <aside className="relative flex flex-col items-center justify-center gap-9 border-t border-edge bg-[radial-gradient(90%_70%_at_50%_35%,rgb(108_92_255/0.10),transparent_70%)] p-8 md:border-t-0 md:border-l">
          <Shield state={shield} />
          <Steps steps={[{ label: 'Credentials', status: status(0) }, { label: 'Security Check', status: status(1) }, { label: 'Authentication', status: status(2) }]} />
        </aside>
      </motion.main>
    </div>
  )
}
