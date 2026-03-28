import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const items = [
  { key: "quick", icon: "⚡", labelKey: "sidebar.quickActions" },
  { key: "goals", icon: "🎯", labelKey: "sidebar.goals" },
  { key: "settings", icon: "⚙️", labelKey: "sidebar.settings" }
];

export default function Sidebar() {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const { pushToast } = useToast();

  const handleCta = () => {
    pushToast(t("sidebar.ctaToast"), "info");
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <aside className="hidden lg:block">
      <div className="rounded-cozy bg-surfaceContainerLowest p-4 shadow-playful ring-1 ring-outlineVariant/60">
        <p className="text-xs font-semibold uppercase tracking-wide text-onSurfaceVariant">
          {t("sidebar.title")}
        </p>
        <p className="mt-1 text-sm text-onSurface">{t("sidebar.subtitle")}</p>

        <div className="mt-4 space-y-2">
          {items.map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between rounded-soft bg-surfaceContainerLow px-3 py-3 text-sm font-semibold text-onSurface shadow-inner"
            >
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-primaryFixed/70 text-lg text-onSurface">
                  {item.icon}
                </span>
                <span>{t(item.labelKey)}</span>
              </div>
              <span className="text-onSurfaceVariant">›</span>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={handleCta}
          className="mt-6 w-full rounded-full bg-primary text-white px-4 py-3 text-sm font-semibold shadow-floating transition hover:translate-y-[-1px] hover:shadow-ambient"
        >
          {t("sidebar.cta")}
        </button>
      </div>
    </aside>
  );
}
