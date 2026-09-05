"use client";

import { useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePrefs } from "@/hooks/usePrefs";
import {
  computePrayerTimes,
  formatTime,
  PRAYER_ORDER,
  toRows,
  weekDates,
} from "@/lib/prayer";
import type { LocaleCode } from "@/lib/types";

export function WeeklyView() {
  const t = useTranslations("weekly");
  const tp = useTranslations("prayers");
  const td = useTranslations("days");
  const locale = useLocale() as LocaleCode;
  const { prefs, hydrated } = usePrefs();

  const days = useMemo(() => {
    const dates = weekDates(new Date());
    return dates.map((d) => {
      const pt = computePrayerTimes(
        prefs.location.lat,
        prefs.location.lng,
        d,
        prefs.method,
        prefs.madhhab
      );
      return { date: d, rows: toRows(pt) };
    });
  }, [prefs]);

  if (!hydrated) return null;

  const todayKey = new Date().toDateString();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-1">
        <h1 className="font-display text-3xl">{t("title")}</h1>
        <p className="text-[var(--muted)] text-sm">{t("subtitle")}</p>
        <p className="text-xs text-gold mt-2">{prefs.location.label}</p>
      </div>

      <div className="overflow-x-auto card-lux">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] text-[var(--muted)]">
              <th className="px-3 py-3 text-left font-medium">{t("day")}</th>
              {PRAYER_ORDER.map((name) => (
                <th key={name} className="px-2 py-3 font-medium text-center">
                  {tp(name)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {days.map(({ date, rows }) => {
              const isToday = date.toDateString() === todayKey;
              return (
                <tr
                  key={date.toISOString()}
                  className={`border-b border-[var(--border)] last:border-0 ${
                    isToday ? "bg-gold/10" : ""
                  }`}
                >
                  <td className="px-3 py-3 whitespace-nowrap">
                    <span className="font-medium">{td(String(date.getDay()))}</span>
                    {isToday && (
                      <span className="ml-2 text-[10px] uppercase tracking-wider text-gold">
                        {t("todayBadge")}
                      </span>
                    )}
                    <div className="text-xs text-[var(--muted)]">
                      {date.getDate()}/{date.getMonth() + 1}
                    </div>
                  </td>
                  {rows.map((r) => (
                    <td
                      key={r.name}
                      className="px-2 py-3 text-center tabular-nums text-[var(--fg)]/90"
                    >
                      {formatTime(r.date, locale)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
