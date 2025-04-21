'use client'

import { useEffect, useState } from 'react'
import i18n from '../lib/i8n'
import LanguageSwitcher from '../components/LanguageSwitcher'
import { Col, Layout, Row } from 'antd'
import style from '../sass/Background.module.scss'
import cardStyles from '../sass/Card.module.scss'
import Link from 'next/link'
const { Content } = Layout

const Test1 = () => {
    const [currentLang, setCurrentLang] = useState(i18n.language)

    const [t, setT] = useState<(key: string) => string>(() => i18n.t)

    useEffect(() => {
        const onLanguageChanged = (lng: string) => {
            setCurrentLang(lng)
            setT(() => i18n.t)
        }

        i18n.on('languageChanged', onLanguageChanged)

        return () => {
            i18n.off('languageChanged', onLanguageChanged)
        }
    }, [])

    return (
        <Layout className={style.background}>
            <div style={{ justifyItems: 'right' }}>
                <LanguageSwitcher currentLanguage={currentLang} />
            </div>
            <Content style={{ height: '100vh' }}>
                <Row
                    justify="center"
                    align="middle"
                    gutter={16}
                    style={{
                        height: '100%',
                    }}
                >
                    <Col span={6}>
                        <Link href={'/test1/layoutpage'}>
                            <div className={cardStyles.card}>
                                <h3 className={cardStyles.card__title}>
                                    {t('cardtitle1')}
                                </h3>
                                <p className={cardStyles.card__subtitle}>
                                    {t('cardsubtitle1')}
                                </p>
                            </div>
                        </Link>
                    </Col>
                    <Col span={6}>
                        <div className={cardStyles.card}>
                            <h3 className={cardStyles.card__title}>
                                {t('cardtitle2')}
                            </h3>
                            <p className={cardStyles.card__subtitle}>
                                {' '}
                                {t('cardsubtitle2')}
                            </p>
                        </div>
                    </Col>
                    <Col span={6}>
                        <div className={cardStyles.card}>
                            <h3 className={cardStyles.card__title}>
                                {' '}
                                {t('cardtitle3')}
                            </h3>
                            <p className={cardStyles.card__subtitle}>
                                {t('cardsubtitle3')}
                            </p>
                        </div>
                    </Col>
                </Row>
            </Content>
        </Layout>
    )
}

export default Test1
