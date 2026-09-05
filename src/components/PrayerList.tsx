"use client";

import { useTranslations } from "next-intl";
import { formatTime } from "@/lib/prayer";
import type { PrayerName, PrayerTimeRow } from "@/lib/types";

type Props = {
  rows: PrayerTimeRow[];
  nextName: PrayerName;
  locale: string;
};

export function PrayerList({ rows, nextName, locale }: Props) {
  const t = useTranslations("prayers");

  return (
    <ul className="card-lux divide-y divide-[var(--border)] overflow-hidden">
      {rows.map((row) => {
        const isNext = row.name === nextName;
        return (
          <li
            key={row.name}
            className={`flex items-center justify-between px-5 py-4 transition-colors ${
              isNext
                ? "bg-emerald-soft/10 dark:bg-emerald-soft/10 border-l-4 border-l-gold"
                : ""
            }`}
          >
            <div className="flex items-center gap-3">
              {isNext && (
                <span className="h-2 w-2 rounded-full bg-gold animate-pulse-soft" />
              )}
              <span
                className={`font-display text-lg ${
                  isNext ? "text-gold" : "text-[var(--fg)]"
                }`}
              >
                {t(row.name)}
              </span>
              {isNext && (
                <span className="text-[10px] uppercase tracking-widest text-gold/80 border border-gold/30 rounded-full px-2 py-0.5">
                  {t("next")}
                </span>
              )}
            </div>
            <span
              className={`font-body tabular-nums text-lg ${
                isNext ? "text-emerald-soft font-semibold" : "text-[var(--muted)]"
              }`}
            >
              {formatTime(row.date, locale)}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
