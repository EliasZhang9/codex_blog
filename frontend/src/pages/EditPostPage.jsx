import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api from "../api/client";
import { useToast } from "../context/ToastContext";

export default function EditPostPage() {
  const { id } = useParams();
  const { t } = useTranslation();
  const { pushToast } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      try {
        const { data } = await api.get(`/posts/${id}`);
        setForm({ title: data.title, content: data.content });
      } catch (error) {
        pushToast(error.message, "error");
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [id]);

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      await api.put(`/posts/${id}`, form);
      pushToast(t("post.updated"));
      navigate(`/posts/${id}`);
    } catch (error) {
      pushToast(error.message, "error");
    }
  };

  if (loading) return <p>{t("common.loading")}</p>;

  return (
    <section className="rounded-3xl bg-white/90 p-6 shadow-playful">
      <h1 className="mb-4 font-display text-2xl">{t("post.edit")}</h1>
      <form className="space-y-3" onSubmit={onSubmit}>
        <input required className="w-full rounded-xl border p-3" value={form.title} onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))} />
        <textarea required className="min-h-52 w-full rounded-xl border p-3" value={form.content} onChange={(event) => setForm((prev) => ({ ...prev, content: event.target.value }))} />
        <button type="submit" className="rounded-full bg-sky px-5 py-2 font-bold">{t("common.save")}</button>
      </form>
    </section>
  );
}
