import Dexie, { type Table } from "dexie";
import type { Gesture } from "./data/gestures";
import type { Form } from "./data/forms";

export type GestureStatus = "available" | "absorbed";

export interface Progress {
  slug: string;
  status: GestureStatus;
  updatedAt: number;
}

export interface Note {
  id?: number;
  slug: string;
  date: number;
  body: string;
  rating: number; // 1–5, a calm self-rating of ease
  absorbed: boolean; // true if this note marked the gesture absorbed
}

export type SessionKind = "etude" | "souffle" | "pratique";

export interface Session {
  id?: number;
  kind: SessionKind;
  refSlug: string; // gesture or form slug
  refName: string; // human label captured at the time
  date: number;
  durationMs: number;
  loops?: number;
  ease?: number; // 1–5 sense of ease afterward
  note?: string;
}

export interface Setting {
  key: string;
  value: string;
}

export interface CustomGestureRow {
  slug: string;
  gesture: Gesture;
}
export interface CustomFormRow {
  slug: string;
  form: Form;
}

class GesteDB extends Dexie {
  progress!: Table<Progress, string>;
  notes!: Table<Note, number>;
  sessions!: Table<Session, number>;
  settings!: Table<Setting, string>;
  customGestures!: Table<CustomGestureRow, string>;
  customForms!: Table<CustomFormRow, string>;

  constructor() {
    super("le-geste-lent");
    this.version(1).stores({
      progress: "slug, status, updatedAt",
      notes: "++id, slug, date",
      sessions: "++id, kind, refSlug, date",
      settings: "key",
      customGestures: "slug",
      customForms: "slug",
    });
  }
}

export const db = new GesteDB();

// ── Progress helpers ──────────────────────────────────────────────────────────
export async function getProgressMap(): Promise<Record<string, Progress>> {
  const rows = await db.progress.toArray();
  return Object.fromEntries(rows.map((r) => [r.slug, r]));
}

export async function setStatus(slug: string, status: GestureStatus): Promise<void> {
  await db.progress.put({ slug, status, updatedAt: Date.now() });
}

export async function logSession(s: Omit<Session, "id">): Promise<void> {
  await db.sessions.add(s);
}

export async function addNote(n: Omit<Note, "id">): Promise<void> {
  await db.notes.add(n);
}

export async function getSetting(key: string): Promise<string | undefined> {
  return (await db.settings.get(key))?.value;
}

export async function setSetting(key: string, value: string): Promise<void> {
  await db.settings.put({ key, value });
}
