import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { sfx, type SfxName } from '../audio/sfx'
import { FRANK, NEEMA, TRANSFER, TZS } from '../data/ledger'
import { ACCENT, BLUE, DANGER, MONO, type SceneProps } from './types'

// Frank's balance entering this scene (after the hook's transfer story resets)
const START = 113_500
const ORB_HOME = { x: 70, y: 250 }
const ORB_MID = { x: 180, y: 250 }

export default function AtomicScene({ onReady }: SceneProps) {
  const ref = useRef<SVGSVGElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true, defaults: { ease: 'power2.out' } })
      const cue = (t: number, name: SfxName, p?: number) => tl.call(() => sfx.play(name, p), [], t)
      // Frank's balance as a pure function of the timeline clock — a single
      // writer stays correct no matter how the transport scrubs or seeks.
      const F1 = START - TRANSFER
      const lerp = (a: number, b: number, p: number) => a + (b - a) * Math.min(1, Math.max(0, p))
      const balAt = (t: number) => {
        if (t < 2.1) return START
        if (t < 2.7) return lerp(START, F1, (t - 2.1) / 0.6) // phase A debit
        if (t < 7.0) return F1
        if (t < 8.1) return START // phase B reset
        if (t < 8.7) return lerp(START, F1, (t - 8.1) / 0.6) // phase B debit
        if (t < 10.0) return F1
        if (t < 10.6) return lerp(F1, START, (t - 10.0) / 0.6) // rollback
        return START
      }
      tl.to(
        {},
        {
          duration: 12.8,
          ease: 'none',
          onUpdate() {
            const el = ref.current?.querySelector('.bal-f')
            if (el) el.textContent = TZS(Math.round(balAt(tl.time())))
          },
        },
        0,
      )
      const dropSignal = (at: number, each: number) => {
        tl.to('.sig-bar', { autoAlpha: 0.12, duration: 0.15, stagger: { each, from: 'end' } }, at)
        cue(at, 'blip', 700)
        cue(at + each, 'blip', 550)
        cue(at + each * 2, 'blip', 420)
        cue(at + each * 3, 'blip', 300)
        tl.to('.sig-x', { autoAlpha: 1, duration: 0.2 }, at + each * 3 + 0.1)
      }
      const restoreSignal = (at: number) =>
        tl.to('.sig-bar', { autoAlpha: 1, duration: 0.2 }, at).to('.sig-x', { autoAlpha: 0, duration: 0.2 }, at)

      cue(0.6, 'ui')
      cue(2.0, 'tap')
      cue(4.9, 'ping')
      cue(5.6, 'thud')
      cue(7.3, 'ui')
      cue(8.0, 'tap')
      cue(9.9, 'whoosh')
      cue(11.0, 'lock')
      cue(11.2, 'thud')

      // stage
      tl.to('.stage', { autoAlpha: 1, duration: 0.4 }, 0.2)

      /* ---------- PHASE A · BILA ATOMICITY ---------- */
      tl.to('.mode-bila', { autoAlpha: 1, y: 0, duration: 0.4 }, 0.6)

      tl.to('.orb', { autoAlpha: 1, duration: 0.25 }, 2.0)
      tl.to('.bal-f', { fill: DANGER, duration: 0.2 }, 2.1)
      tl.to('.orb', { x: ORB_MID.x - ORB_HOME.x, duration: 1.2, ease: 'power1.inOut' }, 2.6)

      dropSignal(3.4, 0.18)

      // the orb is stranded mid-air…
      tl.to('.orb', { x: `+=${3}`, duration: 0.05, repeat: 7, yoyo: true, ease: 'none' }, 4.4)
      tl.to('.orb', { autoAlpha: 0, scale: 0.3, transformOrigin: '50% 50%', duration: 0.45 }, 4.9)

      tl.to('.no-rx', { autoAlpha: 1, duration: 0.3 }, 5.2)
      tl.to('.dead', { autoAlpha: 1, y: 0, duration: 0.5 }, 5.6)

      /* ---------- PHASE B · NA ATOMICITY ---------- */
      tl.to(['.dead', '.no-rx', '.mode-bila'], { autoAlpha: 0, duration: 0.35 }, 7.0)
      tl.to('.bal-f', { fill: '#fff', duration: 0.1 }, 7.0)
      tl.set('.orb', { x: 0, scale: 1 }, 7.0)
      restoreSignal(7.0)
      tl.to('.mode-na', { autoAlpha: 1, y: 0, duration: 0.4 }, 7.3)

      tl.to('.orb', { autoAlpha: 1, duration: 0.25 }, 8.0)
      tl.to('.orb', { x: ORB_MID.x - ORB_HOME.x, duration: 1.0, ease: 'power1.inOut' }, 8.4)

      dropSignal(9.2, 0.08)

      // …but this time the whole transaction rolls back
      tl.to('.orb', { x: 0, duration: 0.7, ease: 'power2.out' }, 9.9)
      tl.to('.bal-f', { fill: ACCENT, duration: 0.2 }, 10.0).to('.bal-f', { fill: '#fff', duration: 0.5 }, 10.7)
      tl.to('.orb', { autoAlpha: 0, duration: 0.3 }, 10.6)

      tl.fromTo(
        '.stamp',
        { scale: 1.4, transformOrigin: '50% 50%' },
        { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'back.out(2)' },
        11.0,
      )
      tl.to({}, { duration: 1.4 }, 11.4) // hold — keeps total at the driver's 12.8s

      onReady(tl)
    }, ref)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <svg ref={ref} viewBox="0 0 360 500" className="h-full w-full">
      <text x={180} y={56} textAnchor="middle" fill="#888" fontFamily={MONO} fontSize={10} letterSpacing={3}>
        SIRI #2 · ATOMICITY
      </text>
      <text className="mode-bila" x={180} y={88} textAnchor="middle" fill={DANGER} fontSize={13} fontWeight={700} letterSpacing={2} style={{ opacity: 0, transform: 'translateY(8px)' }}>
        BILA ATOMICITY
      </text>
      <text className="mode-na" x={180} y={88} textAnchor="middle" fill={ACCENT} fontSize={13} fontWeight={700} letterSpacing={2} style={{ opacity: 0, transform: 'translateY(8px)' }}>
        NA ATOMICITY
      </text>

      <g className="stage" style={{ opacity: 0 }}>
        {/* network signal above the route */}
        <g>
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} className="sig-bar" x={165 + i * 8} y={162 - i * 5} width={5} height={8 + i * 5} rx={1} fill={BLUE} />
          ))}
          <text className="sig-x" x={203} y={168} fill={DANGER} fontSize={14} fontWeight={800} style={{ opacity: 0 }}>
            ✕
          </text>
          <text x={180} y={188} textAnchor="middle" fill={BLUE} opacity={0.7} fontFamily={MONO} fontSize={7} letterSpacing={2}>
            NETWORK · UBUNGO
          </text>
        </g>

        {/* the route */}
        <line x1={95} y1={250} x2={265} y2={250} stroke="#222" strokeWidth={1.2} />

        {/* Frank */}
        <circle cx={70} cy={250} r={17} fill="none" stroke="#444" strokeWidth={1.4} />
        <text x={70} y={255} textAnchor="middle" fill="#fff" fontSize={13} fontWeight={700}>
          F
        </text>
        <text x={70} y={288} textAnchor="middle" fill="#888" fontFamily={MONO} fontSize={8} letterSpacing={1}>
          {FRANK.name}
        </text>
        <text className="bal-f" x={70} y={305} textAnchor="middle" fill="#fff" fontFamily={MONO} fontSize={11} fontWeight={700}>
          {TZS(START)}
        </text>

        {/* Mama Neema */}
        <circle cx={290} cy={250} r={17} fill="none" stroke="#444" strokeWidth={1.4} />
        <text x={290} y={255} textAnchor="middle" fill="#fff" fontSize={13} fontWeight={700}>
          N
        </text>
        <text x={290} y={288} textAnchor="middle" fill="#888" fontFamily={MONO} fontSize={8} letterSpacing={1}>
          {NEEMA.name}
        </text>
        <text className="bal-n" x={290} y={305} textAnchor="middle" fill="#fff" fontFamily={MONO} fontSize={11} fontWeight={700}>
          {TZS(NEEMA.start)}
        </text>
        <text className="no-rx" x={290} y={322} textAnchor="middle" fill={DANGER} fontFamily={MONO} fontSize={8} style={{ opacity: 0 }}>
          hajapokea
        </text>
      </g>

      {/* the TZS 50,000 orb */}
      <g className="orb" style={{ opacity: 0 }} transform={`translate(${ORB_HOME.x} ${ORB_HOME.y - 34})`}>
        <circle r={13} fill="#000" stroke={ACCENT} strokeWidth={1.5} />
        <text y={4} textAnchor="middle" fill={ACCENT} fontFamily={MONO} fontSize={9} fontWeight={700}>
          50K
        </text>
      </g>

      {/* pesa hewani — hand-drawn skull instead of an emoji */}
      <g className="dead" style={{ opacity: 0, transform: 'translateY(10px)' }}>
        <g transform="translate(103 363)">
          <circle r={7} fill="none" stroke={DANGER} strokeWidth={1.5} />
          <circle cx={-2.6} cy={-1.2} r={1.5} fill={DANGER} />
          <circle cx={2.6} cy={-1.2} r={1.5} fill={DANGER} />
          <path d="M-3 6.5 v4 M0 7.2 v4 M3 6.5 v4" fill="none" stroke={DANGER} strokeWidth={1.5} strokeLinecap="round" />
        </g>
        <text x={192} y={370} textAnchor="middle" fill={DANGER} fontSize={18} fontWeight={800}>
          PESA HEWANI
        </text>
      </g>

      {/* all or nothing */}
      <g className="stamp" style={{ opacity: 0 }}>
        <g transform="rotate(-6 180 370)">
          <rect x={85} y={350} width={190} height={40} rx={6} fill="none" stroke={ACCENT} strokeWidth={2} />
          <text x={180} y={376} textAnchor="middle" fill={ACCENT} fontFamily={MONO} fontSize={14} fontWeight={700} letterSpacing={2}>
            ALL OR NOTHING
          </text>
        </g>
      </g>
    </svg>
  )
}
