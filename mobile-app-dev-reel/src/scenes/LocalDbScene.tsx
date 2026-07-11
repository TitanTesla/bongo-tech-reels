import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { sfx, type SfxName } from '../audio/sfx'
import { CHAT_LIST } from '../data/chat'
import { ACCENT, DANGER, MONO, type SceneProps } from './types'

const BILA_Y = [150, 192, 234]
const NA_Y = [150, 192, 234]

export default function LocalDbScene({ onReady }: SceneProps) {
  const ref = useRef<SVGSVGElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true, defaults: { ease: 'power2.out' } })
      const cue = (t: number, name: SfxName, p?: number) => tl.call(() => sfx.play(name, p), [], t)

      cue(0.3, 'ui')
      cue(0.9, 'draw')
      cue(1.8, 'pops')
      cue(3.4, 'thud')
      cue(6.4, 'whoosh')
      cue(6.9, 'blip', 420)
      cue(8.6, 'blip', 300)
      cue(9.4, 'lock')
      cue(9.6, 'pops')
      cue(10.6, 'blip', 740)

      /* ---------- PHASE A · X-RAY YA SIMU ---------- */
      tl.to('.xphone', { autoAlpha: 1, duration: 0.4 }, 0.3)
      tl.to('.cyl', { strokeDashoffset: 0, duration: 0.7, stagger: 0.12 }, 0.9)
      tl.to('.crow', { autoAlpha: 1, y: 0, duration: 0.35, stagger: 0.18 }, 1.8)
      tl.to('.crows', { y: -12, duration: 3.2, ease: 'none' }, 2.6)
      tl.to('.humu', { autoAlpha: 1, y: 0, duration: 0.4 }, 3.4)

      /* ---------- PHASE B · BILA vs NA ---------- */
      tl.to('.phaseA', { autoAlpha: 0, duration: 0.4 }, 6.4)
      tl.to('.split', { autoAlpha: 1, duration: 0.4 }, 6.7)
      tl.to('.mode-bila', { autoAlpha: 1, y: 0, duration: 0.35 }, 6.9)
      tl.to('.bila-row', { autoAlpha: 1, duration: 0.3, stagger: 0.15 }, 7.2)
      tl.to('.spin', { rotation: 1800, transformOrigin: '50% 50%', duration: 5.2, ease: 'none' }, 7.2)
      tl.to('.pfill', { attr: { width: 34 }, duration: 4.6, ease: 'power1.out' }, 7.4)
      tl.to('.bload', { autoAlpha: 1, duration: 0.3 }, 7.8)
      tl.to('.badge-e', { autoAlpha: 1, duration: 0.3 }, 8.6)

      tl.to('.mode-na', { autoAlpha: 1, y: 0, duration: 0.35 }, 9.4)
      tl.to('.plane-b', { autoAlpha: 1, duration: 0.3 }, 9.5)
      tl.fromTo(
        '.na-row',
        { scale: 0.85, transformOrigin: '50% 50%' },
        { autoAlpha: 1, scale: 1, duration: 0.25, stagger: 0.12 },
        9.6,
      )
      tl.fromTo('.fast', { scale: 1.4, transformOrigin: '50% 50%' }, { autoAlpha: 1, scale: 1, duration: 0.35, ease: 'back.out(2)' }, 10.6)
      tl.to('.fcap', { autoAlpha: 1, duration: 0.3 }, 11.2)
      tl.to({}, { duration: 0.8 }, 11.8) // hold → 12.6s

      onReady(tl)
    }, ref)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <svg ref={ref} viewBox="0 0 360 500" className="h-full w-full">
      <text x={180} y={56} textAnchor="middle" fill="#888" fontFamily={MONO} fontSize={10} letterSpacing={3}>
        SIRI #1 · LOCAL DATABASE
      </text>

      {/* ---------- PHASE A — x-ray of the phone ---------- */}
      <g className="phaseA">
        <g className="xphone" style={{ opacity: 0 }}>
          <rect x={105} y={90} width={150} height={250} rx={18} fill="none" stroke="#2a2a2a" strokeWidth={1.4} />
          <text x={180} y={318} textAnchor="middle" fill="#444" fontFamily={MONO} fontSize={7} letterSpacing={2}>
            SIMU YAKO
          </text>
        </g>
        {/* the database cylinder inside */}
        <ellipse className="cyl" cx={180} cy={150} rx={48} ry={13} fill="none" stroke={ACCENT} strokeWidth={1.5} pathLength={1} strokeDasharray={1} strokeDashoffset={1} />
        <path className="cyl" d="M132 150 v110" fill="none" stroke={ACCENT} strokeWidth={1.5} pathLength={1} strokeDasharray={1} strokeDashoffset={1} />
        <path className="cyl" d="M228 150 v110" fill="none" stroke={ACCENT} strokeWidth={1.5} pathLength={1} strokeDasharray={1} strokeDashoffset={1} />
        <path className="cyl" d="M132 260 a48 13 0 0 0 96 0" fill="none" stroke={ACCENT} strokeWidth={1.5} pathLength={1} strokeDasharray={1} strokeDashoffset={1} />
        {/* chat rows living inside it */}
        <g className="crows">
          {[178, 204, 230].map((y, i) => (
            <g key={y} className="crow" style={{ opacity: 0, transform: 'translateY(8px)' }}>
              <rect x={145} y={y} width={70} height={16} rx={4} fill="none" stroke="#2a2a2a" strokeWidth={1} />
              <circle cx={153} cy={y + 8} r={2} fill={ACCENT} />
              <line x1={160} y1={y + 8} x2={200 - i * 8} y2={y + 8} stroke="#444" strokeWidth={1.3} strokeLinecap="round" />
            </g>
          ))}
        </g>
        <text className="humu" x={180} y={372} textAnchor="middle" fill={ACCENT} fontFamily={MONO} fontSize={10} letterSpacing={1} style={{ opacity: 0, transform: 'translateY(8px)' }}>
          CHATS ZIKO HUMU — SI HEWANI
        </text>
      </g>

      {/* ---------- PHASE B — bila vs na ---------- */}
      <g className="split" style={{ opacity: 0 }}>
        <line x1={180} y1={105} x2={180} y2={420} stroke="#1c1c1c" strokeWidth={1} />

        {/* BILA — spinners forever */}
        <text className="mode-bila" x={90} y={122} textAnchor="middle" fill={DANGER} fontSize={11} fontWeight={700} letterSpacing={1} style={{ opacity: 0, transform: 'translateY(8px)' }}>
          BILA LOCAL DB
        </text>
        {BILA_Y.map((y) => (
          <g key={y} className="bila-row" style={{ opacity: 0 }}>
            <rect x={25} y={y} width={130} height={32} rx={7} fill="none" stroke="#2a2a2a" strokeWidth={1.1} />
            <circle cx={41} cy={y + 16} r={8} fill="none" stroke="#3a3a3a" strokeWidth={1.1} />
            <line x1={55} y1={y + 12} x2={100} y2={y + 12} stroke="#333" strokeWidth={1.3} strokeLinecap="round" />
            <line x1={55} y1={y + 21} x2={84} y2={y + 21} stroke="#262626" strokeWidth={1.3} strokeLinecap="round" />
            <g transform={`translate(137 ${y + 16})`}>
              <path className="spin" d="M 0 -7 A 7 7 0 1 1 -6.1 3.5" fill="none" stroke={DANGER} strokeWidth={1.6} strokeLinecap="round" />
            </g>
          </g>
        ))}
        <rect x={25} y={296} width={130} height={4} rx={2} fill="#1c1c1c" />
        <rect className="pfill" x={25} y={296} width={0} height={4} rx={2} fill={DANGER} />
        <text className="bload" x={90} y={320} textAnchor="middle" fill={DANGER} fontFamily={MONO} fontSize={8} style={{ opacity: 0 }}>
          loading…
        </text>
        <g className="badge-e" style={{ opacity: 0 }}>
          <rect x={76} y={332} width={28} height={17} rx={3} fill="none" stroke={DANGER} strokeWidth={1.3} />
          <text x={90} y={344} textAnchor="middle" fill={DANGER} fontFamily={MONO} fontSize={10} fontWeight={700}>
            E
          </text>
          <text x={90} y={366} textAnchor="middle" fill="#555" fontFamily={MONO} fontSize={7} letterSpacing={1}>
            NETWORK YA DALADALA
          </text>
        </g>

        {/* NA — instant, even on airplane mode */}
        <text className="mode-na" x={270} y={122} textAnchor="middle" fill={ACCENT} fontSize={11} fontWeight={700} letterSpacing={1} style={{ opacity: 0, transform: 'translateY(8px)' }}>
          NA LOCAL DB
        </text>
        <g className="plane-b" style={{ opacity: 0 }} transform="translate(329 111) scale(0.7)">
          <path
            d="M0 -9 C1.5 -9 1.6 -6.5 1.6 -5 L1.6 -2.6 L9.5 2.2 L9.5 4.4 L1.6 1.8 L1.6 5.2 L4.2 7.6 L4.2 9.2 L0 8 L-4.2 9.2 L-4.2 7.6 L-1.6 5.2 L-1.6 1.8 L-9.5 4.4 L-9.5 2.2 L-1.6 -2.6 L-1.6 -5 C-1.6 -6.5 -1.5 -9 0 -9 Z"
            fill="none"
            stroke={ACCENT}
            strokeWidth={1.4}
            strokeLinejoin="round"
          />
        </g>
        {NA_Y.map((y, i) => (
          <g key={y} className="na-row" style={{ opacity: 0 }}>
            <rect x={205} y={y} width={130} height={32} rx={7} fill="none" stroke="#2a2a2a" strokeWidth={1.1} />
            <circle cx={221} cy={y + 16} r={8} fill="none" stroke="#3a3a3a" strokeWidth={1.1} />
            <text x={235} y={y + 14} fill="#ccc" fontSize={8}>
              {CHAT_LIST[i].name}
            </text>
            <text x={235} y={y + 25} fill="#555" fontSize={7}>
              {CHAT_LIST[i].preview}
            </text>
            <circle cx={323} cy={y + 16} r={3} fill={ACCENT} />
          </g>
        ))}
        <text className="fast" x={270} y={318} textAnchor="middle" fill={ACCENT} fontFamily={MONO} fontSize={17} fontWeight={700} style={{ opacity: 0 }}>
          0.02s
        </text>
        <text className="fcap" x={270} y={344} textAnchor="middle" fill="#555" fontFamily={MONO} fontSize={7} letterSpacing={1} style={{ opacity: 0 }}>
          BUNDLE IMEISHA — BADO INSTANT
        </text>
      </g>
    </svg>
  )
}
