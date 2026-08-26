"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useTracker } from "@/lib/tracker/store";
import { todayDateString } from "@/lib/tracker/calculations";

const NOTE_SUGGESTIONS = ["Jeans feel looser", "Less evening snacking", "More energy", "Slept better"];

export default function ProgressPage() {
  const { ready, settings, weightEntries, progressNotes, addWeightEntry, deleteWeightEntry, addProgressNote, deleteProgressNote } =
    useTracker();

  const [weightInput, setWeightInput] = useState("");
  const [noteInput, setNoteInput] = useState("");

  const sortedWeights = useMemo(
    () => [...weightEntries].sort((a, b) => a.date.localeCompare(b.date)),
    [weightEntries]
  );

  if (!ready) return null;

  return (
    <div className="flex flex-col gap-6 px-4 pt-8 pb-4">
      <header>
        <h1 className="text-xl font-semibold" style={{ color: "var(--text)" }}>
          Progress
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
          Track what feels meaningful to you — the scale is optional.
        </p>
      </header>

      {settings.showWeightTracking ? (
        <section className="flex flex-col gap-3">
          <h2 className="px-1 text-sm font-semibold uppercase tracking-wide" style={{ color: "var(--muted)" }}>
            Weight
          </h2>

          {sortedWeights.length > 1 && (
            <div className="rounded-2xl px-4 py-4" style={{ backgroundColor: "var(--surface)" }}>
              <TrendChart entries={sortedWeights} />
            </div>
          )}

          <div className="flex gap-2 rounded-2xl px-3 py-3" style={{ backgroundColor: "var(--surface)" }}>
            <input
              className="tracker-input flex-1"
              type="number"
              inputMode="decimal"
              placeholder="Weight"
              value={weightInput}
              onChange={(e) => setWeightInput(e.target.value)}
            />
            <button
              className="tap-target shrink-0 rounded-2xl px-5 font-semibold text-white"
              style={{ backgroundColor: "var(--accent)" }}
              disabled={!weightInput}
              onClick={() => {
                const value = Number(weightInput);
                if (!value) return;
                addWeightEntry({ date: todayDateString(), weight: value });
                setWeightInput("");
              }}
            >
              Log
            </button>
          </div>

          {sortedWeights.length > 0 && (
            <div className="flex flex-col gap-2">
              {[...sortedWeights].reverse().slice(0, 6).map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between rounded-2xl px-4 py-2.5"
                  style={{ backgroundColor: "var(--surface)" }}
                >
                  <span className="text-sm" style={{ color: "var(--muted)" }}>
                    {entry.date}
                  </span>
                  <span className="font-medium" style={{ color: "var(--text)" }}>
                    {entry.weight}
                  </span>
                  <button
                    aria-label="Delete"
                    onClick={() => deleteWeightEntry(entry.id)}
                    className="tap-target text-sm"
                    style={{ color: "var(--muted)" }}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      ) : (
        <p className="rounded-2xl px-4 py-3 text-sm" style={{ backgroundColor: "var(--surface)", color: "var(--muted)" }}>
          Weight tracking is hidden.{" "}
          <Link href="/tracker/settings" className="font-medium" style={{ color: "var(--accent)" }}>
            Turn it on in Settings
          </Link>{" "}
          if you would like to use it.
        </p>
      )}

      <section className="flex flex-col gap-3">
        <h2 className="px-1 text-sm font-semibold uppercase tracking-wide" style={{ color: "var(--muted)" }}>
          Notes
        </h2>

        <div className="flex flex-wrap gap-2">
          {NOTE_SUGGESTIONS.map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => addProgressNote(suggestion, todayDateString())}
              className="tap-target rounded-full px-3 text-sm"
              style={{ backgroundColor: "var(--accent-soft)", color: "var(--accent)" }}
            >
              + {suggestion}
            </button>
          ))}
        </div>

        <div className="flex gap-2 rounded-2xl px-3 py-3" style={{ backgroundColor: "var(--surface)" }}>
          <input
            className="tracker-input flex-1"
            placeholder="Write your own note"
            value={noteInput}
            onChange={(e) => setNoteInput(e.target.value)}
          />
          <button
            className="tap-target shrink-0 rounded-2xl px-5 font-semibold text-white"
            style={{ backgroundColor: "var(--accent)" }}
            disabled={!noteInput.trim()}
            onClick={() => {
              if (!noteInput.trim()) return;
              addProgressNote(noteInput.trim(), todayDateString());
              setNoteInput("");
            }}
          >
            Add
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {progressNotes.length === 0 ? (
            <p className="rounded-2xl px-4 py-3 text-sm" style={{ backgroundColor: "var(--surface)", color: "var(--muted)" }}>
              Notes you add will show up here.
            </p>
          ) : (
            progressNotes.map((note) => (
              <div
                key={note.id}
                className="flex items-center justify-between gap-3 rounded-2xl px-4 py-3"
                style={{ backgroundColor: "var(--surface)" }}
              >
                <div className="min-w-0">
                  <p style={{ color: "var(--text)" }}>{note.text}</p>
                  <p className="text-xs" style={{ color: "var(--muted)" }}>
                    {note.date}
                  </p>
                </div>
                <button
                  aria-label="Delete note"
                  onClick={() => deleteProgressNote(note.id)}
                  className="tap-target shrink-0 text-sm"
                  style={{ color: "var(--muted)" }}
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

function TrendChart({ entries }: { entries: { date: string; weight: number }[] }) {
  const width = 280;
  const height = 100;
  const weights = entries.map((e) => e.weight);
  const min = Math.min(...weights);
  const max = Math.max(...weights);
  const range = max - min || 1;

  const points = entries.map((entry, i) => {
    const x = (i / (entries.length - 1)) * (width - 16) + 8;
    const y = height - 12 - ((entry.weight - min) / range) * (height - 24);
    return `${x},${y}`;
  });

  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      <polyline points={points.join(" ")} fill="none" stroke="var(--accent)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
