import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api from "../api/client";
import WellnessPostCard from "../components/WellnessPostCard";
import { useToast } from "../context/ToastContext";

export default function CommunityPage() {
  const { t } = useTranslation();
  const { pushToast } = useToast();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const { data } = await api.get("/posts");
        setPosts(data);
      } catch (err) {
        pushToast(err.message, "error");
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, [pushToast]);

  if (loading) {
    return <p>{t("common.loading")}</p>;
  }

  return (
    <section className="space-y-4 rounded-3xl bg-surfaceContainerLow p-6 shadow-playful md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-wide text-onSurfaceVariant">{t("community.subtitle")}</p>
          <h1 className="font-display text-3xl font-bold text-onSurface">{t("community.title")}</h1>
          <p className="text-onSurfaceVariant">{t("community.copy")}</p>
        </div>
        <Link
          to="/posts/new"
          state={{ title: t("dashboard.prefillTitle"), content: t("dashboard.prefillContent") }}
          className="gradient-primary rounded-full px-4 py-2 text-sm font-semibold text-white shadow-floating"
        >
          ➕ {t("dashboard.quickPost")}
        </Link>
      </div>

      {!posts.length ? (
        <p className="text-sm text-onSurfaceVariant">{t("dashboard.noPosts")}</p>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {posts.map((post) => (
            <div key={post.id}>
              <WellnessPostCard post={post} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
