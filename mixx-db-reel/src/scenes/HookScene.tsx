import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import { sfx, type SfxName } from '../audio/sfx'
import { FRANK, NEEMA, TRANSFER, TZS } from '../data/ledger'
import { ACCENT, BLUE, DANGER, MONO, type SceneProps } from './types'

gsap.registerPlugin(MotionPathPlugin)

export default function HookScene({ onReady }: SceneProps) {
  const ref = useRef<SVGSVGElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true, defaults: { ease: 'power2.out' } })
      const cue = (t: number, name: SfxName, p?: number) => tl.call(() => sfx.play(name, p), [], t)
      const roll = (sel: string, from: number, to: number, at: number, dur = 0.9) => {
        const o = { v: from }
        tl.to(
          o,
          {
            v: to,
            duration: dur,
            ease: 'power1.out',
            onUpdate() {
              const el = ref.current?.querySelector(sel)
              if (el) el.textContent = TZS(Math.round(o.v))
            },
          },
          at,
        )
      }

      cue(0.2, 'ui')
      cue(1.2, 'tap')
      cue(1.5, 'whoosh')
      cue(3.3, 'ping')
      cue(3.6, 'thud')
      cue(4.0, 'cash')
      cue(4.5, 'blip', 620)
      cue(5.6, 'thud')
      cue(6.1, 'lock')

      // 1 — the two phones
      tl.to('.phone', { autoAlpha: 1, duration: 0.4, stagger: 0.15 }, 0.2)

      // 2 — the myth: "pesa ina-safiri??"
      tl.to('.myth', { autoAlpha: 1, y: 0, duration: 0.4 }, 0.9)

      // 3 — the orb flies along the arc…
      tl.to('.orb', { autoAlpha: 1, duration: 0.25 }, 1.2).to(
        '.orb',
        {
          motionPath: { path: '.arc', align: '.arc', alignOrigin: [0.5, 0.5] },
          duration: 1.9,
          ease: 'power1.inOut',
        },
        1.4,
      )

      // 4 — …and dissolves mid-air. Nothing travels.
      tl.to('.orb', { autoAlpha: 0, scale: 1.8, transformOrigin: '50% 50%', duration: 0.45 }, 3.3)
        .to('.myth-x', { strokeDashoffset: 0, duration: 0.35 }, 3.6)
        .to('.myth', { autoAlpha: 0.35, duration: 0.4 }, 3.7)

      // 5 — the truth: two rows update
      tl.to('.row-l', { autoAlpha: 1, y: 0, duration: 0.4 }, 3.9)
        .to('.row-r', { autoAlpha: 1, y: 0, duration: 0.4 }, 4.15)
      roll('.bal-l', FRANK.start, FRANK.start - TRANSFER, 4.0)
      roll('.bal-r', NEEMA.start, NEEMA.start + TRANSFER, 4.25)
      tl.to('.bal-l', { fill: DANGER, duration: 0.2 }, 4.0)
        .to('.bal-l', { fill: '#fff', duration: 0.5 }, 5.0)
        .to('.bal-r', { fill: BLUE, duration: 0.2 }, 4.25)
        .to('.bal-r', { fill: '#fff', duration: 0.5 }, 5.2)

      // 6 — title card
      tl.to('.title', { autoAlpha: 1, y: 0, duration: 0.5 }, 5.6)
        .to('.title-sub', { autoAlpha: 1, duration: 0.4 }, 6.1)
        .to({}, { duration: 1.0 }) // hold

      onReady(tl)
    }, ref)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <svg ref={ref} viewBox="0 0 360 500" className="h-full w-full">
      <text x={180} y={64} textAnchor="middle" fill={BLUE} fontFamily={MONO} fontSize={10} letterSpacing={3}>
        MIXX BY YAS · TUMA PESA
      </text>

      {/* the myth */}
      <g className="myth" style={{ opacity: 0, transform: 'translateY(8px)' }}>
        <text x={168} y={118} textAnchor="middle" fill="#fff" fontSize={14}>
          pesa ina-safiri??
        </text>
        {/* hand-drawn paper plane instead of an emoji */}
        <g transform="translate(240 105)">
          <path d="M0 7 L20 0 L9 14 L7.5 8.5 Z" fill="none" stroke="#fff" strokeWidth={1.2} strokeLinejoin="round" />
          <path d="M20 0 L7.5 8.5" fill="none" stroke="#fff" strokeWidth={1.2} />
        </g>
        <line
          className="myth-x"
          x1={98}
          y1={113}
          x2={264}
          y2={113}
          stroke={DANGER}
          strokeWidth={2}
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1}
        />
      </g>

      {/* phones */}
      <g className="phone" style={{ opacity: 0 }}>
        <rect x={30} y={150} width={115} height={185} rx={16} fill="none" stroke="#2a2a2a" strokeWidth={1.4} />
        <text x={87} y={185} textAnchor="middle" fill="#888" fontFamily={MONO} fontSize={10} letterSpacing={2}>
          {FRANK.name}
        </text>
        <text className="bal-l" x={87} y={248} textAnchor="middle" fill="#fff" fontSize={15} fontWeight={700}>
          {TZS(FRANK.start)}
        </text>
        <text x={87} y={268} textAnchor="middle" fill="#444" fontFamily={MONO} fontSize={7} letterSpacing={2}>
          MIXX BALANCE
        </text>
      </g>
      <g className="phone" style={{ opacity: 0 }}>
        <rect x={215} y={150} width={115} height={185} rx={16} fill="none" stroke="#2a2a2a" strokeWidth={1.4} />
        <text x={272} y={185} textAnchor="middle" fill="#888" fontFamily={MONO} fontSize={10} letterSpacing={2}>
          {NEEMA.name}
        </text>
        <text className="bal-r" x={272} y={248} textAnchor="middle" fill="#fff" fontSize={15} fontWeight={700}>
          {TZS(NEEMA.start)}
        </text>
        <text x={272} y={268} textAnchor="middle" fill="#444" fontFamily={MONO} fontSize={7} letterSpacing={2}>
          MIXX BALANCE
        </text>
      </g>

      {/* flight arc */}
      <path className="arc" d="M 145 230 Q 180 150 215 230" fill="none" stroke="#2a2a2a" strokeWidth={1} strokeDasharray="4 5" />

      {/* the TZS 50,000 orb */}
      <g className="orb" style={{ opacity: 0 }} transform="translate(145 230)">
        <circle r={15} fill="#000" stroke={ACCENT} strokeWidth={1.5} />
        <text y={4} textAnchor="middle" fill={ACCENT} fontFamily={MONO} fontSize={10} fontWeight={700}>
          50K
        </text>
      </g>

      {/* the truth — two rows update */}
      <text className="row-l" x={87} y={368} textAnchor="middle" fill={DANGER} fontFamily={MONO} fontSize={9} style={{ opacity: 0, transform: 'translateY(8px)' }}>
        UPDATE frank −50,000
      </text>
      <text className="row-r" x={272} y={368} textAnchor="middle" fill={BLUE} fontFamily={MONO} fontSize={9} style={{ opacity: 0, transform: 'translateY(8px)' }}>
        UPDATE neema +50,000
      </text>

      {/* title card */}
      <text className="title" x={180} y={428} textAnchor="middle" fill="#fff" fontSize={24} fontWeight={800} style={{ opacity: 0, transform: 'translateY(10px)' }}>
        SIRI 4 ZA DATABASE
      </text>
      <text className="title-sub" x={180} y={452} textAnchor="middle" fill={ACCENT} fontFamily={MONO} fontSize={10} letterSpacing={2} style={{ opacity: 0 }}>
        HAKUNA PESA INAYOSAFIRI
      </text>
    </svg>
  )
}
