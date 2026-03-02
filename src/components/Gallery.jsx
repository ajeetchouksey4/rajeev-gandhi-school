import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import './Gallery.css'

const images = [
    { src: 'https://images.unsplash.com/photo-1523050854058-8df90110c476?w=800&q=80', label: 'Annual Day Celebration', wide: true },
    { src: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600&q=80', label: 'Classroom Learning' },
    { src: 'https://images.unsplash.com/photo-1540479859555-17af45c78602?w=600&q=80', label: 'Sports Day' },
    { src: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80', label: 'Library Activities' },
    { src: 'https://images.unsplash.com/photo-1588072432836-e10032774350?w=800&q=80', label: 'Science Exhibition', wide: true },
    { src: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=600&q=80', label: 'Republic Day' },
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
