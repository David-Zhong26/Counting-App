import type { ReactNode } from 'react'

export function NeumorphicCard({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`rounded-xl3 bg-pc-surface/70 shadow-neuSm backdrop-blur-[1px] ${className}`}>
      {children}
    </div>
  )
}

