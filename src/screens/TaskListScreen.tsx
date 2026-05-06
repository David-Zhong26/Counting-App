import { useState } from 'react'
import type { Task } from '../types/task'
import { ModalShell } from '../components/ModalShell'
import { StatusBar } from '../ui/StatusBar'

export function TaskListScreen({
  displayName,
  tasks,
  onSelectTask,
  onCreateTask,
  onSaveDisplayName,
  onLogout,
}: {
  displayName: string | null
  tasks: Task[]
  onSelectTask: (taskId: string) => void
  onCreateTask: (name: string, goal: number) => Promise<void>
  onSaveDisplayName: (name: string) => Promise<void>
  onLogout: () => void
}) {
  const [createOpen, setCreateOpen] = useState(false)
  const [nameOpen, setNameOpen] = useState(false)
  const [taskNameDraft, setTaskNameDraft] = useState('')
  const [taskGoalDraft, setTaskGoalDraft] = useState('0')
  const [nameDraft, setNameDraft] = useState(displayName ?? '')
  const [busy, setBusy] = useState(false)

  const showName = displayName?.trim() || null

  return (
    <div className="flex min-h-[926px] flex-col">
      <StatusBar />

      <div className="mt-3 flex flex-col items-center gap-2">
        <button
          type="button"
          onClick={() => {
            setNameDraft(displayName ?? '')
            setNameOpen(true)
          }}
          className="max-w-[280px] text-center"
        >
          <div className="text-[13px] font-medium text-pc-text/50">你好</div>
          <div className="mt-0.5 text-[18px] font-semibold tracking-tightish text-pc-text">
            {showName ?? '点击设置昵称'}
          </div>
        </button>

        <div className="text-center">
          <div className="text-[26px] font-semibold tracking-tightish text-pc-text">小宝数数</div>
          <div className="mt-1 text-[13px] font-medium text-pc-text/60">
            {tasks.length === 0 ? '还没有任务，先添加一个吧。' : '选择一个任务开始计数。'}
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-1 flex-col gap-4">
        {tasks.map((task) => (
          <button
            key={task.id}
            type="button"
            onClick={() => onSelectTask(task.id)}
            className="flex w-full items-center justify-between rounded-xl3 bg-pc-surface/70 px-5 py-4 text-left shadow-neuSm transition active:scale-[0.995]"
          >
            <div>
              <div className="text-[17px] font-semibold tracking-tightish text-pc-text">{task.name}</div>
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
          </button>
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
                disabled={busy}
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
              className="rounded-xl2 border-0 bg-pc-bg/80 px-3 py-2.5 text-[14px] font-medium text-pc-text shadow-neuInset outline-none ring-pc-accent/35 focus:ring-2"
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
              className="rounded-xl2 border-0 bg-pc-bg/80 px-3 py-2.5 text-[14px] font-medium text-pc-text shadow-neuInset outline-none ring-pc-accent/35 focus:ring-2"
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
              className="rounded-xl2 border-0 bg-pc-bg/80 px-3 py-2.5 text-[14px] font-medium text-pc-text shadow-neuInset outline-none ring-pc-accent/35 focus:ring-2"
            />
          </label>
        </ModalShell>
      )}
    </div>
  )
}
