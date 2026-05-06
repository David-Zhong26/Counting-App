import { SummaryPanel } from '../components/SummaryPanel'
import { PulseIcon } from '../ui/PulseIcon'
import { StatusBar } from '../ui/StatusBar'

export function HomeScreen({
  todayCount,
  goal,
  streak,
  onIncrement,
}: {
  todayCount: number
  goal: number
  streak: number
  onIncrement: () => void
}) {
  return (
    <div className="flex min-h-[720px] flex-col">
      <StatusBar />

      <div className="mt-4 flex flex-col items-center text-center">
        <div className="grid h-12 w-12 place-items-center rounded-full bg-pc-surface/70 shadow-neuInset">
          <PulseIcon className="h-6 w-6 text-pc-accent/90" />
        </div>

        <div className="mt-5 text-[26px] font-semibold tracking-tightish text-pc-text">
          Pulse Count
        </div>
        <div className="mt-1 text-[13px] font-medium text-pc-text/60">
          Small steps, lasting change.
        </div>
      </div>

      <div className="mt-14 flex flex-1 flex-col items-center">
        <div className="text-[86px] font-semibold leading-none tracking-tightish text-pc-accent">
          {todayCount}
        </div>
        <div className="mt-3 text-[12px] font-semibold tracking-[0.26em] text-pc-text/50">
          TODAY
        </div>

        <button
          type="button"
          onClick={onIncrement}
          className="mt-10 grid h-28 w-28 place-items-center rounded-full bg-white shadow-[12px_14px_28px_rgba(27,51,46,0.18),-10px_-10px_22px_rgba(255,255,255,0.75)] transition active:scale-[0.99]"
          aria-label="Add one"
        >
          <span className="text-[34px] font-semibold tracking-tightish text-pc-accent">+1</span>
        </button>

        <div className="mt-auto w-full">
          <SummaryPanel today={todayCount} goal={goal} streak={streak} />
        </div>
      </div>
    </div>
  )
}

