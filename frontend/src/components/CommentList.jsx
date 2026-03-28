import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import Avatar from "./Avatar";
import CommentForm from "./CommentForm";

export default function CommentList({ comments, onUpdate, onDelete }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [editingId, setEditingId] = useState(null);

  if (!comments.length) {
    return <p className="text-onSurfaceVariant">{t("common.noComments")}</p>;
  }

  return (
    <div className="space-y-3">
      {comments.map((comment) => (
        <div key={comment.id} className="rounded-2xl bg-surfaceContainerLowest p-4 shadow-playful">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar user={comment.author} size="sm" />
              <span className="font-semibold text-onSurface">{comment.author.username}</span>
            </div>
            {user?.id === comment.author.id && (
              <div className="flex gap-2 text-sm">
                <button type="button" onClick={() => setEditingId(comment.id)} className="rounded-full bg-surfaceContainerLow px-2 py-1 text-onSurfaceVariant shadow-playful">
                  {t("common.edit")}
                </button>
                <button type="button" onClick={() => onDelete(comment.id)} className="rounded-full bg-secondaryContainer px-2 py-1 text-onSecondaryContainer shadow-playful">
                  {t("common.delete")}
                </button>
              </div>
            )}
          </div>

          {editingId === comment.id ? (
            <CommentForm
              initialValue={comment.content}
              submitLabel={t("common.save")}
              onSubmit={async (value) => {
                const ok = await onUpdate(comment.id, value);
                if (ok) setEditingId(null);
                return false;
              }}
            />
          ) : (
            <p className="text-onSurfaceVariant">{comment.content}</p>
          )}
        </div>
      ))}
    </div>
  );
}
