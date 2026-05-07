import { useMemo, useState } from 'react'
import { NeumorphicCard } from '../ui/NeumorphicCard'
import { parseLocalDate, toLocalDateString } from '../lib/dateUtils'

const DOW = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1)
}

function addMonths(d: Date, delta: number) {
  return new Date(d.getFullYear(), d.getMonth() + delta, 1)
}

function daysInMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()
}

function mondayIndex(jsDay: number) {
  // JS: 0 Sun … 6 Sat → Mon=0 … Sun=6
  if (jsDay === 0) return 6
  return jsDay - 1
}

export function MonthCalendar({
  dailyCounts,
  todayStr,
}: {
  dailyCounts: Record<string, number>
  todayStr: string
}) {
  const [cursor, setCursor] = useState(() => startOfMonth(parseLocalDate(todayStr)))

  const { grid, label, monthKey } = useMemo(() => {
    const start = startOfMonth(cursor)
    const totalDays = daysInMonth(start)
    const offset = mondayIndex(start.getDay())
    const cells: Array<{ dateStr: string; inMonth: boolean; day: number; count: number }> = []

    for (let i = 0; i < offset; i++) {
      cells.push({ dateStr: '', inMonth: false, day: 0, count: 0 })
    }
    for (let day = 1; day <= totalDays; day++) {
      const d = new Date(start.getFullYear(), start.getMonth(), day)
      const dateStr = toLocalDateString(d)
      const count = dailyCounts[dateStr] ?? 0
      cells.push({ dateStr, inMonth: true, day, count })
    }
    while (cells.length % 7 !== 0) cells.push({ dateStr: '', inMonth: false, day: 0, count: 0 })

    const labelText = start.toLocaleDateString(undefined, { year: 'numeric', month: 'long' })
    const key = `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}`
    return { grid: cells, label: labelText, monthKey: key }
  }, [cursor, dailyCounts])

  const hasAny = useMemo(() => {
    const prefix = `${monthKey}-`
    for (const [k, v] of Object.entries(dailyCounts)) {
      if (k.startsWith(prefix) && v > 0) return true
    }
    return false
  }, [dailyCounts, monthKey])

  return (
    <NeumorphicCard className="px-5 py-4">
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setCursor((c) => addMonths(c, -1))}
          className="grid h-8 w-8 place-items-center rounded-full bg-white/55 text-pc-text/70 shadow-neuInset transition active:scale-[0.99]"
          aria-label="Previous month"
        >
          ‹
        </button>

        <div className="text-center">
          <div className="text-[12px] font-semibold tracking-[0.14em] text-pc-text/55">CALENDAR</div>
          <div className="mt-1 text-[14px] font-semibold tracking-tightish text-pc-text">{label}</div>
          {!hasAny && <div className="mt-1 text-[11px] font-medium text-pc-text/45">本月暂无记录</div>}
        </div>

        <button
          type="button"
          onClick={() => setCursor((c) => addMonths(c, 1))}
          className="grid h-8 w-8 place-items-center rounded-full bg-white/55 text-pc-text/70 shadow-neuInset transition active:scale-[0.99]"
          aria-label="Next month"
        >
          ›
        </button>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-2">
        {DOW.map((d) => (
          <div key={d} className="text-center text-[11px] font-medium text-pc-text/55">
            {d}
          </div>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-7 gap-2">
        {grid.map((cell, idx) => {
          if (!cell.inMonth) return <div key={`e-${idx}`} className="h-10" />
          const isToday = cell.dateStr === todayStr
          const active = cell.count > 0
          return (
            <div
              key={cell.dateStr}
              className={[
                'relative flex h-10 flex-col items-center justify-center rounded-xl2 shadow-neuInset',
                active ? 'bg-white/55' : 'bg-pc-surface2/55',
                isToday ? 'ring-2 ring-pc-accent/40' : '',
              ].join(' ')}
              aria-label={`${cell.dateStr} ${cell.count}`}
            >
              <div className="text-[12px] font-semibold text-pc-text/75">{cell.day}</div>
              {active && (
                <div className="mt-0.5 text-[10px] font-semibold text-pc-accent tabular-nums">
                  {cell.count}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </NeumorphicCard>
  )
}

