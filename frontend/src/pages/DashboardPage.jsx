import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import api from "../api/client";
import { useToast } from "../context/ToastContext";

function WeightChart({ entries }) {
  if (!entries.length) {
    return <p className="text-sm text-ink/70">No data yet.</p>;
  }

  const width = 600;
  const height = 200;
  const padding = 24;
  const values = entries.map((entry) => entry.weight_kg);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const points = entries
    .map((entry, index) => {
      const x =
        entries.length === 1
          ? width / 2
          : padding + (index / (entries.length - 1)) * (width - padding * 2);
      const y = padding + ((max - entry.weight_kg) / range) * (height - padding * 2);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label="Weight trend chart"
      className="h-56 w-full rounded-xl bg-white"
    >
      <polyline fill="none" stroke="#1f7a8c" strokeWidth="3" points={points} />
      {entries.map((entry, index) => {
        const x =
          entries.length === 1
            ? width / 2
            : padding + (index / (entries.length - 1)) * (width - padding * 2);
        const y = padding + ((max - entry.weight_kg) / range) * (height - padding * 2);
        return <circle key={`${entry.entry_date}-${index}`} cx={x} cy={y} r="4" fill="#022b3a" />;
      })}
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
          <WeightChart entries={sortedEntries} />
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
                <span className="font-semibold">{entry.weight_kg} kg</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
