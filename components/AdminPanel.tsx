"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { toISO, today } from "@/lib/bookings";
import { formatGigDate, DEFAULT_GIGS, type Gig } from "@/lib/gigs";
import type { ContactEntry } from "@/app/api/contact/route";

const DAY_LABELS   = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
const MONTH_NAMES  = ["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"];

const EMPTY_GIG: Omit<Gig, "id"> = {
  date: "", venue: "", city: "", description: "", imageUrl: "", ticketUrl: "",
};

function authHeader(token: string) {
  return { "Content-Type": "application/json", "Authorization": `Bearer ${token}` };
}

/* ── Login ── */
function Login({ onLogin }: { onLogin: (token: string) => void }) {
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [err, setErr]       = useState("");
  const [loading, setLoad]  = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoad(true);
    setErr("");
    try {
      const res = await fetch("/api/admin/login", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ user: u, pass: p }),
      });
      const data = await res.json();
      if (!res.ok || !data.token) {
        setErr("Ungültige Zugangsdaten.");
        return;
      }
      sessionStorage.setItem("fidden_admin_token", data.token);
      onLogin(data.token);
    } catch {
      setErr("Verbindungsfehler — bitte erneut versuchen.");
    } finally {
      setLoad(false);
    }
  };

  return (
    <div className="login-box">
      <h1>ADMIN</h1>
      <p>DJ FIDDEN · Panel</p>
      <form onSubmit={submit} className="booking-form" style={{ gap: ".9rem" }}>
        <div className="f-group">
          <label htmlFor="au">Benutzername</label>
          <input id="au" type="text" value={u} onChange={e => { setU(e.target.value); setErr(""); }} placeholder="Benutzername" required disabled={loading} />
        </div>
        <div className="f-group">
          <label htmlFor="ap">Passwort</label>
          <input id="ap" type="password" value={p} onChange={e => { setP(e.target.value); setErr(""); }} placeholder="••••••" required disabled={loading} />
        </div>
        {err && <p className="login-error">{err}</p>}
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "[ Einloggen… ]" : "[ Einloggen ]"}
        </button>
      </form>
    </div>
  );
}

/* ── Calendar Tab ── */
function CalendarTab({ token }: { token: string }) {
  const [bookable, setBookable] = useState<string[]>([]);
  const [saved, setSaved]       = useState(false);
  const [saveErr, setSaveErr]   = useState("");
  const now = new Date();
  const [year, setYear]   = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());

  useEffect(() => {
    fetch("/api/bookings").then(r => r.json()).then(setBookable).catch(() => setBookable([]));
  }, []);

  const toggle = (iso: string) => { setSaved(false); setSaveErr(""); setBookable(p => p.includes(iso) ? p.filter(d => d !== iso) : [...p, iso]); };

  const save = () => {
    setSaveErr("");
    fetch("/api/bookings", { method: "POST", headers: authHeader(token), body: JSON.stringify(bookable) })
      .then(async r => {
        if (!r.ok) throw new Error(r.status === 401 ? "Nicht autorisiert — bitte neu einloggen." : "");
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      })
      .catch(err => setSaveErr(err instanceof Error && err.message ? err.message : "Speichern fehlgeschlagen — Vercel KV noch nicht verbunden?"));
  };

  const clear = () => {
    if (!confirm("Alle buchbaren Tage löschen?")) return;
    setBookable([]);
    fetch("/api/bookings", { method: "POST", headers: authHeader(token), body: JSON.stringify([]) });
  };

  const prev = () => month === 0 ? (setMonth(11), setYear(y => y - 1)) : setMonth(m => m - 1);
  const next = () => month === 11 ? (setMonth(0), setYear(y => y + 1)) : setMonth(m => m + 1);

  const firstDay  = new Date(year, month, 1);
  const lastDay   = new Date(year, month + 1, 0);
  const offset    = (firstDay.getDay() + 6) % 7;
  const todayISO  = today();

  const days: Array<{ iso: string; day: number } | null> = [];
  for (let i = 0; i < offset; i++) days.push(null);
  for (let d = 1; d <= lastDay.getDate(); d++) days.push({ iso: toISO(new Date(year, month, d)), day: d });

  return (
    <div>
      <span className="admin-label">
        Klicke auf Tage um sie als buchbar zu markieren — <strong style={{ color: "var(--accent)" }}>Weiß = buchbar</strong>.
        &nbsp;{bookable.length} {bookable.length === 1 ? "Tag" : "Tage"} markiert.
      </span>

      <div className="cal-header">
        <button className="cal-nav-btn" onClick={prev}>← Zurück</button>
        <h2>{MONTH_NAMES[month]} {year}</h2>
        <button className="cal-nav-btn" onClick={next}>Weiter →</button>
      </div>

      <div className="cal-grid">
        {DAY_LABELS.map(l => <div className="cal-day-label" key={l}>{l}</div>)}
        {days.map((d, i) => {
          if (!d) return <div className="cal-day empty" key={`e${i}`} />;
          const isPast = d.iso < todayISO;
          return (
            <div
              key={d.iso}
              className={`cal-day${isPast ? " past" : ""}${bookable.includes(d.iso) ? " bookable" : ""}${d.iso === todayISO ? " today" : ""}`}
              onClick={() => !isPast && toggle(d.iso)}
              title={d.iso}
            >
              {d.day}
            </div>
          );
        })}
      </div>

      <div className="admin-actions">
        <button className="submit-btn" onClick={save}>{saved ? "[ ✓ Gespeichert ]" : "[ Speichern ]"}</button>
        <button className="logout-btn" onClick={clear}>Alle löschen</button>
      </div>
      {saveErr && <p className="login-error" style={{ marginTop: ".5rem" }}>{saveErr}</p>}
    </div>
  );
}

