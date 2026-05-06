import { NeumorphicCard } from '../ui/NeumorphicCard'

export function ProgressRing({
  percent,
  caption = "You're on track.",
}: {
  percent: number
  caption?: string
}) {
  const clamped = Math.max(0, Math.min(100, percent))

  const size = 112
  const stroke = 10
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const dash = (clamped / 100) * c

  return (
    <NeumorphicCard className="px-5 py-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-[13px] font-semibold tracking-tightish text-pc-text">
            Weekly Progress
          </div>
          <div className="mt-1 text-[12px] font-medium text-pc-text/60">{caption} ✦</div>
        </div>

        <div className="relative">
          <svg width={size} height={size} className="drop-shadow-[0_10px_18px_rgba(27,51,46,0.14)]">
            <circle
              cx={size / 2}
              cy={size / 2}
              r={r}
              stroke="rgba(39,65,59,0.12)"
              strokeWidth={stroke}
              fill="none"
            />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={r}
              stroke="var(--pc-accent)"
              strokeWidth={stroke}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${dash} ${c - dash}`}
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
          </svg>

          <div className="absolute inset-0 grid place-items-center">
            <div className="text-center">
              <div className="text-[22px] font-semibold tracking-tightish text-pc-text">
                {clamped}%
              </div>
              <div className="text-[11px] font-medium text-pc-text/60">5 of 7 days</div>
            </div>
          </div>
        </div>
      </div>
    </NeumorphicCard>
  )
}

