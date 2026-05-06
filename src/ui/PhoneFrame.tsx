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
      className="relative w-[428px] max-w-[min(428px,calc(100vw-2rem))] rounded-[52px] bg-pc-surface/70 p-[15px] shadow-neu"
    >
      {/* iPhone 13 Pro Max uses a notch (not Dynamic Island). */}
      <div
        className="pointer-events-none absolute left-1/2 top-[14px] z-10 h-[30px] w-[154px] -translate-x-1/2 rounded-b-[18px] bg-[#111817]/88 shadow-[inset_0_-1px_0_rgba(255,255,255,0.06)]"
        aria-hidden
      />
      <div className="relative overflow-hidden rounded-[40px] bg-pc-bg">
        <div className="absolute inset-0 bg-[radial-gradient(900px_600px_at_20%_0%,rgba(255,255,255,0.55),transparent_55%)]" />
        {/* Logical canvas height: 926 pt — iPhone 13 Pro Max; scroll on short viewports */}
        <div className="relative max-h-[90dvh] overflow-y-auto px-6 pb-7 pt-5">{children}</div>
      </div>
    </section>
  )
}

