export const STORAGE_KEY = "fidden_bookable_dates";

export function getBookableDates(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw || raw.trim() === "") return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed as string[] : [];
  } catch {
    localStorage.removeItem(STORAGE_KEY); // clear corrupted data
    return [];
  }
}

export function setBookableDates(dates: string[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(dates));
}

export function toISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function today(): string {
  return toISO(new Date());
}
