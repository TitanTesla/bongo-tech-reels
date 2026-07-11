import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { CARS } from '../data/city'
import { VehicleBody } from '../components/Vehicle'
import { sfx, type SfxName } from '../audio/sfx'
import { ACCENT, MONO, type SceneProps } from './types'

const YOU = { x: 180, y: 230 }
const MATCH = { x: 200, y: 280 } // Frank Abeid's boda

export default function HookScene({ onReady }: SceneProps) {
  const ref = useRef<SVGSVGElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true, defaults: { ease: 'power2.out' } })
      const cue = (t: number, name: SfxName, p?: number) => tl.call(() => sfx.play(name, p), [], t)

      // sfx cues
      cue(0.3, 'ui')
      cue(1.0, 'tap')
      cue(1.8, 'ping')
      cue(2.35, 'ping')
      cue(2.9, 'ping')
      cue(2.6, 'whoosh')
      cue(4.4, 'lock')
      cue(4.9, 'timer')
      cue(6.4, 'thud')

      // 1 — the button + tap
      tl.to('.cta', { autoAlpha: 1, scale: 1, duration: 0.5, transformOrigin: '50% 50%' }, 0.3)
        .to('.tap-ring', { attr: { r: 34 }, opacity: 0, duration: 0.7, ease: 'power1.out' }, 1.0)
        .to('.cta-rect', { stroke: ACCENT, duration: 0.2 }, 1.1)
        .to('.cta', { autoAlpha: 0.25, duration: 0.5 }, 1.9)

      // 2 — you appear, radar pulses
      tl.to('.you', { autoAlpha: 1, duration: 0.3 }, 1.6)
      for (let i = 0; i < 3; i++) {
        tl.fromTo(
          `.radar-${i}`,
          { attr: { r: 8 }, opacity: 0.6 },
          { attr: { r: 95 }, opacity: 0, duration: 1.4, ease: 'power1.out' },
          1.8 + i * 0.55,
        )
      }

      // 3 — rides fade in across the city
      tl.to('.car', { autoAlpha: 0.85, duration: 0.4, stagger: 0.07 }, 2.6)

      // 4 — Frank's boda locks in
      tl.to('.car-match', { color: ACCENT, autoAlpha: 1, scale: 1.35, transformOrigin: '50% 50%', duration: 0.35 }, 4.4)
        .to('.match-line', { strokeDashoffset: 0, duration: 0.5 }, 4.55)
        .to('.car:not(.car-match)', { autoAlpha: 0.2, duration: 0.5 }, 4.6)

      // 5 — the stopwatch
      const clock = { v: 0 }
      tl.to('.clock', { autoAlpha: 1, duration: 0.3 }, 4.8).to(
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
        4.9,
      )

      // 6 — VIPI?!
      tl.to('.how', { autoAlpha: 1, y: 0, duration: 0.5 }, 6.4)
        .to('.how-sub', { autoAlpha: 1, duration: 0.5 }, 6.9)
        .to({}, { duration: 0.9 }) // hold

      onReady(tl)
    }, ref)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <svg ref={ref} viewBox="0 0 360 500" className="h-full w-full">
      {/* stopwatch */}
      <g className="clock" style={{ opacity: 0 }}>
        <text className="clock-txt" x={180} y={100} textAnchor="middle" fill="#fff" fontFamily={MONO} fontSize={40} fontWeight={700}>
          0.0s
        </text>
        <text x={180} y={122} textAnchor="middle" fill="#666" fontFamily={MONO} fontSize={10} letterSpacing={3}>
          TAP → DEREVA AMEPATIKANA
        </text>
      </g>

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

      {/* CTA button */}
      <g className="cta" style={{ opacity: 0, transform: 'scale(0.92)', transformOrigin: '180px 420px' }}>
        <rect className="cta-rect" x={100} y={400} width={160} height={40} rx={20} fill="none" stroke="#fff" strokeWidth={1.2} />
        <text x={180} y={425} textAnchor="middle" fill="#fff" fontFamily={MONO} fontSize={13} letterSpacing={2}>
          TAFUTA RIDE
        </text>
      </g>
      <circle className="tap-ring" cx={180} cy={420} r={4} fill="none" stroke="#fff" strokeWidth={1.5} opacity={0.9} />

      {/* VIPI?! */}
      <text className="how" x={180} y={330} textAnchor="middle" fill="#fff" fontSize={30} fontWeight={800} style={{ opacity: 0, transform: 'translateY(10px)' }}>
        VIPI?!
      </text>
      <text className="how-sub" x={180} y={352} textAnchor="middle" fill={ACCENT} fontFamily={MONO} fontSize={11} letterSpacing={2} style={{ opacity: 0 }}>
        DATA STRUCTURES + ALGORITHMS
      </text>
    </svg>
  )
}
