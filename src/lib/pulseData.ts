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

const HISTORY_DAYS = 120

export async function loadPulseTasks(userId: string): Promise<Task[]> {
  const { data: taskRowsRaw, error: taskErr } = await supabase
    .from('tasks')
    .select('id,name,goal,created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })

  if (taskErr) throw taskErr
  const taskRows = taskRowsRaw as TaskRow[] | null
  if (!taskRows?.length) return []

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
      count: 0,
    })
    if (insErr) throw insErr
  }
}

export async function fetchDisplayName(userId: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('display_name')
    .eq('id', userId)
    .maybeSingle()

  if (error) throw error
  const row = data as { display_name: string | null } | null
  const n = row?.display_name?.trim()
  return n ? n : null
}

export async function saveDisplayName(userId: string, name: string) {
  const trimmed = name.trim()
  const { error } = await supabase.from('profiles').upsert(
    {
      id: userId,
      display_name: trimmed || null,
    },
    { onConflict: 'id' },
  )
  if (error) throw error
}

export async function createTask(userId: string, name: string, goal: number): Promise<string> {
  const g = Math.max(0, Math.floor(goal))
  const nm = name.trim()
  if (!nm) throw new Error('Task name is required.')

  const { data: inserted, error } = await supabase
    .from('tasks')
    .insert({ user_id: userId, name: nm, goal: g })
    .select('id')
    .single()

  if (error) throw error
  const taskId = (inserted as { id: string }).id

  const todayStr = toLocalDateString(new Date())
  await ensureTodayRows(userId, [taskId], todayStr)

  return taskId
}

export async function updateTaskGoal(userId: string, taskId: string, goal: number) {
  const g = Math.max(0, Math.floor(goal))
  const { error } = await supabase
    .from('tasks')
    .update({ goal: g })
    .eq('id', taskId)
    .eq('user_id', userId)

  if (error) throw error
}

export async function updateTaskName(userId: string, taskId: string, name: string) {
  const nm = name.trim()
  if (!nm) throw new Error('Task name is required.')

  const { error } = await supabase
    .from('tasks')
    .update({ name: nm })
    .eq('id', taskId)
    .eq('user_id', userId)

  if (error) throw error
}

export async function deleteTask(userId: string, taskId: string) {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId)
    .eq('user_id', userId)

  if (error) throw error
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
