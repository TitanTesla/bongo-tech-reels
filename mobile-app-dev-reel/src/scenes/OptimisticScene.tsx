import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { sfx, type SfxName } from '../audio/sfx'
import { MSG_OPT } from '../data/chat'
import { ACCENT, DANGER, MONO, type SceneProps } from './types'

export default function OptimisticScene({ onReady }: SceneProps) {
  const ref = useRef<SVGSVGElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true, defaults: { ease: 'power2.out' } })
      const cue = (t: number, name: SfxName, p?: number) => tl.call(() => sfx.play(name, p), [], t)

      cue(0.3, 'ui')
      cue(1.4, 'ui')
      cue(2.2, 'tap')
      cue(2.35, 'blip', 740)
      cue(2.4, 'timer')
      cue(5.3, 'blip', 300)
      cue(8.1, 'note', 988)
      cue(10.8, 'thud')

      // stage
      tl.to(['.mode-bila', '.mode-na'], { autoAlpha: 1, y: 0, duration: 0.4 }, 0.3)
      tl.to(['.ph-l', '.ph-r'], { autoAlpha: 1, duration: 0.4 }, 0.5)
      tl.to(['.in-l', '.in-r'], { autoAlpha: 1, duration: 0.3 }, 1.4)

      // both sides hit send at the same moment
      tl.to(['.send-l', '.send-r'], { scale: 1.3, transformOrigin: '50% 50%', duration: 0.12, yoyo: true, repeat: 1 }, 2.2)

      /* NA — the bubble snaps in instantly, with the honest little clock */
      tl.fromTo('.bub-r', { scale: 0.85, transformOrigin: '50% 50%' }, { autoAlpha: 1, scale: 1, duration: 0.3, ease: 'back.out(2)' }, 2.35)
      tl.to('.clock-r', { autoAlpha: 1, duration: 0.2 }, 2.6)
      tl.to('.clock-hand-r', { rotation: 1080, duration: 5.3, ease: 'none', svgOrigin: '310 234' }, 2.7)
      tl.to('.cap-r', { autoAlpha: 1, duration: 0.3 }, 3.0)

      /* BILA — spinner + timer before anything shows */
      tl.to('.spin-l', { autoAlpha: 1, duration: 0.2 }, 2.35)
      tl.to('.spin-l', { rotation: 1440, transformOrigin: '50% 50%', duration: 2.95, ease: 'none' }, 2.35)
      const timer = { v: 0 }
      tl.to(
        timer,
        {
          v: 3,
          duration: 2.9,
          ease: 'none',
          onUpdate() {
            const el = ref.current?.querySelector('.timer-l')
            if (el) el.textContent = `${timer.v.toFixed(1)}s`
          },
        },
        2.4,
      )
      tl.to('.timer-l', { autoAlpha: 1, duration: 0.2 }, 2.4)

      // …three seconds later the same bubble finally appears
      tl.to('.spin-l', { autoAlpha: 0, duration: 0.2 }, 5.3)
      tl.to('.bub-l', { autoAlpha: 1, y: 0, duration: 0.35 }, 5.3)
      tl.to('.timer-l', { scale: 1.18, transformOrigin: '50% 50%', duration: 0.2, yoyo: true, repeat: 1 }, 5.4)
      tl.to('.cap-l', { autoAlpha: 1, duration: 0.3 }, 5.9)

      /* the clock quietly becomes a tick — the truth caught up */
      tl.to('.clock-r', { autoAlpha: 0, duration: 0.25 }, 8.1)
      tl.to('.tick-r', { autoAlpha: 1, strokeDashoffset: 0, duration: 0.35 }, 8.15)

      // stamp
      tl.fromTo('.stamp', { scale: 1.4, transformOrigin: '50% 50%' }, { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'back.out(2)' }, 10.8)
      tl.to({}, { duration: 1.6 }, 11.4) // hold → 13.0s

      onReady(tl)
    }, ref)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const bubble = (cls: string, x: number) => (
    <g className={cls} style={{ opacity: 0 }}>
      <g transform={`translate(${x} 210)`}>
        <rect width={96} height={28} rx={9} fill="none" stroke={ACCENT} strokeWidth={1.4} />
        <text x={44} y={17} textAnchor="middle" fill="#fff" fontSize={8}>
          {MSG_OPT}
        </text>
      </g>
    </g>
  )

  return (
    <svg ref={ref} viewBox="0 0 360 500" className="h-full w-full">
      <text x={180} y={56} textAnchor="middle" fill="#888" fontFamily={MONO} fontSize={10} letterSpacing={3}>
        SIRI #2 · OPTIMISTIC UI
      </text>
      <line x1={180} y1={96} x2={180} y2={410} stroke="#1c1c1c" strokeWidth={1} />

      <text className="mode-bila" x={90} y={114} textAnchor="middle" fill={DANGER} fontSize={10} fontWeight={700} letterSpacing={1} style={{ opacity: 0, transform: 'translateY(8px)' }}>
        BILA OPTIMISTIC UI
      </text>
      <text className="mode-na" x={270} y={114} textAnchor="middle" fill={ACCENT} fontSize={10} fontWeight={700} letterSpacing={1} style={{ opacity: 0, transform: 'translateY(8px)' }}>
        NA OPTIMISTIC UI
      </text>

      {/* phones */}
      <g className="ph-l" style={{ opacity: 0 }}>
        <rect x={30} y={128} width={120} height={200} rx={14} fill="none" stroke="#2a2a2a" strokeWidth={1.3} />
      </g>
      <g className="ph-r" style={{ opacity: 0 }}>
        <rect x={210} y={128} width={120} height={200} rx={14} fill="none" stroke="#2a2a2a" strokeWidth={1.3} />
      </g>

      {/* input bars + send buttons */}
      <g className="in-l" style={{ opacity: 0 }}>
        <rect x={40} y={298} width={76} height={20} rx={10} fill="none" stroke="#2a2a2a" strokeWidth={1.1} />
        {[0, 1, 2].map((i) => (
          <circle key={i} cx={52 + i * 8} cy={308} r={1.5} fill="#555" />
        ))}
        <g className="send-l">
          <circle cx={130} cy={308} r={9} fill="none" stroke="#888" strokeWidth={1.2} />
          <path d="M126.5 310.5 L135 306 L129.5 312 L129 309.5 Z" fill="none" stroke="#888" strokeWidth={0.9} strokeLinejoin="round" />
        </g>
      </g>
      <g className="in-r" style={{ opacity: 0 }}>
        <rect x={220} y={298} width={76} height={20} rx={10} fill="none" stroke="#2a2a2a" strokeWidth={1.1} />
        {[0, 1, 2].map((i) => (
          <circle key={i} cx={232 + i * 8} cy={308} r={1.5} fill="#555" />
        ))}
        <g className="send-r">
          <circle cx={310} cy={308} r={9} fill="none" stroke={ACCENT} strokeWidth={1.2} />
          <path d="M306.5 310.5 L315 306 L309.5 312 L309 309.5 Z" fill="none" stroke={ACCENT} strokeWidth={0.9} strokeLinejoin="round" />
        </g>
      </g>

      {/* BILA — the spinner era */}
      <g transform="translate(90 224)">
        <path className="spin-l" d="M 0 -9 A 9 9 0 1 1 -7.8 4.5" fill="none" stroke={DANGER} strokeWidth={1.8} strokeLinecap="round" style={{ opacity: 0 }} />
      </g>
      {bubble('bub-l', 42)}
      <text className="timer-l" x={90} y={368} textAnchor="middle" fill={DANGER} fontFamily={MONO} fontSize={15} fontWeight={700} style={{ opacity: 0 }}>
        0.0s
      </text>
      <text className="cap-l" x={90} y={390} textAnchor="middle" fill="#555" fontFamily={MONO} fontSize={7} letterSpacing={1} style={{ opacity: 0 }}>
        KILA MESSAGE. KILA SIKU.
      </text>

      {/* NA — instant, honestly flagged */}
      {bubble('bub-r', 222)}
      <g className="clock-r" style={{ opacity: 0 }}>
        <circle cx={310} cy={234} r={4.5} fill="#000" stroke="#999" strokeWidth={1} />
        <line className="clock-hand-r" x1={310} y1={234} x2={310} y2={231} stroke="#999" strokeWidth={1} strokeLinecap="round" />
      </g>
      <polyline
        className="tick-r"
        points="304,234 308,238 316,229"
        fill="none"
        stroke={ACCENT}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1}
        style={{ opacity: 0 }}
      />
      <text className="cap-r" x={270} y={368} textAnchor="middle" fill={ACCENT} fontFamily={MONO} fontSize={15} fontWeight={700} style={{ opacity: 0 }}>
        MARA MOJA
      </text>
      <text className="cap-r" x={270} y={390} textAnchor="middle" fill="#555" fontFamily={MONO} fontSize={7} letterSpacing={1} style={{ opacity: 0 }}>
        INA-APPEAR KABLA HAIJATUMWA
      </text>

      {/* stamp */}
      <g className="stamp" style={{ opacity: 0 }}>
        <g transform="rotate(-5 180 438)">
          <rect x={52} y={420} width={256} height={36} rx={6} fill="none" stroke={ACCENT} strokeWidth={2} />
          <text x={180} y={443} textAnchor="middle" fill={ACCENT} fontFamily={MONO} fontSize={11} fontWeight={700} letterSpacing={1.5}>
            ONYESHA KWANZA, TUMA BAADAYE
          </text>
        </g>
      </g>
    </svg>
  )
}
