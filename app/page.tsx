'use client';

import { useState, useRef, useCallback } from 'react';
import { toPng } from 'html-to-image';
import Image from 'next/image';

interface RageResult {
  topQuotes: string[];
  rageMoments: number;
  zenScore: number;
}

const SWEAR_WORDS = [
  'fuck', 'shit', 'bitch', 'ass', 'damn', 'crap', 'bastard', 'wtf', 'stfu',
  'bullshit', 'piss', 'hell',
];

const TUT_LOGO_B64 = 'PHN2ZyB3aWR0aD0iNDQ4MSIgaGVpZ2h0PSIyMjIxIiB2aWV3Qm94PSIwIDAgNDQ4MSAyMjIxIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNNDE0NC44NCA1MC42NTUxSDQwNzAuNzZWMjYwLjg3NEg0MDA2LjE4VjUwLjY1NTFIMzkzMi4wOVYwSDQxNDQuODRWNTAuNjU1MVpNNDQ4MC40MyAyNjAuODc0SDQ0MTkuNjVWNzUuOTgyN0g0NDE4LjM4TDQzNTEuMjYgMjYwLjg3NEg0MzA3LjU3TDQyNDAuNDYgNzUuOTgyN0g0MjM5LjE5VjI2MC44NzRINDE3OC40VjBINDI2NC41Mkw0MzI5Ljc0IDE3MS41OTRMNDM5NC45NSAwSDQ0ODAuNDNWMjYwLjg3NFoiIGZpbGw9ImJsYWNrIi8+CjxwYXRoIGQ9Ik0zOTk4LjA3IDIyMjFDNDExNS43MSAyMjIxIDQyMDkuMjEgMjEyNC40OCA0MjA5LjIxIDIwMDkuODVWMTkwNC4yOEM0MjA5LjIxIDE3ODYuNjQgNDExMi42OSAxNjkzLjEzIDM5OTguMDcgMTY5My4xM0gzODkyLjQ5QzM3NzQuODYgMTY5My4xMyAzNjgxLjM1IDE1OTYuNjEgMzY4MS4zNSAxNDgxLjk5VjEzODUuNDZDMzY4MS4zNSAxMjU4Ljc4IDM3NzcuODcgMTE2NS4yNyAzODkyLjQ5IDExNjUuMjdIMzk5OC4wN0M0MTE1LjcxIDExNjUuMjcgNDIwOS4yMSAxMDY4Ljc0IDQyMDkuMjEgOTU0LjEyMlY4NDguNTQ5QzQyMDkuMjEgNzMwLjkxMSA0MTEyLjY5IDYzNy40MDMgMzk5OC4wNyA2MzcuNDAzSDM4OTIuNDlDMzc3NC44NiA2MzcuNDAzIDM2ODEuMzUgNTQwLjg3OSAzNjgxLjM1IDQyNi4yNTdWMzIwLjY4M0MzNjgxLjM1IDIwMy4wNDUgMzU4NC44MiAxMDkuNTM3IDM0NzAuMiAxMDkuNTM3SDMzNjQuNjNDMzI0Ni45OSAxMDkuNTM3IDMxNTMuNDggMjA2LjA2MSAzMTUzLjQ4IDMyMC42ODNWMTQ4MS45OUMzMTUzLjQ4IDE1OTkuNjMgMzI1MC4wMSAxNjkzLjEzIDMzNjQuNjMgMTY5My4xM0gzNDcwLjJDMzU4Ny44NCAxNjkzLjEzIDM2ODEuMzUgMTc4OS42NiAzNjgxLjM1IDE5MDQuMjhWMjAwOS44NUMzNjgxLjM1IDIxMjcuNDkgMzc3Ny44NyAyMjIxIDM4OTIuNDkgMjIyMUgzOTk4LjA3WiIgZmlsbD0iYmxhY2siLz4KPHBhdGggZD0iTTI4OTUuNzYgMTgyNS4wMkMyODk1Ljc2IDE5MzkuNjUgMjgwMi4yNSAyMDM2LjE3IDI2ODQuNjEgMjAzNi4xN0gyMDUxLjE3QzE5MzYuNTUgMjAzNi4xNyAxODQwLjAzIDE5NDIuNjYgMTg0MC4wMyAxODI1LjAyVjE3MTkuNDVDMTg0MC4wMyAxNjA0LjgzIDE3NDYuNTIgMTUwOC4zMSAxNjI4Ljg4IDE1MDguMzFIMTUyMy4zMUMxNDA4LjY5IDE1MDguMzEgMTMxMi4xNiAxNDE0LjggMTMxMi4xNiAxMjk3LjE2VjY2My43MkMxMzEyLjE2IDU0OS4wOTggMTQwNS42NyA0NTIuNTc0IDE1MjMuMzEgNDUyLjU3NEgxNjI4Ljg4QzE3NDMuNSA0NTIuNTc0IDE4NDAuMDMgNTQ2LjA4MSAxODQwLjAzIDY2My43MlYxMjk3LjE2QzE4NDAuMDMgMTQxMS43OCAxOTMzLjUzIDE1MDguMzEgMjA1MS4xNyAxNTA4LjMxSDIxNTYuNzVDMjI3MS4zNyAxNTA4LjMxIDIzNjcuODkgMTQxNC44IDIzNjcuODkgMTI5Ny4xNlY2NjMuNzJDMjM2Ny44OSA1NDkuMDk4IDI0NjEuNCA0NTIuNTc0IDI1NzkuMDQgNDUyLjU3NEgyNjg0LjYxQzI3OTkuMjMgNDUyLjU3NCAyODk1Ljc2IDU0Ni4wODEgMjg5NS43NiA2NjMuNzJWMTgyNS4wMloiIGZpbGw9ImJsYWNrIi8+CjxwYXRoIGQ9Ik0xMzcyLjQ1IDIyMjFDMTQ5MC4wOSAyMjIxIDE1ODMuNiAyMTI0LjQ4IDE1ODMuNiAyMDA5Ljg1VjE5MDQuMjhDMTU4My42IDE3ODYuNjQgMTQ4Ny4wNyAxNjkzLjEzIDEzNzIuNDUgMTY5My4xM0gxMjY2Ljg4QzExNDkuMjQgMTY5My4xMyAxMDU1LjczIDE1OTYuNjEgMTA1NS43MyAxNDgxLjk5VjMyMC42ODNDMTA1NS43MyAyMDMuMDQ0IDk1OS4yMDggMTA5LjUzNyA4NDQuNTg1IDEwOS41MzdINzM5LjAxMkM2MjEuMzczIDEwOS41MzcgNTI3Ljg2NiAyMDYuMDYxIDUyNy44NjYgMzIwLjY4M1Y0MjYuMjU2QzUyNy44NjYgNTQzLjg5NSA0MzEuMzQyIDYzNy40MDIgMzE2LjcxOSA2MzcuNDAySDIxMS4xNDZDOTMuNTA3NyA2MzcuNDAyIDAgNzMzLjkyNiAwIDg0OC41NDlWOTU0LjEyMkMwIDEwNzEuNzYgOTYuNTI0IDExNjUuMjcgMjExLjE0NiAxMTY1LjI3SDMxNi43MTlDNDM0LjM1OCAxMTY1LjI3IDUyNy44NjYgMTI2MS43OSA1MjcuODY2IDEzODguNDhWMTQ4MS45OUM1MjcuODY2IDE1OTkuNjMgNjI0LjM5IDE2OTMuMTMgNzM5LjAxMiAxNjkzLjEzSDg0NC41ODVDOTYyLjIyNCAxNjkzLjEzIDEwNTUuNzMgMTc4OS42NiAxMDU1LjczIDE5MDQuMjhWMjAwOS44NUMxMDU1LjczIDIxMjcuNDkgMTE1Mi4yNiAyMjIxIDEyNjYuODggMjIyMUgxMzcyLjQ1WiIgZmlsbD0iYmxhY2siLz4KPC9zdmc+Cg==';

