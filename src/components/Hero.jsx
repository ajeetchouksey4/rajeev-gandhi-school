import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Rocket, ChevronDown, Award } from 'lucide-react'
import './Hero.css'

const stats = [
    { value: 1500, suffix: '+', label: 'Students' },
    { value: 85, suffix: '+', label: 'Teachers' },
    { value: 20, suffix: '+', label: 'Years' },
    { value: 98, suffix: '%', label: 'Result Rate' },
]

const Counter = ({ target, suffix }) => {
    const [count, setCount] = useState(0)
    const ref = useRef(null)
    const animated = useRef(false)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !animated.current) {
                    animated.current = true
                    const duration = 2000
                    const startTime = performance.now()
                    const tick = (now) => {
                        const elapsed = now - startTime
                        const progress = Math.min(elapsed / duration, 1)
                        const eased = 1 - Math.pow(1 - progress, 3)
                        setCount(Math.floor(target * eased))
                        if (progress < 1) requestAnimationFrame(tick)
                    }
                    requestAnimationFrame(tick)
                }
            },
            { threshold: 0.5 }
        )
        if (ref.current) observer.observe(ref.current)
        return () => observer.disconnect()
    }, [target])

    return (
        <span ref={ref} className="stat-number">
            {count}<span className="stat-suffix">{suffix}</span>
        </span>
    )
}

const Hero = () => {
    const scrollToAbout = () => {
        const el = document.getElementById('about')
        if (el) el.scrollIntoView({ behavior: 'smooth' })
    }

    const scrollToAdmissions = () => {
        const el = document.getElementById('admissions')
        if (el) el.scrollIntoView({ behavior: 'smooth' })
    }

    return (
        <section className="hero" id="home">
            {/* Soft decorative shapes */}
            <div className="hero-shape hero-shape-1" />
            <div className="hero-shape hero-shape-2" />
            <div className="hero-shape hero-shape-3" />

            <div className="container hero-content">
                <motion.h1
                    className="hero-title"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    Rajeev Gandhi Convent
                    <br />
                    <span className="hero-gradient-text">Higher Secondary School</span>
                </motion.h1>

                <motion.div
                    className="hero-badge"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.35 }}
                >
                    <Award size={16} />
                    <span>MPBSE Affiliated · Estd. 2001</span>
                </motion.div>

                <motion.p
                    className="hero-subtitle"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                >
                    Nurturing young minds from Nursery to Class 12th with excellence
                    in education, character building & holistic development.
                </motion.p>

                <motion.div
                    className="hero-actions"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                >
                    <button className="btn btn-primary" onClick={scrollToAdmissions}>
                        <Rocket size={18} />
                        Apply for Admission
                    </button>
                    <button className="btn btn-outline" onClick={scrollToAbout}>
                        Explore More
                    </button>
                </motion.div>

                <motion.div
                    className="hero-stats"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.9 }}
                >
                    {stats.map((stat, i) => (
                        <div className="stat-item" key={i}>
                            <Counter target={stat.value} suffix={stat.suffix} />
                            <span className="stat-label">{stat.label}</span>
                        </div>
                    ))}
                </motion.div>
            </div>

            <div className="hero-scroll" onClick={scrollToAbout}>
                <ChevronDown size={28} />
            </div>
        </section>
    )
}

export default Hero
