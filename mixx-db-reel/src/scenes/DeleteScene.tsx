import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { sfx, type SfxName } from '../audio/sfx'
import { ACCENT, BLUE, DANGER, MONO, type SceneProps } from './types'

export default function DeleteScene({ onReady }: SceneProps) {
  const ref = useRef<SVGSVGElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true, defaults: { ease: 'power2.out' } })
      const cue = (t: number, name: SfxName, p?: number) => tl.call(() => sfx.play(name, p), [], t)

      cue(0.2, 'ui')
      cue(1.4, 'swish')
      cue(2.3, 'blip', 300)
      cue(2.9, 'lock')
      cue(4.8, 'ui')
      cue(6.9, 'whoosh')
      cue(7.5, 'ding')
      cue(8.1, 'blip', 260)
      cue(8.9, 'lock')

      // the transaction row
      tl.to('.hdr', { autoAlpha: 1, duration: 0.4 }, 0.2)
      tl.to('.row', { autoAlpha: 1, duration: 0.45 }, 0.4)

      // the swipe-delete
      tl.to('.finger', { autoAlpha: 0.85, duration: 0.2 }, 1.2)
        .to('.finger', { x: -190, duration: 0.6, ease: 'power1.inOut' }, 1.4)
        .to('.row', { x: -46, duration: 0.55, ease: 'power1.inOut' }, 1.45)
        .to('.del-label', { autoAlpha: 1, duration: 0.25 }, 1.55)
        .to('.finger', { autoAlpha: 0, duration: 0.2 }, 2.0)

      // …but it only slides behind the curtain
      tl.to('.curtain', { autoAlpha: 1, duration: 0.35 }, 1.9)
      tl.to('.del-label', { autoAlpha: 0, duration: 0.2 }, 2.2)
      tl.to('.row', { x: 0, y: 92, scale: 0.96, transformOrigin: '50% 50%', duration: 0.6, ease: 'power2.inOut' }, 2.2)
        .to('.row', { autoAlpha: 0.4, duration: 0.4 }, 2.5)

      // marked, not murdered
      tl.fromTo(
        '.flag',
        { scale: 0.6, transformOrigin: '50% 50%' },
        { autoAlpha: 1, scale: 1, duration: 0.35, ease: 'back.out(2)' },
        2.9,
      )

      // the denial
      tl.to('.bubble', { autoAlpha: 1, y: 0, duration: 0.45 }, 4.8)

      // the receipt rises
      tl.to('.row', { y: 6, autoAlpha: 0.92, duration: 0.7, ease: 'power2.inOut' }, 6.9)
        .to('.row-rect', { attr: { stroke: ACCENT }, duration: 0.3 }, 7.1)
        .to('.ushahidi', { autoAlpha: 1, duration: 0.35 }, 7.5)

      // the denial is busted
      tl.to('.bubble', { rotate: 7, autoAlpha: 0.3, transformOrigin: '50% 50%', duration: 0.5 }, 8.0)
        .to('.bubble-x', { strokeDashoffset: 0, duration: 0.3 }, 8.1)

      tl.to('.tag', { autoAlpha: 1, duration: 0.4 }, 8.9)
      tl.to({}, { duration: 1.4 }) // hold

      onReady(tl)
    }, ref)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <svg ref={ref} viewBox="0 0 360 500" className="h-full w-full">
      <g className="hdr" style={{ opacity: 0 }}>
        <text x={180} y={56} textAnchor="middle" fill="#888" fontFamily={MONO} fontSize={10} letterSpacing={3}>
          SIRI #4 · DELETE NI UONGO
        </text>
      </g>

      {/* DELETE reveal behind the row */}
      <text className="del-label" x={318} y={177} textAnchor="end" fill={DANGER} fontFamily={MONO} fontSize={11} fontWeight={700} letterSpacing={2} style={{ opacity: 0 }}>
        DELETE
      </text>

      {/* the archive curtain */}
      <g className="curtain" style={{ opacity: 0 }}>
        <rect x={45} y={216} width={270} height={78} rx={10} fill="#0c0c0c" stroke="#1d1d1d" strokeWidth={1.2} />
        <text x={62} y={284} fill="#3a3a3a" fontFamily={MONO} fontSize={8} letterSpacing={1}>
          …archive (huioni)
        </text>
      </g>

      {/* the transaction row */}
      <g className="row" style={{ opacity: 0 }}>
        <rect className="row-rect" x={45} y={148} width={270} height={48} rx={10} fill="#0a0a0a" stroke="#2a2a2a" strokeWidth={1.3} />
        <circle cx={72} cy={172} r={10} fill="none" stroke="#444" strokeWidth={1.2} />
        <text x={72} y={176} textAnchor="middle" fill="#ccc" fontSize={9} fontWeight={700}>
          F
        </text>
        <text x={92} y={168} fill="#fff" fontSize={12} fontWeight={700}>
          TZS 100,000
        </text>
        <text x={92} y={184} fill="#666" fontFamily={MONO} fontSize={8}>
          → Mama Neema · RECEIVED ✓ · leo 14:03
        </text>
        {/* marked, not murdered */}
        <g className="flag" style={{ opacity: 0 }}>
          <rect x={218} y={158} width={86} height={20} rx={10} fill="#000" stroke={ACCENT} strokeWidth={1.2} />
          <text x={261} y={171} textAnchor="middle" fill={ACCENT} fontFamily={MONO} fontSize={8}>
            hidden = true
          </text>
        </g>
        <g className="ushahidi" style={{ opacity: 0 }}>
          <text x={253} y={140} textAnchor="middle" fill={BLUE} fontFamily={MONO} fontSize={8} letterSpacing={1}>
            USHAHIDI
          </text>
          {/* hand-drawn receipt instead of an emoji */}
          <g transform="translate(287 129)" stroke={BLUE} fill="none" strokeWidth={1}>
            <path d="M0 0 h9 v12 l-1.5 -1.6 l-1.5 1.6 l-1.5 -1.6 l-1.5 1.6 l-1.5 -1.6 l-1.5 1.6 Z" strokeLinejoin="round" />
            <path d="M2 3.5 h5 M2 6.5 h5" />
          </g>
        </g>
      </g>

      {/* the swiping finger */}
      <circle className="finger" cx={300} cy={172} r={9} fill="#fff" style={{ opacity: 0 }} />

      {/* the denial */}
      <g className="bubble" style={{ opacity: 0, transform: 'translateY(10px)' }}>
        <rect x={130} y={330} width={180} height={36} rx={18} fill="#111" stroke="#333" strokeWidth={1.2} />
        <path d="M 296 366 l 10 14 l -22 -8 z" fill="#111" stroke="#333" strokeWidth={1.2} />
        <text x={220} y={353} textAnchor="middle" fill="#eee" fontSize={12}>
          sijapokea kitu 🙄
        </text>
        <line className="bubble-x" x1={130} y1={330} x2={310} y2={366} stroke={DANGER} strokeWidth={2} pathLength={1} strokeDasharray={1} strokeDashoffset={1} />
      </g>

      <text className="tag" x={180} y={438} textAnchor="middle" fill={ACCENT} fontFamily={MONO} fontSize={10} letterSpacing={2} style={{ opacity: 0 }}>
        RECORDS HAZIDANGANYI
      </text>
    </svg>
  )
}
