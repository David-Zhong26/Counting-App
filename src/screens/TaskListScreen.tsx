import { useCallback, useRef, useState } from 'react'
import type { Task } from '../types/task'
import { ModalShell } from '../components/ModalShell'

export function TaskListScreen({
  displayName,
  tasks,
  onSelectTask,
  onCreateTask,
  onRenameTask,
  onSaveDisplayName,
  onLogout,
}: {
  displayName: string | null
  tasks: Task[]
  onSelectTask: (taskId: string) => void
  onCreateTask: (name: string, goal: number) => Promise<void>
  onRenameTask: (taskId: string, name: string) => Promise<void>
  onSaveDisplayName: (name: string) => Promise<void>
  onLogout: () => void
}) {
  const [createOpen, setCreateOpen] = useState(false)
  const [nameOpen, setNameOpen] = useState(false)
  const [renameTask, setRenameTask] = useState<Task | null>(null)
  const [renameDraft, setRenameDraft] = useState('')
  const [taskNameDraft, setTaskNameDraft] = useState('')
  const [taskGoalDraft, setTaskGoalDraft] = useState('0')
  const [nameDraft, setNameDraft] = useState(displayName ?? '')
  const [busy, setBusy] = useState(false)

  const pendingNavRef = useRef<{ taskId: string; timer: ReturnType<typeof setTimeout> } | null>(
    null,
  )

  const showName = displayName?.trim() || null
  const greetingLine = `你好呀～${showName ?? '朋友'}`

  const flushNavigate = useCallback(() => {
    const p = pendingNavRef.current
    if (p) {
      clearTimeout(p.timer)
      pendingNavRef.current = null
    }
  }, [])

  const onRowActivate = useCallback(
    (taskId: string) => {
      const p = pendingNavRef.current
      if (p && p.taskId === taskId) {
        clearTimeout(p.timer)
        pendingNavRef.current = null
        return
      }
      if (p) {
        clearTimeout(p.timer)
        pendingNavRef.current = null
      }
      const timer = setTimeout(() => {
        pendingNavRef.current = null
        onSelectTask(taskId)
      }, 300)
      pendingNavRef.current = { taskId, timer }
    },
    [onSelectTask],
  )

  return (
    <div className="flex min-h-dvh flex-col">
      <div className="mt-3 flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={() => {
            setNameDraft(displayName ?? '')
            setNameOpen(true)
          }}
          className="max-w-[300px] text-center"
        >
          <div className="text-[17px] font-semibold tracking-tightish text-pc-text">{greetingLine}</div>
        </button>

        <div className="text-center">
          <div className="text-[13px] font-medium text-pc-text/60">
            {tasks.length === 0 ? '还没有任务，先添加一个吧。' : '选择一个任务开始计数。'}
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-1 flex-col gap-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onRowActivate(task.id)
              }
            }}
            onClick={() => onRowActivate(task.id)}
            className="flex w-full cursor-pointer items-center justify-between rounded-xl3 bg-pc-surface/70 px-5 py-4 text-left shadow-neuSm transition active:scale-[0.995]"
          >
            <div className="min-w-0 flex-1">
              <div
                className="text-[17px] font-semibold tracking-tightish text-pc-text"
                onDoubleClick={(e) => {
                  e.stopPropagation()
                  flushNavigate()
                  setRenameDraft(task.name)
                  setRenameTask(task)
                }}
              >
                {task.name}
              </div>
              <div className="mt-1 text-[12px] font-medium text-pc-text/55">
                今日 · {task.todayCount} · 连续 {task.streak} 天 · 目标 {task.goal}
              </div>
            </div>
            <svg
              viewBox="0 0 20 20"
              className="h-5 w-5 shrink-0 text-pc-text/45"
              aria-hidden="true"
            >
              <path
                d="M7.6 4.4 13 10l-5.4 5.6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => {
          setTaskNameDraft('')
          setTaskGoalDraft('0')
          setCreateOpen(true)
        }}
        className="mt-6 rounded-xl2 bg-white px-5 py-3 text-[14px] font-semibold tracking-tightish text-pc-accent shadow-[12px_14px_28px_rgba(27,51,46,0.18),-10px_-10px_22px_rgba(255,255,255,0.75)] transition active:scale-[0.99]"
      >
        + 新建任务
      </button>

      <div className="mt-auto pb-2 pt-10 text-center">
        <button
          type="button"
          onClick={onLogout}
          className="text-[12px] font-medium text-pc-text/45 underline-offset-4 hover:text-pc-text/65"
        >
          退出登录
        </button>
      </div>

      {createOpen && (
        <ModalShell
          title="新建任务"
          onClose={() => !busy && setCreateOpen(false)}
          footer={
            <div className="flex gap-3">
              <button
                type="button"
                disabled={busy}
                onClick={() => setCreateOpen(false)}
                className="flex-1 rounded-xl2 bg-pc-bg/80 py-2.5 text-[13px] font-semibold text-pc-text/70 shadow-neuInset"
              >
                取消
              </button>
              <button
                type="button"
                disabled={busy || !taskNameDraft.trim()}
                onClick={async () => {
                  setBusy(true)
                  try {
                    await onCreateTask(taskNameDraft, Number(taskGoalDraft) || 0)
                    setCreateOpen(false)
                    setTaskNameDraft('')
                    setTaskGoalDraft('0')
                  } finally {
                    setBusy(false)
                  }
                }}
                className="flex-1 rounded-xl2 bg-white py-2.5 text-[13px] font-semibold text-pc-accent shadow-[12px_14px_28px_rgba(27,51,46,0.14)]"
              >
                {busy ? '保存中…' : '创建'}
              </button>
            </div>
          }
        >
          <label className="flex flex-col gap-1.5 text-left">
            <span className="text-[11px] font-semibold tracking-[0.14em] text-pc-text/55">名称</span>
            <input
              value={taskNameDraft}
              onChange={(e) => setTaskNameDraft(e.target.value)}
              placeholder="例如：喝水"
              className="rounded-xl2 border border-pc-text/14 bg-white px-3 py-2.5 text-[14px] font-medium text-pc-text outline-none ring-pc-accent/25 focus:border-pc-accent/35 focus:ring-2"
            />
          </label>
          <label className="mt-4 flex flex-col gap-1.5 text-left">
            <span className="text-[11px] font-semibold tracking-[0.14em] text-pc-text/55">
              每日目标（可为 0）
            </span>
            <input
              type="number"
              min={0}
              inputMode="numeric"
              value={taskGoalDraft}
              onChange={(e) => setTaskGoalDraft(e.target.value)}
              className="rounded-xl2 border border-pc-text/14 bg-white px-3 py-2.5 text-[14px] font-medium text-pc-text outline-none ring-pc-accent/25 focus:border-pc-accent/35 focus:ring-2"
            />
          </label>
        </ModalShell>
      )}

      {nameOpen && (
        <ModalShell
          title="昵称"
          onClose={() => !busy && setNameOpen(false)}
          footer={
            <button
              type="button"
              disabled={busy}
              onClick={async () => {
                setBusy(true)
                try {
                  await onSaveDisplayName(nameDraft)
                  setNameOpen(false)
                } finally {
                  setBusy(false)
                }
              }}
              className="w-full rounded-xl2 bg-white py-2.5 text-[13px] font-semibold text-pc-accent shadow-[12px_14px_28px_rgba(27,51,46,0.14)]"
            >
              {busy ? '保存中…' : '保存'}
            </button>
          }
        >
          <label className="flex flex-col gap-1.5 text-left">
            <span className="text-[11px] font-semibold tracking-[0.14em] text-pc-text/55">显示名称</span>
            <input
              value={nameDraft}
              onChange={(e) => setNameDraft(e.target.value)}
              placeholder="你的昵称"
              className="rounded-xl2 border border-pc-text/14 bg-white px-3 py-2.5 text-[14px] font-medium text-pc-text outline-none ring-pc-accent/25 focus:border-pc-accent/35 focus:ring-2"
            />
          </label>
        </ModalShell>
      )}

      {renameTask && (
        <ModalShell
          title="重命名任务"
          onClose={() => !busy && setRenameTask(null)}
          footer={
            <div className="flex gap-3">
              <button
                type="button"
                disabled={busy}
                onClick={() => setRenameTask(null)}
                className="flex-1 rounded-xl2 bg-pc-bg/80 py-2.5 text-[13px] font-semibold text-pc-text/70 shadow-neuInset"
              >
                取消
              </button>
              <button
                type="button"
                disabled={busy || !renameDraft.trim()}
                onClick={async () => {
                  setBusy(true)
                  try {
                    await onRenameTask(renameTask.id, renameDraft)
                    setRenameTask(null)
                  } finally {
                    setBusy(false)
                  }
                }}
                className="flex-1 rounded-xl2 bg-white py-2.5 text-[13px] font-semibold text-pc-accent shadow-[12px_14px_28px_rgba(27,51,46,0.14)]"
              >
                {busy ? '保存中…' : '保存'}
              </button>
            </div>
          }
        >
          <label className="flex flex-col gap-1.5 text-left">
            <span className="text-[11px] font-semibold tracking-[0.14em] text-pc-text/55">任务名称</span>
            <input
              value={renameDraft}
              onChange={(e) => setRenameDraft(e.target.value)}
              className="rounded-xl2 border border-pc-text/14 bg-white px-3 py-2.5 text-[14px] font-medium text-pc-text outline-none ring-pc-accent/25 focus:border-pc-accent/35 focus:ring-2"
            />
          </label>
        </ModalShell>
      )}
    </div>
  )
}
