import { SummaryPanel } from '../components/SummaryPanel'
import { PulseIcon } from '../ui/PulseIcon'
import { StatusBar } from '../ui/StatusBar'

export function HomeScreen({
  todayCount,
  goal,
  streak,
  onIncrement,
  onDecrement,
  onSetCount,
  onGoOverview,
}: {
  todayCount: number
  goal: number
  streak: number
  onIncrement: () => void
  onDecrement: () => void
  onSetCount: (n: number) => void
  onGoOverview: () => void
}) {
  return (
    <div className="flex min-h-[926px] flex-col">
      <StatusBar />

      <div className="mt-1 flex items-center justify-end">
        <button
          type="button"
          aria-label="Open overview"
          onClick={onGoOverview}
          className="grid h-10 w-10 place-items-center rounded-full bg-pc-surface/70 shadow-neuSm active:scale-[0.99]"
        >
          <svg viewBox="0 0 20 20" className="h-4 w-4 text-pc-text/65" aria-hidden="true">
            <path
              d="M4 14.8V11.4M8 14.8V8.2M12 14.8V10.2M16 14.8V6.4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <div className="mt-2 flex flex-col items-center text-center">
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
        <div className="relative inline-block pb-7">
          <div className="text-[86px] font-semibold leading-none tracking-tightish text-pc-accent tabular-nums">
            {todayCount}
          </div>
          <button
            type="button"
            onClick={onDecrement}
            disabled={todayCount <= 0}
            aria-label="Subtract one from today count"
            className="absolute bottom-1 left-0 grid h-8 min-w-[2rem] place-items-center rounded-full bg-pc-surface/80 px-2 text-[11px] font-semibold leading-none text-pc-accent shadow-neuSm transition enabled:active:scale-[0.99] disabled:pointer-events-none disabled:opacity-35"
          >
            −1
          </button>
        </div>
        <div className="mt-3 text-[12px] font-semibold tracking-[0.26em] text-pc-text/50">
          TODAY
        </div>

        <label className="mt-4 flex items-center gap-2">
          <span className="sr-only">Set today count</span>
          <input
            type="number"
            min={0}
            inputMode="numeric"
            aria-label="Set today count"
            value={todayCount}
            onChange={(e) => {
              const raw = e.target.value
              if (raw === '') {
                onSetCount(0)
                return
              }
              const n = Number(raw)
              if (!Number.isNaN(n)) onSetCount(n)
            }}
            className="w-[4.5rem] rounded-xl border-0 bg-pc-surface/70 px-2 py-1.5 text-center text-[13px] font-semibold text-pc-text shadow-neuInset outline-none ring-pc-accent/35 focus:ring-2"
          />
        </label>

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

