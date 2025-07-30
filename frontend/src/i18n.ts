import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslation from "./locales/en.json";
import ptTranslation from "./locales/pt.json";

const resources = {
        en: {
            translation: enTranslation
        },
        pt: {
            translation: ptTranslation
        }
    }

i18n.use(initReactI18next).init({
    fallbackLng: 'en',
    resources,
    interpolation: {
        escapeValue: false
    },
    
})

const initializeLanguage = async () => {
    try {
        if (window.electronAPI) {
            const savedLanguage = await window.electronAPI.getLanguage()
            if (savedLanguage && Object.keys(resources).includes(savedLanguage)) {
                i18n.changeLanguage(savedLanguage)
            }
        }
    } catch (error) {
        console.error('Error loading language from Electron store:', error)
        const browserLanguage = navigator.language.split('-')[0]
        if (browserLanguage && Object.keys(resources).includes(browserLanguage)) {
            i18n.changeLanguage(browserLanguage)
        }
    }
};

export const changeLanguage = async (lng: string) => {
    i18n.changeLanguage(lng)
    try {
        if (window.electronAPI) {
            await window.electronAPI.setLanguage(lng)
        }
    } catch (error) {
        console.error('Error saving language to Electron store:', error)
    }
}

initializeLanguage()
export default i18n;