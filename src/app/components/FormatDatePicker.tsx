import { DatePicker, ConfigProvider } from 'antd'
import type { DatePickerProps } from 'antd'
import { useEffect, useState } from 'react'
import dayjs, { Dayjs } from 'dayjs'
import 'dayjs/locale/th'
import 'dayjs/locale/en'
import buddhistEra from 'dayjs/plugin/buddhistEra'
import i18n from '../lib/i8n'
import thTH from 'antd/locale/th_TH'
import enUS from 'antd/locale/en_US'

dayjs.extend(buddhistEra)

const localeMap = {
    th: thTH,
    en: enUS,
}

const dateFormatMap: Record<string, string> = {
    th: 'เดือน/วัน/ปี',
    en: 'mm//dd//yy',
}

const FormatDatePicker = (props: DatePickerProps) => {
    const [antLocale, setAntLocale] = useState(enUS)
    const [selectedDate, setSelectedDate] = useState<Dayjs>()

    useEffect(() => {
        const currentLang = i18n.language as 'th' | 'en'
        dayjs.locale(currentLang === 'th' ? 'th' : 'en')
        setAntLocale(localeMap[currentLang] || enUS)
    }, [])

    const handleChange = (date: Dayjs) => {
        setSelectedDate(date)
        props.onChange?.(
            date,
            date?.format(dateFormatMap[i18n.language] || 'YYYY-MM-DD')
        )
    }

    return (
        <ConfigProvider locale={antLocale}>
            <div>
                <DatePicker
                    format={dateFormatMap[i18n.language]}
                    placeholder={dateFormatMap[i18n.language]}
                    style={{ width: 250 }}
                    onChange={handleChange}
                    {...props}
                />

                {selectedDate && (
                    <div style={{ marginTop: 10 }}>
                        <strong>
                            {dayjs(selectedDate)
                                .locale(i18n.language)
                                .format(dateFormatMap[i18n.language])}
                        </strong>
                    </div>
                )}
            </div>
        </ConfigProvider>
    )
}

export default FormatDatePicker
