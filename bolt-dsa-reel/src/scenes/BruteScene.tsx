import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import CityMap from '../components/CityMap'
import { CARS, node, USER } from '../data/city'
import { VehicleBody } from '../components/Vehicle'
import { sfx, type SfxName } from '../audio/sfx'
import { ACCENT, MONO, type SceneProps } from './types'

// PART 1 · beats 6–7 — brute force: check EVERY driver in Dar one by
// one. Rahisi kifikra, ila time & space complexity zinalipuka — sekunde
// mbili zinakuwa dakika kadhaa. Then the reframe: algorithm ni formula;
// swali moja lina formula nyingi — chagua fupi + sahihi. 11s.

const RED = '#ff5c5c'

// local layout: drop the top-right car below the MUDA clock HUD
const BCARS = CARS.map((c) => (c.x === 300 && c.y === 55 ? { ...c, y: 88 } : c))

// scan order: left-to-right sweep across the map
const SCAN = BCARS.map((c, i) => ({ ...c, i })).sort((a, b) => a.x - b.x)

// ✓ placement that dodges the HUD (top) and complexity bars (bottom)
const checkPos = (c: { x: number; y: number }) =>
  c.y < 75 ? { x: c.x + 10, y: c.y + 18 } : c.y > 425 ? { x: c.x + 12, y: c.y - 14 } : { x: c.x + 12, y: c.y - 8 }

