"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePrefs } from "@/hooks/usePrefs";
import { useNow } from "@/hooks/useNow";
import { usePrayerNotifications } from "@/hooks/useNotifications";
import {
  computePrayerTimes,
  formatCountdown,
  getNextPrayer,
  progressBetween,
  toRows,
} from "@/lib/prayer";
import { qiblaBearing } from "@/lib/qibla";
import { formatGregorian, formatHijri } from "@/lib/hijri";
import {
  getText,
  hadithOfDay,
  verseOfDay,
} from "@/lib/spiritual";
import type { LocaleCode, PrayerName } from "@/lib/types";
import { ProgressRing } from "./ProgressRing";
import { PrayerList } from "./PrayerList";
import { QiblaCompass } from "./QiblaCompass";
import { SpiritualCard } from "./SpiritualCard";

export function HomeDashboard() {
  const t = useTranslations("home");
  const tp = useTranslations("prayers");
  const locale = useLocale() as LocaleCode;
  const { prefs, setPrefs, hydrated } = usePrefs();
  const now = useNow(1000);
  const [locating, setLocating] = useState(false);
  const [locError, setLocError] = useState<string | null>(null);

  const { todayRows, nextInfo } = useMemo(() => {
    const today = computePrayerTimes(
      prefs.location.lat,
      prefs.location.lng,
      now,
      prefs.method,
      prefs.madhhab
    );
    const rows = toRows(today);
    const info = getNextPrayer(rows, now);
    // If past Isha, next is tomorrow Fajr
    let next = info.next;
    let currentDate = info.current?.date ?? null;
    if (now.getTime() >= rows[rows.length - 1].date.getTime()) {
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tmr = computePrayerTimes(
        prefs.location.lat,
        prefs.location.lng,
        tomorrow,
        prefs.method,
        prefs.madhhab
      );
      next = { name: "fajr" as PrayerName, date: tmr.fajr };
      currentDate = rows[rows.length - 1].date;
    }
    return {
      todayRows: rows,
      nextInfo: { ...info, next, currentDate },
    };
  }, [prefs, now]);

  const progress = progressBetween(
    nextInfo.currentDate,
    nextInfo.next.date,
    now
  );
  const countdown = formatCountdown(
    nextInfo.next.date.getTime() - now.getTime()
  );
  const bearing = qiblaBearing(prefs.location.lat, prefs.location.lng);

  usePrayerNotifications(
    prefs.notifications,
    prefs.notifyMinutes,
    nextInfo.next,
    tp(nextInfo.next.name)
  );

  const verse = verseOfDay();
  const hadith = hadithOfDay();

  const locate = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    setLocError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPrefs((p) => ({
          ...p,
          location: {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            label: `${pos.coords.latitude.toFixed(2)}°, ${pos.coords.longitude.toFixed(2)}°`,
            cityId: undefined,
          },
        }));
        setLocating(false);
      },
      () => {
        setLocError(t("locationDenied"));
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 12000 }
    );
  };

  if (!hydrated) {
    return (
      <div className="flex justify-center py-24 text-[var(--muted)]">
        …
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <section className="text-center space-y-2">
        <p className="text-sm tracking-[0.25em] uppercase text-gold">
          {t("greeting")}
        </p>
        <h1 className="font-display text-3xl sm:text-4xl">
          {prefs.location.label}
        </h1>
        <p className="text-[var(--muted)] text-sm">
          {formatGregorian(now, locale)}
        </p>
        <p className="text-emerald-soft text-sm font-medium">
          {t("hijri")}: {formatHijri(now, locale)}
        </p>
        <button
          type="button"
          onClick={locate}
          className="mt-2 text-xs text-gold hover:underline"
        >
          {locating ? t("locating") : t("locateMe")}
        </button>
        {locError && (
          <p className="text-xs text-red-400 mt-1">{locError}</p>
        )}
      </section>

      <section className="flex flex-col items-center gap-4">
        <ProgressRing progress={progress} size={220}>
          <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--muted)]">
            {tp("next")}
          </p>
          <p className="font-display text-2xl text-gold mt-1">
            {tp(nextInfo.next.name)}
          </p>
          <p className="tabular-nums text-3xl font-semibold mt-2 text-emerald-soft">
            {countdown}
          </p>
          <p className="text-xs text-[var(--muted)] mt-1">
            {tp("in")}
          </p>
        </ProgressRing>
        <p className="text-xs text-[var(--muted)]">{t("progressToNext")}</p>
      </section>

      <PrayerList
        rows={todayRows}
        nextName={
          now.getTime() >= todayRows[todayRows.length - 1].date.getTime()
            ? "fajr"
            : nextInfo.next.name
        }
        locale={locale}
      />

      <div className="grid sm:grid-cols-2 gap-4">
        <QiblaCompass
          bearing={bearing}
          label={t("qibla")}
          bearingLabel={t("bearing")}
        />
        <SpiritualCard
          title={t("verseOfDay")}
          arabic={verse.arabic}
          text={getText(verse, locale)}
          meta={verse.ref}
        />
      </div>

      <SpiritualCard
        title={t("hadithOfDay")}
        text={getText(hadith, locale)}
        meta={hadith.source}
      />
    </div>
  );
}
