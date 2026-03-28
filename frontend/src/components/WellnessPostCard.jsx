import { Link } from "react-router-dom";
import { useMemo } from "react";
import Avatar from "./Avatar";

const moodKeywords = [
  { key: "happy", label: "Upbeat", emoji: "😊", color: "bg-secondaryContainer text-onSecondaryContainer" },
  { key: "lost", label: "Progress", emoji: "🎯", color: "bg-primaryFixed/80 text-onSurface" },
  { key: "plateau", label: "Plateau", emoji: "😐", color: "bg-surfaceContainerLow text-onSurface" },
  { key: "tired", label: "Tired", emoji: "😴", color: "bg-surfaceContainerHigh text-onSurface" },
  { key: "struggle", label: "Struggle", emoji: "💪", color: "bg-primaryContainer/80 text-onSurface" },
];

function deriveMood(content) {
  if (!content) return { emoji: "🤝", label: "Support", color: "bg-surfaceContainerLow text-onSurface" };
  const lower = content.toLowerCase();
  const found = moodKeywords.find((m) => lower.includes(m.key));
  return found || { emoji: "🤝", label: "Support", color: "bg-surfaceContainerLow text-onSurface" };
}

export default function WellnessPostCard({ post }) {
  const mood = useMemo(() => deriveMood(post.content), [post.content]);

  return (
    <article className="rounded-cozy bg-surfaceContainerLowest p-4 shadow-playful">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar user={post.author} size="sm" />
          <div className="text-sm">
            <p className="font-bold">{post.author.username}</p>
            <p className="text-onSurfaceVariant">{new Date(post.created_at ?? Date.now()).toLocaleDateString()}</p>
          </div>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold shadow-playful ${mood.color}`}>
          {mood.emoji} {mood.label}
        </span>
      </div>
      <Link to={`/posts/${post.id}`} className="block">
        <h3 className="font-display text-lg font-bold text-onSurface">{post.title}</h3>
        <p className="mt-2 line-clamp-3 text-sm text-onSurfaceVariant">{post.content}</p>
      </Link>
      <div className="mt-3 flex items-center justify-between text-xs text-onSurfaceVariant">
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
