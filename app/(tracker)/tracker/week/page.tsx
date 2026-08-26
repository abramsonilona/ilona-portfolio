"use client";

import { useMemo } from "react";
import { useTracker } from "@/lib/tracker/store";
import { dailyPointsUsed, formatPoints, lastNDates, targetComparisonLabel, weeklyAverage } from "@/lib/tracker/calculations";

export default function WeekPage() {
  const { ready, settings, entries } = useTracker();
  const dates = useMemo(() => lastNDates(7), []);

  const entriesByDate = useMemo(() => {
    const map: Record<string, typeof entries> = {};
    dates.forEach((date) => {
      map[date] = entries.filter((e) => e.date === date);
    });
    return map;
  }, [dates, entries]);

  const average = weeklyAverage(entriesByDate, settings, 7);

  if (!ready) return null;

  return (
    <div className="flex flex-col gap-6 px-4 pt-8">
      <header>
        <h1 className="text-xl font-semibold" style={{ color: "var(--text)" }}>
          This week
        </h1>
      </header>

      <div className="flex flex-col gap-2">
        {dates.map((date) => {
          const dayEntries = entriesByDate[date];
          const used = dailyPointsUsed(dayEntries, settings);
          const ratio = settings.dailyPointTarget > 0 ? Math.min(used / settings.dailyPointTarget, 1) : 0;
          const over = used > settings.dailyPointTarget;
          const isToday = date === dates[dates.length - 1];

          return (
            <div key={date} className="rounded-2xl px-4 py-3" style={{ backgroundColor: "var(--surface)" }}>
              <div className="mb-2 flex items-baseline justify-between">
                <span className="font-medium" style={{ color: "var(--text)" }}>
                  {formatDayLabel(date)}
                  {isToday && (
                    <span className="ml-2 text-xs font-normal" style={{ color: "var(--muted)" }}>
                      today
                    </span>
                  )}
                </span>
                <span className="text-sm" style={{ color: "var(--muted)" }}>
                  {dayEntries.length === 0 ? "No entries" : targetComparisonLabel(used, settings.dailyPointTarget)}
                </span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full" style={{ backgroundColor: "var(--surface-muted)" }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${ratio * 100}%`,
                    backgroundColor: over ? "var(--sage)" : "var(--accent)",
                  }}
                />
              </div>
              <p className="mt-1.5 text-right text-xs" style={{ color: "var(--muted)" }}>
                {formatPoints(used)} / {formatPoints(settings.dailyPointTarget)} pts
              </p>
            </div>
          );
        })}
      </div>

      <div
        className="rounded-2xl px-4 py-4 text-center"
        style={{ backgroundColor: "var(--accent-soft)" }}
      >
        <p className="text-sm" style={{ color: "var(--accent)" }}>
          Weekly average
        </p>
        <p className="text-2xl font-semibold" style={{ color: "var(--text)" }}>
          {formatPoints(average)} pts/day
        </p>
      </div>
    </div>
  );
}

function formatDayLabel(dateString: string): string {
  const [y, m, d] = dateString.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
}
