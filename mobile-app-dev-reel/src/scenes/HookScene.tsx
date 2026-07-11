import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { sfx, type SfxName } from '../audio/sfx'
import { CONTACT, MSG_HOOK } from '../data/chat'
import { ACCENT, DANGER, MONO, type SceneProps } from './types'

export default function HookScene({ onReady }: SceneProps) {
  const ref = useRef<SVGSVGElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true, defaults: { ease: 'power2.out' } })
      const cue = (t: number, name: SfxName, p?: number) => tl.call(() => sfx.play(name, p), [], t)

      cue(0.2, 'ui')
      cue(1.0, 'blip', 700)
      cue(2.6, 'tap')
      cue(4.6, 'draw')
      cue(5.1, 'thud')
      cue(6.2, 'thud')
      cue(6.7, 'lock')

      // 1 — the phone
      tl.to('.hphone', { autoAlpha: 1, duration: 0.4 }, 0.2)

      // 2 — airplane mode flips ON, signal dies
      tl.to('.knob', { attr: { cx: 141 }, fill: ACCENT, duration: 0.3 }, 1.0)
      tl.to('.plane-p', { stroke: ACCENT, duration: 0.3 }, 1.0)
      tl.to('.sig-bar', { autoAlpha: 0.12, duration: 0.15, stagger: { each: 0.15, from: 'end' } }, 1.3)
      cue(1.45, 'blip', 550)
      cue(1.6, 'blip', 420)
      cue(1.75, 'blip', 300)
      tl.to('.sig-x', { autoAlpha: 1, duration: 0.2 }, 1.9)

      // 3 — type, send… the bubble lands with a clock, not a tick
      tl.to('.send', { scale: 1.3, transformOrigin: '50% 50%', duration: 0.12, yoyo: true, repeat: 1 }, 2.6)
      tl.to('.bub', { autoAlpha: 1, y: 0, duration: 0.4 }, 2.8)
      cue(2.9, 'ui')
      tl.to('.clock', { autoAlpha: 1, duration: 0.25 }, 3.1)
      tl.to('.clock-hand', { rotation: 1080, duration: 4.2, ease: 'none', svgOrigin: '234 266' }, 3.2)

      // 4 — no network… so where did it go?
      tl.to('.arc', { autoAlpha: 1, duration: 0.5 }, 4.6)
      tl.fromTo('.qmark', { scale: 0.5, transformOrigin: '50% 50%' }, { autoAlpha: 1, scale: 1, duration: 0.35, ease: 'back.out(2)' }, 5.1)
      tl.to('.q', { autoAlpha: 1, y: 0, duration: 0.4 }, 5.2)

      // 5 — title card
      tl.to('.title', { autoAlpha: 1, y: 0, duration: 0.5 }, 6.2)
      tl.to('.title-sub', { autoAlpha: 1, duration: 0.4 }, 6.7)
      tl.to({}, { duration: 0.5 }, 7.1) // hold

      onReady(tl)
    }, ref)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <svg ref={ref} viewBox="0 0 360 500" className="h-full w-full">
      <text x={180} y={56} textAnchor="middle" fill={ACCENT} fontFamily={MONO} fontSize={10} letterSpacing={3}>
        WHATSAPP · TUMA MESSAGE
      </text>

      {/* the phone */}
      <g className="hphone" style={{ opacity: 0 }}>
        <rect x={105} y={86} width={150} height={270} rx={18} fill="none" stroke="#2a2a2a" strokeWidth={1.4} />

        {/* status row — airplane toggle + signal */}
        <rect x={118} y={98} width={30} height={14} rx={7} fill="none" stroke="#444" strokeWidth={1.2} />
        <circle className="knob" cx={125} cy={105} r={5} fill="#666" />
        <g transform="translate(161 104) scale(0.6)">
          <path
            className="plane-p"
            d="M0 -9 C1.5 -9 1.6 -6.5 1.6 -5 L1.6 -2.6 L9.5 2.2 L9.5 4.4 L1.6 1.8 L1.6 5.2 L4.2 7.6 L4.2 9.2 L0 8 L-4.2 9.2 L-4.2 7.6 L-1.6 5.2 L-1.6 1.8 L-9.5 4.4 L-9.5 2.2 L-1.6 -2.6 L-1.6 -5 C-1.6 -6.5 -1.5 -9 0 -9 Z"
            fill="none"
            stroke="#666"
            strokeWidth={1.6}
            strokeLinejoin="round"
          />
        </g>
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} className="sig-bar" x={206 + i * 8} y={104 - i * 4} width={5} height={8 + i * 4} rx={1} fill="#888" />
        ))}
        <text className="sig-x" x={240} y={112} fill={DANGER} fontSize={12} fontWeight={800} style={{ opacity: 0 }}>
          ✕
        </text>

        {/* chat header */}
        <text x={180} y={136} textAnchor="middle" fill="#888" fontFamily={MONO} fontSize={9} letterSpacing={2}>
          {CONTACT}
        </text>
        <line x1={118} y1={146} x2={242} y2={146} stroke="#1c1c1c" strokeWidth={1} />

        {/* input bar + send */}
        <rect x={118} y={322} width={98} height={20} rx={10} fill="none" stroke="#2a2a2a" strokeWidth={1.2} />
        {[0, 1, 2].map((i) => (
          <circle key={i} cx={130 + i * 8} cy={332} r={1.5} fill="#555" />
        ))}
        <g className="send">
          <circle cx={232} cy={332} r={9} fill="none" stroke={ACCENT} strokeWidth={1.3} />
          <path d="M228.5 334.5 L237 330 L231.5 336 L231 333.5 Z" fill="none" stroke={ACCENT} strokeWidth={0.9} strokeLinejoin="round" />
        </g>
      </g>

      {/* the message — stuck with a spinning clock */}
      <g className="bub" style={{ opacity: 0, transform: 'translateY(14px)' }}>
        <g transform="translate(152 240)">
          <rect width={90} height={30} rx={9} fill="none" stroke={ACCENT} strokeWidth={1.5} />
          <text x={40} y={19} textAnchor="middle" fill="#fff" fontSize={10}>
            {MSG_HOOK}
          </text>
        </g>
      </g>
      <g className="clock" style={{ opacity: 0 }}>
        <circle cx={234} cy={266} r={5} fill="#000" stroke="#999" strokeWidth={1.1} />
        <line className="clock-hand" x1={234} y1={266} x2={234} y2={262.6} stroke="#999" strokeWidth={1.1} strokeLinecap="round" />
      </g>

      {/* imeenda wapi? */}
      <path className="arc" d="M 250 250 Q 312 236 314 196" fill="none" stroke="#2a2a2a" strokeWidth={1} strokeDasharray="4 5" style={{ opacity: 0 }} />
      <text className="qmark" x={314} y={158} textAnchor="middle" fill={ACCENT} fontSize={26} fontWeight={800} style={{ opacity: 0 }}>
        ?
      </text>
      <text className="q" x={305} y={182} textAnchor="middle" fill="#fff" fontSize={11} fontWeight={700} style={{ opacity: 0, transform: 'translateY(8px)' }}>
        IMEENDA WAPI?
      </text>

      {/* title card */}
      <text className="title" x={180} y={420} textAnchor="middle" fill="#fff" fontSize={22} fontWeight={800} style={{ opacity: 0, transform: 'translateY(10px)' }}>
        SIRI 4 ZA MOBILE APPS
      </text>
      <text className="title-sub" x={180} y={446} textAnchor="middle" fill={ACCENT} fontFamily={MONO} fontSize={10} letterSpacing={2} style={{ opacity: 0 }}>
        APP HAIITAJI NETWORK
      </text>
    </svg>
  )
}
