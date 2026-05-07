import type { ReactNode } from 'react'

/** Full-bleed shell (no “phone card” frame). Safe areas only. */
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
      className="relative min-h-dvh w-full max-w-full"
    >
      <div className="relative min-h-dvh w-full overflow-x-hidden overflow-y-auto px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-5">
        {children}
      </div>
    </section>
  )
}
