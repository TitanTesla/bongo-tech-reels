import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { sfx, type SfxName } from '../audio/sfx'
import { BLUE, DANGER, MONO, type SceneProps } from './types'

// where the rows end up once the thing splits open
const SPILL = [
  { x: -104, y: 128, r: -38 },
  { x: -52, y: 156, r: 22 },
  { x: 8, y: 164, r: -14 },
  { x: 66, y: 150, r: 34 },
  { x: 112, y: 120, r: -26 },
  { x: -14, y: 132, r: 12 },
]

export default function BreachScene({ onReady }: SceneProps) {
  const ref = useRef<SVGSVGElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true, defaults: { ease: 'power2.out' } })
      const cue = (t: number, name: SfxName, p?: number) => tl.call(() => sfx.play(name, p), [], t)

      cue(0.3, 'ui')
      cue(1.3, 'blip', 260)
      cue(1.6, 'blip', 220)
      cue(2.0, 'draw')
      cue(2.5, 'thud')
      cue(2.7, 'whoosh')
      cue(4.0, 'thud')
      cue(4.5, 'ding')

      // 1 — the database, sitting there minding its business
      tl.to('.stack', { autoAlpha: 1, duration: 0.4 }, 0.3)
      tl.to('.row', { autoAlpha: 1, duration: 0.25, stagger: 0.08 }, 0.7)

      // 2 — alarm
      tl.to('.alert', { autoAlpha: 1, duration: 0.2 }, 1.3)
      tl.to('.alert', { autoAlpha: 0.25, duration: 0.18, yoyo: true, repeat: 5 }, 1.5)
      tl.to('.shake', { x: 4, duration: 0.06, yoyo: true, repeat: 11, ease: 'none' }, 1.3)
      tl.to('.cyl', { stroke: DANGER, duration: 0.3 }, 1.5)

      // 3 — it splits
      tl.to('.crack', { strokeDashoffset: 0, duration: 0.45, stagger: 0.1 }, 2.0)

      // 4 — and everything inside is just… out
      SPILL.forEach((s, i) => {
        tl.to(
          `.row-${i}`,
          { x: s.x, y: s.y, rotation: s.r, transformOrigin: '50% 50%', duration: 1.0, ease: 'power2.out' },
          2.6 + i * 0.05,
        )
        tl.to(`.row-${i}`, { autoAlpha: 0.5, duration: 0.6 }, 3.0 + i * 0.05)
      })
      tl.to('.cyl', { autoAlpha: 0.2, duration: 0.6 }, 2.8)

      // 5 — the line
      tl.fromTo('.punch', { scale: 1.5, transformOrigin: '50% 50%' }, { autoAlpha: 1, scale: 1, duration: 0.45, ease: 'back.out(2)' }, 4.0)
      tl.to('.lol', { autoAlpha: 1, duration: 0.35 }, 4.5)
      tl.to('.punch', { scale: 1.05, transformOrigin: '50% 50%', duration: 0.25, yoyo: true, repeat: 1 }, 4.9)
      tl.to({}, { duration: 1.0 }, 5.4) // hold → 6.4s

      onReady(tl)
    }, ref)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <svg ref={ref} viewBox="0 0 360 500" className="h-full w-full">
      <text x={180} y={52} textAnchor="middle" fill="#888" fontFamily={MONO} fontSize={10} letterSpacing={3}>
        SIKU WAKIRIPUA
      </text>

      <g className="shake">
        {/* the database */}
        <g className="stack" style={{ opacity: 0 }}>
          <g fill="none" stroke={BLUE} strokeWidth={1.5}>
            <ellipse className="cyl" cx={180} cy={150} rx={58} ry={14} />
            <path className="cyl" d="M122 150 v112" />
            <path className="cyl" d="M238 150 v112" />
            <path className="cyl" d="M122 262 a58 14 0 0 0 116 0" />
          </g>
        </g>

        {/* the rows inside it */}
        {SPILL.map((_, i) => (
          <g className={`row row-${i}`} style={{ opacity: 0 }} key={i}>
            <g transform={`translate(180 ${176 + i * 16})`}>
              <rect x={-34} y={-5} width={68} height={11} rx={2.5} fill="#000" stroke="#4a4a4a" strokeWidth={1} />
              <line x1={-27} y1={0} x2={12} y2={0} stroke="#555" strokeWidth={1.4} strokeLinecap="round" />
            </g>
          </g>
        ))}

        {/* it splits open */}
        <g fill="none" stroke={DANGER} strokeWidth={2} strokeLinejoin="round">
          <path className="crack" d="M180 138 l -14 26 l 12 18 l -16 30" pathLength={1} style={{ strokeDasharray: 1, strokeDashoffset: 1 }} />
          <path className="crack" d="M180 138 l 16 22 l -10 20 l 18 26" pathLength={1} style={{ strokeDasharray: 1, strokeDashoffset: 1 }} />
        </g>
      </g>

      {/* alarm */}
      <g className="alert" style={{ opacity: 0 }}>
        <rect x={8} y={70} width={344} height={366} rx={10} fill="none" stroke={DANGER} strokeWidth={2} />
        <text x={180} y={92} textAnchor="middle" fill={DANGER} fontFamily={MONO} fontSize={8.5} fontWeight={700} letterSpacing={3}>
          DATA BREACH
        </text>
      </g>

      {/* the line */}
      <text className="punch" x={180} y={462} textAnchor="middle" fill={DANGER} fontSize={34} fontWeight={800} style={{ opacity: 0 }}>
        KAZI TUNAYO
      </text>
      <text className="lol" x={300} y={420} textAnchor="middle" fontSize={26} style={{ opacity: 0 }}>
        😂
      </text>
    </svg>
  )
}
