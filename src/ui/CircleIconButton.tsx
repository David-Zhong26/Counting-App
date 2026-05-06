import type { ReactNode } from 'react'

export function CircleIconButton({
  children,
  ariaLabel,
  onClick,
}: {
  children: ReactNode
  ariaLabel: string
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-pc-surface/70 shadow-neuSm active:scale-[0.99]"
    >
      {children}
    </button>
  )
}
