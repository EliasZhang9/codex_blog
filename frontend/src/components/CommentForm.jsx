import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function CommentForm({ onSubmit, initialValue = "", submitLabel, loading = false }) {
  const { t } = useTranslation();
  const [content, setContent] = useState(initialValue);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!content.trim()) return;
    const shouldReset = await onSubmit(content);
    if (shouldReset) setContent("");
  };

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      <textarea
        className="min-h-24 w-full rounded-2xl bg-surfaceContainerHigh p-3 text-onSurface shadow-inner outline outline-1 outline-transparent focus:bg-surfaceContainerLowest focus:outline focus:outline-1 focus:outline-[color:var(--color-outline-variant)]/40"
        value={content}
        onChange={(event) => setContent(event.target.value)}
        placeholder={t("post.placeholder2")}
      />
      <button
        type="submit"
        disabled={loading}
        className="gradient-primary rounded-full px-4 py-2 font-bold text-white shadow-floating disabled:opacity-60"
      >
        {submitLabel || t("post.send")}
      </button>
    </form>
  );
}
