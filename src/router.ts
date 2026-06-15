import { useSyncExternalStore } from "react";

function getHash(): string {
  const h = window.location.hash.replace(/^#/, "");
  return h || "/";
}

function subscribe(cb: () => void): () => void {
  window.addEventListener("hashchange", cb);
  return () => window.removeEventListener("hashchange", cb);
}

export function useRoute(): { path: string; parts: string[] } {
  const path = useSyncExternalStore(subscribe, getHash, () => "/");
  const parts = path.split("/").filter(Boolean);
  return { path, parts };
}

export function go(path: string): void {
  window.location.hash = path.startsWith("/") ? path : `/${path}`;
  // bring the new screen into view (calm, no smooth-scroll if reduced motion)
  window.scrollTo({ top: 0 });
}
