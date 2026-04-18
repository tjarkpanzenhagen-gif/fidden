export interface Gig {
  id: string;
  date: string; // YYYY-MM-DD
  venue: string;
  city: string;
  description?: string;
  imageUrl?: string;
  ticketUrl?: string;
}

const GIGS_KEY = "fidden_gigs";

export const DEFAULT_GIGS: Gig[] = [
  {
    id: "default-1",
    date: "2026-06-28",
    venue: "Helios Club",
    city: "Rostock, MV",
    description: "Eine Nacht voller Energie — FIDDEN live in Rostock.",
  },
  {
    id: "default-2",
    date: "2026-07-12",
    venue: "Klex",
    city: "Greifswald, MV",
    description: "Underground set im Klex — Greifswald tanzt.",
  },
  {
    id: "default-3",
    date: "2026-08-02",
    venue: "Stralsund Open Air",
    city: "Stralsund, MV",
    description: "Open Air Festival — FIDDEN unter freiem Himmel.",
  },
];

export function getGigs(): Gig[] {
  if (typeof window === "undefined") return DEFAULT_GIGS;
  try {
    const raw = localStorage.getItem(GIGS_KEY);
    if (!raw || raw.trim() === "") return DEFAULT_GIGS;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return DEFAULT_GIGS;
    return parsed as Gig[];
  } catch {
    localStorage.removeItem(GIGS_KEY); // clear corrupted data
    return DEFAULT_GIGS;
  }
}

export function setGigs(gigs: Gig[]): void {
  localStorage.setItem(GIGS_KEY, JSON.stringify(gigs));
}

export function formatGigDate(iso: string): { day: string; month: string; year: string } {
  const [y, m, d] = iso.split("-");
  const months = ["Jan","Feb","Mär","Apr","Mai","Jun","Jul","Aug","Sep","Okt","Nov","Dez"];
  return { day: d, month: months[parseInt(m) - 1], year: y };
}
