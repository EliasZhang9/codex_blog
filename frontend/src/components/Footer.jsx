import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="mt-16 border-t border-outlineVariant/60 bg-surface px-4 py-10 text-center text-xs text-onSurfaceVariant">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-center gap-6">
        <span className="text-onSurfaceVariant/80">{t("footer.text")}</span>
        <div className="flex items-center gap-4">
          <a className="hover:text-onSurface transition" href="#support">Support</a>
          <a className="hover:text-onSurface transition" href="#about">About</a>
          <a className="hover:text-onSurface transition" href="#legal">Legal</a>
        </div>
      </div>
    </footer>
  );
}