export default function BruteScene({ onReady }: SceneProps) {
  const ref = useRef<SVGSVGElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true, defaults: { ease: 'power2.out' } })
      const cue = (t: number, name: SfxName, p?: number) => tl.call(() => sfx.play(name, p), [], t)

      // sfx cues
      cue(0.3, 'whoosh')
      cue(1.0, 'count')
      cue(3.4, 'draw')
      cue(6.2, 'thud')
      cue(8.2, 'swish')
      cue(9.0, 'note', 392)
      cue(9.7, 'note', 523)
      cue(10.2, 'ding')

      // 1 — rides + the scan line marches across ALL of them
      tl.to('.car', { autoAlpha: 0.8, duration: 0.3, stagger: 0.04 }, 0.3)
        .to('.hud', { autoAlpha: 1, duration: 0.4 }, 0.6)
        .to('.scanline', { autoAlpha: 0.7, duration: 0.2 }, 0.9)
        .to('.scanline', { attr: { x1: 350, x2: 350 }, duration: 4.6, ease: 'none' }, 1.0)

      // each vehicle flashes as the scan passes it (x → time along sweep)
      SCAN.forEach((c) => {
        const t = 1.0 + (c.x / 350) * 4.6
        cue(t, 'blip', 400 + (c.x % 5) * 90)
        tl.to(`.car-${c.i}`, { color: '#fff', autoAlpha: 1, scale: 1.25, transformOrigin: '50% 50%', duration: 0.12 }, t)
          .to(`.car-${c.i}`, { color: '#555', autoAlpha: 0.45, scale: 1, duration: 0.3 }, t + 0.16)
          .to(`.check-${c.i}`, { autoAlpha: 0.8, duration: 0.15 }, t + 0.1)
      })

      // counter: drivers checked 0 → 10,000
      const checked = { v: 0 }
      tl.to(
        checked,
        {
          v: 10000,
          duration: 4.6,
          ease: 'power1.in',
          onUpdate() {
            const el = ref.current?.querySelector('.hud-count')
            if (el) el.textContent = Math.round(checked.v).toLocaleString('en-US')
          },
        },
        1.0,
      )

      // clock: 0:02 → 4:37, turning red
      const secs = { v: 2 }
      tl.to(
        secs,
        {
          v: 277,
          duration: 4.6,
          ease: 'power2.in',
          onUpdate() {
            const el = ref.current?.querySelector('.hud-clock')
            if (!el) return
            const m = Math.floor(secs.v / 60)
            const s = Math.floor(secs.v % 60)
            el.textContent = `${m}:${String(s).padStart(2, '0')}`
          },
        },
        1.0,
      ).to('.hud-clock', { fill: RED, duration: 0.5 }, 3.8)

      // 2 — complexity bars fill into the red
      tl.to('.bars', { autoAlpha: 1, duration: 0.4 }, 3.4)
        .to('.bar-time', { attr: { width: 128 }, duration: 2.2, ease: 'power2.in' }, 3.5)
        .to('.bar-space', { attr: { width: 112 }, duration: 2.2, ease: 'power2.in' }, 3.7)

      // 3 — the cost lands (cars recede so the message reads clean)
      tl.to('.car', { autoAlpha: 0.14, duration: 0.5 }, 6.1)
        .to('.check', { autoAlpha: 0.18, duration: 0.5 }, 6.1)
        .to('.slow', { autoAlpha: 1, y: 0, duration: 0.5 }, 6.2)
        .fromTo('.slow-big', { scale: 0.8, transformOrigin: '50% 50%' }, { autoAlpha: 1, scale: 1, duration: 0.45, ease: 'back.out(2)' }, 6.5)

      // 4 — reframe: algorithm = formula, chagua fupi
      tl.to('.world', { opacity: 0.08, duration: 0.6 }, 8.0)
        .to('.hud, .bars, .slow, .slow-big, .scanline', { autoAlpha: 0, duration: 0.4 }, 8.0)
        .to('.f-title', { autoAlpha: 1, y: 0, duration: 0.5 }, 8.3)
        .to('.f-long', { autoAlpha: 1, duration: 0.4 }, 9.0)
        .to('.f-long-strike', { strokeDashoffset: 0, duration: 0.4 }, 9.4)
        .to('.f-short', { autoAlpha: 1, duration: 0.4 }, 9.7)
        .fromTo('.f-pick', { scale: 0.7, transformOrigin: '50% 50%' }, { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'back.out(2)' }, 10.2)
        .to({}, { duration: 0.4 }) // hold → 11.0s

      onReady(tl)
    }, ref)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const you = node(USER)

  return (
    <svg ref={ref} viewBox="0 0 360 500" className="h-full w-full">
      <g className="world">
        <g opacity={0.12}>
          <CityMap drawn />
        </g>

        {/* you */}
        <circle cx={you.x} cy={you.y} r={5} fill={ACCENT} />
        <circle cx={you.x} cy={you.y} r={9} fill="none" stroke={ACCENT} strokeWidth={1} opacity={0.5} />

        {/* every ride in Dar, waiting to be checked */}
        {BCARS.map((c, i) => {
          const cp = checkPos(c)
          return (
            <g key={i}>
              <g
                className={`car car-${i}`}
                style={{ color: '#fff', opacity: 0 }}
                transform={`translate(${c.x} ${c.y}) scale(${i % 2 === 0 ? 0.9 : -0.9} 0.9)`}
              >
                <VehicleBody kind={c.kind} />
              </g>
              <text className={`check check-${i}`} x={cp.x} y={cp.y} fill="#666" fontFamily={MONO} fontSize={8} style={{ opacity: 0 }}>
                ✓
              </text>
            </g>
          )
        })}
      </g>

      {/* the brute-force scan line */}
      <line className="scanline" x1={10} y1={70} x2={10} y2={430} stroke={RED} strokeWidth={1.4} opacity={0} strokeDasharray="5 4" />

      {/* HUD: checked counter + clock */}
      <g className="hud" style={{ opacity: 0 }}>
        <text x={22} y={34} textAnchor="start" fill="#666" fontFamily={MONO} fontSize={8} letterSpacing={2}>
          WALIO-CHECK-IWA
        </text>
        <text className="hud-count" x={22} y={56} textAnchor="start" fill="#fff" fontFamily={MONO} fontSize={19} fontWeight={700}>
          0
        </text>
        <text x={338} y={34} textAnchor="end" fill="#666" fontFamily={MONO} fontSize={8} letterSpacing={2}>
          MUDA
        </text>
        <text className="hud-clock" x={338} y={56} textAnchor="end" fill="#fff" fontFamily={MONO} fontSize={19} fontWeight={700}>
          0:02
        </text>
      </g>

      {/* complexity bars */}
      <g className="bars" style={{ opacity: 0 }}>
        <text x={22} y={452} textAnchor="start" fill="#888" fontFamily={MONO} fontSize={8} letterSpacing={2}>
          TIME
        </text>
        <rect x={62} y={444} width={130} height={7} rx={3.5} fill="none" stroke="#2a2a2a" strokeWidth={1} />
        <rect className="bar-time" x={63} y={445} width={0} height={5} rx={2.5} fill={RED} />
        <text x={22} y={472} textAnchor="start" fill="#888" fontFamily={MONO} fontSize={8} letterSpacing={2}>
          SPACE
        </text>
        <rect x={62} y={464} width={130} height={7} rx={3.5} fill="none" stroke="#2a2a2a" strokeWidth={1} />
        <rect className="bar-space" x={63} y={465} width={0} height={5} rx={2.5} fill={RED} />
        <text x={205} y={462} textAnchor="start" fill={RED} fontFamily={MONO} fontSize={9} letterSpacing={1.5}>
          COMPLEXITY ↑
        </text>
      </g>

      {/* the cost */}
      <text className="slow" x={180} y={96} textAnchor="middle" fill="#999" fontFamily={MONO} fontSize={10} letterSpacing={2} style={{ opacity: 0, transform: 'translateY(10px)' }}>
        BADALA YA SEKUNDE 2…
      </text>
      <text className="slow-big" x={180} y={128} textAnchor="middle" fill={RED} fontSize={24} fontWeight={800} style={{ opacity: 0 }}>
        DAKIKA KADHAA?!
      </text>

      {/* ── reframe: algorithm = formula ── */}
      <g className="f-title" style={{ opacity: 0, transform: 'translateY(10px)' }}>
        <text x={180} y={160} textAnchor="middle" fill="#fff" fontSize={20} fontWeight={800}>
          ALGORITHM = FORMULA
        </text>
        <text x={180} y={182} textAnchor="middle" fill="#666" fontFamily={MONO} fontSize={9} letterSpacing={2}>
          SWALI MOJA · FORMULA NYINGI
        </text>
      </g>

      <g className="f-long" style={{ opacity: 0 }}>
        <rect x={40} y={216} width={280} height={40} rx={8} fill="none" stroke="#3a3a3a" strokeWidth={1.2} />
        <text x={56} y={241} textAnchor="start" fill="#888" fontFamily={MONO} fontSize={11}>
          jibu = a·x³ + b·x² − c·x + …
        </text>
        <text x={310} y={241} textAnchor="end" fill="#666" fontFamily={MONO} fontSize={9}>
          NDEFU
        </text>
      </g>
      <line className="f-long-strike" x1={48} y1={236} x2={312} y2={236} stroke={RED} strokeWidth={1.6} pathLength={1} strokeDasharray={1} strokeDashoffset={1} />

      <g className="f-short" style={{ opacity: 0 }}>
        <rect x={40} y={272} width={280} height={40} rx={8} fill="none" stroke={ACCENT} strokeWidth={1.4} />
        <text x={56} y={297} textAnchor="start" fill="#fff" fontFamily={MONO} fontSize={11}>
          jibu = 2·x
        </text>
        <text x={310} y={297} textAnchor="end" fill={ACCENT} fontFamily={MONO} fontSize={9}>
          FUPI ✓
        </text>
      </g>

      <g className="f-pick" style={{ opacity: 0 }}>
        <text x={180} y={356} textAnchor="middle" fill={ACCENT} fontFamily={MONO} fontSize={11} fontWeight={700} letterSpacing={2}>
          CHAGUA FUPI + SAHIHI + HARAKA
        </text>
      </g>
    </svg>
  )
}
