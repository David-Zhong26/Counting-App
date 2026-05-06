import { useCallback, useEffect, useMemo, useState } from 'react'
import { HomeScreen } from './screens/HomeScreen'
import { OverviewScreen } from './screens/OverviewScreen'
import { TaskListScreen } from './screens/TaskListScreen'
import type { ActivityRow } from './components/RecentActivityList'
import type { Task } from './types/task'
import { loadPulseTasks, upsertTodayCount } from './lib/pulseData'
import { supabase } from './lib/supabase.js'

export function PulseApp({ userId }: { userId: string }) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [screen, setScreen] = useState<'list' | 'detail' | 'overview'>('list')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setError(null)
    const data = await loadPulseTasks(userId)
    setTasks(data)
  }, [userId])

  useEffect(() => {
    let cancelled = false
    loadPulseTasks(userId)
      .then((data) => {
        if (!cancelled) {
          setTasks(data)
          setError(null)
        }
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load data.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [userId])

  const selected = useMemo(
    () => tasks.find((t) => t.id === selectedId) ?? null,
    [tasks, selectedId],
  )

  const activitySynced = useMemo(() => {
    if (!selected) return []
    return selected.activity.map((row: ActivityRow) =>
      row.label === 'Today' ? { ...row, count: selected.todayCount } : row,
    )
  }, [selected])

  async function persistCount(taskId: string, next: number) {
    await upsertTodayCount(userId, taskId, next)
    await refresh()
  }

  const frameLabel =
    screen === 'list'
      ? '小宝数数 · Tasks'
      : screen === 'detail' && selected
        ? `小宝数数 · ${selected.name}`
        : selected
          ? `小宝数数 · ${selected.name} · Overview`
          : '小宝数数'

  if (loading) {
    return (
      <output
        aria-label={frameLabel}
        className="grid min-h-[926px] place-items-center text-[13px] font-medium text-pc-text/55"
      >
        Loading…
      </output>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-[926px] flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-[13px] font-medium leading-relaxed text-pc-text/75">{error}</p>
        <button
          type="button"
          onClick={() => {
            setLoading(true)
            setError(null)
            loadPulseTasks(userId)
              .then(setTasks)
              .catch((e: unknown) =>
                setError(e instanceof Error ? e.message : 'Failed to load data.'),
              )
              .finally(() => setLoading(false))
          }}
          className="rounded-xl2 bg-white px-5 py-2.5 text-[13px] font-semibold text-pc-accent shadow-[12px_14px_28px_rgba(27,51,46,0.18),-10px_-10px_22px_rgba(255,255,255,0.75)]"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <>
      {screen === 'list' && (
        <TaskListScreen
          tasks={tasks}
          onSelectTask={(id) => {
            setSelectedId(id)
            setScreen('detail')
          }}
          onLogout={() => void supabase.auth.signOut()}
        />
      )}

      {screen === 'detail' && selected && (
        <HomeScreen
          taskName={selected.name}
          todayCount={selected.todayCount}
          goal={selected.goal}
          streak={selected.streak}
          onIncrement={() => void persistCount(selected.id, selected.todayCount + 1)}
          onDecrement={() =>
            void persistCount(selected.id, Math.max(0, selected.todayCount - 1))
          }
          onSetCount={(n) => void persistCount(selected.id, n)}
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
          weekDaysHit={selected.weekDaysHit ?? 0}
          activity={activitySynced}
          onBack={() => setScreen('detail')}
        />
      )}
    </>
  )
}
