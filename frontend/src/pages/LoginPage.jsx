import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function LoginPage() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const { pushToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/login", form);
      login(data.access_token, data.user);
      navigate(location.state?.from?.pathname || "/");
    } catch (error) {
      pushToast(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-md rounded-3xl bg-white/90 p-6 shadow-playful">
      <h1 className="mb-4 font-display text-2xl">{t("auth.welcome")}</h1>
      <form className="space-y-3" onSubmit={onSubmit}>
        <input required type="email" className="w-full rounded-xl border p-3" placeholder={t("auth.email")} value={form.email} onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))} />
        <input required type="password" className="w-full rounded-xl border p-3" placeholder={t("auth.password")} value={form.password} onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))} />
        <button disabled={loading} type="submit" className="w-full rounded-full bg-sky px-4 py-2 font-bold">{t("nav.login")}</button>
      </form>
      <p className="mt-4 text-sm">No account? <Link to="/register" className="font-bold text-grape">{t("nav.register")}</Link></p>
    </section>
  );
}
