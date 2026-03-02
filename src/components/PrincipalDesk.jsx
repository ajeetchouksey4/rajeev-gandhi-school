import React from 'react'
import { motion } from 'framer-motion'
import { Quote, Feather } from 'lucide-react'
import './PrincipalDesk.css'

const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.15 } }),
}

const fadeInLeft = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: 'easeOut' } },
}

const fadeInRight = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.7, delay: 0.2, ease: 'easeOut' } },
}

const PrincipalDesk = () => {
    return (
        <section className="section principal-desk" id="principal-desk">
            {/* Decorative Elements */}
            <div className="pd-ornament pd-ornament-1" />
            <div className="pd-ornament pd-ornament-2" />
            <div className="pd-pattern-bg" />

            <div className="container">
                <motion.div
                    className="section-header"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-80px' }}
                    variants={fadeInUp}
                >
                    <span className="section-tag">
                        <Feather size={14} />
                        Principal's Message
                    </span>
                    <h2 className="section-title">
                        From The <span className="gradient-text">Principal's Desk</span>
                    </h2>
                </motion.div>

                <div className="pd-layout">
                    {/* Principal Image Card */}
                    <motion.div
                        className="pd-image-card"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-80px' }}
                        variants={fadeInLeft}
                    >
                        <div className="pd-image-wrapper">
                            <div className="pd-image-frame">
                                <img
                                    src="/principal.png"
                                    alt="School Principal"
                                    loading="lazy"
                                />
                            </div>
                            <div className="pd-image-accent" />
                        </div>
                        <div className="pd-name-plate">
                            <h3 className="pd-name">Principal Name</h3>
                            <p className="pd-designation">Principal</p>
                            <p className="pd-school-name">Rajeev Gandhi Convent Hr. Sec. School</p>
                        </div>
                        <div className="pd-decorative-line" />
                    </motion.div>

                    {/* Message Content */}
                    <motion.div
                        className="pd-message-card"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-80px' }}
                        variants={fadeInRight}
                    >
                        <div className="pd-quote-icon">
                            <Quote size={32} />
                        </div>

                        <div className="pd-message-content">
                            <p className="pd-message-text">
                                शिक्षा पाठ्यपुस्तकों तक ही सीमित नहीं है; यह चरित्र निर्माण और मूल्यों के विकास की यात्रा है जो जीवन में हमारा मार्गदर्शन करती है। ज्ञान हमें सशक्त बनाता है, लेकिन मूल्य दिशा प्रदान करते हैं। इनके बिना, सबसे प्रतिभाशाली बुद्धि भी लड़खड़ा सकती है।
                            </p>

                            <p className="pd-message-text">
                                हमारे महाकाव्य हमें इस शाश्वत सत्य की याद दिलाते हैं। रामायण में मर्यादा पुरूषोत्तम के रूप में पूजनीय भगवान राम ने सत्य और कर्तव्य को व्यक्तिगत आराम से ऊपर रखा। एक कालजयी श्लोक सिखाता है:
                            </p>

                            <blockquote className="pd-shlok">
                                <p className="pd-shlok-text">
                                    "सत्यं ब्रूयात् प्रियं ब्रूयात्, न ब्रूयात् सत्यमप्रियम्।"
                                </p>
                                <p className="pd-shlok-text">
                                    प्रियं च नानृतं ब्रुयात्, एष धर्मः सनातनः॥"
                                </p>
                                <p className="pd-shlok-translation">
                                    (सत्य को सुखद ढंग से बोलें; कभी भी दुखद सत्य न बोलें, और कभी भी मीठा झूठ न बोलें। यह शाश्वत कर्तव्य है।)
                                </p>
                            </blockquote>
                        </div>

                        <div className="pd-closing-quote">
                            <Quote size={24} />
                        </div>

                        <div className="pd-signature">
                            <div className="pd-signature-line" />
                            <span>— Principal, Rajeev Gandhi Convent Hr. Sec. School</span>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

export default PrincipalDesk
