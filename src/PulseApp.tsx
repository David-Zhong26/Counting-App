import { useCallback, useEffect, useMemo, useState } from 'react'
import { HomeScreen } from './screens/HomeScreen'
import { OverviewScreen } from './screens/OverviewScreen'
import { TaskListScreen } from './screens/TaskListScreen'
import type { ActivityRow } from './components/RecentActivityList'
import type { Task } from './types/task'
import {
  createTask,
  deleteTask,
  fetchDisplayName,
  loadPulseTasks,
  saveDisplayName,
  updateTaskGoal,
  updateTaskName,
  upsertTodayCount,
} from './lib/pulseData'
import { toErrorMessage } from './lib/toErrorMessage'
import { supabase } from './lib/supabase.js'
import { toLocalDateString } from './lib/dateUtils'

export function PulseApp({ userId }: { userId: string }) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [displayName, setDisplayName] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [screen, setScreen] = useState<'list' | 'detail' | 'overview'>('list')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    try {
      setError(null)
      const [taskData, name] = await Promise.all([
        loadPulseTasks(userId),
        fetchDisplayName(userId),
      ])
      setTasks(taskData)
      setDisplayName(name)
    } catch (e: unknown) {
      console.error('[小宝数数] refresh', e)
      setError(toErrorMessage(e))
    }
  }, [userId])

  useEffect(() => {
    let cancelled = false
    Promise.all([loadPulseTasks(userId), fetchDisplayName(userId)])
      .then(([taskData, name]) => {
        if (!cancelled) {
          setTasks(taskData)
          setDisplayName(name)
          setError(null)
        }
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          console.error('[小宝数数] loadPulseTasks', e)
          setError(toErrorMessage(e))
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [userId])

  useEffect(() => {
    if (selectedId && !tasks.some((t) => t.id === selectedId)) {
      setSelectedId(null)
      setScreen('list')
    }
  }, [tasks, selectedId])

  useEffect(() => {
    if (tasks.length === 0 && screen !== 'list') {
      setScreen('list')
      setSelectedId(null)
    }
  }, [tasks.length, screen])

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
      ? 'Tasks'
      : screen === 'detail' && selected
        ? selected.name
        : selected
          ? `${selected.name} · Overview`
          : 'App'

  if (loading) {
    return (
      <output
        aria-label={frameLabel}
        className="grid min-h-dvh place-items-center text-[13px] font-medium text-pc-text/55"
      >
        Loading…
      </output>
    )
  }

  if (error) {
    const showSchemaHint =
      /relation|does not exist|42883|42P01/i.test(error) ||
      error.toLowerCase().includes('permission denied')

    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="max-w-[280px] text-[13px] font-medium leading-relaxed text-pc-text/75">
          {error}
        </p>
        {showSchemaHint && (
          <p className="max-w-[280px] text-[11px] font-medium leading-relaxed text-pc-text/50">
            常见原因：尚未在 Supabase 执行仓库里的 <span className="text-pc-text/65">supabase/schema.sql</span>
            ，或表结构与当前 App 不一致（需要含 <span className="text-pc-text/65">tasks</span>、
            <span className="text-pc-text/65">profiles</span> 与带{' '}
            <span className="text-pc-text/65">task_id</span> 的 <span className="text-pc-text/65">daily_counts</span>
            ）。
          </p>
        )}
        <button
          type="button"
          onClick={() => {
            setLoading(true)
            setError(null)
            Promise.all([loadPulseTasks(userId), fetchDisplayName(userId)])
              .then(([taskData, name]) => {
                setTasks(taskData)
                setDisplayName(name)
              })
              .catch((e: unknown) => {
                console.error('[小宝数数] loadPulseTasks retry', e)
                setError(toErrorMessage(e))
              })
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
          displayName={displayName}
          tasks={tasks}
          onSelectTask={(id) => {
            setSelectedId(id)
            setScreen('detail')
          }}
          onCreateTask={async (name, goal) => {
            await createTask(userId, name, goal)
            await refresh()
          }}
          onDeleteTask={async (taskId) => {
            await deleteTask(userId, taskId)
            await refresh()
          }}
          onRenameTask={async (taskId, name) => {
            await updateTaskName(userId, taskId, name)
            await refresh()
          }}
          onSaveDisplayName={async (name) => {
            await saveDisplayName(userId, name)
            await refresh()
          }}
          onLogout={() => void supabase.auth.signOut()}
        />
      )}

      {screen === 'detail' && selected && (
        <HomeScreen
          displayName={displayName}
          taskName={selected.name}
          todayCount={selected.todayCount}
          goal={selected.goal}
          streak={selected.streak}
          onIncrement={() => void persistCount(selected.id, selected.todayCount + 1)}
          onIncrementBy3={() => void persistCount(selected.id, selected.todayCount + 3)}
          onDecrement={() =>
            void persistCount(selected.id, Math.max(0, selected.todayCount - 1))
          }
          onSetCount={(n) => void persistCount(selected.id, n)}
          onUpdateGoal={async (g) => {
            await updateTaskGoal(userId, selected.id, g)
            await refresh()
          }}
          onUpdateTaskName={async (name) => {
            await updateTaskName(userId, selected.id, name)
            await refresh()
          }}
          onBackToTasks={() => {
            setScreen('list')
            setSelectedId(null)
          }}
          onGoOverview={() => setScreen('overview')}
        />
      )}

      {screen === 'overview' && selected && (
        <OverviewScreen
          displayName={displayName}
          taskName={selected.name}
          weeklyPercent={selected.weeklyPercent}
          weekDaysHit={selected.weekDaysHit ?? 0}
          activity={activitySynced}
          dailyCounts={selected.dailyCounts}
          todayStr={toLocalDateString(new Date())}
          onBack={() => setScreen('detail')}
        />
      )}
    </>
  )
}
