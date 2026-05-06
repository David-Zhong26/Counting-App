import type { ReactNode } from 'react'

export function PhoneFrame({
  children,
  ariaLabel,
}: {
  children: ReactNode
  ariaLabel: string
}) {
  return (
    <section
      aria-label={ariaLabel}
      className="relative w-[340px] rounded-[44px] bg-pc-surface/70 p-[14px] shadow-neu"
    >
      <div className="pointer-events-none absolute left-1/2 top-[12px] h-[28px] w-[160px] -translate-x-1/2 rounded-full bg-pc-surface2/70 shadow-neuInset" />
      <div className="relative overflow-hidden rounded-[34px] bg-pc-bg">
        <div className="absolute inset-0 bg-[radial-gradient(900px_600px_at_20%_0%,rgba(255,255,255,0.55),transparent_55%)]" />
        <div className="relative min-h-[720px] px-6 pb-7 pt-5">{children}</div>
      </div>
    </section>
  )
}

