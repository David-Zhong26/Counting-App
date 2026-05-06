import { NeumorphicCard } from '../ui/NeumorphicCard'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const

export type WeekChecks = Record<(typeof DAYS)[number], boolean>

export function WeeklyCheckRow({ checks }: { checks: WeekChecks }) {
  return (
    <NeumorphicCard className="px-5 py-4">
      <div className="text-[12px] font-semibold tracking-[0.14em] text-pc-text/55">
        THIS WEEK
      </div>

      <div className="mt-3 grid grid-cols-7 gap-2">
        {DAYS.map((d) => (
          <Day key={d} day={d} checked={checks[d]} />
        ))}
      </div>
    </NeumorphicCard>
  )
}

function Day({ day, checked }: { day: string; checked: boolean }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="text-[11px] font-medium text-pc-text/60">{day}</div>
      <div
        className={[
          'grid h-7 w-7 place-items-center rounded-full shadow-neuInset',
          checked ? 'bg-pc-accent text-pc-offwhite' : 'bg-pc-surface2/60 text-transparent',
        ].join(' ')}
        aria-label={`${day} ${checked ? 'checked' : 'not checked'}`}
      >
        <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden="true">
          <path
            d="M16.6 5.6 8.6 14.2 3.8 9.4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  )
}

