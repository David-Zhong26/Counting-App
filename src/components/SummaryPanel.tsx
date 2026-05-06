import { NeumorphicCard } from '../ui/NeumorphicCard'

export function SummaryPanel({
  today,
  goal,
  streak,
}: {
  today: number
  goal: number
  streak: number
}) {
  return (
    <NeumorphicCard className="mt-6 px-5 py-4">
      <div className="grid grid-cols-3 gap-3 text-center">
        <SummaryItem label="Today" value={today} />
        <SummaryItem label="Goal" value={goal} />
        <SummaryItem label="Streak" value={streak} />
      </div>
    </NeumorphicCard>
  )
}

function SummaryItem({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="text-[12px] font-medium tracking-[0.18em] text-pc-text/55">
        {label.toUpperCase()}
      </div>
      <div className="text-[22px] font-semibold tracking-tightish text-pc-text">{value}</div>
    </div>
  )
}

