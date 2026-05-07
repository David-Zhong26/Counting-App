import { NeumorphicCard } from '../ui/NeumorphicCard'

const labelClass =
  'text-[12px] font-medium leading-none tracking-[0.18em] text-pc-text/55'
const valueClass = 'text-[22px] font-semibold leading-none tracking-tightish text-pc-text'

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
  return (
    <NeumorphicCard className="mt-4 px-5 py-3">
      <div className="grid grid-cols-3 gap-x-2 text-center sm:gap-x-4">
        <div className="flex flex-col items-center gap-2">
          <div className={labelClass}>TODAY</div>
          <div className={valueClass}>{today}</div>
        </div>

        {onEditGoal ? (
          <button
            type="button"
            onClick={onEditGoal}
            className="flex w-full flex-col items-center gap-2 rounded-xl2 border-0 bg-transparent p-0 transition hover:bg-pc-bg/30 active:scale-[0.99]"
            aria-label="Edit goal total"
          >
            <span className={labelClass}>GOAL</span>
            <span className={valueClass}>{goal}</span>
          </button>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className={labelClass}>GOAL</div>
            <div className={valueClass}>{goal}</div>
          </div>
        )}

        <div className="flex flex-col items-center gap-2">
          <div className={labelClass}>STREAK</div>
          <div className={valueClass}>{streak}</div>
        </div>
      </div>
    </NeumorphicCard>
  )
}
