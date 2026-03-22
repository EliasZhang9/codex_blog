import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function RegisterPage() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const { pushToast } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    if (form.password !== form.confirm) {
      pushToast("Passwords do not match", "error");
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post("/register", {
        username: form.username,
        email: form.email,
        password: form.password,
      });
      login(data.access_token, data.user);
      pushToast("Welcome! Your wellness journey starts now.");
      navigate("/");
    } catch (error) {
      pushToast(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-md rounded-3xl bg-white/90 p-6 shadow-playful">
      <h1 className="mb-4 font-display text-2xl">{t("auth.join")}</h1>
      <form className="space-y-3" onSubmit={onSubmit}>
        <input required className="w-full rounded-xl border p-3" placeholder={t("auth.username")} value={form.username} onChange={(event) => setForm((prev) => ({ ...prev, username: event.target.value }))} />
        <input required type="email" className="w-full rounded-xl border p-3" placeholder={t("auth.email")} value={form.email} onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))} />
        <input required type="password" className="w-full rounded-xl border p-3" placeholder={t("auth.password")} value={form.password} onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))} />
        <input required type="password" className="w-full rounded-xl border p-3" placeholder={t("auth.confirm")} value={form.confirm} onChange={(event) => setForm((prev) => ({ ...prev, confirm: event.target.value }))} />
        <button disabled={loading} type="submit" className="w-full rounded-full bg-banana px-4 py-2 font-bold">{t("nav.register")}</button>
      </form>
      <p className="mt-4 text-sm">Already a legend? <Link to="/login" className="font-bold text-grape">{t("nav.login")}</Link></p>
    </section>
  );
}
