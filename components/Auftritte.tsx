"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import RevealSection from "./RevealSection";
import { formatGigDate, DEFAULT_GIGS, type Gig } from "@/lib/gigs";

function GigCard({ gig, index }: { gig: Gig; index: number }) {
  const { day, month, year } = formatGigDate(gig.date);
  const from = index % 2 === 0 ? "left" : "right";

  return (
    <RevealSection from={from} delay={index * 100} className="gig-card">
      {gig.imageUrl && (
        <>
          <div className="gig-card-bg" style={{ backgroundImage: `url(${gig.imageUrl})` }} />
          <div className="gig-card-bg-gradient" />
        </>
      )}
      <div className="gig-card-num">0{index + 1}</div>
      <div className="gig-card-content">
        <div className="gig-card-date">{day} {month}</div>
        <span className="gig-card-date-sub">{year}</span>
        <div className="gig-card-venue">{gig.venue}</div>
        <div className="gig-card-city">{gig.city}</div>
        {gig.description && (
          <div className="gig-card-desc">&ldquo;{gig.description}&rdquo;</div>
        )}
        {gig.ticketUrl ? (
          <a href={gig.ticketUrl} target="_blank" rel="noopener noreferrer" className="gig-link">
            Tickets →
          </a>
        ) : (
          <Link href="#kontakt" className="gig-link">Anfragen →</Link>
        )}
      </div>
    </RevealSection>
  );
}

export default function Auftritte() {
  const [gigs, setGigs] = useState<Gig[]>([]);

  useEffect(() => {
    fetch("/api/gigs")
      .then(r => r.json())
      .then(setGigs)
      .catch(() => setGigs(DEFAULT_GIGS));
  }, []);

  return (
    <section className="section auftritte-bg" id="auftritte">
      <div className="container">
        <RevealSection from="left"><p className="s-label">— next dates —</p></RevealSection>
        <RevealSection from="left" delay={80}><h2 className="s-title">AUFTRITTE</h2></RevealSection>

        {gigs.length === 0 ? (
          <div className="gig-empty">Keine Auftritte geplant — schau bald wieder vorbei.</div>
        ) : (
          <div className="gig-grid">
            {gigs.map((g, i) => <GigCard key={g.id} gig={g} index={i} />)}
          </div>
        )}
      </div>
    </section>
  );
}
