import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { sfx, type SfxName } from '../audio/sfx'
import { YOUR_DATA } from '../data/db'
import { ACCENT, BLUE, MONO, type SceneProps } from './types'

// each piece of your data starts out in the world, then lands as a row
const HOMES = [
  { x: 58, y: 112 },
  { x: 302, y: 112 },
  { x: 58, y: 396 },
  { x: 302, y: 396 },
]
const SLOT_Y = [206, 232, 258, 284]
const SLOT_X = 150

export default function DatabaseScene({ onReady }: SceneProps) {
  const ref = useRef<SVGSVGElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true, defaults: { ease: 'power2.out' } })
      const cue = (t: number, name: SfxName, p?: number) => tl.call(() => sfx.play(name, p), [], t)

      cue(0.3, 'ui')
      cue(1.2, 'draw')
      cue(2.6, 'thud')
      cue(3.4, 'pops')
      cue(8.0, 'thud')
      cue(8.6, 'blip', 520)

      // 1 — the definition, in plain words
      tl.to('.def', { autoAlpha: 1, y: 0, duration: 0.45 }, 0.3)

      // 2 — the store itself
      tl.to('.cyl', { strokeDashoffset: 0, duration: 0.8, stagger: 0.1 }, 1.2)
      tl.fromTo('.db-label', { scale: 1.3, transformOrigin: '50% 50%' }, { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'back.out(2)' }, 2.6)

      // 3 — your data, out in the world
      tl.fromTo('.g', { scale: 0.5, transformOrigin: '50% 50%' }, { autoAlpha: 1, scale: 1, duration: 0.4, stagger: 0.14 }, 3.4)

      // 4 — …all of it lands inside
      YOUR_DATA.forEach((_, i) => {
        tl.to(
          `.g-${i}`,
          {
            x: SLOT_X - HOMES[i].x,
            y: SLOT_Y[i] - HOMES[i].y,
            scale: 0.62,
            transformOrigin: '50% 50%',
            duration: 0.65,
            ease: 'power2.inOut',
          },
          5.0 + i * 0.22,
        )
        cue(5.5 + i * 0.22, 'blip', 460 + i * 110)
        tl.to(`.row-${i}`, { autoAlpha: 1, duration: 0.3 }, 5.5 + i * 0.22)
      })

      // 5 — the unsettling part
      tl.to('.out', { autoAlpha: 1, y: 0, duration: 0.45 }, 8.0)
      tl.to('.out-where', { autoAlpha: 1, duration: 0.5 }, 8.6)
      tl.to({}, { duration: 1.2 }, 9.2) // hold → 10.4s

      onReady(tl)
    }, ref)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // hand-drawn glyphs — phone number, NIDA card, chat bubble, photo
  const glyph = (i: number) => {
    const inner = [
      <g key="simu">
        <rect x={-9} y={-13} width={18} height={26} rx={3} fill="none" stroke="#fff" strokeWidth={1.5} />
        <line x1={-4} y1={4} x2={4} y2={4} stroke="#fff" strokeWidth={1.5} strokeLinecap="round" />
      </g>,
      <g key="nida">
        <rect x={-14} y={-10} width={28} height={20} rx={3} fill="none" stroke="#fff" strokeWidth={1.5} />
        <circle cx={-6} cy={-1} r={3.4} fill="none" stroke="#fff" strokeWidth={1.3} />
        <line x1={2} y1={-3} x2={10} y2={-3} stroke="#fff" strokeWidth={1.3} strokeLinecap="round" />
        <line x1={2} y1={3} x2={8} y2={3} stroke="#fff" strokeWidth={1.3} strokeLinecap="round" />
      </g>,
      <g key="chats">
        <rect x={-13} y={-11} width={26} height={19} rx={7} fill="none" stroke="#fff" strokeWidth={1.5} />
        <path d="M -4 8 l -3 7 l 9 -7" fill="none" stroke="#fff" strokeWidth={1.5} strokeLinejoin="round" />
      </g>,
      <g key="picha">
        <rect x={-13} y={-11} width={26} height={22} rx={3} fill="none" stroke="#fff" strokeWidth={1.5} />
        <circle cx={-5} cy={-4} r={2.4} fill="none" stroke="#fff" strokeWidth={1.2} />
        <path d="M -11 8 l 8 -8 l 6 5 l 4 -3 l 6 6" fill="none" stroke="#fff" strokeWidth={1.3} strokeLinejoin="round" />
      </g>,
    ][i]
    return (
      <g className={`g g-${i}`} style={{ opacity: 0 }} key={i}>
        <g transform={`translate(${HOMES[i].x} ${HOMES[i].y})`}>{inner}</g>
      </g>
    )
  }

  return (
    <svg ref={ref} viewBox="0 0 360 500" className="h-full w-full">
      <text className="def" x={180} y={64} textAnchor="middle" fill="#fff" fontSize={12} style={{ opacity: 0, transform: 'translateY(8px)' }}>
        miundo mbinu inayohifadhi <tspan fill={ACCENT}>taarifa zako</tspan>
      </text>

      {/* the database itself */}
      <g fill="none" stroke={BLUE} strokeWidth={1.5}>
        <ellipse className="cyl" cx={180} cy={178} rx={62} ry={15} pathLength={1} style={{ strokeDasharray: 1, strokeDashoffset: 1 }} />
        <path className="cyl" d="M118 178 v122" pathLength={1} style={{ strokeDasharray: 1, strokeDashoffset: 1 }} />
        <path className="cyl" d="M242 178 v122" pathLength={1} style={{ strokeDasharray: 1, strokeDashoffset: 1 }} />
        <path className="cyl" d="M118 300 a62 15 0 0 0 124 0" pathLength={1} style={{ strokeDasharray: 1, strokeDashoffset: 1 }} />
      </g>
      <text className="db-label" x={180} y={330} textAnchor="middle" fill={BLUE} fontFamily={MONO} fontSize={12} fontWeight={700} letterSpacing={3} style={{ opacity: 0 }}>
        DATABASE
      </text>

      {/* the rows your data becomes */}
      {YOUR_DATA.map((d, i) => (
        <text key={d.id} className={`row-${i}`} x={168} y={SLOT_Y[i] + 4} fill="#bbb" fontFamily={MONO} fontSize={8.5} style={{ opacity: 0 }}>
          {d.label}
        </text>
      ))}

      {YOUR_DATA.map((_, i) => glyph(i))}

      <text className="out" x={180} y={400} textAnchor="middle" fill="#fff" fontSize={16} fontWeight={800} style={{ opacity: 0, transform: 'translateY(10px)' }}>
        VYOTE VIKO KWENYE DATABASE
      </text>
      <text className="out-where" x={180} y={428} textAnchor="middle" fill="#666" fontFamily={MONO} fontSize={12} letterSpacing={3} style={{ opacity: 0 }}>
        … somewhere
      </text>
    </svg>
  )
}
