import type { ActivityRow } from '../components/RecentActivityList'
import type { WeekChecks } from '../components/WeeklyCheckRow'

export type Task = {
  id: string
  name: string
  todayCount: number
  goal: number
  streak: number
  weeklyPercent: number
  weeklyChecks: WeekChecks
  activity: ActivityRow[]
  /** Last ~120 days of counts keyed by YYYY-MM-DD. */
  dailyCounts: Record<string, number>
  /** Days this calendar week with count above zero (Mon–Sun). */
  weekDaysHit?: number
}
