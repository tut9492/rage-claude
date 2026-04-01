# Contributing to rage-claude

This is a fun open source project. Contributions are welcome as long as they're in the spirit of the thing — finding out how unhinged you get with AI.

---

## Easy wins (great first issues)

### Add swear words in your language
The detection list is in `app/page.tsx` — find `SWEAR_WORDS`. Add the classics from your language. French, Spanish, Italian, Portuguese, Japanese, anything goes. Keep it authentic.

### Funnier zen labels
Current labels are too tame. `zenLabel()` in `app/page.tsx` maps score ranges to labels. Make them funnier. Current ones:
- 90+ → Monk Mode
- 75+ → Mostly Chill
- 55+ → Mild Turbulence
- 35+ → Heated
- 15+ → Full Meltdown
- 0+ → Keyboard Destroyed

Replace them with something better.

### New rage signals
`scoreMessage()` currently catches swears and `!!!`/`???`. Got a better idea for detecting frustration? Add it. Keep false positives low — no flagging normal sentences.

---

## Rules

- All PRs go against `main` and must pass the build check
- No tracking, no analytics, no external requests — data stays local, always
- Don't touch the card design without opening an issue first
- Keep it funny, keep it clean (well, not *too* clean)

---

## How to run locally

```bash
git clone https://github.com/tut9492/rage-claude.git
cd rage-claude
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

Built by [tut](https://x.com/tuteth_)
