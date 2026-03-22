import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api from "../api/client";
import { useToast } from "../context/ToastContext";
import WeightChart from "../components/WeightChart";
import useWeightEntries from "../hooks/useWeightEntries";
import WellnessPostCard from "../components/WellnessPostCard";

const RANGE_FILTERS = {
  all: null,
  week: 7,
  month: 30,
  year: 365,
};

function filterByDays(entries, days) {
  if (!days) return entries;
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return entries.filter((entry) => new Date(entry.entry_date) >= cutoff);
}

function computeStreak(sortedEntries) {
  let streak = 0;
  const today = new Date();
  for (let i = sortedEntries.length - 1; i >= 0; i -= 1) {
    const entryDate = new Date(sortedEntries[i].entry_date + "T00:00:00");
    const expectedDate = new Date();
    expectedDate.setDate(today.getDate() - streak);
    if (entryDate.toDateString() === expectedDate.toDateString()) {
      streak += 1;
    } else {
      break;
    }
  }
  return streak;
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

export default function DashboardPage() {
  const { t } = useTranslation();
  const { pushToast } = useToast();
  const { entries, loading, error, reload } = useWeightEntries();
  const [entryDate, setEntryDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [weightKg, setWeightKg] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingDate, setDeletingDate] = useState(null);
  const [chartRange, setChartRange] = useState("month");
  const [historyRange, setHistoryRange] = useState("all");
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const { data } = await api.get("/posts");
        setPosts(data.slice(0, 3));
      } catch (err) {
        pushToast(err.message, "error");
      }
    }
    fetchPosts();
  }, [pushToast]);

  useEffect(() => {
    if (error) {
      pushToast(error.message, "error");
    }
  }, [error, pushToast]);

  const sortedEntries = useMemo(
    () => [...entries].sort((a, b) => a.entry_date.localeCompare(b.entry_date)),
    [entries]
  );

  const filteredForChart = useMemo(
    () => filterByDays(sortedEntries, RANGE_FILTERS[chartRange]),
    [sortedEntries, chartRange]
  );
  const filteredHistory = useMemo(
    () => filterByDays(sortedEntries, RANGE_FILTERS[historyRange]),
    [sortedEntries, historyRange]
  );

  const latest = sortedEntries[sortedEntries.length - 1];
  const previous = sortedEntries[sortedEntries.length - 2];
  const oneWeekAgo = filterByDays(sortedEntries, 7)[0];
  const streak = computeStreak(sortedEntries);
  const milestones = computeMilestones(sortedEntries);

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
      await reload();
      pushToast(t("dashboard.saved"), "success");
      setWeightKg("");
    } catch (err) {
      pushToast(err.message, "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(entryDateToDelete) {
    setDeletingDate(entryDateToDelete);
    try {
      await api.delete(`/weights/me/${entryDateToDelete}`);
      await reload();
      pushToast(t("dashboard.deleted"), "success");
    } catch (err) {
      pushToast(err.message, "error");
    } finally {
      setDeletingDate(null);
    }
  }

  if (loading) {
    return <p>{t("common.loading")}</p>;
  }

  return (
    <section className="space-y-5 rounded-3xl bg-white/90 p-5 shadow-playful">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-wide text-ink/60">{t("dashboard.subtitle")}</p>
          <h1 className="font-display text-3xl font-bold">{t("dashboard.title")}</h1>
          <p className="text-ink/70">{t("dashboard.tagline")}</p>
        </div>
        <Link
          to="/community"
          className="hidden rounded-full bg-mint px-4 py-2 text-sm font-semibold text-ink shadow-playful md:inline-flex"
        >
          🤝 {t("dashboard.viewCommunity")}
        </Link>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        <div className="rounded-cozy bg-white p-4 shadow-playful">
          <p className="text-xs uppercase text-ink/60">{t("dashboard.currentWeight")}</p>
          <p className="mt-2 text-3xl font-bold">{latest ? `${latest.weight_kg} kg` : "—"}</p>
          <p className="text-sm text-ink/70">
            {previous && latest
              ? `${latest.weight_kg - previous.weight_kg > 0 ? "+" : ""}${(latest.weight_kg - previous.weight_kg).toFixed(1)} kg ${t("dashboard.sinceLast")}`
              : t("dashboard.noPrevious")}
          </p>
        </div>
        <div className="rounded-cozy bg-white p-4 shadow-playful">
          <p className="text-xs uppercase text-ink/60">{t("dashboard.weeklyChange")}</p>
          <p className="mt-2 text-2xl font-bold">
            {latest && oneWeekAgo
              ? `${(latest.weight_kg - oneWeekAgo.weight_kg).toFixed(1)} kg`
              : "—"}
          </p>
          <p className="text-sm text-ink/70">{t("dashboard.weeklyCopy")}</p>
        </div>
        <div className="rounded-cozy bg-white p-4 shadow-playful">
          <p className="text-xs uppercase text-ink/60">{t("dashboard.streak")}</p>
          <p className="mt-2 text-2xl font-bold">{streak}🔥</p>
          <p className="text-sm text-ink/70">{t("dashboard.streakCopy")}</p>
        </div>
        <div className="rounded-cozy bg-white p-4 shadow-playful">
          <p className="text-xs uppercase text-ink/60">{t("dashboard.entries")}</p>
          <p className="mt-2 text-2xl font-bold">{sortedEntries.length}</p>
          <p className="text-sm text-ink/70">{t("dashboard.entriesCopy")}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[1.2fr_1fr]">
        <form className="rounded-cozy bg-sky/40 p-4 shadow-playful" onSubmit={handleSubmit}>
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl">{t("dashboard.quickLog")}</h2>
            <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-ink/80">
              {t("dashboard.today")} {new Date().toLocaleDateString()}
            </span>
          </div>
          <div className="mt-3 grid gap-3 md:grid-cols-3 md:items-end">
            <label className="flex flex-col gap-1 text-sm font-semibold">
              {t("dashboard.date")}
              <input
                className="rounded-soft border border-ink/10 bg-white px-3 py-2"
                type="date"
                value={entryDate}
                onChange={(event) => setEntryDate(event.target.value)}
                required
              />
            </label>
            <label className="flex flex-col gap-1 text-sm font-semibold">
              {t("dashboard.weightKg")}
              <input
                className="rounded-soft border border-ink/10 bg-white px-3 py-2"
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
              className="mt-1 rounded-full bg-ink px-4 py-3 font-semibold text-white shadow-playful transition hover:opacity-90 disabled:opacity-60 md:mt-0"
            >
              {saving ? t("common.loading") : t("dashboard.logToday")}
            </button>
          </div>
        </form>

        <div className="rounded-cozy bg-white p-4 shadow-playful">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg">{t("dashboard.milestones")}</h3>
            <span className="rounded-full bg-mint px-3 py-1 text-xs font-semibold text-ink/80">
              {t("dashboard.auto")}
            </span>
          </div>
          <ul className="mt-3 space-y-2">
            {milestones.length === 0 && (
              <li className="rounded-soft bg-sky/30 px-3 py-2 text-sm text-ink/70">{t("dashboard.milestonesEmpty")}</li>
            )}
            {milestones.map((m) => (
              <li
                key={m.label}
                className={`flex items-center justify-between rounded-soft px-3 py-2 text-sm font-semibold ${
                  m.achieved ? "bg-mint/70 text-ink" : "bg-banana/40 text-ink/80"
                }`}
              >
                <span>
                  🎯 {t("dashboard.milestoneLabel", { amount: m.label })}
                </span>
                <span>{m.achieved ? t("dashboard.achieved") : t("dashboard.remaining", { amount: m.delta.toFixed(1) })}</span>
              </li>
            ))}
            <li
              className={`flex items-center justify-between rounded-soft px-3 py-2 text-sm font-semibold ${
                streak >= 7 ? "bg-mint/70 text-ink" : "bg-banana/40 text-ink/80"
              }`}
            >
              <span>🔥 {t("dashboard.streakMilestone")}</span>
              <span>{streak >= 7 ? t("dashboard.achieved") : t("dashboard.remaining", { amount: Math.max(0, 7 - streak) })}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="rounded-cozy bg-white p-4 shadow-playful">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-xl">{t("dashboard.trend")}</h2>
          <div className="flex gap-2 text-xs font-semibold">
            {["week", "month", "year", "all"].map((range) => (
              <button
                key={range}
                type="button"
                onClick={() => setChartRange(range)}
                className={`rounded-full px-3 py-1 ${
                  chartRange === range ? "bg-ink text-white" : "bg-sky/50 text-ink"
                }`}
              >
                {t(`dashboard.range.${range}`)}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-3">
          <WeightChart
            entries={filteredForChart}
            xAxisLabel={t("dashboard.axisDate")}
            yAxisLabel={t("dashboard.axisWeightKg")}
          />
        </div>
      </div>

      <div className="rounded-cozy bg-banana/30 p-4 shadow-playful">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-xl">{t("dashboard.history")}</h2>
          <div className="flex gap-2 text-xs font-semibold">
            {["all", "week", "month"].map((range) => (
              <button
                key={range}
                type="button"
                onClick={() => setHistoryRange(range)}
                className={`rounded-full px-3 py-1 ${
                  historyRange === range ? "bg-ink text-white" : "bg-white/80 text-ink"
                }`}
              >
                {t(`dashboard.range.${range}`)}
              </button>
            ))}
          </div>
        </div>
        {!filteredHistory.length ? (
          <p className="mt-2 text-sm text-ink/70">{t("dashboard.empty")}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {filteredHistory.map((entry) => (
              <li
                key={entry.entry_date}
                className="flex items-center justify-between rounded-soft bg-white/90 px-3 py-2"
              >
                <span>{entry.entry_date}</span>
                <div className="flex items-center gap-3">
                  <span className="font-semibold">{entry.weight_kg} kg</span>
                  <button
                    type="button"
                    onClick={() => handleDelete(entry.entry_date)}
                    disabled={deletingDate === entry.entry_date}
                    className="rounded-full bg-coral/30 px-3 py-1 text-sm font-semibold text-ink hover:bg-coral/40 disabled:opacity-60"
                  >
                    {deletingDate === entry.entry_date ? t("common.loading") : t("common.delete")}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-cozy bg-white p-4 shadow-playful">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase text-ink/60">{t("dashboard.communityLabel")}</p>
            <h2 className="font-display text-xl">{t("dashboard.communityTitle")}</h2>
            <p className="text-sm text-ink/70">{t("dashboard.communityCopy")}</p>
          </div>
          <Link
            to="/posts/new"
            state={{ title: t("dashboard.prefillTitle"), content: t("dashboard.prefillContent") }}
            className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white shadow-playful"
          >
            ➕ {t("dashboard.quickPost")}
          </Link>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {posts.length === 0 ? (
            <p className="text-sm text-ink/70">{t("dashboard.noPosts")}</p>
          ) : (
            posts.map((post) => <WellnessPostCard key={post.id} post={post} />)
          )}
        </div>
      </div>
    </section>
  );
}
