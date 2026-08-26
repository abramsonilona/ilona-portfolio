"use client";

import { useState } from "react";
import { useTracker } from "@/lib/tracker/store";
import Toggle from "@/components/tracker/Toggle";

export default function SettingsPage() {
  const { ready, settings, updateSettings, resetAll } = useTracker();
  const [confirmingReset, setConfirmingReset] = useState(false);

  if (!ready) return null;

  return (
    <div className="flex flex-col gap-6 px-4 pt-8 pb-4">
      <header>
        <h1 className="text-xl font-semibold" style={{ color: "var(--text)" }}>
          Settings
        </h1>
      </header>

      <section className="flex flex-col gap-3">
        <Field label="Daily point target">
          <input
            className="tracker-input"
            type="number"
            inputMode="decimal"
            step="0.5"
            value={settings.dailyPointTarget}
            onChange={(e) => updateSettings({ dailyPointTarget: Number(e.target.value) || 0 })}
          />
        </Field>

        <Field label="Calories per point" description="Default: 100 calories = 1 point">
          <input
            className="tracker-input"
            type="number"
            inputMode="decimal"
            value={settings.caloriesPerPoint}
            onChange={(e) => updateSettings({ caloriesPerPoint: Number(e.target.value) || 1 })}
          />
        </Field>
      </section>

      <section className="flex flex-col gap-2">
        <Toggle
          label="Non-starchy vegetables = 0 points"
          description="Cucumber, tomato, and similar veggies won't count against your target"
          checked={settings.zeroPointVeggies}
          onChange={(value) => updateSettings({ zeroPointVeggies: value })}
        />
        <Toggle
          label="Show weight tracking"
          description="Adds an optional weight section to Progress"
          checked={settings.showWeightTracking}
          onChange={(value) => updateSettings({ showWeightTracking: value })}
        />
        <Toggle
          label="Show calories"
          description="Displays calories alongside points"
          checked={settings.showCalories}
          onChange={(value) => updateSettings({ showCalories: value })}
        />
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="px-1 text-sm font-semibold uppercase tracking-wide" style={{ color: "var(--muted)" }}>
          Data
        </h2>
        {!confirmingReset ? (
          <button
            onClick={() => setConfirmingReset(true)}
            className="tap-target rounded-2xl px-4 py-3 text-left font-medium"
            style={{ backgroundColor: "var(--surface)", color: "var(--text)" }}
          >
            Reset all data
          </button>
        ) : (
          <div className="flex flex-col gap-2 rounded-2xl px-4 py-3" style={{ backgroundColor: "var(--surface)" }}>
            <p className="text-sm" style={{ color: "var(--text)" }}>
              This clears all logged food, weight entries, and notes. This cannot be undone.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmingReset(false)}
                className="tap-target flex-1 rounded-2xl py-2.5 font-medium"
                style={{ backgroundColor: "var(--surface-muted)", color: "var(--text)" }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetAll();
                  setConfirmingReset(false);
                }}
                className="tap-target flex-1 rounded-2xl py-2.5 font-semibold text-white"
                style={{ backgroundColor: "var(--accent)" }}
              >
                Yes, reset
              </button>
            </div>
          </div>
        )}
      </section>

      <p className="px-1 text-center text-xs" style={{ color: "var(--muted)" }}>
        This app is a personal tracking tool and does not provide medical advice. Talk to a
        healthcare provider for guidance on nutrition or weight.
      </p>
    </div>
  );
}

function Field({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="px-1 text-sm font-medium" style={{ color: "var(--text)" }}>
        {label}
      </span>
      {children}
      {description && (
        <span className="px-1 text-xs" style={{ color: "var(--muted)" }}>
          {description}
        </span>
      )}
    </label>
  );
}
