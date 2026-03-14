import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api from "../api/client";
import CommentForm from "../components/CommentForm";
import CommentList from "../components/CommentList";
import Avatar from "../components/Avatar";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();
  const { pushToast } = useToast();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPost = async () => {
    try {
      const { data } = await api.get(`/posts/${id}`);
      setPost(data);
    } catch (error) {
      pushToast(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  const createComment = async (content) => {
    try {
      const { data } = await api.post(`/posts/${id}/comments`, { content });
      setPost((prev) => ({ ...prev, comments: [...prev.comments, data] }));
      pushToast(t("post.commentSuccess"));
      return true;
    } catch (error) {
      pushToast(error.message, "error");
      return false;
    }
  };

  const updateComment = async (commentId, content) => {
    try {
      const { data } = await api.put(`/comments/${commentId}`, { content });
      setPost((prev) => ({
        ...prev,
        comments: prev.comments.map((comment) => (comment.id === commentId ? data : comment)),
      }));
      return true;
    } catch (error) {
      pushToast(error.message, "error");
      return false;
    }
  };

  const deleteComment = async (commentId) => {
    try {
      await api.delete(`/comments/${commentId}`);
      setPost((prev) => ({
        ...prev,
        comments: prev.comments.filter((comment) => comment.id !== commentId),
      }));
    } catch (error) {
      pushToast(error.message, "error");
    }
  };

  const deletePost = async () => {
    try {
      await api.delete(`/posts/${id}`);
      pushToast(t("post.deleted"));
      navigate("/");
    } catch (error) {
      pushToast(error.message, "error");
    }
  };

  const reactToPost = async (emoji) => {
    try {
      const { data } = await api.post(`/posts/${id}/react`, { emoji });
      setPost((prev) => ({ ...prev, reactions: data.reactions }));
    } catch {
      pushToast("Login required for reactions", "error");
    }
  };

  if (loading) return <p>{t("common.loading")}</p>;
  if (!post) return <p>{t("common.error")}</p>;

  const isAuthor = user?.id === post.author.id;

  return (
    <section className="space-y-6 rounded-3xl bg-white/90 p-6 shadow-playful">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar user={post.author} />
          <div>
            <p className="font-bold">{post.author.username}</p>
            <p className="text-sm text-ink/60">{new Date(post.created_at).toLocaleString()}</p>
          </div>
        </div>
        {isAuthor && (
          <div className="flex gap-2">
            <Link className="rounded-full bg-sky/50 px-3 py-2 text-sm" to={`/posts/${post.id}/edit`}>
              {t("common.edit")}
            </Link>
            <button className="rounded-full bg-coral/40 px-3 py-2 text-sm" type="button" onClick={deletePost}>
              {t("post.delete")}
            </button>
          </div>
        )}
      </div>

      <h1 className="font-display text-3xl font-bold">{post.title}</h1>
      <p className="whitespace-pre-wrap text-lg leading-relaxed">{post.content}</p>

      <div className="flex gap-2">
        <button type="button" className="rounded-full bg-banana/70 px-3 py-1" onClick={() => reactToPost("fire")}>🔥 {post.reactions.fire}</button>
        <button type="button" className="rounded-full bg-mint px-3 py-1" onClick={() => reactToPost("laugh")}>😂 {post.reactions.laugh}</button>
        <button type="button" className="rounded-full bg-grape/20 px-3 py-1" onClick={() => reactToPost("mindblown")}>🤯 {post.reactions.mindblown}</button>
      </div>

      <div>
        <h2 className="mb-3 font-display text-2xl">{t("post.chaos")}</h2>
        {user ? <CommentForm onSubmit={createComment} /> : <p className="mb-4 text-sm">Login to join the chaos.</p>}
        <CommentList comments={post.comments} onUpdate={updateComment} onDelete={deleteComment} />
      </div>
    </section>
  );
}
