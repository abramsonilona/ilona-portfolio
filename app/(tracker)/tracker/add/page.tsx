"use client";

import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useTracker } from "@/lib/tracker/store";
import { caloriesToPoints, formatPoints, servingCalculation, todayDateString } from "@/lib/tracker/calculations";
import type { MealType } from "@/lib/tracker/types";
import { MEAL_LABELS, MEAL_TYPES } from "@/lib/tracker/types";

function defaultMealForNow(): MealType {
  const hour = new Date().getHours();
  if (hour < 11) return "breakfast";
  if (hour < 16) return "lunch";
  if (hour < 21) return "dinner";
  return "snacks";
}

type Tab = "quick" | "saved" | "custom";

export default function AddFoodPage() {
  return (
    <Suspense fallback={null}>
      <AddFoodForm />
    </Suspense>
  );
}

function AddFoodForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { settings, foods, addEntry, addFood } = useTracker();

  const date = params.get("date") ?? todayDateString();
  const [meal, setMeal] = useState<MealType>((params.get("meal") as MealType) || defaultMealForNow());
  const [tab, setTab] = useState<Tab>("quick");

  const goToday = () => router.push("/tracker");

  return (
    <div className="flex flex-col gap-5 px-4 pt-6">
      <header className="flex items-center justify-between">
        <Link href="/tracker" className="text-sm font-medium" style={{ color: "var(--muted)" }}>
          Cancel
        </Link>
        <h1 className="text-lg font-semibold" style={{ color: "var(--text)" }}>
          Add food
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

      <div className="flex rounded-2xl p-1" style={{ backgroundColor: "var(--surface-muted)" }}>
        {(
          [
            ["quick", "Quick"],
            ["saved", "Saved"],
            ["custom", "Custom"],
          ] as [Tab, string][]
        ).map(([value, label]) => (
          <button
            key={value}
            onClick={() => setTab(value)}
            className="tap-target flex-1 rounded-xl text-sm font-medium"
            style={{
              backgroundColor: tab === value ? "var(--surface)" : "transparent",
              color: tab === value ? "var(--text)" : "var(--muted)",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "quick" && (
        <QuickTab
          caloriesPerPoint={settings.caloriesPerPoint}
          onSave={(input) => {
            addEntry({ ...input, meal, date });
            goToday();
          }}
        />
      )}

      {tab === "saved" && (
        <SavedTab
          foods={foods}
          onPick={(food) => {
            addEntry({
              foodId: food.id,
              name: food.name,
              quantity: food.servingSize ?? "1 serving",
              calories: food.caloriesPerServing,
              isZeroPointVeggie: food.isZeroPointVeggie,
              meal,
              date,
            });
            goToday();
          }}
        />
      )}

      {tab === "custom" && (
        <CustomTab
          caloriesPerPoint={settings.caloriesPerPoint}
          onSave={(input) => {
            addEntry({ ...input, meal, date });
            if (input.saveAsFavorite) {
              addFood({
                name: input.name,
                caloriesPerServing: input.caloriesPerServing,
                servingSize: input.servingSize,
                isZeroPointVeggie: input.isZeroPointVeggie,
                isFavorite: true,
              });
            }
            goToday();
          }}
        />
      )}
    </div>
  );
}

function QuickTab({
  caloriesPerPoint,
  onSave,
}: {
  caloriesPerPoint: number;
  onSave: (input: { name: string; quantity: string; calories: number; points: number }) => void;
}) {
  const [name, setName] = useState("");
  const [calories, setCalories] = useState("");
  const [pointsOverride, setPointsOverride] = useState<string | null>(null);

  const calorieNum = Number(calories) || 0;
  const computedPoints = caloriesToPoints(calorieNum, caloriesPerPoint);
  const points = pointsOverride !== null && pointsOverride !== "" ? Number(pointsOverride) : computedPoints;
  const canSave = name.trim().length > 0 && calorieNum > 0;

  return (
    <div className="flex flex-col gap-4">
      <Field label="Food name">
        <input
          className="tracker-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Chicken sandwich"
          autoFocus
        />
      </Field>
      <Field label="Calories">
        <input
          className="tracker-input"
          type="number"
          inputMode="decimal"
          value={calories}
          onChange={(e) => setCalories(e.target.value)}
          placeholder="0"
        />
      </Field>
      <Field label={`Points (auto: ${formatPoints(computedPoints)})`}>
        <input
          className="tracker-input"
          type="number"
          inputMode="decimal"
          step="0.1"
          value={pointsOverride ?? ""}
          onChange={(e) => setPointsOverride(e.target.value)}
          placeholder={formatPoints(computedPoints)}
        />
      </Field>
      <SaveButton
        disabled={!canSave}
        onClick={() =>
          onSave({ name: name.trim(), quantity: "1 serving", calories: calorieNum, points })
        }
      />
    </div>
  );
}

function SavedTab({
  foods,
  onPick,
}: {
  foods: import("@/lib/tracker/types").Food[];
  onPick: (food: import("@/lib/tracker/types").Food) => void;
}) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const sorted = [...foods].sort((a, b) => {
      if (!!a.isFavorite !== !!b.isFavorite) return a.isFavorite ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
    if (!q) return sorted;
    return sorted.filter((f) => f.name.toLowerCase().includes(q));
  }, [foods, query]);

  return (
    <div className="flex flex-col gap-3">
      <input
        className="tracker-input"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search saved foods"
        autoFocus
      />
      <div className="flex flex-col gap-2">
        {filtered.length === 0 && (
          <p className="px-1 text-sm" style={{ color: "var(--muted)" }}>
            No foods match.
          </p>
        )}
        {filtered.map((food) => (
          <button
            key={food.id}
            onClick={() => onPick(food)}
            className="tap-target flex items-center justify-between rounded-2xl px-4 py-3 text-left"
            style={{ backgroundColor: "var(--surface)" }}
          >
            <span>
              <span className="block font-medium" style={{ color: "var(--text)" }}>
                {food.isFavorite ? "★ " : ""}
                {food.name}
              </span>
              <span className="block text-sm" style={{ color: "var(--muted)" }}>
                {food.servingSize ?? "1 serving"} · {Math.round(food.caloriesPerServing)} cal
              </span>
            </span>
            <span
              className="rounded-full px-2.5 py-1 text-sm font-semibold"
              style={{ backgroundColor: "var(--accent-soft)", color: "var(--accent)" }}
            >
              {food.isZeroPointVeggie ? "0" : formatPoints(caloriesToPoints(food.caloriesPerServing))}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function CustomTab({
  caloriesPerPoint,
  onSave,
}: {
  caloriesPerPoint: number;
  onSave: (input: {
    name: string;
    quantity: string;
    calories: number;
    isZeroPointVeggie?: boolean;
    caloriesPerServing: number;
    servingSize: string;
    saveAsFavorite: boolean;
  }) => void;
}) {
  const [name, setName] = useState("");
  const [caloriesPerServing, setCaloriesPerServing] = useState("");
  const [servingSize, setServingSize] = useState("");
  const [servings, setServings] = useState("1");
  const [isZeroPointVeggie, setIsZeroPointVeggie] = useState(false);
  const [saveAsFavorite, setSaveAsFavorite] = useState(false);

  const perServing = Number(caloriesPerServing) || 0;
  const servingsNum = Number(servings) || 0;
  const { totalCalories, totalPoints } = servingCalculation(perServing, servingsNum, caloriesPerPoint);
  const canSave = name.trim().length > 0 && perServing > 0 && servingsNum > 0;

  return (
    <div className="flex flex-col gap-4">
      <Field label="Food name">
        <input className="tracker-input" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
      </Field>
      <Field label="Calories per serving">
        <input
          className="tracker-input"
          type="number"
          inputMode="decimal"
          value={caloriesPerServing}
          onChange={(e) => setCaloriesPerServing(e.target.value)}
          placeholder="0"
        />
      </Field>
      <Field label="Serving size (optional)">
        <input
          className="tracker-input"
          value={servingSize}
          onChange={(e) => setServingSize(e.target.value)}
          placeholder="e.g. 1 cup"
        />
      </Field>
      <Field label="Number of servings">
        <input
          className="tracker-input"
          type="number"
          inputMode="decimal"
          step="0.5"
          value={servings}
          onChange={(e) => setServings(e.target.value)}
        />
      </Field>

      <label className="flex items-center gap-3 rounded-2xl px-4 py-3" style={{ backgroundColor: "var(--surface)" }}>
        <input
          type="checkbox"
          checked={isZeroPointVeggie}
          onChange={(e) => setIsZeroPointVeggie(e.target.checked)}
          className="h-5 w-5"
        />
        <span style={{ color: "var(--text)" }}>Zero-point vegetable</span>
      </label>

      <label className="flex items-center gap-3 rounded-2xl px-4 py-3" style={{ backgroundColor: "var(--surface)" }}>
        <input
          type="checkbox"
          checked={saveAsFavorite}
          onChange={(e) => setSaveAsFavorite(e.target.checked)}
          className="h-5 w-5"
        />
        <span style={{ color: "var(--text)" }}>Save to favorites for next time</span>
      </label>

      <p className="text-center text-sm" style={{ color: "var(--muted)" }}>
        Total: {Math.round(totalCalories)} cal ·{" "}
        {isZeroPointVeggie ? "0" : formatPoints(totalPoints)} points
      </p>

      <SaveButton
        disabled={!canSave}
        onClick={() =>
          onSave({
            name: name.trim(),
            quantity: servingsNum === 1 ? servingSize || "1 serving" : `${servingsNum} × ${servingSize || "serving"}`,
            calories: totalCalories,
            isZeroPointVeggie,
            caloriesPerServing: perServing,
            servingSize: servingSize || "1 serving",
            saveAsFavorite,
          })
        }
      />
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="px-1 text-sm font-medium" style={{ color: "var(--muted)" }}>
        {label}
      </span>
      {children}
    </label>
  );
}

function SaveButton({ disabled, onClick }: { disabled: boolean; onClick: () => void }) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className="tap-target rounded-2xl py-4 text-center text-base font-semibold text-white"
      style={{ backgroundColor: disabled ? "var(--muted)" : "var(--accent)", opacity: disabled ? 0.6 : 1 }}
    >
      Save
    </button>
  );
}
