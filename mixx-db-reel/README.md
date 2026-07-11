<div align="center">

# 📲 Mixx by Yas × DB — Reel Studio (Ep. 2)

**A 60-second TikTok/Reels storyboard that reveals the surprising secrets of databases through how Mixx by Yas moves money in Dar es Salaam.**

`React` · `TypeScript` · `Vite` · `GSAP` · `Framer Motion` · `Tailwind CSS`

</div>

---

## 📌 Overview

Episode 2 of the reel series. Same Reel Studio format as [bolt-dsa-reel](../bolt-dsa-reel/): each database concept is a **tab**, the voice-over **script sits off-canvas** and highlights line-by-line in sync with the animation, and the canvas stays inside the phone-safe area so nothing hides behind TikTok or Instagram UI.

**The story:** you send TZS 50,000 on Mixx by Yas and the network drops at Ubungo mid-transfer — yet not a shilingi gets lost. Because nothing ever "travels": ledgers, atomic transactions, indexes, and soft deletes did the work.

## ✨ Features

- 🎬 **Six scripted scenes** — Hook · Ledger · Atomicity · Index · Delete-is-a-lie · Payoff, each a hand-built GSAP timeline
- 📱 **Phone-safe canvas** — 9:16 frame with TikTok/Reels chrome zones; pure-black, no gradients, no stock assets
- 📝 **Synced script panel** — Gen-Z Swahili/English VO lines highlight as the animation plays; click any line to seek
- 📲 **Dar es Salaam world** — Mixx by Yas wallet framing, TZS amounts, real Tanzanian names, mangi's debt notebook as the ledger metaphor
- ⏯️ **Transport controls** — play/pause, restart, scrubbable progress bar for rehearsing VO timing

## 🖥️ Tech Stack

| Layer       | Tool                        | Why                                       |
| ----------- | --------------------------- | ----------------------------------------- |
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
npm run dev        # → http://localhost:5173

# ship
npm run build      # type-checks + bundles to dist/
npm run preview    # serve the production build
```

## 📂 Project Structure

```
mixx-db-reel/
├── src/
│   ├── App.tsx               # layout: tabs · phone canvas · script panel · transport
│   ├── data/
│   │   └── ledger.ts         # shared wallet ledger rows, accounts, transaction states
│   ├── scenes/
│   │   ├── index.ts          # scene registry + VO script (timestamped lines)
│   │   ├── types.ts          # SceneDef contract, palette constants
│   │   └── *Scene.tsx        # one GSAP timeline per concept
│   └── components/
│       ├── LedgerTable.tsx   # animatable database-table / notebook rows
│       ├── MoneyOrb.tsx      # the TZS 50,000 in flight (commit / rollback states)
│       └── PhoneChrome.tsx   # faint TikTok/Reels UI (safe-zone framing)
├── script.md                 # the full 60-second VO script + shot notes
└── README.md
```

## 🎬 How It Works

1. Every scene builds a **paused GSAP timeline** inside a `gsap.context` and hands it to the app shell.
2. The shell drives play/pause/seek and, on every tick, maps `timeline.time()` to the active script line.
3. All scenes share one **wallet ledger dataset** (`data/ledger.ts`), so the reel feels like one continuous story instead of six clips.

## 🗺️ Roadmap

- [x] Scaffold the Vite + GSAP shell (reused the bolt-dsa-reel app shell)
- [x] Build the six scenes from [script.md](script.md)
- [ ] Record mode: fullscreen phone frame only, for clean screen capture
- [ ] Ep. 3 — how your password stays secret (hashing, not storage)

## 👤 Author

**Abdullatif Khamis** — reel series on software engineering for Bongo tech Instagram Reels/TikTok.

---

<div align="center">
<sub>Built with GSAP timelines and zero stock assets. Dar es Salaam 🇹🇿</sub>
</div>
