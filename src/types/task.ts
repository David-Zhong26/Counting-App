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
  /** Days this calendar week with count above zero (Mon–Sun). */
  weekDaysHit?: number
}
