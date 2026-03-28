import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useState } from "react";

const icons = {
  quick: (color) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  goals: (color) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4" />
      <line x1="12" y1="2.5" x2="12" y2="6" />
      <line x1="12" y1="18" x2="12" y2="21.5" />
      <line x1="2.5" y1="12" x2="6" y2="12" />
      <line x1="18" y1="12" x2="21.5" y2="12" />
    </svg>
  ),
  settings: (color) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3.4" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.02a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.02a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.02a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
    </svg>
  )
};

export default function Sidebar() {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const { pushToast } = useToast();
  const [active, setActive] = useState("quick");

  if (!isAuthenticated) return null;

  const handleCta = () => pushToast(t("sidebar.ctaToast"), "info");

  return (
    <aside className="hidden lg:block">
      <div className="flex h-full min-h-[78vh] flex-col rounded-3xl bg-surfaceContainerLow/80 p-5 shadow-inner border border-[rgba(0,0,0,0.03)]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-onSurfaceVariant">
            {t("sidebar.title")}
          </p>
          <p className="mt-1 text-sm text-onSurfaceVariant/90">{t("sidebar.subtitle")}</p>
        </div>

        <div className="mt-6 space-y-3">
          {[
            { key: "quick", label: t("sidebar.quickActions"), icon: "⚡", onClick: handleCta },
            { key: "goals", label: t("sidebar.goals"), icon: "🎯" },
            { key: "settings", label: t("sidebar.settings"), icon: "⚙️" }
          ].map((item) => {
            const isActive = active === item.key;
            const stroke = isActive ? "var(--color-primary)" : "var(--color-on-surface-variant)";
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => {
                  setActive(item.key);
                  if (item.onClick) item.onClick();
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ? "border border-[rgba(0,0,0,0.04)] bg-surfaceContainerLowest text-primary shadow-[0_8px_20px_rgba(15,90,57,0.10)]"
                    : "text-onSurfaceVariant hover:text-onSurface"
                }`}
              >
                <span className={`grid h-9 w-9 place-items-center rounded-full ${isActive ? "bg-primary/10" : "bg-surfaceContainerHigh"}`}>
                  {icons[item.key](stroke)}
                </span>
                {item.label}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={handleCta}
          className="mt-auto w-48 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(15,90,57,0.22)] transition hover:-translate-y-0.5"
        >
          {t("sidebar.cta")}
        </button>
      </div>
    </aside>
  );
}
