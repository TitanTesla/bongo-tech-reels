import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { sfx, type SfxName } from '../audio/sfx'
import { ACCENT, MONO, type SceneProps } from './types'

// PART 1 · beat 3 — "Siri ni DSA". Building blocks stack up, then the
// two halves of the secret: DATA STRUCTURE (data ikae vipi kwenye
// memory) vs ALGORITHM (steps za ku-process, muda mfupi + memory
// kidogo). 12s.

// blocks tower — stacked rows, bottom-up (viewBox coords)
const BLOCKS = [
  { x: 105, y: 300, w: 46 },
  { x: 157, y: 300, w: 46 },
  { x: 209, y: 300, w: 46 },
  { x: 131, y: 268, w: 46 },
  { x: 183, y: 268, w: 46 },
  { x: 157, y: 236, w: 46 },
]

// memory grid — 3x4 cells in the left panel
const CELL = 34
const GRID_X = 30
const GRID_Y = 240
// which cells receive a data dot, in landing order
const FILLS = [0, 5, 2, 7, 4, 10]

export default function DsaScene({ onReady }: SceneProps) {
  const ref = useRef<SVGSVGElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true, defaults: { ease: 'power2.out' } })
      const cue = (t: number, name: SfxName, p?: number) => tl.call(() => sfx.play(name, p), [], t)

      // sfx cues
      cue(0.3, 'thud')
      cue(1.0, 'pops')
      cue(2.6, 'blip', 620)
      cue(3.8, 'whoosh')
      cue(4.3, 'draw')
      cue(7.8, 'whoosh')
      cue(9.0, 'swish')
      cue(10.3, 'ding')
      cue(11.0, 'thud')

      // 1 — the secret: title + building blocks stack up
      tl.to('.siri', { autoAlpha: 1, y: 0, duration: 0.5 }, 0.3)
        .to('.title-ds', { autoAlpha: 1, y: 0, duration: 0.5 }, 0.7)
        .to('.title-algo', { autoAlpha: 1, y: 0, duration: 0.5 }, 1.0)
      tl.fromTo(
        '.block',
        { y: -26, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.13, ease: 'bounce.out' },
        1.0,
      )
      tl.to('.blocks-tag', { autoAlpha: 1, duration: 0.4 }, 2.6)

      // 2 — split: tower compresses left, DATA STRUCTURE panel
      tl.to('.intro', { autoAlpha: 0, y: -10, duration: 0.5 }, 3.7)
        .to('.ds-panel', { autoAlpha: 1, duration: 0.4 }, 4.0)
        .to('.mem-cell', { strokeDashoffset: 0, duration: 0.5, stagger: 0.045, ease: 'power1.inOut' }, 4.2)
      // data dots fly into their cells
      FILLS.forEach((_, i) => {
        cue(5.2 + i * 0.28, 'blip', 560 + i * 70)
        tl.fromTo(
          `.dot-${i}`,
          { x: 120, y: -170, opacity: 0 },
          { x: 0, y: 0, opacity: 1, duration: 0.45, ease: 'power2.in' },
          5.0 + i * 0.28,
        )
      })
      tl.to('.ds-tag', { autoAlpha: 1, duration: 0.4 }, 6.9)

      // 3 — ALGORITHM panel: steps light up, a dot runs through them
      tl.to('.algo-panel', { autoAlpha: 1, duration: 0.4 }, 7.9)
        .to('.step', { autoAlpha: 1, duration: 0.35, stagger: 0.3 }, 8.2)
        .to('.step-arrow', { strokeDashoffset: 0, duration: 0.3, stagger: 0.3 }, 8.5)
      // the runner dot drops through the pipeline
      tl.fromTo('.runner', { opacity: 0 }, { opacity: 1, duration: 0.2 }, 9.0)
        .to('.runner', { y: 62, duration: 0.5, ease: 'power1.inOut' }, 9.2)
        .to('.runner', { y: 124, duration: 0.5, ease: 'power1.inOut' }, 9.8)
        .fromTo('.out-badge', { scale: 0.7, transformOrigin: '50% 50%' }, { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'back.out(2)' }, 10.3)
      tl.to('.algo-tags', { autoAlpha: 1, duration: 0.4 }, 10.4)

      // 4 — kicker
      tl.to('.kicker', { autoAlpha: 1, y: 0, duration: 0.5 }, 11.0)
        .to('.kicker-line', { strokeDashoffset: 0, duration: 0.4 }, 11.4)
        .to({}, { duration: 0.2 }) // hold → 12.0s

      onReady(tl)
    }, ref)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <svg ref={ref} viewBox="0 0 360 500" className="h-full w-full">
      {/* ── phase 1: the secret + building blocks ── */}
      <g className="intro">
        <text className="siri" x={180} y={92} textAnchor="middle" fill="#999" fontFamily={MONO} fontSize={11} letterSpacing={4} style={{ opacity: 0, transform: 'translateY(10px)' }}>
          SIRI NI…
        </text>
        <text className="title-ds" x={180} y={130} textAnchor="middle" fill="#fff" fontSize={22} fontWeight={800} style={{ opacity: 0, transform: 'translateY(10px)' }}>
          DATA STRUCTURES
        </text>
        <text className="title-algo" x={180} y={162} textAnchor="middle" fill={ACCENT} fontSize={22} fontWeight={800} style={{ opacity: 0, transform: 'translateY(10px)' }}>
          + ALGORITHMS
        </text>

        {BLOCKS.map((b, i) => (
          <g key={i} className="block" style={{ opacity: 0 }}>
            <rect x={b.x} y={b.y} width={b.w} height={26} rx={4} fill="none" stroke={i === 5 ? ACCENT : '#fff'} strokeWidth={1.3} />
            <rect x={b.x + 6} y={b.y + 6} width={10} height={4} rx={2} fill={i === 5 ? ACCENT : '#444'} />
          </g>
        ))}
        <text className="blocks-tag" x={180} y={362} textAnchor="middle" fill="#666" fontFamily={MONO} fontSize={9} letterSpacing={3} style={{ opacity: 0 }}>
          BUILDING BLOCKS OF PROGRAMMING
        </text>
      </g>

      {/* ── phase 2: DATA STRUCTURE — memory grid, left panel ── */}
      <g className="ds-panel" style={{ opacity: 0 }}>
        <text x={87} y={172} textAnchor="middle" fill="#fff" fontFamily={MONO} fontSize={12} fontWeight={700} letterSpacing={2}>
          DATA STRUCTURE
        </text>
        <text x={87} y={190} textAnchor="middle" fill="#666" fontFamily={MONO} fontSize={8} letterSpacing={1.5}>
          MEMORY
        </text>
        {Array.from({ length: 12 }, (_, i) => {
          const cx = GRID_X + (i % 3) * CELL
          const cy = GRID_Y + Math.floor(i / 3) * CELL
          return (
            <rect
              key={i}
              className="mem-cell"
              x={cx}
              y={cy}
              width={CELL - 4}
              height={CELL - 4}
              rx={4}
              fill="none"
              stroke="#3a3a3a"
              strokeWidth={1.1}
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1}
            />
          )
        })}
        {FILLS.map((cell, i) => {
          const cx = GRID_X + (cell % 3) * CELL + (CELL - 4) / 2
          const cy = GRID_Y + Math.floor(cell / 3) * CELL + (CELL - 4) / 2
          return <circle key={i} className={`dot-${i}`} cx={cx} cy={cy} r={6} fill={ACCENT} opacity={0} />
        })}
        <text className="ds-tag" x={87} y={402} textAnchor="middle" fill="#666" fontFamily={MONO} fontSize={8} letterSpacing={1.2} style={{ opacity: 0 }}>
          DATA IKAE VIPI KWENYE MEMORY
        </text>
      </g>

      {/* ── phase 3: ALGORITHM — the step pipeline, right panel ── */}
      <g className="algo-panel" style={{ opacity: 0 }}>
        <text x={266} y={172} textAnchor="middle" fill={ACCENT} fontFamily={MONO} fontSize={12} fontWeight={700} letterSpacing={2}>
          ALGORITHM
        </text>
        <text x={266} y={190} textAnchor="middle" fill="#666" fontFamily={MONO} fontSize={8} letterSpacing={1.5}>
          STEPS
        </text>
        {[0, 1, 2].map((i) => (
          <g key={i} className="step" style={{ opacity: 0 }}>
            <rect x={212} y={216 + i * 62} width={108} height={34} rx={7} fill="none" stroke="#fff" strokeWidth={1.2} />
            <text x={266} y={237 + i * 62} textAnchor="middle" fill="#fff" fontFamily={MONO} fontSize={10} letterSpacing={2}>
              STEP {i + 1}
            </text>
          </g>
        ))}
        {[0, 1].map((i) => (
          <line
            key={i}
            className="step-arrow"
            x1={266}
            y1={250 + i * 62}
            x2={266}
            y2={216 + (i + 1) * 62}
            stroke={ACCENT}
            strokeWidth={1.4}
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1}
          />
        ))}
        <circle className="runner" cx={196} cy={233} r={5} fill={ACCENT} opacity={0} />
        <g className="out-badge" style={{ opacity: 0 }}>
          <rect x={228} y={382} width={76} height={26} rx={13} fill="none" stroke={ACCENT} strokeWidth={1.3} />
          <text x={266} y={399} textAnchor="middle" fill={ACCENT} fontFamily={MONO} fontSize={10} letterSpacing={2}>
            JIBU ✓
          </text>
        </g>
        <g className="algo-tags" style={{ opacity: 0 }}>
          <text x={266} y={432} textAnchor="middle" fill="#666" fontFamily={MONO} fontSize={8} letterSpacing={1.2}>
            MUDA MFUPI · MEMORY KIDOGO
          </text>
        </g>
      </g>

      {/* kicker */}
      <g className="kicker" style={{ opacity: 0, transform: 'translateY(10px)' }}>
        <text x={180} y={86} textAnchor="middle" fill="#fff" fontFamily={MONO} fontSize={14} fontWeight={700} letterSpacing={3}>
          DS + ALGORITHMS = DSA
        </text>
      </g>
      <line className="kicker-line" x1={130} y1={97} x2={230} y2={97} stroke={ACCENT} strokeWidth={2} pathLength={1} strokeDasharray={1} strokeDashoffset={1} />
    </svg>
  )
}
