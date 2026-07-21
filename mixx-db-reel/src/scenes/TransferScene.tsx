import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { sfx, type SfxName } from '../audio/sfx'
import { FATUMA, FATUMA_AFTER, TRANSFER, TZS, YOU, YOU_AFTER } from '../data/db'
import { ACCENT, BLUE, DANGER, MONO, type SceneProps } from './types'

const TOTAL = YOU.start + FATUMA.start

export default function TransferScene({ onReady }: SceneProps) {
  const ref = useRef<SVGSVGElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true, defaults: { ease: 'power2.out' } })
      const cue = (t: number, name: SfxName, p?: number) => tl.call(() => sfx.play(name, p), [], t)
      const roll = (sel: string, from: number, to: number, at: number) => {
        const o = { v: from }
        tl.to(
          o,
          {
            v: to,
            duration: 1.0,
            ease: 'power1.inOut',
            onUpdate() {
              const el = ref.current?.querySelector(sel)
              if (el) el.textContent = TZS(Math.round(o.v))
            },
          },
          at,
        )
      }

      cue(0.3, 'draw')
      cue(1.6, 'ui')
      cue(3.2, 'tap')
      cue(4.4, 'cash')
      cue(7.0, 'blip', 480)
      cue(7.8, 'thud')
      cue(9.6, 'ui')
      cue(10.4, 'ding')
      cue(12.2, 'thud')
      cue(12.8, 'lock')

      // 1 — two tables, two starting numbers
      tl.to('.tbl', { autoAlpha: 1, duration: 0.5, stagger: 0.18 }, 0.3)
      tl.to('.val', { autoAlpha: 1, duration: 0.4, stagger: 0.15 }, 1.6)

      // 2 — you send 2,000
      tl.to('.act', { autoAlpha: 1, y: 0, duration: 0.4 }, 3.2)

      // 3 — both rows change at the same instant — that simultaneity is the point
      roll('.bal-l', YOU.start, YOU_AFTER, 4.4)
      roll('.bal-r', FATUMA.start, FATUMA_AFTER, 4.4)
      tl.to('.bal-l', { fill: DANGER, duration: 0.25 }, 4.4).to('.bal-l', { fill: '#fff', duration: 0.6 }, 5.8)
      tl.to('.bal-r', { fill: BLUE, duration: 0.25 }, 4.4).to('.bal-r', { fill: '#fff', duration: 0.6 }, 5.8)
      tl.to('.delta-l', { autoAlpha: 1, duration: 0.3 }, 4.6)
      tl.to('.delta-r', { autoAlpha: 1, duration: 0.3 }, 4.6)

      // 4 — and nothing crossed the gap between them
      tl.to('.gap', { autoAlpha: 1, duration: 0.4 }, 7.0)
      tl.to('.gap-x', { strokeDashoffset: 0, duration: 0.35, stagger: 0.1 }, 7.8)
      tl.to('.gap-label', { autoAlpha: 1, duration: 0.35 }, 8.2)

      // 5 — the proof: the total was never touched
      tl.to('.sum', { autoAlpha: 1, y: 0, duration: 0.45 }, 9.6)
      tl.to('.sum-val', { scale: 1.14, transformOrigin: '50% 50%', duration: 0.3, yoyo: true, repeat: 1 }, 10.4)
      tl.to('.sum-note', { autoAlpha: 1, duration: 0.35 }, 10.9)

      // 6 — the line
      tl.to('.stamp', { autoAlpha: 1, y: 0, duration: 0.5 }, 12.2)
      tl.to('.stamp-sub', { autoAlpha: 1, duration: 0.4 }, 12.8)
      tl.to({}, { duration: 1.4 }, 13.2) // hold → 14.6s

      onReady(tl)
    }, ref)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const table = (cls: string, x: number, name: string, start: number, valCls: string) => (
    <g className={`tbl ${cls}`} style={{ opacity: 0 }}>
      <rect x={x} y={150} width={130} height={92} rx={7} fill="none" stroke="#2a2a2a" strokeWidth={1.3} />
      <line x1={x} y1={178} x2={x + 130} y2={178} stroke="#1c1c1c" strokeWidth={1} />
      <text x={x + 12} y={169} fill={BLUE} fontFamily={MONO} fontSize={8.5} letterSpacing={1}>
        {name}
      </text>
      <text x={x + 12} y={207} fill="#555" fontFamily={MONO} fontSize={7.5}>
        balance
      </text>
      <text className={`val ${valCls}`} x={x + 118} y={224} textAnchor="end" fill="#fff" fontFamily={MONO} fontSize={12} fontWeight={700} style={{ opacity: 0 }}>
        {TZS(start)}
      </text>
    </g>
  )

  return (
    <svg ref={ref} viewBox="0 0 360 500" className="h-full w-full">
      <text x={180} y={52} textAnchor="middle" fill="#888" fontFamily={MONO} fontSize={10} letterSpacing={3}>
        TABLE MBILI · UPDATE MOJA
      </text>

      <text className="act" x={180} y={106} textAnchor="middle" fill={ACCENT} fontSize={14} fontWeight={700} style={{ opacity: 0, transform: 'translateY(8px)' }}>
        unatuma {TZS(TRANSFER)} kwa {FATUMA.name.toLowerCase()}
      </text>

      {table('t-l', 20, YOU.name.toLowerCase(), YOU.start, 'bal-l')}
      {table('t-r', 210, FATUMA.name.toLowerCase(), FATUMA.start, 'bal-r')}

      {/* the deltas, side by side and simultaneous */}
      <text className="delta-l" x={85} y={260} textAnchor="middle" fill={DANGER} fontFamily={MONO} fontSize={9.5} fontWeight={700} style={{ opacity: 0 }}>
        − {TRANSFER.toLocaleString('en-US')}
      </text>
      <text className="delta-r" x={275} y={260} textAnchor="middle" fill={BLUE} fontFamily={MONO} fontSize={9.5} fontWeight={700} style={{ opacity: 0 }}>
        + {TRANSFER.toLocaleString('en-US')}
      </text>

      {/* the gap nothing ever crosses */}
      <g className="gap" style={{ opacity: 0 }}>
        <path d="M 156 196 L 204 196" fill="none" stroke="#333" strokeWidth={1.2} strokeDasharray="3 4" />
        <path d="M 198 191 L 204 196 L 198 201" fill="none" stroke="#333" strokeWidth={1.2} strokeLinejoin="round" />
      </g>
      <g fill="none" stroke={DANGER} strokeWidth={2.2} strokeLinecap="round">
        <line className="gap-x" x1={166} y1={186} x2={194} y2={206} pathLength={1} style={{ strokeDasharray: 1, strokeDashoffset: 1 }} />
        <line className="gap-x" x1={194} y1={186} x2={166} y2={206} pathLength={1} style={{ strokeDasharray: 1, strokeDashoffset: 1 }} />
      </g>
      <text className="gap-label" x={180} y={296} textAnchor="middle" fill={DANGER} fontFamily={MONO} fontSize={7.5} letterSpacing={1} style={{ opacity: 0 }}>
        hakuna kilichopita hapa
      </text>

      {/* conservation — the whole system still holds exactly what it held */}
      <g className="sum" style={{ opacity: 0, transform: 'translateY(10px)' }}>
        <text x={180} y={340} textAnchor="middle" fill="#666" fontFamily={MONO} fontSize={8} letterSpacing={2}>
          JUMLA YA WOTE
        </text>
        <text className="sum-val" x={180} y={366} textAnchor="middle" fill={ACCENT} fontFamily={MONO} fontSize={17} fontWeight={700}>
          {TZS(TOTAL)}
        </text>
      </g>
      <text className="sum-note" x={180} y={388} textAnchor="middle" fill="#555" fontFamily={MONO} fontSize={7} letterSpacing={1} style={{ opacity: 0 }}>
        kabla na baada — haijabadilika
      </text>

      <text className="stamp" x={180} y={434} textAnchor="middle" fill="#fff" fontSize={19} fontWeight={800} style={{ opacity: 0, transform: 'translateY(10px)' }}>
        NI NAMBA TU ZIMEBADILIKA
      </text>
      <text className="stamp-sub" x={180} y={458} textAnchor="middle" fill="#888" fontFamily={MONO} fontSize={8} letterSpacing={1.5} style={{ opacity: 0 }}>
        HAKUNA PESA ILIYOINGIA WALA KUTOKA
      </text>
    </svg>
  )
}
