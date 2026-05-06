import { NeumorphicCard } from '../ui/NeumorphicCard'

export function ReflectionCard({ text }: { text: string }) {
  return (
    <NeumorphicCard className="px-5 py-5">
      <div className="text-[12px] font-semibold tracking-[0.14em] text-pc-text/55">
        REFLECTION
      </div>
      <div className="mt-3 text-[14px] font-medium leading-relaxed text-pc-text/80">{text}</div>
      <div className="mt-4 flex justify-end">
        <div className="h-10 w-10 rounded-full bg-pc-surface2/60 shadow-neuInset">
          <div className="h-full w-full rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.55),transparent_62%)]" />
        </div>
      </div>
    </NeumorphicCard>
  )
}

