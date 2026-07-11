import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { sfx, type SfxName } from '../audio/sfx'
import { RETRY_STEPS } from '../data/chat'
import { ACCENT, DANGER, MONO, type SceneProps } from './types'

// queue slot baselines inside the phone
const SLOTS = [322, 358, 394]
/** y-offset that puts a bubble's center on the server cloud */
const flyTo = (slot: number) => 150 - slot

export default function QueueScene({ onReady }: SceneProps) {
  const ref = useRef<SVGSVGElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true, defaults: { ease: 'power2.out' } })
      const cue = (t: number, name: SfxName, p?: number) => tl.call(() => sfx.play(name, p), [], t)
      const pulseCloud = (at: number) =>
        tl.to('.cloud', { scale: 1.08, transformOrigin: '50% 50%', duration: 0.15, yoyo: true, repeat: 1 }, at)

      cue(0.3, 'ui')
      cue(2.4, 'blip', 700)
      cue(2.6, 'pops')
      cue(3.4, 'whoosh')
      cue(4.3, 'note', 659)
      cue(5.3, 'blip', 300)
      cue(5.8, 'thud')
      cue(6.5, 'blip', 500)
      cue(7.2, 'blip', 500)
      cue(7.9, 'blip', 500)
      cue(8.3, 'blip', 740)
      cue(8.6, 'whoosh')
      cue(9.4, 'note', 784)
      cue(9.9, 'whoosh')
      cue(10.7, 'note', 880)
      cue(11.2, 'lock')

      // stage — airplane mode ON, three messages waiting
      tl.to('.stage', { autoAlpha: 1, duration: 0.4 }, 0.3)
      tl.to(['.qb-0', '.qb-1', '.qb-2'], { autoAlpha: 1, duration: 0.35, stagger: 0.15 }, 0.7)

      // airplane OFF → signal climbs back
      tl.to('.qknob', { attr: { cx: 147 }, fill: '#666', duration: 0.3 }, 2.4)
      tl.to('.qplane-p', { stroke: '#555', duration: 0.3 }, 2.4)
      tl.fromTo('.qsig-bar', { autoAlpha: 0.12 }, { autoAlpha: 1, duration: 0.2, stagger: 0.12 }, 2.6)

      // message 1 flies — delivered
      tl.to('.qb-0', { y: flyTo(SLOTS[0]), scale: 0.5, transformOrigin: '50% 50%', duration: 0.9, ease: 'power1.in' }, 3.4)
      tl.to('.qb-0', { autoAlpha: 0, duration: 0.2 }, 4.2)
      pulseCloud(4.3)
      tl.to('.got-0', { autoAlpha: 1, duration: 0.2 }, 4.3)
      tl.to(['.qb-1', '.qb-2'], { y: -36, duration: 0.4 }, 4.4)

      // message 2 flies… network dies mid-flight → bounce back
      tl.to('.qb-1', { y: -130, scale: 0.7, transformOrigin: '50% 50%', duration: 0.6, ease: 'power1.in' }, 4.9)
      tl.to('.qsig-bar', { autoAlpha: 0.12, duration: 0.15, stagger: { each: 0.08, from: 'end' } }, 5.3)
      tl.to('.qsig-x', { autoAlpha: 1, duration: 0.2 }, 5.6)
      tl.to('.qb-1', { y: -36, scale: 1, duration: 0.7, ease: 'bounce.out' }, 5.7)

      // the app retries on its own — 2s… 4s… 8s
      tl.to('.rt-0', { autoAlpha: 1, duration: 0.25 }, 6.5)
      tl.to('.rt-1', { autoAlpha: 1, duration: 0.25 }, 7.2)
      tl.to('.rt-2', { autoAlpha: 1, duration: 0.25 }, 7.9)

      // signal returns → retry succeeds, queue drains in order
      tl.to('.qsig-bar', { autoAlpha: 1, duration: 0.2, stagger: 0.06 }, 8.3)
      tl.to('.qsig-x', { autoAlpha: 0, duration: 0.15 }, 8.3)
      tl.to('.qb-1', { y: flyTo(SLOTS[1]), scale: 0.5, duration: 0.8, ease: 'power1.in' }, 8.6)
      tl.to('.qb-1', { autoAlpha: 0, duration: 0.2 }, 9.3)
      pulseCloud(9.4)
      tl.to('.got-1', { autoAlpha: 1, duration: 0.2 }, 9.4)
      tl.to('.qb-2', { y: -72, duration: 0.35 }, 9.5)

      tl.to('.qb-2', { y: flyTo(SLOTS[2]), scale: 0.5, transformOrigin: '50% 50%', duration: 0.8, ease: 'power1.in' }, 9.9)
      tl.to('.qb-2', { autoAlpha: 0, duration: 0.2 }, 10.6)
      pulseCloud(10.7)
      tl.to('.got-2', { autoAlpha: 1, duration: 0.2 }, 10.7)

      tl.to('.qlabel', { autoAlpha: 1, y: 0, duration: 0.4 }, 11.2)
      tl.to({}, { duration: 1.0 }, 11.6) // hold → 12.6s

      onReady(tl)
    }, ref)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <svg ref={ref} viewBox="0 0 360 500" className="h-full w-full">
      <text x={180} y={56} textAnchor="middle" fill="#888" fontFamily={MONO} fontSize={10} letterSpacing={3}>
        SIRI #3 · SYNC QUEUE
      </text>

      <g className="stage" style={{ opacity: 0 }}>
        {/* the server cloud */}
        <g className="cloud">
          <path d="M 158 132 A 11 11 0 0 1 160 110 A 14 14 0 0 1 188 104 A 10 10 0 0 1 202 132 Z" fill="none" stroke="#888" strokeWidth={1.4} strokeLinejoin="round" />
        </g>
        <text x={180} y={148} textAnchor="middle" fill="#555" fontFamily={MONO} fontSize={6.5} letterSpacing={2}>
          SERVER
        </text>
        {/* delivery ticks collect under the cloud */}
        {[0, 1, 2].map((i) => (
          <polyline
            key={i}
            className={`got-${i}`}
            points={`${162 + i * 14},160 ${165 + i * 14},163.5 ${171 + i * 14},156`}
            fill="none"
            stroke={ACCENT}
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ opacity: 0 }}
          />
        ))}

        {/* signal, beside the cloud */}
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} className="qsig-bar" x={116 + i * 7} y={122 - i * 4} width={4} height={8 + i * 4} rx={1} fill="#888" opacity={0.12} />
        ))}
        <text className="qsig-x" x={104} y={130} fill={DANGER} fontSize={11} fontWeight={800} style={{ opacity: 0 }}>
          ✕
        </text>

        {/* flight path */}
        <line x1={180} y1={168} x2={180} y2={278} stroke="#222" strokeWidth={1} strokeDasharray="3 5" />

        {/* retry backoff — the app never asks you */}
        <text className="rt-0" x={238} y={212} fill={DANGER} fontFamily={MONO} fontSize={8.5} style={{ opacity: 0 }}>
          retry {RETRY_STEPS[0]}
        </text>
        <text className="rt-1" x={288} y={212} fill={DANGER} fontFamily={MONO} fontSize={8.5} style={{ opacity: 0 }}>
          · {RETRY_STEPS[1]}
        </text>
        <text className="rt-2" x={316} y={212} fill={DANGER} fontFamily={MONO} fontSize={8.5} style={{ opacity: 0 }}>
          · {RETRY_STEPS[2]}
        </text>

        {/* the phone with its waiting line */}
        <rect x={115} y={280} width={130} height={170} rx={16} fill="none" stroke="#2a2a2a" strokeWidth={1.4} />
        <rect x={140} y={292} width={30} height={14} rx={7} fill="none" stroke="#444" strokeWidth={1.2} />
        <circle className="qknob" cx={163} cy={299} r={5} fill={ACCENT} />
        <g transform="translate(127 299) scale(0.55)">
          <path
            className="qplane-p"
            d="M0 -9 C1.5 -9 1.6 -6.5 1.6 -5 L1.6 -2.6 L9.5 2.2 L9.5 4.4 L1.6 1.8 L1.6 5.2 L4.2 7.6 L4.2 9.2 L0 8 L-4.2 9.2 L-4.2 7.6 L-1.6 5.2 L-1.6 1.8 L-9.5 4.4 L-9.5 2.2 L-1.6 -2.6 L-1.6 -5 C-1.6 -6.5 -1.5 -9 0 -9 Z"
            fill="none"
            stroke={ACCENT}
            strokeWidth={1.8}
            strokeLinejoin="round"
          />
        </g>
        <text x={180} y={466} textAnchor="middle" fill="#444" fontFamily={MONO} fontSize={6.5} letterSpacing={2}>
          SIMU YAKO
        </text>
      </g>

      {/* the queue — three messages, in order. GSAP moves the outer group,
          the inner group holds the base position (offsets stay offsets). */}
      {SLOTS.map((y, i) => (
        <g key={y} className={`qb-${i}`} style={{ opacity: 0 }}>
          <g transform={`translate(180 ${y})`}>
            <rect x={-45} y={0} width={90} height={26} rx={8} fill="none" stroke={ACCENT} strokeWidth={1.4} />
            <circle cx={-33} cy={13} r={7} fill="none" stroke="#888" strokeWidth={1.1} />
            <text x={-33} y={16} textAnchor="middle" fill="#fff" fontFamily={MONO} fontSize={8} fontWeight={700}>
              {i + 1}
            </text>
            <line x1={-20} y1={13} x2={18} y2={13} stroke="#444" strokeWidth={1.3} strokeLinecap="round" />
            <circle cx={34} cy={19} r={4} fill="none" stroke="#999" strokeWidth={0.9} />
            <path d="M34 16.6 v2.4 h1.7" fill="none" stroke="#999" strokeWidth={0.9} strokeLinecap="round" />
          </g>
        </g>
      ))}

      <text className="qlabel" x={180} y={487} textAnchor="middle" fill={ACCENT} fontFamily={MONO} fontSize={9.5} letterSpacing={1} style={{ opacity: 0, transform: 'translateY(8px)' }}>
        QUEUE — HAKUNA MESSAGE INAYOKUFA
      </text>
    </svg>
  )
}
