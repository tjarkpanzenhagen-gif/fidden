"use client";

import { useState, useEffect } from "react";
import RevealSection from "./RevealSection";
import { formatGigDate, DEFAULT_GIGS, type Gig } from "@/lib/gigs";

function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function GigCard({ gig, index, isPast }: { gig: Gig; index: number; isPast: boolean }) {
  const { day, month, year } = formatGigDate(gig.date);
  const from = index % 2 === 0 ? "left" : "right";

  return (
    <RevealSection from={from} delay={index * 80} className={`gig-card${isPast ? " gig-card-past" : ""}`}>
      {gig.imageUrl && (
        <>
          <div className="gig-card-bg" style={{ backgroundImage: `url(${gig.imageUrl})` }} />
          <div className="gig-card-bg-gradient" />
        </>
      )}
      {isPast && <div className="gig-past-label">Vergangen</div>}
      <div className="gig-card-num">{String(index + 1).padStart(2, "0")}</div>
      <div className="gig-card-content">
        <div className="gig-card-date">{day} {month}</div>
        <span className="gig-card-date-sub">{year}</span>
        <div className="gig-card-venue">{gig.venue}</div>
        <div className="gig-card-city">{gig.city}</div>
        {gig.description && (
          <div className="gig-card-desc">&ldquo;{gig.description}&rdquo;</div>
        )}
        {gig.ticketUrl && !isPast && (
          <a href={gig.ticketUrl} target="_blank" rel="noopener noreferrer" className="gig-link">
            Tickets →
          </a>
        )}
      </div>
    </RevealSection>
  );
}

export default function Auftritte() {
  const [gigs, setGigs] = useState<Gig[]>([]);
  const today = todayISO();

  useEffect(() => {
    fetch("/api/gigs")
      .then(r => r.json())
      .then(setGigs)
      .catch(() => setGigs(DEFAULT_GIGS));
  }, []);

  const upcoming = gigs.filter(g => g.date >= today);
  const past     = gigs.filter(g => g.date < today);
  const visible  = [...upcoming, ...past]; // upcoming first, past at end

  return (
    <section className="section auftritte-bg" id="auftritte">
      <div className="container">
        <RevealSection from="left"><p className="s-label">— next dates —</p></RevealSection>
        <RevealSection from="left" delay={80}><h2 className="s-title">AUFTRITTE</h2></RevealSection>

        {visible.length === 0 ? (
          <div className="gig-empty">Keine Auftritte geplant — schau bald wieder vorbei.</div>
        ) : (
          <div className="gig-grid">
            {visible.map((g, i) => (
              <GigCard
                key={g.id}
                gig={g}
                index={i}
                isPast={g.date < today}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
