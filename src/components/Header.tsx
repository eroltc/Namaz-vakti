"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

const LINKS = ["home", "weekly", "spiritual", "settings", "about"] as const;

const HREF: Record<(typeof LINKS)[number], string> = {
  home: "/",
  weekly: "/weekly",
  spiritual: "/spiritual",
  settings: "/settings",
  about: "/about",
};

export function Header() {
  const t = useTranslations("nav");
  const tBrand = useTranslations("brand");
  const pathname = usePathname();
  const locale = useLocale();

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--bg)]/85 backdrop-blur-md">
      <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-night dark:bg-emerald-deep border border-gold/40 text-gold font-display text-lg">
            م
          </span>
          <div>
            <p className="font-display text-lg leading-tight group-hover:text-gold transition-colors">
              {tBrand("name")}
            </p>
            <p className="text-[10px] tracking-[0.15em] uppercase text-[var(--muted)] hidden sm:block">
              {tBrand("tagline")}
            </p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {LINKS.map((key) => {
            const href = HREF[key];
            const active =
              href === "/"
                ? pathname === "/" || pathname === `/${locale}`
                : pathname.includes(href);
            return (
              <Link
                key={key}
                href={href}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  active
                    ? "text-gold bg-gold/10"
                    : "text-[var(--muted)] hover:text-[var(--fg)] hover:bg-[var(--border)]/40"
                }`}
              >
                {t(key)}
              </Link>
            );
          })}
        </nav>

        <div className="md:hidden flex gap-1 overflow-x-auto max-w-[55vw]">
          {LINKS.map((key) => (
            <Link
              key={key}
              href={HREF[key]}
              className="px-2.5 py-1 rounded-lg text-xs text-[var(--muted)] whitespace-nowrap border border-[var(--border)]"
            >
              {t(key)}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
