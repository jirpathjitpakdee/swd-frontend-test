'use client'

import LanguageSwitcher from '@/app/components/LanguageSwitcher'
import { Layout, Row, Col, Divider } from 'antd'
import styles from '../../sass/Background.module.scss'
import cardShape from '../../sass/Cardshape.module.scss'
import React, { useEffect, useState } from 'react'
import i18n from '../../lib/i8n'

const { Content } = Layout

const shapeClassNames: string[] = [
    cardShape.shape_square,
    cardShape.shape_circle,
    cardShape.shape_oval,
    cardShape.shape_trapezoid,
    cardShape.shape_rectangle,
    cardShape.shape_parallelogram,
]

const LayoutPage = () => {
    const rotation: number = 0

    const [shapeOrder, setShapeOrder] = useState([...shapeClassNames])
    const [reverseGridLayout, setReverseGridLayout] = useState<boolean>(true)
    const [currentLang, setCurrentLang] = useState(i18n.language)
    console.log('currentLang', currentLang)
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
    const handleReverseGridLayout = () => {
        setReverseGridLayout((prev) => !prev)
    }

    const handleMoveLeft = () => {
        setShapeOrder((prev: string[]) => {
            const newOrder = [...prev]
            const first = newOrder.shift()!
            newOrder.push(first)
            return newOrder
        })
    }
    const handleSwapShape = (index: number) => {
        let randomIndex = index
        while (randomIndex === index) {
            randomIndex = Math.floor(Math.random() * shapeOrder.length)
        }

        const newOrder = [...shapeOrder]
        const temp = newOrder[index]
        newOrder[index] = newOrder[randomIndex]
        newOrder[randomIndex] = temp

        setShapeOrder(newOrder)
    }

    const shapeStyle: React.CSSProperties = {
        transform: `rotate(${rotation}deg)`,
        cursor: 'pointer',
    }
    return (
        <Layout className={styles.background}>
            <Content>
                <Row justify="space-between">
                    <h1 style={{ color: 'black', marginTop: 10, padding: 10 }}>
                        {t('layoutpage')}
                    </h1>
                    <div
                        style={{
                            padding: 5,
                            paddingTop: 0,
                            paddingBottom: 10,
                            marginTop: 2,
                            marginBottom: 10,
                        }}
                    >
                        <LanguageSwitcher currentLanguage={currentLang} />
                    </div>
                </Row>

                <Row
                    gutter={[8, 16]}
                    justify="center"
                    align="middle"
                    className={cardShape.card}
                >
                    <Col lg={4}>
                        <div
                            className={cardShape.card__card_shape1}
                            onClick={handleMoveLeft}
                        >
                            <div></div>
                            <button>{t('moveshape')}</button>
                        </div>
                    </Col>
                    <Col lg={8}>
                        <div
                            className={cardShape.card__card_shape2}
                            onClick={handleReverseGridLayout}
                        >
                            <div></div>
                            <button>{t('moveposition')}</button>
                            <div></div>
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div
                            className={cardShape.card__card_shape3}
                            onClick={handleMoveLeft}
                        >
                            <div></div>
                            <button>{t('moveshape')}</button>
                        </div>
                    </Col>
                </Row>
                <div
                    style={{
                        width: '1100px',
                        margin: '0 auto',
                    }}
                >
                    <Divider />
                </div>
                {reverseGridLayout ? (
                    <>
                        {' '}
                        <Row
                            gutter={[16, 16]}
                            justify="end"
                            align="middle"
                            style={{ marginRight: '33vh' }}
                        >
                            {shapeOrder.slice(0, 3).map((shapeClass, i) => (
                                <Col lg={5} key={i}>
                                    <div
                                        className={cardShape.card__card_shape5}
                                    >
                                        <div
                                            className={shapeClass}
                                            onClick={() => handleSwapShape(i)}
                                            style={shapeStyle}
                                        ></div>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                        {/* Shapes Row 2 */}
                        <Row
                            gutter={[16, 16]}
                            justify="center"
                            align="middle"
                            style={{ marginTop: 20 }}
                        >
                            {shapeOrder.slice(3).map((shapeClass, i) => (
                                <Col lg={4} key={i + 3}>
                                    <div
                                        className={cardShape.card__card_shape5}
                                    >
                                        <div
                                            className={shapeClass}
                                            onClick={() =>
                                                handleSwapShape(i + 3)
                                            }
                                            style={shapeStyle}
                                        ></div>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    </>
                ) : (
                    <>
                        <>
                            <Row
                                gutter={[16, 16]}
                                justify="center"
                                align="middle"
                                style={{ marginTop: 4 }}
                            >
                                {shapeOrder.slice(3).map((shapeClass, i) => (
                                    <Col lg={4} key={i + 3}>
                                        <div
                                            className={
                                                cardShape.card__card_shape5
                                            }
                                        >
                                            <div
                                                className={shapeClass}
                                                onClick={() =>
                                                    handleSwapShape(i + 3)
                                                }
                                                style={shapeStyle}
                                            ></div>
                                        </div>
                                    </Col>
                                ))}
                            </Row>{' '}
                            <Row
                                gutter={[16, 16]}
                                justify="end"
                                align="middle"
                                style={{
                                    marginRight: '33vh',
                                    marginTop: 20,
                                }}
                            >
                                {shapeOrder.slice(0, 3).map((shapeClass, i) => (
                                    <Col lg={5} key={i}>
                                        <div
                                            className={
                                                cardShape.card__card_shape5
                                            }
                                        >
                                            <div
                                                className={shapeClass}
                                                onClick={() =>
                                                    handleSwapShape(i)
                                                }
                                                style={shapeStyle}
                                            ></div>
                                        </div>
                                    </Col>
                                ))}
                            </Row>
                        </>
                    </>
                )}
            </Content>
        </Layout>
    )
}

export default LayoutPage
