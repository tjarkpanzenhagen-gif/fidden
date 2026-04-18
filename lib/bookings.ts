export const STORAGE_KEY = "fidden_bookable_dates";

export function getBookableDates(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
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
