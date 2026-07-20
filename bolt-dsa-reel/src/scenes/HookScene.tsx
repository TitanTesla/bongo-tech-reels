import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import CityMap from '../components/CityMap'
import { CARS } from '../data/city'
import { VehicleBody } from '../components/Vehicle'
import { sfx, type SfxName } from '../audio/sfx'
import { ACCENT, MONO, type SceneProps } from './types'

// PART 1 · beats 1–2 — you tap "Tafuta Ride", the stage curtains part
// ("nyuma ya pazia", literally), and the hidden system is revealed:
// radar, thousands of rides, a driver locked in 2.0 seconds. 10s.

const YOU = { x: 180, y: 250 }
const MATCH = { x: 200, y: 280 } // the boda that wins the match

export default function HookScene({ onReady }: SceneProps) {
  const ref = useRef<SVGSVGElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true, defaults: { ease: 'power2.out' } })
      const cue = (t: number, name: SfxName, p?: number) => tl.call(() => sfx.play(name, p), [], t)

      // sfx cues
      cue(0.25, 'ui')
      cue(1.0, 'tap')
      cue(1.5, 'whoosh')
      cue(2.1, 'thud')
      cue(3.1, 'blip', 740)
      cue(4.3, 'whoosh')
      cue(4.4, 'draw')
      cue(4.9, 'ping')
      cue(5.45, 'ping')
      cue(5.5, 'pops')
      cue(6.4, 'timer')
      cue(7.6, 'lock')
      cue(8.5, 'thud')

      // 1 — the app face: CTA appears on the closed curtains, you tap
      tl.fromTo('.cta', { scale: 0.92, transformOrigin: '50% 50%' }, { autoAlpha: 1, scale: 1, duration: 0.5 }, 0.25)
        .to('.tap-ring', { attr: { r: 34 }, opacity: 0, duration: 0.7, ease: 'power1.out' }, 1.0)
        .to('.cta-rect', { stroke: ACCENT, duration: 0.2 }, 1.1)

      // 2 — the question lands on the curtains
      tl.to('.cta', { autoAlpha: 0.15, duration: 0.4 }, 1.5)
        .to('.q-1', { autoAlpha: 1, y: 0, duration: 0.5 }, 1.6)
        .to('.q-2', { autoAlpha: 1, y: 0, duration: 0.55 }, 2.1)
        .fromTo('.q-mark', { scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 0.45, transformOrigin: '50% 50%', ease: 'back.out(2)' }, 3.1)

      // 3 — curtains part: behind the scenes is revealed
      tl.to('.q-wrap', { autoAlpha: 0, y: -14, duration: 0.45 }, 4.2)
        .to('.cta', { autoAlpha: 0, duration: 0.3 }, 4.2)
        .to('.curtain-l', { x: -186, duration: 1.1, ease: 'power2.inOut' }, 4.3)
        .to('.curtain-r', { x: 186, duration: 1.1, ease: 'power2.inOut' }, 4.3)
        .to('.backstage-tag', { autoAlpha: 1, duration: 0.4 }, 4.7)

      // 4 — you + radar + rides across the city
      tl.to('.you', { autoAlpha: 1, duration: 0.3 }, 4.8)
      for (let i = 0; i < 3; i++) {
        tl.fromTo(
          `.radar-${i}`,
          { attr: { r: 8 }, opacity: 0.6 },
          { attr: { r: 95 }, opacity: 0, duration: 1.3, ease: 'power1.out' },
          4.9 + i * 0.5,
        )
      }
      tl.to('.car', { autoAlpha: 0.85, duration: 0.35, stagger: 0.06 }, 5.4)

      // 5 — the stopwatch: 0.0 → 2.0s
      const clock = { v: 0 }
      tl.to('.clock', { autoAlpha: 1, duration: 0.3 }, 6.3).to(
        clock,
        {
          v: 2,
          duration: 1.2,
          ease: 'none',
          onUpdate() {
            const el = ref.current?.querySelector('.clock-txt')
            if (el) el.textContent = `${clock.v.toFixed(1)}s`
          },
        },
        6.4,
      )

      // 6 — match locked among thousands
      tl.to('.clock-txt', { fill: ACCENT, duration: 0.25 }, 7.6)
        .to('.car-match', { color: ACCENT, autoAlpha: 1, scale: 1.35, transformOrigin: '50% 50%', duration: 0.35 }, 7.6)
        .to('.match-line', { strokeDashoffset: 0, duration: 0.5 }, 7.7)
        .to('.car:not(.car-match)', { autoAlpha: 0.22, duration: 0.5 }, 7.8)

      // 7 — the scale of it
      tl.to('.thousands', { autoAlpha: 1, y: 0, duration: 0.5 }, 8.5)
        .to('.thousands-line', { strokeDashoffset: 0, duration: 0.4 }, 8.9)
        .to({}, { duration: 0.6 }) // hold → 10.0s

      onReady(tl)
    }, ref)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <svg ref={ref} viewBox="0 0 360 500" className="h-full w-full">
      {/* ── backstage: the hidden system, revealed when curtains part ── */}
      <g opacity={0.16}>
        <CityMap drawn />
      </g>

      <text className="backstage-tag" x={180} y={30} textAnchor="middle" fill="#666" fontFamily={MONO} fontSize={9} letterSpacing={3} style={{ opacity: 0 }}>
        NYUMA YA PAZIA · BEHIND THE SCENES
      </text>

      {/* scattered rides — magari, bajaji, boda */}
      {CARS.map((c, i) => {
        const isMatch = c.x === MATCH.x && c.y === MATCH.y
        const s = isMatch || i % 2 === 0 ? 0.9 : -0.9
        return (
          <g
            key={i}
            className={`car ${isMatch ? 'car-match' : ''}`}
            style={{ color: '#fff', opacity: 0 }}
            transform={`translate(${c.x} ${c.y}) scale(${s} 0.9)`}
          >
            <VehicleBody kind={c.kind} />
          </g>
        )
      })}

      {/* you + radar */}
      <g className="you" style={{ opacity: 0 }}>
        <circle cx={YOU.x} cy={YOU.y} r={5} fill={ACCENT} />
        <circle cx={YOU.x} cy={YOU.y} r={9} fill="none" stroke={ACCENT} strokeWidth={1} opacity={0.5} />
      </g>
      {[0, 1, 2].map((i) => (
        <circle key={i} className={`radar-${i}`} cx={YOU.x} cy={YOU.y} r={8} fill="none" stroke={ACCENT} strokeWidth={1} opacity={0} />
      ))}

      {/* match connection */}
      <line
        className="match-line"
        x1={MATCH.x}
        y1={MATCH.y}
        x2={YOU.x}
        y2={YOU.y}
        stroke={ACCENT}
        strokeWidth={1.5}
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1}
      />

      {/* stopwatch */}
      <g className="clock" style={{ opacity: 0 }}>
        <text className="clock-txt" x={180} y={92} textAnchor="middle" fill="#fff" fontFamily={MONO} fontSize={38} fontWeight={700}>
          0.0s
        </text>
        <text x={180} y={112} textAnchor="middle" fill="#666" fontFamily={MONO} fontSize={9} letterSpacing={3}>
          REQUEST → DEREVA AMEPATIKANA
        </text>
      </g>

      {/* scale label */}
      <g className="thousands" style={{ opacity: 0, transform: 'translateY(10px)' }}>
        <text x={180} y={452} textAnchor="middle" fill="#fff" fontFamily={MONO} fontSize={13} fontWeight={700} letterSpacing={3}>
          KATI YA MAELFU · DAR NZIMA
        </text>
      </g>
      <line className="thousands-line" x1={120} y1={463} x2={240} y2={463} stroke={ACCENT} strokeWidth={2} pathLength={1} strokeDasharray={1} strokeDashoffset={1} />

      {/* ── the curtains (app face) — on top, slide apart at 4.3s ── */}
      <g className="curtain-l">
        <rect x={-6} y={0} width={186} height={500} fill="#0d0d0d" />
        {[24, 60, 96, 132, 168].map((x) => (
          <line key={x} x1={x} y1={0} x2={x} y2={500} stroke="#161616" strokeWidth={7} />
        ))}
        <line x1={179} y1={0} x2={179} y2={500} stroke="#222" strokeWidth={1} />
      </g>
      <g className="curtain-r">
        <rect x={180} y={0} width={186} height={500} fill="#0d0d0d" />
        {[204, 240, 276, 312, 348].map((x) => (
          <line key={x} x1={x} y1={0} x2={x} y2={500} stroke="#161616" strokeWidth={7} />
        ))}
        <line x1={181} y1={0} x2={181} y2={500} stroke="#222" strokeWidth={1} />
      </g>

      {/* question — sits on the curtains */}
      <g className="q-wrap">
        <text className="q-1" x={180} y={205} textAnchor="middle" fill="#999" fontFamily={MONO} fontSize={12} letterSpacing={2} style={{ opacity: 0, transform: 'translateY(10px)' }}>
          UNAPO-REQUEST BOLT…
        </text>
        <text className="q-2" x={180} y={238} textAnchor="middle" fill="#fff" fontSize={21} fontWeight={800} style={{ opacity: 0, transform: 'translateY(10px)' }}>
          NINI KINATOKEA NYUMA?
        </text>
        <text className="q-mark" x={180} y={308} textAnchor="middle" fill={ACCENT} fontSize={40} fontWeight={800} style={{ opacity: 0 }}>
          ?
        </text>
      </g>

      {/* CTA button — the app face you tap */}
      <g className="cta" style={{ opacity: 0 }}>
        <rect className="cta-rect" x={100} y={400} width={160} height={40} rx={20} fill="none" stroke="#fff" strokeWidth={1.2} />
        <text x={180} y={425} textAnchor="middle" fill="#fff" fontFamily={MONO} fontSize={13} letterSpacing={2}>
          TAFUTA RIDE
        </text>
      </g>
      <circle className="tap-ring" cx={180} cy={420} r={4} fill="none" stroke="#fff" strokeWidth={1.5} opacity={0.9} />
    </svg>
  )
}
