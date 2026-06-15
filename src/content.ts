import { useLiveQuery } from "dexie-react-hooks";
import { db } from "./db";
import { GESTURES, type Gesture } from "./data/gestures";
import { FORMS, type Form } from "./data/forms";

export type Status = "locked" | "available" | "absorbed";

export interface GestureView extends Gesture {
  status: Status;
  /** the single freshly-opened gesture earns the vermilion accent */
  justUnlocked: boolean;
}

/** Merge seeded + AI gestures, sorted by order; AI gestures follow the ladder. */
export function useGestures(): GestureView[] {
  const custom = useLiveQuery(() => db.customGestures.toArray(), [], []);
  const progress = useLiveQuery(() => db.progress.toArray(), [], []);
  const visited = useLiveQuery(
    () => db.notes.toArray().then((n) => new Set(n.map((x) => x.slug))),
    [],
    new Set<string>(),
  );

  const all: Gesture[] = [
    ...GESTURES,
    ...custom.map((c) => c.gesture),
  ].sort((a, b) => a.order - b.order);

  const statusMap = new Map(progress.map((p) => [p.slug, p.status]));

  return all.map((g, i) => {
    const absorbed = statusMap.get(g.slug) === "absorbed";
    const prevAbsorbed = i === 0 || statusMap.get(all[i - 1].slug) === "absorbed";
    const status: Status = absorbed ? "absorbed" : prevAbsorbed ? "available" : "locked";
    const justUnlocked = status === "available" && i > 0 && prevAbsorbed && !visited.has(g.slug);
    return { ...g, status, justUnlocked };
  });
}

export function useGesture(slug: string | null): GestureView | undefined {
  const gestures = useGestures();
  return slug ? gestures.find((g) => g.slug === slug) : undefined;
}

export function useForms(): Form[] {
  const custom = useLiveQuery(() => db.customForms.toArray(), [], []);
  return [...FORMS, ...custom.map((c) => c.form)];
}

export function useNotes(slug: string) {
  return useLiveQuery(
    () => db.notes.where("slug").equals(slug).reverse().sortBy("date"),
    [slug],
    [],
  );
}

export function useSessions() {
  return useLiveQuery(() => db.sessions.orderBy("date").reverse().toArray(), [], []);
}
