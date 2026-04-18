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
  return date.toISOString().split("T")[0];
}

export function today(): string {
  return toISO(new Date());
}
