import { Link } from "react-router-dom";
import { useMemo } from "react";
import Avatar from "./Avatar";

const moodKeywords = [
  { key: "happy", label: "Upbeat", emoji: "😊", color: "bg-mint" },
  { key: "lost", label: "Progress", emoji: "🎯", color: "bg-banana/70" },
  { key: "plateau", label: "Plateau", emoji: "😐", color: "bg-sky/70" },
  { key: "tired", label: "Tired", emoji: "😴", color: "bg-grape/40" },
  { key: "struggle", label: "Struggle", emoji: "💪", color: "bg-coral/40" },
];

function deriveMood(content) {
  if (!content) return { emoji: "🤝", label: "Support", color: "bg-sky/60" };
  const lower = content.toLowerCase();
  const found = moodKeywords.find((m) => lower.includes(m.key));
  return found || { emoji: "🤝", label: "Support", color: "bg-sky/60" };
}

export default function WellnessPostCard({ post }) {
  const mood = useMemo(() => deriveMood(post.content), [post.content]);

  return (
    <article className="rounded-cozy border border-white/70 bg-white/90 p-4 shadow-playful">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar user={post.author} size="sm" />
          <div className="text-sm">
            <p className="font-bold">{post.author.username}</p>
            <p className="text-ink/60">{new Date(post.created_at ?? Date.now()).toLocaleDateString()}</p>
          </div>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold text-ink ${mood.color}`}>
          {mood.emoji} {mood.label}
        </span>
      </div>
      <Link to={`/posts/${post.id}`} className="block">
        <h3 className="font-display text-lg font-bold">{post.title}</h3>
        <p className="mt-2 line-clamp-3 text-sm text-ink/80">{post.content}</p>
      </Link>
      <div className="mt-3 flex items-center justify-between text-xs text-ink/70">
        <span>💬 {post.comment_count}</span>
        <div className="flex gap-2">
          <span>🔥 {post.reactions?.fire ?? 0}</span>
          <span>😂 {post.reactions?.laugh ?? 0}</span>
          <span>🤯 {post.reactions?.mindblown ?? 0}</span>
        </div>
      </div>
    </article>
  );
}
