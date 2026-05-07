import type { ActivityRow } from '../components/RecentActivityList'
import type { WeekChecks } from '../components/WeeklyCheckRow'
import type { Task } from '../types/task'
import {
  addCalendarDays,
  parseLocalDate,
  startOfWeekMonday,
  toLocalDateString,
  weekdayKeyFromDate,
} from './dateUtils'

export type DailyRow = {
  date: string
  count: number
  updated_at: string
}

function formatActivityLabel(dateStr: string, todayStr: string): string {
  if (dateStr === todayStr) return 'Today'
  const y = addCalendarDays(todayStr, -1)
  if (dateStr === y) return 'Yesterday'
  return parseLocalDate(dateStr).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
}

export function buildActivityRows(rows: DailyRow[], todayStr: string): ActivityRow[] {
  const sorted = [...rows].sort((a, b) => b.date.localeCompare(a.date))
  const top = sorted.slice(0, 3)
  return top.map((r) => ({
    label: formatActivityLabel(r.date, todayStr),
    count: r.count,
    time: formatTime(r.updated_at),
  }))
}

export function computeStreak(countByDate: Map<string, number>, todayStr: string): number {
  let streak = 0
  const cursor = parseLocalDate(todayStr)
  for (let i = 0; i < 400; i++) {
    const key = toLocalDateString(cursor)
    const c = countByDate.get(key) ?? 0
    if (c > 0) streak += 1
    else break
    cursor.setDate(cursor.getDate() - 1)
  }
  return streak
}

export function computeWeekStats(
  countByDate: Map<string, number>,
  todayStr: string,
): { checks: WeekChecks; daysHit: number; percent: number } {
  const today = parseLocalDate(todayStr)
  const monday = startOfWeekMonday(today)

  const checks: WeekChecks = {
    Mon: false,
    Tue: false,
    Wed: false,
    Thu: false,
    Fri: false,
    Sat: false,
    Sun: false,
  }

  let hit = 0
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    const key = toLocalDateString(d)
    const ok = (countByDate.get(key) ?? 0) > 0
    const label = weekdayKeyFromDate(d)
    checks[label] = ok
    if (ok) hit += 1
  }

  const percent = Math.round((hit / 7) * 100)
  return { checks, daysHit: hit, percent }
}

export function buildTaskView(args: {
  taskId: string
  name: string
  goal: number
  dailyRows: DailyRow[]
  todayStr: string
}): Task {
  const { taskId, name, goal, dailyRows, todayStr } = args

  const countByDate = new Map<string, number>()
  const metaByDate = new Map<string, string>()
  for (const r of dailyRows) {
    countByDate.set(r.date, r.count)
    metaByDate.set(r.date, r.updated_at)
  }

  const todayCount = countByDate.get(todayStr) ?? 0
  const streak = computeStreak(countByDate, todayStr)
  const { checks, daysHit, percent } = computeWeekStats(countByDate, todayStr)
  const activity = buildActivityRows(
    dailyRows.map((r) => ({
      date: r.date,
      count: r.count,
      updated_at: r.updated_at,
    })),
    todayStr,
  )

  return {
    id: taskId,
    name,
    goal,
    todayCount,
    streak,
    weeklyPercent: percent,
    weeklyChecks: checks,
    activity,
    dailyCounts: Object.fromEntries(countByDate.entries()),
    weekDaysHit: daysHit,
  }
}
