import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** True only after hydration — lets components defer browser-only APIs (e.g. document.body portals) without a setState-in-effect. */
export function useIsClient() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
