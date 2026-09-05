"use client";

import { useTranslations } from "next-intl";

export function AboutContent() {
  const t = useTranslations("about");

  const sections = [
    ["calcTitle", "calcBody"],
    ["methodsTitle", "methodsBody"],
    ["asrTitle", "asrBody"],
    ["qiblaTitle", "qiblaBody"],
    ["hijriTitle", "hijriBody"],
    ["privacyTitle", "privacyBody"],
  ] as const;

  return (
    <div className="space-y-8 animate-fade-in max-w-2xl mx-auto">
      <div className="text-center space-y-2">
        <h1 className="font-display text-3xl">{t("title")}</h1>
        <p className="text-gold text-sm tracking-wide">{t("subtitle")}</p>
        <div className="gold-line mx-auto mt-4" />
      </div>

      <p className="card-lux p-6 leading-relaxed text-[var(--fg)]/90">
        {t("intro")}
      </p>

      {sections.map(([title, body]) => (
        <section key={title} className="card-lux p-6 space-y-2">
          <h2 className="font-display text-xl text-gold">{t(title)}</h2>
          <p className="text-sm leading-relaxed text-[var(--muted)]">
            {t(body)}
          </p>
        </section>
      ))}

      <p className="text-center text-xs text-[var(--muted)] pb-8">
        {t("credits")}
      </p>
    </div>
  );
}
