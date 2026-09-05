"use client";

type Props = {
  title: string;
  arabic?: string;
  text: string;
  meta?: string;
};

export function SpiritualCard({ title, arabic, text, meta }: Props) {
  return (
    <article className="card-lux p-6 animate-fade-in ornament">
      <p className="text-xs uppercase tracking-[0.2em] text-gold mb-3">{title}</p>
      {arabic && (
        <p
          className="font-arabic text-2xl leading-relaxed text-right mb-4 text-emerald-deep dark:text-emerald-mist"
          dir="rtl"
          lang="ar"
        >
          {arabic}
        </p>
      )}
      <div className="gold-line mb-4" />
      <p className="text-[var(--fg)]/90 leading-relaxed">{text}</p>
      {meta && (
        <p className="mt-4 text-xs text-[var(--muted)] tracking-wide">{meta}</p>
      )}
    </article>
  );
}
