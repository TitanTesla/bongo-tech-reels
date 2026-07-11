import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { sfx, type SfxName } from '../audio/sfx'
import { ACCENT, MONO, type SceneProps } from './types'

// the four secrets fly home into the phone
const GLYPHS = [
  { home: { x: 60, y: 175 }, slot: { x: 180, y: 178 } }, // local db
  { home: { x: 300, y: 175 }, slot: { x: 180, y: 215 } }, // optimistic bubble
  { home: { x: 60, y: 285 }, slot: { x: 180, y: 252 } }, // sync queue
  { home: { x: 300, y: 285 }, slot: { x: 180, y: 289 } }, // ticks
]

export default function PayoffScene({ onReady }: SceneProps) {
  const ref = useRef<SVGSVGElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true, defaults: { ease: 'power2.out' } })
      const cue = (t: number, name: SfxName, p?: number) => tl.call(() => sfx.play(name, p), [], t)

      cue(0.2, 'pops')
      cue(1.0, 'thud')
      cue(1.5, 'blip', 620)
      cue(2.0, 'ui')
      cue(2.3, 'swish')
      cue(4.2, 'thud')
      cue(5.2, 'ding')

      // the four pieces of the episode
      tl.fromTo('.g', { scale: 0.6, transformOrigin: '50% 50%' }, { autoAlpha: 1, scale: 1, duration: 0.4, stagger: 0.12 }, 0.2)

      // the big claim
      tl.to('.big1', { autoAlpha: 1, y: 0, duration: 0.5 }, 1.0)
      tl.to('.big2', { autoAlpha: 1, y: 0, duration: 0.5 }, 1.5)

      // …and they all live inside the phone
      tl.to('.pphone', { autoAlpha: 1, duration: 0.35 }, 2.0)
      GLYPHS.forEach((g, i) => {
        tl.to(
          `.g-${i}`,
          { x: g.slot.x - g.home.x, y: g.slot.y - g.home.y, scale: 0.75, transformOrigin: '50% 50%', duration: 0.5, ease: 'power2.inOut' },
          2.3 + i * 0.28,
        )
        cue(2.5 + i * 0.28, 'blip', 500 + i * 120)
      })

      // SQLite — in every phone on Earth
      tl.fromTo('.stamp', { scale: 1.4, transformOrigin: '50% 50%' }, { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'back.out(2)' }, 4.2)
      tl.to('.sub', { autoAlpha: 1, duration: 0.35 }, 4.8)
      tl.to('.stamp', { scale: 1.05, duration: 0.25, yoyo: true, repeat: 1 }, 5.2)
      tl.to({}, { duration: 1.2 }, 5.7) // hold → 6.9s

      onReady(tl)
    }, ref)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <svg ref={ref} viewBox="0 0 360 500" className="h-full w-full">
      <text className="big1" x={180} y={90} textAnchor="middle" fill="#fff" fontSize={15} fontWeight={800} style={{ opacity: 0, transform: 'translateY(10px)' }}>
        APP HAIJENGWI JUU YA NETWORK
      </text>
      <text className="big2" x={180} y={114} textAnchor="middle" fill={ACCENT} fontSize={15} fontWeight={800} style={{ opacity: 0, transform: 'translateY(10px)' }}>
        INAJENGWA JUU YA SIMU YAKO
      </text>

      {/* the phone everything snaps into */}
      <g className="pphone" style={{ opacity: 0 }}>
        <rect x={130} y={140} width={100} height={180} rx={14} fill="none" stroke="#2a2a2a" strokeWidth={1.4} />
      </g>

      {/* local db */}
      <g className="g g-0" style={{ opacity: 0 }}>
        <g transform={`translate(${GLYPHS[0].home.x} ${GLYPHS[0].home.y})`}>
          <ellipse cx={0} cy={-10} rx={16} ry={5} fill="none" stroke="#fff" strokeWidth={1.4} />
          <path d="M-16 -10 v20 a16 5 0 0 0 32 0 v-20" fill="none" stroke="#fff" strokeWidth={1.4} />
        </g>
      </g>
      {/* optimistic bubble + clock */}
      <g className="g g-1" style={{ opacity: 0 }}>
        <g transform={`translate(${GLYPHS[1].home.x} ${GLYPHS[1].home.y})`}>
          <rect x={-15} y={-10} width={30} height={20} rx={7} fill="none" stroke="#fff" strokeWidth={1.4} />
          <circle cx={11} cy={8} r={4} fill="#000" stroke="#fff" strokeWidth={1} />
          <path d="M11 5.8 v2.2 h1.6" fill="none" stroke="#fff" strokeWidth={1} strokeLinecap="round" />
        </g>
      </g>
      {/* sync queue */}
      <g className="g g-2" style={{ opacity: 0 }}>
        <g transform={`translate(${GLYPHS[2].home.x} ${GLYPHS[2].home.y})`}>
          {[0, 1, 2].map((i) => (
            <rect key={i} x={-12} y={-13 + i * 9} width={24} height={7} rx={2} fill="none" stroke="#fff" strokeWidth={1.3} />
          ))}
        </g>
      </g>
      {/* double ticks */}
      <g className="g g-3" style={{ opacity: 0 }}>
        <g transform={`translate(${GLYPHS[3].home.x} ${GLYPHS[3].home.y})`}>
          <polyline points="-14,-1 -10,4 -1,-6" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          <polyline points="-4,-1 0,4 9,-6" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </g>

      {/* SQLite stamp */}
      <g className="stamp" style={{ opacity: 0 }}>
        <g transform="rotate(-6 180 399)">
          <rect x={47} y={380} width={266} height={38} rx={6} fill="none" stroke={ACCENT} strokeWidth={2} />
          <text x={180} y={404} textAnchor="middle" fill={ACCENT} fontFamily={MONO} fontSize={12} fontWeight={700} letterSpacing={1.5}>
            SQLITE · KILA SIMU DUNIANI
          </text>
        </g>
      </g>
      <text className="sub" x={180} y={448} textAnchor="middle" fill="#555" fontFamily={MONO} fontSize={7.5} letterSpacing={1} style={{ opacity: 0 }}>
        EST. 2000 · SOFTWARE INAYO-RUN ZAIDI KULIKO ZOTE
      </text>
    </svg>
  )
}
