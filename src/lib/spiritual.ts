"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { loadPrefs, savePrefs } from "@/lib/storage";
import { DEFAULT_PREFS, type AppPrefs } from "@/lib/types";

type PrefsCtx = {
  prefs: AppPrefs;
  setPrefs: (p: AppPrefs | ((prev: AppPrefs) => AppPrefs)) => void;
  hydrated: boolean;
};

const Ctx = createContext<PrefsCtx | null>(null);

export function PrefsProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefsState] = useState<AppPrefs>(DEFAULT_PREFS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setPrefsState(loadPrefs());
    setHydrated(true);
  }, []);

  const setPrefs = useCallback(
    (p: AppPrefs | ((prev: AppPrefs) => AppPrefs)) => {
      setPrefsState((prev) => {
        const next = typeof p === "function" ? p(prev) : p;
        savePrefs(next);
        return next;
      });
    },
    []
  );

  useEffect(() => {
    if (!hydrated) return;
    const root = document.documentElement;
    const apply = (mode: "dark" | "light") => {
      root.classList.toggle("dark", mode === "dark");
    };
    if (prefs.theme === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      apply(mq.matches ? "dark" : "light");
      const handler = (e: MediaQueryListEvent) =>
        apply(e.matches ? "dark" : "light");
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    }
    apply(prefs.theme);
  }, [prefs.theme, hydrated]);

  const value = useMemo(
    () => ({ prefs, setPrefs, hydrated }),
    [prefs, setPrefs, hydrated]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function usePrefs() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("usePrefs must be used within PrefsProvider");
  return ctx;
}
