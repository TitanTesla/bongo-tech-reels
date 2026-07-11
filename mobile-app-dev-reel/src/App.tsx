import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { SCENES } from './scenes'
import { BottomChrome, TopChrome } from './components/PhoneChrome'
import { sfx } from './audio/sfx'

const ACCENT = '#25d366'
const TICK = '#53bdeb'

export default function App() {
  const [active, setActive] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [line, setLine] = useState(0)
  const [muted, setMuted] = useState(() => sfx.muted)

  const toggleMute = () => {
    const m = !muted
    sfx.setMuted(m)
    setMuted(m)
  }

  const tlRef = useRef<gsap.core.Timeline | null>(null)
  const lineRef = useRef(0)
  const progressRef = useRef<HTMLDivElement>(null)
  const timeRef = useRef<HTMLSpanElement>(null)
  const activeRef = useRef(active)
  activeRef.current = active

  const scene = SCENES[active]

  const handleReady = useCallback((tl: gsap.core.Timeline) => {
    tlRef.current = tl
    lineRef.current = 0
    setLine(0)

    const lines = SCENES[activeRef.current].lines
    tl.eventCallback('onUpdate', () => {
      const t = tl.time()
      if (progressRef.current) progressRef.current.style.width = `${tl.progress() * 100}%`
      if (timeRef.current) timeRef.current.textContent = `${t.toFixed(1)}s / ${tl.duration().toFixed(1)}s`
      let idx = 0
      for (let i = 0; i < lines.length; i++) if (t >= lines[i].t) idx = i
      if (idx !== lineRef.current) {
        lineRef.current = idx
        setLine(idx)
      }
    })
    tl.eventCallback('onComplete', () => setPlaying(false))
    tl.play()
    setPlaying(true)
  }, [])

  // reset transport UI when switching tabs
  useEffect(() => {
    if (progressRef.current) progressRef.current.style.width = '0%'
  }, [active])

  const toggle = () => {
    const tl = tlRef.current
    if (!tl) return
    if (tl.progress() === 1) {
      tl.restart()
      setPlaying(true)
    } else if (tl.paused()) {
      tl.play()
      setPlaying(true)
    } else {
      tl.pause()
      setPlaying(false)
    }
  }

  const restart = () => {
    tlRef.current?.restart()
    setPlaying(true)
  }

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const tl = tlRef.current
    if (!tl) return
    const rect = e.currentTarget.getBoundingClientRect()
    const p = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width))
    tl.progress(p)
    if (tl.paused()) {
      tl.play()
      setPlaying(true)
    }
  }

  const seekLine = (t: number) => {
    const tl = tlRef.current
    if (!tl) return
    tl.time(t)
    tl.play()
    setPlaying(true)
  }

  const Scene = scene.Component

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* header */}
      <header className="flex items-center justify-between border-b border-[#161616] px-6 py-3">
        <h1 className="font-mono text-[12px] font-bold tracking-[0.3em] text-white">
          WHATSAPP <span style={{ color: ACCENT }}>×</span> <span style={{ color: TICK }}>APP DEV</span>
        </h1>
        <p className="font-mono text-[10px] tracking-[0.2em] text-[#555]">REEL STUDIO · 60S · EP. 3</p>
      </header>

      <div className="flex min-h-0 flex-1">
        {/* concept tabs */}
        <nav className="flex w-44 shrink-0 flex-col gap-1 border-r border-[#161616] p-3">
          {SCENES.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setActive(i)}
              className={`relative rounded-md px-3 py-2.5 text-left text-[12px] transition-colors ${
                i === active ? 'text-white' : 'text-[#666] hover:text-[#aaa]'
              }`}
            >
              {i === active && (
                <motion.span
                  layoutId="tab-bg"
                  className="absolute inset-0 rounded-md bg-[#141414]"
                  transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                />
              )}
              <span className="relative flex items-center gap-2">
                <span className="font-mono text-[9px]" style={{ color: i === active ? ACCENT : '#444' }}>
                  0{i}
                </span>
                {s.tab}
              </span>
            </button>
          ))}
          <div className="mt-auto px-3 pb-1">
            <p className="font-mono text-[9px] leading-relaxed tracking-wider text-[#3a3a3a]">
              GSAP · FRAMER MOTION
              <br />
              SVG · NO STOCK ASSETS
            </p>
          </div>
        </nav>

        {/* phone canvas */}
        <main className="flex min-w-0 flex-1 flex-col items-center justify-center gap-4 p-4">
          <div
            className="flex h-full max-h-[780px] w-auto max-w-full flex-col overflow-hidden rounded-[28px] border border-[#222] bg-black shadow-[0_0_60px_rgba(0,0,0,0.9)]"
            style={{ aspectRatio: '9 / 16' }}
          >
            {/* top social chrome — breathing space */}
            <div className="h-[8%] shrink-0">
              <TopChrome />
            </div>

            {/* THE CANVAS — pure black, scenes render here */}
            <div className="relative min-h-0 flex-1 bg-black">
              <AnimatePresence mode="wait">
                <motion.div
                  key={scene.id}
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <Scene onReady={handleReady} />
                </motion.div>
              </AnimatePresence>
              {/* canvas bounds hint */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[#1b1b1b]" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-[#1b1b1b]" />
            </div>

            {/* bottom social chrome — breathing space */}
            <div className="h-[14%] shrink-0">
              <BottomChrome />
            </div>
          </div>

          {/* transport */}
          <div className="flex w-full max-w-[420px] items-center gap-3">
            <button
              onClick={toggle}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#2a2a2a] text-white transition-colors hover:border-[#555]"
              aria-label={playing ? 'Pause' : 'Play'}
            >
              {playing ? (
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
                  <rect x="6" y="5" width="4" height="14" rx="1" />
                  <rect x="14" y="5" width="4" height="14" rx="1" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
                  <path d="M8 5.5v13l11-6.5z" />
                </svg>
              )}
            </button>
            <button
              onClick={restart}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#2a2a2a] text-[#888] transition-colors hover:border-[#555] hover:text-white"
              aria-label="Restart"
            >
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                <path d="M3 12a9 9 0 1 0 3-6.7" />
                <path d="M3 4v5h5" />
              </svg>
            </button>
            <button
              onClick={toggleMute}
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors ${
                muted
                  ? 'border-[#2a2a2a] text-[#555] hover:border-[#555] hover:text-[#888]'
                  : 'border-[#2a2a2a] text-white hover:border-[#555]'
              }`}
              aria-label={muted ? 'Unmute' : 'Mute'}
              title={muted ? 'Unmute SFX' : 'Mute SFX'}
            >
              {muted ? (
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 5 6.5 9H3v6h3.5L11 19z" />
                  <path d="m16 9 5 5 M21 9l-5 5" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 5 6.5 9H3v6h3.5L11 19z" />
                  <path d="M15.5 8.5a5 5 0 0 1 0 7" />
                  <path d="M18.5 5.5a9.5 9.5 0 0 1 0 13" />
                </svg>
              )}
            </button>
            <div className="group h-6 flex-1 cursor-pointer" onClick={seek}>
              <div className="relative top-[10px] h-1 overflow-hidden rounded-full bg-[#1c1c1c]">
                <div ref={progressRef} className="h-full rounded-full" style={{ background: ACCENT, width: '0%' }} />
              </div>
            </div>
            <span ref={timeRef} className="w-24 shrink-0 text-right font-mono text-[10px] text-[#555]">
              0.0s
            </span>
          </div>
        </main>

        {/* script panel — off canvas, Swahili VO + English underneath */}
        <aside className="flex w-80 shrink-0 flex-col border-l border-[#161616]">
          <AnimatePresence mode="wait">
            <motion.div
              key={scene.id}
              className="flex min-h-0 flex-1 flex-col"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2 }}
            >
              <div className="border-b border-[#161616] px-5 py-4">
                <p className="font-mono text-[9px] tracking-[0.25em]" style={{ color: ACCENT }}>
                  {scene.stamp}
                </p>
                <h2 className="mt-1.5 text-[14px] font-semibold text-white">{scene.title}</h2>
              </div>
              <div className="min-h-0 flex-1 space-y-1 overflow-y-auto p-3">
                {scene.lines.map((l, i) => (
                  <button
                    key={i}
                    onClick={() => seekLine(l.t)}
                    className={`block w-full rounded-lg px-3 py-2.5 text-left text-[13px] leading-relaxed transition-colors duration-300 ${
                      i === line ? 'bg-[#111] text-white' : 'text-[#555] hover:text-[#888]'
                    }`}
                  >
                    <span
                      className="mr-2 font-mono text-[9px]"
                      style={{ color: i === line ? ACCENT : '#3a3a3a' }}
                    >
                      {l.t.toFixed(1)}s
                    </span>
                    {l.text}
                    <span className={`mt-1 block pl-7 text-[11px] italic ${i === line ? 'text-[#8a8a8a]' : 'text-[#3f3f3f]'}`}>
                      {l.en}
                    </span>
                  </button>
                ))}
              </div>
              <div className="border-t border-[#161616] px-5 py-3">
                <p className="font-mono text-[9px] leading-relaxed tracking-wider text-[#3a3a3a]">
                  VO SCRIPT · SW + EN · GUSA LINE KU-SEEK
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </aside>
      </div>
    </div>
  )
}
