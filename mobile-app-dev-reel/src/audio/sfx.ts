/**
 * Procedural SFX engine — every sound is synthesized with the Web Audio
 * API (no audio assets, matching the no-stock-assets rule). Scenes cue
 * sounds from their GSAP timelines via `sfx.play(name)`.
 *
 * Global mute is a single master gain; the flag persists in localStorage.
 * The AudioContext is created lazily and resumed on demand, since
 * browsers block audio until the first user gesture.
 */

export type SfxName =
  | 'ui' // soft UI blip
  | 'tap' // button press
  | 'ping' // radar pulse
  | 'whoosh' // elements sweeping in
  | 'lock' // success (two-note)
  | 'timer' // stopwatch tick roll
  | 'thud' // big text landing
  | 'draw' // lines drawing in (noise sweep)
  | 'pops' // elements popping in (rising blips)
  | 'blip' // single pitched blip (param = frequency)
  | 'note' // one arrival note (param = frequency)
  | 'swish' // elements gliding
  | 'ding' // delivered / final beat

const MASTER_LEVEL = 0.5

class SfxEngine {
  private ctx: AudioContext | null = null
  private master: GainNode | null = null
  private _muted =
    typeof localStorage !== 'undefined' && localStorage.getItem('sfx-muted') === '1'

  get muted() {
    return this._muted
  }

  setMuted(m: boolean) {
    this._muted = m
    localStorage.setItem('sfx-muted', m ? '1' : '0')
    if (this.master && this.ctx) {
      this.master.gain.setTargetAtTime(m ? 0 : MASTER_LEVEL, this.ctx.currentTime, 0.01)
    }
  }

  private ensure(): AudioContext | null {
    if (!this.ctx) {
      this.ctx = new AudioContext()
      this.master = this.ctx.createGain()
      this.master.gain.value = this._muted ? 0 : MASTER_LEVEL
      this.master.connect(this.ctx.destination)
    }
    if (this.ctx.state === 'suspended') void this.ctx.resume()
    return this.ctx
  }

  private tone(opts: {
    f: number
    f1?: number
    type?: OscillatorType
    dur?: number
    g?: number
    at?: number
  }) {
    const ctx = this.ensure()
    if (!ctx || !this.master) return
    const { f, f1, type = 'sine', dur = 0.18, g = 0.16, at = 0 } = opts
    const t0 = ctx.currentTime + at
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = type
    osc.frequency.setValueAtTime(f, t0)
    if (f1) osc.frequency.exponentialRampToValueAtTime(f1, t0 + dur)
    gain.gain.setValueAtTime(0, t0)
    gain.gain.linearRampToValueAtTime(g, t0 + 0.008)
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
    osc.connect(gain).connect(this.master)
    osc.start(t0)
    osc.stop(t0 + dur + 0.05)
  }

  private noise(opts: { dur?: number; f?: number; f1?: number; g?: number; q?: number; at?: number }) {
    const ctx = this.ensure()
    if (!ctx || !this.master) return
    const { dur = 0.4, f = 800, f1, g = 0.12, q = 1, at = 0 } = opts
    const t0 = ctx.currentTime + at
    const len = Math.ceil(ctx.sampleRate * dur)
    const buf = ctx.createBuffer(1, len, ctx.sampleRate)
    const data = buf.getChannelData(0)
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1
    const src = ctx.createBufferSource()
    src.buffer = buf
    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.Q.value = q
    filter.frequency.setValueAtTime(f, t0)
    if (f1) filter.frequency.exponentialRampToValueAtTime(f1, t0 + dur)
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0, t0)
    gain.gain.linearRampToValueAtTime(g, t0 + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
    src.connect(filter).connect(gain).connect(this.master)
    src.start(t0)
    src.stop(t0 + dur + 0.05)
  }

  play(name: SfxName, param?: number) {
    if (this._muted) return
    switch (name) {
      case 'ui':
        this.tone({ f: 660, dur: 0.09, g: 0.08 })
        break
      case 'tap':
        this.tone({ f: 950, f1: 500, dur: 0.08, g: 0.2, type: 'triangle' })
        break
      case 'ping':
        this.tone({ f: 1200, f1: 600, dur: 0.5, g: 0.07 })
        break
      case 'whoosh':
        this.noise({ dur: 0.5, f: 300, f1: 1800, g: 0.08 })
        break
      case 'lock':
        this.tone({ f: 659, dur: 0.12, g: 0.14 })
        this.tone({ f: 988, dur: 0.22, g: 0.14, at: 0.1 })
        break
      case 'timer':
        for (let i = 0; i < 12; i++) {
          this.tone({ f: i % 2 ? 2100 : 1900, dur: 0.03, g: 0.05, at: i * 0.1, type: 'square' })
        }
        break
      case 'thud':
        this.tone({ f: 120, f1: 45, dur: 0.35, g: 0.35 })
        break
      case 'draw':
        this.noise({ dur: 1.2, f: 500, f1: 2400, g: 0.05, q: 2 })
        break
      case 'pops':
        for (let i = 0; i < 8; i++) {
          this.tone({ f: 500 + i * 90, dur: 0.06, g: 0.06, at: i * 0.09, type: 'triangle' })
        }
        break
      case 'blip':
        this.tone({ f: param ?? 880, dur: 0.12, g: 0.12 })
        break
      case 'note':
        this.tone({ f: param ?? 523, dur: 0.25, g: 0.13, type: 'triangle' })
        break
      case 'swish':
        this.noise({ dur: 0.45, f: 1200, f1: 400, g: 0.09, q: 1.5 })
        break
      case 'ding':
        this.tone({ f: 1319, dur: 0.5, g: 0.11 })
        this.tone({ f: 1976, dur: 0.6, g: 0.07, at: 0.06 })
        break
    }
  }
}

export const sfx = new SfxEngine()
