import type { SceneDef } from './types'
import HookScene from './HookScene'
import DsaScene from './DsaScene'
import BigOScene from './BigOScene'
import GraphScene from './GraphScene'
import BruteScene from './BruteScene'
import TeaseScene from './TeaseScene'

// PART 1 — "Nyuma ya pazia" (8 script beats over exactly 60s).
// VO script: modern Gen-Z Swahili/English code-switching, Dar es Salaam
// setting. Niche tech terms (graph, Big O, data structures, algorithms,
// spatial indexing) stay in English on purpose. Lines mirror the
// "DSA reel script.md" Part 1 wording so the panel doubles as a VO sheet.
export const SCENES: SceneDef[] = [
  {
    id: 'hook',
    tab: 'Hook',
    title: '00 · Nyuma ya pazia',
    stamp: '0:00 – 0:10',
    Component: HookScene,
    lines: [
      { t: 0, text: 'Ushawahi kujiuliza pale unapo-request Bolt — nini kinatokea nyuma ya pazia?' },
      { t: 4.5, text: 'Ndani ya sekunde mbili tu, dereva anapatikana eneo lako — kati ya maelfu Dar nzima.' },
    ],
  },
  {
    id: 'dsa',
    tab: 'Siri = DSA',
    title: '01 · Building blocks',
    stamp: '0:10 – 0:22',
    Component: DsaScene,
    lines: [
      { t: 0, text: 'Siri ni Data Structures and Algorithms — building blocks of programming.' },
      { t: 3.8, text: 'Data structure — data ya aina gani, ikae vipi kwenye memory.' },
      { t: 7.8, text: 'Algorithm — steps zipi zitatumika ku-process hizo data kwa muda mfupi na memory kidogo.' },
    ],
  },
  {
    id: 'bigo',
    tab: 'Big O',
    title: '02 · Kipimo cha ufanisi',
    stamp: '0:22 – 0:32',
    Component: BigOScene,
    lines: [
      { t: 0, text: 'Ufanisi wa algorithm unapimwa na Big O notation.' },
      { t: 2.8, text: 'Inaonyesha jinsi muda na memory vinavyoongezeka kadri data inavyoongezeka.' },
      { t: 6.4, text: 'Hii ndiyo inaamua algorithm inafaa au haifai kwa tatizo liliopo.' },
    ],
  },
  {
    id: 'graph',
    tab: 'Graph',
    title: '03 · Dar ni graph',
    stamp: '0:32 – 0:42',
    Component: GraphScene,
    lines: [
      { t: 0, text: 'Mfano — mji kama Dar-es-Salaam unaweza kutumia data structure ya Graph.' },
      { t: 3.2, text: 'Dots ni makutano. Lines ni barabara.' },
      { t: 6.4, text: 'Wewe ni dot moja — dereva wako ni dot nyingine.' },
    ],
  },
  {
    id: 'brute',
    tab: 'Brute force',
    title: '04 · Rahisi kifikra, gharama kubwa',
    stamp: '0:42 – 0:53',
    Component: BruteScene,
    lines: [
      { t: 0, text: 'Ku-check madereva wote Dar nzima mpaka umpate wa karibu — solution rahisi kifikra…' },
      { t: 3.4, text: '…ila time na space complexity zitazidi kuwa kubwa kadri madereva wanavyoongezeka.' },
      { t: 6.2, text: 'Badala ya sekunde mbili, kupata usafiri inaweza kuchukua dakika kadhaa.' },
      { t: 8.2, text: 'Fikiria algorithm kama formula ya hesabu — tunataka formula fupi inayotupa jibu sahihi kwa haraka.' },
    ],
  },
  {
    id: 'tease',
    tab: 'Spatial index',
    title: '05 · Karibu Part 2',
    stamp: '0:53 – 1:00',
    Component: TeaseScene,
    lines: [
      { t: 0, text: 'Algorithms zinazotumika hapa ni spatial indexing — R-Tree, Geohash, na H3 ambayo Uber wanatumia.' },
      { t: 4.2, text: 'Like, follow, share na save kwa Part 2.' },
    ],
  },
]
