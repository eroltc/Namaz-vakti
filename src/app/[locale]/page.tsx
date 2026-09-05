/** Approximate Hijri date via Intl Islamic calendar */
export function formatHijri(date: Date, locale: string): string {
  try {
    return new Intl.DateTimeFormat(`${locale}-u-ca-islamic`, {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  } catch {
    return new Intl.DateTimeFormat("en-u-ca-islamic", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  }
}

export function formatGregorian(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}
