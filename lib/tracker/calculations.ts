import type { FoodLogEntry, UserSettings } from "./types";

/** Converts calories to points using the user's conversion rate.
 * Keeps full floating-point precision — rounding only happens at display time
 * via roundPointsForDisplay(). */
export function caloriesToPoints(calories: number, caloriesPerPoint = 100): number {
  if (caloriesPerPoint <= 0) return 0;
  return calories / caloriesPerPoint;
}

/** Rounds points to the nearest half-point for display, per the product
 * requirement that points show as 0.5 / 1 / 1.2 / 2.5 rather than always
 * whole numbers. We round to 1 decimal place rather than forcing halves so
 * manually-entered/overridden point values (e.g. 1.2) still display exactly. */
export function roundPointsForDisplay(points: number): number {
  return Math.round(points * 10) / 10;
}

export function formatPoints(points: number): string {
  const rounded = roundPointsForDisplay(points);
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

function pointsForEntry(entry: FoodLogEntry, settings: UserSettings): number {
  if (entry.isZeroPointVeggie && settings.zeroPointVeggies) return 0;
  return entry.points;
}

export function dailyPointsUsed(entries: FoodLogEntry[], settings: UserSettings): number {
  return entries.reduce((sum, e) => sum + pointsForEntry(e, settings), 0);
}

export function dailyCaloriesUsed(entries: FoodLogEntry[]): number {
  return entries.reduce((sum, e) => sum + e.calories, 0);
}

export function dailyPointsRemaining(entries: FoodLogEntry[], settings: UserSettings): number {
  return settings.dailyPointTarget - dailyPointsUsed(entries, settings);
}

/** Average points used per day across the given entries grouped by date.
 * `dayCount` lets callers average over a fixed window (e.g. 7) even when
 * some days have no entries. */
export function weeklyAverage(
  entriesByDate: Record<string, FoodLogEntry[]>,
  settings: UserSettings,
  dayCount: number
): number {
  const dates = Object.keys(entriesByDate);
  if (dayCount <= 0 || dates.length === 0) return 0;
  const total = dates.reduce(
    (sum, date) => sum + dailyPointsUsed(entriesByDate[date] ?? [], settings),
    0
  );
  return total / dayCount;
}

/** Computes total calories and points for a custom item given a per-serving
 * calorie amount and a (possibly fractional) number of servings. */
export function servingCalculation(caloriesPerServing: number, servings: number, caloriesPerPoint = 100) {
  const totalCalories = caloriesPerServing * servings;
  const totalPoints = caloriesToPoints(totalCalories, caloriesPerPoint);
  return { totalCalories, totalPoints };
}

export function todayDateString(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function addDays(dateString: string, days: number): string {
  const [y, m, d] = dateString.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + days);
  return todayDateString(date);
}

/** Returns the last `count` dates (including today) as YYYY-MM-DD strings,
 * oldest first. */
export function lastNDates(count: number, from = new Date()): string[] {
  const dates: string[] = [];
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(from);
    d.setDate(d.getDate() - i);
    dates.push(todayDateString(d));
  }
  return dates;
}

/** Neutral, non-judgmental copy for how a day's points compare to target. */
export function targetComparisonLabel(used: number, target: number): string {
  const diff = roundPointsForDisplay(used - target);
  if (diff === 0) return "Right on target";
  if (diff > 0) return `${formatPoints(diff)} point${diff === 1 ? "" : "s"} over target`;
  const under = Math.abs(diff);
  return `${formatPoints(under)} point${under === 1 ? "" : "s"} under target`;
}
