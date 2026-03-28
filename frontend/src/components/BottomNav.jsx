import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";

export default function BottomNav() {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();

  const profilePath = isAuthenticated && user ? `/users/${user.username}` : "/login";

  const linkBase =
    "flex flex-col items-center justify-center gap-1 rounded-2xl px-3 py-2 text-xs font-semibold transition";

  const activeClass = "bg-primary text-white shadow-floating";
  const inactiveClass = "text-onSurface bg-surfaceContainerLow";

  return (
    <nav className="fixed bottom-3 left-0 right-0 z-30 mx-auto flex w-[92%] max-w-xl items-center justify-between rounded-3xl bg-surfaceContainerLowest/90 p-2 shadow-ambient backdrop-blur-xl md:hidden">
      <NavLink to="/" className={({ isActive }) => `${linkBase} ${isActive ? activeClass : inactiveClass}`}>
        <span>🏠</span>
        {t("nav.home")}
      </NavLink>
      <NavLink to="/progress" className={({ isActive }) => `${linkBase} ${isActive ? activeClass : inactiveClass}`}>
        <span>📈</span>
        {t("nav.progress")}
      </NavLink>
      <NavLink
        to="/posts/new"
        className={({ isActive }) =>
          `${linkBase} ${
            isActive
              ? activeClass
              : "bg-primaryFixed text-onSurface shadow-floating"
          }`
        }
      >
        <span>➕</span>
        {t("nav.createShort")}
      </NavLink>
      <NavLink
        to="/community"
        className={({ isActive }) => `${linkBase} ${isActive ? activeClass : inactiveClass}`}
      >
        <span>🤝</span>
        {t("nav.community")}
      </NavLink>
      <NavLink
        to={profilePath}
        className={({ isActive }) => `${linkBase} ${isActive ? activeClass : inactiveClass}`}
      >
        <span>👤</span>
        {t("nav.profile")}
      </NavLink>
    </nav>
  );
}
