"use client";

import { useMemo, useState } from "react";
import { useTracker } from "@/lib/tracker/store";
import { formatPoints, todayDateString } from "@/lib/tracker/calculations";
import type { Food, FoodLogEntry, MealType } from "@/lib/tracker/types";

function defaultMealForNow(): MealType {
  const hour = new Date().getHours();
  if (hour < 11) return "breakfast";
  if (hour < 16) return "lunch";
  if (hour < 21) return "dinner";
  return "snacks";
}

export default function FavoritesPage() {
  const { ready, settings, foods, entries, addEntry, addFood, toggleFavorite } = useTracker();
  const [justAdded, setJustAdded] = useState<string | null>(null);

  const favorites = useMemo(() => foods.filter((f) => f.isFavorite), [foods]);

  const recent = useMemo(() => {
    const byKey = new Map<string, FoodLogEntry>();
    [...entries]
      .sort((a, b) => b.loggedAt.localeCompare(a.loggedAt))
      .forEach((e) => {
        const key = e.foodId ?? `name:${e.name.toLowerCase()}`;
        if (!byKey.has(key)) byKey.set(key, e);
      });
    return Array.from(byKey.values()).slice(0, 20);
  }, [entries]);

  const flashAdded = (key: string) => {
    setJustAdded(key);
    setTimeout(() => setJustAdded((cur) => (cur === key ? null : cur)), 1400);
  };

  const logFood = (food: Food) => {
    addEntry({
      foodId: food.id,
      name: food.name,
      quantity: food.servingSize ?? "1 serving",
      calories: food.caloriesPerServing,
      isZeroPointVeggie: food.isZeroPointVeggie,
      meal: defaultMealForNow(),
      date: todayDateString(),
    });
    flashAdded(food.id);
  };

  const logEntry = (entry: FoodLogEntry) => {
    addEntry({
      foodId: entry.foodId,
      name: entry.name,
      quantity: entry.quantity,
      calories: entry.calories,
      points: entry.points,
      isZeroPointVeggie: entry.isZeroPointVeggie,
      meal: defaultMealForNow(),
      date: todayDateString(),
    });
    flashAdded(entry.id);
  };

  const starEntry = (entry: FoodLogEntry) => {
    if (entry.foodId) {
      toggleFavorite(entry.foodId);
      return;
    }
    addFood({
      name: entry.name,
      caloriesPerServing: entry.calories,
      servingSize: entry.quantity,
      isZeroPointVeggie: entry.isZeroPointVeggie,
      isFavorite: true,
    });
  };

  if (!ready) return null;

  return (
    <div className="flex flex-col gap-6 px-4 pt-8">
      <header>
        <h1 className="text-xl font-semibold" style={{ color: "var(--text)" }}>
          Favorites &amp; recent
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
          One tap logs it to today, no forms needed.
        </p>
      </header>

      <section>
        <h2 className="mb-2 px-1 text-sm font-semibold uppercase tracking-wide" style={{ color: "var(--muted)" }}>
          Favorites
        </h2>
        {favorites.length === 0 ? (
          <p className="rounded-2xl px-4 py-3 text-sm" style={{ backgroundColor: "var(--surface)", color: "var(--muted)" }}>
            Star a food to pin it here.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {favorites.map((food) => (
              <LogRow
                key={food.id}
                title={food.name}
                subtitle={`${food.servingSize ?? "1 serving"} · ${Math.round(food.caloriesPerServing)} cal`}
                points={food.isZeroPointVeggie && settings.zeroPointVeggies ? 0 : food.caloriesPerServing / settings.caloriesPerPoint}
                added={justAdded === food.id}
                starred
                onStar={() => toggleFavorite(food.id)}
                onLog={() => logFood(food)}
              />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-2 px-1 text-sm font-semibold uppercase tracking-wide" style={{ color: "var(--muted)" }}>
          Recently logged
        </h2>
        {recent.length === 0 ? (
          <p className="rounded-2xl px-4 py-3 text-sm" style={{ backgroundColor: "var(--surface)", color: "var(--muted)" }}>
            Foods you log will show up here for quick re-adding.
          </p>
        ) : (
          <div className="flex flex-col gap-2 pb-4">
            {recent.map((entry) => {
              const starred = entry.foodId ? favorites.some((f) => f.id === entry.foodId) : false;
              return (
                <LogRow
                  key={entry.id}
                  title={entry.name}
                  subtitle={`${entry.quantity} · ${Math.round(entry.calories)} cal`}
                  points={entry.isZeroPointVeggie && settings.zeroPointVeggies ? 0 : entry.points}
                  added={justAdded === entry.id}
                  starred={starred}
                  onStar={() => starEntry(entry)}
                  onLog={() => logEntry(entry)}
                />
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

function LogRow({
  title,
  subtitle,
  points,
  added,
  starred,
  onStar,
  onLog,
}: {
  title: string;
  subtitle: string;
  points: number;
  added: boolean;
  starred: boolean;
  onStar: () => void;
  onLog: () => void;
}) {
  return (
    <div className="flex items-center gap-2 rounded-2xl px-3 py-2.5" style={{ backgroundColor: "var(--surface)" }}>
      <button
        aria-label={starred ? "Unfavorite" : "Favorite"}
        onClick={onStar}
        className="tap-target flex w-9 shrink-0 items-center justify-center text-xl"
        style={{ color: starred ? "var(--accent)" : "var(--border)" }}
      >
        {starred ? "★" : "☆"}
      </button>
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium" style={{ color: "var(--text)" }}>
          {title}
        </p>
        <p className="truncate text-sm" style={{ color: "var(--muted)" }}>
          {subtitle} · {formatPoints(points)} pts
        </p>
      </div>
      <button
        onClick={onLog}
        className="tap-target shrink-0 rounded-full px-4 text-sm font-semibold text-white"
        style={{ backgroundColor: added ? "var(--sage)" : "var(--accent)" }}
      >
        {added ? "Added ✓" : "Log again"}
      </button>
    </div>
  );
}
