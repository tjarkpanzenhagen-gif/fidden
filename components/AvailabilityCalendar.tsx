"use client";

import { useState, useEffect } from "react";
import { toISO, today } from "@/lib/bookings";

const DAY_LABELS  = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
const MONTH_NAMES = [
  "Januar","Februar","März","April","Mai","Juni",
  "Juli","August","September","Oktober","November","Dezember",
];

export default function AvailabilityCalendar() {
  const [bookable,    setBookable]    = useState<string[]>([]);
  const [pending,     setPending]     = useState<string[]>([]);
  const [selected,    setSelected]    = useState<string | null>(null);
  const [requesting,  setRequesting]  = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [reqErr,      setReqErr]      = useState("");

  const now = new Date();
  const [year,  setYear]  = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());

  useEffect(() => {
    fetch("/api/bookings")
      .then(r => r.json())
      .then(setBookable)
      .catch(() => setBookable([]));
    fetch("/api/pending")
      .then(r => r.json())
      .then(setPending)
      .catch(() => setPending([]));
  }, []);

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  const firstDay    = new Date(year, month, 1);
  const lastDay     = new Date(year, month + 1, 0);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const todayISO    = today();

  const days: Array<{ iso: string; day: number } | null> = [];
  for (let i = 0; i < startOffset; i++) days.push(null);
  for (let d = 1; d <= lastDay.getDate(); d++) {
    days.push({ iso: toISO(new Date(year, month, d)), day: d });
  }

  const handleDayClick = (iso: string) => {
    if (pending.includes(iso)) return;
    if (!bookable.includes(iso)) return;
    if (iso === selected) {
      setSelected(null); setRequestSent(false); setReqErr(""); return;
    }
    setSelected(iso);
    setRequestSent(false);
    setReqErr("");
  };

  const formatDate = (iso: string) => {
    const [y, m, d] = iso.split("-");
    return `${d}. ${MONTH_NAMES[parseInt(m) - 1]} ${y}`;
  };

  const handleRequest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selected) return;
    setRequesting(true);
    setReqErr("");
    const data = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const res = await fetch("/api/contact", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ ...data, type: "booking_request", requestDate: selected }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Fehler beim Senden");
      }
      setRequestSent(true);
      setPending(p => p.includes(selected) ? p : [...p, selected]);
    } catch (err) {
      setReqErr(err instanceof Error ? err.message : "Anfrage konnte nicht gesendet werden.");
    } finally {
      setRequesting(false);
    }
  };

  return (
    <div>
      <div className="avail-legend">
        <span><span className="legend-dot bookable" /> Buchbar</span>
        <span><span className="legend-dot pending" /> Anfrage ausstehend</span>
        <span><span className="legend-dot free" /> Nicht verfügbar</span>
      </div>

      <div className="cal-header">
        <button className="cal-nav-btn" onClick={prevMonth}>← Zurück</button>
        <h2 className="cal-header-title">{MONTH_NAMES[month]} {year}</h2>
        <button className="cal-nav-btn" onClick={nextMonth}>Weiter →</button>
      </div>

      <div className="cal-grid">
        {DAY_LABELS.map(l => (
          <div className="cal-day-label" key={l}>{l}</div>
        ))}
        {days.map((d, i) => {
          if (!d) return <div className="cal-day empty" key={`e${i}`} />;
          const isPast     = d.iso < todayISO;
          const isBookable = bookable.includes(d.iso);
          const isPending  = pending.includes(d.iso);
          const isSelected = d.iso === selected;
          const isToday    = d.iso === todayISO;
          return (
            <div
              key={d.iso}
              className={[
                "cal-day",
                isPast                         ? "past"     : "",
                isPending                      ? "pending"  : isBookable ? "bookable" : "",
                isToday                        ? "today"    : "",
                isSelected && !isPending       ? "selected" : "",
              ].filter(Boolean).join(" ")}
              onClick={() => !isPast && handleDayClick(d.iso)}
              title={
                isPending  ? `${formatDate(d.iso)} — Anfrage ausstehend` :
                isBookable ? `${formatDate(d.iso)} — Buchbar, klicken zum Anfragen` : undefined
              }
            >
              {d.day}
            </div>
          );
        })}
      </div>

      {bookable.length === 0 && pending.length === 0 && (
        <p style={{ marginTop: "2rem", fontSize: ".7rem", color: "var(--muted)", letterSpacing: ".15em", textAlign: "center" }}>
          Aktuell keine buchbaren Termine — schau später wieder vorbei.
        </p>
      )}

      <div className={`avail-cta${selected ? " show" : ""}`}>
        <p className="avail-cta-date-label">// BUCHUNGSANFRAGE</p>
        <div className="avail-cta-title">{selected ? formatDate(selected) : ""}</div>

        {requestSent ? (
          <div className="request-success">
            <strong>ANFRAGE EINGEGANGEN</strong>
            <p>Wir melden uns innerhalb von 48&nbsp;Stunden. Keep it dark.</p>
          </div>
        ) : (
          <form className="booking-form avail-request-form" onSubmit={handleRequest}>
            <p className="avail-cta-hint">
              Füll das Formular aus — wir melden uns innerhalb von 48&nbsp;Stunden.
            </p>
            <div className="f-row">
              <div className="f-group">
                <label htmlFor="req-name">Name *</label>
                <input
                  id="req-name" name="name" type="text"
                  placeholder="Max Mustermann"
                  required disabled={requesting}
                />
              </div>
              <div className="f-group">
                <label htmlFor="req-email">E-Mail *</label>
                <input
                  id="req-email" name="email" type="email"
                  placeholder="mail@example.com"
                  required disabled={requesting}
                />
              </div>
            </div>
            <div className="f-group">
              <label htmlFor="req-msg">Nachricht</label>
              <textarea
                id="req-msg" name="msg"
                placeholder="Event-Details, Location, Fragen…"
                style={{ minHeight: "80px" }}
                disabled={requesting}
              />
            </div>
            {reqErr && <p className="login-error" style={{ marginTop: 0 }}>{reqErr}</p>}
            <button type="submit" className="submit-btn" disabled={requesting}>
              {requesting ? "[ Wird gesendet… ]" : "[ Anfrage senden ]"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
