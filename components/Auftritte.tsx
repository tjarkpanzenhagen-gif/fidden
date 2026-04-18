import Link from "next/link";
import RevealSection from "./RevealSection";

const gigs = [
  { date: "28. Jun", year: "2026", venue: "Helios Club", city: "Rostock, MV" },
  { date: "12. Jul", year: "2026", venue: "Klex",        city: "Greifswald, MV" },
  { date: "02. Aug", year: "2026", venue: "Stralsund Open Air", city: "Stralsund, MV" },
];

export default function Auftritte() {
  return (
    <section className="section auftritte-bg" id="auftritte">
      <div className="container">
        <RevealSection><p className="s-label">— next dates —</p></RevealSection>
        <RevealSection delay={60}><h2 className="s-title">AUFTRITTE</h2></RevealSection>
        <RevealSection delay={120}>
          <div className="gig-list">
            {gigs.map((g, i) => (
              <div className="gig" key={i}>
                <div className="gig-date">
                  {g.date}<br />{g.year}
                </div>
                <div>
                  <div className="gig-venue">{g.venue}</div>
                  <div className="gig-city">{g.city}</div>
                </div>
                <div />
                <Link href="#buchung" className="gig-link">Tickets →</Link>
              </div>
            ))}
          </div>
        </RevealSection>
      </div>
    </section>
  );
}
