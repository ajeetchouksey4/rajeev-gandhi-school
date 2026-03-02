import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import './Testimonials.css'

const testimonials = [
    {
        text: "The school has transformed my child's confidence. The teachers are supportive, and the overall environment is excellent for learning and growth.",
        name: 'Rakesh Sharma',
        role: 'Parent of Class 8 Student',
        initials: 'RS',
    },
    {
        text: 'We are thrilled with the academic results and the co-curricular opportunities. My daughter scored 95% in her board exams. Highly recommended!',
        name: 'Priya Singh',
        role: 'Parent of Class 10 Student',
        initials: 'PS',
    },
    {
        text: 'Safe campus, dedicated teachers, and modern facilities — everything a parent looks for. My son loves going to school every day!',
        name: 'Amit Kumar',
        role: 'Parent of Class 5 Student',
        initials: 'AK',
    },
    {
        text: 'The holistic approach to education here is commendable. My children have excelled in academics and sports alike.',
        name: 'Sunita Patel',
        role: 'Parent of Class 12 Student',
        initials: 'SP',
    },
]

const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

const Testimonials = () => {
    const [current, setCurrent] = useState(0)
    const intervalRef = useRef(null)

    const next = () => setCurrent((prev) => (prev + 1) % testimonials.length)
    const prev = () => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length)

    useEffect(() => {
        intervalRef.current = setInterval(next, 5000)
        return () => clearInterval(intervalRef.current)
    }, [])

    const resetInterval = () => {
        clearInterval(intervalRef.current)
        intervalRef.current = setInterval(next, 5000)
    }

    return (
        <section className="section testimonials">
            <div className="container">
                <motion.div
                    className="section-header"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-80px' }}
                    variants={fadeInUp}
                >
                    <span className="section-tag">💬 Testimonials</span>
                    <h2 className="section-title">
                        What Parents <span className="gradient-text">Say</span>
                    </h2>
                </motion.div>

                <motion.div
                    className="testimonial-carousel"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                >
                    <div className="testimonial-track">
                        {testimonials.map((t, i) => (
                            <div
                                className={`glass-card testimonial-card ${i === current ? 'active' : ''}`}
                                key={i}
                                style={{
                                    transform: `translateX(${(i - current) * 110}%)`,
                                    opacity: i === current ? 1 : 0.3,
                                    scale: i === current ? '1' : '0.9',
                                }}
                            >
                                <Quote size={32} className="quote-icon" />
                                <p className="testimonial-text">{t.text}</p>
                                <div className="testimonial-author">
                                    <div className="author-avatar">{t.initials}</div>
                                    <div>
                                        <strong>{t.name}</strong>
                                        <span>{t.role}</span>
                                    </div>
                                </div>
                                <div className="testimonial-stars">★★★★★</div>
                            </div>
                        ))}
                    </div>

                    <div className="testimonial-controls">
                        <button className="carousel-btn" onClick={() => { prev(); resetInterval(); }} aria-label="Previous">
                            <ChevronLeft size={20} />
                        </button>
                        <div className="carousel-dots">
                            {testimonials.map((_, i) => (
                                <button
                                    key={i}
                                    className={`dot ${i === current ? 'active' : ''}`}
                                    onClick={() => { setCurrent(i); resetInterval(); }}
                                    aria-label={`Go to testimonial ${i + 1}`}
                                />
                            ))}
                        </div>
                        <button className="carousel-btn" onClick={() => { next(); resetInterval(); }} aria-label="Next">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}

export default Testimonials
