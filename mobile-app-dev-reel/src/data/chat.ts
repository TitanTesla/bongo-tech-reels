/**
 * The shared WhatsApp world — every scene reads from this one dataset so
 * the reel feels like a single continuous story instead of six clips.
 */

/** The chat the whole episode lives in. */
export const CONTACT = 'NEEMA'

/** The hook message — sent on airplane mode, stuck with the clock icon. */
export const MSG_HOOK = 'Uko wapi?'

/** Scene 3's message — carries the single canvas emoji of the episode. */
export const MSG_OPT = 'Nakuja sasa hivi 😂'

/** Chat list rows for the local-database scene. */
export const CHAT_LIST = [
  { name: 'Neema', preview: 'Uko wapi?' },
  { name: 'Baba Riziki', preview: 'Sawa kabisa' },
  { name: 'Wamachinga Crew', preview: 'Kesho saa nne' },
]

/** Exponential backoff steps shown in the sync-queue scene. */
export const RETRY_STEPS = ['2s', '4s', '8s']

/** The dead data bundle referenced in the local-db scene. */
export const BUNDLE = 'TZS 1,000'
