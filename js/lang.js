const DEFAULT_LANGUAGE = "en";
const SUPPORTED_LANGUAGES = ["en", "es"];

function getTranslationValue(translations, key) {
  return key.split(".").reduce((currentValue, property) => {
    return currentValue?.[property];
  }, translations);
}

async function loadLanguage(language = DEFAULT_LANGUAGE) {
  const selectedLanguage = SUPPORTED_LANGUAGES.includes(language)
    ? language
    : DEFAULT_LANGUAGE;

  try {
    const response = await fetch(`./lang/${selectedLanguage}.json`);

    if (!response.ok) {
      throw new Error(
        `No se pudo cargar el idioma: ${selectedLanguage}`
      );
    }

    const translations = await response.json();

    // Textos normales
    document.querySelectorAll("[data-lang]").forEach((element) => {
      const key = element.dataset.lang;

      if (!key) {
        return;
      }

      const translation = getTranslationValue(translations, key);

      if (typeof translation === "string") {
        element.textContent = translation;
      }
    });

    // Textos que contienen etiquetas como <br>
    document.querySelectorAll("[data-lang-html]").forEach((element) => {
      const key = element.dataset.langHtml;
      const translation = getTranslationValue(translations, key);

      if (typeof translation === "string") {
        element.innerHTML = translation;
      }
    });

    // Traducción de placeholders
    document
      .querySelectorAll("[data-lang-placeholder]")
      .forEach((element) => {
        const key = element.dataset.langPlaceholder;
        const translation = getTranslationValue(translations, key);

        if (typeof translation === "string") {
          element.placeholder = translation;
        }
      });

    // Traducción de aria-label
    document
      .querySelectorAll("[data-lang-aria-label]")
      .forEach((element) => {
        const key = element.dataset.langAriaLabel;
        const translation = getTranslationValue(translations, key);

        if (typeof translation === "string") {
          element.setAttribute("aria-label", translation);
        }
      });

    document.documentElement.lang = selectedLanguage;
    localStorage.setItem("language", selectedLanguage);

    updateActiveLanguageButton(selectedLanguage);
  } catch (error) {
    console.error("Error al cargar las traducciones:", error);
  }
}

function updateActiveLanguageButton(language) {
  document.querySelectorAll("[data-language]").forEach((button) => {
    const isActive = button.dataset.language === language;

    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const savedLanguage = localStorage.getItem("language");

  const initialLanguage = SUPPORTED_LANGUAGES.includes(savedLanguage)
    ? savedLanguage
    : DEFAULT_LANGUAGE;

  loadLanguage(initialLanguage);

  document.querySelectorAll("[data-language]").forEach((button) => {
    button.addEventListener("click", () => {
      loadLanguage(button.dataset.language);
    });
  });

  const yearElement = document.getElementById("year");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
});