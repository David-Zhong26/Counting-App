import { useEffect, useRef, useState } from 'react'
import { ModalShell } from '../components/ModalShell'
import { SummaryPanel } from '../components/SummaryPanel'
import { CircleIconButton } from '../ui/CircleIconButton'

/** Matches TODAY / GOAL / STREAK label typography */
const enCaptionClass =
  'text-[12px] font-medium tracking-[0.18em] text-pc-text/55 uppercase'

export function HomeScreen({
  displayName,
  taskName,
  todayCount,
  goal,
  streak,
  onIncrement,
  onIncrementBy3,
  onDecrement,
  onSetCount,
  onUpdateGoal,
  onUpdateTaskName,
  onBackToTasks,
  onGoOverview,
}: {
  displayName: string | null
  taskName: string
  todayCount: number
  goal: number
  streak: number
  onIncrement: () => void
  onIncrementBy3: () => void
  onDecrement: () => void
  onSetCount: (n: number) => void
  onUpdateGoal: (goal: number) => Promise<void>
  onUpdateTaskName: (name: string) => Promise<void>
  onBackToTasks: () => void
  onGoOverview: () => void
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(String(todayCount))
  const inputRef = useRef<HTMLInputElement>(null)

  const [goalOpen, setGoalOpen] = useState(false)
  const [goalDraft, setGoalDraft] = useState(String(goal))
  const [goalBusy, setGoalBusy] = useState(false)

  const [taskNameOpen, setTaskNameOpen] = useState(false)
  const [taskNameDraft, setTaskNameDraft] = useState(taskName)
  const [taskNameBusy, setTaskNameBusy] = useState(false)

  const [pop1, setPop1] = useState(false)
  const [pop3, setPop3] = useState(false)

  const greetingLine = `你好呀～${displayName?.trim() || '朋友'}`

  useEffect(() => {
    if (!editing) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- sync draft when not actively editing
      setDraft(String(todayCount))
    }
  }, [todayCount, editing])

  useEffect(() => {
    if (!goalOpen) setGoalDraft(String(goal))
  }, [goal, goalOpen])

  useEffect(() => {
    if (!taskNameOpen) setTaskNameDraft(taskName)
  }, [taskName, taskNameOpen])

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

  function handleIncrement() {
    onIncrement()
    setPop1(false)
    requestAnimationFrame(() => setPop1(true))
  }

  function handleIncrementBy3() {
    onIncrementBy3()
    setPop3(false)
    requestAnimationFrame(() => setPop3(true))
  }

  return (
    <div className="flex min-h-dvh flex-col">
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

      <div className="mt-2 px-2 text-center text-[15px] font-semibold tracking-tightish text-pc-text">
        {greetingLine}
      </div>

      <div className="mt-4 flex flex-col items-center text-center">
        <button
          type="button"
          onDoubleClick={() => {
            setTaskNameDraft(taskName)
            setTaskNameOpen(true)
          }}
          className="max-w-[min(20rem,calc(100vw-2rem))] cursor-pointer rounded-2xl border border-white/45 bg-white/30 px-5 py-2.5 shadow-[0_4px_24px_rgba(27,51,46,0.08)] outline-none backdrop-blur-md transition hover:bg-white/40"
          title="双击改名"
          aria-label={`Task ${taskName}. Double-click to rename.`}
        >
          <span className="text-[26px] font-semibold tracking-tightish text-pc-text">{taskName}</span>
        </button>
        <p className={`mt-3 max-w-[18rem] px-2 ${enCaptionClass}`}>
          Small steps, lasting change.
        </p>
      </div>

      <div className="mt-8 flex flex-1 flex-col items-center pb-4">
        <div className="relative pb-7">
          {editing ? (
            <div className="relative inline-grid max-w-[min(320px,calc(100vw-4rem))] place-items-center rounded-xl px-1 ring-2 ring-pc-accent/35">
              <span
                aria-hidden
                className="col-start-1 row-start-1 px-1 text-[86px] font-semibold leading-none tracking-tightish tabular-nums opacity-0"
              >
                {draft.length ? draft : '0'}
              </span>
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
                className="col-start-1 row-start-1 min-w-0 border-0 bg-transparent text-center text-[86px] font-semibold leading-none tracking-tightish text-pc-accent tabular-nums outline-none"
              />
            </div>
          ) : (
            <button
              type="button"
              onDoubleClick={() => {
                setDraft(String(todayCount))
                setEditing(true)
              }}
              className="cursor-pointer border-0 bg-transparent p-0 text-[86px] font-semibold leading-none tracking-tightish text-pc-accent tabular-nums outline-none"
              aria-label={`Today count ${todayCount}. Double-click to edit.`}
              title="双击修改数字"
            >
              {todayCount}
            </button>
          )}
          <button
            type="button"
            onClick={onDecrement}
            disabled={todayCount <= 0}
            aria-label="Subtract one from today count"
            className="absolute bottom-[6px] left-[-18px] grid h-7 w-7 place-items-center rounded-full bg-white text-[10px] font-semibold tracking-tightish text-pc-accent shadow-[12px_14px_28px_rgba(27,51,46,0.18),-10px_-10px_22px_rgba(255,255,255,0.75)] transition enabled:active:scale-[0.99] disabled:pointer-events-none disabled:opacity-35"
          >
            −1
          </button>
        </div>
        <div className={`mt-3 ${enCaptionClass}`}>Today</div>

        <div className="mt-6 flex flex-row items-center justify-center gap-4">
          <button
            type="button"
            onClick={handleIncrement}
            onAnimationEnd={() => setPop1(false)}
            className={`grid h-28 w-28 shrink-0 place-items-center rounded-full bg-white shadow-[12px_14px_28px_rgba(27,51,46,0.18),-10px_-10px_22px_rgba(255,255,255,0.75)] transition active:scale-[0.99] ${pop1 ? 'animate-pc-pop' : ''}`}
            aria-label="Add one"
          >
            <span className="text-[34px] font-semibold tracking-tightish text-pc-accent">+1</span>
          </button>
          <button
            type="button"
            onClick={handleIncrementBy3}
            onAnimationEnd={() => setPop3(false)}
            className={`grid h-28 w-28 shrink-0 place-items-center rounded-full bg-white shadow-[12px_14px_28px_rgba(27,51,46,0.18),-10px_-10px_22px_rgba(255,255,255,0.75)] transition active:scale-[0.99] ${pop3 ? 'animate-pc-pop' : ''}`}
            aria-label="Add three"
          >
            <span className="text-[34px] font-semibold tracking-tightish text-pc-accent">+3</span>
          </button>
        </div>

        <div className="mt-6 w-full">
          <SummaryPanel
            today={todayCount}
            goal={goal}
            streak={streak}
            onEditGoal={() => setGoalOpen(true)}
          />
        </div>
      </div>

      {goalOpen && (
        <ModalShell
          title="总计"
          onClose={() => !goalBusy && setGoalOpen(false)}
          footer={
            <div className="flex gap-3">
              <button
                type="button"
                disabled={goalBusy}
                onClick={() => setGoalOpen(false)}
                className="flex-1 rounded-xl2 bg-pc-bg/80 py-2.5 text-[13px] font-semibold text-pc-text/70 shadow-neuInset"
              >
                取消
              </button>
              <button
                type="button"
                disabled={goalBusy}
                onClick={async () => {
                  setGoalBusy(true)
                  try {
                    const n = Number(goalDraft)
                    await onUpdateGoal(Number.isNaN(n) ? 0 : n)
                    setGoalOpen(false)
                  } finally {
                    setGoalBusy(false)
                  }
                }}
                className="flex-1 rounded-xl2 bg-white py-2.5 text-[13px] font-semibold text-pc-accent shadow-[12px_14px_28px_rgba(27,51,46,0.14)]"
              >
                {goalBusy ? '保存中…' : '保存'}
              </button>
            </div>
          }
        >
          <label className="flex flex-col gap-1.5 text-left">
            <span className="text-[11px] font-semibold tracking-[0.14em] text-pc-text/55">总计（可为 0）</span>
            <input
              type="number"
              min={0}
              inputMode="numeric"
              value={goalDraft}
              onChange={(e) => setGoalDraft(e.target.value)}
              className="rounded-xl2 border border-pc-text/14 bg-white px-3 py-2.5 text-[14px] font-medium text-pc-text outline-none ring-pc-accent/25 focus:border-pc-accent/35 focus:ring-2"
            />
          </label>
        </ModalShell>
      )}

      {taskNameOpen && (
        <ModalShell
          title="重命名任务"
          onClose={() => !taskNameBusy && setTaskNameOpen(false)}
          footer={
            <div className="flex gap-3">
              <button
                type="button"
                disabled={taskNameBusy}
                onClick={() => setTaskNameOpen(false)}
                className="flex-1 rounded-xl2 bg-pc-bg/80 py-2.5 text-[13px] font-semibold text-pc-text/70 shadow-neuInset"
              >
                取消
              </button>
              <button
                type="button"
                disabled={taskNameBusy || !taskNameDraft.trim()}
                onClick={async () => {
                  setTaskNameBusy(true)
                  try {
                    await onUpdateTaskName(taskNameDraft)
                    setTaskNameOpen(false)
                  } finally {
                    setTaskNameBusy(false)
                  }
                }}
                className="flex-1 rounded-xl2 bg-white py-2.5 text-[13px] font-semibold text-pc-accent shadow-[12px_14px_28px_rgba(27,51,46,0.14)]"
              >
                {taskNameBusy ? '保存中…' : '保存'}
              </button>
            </div>
          }
        >
          <label className="flex flex-col gap-1.5 text-left">
            <span className="text-[11px] font-semibold tracking-[0.14em] text-pc-text/55">任务名称</span>
            <input
              value={taskNameDraft}
              onChange={(e) => setTaskNameDraft(e.target.value)}
              className="rounded-xl2 border border-pc-text/14 bg-white px-3 py-2.5 text-[14px] font-medium text-pc-text outline-none ring-pc-accent/25 focus:border-pc-accent/35 focus:ring-2"
            />
          </label>
        </ModalShell>
      )}
    </div>
  )
}
