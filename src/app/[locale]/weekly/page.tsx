import {
  CalculationMethod,
  CalculationParameters,
  Coordinates,
  Madhab,
  PrayerTimes,
} from "adhan";
import type {
  CalculationMethodId,
  Madhhab,
  PrayerName,
  PrayerTimeRow,
} from "./types";

const METHOD_MAP: Record<
  CalculationMethodId,
  () => CalculationParameters
> = {
  MuslimWorldLeague: () => CalculationMethod.MuslimWorldLeague(),
  Egyptian: () => CalculationMethod.Egyptian(),
  Karachi: () => CalculationMethod.Karachi(),
  UmmAlQura: () => CalculationMethod.UmmAlQura(),
  NorthAmerica: () => CalculationMethod.NorthAmerica(),
  Turkey: () => CalculationMethod.Turkey(),
  Dubai: () => CalculationMethod.Dubai(),
  Kuwait: () => CalculationMethod.Kuwait(),
  Qatar: () => CalculationMethod.Qatar(),
  Singapore: () => CalculationMethod.Singapore(),
};

export const PRAYER_ORDER: PrayerName[] = [
  "fajr",
  "sunrise",
  "dhuhr",
  "asr",
  "maghrib",
  "isha",
];

export function getParams(
  method: CalculationMethodId,
  madhhab: Madhhab
): CalculationParameters {
  const params = METHOD_MAP[method]();
  params.madhab = madhhab === "hanafi" ? Madhab.Hanafi : Madhab.Shafi;
  return params;
}

export function computePrayerTimes(
  lat: number,
  lng: number,
  date: Date,
  method: CalculationMethodId,
  madhhab: Madhhab
): PrayerTimes {
  const coordinates = new Coordinates(lat, lng);
  const params = getParams(method, madhhab);
  return new PrayerTimes(coordinates, date, params);
}

export function toRows(pt: PrayerTimes): PrayerTimeRow[] {
  return [
    { name: "fajr", date: pt.fajr },
    { name: "sunrise", date: pt.sunrise },
    { name: "dhuhr", date: pt.dhuhr },
    { name: "asr", date: pt.asr },
    { name: "maghrib", date: pt.maghrib },
    { name: "isha", date: pt.isha },
  ];
}

export function getNextPrayer(
  rows: PrayerTimeRow[],
  now: Date = new Date()
): { current: PrayerTimeRow | null; next: PrayerTimeRow; index: number } {
  for (let i = 0; i < rows.length; i++) {
    if (rows[i].date.getTime() > now.getTime()) {
      return {
        current: i > 0 ? rows[i - 1] : null,
        next: rows[i],
        index: i,
      };
    }
  }
  // After Isha → next is tomorrow's Fajr (caller may pass tomorrow rows)
  return { current: rows[rows.length - 1], next: rows[0], index: 0 };
}

export function formatTime(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

export function formatCountdown(ms: number): string {
  if (ms < 0) ms = 0;
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) {
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function progressBetween(
  prev: Date | null,
  next: Date,
  now: Date
): number {
  if (!prev) return 0;
  const total = next.getTime() - prev.getTime();
  if (total <= 0) return 1;
  const done = now.getTime() - prev.getTime();
  return Math.min(1, Math.max(0, done / total));
}

export function weekDates(from: Date = new Date()): Date[] {
  const dates: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(from);
    d.setHours(12, 0, 0, 0);
    d.setDate(from.getDate() + i);
    dates.push(d);
  }
  return dates;
}
