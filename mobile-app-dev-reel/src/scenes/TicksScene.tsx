import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { sfx, type SfxName } from '../audio/sfx'
import { ACCENT, DANGER, MONO, TICK, type SceneProps } from './types'

// station x-positions along the journey: simu yako → server → simu yake → macho
const STATIONS = [45, 136, 227, 316]

export default function TicksScene({ onReady }: SceneProps) {
  const ref = useRef<SVGSVGElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true, defaults: { ease: 'power2.out' } })
      const cue = (t: number, name: SfxName, p?: number) => tl.call(() => sfx.play(name, p), [], t)
      const hop = (at: number, toX: number, dur: number) =>
        tl.to('.trav', { x: toX - STATIONS[0], duration: dur, ease: 'power1.inOut' }, at)

      cue(0.3, 'ui')
      cue(1.3, 'draw')
      cue(2.0, 'pops')
      cue(3.4, 'whoosh')
      cue(4.4, 'note', 659)
      cue(5.6, 'whoosh')
      cue(6.6, 'note', 784)
      cue(8.0, 'whoosh')
      cue(8.8, 'ding')
      cue(9.6, 'thud')

      // the myth, struck through
      tl.to('.myth', { autoAlpha: 1, y: 0, duration: 0.4 }, 0.3)
      tl.to('.myth-x', { strokeDashoffset: 0, duration: 0.35 }, 1.4)
      tl.to('.myth', { autoAlpha: 0.35, duration: 0.4 }, 1.7)

      // the journey map
      tl.to('.st', { autoAlpha: 1, duration: 0.3, stagger: 0.12 }, 2.0)
      tl.to('.seg', { autoAlpha: 1, duration: 0.3 }, 2.5)
      tl.to('.trav', { autoAlpha: 1, duration: 0.25 }, 3.0)

      // hop 1 — the server signs
      hop(3.4, STATIONS[1], 0.9)
      tl.to('.tickA', { autoAlpha: 1, strokeDashoffset: 0, duration: 0.35 }, 4.4)
      tl.to('.lab-0', { autoAlpha: 1, duration: 0.3 }, 4.5)

      // hop 2 — their phone signs (still unread!)
      hop(5.6, STATIONS[2], 0.9)
      tl.to('.lab-0', { autoAlpha: 0, duration: 0.25 }, 5.7)
      tl.to('.tickB', { autoAlpha: 1, strokeDashoffset: 0, duration: 0.35 }, 6.6)
      tl.to('.lab-1', { autoAlpha: 1, duration: 0.3 }, 6.7)

      // hop 3 — their eyes
      hop(8.0, STATIONS[3], 0.8)
      tl.to('.lab-1', { autoAlpha: 0, duration: 0.25 }, 8.1)
      tl.to(['.tickA', '.tickB'], { stroke: TICK, duration: 0.3 }, 8.8)
      tl.to('.eye', { scaleY: 0.1, transformOrigin: '50% 50%', duration: 0.12, yoyo: true, repeat: 1 }, 8.8)
      tl.to('.lab-2', { autoAlpha: 1, duration: 0.3 }, 9.0)

      tl.to('.cap', { autoAlpha: 1, y: 0, duration: 0.4 }, 9.6)
      tl.to({}, { duration: 0.6 }, 10.0) // hold → 10.6s

      onReady(tl)
    }, ref)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <svg ref={ref} viewBox="0 0 360 500" className="h-full w-full">
      <text x={180} y={56} textAnchor="middle" fill="#888" fontFamily={MONO} fontSize={10} letterSpacing={2.5}>
        SIRI #4 · ACKNOWLEDGMENTS
      </text>

      {/* the myth */}
      <g className="myth" style={{ opacity: 0, transform: 'translateY(8px)' }}>
        <text x={180} y={104} textAnchor="middle" fill="#fff" fontSize={14}>
          tick mbili = amesoma??
        </text>
        <line className="myth-x" x1={100} y1={99} x2={260} y2={99} stroke={DANGER} strokeWidth={2} pathLength={1} strokeDasharray={1} strokeDashoffset={1} />
      </g>

      {/* journey segments */}
      {[
        [60, 119],
        [153, 212],
        [242, 300],
      ].map(([a, b]) => (
        <line key={a} className="seg" x1={a} y1={215} x2={b} y2={215} stroke="#222" strokeWidth={1.2} style={{ opacity: 0 }} />
      ))}

      {/* stations */}
      <g className="st" style={{ opacity: 0 }}>
        <rect x={33} y={194} width={24} height={42} rx={5} fill="none" stroke="#666" strokeWidth={1.3} />
        <text x={45} y={256} textAnchor="middle" fill="#666" fontFamily={MONO} fontSize={6.5} letterSpacing={1}>
          SIMU YAKO
        </text>
      </g>
      <g className="st" style={{ opacity: 0 }}>
        <path d="M 124 224 A 8 8 0 0 1 126 208 A 10 10 0 0 1 146 204 A 7 7 0 0 1 150 224 Z" fill="none" stroke="#666" strokeWidth={1.3} strokeLinejoin="round" />
        <text x={136} y={256} textAnchor="middle" fill="#666" fontFamily={MONO} fontSize={6.5} letterSpacing={1}>
          SERVER
        </text>
      </g>
      <g className="st" style={{ opacity: 0 }}>
        <rect x={215} y={194} width={24} height={42} rx={5} fill="none" stroke="#666" strokeWidth={1.3} />
        <text x={227} y={256} textAnchor="middle" fill="#666" fontFamily={MONO} fontSize={6.5} letterSpacing={1}>
          SIMU YAKE
        </text>
      </g>
      <g className="st" style={{ opacity: 0 }}>
        <g className="eye" transform="translate(316 215)">
          <path d="M -13 0 Q 0 -9 13 0 Q 0 9 -13 0 Z" fill="none" stroke="#666" strokeWidth={1.3} />
          <circle r={3} fill="#666" />
        </g>
        <text x={316} y={256} textAnchor="middle" fill="#666" fontFamily={MONO} fontSize={6.5} letterSpacing={1}>
          AMESOMA
        </text>
      </g>

      {/* the traveling message — outer group for GSAP, inner for the base position */}
      <g className="trav" style={{ opacity: 0 }}>
        <g transform={`translate(${STATIONS[0]} 215)`}>
          <rect x={-8} y={-6} width={16} height={12} rx={4} fill="#000" stroke={ACCENT} strokeWidth={1.4} />
        </g>
      </g>

      {/* the receipts — drawn as strokes, never a font glyph */}
      <polyline className="tickA" points="150,330 158,339 176,317" fill="none" stroke="#9aa0a6" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1} style={{ opacity: 0 }} />
      <polyline className="tickB" points="172,330 180,339 198,317" fill="none" stroke="#9aa0a6" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1} style={{ opacity: 0 }} />

      {/* what each receipt means */}
      <text className="lab-0" x={180} y={378} textAnchor="middle" fill="#888" fontFamily={MONO} fontSize={9} style={{ opacity: 0 }}>
        server imepokea
      </text>
      <text className="lab-1" x={180} y={378} textAnchor="middle" fill="#888" fontFamily={MONO} fontSize={9} style={{ opacity: 0 }}>
        simu yake imepokea — hajaisoma
      </text>
      <text className="lab-2" x={180} y={378} textAnchor="middle" fill={TICK} fontFamily={MONO} fontSize={9} style={{ opacity: 0 }}>
        sasa ndio amesoma
      </text>

      <text className="cap" x={180} y={432} textAnchor="middle" fill={ACCENT} fontFamily={MONO} fontSize={10} letterSpacing={1} style={{ opacity: 0, transform: 'translateY(8px)' }}>
        KILA KITUO KINA-SIGN RECEIPT
      </text>
    </svg>
  )
}
