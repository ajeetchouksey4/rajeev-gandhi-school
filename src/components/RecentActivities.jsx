import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Pause, Play, Calendar } from 'lucide-react'
import api from '../api/api'
import './RecentActivities.css'

const defaultActivities = [
    {
        src: 'https://res.cloudinary.com/dzckejmbq/image/upload/v1778142942/trophy1_bz0ht0.jpg',
        title: 'Annual Day Celebration 2026',
        date: 'February 2026',
        desc: 'Students showcased their talents through dance, drama, and music performances.',
    },
    {
        src: 'https://res.cloudinary.com/dzckejmbq/image/upload/v1778142942/trophy3_vrtlrd.jpg',
        title: 'Sports Day Championship',
        date: 'January 2026',
        desc: 'Inter-house sports competition featuring athletics, cricket, and kabaddi.',
    },
    {
        src: 'https://res.cloudinary.com/dzckejmbq/image/upload/v1778130550/lab_sdvj0y.jpg',
        title: 'Science Exhibition',
        date: 'December 2025',
        desc: 'Innovative science projects and working models displayed by students.',
    },
    {
        src: 'https://res.cloudinary.com/dzckejmbq/image/upload/v1778130962/independence5_ku7v2n.jpg',
        title: 'Republic Day Parade',
        date: 'January 2026',
        desc: 'Patriotic celebrations with flag hoisting, march past, and cultural programs.',
    },
]

const slideVariants = {
    enter: (direction) => ({
        x: direction > 0 ? 600 : -600,
        opacity: 0,
        scale: 0.95,
    }),
    center: {
        x: 0,
        opacity: 1,
        scale: 1,
        transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
    },
    exit: (direction) => ({
        x: direction > 0 ? -600 : 600,
        opacity: 0,
        scale: 0.95,
        transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
    }),
}

const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

