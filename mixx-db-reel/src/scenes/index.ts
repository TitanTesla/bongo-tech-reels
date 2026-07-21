import type { SceneDef } from './types'
import HookScene from './HookScene'
import RevealScene from './RevealScene'
import TransferScene from './TransferScene'
import DatabaseScene from './DatabaseScene'
import WhereScene from './WhereScene'
import BreachScene from './BreachScene'
import KindsScene from './KindsScene'

// VO script, verbatim from script.md, split into lines that land on the
// beat they describe. Informal Gen-Z Swahili; the niche terms (database,
// table, document/relational/vector, MongoDB, PostgreSQL, ChromaDB) stay
// in English on purpose, and all of them are held back until the payoff.
//
// Runtime is ~81s total — this episode is deliberately not 60s-locked.
export const SCENES: SceneDef[] = [
  {
    id: 'hook',
    tab: 'Hook',
    title: '00 · Hakuna kisanduku',
    stamp: '0:00 – 0:11',
    Component: HookScene,
    lines: [
      { t: 0, text: 'Ukiweka 3,000 Tigo Pesa afu ukaenda kuangalia balance yako kwenye app.' },
      { t: 4.0, text: 'Jua kwamba hakuna sehemu kwenye ofisi za Tigo —' },
      { t: 6.6, text: '— ambapo kuna kisanduku chenye pesa zako in cash.' },
    ],
  },
  {
    id: 'reveal',
    tab: 'Reveal',
    title: '01 · Hakuna kinachosafiri',
    stamp: '0:11 – 0:22',
    Component: RevealScene,
    lines: [
      { t: 0, text: 'Najua hio ni common sense…' },
      { t: 1.8, text: '…but what if nkikwambia kwamba unapomtumia mtu pesa hakuna actually unachotuma?' },
      { t: 6.2, text: 'Kinachofanyika ni kwamba database ina update number kwenye account mbili tofauti.' },
    ],
  },
  {
    id: 'transfer',
    tab: 'Transfer',
    title: '02 · Namba tu zimebadilika',
    stamp: '0:22 – 0:37',
    Component: TransferScene,
    lines: [
      { t: 0, text: 'Kama hapo awali ulikuwa na 3000TZS na Fatuma 2000TZS.' },
      { t: 3.2, text: 'Ukaamua kutuma 2000TZS kwa Fatuma —' },
      { t: 4.4, text: 'Database itapunguza namba kwenye table yako na kuongeza namba kwenye table ya Fatuma.' },
      { t: 9.6, text: 'ila hakuna pesa iloingia wala kutoka —' },
      { t: 12.2, text: '— ni namba tu zimebadilishwa.' },
    ],
  },
  {
    id: 'database',
    tab: 'Database',
    title: '03 · Taarifa zako zote',
    stamp: '0:37 – 0:47',
    Component: DatabaseScene,
    lines: [
      { t: 0, text: 'Database ni miundo mbinu inayohusika kuhifadhi taarifa zako.' },
      { t: 3.4, text: 'So kwako wewe mtazamaji —' },
      { t: 5.0, text: 'namba yako ya simu, NIDA, chats zako, picha zako —' },
      { t: 8.0, text: '— ziko kwenye database somewhere.' },
    ],
  },
  {
    id: 'where',
    tab: 'Wapi',
    title: '04 · Nje au ndani ya nchi',
    stamp: '0:47 – 0:55',
    Component: WhereScene,
    lines: [
      { t: 0, text: 'Inaeza iwe nje ya nchi —' },
      { t: 2.0, text: '— kwenye database za WhatsApp au Instagram,' },
      { t: 4.6, text: 'au ndani kwenye database za serikali.' },
    ],
  },
  {
    id: 'breach',
    tab: 'Breach',
    title: '05 · Kazi tunayo',
    stamp: '0:55 – 1:02',
    Component: BreachScene,
    lines: [
      { t: 0, text: 'Siku wakiripua hizi database…' },
      { t: 4.0, text: '…kazi tunayo 😂' },
    ],
  },
  {
    id: 'kinds',
    tab: 'Aina',
    title: '06 · Aina za database',
    stamp: '1:02 – 1:21',
    Component: KindsScene,
    lines: [
      { t: 0, text: 'Moja kati ya swali ambalo naulizwaga na wateja wangu wa apps, especially watu wazima:' },
      { t: 3.0, text: '"Taarifa za mauzo au kodi ya nyumba zinahifadhiwa wapi mjukuu wangu?"' },
      { t: 5.6, text: 'Jibu ni database, ambayo inaeza kuwa document database kama MongoDB,' },
      { t: 9.0, text: 'relational database kama PostgreSQL,' },
      { t: 12.4, text: 'au vector database kama ChromaDB —' },
      { t: 15.6, text: '— inayosaidia ML models au AI kuelewa context ya unachokiuliza.' },
    ],
  },
]
