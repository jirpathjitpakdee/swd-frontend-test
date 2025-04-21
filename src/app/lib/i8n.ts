import i18n from 'i18next'
import languageTh from '../language/th/translation.json'
import languageEn from '../language/en/translation.json'

i18n.init({
    lng: 'th',
    fallbackLng: 'en',
    resources: {
        en: {
            translation: languageEn,
        },
        th: {
            translation: languageTh,
        },
    },
    interpolation: {
        escapeValue: false,
    },
})

export default i18n
