import { EDGES, NODES, edgeKey } from '../data/city'

/**
 * The street network. Edges are drawable (pathLength=1 + dash trick),
 * nodes pop in via their `r` attribute. Scenes target them with the
 * `.edge` / `.node` class names and per-element ids inside a gsap.context.
 */
export default function CityMap({
  edgeOpacity = 1,
  drawn = false,
}: {
  edgeOpacity?: number
  drawn?: boolean
}) {
  return (
    <g className="citymap">
      {EDGES.map(([a, b]) => (
        <line
          key={edgeKey(a, b)}
          id={edgeKey(a, b)}
          className="edge"
          x1={NODES[a].x}
          y1={NODES[a].y}
          x2={NODES[b].x}
          y2={NODES[b].y}
          stroke="#fff"
          strokeWidth={1}
          opacity={edgeOpacity}
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={drawn ? 0 : 1}
        />
      ))}
      {NODES.map((n) => (
        <circle
          key={n.id}
          id={`n-${n.id}`}
          className="node"
          cx={n.x}
          cy={n.y}
          r={drawn ? 3 : 0}
          fill="#0a0a0a"
          stroke="#fff"
          strokeWidth={1.2}
        />
      ))}
    </g>
  )
}
