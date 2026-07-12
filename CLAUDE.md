# CLAUDE.md — working notes for Claude Code

Guidance for any Claude Code session working in this repo. Read this first.

## What this repo is

**Bongo Tech Reels** — a set of self-contained Vite + React 19 + TypeScript "Reel Studio" apps that teach software-engineering concepts as 60-second animated reels. Each top-level folder is one independent app:

| Folder | Teaches | Dev port |
| ------ | ------- | -------- |
| `bolt-dsa-reel` | Data structures & algorithms ("the DSA project") | **5173** |
| `mixx-db-reel` | Databases | 5174 |
| `mobile-app-dev-reel` | Offline-first mobile dev | 5175 |

## Identity & remote

- GitHub owner/account: **`TitanTesla`** — remote is `git@github.com:TitanTesla/bongo-tech-reels.git` (SSH).
- Author name in docs is **Abdullatif Khamis** — this is *not* the GitHub handle. If someone gives a clone URL like `Abdullatif Khamis/...`, the correct owner is `TitanTesla`.
- This repo lives at the top level (e.g. `Desktop/bongo-tech-reels`). It is no longer nested inside any "parent temporary repo" wrapper.

## Environment requirements — READ BEFORE RUNNING

- **Node.js must be 20.19+ or 22.12+ (an even LTS line).** Vite 8 crashes on non-LTS versions like **Node 21.x** with `SyntaxError: ... 'node:util' does not provide an export named 'styleText'`. If `node --version` shows 21.x (or any odd/non-LTS), the dev server WILL NOT start — install Node 22 LTS from nodejs.org first. Do not try to work around it by downgrading Vite.
- Node/npm cannot be installed unattended by Claude — if the version is wrong, ask the user to install Node 22 LTS, then continue.
- On Windows the primary shell is **PowerShell**; the Git Bash tool is broken on this machine (Cygwin fork errors) — use PowerShell.

## Running a reel

```powershell
cd bolt-dsa-reel      # or mixx-db-reel / mobile-app-dev-reel
npm install           # node_modules is git-ignored; install per project
npm run dev           # bolt-dsa-reel → http://localhost:5173
```

Then open the URL in a browser to view it.

## Multi-machine workflow

Developed from **both a Windows PC and a Mac**, each authenticated to GitHub with its own SSH key, using separate local Claude Code instances. Everything syncs through this one GitHub repo under the same account. **Always `git pull` at the start of a session and push when done** so the other machine stays current. Pushing is an outward action — confirm with the user before pushing.
