"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getBookableDates, toISO, today } from "@/lib/bookings";

const DAY_LABELS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
const MONTH_NAMES = [
  "Januar","Februar","März","April","Mai","Juni",
  "Juli","August","September","Oktober","November","Dezember",
];

export default function AvailabilityCalendar() {
  const router = useRouter();
  const [bookable, setBookable] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());

  useEffect(() => {
    setBookable(getBookableDates());
  }, []);

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  const firstDay = new Date(year, month, 1);
  const lastDay  = new Date(year, month + 1, 0);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const todayISO = today();

  const days: Array<{ iso: string; day: number } | null> = [];
  for (let i = 0; i < startOffset; i++) days.push(null);
  for (let d = 1; d <= lastDay.getDate(); d++) {
    days.push({ iso: toISO(new Date(year, month, d)), day: d });
  }

  const handleDayClick = (iso: string) => {
    if (!bookable.includes(iso)) return;
    setSelected(iso === selected ? null : iso);
  };

  const formatDate = (iso: string) => {
    const [y, m, d] = iso.split("-");
    return `${d}. ${MONTH_NAMES[parseInt(m) - 1]} ${y}`;
  };

  const bookNow = () => {
    if (!selected) return;
    router.push(`/#buchung?date=${selected}`);
  };

  return (
    <div>
      <div className="avail-legend">
        <span><span className="legend-dot bookable" /> Buchbar</span>
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
          const isSelected = d.iso === selected;
          const isToday    = d.iso === todayISO;
          return (
            <div
              key={d.iso}
              className={[
                "cal-day",
                isPast     ? "past"     : "",
                isBookable ? "bookable" : "",
                isToday    ? "today"    : "",
                isSelected ? "selected" : "",
              ].join(" ").trim()}
              onClick={() => !isPast && handleDayClick(d.iso)}
              title={isBookable ? `${formatDate(d.iso)} — Buchbar` : undefined}
              style={isSelected ? { outline: "2px solid var(--bg)", outlineOffset: "-3px" } : undefined}
            >
              {d.day}
            </div>
          );
        })}
      </div>

      {bookable.length === 0 && (
        <p style={{ marginTop: "2rem", fontSize: ".7rem", color: "var(--muted)", letterSpacing: ".15em", textAlign: "center" }}>
          Aktuell keine buchbaren Termine — schau später wieder vorbei.
        </p>
      )}

      <div className={`avail-cta${selected ? " show" : ""}`}>
        <div className="avail-cta-title">
          {selected ? formatDate(selected) : ""}
        </div>
        <p>Dieser Termin ist verfügbar. Klicke unten um eine Buchungsanfrage zu schicken.</p>
        <button className="submit-btn" onClick={bookNow}>[ Jetzt anfragen ]</button>
      </div>
    </div>
  );
}
