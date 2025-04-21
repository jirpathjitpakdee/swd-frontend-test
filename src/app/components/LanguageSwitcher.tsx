import i18n from '../lib/i8n'
import selectStyle from '../sass/Select.module.scss'

interface LanguageSwitcherProps {
    currentLanguage: string
}

const LanguageSwitcher = ({ currentLanguage }: LanguageSwitcherProps) => {
    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng)
    }

    return (
        <div>
            <select
                className={selectStyle.languageSelect}
                value={currentLanguage}
                onChange={(e) => changeLanguage(e.target.value)}
            >
                <option value="en">EN</option>
                <option value="th">TH</option>
            </select>
        </div>
    )
}

export default LanguageSwitcher
