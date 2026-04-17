"use client";

import { useEffect, useRef, useState } from "react";
import RevealSection from "./RevealSection";

const BARS = 90;
const TOTAL = 58 * 60;

function buildHeights(): number[] {
  const out: number[] = [];
  for (let i = 0; i < BARS; i++) {
    out.push(8 + Math.abs(Math.sin(i * 0.28) * 36 + Math.sin(i * 0.67) * 14 + ((i * 7919) % 17) - 8));
  }
  return out;
}

const heights = buildHeights();

export default function Sounds() {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const elapsed = (progress / 100) * TOTAL;
  const mins = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const secs = String(Math.floor(elapsed % 60)).padStart(2, "0");
  const played = Math.floor((progress / 100) * BARS);

  useEffect(() => {
    if (playing) {
      tickRef.current = setInterval(() => {
        setProgress(p => {
          const next = p + (100 / TOTAL) * 0.2;
          return next >= 100 ? 0 : next;
        });
      }, 200);
    } else {
      if (tickRef.current) clearInterval(tickRef.current);
    }
    return () => { if (tickRef.current) clearInterval(tickRef.current); };
  }, [playing]);

  const onProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setProgress(((e.clientX - rect.left) / rect.width) * 100);
  };

  return (
    <section className="section sounds-bg" id="sounds">
      <div className="container">
        <RevealSection><p className="s-label">— listen —</p></RevealSection>
        <RevealSection delay={60}><h2 className="s-title">SOUNDS</h2></RevealSection>
        <RevealSection delay={120}>
          <div className="player">
            <div className="player-title">NACHTKLANG 001</div>
            <div className="player-meta">FIDDEN &middot; Mix &middot; 2025 &middot; 58 MIN</div>

            <div className="waveform">
              {heights.map((h, i) => (
                <div
                  key={i}
                  className={`w-bar${i < played ? " played" : ""}`}
                  style={{ height: h + "px" }}
                />
              ))}
            </div>

            <div className="player-controls">
              <button className="play-btn" onClick={() => setPlaying(p => !p)} aria-label="Play/Pause">
                {playing ? (
                  <svg width="10" height="14" viewBox="0 0 10 14" fill="currentColor">
                    <rect x="0" y="0" width="3.5" height="14" />
                    <rect x="6.5" y="0" width="3.5" height="14" />
                  </svg>
                ) : (
                  <svg width="12" height="14" viewBox="0 0 12 14" fill="currentColor">
                    <path d="M0 0l12 7-12 7z" />
                  </svg>
                )}
              </button>
              <span className="time-label">{mins}:{secs}</span>
              <div className="progress-bar" onClick={onProgressClick}>
                <div className="progress-fill" style={{ width: progress + "%" }} />
              </div>
              <span className="time-label">58:00</span>
            </div>
          </div>
        </RevealSection>
      </div>
    </section>
  );
}
