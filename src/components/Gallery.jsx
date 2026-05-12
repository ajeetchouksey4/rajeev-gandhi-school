import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import './Gallery.css'

const images = [
    { src: 'https://res.cloudinary.com/dzckejmbq/image/upload/v1778142942/trophy1_bz0ht0.jpg', label: 'Annual Day Celebration', wide: true },
    { src: 'https://res.cloudinary.com/dzckejmbq/image/upload/v1778130623/assembly2_lu2rg4.jpg', label: 'Yoga Day' },
    { src: 'https://res.cloudinary.com/dzckejmbq/image/upload/v1778142942/trophy3_vrtlrd.jpg', label: 'Sports Day' },
    { src: 'https://res.cloudinary.com/dzckejmbq/image/upload/v1778130959/independence4_jczl1m.jpg', label: 'Independence Day' },
    { src: 'https://res.cloudinary.com/dzckejmbq/image/upload/v1778130550/lab_sdvj0y.jpg', label: 'Science Exhibition', wide: true },
    { src: 'https://res.cloudinary.com/dzckejmbq/image/upload/v1778130962/independence5_ku7v2n.jpg', label: 'Republic Day' },
]

const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

const Gallery = () => {
    const [selected, setSelected] = useState(null)

    return (
        <section className="section gallery" id="gallery">
            <div className="container">
                <motion.div
                    className="section-header"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-80px' }}
                    variants={fadeInUp}
                >
                    <span className="section-tag">📸 Life at School</span>
                    <h2 className="section-title">
                        Photo <span className="gradient-text">Gallery</span>
                    </h2>
                    <p className="section-desc">Glimpses from our vibrant school life and events.</p>
                </motion.div>

                <motion.div
                    className="gallery-grid"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                >
                    {images.map((img, i) => (
                        <div
                            className={`gallery-item ${img.wide ? 'gallery-item-wide' : ''}`}
                            key={i}
                            onClick={() => setSelected(img)}
                        >
                            <img src={img.src} alt={img.label} loading="lazy" />
                            <div className="gallery-overlay">
                                <span>{img.label}</span>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* Lightbox */}
            <AnimatePresence>
                {selected && (
                    <motion.div
                        className="lightbox"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelected(null)}
                    >
                        <motion.div
                            className="lightbox-content"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button className="lightbox-close" onClick={() => setSelected(null)}>
                                <X size={24} />
                            </button>
                            <img src={selected.src} alt={selected.label} />
                            <p className="lightbox-label">{selected.label}</p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    )
}

export default Gallery
