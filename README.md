<div align="center">

# 🎬 Bongo Tech Reels

**A series of 60-second TikTok/Reels "Reel Studios" that teach software engineering through everyday Dar es Salaam apps — Gen-Z Swahili voice-over, hand-drawn SVG motion, zero stock assets.**

`React 19` · `TypeScript` · `Vite 8` · `GSAP` · `Framer Motion` · `Tailwind CSS 4`

</div>

---

## 📌 What this is

Each folder is a self-contained **Reel Studio**: a browser app that maps every concept of a 60-second educational reel to a scripted GSAP animation on a phone-safe 9:16 canvas, with the voice-over script sitting off-canvas and highlighting line-by-line in sync. One concept per episode, taught by contrast (show the chaos *without* it first, then the concept as the fix).

## 📺 Episodes

| # | Project | Teaches | Story hook |
| - | ------- | ------- | ---------- |
| 1 | [`bolt-dsa-reel`](bolt-dsa-reel/) | Data structures & algorithms | How Bolt finds you a ride at Mwenge |
| 2 | [`mixx-db-reel`](mixx-db-reel/) | Databases | Sending TZS 50,000 on Mixx by Yas — nothing "travels" |
| 3 | [`mobile-app-dev-reel`](mobile-app-dev-reel/) | Offline-first mobile app dev | WhatsApp works fine on airplane mode — where did the message go? |

Each project has its own README with the full breakdown; `script.md` in each folder holds the complete voice-over script and shot notes.

## 🖥️ Running a reel (Windows + VS Code)

The projects are plain Vite apps — they run identically on Windows, macOS, and Linux. To run one on your Windows PC:

```powershell
# 1. Clone the repo (this is YOUR repo, so clone — don't fork)
git clone https://github.com/TitanTesla/bongo-tech-reels.git
cd bongo-tech-reels

# 2. Open the whole folder in VS Code
code .

# 3. Pick a project and start its dev server
cd mobile-app-dev-reel
npm install
npm run dev        # → http://localhost:5175
```

> **Clone vs. fork:** *Fork* makes a copy of **someone else's** GitHub repo under your account. Since this repo is already yours, you just **clone** it directly to your Windows PC. Fork only if you ever want an independent copy under a different account.

Ports: `mobile-app-dev-reel` → **5175**, `mixx-db-reel` → **5174**, `bolt-dsa-reel` → **5173**. Each project is independent — `npm install` inside whichever one you want to run.

## 🧰 Requirements

- **Node.js 20 or newer** — [nodejs.org](https://nodejs.org) (the Windows installer includes npm and Git-friendly PATH setup)
- **Git for Windows** — [git-scm.com](https://git-scm.com); during install, "Checkout as-is, commit as-is" is fine because `.gitattributes` already pins line endings to LF
- **VS Code** — on first open it will suggest the recommended extensions (Tailwind CSS IntelliSense, Oxlint, ESLint)

## 🪟 Windows notes

- **Line endings** are normalized to LF via [`.gitattributes`](.gitattributes), so cloning on Windows won't rewrite every file or produce noisy diffs.
- **`node_modules` and `dist` are not committed** — run `npm install` on the Windows side to build them fresh for your platform (native binaries differ between macOS and Windows).
- If a clone ever complains about long paths, run once: `git config --global core.longpaths true`.

## 👤 Author

**Abdullatif Khamis** — reel series on software engineering for Bongo tech Instagram Reels/TikTok. Dar es Salaam 🇹🇿
