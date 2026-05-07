import { useState, type FormEvent } from 'react'
import { NeumorphicCard } from '../ui/NeumorphicCard'
import { supabase } from '../lib/supabase.js'

export function AuthScreen() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setMessage(null)
    setBusy(true)
    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({ email: email.trim(), password })
        if (error) throw error
        setMessage('Check your email to confirm, then sign in.')
        setMode('signin')
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        })
        if (error) throw error
      }
    } catch (err: unknown) {
      setMessage(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex min-h-[926px] flex-col px-2">
      <div className="mt-16 text-center">
        <div className="text-[22px] font-semibold tracking-tightish text-pc-text">
          {mode === 'signup' ? 'Create your account' : 'Welcome back'}
        </div>
      </div>

      <NeumorphicCard className="mt-12 px-6 py-6">
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5 text-left">
            <span className="text-[11px] font-semibold tracking-[0.14em] text-pc-text/55">EMAIL</span>
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="box-border min-h-[48px] w-full appearance-none rounded-[18px] border border-pc-text/18 bg-white px-4 py-3 text-[15px] font-medium text-pc-text shadow-none outline-none ring-pc-accent/30 focus:border-pc-accent/40 focus:ring-2"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-left">
            <span className="text-[11px] font-semibold tracking-[0.14em] text-pc-text/55">
              PASSWORD
            </span>
            <input
              type="password"
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="box-border min-h-[48px] w-full appearance-none rounded-[18px] border border-pc-text/18 bg-white px-4 py-3 text-[15px] font-medium text-pc-text shadow-none outline-none ring-pc-accent/30 focus:border-pc-accent/40 focus:ring-2"
            />
          </label>

          {message && (
            <p className="text-center text-[13px] font-medium leading-snug text-pc-text/75">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="mt-2 min-h-[48px] w-full appearance-none rounded-[18px] bg-white px-4 py-3 text-[15px] font-semibold tracking-tightish text-pc-accent shadow-[12px_14px_28px_rgba(27,51,46,0.18),-10px_-10px_22px_rgba(255,255,255,0.75)] transition enabled:active:scale-[0.99] disabled:opacity-50"
          >
            {busy ? 'Please wait…' : mode === 'signup' ? 'Sign up' : 'Log in'}
          </button>
        </form>

        <button
          type="button"
          onClick={() => {
            setMode(mode === 'signup' ? 'signin' : 'signup')
            setMessage(null)
          }}
          className="mt-5 w-full text-center text-[13px] font-medium text-pc-text/55 underline-offset-4 hover:text-pc-text/75"
        >
          {mode === 'signup' ? 'Already have an account? Log in' : 'Need an account? Sign up'}
        </button>
      </NeumorphicCard>
    </div>
  )
}
