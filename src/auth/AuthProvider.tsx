import type { AuthChangeEvent, Session } from '@supabase/supabase-js'
import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { AuthContext } from './auth-context'
import { supabase } from '../lib/supabase.js'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    void supabase.auth
      .getSession()
      .then(({ data }: { data: { session: Session | null } }) => {
        if (!cancelled) setSession(data.session ?? null)
      })
      .catch((err: unknown) => {
        console.error('[小宝数数] getSession failed — check .env and Supabase URL/key.', err)
        if (!cancelled) setSession(null)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    const { data: sub } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, nextSession: Session | null) => {
        setSession(nextSession)
        // Ensures UI unlocks if INITIAL_SESSION arrives before getSession settles (or after Strict Mode remount).
        if (event === 'INITIAL_SESSION') {
          setLoading(false)
        }
      },
    )

    return () => {
      cancelled = true
      sub.subscription.unsubscribe()
    }
  }, [])

  const value = useMemo(() => ({ session, loading }), [session, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
