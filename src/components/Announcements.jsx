import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Bell,
    Calendar,
    Search,
    Pin,
    AlertCircle,
    ChevronRight,
    Sparkles,
    X,
    Lock
} from 'lucide-react'
import api from '../api/api'
import './Announcements.css'

const categories = ['All', 'Admissions', 'Exams', 'Academic', 'Events', 'Circulars']

const defaultAnnouncements = [
    {
        id: 1,
        title: 'Admissions Open for Academic Session 2026-2027',
        category: 'Admissions',
        date: '28 Jan 2026',
        isPinned: true,
        badge: 'URGENT',
        description:
            'Registration forms for Nursery to Class 11th are now available online and at the school office. Entrance assessment dates and syllabus guidelines will be communicated individually to registered parents.',
    },
    {
        id: 2,
        title: 'MP Board Class 10th & 12th Pre-Board Exam Date Sheet',
        category: 'Exams',
        date: '25 Jan 2026',
        isPinned: true,
        badge: 'IMPORTANT',
        description:
            'Pre-board examinations start from 10th February 2026. Practical examinations for science streams will take place between 5th-8th Feb. Admit cards can be collected from the school administrative counter.',
    },
    {
        id: 3,
        title: 'Revised Timing for Nursery & KG Classes during Winter Season',
        category: 'Circulars',
        date: '20 Jan 2026',
        isPinned: false,
        badge: 'NOTICE',
        description:
            'Due to cold wave conditions, morning timings for Nursery to UKG classes are revised to 9:00 AM – 1:30 PM until further notification. School buses will operate accordingly.',
    },
    {
        id: 4,
        title: 'Annual Science & Art Exhibition "INNOVATE 2026"',
        category: 'Events',
        date: '15 Jan 2026',
        isPinned: false,
        badge: 'EVENT',
        description:
            'Students from classes VI to XII will showcase working models and creative artwork. Parents are cordially invited to visit the exhibition hall from 10:00 AM to 2:00 PM.',
    },
    {
        id: 5,
        title: 'Parent-Teacher Meeting (PTM) for Classes I to IX',
        category: 'Academic',
        date: '10 Jan 2026',
        isPinned: false,
        badge: 'MEETING',
        description:
            'PTM for second term progress review will be conducted on Saturday, 7th February 2026. Academic performance report cards will be handed over in person.',
    },
]

const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

