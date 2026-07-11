import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { DriverAvatar, VehicleBody, type VehicleKind } from '../components/Vehicle'
import { sfx, type SfxName } from '../audio/sfx'
import { ACCENT, MONO, type SceneProps } from './types'

const TAGS: Record<VehicleKind, string> = { car: 'GARI', boda: 'BODABODA', bajaji: 'BAJAJI' }

const DRIVERS: { name: string; kind: VehicleKind; eta: number }[] = [
  { name: 'JUMA SAID', kind: 'bajaji', eta: 4.2 },
  { name: 'FRANK ABEID', kind: 'boda', eta: 2.1 },
  { name: 'BARAKA MNYIKA', kind: 'car', eta: 6.8 },
  { name: 'NEEMA MUSHI', kind: 'car', eta: 3.0 },
  { name: 'ZAWADI OMARY', kind: 'boda', eta: 5.5 },
]

const SLOT_Y = (i: number) => 88 + i * 74
const sorted = [...DRIVERS].map((d, i) => ({ ...d, from: i })).sort((a, b) => a.eta - b.eta)
// rank of each original index after sorting
const RANK = DRIVERS.map((_, i) => sorted.findIndex((s) => s.from === i))
const WINNER = RANK.indexOf(0) // Frank Abeid

export default function SortScene({ onReady }: SceneProps) {
  const ref = useRef<SVGSVGElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true, defaults: { ease: 'power2.out' } })
      const cue = (t: number, name: SfxName, p?: number) => tl.call(() => sfx.play(name, p), [], t)

      // sfx cues
      cue(0.6, 'whoosh')
      cue(3.3, 'swish')
      cue(3.9, 'swish')
      cue(5.6, 'lock')
      cue(6.8, 'cash')
      cue(8.2, 'ding')

      tl.to('.header', { autoAlpha: 1, duration: 0.4 }, 0.3)
        .to('.card', { autoAlpha: 1, x: 0, duration: 0.45, stagger: 0.14 }, 0.6)

      // the sort — cards glide to their ranked slots
      tl.to('.sort-label', { autoAlpha: 1, duration: 0.3 }, 3.0)
      DRIVERS.forEach((_, i) => {
        tl.to(`.card-${i}`, { y: SLOT_Y(RANK[i]) - SLOT_Y(i), duration: 1.1, ease: 'power2.inOut' }, 3.3 + i * 0.06)
      })

      // Frank locks, rest dim
      tl.to(`.card-${WINNER} .card-box`, { stroke: ACCENT, duration: 0.3 }, 5.6)
        .to(`.card-${WINNER} .eta`, { fill: ACCENT, duration: 0.3 }, 5.6)
        .to(`.card-${WINNER} .vehicle`, { color: ACCENT, duration: 0.3 }, 5.6)
        .to('.card-dim', { autoAlpha: 0.3, duration: 0.5 }, 5.7)
        .to('.pick', { autoAlpha: 1, duration: 0.3 }, 6.0)

      // nauli counts up
      const fare = { v: 0 }
      tl.to('.fare', { autoAlpha: 1, duration: 0.4 }, 6.6).to(
        fare,
        {
          v: 4500,
          duration: 1.4,
          ease: 'power2.inOut',
          onUpdate() {
            const el = ref.current?.querySelector('.fare-num')
            if (el) el.textContent = `TZS ${Math.round(fare.v).toLocaleString('en-US')}`
          },
        },
        6.8,
      )

      // hold on the final frame
      tl.to({}, { duration: 2.2 }, 8.8)

      onReady(tl)
    }, ref)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <svg ref={ref} viewBox="0 0 360 500" className="h-full w-full">
      <text className="header" x={30} y={52} fill="#666" fontFamily={MONO} fontSize={10} letterSpacing={3} style={{ opacity: 0 }}>
        MADEREVA KARIBU · 12
      </text>
      <text className="sort-label" x={330} y={52} textAnchor="end" fill={ACCENT} fontFamily={MONO} fontSize={10} letterSpacing={2} style={{ opacity: 0 }}>
        SORT BY ETA ↑
      </text>

      {DRIVERS.map((d, i) => {
        const y = SLOT_Y(i)
        return (
          <g key={d.name} className={`card card-${i} ${RANK[i] !== 0 ? 'card-dim' : ''}`} style={{ opacity: 0, transform: 'translateX(24px)' }}>
            <rect className="card-box" x={30} y={y} width={300} height={58} rx={12} fill="#0a0a0a" stroke="#242424" strokeWidth={1.2} />
            <g style={{ color: '#777' }} transform={`translate(56 ${y + 27})`}>
              <DriverAvatar />
            </g>
            <text x={78} y={y + 26} fill="#e8e8e8" fontFamily={MONO} fontSize={11} letterSpacing={1}>
              {d.name}
            </text>
            <text x={78} y={y + 42} fill="#555" fontFamily={MONO} fontSize={8} letterSpacing={2}>
              #{TAGS[d.kind]}
            </text>
            <g className="vehicle" style={{ color: '#999' }} transform={`translate(252 ${y + 28}) scale(1.05)`}>
              <VehicleBody kind={d.kind} />
            </g>
            <text className="eta" x={318} y={y + 34} textAnchor="end" fill="#888" fontFamily={MONO} fontSize={11}>
              {d.eta.toFixed(1)}
            </text>
          </g>
        )
      })}

      <text className="pick" x={30} y={SLOT_Y(0) - 10} fill={ACCENT} fontFamily={MONO} fontSize={9} letterSpacing={2} style={{ opacity: 0 }}>
        ✓ CHAGUO BORA
      </text>

      <g className="fare" style={{ opacity: 0 }}>
        <text x={30} y={SLOT_Y(4) + 96} fill="#666" fontFamily={MONO} fontSize={10} letterSpacing={3}>
          MAKADIRIO YA NAULI
        </text>
        <text className="fare-num" x={330} y={SLOT_Y(4) + 98} textAnchor="end" fill="#fff" fontFamily={MONO} fontSize={19} fontWeight={700}>
          TZS 0
        </text>
      </g>
    </svg>
  )
}
