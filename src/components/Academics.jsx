import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Baby, BookOpen, Library, Award, GraduationCap, Trophy } from 'lucide-react'
import './Academics.css'

const programs = [
    {
        icon: Baby,
        title: 'Pre-Primary',
        classes: 'Nursery · LKG · UKG',
        color: '#f59e0b',
        desc: 'Play-based learning with focus on motor skills, language development, and social interaction in a nurturing environment.',
        features: ['Activity-based learning', 'Montessori approach', 'Creative arts & stories'],
    },
    {
        icon: BookOpen,
        title: 'Primary',
        classes: 'Class 1 to 5',
        color: '#10b981',
        desc: 'Building strong fundamentals in languages, mathematics, science, and social studies with hands-on activities.',
        features: ['MPBSE curriculum', 'Smart classrooms', 'Regular assessments'],
    },
    {
        icon: Library,
        title: 'Middle School',
        classes: 'Class 6 to 8',
        color: '#6366f1',
        desc: 'Deepening knowledge with specialized subjects, lab practicals, and project-based learning methodologies.',
        features: ['Science & computer labs', 'Competitive exam prep', 'Personality development'],
    },
    {
        icon: Award,
        title: 'Secondary',
        classes: 'Class 9 & 10',
        color: '#ec4899',
        desc: 'Intensive board exam preparation with focused coaching, regular tests, and career counseling sessions.',
        features: ['Board exam preparation', 'Career guidance', 'Extra coaching classes'],
    },
    {
        icon: GraduationCap,
        title: 'Higher Secondary',
        classes: 'Class 11 & 12',
        color: '#8b5cf6',
        desc: 'Specialized streams — Science, Commerce & Arts — with expert faculty and modern labs for practical excellence.',
        features: ['Science / Commerce / Arts', 'JEE / NEET guidance', 'Advanced laboratories'],
    },
    {
        icon: Trophy,
        title: 'Co-Curricular',
        classes: 'All Classes',
        color: '#14b8a6',
        desc: 'Sports, arts, music, dance, debate, and various clubs to develop well-rounded personalities.',
        features: ['Sports & athletics', 'Cultural programs', 'Science & tech clubs'],
    },
]

const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.1 } }),
}

const Academics = () => {
    const [hovered, setHovered] = useState(null)

    return (
        <section className="section academics" id="academics">
            <div className="container">
                <motion.div
                    className="section-header"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-80px' }}
                    variants={fadeInUp}
                >
                    <span className="section-tag">🎓 Our Programs</span>
                    <h2 className="section-title">
                        Academic <span className="gradient-text">Programs</span>
                    </h2>
                    <p className="section-desc">Comprehensive education designed for every stage of a child's growth.</p>
                </motion.div>

                <div className="academics-grid">
                    {programs.map((prog, i) => {
                        const Icon = prog.icon
                        return (
                            <motion.div
                                className={`glass-card academic-card ${hovered === i ? 'hovered' : ''}`}
                                key={i}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={fadeInUp}
                                custom={i}
                                onMouseEnter={() => setHovered(i)}
                                onMouseLeave={() => setHovered(null)}
                                style={{ '--card-accent': prog.color }}
                            >
                                <div className="academic-accent-line" />
                                <div className="academic-icon">
                                    <Icon size={26} />
                                </div>
                                <h3>{prog.title}</h3>
                                <span className="academic-classes">{prog.classes}</span>
                                <p>{prog.desc}</p>
                                <ul>
                                    {prog.features.map((f, j) => (
                                        <li key={j}>
                                            <span className="check">✓</span> {f}
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}

export default Academics
