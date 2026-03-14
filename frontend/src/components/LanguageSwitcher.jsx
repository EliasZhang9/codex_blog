import { useTranslation } from "react-i18next";

const languages = [
  { code: "en", label: "EN" },
  { code: "de", label: "DE" },
  { code: "es", label: "ES" },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  return (
    <div className="flex items-center gap-2 rounded-full bg-white/70 px-2 py-1 shadow-playful">
      {languages.map((language) => (
        <button
          key={language.code}
          onClick={() => i18n.changeLanguage(language.code)}
          className={`rounded-full px-2 py-1 text-xs font-bold ${
            i18n.language.startsWith(language.code)
              ? "bg-grape text-white"
              : "bg-transparent text-ink hover:bg-sky/40"
          }`}
          type="button"
        >
          {language.label}
        </button>
      ))}
    </div>
  );
}
