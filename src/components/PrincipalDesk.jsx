import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Quote, Feather, BookOpen, X } from 'lucide-react'
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
    const [isModalOpen, setIsModalOpen] = useState(false)

    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => { document.body.style.overflow = '' }
    }, [isModalOpen])

    return (
        <>
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

                    <div className="pd-card-wrapper">
                        {/* Unified Card */}
                        <div className="pd-main-card">
                            {/* Left — Principal Photo Area */}
                            <motion.div
                                className="pd-photo-section"
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: '-80px' }}
                                variants={fadeInLeft}
                            >
                                <div className="pd-photo-container">
                                    <div className="pd-photo-frame">
                                        <img
                                            src="/principal.png"
                                            alt="Deendayal Chouksey - Principal"
                                            loading="lazy"
                                        />
                                    </div>
                                    <div className="pd-photo-ring" />
                                    <div className="pd-photo-dots" />
                                </div>

                                <div className="pd-info">
                                    <h3 className="pd-name">Deendayal Chouksey</h3>
                                    <div className="pd-title-badge">
                                        <span>Principal</span>
                                    </div>
                                    <p className="pd-school-label">Rajeev Gandhi Convent<br />Hr. Sec. School</p>
                                    <div className="pd-info-divider" />
                                    <p className="pd-quote-small">"शिक्षा ही सबसे शक्तिशाली हथियार है"</p>
                                </div>
                            </motion.div>

                            {/* Right — Message Area */}
                            <motion.div
                                className="pd-message-section"
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: '-80px' }}
                                variants={fadeInRight}
                            >
                                <div className="pd-msg-quote-icon">
                                    <Quote size={28} />
                                </div>

                                <div className="pd-msg-body">
                                    <p className="pd-msg-text">
                                        शिक्षा पाठ्यपुस्तकों तक ही सीमित नहीं है; यह चरित्र निर्माण और मूल्यों के विकास की यात्रा है जो जीवन में हमारा मार्गदर्शन करती है। ज्ञान हमें सशक्त बनाता है, लेकिन मूल्य दिशा प्रदान करते हैं। इनके बिना, सबसे प्रतिभाशाली बुद्धि भी लड़खड़ा सकती है।
                                    </p>

                                    <p className="pd-msg-text">
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

                                <div className="pd-msg-footer">
                                    <button
                                        className="pd-read-btn"
                                        onClick={() => setIsModalOpen(true)}
                                    >
                                        <BookOpen size={17} />
                                        <span>Read Full Message</span>
                                        <div className="pd-btn-shimmer" />
                                    </button>
                                    <div className="pd-msg-signature">
                                        <span className="pd-sig-dash" />
                                        <span className="pd-sig-text">Deendayal Chouksey</span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Full Message Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        className="pd-modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={() => setIsModalOpen(false)}
                    >
                        <motion.div
                            className="pd-modal"
                            initial={{ opacity: 0, scale: 0.92, y: 40 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.92, y: 40 }}
                            transition={{ duration: 0.35, ease: 'easeOut' }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="pd-modal-header">
                                <div className="pd-modal-header-left">
                                    <div className="pd-modal-avatar">
                                        <img src="/principal.png" alt="Deendayal Chouksey" />
                                    </div>
                                    <div>
                                        <h3 className="pd-modal-title">Deendayal Chouksey</h3>
                                        <p className="pd-modal-subtitle">Principal · Rajeev Gandhi Convent Hr. Sec. School</p>
                                    </div>
                                </div>
                                <button
                                    className="pd-modal-close"
                                    onClick={() => setIsModalOpen(false)}
                                    aria-label="Close message"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="pd-modal-body">
                                <div className="pd-modal-quote-mark">
                                    <Quote size={40} />
                                </div>

                                <p className="pd-modal-text">
                                    शिक्षा पाठ्यपुस्तकों तक ही सीमित नहीं है; यह चरित्र निर्माण और मूल्यों के विकास की यात्रा है जो जीवन में हमारा मार्गदर्शन करती है। ज्ञान हमें सशक्त बनाता है, लेकिन मूल्य दिशा प्रदान करते हैं। इनके बिना, सबसे प्रतिभाशाली बुद्धि भी लड़खड़ा सकती है।
                                </p>

                                <p className="pd-modal-text">
                                    हमारे महाकाव्य हमें इस शाश्वत सत्य की याद दिलाते हैं। रामायण में मर्यादा पुरूषोत्तम के रूप में पूजनीय भगवान राम ने सत्य और कर्तव्य को व्यक्तिगत आराम से ऊपर रखा। एक कालजयी श्लोक सिखाता है:
                                </p>

                                <blockquote className="pd-modal-shlok">
                                    <p className="pd-modal-shlok-text">
                                        "सत्यं ब्रूयात् प्रियं ब्रूयात्, न ब्रूयात् सत्यमप्रियम्।"
                                    </p>
                                    <p className="pd-modal-shlok-text">
                                        प्रियं च नानृतं ब्रुयात्, एष धर्मः सनातनः॥"
                                    </p>
                                    <p className="pd-modal-shlok-translation">
                                        (सत्य को सुखद ढंग से बोलें; कभी भी दुखद सत्य न बोलें, और कभी भी मीठा झूठ न बोलें। यह शाश्वत कर्तव्य है।)
                                    </p>
                                </blockquote>

                                <p className="pd-modal-text">
                                    इससे यह बात स्पष्ट होती है कि सत्य को दयालुता के साथ प्रस्तुत करना आवश्यक है। स्कूली जीवन में, इसका अर्थ है काम में ईमानदारी, वाणी में आदर और आचरण में सत्यनिष्ठा।
                                </p>

                                <p className="pd-modal-text">
                                    महाभारत आगे इस बात पर बल देता है:
                                </p>

                                <blockquote className="pd-modal-shlok pd-modal-shlok-small">
                                    <p className="pd-modal-shlok-text">"अहिंसा परमो धर्मः।"</p>
                                    <p className="pd-modal-shlok-translation">(अहिंसा सर्वोच्च कर्तव्य है।)</p>
                                </blockquote>

                                <p className="pd-modal-text">
                                    अहिंसा का अर्थ केवल शारीरिक संघर्ष से बचना ही नहीं है; इसमें मतभेदों का सम्मान करना, असहमति को शांतिपूर्ण ढंग से सुलझाना और शब्दों का सावधानीपूर्वक प्रयोग करना भी शामिल है।
                                </p>

                                <p className="pd-modal-text">
                                    इतिहास इन शिक्षाओं को पुष्ट करता है। फील्ड मार्शल सैम मानेकशॉ ने 1971 के युद्ध के दौरान सैनिकों के जीवन को जोखिम में डालने से इनकार करके साहस और उत्तरदायित्व का परिचय दिया। भारत के पहले कमांडर-इन-चीफ जनरल के. एम. करियप्पा ने 1965 के युद्ध में अपने बेटे के बंदी बनाए जाने पर निष्पक्षता का समर्थन किया और इस बात पर जोर दिया कि उसके साथ अन्य सभी युद्धबंदियों की तरह ही व्यवहार किया जाए। वैश्विक स्तर पर, जनरल ड्वाइट आइजनहावर ने डी-डे ऑपरेशन से पहले विफलता की स्थिति में पूरी जिम्मेदारी स्वीकार की थी—यह दर्शाते हुए कि सच्चा नेतृत्व जवाबदेही से परिभाषित होता है।
                                </p>

                                <p className="pd-modal-text">
                                    ये उदाहरण इस बात की पुष्टि करते हैं कि महानता केवल शक्ति में ही नहीं, बल्कि ईमानदारी, निष्पक्षता और करुणा में भी निहित है।
                                </p>

                                <p className="pd-modal-text">
                                    हमारे विद्यालय में, मूल्यों का पोषण केवल पाठों में ही नहीं, बल्कि दैनिक कार्यों में भी होता है—सहपाठियों की मदद करना, अन्याय के विरुद्ध खड़ा होना और पर्यावरण की देखभाल करना। शिक्षक और माता-पिता मार्गदर्शन कर सकते हैं, लेकिन मूल्यों का सच्चा मापदंड छात्रों के विकल्पों और व्यवहार में निहित है।
                                </p>

                                <p className="pd-modal-text">
                                    आइए याद रखें: शैक्षणिक सफलता पहचान दिलाती है, लेकिन मूल्य ही स्थायी सम्मान दिलाते हैं। जैसा कि महाभारत हमें याद दिलाता है:
                                </p>

                                <blockquote className="pd-modal-shlok pd-modal-shlok-small">
                                    <p className="pd-modal-shlok-text">"धर्मेण हीनाः पशुभिः समानाः।"</p>
                                    <p className="pd-modal-shlok-translation">(धर्म के बिना मनुष्य पशुओं से श्रेष्ठ नहीं है।)</p>
                                </blockquote>

                                <p className="pd-modal-text pd-modal-text-closing">
                                    हमारा विद्यालय सदा ऐसा स्थान बना रहे जहाँ ज्ञान मूल्यों से समृद्ध हो—जहाँ प्रत्येक शिक्षार्थी में ईमानदारी, दया, साहस और सम्मान की भावना झलकती हो। बुद्धि से परिपूर्ण और हृदय में मूल्यों से परिपूर्ण, हमारे छात्र न केवल कुशल पेशेवर बनेंगे बल्कि नेक इंसान और जिम्मेदार नागरिक भी बनेंगे।
                                </p>

                                <div className="pd-modal-signature">
                                    <div className="pd-modal-sig-line" />
                                    <p className="pd-modal-sig-name">Deendayal Chouksey</p>
                                    <p className="pd-modal-sig-title">Principal</p>
                                    <p className="pd-modal-sig-school">Rajeev Gandhi Convent Hr. Sec. School</p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

export default PrincipalDesk
