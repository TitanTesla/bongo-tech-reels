import type { SceneDef } from './types'
import HookScene from './HookScene'
import LedgerScene from './LedgerScene'
import AtomicScene from './AtomicScene'
import IndexScene from './IndexScene'
import DeleteScene from './DeleteScene'
import PayoffScene from './PayoffScene'

// VO script: modern Gen-Z Swahili/English code-switching, Dar es Salaam
// setting, 100% inside the Tigo Pesa / Mixx by Yas world. Every concept is
// taught by contrast — the chaos BILA it first, then the concept as the fix.
// Niche tech terms (database, transaction, atomicity, index, row, SQL)
// stay in English on purpose.
export const SCENES: SceneDef[] = [
  {
    id: 'hook',
    tab: 'Hook',
    title: '00 · Hakuna pesa inayosafiri',
    stamp: '0:00 – 0:07',
    Component: HookScene,
    lines: [
      { t: 0, text: 'Una-send TZS 50,000 kwa Mixx by Yas.' },
      { t: 1.4, text: 'Unadhani pesa ina-safiri hewani kwenda kwa mwenzako? 😳' },
      { t: 3.4, text: 'Hakuna kitu kinacho-safiri. Ni database ina-edit namba mbili.' },
      { t: 5.6, text: 'Na leo nakupa siri zake nne.' },
    ],
  },
  {
    id: 'ledger',
    tab: 'Ledger',
    title: '01 · Balance si pesa iliyokaa',
    stamp: '0:07 – 0:19',
    Component: LedgerScene,
    lines: [
      { t: 0, text: 'Siri ya kwanza: ile balance unayoiona kwenye Mixx —' },
      { t: 1.4, text: '— haimaanishi kuna pesa zako zimekaa mahali fulani zikikusubiri.' },
      { t: 3.8, text: "Hapana. 😅 Hakuna 'kachumba ka Frank' kenye TZS 113,500." },
      { t: 5.8, text: 'Kilichopo ni records — kila ulichopokea, kila ulichotuma.' },
      { t: 8.4, text: 'Kama daftari la deni la mangi — halisahau kitu.' },
      { t: 10.0, text: 'Balance ni jumla tu ya story hiyo.' },
    ],
  },
  {
    id: 'atomic',
    tab: 'Atomicity',
    title: '02 · Yote au hakuna',
    stamp: '0:19 – 0:32',
    Component: AtomicScene,
    lines: [
      { t: 0, text: 'Siri ya pili: atomicity. Hebu fikiria bila hii…' },
      { t: 2.0, text: 'Unatuma TZS 50,000… network inakufa Ubungo.' },
      { t: 4.4, text: 'Wewe umekatwa. Mama Neema hajapokea. Pesa iko hewani. 💀' },
      { t: 7.2, text: 'Ndio maana kuna rule: transaction inafanyika YOTE, au haifanyiki kabisa.' },
      { t: 10.4, text: 'Ukikatwa — mwenzako amepokea. Hakuna nusu-nusu.' },
    ],
  },
  {
    id: 'index',
    tab: 'Index',
    title: '03 · Foleni au millisecond',
    stamp: '0:32 – 0:44',
    Component: IndexScene,
    lines: [
      { t: 0, text: 'Siri ya tatu: index. Watu zaidi ya millioni 10 kwenye system.' },
      { t: 2.4, text: 'Bila index: database inasoma account ya kila mtu — mmoja mmoja.' },
      { t: 4.6, text: 'Jibu baada ya masaa. Nchi nzima kwenye foleni. 😭' },
      { t: 7.2, text: 'Na index? Kama contacts kwenye simu — una-jump moja kwa moja kwa jina.' },
      { t: 9.4, text: 'Jibu — millisecond.' },
    ],
  },
  {
    id: 'delete',
    tab: 'Delete',
    title: '04 · Delete ni uongo',
    stamp: '0:44 – 0:54',
    Component: DeleteScene,
    lines: [
      { t: 0, text: 'Siri ya nne — hii itakushtua: uki-delete kitu… hakija-deleted.' },
      { t: 2.6, text: "Database ina-mark tu: 'usimwonyeshe huyu.'" },
      { t: 4.8, text: "Kama records zingefutika kweli — mpokeaji ana-delete history: 'sijapokea kitu.' 🙄" },
      { t: 6.9, text: 'Ndio maana history haipotei. Delete ni kujificha… si kufa.' },
    ],
  },
  {
    id: 'payoff',
    tab: 'Payoff',
    title: '05 · Kila kitu ni row',
    stamp: '0:54 – 1:00',
    Component: PayoffScene,
    lines: [
      { t: 0, text: 'Kila Mixx transfer, kila like, kila message — ni row kwenye database.' },
      { t: 2.4, text: 'SQL — language ya database — ilitengenezwa 1974. Ina-run dunia mpaka leo.' },
      { t: 5.0, text: 'Follow — Ep. 3 tunaingia kwenye passwords. 🔐' },
    ],
  },
]
