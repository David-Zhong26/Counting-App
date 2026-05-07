import { NeumorphicCard } from '../ui/NeumorphicCard'

export function SummaryPanel({
  today,
  goal,
  streak,
  onEditGoal,
}: {
  today: number
  goal: number
  streak: number
  onEditGoal?: () => void
}) {
  const labelClass =
    'text-[12px] font-medium leading-none tracking-[0.18em] text-pc-text/55'
  const valueClass = 'text-[22px] font-semibold leading-none tracking-tightish text-pc-text'

  return (
    <NeumorphicCard className="mt-6 px-5 py-4">
      <div className="grid grid-cols-3 grid-rows-2 items-center gap-x-2 gap-y-3 text-center sm:gap-x-3">
        <div className={`${labelClass} col-start-1 row-start-1`}>TODAY</div>

        {onEditGoal ? (
          <button
            type="button"
            onClick={onEditGoal}
            className="col-start-2 row-start-1 row-span-2 flex min-h-0 w-full flex-col items-center justify-center gap-2 rounded-xl2 border-0 bg-transparent p-0 transition hover:bg-pc-bg/35 active:scale-[0.99]"
            aria-label="Edit daily goal"
          >
            <span className={labelClass}>GOAL</span>
            <span className={valueClass}>{goal}</span>
          </button>
        ) : (
          <div className="col-start-2 row-start-1 row-span-2 flex flex-col items-center justify-center gap-2">
            <div className={labelClass}>GOAL</div>
            <div className={valueClass}>{goal}</div>
          </div>
        )}

        <div className={`${labelClass} col-start-3 row-start-1`}>STREAK</div>
        <div className={`${valueClass} col-start-1 row-start-2`}>{today}</div>
        <div className={`${valueClass} col-start-3 row-start-2`}>{streak}</div>
      </div>
    </NeumorphicCard>
  )
}
