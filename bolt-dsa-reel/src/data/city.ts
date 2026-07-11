// Shared city model used by every scene, so the "world" feels continuous
// across tabs. All coordinates live in the canvas viewBox: 0 0 360 500.

export interface CityNode {
  id: number
  x: number
  y: number
}

export const NODES: CityNode[] = [
  { id: 0, x: 40, y: 60 },
  { id: 1, x: 150, y: 45 },
  { id: 2, x: 250, y: 70 },
  { id: 3, x: 330, y: 50 },
  { id: 4, x: 60, y: 150 },
  { id: 5, x: 170, y: 140 },
  { id: 6, x: 270, y: 160 },
  { id: 7, x: 330, y: 140 },
  { id: 8, x: 30, y: 250 },
  { id: 9, x: 140, y: 240 }, // YOU
  { id: 10, x: 240, y: 250 },
  { id: 11, x: 325, y: 240 },
  { id: 12, x: 60, y: 340 },
  { id: 13, x: 170, y: 350 },
  { id: 14, x: 265, y: 330 },
  { id: 15, x: 330, y: 350 },
  { id: 16, x: 40, y: 450 },
  { id: 17, x: 150, y: 460 },
  { id: 18, x: 250, y: 440 },
  { id: 19, x: 330, y: 460 }, // DEST
]

export const EDGES: [number, number][] = [
  // horizontal streets
  [0, 1], [1, 2], [2, 3],
  [4, 5], [5, 6], [6, 7],
  [8, 9], [9, 10], [10, 11],
  [12, 13], [13, 14], [14, 15],
  [16, 17], [17, 18], [18, 19],
  // vertical avenues
  [0, 4], [4, 8], [8, 12], [12, 16],
  [1, 5], [5, 9], [9, 13], [13, 17],
  [2, 6], [6, 10], [10, 14], [14, 18],
  [3, 7], [7, 11], [11, 15], [15, 19],
  // diagonals for an organic feel
  [2, 5], [5, 10], [10, 13], [6, 11],
]

export const USER = 9
export const DEST = 19

// Dijkstra exploration frontier, ripple by ripple, out from USER.
export const WAVES: number[][] = [
  [9],
  [5, 8, 10, 13],
  [1, 4, 6, 11, 14, 12, 17],
  [0, 2, 7, 15, 18, 16],
  [3, 19],
]

// Cheapest path USER -> DEST, as node ids.
export const SHORTEST_PATH = [9, 13, 14, 18, 19]

// Idle drivers scattered across the map — a proper Dar mix of cars,
// bajaji and bodaboda. `near` = inside the highlighted 3x3 grid block
// around the rider (x: 0-270, y: 100-400).
import type { VehicleKind } from '../components/Vehicle'

export const CARS: { x: number; y: number; near: boolean; kind: VehicleKind }[] = [
  { x: 60, y: 80, near: false, kind: 'car' },
  { x: 300, y: 55, near: false, kind: 'boda' },
  { x: 210, y: 120, near: true, kind: 'bajaji' },
  { x: 90, y: 200, near: true, kind: 'car' },
  { x: 185, y: 175, near: true, kind: 'boda' },
  { x: 105, y: 300, near: true, kind: 'bajaji' },
  { x: 200, y: 280, near: true, kind: 'boda' }, // Frank Abeid — the match
  { x: 310, y: 200, near: false, kind: 'car' },
  { x: 45, y: 380, near: true, kind: 'boda' },
  { x: 230, y: 415, near: false, kind: 'bajaji' },
  { x: 312, y: 320, near: false, kind: 'car' },
  { x: 150, y: 435, near: false, kind: 'boda' },
  { x: 290, y: 472, near: false, kind: 'bajaji' },
  { x: 28, y: 140, near: false, kind: 'car' },
]

export const node = (id: number) => NODES[id]

export const edgeKey = (a: number, b: number) =>
  a < b ? `e-${a}-${b}` : `e-${b}-${a}`
