import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import CityMap from '../components/CityMap'
import { node, USER } from '../data/city'
import { sfx, type SfxName } from '../audio/sfx'
import { ACCENT, MONO, type SceneProps } from './types'

// PART 1 · beat 5 — mji kama Dar as a GRAPH data structure. Streets
// draw in (lines = barabara), intersections pop (dots = makutano),
// then WEWE and DEREVA light up as two dots on it. 10s.

const DRIVER = 14

export default function GraphScene({ onReady }: SceneProps) {
  const ref = useRef<SVGSVGElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true, defaults: { ease: 'power2.out' } })
      const cue = (t: number, name: SfxName, p?: number) => tl.call(() => sfx.play(name, p), [], t)

      // sfx cues
      cue(0.2, 'thud')
      cue(0.9, 'draw')
      cue(3.2, 'pops')
      cue(3.6, 'blip', 700)
      cue(4.7, 'blip', 520)
      cue(6.5, 'blip', 880)
      cue(7.6, 'blip', 660)
      cue(8.6, 'ping')

      // 1 — header: Dar → graph
      tl.to('.head', { autoAlpha: 1, y: 0, duration: 0.5 }, 0.2)
        .to('.head-line', { strokeDashoffset: 0, duration: 0.4 }, 0.6)

      // 2 — streets draw themselves in (lines = barabara)
      tl.to('.edge', { strokeDashoffset: 0, duration: 0.8, stagger: 0.045, ease: 'power1.inOut' }, 0.9)

      // 3 — intersections pop (dots = makutano)
      tl.to('.node', { attr: { r: 3 }, duration: 0.3, stagger: 0.035 }, 3.2)
        .to('.tag-dots', { autoAlpha: 1, duration: 0.4 }, 3.6)
        .to('.tag-lines', { autoAlpha: 1, duration: 0.4 }, 4.7)

      // 4 — WEWE
      tl.to('#n-9', { fill: ACCENT, stroke: ACCENT, attr: { r: 5 }, duration: 0.3 }, 6.5)
        .fromTo('.you-ring', { attr: { r: 6 }, opacity: 0.8 }, { attr: { r: 26 }, opacity: 0, duration: 1, ease: 'power1.out' }, 6.6)
        .to('.you-label', { autoAlpha: 1, duration: 0.4 }, 6.7)

      // 5 — DEREVA
      tl.to(`#n-${DRIVER}`, { fill: '#fff', attr: { r: 5 }, duration: 0.3 }, 7.6)
        .fromTo('.drv-ring', { attr: { r: 6 }, opacity: 0.8 }, { attr: { r: 26 }, opacity: 0, duration: 1, ease: 'power1.out' }, 7.7)
        .to('.drv-label', { autoAlpha: 1, duration: 0.4 }, 7.8)

      // 6 — both pulse together
      tl.fromTo('.you-ring', { attr: { r: 6 }, opacity: 0.7 }, { attr: { r: 22 }, opacity: 0, duration: 0.9 }, 8.6)
        .fromTo('.drv-ring', { attr: { r: 6 }, opacity: 0.7 }, { attr: { r: 22 }, opacity: 0, duration: 0.9 }, 8.8)
        .to({}, { duration: 0.3 }) // hold → 10.0s

      onReady(tl)
    }, ref)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const you = node(USER)
  const drv = node(DRIVER)

  return (
    <svg ref={ref} viewBox="0 0 360 500" className="h-full w-full">
      <CityMap />

      <circle className="you-ring" cx={you.x} cy={you.y} r={6} fill="none" stroke={ACCENT} strokeWidth={1.2} opacity={0} />
      <circle className="drv-ring" cx={drv.x} cy={drv.y} r={6} fill="none" stroke="#fff" strokeWidth={1.2} opacity={0} />

      <text className="you-label" x={you.x} y={you.y - 14} textAnchor="middle" fill={ACCENT} fontFamily={MONO} fontSize={10} letterSpacing={2} style={{ opacity: 0 }}>
        WEWE
      </text>
      <text className="drv-label" x={drv.x} y={drv.y - 14} textAnchor="middle" fill="#fff" fontFamily={MONO} fontSize={10} letterSpacing={2} style={{ opacity: 0 }}>
        DEREVA
      </text>

      {/* header */}
      <g className="head" style={{ opacity: 0, transform: 'translateY(10px)' }}>
        <text x={180} y={30} textAnchor="middle" fill="#fff" fontFamily={MONO} fontSize={15} fontWeight={700} letterSpacing={4}>
          DAR = GRAPH
        </text>
      </g>
      <line className="head-line" x1={130} y1={41} x2={230} y2={41} stroke={ACCENT} strokeWidth={2} pathLength={1} strokeDasharray={1} strokeDashoffset={1} />

      {/* legend labels — mixed EN/SW like the script */}
      <text className="tag-dots" x={22} y={478} textAnchor="start" fill="#fff" fontFamily={MONO} fontSize={9} letterSpacing={1.5} style={{ opacity: 0 }}>
        ● DOTS = MAKUTANO
      </text>
      <text className="tag-lines" x={338} y={478} textAnchor="end" fill="#888" fontFamily={MONO} fontSize={9} letterSpacing={1.5} style={{ opacity: 0 }}>
        ─ LINES = BARABARA
      </text>
    </svg>
  )
}
