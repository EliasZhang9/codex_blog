import { Link, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import Avatar from "./Avatar";

export default function Navbar() {
  const { t } = useTranslation();
  const { user, isAuthenticated, logout } = useAuth();

  const profilePath = isAuthenticated && user ? `/users/${user.username}` : "/login";

  return (
    <header className="sticky top-0 z-40 glass-panel shadow-ambient">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4 md:px-8">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold text-onSurface">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-primary text-white">•</span>
          Ethereal Wellness
        </Link>

        <div className="hidden items-center gap-2 rounded-full bg-surfaceContainerLow px-3 py-1 shadow-inner md:flex">
          <NavLink
            className={({ isActive }) =>
              `rounded-full px-4 py-2 text-sm font-semibold transition ${
                isActive ? "bg-surfaceContainerLowest text-onSurface shadow-floating" : "text-onSurfaceVariant hover:bg-surfaceContainerLowest"
              }`
            }
            to="/"
          >
            {t("nav.home")}
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `rounded-full px-4 py-2 text-sm font-semibold transition ${
                isActive ? "bg-surfaceContainerLowest text-onSurface shadow-floating" : "text-onSurfaceVariant hover:bg-surfaceContainerLowest"
              }`
            }
            to="/community"
          >
            Food Log
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `rounded-full px-4 py-2 text-sm font-semibold transition ${
                isActive ? "bg-surfaceContainerLowest text-onSurface shadow-floating" : "text-onSurfaceVariant hover:bg-surfaceContainerLowest"
              }`
            }
            to="/dashboard"
          >
            Weight Tracker
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `rounded-full px-4 py-2 text-sm font-semibold transition ${
                isActive ? "bg-surfaceContainerLowest text-onSurface shadow-floating" : "text-onSurfaceVariant hover:bg-surfaceContainerLowest"
              }`
            }
            to={profilePath}
          >
            Profile
          </NavLink>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="hidden h-10 w-10 items-center justify-center rounded-full bg-surfaceContainerLow text-lg text-onSurface shadow-inner transition hover:shadow-floating md:inline-flex"
            aria-label="Notifications"
          >
            🔔
          </button>
          {isAuthenticated ? (
            <>
              <NavLink
                to="/posts/new"
                className="hidden rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-floating transition hover:-translate-y-0.5 md:inline-flex"
              >
                +
              </NavLink>
              <button
                className="hidden rounded-full px-3 py-2 text-sm font-semibold text-onSurfaceVariant transition hover:bg-surfaceContainerLow md:inline-flex"
                type="button"
                onClick={logout}
              >
                {t("nav.logout")}
              </button>
              {user && <Avatar user={user} size="sm" />}
            </>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <NavLink
                to="/login"
                className="rounded-full px-3 py-2 text-sm font-semibold text-onSurfaceVariant transition hover:bg-surfaceContainerLow"
              >
                {t("nav.login")}
              </NavLink>
              <NavLink
                to="/register"
                className="rounded-full bg-primary text-white px-3 py-2 text-sm font-semibold shadow-floating transition hover:-translate-y-0.5"
              >
                {t("nav.register")}
              </NavLink>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
