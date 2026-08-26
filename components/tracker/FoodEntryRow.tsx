"use client";

import { useState } from "react";
import Link from "next/link";
import type { FoodLogEntry, UserSettings } from "@/lib/tracker/types";
import { formatPoints } from "@/lib/tracker/calculations";

export default function FoodEntryRow({
  entry,
  settings,
  onDelete,
}: {
  entry: FoodLogEntry;
  settings: UserSettings;
  onDelete: (id: string) => void;
}) {
  const [confirming, setConfirming] = useState(false);
  const points = entry.isZeroPointVeggie && settings.zeroPointVeggies ? 0 : entry.points;

  if (confirming) {
    return (
      <div
        className="flex items-center justify-between gap-3 rounded-2xl px-4 py-3"
        style={{ backgroundColor: "var(--surface-muted)" }}
      >
        <span className="text-sm" style={{ color: "var(--text)" }}>
          Delete &ldquo;{entry.name}&rdquo;?
        </span>
        <div className="flex shrink-0 gap-2">
          <button
            className="tap-target rounded-full px-3 text-sm font-medium"
            style={{ color: "var(--muted)" }}
            onClick={() => setConfirming(false)}
          >
            Cancel
          </button>
          <button
            className="tap-target rounded-full px-3 text-sm font-medium text-white"
            style={{ backgroundColor: "var(--accent)" }}
            onClick={() => onDelete(entry.id)}
          >
            Delete
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex items-center justify-between gap-3 rounded-2xl px-4 py-3"
      style={{ backgroundColor: "var(--surface)" }}
    >
      <Link href={`/tracker/edit/${entry.id}`} className="min-w-0 flex-1">
        <p className="truncate font-medium" style={{ color: "var(--text)" }}>
          {entry.name}
        </p>
        <p className="truncate text-sm" style={{ color: "var(--muted)" }}>
          {entry.quantity}
          {settings.showCalories ? ` · ${Math.round(entry.calories)} cal` : ""}
        </p>
      </Link>
      <div className="flex shrink-0 items-center gap-3">
        <span
          className="rounded-full px-2.5 py-1 text-sm font-semibold"
          style={{ backgroundColor: "var(--accent-soft)", color: "var(--accent)" }}
        >
          {formatPoints(points)}
        </span>
        <button
          aria-label={`Delete ${entry.name}`}
          className="tap-target flex w-8 items-center justify-center rounded-full"
          style={{ color: "var(--muted)" }}
          onClick={() => setConfirming(true)}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m2 0-.8 12.2A2 2 0 0 1 14.2 21H9.8a2 2 0 0 1-2-1.8L7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
