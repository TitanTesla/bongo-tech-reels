import type { ReactElement } from 'react'

export type VehicleKind = 'car' | 'boda' | 'bajaji'

/**
 * Minimal side-view silhouettes drawn around the origin (~22-24 units wide).
 * Every shape uses `currentColor`, so scenes tint a whole vehicle by
 * animating `color` on the parent <g>.
 */
export function VehicleBody({ kind }: { kind: VehicleKind }): ReactElement {
  if (kind === 'car') {
    return (
      <g>
        <path
          d="M -11 3 L -11 0 Q -11 -2 -8.5 -2.4 L -5.5 -2.8 Q -3.5 -5.8 0 -5.8 L 3.5 -5.8 Q 6.5 -5.5 8.2 -2.7 L 10 -2 Q 11 -1.6 11 0 L 11 3 Z"
          fill="currentColor"
        />
        <rect x="-3.2" y="-4.6" width="5.8" height="2.4" rx="0.9" fill="#000" />
        <circle cx="-6" cy="3.2" r="2.4" fill="currentColor" />
        <circle cx="6" cy="3.2" r="2.4" fill="currentColor" />
        <circle cx="-6" cy="3.2" r="0.9" fill="#000" />
        <circle cx="6" cy="3.2" r="0.9" fill="#000" />
      </g>
    )
  }
  if (kind === 'boda') {
    return (
      <g fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="-6.5" cy="3" r="3" />
        <circle cx="6.5" cy="3" r="3" />
        <path d="M -6.5 3 L -2.5 -1.6 L 2.2 -1.6 L 6.5 3" />
        <path d="M -6 -3 L -1.6 -3" strokeWidth="2" />
        <path d="M 3.4 -1.6 L 5.6 -4.8" />
        <path d="M 4.4 -5.2 L 6.8 -4.4" />
      </g>
    )
  }
  // bajaji — the three-wheeler with its canopy cabin
  return (
    <g>
      <path
        d="M -9 3 L -9 -1.5 Q -9 -5.5 -5 -5.5 L 2.5 -5.5 Q 4.6 -5.5 5.7 -3.6 L 7.6 -0.4 Q 8 0.4 8 1.4 L 8 3 Z"
        fill="currentColor"
      />
      <path d="M 0.8 -4.2 L 3 -4.2 Q 4.2 -4.2 4.8 -3.1 L 5.8 -1.4 L 0.8 -1.4 Z" fill="#000" />
      <circle cx="-4.6" cy="3.6" r="2.2" fill="currentColor" />
      <circle cx="4.8" cy="3.6" r="2.2" fill="currentColor" />
      <circle cx="-4.6" cy="3.6" r="0.8" fill="#000" />
      <circle cx="4.8" cy="3.6" r="0.8" fill="#000" />
    </g>
  )
}

/** Head-and-shoulders profile outline for driver cards. */
export function DriverAvatar(): ReactElement {
  return (
    <g fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
      <circle cx="0" cy="-3" r="3.1" />
      <path d="M -5.6 7 Q -5.6 1.6 0 1.6 Q 5.6 1.6 5.6 7" />
    </g>
  )
}
