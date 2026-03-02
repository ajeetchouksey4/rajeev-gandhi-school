import React from 'react'
import { motion } from 'framer-motion'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import './Contact.css'

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

            {/* Address + Map side by side */}
            <div className="contact-top-row">
                <motion.div
                    className="glass-card contact-card contact-address-card"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                    custom={0}
                >
                    <div className="contact-icon">
                        <MapPin size={24} />
                    </div>
                    <h4>Address</h4>
                    <p>Rajeev Gandhi Convent HSS</p>
                    <p>Main Road, Near Bus Stand</p>
                    <p>Madhya Pradesh, India</p>
                    <a
                        href="https://share.google/8MTwNACe0qiyxSTnr"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="map-link"
                    >
                        Open in Google Maps →
                    </a>
                </motion.div>

                <motion.div
                    className="contact-map"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-80px' }}
                    variants={fadeInUp}
                    custom={1}
                >
                    <div className="map-wrapper">
                        <iframe
                            title="Rajeev Gandhi Convent Higher Secondary School Location"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3666.0!2d77.43272!3d23.18894!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDExJzIwLjIiTiA3N8KwMjUnNTcuOCJF!5e0!3m2!1sen!2sin!4v1700000000000"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    </div>
                </motion.div>
            </div>

            {/* Phone, Email, Timings row */}
            <div className="contact-bottom-row">
                <motion.div
                    className="glass-card contact-card"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                    custom={0}
                >
                    <div className="contact-icon">
                        <Phone size={24} />
                    </div>
                    <h4>Phone</h4>
                    <p>+91 9993112923</p>
                    <p>+91 7987882708</p>
                </motion.div>

                <motion.div
                    className="glass-card contact-card"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                    custom={1}
                >
                    <div className="contact-icon">
                        <Mail size={24} />
                    </div>
                    <h4>Email</h4>
                    <p>info@rgchss.edu.in</p>
                    <p>admissions@rgchss.edu.in</p>
                </motion.div>

                <motion.div
                    className="glass-card contact-card"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                    custom={2}
                >
                    <div className="contact-icon">
                        <Clock size={24} />
                    </div>
                    <h4>Timings</h4>
                    <p>Mon – Sat: 10:30 AM – 4:30 PM</p>
                    <p>Office: 11:00 AM – 1:00 PM</p>
                </motion.div>
            </div>
        </div>
    </section>
)

export default Contact
