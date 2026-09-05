"use client";

type Props = {
  bearing: number;
  label: string;
  bearingLabel: string;
};

export function QiblaCompass({ bearing, label, bearingLabel }: Props) {
  return (
    <div className="card-lux p-5 flex flex-col items-center gap-3">
      <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">{label}</p>
      <div className="relative w-28 h-28">
        <div className="absolute inset-0 rounded-full border border-gold/40" />
        <div className="absolute inset-2 rounded-full border border-emerald-soft/20" />
        <div
          className="absolute inset-0 flex items-start justify-center transition-transform duration-700"
          style={{ transform: `rotate(${bearing}deg)` }}
        >
          <div className="w-0.5 h-12 bg-gradient-to-b from-gold to-transparent mt-2 rounded-full origin-bottom" />
          <div className="absolute top-3 w-2.5 h-2.5 rounded-full bg-gold shadow-gold" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[10px] font-medium text-gold tracking-wider">N</span>
        </div>
        <span className="absolute top-1 left-1/2 -translate-x-1/2 text-[9px] text-[var(--muted)]">↑</span>
      </div>
      <p className="text-sm font-medium">
        {bearingLabel}:{" "}
        <span className="text-gold">{bearing.toFixed(1)}°</span>
      </p>
    </div>
  );
}
