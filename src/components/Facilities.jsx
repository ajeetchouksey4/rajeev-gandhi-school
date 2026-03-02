import React from 'react'
import { motion } from 'framer-motion'
import { Monitor, FlaskConical, BookMarked, Dumbbell, Laptop, Bus } from 'lucide-react'
import './Facilities.css'

const facilities = [
    { icon: Monitor, title: 'Smart Classrooms', img: 'https://images.unsplash.com/photo-1562774053-701939374585?w=500&q=80', desc: 'Interactive digital boards and projectors for engaging visual learning.' },
    { icon: FlaskConical, title: 'Science Labs', img: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=500&q=80', desc: 'Well-equipped Physics, Chemistry & Biology labs for hands-on experiments.' },
    { icon: BookMarked, title: 'Library', img: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&q=80', desc: 'Extensive collection of books, journals, and digital resources.' },
    { icon: Dumbbell, title: 'Sports Complex', img: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500&q=80', desc: 'Playground, indoor games, basketball court & athletic track.' },
    { icon: Laptop, title: 'Computer Lab', img: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&q=80', desc: 'Modern computer lab with latest hardware, software & internet.' },
    { icon: Bus, title: 'Transport', img: 'https://images.unsplash.com/photo-1557862921-37829c790f19?w=500&q=80', desc: 'Safe and comfortable bus service covering all major routes.' },
]

const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (i) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.1 } }),
}

const Facilities = () => (
    <section className="section facilities" id="facilities">
        <div className="container">
            <motion.div
                className="section-header"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-80px' }}
                variants={fadeInUp}
                custom={0}
            >
                <span className="section-tag">🏫 Infrastructure</span>
                <h2 className="section-title">
                    Our <span className="gradient-text">Facilities</span>
                </h2>
                <p className="section-desc">World-class infrastructure to support the best learning experience.</p>
            </motion.div>

            <div className="facilities-grid">
                {facilities.map((f, i) => {
                    const Icon = f.icon
                    return (
                        <motion.div
                            className="facility-card"
                            key={i}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                            custom={i}
                        >
                            <div className="facility-img">
                                <img src={f.img} alt={f.title} loading="lazy" />
                                <div className="facility-img-overlay" />
                            </div>
                            <div className="facility-info">
                                <div className="facility-icon-wrap">
                                    <Icon size={22} />
                                </div>
                                <h4>{f.title}</h4>
                                <p>{f.desc}</p>
                            </div>
                        </motion.div>
                    )
                })}
            </div>
        </div>
    </section>
)

export default Facilities
