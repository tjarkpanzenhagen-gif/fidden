"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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
        <Link href="#auftritte" onClick={close}>Auftritte</Link>
        <Link href="#gallery"   onClick={close}>Gallery</Link>
        <Link href="#sounds"    onClick={close}>Sounds</Link>
        <Link href="/verfuegbarkeit" onClick={close}>Verfügbar</Link>
        <Link href="#buchung"   onClick={close}>Booking</Link>
      </div>

      <nav className={`nav${scrolled ? " scrolled" : ""}`}>
        <Link href="/" className="nav-logo">
          DJ&nbsp;<em>FIDDEN</em>
        </Link>
        <ul className="nav-links">
          <li><Link href="#auftritte">Auftritte</Link></li>
          <li><Link href="#gallery">Gallery</Link></li>
          <li><Link href="#sounds">Sounds</Link></li>
          <li><Link href="/verfuegbarkeit">Verfügbar</Link></li>
          <li><Link href="#buchung">Booking</Link></li>
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
