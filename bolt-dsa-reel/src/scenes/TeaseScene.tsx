import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import CityMap from '../components/CityMap'
import { sfx, type SfxName } from '../audio/sfx'
import { ACCENT, MONO, type SceneProps } from './types'

// PART 1 · beat 8 — the tease: spatial indexing algorithms. An H3-style
// hexagon grid blooms over the map (R-Tree · Geohash · H3 ya Uber),
// then the CTA: like, follow, share, save — Part 2 inakuja. 7s.

const R = 30 // hex circumradius (pointy-top)

function hexPoints(cx: number, cy: number, r: number): string {
  return Array.from({ length: 6 }, (_, i) => {
    const a = ((60 * i - 30) * Math.PI) / 180
    return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`
  }).join(' ')
}

// honeycomb band across the middle of the map
const HEXES: { x: number; y: number; center?: boolean }[] = [
  { x: 50, y: 150 }, { x: 102, y: 150 }, { x: 154, y: 150 }, { x: 206, y: 150 }, { x: 258, y: 150 }, { x: 310, y: 150 },
  { x: 76, y: 195 }, { x: 128, y: 195 }, { x: 180, y: 195, center: true }, { x: 232, y: 195 }, { x: 284, y: 195 },
  { x: 50, y: 240 }, { x: 102, y: 240 }, { x: 154, y: 240 }, { x: 206, y: 240 }, { x: 258, y: 240 }, { x: 310, y: 240 },
]

const CHIPS = [
  { x: 22, w: 92, label: 'R-TREE', accent: false },
  { x: 124, w: 100, label: 'GEOHASH', accent: false },
  { x: 234, w: 104, label: 'H3 · UBER', accent: true },
]

export default function TeaseScene({ onReady }: SceneProps) {
  const ref = useRef<SVGSVGElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true, defaults: { ease: 'power2.out' } })
      const cue = (t: number, name: SfxName, p?: number) => tl.call(() => sfx.play(name, p), [], t)

      // sfx cues
      cue(0.2, 'thud')
      cue(0.5, 'draw')
      cue(0.7, 'pops')
      cue(1.6, 'blip', 740)
      cue(2.0, 'blip', 600)
      cue(2.5, 'blip', 700)
      cue(3.0, 'lock')
      cue(5.5, 'ding')
      cue(5.7, 'thud')

      // 1 — title + hexagons bloom over the city
      tl.to('.t-title', { autoAlpha: 1, y: 0, duration: 0.5 }, 0.2)
        .to('.t-sub', { autoAlpha: 1, duration: 0.4 }, 0.6)
      tl.fromTo(
        '.hex',
        { scale: 0.6, opacity: 0, transformOrigin: '50% 50%' },
        { scale: 1, opacity: 0.55, duration: 0.4, stagger: { each: 0.05, from: 'center' }, ease: 'back.out(1.6)' },
        0.5,
      )
      tl.to('.hex-center', { opacity: 1, stroke: ACCENT, duration: 0.35 }, 1.6)

      // 2 — the algorithm family, chip by chip
      CHIPS.forEach((_, i) => {
        tl.fromTo(`.chip-${i}`, { scale: 0.75, transformOrigin: '50% 50%' }, { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'back.out(2)' }, 2.0 + i * 0.5)
      })

      // 3 — CTA: like · follow · share · save → Part 2
      const icons = ['.i-like', '.i-follow', '.i-share', '.i-save']
      icons.forEach((sel, i) => {
        cue(4.3 + i * 0.18, 'blip', 520 + i * 110)
        tl.fromTo(sel, { scale: 0.5, transformOrigin: '50% 50%' }, { autoAlpha: 1, scale: 1, duration: 0.35, ease: 'back.out(2.2)' }, 4.3 + i * 0.18)
      })
      tl.to('.cta-words', { autoAlpha: 1, duration: 0.4 }, 5.0)
        .to('.part2', { autoAlpha: 1, y: 0, duration: 0.5 }, 5.5)
        .to('.part2-line', { strokeDashoffset: 0, duration: 0.4 }, 5.9)
        .to({}, { duration: 0.7 }) // hold → 7.0s

      onReady(tl)
    }, ref)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <svg ref={ref} viewBox="0 0 360 500" className="h-full w-full">
      <g opacity={0.14}>
        <CityMap drawn />
      </g>

      {/* title */}
      <g className="t-title" style={{ opacity: 0, transform: 'translateY(10px)' }}>
        <text x={180} y={46} textAnchor="middle" fill="#fff" fontSize={21} fontWeight={800}>
          SPATIAL INDEXING
        </text>
      </g>
      <text className="t-sub" x={180} y={66} textAnchor="middle" fill="#666" fontFamily={MONO} fontSize={9} letterSpacing={3} style={{ opacity: 0 }}>
        RAMANI INAKATWA VIPANDE — PART 2
      </text>

      {/* H3-style honeycomb */}
      {HEXES.map((h, i) => (
        <polygon
          key={i}
          className={`hex ${h.center ? 'hex-center' : ''}`}
          points={hexPoints(h.x, h.y, R)}
          fill="none"
          stroke={h.center ? '#fff' : '#888'}
          strokeWidth={h.center ? 1.6 : 1}
          opacity={0}
        />
      ))}

      {/* algorithm chips */}
      {CHIPS.map((c, i) => (
        <g key={i} className={`chip-${i}`} style={{ opacity: 0 }}>
          <rect x={c.x} y={300} width={c.w} height={32} rx={16} fill="none" stroke={c.accent ? ACCENT : '#555'} strokeWidth={c.accent ? 1.5 : 1.2} />
          <text x={c.x + c.w / 2} y={320} textAnchor="middle" fill={c.accent ? ACCENT : '#ccc'} fontFamily={MONO} fontSize={10} letterSpacing={1.5}>
            {c.label}
          </text>
        </g>
      ))}

      {/* CTA icons — like · follow · share · save */}
      <g className="i-like" style={{ opacity: 0 }}>
        <path
          d="M 111 391 L 103.5 383.5 A 4.6 4.6 0 0 1 110 377 L 111 378 L 112 377 A 4.6 4.6 0 0 1 118.5 383.5 Z"
          fill="none" stroke="#fff" strokeWidth={1.5} strokeLinejoin="round"
        />
      </g>
      <g className="i-follow" style={{ opacity: 0 }}>
        <circle cx={155} cy={379.5} r={3.4} fill="none" stroke="#fff" strokeWidth={1.5} />
        <path d="M 149 391 Q 149 385 155 385 Q 161 385 161 391" fill="none" stroke="#fff" strokeWidth={1.5} strokeLinecap="round" />
        <path d="M 164 380 h 6 M 167 377 v 6" stroke="#fff" strokeWidth={1.5} strokeLinecap="round" />
      </g>
      <g className="i-share" style={{ opacity: 0 }}>
        <path d="M 196 391 v -8 a 1.5 1.5 0 0 1 1.5 -1.5 h 3" fill="none" stroke="#fff" strokeWidth={1.5} strokeLinecap="round" />
        <path d="M 204 377 l 6 5 l -6 5 Z" fill="none" stroke="#fff" strokeWidth={1.5} strokeLinejoin="round" />
      </g>
      <g className="i-save" style={{ opacity: 0 }}>
        <path d="M 244 376.5 h 10 v 15 l -5 -4 l -5 4 Z" fill="none" stroke="#fff" strokeWidth={1.5} strokeLinejoin="round" />
      </g>

      <text className="cta-words" x={180} y={414} textAnchor="middle" fill="#999" fontFamily={MONO} fontSize={10} letterSpacing={3} style={{ opacity: 0 }}>
        LIKE · FOLLOW · SHARE · SAVE
      </text>

      {/* Part 2 */}
      <g className="part2" style={{ opacity: 0, transform: 'translateY(10px)' }}>
        <text x={180} y={455} textAnchor="middle" fill={ACCENT} fontSize={24} fontWeight={800}>
          PART 2 →
        </text>
      </g>
      <line className="part2-line" x1={140} y1={467} x2={220} y2={467} stroke={ACCENT} strokeWidth={2} pathLength={1} strokeDasharray={1} strokeDashoffset={1} />
    </svg>
  )
}
