import { useEffect, useRef, useState } from 'react'
import { SummaryPanel } from '../components/SummaryPanel'
import { CircleIconButton } from '../ui/CircleIconButton'
import { PulseIcon } from '../ui/PulseIcon'
import { StatusBar } from '../ui/StatusBar'

export function HomeScreen({
  taskName,
  todayCount,
  goal,
  streak,
  onIncrement,
  onDecrement,
  onSetCount,
  onBackToTasks,
  onGoOverview,
}: {
  taskName: string
  todayCount: number
  goal: number
  streak: number
  onIncrement: () => void
  onDecrement: () => void
  onSetCount: (n: number) => void
  onBackToTasks: () => void
  onGoOverview: () => void
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(String(todayCount))
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!editing) setDraft(String(todayCount))
  }, [todayCount, editing])

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [editing])

  function commitEdit() {
    const raw = draft.trim()
    if (raw === '') {
      onSetCount(0)
    } else {
      const n = Number(raw)
      if (!Number.isNaN(n)) onSetCount(n)
    }
    setEditing(false)
  }

  function cancelEdit() {
    setDraft(String(todayCount))
    setEditing(false)
  }

  return (
    <div className="flex min-h-[926px] flex-col">
      <StatusBar />

      <div className="mt-1 flex items-center justify-between">
        <CircleIconButton ariaLabel="Back to tasks" onClick={onBackToTasks}>
          <svg viewBox="0 0 20 20" className="h-4 w-4 text-pc-text/65" aria-hidden="true">
            <path
              d="M12.6 4.4 7 10l5.6 5.6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </CircleIconButton>
        <CircleIconButton ariaLabel="Open task overview and calendar" onClick={onGoOverview}>
          <svg viewBox="0 0 20 20" className="h-4 w-4 text-pc-text/65" aria-hidden="true">
            <path
              d="M4 14.8V11.4M8 14.8V8.2M12 14.8V10.2M16 14.8V6.4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </CircleIconButton>
      </div>

      <div className="mt-2 flex flex-col items-center text-center">
        <div className="grid h-12 w-12 place-items-center rounded-full bg-pc-surface/70 shadow-neuInset">
          <PulseIcon className="h-6 w-6 text-pc-accent/90" />
        </div>

        <div className="mt-5 max-w-[18rem] text-[26px] font-semibold tracking-tightish text-pc-text">
          {taskName}
        </div>
        <div className="mt-1 text-[13px] font-medium text-pc-text/60">
          Small steps, lasting change.
        </div>
      </div>

      <div className="mt-14 flex flex-1 flex-col items-center">
        <div className="relative inline-block pb-7">
          {editing ? (
            <input
              ref={inputRef}
              type="text"
              inputMode="numeric"
              aria-label="Edit today count"
              value={draft}
              onChange={(e) => setDraft(e.target.value.replace(/\D/g, ''))}
              onBlur={commitEdit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') commitEdit()
                if (e.key === 'Escape') cancelEdit()
              }}
              className="max-w-[min(320px,calc(100vw-4rem))] border-0 bg-transparent text-center text-[86px] font-semibold leading-none tracking-tightish text-pc-accent tabular-nums outline-none ring-pc-accent/35 focus:ring-2"
            />
          ) : (
            <button
              type="button"
              onDoubleClick={() => {
                setDraft(String(todayCount))
                setEditing(true)
              }}
              className="cursor-pointer border-0 bg-transparent p-0 text-[86px] font-semibold leading-none tracking-tightish text-pc-accent tabular-nums outline-none"
              aria-label={`Today count ${todayCount}. Double-click to edit.`}
              title="Double-click to edit"
            >
              {todayCount}
            </button>
          )}
          <button
            type="button"
            onClick={onDecrement}
            disabled={todayCount <= 0}
            aria-label="Subtract one from today count"
            className="absolute bottom-[6px] left-[-18px] grid h-7 w-7 place-items-center rounded-full bg-pc-surface/85 text-[9px] font-semibold leading-none text-pc-accent shadow-neuSm ring-2 ring-white/95 ring-offset-0 transition enabled:active:scale-[0.99] disabled:pointer-events-none disabled:opacity-35"
          >
            −1
          </button>
        </div>
        <div className="mt-3 text-[12px] font-semibold tracking-[0.26em] text-pc-text/50">
          TODAY
        </div>

        <button
          type="button"
          onClick={onIncrement}
          className="mt-10 grid h-28 w-28 place-items-center rounded-full bg-white shadow-[12px_14px_28px_rgba(27,51,46,0.18),-10px_-10px_22px_rgba(255,255,255,0.75)] transition active:scale-[0.99]"
          aria-label="Add one"
        >
          <span className="text-[34px] font-semibold tracking-tightish text-pc-accent">+1</span>
        </button>

        <div className="mt-auto w-full">
          <SummaryPanel today={todayCount} goal={goal} streak={streak} />
        </div>
      </div>
    </div>
  )
}
