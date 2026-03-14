import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api from "../api/client";
import Avatar from "../components/Avatar";
import { useToast } from "../context/ToastContext";

export default function ProfilePage() {
  const { username } = useParams();
  const { t } = useTranslation();
  const { pushToast } = useToast();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

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
    <section className="space-y-5 rounded-3xl bg-white/90 p-6 shadow-playful">
      <div className="flex items-center gap-3">
        <Avatar user={profile} />
        <div>
          <h1 className="font-display text-3xl font-bold">{profile.username}</h1>
          <p className="text-sm text-ink/70">{profile.email}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl bg-banana/30 p-4">
          <p className="font-semibold">{t("profile.posts")}: {profile.posts_count}</p>
          <h2 className="mt-2 font-display text-xl">{t("profile.recentPosts")}</h2>
          <ul className="mt-2 space-y-1">
            {profile.recent_posts.map((post) => (
              <li key={post.id}>
                <Link className="hover:underline" to={`/posts/${post.id}`}>{post.title}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl bg-mint/40 p-4">
          <p className="font-semibold">{t("profile.comments")}: {profile.comments_count}</p>
          <h2 className="mt-2 font-display text-xl">{t("profile.recentComments")}</h2>
          <ul className="mt-2 space-y-2">
            {profile.recent_comments.map((comment) => (
              <li key={comment.id} className="text-sm">
                "{comment.content}" <Link className="font-semibold hover:underline" to={`/posts/${comment.post_id}`}>Go to post</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
