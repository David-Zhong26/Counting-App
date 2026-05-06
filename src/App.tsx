import { useMemo, useState } from 'react'
import { HomeScreen } from './screens/HomeScreen'
import { OverviewScreen } from './screens/OverviewScreen'
import { PhoneFrame } from './ui/PhoneFrame'

export default function App() {
  const [screen, setScreen] = useState<'home' | 'overview'>('home')
  const [todayCount, setTodayCount] = useState(24)

  const goal = 50
  const streak = 7

  const weeklyChecks = useMemo(
    () => ({
      Mon: true,
      Tue: true,
      Wed: true,
      Thu: false,
      Fri: true,
      Sat: false,
      Sun: false,
    }),
    [],
  )

  return (
    <main className="min-h-dvh px-5 py-10 text-pc-text">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-center">
        <PhoneFrame ariaLabel={screen === 'home' ? 'Pulse Count Home Screen' : 'Pulse Count Overview Screen'}>
          {screen === 'home' ? (
            <HomeScreen
              todayCount={todayCount}
              goal={goal}
              streak={streak}
              onIncrement={() => setTodayCount((c) => c + 1)}
              onGoOverview={() => setScreen('overview')}
            />
          ) : (
            <OverviewScreen
              weeklyChecks={weeklyChecks}
              weeklyPercent={71}
              activity={[
                { label: 'Today', count: todayCount, time: '9:12 AM' },
                { label: 'Yesterday', count: 23, time: '8:47 AM' },
                { label: 'May 20', count: 21, time: '9:01 AM' },
              ]}
              onBack={() => setScreen('home')}
            />
          )}
        </PhoneFrame>
      </div>
    </main>
  )
}
