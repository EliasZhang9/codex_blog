import { useTranslation } from "react-i18next";

const languages = [
  { code: "en", label: "EN" },
  { code: "de", label: "DE" },
  { code: "es", label: "ES" },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  return (
    <div className="flex items-center gap-2 rounded-full bg-surfaceContainerLow px-2 py-1 shadow-playful">
      {languages.map((language) => (
        <button
          key={language.code}
          onClick={() => i18n.changeLanguage(language.code)}
          className={`rounded-full px-2 py-1 text-xs font-bold ${
            i18n.language.startsWith(language.code)
              ? "bg-primary text-white shadow-playful"
              : "bg-transparent text-onSurfaceVariant hover:bg-surfaceContainerLowest"
          }`}
          type="button"
        >
          {language.label}
        </button>
      ))}
    </div>
  );
}
