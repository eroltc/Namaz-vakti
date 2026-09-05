"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { getText, spiritual } from "@/lib/spiritual";
import type { LocaleCode } from "@/lib/types";
import { SpiritualCard } from "./SpiritualCard";

type Tab = "verses" | "hadiths" | "quotes";

export function SpiritualBrowse() {
  const t = useTranslations("spiritual");
  const locale = useLocale() as LocaleCode;
  const [tab, setTab] = useState<Tab>("verses");

  const tabs: { id: Tab; label: string }[] = [
    { id: "verses", label: t("verses") },
    { id: "hadiths", label: t("hadiths") },
    { id: "quotes", label: t("quotes") },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-1">
        <h1 className="font-display text-3xl">{t("title")}</h1>
        <p className="text-[var(--muted)] text-sm">{t("subtitle")}</p>
      </div>

      <div className="flex justify-center gap-2 flex-wrap">
        {tabs.map((tb) => (
          <button
            key={tb.id}
            type="button"
            onClick={() => setTab(tb.id)}
            className={`rounded-full px-4 py-1.5 text-sm border transition-colors ${
              tab === tb.id
                ? "border-gold bg-gold/15 text-gold"
                : "border-[var(--border)] text-[var(--muted)]"
            }`}
          >
            {tb.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4">
        {tab === "verses" &&
          spiritual.verses.map((v) => (
            <SpiritualCard
              key={v.id}
              title={v.ref}
              arabic={v.arabic}
              text={getText(v, locale)}
              meta={t("arabic")}
            />
          ))}
        {tab === "hadiths" &&
          spiritual.hadiths.map((h) => (
            <SpiritualCard
              key={h.id}
              title={h.source}
              text={getText(h, locale)}
            />
          ))}
        {tab === "quotes" &&
          spiritual.quotes.map((q) => (
            <SpiritualCard
              key={q.id}
              title={q.author}
              text={getText(q, locale)}
            />
          ))}
      </div>
    </div>
  );
}
