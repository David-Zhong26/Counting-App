import { AuthScreen } from './auth/AuthScreen'
import { useAuth } from './auth/useAuth'
import { PulseApp } from './PulseApp'
import { PhoneFrame } from './ui/PhoneFrame'

export default function App() {
  const { session, loading } = useAuth()

  if (loading) {
    return (
      <main className="min-h-dvh px-5 py-10 text-pc-text">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-center">
          <PhoneFrame ariaLabel="小宝数数">
            <div className="grid min-h-dvh place-items-center text-[13px] font-medium text-pc-text/55">
              Loading…
            </div>
          </PhoneFrame>
        </div>
      </main>
    )
  }

  if (!session) {
    return (
      <main className="min-h-dvh px-5 py-10 text-pc-text">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-center">
          <PhoneFrame ariaLabel="小宝数数 · Sign in">
            <AuthScreen />
          </PhoneFrame>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-dvh px-5 py-10 text-pc-text">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-center">
        <PhoneFrame ariaLabel="小宝数数">
          <PulseApp key={session.user.id} userId={session.user.id} />
        </PhoneFrame>
      </div>
    </main>
  )
}