function scoreMessage(text: string): number {
  let score = 0;
  const lower = text.toLowerCase();
  SWEAR_WORDS.forEach(w => { if (lower.includes(w)) score += 4; });
  if (/[!?]{2,}/.test(text)) score += 3;
  return score;
}

interface ClaudeMessage { text: string; sender: string; }
interface ClaudeConversation { name: string; chat_messages: ClaudeMessage[]; }

function extractTextFromExport(json: ClaudeConversation[]): string {
  const humanMessages: string[] = [];
  for (const conv of json) {
    for (const msg of conv.chat_messages || []) {
      if (msg.sender !== 'human') continue;
      const t = msg.text?.trim();
      if (!t) continue;
      if (t.length > 600) continue;
      if (/```/.test(t)) continue;
      if (/https?:\/\//.test(t)) continue;
      if ((t.match(/\n/g) || []).length > 8) continue;
      humanMessages.push(t);
    }
  }
  return humanMessages.join('\n');
}

function analyzeConversation(text: string): RageResult {
  const lines = text.split(/\n+/).map(l => l.trim()).filter(l => l.length > 3);
  const scored = lines.map(line => ({ line, score: scoreMessage(line) }));
  const rageMoments = scored.filter(s => s.score >= 3).length;
  const topQuotes = scored
    .filter(s => s.score >= 3)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(s => {
      let q = s.line.replace(/^(user:|human:|me:|shane:)/i, '').trim();
      if (q.length > 80) q = q.slice(0, 77) + '...';
      return q;
    });
  const totalScore = scored.reduce((sum, s) => sum + s.score, 0);
  const maxScore = Math.max(scored.length * 3, 1);
  const zenScore = Math.max(0, Math.min(100, 100 - Math.round((totalScore / maxScore) * 100)));
  return { topQuotes, rageMoments, zenScore };
}

function zenLabel(score: number): string {
  if (score >= 90) return 'Monk Mode';
  if (score >= 75) return 'Mostly Chill';
  if (score >= 55) return 'Mild Turbulence';
  if (score >= 35) return 'Heated';
  if (score >= 15) return 'Full Meltdown';
  return 'Keyboard Destroyed';
}

export default function Home() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<RageResult | null>(null);
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState('');
  const cardRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadFile = useCallback((file: File) => {
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string) as ClaudeConversation[];
        const extracted = extractTextFromExport(json);
        setText(extracted);
        setResult(analyzeConversation(extracted));
      } catch {
        alert("Could not parse file. Make sure it's the conversations.json from your Claude export.");
      }
    };
    reader.readAsText(file);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) loadFile(file);
  }, [loadFile]);

  const onFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) loadFile(file);
  }, [loadFile]);

  async function downloadCard() {
    if (!cardRef.current) return;
    const png = await toPng(cardRef.current, { pixelRatio: 2 });
    const a = document.createElement('a');
    a.href = png;
    a.download = 'my-claude-rage.png';
    a.click();
  }

  return (
    <main style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }} className="min-h-screen bg-[#1a1a1a] text-white flex flex-col">

      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/[0.06]">
        <Image src="/tut-logo.svg" alt="tut" width={48} height={24} className="invert opacity-60" />
        <a
          href="https://github.com/tut9492/rage-claude"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs tracking-widest text-white/30 hover:text-white/60 transition-colors"
        >
          GITHUB
        </a>
      </nav>

      {/* Hero */}
      <div className="flex flex-col items-center pt-20 pb-12 px-4 text-center">
        <div className="inline-block px-3 py-1 rounded-full border border-white/10 text-white/40 text-xs tracking-widest mb-8">
          OPEN SOURCE
        </div>
        <h1 className="text-4xl sm:text-5xl font-light text-white tracking-tight mb-4" style={{ letterSpacing: '-0.02em' }}>
          Did I Rage at Claude?
        </h1>
        <p className="text-white/40 text-base max-w-md leading-relaxed">
          Export your Claude conversations. Find out how many times you lost your cool.
          Your data never leaves your browser.
        </p>
      </div>

      {/* How-to video */}
      <div className="flex flex-col items-center px-4 pb-10 w-full">
        <div className="w-full max-w-xl">
          <p className="text-white/30 text-xs tracking-widest mb-3 text-center">HOW TO EXPORT YOUR CHATS</p>
          <video
            src="/how-to-export.mp4"
            controls
            playsInline
            className="w-full rounded-2xl"
            style={{ border: '1px solid rgba(255,255,255,0.06)' }}
          />
        </div>
      </div>

      {/* Upload area */}
      <div className="flex flex-col items-center px-4 pb-16 gap-4 w-full">
        <div className="w-full max-w-xl">
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            className="w-full rounded-2xl p-10 text-center cursor-pointer transition-all border"
            style={{
              borderColor: dragging ? '#E8521A' : 'rgba(255,255,255,0.08)',
              backgroundColor: dragging ? 'rgba(232,82,26,0.04)' : 'rgba(255,255,255,0.02)',
            }}
          >
            <input ref={fileInputRef} type="file" accept=".json" className="hidden" onChange={onFileInput} />
            {fileName ? (
              <p className="text-white/50 text-sm">✓ {fileName}</p>
            ) : (
              <>
                <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-white/30 text-lg">↑</span>
                </div>
                <p className="text-white/50 text-sm mb-1">
                  Drop <span className="text-white/80">conversations.json</span> here
                </p>
                <p className="text-white/20 text-xs">from your Claude data export · click to browse</p>
              </>
            )}
          </div>

          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-white/[0.06]" />
            <span className="text-white/20 text-xs">or paste text</span>
            <div className="flex-1 h-px bg-white/[0.06]" />
          </div>

          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Paste any Claude conversation here..."
            className="w-full h-28 rounded-xl p-4 text-sm resize-none focus:outline-none border"
            style={{
              backgroundColor: 'rgba(255,255,255,0.02)',
              borderColor: 'rgba(255,255,255,0.08)',
              color: 'rgba(255,255,255,0.6)',
            }}
          />

          <button
            onClick={() => { if (text.trim()) setResult(analyzeConversation(text)); }}
            className="mt-3 w-full py-3 rounded-xl text-sm font-medium tracking-wide transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#E8521A', color: '#000' }}
          >
            ANALYZE MY PAIN
          </button>
        </div>

        {/* Card */}
        {result && (
          <div className="mt-8 flex flex-col items-center gap-4 w-full">
            <div
              ref={cardRef}
              style={{
                backgroundColor: '#E8521A',
                width: '600px',
                minHeight: '360px',
                borderRadius: '20px',
                padding: '40px',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxSizing: 'border-box',
              }}
            >
              {/* Card header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <span style={{ color: 'rgba(0,0,0,0.45)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.15em' }}>
                  DID I RAGE AT CLAUDE?
                </span>
                {/* Tut logo inline */}
                <img
                  src={`data:image/svg+xml;base64,${TUT_LOGO_B64}`}
                  alt="tut"
                  style={{ height: '14px', width: 'auto', opacity: 0.35 }}
                />
              </div>

              {/* Quotes */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', flex: 1 }}>
                {result.topQuotes.length === 0 ? (
                  <p style={{ color: 'rgba(0,0,0,0.5)', fontSize: '15px', fontStyle: 'italic' }}>
                    No rage detected. You are already enlightened.
                  </p>
                ) : (
                  result.topQuotes.map((q, i) => (
                    <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                      <span style={{ color: 'rgba(0,0,0,0.3)', fontSize: '20px', lineHeight: 1, marginTop: '-1px', flexShrink: 0 }}>"</span>
                      <p style={{ color: '#000', fontSize: '15px', fontWeight: 500, lineHeight: 1.4, margin: 0 }}>{q}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Card footer */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '36px' }}>
                <div>
                  <p style={{ color: 'rgba(0,0,0,0.4)', fontSize: '10px', letterSpacing: '0.12em', margin: 0 }}>RAGE MOMENTS</p>
                  <p style={{ color: '#000', fontSize: '40px', fontWeight: 700, margin: 0, lineHeight: 1 }}>{result.rageMoments}</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ color: 'rgba(0,0,0,0.35)', fontSize: '10px', letterSpacing: '0.1em', margin: 0 }}>github.com/tut9492/rage-claude</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ color: 'rgba(0,0,0,0.4)', fontSize: '10px', letterSpacing: '0.12em', margin: 0 }}>ZEN SCORE</p>
                  <p style={{ color: '#000', fontSize: '40px', fontWeight: 700, margin: 0, lineHeight: 1 }}>
                    {result.zenScore}<span style={{ fontSize: '16px', fontWeight: 400 }}>/100</span>
                  </p>
                  <p style={{ color: 'rgba(0,0,0,0.4)', fontSize: '11px', margin: 0, marginTop: '2px' }}>{zenLabel(result.zenScore)}</p>
                </div>
              </div>
            </div>

            <button
              onClick={downloadCard}
              className="px-6 py-2 rounded-lg text-xs tracking-widest transition-colors border"
              style={{ borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)' }}
            >
              DOWNLOAD CARD
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-auto px-8 py-6 border-t border-white/[0.06] flex items-center justify-between">
        <span className="text-white/20 text-xs">Built by tut · open source</span>
        <span className="text-white/20 text-xs">Your data never leaves this browser</span>
      </footer>
    </main>
  );
}
