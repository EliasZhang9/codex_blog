import { Link, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import Avatar from "./Avatar";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar() {
  const { t } = useTranslation();
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 glass-panel shadow-ambient">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-4 md:px-10">
        <Link to="/" className="font-display text-2xl font-bold text-onSurface">
          WellNest
        </Link>

        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          <NavLink
            className={({ isActive }) =>
              `rounded-full px-3 py-2 text-sm font-semibold transition ${
                isActive ? "bg-surfaceContainerLow text-onSurface" : "text-onSurfaceVariant hover:bg-surfaceContainerLow"
              }`
            }
            to="/"
          >
            {t("nav.home")}
          </NavLink>
          {isAuthenticated && (
            <NavLink
              className={({ isActive }) =>
                `rounded-full px-3 py-2 text-sm font-semibold transition ${
                  isActive
                    ? "bg-secondaryContainer text-onSecondaryContainer shadow-floating"
                    : "bg-secondaryContainer/70 text-onSecondaryContainer hover:shadow-playful"
                }`
              }
              to="/posts/new"
            >
              {t("nav.create")}
            </NavLink>
          )}
          <NavLink
            className={({ isActive }) =>
              `rounded-full px-3 py-2 text-sm font-semibold transition ${
                isActive ? "bg-surfaceContainerLow text-onSurface" : "text-onSurfaceVariant hover:bg-surfaceContainerLow"
              }`
            }
            to="/community"
          >
            {t("nav.community")}
          </NavLink>
          {isAuthenticated && (
            <NavLink
              className={({ isActive }) =>
                `rounded-full px-3 py-2 text-sm font-semibold transition ${
                  isActive ? "bg-surfaceContainerLow text-onSurface" : "text-onSurfaceVariant hover:bg-surfaceContainerLow"
                }`
              }
              to="/progress"
            >
              {t("nav.progress")}
            </NavLink>
          )}
          {isAuthenticated && user && (
            <NavLink
              className={({ isActive }) =>
                `rounded-full px-3 py-2 text-sm font-semibold transition ${
                  isActive ? "bg-surfaceContainerLow text-onSurface" : "text-onSurfaceVariant hover:bg-surfaceContainerLow"
                }`
              }
              to={`/users/${user.username}`}
            >
              {t("nav.profile")}
            </NavLink>
          )}
          {isAuthenticated && (
            <NavLink
              className={({ isActive }) =>
                `rounded-full px-3 py-2 text-sm font-semibold transition ${
                  isActive ? "bg-surfaceContainerLow text-onSurface" : "text-onSurfaceVariant hover:bg-surfaceContainerLow"
                }`
              }
              to="/dashboard"
            >
              {t("nav.dashboard")}
            </NavLink>
          )}
          {!isAuthenticated ? (
            <>
              <NavLink
                className={({ isActive }) =>
                  `rounded-full px-3 py-2 text-sm font-semibold transition ${
                    isActive ? "bg-surfaceContainerLow text-onSurface" : "text-onSurfaceVariant hover:bg-surfaceContainerLow"
                  }`
                }
                to="/login"
              >
                {t("nav.login")}
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  `rounded-full px-3 py-2 text-sm font-semibold transition ${
                    isActive ? "bg-surfaceContainerLow text-onSurface" : "text-onSurfaceVariant hover:bg-surfaceContainerLow"
                  }`
                }
                to="/register"
              >
                {t("nav.register")}
              </NavLink>
            </>
          ) : (
            <button
              className="rounded-full px-3 py-2 text-sm font-semibold text-onSurfaceVariant transition hover:bg-surfaceContainerLow"
              type="button"
              onClick={logout}
            >
              {t("nav.logout")}
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          {user && <Avatar user={user} size="sm" />}
        </div>
      </nav>
    </header>
  );
}
