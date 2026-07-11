import type { FC } from 'react'

export interface SceneProps {
  /** Called once the scene's paused GSAP timeline is built. */
  onReady: (tl: gsap.core.Timeline) => void
}

export interface ScriptLine {
  /** Second in the scene timeline where this line becomes active. */
  t: number
  /** Swahili VO — what actually gets recorded. */
  text: string
  /** English translation, shown under the line in the script panel. */
  en: string
}

export interface SceneDef {
  id: string
  /** Tab label, e.g. "Local DB" */
  tab: string
  /** Numbered heading shown in the script panel, e.g. "01 · Database ndani ya simu" */
  title: string
  /** Reel timestamp, e.g. "0:07 – 0:19" */
  stamp: string
  lines: ScriptLine[]
  Component: FC<SceneProps>
}

/** WhatsApp green — the primary accent on the pure-black canvas. */
export const ACCENT = '#25d366'
/** WhatsApp read-receipt blue — the "amesoma" tick color. */
export const TICK = '#53bdeb'
/** For the "BILA X" contrast halves — the world without the concept. */
export const DANGER = '#ff5f5f'
export const INK = '#e8e8e8'
export const FAINT = '#3a3a3a'
export const MONO =
  'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace'
