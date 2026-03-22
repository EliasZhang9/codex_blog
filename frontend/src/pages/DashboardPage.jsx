import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import api from "../api/client";
import { useToast } from "../context/ToastContext";

function WeightChart({ entries, xAxisLabel, yAxisLabel }) {
  if (!entries.length) {
    return <p className="text-sm text-ink/70">No data yet.</p>;
  }

  const width = 600;
  const height = 280;
  const chartLeft = 64;
  const chartRight = 24;
  const chartTop = 20;
  const chartBottom = 88;
  const innerWidth = width - chartLeft - chartRight;
  const innerHeight = height - chartTop - chartBottom;
  const values = entries.map((entry) => entry.weight_kg);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const yTicks = [...new Set(values)].sort((a, b) => b - a);

  const chartPoints = entries.map((entry, index) => {
    const x =
      entries.length === 1
        ? width / 2
        : chartLeft + (index / (entries.length - 1)) * innerWidth;
    const y = chartTop + ((max - entry.weight_kg) / range) * innerHeight;
    return { ...entry, x, y };
  });

  const points = chartPoints.map((point) => `${point.x},${point.y}`).join(" ");

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={`Weight trend chart with ${xAxisLabel} and ${yAxisLabel} axes`}
      className="h-56 w-full rounded-xl bg-white"
    >
      <line x1={chartLeft} y1={chartTop} x2={chartLeft} y2={height - chartBottom} stroke="#4a5568" strokeWidth="1.5" />
      <line
        x1={chartLeft}
        y1={height - chartBottom}
        x2={width - chartRight}
        y2={height - chartBottom}
        stroke="#4a5568"
        strokeWidth="1.5"
      />
      {yTicks.map((tick) => {
        const y = chartTop + ((max - tick) / range) * innerHeight;
        return (
          <g key={tick}>
            <line x1={chartLeft - 6} y1={y} x2={chartLeft} y2={y} stroke="#4a5568" strokeWidth="1.5" />
            <text x={chartLeft - 10} y={y + 4} textAnchor="end" fill="#334155" fontSize="12">
              {tick}
            </text>
          </g>
        );
      })}
      {chartPoints.map((point) => (
        <g key={point.entry_date}>
          <line
            x1={point.x}
            y1={height - chartBottom}
            x2={point.x}
            y2={height - chartBottom + 6}
            stroke="#4a5568"
            strokeWidth="1.5"
          />
          <text
            x={point.x}
            y={height - chartBottom + 20}
            transform={`rotate(-35, ${point.x}, ${height - chartBottom + 20})`}
            textAnchor="end"
            fill="#334155"
            fontSize="12"
          >
            {point.entry_date}
          </text>
        </g>
      ))}
      <text x={width / 2} y={height - 12} textAnchor="middle" fill="#334155" fontSize="13" fontWeight="600">
        {xAxisLabel}
      </text>
      <text
        x={18}
        y={height / 2}
        transform={`rotate(-90, 18, ${height / 2})`}
        textAnchor="middle"
        fill="#334155"
        fontSize="13"
        fontWeight="600"
      >
        {yAxisLabel}
      </text>
      <polyline fill="none" stroke="#1f7a8c" strokeWidth="3" points={points} />
      {chartPoints.map((point) => (
        <circle key={point.entry_date} cx={point.x} cy={point.y} r="4" fill="#022b3a" />
      ))}
    </svg>
  );
}

export default function DashboardPage() {
  const { t } = useTranslation();
  const { pushToast } = useToast();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [entryDate, setEntryDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [weightKg, setWeightKg] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingDate, setDeletingDate] = useState(null);

  async function loadEntries() {
    const { data } = await api.get("/weights/me");
    setEntries(data);
  }

  useEffect(() => {
    async function fetchData() {
      try {
        await loadEntries();
      } catch (error) {
        pushToast(error.message, "error");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const sortedEntries = useMemo(
    () => [...entries].sort((a, b) => a.entry_date.localeCompare(b.entry_date)),
    [entries]
  );

  async function handleSubmit(event) {
    event.preventDefault();
    const parsedWeight = Number(weightKg);
    if (!entryDate || Number.isNaN(parsedWeight) || parsedWeight <= 0) {
      pushToast(t("dashboard.invalidWeight"), "error");
      return;
    }

    setSaving(true);
    try {
      await api.put(`/weights/me/${entryDate}`, { weight_kg: parsedWeight });
      await loadEntries();
      pushToast(t("dashboard.saved"), "success");
      setWeightKg("");
    } catch (error) {
      pushToast(error.message, "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(entryDateToDelete) {
    setDeletingDate(entryDateToDelete);
    try {
      await api.delete(`/weights/me/${entryDateToDelete}`);
      await loadEntries();
      pushToast(t("dashboard.deleted"), "success");
    } catch (error) {
      pushToast(error.message, "error");
    } finally {
      setDeletingDate(null);
    }
  }

  if (loading) {
    return <p>{t("common.loading")}</p>;
  }

  return (
    <section className="space-y-5 rounded-3xl bg-white/90 p-6 shadow-playful">
      <h1 className="font-display text-3xl font-bold">{t("dashboard.title")}</h1>

      <form className="grid gap-3 rounded-2xl bg-sky/20 p-4 md:grid-cols-4 md:items-end" onSubmit={handleSubmit}>
        <label className="flex flex-col gap-1 text-sm font-semibold">
          {t("dashboard.date")}
          <input
            className="rounded-xl border border-ink/20 bg-white px-3 py-2"
            type="date"
            value={entryDate}
            onChange={(event) => setEntryDate(event.target.value)}
            required
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-semibold">
          {t("dashboard.weightKg")}
          <input
            className="rounded-xl border border-ink/20 bg-white px-3 py-2"
            type="number"
            step="0.1"
            min="0.1"
            value={weightKg}
            onChange={(event) => setWeightKg(event.target.value)}
            placeholder="70.5"
            required
          />
        </label>
        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-ink px-4 py-2 font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
        >
          {saving ? t("common.loading") : t("dashboard.saveEntry")}
        </button>
      </form>

      <div className="rounded-2xl bg-mint/25 p-4">
        <h2 className="font-display text-2xl">{t("dashboard.trend")}</h2>
        <div className="mt-3">
          <WeightChart
            entries={sortedEntries}
            xAxisLabel={t("dashboard.axisDate")}
            yAxisLabel={t("dashboard.axisWeightKg")}
          />
        </div>
      </div>

      <div className="rounded-2xl bg-banana/30 p-4">
        <h2 className="font-display text-2xl">{t("dashboard.history")}</h2>
        {!sortedEntries.length ? (
          <p className="mt-2 text-sm text-ink/70">{t("dashboard.empty")}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {sortedEntries.map((entry) => (
              <li key={entry.entry_date} className="flex items-center justify-between rounded-xl bg-white/80 px-3 py-2">
                <span>{entry.entry_date}</span>
                <div className="flex items-center gap-3">
                  <span className="font-semibold">{entry.weight_kg} kg</span>
                  <button
                    type="button"
                    onClick={() => handleDelete(entry.entry_date)}
                    disabled={deletingDate === entry.entry_date}
                    className="rounded-lg bg-coral/20 px-3 py-1 text-sm font-semibold text-ink hover:bg-coral/30 disabled:opacity-60"
                  >
                    {deletingDate === entry.entry_date ? t("common.loading") : t("common.delete")}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
