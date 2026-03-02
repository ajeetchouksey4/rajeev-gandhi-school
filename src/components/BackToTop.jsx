import React, { useState, useEffect } from 'react'
import { ArrowUp } from 'lucide-react'
import './BackToTop.css'

const BackToTop = () => {
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const handleScroll = () => setVisible(window.scrollY > 500)
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

    return (
        <button
            className={`back-to-top ${visible ? 'visible' : ''}`}
            onClick={scrollTop}
            aria-label="Back to top"
        >
            <ArrowUp size={22} />
        </button>
    )
}

export default BackToTop
