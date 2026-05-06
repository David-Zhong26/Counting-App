export function StatusBar() {
  return (
    <div className="flex items-center justify-between pb-3 pt-2 text-[12px] font-medium tracking-tightish text-pc-text/80">
      <div className="w-16 text-left">9:41</div>
      <div className="flex items-center gap-2">
        <div className="h-[6px] w-[6px] rounded-full bg-pc-accent/70 shadow-[0_0_0_2px_rgba(255,255,255,0.35)]" />
      </div>
      <div className="flex w-16 items-center justify-end gap-2">
        <div className="flex items-end gap-[2px]">
          <span className="h-[6px] w-[2px] rounded-sm bg-pc-text/55" />
          <span className="h-[8px] w-[2px] rounded-sm bg-pc-text/55" />
          <span className="h-[10px] w-[2px] rounded-sm bg-pc-text/55" />
          <span className="h-[12px] w-[2px] rounded-sm bg-pc-text/55" />
        </div>
        <div className="h-[10px] w-[18px] rounded-[3px] border border-pc-text/40 p-[1px]">
          <div className="h-full w-[72%] rounded-[2px] bg-pc-text/55" />
        </div>
      </div>
    </div>
  )
}

