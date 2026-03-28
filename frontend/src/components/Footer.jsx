import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="mt-20 rounded-cozy bg-surfaceContainerLow px-6 py-8 text-center text-sm text-onSurfaceVariant shadow-playful">
      {t("footer.text")}
    </footer>
  );
}
