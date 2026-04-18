"use client";

import { useState } from "react";
import RevealSection from "./RevealSection";
import MiniAvailabilityCalendar from "./MiniAvailabilityCalendar";

export default function Buchung() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="section buchung-bg" id="kontakt">
      <div className="container">
        <RevealSection from="left"><p className="s-label">— schreib uns —</p></RevealSection>
        <RevealSection from="left" delay={60}><h2 className="s-title">KONTAKT</h2></RevealSection>

        <RevealSection from="left" delay={80}>
          <a href="mailto:booking@djfidden.de" className="kontakt-mail">
            booking@djfidden.de
          </a>
        </RevealSection>

        <div className="booking-grid" style={{ marginTop: "2.5rem" }}>
          {/* Left aside: text + mini calendar */}
          <RevealSection from="left" delay={100}>
            <div className="booking-aside">
              <p>
                Fragen, Buchungsanfragen oder einfach nur Hallo — schreib uns direkt
                über das Formular oder per Mail.
              </p>
              <p>
                Wir melden uns innerhalb von 48&nbsp;Stunden zurück.
              </p>

              <div className="avail-box" style={{ marginTop: "1.5rem" }}>
                <span className="avail-label">// Verfügbarkeit</span>
                <MiniAvailabilityCalendar />
              </div>
            </div>
          </RevealSection>

          {/* Right: simple contact form */}
          <RevealSection from="right" delay={160}>
            {!submitted ? (
              <form className="booking-form" onSubmit={handleSubmit}>
                <div className="f-row">
                  <div className="f-group">
                    <label htmlFor="f-name">Name *</label>
                    <input type="text" id="f-name" name="name" placeholder="Max Mustermann" required />
                  </div>
                  <div className="f-group">
                    <label htmlFor="f-email">E-Mail *</label>
                    <input type="email" id="f-email" name="email" placeholder="mail@example.com" required />
                  </div>
                </div>
                <div className="f-group">
                  <label htmlFor="f-tel">Telefon</label>
                  <input type="tel" id="f-tel" name="tel" placeholder="+49 …" />
                </div>
                <div className="f-group">
                  <label htmlFor="f-msg">Nachricht *</label>
                  <textarea
                    id="f-msg"
                    name="msg"
                    placeholder="Was hast du auf dem Herzen? Event-Details, Fragen, Anfragen…"
                    style={{ minHeight: "140px" }}
                    required
                  />
                </div>
                <button type="submit" className="submit-btn">[ Nachricht senden ]</button>
              </form>
            ) : (
              <div className="success-msg show">
                <strong>NACHRICHT EINGEGANGEN</strong>
                <p>Danke — wir melden uns innerhalb von 48&nbsp;Stunden. Keep it dark.</p>
              </div>
            )}
          </RevealSection>
        </div>
      </div>
    </section>
  );
}
