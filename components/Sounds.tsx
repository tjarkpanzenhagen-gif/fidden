"use client";

import Image from "next/image";
import { useState, useRef, useCallback, useEffect } from "react";
import RevealSection from "./RevealSection";

interface SCTrack {
  id: number;
  title: string;
  duration: number;
  artwork_url: string | null;
  permalink_url: string;
  user: { username: string };
}

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global { interface Window { SC?: any; } }

const SC_PROFILE = "https://soundcloud.com/flying-angel-88722887";
const SC_WIDGET_URL =
  "https://w.soundcloud.com/player/?url=" +
  encodeURIComponent(SC_PROFILE + "/tracks") +
  "&auto_play=false&hide_related=false&show_comments=false" +
  "&show_user=true&show_reposts=false&visual=false";

const SC_FALLBACK_URL =
  "https://w.soundcloud.com/player/?url=" +
  encodeURIComponent(SC_PROFILE) +
  "&color=%23ffffff&auto_play=false&hide_related=false" +
  "&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=true";

function fmtMs(ms: number) {
  const m = Math.floor(ms / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function artUrl(url: string | null) {
  if (!url) return null;
  return url.replace(/-large\./, "-t300x300.");
}

export default function Sounds() {
  const iframeRef   = useRef<HTMLIFrameElement>(null);
  const widgetRef   = useRef<any>(null);
  const scriptRef   = useRef<HTMLScriptElement | null>(null);
  const timeoutRef  = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [tracks,     setTracks]     = useState<SCTrack[]>([]);
  const [activeIdx,  setActiveIdx]  = useState<number | null>(null);
  const [playing,    setPlaying]    = useState(false);
  const [progress,   setProgress]   = useState(0);
  const [nowPlaying, setNowPlaying] = useState<SCTrack | null>(null);
  const [status,     setStatus]     = useState<"loading" | "ready" | "error">("loading");

  const initWidget = useCallback(() => {
    if (!iframeRef.current || !window.SC) return;
    const w = window.SC.Widget(iframeRef.current);
    widgetRef.current = w;

    w.bind(window.SC.Widget.Events.READY, () => {
      const tryGetSounds = (attempt: number) => {
        w.getSounds((sounds: SCTrack[]) => {
          if (!sounds || sounds.length === 0) {
            if (attempt < 5) {
              setTimeout(() => tryGetSounds(attempt + 1), 600 * attempt);
            } else {
              setStatus("error");
            }
            return;
          }
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          setTracks(sounds);
          setStatus("ready");
        });
      };
      tryGetSounds(1);
    });

    w.bind(window.SC.Widget.Events.PLAY, () => {
      setPlaying(true);
      w.getCurrentSound((s: SCTrack) => setNowPlaying(s));
    });
    w.bind(window.SC.Widget.Events.PAUSE,  () => setPlaying(false));
    w.bind(window.SC.Widget.Events.FINISH, () => { setPlaying(false); setProgress(0); });
    w.bind(window.SC.Widget.Events.PLAY_PROGRESS, (e: { relativePosition: number }) => {
      setProgress(e.relativePosition * 100);
    });
  }, []);

  useEffect(() => {
    if (window.SC) { initWidget(); return; }

    const script = document.createElement("script");
    script.src = "https://w.soundcloud.com/player/api.js";
    script.async = true;
    script.onload = initWidget;
    script.onerror = () => setStatus("error");
    scriptRef.current = script;
    document.head.appendChild(script);

    timeoutRef.current = setTimeout(() => setStatus(s => s === "loading" ? "error" : s), 12000);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (scriptRef.current && document.head.contains(scriptRef.current)) {
        document.head.removeChild(scriptRef.current);
      }
    };
  }, [initWidget]);

  const playTrack = (idx: number) => {
    const w = widgetRef.current;
    if (!w) return;
    setActiveIdx(idx);
    w.skip(idx);
    w.play();
  };

  const togglePlay = () => {
    const w = widgetRef.current;
    if (!w) return;
    playing ? w.pause() : w.play();
  };

  return (
    <section className="section sounds-bg" id="sounds">
      {/* Off-screen iframe with real dimensions so browsers fully process it */}
      <iframe
        ref={iframeRef}
        src={SC_WIDGET_URL}
        allow="autoplay"
        title="SC Widget"
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "-9999px",
          top: 0,
          width: "320px",
          height: "166px",
          visibility: "hidden",
          pointerEvents: "none",
        }}
      />

      <div className="container">
        <RevealSection from="left"><p className="s-label">— listen —</p></RevealSection>
        <RevealSection from="left" delay={60}><h2 className="s-title">SOUNDS</h2></RevealSection>

        <RevealSection from="right" delay={120}>

          {status === "loading" && (
            <div className="sc-loading">
              <span className="sc-loading-dot" />
              Tracks werden geladen…
            </div>
          )}

          {status === "error" && (
            <div className="sc-fallback">
              <iframe
                src={SC_FALLBACK_URL}
                width="100%"
                height="450"
                allow="autoplay"
                title="DJ FIDDEN on SoundCloud"
                style={{ border: "none", display: "block" }}
              />
              <div className="sc-sc-link" style={{ marginTop: "1rem" }}>
                <a href={SC_PROFILE} target="_blank" rel="noopener noreferrer">
                  ↗ Alle Tracks auf SoundCloud
                </a>
              </div>
            </div>
          )}

          {status === "ready" && (
            <>
              {/* Now-playing bar */}
              <div className={`sc-now-playing${nowPlaying ? "" : " hidden"}`}>
                {nowPlaying?.artwork_url ? (
                  <Image
                    src={artUrl(nowPlaying.artwork_url)!}
                    alt=""
                    width={44}
                    height={44}
                    className="sc-np-artwork"
                    unoptimized
                  />
                ) : (
                  <div className="sc-np-artwork" style={{ background: "#1a1a1a" }} />
                )}
                <div className="sc-np-info">
                  <div className="sc-np-label">Läuft gerade</div>
                  <div className="sc-np-title">{nowPlaying?.title}</div>
                </div>
                <div className="sc-np-controls">
                  <button className="sc-ctrl-btn" onClick={togglePlay} aria-label="Play/Pause">
                    {playing ? (
                      <svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor">
                        <rect x="0" y="0" width="3" height="12"/>
                        <rect x="7" y="0" width="3" height="12"/>
                      </svg>
                    ) : (
                      <svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor">
                        <path d="M0 0l10 6-10 6z"/>
                      </svg>
                    )}
                  </button>
                  <a
                    href={SC_PROFILE}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="sc-ctrl-btn"
                    title="Open on SoundCloud"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M1.8 11.4c-.2 0-.3.1-.3.3l-.4 2.3.4 2.2c0 .2.1.3.3.3s.3-.1.3-.3l.5-2.2-.5-2.3c0-.2-.1-.3-.3-.3zm1.7-.8c-.2 0-.4.2-.4.4l-.4 3.1.4 2.9c0 .2.2.4.4.4s.4-.2.4-.4l.5-2.9-.5-3.1c0-.2-.2-.4-.4-.4zm1.8-.4c-.3 0-.5.2-.5.5l-.4 3.5.4 3.2c0 .3.2.5.5.5s.5-.2.5-.5l.4-3.2-.4-3.5c0-.3-.2-.5-.5-.5zm1.8-.5c-.3 0-.6.3-.6.6l-.3 4-.3 3.4c0 .3.3.6.6.6s.6-.3.6-.6l.4-3.4-.4-4c0-.3-.3-.6-.6-.6zm1.9-.3c-.3 0-.6.3-.6.6L8 14.2l.4 3.5c0 .4.3.6.6.6.4 0 .6-.3.6-.6l.5-3.5-.5-3.8c0-.3-.3-.6-.6-.6zm1.9-.2c-.4 0-.7.3-.7.7l-.4 4.1.4 3.5c0 .4.3.7.7.7.4 0 .7-.3.7-.7l.4-3.5-.4-4.1c0-.4-.3-.7-.7-.7zm7.9-1.7c-.3-2.4-2.4-4.2-4.8-4.2-1 0-2 .3-2.7.9-.3.2-.4.5-.4.8v9.7c0 .4.3.7.7.7h7.3c1.7 0 3-1.3 3-3s-1.3-3-3-3z"/>
                    </svg>
                  </a>
                </div>
              </div>

              {/* Progress bar */}
              {nowPlaying && (
                <div className="sc-progress-wrap">
                  <div className="sc-progress-fill" style={{ width: `${progress}%` }} />
                </div>
              )}

              {/* Track list */}
              <div className="sc-track-list">
                {tracks.map((t, i) => (
                  <div
                    key={t.id}
                    className={`sc-track${activeIdx === i ? " active" : ""}`}
                    onClick={() => playTrack(i)}
                  >
                    {artUrl(t.artwork_url) ? (
                      <Image
                        src={artUrl(t.artwork_url)!}
                        alt=""
                        width={44}
                        height={44}
                        className="sc-track-art"
                        unoptimized
                      />
                    ) : (
                      <div className="sc-track-art-placeholder">ART</div>
                    )}
                    <div className="sc-track-info">
                      <div className="sc-track-title">{t.title}</div>
                      <div className="sc-track-meta">{t.user.username}</div>
                    </div>
                    <div className="sc-track-duration">{fmtMs(t.duration)}</div>
                  </div>
                ))}
              </div>

              <div className="sc-sc-link">
                <a href={SC_PROFILE} target="_blank" rel="noopener noreferrer">
                  ↗ Alle Tracks auf SoundCloud
                </a>
              </div>
            </>
          )}

        </RevealSection>
      </div>
    </section>
  );
}
