<div align="center">

# 💬 WhatsApp × App Dev — Reel Studio (Ep. 3)

**A 60-second TikTok/Reels storyboard that teaches offline-first mobile app architecture through what WhatsApp does when you hit send with no network in Dar es Salaam.**

`React` · `TypeScript` · `Vite` · `GSAP` · `Framer Motion` · `Tailwind CSS`

</div>

---

## 📌 Overview

Episode 3 of the reel series. Same Reel Studio format as [bolt-dsa-reel](../bolt-dsa-reel/) and [mixx-db-reel](../mixx-db-reel/): each concept is a **tab**, the voice-over **script sits off-canvas** and highlights line-by-line in sync with the animation, and the canvas stays inside the phone-safe area so nothing hides behind TikTok or Instagram UI. New this episode: every Swahili VO line carries an **English translation** underneath it in the script panel.

**The story:** you turn on airplane mode, send a WhatsApp message — and the app doesn't even flinch. Because apps aren't built on the network: a local database, optimistic UI, a sync queue, and acknowledgment ticks did the work. The network is just a courier.

## ✨ Features

- 🎬 **Six scripted scenes** — Hook · Local DB · Optimistic UI · Sync Queue · Ticks · Payoff, each a hand-built GSAP timeline
- 📱 **Phone-safe canvas** — 9:16 frame with TikTok/Reels chrome zones; pure-black, no gradients, no stock assets
- 📝 **Bilingual synced script panel** — Gen-Z Swahili VO lines with English translations, highlighting as the animation plays; click any line to seek
- 💬 **WhatsApp world** — green-and-tick-blue palette, airplane-mode toggle, TZS bundle prices, daladala-grade network drops
- ⏯️ **Transport controls** — play/pause, restart, mute, scrubbable progress bar for rehearsing VO timing

## 🖥️ Tech Stack

| Layer       | Tool                  | Why                                       |
| ----------- | --------------------- | ----------------------------------------- |
| Framework   | React 19 + TypeScript | Component-per-scene architecture          |
| Build       | Vite 8                | Instant dev server + HMR                  |
| Animation   | GSAP 3                | Scripted, scrubbed, timeline-based motion |
| Transitions | Framer Motion         | Tab and panel transitions                 |
| Styling     | Tailwind CSS 4        | Fast, consistent layout                   |
| Graphics    | Hand-drawn SVG        | Crisp at any size, fully animatable       |

## 🚀 Getting Started

```bash
# prerequisites: Node 20+

# install
npm install

# develop
npm run dev        # → http://localhost:5175

# ship
npm run build      # type-checks + bundles to dist/
npm run preview    # serve the production build
```

## 📂 Project Structure

```
mobile-app-dev-reel/
├── src/
│   ├── App.tsx               # layout: tabs · phone canvas · bilingual script panel · transport
│   ├── data/
│   │   └── chat.ts           # shared WhatsApp world: contact, messages, retry steps
│   ├── audio/
│   │   └── sfx.ts            # procedural Web Audio SFX (no audio assets)
│   ├── scenes/
│   │   ├── index.ts          # scene registry + VO script (timestamped SW + EN lines)
│   │   ├── types.ts          # SceneDef contract, WhatsApp palette constants
│   │   └── *Scene.tsx        # one GSAP timeline per concept
│   └── components/
│       └── PhoneChrome.tsx   # faint TikTok/Reels UI (safe-zone framing)
├── script.md                 # the full 60-second VO script (SW + EN) + shot notes
└── README.md
```

## 🎬 How It Works

1. Every scene builds a **paused GSAP timeline** inside a `gsap.context` and hands it to the app shell.
2. The shell drives play/pause/seek and, on every tick, maps `timeline.time()` to the active script line — Swahili on top, English underneath.
3. All scenes share one **WhatsApp chat dataset** (`data/chat.ts`) and one core concept — offline-first — so the reel feels like a single continuous story instead of six clips.

## 🗺️ Roadmap

- [x] Write the bilingual 60-second script ([script.md](script.md))
- [x] Scaffold the Vite + GSAP shell (reused the mixx-db-reel app shell)
- [x] Build the six scenes from the script
- [ ] Record mode: fullscreen phone frame only, for clean screen capture
- [ ] Ep. 4 — how your password stays secret (hashing, not storage)

## 👤 Author

**Abdullatif Khamis** — reel series on software engineering for Bongo tech Instagram Reels/TikTok.

---

<div align="center">
<sub>Built with GSAP timelines, zero stock assets, and one airplane-mode trick. Dar es Salaam 🇹🇿</sub>
</div>
