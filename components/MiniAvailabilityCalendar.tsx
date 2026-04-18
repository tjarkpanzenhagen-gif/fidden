"use client";

import { useState, useEffect } from "react";
import { getBookableDates, toISO, today } from "@/lib/bookings";

const DAY_LABELS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
const MONTH_NAMES = ["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"];

export default function MiniAvailabilityCalendar() {
  const [bookable, setBookable] = useState<string[]>([]);
  const now = new Date();
  const [year, setYear]   = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());

  useEffect(() => { setBookable(getBookableDates()); }, []);

  const prev = () => month === 0  ? (setMonth(11), setYear(y => y - 1)) : setMonth(m => m - 1);
  const next = () => month === 11 ? (setMonth(0),  setYear(y => y + 1)) : setMonth(m => m + 1);

  const firstDay = new Date(year, month, 1);
  const lastDay  = new Date(year, month + 1, 0);
  const offset   = (firstDay.getDay() + 6) % 7;
  const todayISO = today();

  const days: Array<{ iso: string; day: number } | null> = [];
  for (let i = 0; i < offset; i++) days.push(null);
  for (let d = 1; d <= lastDay.getDate(); d++)
    days.push({ iso: toISO(new Date(year, month, d)), day: d });

  const freeCount = bookable.filter(d => d >= todayISO && d.startsWith(`${year}-${String(month + 1).padStart(2, "0")}`)).length;

  return (
    <div className="mini-cal">
      <div className="mini-cal-header">
        <button className="mini-cal-nav" onClick={prev}>←</button>
        <span className="mini-cal-title">{MONTH_NAMES[month]} {year}</span>
        <button className="mini-cal-nav" onClick={next}>→</button>
      </div>

      <div className="mini-cal-grid">
        {DAY_LABELS.map(l => <div className="mini-cal-label" key={l}>{l}</div>)}
        {days.map((d, i) => {
          if (!d) return <div className="mini-cal-day empty" key={`e${i}`} />;
          const isPast     = d.iso < todayISO;
          const isBookable = bookable.includes(d.iso);
          const isToday    = d.iso === todayISO;
          return (
            <div
              key={d.iso}
              className={[
                "mini-cal-day",
                isPast     ? "past"     : "",
                isBookable ? "bookable" : "",
                isToday    ? "today"    : "",
              ].filter(Boolean).join(" ")}
              title={isBookable ? `${d.day}. ${MONTH_NAMES[month]} — Buchbar` : undefined}
            >
              {d.day}
            </div>
          );
        })}
      </div>

      <div className="mini-cal-legend">
        <span className="mini-legend-item">
          <span className="mini-legend-dot bookable" /> Buchbar
        </span>
        <span className="mini-legend-item">
          <span className="mini-legend-dot" /> Nicht verfügbar
        </span>
        <span className="mini-legend-item">
          <span className="mini-legend-dot past" /> Vergangen
        </span>
      </div>

      {freeCount > 0 && (
        <p className="mini-cal-hint">
          {freeCount} {freeCount === 1 ? "freier Tag" : "freie Tage"} diesen Monat
        </p>
      )}
      {bookable.length === 0 && (
        <p className="mini-cal-hint">Keine buchbaren Termine — bald wieder verfügbar.</p>
      )}
    </div>
  );
}
