import React from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Users, Heart, ShieldCheck, Eye, Target, Gem } from 'lucide-react'
import './About.css'

const features = [
    { icon: BookOpen, title: 'Quality Education', desc: 'MPBSE-aligned curriculum with innovative teaching' },
    { icon: Users, title: 'Expert Faculty', desc: 'Highly qualified & experienced teaching staff' },
    { icon: Heart, title: 'Holistic Growth', desc: 'Focus on academics, sports & extracurricular' },
    { icon: ShieldCheck, title: 'Safe Campus', desc: 'Secure environment with CCTV surveillance' },
]

const visionCards = [
    { icon: Eye, title: 'Our Vision', desc: 'To be a center of excellence that nurtures responsible citizens equipped with knowledge, skills, and values to lead and contribute meaningfully to society.' },
    { icon: Target, title: 'Our Mission', desc: 'To provide high-quality, inclusive education that fosters creativity, critical thinking, and character development while preparing students for a dynamic world.' },
    { icon: Gem, title: 'Our Values', desc: 'Integrity, discipline, respect, excellence, and compassion form the core pillars guiding our educational philosophy and community interactions.' },
]

const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.15 } }),
}

const About = () => {
    return (
        <>
            <section className="section about" id="about">
                <div className="about-glow about-glow-1" />
                <div className="container">
                    <motion.div
                        className="section-header"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-80px' }}
                        variants={fadeInUp}
                    >
                        <span className="section-tag">Who We Are</span>
                        <h2 className="section-title">
                            About <span className="gradient-text">Our School</span>
                        </h2>
                        <p className="section-desc">Building a foundation for lifelong learning and success since 2005.</p>
                    </motion.div>

                    <div className="about-grid">
                        <motion.div
                            className="about-image"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: '-80px' }}
                            variants={fadeInUp}
                        >
                            <img
                                src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=700&q=80"
                                alt="School campus"
                                loading="lazy"
                            />
                            <div className="about-image-badge">
                                <span className="badge-number">20+</span>
                                <span className="badge-text">Years of Excellence</span>
                            </div>
                            <div className="about-image-glow" />
                        </motion.div>

                        <div className="about-content">
                            <motion.h3
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={fadeInUp}
                            >
                                Empowering Students for a Brighter Future
                            </motion.h3>

                            <motion.p
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={fadeInUp}
                                custom={1}
                            >
                                Rajiv Gandhi Convent Higher Secondary School, affiliated with the <strong>Madhya Pradesh Board of Secondary Education (MPBSE)</strong>, is a premier educational institution offering comprehensive education from <strong>Nursery to Class 12th</strong>.
                            </motion.p>

                            <motion.p
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={fadeInUp}
                                custom={2}
                            >
                                Our school blends traditional values with modern teaching methodologies, ensuring every child develops intellectually, morally, and physically. With a dedicated team of experienced educators and state-of-the-art facilities, we create an environment where students thrive.
                            </motion.p>

                            <div className="about-features">
                                {features.map((f, i) => (
                                    <motion.div
                                        className="about-feature"
                                        key={i}
                                        initial="hidden"
                                        whileInView="visible"
                                        viewport={{ once: true }}
                                        variants={fadeInUp}
                                        custom={i + 2}
                                    >
                                        <div className="feature-icon">
                                            <f.icon size={20} />
                                        </div>
                                        <div>
                                            <strong>{f.title}</strong>
                                            <p>{f.desc}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Vision / Mission */}
            <section className="section vision-mission">
                <div className="container">
                    <div className="vm-grid">
                        {visionCards.map((card, i) => (
                            <motion.div
                                className="glass-card vm-card"
                                key={i}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={fadeInUp}
                                custom={i}
                            >
                                <div className="vm-icon">
                                    <card.icon size={28} />
                                </div>
                                <h3>{card.title}</h3>
                                <p>{card.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    )
}

export default About
