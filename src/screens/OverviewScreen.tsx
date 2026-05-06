import type { ActivityRow } from '../components/RecentActivityList'
import type { WeekChecks } from '../components/WeeklyCheckRow'
import type { ReactNode } from 'react'
import { ProgressRing } from '../components/ProgressRing'
import { RecentActivityList } from '../components/RecentActivityList'
import { ReflectionCard } from '../components/ReflectionCard'
import { WeeklyCheckRow } from '../components/WeeklyCheckRow'
import { StatusBar } from '../ui/StatusBar'

export function OverviewScreen({
  weeklyChecks,
  weeklyPercent,
  activity,
}: {
  weeklyChecks: WeekChecks
  weeklyPercent: number
  activity: ActivityRow[]
}) {
  return (
    <div className="flex min-h-[720px] flex-col">
      <StatusBar />

      <div className="mt-1 flex items-center justify-between">
        <CircleButton ariaLabel="Back">
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
        </CircleButton>
        <CircleButton ariaLabel="More">
          <svg viewBox="0 0 20 20" className="h-4 w-4 text-pc-text/65" aria-hidden="true">
            <circle cx="6" cy="10" r="1.3" fill="currentColor" />
            <circle cx="10" cy="10" r="1.3" fill="currentColor" />
            <circle cx="14" cy="10" r="1.3" fill="currentColor" />
          </svg>
        </CircleButton>
      </div>

      <div className="mt-5 text-center">
        <div className="text-[28px] font-semibold tracking-tightish text-pc-text">Overview</div>
        <div className="mt-1 text-[13px] font-medium text-pc-text/60">Your week at a glance.</div>
      </div>

      <div className="mt-8 space-y-5">
        <WeeklyCheckRow checks={weeklyChecks} />
        <ProgressRing percent={weeklyPercent} />
        <ReflectionCard text="Consistency is built one decision at a time." />
        <RecentActivityList rows={activity} />
      </div>
    </div>
  )
}

function CircleButton({
  children,
  ariaLabel,
}: {
  children: ReactNode
  ariaLabel: string
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className="grid h-10 w-10 place-items-center rounded-full bg-pc-surface/70 shadow-neuSm active:scale-[0.99]"
    >
      {children}
    </button>
  )
}

