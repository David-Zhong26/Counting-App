import type { Task } from '../types/task'
import { StatusBar } from '../ui/StatusBar'

export function TaskListScreen({
  tasks,
  onSelectTask,
  onLogout,
}: {
  tasks: Task[]
  onSelectTask: (taskId: string) => void
  onLogout: () => void
}) {
  return (
    <div className="flex min-h-[926px] flex-col">
      <StatusBar />

      <div className="mt-4 text-center">
        <div className="text-[26px] font-semibold tracking-tightish text-pc-text">小宝数数</div>
        <div className="mt-1 text-[13px] font-medium text-pc-text/60">Choose a task to count.</div>
      </div>

      <div className="mt-10 flex flex-1 flex-col gap-4">
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
                Today · {task.todayCount} · streak {task.streak}
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

      <div className="mt-auto pb-2 pt-10 text-center">
        <button
          type="button"
          onClick={onLogout}
          className="text-[12px] font-medium text-pc-text/45 underline-offset-4 hover:text-pc-text/65"
        >
          Log out
        </button>
      </div>
    </div>
  )
}
