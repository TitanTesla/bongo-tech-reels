import type { SceneDef } from './types'
import HookScene from './HookScene'
import LocalDbScene from './LocalDbScene'
import OptimisticScene from './OptimisticScene'
import QueueScene from './QueueScene'
import TicksScene from './TicksScene'
import PayoffScene from './PayoffScene'

// VO script: modern Gen-Z Swahili/English code-switching, Dar es Salaam
// setting, 100% inside the WhatsApp world. One concept — offline-first
// (the app is built on your phone, the network is just a courier) — and
// every siri is a branch of it, taught by contrast: the chaos BILA it
// first, then the concept as the fix. Niche tech terms (database,
// optimistic UI, queue, retry, acknowledgment) stay in English. Each
// line carries an `en` translation for the script panel.
export const SCENES: SceneDef[] = [
  {
    id: 'hook',
    tab: 'Hook',
    title: '00 · Tuma message bila network',
    stamp: '0:00 – 0:07',
    Component: HookScene,
    lines: [
      { t: 0, text: 'Fanya hivi sasa hivi: washa airplane mode.', en: 'Try this right now: turn on airplane mode.' },
      { t: 1.6, text: 'Andika message kwa WhatsApp. Bonyeza send. 😳', en: 'Type a WhatsApp message. Hit send.' },
      { t: 3.2, text: 'App haija-crash — message iko pale, na kasaa kadogo.', en: "The app doesn't crash — the message sits there, with a tiny clock." },
      { t: 5.0, text: 'Kama hakuna network… imeenda wapi?', en: "If there's no network… where did it go?" },
      { t: 6.2, text: 'Leo nakupa siri 4 za mobile apps.', en: 'Today I give you the 4 secrets of mobile apps.' },
    ],
  },
  {
    id: 'localdb',
    tab: 'Local DB',
    title: '01 · Database ndani ya simu',
    stamp: '0:07 – 0:19',
    Component: LocalDbScene,
    lines: [
      { t: 0, text: "Siri ya kwanza: chats zako haziko 'kwenye internet.'", en: "Secret #1: your chats don't live 'on the internet.'" },
      { t: 2.2, text: 'Kuna database kamili ndani ya simu yako — kila chat imeandikwa humu.', en: "There's a full database inside your phone — every chat is written right here." },
      { t: 4.4, text: 'Ukifungua chat ya mwaka jana — hu-download kitu. Unasoma simu yako mwenyewe.', en: "Open last year's chat — you download nothing. You're reading your own phone." },
      { t: 6.8, text: 'Bila hii: kila chat ni spinner — unasubiri network ya daladala. 😭', en: 'Without it: every chat is a spinner — waiting on daladala-grade network.' },
      { t: 9.4, text: 'Na local database? Bundle ya TZS 1,000 imeisha — chats zinafunguka. Instant.', en: 'With a local database? Your TZS 1,000 bundle is dead — chats still open. Instant.' },
    ],
  },
  {
    id: 'optimistic',
    tab: 'Optimistic UI',
    title: '02 · App inakudanganya',
    stamp: '0:19 – 0:32',
    Component: OptimisticScene,
    lines: [
      { t: 0, text: 'Siri ya pili — hii kali: ukibonyeza send, message ina-appear mara moja.', en: 'Secret #2 — the wild one: you hit send, the message appears instantly.' },
      { t: 2.6, text: 'Lakini ukweli? Haijaenda popote bado. 😅', en: "The truth? It hasn't gone anywhere yet." },
      { t: 4.6, text: 'App ina-assume itafika — inakuonyesha success kabla haijatokea.', en: "The app assumes it'll arrive — it shows you success before it happens." },
      { t: 7.0, text: 'Inaitwa optimistic UI. Bila hii: kila message ni sekunde 3 za spinner.', en: "It's called optimistic UI. Without it: every message is 3 seconds of spinner." },
      { t: 9.8, text: 'Ungeitupa app wiki ya kwanza.', en: "You'd have deleted the app in week one." },
      { t: 11.0, text: "Kile kasaa kadogo? Ndio ukweli — 'bado sijaondoka.'", en: 'That tiny clock? That\'s the truth — "I haven\'t left yet."' },
    ],
  },
  {
    id: 'queue',
    tab: 'Sync Queue',
    title: '03 · Foleni ndani ya simu',
    stamp: '0:32 – 0:44',
    Component: QueueScene,
    lines: [
      { t: 0, text: 'Siri ya tatu: zile messages za airplane mode hazikufa.', en: "Secret #3: those airplane-mode messages didn't die." },
      { t: 2.2, text: 'Ziliingia kwenye queue — foleni ndani ya simu yako.', en: 'They joined a queue — a waiting line inside your phone.' },
      { t: 4.4, text: 'Ukipata network — zina-fly zote, moja moja, kwa order.', en: 'The moment you get network — they all fly, one by one, in order.' },
      { t: 6.5, text: 'Ikikatika katikati? App ina-retry yenyewe — 2s… 4s… 8s. Hujui hata kimetokea.', en: 'Drops mid-flight? The app retries on its own — 2s… 4s… 8s. You never even know.' },
      { t: 9.8, text: 'Bila queue: kila message iliyokosa network — imekufa. Unaandika upya. 💀', en: 'Without the queue: every message that missed network — dead. You retype it yourself.' },
    ],
  },
  {
    id: 'ticks',
    tab: 'Ticks',
    title: '04 · Ticks ni receipts',
    stamp: '0:44 – 0:54',
    Component: TicksScene,
    lines: [
      { t: 0, text: 'Siri ya nne: tick mbili haimaanishi amesoma.', en: 'Secret #4: two ticks do NOT mean they read it.' },
      { t: 2.2, text: 'Ticks ni acknowledgments — receipts za safari ya message.', en: "Ticks are acknowledgments — receipts from the message's journey." },
      { t: 4.6, text: 'Tick moja: server imepokea. Tick mbili: simu yake imepokea — hajaisoma bado.', en: 'One tick: the server received it. Two ticks: their phone received it — still unread.' },
      { t: 7.6, text: 'Blue ndio macho yake. Kila kituo kina-sign receipt. 👀', en: 'Blue is their eyes. Every checkpoint signs a receipt.' },
    ],
  },
  {
    id: 'payoff',
    tab: 'Payoff',
    title: '05 · App haiitaji network',
    stamp: '0:54 – 1:00',
    Component: PayoffScene,
    lines: [
      { t: 0, text: 'App haijengwi juu ya network — inajengwa juu ya simu yako.', en: "An app isn't built on the network — it's built on your phone." },
      { t: 2.2, text: 'Ile database ndani yake? SQLite — iko kwenye kila simu duniani.', en: "That database inside it? SQLite — it's in every phone on Earth." },
      { t: 4.6, text: 'Follow — Ep. 4 tunavunja passwords. 🔐', en: 'Follow — Ep. 4 we crack passwords.' },
    ],
  },
]
