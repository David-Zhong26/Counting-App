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
  return (
    <NeumorphicCard className="mt-6 px-5 py-4">
      <div className="grid grid-cols-3 gap-3 text-center">
        <SummaryItem label="Today" value={today} />
        <SummaryItem label="Goal" value={goal} onPress={onEditGoal ?? undefined} />
        <SummaryItem label="Streak" value={streak} />
      </div>
    </NeumorphicCard>
  )
}

function SummaryItem({
  label,
  value,
  onPress,
}: {
  label: string
  value: number
  onPress?: () => void
}) {
  const inner = (
    <>
      <div className="text-[12px] font-medium tracking-[0.18em] text-pc-text/55">
        {label.toUpperCase()}
      </div>
      <div className="text-[22px] font-semibold tracking-tightish text-pc-text">{value}</div>
    </>
  )

  if (onPress) {
    return (
      <button
        type="button"
        onClick={onPress}
        className="flex flex-col gap-1 rounded-xl2 px-1 py-1 transition hover:bg-pc-bg/40 active:scale-[0.99]"
        aria-label="Edit daily goal"
      >
        {inner}
      </button>
    )
  }

  return <div className="flex flex-col gap-1">{inner}</div>
}
