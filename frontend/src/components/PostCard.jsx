import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import Avatar from "./Avatar";

export default function PostCard({ post, onReact }) {
  const { t } = useTranslation();

  return (
    <motion.article
      whileHover={{ y: -4, scale: 1.01 }}
      className="rounded-3xl border border-white/70 bg-white/90 p-5 shadow-playful"
    >
      <div className="mb-3 flex items-center gap-2">
        <Avatar user={post.author} size="sm" />
        <div className="text-sm">
          <p className="font-bold">{post.author.username}</p>
          <p className="text-ink/60">{t("common.by")} {post.author.username}</p>
        </div>
      </div>
      <Link to={`/posts/${post.id}`} className="block">
        <h2 className="font-display text-xl font-bold">{post.title}</h2>
        <p className="mt-2 line-clamp-3 text-ink/80">{post.content}</p>
      </Link>
      <div className="mt-4 flex items-center justify-between text-sm">
        <span>{post.comment_count} {t("common.comments")}</span>
        <div className="flex gap-2">
          <button type="button" className="rounded-full bg-banana/70 px-2 py-1" onClick={() => onReact(post.id, "fire")}>🔥 {post.reactions.fire}</button>
          <button type="button" className="rounded-full bg-mint px-2 py-1" onClick={() => onReact(post.id, "laugh")}>😂 {post.reactions.laugh}</button>
          <button type="button" className="rounded-full bg-grape/20 px-2 py-1" onClick={() => onReact(post.id, "mindblown")}>🤯 {post.reactions.mindblown}</button>
        </div>
      </div>
    </motion.article>
  );
}
