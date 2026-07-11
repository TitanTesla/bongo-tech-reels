import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import CityMap from '../components/CityMap'
import { DEST, node } from '../data/city'
import { VehicleBody } from '../components/Vehicle'
import { sfx, type SfxName } from '../audio/sfx'
import { ACCENT, MONO, type SceneProps } from './types'

gsap.registerPlugin(MotionPathPlugin)

// Mwenge -> Kariakoo
const ROUTE =
  'M 140 240 C 140 300 150 350 170 350 C 210 353 250 340 265 330 C 300 322 322 390 330 460'

export default function PayoffScene({ onReady }: SceneProps) {
  const ref = useRef<SVGSVGElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true, defaults: { ease: 'power2.out' } })
      const cue = (t: number, name: SfxName, p?: number) => tl.call(() => sfx.play(name, p), [], t)

      // sfx cues
      cue(0.4, 'draw')
      cue(0.6, 'ui')
      cue(1.0, 'engine')
      cue(4.6, 'ding')
      cue(6.0, 'thud')
      cue(6.7, 'thud')

      // route draws, the boda rides it
      tl.to('.route', { strokeDashoffset: 0, duration: 1.6, ease: 'power1.inOut' }, 0.4)
        .to('.place', { autoAlpha: 1, duration: 0.4, stagger: 0.15 }, 0.6)
        .to('.ride', { autoAlpha: 1, duration: 0.2 }, 0.9)
        .to(
          '.ride',
          {
            motionPath: { path: '.route', align: '.route', alignOrigin: [0.5, 0.5], autoRotate: false },
            duration: 3.6,
            ease: 'power1.inOut',
          },
          1.0,
        )

      // arrival pulse
      tl.fromTo('.arrive', { attr: { r: 5 }, opacity: 0.8 }, { attr: { r: 28 }, opacity: 0, duration: 0.9, ease: 'power1.out' }, 4.6)

      // world recedes, message lands
      tl.to('.world', { opacity: 0.1, duration: 0.8 }, 5.4)
        .to('.msg-1', { autoAlpha: 1, y: 0, duration: 0.5 }, 6.0)
        .to('.msg-2', { autoAlpha: 1, y: 0, duration: 0.5 }, 6.7)
        .to({}, { duration: 2.3 })

      onReady(tl)
    }, ref)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const dest = node(DEST)

  return (
    <svg ref={ref} viewBox="0 0 360 500" className="h-full w-full">
      <g className="world">
        <g opacity={0.3}>
          <CityMap drawn />
        </g>
        <path className="route" d={ROUTE} fill="none" stroke="#fff" strokeWidth={1.6} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1} />
        <circle cx={140} cy={240} r={4.5} fill={ACCENT} />
        <circle cx={dest.x} cy={dest.y} r={4.5} fill="none" stroke="#fff" strokeWidth={1.4} />
        <circle className="arrive" cx={dest.x} cy={dest.y} r={5} fill="none" stroke={ACCENT} strokeWidth={1.4} opacity={0} />
        <text className="place" x={128} y={232} textAnchor="end" fill={ACCENT} fontFamily={MONO} fontSize={9} letterSpacing={2} style={{ opacity: 0 }}>
          MWENGE
        </text>
        <text className="place" x={338} y={480} textAnchor="end" fill="#fff" fontFamily={MONO} fontSize={9} letterSpacing={2} style={{ opacity: 0 }}>
          KARIAKOO
        </text>
        <g className="ride" style={{ color: ACCENT, opacity: 0 }}>
          <VehicleBody kind="boda" />
        </g>
      </g>

      <text className="msg-1" x={180} y={228} textAnchor="middle" fill="#fff" fontSize={24} fontWeight={800} style={{ opacity: 0, transform: 'translateY(12px)' }}>
        DSA SI THEORY.
      </text>
      <text className="msg-2" x={180} y={262} textAnchor="middle" fill={ACCENT} fontSize={21} fontWeight={800} style={{ opacity: 0, transform: 'translateY(12px)' }}>
        NI RIDE YAKO YA NYUMBANI.
      </text>
    </svg>
  )
}
