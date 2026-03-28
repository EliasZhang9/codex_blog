import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import api from "../api/client";
import PostCard from "../components/PostCard";
import { useToast } from "../context/ToastContext";

export default function HomePage() {
  const { t } = useTranslation();
  const { pushToast } = useToast();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const { data } = await api.get("/posts");
      setPosts(data);
    } catch (error) {
      pushToast(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleReact = async (postId, emoji) => {
    try {
      const { data } = await api.post(`/posts/${postId}/react`, { emoji });
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId ? { ...post, reactions: data.reactions } : post
        )
      );
    } catch {
      pushToast("Login required for reactions", "error");
    }
  };

  if (loading) return <p>{t("common.loading")}</p>;

  if (!posts.length) {
    return <div className="rounded-3xl bg-surfaceContainerLow p-10 text-center text-onSurfaceVariant shadow-playful">{t("post.empty")}</div>;
  }

  return (
    <section className="rounded-3xl bg-surfaceContainerLow p-6 shadow-playful md:p-8">
      <div className="grid gap-4">
        {posts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
          >
            <PostCard post={post} onReact={handleReact} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
