# rage-claude

Find out how many times you lost your cool talking to Claude.

Paste your Claude conversation export → get your top 3 rage quotes, rage moment count, and zen score out of 100 → download a shareable card.

**Your data never leaves your browser.** Everything runs locally.

---

## Run it

```bash
git clone https://github.com/tut9492/rage-claude.git
cd rage-claude
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Get your Claude export

1. Go to [claude.ai](https://claude.ai) → Settings → Account → **Export Data**
2. Download the zip
3. Unzip it — you'll find `conversations.json`
4. Drop it into the app

---

## How it works

Scans your human messages for:
- Swear words
- Repeated punctuation (`!!!`, `???`, `?!`)

Filters out code blocks, URLs, and long pastes so only real reactions count.

---

Built by [tut](https://x.com/tuteth_)