/* ── Gigs Tab ── */
function GigsTab({ token }: { token: string }) {
  const [gigs, setGigsState]      = useState<Gig[]>([]);
  const [form, setForm]           = useState<Omit<Gig, "id">>(EMPTY_GIG);
  const [editing, setEditing]     = useState<string | null>(null);
  const [saved, setSaved]         = useState(false);
  const [saveErr, setSaveErr]     = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadErr, setUploadErr] = useState("");

  useEffect(() => {
    fetch("/api/gigs").then(r => r.json()).then(setGigsState).catch(() => setGigsState(DEFAULT_GIGS));
  }, []);

  const saveGigs = (updated: Gig[]) => {
    setGigsState(updated);
    setSaveErr("");
    fetch("/api/gigs", { method: "POST", headers: authHeader(token), body: JSON.stringify(updated) })
      .then(async r => {
        if (!r.ok) throw new Error(r.status === 401 ? "Nicht autorisiert — bitte neu einloggen." : await r.text());
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      })
      .catch(err => setSaveErr(err instanceof Error && err.message ? err.message : "Speichern fehlgeschlagen — Vercel KV noch nicht verbunden?"));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      saveGigs(gigs.map(g => g.id === editing ? { ...form, id: editing } : g));
      setEditing(null);
    } else {
      saveGigs([...gigs, { ...form, id: crypto.randomUUID() }]);
    }
    setForm(EMPTY_GIG);
  };

  const startEdit = (g: Gig) => {
    setEditing(g.id);
    setForm({ date: g.date, venue: g.venue, city: g.city, description: g.description ?? "", imageUrl: g.imageUrl ?? "", ticketUrl: g.ticketUrl ?? "" });
  };

  const del = (id: string) => {
    if (!confirm("Auftritt löschen?")) return;
    saveGigs(gigs.filter(g => g.id !== id));
  };

  const cancelEdit = () => { setEditing(null); setForm(EMPTY_GIG); };
  const set = (k: keyof typeof form, v: string) => setForm(p => ({ ...p, [k]: v }));

  const MAX_IMG_BYTES = 2 * 1024 * 1024; // 2 MB — stays comfortably within Redis string limits as base64

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowed.includes(file.type)) {
      setUploadErr("Nur JPG, PNG, WebP oder GIF erlaubt.");
      return;
    }
    if (file.size > MAX_IMG_BYTES) {
      setUploadErr("Datei zu groß (max. 2 MB).");
      return;
    }

    setUploading(true);
    setUploadErr("");

    const reader = new FileReader();
    reader.onload = ev => {
      set("imageUrl", ev.target?.result as string);
      setUploading(false);
    };
    reader.onerror = () => {
      setUploadErr("Bild konnte nicht gelesen werden.");
      setUploading(false);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  return (
    <div className="gig-manager">
      {/* Form */}
      <div>
        <span className="gig-manager-title">{editing ? "Auftritt bearbeiten" : "Neuer Auftritt"}</span>
        <form onSubmit={handleSubmit} className="booking-form" style={{ gap: ".9rem" }}>
          <div className="f-row">
            <div className="f-group">
              <label>Datum *</label>
              <input type="date" value={form.date} onChange={e => set("date", e.target.value)} required />
            </div>
            <div className="f-group">
              <label>Venue *</label>
              <input type="text" value={form.venue} onChange={e => set("venue", e.target.value)} placeholder="Club Name" required />
            </div>
          </div>
          <div className="f-group">
            <label>Stadt *</label>
            <input type="text" value={form.city} onChange={e => set("city", e.target.value)} placeholder="Stadt, Region" required />
          </div>
          <div className="f-group">
            <label>Beschreibung</label>
            <textarea value={form.description} onChange={e => set("description", e.target.value)} placeholder="Kurze Beschreibung des Auftritts…" style={{ minHeight: "80px" }} />
          </div>

          {/* Image upload — stored as base64 data URL */}
          <div className="f-group">
            <label>Bild</label>
            <label className="img-upload-zone" style={{ cursor: uploading ? "wait" : "none" }}>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleImageUpload}
                style={{ display: "none" }}
                disabled={uploading}
              />
              {form.imageUrl ? (
                <div className="img-upload-preview">
                  <Image src={form.imageUrl} alt="Vorschau" width={200} height={100} style={{ objectFit: "cover", width: "100%", height: "100px" }} unoptimized />
                  <span className="img-upload-replace">{uploading ? "Lädt hoch…" : "Bild ersetzen — klicken"}</span>
                </div>
              ) : (
                <div className="img-upload-placeholder">
                  {uploading ? (
                    <span>Lädt hoch…</span>
                  ) : (
                    <>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                      </svg>
                      <span>Bild hier ablegen oder klicken</span>
                      <small>JPG, PNG, WebP — max. 2 MB</small>
                    </>
                  )}
                </div>
              )}
            </label>
            {uploadErr && <p className="login-error" style={{ marginTop: ".4rem" }}>{uploadErr}</p>}
          </div>

          <div className="f-group">
            <label>Ticket URL</label>
            <input type="url" value={form.ticketUrl} onChange={e => set("ticketUrl", e.target.value)} placeholder="https://…" />
          </div>
          <div className="admin-actions" style={{ marginTop: 0 }}>
            <button type="submit" className="submit-btn" disabled={uploading}>
              {saved ? "[ ✓ Gespeichert ]" : editing ? "[ Aktualisieren ]" : "[ Hinzufügen ]"}
            </button>
            {editing && <button type="button" className="logout-btn" onClick={cancelEdit}>Abbrechen</button>}
          </div>
          {saveErr && <p className="login-error" style={{ marginTop: ".5rem" }}>{saveErr}</p>}
        </form>
      </div>

      {/* List */}
      <div>
        <span className="gig-manager-title">Alle Auftritte ({gigs.length})</span>
        {gigs.length === 0 ? (
          <div className="gig-empty-state">Noch keine Auftritte eingetragen.</div>
        ) : (
          <div className="gig-manager-list">
            {gigs.map(g => {
              const { day, month, year } = formatGigDate(g.date);
              return (
                <div key={g.id} className="gig-manager-item">
                  {g.imageUrl ? (
                    <Image src={g.imageUrl} alt="" width={48} height={48} className="gig-manager-item-img" unoptimized />
                  ) : (
                    <div className="gig-manager-item-img" style={{ display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".5rem", color: "var(--muted)", letterSpacing: ".1em" }}>IMG</div>
                  )}
                  <div className="gig-manager-item-info">
                    <div className="gig-manager-item-venue">{g.venue}</div>
                    <div className="gig-manager-item-date">{day} {month} {year} · {g.city}</div>
                  </div>
                  <div className="gig-manager-item-actions">
                    <button className="gig-icon-btn" onClick={() => startEdit(g)} title="Bearbeiten">✎</button>
                    <button className="gig-icon-btn del" onClick={() => del(g.id)} title="Löschen">✕</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Contacts Tab ── */
function ContactsTab({ token }: { token: string }) {
  const [entries, setEntries] = useState<ContactEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/contact", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => { setEntries(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [token]);

  const markRead = async (id: string) => {
    await fetch("/api/contact", {
      method:  "PATCH",
      headers: authHeader(token),
      body:    JSON.stringify({ id }),
    });
    setEntries(prev => prev.map(e => e.id === id ? { ...e, read: true } : e));
  };

  if (loading) {
    return (
      <div className="sc-loading">
        <span className="sc-loading-dot" />
        Nachrichten werden geladen…
      </div>
    );
  }

  if (entries.length === 0) {
    return <div className="gig-empty-state">Noch keine Nachrichten eingegangen.</div>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
      {entries.map(e => (
        <div
          key={e.id}
          style={{
            background: e.read ? "var(--surface)" : "var(--surface-2)",
            border: `1px solid ${e.read ? "rgba(255,255,255,.06)" : "var(--accent)"}`,
            padding: "1.25rem 1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: ".6rem",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: ".82rem", fontWeight: 700, letterSpacing: ".06em" }}>{e.name}</div>
              <div style={{ fontSize: ".6rem", color: "var(--muted)", letterSpacing: ".15em", marginTop: ".2rem" }}>
                <a href={`mailto:${e.email}`} style={{ color: "var(--accent)" }}>{e.email}</a>
                {e.tel && <span> · {e.tel}</span>}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: ".75rem", flexShrink: 0 }}>
              <span style={{ fontSize: ".55rem", color: "var(--muted)", letterSpacing: ".1em", textTransform: "uppercase" }}>
                {new Date(e.ts).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}
              </span>
              {!e.read && (
                <button className="logout-btn" style={{ fontSize: ".55rem", padding: ".4rem .8rem" }} onClick={() => markRead(e.id)}>
                  Als gelesen markieren
                </button>
              )}
            </div>
          </div>
          <p style={{ fontSize: ".75rem", color: "rgba(240,240,240,.8)", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{e.msg}</p>
        </div>
      ))}
    </div>
  );
}

/* ── Main Panel ── */
export default function AdminPanel() {
  const [token,    setToken]    = useState<string | null>(null);
  const [tab,      setTab]      = useState<"cal" | "gigs" | "contacts">("cal");
  const [unread,   setUnread]   = useState(0);

  useEffect(() => {
    const stored = sessionStorage.getItem("fidden_admin_token");
    if (stored) setToken(stored);
  }, []);

  useEffect(() => {
    if (!token) return;
    fetch("/api/contact", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : [])
      .then((data: ContactEntry[]) => setUnread(data.filter(e => !e.read).length))
      .catch(() => {});
  }, [token]);

  const logout = () => {
    sessionStorage.removeItem("fidden_admin_token");
    setToken(null);
  };

  const handleLogin = (t: string) => {
    setToken(t);
  };

  if (!token) return <Login onLogin={handleLogin} />;

  return (
    <div>
      <div className="admin-header">
        <div className="admin-header-left">
          <p>— admin panel —</p>
          <h1>DJ FIDDEN</h1>
        </div>
        <button className="logout-btn" onClick={logout}>Ausloggen</button>
      </div>

      <div className="admin-tabs">
        <button className={`admin-tab-btn${tab === "cal" ? " active" : ""}`} onClick={() => setTab("cal")}>
          Verfügbarkeit
        </button>
        <button className={`admin-tab-btn${tab === "gigs" ? " active" : ""}`} onClick={() => setTab("gigs")}>
          Auftritte
        </button>
        <button className={`admin-tab-btn${tab === "contacts" ? " active" : ""}`} onClick={() => { setTab("contacts"); setUnread(0); }}>
          Nachrichten{unread > 0 && <span className="contact-badge">{unread}</span>}
        </button>
      </div>

      {tab === "cal"      && <CalendarTab token={token} />}
      {tab === "gigs"     && <GigsTab token={token} />}
      {tab === "contacts" && <ContactsTab token={token} />}
    </div>
  );
}
