import { useMemo, useState } from 'react'
import { HomeScreen } from './screens/HomeScreen'
import { OverviewScreen } from './screens/OverviewScreen'
import { TaskListScreen } from './screens/TaskListScreen'
import type { Task } from './types/task'
import { PhoneFrame } from './ui/PhoneFrame'

const seedTasks: Task[] = [
  {
    id: '1',
    name: 'Deep work',
    todayCount: 24,
    goal: 50,
    streak: 7,
    weeklyPercent: 71,
    weeklyChecks: {
      Mon: true,
      Tue: true,
      Wed: true,
      Thu: false,
      Fri: true,
      Sat: false,
      Sun: false,
    },
    activity: [
      { label: 'Today', count: 24, time: '9:12 AM' },
      { label: 'Yesterday', count: 23, time: '8:47 AM' },
      { label: 'May 20', count: 21, time: '9:01 AM' },
    ],
  },
  {
    id: '2',
    name: 'Water',
    todayCount: 6,
    goal: 8,
    streak: 12,
    weeklyPercent: 86,
    weeklyChecks: {
      Mon: true,
      Tue: true,
      Wed: true,
      Thu: true,
      Fri: false,
      Sat: false,
      Sun: false,
    },
    activity: [
      { label: 'Today', count: 6, time: '8:02 AM' },
      { label: 'Yesterday', count: 8, time: '7:55 AM' },
      { label: 'May 20', count: 7, time: '8:10 AM' },
    ],
  },
  {
    id: '3',
    name: 'Stretch',
    todayCount: 3,
    goal: 5,
    streak: 4,
    weeklyPercent: 57,
    weeklyChecks: {
      Mon: false,
      Tue: true,
      Wed: true,
      Thu: true,
      Fri: true,
      Sat: false,
      Sun: false,
    },
    activity: [
      { label: 'Today', count: 3, time: '7:30 AM' },
      { label: 'Yesterday', count: 2, time: '6:50 AM' },
      { label: 'May 19', count: 4, time: '7:15 AM' },
    ],
  },
]

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(seedTasks)
  const [screen, setScreen] = useState<'list' | 'detail' | 'overview'>('list')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const selected = useMemo(
    () => tasks.find((t) => t.id === selectedId) ?? null,
    [tasks, selectedId],
  )

  const activitySynced = useMemo(() => {
    if (!selected) return []
    return selected.activity.map((row) =>
      row.label === 'Today' ? { ...row, count: selected.todayCount } : row,
    )
  }, [selected])

  function patchTask(taskId: string, patch: Partial<Task>) {
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, ...patch } : t)))
  }

  function setTaskCount(taskId: string, n: number) {
    const v = Math.max(0, Math.floor(n))
    patchTask(taskId, { todayCount: v })
  }

  const frameLabel =
    screen === 'list'
      ? 'Pulse Count · Tasks'
      : screen === 'detail' && selected
        ? `Pulse Count · ${selected.name}`
        : selected
          ? `Pulse Count · ${selected.name} · Overview`
          : 'Pulse Count'

  return (
    <main className="min-h-dvh px-5 py-10 text-pc-text">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-center">
        <PhoneFrame ariaLabel={frameLabel}>
          {screen === 'list' && (
            <TaskListScreen
              tasks={tasks}
              onSelectTask={(id) => {
                setSelectedId(id)
                setScreen('detail')
              }}
            />
          )}

          {screen === 'detail' && selected && (
            <HomeScreen
              taskName={selected.name}
              todayCount={selected.todayCount}
              goal={selected.goal}
              streak={selected.streak}
              onIncrement={() =>
                patchTask(selected.id, { todayCount: selected.todayCount + 1 })
              }
              onDecrement={() =>
                patchTask(selected.id, {
                  todayCount: Math.max(0, selected.todayCount - 1),
                })
              }
              onSetCount={(n) => setTaskCount(selected.id, n)}
              onBackToTasks={() => {
                setScreen('list')
                setSelectedId(null)
              }}
              onGoOverview={() => setScreen('overview')}
            />
          )}

          {screen === 'overview' && selected && (
            <OverviewScreen
              taskName={selected.name}
              weeklyChecks={selected.weeklyChecks}
              weeklyPercent={selected.weeklyPercent}
              activity={activitySynced}
              onBack={() => setScreen('detail')}
            />
          )}
        </PhoneFrame>
      </div>
    </main>
  )
}
