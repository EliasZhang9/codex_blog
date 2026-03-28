import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api from "../api/client";
import { useToast } from "../context/ToastContext";

export default function CreatePostPage() {
  const { t } = useTranslation();
  const { pushToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const prefill = location.state || {};
  const [form, setForm] = useState({ title: prefill.title || "", content: prefill.content || "" });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/posts", form);
      pushToast(t("post.created"));
      navigate(`/posts/${data.id}`);
    } catch (error) {
      pushToast(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="rounded-3xl bg-surfaceContainerLow p-6 shadow-playful md:p-8">
      <h1 className="mb-4 font-display text-2xl text-onSurface">{t("post.create")}</h1>
      <form className="space-y-3" onSubmit={onSubmit}>
        <input
          required
          className="w-full rounded-xl bg-surfaceContainerHigh p-3 text-onSurface shadow-inner outline outline-1 outline-transparent focus:bg-surfaceContainerLowest focus:outline focus:outline-1 focus:outline-[color:var(--color-outline-variant)]/40"
          placeholder={t("post.title")}
          value={form.title}
          onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
        />
        <textarea
          required
          className="min-h-52 w-full rounded-xl bg-surfaceContainerHigh p-3 text-onSurface shadow-inner outline outline-1 outline-transparent focus:bg-surfaceContainerLowest focus:outline focus:outline-1 focus:outline-[color:var(--color-outline-variant)]/40"
          placeholder={t("post.placeholder1")}
          value={form.content}
          onChange={(event) => setForm((prev) => ({ ...prev, content: event.target.value }))}
        />
        <button disabled={loading} type="submit" className="gradient-primary rounded-full px-5 py-3 font-bold text-white shadow-floating">
          {t("post.create")}
        </button>
      </form>
    </section>
  );
}
