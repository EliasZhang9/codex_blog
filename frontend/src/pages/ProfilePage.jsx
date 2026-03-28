import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api from "../api/client";
import Avatar from "../components/Avatar";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";
import useWeightEntries from "../hooks/useWeightEntries";

export default function ProfilePage() {
  const { username } = useParams();
  const { t } = useTranslation();
  const { pushToast } = useToast();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const isCurrentUser = user?.username === username;
  const { entries } = useWeightEntries(isCurrentUser);

  const totalWeightEntries = entries.length;
  const streak = useMemo(() => {
    const sorted = [...entries].sort((a, b) => a.entry_date.localeCompare(b.entry_date));
    let count = 0;
    const today = new Date();
    for (let i = sorted.length - 1; i >= 0; i -= 1) {
      const date = new Date(sorted[i].entry_date + "T00:00:00");
      const expected = new Date();
      expected.setDate(today.getDate() - count);
      if (date.toDateString() === expected.toDateString()) {
        count += 1;
      } else {
        break;
      }
    }
    return count;
  }, [entries]);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const { data } = await api.get(`/users/${username}`);
        setProfile(data);
      } catch (error) {
        pushToast(error.message, "error");
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [username]);

  if (loading) return <p>{t("common.loading")}</p>;
  if (!profile) return <p>{t("common.error")}</p>;

  return (
    <section className="space-y-5 rounded-3xl bg-surfaceContainerLow p-6 shadow-playful md:p-8">
      <div className="flex items-center gap-3">
        <Avatar user={profile} />
        <div>
          <h1 className="font-display text-3xl font-bold text-onSurface">{profile.username}</h1>
          <p className="text-sm text-onSurfaceVariant">{profile.email}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-surfaceContainerLowest p-4 shadow-playful">
          <p className="font-semibold">{t("profile.posts")}: {profile.posts_count}</p>
          <h2 className="mt-2 font-display text-xl">{t("profile.recentPosts")}</h2>
          <ul className="mt-2 space-y-1">
            {profile.recent_posts.map((post) => (
              <li key={post.id}>
                <Link className="text-onSurfaceVariant hover:underline" to={`/posts/${post.id}`}>{post.title}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl bg-surfaceContainerLowest p-4 shadow-playful">
          <p className="font-semibold">{t("profile.comments")}: {profile.comments_count}</p>
          <h2 className="mt-2 font-display text-xl">{t("profile.recentComments")}</h2>
          <ul className="mt-2 space-y-2">
            {profile.recent_comments.map((comment) => (
              <li key={comment.id} className="text-sm">
                "{comment.content}" <Link className="font-semibold text-onSurface hover:underline" to={`/posts/${comment.post_id}`}>Go to post</Link>
              </li>
            ))}
          </ul>
        </div>

        {isCurrentUser && (
          <div className="rounded-2xl bg-surfaceContainerLowest p-4 shadow-playful">
            <h2 className="font-display text-xl">{t("dashboard.title")}</h2>
            <p className="text-sm text-onSurfaceVariant">{t("profile.weightSummary")}</p>
            <div className="mt-2 flex items-center justify-between rounded-xl bg-surfaceContainerLow px-3 py-2">
              <span className="text-sm font-semibold">{t("dashboard.entries")}</span>
              <span className="text-lg font-bold">{totalWeightEntries}</span>
            </div>
            <div className="mt-2 flex items-center justify-between rounded-xl bg-surfaceContainerLow px-3 py-2">
              <span className="text-sm font-semibold">{t("dashboard.streak")}</span>
              <span className="text-lg font-bold">{streak}🔥</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
