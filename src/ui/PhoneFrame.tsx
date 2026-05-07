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
      className="relative w-full max-w-lg rounded-2xl bg-pc-surface/70 p-3 shadow-neu sm:p-4"
    >
      <div className="relative overflow-hidden rounded-xl bg-pc-bg">
        <div className="absolute inset-0 bg-[radial-gradient(900px_600px_at_20%_0%,rgba(255,255,255,0.55),transparent_55%)]" />
        <div className="relative max-h-[90dvh] overflow-y-auto px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))] sm:px-6">
          {children}
        </div>
      </div>
    </section>
  )
}
