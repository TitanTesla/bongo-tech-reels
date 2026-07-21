import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { sfx, type SfxName } from '../audio/sfx'
import { ACCENT, BLUE, MONO, type SceneProps } from './types'

const CHIP_HOME = { y: 112 }
const CHIP_X = [148, 161, 174, 187, 200, 213]
// two chips per destination rack
const CHIP_TO = [
  { x: 78, y: 244 },
  { x: 102, y: 244 },
  { x: 78, y: 334 },
  { x: 102, y: 334 },
  { x: 258, y: 289 },
  { x: 282, y: 289 },
]

export default function WhereScene({ onReady }: SceneProps) {
  const ref = useRef<SVGSVGElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true, defaults: { ease: 'power2.out' } })
      const cue = (t: number, name: SfxName, p?: number) => tl.call(() => sfx.play(name, p), [], t)

      cue(0.3, 'ui')
      cue(0.9, 'draw')
      cue(2.0, 'pops')
      cue(3.4, 'ui')
      cue(6.4, 'thud')

      // 1 — your data, sitting in one place for the last time
      tl.to('.chip', { autoAlpha: 1, duration: 0.3, stagger: 0.06 }, 0.3)
      tl.to('.chip-label', { autoAlpha: 1, duration: 0.35 }, 0.6)

      // 2 — the border, and the two sides of it
      tl.to('.border', { strokeDashoffset: 0, duration: 0.9 }, 0.9)
      tl.to('.side', { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.15 }, 1.6)

      // 3 — the racks it actually lands on
      tl.to('.rack', { autoAlpha: 1, duration: 0.4, stagger: 0.15 }, 2.0)

      // 4 — it scatters, and it leaves
      tl.to('.chip-label', { autoAlpha: 0, duration: 0.3 }, 3.2)
      CHIP_X.forEach((x, i) => {
        tl.to(
          `.chip-${i}`,
          {
            x: CHIP_TO[i].x - x,
            y: CHIP_TO[i].y - CHIP_HOME.y,
            duration: 0.75,
            ease: 'power2.inOut',
          },
          3.4 + i * 0.12,
        )
        cue(4.0 + i * 0.12, 'blip', 420 + i * 70)
        tl.to(`.chip-${i}`, { autoAlpha: 0.45, duration: 0.3 }, 4.05 + i * 0.12)
      })

      // 5 — the takeaway
      tl.to('.out', { autoAlpha: 1, y: 0, duration: 0.45 }, 6.4)
      tl.to({}, { duration: 1.1 }, 7.0) // hold → 8.1s

      onReady(tl)
    }, ref)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const rack = (cx: number, cy: number, label: string, color: string) => (
    <g className="rack" style={{ opacity: 0 }}>
      <rect x={cx - 30} y={cy - 24} width={60} height={48} rx={4} fill="none" stroke="#333" strokeWidth={1.3} />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <line x1={cx - 22} y1={cy - 12 + i * 12} x2={cx + 14} y2={cy - 12 + i * 12} stroke="#2c2c2c" strokeWidth={1.1} />
          <circle cx={cx + 21} cy={cy - 12 + i * 12} r={1.8} fill={color} />
        </g>
      ))}
      <text x={cx} y={cy + 40} textAnchor="middle" fill={color} fontFamily={MONO} fontSize={7.5} letterSpacing={1}>
        {label}
      </text>
    </g>
  )

  return (
    <svg ref={ref} viewBox="0 0 360 500" className="h-full w-full">
      <text x={180} y={52} textAnchor="middle" fill="#888" fontFamily={MONO} fontSize={10} letterSpacing={3}>
        ZIKO WAPI?
      </text>

      {/* your data, before it scatters */}
      {CHIP_X.map((x, i) => (
        <g className={`chip chip-${i}`} style={{ opacity: 0 }} key={x}>
          <rect x={x - 5} y={CHIP_HOME.y - 4} width={10} height={8} rx={2} fill="none" stroke={ACCENT} strokeWidth={1.2} />
        </g>
      ))}
      <text className="chip-label" x={180} y={92} textAnchor="middle" fill={ACCENT} fontFamily={MONO} fontSize={8} letterSpacing={1.5} style={{ opacity: 0 }}>
        taarifa zako
      </text>

      {/* the border */}
      <line
        className="border"
        x1={180}
        y1={150}
        x2={180}
        y2={392}
        stroke="#2a2a2a"
        strokeWidth={1.2}
        strokeDasharray="5 6"
        pathLength={1}
        style={{ strokeDasharray: 1, strokeDashoffset: 1 }}
      />

      <text className="side" x={90} y={176} textAnchor="middle" fill={BLUE} fontFamily={MONO} fontSize={9} fontWeight={700} letterSpacing={1.5} style={{ opacity: 0, transform: 'translateY(8px)' }}>
        NJE YA NCHI
      </text>
      <text className="side" x={270} y={176} textAnchor="middle" fill={ACCENT} fontFamily={MONO} fontSize={9} fontWeight={700} letterSpacing={1.5} style={{ opacity: 0, transform: 'translateY(8px)' }}>
        NDANI YA NCHI
      </text>

      {rack(90, 244, 'WhatsApp', BLUE)}
      {rack(90, 334, 'Instagram', BLUE)}
      {rack(270, 289, 'Serikali', ACCENT)}

      <text className="out" x={180} y={430} textAnchor="middle" fill="#fff" fontSize={14} fontWeight={800} style={{ opacity: 0, transform: 'translateY(10px)' }}>
        SEHEMU HUJUI, SERVER HUJUI
      </text>
    </svg>
  )
}
