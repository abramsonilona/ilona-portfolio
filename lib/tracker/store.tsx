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
import type {
  Food,
  FoodLogEntry,
  MealType,
  ProgressNote,
  UserSettings,
  WeightEntry,
} from "./types";
import {
  generateId,
  loadEntries,
  loadFoods,
  loadProgressNotes,
  loadSettings,
  loadWeightEntries,
  resetAllData,
  saveEntries,
  saveFoods,
  saveProgressNotes,
  saveSettings,
  saveWeightEntries,
} from "./storage";
import { caloriesToPoints } from "./calculations";
import { DEFAULT_SETTINGS } from "./types";

interface NewEntryInput {
  foodId?: string;
  name: string;
  quantity: string;
  calories: number;
  points?: number; // override; defaults to calories/caloriesPerPoint
  isZeroPointVeggie?: boolean;
  meal: MealType;
  date: string;
}

interface TrackerContextValue {
  ready: boolean;
  settings: UserSettings;
  foods: Food[];
  entries: FoodLogEntry[];
  weightEntries: WeightEntry[];
  progressNotes: ProgressNote[];

  updateSettings: (patch: Partial<UserSettings>) => void;

  addEntry: (input: NewEntryInput) => FoodLogEntry;
  updateEntry: (id: string, patch: Partial<FoodLogEntry>) => void;
  deleteEntry: (id: string) => void;
  entriesForDate: (date: string) => FoodLogEntry[];
  copyEntriesToDate: (sourceDate: string, targetDate: string, meal?: MealType) => void;

  addFood: (food: Omit<Food, "id" | "createdAt">) => Food;
  toggleFavorite: (foodId: string) => void;

  addWeightEntry: (entry: Omit<WeightEntry, "id">) => void;
  deleteWeightEntry: (id: string) => void;

  addProgressNote: (text: string, date: string) => void;
  deleteProgressNote: (id: string) => void;

  resetAll: () => void;
}

const TrackerContext = createContext<TrackerContextValue | null>(null);

export function TrackerProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [foods, setFoods] = useState<Food[]>([]);
  const [entries, setEntries] = useState<FoodLogEntry[]>([]);
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([]);
  const [progressNotes, setProgressNotes] = useState<ProgressNote[]>([]);

  useEffect(() => {
    setSettings(loadSettings());
    setFoods(loadFoods());
    setEntries(loadEntries());
    setWeightEntries(loadWeightEntries());
    setProgressNotes(loadProgressNotes());
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) saveSettings(settings);
  }, [ready, settings]);

  useEffect(() => {
    if (ready) saveFoods(foods);
  }, [ready, foods]);

  useEffect(() => {
    if (ready) saveEntries(entries);
  }, [ready, entries]);

  useEffect(() => {
    if (ready) saveWeightEntries(weightEntries);
  }, [ready, weightEntries]);

  useEffect(() => {
    if (ready) saveProgressNotes(progressNotes);
  }, [ready, progressNotes]);

  const updateSettings = useCallback((patch: Partial<UserSettings>) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  }, []);

  const addEntry = useCallback(
    (input: NewEntryInput): FoodLogEntry => {
      const points = input.points ?? caloriesToPoints(input.calories, settings.caloriesPerPoint);
      const entry: FoodLogEntry = {
        id: generateId(),
        foodId: input.foodId,
        name: input.name,
        quantity: input.quantity,
        calories: input.calories,
        points,
        isZeroPointVeggie: input.isZeroPointVeggie,
        meal: input.meal,
        date: input.date,
        loggedAt: new Date().toISOString(),
      };
      setEntries((prev) => [...prev, entry]);
      return entry;
    },
    [settings.caloriesPerPoint]
  );

  const updateEntry = useCallback((id: string, patch: Partial<FoodLogEntry>) => {
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  }, []);

  const deleteEntry = useCallback((id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const entriesForDate = useCallback(
    (date: string) => entries.filter((e) => e.date === date),
    [entries]
  );

  const copyEntriesToDate = useCallback(
    (sourceDate: string, targetDate: string, meal?: MealType) => {
      setEntries((prev) => {
        const source = prev.filter(
          (e) => e.date === sourceDate && (!meal || e.meal === meal)
        );
        const copies = source.map((e) => ({
          ...e,
          id: generateId(),
          date: targetDate,
          loggedAt: new Date().toISOString(),
        }));
        return [...prev, ...copies];
      });
    },
    []
  );

  const addFood = useCallback((food: Omit<Food, "id" | "createdAt">): Food => {
    const newFood: Food = { ...food, id: generateId(), createdAt: new Date().toISOString() };
    setFoods((prev) => [...prev, newFood]);
    return newFood;
  }, []);

  const toggleFavorite = useCallback((foodId: string) => {
    setFoods((prev) =>
      prev.map((f) => (f.id === foodId ? { ...f, isFavorite: !f.isFavorite } : f))
    );
  }, []);

  const addWeightEntry = useCallback((entry: Omit<WeightEntry, "id">) => {
    setWeightEntries((prev) =>
      [...prev, { ...entry, id: generateId() }].sort((a, b) => a.date.localeCompare(b.date))
    );
  }, []);

  const deleteWeightEntry = useCallback((id: string) => {
    setWeightEntries((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const addProgressNote = useCallback((text: string, date: string) => {
    setProgressNotes((prev) => [{ id: generateId(), date, text }, ...prev]);
  }, []);

  const deleteProgressNote = useCallback((id: string) => {
    setProgressNotes((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const resetAll = useCallback(() => {
    resetAllData();
    setSettings(loadSettings());
    setFoods(loadFoods());
    setEntries([]);
    setWeightEntries([]);
    setProgressNotes([]);
  }, []);

  const value = useMemo<TrackerContextValue>(
    () => ({
      ready,
      settings,
      foods,
      entries,
      weightEntries,
      progressNotes,
      updateSettings,
      addEntry,
      updateEntry,
      deleteEntry,
      entriesForDate,
      copyEntriesToDate,
      addFood,
      toggleFavorite,
      addWeightEntry,
      deleteWeightEntry,
      addProgressNote,
      deleteProgressNote,
      resetAll,
    }),
    [
      ready,
      settings,
      foods,
      entries,
      weightEntries,
      progressNotes,
      updateSettings,
      addEntry,
      updateEntry,
      deleteEntry,
      entriesForDate,
      copyEntriesToDate,
      addFood,
      toggleFavorite,
      addWeightEntry,
      deleteWeightEntry,
      addProgressNote,
      deleteProgressNote,
      resetAll,
    ]
  );

  return <TrackerContext.Provider value={value}>{children}</TrackerContext.Provider>;
}

export function useTracker(): TrackerContextValue {
  const ctx = useContext(TrackerContext);
  if (!ctx) throw new Error("useTracker must be used within a TrackerProvider");
  return ctx;
}
