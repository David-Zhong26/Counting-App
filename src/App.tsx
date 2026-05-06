import { useMemo, useState } from 'react'
import { HomeScreen } from './screens/HomeScreen'
import { OverviewScreen } from './screens/OverviewScreen'
import { PhoneFrame } from './ui/PhoneFrame'

export default function App() {
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
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 lg:flex-row lg:items-start lg:justify-center">
        <PhoneFrame ariaLabel="Pulse Count Home Screen">
          <HomeScreen
            todayCount={todayCount}
            goal={goal}
            streak={streak}
            onIncrement={() => setTodayCount((c) => c + 1)}
          />
        </PhoneFrame>

        <PhoneFrame ariaLabel="Pulse Count Overview Screen">
          <OverviewScreen
            weeklyChecks={weeklyChecks}
            weeklyPercent={71}
            activity={[
              { label: 'Today', count: todayCount, time: '9:12 AM' },
              { label: 'Yesterday', count: 23, time: '8:47 AM' },
              { label: 'May 20', count: 21, time: '9:01 AM' },
            ]}
          />
        </PhoneFrame>
      </div>
    </main>
  )
}
