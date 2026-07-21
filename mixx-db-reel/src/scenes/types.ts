import type { FC } from 'react'

export interface SceneProps {
  /** Called once the scene's paused GSAP timeline is built. */
  onReady: (tl: gsap.core.Timeline) => void
}

export interface ScriptLine {
  /** Second in the scene timeline where this line becomes active. */
  t: number
  text: string
}

export interface SceneDef {
  id: string
  /** Tab label, e.g. "Ledger" */
  tab: string
  /** Numbered heading shown in the script panel, e.g. "01 · Balance si pesa iliyokaa" */
  title: string
  /** Reel timestamp, e.g. "0:07 – 0:19" */
  stamp: string
  lines: ScriptLine[]
  Component: FC<SceneProps>
}

/** Money — balances, TZS amounts, anything the viewer thinks of as cash. */
export const ACCENT = '#ffcc00'
/** Data — tables, rows, structure, the database itself. */
export const BLUE = '#3b8bff'
/** The myth being broken, and the breach in the punchline scene. */
export const DANGER = '#ff5f5f'
export const INK = '#e8e8e8'
export const FAINT = '#3a3a3a'
export const MONO =
  'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace'
