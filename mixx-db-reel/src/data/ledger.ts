/**
 * The shared wallet world — every scene reads from this one dataset so the
 * reel feels like a single continuous story instead of six clips.
 */

export const TZS = (n: number) => `TZS ${n.toLocaleString('en-US')}`

/** Frank sends TZS 50,000 to Mama Neema in the hook and atomicity scenes. */
export const TRANSFER = 50_000

export const FRANK = { name: 'FRANK', start: 163_500 }
export const NEEMA = { name: 'MAMA NEEMA', start: 20_000 }

/** The ledger rows behind Frank's balance — they sum to BALANCE. */
export const LEDGER_ROWS = [
  { amount: '+120,000', label: 'mshahara', positive: true },
  { amount: '−4,000', label: 'bajaji', positive: false },
  { amount: '−2,500', label: 'chipsi kavu', positive: false },
]

export const BALANCE = 113_500
