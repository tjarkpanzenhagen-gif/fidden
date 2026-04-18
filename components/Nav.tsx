"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const SC_URL = "https://soundcloud.com/flying-angel-88722887";

function SoundCloudIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-label="SoundCloud">
      <path d="M1.8 11.4c-.2 0-.3.1-.3.3l-.4 2.3.4 2.2c0 .2.1.3.3.3s.3-.1.3-.3l.5-2.2-.5-2.3c0-.2-.1-.3-.3-.3zm1.7-.8c-.2 0-.4.2-.4.4l-.4 3.1.4 2.9c0 .2.2.4.4.4s.4-.2.4-.4l.5-2.9-.5-3.1c0-.2-.2-.4-.4-.4zm1.8-.4c-.3 0-.5.2-.5.5l-.4 3.5.4 3.2c0 .3.2.5.5.5s.5-.2.5-.5l.4-3.2-.4-3.5c0-.3-.2-.5-.5-.5zm1.8-.5c-.3 0-.6.3-.6.6l-.3 4-.3 3.4c0 .3.3.6.6.6s.6-.3.6-.6l.4-3.4-.4-4c0-.3-.3-.6-.6-.6zm1.9-.3c-.3 0-.6.3-.6.6L8 14.2l.4 3.5c0 .4.3.6.6.6.4 0 .6-.3.6-.6l.5-3.5-.5-3.8c0-.3-.3-.6-.6-.6zm1.9-.2c-.4 0-.7.3-.7.7l-.4 4.1.4 3.5c0 .4.3.7.7.7.4 0 .7-.3.7-.7l.4-3.5-.4-4.1c0-.4-.3-.7-.7-.7zm7.9-1.7c-.3-2.4-2.4-4.2-4.8-4.2-1 0-2 .3-2.7.9-.3.2-.4.5-.4.8v9.7c0 .4.3.7.7.7h7.3c1.7 0 3-1.3 3-3s-1.3-3-3-3z"/>
    </svg>
  );
}

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = () => setOpen(false);

  return (
    <>
      <div className={`mobile-overlay${open ? " open" : ""}`}>
        <Link href="#auftritte"      onClick={close}>Auftritte</Link>
        <Link href="#verfuegbarkeit" onClick={close}>Verfügbar</Link>
        <Link href="#kontakt"        onClick={close}>Kontakt</Link>
        <a href={SC_URL} target="_blank" rel="noopener noreferrer" onClick={close}>SoundCloud</a>
      </div>

      <nav className={`nav${scrolled ? " scrolled" : ""}`}>
        <Link href="/" className="nav-logo">
          DJ&nbsp;<em>FIDDEN</em>
        </Link>
        <ul className="nav-links">
          <li><Link href="#auftritte">Auftritte</Link></li>
          <li><Link href="#verfuegbarkeit">Verfügbar</Link></li>
          <li><Link href="#kontakt">Kontakt</Link></li>
          <li>
            <a
              href={SC_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="nav-sc-link"
              title="SoundCloud"
            >
              <SoundCloudIcon />
            </a>
          </li>
        </ul>
        <button
          className={`hamburger${open ? " open" : ""}`}
          aria-label="Menu"
          onClick={() => setOpen(o => !o)}
        >
          <span /><span /><span />
        </button>
      </nav>
    </>
  );
}
