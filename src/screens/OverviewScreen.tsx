import type { ActivityRow } from '../components/RecentActivityList'
import type { WeekChecks } from '../components/WeeklyCheckRow'
import { ProgressRing } from '../components/ProgressRing'
import { RecentActivityList } from '../components/RecentActivityList'
import { ReflectionCard } from '../components/ReflectionCard'
import { WeeklyCheckRow } from '../components/WeeklyCheckRow'
import { CircleIconButton } from '../ui/CircleIconButton'
export function OverviewScreen({
  displayName,
  taskName,
  weeklyChecks,
  weeklyPercent,
  weekDaysHit,
  activity,
  onBack,
}: {
  displayName: string | null
  taskName: string
  weeklyChecks: WeekChecks
  weeklyPercent: number
  weekDaysHit: number
  activity: ActivityRow[]
  onBack: () => void
}) {
  const greetingLine = `你好呀～${displayName?.trim() || '朋友'}`
  return (
    <div className="flex min-h-dvh flex-col">
      <div className="mt-1 flex items-center justify-between">
        <CircleIconButton ariaLabel="Back to task" onClick={onBack}>
          <svg viewBox="0 0 20 20" className="h-4 w-4 text-pc-text/65" aria-hidden="true">
            <path
              d="M12.6 4.4 7 10l5.6 5.6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </CircleIconButton>
        <div className="w-10 shrink-0" aria-hidden />
      </div>

      <div className="mt-5 text-center">
        <div className="text-[17px] font-semibold tracking-tightish text-pc-text">{greetingLine}</div>
        <div className="mt-2 text-[13px] font-medium text-pc-text/60">
          {taskName} · Your week at a glance.
        </div>
      </div>

      <div className="mt-8 space-y-5">
        <WeeklyCheckRow checks={weeklyChecks} />
        <ProgressRing percent={weeklyPercent} daysHit={weekDaysHit} />
        <ReflectionCard text="Consistency is built one decision at a time." />
        <RecentActivityList rows={activity} />
      </div>
    </div>
  )
}
