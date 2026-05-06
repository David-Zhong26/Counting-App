import type { Task } from '../types/task'
import { addCalendarDays, toLocalDateString } from './dateUtils'
import { buildTaskView, type DailyRow } from './taskStats'
import { supabase } from './supabase.js'

type TaskRow = {
  id: string
  name: string
  goal: number
  created_at: string
}

type DailyCountDbRow = {
  task_id: string
  date: string
  count: number
  updated_at: string
}

const DEFAULT_TASKS = [
  { name: 'Deep work', goal: 50 },
  { name: 'Water', goal: 8 },
  { name: 'Stretch', goal: 5 },
] as const

const HISTORY_DAYS = 120

export async function loadPulseTasks(userId: string): Promise<Task[]> {
  await ensureDefaultTasks(userId)

  const { data: taskRowsRaw, error: taskErr } = await supabase
    .from('tasks')
    .select('id,name,goal,created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })

  if (taskErr) throw taskErr
  const taskRows = taskRowsRaw as TaskRow[] | null
  if (!taskRows?.length) throw new Error('No tasks available')

  const todayStr = toLocalDateString(new Date())
  await ensureTodayRows(
    userId,
    taskRows.map((t) => t.id),
    todayStr,
  )

  const since = addCalendarDays(todayStr, -HISTORY_DAYS)
  const { data: dailyRowsRaw, error: dailyErr } = await supabase
    .from('daily_counts')
    .select('task_id,date,count,updated_at')
    .eq('user_id', userId)
    .gte('date', since)

  if (dailyErr) throw dailyErr

  const dailyRows = dailyRowsRaw as DailyCountDbRow[] | null

  const byTask = new Map<string, DailyRow[]>()
  for (const row of dailyRows ?? []) {
    const tid = row.task_id
    const list = byTask.get(tid) ?? []
    list.push({
      date: row.date as string,
      count: row.count as number,
      updated_at: row.updated_at as string,
    })
    byTask.set(tid, list)
  }

  return taskRows.map((t) =>
    buildTaskView({
      taskId: t.id,
      name: t.name,
      goal: t.goal,
      dailyRows: byTask.get(t.id) ?? [],
      todayStr,
    }),
  )
}

async function ensureDefaultTasks(userId: string) {
  const { data: existing, error: exErr } = await supabase
    .from('tasks')
    .select('id')
    .eq('user_id', userId)
    .limit(1)

  if (exErr) throw exErr
  if (existing?.length) return

  const { error } = await supabase.from('tasks').insert(
    DEFAULT_TASKS.map((t) => ({
      user_id: userId,
      name: t.name,
      goal: t.goal,
    })),
  )
  if (error) throw error
}

async function ensureTodayRows(userId: string, taskIds: string[], todayStr: string) {
  for (const taskId of taskIds) {
    const { data: row, error: selErr } = await supabase
      .from('daily_counts')
      .select('id')
      .eq('task_id', taskId)
      .eq('date', todayStr)
      .maybeSingle()

    if (selErr) throw selErr
    if (row) continue

    const { error: insErr } = await supabase.from('daily_counts').insert({
      user_id: userId,
      task_id: taskId,
      date: todayStr,
      count: 24,
    })
    if (insErr) throw insErr
  }
}

export async function upsertTodayCount(userId: string, taskId: string, count: number) {
  const todayStr = toLocalDateString(new Date())
  const v = Math.max(0, Math.floor(count))

  const { error } = await supabase.from('daily_counts').upsert(
    {
      user_id: userId,
      task_id: taskId,
      date: todayStr,
      count: v,
    },
    { onConflict: 'task_id,date' },
  )

  if (error) throw error
}
