"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useTracker } from "@/lib/tracker/store";
import { caloriesToPoints, formatPoints } from "@/lib/tracker/calculations";
import { MEAL_LABELS, MEAL_TYPES, type MealType } from "@/lib/tracker/types";

export default function EditEntryPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { settings, entries, updateEntry, deleteEntry } = useTracker();
  const entry = entries.find((e) => e.id === params.id);

  const [name, setName] = useState(entry?.name ?? "");
  const [quantity, setQuantity] = useState(entry?.quantity ?? "");
  const [calories, setCalories] = useState(String(entry?.calories ?? ""));
  const [points, setPoints] = useState(String(entry ? formatPoints(entry.points) : ""));
  const [pointsTouched, setPointsTouched] = useState(false);
  const [meal, setMeal] = useState<MealType>(entry?.meal ?? "breakfast");

  if (!entry) {
    return (
      <div className="flex flex-col items-center gap-4 px-4 pt-16 text-center">
        <p style={{ color: "var(--muted)" }}>This entry no longer exists.</p>
        <Link href="/tracker" className="font-medium" style={{ color: "var(--accent)" }}>
          Back to Today
        </Link>
      </div>
    );
  }

  const calorieNum = Number(calories) || 0;
  const pointsNum = pointsTouched ? Number(points) || 0 : caloriesToPoints(calorieNum, settings.caloriesPerPoint);
  const canSave = name.trim().length > 0 && calorieNum >= 0;

  return (
    <div className="flex flex-col gap-4 px-4 pt-6">
      <header className="flex items-center justify-between">
        <Link href="/tracker" className="text-sm font-medium" style={{ color: "var(--muted)" }}>
          Cancel
        </Link>
        <h1 className="text-lg font-semibold" style={{ color: "var(--text)" }}>
          Edit food
        </h1>
        <span className="w-12" />
      </header>

      <div className="flex flex-wrap gap-2">
        {MEAL_TYPES.map((m) => (
          <button
            key={m}
            onClick={() => setMeal(m)}
            className="tap-target rounded-full px-4 text-sm font-medium"
            style={{
              backgroundColor: meal === m ? "var(--accent)" : "var(--surface)",
              color: meal === m ? "#fff" : "var(--text)",
              border: "1px solid var(--border)",
            }}
          >
            {MEAL_LABELS[m]}
          </button>
        ))}
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="px-1 text-sm font-medium" style={{ color: "var(--muted)" }}>
          Food name
        </span>
        <input className="tracker-input" value={name} onChange={(e) => setName(e.target.value)} />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="px-1 text-sm font-medium" style={{ color: "var(--muted)" }}>
          Quantity
        </span>
        <input className="tracker-input" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="px-1 text-sm font-medium" style={{ color: "var(--muted)" }}>
          Calories
        </span>
        <input
          className="tracker-input"
          type="number"
          inputMode="decimal"
          value={calories}
          onChange={(e) => setCalories(e.target.value)}
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="px-1 text-sm font-medium" style={{ color: "var(--muted)" }}>
          Points
        </span>
        <input
          className="tracker-input"
          type="number"
          inputMode="decimal"
          step="0.1"
          value={pointsTouched ? points : formatPoints(pointsNum)}
          onChange={(e) => {
            setPoints(e.target.value);
            setPointsTouched(true);
          }}
        />
      </label>

      <button
        disabled={!canSave}
        onClick={() => {
          updateEntry(entry.id, {
            name: name.trim(),
            quantity: quantity.trim() || "1 serving",
            calories: calorieNum,
            points: pointsNum,
            meal,
          });
          router.push("/tracker");
        }}
        className="tap-target rounded-2xl py-4 text-center text-base font-semibold text-white"
        style={{ backgroundColor: canSave ? "var(--accent)" : "var(--muted)", opacity: canSave ? 1 : 0.6 }}
      >
        Save changes
      </button>

      <button
        onClick={() => {
          deleteEntry(entry.id);
          router.push("/tracker");
        }}
        className="tap-target rounded-2xl py-3 text-center font-medium"
        style={{ color: "var(--muted)" }}
      >
        Delete entry
      </button>
    </div>
  );
}
