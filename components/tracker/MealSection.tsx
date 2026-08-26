import Link from "next/link";
import type { FoodLogEntry, MealType, UserSettings } from "@/lib/tracker/types";
import { MEAL_LABELS } from "@/lib/tracker/types";
import FoodEntryRow from "./FoodEntryRow";

export default function MealSection({
  meal,
  entries,
  settings,
  date,
  onDelete,
}: {
  meal: MealType;
  entries: FoodLogEntry[];
  settings: UserSettings;
  date: string;
  onDelete: (id: string) => void;
}) {
  return (
    <section>
      <div className="mb-2 flex items-center justify-between px-1">
        <h2 className="text-sm font-semibold uppercase tracking-wide" style={{ color: "var(--muted)" }}>
          {MEAL_LABELS[meal]}
        </h2>
        <Link
          href={`/tracker/add?meal=${meal}&date=${date}`}
          className="text-sm font-medium"
          style={{ color: "var(--accent)" }}
        >
          + Add
        </Link>
      </div>
      {entries.length === 0 ? (
        <p className="rounded-2xl px-4 py-3 text-sm" style={{ backgroundColor: "var(--surface)", color: "var(--muted)" }}>
          Nothing logged yet
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {entries.map((entry) => (
            <FoodEntryRow key={entry.id} entry={entry} settings={settings} onDelete={onDelete} />
          ))}
        </div>
      )}
    </section>
  );
}
