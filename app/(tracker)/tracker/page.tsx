"use client";

import Link from "next/link";
import { useTracker } from "@/lib/tracker/store";
import {
  addDays,
  dailyCaloriesUsed,
  dailyPointsRemaining,
  dailyPointsUsed,
  formatPoints,
  todayDateString,
} from "@/lib/tracker/calculations";
import { MEAL_TYPES } from "@/lib/tracker/types";
import ProgressRing from "@/components/tracker/ProgressRing";
import MealSection from "@/components/tracker/MealSection";

export default function TodayPage() {
  const { ready, settings, entriesForDate, deleteEntry, copyEntriesToDate } = useTracker();

  const today = todayDateString();
  const yesterday = addDays(today, -1);
  const todayEntries = entriesForDate(today);
  const yesterdayEntries = entriesForDate(yesterday);

  const used = dailyPointsUsed(todayEntries, settings);
  const remaining = dailyPointsRemaining(todayEntries, settings);
  const calories = dailyCaloriesUsed(todayEntries);
  const over = remaining < 0;

  const byMeal = new Map(MEAL_TYPES.map((m) => [m, todayEntries.filter((e) => e.meal === m)]));

  if (!ready) return null;

  return (
    <div className="flex flex-col gap-6 px-4 pt-8">
      <header className="text-center">
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          {new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
        </p>
      </header>

      <div className="relative mx-auto flex items-center justify-center" style={{ width: 220, height: 220 }}>
        <ProgressRing used={used} target={settings.dailyPointTarget} />
        <div className="absolute flex flex-col items-center">
          {over ? (
            <>
              <span className="text-4xl font-semibold" style={{ color: "var(--text)" }}>
                {formatPoints(Math.abs(remaining))}
              </span>
              <span className="text-sm" style={{ color: "var(--muted)" }}>
                points over target
              </span>
            </>
          ) : (
            <>
              <span className="text-4xl font-semibold" style={{ color: "var(--text)" }}>
                {formatPoints(remaining)}
              </span>
              <span className="text-sm" style={{ color: "var(--muted)" }}>
                points left
              </span>
            </>
          )}
        </div>
      </div>

      <div className="text-center">
        <p className="font-medium" style={{ color: "var(--text)" }}>
          {formatPoints(used)} / {formatPoints(settings.dailyPointTarget)} points used
        </p>
        {settings.showCalories && (
          <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
            {Math.round(calories)} calories today
          </p>
        )}
      </div>

      {todayEntries.length === 0 && yesterdayEntries.length > 0 && (
        <button
          className="tap-target rounded-2xl border py-3 text-center font-medium"
          style={{ borderColor: "var(--border)", color: "var(--accent)", backgroundColor: "var(--surface)" }}
          onClick={() => copyEntriesToDate(yesterday, today)}
        >
          Same as yesterday
        </button>
      )}

      <Link
        href={`/tracker/add?date=${today}`}
        className="tap-target flex items-center justify-center gap-2 rounded-2xl py-4 text-center text-base font-semibold text-white shadow-sm"
        style={{ backgroundColor: "var(--accent)" }}
      >
        + Add food
      </Link>

      <div className="flex flex-col gap-6 pb-4">
        {MEAL_TYPES.map((meal) => (
          <MealSection
            key={meal}
            meal={meal}
            entries={byMeal.get(meal) ?? []}
            settings={settings}
            date={today}
            onDelete={deleteEntry}
          />
        ))}
      </div>
    </div>
  );
}
