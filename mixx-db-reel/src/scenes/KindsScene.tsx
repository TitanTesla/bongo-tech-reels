import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { sfx, type SfxName } from '../audio/sfx'
import { DB_KINDS } from '../data/db'
import { ACCENT, BLUE, MONO, type SceneProps } from './types'

const CARD_Y = [214, 286, 358]

export default function KindsScene({ onReady }: SceneProps) {
  const ref = useRef<SVGSVGElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true, defaults: { ease: 'power2.out' } })
      const cue = (t: number, name: SfxName, p?: number) => tl.call(() => sfx.play(name, p), [], t)

      cue(0.3, 'ui')
      cue(0.8, 'draw')
      cue(4.4, 'blip', 560)
      cue(5.6, 'thud')
      cue(9.0, 'thud')
      cue(12.4, 'thud')
      cue(15.6, 'blip', 720)
      cue(17.2, 'ding')

      // 1 — the question a client actually asks
      tl.to('.bub', { autoAlpha: 1, y: 0, duration: 0.5 }, 0.3)
      tl.to('.qline', { autoAlpha: 1, duration: 0.4, stagger: 0.5 }, 0.9)
      tl.to('.who', { autoAlpha: 1, duration: 0.4 }, 3.0)
      // the "mjukuu wangu" beat — warm, and the reason the answer must stay plain
      tl.to('.mjukuu', { fill: ACCENT, duration: 0.4 }, 4.4)

      // 2 — the answer
      tl.to('.jibu', { autoAlpha: 1, y: 0, duration: 0.45 }, 5.0)

      // 3 — three kinds, one at a time
      DB_KINDS.forEach((_, i) => {
        const at = 5.6 + i * 3.4
        tl.fromTo(
          `.card-${i}`,
          { scale: 0.88, transformOrigin: '50% 50%' },
          { autoAlpha: 1, scale: 1, duration: 0.45, ease: 'back.out(1.6)' },
          at,
        )
        tl.to(`.glyph-${i}`, { autoAlpha: 1, duration: 0.4 }, at + 0.25)
        tl.to(`.prod-${i}`, { autoAlpha: 1, duration: 0.35 }, at + 0.55)
        tl.to(`.note-${i}`, { autoAlpha: 1, duration: 0.35 }, at + 0.95)
      })

      // 4 — the vector one is the "why now" — give it a beat
      tl.to('.ai', { autoAlpha: 1, duration: 0.4 }, 15.6)
      tl.to('.glyph-2 .pt', { autoAlpha: 1, duration: 0.25, stagger: 0.06 }, 15.8)

      // 5 — land it
      tl.to('.out', { autoAlpha: 1, y: 0, duration: 0.5 }, 17.2)
      tl.to({}, { duration: 1.6 }, 17.8) // hold → 19.4s

      onReady(tl)
    }, ref)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const glyph = (i: number, cy: number) => {
    const inner = [
      // document — a page of fields
      <g key="doc" fill="none" stroke={BLUE} strokeWidth={1.4} strokeLinejoin="round">
        <path d="M-11 -14 h15 l7 7 v21 h-22 z" />
        <path d="M4 -14 v7 h7" />
        <line x1={-6} y1={-1} x2={6} y2={-1} strokeLinecap="round" />
        <line x1={-6} y1={5} x2={3} y2={5} strokeLinecap="round" />
      </g>,
      // relational — a table with related rows
      <g key="rel" fill="none" stroke={BLUE} strokeWidth={1.4}>
        <rect x={-13} y={-12} width={26} height={24} rx={2} />
        <line x1={-13} y1={-4} x2={13} y2={-4} />
        <line x1={-13} y1={4} x2={13} y2={4} />
        <line x1={-1} y1={-12} x2={-1} y2={12} />
      </g>,
      // vector — points in space, the ones AI reasons over
      <g key="vec">
        <g fill="none" stroke={BLUE} strokeWidth={1.1} opacity={0.5}>
          <line x1={-9} y1={-7} x2={2} y2={-2} />
          <line x1={2} y1={-2} x2={10} y2={-9} />
          <line x1={2} y1={-2} x2={-4} y2={8} />
          <line x1={2} y1={-2} x2={11} y2={6} />
        </g>
        {[
          [-9, -7],
          [10, -9],
          [-4, 8],
          [11, 6],
          [2, -2],
        ].map(([px, py], k) => (
          <circle key={k} className="pt" cx={px} cy={py} r={2.4} fill={BLUE} style={{ opacity: 0 }} />
        ))}
      </g>,
    ][i]
    return (
      <g className={`glyph-${i}`} style={{ opacity: 0 }}>
        <g transform={`translate(66 ${cy})`}>{inner}</g>
      </g>
    )
  }

  return (
    <svg ref={ref} viewBox="0 0 360 500" className="h-full w-full">
      {/* the question, in the client's own voice */}
      <g className="bub" style={{ opacity: 0, transform: 'translateY(10px)' }}>
        <rect x={30} y={58} width={300} height={80} rx={14} fill="none" stroke="#3a3a3a" strokeWidth={1.4} />
        <path d="M56 138 l -4 15 l 20 -15" fill="none" stroke="#3a3a3a" strokeWidth={1.4} strokeLinejoin="round" />
      </g>
      <text className="qline" x={180} y={84} textAnchor="middle" fill="#ddd" fontSize={11.5} style={{ opacity: 0 }}>
        Taarifa za mauzo au kodi
      </text>
      <text className="qline" x={180} y={104} textAnchor="middle" fill="#ddd" fontSize={11.5} style={{ opacity: 0 }}>
        ya nyumba zinahifadhiwa
      </text>
      <text className="qline" x={180} y={124} textAnchor="middle" fill="#ddd" fontSize={11.5} style={{ opacity: 0 }}>
        wapi <tspan className="mjukuu" fill="#ddd">mjukuu wangu?</tspan>
      </text>
      <text className="who" x={180} y={170} textAnchor="middle" fill="#555" fontFamily={MONO} fontSize={7.5} letterSpacing={1.5} style={{ opacity: 0 }}>
        — mteja wa app
      </text>

      <text className="jibu" x={30} y={198} fill="#fff" fontSize={12} fontWeight={800} letterSpacing={2} style={{ opacity: 0, transform: 'translateY(8px)' }}>
        JIBU: <tspan fill={BLUE}>DATABASE</tspan> — lakini ya aina gani?
      </text>

      {/* the three kinds */}
      {DB_KINDS.map((k, i) => (
        <g key={k.kind}>
          <g className={`card-${i}`} style={{ opacity: 0 }}>
            <rect x={30} y={CARD_Y[i] - 26} width={300} height={56} rx={8} fill="none" stroke="#242424" strokeWidth={1.3} />
          </g>
          {glyph(i, CARD_Y[i])}
          <text className={`prod-${i}`} x={100} y={CARD_Y[i] - 4} fill={ACCENT} fontFamily={MONO} fontSize={12} fontWeight={700} style={{ opacity: 0 }}>
            {k.product}
          </text>
          <text className={`prod-${i}`} x={100} y={CARD_Y[i] + 10} fill="#777" fontFamily={MONO} fontSize={7} letterSpacing={2} style={{ opacity: 0 }}>
            {k.kind} DATABASE
          </text>
          <text className={`note-${i}`} x={318} y={CARD_Y[i] + 4} textAnchor="end" fill="#555" fontFamily={MONO} fontSize={7.5} style={{ opacity: 0 }}>
            {k.note}
          </text>
        </g>
      ))}

      <text className="ai" x={180} y={410} textAnchor="middle" fill={BLUE} fontFamily={MONO} fontSize={8} letterSpacing={1} style={{ opacity: 0 }}>
        ndio inayosaidia AI kuelewa unachouliza
      </text>

      <text className="out" x={180} y={456} textAnchor="middle" fill="#fff" fontSize={15} fontWeight={800} style={{ opacity: 0, transform: 'translateY(10px)' }}>
        ZOTE NI DATABASE — KAZI TOFAUTI
      </text>
    </svg>
  )
}
