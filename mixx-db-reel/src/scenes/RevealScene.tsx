import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import { sfx, type SfxName } from '../audio/sfx'
import { ACCENT, BLUE, DANGER, MONO, type SceneProps } from './types'

gsap.registerPlugin(MotionPathPlugin)

export default function RevealScene({ onReady }: SceneProps) {
  const ref = useRef<SVGSVGElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true, defaults: { ease: 'power2.out' } })
      const cue = (t: number, name: SfxName, p?: number) => tl.call(() => sfx.play(name, p), [], t)

      cue(0.3, 'ui')
      cue(1.2, 'whoosh')
      cue(3.1, 'ping')
      cue(3.5, 'thud')
      cue(4.6, 'thud')
      cue(6.2, 'ui')
      cue(6.6, 'blip', 420)
      cue(6.9, 'blip', 760)
      cue(9.0, 'lock')

      // 1 — two accounts, and the thing everyone assumes
      tl.to('.acct', { autoAlpha: 1, duration: 0.4, stagger: 0.15 }, 0.3)
      tl.to('.myth', { autoAlpha: 1, y: 0, duration: 0.4 }, 0.8)

      // 2 — the money "flies"…
      tl.to('.orb', { autoAlpha: 1, duration: 0.25 }, 1.2)
      tl.to(
        '.orb',
        { motionPath: { path: '.arc', align: '.arc', alignOrigin: [0.5, 0.5] }, duration: 1.7, ease: 'power1.inOut' },
        1.4,
      )

      // 3 — …except it doesn't. Strike the myth.
      tl.to('.orb', { autoAlpha: 0, scale: 1.9, transformOrigin: '50% 50%', duration: 0.45 }, 3.1)
      tl.to('.myth-x', { strokeDashoffset: 0, duration: 0.4 }, 3.4)
      tl.to('.myth', { autoAlpha: 0.3, duration: 0.4 }, 3.6)
      tl.to('.nope', { autoAlpha: 1, y: 0, duration: 0.5 }, 4.6)
      tl.to('.nope', { autoAlpha: 0, duration: 0.4 }, 6.0)

      // 4 — what actually happens: two numbers move, in place
      tl.to('.field', { autoAlpha: 1, duration: 0.35, stagger: 0.12 }, 6.2)
      tl.fromTo('.dn', { y: -6 }, { autoAlpha: 1, y: 0, duration: 0.4 }, 6.6)
      tl.fromTo('.up', { y: 6 }, { autoAlpha: 1, y: 0, duration: 0.4 }, 6.9)
      tl.to('.f-l', { stroke: DANGER, duration: 0.25 }, 6.6)
      tl.to('.f-r', { stroke: BLUE, duration: 0.25 }, 6.9)
      // they pulse together — same instant, no travel between them
      tl.to(['.dn', '.up'], { scale: 1.15, transformOrigin: '50% 50%', duration: 0.25, yoyo: true, repeat: 1 }, 7.6)

      // 5 — name the mechanism
      tl.to('.out', { autoAlpha: 1, y: 0, duration: 0.5 }, 9.0)
      tl.to('.out-sub', { autoAlpha: 1, duration: 0.4 }, 9.6)
      tl.to({}, { duration: 1.2 }, 10.0) // hold → 11.2s

      onReady(tl)
    }, ref)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const account = (cls: string, x: number, label: string) => (
    <g className={`acct ${cls}`} style={{ opacity: 0 }}>
      <rect x={x} y={168} width={104} height={128} rx={14} fill="none" stroke="#2a2a2a" strokeWidth={1.4} />
      <text x={x + 52} y={194} textAnchor="middle" fill="#777" fontFamily={MONO} fontSize={7.5} letterSpacing={1.5}>
        {label}
      </text>
      <line x1={x + 18} y1={206} x2={x + 86} y2={206} stroke="#1c1c1c" strokeWidth={1} />
    </g>
  )

  return (
    <svg ref={ref} viewBox="0 0 360 500" className="h-full w-full">
      <text x={180} y={52} textAnchor="middle" fill="#888" fontFamily={MONO} fontSize={10} letterSpacing={3}>
        UNAPOTUMA PESA
      </text>

      {/* the myth */}
      <g className="myth" style={{ opacity: 0, transform: 'translateY(8px)' }}>
        <text x={180} y={96} textAnchor="middle" fill="#fff" fontSize={13}>
          pesa inasafiri kwenda kwake?
        </text>
        <line
          className="myth-x"
          x1={78}
          y1={91}
          x2={282}
          y2={91}
          stroke={DANGER}
          strokeWidth={2}
          pathLength={1}
          style={{ strokeDasharray: 1, strokeDashoffset: 1 }}
        />
      </g>

      {/* the two accounts */}
      {account('a-l', 30, 'ACCOUNT YAKO')}
      {account('a-r', 226, 'ACCOUNT YAKE')}

      {/* the flight that never happens */}
      <path className="arc" d="M 140 232 Q 180 176 222 232" fill="none" stroke="#222" strokeWidth={1} strokeDasharray="4 5" />
      <g className="orb" style={{ opacity: 0 }} transform="translate(140 232)">
        <circle r={15} fill="#000" stroke={ACCENT} strokeWidth={1.5} />
        <text y={4} textAnchor="middle" fill={ACCENT} fontFamily={MONO} fontSize={9} fontWeight={700}>
          PESA
        </text>
      </g>

      <text className="nope" x={180} y={240} textAnchor="middle" fill={DANGER} fontSize={19} fontWeight={800} style={{ opacity: 0, transform: 'translateY(10px)' }}>
        HAKUNA KINACHOSAFIRI
      </text>

      {/* what really moves: a number, in place, on each side */}
      <g className="field" style={{ opacity: 0 }}>
        <rect className="f-l" x={48} y={222} width={68} height={30} rx={5} fill="none" stroke="#2a2a2a" strokeWidth={1.3} />
        <text x={82} y={266} textAnchor="middle" fill="#555" fontFamily={MONO} fontSize={6.5} letterSpacing={1}>
          namba
        </text>
      </g>
      <g className="field" style={{ opacity: 0 }}>
        <rect className="f-r" x={244} y={222} width={68} height={30} rx={5} fill="none" stroke="#2a2a2a" strokeWidth={1.3} />
        <text x={278} y={266} textAnchor="middle" fill="#555" fontFamily={MONO} fontSize={6.5} letterSpacing={1}>
          namba
        </text>
      </g>
      <g className="dn" style={{ opacity: 0 }}>
        <text x={82} y={243} textAnchor="middle" fill={DANGER} fontFamily={MONO} fontSize={15} fontWeight={700}>
          −
        </text>
      </g>
      <g className="up" style={{ opacity: 0 }}>
        <text x={278} y={243} textAnchor="middle" fill={BLUE} fontFamily={MONO} fontSize={15} fontWeight={700}>
          +
        </text>
      </g>

      {/* the mechanism, named */}
      <text className="out" x={180} y={370} textAnchor="middle" fill="#fff" fontSize={17} fontWeight={800} style={{ opacity: 0, transform: 'translateY(10px)' }}>
        DATABASE INA-<tspan fill={BLUE}>UPDATE NAMBA</tspan>
      </text>
      <text className="out-sub" x={180} y={398} textAnchor="middle" fill="#888" fontFamily={MONO} fontSize={9} letterSpacing={1.5} style={{ opacity: 0 }}>
        KWENYE ACCOUNT MBILI TOFAUTI
      </text>
    </svg>
  )
}
