import type { ReactNode } from 'react'

export function ModalShell({
  title,
  children,
  footer,
  onClose,
}: {
  title: string
  children: ReactNode
  footer: ReactNode
  onClose: () => void
}) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(27,51,46,0.22)] px-4 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="relative w-full max-w-[300px] rounded-xl3 bg-pc-surface/95 px-5 py-5 shadow-neu">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full text-pc-text/45 transition hover:bg-pc-bg/60 hover:text-pc-text/70"
        >
          ×
        </button>
        <h2 id="modal-title" className="pr-8 text-[16px] font-semibold tracking-tightish text-pc-text">
          {title}
        </h2>
        <div className="mt-4">{children}</div>
        <div className="mt-6">{footer}</div>
      </div>
    </div>
  )
}
