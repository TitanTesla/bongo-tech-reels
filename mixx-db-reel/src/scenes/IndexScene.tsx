import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { sfx, type SfxName } from '../audio/sfx'
import { ACCENT, BLUE, DANGER, MONO, type SceneProps } from './types'

const COLS = 16
const ROWS = 11
const GAP = 17
const GRID_X = (360 - (COLS - 1) * GAP) / 2
const GRID_Y = 122

// the account the index jumps straight to
const TARGET = { col: 12, row: 9 }

const DOTS = Array.from({ length: COLS * ROWS }, (_, i) => ({
  x: GRID_X + (i % COLS) * GAP,
  y: GRID_Y + Math.floor(i / COLS) * GAP,
}))

const TREE = {
  root: { x: 180, y: 98 },
  kids: [
    { x: 110, y: 140 },
    { x: 250, y: 140 },
  ],
}

export default function IndexScene({ onReady }: SceneProps) {
  const ref = useRef<SVGSVGElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true, defaults: { ease: 'power2.out' } })
      const cue = (t: number, name: SfxName, p?: number) => tl.call(() => sfx.play(name, p), [], t)

      cue(0.5, 'pops')
      cue(2.5, 'timer')
      cue(3.8, 'timer')
      cue(3.4, 'thud')
      cue(4.3, 'blip', 500)
      cue(4.7, 'blip', 560)
      cue(5.1, 'blip', 620)
      cue(5.5, 'blip', 680)
      cue(7.6, 'draw')
      cue(8.8, 'lock')
      cue(9.4, 'ding')
      cue(10.4, 'blip', 400)
      cue(10.7, 'blip', 900)

      // the 10M+ accounts
      tl.to('.hdr', { autoAlpha: 1, duration: 0.4 }, 0.2)
      tl.to('.dot', { autoAlpha: 1, duration: 0.3, stagger: { each: 0.004, from: 'random' } }, 0.5)
      tl.to('.mode-bila', { autoAlpha: 1, y: 0, duration: 0.4 }, 0.9)

      /* ---------- PHASE A · BILA INDEX ---------- */
      // the crawling full scan
      tl.to('.scan', { autoAlpha: 1, duration: 0.2 }, 2.4)
      tl.to('.scan', { y: (ROWS - 1) * GAP, duration: 4.2, ease: 'steps(10)' }, 2.5)

      const scanned = { v: 0 }
      tl.to('.scan-txt', { autoAlpha: 1, duration: 0.3 }, 2.7)
      tl.to(
        scanned,
        {
          v: 1_342_880,
          duration: 3.9,
          ease: 'none',
          onUpdate() {
            const el = ref.current?.querySelector('.scan-num')
            if (el) el.textContent = Math.round(scanned.v).toLocaleString('en-US')
          },
        },
        2.7,
      )
      tl.to('.eta', { autoAlpha: 1, y: 0, duration: 0.4 }, 3.4)

      // the nationwide queue
      tl.to('.q-fig', { autoAlpha: 1, duration: 0.3, stagger: 0.28 }, 4.2)
      tl.to('.q-label', { autoAlpha: 1, duration: 0.4 }, 5.4)

      /* ---------- PHASE B · NA INDEX ---------- */
      tl.to(['.scan', '.scan-txt', '.eta', '.q-fig', '.q-label', '.mode-bila'], { autoAlpha: 0, duration: 0.4 }, 7.0)
      tl.to('.dot', { autoAlpha: 0.14, duration: 0.4 }, 7.0)
      tl.to('.mode-na', { autoAlpha: 1, y: 0, duration: 0.4 }, 7.2)

      // the index tree draws…
      tl.to('.tree-e', { strokeDashoffset: 0, duration: 0.32, stagger: 0.13 }, 7.6)
      tl.to('.tree-n', { autoAlpha: 1, duration: 0.25, stagger: 0.1 }, 7.7)

      // …and jumps straight to the row
      tl.to('.jump', { strokeDashoffset: 0, duration: 0.35 }, 8.8)
      tl.to('.target', { autoAlpha: 1, scale: 2.6, transformOrigin: '50% 50%', duration: 0.35, ease: 'back.out(2)' }, 8.9)
      tl.fromTo('.target-ring', { attr: { r: 5 }, opacity: 0.8 }, { attr: { r: 30 }, opacity: 0, duration: 0.8 }, 9.0)

      tl.to('.fast', { autoAlpha: 1, y: 0, duration: 0.4 }, 9.4)

      // the verdict
      tl.to('.chip-bila', { autoAlpha: 1, y: 0, duration: 0.35 }, 10.4)
      tl.to('.chip-na', { autoAlpha: 1, y: 0, duration: 0.35 }, 10.7)
      tl.to({}, { duration: 1.4 }) // hold

      onReady(tl)
    }, ref)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <svg ref={ref} viewBox="0 0 360 500" className="h-full w-full">
      <g className="hdr" style={{ opacity: 0 }}>
        <text x={180} y={56} textAnchor="middle" fill="#888" fontFamily={MONO} fontSize={10} letterSpacing={3}>
          SIRI #3 · INDEX
        </text>
      </g>
      <text className="mode-bila" x={180} y={88} textAnchor="middle" fill={DANGER} fontSize={13} fontWeight={700} letterSpacing={2} style={{ opacity: 0, transform: 'translateY(8px)' }}>
        BILA INDEX
      </text>
      <text className="mode-na" x={180} y={88} textAnchor="middle" fill={ACCENT} fontSize={13} fontWeight={700} letterSpacing={2} style={{ opacity: 0, transform: 'translateY(8px)' }}>
        NA INDEX
      </text>

      {/* accounts */}
      {DOTS.map((d, i) => (
        <circle key={i} className="dot" cx={d.x} cy={d.y} r={2.2} fill="#444" style={{ opacity: 0 }} />
      ))}

      {/* full-scan sweep */}
      <g className="scan" style={{ opacity: 0 }}>
        <rect x={GRID_X - 8} y={GRID_Y - 7} width={(COLS - 1) * GAP + 16} height={14} rx={3} fill={DANGER} opacity={0.13} />
        <line x1={GRID_X - 8} y1={GRID_Y + 7} x2={GRID_X + (COLS - 1) * GAP + 8} y2={GRID_Y + 7} stroke={DANGER} strokeWidth={1.2} />
      </g>

      <g className="scan-txt" style={{ opacity: 0 }}>
        <text x={180} y={330} textAnchor="middle" fill="#bbb" fontFamily={MONO} fontSize={10}>
          accounts scanned: <tspan className="scan-num">0</tspan> / 10,000,000+
        </text>
      </g>
      <text className="eta" x={180} y={356} textAnchor="middle" fill={DANGER} fontFamily={MONO} fontSize={15} fontWeight={700} style={{ opacity: 0, transform: 'translateY(8px)' }}>
        JIBU: ~4 HRS
      </text>

      {/* foleni ya nchi nzima */}
      {Array.from({ length: 7 }, (_, i) => (
        <g key={i} className="q-fig" style={{ opacity: 0 }}>
          <circle cx={102 + i * 26} cy={392} r={4.5} fill="none" stroke="#666" strokeWidth={1.3} />
          <line x1={102 + i * 26} y1={397} x2={102 + i * 26} y2={412} stroke="#666" strokeWidth={1.3} />
        </g>
      ))}
      <text className="q-label" x={180} y={432} textAnchor="middle" fill="#666" fontFamily={MONO} fontSize={9} letterSpacing={1} style={{ opacity: 0 }}>
        foleni ya nchi nzima…
      </text>

      {/* the index tree */}
      {[
        `M ${TREE.root.x} ${TREE.root.y} L ${TREE.kids[0].x} ${TREE.kids[0].y}`,
        `M ${TREE.root.x} ${TREE.root.y} L ${TREE.kids[1].x} ${TREE.kids[1].y}`,
      ].map((d, i) => (
        <path key={i} className="tree-e" d={d} fill="none" stroke={BLUE} strokeWidth={1.3} pathLength={1} strokeDasharray={1} strokeDashoffset={1} />
      ))}
      <g className="tree-n" style={{ opacity: 0 }}>
        <circle cx={TREE.root.x} cy={TREE.root.y} r={6} fill="#000" stroke={BLUE} strokeWidth={1.5} />
      </g>
      {TREE.kids.map((k, i) => (
        <g key={i} className="tree-n" style={{ opacity: 0 }}>
          <circle cx={k.x} cy={k.y} r={5} fill="#000" stroke={BLUE} strokeWidth={1.3} />
        </g>
      ))}
      {/* the jump straight to the row */}
      <path
        className="jump"
        d={`M ${TREE.kids[1].x} ${TREE.kids[1].y} L ${GRID_X + TARGET.col * GAP} ${GRID_Y + TARGET.row * GAP}`}
        fill="none"
        stroke={BLUE}
        strokeWidth={1.5}
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1}
      />
      <circle className="target" cx={GRID_X + TARGET.col * GAP} cy={GRID_Y + TARGET.row * GAP} r={2.6} fill={ACCENT} style={{ opacity: 0 }} />
      <circle className="target-ring" cx={GRID_X + TARGET.col * GAP} cy={GRID_Y + TARGET.row * GAP} r={5} fill="none" stroke={ACCENT} strokeWidth={1.2} opacity={0} />

      <g className="fast" style={{ opacity: 0, transform: 'translateY(8px)' }}>
        <text x={172} y={356} textAnchor="middle" fill={ACCENT} fontFamily={MONO} fontSize={22} fontWeight={800}>
          0.001s
        </text>
        {/* hand-drawn lightning bolt instead of an emoji */}
        <path d="M8 0 L0 12 L5 12 L2 22 L12 8 L6 8 Z" fill={ACCENT} transform="translate(222 336)" />
      </g>

      {/* verdict chips */}
      <g className="chip-bila" style={{ opacity: 0, transform: 'translateY(8px)' }}>
        <rect x={52} y={396} width={118} height={26} rx={13} fill="none" stroke={DANGER} strokeWidth={1.2} />
        <text x={111} y={413} textAnchor="middle" fill={DANGER} fontFamily={MONO} fontSize={9} letterSpacing={1}>
          BILA: ~4 HRS
        </text>
      </g>
      <g className="chip-na" style={{ opacity: 0, transform: 'translateY(8px)' }}>
        <rect x={190} y={396} width={118} height={26} rx={13} fill="none" stroke={ACCENT} strokeWidth={1.2} />
        <text x={249} y={413} textAnchor="middle" fill={ACCENT} fontFamily={MONO} fontSize={9} letterSpacing={1}>
          NA INDEX: 0.001S
        </text>
      </g>
    </svg>
  )
}
