import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import WeightChart from "../components/WeightChart";
import useWeightEntries from "../hooks/useWeightEntries";

const RANGE_FILTERS = {
  week: 7,
  month: 30,
  year: 365,
  all: null,
};

function filterByDays(entries, days) {
  if (!days) return entries;
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return entries.filter((entry) => new Date(entry.entry_date) >= cutoff);
}

function computeMilestones(sortedEntries) {
  if (sortedEntries.length < 2) return [];
  const first = sortedEntries[0].weight_kg;
  const latest = sortedEntries[sortedEntries.length - 1].weight_kg;
  const loss = Math.max(0, first - latest);
  const milestones = [
    { label: "1kg", target: 1 },
    { label: "5kg", target: 5 },
    { label: "10kg", target: 10 },
  ];
  return milestones.map((m) => ({ ...m, achieved: loss >= m.target, delta: Math.max(0, m.target - loss) }));
}

export default function ProgressPage() {
  const { t } = useTranslation();
  const { entries, loading } = useWeightEntries();
  const [range, setRange] = useState("year");

  const sorted = useMemo(
    () => [...entries].sort((a, b) => a.entry_date.localeCompare(b.entry_date)),
    [entries]
  );
  const filtered = useMemo(() => filterByDays(sorted, RANGE_FILTERS[range]), [sorted, range]);
  const milestones = computeMilestones(sorted);

  if (loading) {
    return <p>{t("common.loading")}</p>;
  }

  return (
    <section className="space-y-5 rounded-3xl bg-surfaceContainerLow p-6 shadow-playful md:p-8">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-wide text-onSurfaceVariant">{t("progress.subtitle")}</p>
          <h1 className="font-display text-3xl font-bold text-onSurface">{t("progress.title")}</h1>
        </div>
        <div className="flex gap-2 text-xs font-semibold">
          {["week", "month", "year", "all"].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRange(value)}
              className={`rounded-full px-3 py-1 ${range === value ? "bg-primary text-white" : "bg-surfaceContainerLow text-onSurface"}`}
            >
              {t(`dashboard.range.${value}`)}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-cozy bg-surfaceContainerLowest p-4 shadow-playful">
        <WeightChart
          entries={filtered}
          xAxisLabel={t("dashboard.axisDate")}
          yAxisLabel={t("dashboard.axisWeightKg")}
        />
      </div>

      <div className="rounded-cozy bg-surfaceContainerLowest p-4 shadow-playful">
        <h2 className="font-display text-xl text-onSurface">{t("dashboard.milestones")}</h2>
        <ul className="mt-3 space-y-2">
          {milestones.length === 0 && (
            <li className="rounded-soft bg-surfaceContainerLow px-3 py-2 text-sm text-onSurfaceVariant">{t("dashboard.milestonesEmpty")}</li>
          )}
          {milestones.map((m) => (
            <li
              key={m.label}
              className={`flex items-center justify-between rounded-soft px-3 py-2 text-sm font-semibold ${
                m.achieved ? "bg-primaryFixed/90 text-onSurface" : "bg-surfaceContainerLow text-onSurfaceVariant"
              }`}
            >
              <span>🎯 {t("dashboard.milestoneLabel", { amount: m.label })}</span>
              <span>{m.achieved ? t("dashboard.achieved") : t("dashboard.remaining", { amount: m.delta.toFixed(1) })}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
