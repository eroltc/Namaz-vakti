"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { usePrefs } from "@/hooks/usePrefs";
import { requestNotificationPermission } from "@/hooks/useNotifications";
import cities from "../../data/cities.json";
import type {
  CalculationMethodId,
  City,
  LocaleCode,
  Madhhab,
  ThemeMode,
} from "@/lib/types";

const METHODS: CalculationMethodId[] = [
  "MuslimWorldLeague",
  "Egyptian",
  "Karachi",
  "UmmAlQura",
  "NorthAmerica",
  "Turkey",
  "Dubai",
  "Kuwait",
  "Qatar",
  "Singapore",
];

const LANGS: LocaleCode[] = ["en", "tr", "de", "fr"];
const THEMES: ThemeMode[] = ["dark", "light", "system"];

export function SettingsPanel() {
  const t = useTranslations("settings");
  const locale = useLocale() as LocaleCode;
  const { prefs, setPrefs, hydrated } = usePrefs();
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [savedFlash, setSavedFlash] = useState(false);

  const cityList = cities as City[];
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return cityList;
    return cityList.filter(
      (c) =>
        c.name.en.toLowerCase().includes(q) ||
        c.name.tr.toLowerCase().includes(q) ||
        c.name.de.toLowerCase().includes(q) ||
        c.name.fr.toLowerCase().includes(q) ||
        c.id.includes(q)
    );
  }, [query, cityList]);

  const flash = () => {
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1800);
  };

  const selectCity = (c: City) => {
    setPrefs((p) => ({
      ...p,
      location: {
        lat: c.lat,
        lng: c.lng,
        label: c.name[locale] || c.name.en,
        cityId: c.id,
        timezone: c.timezone,
      },
    }));
    flash();
  };

  const changeLocale = (loc: LocaleCode) => {
    setPrefs((p) => ({ ...p, locale: loc }));
    router.replace(pathname, { locale: loc });
    flash();
  };

  if (!hydrated) return null;

  return (
    <div className="space-y-8 animate-fade-in max-w-xl mx-auto">
      <div className="text-center space-y-1">
        <h1 className="font-display text-3xl">{t("title")}</h1>
        <p className="text-[var(--muted)] text-sm">{t("subtitle")}</p>
        {savedFlash && (
          <p className="text-emerald-soft text-xs mt-2">{t("saved")}</p>
        )}
      </div>

      <section className="card-lux p-5 space-y-3">
        <h2 className="text-xs uppercase tracking-[0.2em] text-gold">
          {t("location")}
        </h2>
        <p className="text-sm text-[var(--muted)]">
          {t("city")}:{" "}
          <span className="text-[var(--fg)] font-medium">
            {prefs.location.label}
          </span>
        </p>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("searchCity")}
          className="w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-2.5 text-sm outline-none focus:border-gold"
        />
        <ul className="max-h-48 overflow-y-auto divide-y divide-[var(--border)] rounded-xl border border-[var(--border)]">
          {filtered.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => selectCity(c)}
                className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gold/10 transition-colors ${
                  prefs.location.cityId === c.id ? "bg-gold/15 text-gold" : ""
                }`}
              >
                {c.name[locale]}{" "}
                <span className="text-[var(--muted)]">
                  · {c.country[locale]}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="card-lux p-5 space-y-3">
        <h2 className="text-xs uppercase tracking-[0.2em] text-gold">
          {t("method")}
        </h2>
        <select
          value={prefs.method}
          onChange={(e) => {
            setPrefs((p) => ({
              ...p,
              method: e.target.value as CalculationMethodId,
            }));
            flash();
          }}
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-sm outline-none focus:border-gold"
        >
          {METHODS.map((m) => (
            <option key={m} value={m}>
              {t(`methods.${m}`)}
            </option>
          ))}
        </select>
      </section>

      <section className="card-lux p-5 space-y-3">
        <h2 className="text-xs uppercase tracking-[0.2em] text-gold">
          {t("madhhab")}
        </h2>
        <div className="flex flex-col gap-2">
          {(["standard", "hanafi"] as Madhhab[]).map((m) => (
            <label
              key={m}
              className="flex items-center gap-3 cursor-pointer text-sm"
            >
              <input
                type="radio"
                name="madhhab"
                checked={prefs.madhhab === m}
                onChange={() => {
                  setPrefs((p) => ({ ...p, madhhab: m }));
                  flash();
                }}
                className="accent-[#c9a227]"
              />
              {m === "standard" ? t("standard") : t("hanafi")}
            </label>
          ))}
        </div>
      </section>

      <section className="card-lux p-5 space-y-3">
        <h2 className="text-xs uppercase tracking-[0.2em] text-gold">
          {t("language")}
        </h2>
        <div className="grid grid-cols-2 gap-2">
          {LANGS.map((loc) => (
            <button
              key={loc}
              type="button"
              onClick={() => changeLocale(loc)}
              className={`rounded-xl border px-3 py-2 text-sm transition-colors ${
                locale === loc
                  ? "border-gold bg-gold/15 text-gold"
                  : "border-[var(--border)] hover:border-gold/50"
              }`}
            >
              {loc.toUpperCase()}
            </button>
          ))}
        </div>
      </section>

      <section className="card-lux p-5 space-y-3">
        <h2 className="text-xs uppercase tracking-[0.2em] text-gold">
          {t("theme")}
        </h2>
        <div className="grid grid-cols-3 gap-2">
          {THEMES.map((th) => (
            <button
              key={th}
              type="button"
              onClick={() => {
                setPrefs((p) => ({ ...p, theme: th }));
                flash();
              }}
              className={`rounded-xl border px-2 py-2 text-xs transition-colors ${
                prefs.theme === th
                  ? "border-gold bg-gold/15 text-gold"
                  : "border-[var(--border)]"
              }`}
            >
              {th === "dark"
                ? t("themeDark")
                : th === "light"
                  ? t("themeLight")
                  : t("themeSystem")}
            </button>
          ))}
        </div>
      </section>

      <section className="card-lux p-5 space-y-3">
        <h2 className="text-xs uppercase tracking-[0.2em] text-gold">
          {t("notifications")}
        </h2>
        <p className="text-xs text-[var(--muted)]">{t("notificationsHint")}</p>
        <label className="flex items-center gap-3 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={prefs.notifications}
            onChange={async (e) => {
              const on = e.target.checked;
              if (on) {
                const ok = await requestNotificationPermission();
                if (!ok) return;
              }
              setPrefs((p) => ({ ...p, notifications: on }));
              flash();
            }}
            className="accent-[#c9a227]"
          />
          {t("enableNotifications")}
        </label>
        <label className="flex items-center justify-between text-sm">
          <span>{t("notifyMinutes")}</span>
          <input
            type="number"
            min={1}
            max={60}
            value={prefs.notifyMinutes}
            onChange={(e) => {
              setPrefs((p) => ({
                ...p,
                notifyMinutes: Number(e.target.value) || 10,
              }));
              flash();
            }}
            className="w-20 rounded-lg border border-[var(--border)] bg-transparent px-2 py-1 text-right"
          />
        </label>
      </section>
    </div>
  );
}
