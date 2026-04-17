"use client";

import { useState } from "react";
import RevealSection from "./RevealSection";

export default function Buchung() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="section buchung-bg" id="buchung">
      <div className="container">
        <RevealSection><p className="s-label">— kontakt —</p></RevealSection>
        <RevealSection delay={60}><h2 className="s-title">BUCHUNG</h2></RevealSection>

        <div className="booking-grid">
          <RevealSection delay={100}>
            <div className="booking-aside">
              <p>
                Du willst FIDDEN für dein Event buchen? Schreib uns — wir melden uns
                innerhalb von 48&nbsp;Stunden zurück.
              </p>
              <p>
                Club Nights, Festivals, Private Events, Hochzeiten und mehr. FIDDEN
                bringt die Energie, egal wo.
              </p>
              <div className="avail-box">
                <span className="avail-label">// Verfügbarkeit</span>
                <p>
                  Verfügbare Termine auf Anfrage — aktuell noch{" "}
                  <strong>2026&nbsp;Slots frei</strong>. Jetzt sichern.
                </p>
              </div>
            </div>
          </RevealSection>

          <RevealSection delay={160}>
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
                <div className="f-row">
                  <div className="f-group">
                    <label htmlFor="f-tel">Telefon</label>
                    <input type="tel" id="f-tel" name="tel" placeholder="+49 …" />
                  </div>
                  <div className="f-group">
                    <label htmlFor="f-type">Art des Events *</label>
                    <select id="f-type" name="type" required defaultValue="">
                      <option value="" disabled>Bitte wählen</option>
                      <option>Club Night</option>
                      <option>Private Party</option>
                      <option>Festival</option>
                      <option>Hochzeit</option>
                      <option>Sonstiges</option>
                    </select>
                  </div>
                </div>
                <div className="f-row">
                  <div className="f-group">
                    <label htmlFor="f-date">Datum des Events *</label>
                    <input type="date" id="f-date" name="datum" required />
                  </div>
                  <div className="f-group">
                    <label htmlFor="f-ort">Ort / Venue *</label>
                    <input type="text" id="f-ort" name="ort" placeholder="Club Name, Stadt" required />
                  </div>
                </div>
                <div className="f-group">
                  <label htmlFor="f-msg">Nachricht / Details</label>
                  <textarea
                    id="f-msg"
                    name="msg"
                    placeholder="Erzähl uns mehr — Erwartungen, Gästezahl, Budget…"
                  />
                </div>
                <button type="submit" className="submit-btn">[ Anfrage senden ]</button>
              </form>
            ) : (
              <div className="success-msg show">
                <strong>ANFRAGE EINGEGANGEN</strong>
                <p>Danke — wir melden uns innerhalb von 48&nbsp;Stunden. Keep it dark.</p>
              </div>
            )}
          </RevealSection>
        </div>
      </div>
    </section>
  );
}
