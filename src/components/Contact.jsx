import React from 'react'
import { motion } from 'framer-motion'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import './Contact.css'

const contacts = [
    { icon: MapPin, title: 'Address', lines: ['Rajiv Gandhi Convent HSS', 'Main Road, Near Bus Stand', 'Madhya Pradesh, India'] },
    { icon: Phone, title: 'Phone', lines: ['+91 98260 XXXXX', '+91 75090 XXXXX'] },
    { icon: Mail, title: 'Email', lines: ['info@rgchss.edu.in', 'admissions@rgchss.edu.in'] },
    { icon: Clock, title: 'Timings', lines: ['Mon – Sat: 8:00 AM – 2:30 PM', 'Office: 9:00 AM – 4:00 PM'] },
]

const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.12 } }),
}

const Contact = () => (
    <section className="section contact" id="contact">
        <div className="container">
            <motion.div
                className="section-header"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-80px' }}
                variants={fadeInUp}
            >
                <span className="section-tag">📡 Get in Touch</span>
                <h2 className="section-title">
                    Contact <span className="gradient-text">Us</span>
                </h2>
            </motion.div>

            <div className="contact-grid">
                {contacts.map((c, i) => {
                    const Icon = c.icon
                    return (
                        <motion.div
                            className="glass-card contact-card"
                            key={i}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                            custom={i}
                        >
                            <div className="contact-icon">
                                <Icon size={24} />
                            </div>
                            <h4>{c.title}</h4>
                            {c.lines.map((line, j) => (
                                <p key={j}>{line}</p>
                            ))}
                        </motion.div>
                    )
                })}
            </div>
        </div>
    </section>
)

export default Contact
