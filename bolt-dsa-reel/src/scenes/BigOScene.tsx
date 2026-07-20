import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { sfx, type SfxName } from '../audio/sfx'
import { ACCENT, MONO, type SceneProps } from './types'

// PART 1 · beat 4 — Big O notation. Axes rise, data piles up on the
// x-axis, three growth curves race: O(log n) stays flat (inafaa ✓),
// O(n²) explodes (haifai ✗). Muda + memory dhidi ya data. 10s.

const RED = '#ff5c5c'

// chart frame: origin bottom-left
const OX = 52
const OY = 398
const W = 270 // x-axis length
const H = 290 // y-axis height

// growth curves as quadratic-ish SVG paths from the origin
const LOG_PATH = `M ${OX} ${OY} Q ${OX + 70} ${OY - 58} ${OX + W} ${OY - 78}`
const LIN_PATH = `M ${OX} ${OY} L ${OX + W} ${OY - 185}`
const SQ_PATH = `M ${OX} ${OY} Q ${OX + 130} ${OY - 40} ${OX + 196} ${OY - H + 6}`

export default function BigOScene({ onReady }: SceneProps) {
  const ref = useRef<SVGSVGElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true, defaults: { ease: 'power2.out' } })
      const cue = (t: number, name: SfxName, p?: number) => tl.call(() => sfx.play(name, p), [], t)

      // sfx cues
      cue(0.3, 'thud')
      cue(1.2, 'draw')
      cue(2.9, 'count')
      cue(3.4, 'draw')
      cue(4.4, 'draw')
      cue(5.4, 'draw')
      cue(6.6, 'lock')
      cue(7.4, 'blip', 220)
      cue(8.4, 'thud')

      // 1 — title + axes
      tl.to('.bigo-title', { autoAlpha: 1, y: 0, duration: 0.5 }, 0.3)
        .to('.bigo-sub', { autoAlpha: 1, duration: 0.4 }, 0.8)
        .to('.axis', { strokeDashoffset: 0, duration: 0.7, stagger: 0.15, ease: 'power1.inOut' }, 1.2)
        .to('.axis-label', { autoAlpha: 1, duration: 0.4, stagger: 0.15 }, 1.8)

      // 2 — data piles up along the x-axis
      tl.to('.datum', { autoAlpha: 0.9, duration: 0.18, stagger: 0.09 }, 2.9)
        .to('.data-tag', { autoAlpha: 1, duration: 0.4 }, 3.3)

      // 3 — the curves race out of the origin
      tl.to('.curve-log', { strokeDashoffset: 0, duration: 1.1, ease: 'power1.inOut' }, 3.4)
        .to('.lbl-log', { autoAlpha: 1, duration: 0.35 }, 4.3)
        .to('.curve-lin', { strokeDashoffset: 0, duration: 1.1, ease: 'power1.inOut' }, 4.4)
        .to('.lbl-lin', { autoAlpha: 1, duration: 0.35 }, 5.3)
        .to('.curve-sq', { strokeDashoffset: 0, duration: 1.0, ease: 'power1.in' }, 5.4)
        .to('.lbl-sq', { autoAlpha: 1, duration: 0.35 }, 6.2)

      // 4 — verdicts: inafaa / haifai
      tl.fromTo('.verdict-ok', { scale: 0.7, transformOrigin: '50% 50%' }, { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'back.out(2)' }, 6.6)
        .fromTo('.verdict-no', { scale: 0.7, transformOrigin: '50% 50%' }, { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'back.out(2)' }, 7.4)

      // 5 — kicker
      tl.to('.kicker', { autoAlpha: 1, y: 0, duration: 0.5 }, 8.4)
        .to('.kicker-line', { strokeDashoffset: 0, duration: 0.4 }, 8.8)
        .to({}, { duration: 0.8 }) // hold → 10.0s

      onReady(tl)
    }, ref)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <svg ref={ref} viewBox="0 0 360 500" className="h-full w-full">
      {/* title */}
      <text className="bigo-title" x={180} y={52} textAnchor="middle" fill="#fff" fontSize={26} fontWeight={800} style={{ opacity: 0, transform: 'translateY(10px)' }}>
        BIG O
      </text>
      <text className="bigo-sub" x={180} y={72} textAnchor="middle" fill="#666" fontFamily={MONO} fontSize={9} letterSpacing={3} style={{ opacity: 0 }}>
        KIPIMO CHA UFANISI WA ALGORITHM
      </text>

      {/* axes */}
      <line className="axis" x1={OX} y1={OY} x2={OX + W} y2={OY} stroke="#555" strokeWidth={1.3} pathLength={1} strokeDasharray={1} strokeDashoffset={1} />
      <line className="axis" x1={OX} y1={OY} x2={OX} y2={OY - H} stroke="#555" strokeWidth={1.3} pathLength={1} strokeDasharray={1} strokeDashoffset={1} />
      <text className="axis-label" x={OX + W} y={OY + 18} textAnchor="end" fill="#888" fontFamily={MONO} fontSize={9} letterSpacing={2} style={{ opacity: 0 }}>
        DATA →
      </text>
      <text className="axis-label" x={OX - 8} y={OY - H + 2} textAnchor="start" fill="#888" fontFamily={MONO} fontSize={9} letterSpacing={2} style={{ opacity: 0 }}>
        MUDA / MEMORY ↑
      </text>

      {/* data piling up on the x-axis */}
      {Array.from({ length: 9 }, (_, i) => (
        <circle key={i} className="datum" cx={OX + 26 + i * 27} cy={OY + 8} r={3} fill="#fff" opacity={0} />
      ))}
      <text className="data-tag" x={OX + 8} y={OY + 34} textAnchor="start" fill="#666" fontFamily={MONO} fontSize={8} letterSpacing={1.5} style={{ opacity: 0 }}>
        DATA INAONGEZEKA…
      </text>

      {/* growth curves */}
      <path className="curve-sq" d={SQ_PATH} fill="none" stroke={RED} strokeWidth={2} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1} />
      <path className="curve-lin" d={LIN_PATH} fill="none" stroke="#fff" strokeWidth={1.6} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1} />
      <path className="curve-log" d={LOG_PATH} fill="none" stroke={ACCENT} strokeWidth={2} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1} />

      <text className="lbl-sq" x={OX + 204} y={OY - H + 4} textAnchor="start" fill={RED} fontFamily={MONO} fontSize={11} fontWeight={700} style={{ opacity: 0 }}>
        O(n²)
      </text>
      <text className="lbl-lin" x={OX + W - 4} y={OY - 194} textAnchor="end" fill="#fff" fontFamily={MONO} fontSize={11} fontWeight={700} style={{ opacity: 0 }}>
        O(n)
      </text>
      <text className="lbl-log" x={OX + W - 4} y={OY - 88} textAnchor="end" fill={ACCENT} fontFamily={MONO} fontSize={11} fontWeight={700} style={{ opacity: 0 }}>
        O(log n)
      </text>

      {/* verdicts — solid fill so they read cleanly over the curves */}
      <g className="verdict-ok" style={{ opacity: 0 }}>
        <rect x={156} y={328} width={104} height={26} rx={13} fill="#0a0a0a" stroke={ACCENT} strokeWidth={1.3} />
        <text x={208} y={345} textAnchor="middle" fill={ACCENT} fontFamily={MONO} fontSize={10} letterSpacing={2}>
          INAFAA ✓
        </text>
      </g>
      <g className="verdict-no" style={{ opacity: 0 }}>
        <rect x={144} y={124} width={104} height={26} rx={13} fill="#0a0a0a" stroke={RED} strokeWidth={1.3} />
        <text x={196} y={141} textAnchor="middle" fill={RED} fontFamily={MONO} fontSize={10} letterSpacing={2}>
          HAIFAI ✗
        </text>
      </g>

      {/* kicker */}
      <g className="kicker" style={{ opacity: 0, transform: 'translateY(10px)' }}>
        <text x={180} y={462} textAnchor="middle" fill="#fff" fontFamily={MONO} fontSize={12} fontWeight={700} letterSpacing={2.5}>
          ALGORITHM SAHIHI = INA-SCALE
        </text>
      </g>
      <line className="kicker-line" x1={130} y1={473} x2={230} y2={473} stroke={ACCENT} strokeWidth={2} pathLength={1} strokeDasharray={1} strokeDashoffset={1} />
    </svg>
  )
}
