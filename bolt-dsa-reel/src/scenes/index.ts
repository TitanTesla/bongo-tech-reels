import type { SceneDef } from './types'
import HookScene from './HookScene'
import GraphScene from './GraphScene'
import GridScene from './GridScene'
import DijkstraScene from './DijkstraScene'
import SortScene from './SortScene'
import PayoffScene from './PayoffScene'

// VO script: modern Gen-Z Swahili/English code-switching, Dar es Salaam
// setting. Niche tech terms (graph, spatial index, Dijkstra, sorting,
// data structures, algorithms) stay in English on purpose.
export const SCENES: SceneDef[] = [
  {
    id: 'hook',
    tab: 'Hook',
    title: '00 · Match ya sekunde mbili',
    stamp: '0:00 – 0:06',
    Component: HookScene,
    lines: [
      { t: 0, text: "Unafungua Bolt, una-tap 'Tafuta Ride.'" },
      { t: 1.8, text: 'Sekunde mbili tu — dereva ame-lock-iwa.' },
      { t: 4.4, text: 'Kati ya maelfu ya magari, bajaji na boda zinazo-move Dar nzima.' },
      { t: 6.2, text: 'Vipi?! Sio uchawi. Ni data structures na algorithms.' },
    ],
  },
  {
    id: 'graph',
    tab: 'Graph',
    title: '01 · Dar ni graph',
    stamp: '0:06 – 0:18',
    Component: GraphScene,
    lines: [
      { t: 0, text: 'Kwanza — Dar nzima ina-store-iwa kwenye system kama graph.' },
      { t: 3.2, text: 'Dots ni makutano. Lines ni barabara.' },
      { t: 5.6, text: 'Wewe ni dot moja. Dereva wako ni dot nyingine.' },
      { t: 9.2, text: 'Kila DSA course inaanza na graphs — sasa unajua kwanini.' },
    ],
  },
  {
    id: 'grid',
    tab: 'Spatial index',
    title: '02 · Tafuta kidogo, pata haraka',
    stamp: '0:18 – 0:30',
    Component: GridScene,
    lines: [
      { t: 0, text: 'Ku-check kila ride Dar nzima? Aisee, itachukua milele.' },
      { t: 2.4, text: 'Kwa hiyo ramani inakatwa vipande — grid.' },
      { t: 4.8, text: 'Cells za karibu yako tu ndizo zina-search-iwa.' },
      { t: 7.0, text: 'Rides 10,000 zinakuwa 12 — ndani ya milliseconds.' },
      { t: 9.6, text: 'Hiyo ndiyo kazi ya data structure — heavy lifting.' },
    ],
  },
  {
    id: 'dijkstra',
    tab: 'Dijkstra',
    title: '03 · Njia fupi zaidi',
    stamp: '0:30 – 0:42',
    Component: DijkstraScene,
    lines: [
      { t: 0, text: 'Umepata dereva. Sasa — njia ya haraka kutoka Mwenge hadi Kariakoo.' },
      { t: 2.4, text: "Dijkstra's algorithm inasambaa kutoka kwako kama mawimbi…" },
      { t: 5.4, text: '…ikipima kila barabara kwa cost yake.' },
      { t: 7.5, text: 'Ina-lock njia rahisi zaidi — hata foleni ya Ubungo inaepukwa.' },
      { t: 10.2, text: 'Algorithm ile ile wanayokuuliza kwenye Google interviews.' },
    ],
  },
  {
    id: 'sort',
    tab: 'Sorting',
    title: '04 · Sort, chagua, nauli',
    stamp: '0:42 – 0:52',
    Component: SortScene,
    lines: [
      { t: 0, text: 'Madereva 12 wako area yako. Nani ata-take ride?' },
      { t: 2.9, text: 'Wana-sort-iwa kwa ETA — nani atafika kwanza.' },
      { t: 5.5, text: 'Frank Abeid na boda yake — best match, locked.' },
      { t: 6.6, text: 'Nauli imeshapigwa hesabu kabla hujapepesa macho.' },
      { t: 8.7, text: "Graphs, grids, sorting, shortest path. Hiyo ndiyo DSA." },
    ],
  },
  {
    id: 'payoff',
    tab: 'Payoff',
    title: '05 · Ride ya nyumbani',
    stamp: '0:52 – 1:00',
    Component: PayoffScene,
    lines: [
      { t: 0, text: 'Dereva anakuja — algorithm imemaliza kazi yake.' },
      { t: 2.8, text: 'Kila app unayotumia — Bolt, IG, M-Pesa — ni DSA ndani.' },
      { t: 5.8, text: 'DSA si theory. Ni ride yako ya kwenda nyumbani.' },
      { t: 7.6, text: 'Follow kwa breakdown mpya kila wiki.' },
    ],
  },
]
