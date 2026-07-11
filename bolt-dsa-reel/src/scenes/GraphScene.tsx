import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import CityMap from '../components/CityMap'
import { node, USER } from '../data/city'
import { sfx, type SfxName } from '../audio/sfx'
import { ACCENT, MONO, type SceneProps } from './types'

const DRIVER = 14

export default function GraphScene({ onReady }: SceneProps) {
  const ref = useRef<SVGSVGElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true, defaults: { ease: 'power2.out' } })
      const cue = (t: number, name: SfxName, p?: number) => tl.call(() => sfx.play(name, p), [], t)

      // sfx cues
      cue(0.3, 'draw')
      cue(2.2, 'pops')
      cue(5.0, 'blip', 880)
      cue(6.5, 'blip', 660)
      cue(8.2, 'ping')
      cue(9.5, 'thud')

      // streets draw themselves in
      tl.to('.edge', { strokeDashoffset: 0, duration: 0.8, stagger: 0.055, ease: 'power1.inOut' }, 0.3)
        // intersections pop
        .to('.node', { attr: { r: 3 }, duration: 0.3, stagger: 0.04 }, 2.2)

      // YOU
      tl.to('#n-9', { fill: ACCENT, stroke: ACCENT, attr: { r: 5 }, duration: 0.3 }, 5.0)
        .fromTo('.you-ring', { attr: { r: 6 }, opacity: 0.8 }, { attr: { r: 26 }, opacity: 0, duration: 1, ease: 'power1.out' }, 5.1)
        .to('.you-label', { autoAlpha: 1, duration: 0.4 }, 5.2)

      // DRIVER
      tl.to(`#n-${DRIVER}`, { fill: '#fff', attr: { r: 5 }, duration: 0.3 }, 6.5)
        .fromTo('.drv-ring', { attr: { r: 6 }, opacity: 0.8 }, { attr: { r: 26 }, opacity: 0, duration: 1, ease: 'power1.out' }, 6.6)
        .to('.drv-label', { autoAlpha: 1, duration: 0.4 }, 6.7)

      // second pulse on both
      tl.fromTo('.you-ring', { attr: { r: 6 }, opacity: 0.7 }, { attr: { r: 22 }, opacity: 0, duration: 0.9 }, 8.2)
        .fromTo('.drv-ring', { attr: { r: 6 }, opacity: 0.7 }, { attr: { r: 22 }, opacity: 0, duration: 0.9 }, 8.4)

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

      <g className="kicker" style={{ opacity: 0, transform: 'translateY(10px)' }}>
        <text x={180} y={30} textAnchor="middle" fill="#fff" fontFamily={MONO} fontSize={15} fontWeight={700} letterSpacing={4}>
          DAR = GRAPH
        </text>
      </g>
      <line className="kicker-line" x1={130} y1={41} x2={230} y2={41} stroke={ACCENT} strokeWidth={2} pathLength={1} strokeDasharray={1} strokeDashoffset={1} />
    </svg>
  )
}
