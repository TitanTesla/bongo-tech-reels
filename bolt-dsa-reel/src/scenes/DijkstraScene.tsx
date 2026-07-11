import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import CityMap from '../components/CityMap'
import { DEST, SHORTEST_PATH, USER, WAVES, edgeKey, node } from '../data/city'
import { sfx, type SfxName } from '../audio/sfx'
import { ACCENT, MONO, type SceneProps } from './types'

export default function DijkstraScene({ onReady }: SceneProps) {
  const ref = useRef<SVGSVGElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true, defaults: { ease: 'power2.out' } })
      const cue = (t: number, name: SfxName, p?: number) => tl.call(() => sfx.play(name, p), [], t)

      // sfx cues
      cue(0.8, 'blip', 880)
      cue(1.4, 'blip', 660)
      WAVES.forEach((_, w) => cue(2.5 + w * 0.95, 'ripple', w))
      ;[523, 659, 784, 1047].forEach((f, i) => cue(7.6 + i * 0.38, 'note', f))
      cue(9.2, 'ding')
      cue(10.2, 'thud')

      // endpoints
      tl.to('#n-9', { fill: ACCENT, stroke: ACCENT, attr: { r: 5 }, duration: 0.3 }, 0.8)
        .to('.you-label', { autoAlpha: 1, duration: 0.3 }, 0.9)
        .to(`#n-${DEST}`, { fill: '#fff', attr: { r: 5 }, duration: 0.3 }, 1.4)
        .to('.dest-label', { autoAlpha: 1, duration: 0.3 }, 1.5)

      // exploration ripples
      WAVES.forEach((wave, w) => {
        const at = 2.5 + w * 0.95
        tl.fromTo(`.wave-${w}`, { attr: { r: 4 }, opacity: 0.55 }, { attr: { r: 30 }, opacity: 0, duration: 1.0, ease: 'power1.out', stagger: 0.06 }, at)
        wave.forEach((id) => {
          if (id !== USER) {
            tl.to(`#n-${id}`, { stroke: ACCENT, fill: '#0f2b1e', duration: 0.25 }, at + 0.15)
          }
        })
      })

      // costs settle, cheapest path locks in
      SHORTEST_PATH.slice(0, -1).forEach((a, i) => {
        const b = SHORTEST_PATH[i + 1]
        tl.to(`.p-${edgeKey(a, b)}`, { strokeDashoffset: 0, duration: 0.38, ease: 'power1.inOut' }, 7.6 + i * 0.38)
      })
      SHORTEST_PATH.forEach((id, i) => {
        tl.to(`#n-${id}`, { fill: ACCENT, stroke: ACCENT, duration: 0.2 }, 7.7 + i * 0.35)
      })

      // kicker
      tl.to('.kicker', { autoAlpha: 1, y: 0, duration: 0.5 }, 10.2)
        .to('.kicker-line', { strokeDashoffset: 0, duration: 0.4 }, 10.6)
        .to({}, { duration: 2.2 })

      onReady(tl)
    }, ref)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const you = node(USER)
  const dest = node(DEST)

  return (
    <svg ref={ref} viewBox="0 0 360 500" className="h-full w-full">
      <g opacity={0.35}>
        <CityMap drawn />
      </g>

      {/* wave rings, one circle per explored node */}
      {WAVES.map((wave, w) =>
        wave.map((id) => (
          <circle key={`${w}-${id}`} className={`wave-${w}`} cx={node(id).x} cy={node(id).y} r={4} fill="none" stroke={ACCENT} strokeWidth={1} opacity={0} />
        )),
      )}

      {/* shortest path overlay */}
      {SHORTEST_PATH.slice(0, -1).map((a, i) => {
        const b = SHORTEST_PATH[i + 1]
        return (
          <line
            key={i}
            className={`p-${edgeKey(a, b)}`}
            x1={node(a).x}
            y1={node(a).y}
            x2={node(b).x}
            y2={node(b).y}
            stroke={ACCENT}
            strokeWidth={2.5}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1}
          />
        )
      })}

      <text className="you-label" x={you.x} y={you.y - 14} textAnchor="middle" fill={ACCENT} fontFamily={MONO} fontSize={10} letterSpacing={2} style={{ opacity: 0 }}>
        WEWE · MWENGE
      </text>
      <text className="dest-label" x={340} y={dest.y - 14} textAnchor="end" fill="#fff" fontFamily={MONO} fontSize={10} letterSpacing={2} style={{ opacity: 0 }}>
        KARIAKOO
      </text>

      <g className="kicker" style={{ opacity: 0, transform: 'translateY(10px)' }}>
        <text x={180} y={30} textAnchor="middle" fill="#fff" fontFamily={MONO} fontSize={14} fontWeight={700} letterSpacing={3}>
          DIJKSTRA = NJIA FUPI ZAIDI
        </text>
      </g>
      <line className="kicker-line" x1={130} y1={41} x2={230} y2={41} stroke={ACCENT} strokeWidth={2} pathLength={1} strokeDasharray={1} strokeDashoffset={1} />
    </svg>
  )
}
