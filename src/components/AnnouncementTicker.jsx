import React, { useState } from 'react'
import { Megaphone, X, ChevronRight, Bell } from 'lucide-react'
import './AnnouncementTicker.css'

const tickerItems = [
    {
        id: 1,
        tag: 'ADMISSIONS',
        text: 'Admissions Open for Session 2026-27 (Nursery to Class XII) — Limited Seats Available!',
        link: '#admissions',
    },
    {
        id: 2,
        tag: 'EXAMS',
        text: 'MPBSE Board Examination Schedule 2026 for Class X & XII released.',
        link: '#announcements',
    },
    {
        id: 3,
        tag: 'EVENT',
        text: 'Annual Sports Meet 2026 winners list updated in gallery section.',
        link: '#gallery',
    },
]

const AnnouncementTicker = () => {
    const [isVisible, setIsVisible] = useState(true)
    const [currentIndex, setCurrentIndex] = useState(0)

    if (!isVisible) return null

    const currentItem = tickerItems[currentIndex]

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % tickerItems.length)
    }

    const handleNavClick = (e, targetHref) => {
        e.preventDefault()
        const el = document.querySelector(targetHref)
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' })
        }
    }

    return (
        <div className="announcement-ticker-bar">
            <div className="container ticker-container">
                <div className="ticker-label">
                    <Megaphone className="ticker-icon" size={16} />
                    <span>LATEST UPDATE</span>
                </div>

                <div className="ticker-content" onClick={handleNext} title="Click for next update">
                    <span className={`ticker-tag tag-${currentItem.tag.toLowerCase()}`}>
                        {currentItem.tag}
                    </span>
                    <p className="ticker-text">{currentItem.text}</p>
                    <a
                        href={currentItem.link}
                        className="ticker-link"
                        onClick={(e) => handleNavClick(e, currentItem.link)}
                    >
                        <span>Details</span>
                        <ChevronRight size={14} />
                    </a>
                </div>

                <div className="ticker-actions">
                    <span className="ticker-count">
                        {currentIndex + 1}/{tickerItems.length}
                    </span>
                    <button
                        className="ticker-close-btn"
                        onClick={() => setIsVisible(false)}
                        aria-label="Close notification bar"
                    >
                        <X size={16} />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AnnouncementTicker
