import spiritual from "../../data/spiritual.json";
import type { LocaleCode } from "./types";

export type SpiritualLang = LocaleCode;

export function dayIndex(len: number, offset = 0): number {
  const start = new Date(2024, 0, 1);
  const now = new Date();
  const days = Math.floor(
    (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  );
  return (days + offset) % len;
}

export function hourIndex(len: number): number {
  return new Date().getHours() % len;
}

export function verseOfDay() {
  const i = dayIndex(spiritual.verses.length);
  return spiritual.verses[i];
}

export function verseOfHour() {
  const i = hourIndex(spiritual.verses.length);
  return spiritual.verses[i];
}

export function hadithOfDay() {
  const i = dayIndex(spiritual.hadiths.length, 3);
  return spiritual.hadiths[i];
}

export function quoteOfDay() {
  const i = dayIndex(spiritual.quotes.length, 7);
  return spiritual.quotes[i];
}

export function getText(
  item: { en: string; tr: string; de: string; fr: string; [key: string]: unknown },
  locale: SpiritualLang
): string {
  const v = item[locale];
  if (typeof v === "string" && v) return v;
  return item.en || "";
}

export { spiritual };
