import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import de from "./locales/de.json";
import es from "./locales/es.json";

const stored = localStorage.getItem("forum-language");

i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, de: { translation: de }, es: { translation: es } },
  lng: stored || "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

i18n.on("languageChanged", (lng) => {
  localStorage.setItem("forum-language", lng);
});

export default i18n;
