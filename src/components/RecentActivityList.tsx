import { NeumorphicCard } from '../ui/NeumorphicCard'

export type ActivityRow = {
  label: string
  count: number
  time: string
}

export function RecentActivityList({ rows }: { rows: ActivityRow[] }) {
  return (
    <NeumorphicCard className="px-5 py-5">
      <div className="text-[12px] font-semibold tracking-[0.14em] text-pc-text/55">
        RECENT ACTIVITY
      </div>

      <div className="mt-3 space-y-3">
        {rows.slice(0, 3).map((r) => (
          <div key={`${r.label}-${r.time}`} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="grid h-6 w-6 place-items-center rounded-full bg-pc-accent/15 shadow-neuInset">
                <svg viewBox="0 0 20 20" className="h-4 w-4 text-pc-accent" aria-hidden="true">
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
              <div>
                <div className="text-[13px] font-semibold text-pc-text">{r.label}</div>
                <div className="text-[12px] font-medium text-pc-text/60">{r.count}</div>
              </div>
            </div>

            <div className="text-[12px] font-medium text-pc-text/55">{r.time}</div>
          </div>
        ))}
      </div>
    </NeumorphicCard>
  )
}

