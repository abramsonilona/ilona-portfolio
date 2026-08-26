// Core data model for the weight-loss point tracker.
// All persistence is local-storage based for the MVP (see storage.ts), but the
// shapes here are plain, serializable objects so a backend (e.g. Supabase)
// could be swapped in later without changing consumers of these types.

export type MealType = "breakfast" | "lunch" | "dinner" | "snacks";

export const MEAL_TYPES: MealType[] = ["breakfast", "lunch", "dinner", "snacks"];

export const MEAL_LABELS: Record<MealType, string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
  snacks: "Snacks",
};

/** A reusable food definition — either a seed food, a saved favorite, or a
 * one-off item the user created. Calories are always stored per the
 * given serving; points are derived, never stored redundantly, except on
 * FoodLogEntry where we snapshot the value actually logged. */
export interface Food {
  id: string;
  name: string;
  caloriesPerServing: number;
  servingSize?: string; // free-text label, e.g. "1 slice", "100g"
  isZeroPointVeggie?: boolean;
  isFavorite?: boolean;
  createdAt: string; // ISO timestamp
}

/** One entry logged against a specific day + meal. Snapshots calories and
 * points at the time of logging so later edits to a saved Food (or to the
 * calorie->point conversion) never retroactively change history. */
export interface FoodLogEntry {
  id: string;
  foodId?: string; // present if logged from a saved Food
  name: string;
  quantity: string; // free-text, e.g. "2 servings", "1 cup"
  calories: number;
  points: number;
  isZeroPointVeggie?: boolean;
  meal: MealType;
  date: string; // YYYY-MM-DD, local date the entry belongs to
  loggedAt: string; // ISO timestamp of when it was logged
}

/** Aggregated view of a single day, derived from FoodLogEntry[] rather than
 * stored directly — kept here as the shape returned by selector helpers. */
export interface DailyLog {
  date: string; // YYYY-MM-DD
  entries: FoodLogEntry[];
  totalCalories: number;
  totalPoints: number;
  target: number;
  pointsRemaining: number;
}

export interface WeightEntry {
  id: string;
  date: string; // YYYY-MM-DD
  weight: number; // stored in the unit the user enters; MVP doesn't convert
  note?: string;
}

export interface ProgressNote {
  id: string;
  date: string; // YYYY-MM-DD
  text: string;
}

export interface UserSettings {
  dailyPointTarget: number; // default 17
  caloriesPerPoint: number; // default 100
  zeroPointVeggies: boolean; // default true
  showWeightTracking: boolean; // default false — hidden until user opts in
  showCalories: boolean; // default true
  /** Architected for v2: a rollover bank of unused points across the week.
   * Kept at 0 and non-editable in the UI for the MVP. */
  weeklyFlexBankEnabled: boolean;
  weeklyFlexBankPoints: number;
}

export const DEFAULT_SETTINGS: UserSettings = {
  dailyPointTarget: 17,
  caloriesPerPoint: 100,
  zeroPointVeggies: true,
  showWeightTracking: false,
  showCalories: true,
  weeklyFlexBankEnabled: false,
  weeklyFlexBankPoints: 0,
};
