"use client";

import { useState, useEffect } from "react";
import { getBookableDates, setBookableDates, toISO, today } from "@/lib/bookings";

const CREDENTIALS = { user: "Fiete_Rasser", pass: "12345" };
const DAY_LABELS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
const MONTH_NAMES = [
  "Januar","Februar","März","April","Mai","Juni",
  "Juli","August","September","Oktober","November","Dezember",
];

export default function AdminPanel() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [bookable, setBookable] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);

  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());

  useEffect(() => {
    const stored = sessionStorage.getItem("fidden_admin");
    if (stored === "1") { setLoggedIn(true); setBookable(getBookableDates()); }
  }, []);

  const login = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === CREDENTIALS.user && password === CREDENTIALS.pass) {
      sessionStorage.setItem("fidden_admin", "1");
      setLoggedIn(true);
      setBookable(getBookableDates());
    } else {
      setError("Ungültige Zugangsdaten.");
    }
  };

  const logout = () => {
    sessionStorage.removeItem("fidden_admin");
    setLoggedIn(false);
    setUsername(""); setPassword("");
  };

  const toggleDay = (iso: string) => {
    setBookable(prev =>
      prev.includes(iso) ? prev.filter(d => d !== iso) : [...prev, iso]
    );
    setSaved(false);
  };

  const save = () => {
    setBookableDates(bookable);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const clearAll = () => {
    if (confirm("Alle buchbaren Tage löschen?")) {
      setBookable([]);
      setBookableDates([]);
    }
  };

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  // Build calendar days
  const firstDay = new Date(year, month, 1);
  const lastDay  = new Date(year, month + 1, 0);
  // Start week on Monday (0=Sun→6, 1=Mon→0, ...)
  const startOffset = (firstDay.getDay() + 6) % 7;
  const todayISO = today();

  const days: Array<{ iso: string; day: number } | null> = [];
  for (let i = 0; i < startOffset; i++) days.push(null);
  for (let d = 1; d <= lastDay.getDate(); d++) {
    days.push({ iso: toISO(new Date(year, month, d)), day: d });
  }

  if (!loggedIn) {
    return (
      <div className="login-box">
        <h1>ADMIN</h1>
        <p>DJ FIDDEN · Verfügbarkeit verwalten</p>
        <form onSubmit={login} className="booking-form" style={{ gap: ".9rem" }}>
          <div className="f-group">
            <label htmlFor="adm-user">Benutzername</label>
            <input
              id="adm-user"
              type="text"
              value={username}
              onChange={e => { setUsername(e.target.value); setError(""); }}
              placeholder="Benutzername"
              autoComplete="username"
              required
            />
          </div>
          <div className="f-group">
            <label htmlFor="adm-pass">Passwort</label>
            <input
              id="adm-pass"
              type="password"
              value={password}
              onChange={e => { setPassword(e.target.value); setError(""); }}
              placeholder="••••••"
              autoComplete="current-password"
              required
            />
          </div>
          {error && <p className="login-error">{error}</p>}
          <button type="submit" className="submit-btn">[ Einloggen ]</button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem" }}>
        <div>
          <p className="s-label" style={{ marginBottom: ".25rem" }}>— admin panel —</p>
          <h1 className="s-title" style={{ marginBottom: 0 }}>VERFÜGBARKEIT</h1>
        </div>
        <button className="logout-btn" onClick={logout}>Ausloggen</button>
      </div>

      <span className="admin-label">
        Klicke auf einen Tag um ihn als buchbar zu markieren. Weiß = buchbar.
      </span>

      <div className="cal-header">
        <button className="cal-nav-btn" onClick={prevMonth}>← Zurück</button>
        <h2>{MONTH_NAMES[month]} {year}</h2>
        <button className="cal-nav-btn" onClick={nextMonth}>Weiter →</button>
      </div>

      <div className="cal-grid">
        {DAY_LABELS.map(l => (
          <div className="cal-day-label" key={l}>{l}</div>
        ))}
        {days.map((d, i) => {
          if (!d) return <div className="cal-day empty" key={`e${i}`} />;
          const isPast = d.iso < todayISO;
          const isBookable = bookable.includes(d.iso);
          const isToday = d.iso === todayISO;
          return (
            <div
              key={d.iso}
              className={`cal-day${isPast ? " past" : ""}${isBookable ? " bookable" : ""}${isToday ? " today" : ""}`}
              onClick={() => !isPast && toggleDay(d.iso)}
              title={d.iso}
            >
              {d.day}
            </div>
          );
        })}
      </div>

      <div className="admin-actions">
        <button className="submit-btn" onClick={save}>
          {saved ? "[ ✓ Gespeichert ]" : "[ Speichern ]"}
        </button>
        <button className="logout-btn" onClick={clearAll}>Alle löschen</button>
      </div>

      <p style={{ marginTop: "1.5rem", fontSize: ".62rem", color: "var(--muted)", letterSpacing: ".15em" }}>
        {bookable.length} {bookable.length === 1 ? "Tag" : "Tage"} als buchbar markiert
      </p>
    </div>
  );
}
