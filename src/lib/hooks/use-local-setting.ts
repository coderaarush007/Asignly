import { useEffect, useState } from "react";

export function useLocalSetting<T extends string>(key: string, defaultValue: T) {
  const storageKey = `focus-desk:${key}`;
  const [value, setValue] = useState<T>(defaultValue);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // One-time read after mount: localStorage isn't available during SSR, so
    // this intentionally hydrates client-only state rather than syncing an
    // external store's live updates.
    try {
      const stored = window.localStorage.getItem(storageKey);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (stored) setValue(stored as T);
    } catch {
      // localStorage unavailable (private mode, etc.) — fall back to default.
    }
    setLoaded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function update(next: T) {
    setValue(next);
    try {
      window.localStorage.setItem(storageKey, next);
    } catch {
      // Best-effort persistence only.
    }
  }

  return [value, update, loaded] as const;
}
