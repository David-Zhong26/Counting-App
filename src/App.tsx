import { AuthScreen } from './auth/AuthScreen'
import { useAuth } from './auth/useAuth'
import { PulseApp } from './PulseApp'
import { PhoneFrame } from './ui/PhoneFrame'
import { LangProvider } from './lib/lang'

export default function App() {
  const { session, loading } = useAuth()

  if (loading) {
    return (
      <LangProvider>
        <main className="min-h-dvh w-full text-pc-text">
          <PhoneFrame ariaLabel="小宝数数">
            <div className="grid min-h-dvh place-items-center text-[13px] font-medium text-pc-text/55">
              Loading…
            </div>
          </PhoneFrame>
        </main>
      </LangProvider>
    )
  }

  if (!session) {
    return (
      <LangProvider>
        <main className="min-h-dvh w-full text-pc-text">
          <PhoneFrame ariaLabel="小宝数数 · Sign in">
            <AuthScreen />
          </PhoneFrame>
        </main>
      </LangProvider>
    )
  }

  return (
    <LangProvider>
      <main className="min-h-dvh w-full text-pc-text">
        <PhoneFrame ariaLabel="小宝数数">
          <PulseApp key={session.user.id} userId={session.user.id} />
        </PhoneFrame>
      </main>
    </LangProvider>
  )
}
