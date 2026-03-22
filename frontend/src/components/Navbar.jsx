import { Link, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import Avatar from "./Avatar";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar() {
  const { t } = useTranslation();
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b-4 border-ink/10 bg-white/80 backdrop-blur">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="font-display text-2xl font-bold text-ink">
          WellNest
        </Link>

        <div className="flex items-center gap-2">
          <NavLink className="rounded-full px-3 py-2 hover:bg-banana/60" to="/">
            {t("nav.home")}
          </NavLink>
          {isAuthenticated && (
            <NavLink className="rounded-full px-3 py-2 hover:bg-mint" to="/posts/new">
              {t("nav.create")}
            </NavLink>
          )}
          <NavLink className="rounded-full px-3 py-2 hover:bg-sky/30" to="/community">
            {t("nav.community")}
          </NavLink>
          {isAuthenticated && (
            <NavLink className="rounded-full px-3 py-2 hover:bg-mint/60" to="/progress">
              {t("nav.progress")}
            </NavLink>
          )}
          {isAuthenticated && user && (
            <NavLink className="rounded-full px-3 py-2 hover:bg-sky/40" to={`/users/${user.username}`}>
              {t("nav.profile")}
            </NavLink>
          )}
          {isAuthenticated && (
            <NavLink className="rounded-full px-3 py-2 hover:bg-banana/60" to="/dashboard">
              {t("nav.dashboard")}
            </NavLink>
          )}
          {!isAuthenticated ? (
            <>
              <NavLink className="rounded-full px-3 py-2 hover:bg-sky/40" to="/login">
                {t("nav.login")}
              </NavLink>
              <NavLink className="rounded-full px-3 py-2 hover:bg-grape/20" to="/register">
                {t("nav.register")}
              </NavLink>
            </>
          ) : (
            <button className="rounded-full px-3 py-2 hover:bg-coral/30" type="button" onClick={logout}>
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
