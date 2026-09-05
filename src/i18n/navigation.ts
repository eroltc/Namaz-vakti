"use client";

import { useEffect, useRef } from "react";
import type { PrayerTimeRow } from "@/lib/types";

export function usePrayerNotifications(
  enabled: boolean,
  minutesBefore: number,
  next: PrayerTimeRow | null,
  label: string
) {
  const fired = useRef<string | null>(null);

  useEffect(() => {
    if (!enabled || !next || typeof Notification === "undefined") return;

    const key = `${next.name}-${next.date.getTime()}`;
    const target = next.date.getTime() - minutesBefore * 60_000;

    const tick = () => {
      const now = Date.now();
      if (now >= target && now < next.date.getTime() && fired.current !== key) {
        fired.current = key;
        if (Notification.permission === "granted") {
          new Notification("Miqat", {
            body: `${label} — ${minutesBefore} min`,
            icon: "/icon.svg",
          });
        }
      }
    };

    const id = setInterval(tick, 15_000);
    tick();
    return () => clearInterval(id);
  }, [enabled, minutesBefore, next, label]);
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof Notification === "undefined") return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;
  const res = await Notification.requestPermission();
  return res === "granted";
}
