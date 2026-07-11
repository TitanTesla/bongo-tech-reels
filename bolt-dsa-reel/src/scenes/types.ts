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
  /** Tab label, e.g. "Graph" */
  tab: string
  /** Numbered heading shown in the script panel, e.g. "01 · The map is a graph" */
  title: string
  /** Reel timestamp, e.g. "0:06 – 0:18" */
  stamp: string
  lines: ScriptLine[]
  Component: FC<SceneProps>
}

export const ACCENT = '#34d186'
export const INK = '#e8e8e8'
export const FAINT = '#3a3a3a'
export const MONO =
  'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace'