const Announcements = ({ externalAnnouncements, onOpenAdmin }) => {
    const [announcements, setAnnouncements] = useState([])
    const [selectedCategory, setSelectedCategory] = useState('All')
    const [searchQuery, setSearchQuery] = useState('')
    const [activeAnnouncement, setActiveAnnouncement] = useState(null)

    // Load data from backend or local storage
    const loadAnnouncements = async () => {
        try {
            const res = await api.get('/announcements')
            const data = await res.json()
            if (Array.isArray(data)) {
                setAnnouncements(data)
                return
            }
        } catch (err) {
            console.warn('Frontend API fetch fallback to local storage')
        }

        const saved = localStorage.getItem('rg_announcements')
        if (saved !== null) {
            try {
                setAnnouncements(JSON.parse(saved))
                return
            } catch (e) {}
        }
        setAnnouncements([])
    }

    useEffect(() => {
        if (Array.isArray(externalAnnouncements)) {
            setAnnouncements(externalAnnouncements)
        } else {
            loadAnnouncements()
        }
    }, [externalAnnouncements])

    // Lock body scroll when modal pop out is visible to prevent scrolling conflicts
    useEffect(() => {
        if (activeAnnouncement) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => {
            document.body.style.overflow = ''
        }
    }, [activeAnnouncement])

    const filteredAnnouncements = announcements
        .filter((item) => {
            const matchesCategory =
                selectedCategory === 'All' || item.category === selectedCategory
            const matchesSearch =
                item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.description.toLowerCase().includes(searchQuery.toLowerCase())
            return matchesCategory && matchesSearch
        })
        .sort((a, b) => {
            const pinA = a.isPinned ? 1 : 0
            const pinB = b.isPinned ? 1 : 0
            if (pinA !== pinB) return pinB - pinA
            return (b.id || 0) - (a.id || 0)
        })

    return (
        <section className="section announcements-section" id="announcements">
            <div className="container">
                {/* Compact Section Header */}
                <motion.div
                    className="announcements-header"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-50px' }}
                    variants={fadeInUp}
                >
                    <div className="header-text-group">
                        <span className="section-tag-sm">
                            <Bell size={13} /> Notice Board
                        </span>
                        <h2 className="compact-title">
                            Latest <span className="gradient-text">Announcements</span>
                        </h2>
                    </div>

                    <div className="header-actions-group">
                        {/* Compact Search */}
                        <div className="compact-search-box">
                            <Search size={15} className="search-icon" />
                            <input
                                type="text"
                                placeholder="Filter notices..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            {searchQuery && (
                                <button className="clear-search-btn" onClick={() => setSearchQuery('')}>
                                    ×
                                </button>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Compact Card Box Container */}
                <motion.div
                    className="announcements-card-container"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                >
                    {/* Category Filter Chips */}
                    <div className="compact-category-bar">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                className={`chip-btn ${selectedCategory === cat ? 'active' : ''}`}
                                onClick={() => setSelectedCategory(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Notice List */}
                    <div className="notice-rows-list">
                        <AnimatePresence mode="wait">
                            {filteredAnnouncements.length > 0 ? (
                                <motion.div
                                    key={selectedCategory + searchQuery}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="rows-wrapper"
                                >
                                    {filteredAnnouncements.map((item) => (
                                        <div
                                            key={item.id}
                                            className={`notice-row ${item.isPinned ? 'pinned-row' : ''}`}
                                            onClick={() => setActiveAnnouncement(item)}
                                        >
                                            <div className="row-date-badge">
                                                <Calendar size={12} />
                                                <span>{item.date}</span>
                                            </div>

                                            <span className={`badge-chip tag-${item.category.toLowerCase()}`}>
                                                {item.badge || 'NOTICE'}
                                            </span>

                                            <div className="row-content">
                                                <h4 className="row-title">
                                                    {item.title}
                                                    {item.isPinned && <Pin size={12} className="pinned-icon" />}
                                                </h4>
                                            </div>

                                            <div className="row-actions">
                                                <button
                                                    className="row-view-btn"
                                                    onClick={() => setActiveAnnouncement(item)}
                                                >
                                                    <span>View</span>
                                                    <ChevronRight size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </motion.div>
                            ) : (
                                <div className="compact-no-results">
                                    <AlertCircle size={24} />
                                    <span>No notices matching your filter.</span>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Card Footer Ticker */}
                    <div className="card-footer-strip">
                        <div className="footer-admission-alert">
                            <Sparkles size={14} className="sparkle-icon" />
                            <span><strong>Admissions Open 2026-27</strong> — Nursery to Class XII</span>
                        </div>
                        <a href="#admissions" className="compact-apply-link">
                            Apply Online <ChevronRight size={13} />
                        </a>
                    </div>
                </motion.div>
            </div>

            {/* Premium Full-Screen Modal Pop-out */}
            <AnimatePresence>
                {activeAnnouncement && (
                    <div className="modal-backdrop" onClick={() => setActiveAnnouncement(null)}>
                        <motion.div
                            className="modal-card"
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="modal-top-bar">
                                <div className="modal-meta">
                                    <span className={`badge-chip tag-${activeAnnouncement.category.toLowerCase()}`}>
                                        {activeAnnouncement.badge || 'NOTICE'}
                                    </span>
                                    <span className="modal-date-text">
                                        <Calendar size={13} /> {activeAnnouncement.date}
                                    </span>
                                </div>
                                <button
                                    className="modal-close-btn"
                                    onClick={() => setActiveAnnouncement(null)}
                                    aria-label="Close notification"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <h3 className="modal-title-text">{activeAnnouncement.title}</h3>

                            <div className="modal-body-content">
                                <p>{activeAnnouncement.description}</p>
                            </div>

                            <div className="modal-footer-actions">
                                <button
                                    className="btn btn-primary modal-close-action"
                                    onClick={() => setActiveAnnouncement(null)}
                                >
                                    Close Notice
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </section>
    )
}

export default Announcements
