/**
 * Faint TikTok / Reels UI chrome. The animation canvas sits between the
 * top and bottom zones — that's the breathing room around the video.
 */

export function TopChrome() {
  return (
    <div className="flex h-full items-center justify-center gap-5 text-[11px] tracking-wide select-none">
      <span className="text-white/30">Following</span>
      <span className="relative font-semibold text-white/70">
        For You
        <span className="absolute -bottom-1.5 left-1/2 h-0.5 w-4 -translate-x-1/2 bg-white/60" />
      </span>
    </div>
  )
}

const Icon = ({ d }: { d: string }) => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
)

export function BottomChrome() {
  return (
    <div className="flex h-full flex-col justify-end gap-1.5 px-4 pb-3 select-none">
      <div className="flex items-end justify-between gap-4">
        <div className="min-w-0 space-y-1.5">
          <p className="text-[11px] font-semibold text-white/45">@app.dev</p>
          <p className="truncate text-[10px] text-white/30">
            Washa airplane mode, tuma message — inaenda wapi?? App dev ep. 3 · #bongotech
          </p>
          <p className="flex items-center gap-1.5 text-[10px] text-white/30">
            <svg viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor">
              <path d="M9 18V5l12-2v13" strokeWidth={0} />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
            </svg>
            original sound — app.dev
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-4 text-white/35">
          <Icon d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l8.8 8.8 8.8-8.8a5.5 5.5 0 0 0 0-7.8z" />
          <Icon d="M21 11.5a8.4 8.4 0 0 1-8.5 8.3 8.9 8.9 0 0 1-3.8-.8L3 21l2-4.4a8 8 0 0 1-1.5-4.6A8.4 8.4 0 0 1 12 3.5a8.4 8.4 0 0 1 9 8z" />
          <Icon d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7 M16 6l-4-4-4 4 M12 2v13" />
        </div>
      </div>
    </div>
  )
}
