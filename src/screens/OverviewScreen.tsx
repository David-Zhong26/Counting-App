import type { ActivityRow } from '../components/RecentActivityList'
import { MonthCalendar } from '../components/MonthCalendar'
import { ProgressRing } from '../components/ProgressRing'
import { RecentActivityList } from '../components/RecentActivityList'
import { CircleIconButton } from '../ui/CircleIconButton'
import type { Lang } from '../lib/lang'
import { strings } from '../lib/strings'
export function OverviewScreen({
  lang,
  displayName,
  taskName,
  weeklyPercent,
  weekDaysHit,
  activity,
  dailyCounts,
  todayStr,
  onBack,
}: {
  lang: Lang
  displayName: string | null
  taskName: string
  weeklyPercent: number
  weekDaysHit: number
  activity: ActivityRow[]
  dailyCounts: Record<string, number>
  todayStr: string
  onBack: () => void
}) {
  const s = strings(lang)
  const greetingLine = s.greeting(displayName)
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
        <MonthCalendar lang={lang} dailyCounts={dailyCounts} todayStr={todayStr} />
        <ProgressRing percent={weeklyPercent} daysHit={weekDaysHit} />
        <RecentActivityList lang={lang} rows={activity} />
      </div>
    </div>
  )
}
