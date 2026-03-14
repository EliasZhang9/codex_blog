import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api from "../api/client";
import { useToast } from "../context/ToastContext";

export default function CreatePostPage() {
  const { t } = useTranslation();
  const { pushToast } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", content: "" });
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
    <section className="rounded-3xl bg-white/90 p-6 shadow-playful">
      <h1 className="mb-4 font-display text-2xl">{t("post.create")}</h1>
      <form className="space-y-3" onSubmit={onSubmit}>
        <input required className="w-full rounded-xl border p-3" placeholder={t("post.title")} value={form.title} onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))} />
        <textarea required className="min-h-52 w-full rounded-xl border p-3" placeholder={t("post.placeholder1")} value={form.content} onChange={(event) => setForm((prev) => ({ ...prev, content: event.target.value }))} />
        <button disabled={loading} type="submit" className="rounded-full bg-mint px-5 py-2 font-bold">{t("post.create")}</button>
      </form>
    </section>
  );
}
