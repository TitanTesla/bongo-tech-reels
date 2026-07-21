import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { sfx, type SfxName } from '../audio/sfx'
import { DEPOSIT, TZS } from '../data/db'
import { ACCENT, DANGER, MONO, type SceneProps } from './types'

export default function HookScene({ onReady }: SceneProps) {
  const ref = useRef<SVGSVGElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true, defaults: { ease: 'power2.out' } })
      const cue = (t: number, name: SfxName, p?: number) => tl.call(() => sfx.play(name, p), [], t)

      cue(0.3, 'ui')
      cue(0.8, 'cash')
      cue(2.6, 'blip', 620)
      cue(3.4, 'draw')
      cue(4.0, 'draw')
      cue(6.0, 'blip', 500)
      cue(7.4, 'thud')
      cue(8.6, 'thud')
      cue(9.2, 'lock')

      // 1 — you deposit, you check the balance
      tl.to('.phone', { autoAlpha: 1, duration: 0.4 }, 0.3)
      const o = { v: 0 }
      tl.to(
        o,
        {
          v: DEPOSIT,
          duration: 1.4,
          ease: 'power1.out',
          onUpdate() {
            const el = ref.current?.querySelector('.bal')
            if (el) el.textContent = TZS(Math.round(o.v))
          },
        },
        0.8,
      )

      // 2 — so where is it, actually?
      tl.to('.q', { autoAlpha: 1, y: 0, duration: 0.4 }, 2.6)
      tl.to('.arc', { strokeDashoffset: 0, duration: 0.7 }, 3.4)

      // 3 — the Tigo office draws itself in
      tl.to('.bld', { strokeDashoffset: 0, duration: 0.9, stagger: 0.12 }, 4.0)
      tl.to('.bld-label', { autoAlpha: 1, duration: 0.4 }, 5.4)

      // 4 — the imagined vault… which does not exist
      tl.to('.box', { autoAlpha: 1, duration: 0.4 }, 6.0)
      tl.to('.box-label', { autoAlpha: 1, duration: 0.35 }, 6.4)
      tl.to('.box-x', { strokeDashoffset: 0, duration: 0.4, stagger: 0.12 }, 7.4)
      tl.to(['.box', '.box-label'], { autoAlpha: 0.25, duration: 0.5 }, 8.0)

      // 5 — the point
      tl.to('.stamp', { autoAlpha: 1, y: 0, duration: 0.5 }, 8.6)
      tl.to('.stamp-sub', { autoAlpha: 1, duration: 0.4 }, 9.2)
      tl.to({}, { duration: 1.2 }, 9.6) // hold → 10.8s

      onReady(tl)
    }, ref)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <svg ref={ref} viewBox="0 0 360 500" className="h-full w-full">
      <text x={180} y={52} textAnchor="middle" fill={ACCENT} fontFamily={MONO} fontSize={10} letterSpacing={3}>
        TIGO PESA · BALANCE
      </text>

      {/* the phone with your balance */}
      <g className="phone" style={{ opacity: 0 }}>
        <rect x={38} y={118} width={104} height={168} rx={14} fill="none" stroke="#2a2a2a" strokeWidth={1.4} />
        <text x={90} y={158} textAnchor="middle" fill="#555" fontFamily={MONO} fontSize={7} letterSpacing={2}>
          BALANCE YAKO
        </text>
        <text className="bal" x={90} y={196} textAnchor="middle" fill={ACCENT} fontFamily={MONO} fontSize={13} fontWeight={700}>
          {TZS(0)}
        </text>
        <line x1={56} y1={214} x2={124} y2={214} stroke="#1c1c1c" strokeWidth={1} />
        <text x={90} y={236} textAnchor="middle" fill="#3a3a3a" fontFamily={MONO} fontSize={6.5} letterSpacing={1}>
          umeweka leo
        </text>
      </g>

      {/* the question */}
      <text className="q" x={180} y={96} textAnchor="middle" fill="#fff" fontSize={13} style={{ opacity: 0, transform: 'translateY(8px)' }}>
        hizi pesa ziko wapi?
      </text>
      <path
        className="arc"
        d="M 146 176 Q 180 150 212 178"
        fill="none"
        stroke="#2a2a2a"
        strokeWidth={1.1}
        strokeDasharray="4 5"
        pathLength={1}
        style={{ strokeDasharray: 1, strokeDashoffset: 1 }}
      />

      {/* the Tigo office */}
      <g fill="none" stroke="#3a3a3a" strokeWidth={1.4} strokeLinejoin="round">
        <path className="bld" d="M212 300 V186 h108 v114" pathLength={1} style={{ strokeDasharray: 1, strokeDashoffset: 1 }} />
        <path className="bld" d="M204 186 L266 158 L328 186" pathLength={1} style={{ strokeDasharray: 1, strokeDashoffset: 1 }} />
        <path className="bld" d="M252 300 v-38 h28 v38" pathLength={1} style={{ strokeDasharray: 1, strokeDashoffset: 1 }} />
      </g>
      <text className="bld-label" x={266} y={318} textAnchor="middle" fill="#666" fontFamily={MONO} fontSize={7} letterSpacing={2} style={{ opacity: 0 }}>
        OFISI YA TIGO
      </text>

      {/* the vault everyone pictures — dashed, because it's imaginary */}
      <g className="box" style={{ opacity: 0 }}>
        <rect x={238} y={202} width={56} height={40} rx={4} fill="none" stroke={DANGER} strokeWidth={1.3} strokeDasharray="4 4" />
        <circle cx={266} cy={222} r={6} fill="none" stroke={DANGER} strokeWidth={1.2} />
        <line x1={266} y1={222} x2={266} y2={216} stroke={DANGER} strokeWidth={1.2} strokeLinecap="round" />
      </g>
      <text className="box-label" x={266} y={260} textAnchor="middle" fill={DANGER} fontFamily={MONO} fontSize={6.5} letterSpacing={1} style={{ opacity: 0 }}>
        kisanduku cha pesa zako?
      </text>
      <g fill="none" stroke={DANGER} strokeWidth={2.4} strokeLinecap="round">
        <line className="box-x" x1={234} y1={198} x2={298} y2={246} pathLength={1} style={{ strokeDasharray: 1, strokeDashoffset: 1 }} />
        <line className="box-x" x1={298} y1={198} x2={234} y2={246} pathLength={1} style={{ strokeDasharray: 1, strokeDashoffset: 1 }} />
      </g>

      {/* the point */}
      <text className="stamp" x={180} y={392} textAnchor="middle" fill="#fff" fontSize={25} fontWeight={800} style={{ opacity: 0, transform: 'translateY(10px)' }}>
        HAKUNA KISANDUKU
      </text>
      <text className="stamp-sub" x={180} y={420} textAnchor="middle" fill={ACCENT} fontFamily={MONO} fontSize={10} letterSpacing={2} style={{ opacity: 0 }}>
        PESA ZAKO SI CASH ILIYOHIFADHIWA
      </text>
    </svg>
  )
}
