import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="mt-10 border-t border-ink/10 py-8 text-center text-sm text-ink/70">
      {t("footer.text")}
    </footer>
  );
}
