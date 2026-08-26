import type { Food, FoodLogEntry, ProgressNote, UserSettings, WeightEntry } from "./types";
import { DEFAULT_SETTINGS } from "./types";
import { SEED_FOODS } from "./seed";

// A thin localStorage persistence layer. Every read/write goes through here
// so swapping in a real backend later (Supabase, etc.) only means replacing
// this module's internals — callers (the TrackerProvider context) don't
// change.

const KEYS = {
  settings: "tracker:settings",
  foods: "tracker:foods",
  entries: "tracker:entries",
  weightEntries: "tracker:weightEntries",
  progressNotes: "tracker:progressNotes",
} as const;

function isBrowser() {
  return typeof window !== "undefined";
}

function readJSON<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJSON<T>(key: string, value: T) {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage can throw in private-browsing/full-storage situations;
    // failing silently keeps the app usable rather than crashing a save.
  }
}

export function generateId(): string {
  if (isBrowser() && "randomUUID" in window.crypto) {
    return window.crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function seedFoods(): Food[] {
  const now = new Date().toISOString();
  return SEED_FOODS.map((f) => ({ ...f, id: generateId(), createdAt: now }));
}

export function loadSettings(): UserSettings {
  return { ...DEFAULT_SETTINGS, ...readJSON(KEYS.settings, DEFAULT_SETTINGS) };
}

export function saveSettings(settings: UserSettings) {
  writeJSON(KEYS.settings, settings);
}

export function loadFoods(): Food[] {
  const existing = readJSON<Food[] | null>(KEYS.foods, null);
  if (existing && existing.length > 0) return existing;
  const seeded = seedFoods();
  writeJSON(KEYS.foods, seeded);
  return seeded;
}

export function saveFoods(foods: Food[]) {
  writeJSON(KEYS.foods, foods);
}

export function loadEntries(): FoodLogEntry[] {
  return readJSON<FoodLogEntry[]>(KEYS.entries, []);
}

export function saveEntries(entries: FoodLogEntry[]) {
  writeJSON(KEYS.entries, entries);
}

export function loadWeightEntries(): WeightEntry[] {
  return readJSON<WeightEntry[]>(KEYS.weightEntries, []);
}

export function saveWeightEntries(entries: WeightEntry[]) {
  writeJSON(KEYS.weightEntries, entries);
}

export function loadProgressNotes(): ProgressNote[] {
  return readJSON<ProgressNote[]>(KEYS.progressNotes, []);
}

export function saveProgressNotes(notes: ProgressNote[]) {
  writeJSON(KEYS.progressNotes, notes);
}

export function resetAllData() {
  if (!isBrowser()) return;
  Object.values(KEYS).forEach((key) => window.localStorage.removeItem(key));
}
