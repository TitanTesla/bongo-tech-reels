import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { sfx, type SfxName } from '../audio/sfx'
import { BALANCE, LEDGER_ROWS, TZS } from '../data/ledger'
import { ACCENT, BLUE, DANGER, MONO, type SceneProps } from './types'

const ROW_Y = [196, 234, 272]

export default function LedgerScene({ onReady }: SceneProps) {
  const ref = useRef<SVGSVGElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true, defaults: { ease: 'power2.out' } })
      const cue = (t: number, name: SfxName, p?: number) => tl.call(() => sfx.play(name, p), [], t)

      cue(0.2, 'ui')
      cue(3.2, 'whoosh')
      cue(3.9, 'pops')
      cue(4.7, 'thud')
      cue(5.9, 'blip', 700)
      cue(6.25, 'blip', 560)
      cue(6.6, 'blip', 450)
      cue(8.4, 'ui')
      cue(10.0, 'draw')
      cue(10.2, 'cash')
      cue(11.4, 'lock')

      // 1 — the balance you believe in
      tl.to('.hero', { autoAlpha: 1, duration: 0.5 }, 0.2)
      tl.to('.hero-myth', { autoAlpha: 1, y: 0, duration: 0.4 }, 1.0)

      // 2 — dive through the number
      tl.to('.hero', { scale: 6, autoAlpha: 0, transformOrigin: '50% 50%', duration: 0.8, ease: 'power2.in' }, 3.2)
        .to('.hero-myth', { autoAlpha: 0, duration: 0.4 }, 3.4)

      // 3 — behind it: no little room of money
      tl.to('.vault', { autoAlpha: 1, duration: 0.4 }, 3.9)
        .to('.vault-x', { strokeDashoffset: 0, duration: 0.35, stagger: 0.12 }, 4.6)
        .to('.vault-no', { autoAlpha: 1, duration: 0.3 }, 4.9)
        .to('.vault', { autoAlpha: 0, duration: 0.35 }, 5.5)

      // 4 — what exists: records
      tl.to('.lrow', { autoAlpha: 1, x: 0, duration: 0.45, stagger: 0.35 }, 5.8)

      // 5 — daftari la mangi
      tl.to('.daftari', { autoAlpha: 1, duration: 0.45 }, 8.4)

      // 6 — balance = SUM(story)
      tl.to('.sum-line', { strokeDashoffset: 0, duration: 0.5 }, 10.0)
      const o = { v: 0 }
      tl.to(
        o,
        {
          v: BALANCE,
          duration: 1.1,
          ease: 'power1.out',
          onUpdate() {
            const el = ref.current?.querySelector('.sum-txt')
            if (el) el.textContent = TZS(Math.round(o.v))
          },
        },
        10.2,
      )
      tl.to('.sum-txt', { autoAlpha: 1, duration: 0.2 }, 10.2)
        .to('.sum-sub', { autoAlpha: 1, duration: 0.4 }, 11.0)
        .to('.tag', { autoAlpha: 1, duration: 0.4 }, 11.4)
        .to({}, { duration: 1.0 }) // hold

      onReady(tl)
    }, ref)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <svg ref={ref} viewBox="0 0 360 500" className="h-full w-full">
      {/* the balance you believe in */}
      <g className="hero" style={{ opacity: 0 }}>
        <text x={180} y={110} textAnchor="middle" fill={BLUE} fontFamily={MONO} fontSize={10} letterSpacing={3}>
          MIXX BALANCE
        </text>
        <text x={180} y={150} textAnchor="middle" fill="#fff" fontSize={30} fontWeight={800}>
          {TZS(BALANCE)}
        </text>
      </g>
      <g className="hero-myth" style={{ opacity: 0, transform: 'translateY(8px)' }}>
        <text x={170} y={185} textAnchor="middle" fill="#888" fontSize={12}>
          zimekaa somewhere zikikusubiri?
        </text>
        {/* hand-drawn thought bubble instead of an emoji */}
        <circle cx={296} cy={175} r={9} fill="none" stroke={BLUE} strokeWidth={1.2} />
        <text x={296} y={179} textAnchor="middle" fill={BLUE} fontSize={11} fontWeight={700}>
          ?
        </text>
        <circle cx={285} cy={186} r={2.2} fill="none" stroke={BLUE} strokeWidth={1} />
        <circle cx={279} cy={192} r={1.3} fill="none" stroke={BLUE} strokeWidth={1} />
      </g>

      {/* the little money room that doesn't exist */}
      <g className="vault" style={{ opacity: 0 }}>
        <rect x={135} y={195} width={90} height={70} rx={8} fill="none" stroke="#444" strokeWidth={1.4} />
        <rect x={165} y={225} width={30} height={40} rx={3} fill="none" stroke="#333" strokeWidth={1.2} />
        <circle cx={188} cy={246} r={2} fill="#333" />
        <text x={180} y={285} textAnchor="middle" fill="#888" fontFamily={MONO} fontSize={9}>
          kachumba ka Frank?
        </text>
        <line className="vault-x" x1={130} y1={190} x2={230} y2={270} stroke={DANGER} strokeWidth={2.5} pathLength={1} strokeDasharray={1} strokeDashoffset={1} />
        <line className="vault-x" x1={230} y1={190} x2={130} y2={270} stroke={DANGER} strokeWidth={2.5} pathLength={1} strokeDasharray={1} strokeDashoffset={1} />
        <text className="vault-no" x={180} y={315} textAnchor="middle" fill={DANGER} fontFamily={MONO} fontSize={13} fontWeight={700} letterSpacing={3} style={{ opacity: 0 }}>
          HAKUNA
        </text>
      </g>

      {/* the records that do exist */}
      {LEDGER_ROWS.map((r, i) => (
        <g key={r.label} className="lrow" style={{ opacity: 0, transform: 'translateX(-14px)' }}>
          <rect x={60} y={ROW_Y[i]} width={240} height={30} rx={7} fill="none" stroke="#222" strokeWidth={1.2} />
          <text x={76} y={ROW_Y[i] + 19} fill="#ddd" fontSize={11}>
            {r.label}
          </text>
          <text x={284} y={ROW_Y[i] + 19} textAnchor="end" fill={r.positive ? ACCENT : '#ff8a8a'} fontFamily={MONO} fontSize={11}>
            {r.amount}
          </text>
        </g>
      ))}

      {/* daftari la mangi */}
      <g className="daftari" style={{ opacity: 0 }}>
        <rect x={24} y={210} width={26} height={34} rx={3} fill="none" stroke="#444" strokeWidth={1.2} />
        {[218, 226, 234].map((y) => (
          <line key={y} x1={30} y1={y} x2={44} y2={y} stroke="#333" strokeWidth={1} />
        ))}
        {[216, 228, 240].map((y) => (
          <circle key={y} cx={24} cy={y} r={1.6} fill="none" stroke="#444" strokeWidth={0.8} />
        ))}
        <text x={37} y={258} textAnchor="middle" fill="#666" fontFamily={MONO} fontSize={7}>
          daftari
        </text>
        <text x={37} y={268} textAnchor="middle" fill="#666" fontFamily={MONO} fontSize={7}>
          la mangi
        </text>
      </g>

      {/* the sum */}
      <line className="sum-line" x1={60} y1={318} x2={300} y2={318} stroke={ACCENT} strokeWidth={1.5} pathLength={1} strokeDasharray={1} strokeDashoffset={1} />
      <text className="sum-txt" x={180} y={348} textAnchor="middle" fill={ACCENT} fontFamily={MONO} fontSize={17} fontWeight={700} style={{ opacity: 0 }}>
        TZS 0
      </text>
      <text className="sum-sub" x={180} y={368} textAnchor="middle" fill="#666" fontFamily={MONO} fontSize={9} letterSpacing={2} style={{ opacity: 0 }}>
        = JUMLA YA STORY YAKO
      </text>

      <text className="tag" x={180} y={432} textAnchor="middle" fill={ACCENT} fontFamily={MONO} fontSize={10} letterSpacing={2} style={{ opacity: 0 }}>
        LEDGER — SI PESA, NI STORY
      </text>
    </svg>
  )
}
