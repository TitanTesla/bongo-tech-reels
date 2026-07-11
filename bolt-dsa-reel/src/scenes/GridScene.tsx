import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import CityMap from '../components/CityMap'
import { CARS, node, USER } from '../data/city'
import { VehicleBody } from '../components/Vehicle'
import { sfx, type SfxName } from '../audio/sfx'
import { ACCENT, MONO, type SceneProps } from './types'

// 4 x 5 grid over the viewBox. Highlight block = cols 0-2, rows 1-3.
const COLS = [0, 90, 180, 270, 360]
const ROWS = [0, 100, 200, 300, 400, 500]
const HL = { x: 0, y: 100, w: 270, h: 300 }

export default function GridScene({ onReady }: SceneProps) {
  const ref = useRef<SVGSVGElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true, defaults: { ease: 'power2.out' } })
      const cue = (t: number, name: SfxName, p?: number) => tl.call(() => sfx.play(name, p), [], t)

      // sfx cues
      cue(0.3, 'whoosh')
      cue(1.8, 'draw')
      cue(4.2, 'swish')
      cue(6.0, 'lock')
      cue(6.6, 'count')
      cue(7.9, 'ding')
      cue(9.5, 'thud')

      // rides + counter appear over a faint map
      tl.to('.car', { autoAlpha: 0.85, duration: 0.35, stagger: 0.05 }, 0.3)
        .to('.counter', { autoAlpha: 1, duration: 0.4 }, 0.8)

      // grid slices the city
      tl.to('.gridline', { strokeDashoffset: 0, duration: 0.7, stagger: 0.12, ease: 'power1.inOut' }, 1.8)

      // everything outside the block dims away
      tl.to('.dim', { opacity: 0.85, duration: 0.9, ease: 'power1.inOut' }, 4.2)
        .to('.car-far', { autoAlpha: 0.12, duration: 0.9 }, 4.2)
        .to('.hl-block', { strokeDashoffset: 0, duration: 0.9 }, 5.0)

      // nearby rides light up
      tl.to('.car-near', { color: ACCENT, autoAlpha: 1, scale: 1.3, transformOrigin: '50% 50%', duration: 0.4, stagger: 0.1 }, 6.0)

      // 10,000 -> 12
      const c = { v: 10000 }
      tl.to(
        c,
        {
          v: 12,
          duration: 1.6,
          ease: 'power3.inOut',
          onUpdate() {
            const el = ref.current?.querySelector('.counter-num')
            if (el) el.textContent = Math.round(c.v).toLocaleString('en-US')
          },
        },
        6.6,
      ).to('.counter-num', { fill: ACCENT, duration: 0.3 }, 7.9)

      // kicker
      tl.to('.kicker', { autoAlpha: 1, y: 0, duration: 0.5 }, 9.5)
        .to('.kicker-line', { strokeDashoffset: 0, duration: 0.4 }, 9.9)
        .to({}, { duration: 1.6 })

      onReady(tl)
    }, ref)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const you = node(USER)

  return (
    <svg ref={ref} viewBox="0 0 360 500" className="h-full w-full">
      <g opacity={0.15}>
        <CityMap drawn />
      </g>

      {/* rides */}
      {CARS.map((c, i) => (
        <g
          key={i}
          className={`car ${c.near ? 'car-near' : 'car-far'}`}
          style={{ color: '#fff', opacity: 0 }}
          transform={`translate(${c.x} ${c.y}) scale(${i % 2 === 0 ? 0.9 : -0.9} 0.9)`}
        >
          <VehicleBody kind={c.kind} />
        </g>
      ))}

      {/* you */}
      <circle cx={you.x} cy={you.y} r={5} fill={ACCENT} />
      <circle cx={you.x} cy={you.y} r={9} fill="none" stroke={ACCENT} strokeWidth={1} opacity={0.5} />

      {/* grid lines */}
      {COLS.slice(1, -1).map((x) => (
        <line key={`c${x}`} className="gridline" x1={x} y1={0} x2={x} y2={500} stroke="#fff" strokeWidth={0.6} opacity={0.5} pathLength={1} strokeDasharray={1} strokeDashoffset={1} />
      ))}
      {ROWS.slice(1, -1).map((y) => (
        <line key={`r${y}`} className="gridline" x1={0} y1={y} x2={360} y2={y} stroke="#fff" strokeWidth={0.6} opacity={0.5} pathLength={1} strokeDasharray={1} strokeDashoffset={1} />
      ))}

      {/* dim masks around the highlight block */}
      <g className="dim" opacity={0} pointerEvents="none">
        <rect x={0} y={0} width={360} height={HL.y} fill="#000" />
        <rect x={0} y={HL.y + HL.h} width={360} height={500 - HL.y - HL.h} fill="#000" />
        <rect x={HL.x + HL.w} y={HL.y} width={360 - HL.w} height={HL.h} fill="#000" />
      </g>

      {/* highlight block outline */}
      <rect className="hl-block" x={HL.x + 1} y={HL.y} width={HL.w - 2} height={HL.h} fill="none" stroke={ACCENT} strokeWidth={1.4} pathLength={1} strokeDasharray={1} strokeDashoffset={1} />

      {/* counter */}
      <g className="counter" style={{ opacity: 0 }}>
        <text x={180} y={52} textAnchor="middle" fill="#666" fontFamily={MONO} fontSize={9} letterSpacing={3}>
          RIDES ZA KU-CHECK
        </text>
        <text className="counter-num" x={180} y={80} textAnchor="middle" fill="#fff" fontFamily={MONO} fontSize={26} fontWeight={700}>
          10,000
        </text>
      </g>

      <g className="kicker" style={{ opacity: 0, transform: 'translateY(10px)' }}>
        <text x={180} y={472} textAnchor="middle" fill="#fff" fontFamily={MONO} fontSize={14} fontWeight={700} letterSpacing={3}>
          GRID = SPATIAL INDEX
        </text>
      </g>
      <line className="kicker-line" x1={130} y1={483} x2={230} y2={483} stroke={ACCENT} strokeWidth={2} pathLength={1} strokeDasharray={1} strokeDashoffset={1} />
    </svg>
  )
}
