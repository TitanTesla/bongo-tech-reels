<div align="center">

# 🗄️ Tigo Pesa × Database — Reel Studio (Ep. 2)

**A TikTok/Reels storyboard that answers the question nobody asks until it's too late: what actually *is* a database — starting with the TZS you just sent on Tigo Pesa.**

`React` · `TypeScript` · `Vite` · `GSAP` · `Framer Motion` · `Tailwind CSS`

</div>

---

## 📌 Overview

Episode 2 of the reel series. Same Reel Studio format as [bolt-dsa-reel](../bolt-dsa-reel/): each idea is a **tab**, the voice-over **script sits off-canvas** and highlights line-by-line in sync with the animation, and the canvas stays inside the phone-safe area so nothing hides behind TikTok or Instagram UI.

**The story:** you put TZS 3,000 on Tigo Pesa and check your balance — there's no box of cash in a Tigo office with your name on it. Send some to a friend and nothing actually travels: a database just edits two numbers. From there the reel zooms out — your phone number, your NIDA, your WhatsApp chats, your photos are all sitting in a database *somewhere*, at home or abroad — and lands on the question people actually ask: when a database has to hold something specific, which *kind* does it reach for? Document, relational, or vector?

> **Status:** [`script.md`](script.md) is final. The animations in `src/scenes/` predate it — the studio runs, but what it renders doesn't match the script yet. Rebuilding them is the next piece of work.

## ✨ Features

- 🎬 **Scene-per-beat architecture** — every beat of the script is its own hand-built GSAP timeline, all registered in one place *(scenes pending rebuild against the final script)*
- 📱 **Phone-safe canvas** — 9:16 frame with TikTok/Reels chrome zones; pure-black, no gradients, no stock assets
- 📝 **Synced script panel** — Gen-Z Swahili/English VO lines highlight as the animation plays; click any line to seek
- 🎥 **REC mode** — canvas-only capture view (`?rec=1`) that strips the UI and auto-chains every scene into one continuous take; point an OBS Browser Source at it for native 4K portrait, no cropping
- ⏯️ **Transport controls** — play/pause, restart, mute, scrubbable progress bar, plus keyboard shortcuts (space/R/←→/M/F/S) reachable from OBS's Interact window

## 🖥️ Tech Stack

| Layer       | Tool                        | Why                                       |
| ----------- | --------------------------- | ------------------------------------------ |
| Framework   | React 19 + TypeScript       | Component-per-scene architecture          |
| Build       | Vite 8                      | Instant dev server + HMR                  |
| Animation   | GSAP 3 (+ MotionPathPlugin) | Scripted, scrubbed, timeline-based motion |
| Transitions | Framer Motion               | Tab and panel transitions                 |
| Styling     | Tailwind CSS 4              | Fast, consistent layout                   |
| Graphics    | Hand-drawn SVG              | Crisp at any size, fully animatable       |

## 🚀 Getting Started

```bash
# prerequisites: Node 20+

# install
npm install

# develop
npm run dev        # → http://localhost:5174

# ship
npm run build      # type-checks + bundles to dist/
npm run preview    # serve the production build
```

## 📂 Project Structure

```
mixx-db-reel/
├── src/
│   ├── App.tsx               # layout: tabs · phone canvas · script panel · transport · REC mode
│   ├── data/
│   │   └── ledger.ts         # shared wallet ledger rows, accounts, transaction states
│   ├── audio/
│   │   └── sfx.ts            # procedural Web Audio SFX — no audio assets
│   ├── scenes/
│   │   ├── index.ts          # scene registry + VO script (timestamped lines)
│   │   ├── types.ts          # SceneDef contract, palette constants
│   │   └── *Scene.tsx        # one GSAP timeline per beat — pending rebuild
├── script.md                 # the final VO script — the general "what is a database" narrative
└── README.md
```

## 🎬 How It Works

1. Every scene builds a **paused GSAP timeline** inside a `gsap.context` and hands it to the app shell.
2. The shell drives play/pause/seek and, on every tick, maps `timeline.time()` to the active script line.
3. All scenes share one **wallet ledger dataset** (`data/ledger.ts`), so the reel feels like one continuous story instead of separate clips.
4. **REC mode** (`?rec=1`) renders the canvas alone and auto-advances scene to scene for a single unbroken take — built for an OBS Browser Source at 2160×3840.

## 🗺️ Roadmap

- [x] Scaffold the Vite + GSAP shell (reused the bolt-dsa-reel app shell)
- [x] Build the first pass of scenes on top of the shell
- [x] REC mode for clean 4K capture
- [x] Finalize the VO script — broadened from a single-app deep dive into a general, layman-friendly "what is a database" narrative
- [ ] Rebuild the scenes to match the final script
- [ ] Refresh the studio's on-screen title/header to match the new framing

## 👤 Author

**Abdullatif Khamis** — reel series on software engineering for Bongo tech Instagram Reels/TikTok.

---

<div align="center">
<sub>Built with GSAP timelines and zero stock assets. Dar es Salaam 🇹🇿</sub>
</div>
