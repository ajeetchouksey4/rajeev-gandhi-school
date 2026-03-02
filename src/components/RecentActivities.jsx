import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Pause, Play, Calendar } from 'lucide-react'
import './RecentActivities.css'

const activities = [
    {
        src: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=1200&q=80',
        title: 'Annual Day Celebration 2026',
        date: 'February 2026',
        desc: 'Students showcased their talents through dance, drama, and music performances.',
    },
    {
        src: 'https://images.unsplash.com/photo-1540479859555-17af45c78602?w=1200&q=80',
        title: 'Sports Day Championship',
        date: 'January 2026',
        desc: 'Inter-house sports competition featuring athletics, cricket, and kabaddi.',
    },
    {
        src: 'https://images.unsplash.com/photo-1588072432836-e10032774350?w=1200&q=80',
        title: 'Science Exhibition',
        date: 'December 2025',
        desc: 'Innovative science projects and working models displayed by students.',
    },
    {
        src: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=1200&q=80',
        title: 'Republic Day Parade',
        date: 'January 2026',
        desc: 'Patriotic celebrations with flag hoisting, march past, and cultural programs.',
    },
    {
        src: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&q=80',
        title: 'Reading Week Campaign',
        date: 'November 2025',
        desc: 'Week-long reading initiatives to promote literacy and love for books.',
    },
    {
        src: 'https://images.unsplash.com/photo-1523050854058-8df90110c476?w=1200&q=80',
        title: 'Art & Craft Workshop',
        date: 'October 2025',
        desc: 'Creative workshop where students explored painting, origami, and clay art.',
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
    const [current, setCurrent] = useState(0)
    const [direction, setDirection] = useState(1)
    const [isPlaying, setIsPlaying] = useState(true)
    const [isHovered, setIsHovered] = useState(false)

    const total = activities.length

    const goTo = useCallback((index, dir) => {
        setDirection(dir)
        setCurrent(index)
    }, [])

    const next = useCallback(() => {
        goTo((current + 1) % total, 1)
    }, [current, total, goTo])

    const prev = useCallback(() => {
        goTo((current - 1 + total) % total, -1)
    }, [current, total, goTo])

    // Auto-play
    useEffect(() => {
        if (!isPlaying || isHovered) return
        const timer = setInterval(next, 4000)
        return () => clearInterval(timer)
    }, [isPlaying, isHovered, next])

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
                                key={current}
                                className="carousel-slide"
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                            >
                                <div className="slide-image-wrapper">
                                    <img
                                        src={activities[current].src}
                                        alt={activities[current].title}
                                        loading="lazy"
                                    />
                                    <div className="slide-gradient" />
                                </div>
                                <div className="slide-info">
                                    <div className="slide-date">
                                        <Calendar size={14} />
                                        <span>{activities[current].date}</span>
                                    </div>
                                    <h3 className="slide-title">{activities[current].title}</h3>
                                    <p className="slide-desc">{activities[current].desc}</p>
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
                            {activities.map((_, i) => (
                                <button
                                    key={i}
                                    className={`carousel-dot ${i === current ? 'active' : ''}`}
                                    onClick={() => goTo(i, i > current ? 1 : -1)}
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
                            key={`progress-${current}-${isPlaying}`}
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
                    {activities.map((act, i) => (
                        <button
                            key={i}
                            className={`thumbnail ${i === current ? 'active' : ''}`}
                            onClick={() => goTo(i, i > current ? 1 : -1)}
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
