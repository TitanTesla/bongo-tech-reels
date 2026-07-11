import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { sfx, type SfxName } from '../audio/sfx'
import { ACCENT, BLUE, MONO, type SceneProps } from './types'

// icon home positions → table row slots
const ICONS = [
  { home: { x: 90, y: 140 }, slot: { x: 100, y: 232 }, label: 'transfer', row: '#48201' },
  { home: { x: 180, y: 140 }, slot: { x: 100, y: 268 }, label: 'like', row: '#48202' },
  { home: { x: 270, y: 140 }, slot: { x: 100, y: 304 }, label: 'message', row: '#48203' },
]

export default function PayoffScene({ onReady }: SceneProps) {
  const ref = useRef<SVGSVGElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true, defaults: { ease: 'power2.out' } })
      const cue = (t: number, name: SfxName, p?: number) => tl.call(() => sfx.play(name, p), [], t)

      cue(0.2, 'pops')
      cue(1.0, 'thud')
      cue(2.2, 'ui')
      cue(2.5, 'swish')
      cue(2.7, 'blip', 500)
      cue(2.95, 'blip', 620)
      cue(3.2, 'blip', 740)
      cue(3.9, 'thud')
      cue(5.0, 'ding')

      // everything you do…
      tl.fromTo(
        '.ic',
        { scale: 0.6, transformOrigin: '50% 50%' },
        { autoAlpha: 1, scale: 1, duration: 0.4, stagger: 0.15 },
        0.2,
      )
      tl.to('.big', { autoAlpha: 1, y: 0, duration: 0.5 }, 1.0)

      // …snaps into rows
      tl.to('.tbl', { autoAlpha: 1, duration: 0.4 }, 2.2)
      ICONS.forEach((ic, i) => {
        tl.to(
          `.ic-${i}`,
          { x: ic.slot.x - ic.home.x, y: ic.slot.y - ic.home.y, scale: 0.55, transformOrigin: '50% 50%', duration: 0.55, ease: 'power2.inOut' },
          2.4 + i * 0.22,
        )
        tl.to(`.rtxt-${i}`, { autoAlpha: 1, duration: 0.3 }, 2.75 + i * 0.22)
      })

      // SQL est. 1974
      tl.fromTo(
        '.stamp',
        { scale: 1.4, transformOrigin: '50% 50%' },
        { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'back.out(2)' },
        3.9,
      )

      // closing beat — the stamp settles
      tl.to('.stamp', { scale: 1.05, duration: 0.25, yoyo: true, repeat: 1 }, 5.0)
      tl.to({}, { duration: 1.9 }) // hold

      onReady(tl)
    }, ref)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <svg ref={ref} viewBox="0 0 360 500" className="h-full w-full">
      <text className="big" x={180} y={100} textAnchor="middle" fill="#fff" fontSize={18} fontWeight={800} style={{ opacity: 0, transform: 'translateY(10px)' }}>
        KILA KITU NI <tspan fill={BLUE}>ROW</tspan>
      </text>

      {/* wallet · like · message */}
      <g className="ic ic-0" style={{ opacity: 0 }}>
        <g transform={`translate(${ICONS[0].home.x} ${ICONS[0].home.y})`}>
          <rect x={-17} y={-12} width={34} height={24} rx={5} fill="none" stroke="#fff" strokeWidth={1.6} />
          <path d="M -17 -4 h 34" stroke="#fff" strokeWidth={1.6} />
          <circle cx={10} cy={4} r={2} fill="#fff" />
        </g>
      </g>
      <g className="ic ic-1" style={{ opacity: 0 }}>
        <g transform={`translate(${ICONS[1].home.x} ${ICONS[1].home.y})`}>
          <path
            d="M 0 10 C -14 0 -16 -10 -8 -13 C -3 -15 0 -11 0 -8 C 0 -11 3 -15 8 -13 C 16 -10 14 0 0 10 Z"
            fill="none"
            stroke="#fff"
            strokeWidth={1.6}
            strokeLinejoin="round"
          />
        </g>
      </g>
      <g className="ic ic-2" style={{ opacity: 0 }}>
        <g transform={`translate(${ICONS[2].home.x} ${ICONS[2].home.y})`}>
          <rect x={-16} y={-12} width={32} height={22} rx={8} fill="none" stroke="#fff" strokeWidth={1.6} />
          <path d="M -4 10 l -4 8 l 10 -8" fill="none" stroke="#fff" strokeWidth={1.6} strokeLinejoin="round" />
        </g>
      </g>

      {/* the one table everything lands in */}
      <g className="tbl" style={{ opacity: 0 }}>
        <rect x={70} y={214} width={220} height={108} rx={8} fill="none" stroke="#2a2a2a" strokeWidth={1.3} />
        <line x1={70} y1={250} x2={290} y2={250} stroke="#1c1c1c" strokeWidth={1} />
        <line x1={70} y1={286} x2={290} y2={286} stroke="#1c1c1c" strokeWidth={1} />
      </g>
      {ICONS.map((ic, i) => (
        <text key={ic.label} className={`rtxt-${i}`} x={124} y={ic.slot.y + 4} fill="#ccc" fontFamily={MONO} fontSize={10} style={{ opacity: 0 }}>
          {ic.label} · <tspan fill={BLUE}>row {ic.row}</tspan>
        </text>
      ))}

      {/* SQL est. 1974 */}
      <g className="stamp" style={{ opacity: 0 }}>
        <g transform="rotate(-6 180 368)">
          <rect x={95} y={348} width={170} height={40} rx={5} fill="none" stroke={ACCENT} strokeWidth={2} />
          <text x={180} y={374} textAnchor="middle" fill={ACCENT} fontFamily={MONO} fontSize={14} fontWeight={700} letterSpacing={2}>
            SQL · EST. 1974
          </text>
        </g>
      </g>

    </svg>
  )
}
