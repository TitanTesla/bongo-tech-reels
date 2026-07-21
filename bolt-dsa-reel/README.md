<div align="center">

# 🛺 Bolt × DSA — Reel Studio

**A 60-second TikTok/Reels storyboard that teaches Data Structures & Algorithms through how Bolt finds you a ride in Dar es Salaam.**

`React` · `TypeScript` · `Vite` · `GSAP` · `Framer Motion` · `Tailwind CSS`

</div>

---

## 📌 Overview

Reel Studio maps every concept of a 60-second educational reel to a real, scripted motion animation. Each DSA concept is a **tab**; the voice-over **script sits off-canvas** and highlights line-by-line in sync with the animation. The canvas is a phone-safe area — it starts below the social-app top bar and ends above the caption/icons, so nothing important ever hides behind TikTok or Instagram UI.

**The story:** you tap *Tafuta Ride* at Mwenge, and two seconds later a bodaboda is on the way — graphs, spatial indexes, Dijkstra, and sorting did the work.

## ✨ Features

- 🎬 **Six scripted scenes** — Hook · Graph · Spatial index · Dijkstra · Sorting · Payoff, each a hand-built GSAP timeline
- 📱 **Phone-safe canvas** — 9:16 frame with TikTok/Reels chrome zones; pure-black, no gradients, no stock assets
- 📝 **Synced script panel** — Gen-Z Swahili/English VO lines highlight as the animation plays; click any line to seek
- 🛺 **Dar es Salaam world** — cars, bajaji, and bodaboda glyphs; TZS fares; Mwenge → Kariakoo route
- ⏯️ **Transport controls** — play/pause, restart, scrubbable progress bar for rehearsing VO timing

## 🖥️ Tech Stack

| Layer      | Tool                        | Why                                        |
| ---------- | --------------------------- | ------------------------------------------ |
| Framework  | React 19 + TypeScript       | Component-per-scene architecture           |
| Build      | Vite 8                      | Instant dev server + HMR                   |
| Animation  | GSAP 3 (+ MotionPathPlugin) | Scripted, scrubbed, timeline-based motion  |
| Transitions| Framer Motion               | Tab and panel transitions                  |
| Styling    | Tailwind CSS 4              | Fast, consistent layout                    |
| Graphics   | Hand-drawn SVG              | Crisp at any size, fully animatable        |

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
bolt-dsa-reel/
├── src/
│   ├── App.tsx               # layout: tabs · phone canvas · script panel · transport
│   ├── data/
│   │   └── city.ts           # shared city graph, vehicles, Dijkstra waves, shortest path
│   ├── scenes/
│   │   ├── index.ts          # scene registry + VO script (timestamped lines)
│   │   ├── types.ts          # SceneDef contract, palette constants
│   │   └── *Scene.tsx        # one GSAP timeline per concept
│   └── components/
│       ├── CityMap.tsx       # drawable street network
│       ├── Vehicle.tsx       # car / bajaji / bodaboda glyphs + driver avatar
│       └── PhoneChrome.tsx   # faint TikTok/Reels UI (safe-zone framing)
└── README.md
```

## 🎬 How It Works

1. Every scene builds a **paused GSAP timeline** inside a `gsap.context` and hands it to the app shell.
2. The shell drives play/pause/seek and, on every tick, maps `timeline.time()` to the active script line.
3. All map scenes share one **city graph** (`data/city.ts`), so the reel feels like one continuous world instead of six clips.

## 🗺️ Roadmap

- [ ] Auto-advance: play all six scenes as one continuous 60-second take
- [ ] Record mode: fullscreen phone frame only, for clean screen capture
- [ ] Ep. 2 — `mixx-db-reel`: what a database actually is, from your Tigo Pesa balance to your NIDA

## 👤 Author

**Abdullatif Khamis** — reel series on software engineering for Bongo tech Instagram Reels/TikTok.

---

<div align="center">
<sub>Built with GSAP timelines and zero stock assets. Dar es Salaam 🇹🇿</sub>
</div>
