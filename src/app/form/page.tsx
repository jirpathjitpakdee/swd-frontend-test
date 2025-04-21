'use client'

import React, { useState, useEffect } from 'react'
import {
    Table,
    Space,
    Row,
    Col,
    Form,
    Input,
    Radio,
    Select,
    Button,
    Layout,
    Checkbox,
    message,
} from 'antd'
import type { TableColumnsType } from 'antd'
import { useSelector } from 'react-redux'
import { RootState, useAppDispatch } from '../store/store'
import { deleteUser, createUser, updateUser } from '../store/userSlice'
import { User } from '../user/user'
import dayjs from 'dayjs'
import { CheckboxChangeEvent } from 'antd/es/checkbox'
import LanguageSwitcher from '../components/LanguageSwitcher'
import styles from '../sass/Background.module.scss'
import i18n from '../lib/i8n'
import FormatDatePicker from '../components/FormatDatePicker'
import { useRouter } from 'next/navigation'

const { Content } = Layout
const { Option } = Select

interface DataType {
    key: string | undefined
    name: string
    gender: string
    mobilePhone: string
    nationality: string
}

const FormPage = () => {
    const dispatch = useAppDispatch()
    const users = useSelector((state: RootState) => state.users)
    const [form] = Form.useForm()
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
    const [selectAll, setSelectAll] = useState(false)
    const [editingUserId, setEditingUserId] = useState<string>()
    const [isLoading, setIsLoading] = useState(false)

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

    useEffect(() => {
        setIsLoading(true)
    }, [])

    const data: DataType[] = users.map((u: User) => ({
        key: u.id,
        name: `${u.firstName} ${u.lastName}`,
        gender: t(`form.gender.${u.gender}`),
        mobilePhone: `${u.prefix}${u.mobilePhone}` || '-',
        nationality: t(`form.nationality.${u.nationality}`),
    }))

    const handleEdit = (id: string | undefined) => {
        const user = users.find((u: User) => u.id === id)
        if (user) {
            if (id) {
                setEditingUserId(id)
            }
            let citizen = ['', '', '', '', '']
            if (user.citizenID) {
                citizen = user.citizenID.split('-')
            }

            form.setFieldsValue({
                title: user.title,
                firstname: user.firstName,
                lastname: user.lastName,
                birthday: user.birthDay ? dayjs(user.birthDay) : null,
                nationality: user.nationality,
                gender: user.gender,
                prefix: user.prefix,
                mobilePhone: user.mobilePhone,
                passport: user.passport,
                salary: user.salary,
                citizen1: citizen[0],
                citizen2: citizen[1],
                citizen3: citizen[2],
                citizen4: citizen[3],
                citizen5: citizen[4],
            })
        }
    }

    const handleDelete = (id: string | undefined) => {
        if (id) {
            dispatch(deleteUser(id))
            message.success('User deleted successfully')
        }
    }

    const handleSubmit = () => {
        form.validateFields()
            .then((values) => {
                const citizenID = [
                    values.citizen1,
                    values.citizen2,
                    values.citizen3,
                    values.citizen4,
                    values.citizen5,
                ].join('-')

                const userData: User = {
                    title: values.title,
                    firstName: values.firstname,
                    lastName: values.lastname,
                    birthDay: values.birthday
                        ? values.birthday.format('YYYY-MM-DD')
                        : null,
                    nationality: values.nationality,
                    citizenID,
                    gender: values.gender,
                    prefix: values.prefix,
                    mobilePhone: values.mobilePhone,
                    passport: values.passport || '',
                    salary: values.salary,
                }
                if (editingUserId) {
                    const updatedUser = {
                        ...userData,
                        id: editingUserId,
                    }
                    dispatch(updateUser(updatedUser))
                    alert('Save Success')
                } else {
                    const newUser = {
                        ...userData,
                        id: Date.now().toString(),
                    }
                    dispatch(createUser(newUser))
                    alert('Save Success')
                }
                form.resetFields()
            })
            .catch((info) => {
                console.log('Validate Failed:', info)
                message.error('Please fill all required fields')
            })
    }

    const columns: TableColumnsType<DataType> = [
        {
            title: t(`table.title`),
            dataIndex: 'name',
        },
        {
            title: t(`table.gender`),
            dataIndex: 'gender',
        },
        {
            title: t(`table.mobilephone`),
            dataIndex: 'mobilePhone',
        },
        {
            title: t(`table.nationality`),
            dataIndex: 'nationality',
        },
        {
            title: t(`table.manage`),
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button onClick={() => handleEdit(record.key)}>
                        {t(`table.edit`)}
                    </Button>
                    <Button onClick={() => handleDelete(record.key)}>
                        {t(`table.delete`)}
                    </Button>
                </Space>
            ),
        },
    ]

    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        setSelectedRowKeys(newSelectedRowKeys)
    }

    const handleBulkDelete = () => {
        if (selectedRowKeys.length === 0) {
            message.warning('Please select at least one user to delete')
            return
        }

        selectedRowKeys.forEach((key) => {
            dispatch(deleteUser(key.toString()))
        })

        message.success(
            `${selectedRowKeys.length} user(s) deleted successfully`
        )
        setSelectedRowKeys([])
    }

    const rowSelectionConfig = {
        selectedRowKeys,
        onChange: onSelectChange,
    }

    const handleSelectAll = (e: CheckboxChangeEvent) => {
        setSelectAll(e.target.checked)
        if (e.target.checked) {
            const allKeys = data.map((item) => item.key) as string[]
            setSelectedRowKeys(allKeys)
        } else {
            setSelectedRowKeys([])
        }
    }

    const countryCodeToFlagEmoji = (code: string): string => {
        const upperCode = code.toUpperCase()
        const codePoints = Array.from(upperCode).map(
            (char) => 0x1f1e6 + char.charCodeAt(0) - 65
        )
        return String.fromCodePoint(...codePoints)
    }
    const router = useRouter()

    const handleRouteHome = () => {
        router.push('/')
    }

    return (
        <Layout>
            <Content className={styles.background}>
                <Row justify="space-between" style={{ marginLeft: 32 }}>
                    <h1
                        style={{
                            color: 'black',

                            marginTop: 10,
                            padding: 10,
                        }}
                    >
                        {t(`layoutformpage.header`)}
                    </h1>
                    <Row gutter={16}>
                        <Col span={24}>
                            <div
                                style={{
                                    marginTop: 32,
                                    marginRight: 12,
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                }}
                            >
                                <LanguageSwitcher
                                    currentLanguage={currentLang}
                                />
                            </div>
                        </Col>
                        <Col span={24}>
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    marginRight: 14,
                                }}
                            >
                                <Button
                                    onClick={handleRouteHome}
                                    style={{
                                        padding: 10,
                                        marginTop: 10,
                                        fontSize: '12px',
                                    }}
                                >
                                    {t(`layoutformpage.home`)}
                                </Button>
                            </div>
                        </Col>
                    </Row>{' '}
                </Row>
                <div
                    style={{
                        border: '2px solid black',
                        borderRadius: '6px',
                        width: '1200px',
                        height: '400px',
                        margin: '0 auto',
                    }}
                >
                    <Form
                        form={form}
                        layout="horizontal"
                        style={{
                            paddingLeft: 16,
                            paddingRight: 12,
                            marginTop: 5,
                        }}
                    >
                        <Row gutter={16}>
                            <Col span={4}>
                                <Form.Item
                                    label={t(`form.title`)}
                                    name="title"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please select a title',
                                        },
                                    ]}
                                >
                                    <Select placeholder={t(`form.title`)}>
                                        <Option value="Mr">
                                            {t(`form.optiontitle.mr`)}
                                        </Option>
                                        <Option value="Mrs">
                                            {t(`form.optiontitle.mrs`)}
                                        </Option>
                                        <Option value="Ms">
                                            {t(`form.optiontitle.ms`)}
                                        </Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={10}>
                                <Form.Item
                                    label={t(`form.firstname`)}
                                    name="firstname"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please enter firstname',
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={10}>
                                <Form.Item
                                    label={t(`form.lastname`)}
                                    name="lastname"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please enter lastname',
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <Form.Item
                                    label={t(`form.birthday`)}
                                    name="birthday"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please select birthday',
                                        },
                                    ]}
                                >
                                    <FormatDatePicker />
                                </Form.Item>
                            </Col>
                            <Col span={9}>
                                <Form.Item
                                    label={t(`form.labelnation`)}
                                    name="nationality"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                'Please select nationality',
                                        },
                                    ]}
                                >
                                    <Select
                                        placeholder={t(
                                            `form.placeholdernation`
                                        )}
                                        style={{ width: 350 }}
                                    >
                                        <Option value="thai">
                                            {t(`form.nationality.thai`)}
                                        </Option>
                                        <Option value="french">
                                            {t(`form.nationality.french`)}
                                        </Option>
                                        <Option value="american">
                                            {t(`form.nationality.american`)}
                                        </Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Form.Item label={t(`form.citizenID`)}>
                            <Input.Group compact>
                                <Form.Item name="citizen1" noStyle>
                                    <Input style={{ width: 100 }} />
                                </Form.Item>
                                <span style={{ margin: '5px 10px' }}>-</span>
                                <Form.Item name="citizen2" noStyle>
                                    <Input style={{ width: 180 }} />
                                </Form.Item>
                                <span style={{ margin: '5px 10px' }}>-</span>
                                <Form.Item name="citizen3" noStyle>
                                    <Input style={{ width: 180 }} />
                                </Form.Item>
                                <span style={{ margin: '5px 10px' }}>-</span>
                                <Form.Item name="citizen4" noStyle>
                                    <Input style={{ width: 120 }} />
                                </Form.Item>
                                <span style={{ margin: '5px 10px' }}>-</span>
                                <Form.Item name="citizen5" noStyle>
                                    <Input style={{ width: 80 }} />
                                </Form.Item>
                            </Input.Group>
                        </Form.Item>
                        <Form.Item
                            label={t(`form.labelgender`)}
                            name="gender"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please select gender',
                                },
                            ]}
                        >
                            <Radio.Group>
                                <Radio value="male">
                                    {t(`form.gender.male`)}
                                </Radio>
                                <Radio value="female">
                                    {t(`form.gender.female`)}
                                </Radio>
                                <Radio value="unsex">
                                    {t(`form.gender.unsex`)}
                                </Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label={t(`form.mobilephone`)} required>
                            <Input.Group compact>
                                <Form.Item name="prefix" noStyle>
                                    <Select
                                        style={{
                                            width: 180,
                                            fontFamily: 'Noto Color Emoji',
                                        }}
                                    >
                                        <Option value="+66">
                                            <span
                                                style={{
                                                    fontFamily:
                                                        'Noto Color Emoji',
                                                }}
                                            >
                                                {countryCodeToFlagEmoji('TH')}
                                            </span>
                                            <span
                                                style={{
                                                    fontFamily: 'sans-serif',
                                                }}
                                            >
                                                +66
                                            </span>
                                        </Option>
                                        <Option value="+1">
                                            <span
                                                style={{
                                                    fontFamily:
                                                        'Noto Color Emoji',
                                                }}
                                            >
                                                {countryCodeToFlagEmoji('US')}
                                            </span>
                                            <span
                                                style={{
                                                    fontFamily: 'sans-serif',
                                                }}
                                            >
                                                +1
                                            </span>
                                        </Option>
                                        <Option value="+33">
                                            <span
                                                style={{
                                                    fontFamily:
                                                        'Noto Color Emoji',
                                                }}
                                            >
                                                {countryCodeToFlagEmoji('FR')}
                                            </span>
                                            <span
                                                style={{
                                                    fontFamily: 'sans-serif',
                                                }}
                                            >
                                                +33
                                            </span>
                                        </Option>
                                    </Select>
                                </Form.Item>
                                <span style={{ margin: '5px 10px' }}>-</span>
                                <Form.Item
                                    name="mobilePhone"
                                    noStyle
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                'Please enter mobile number',
                                        },
                                    ]}
                                >
                                    <Input style={{ width: 350 }} />
                                </Form.Item>
                            </Input.Group>
                        </Form.Item>
                        <Form.Item label="Passport No." name="passport">
                            <Input style={{ width: 350 }} />
                        </Form.Item>
                        <Row>
                            <Col>
                                <Form.Item
                                    label={t(`form.salary`)}
                                    name="salary"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                'Please enter expected salary',
                                        },
                                    ]}
                                >
                                    <Input style={{ width: 350 }} />
                                </Form.Item>
                            </Col>
                            <Col style={{ marginLeft: 250 }}>
                                <Form.Item>
                                    <Button onClick={() => form.resetFields()}>
                                        {t(`form.reset`)}
                                    </Button>
                                </Form.Item>
                            </Col>
                            <Col style={{ marginLeft: 100 }}>
                                <Form.Item>
                                    <Button onClick={handleSubmit}>
                                        {t(`form.submit`)}
                                    </Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </div>

                <div style={{ marginLeft: 50, marginRight: 50, marginTop: 32 }}>
                    <Row>
                        <Col style={{ padding: 5 }}>
                            <Checkbox
                                checked={selectAll}
                                onChange={handleSelectAll}
                            >
                                {t(`layoutformpage.selectall`)}
                            </Checkbox>
                        </Col>
                        <Col>
                            <Button onClick={handleBulkDelete}>
                                {t(`layoutformpage.deletedata`)}
                            </Button>
                        </Col>
                    </Row>

                    {isLoading && (
                        <Table<DataType>
                            rowSelection={{
                                type: 'checkbox',
                                ...rowSelectionConfig,
                            }}
                            columns={columns}
                            dataSource={data}
                            pagination={{
                                position: ['topRight'],

                                defaultCurrent: 1,
                                defaultPageSize: 5,
                                itemRender: (_page, type, originalElement) => {
                                    if (type === 'prev') {
                                        return <a>{t(`table.prev`)}</a>
                                    }
                                    if (type === 'next') {
                                        return <a>{t(`table.next`)}</a>
                                    }
                                    return originalElement
                                },
                            }}
                        />
                    )}
                </div>
            </Content>
        </Layout>
    )
}

export default FormPage
