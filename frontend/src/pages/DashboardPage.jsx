import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api from "../api/client";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";
import useWeightEntries from "../hooks/useWeightEntries";
import WellnessPostCard from "../components/WellnessPostCard";

const DEFAULT_BMR_INPUTS = { sex: "female", weight: "", height: "", age: "" };

const RANGE_FILTERS = {
  all: null,
  week: 7,
  month: 30,
  year: 365
};

function filterByDays(entries, days) {
  if (!days) return entries;
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return entries.filter((entry) => new Date(entry.entry_date) >= cutoff);
}

function calculateBmr({ weight, height, age, sex }) {
  const w = Number(weight);
  const h = Number(height);
  const a = Number(age);
  if ([w, h, a].some((value) => Number.isNaN(value) || value <= 0)) {
    return null;
  }
  const base = 10 * w + 6.25 * h - 5 * a;
  return Math.round(sex === "male" ? base + 5 : base - 161);
}

function formatDayLabel(dateString) {
  return new Date(dateString).toLocaleDateString(undefined, { weekday: "short" });
}

export default function DashboardPage() {
  const { t } = useTranslation();
  const { pushToast } = useToast();
  const { user, updateUser } = useAuth();
  const { entries, loading, error, reload } = useWeightEntries();
  const [entryDate, setEntryDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [weightKg, setWeightKg] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingDate, setDeletingDate] = useState(null);
  const [historyRange, setHistoryRange] = useState("all");
  const [posts, setPosts] = useState([]);
  const [bmrInputs, setBmrInputs] = useState(DEFAULT_BMR_INPUTS);
  const [bmrValue, setBmrValue] = useState(null);
  const [bmrHydrated, setBmrHydrated] = useState(false);
  const [showBmrForm, setShowBmrForm] = useState(false);
  const bmrNotifiedRef = useRef(false);
  const weightFormRef = useRef(null);

  const sortedEntries = useMemo(
    () => [...entries].sort((a, b) => a.entry_date.localeCompare(b.entry_date)),
    [entries]
  );
  const filteredHistory = useMemo(
    () => filterByDays(sortedEntries, RANGE_FILTERS[historyRange]),
    [sortedEntries, historyRange]
  );

  const latest = sortedEntries[sortedEntries.length - 1];
  const weeklyEntries = sortedEntries.slice(-7);
  const todaysIntake = 420;
  const weeklyBars =
    weeklyEntries.length > 0
      ? weeklyEntries.map((entry) => ({
          label: formatDayLabel(entry.entry_date),
          value: entry.weight_kg
        }))
      : [
          { label: "Mon", value: 74.2 },
          { label: "Tue", value: 74.1 },
          { label: "Wed", value: 74.0 },
          { label: "Thu", value: 74.2 },
          { label: "Fri", value: 74.4 },
          { label: "Sat", value: 74.2 },
          { label: "Sun", value: 74.2 }
        ];
  const maxBar = Math.max(...weeklyBars.map((b) => b.value));
  const minBar = Math.min(...weeklyBars.map((b) => b.value));
  const barRange = maxBar - minBar || 1;
  const greetingName = user?.username ? user.username.replace(/^\w/, (c) => c.toUpperCase()) : "Julian";
  const metabolicRemaining = bmrValue ? Math.max(0, bmrValue - todaysIntake) : null;
  const bmrPercent = bmrValue ? Math.min(100, Math.round((todaysIntake / bmrValue) * 100)) : 0;

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

  useEffect(() => {
    setBmrInputs(DEFAULT_BMR_INPUTS);
    setBmrValue(null);
    setBmrHydrated(false);
    if (user?.bmr_value) {
      setBmrValue(user.bmr_value);
    }
    if (user?.bmr_inputs) {
      setBmrInputs((prev) => ({ ...prev, ...user.bmr_inputs }));
    }
    setBmrHydrated(!!user);
  }, [user]);

  useEffect(() => {
    if (!bmrValue && latest && !bmrInputs.weight) {
      setBmrInputs((prev) => ({ ...prev, weight: String(latest.weight_kg) }));
    }
  }, [bmrInputs.weight, bmrValue, latest]);

  useEffect(() => {
    if (!user || !bmrHydrated) return;
    if (!bmrValue && !bmrNotifiedRef.current) {
      pushToast(t("dashboard.bmrPromptToast"), "info");
      bmrNotifiedRef.current = true;
    }
  }, [bmrValue, bmrHydrated, pushToast, t, user]);

  const handleLogFood = () => {
    pushToast(t("dashboard.logFoodPlaceholder"), "info");
  };

  const handleScrollToWeight = () => {
    weightFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

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

  function handleBmrSubmit(event) {
    event.preventDefault();
    const nextBmr = calculateBmr(bmrInputs);
    if (!nextBmr) {
      pushToast(t("dashboard.invalidBmr"), "error");
      return;
    }
    setBmrValue(nextBmr);
    api
      .put("/me/bmr", { bmr: nextBmr, inputs: bmrInputs })
      .then((response) => {
        setBmrValue(response.data.bmr_value);
        if (response.data.bmr_inputs) {
          setBmrInputs((prev) => ({ ...prev, ...response.data.bmr_inputs }));
        }
        updateUser(response.data);
        pushToast(t("dashboard.bmrSaved"), "success");
      })
      .catch((err) => {
        pushToast(err.message || t("common.error"), "error");
      });
  }

  const handleBmrInputChange = (field) => (event) => {
    setBmrInputs((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const useLatestWeight = () => {
    if (latest) {
      setBmrInputs((prev) => ({ ...prev, weight: String(latest.weight_kg) }));
    } else {
      pushToast(t("dashboard.invalidWeight"), "error");
    }
  };

  if (loading) {
    return <p>{t("common.loading")}</p>;
  }

  return (
    <section className="space-y-6 rounded-3xl border border-outlineVariant/50 bg-surfaceContainerLowest p-6 shadow-playful md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-onSurfaceVariant">Vitals Overview</p>
          <h1 className="font-display text-3xl font-bold text-onSurface">Morning, {greetingName}</h1>
          <p className="text-onSurfaceVariant">Your metabolic rhythm is performing 12% above baseline today.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleLogFood}
            className="rounded-full bg-surfaceContainerLowest px-4 py-2 text-sm font-semibold text-onSurface shadow-inner ring-1 ring-outlineVariant transition hover:shadow-floating"
          >
            + Log Food
          </button>
          <button
            type="button"
            onClick={handleScrollToWeight}
            className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-floating transition hover:-translate-y-0.5"
          >
            Update Weight
          </button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_0.9fr]">
        <div
          className="rounded-cozy bg-surfaceContainerLowest p-5 shadow-playful border border-outlineVariant/60"
          style={{
            background: "radial-gradient(circle at 28% 24%, rgba(184,230,200,0.22), transparent 55%), #f9fbf9"
          }}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-onSurface">Metabolic Balance</p>
              <p className="text-xs text-onSurfaceVariant">BMR vs. Daily Caloric Intake</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-onSurfaceVariant">kcal remaining</p>
              <p className="text-2xl font-bold text-primary">{metabolicRemaining !== null ? metabolicRemaining : "—"}</p>
            </div>
          </div>
          <div className="mt-4 space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-onSurfaceVariant">
                <span>Basal Metabolic Rate (BMR)</span>
                <span>{bmrValue ? `${bmrValue} kcal` : "—"}</span>
              </div>
              <div className="mt-2 h-3 rounded-full bg-surfaceContainerHigh">
                <div className="h-3 rounded-full bg-primary" style={{ width: "100%" }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-onSurfaceVariant">
                <span>Today's Intake</span>
                <span>{todaysIntake} kcal</span>
              </div>
              <div className="mt-2 h-3 rounded-full bg-surfaceContainerHigh">
                <div className="h-3 rounded-full bg-primaryFixed" style={{ width: `${Math.max(18, bmrPercent)}%` }} />
              </div>
            </div>
          </div>
          <div className="mt-4 flex gap-5 text-xs font-semibold text-onSurfaceVariant">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-primary" />
              BMR Energy
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-primaryFixed" />
              Consumption
            </div>
          </div>
        </div>

        <div className="rounded-cozy bg-primary p-5 text-white shadow-playful">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase opacity-80">Weekly Trend</p>
              <h3 className="text-xl font-semibold">Weight Plateau</h3>
              <p className="text-sm opacity-80">You’ve maintained a steady weight for 5 days. Consistency is key.</p>
            </div>
            <div className="rounded-full bg-white/15 px-3 py-1 text-sm font-semibold">
              {latest ? `${latest.weight_kg} kg` : "—"}
            </div>
          </div>
          <div className="mt-5 flex items-end gap-2">
            {weeklyBars.map((bar) => {
              const height = 38 + ((bar.value - minBar) / barRange) * 70;
              return (
                <div key={bar.label} className="flex flex-col items-center gap-2 text-xs font-semibold">
                  <div
                    className="w-7 rounded-xl bg-white/20 backdrop-blur-sm"
                    style={{ height }}
                    title={`${bar.value} kg`}
                  >
                    <div className="h-full w-full rounded-xl bg-white/80 mix-blend-screen" />
                  </div>
                  <span className="uppercase opacity-90">{bar.label.slice(0, 3)}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {[
          { label: "Hydration", value: "1.4 / 2.5L", color: "bg-primaryFixed", width: "55%", icon: "💧" },
          { label: "Movement", value: "8,420 steps", color: "bg-primary", width: "82%", icon: "🦶" },
          { label: "Sleep Quality", value: "7h 20m • Deep", color: "bg-primaryContainer", width: "68%", icon: "🌙" }
        ].map((metric) => (
          <div key={metric.label} className="rounded-cozy bg-surfaceContainerLowest p-4 shadow-playful border border-outlineVariant/60">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-surfaceContainerHigh text-lg">{metric.icon}</span>
              <div>
                <p className="text-sm font-semibold text-onSurface">{metric.label}</p>
                <p className="text-xs text-onSurfaceVariant">{metric.value}</p>
              </div>
            </div>
            <div className="mt-3 h-2 rounded-full bg-surfaceContainerHigh">
              <div className={`h-2 rounded-full ${metric.color}`} style={{ width: metric.width }} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]" ref={weightFormRef}>
        <form className="rounded-cozy bg-surfaceContainerLowest p-5 shadow-playful border border-outlineVariant/60" onSubmit={handleSubmit}>
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-xl text-onSurface">{t("dashboard.quickLog")}</h2>
            <span className="rounded-full bg-surfaceContainerLow px-3 py-1 text-xs font-semibold text-onSurfaceVariant shadow-inner">
              {t("dashboard.today")} {new Date().toLocaleDateString()}
            </span>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-3 md:items-end">
            <label className="flex flex-col gap-1 text-sm font-semibold">
              {t("dashboard.date")}
              <input
                className="rounded-soft bg-surfaceContainerHigh px-3 py-2 text-onSurface shadow-inner outline outline-1 outline-transparent focus:bg-surfaceContainerLowest focus:outline focus:outline-1 focus:outline-[color:var(--color-outline-variant)]/40"
                type="date"
                value={entryDate}
                onChange={(event) => setEntryDate(event.target.value)}
                required
              />
            </label>
            <label className="flex flex-col gap-1 text-sm font-semibold">
              {t("dashboard.weightKg")}
              <input
                className="rounded-soft bg-surfaceContainerHigh px-3 py-2 text-onSurface shadow-inner outline outline-1 outline-transparent focus:bg-surfaceContainerLowest focus:outline focus:outline-1 focus:outline-[color:var(--color-outline-variant)]/40"
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
              className="mt-1 rounded-full bg-primary px-4 py-3 font-semibold text-white shadow-floating transition hover:-translate-y-0.5 disabled:opacity-60 md:mt-0"
            >
              {saving ? t("common.loading") : t("dashboard.logToday")}
            </button>
          </div>
        </form>

        <div className="rounded-cozy bg-surfaceContainerLowest p-5 shadow-playful border border-outlineVariant/60">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-xs uppercase text-onSurfaceVariant">{t("dashboard.bmrLabel")}</p>
              <p className="text-lg font-semibold text-onSurface">{t("dashboard.bmrHeadline")}</p>
              <p className="text-sm text-onSurfaceVariant">
                {bmrValue ? t("dashboard.bmrCopy") : t("dashboard.bmrMissingShort")}
              </p>
            </div>
            <div className="rounded-full bg-primaryFixed px-3 py-1 text-sm font-semibold text-onSurface shadow-inner">
              {bmrValue ? `${bmrValue} kcal` : t("dashboard.bmrEmptyPill")}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowBmrForm((prev) => !prev)}
            className="mt-3 text-sm font-semibold text-primary underline-offset-4 hover:underline"
          >
            {showBmrForm ? t("common.cancel") : t("dashboard.bmrCalculate")}
          </button>
          {showBmrForm && (
            <form className="mt-3 grid gap-3 md:grid-cols-2" onSubmit={handleBmrSubmit}>
              <label className="flex flex-col gap-1 text-sm font-semibold">
                {t("dashboard.bmrSex")}
                <select
                  className="rounded-soft bg-surfaceContainerHigh px-3 py-2 text-onSurface shadow-inner outline outline-1 outline-transparent focus:bg-surfaceContainerLowest focus:outline focus:outline-1 focus:outline-[color:var(--color-outline-variant)]/40"
                  value={bmrInputs.sex}
                  onChange={handleBmrInputChange("sex")}
                >
                  <option value="female">{t("dashboard.bmrFemale")}</option>
                  <option value="male">{t("dashboard.bmrMale")}</option>
                </select>
              </label>
              <label className="flex flex-col gap-1 text-sm font-semibold">
                {t("dashboard.bmrAge")}
                <input
                  className="rounded-soft bg-surfaceContainerHigh px-3 py-2 text-onSurface shadow-inner outline outline-1 outline-transparent focus:bg-surfaceContainerLowest focus:outline focus:outline-1 focus:outline-[color:var(--color-outline-variant)]/40"
                  type="number"
                  min="10"
                  max="120"
                  value={bmrInputs.age}
                  onChange={handleBmrInputChange("age")}
                  placeholder="30"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm font-semibold">
                {t("dashboard.bmrHeight")}
                <input
                  className="rounded-soft bg-surfaceContainerHigh px-3 py-2 text-onSurface shadow-inner outline outline-1 outline-transparent focus:bg-surfaceContainerLowest focus:outline focus:outline-1 focus:outline-[color:var(--color-outline-variant)]/40"
                  type="number"
                  min="100"
                  max="250"
                  value={bmrInputs.height}
                  onChange={handleBmrInputChange("height")}
                  placeholder="170"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm font-semibold">
                {t("dashboard.bmrWeight")}
                <div className="flex gap-2">
                  <input
                    className="w-full rounded-soft bg-surfaceContainerHigh px-3 py-2 text-onSurface shadow-inner outline outline-1 outline-transparent focus:bg-surfaceContainerLowest focus:outline focus:outline-1 focus:outline-[color:var(--color-outline-variant)]/40"
                    type="number"
                    min="20"
                    max="300"
                    step="0.1"
                    value={bmrInputs.weight}
                    onChange={handleBmrInputChange("weight")}
                    placeholder="70.5"
                  />
                  <button
                    type="button"
                    onClick={useLatestWeight}
                    className="whitespace-nowrap rounded-full bg-surfaceContainerLow px-3 py-2 text-xs font-semibold text-onSurface shadow-inner hover:shadow-floating"
                  >
                    {t("dashboard.useLatest")}
                  </button>
                </div>
              </label>
              <div className="md:col-span-2 flex items-center justify-between gap-3">
                <p className="text-sm text-onSurfaceVariant">{t("dashboard.bmrHelp")}</p>
                <button
                  type="submit"
                  className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-floating transition hover:-translate-y-0.5"
                >
                  {t("dashboard.bmrCalculate")}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      <div className="rounded-cozy bg-surfaceContainerLowest p-5 shadow-playful border border-outlineVariant/60">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-xl text-onSurface">{t("dashboard.history")}</h2>
          <div className="flex gap-2 text-xs font-semibold">
            {["all", "week", "month"].map((range) => (
              <button
                key={range}
                type="button"
                onClick={() => setHistoryRange(range)}
                className={`rounded-full px-3 py-1 ${
                  historyRange === range ? "bg-primary text-white" : "bg-surfaceContainerLow text-onSurface"
                }`}
              >
                {t(`dashboard.range.${range}`)}
              </button>
            ))}
          </div>
        </div>
        {!filteredHistory.length ? (
          <p className="mt-2 text-sm text-onSurfaceVariant">{t("dashboard.empty")}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {filteredHistory.map((entry) => (
              <li
                key={entry.entry_date}
                className="flex items-center justify-between rounded-soft bg-surfaceContainerLow px-3 py-2 shadow-inner"
              >
                <span className="text-onSurfaceVariant">{entry.entry_date}</span>
                <div className="flex items-center gap-3">
                  <span className="font-semibold">{entry.weight_kg} kg</span>
                  <button
                    type="button"
                    onClick={() => handleDelete(entry.entry_date)}
                    disabled={deletingDate === entry.entry_date}
                    className="rounded-full bg-surfaceContainerHigh px-3 py-1 text-sm font-semibold text-onSurface shadow-playful hover:shadow-floating disabled:opacity-60"
                  >
                    {deletingDate === entry.entry_date ? t("common.loading") : t("common.delete")}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-cozy bg-surfaceContainerLowest p-5 shadow-playful border border-outlineVariant/60">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase text-onSurfaceVariant">{t("dashboard.communityLabel")}</p>
            <h2 className="font-display text-xl text-onSurface">{t("dashboard.communityTitle")}</h2>
            <p className="text-sm text-onSurfaceVariant">{t("dashboard.communityCopy")}</p>
          </div>
          <Link
            to="/posts/new"
            state={{ title: t("dashboard.prefillTitle"), content: t("dashboard.prefillContent") }}
            className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-floating"
          >
            ➕ {t("dashboard.quickPost")}
          </Link>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {posts.length === 0 ? (
            <p className="text-sm text-onSurfaceVariant">{t("dashboard.noPosts")}</p>
          ) : (
            posts.map((post) => <WellnessPostCard key={post.id} post={post} />)
          )}
        </div>
      </div>
    </section>
  );
}