const RecentActivities = () => {
    const [activitiesList, setActivitiesList] = useState(defaultActivities)
    const [current, setCurrent] = useState(0)
    const [direction, setDirection] = useState(1)
    const [isPlaying, setIsPlaying] = useState(true)
    const [isHovered, setIsHovered] = useState(false)

    const fetchHighlights = async () => {
        try {
            const res = await api.get('/gallery')
            const data = await res.json()
            if (Array.isArray(data)) {
                const highlightItems = data.filter(item => item.section === 'HIGHLIGHTS')
                if (highlightItems.length > 0) {
                    const mapped = highlightItems.map(item => ({
                        src: item.imageUrl,
                        title: item.title,
                        date: item.category || 'Recent Event',
                        desc: item.title + ' at Rajeev Gandhi Convent School.'
                    }))
                    setActivitiesList(mapped)
                    return
                }
            }
        } catch (err) {
            console.warn('Backend fetch for highlights failed, checking local storage:', err.message)
        }

        const saved = localStorage.getItem('rg_gallery')
        if (saved) {
            try {
                const parsed = JSON.parse(saved)
                const highlightItems = parsed.filter(item => item.section === 'HIGHLIGHTS')
                if (highlightItems.length > 0) {
                    const mapped = highlightItems.map(item => ({
                        src: item.imageUrl,
                        title: item.title,
                        date: item.category || 'Recent Event',
                        desc: item.title + ' at Rajeev Gandhi Convent School.'
                    }))
                    setActivitiesList(mapped)
                    return
                }
            } catch (e) {
                console.error(e)
            }
        }
        setActivitiesList(defaultActivities)
    }

    useEffect(() => {
        fetchHighlights()

        const handleStorageChange = () => fetchHighlights()
        window.addEventListener('storage', handleStorageChange)
        window.addEventListener('rg_gallery_updated', handleStorageChange)
        return () => {
            window.removeEventListener('storage', handleStorageChange)
            window.removeEventListener('rg_gallery_updated', handleStorageChange)
        }
    }, [])

    const total = activitiesList.length

    const goTo = useCallback((index, dir) => {
        setDirection(dir)
        setCurrent(index)
    }, [])

    const next = useCallback(() => {
        if (total > 0) goTo((current + 1) % total, 1)
    }, [current, total, goTo])

    const prev = useCallback(() => {
        if (total > 0) goTo((current - 1 + total) % total, -1)
    }, [current, total, goTo])

    // Auto-play
    useEffect(() => {
        if (!isPlaying || isHovered || total === 0) return
        const timer = setInterval(next, 4000)
        return () => clearInterval(timer)
    }, [isPlaying, isHovered, next, total])

    if (total === 0) return null

    const safeCurrent = current < total ? current : 0

    return (
        <section className="section recent-activities" id="activities">
            <div className="container">
                <motion.div
                    className="section-header"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-80px' }}
                    variants={fadeInUp}
                >
                    <span className="section-tag">🎉 Recent Activities</span>
                    <h2 className="section-title">
                        School <span className="gradient-text">Highlights</span>
                    </h2>
                    <p className="section-desc">
                        Glimpses from our recent events, celebrations, and achievements.
                    </p>
                </motion.div>

                <motion.div
                    className="carousel"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <div className="carousel-viewport">
                        <AnimatePresence initial={false} custom={direction} mode="wait">
                            <motion.div
                                key={safeCurrent}
                                className="carousel-slide"
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                            >
                                <div className="slide-image-wrapper">
                                    <img
                                        src={activitiesList[safeCurrent].src}
                                        alt={activitiesList[safeCurrent].title}
                                        loading="lazy"
                                    />
                                    <div className="slide-gradient" />
                                </div>
                                <div className="slide-info">
                                    <div className="slide-date">
                                        <Calendar size={14} />
                                        <span>{activitiesList[safeCurrent].date}</span>
                                    </div>
                                    <h3 className="slide-title">{activitiesList[safeCurrent].title}</h3>
                                    <p className="slide-desc">{activitiesList[safeCurrent].desc}</p>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Navigation arrows */}
                    <button className="carousel-btn carousel-btn-prev" onClick={prev} aria-label="Previous slide">
                        <ChevronLeft size={22} />
                    </button>
                    <button className="carousel-btn carousel-btn-next" onClick={next} aria-label="Next slide">
                        <ChevronRight size={22} />
                    </button>

                    {/* Bottom controls */}
                    <div className="carousel-controls">
                        <div className="carousel-dots">
                            {activitiesList.map((_, i) => (
                                <button
                                    key={i}
                                    className={`carousel-dot ${i === safeCurrent ? 'active' : ''}`}
                                    onClick={() => goTo(i, i > safeCurrent ? 1 : -1)}
                                    aria-label={`Go to slide ${i + 1}`}
                                />
                            ))}
                        </div>
                        <button
                            className="carousel-play-btn"
                            onClick={() => setIsPlaying(!isPlaying)}
                            aria-label={isPlaying ? 'Pause carousel' : 'Play carousel'}
                        >
                            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                        </button>
                    </div>

                    {/* Progress bar */}
                    <div className="carousel-progress">
                        <motion.div
                            className="carousel-progress-bar"
                            key={`progress-${safeCurrent}-${isPlaying}`}
                            initial={{ width: '0%' }}
                            animate={{ width: isPlaying && !isHovered ? '100%' : '0%' }}
                            transition={{ duration: isPlaying && !isHovered ? 4 : 0, ease: 'linear' }}
                        />
                    </div>
                </motion.div>

                {/* Thumbnail strip */}
                <motion.div
                    className="carousel-thumbnails"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                >
                    {activitiesList.map((act, i) => (
                        <button
                            key={i}
                            className={`thumbnail ${i === safeCurrent ? 'active' : ''}`}
                            onClick={() => goTo(i, i > safeCurrent ? 1 : -1)}
                        >
                            <img src={act.src} alt={act.title} loading="lazy" />
                            <span className="thumbnail-label">{act.title}</span>
                        </button>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}

export default RecentActivities
