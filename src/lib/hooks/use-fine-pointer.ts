import { useSyncExternalStore } from "react";

const QUERY = "(hover: hover) and (pointer: fine)";

function subscribe(callback: () => void) {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getSnapshot() {
  return window.matchMedia(QUERY).matches;
}

/** True for mice/trackpads; false for touch, so hover-only effects don't stick on tap. */
export function useFinePointer() {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
