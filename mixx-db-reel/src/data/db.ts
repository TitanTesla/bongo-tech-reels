/**
 * The shared world for this episode — every scene reads from here so the
 * reel feels like one continuous argument instead of seven clips.
 *
 * The story runs: you deposit 3,000 → send 2,000 to Fatuma → nothing
 * physically moves, two numbers just change → that store is a database →
 * everything else about you lives in one too.
 */

export const TZS = (n: number) => `TZS ${n.toLocaleString('en-US')}`

/** The opening deposit — the balance the hook interrogates. */
export const DEPOSIT = 3_000
/** What you send Fatuma in the worked example. */
export const TRANSFER = 2_000

export const YOU = { name: 'WEWE', start: 3_000 }
export const FATUMA = { name: 'FATUMA', start: 2_000 }

/** Balances after the transfer settles — derived, never hand-typed. */
export const YOU_AFTER = YOU.start - TRANSFER
export const FATUMA_AFTER = FATUMA.start + TRANSFER

/** "Taarifa zako" — what's sitting in a database somewhere, right now. */
export const YOUR_DATA = [
  { id: 'simu', label: 'namba ya simu' },
  { id: 'nida', label: 'NIDA' },
  { id: 'chats', label: 'chats' },
  { id: 'picha', label: 'picha' },
]

/** Where those databases physically sit. */
export const ABROAD = ['WhatsApp', 'Instagram']
export const LOCAL = ['Serikali']

/** The payoff — the three kinds, and what each is actually for. */
export const DB_KINDS = [
  { kind: 'DOCUMENT', product: 'MongoDB', note: 'taarifa kama document' },
  { kind: 'RELATIONAL', product: 'PostgreSQL', note: 'tables zenye uhusiano' },
  { kind: 'VECTOR', product: 'ChromaDB', note: 'AI kuelewa context' },
]
