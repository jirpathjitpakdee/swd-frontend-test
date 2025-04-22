import Link from 'next/link'
import React from 'react'

const Home = () => {
    return (
        <div>
            <Link href="/layoutpage">
                <h1>แบบทดสอบที่ 1</h1>
            </Link>
            <Link href="/form">
                <h1>แบบทดสอบที่ 2</h1>
            </Link>
        </div>
    )
}

export default Home
