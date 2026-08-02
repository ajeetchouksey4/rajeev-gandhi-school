import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import api from '../api/api'
import './Gallery.css'

const defaultImages = [
    { id: 1, imageUrl: 'https://res.cloudinary.com/dzckejmbq/image/upload/v1778142942/trophy1_bz0ht0.jpg', title: 'Annual Day Celebration', category: 'Events', wide: true, displayOrder: 1 },
    { id: 2, imageUrl: 'https://res.cloudinary.com/dzckejmbq/image/upload/v1778130623/assembly2_lu2rg4.jpg', title: 'Yoga Day', category: 'Activities', wide: false, displayOrder: 2 },
    { id: 3, imageUrl: 'https://res.cloudinary.com/dzckejmbq/image/upload/v1778142942/trophy3_vrtlrd.jpg', title: 'Sports Day', category: 'Sports', wide: false, displayOrder: 3 },
    { id: 4, imageUrl: 'https://res.cloudinary.com/dzckejmbq/image/upload/v1778130962/independence6_kgjyx0.jpg', title: 'Independence Day', category: 'Celebrations', wide: false, displayOrder: 4 },
    { id: 5, imageUrl: 'https://res.cloudinary.com/dzckejmbq/image/upload/v1778130550/lab_sdvj0y.jpg', title: 'Science Exhibition', category: 'Academics', wide: true, displayOrder: 5 },
    { id: 6, imageUrl: 'https://res.cloudinary.com/dzckejmbq/image/upload/v1778130962/independence5_ku7v2n.jpg', title: 'Republic Day', category: 'Celebrations', wide: false, displayOrder: 6 },
]

const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

const Gallery = () => {
    const [images, setImages] = useState(defaultImages)
    const [selected, setSelected] = useState(null)
    const [activeFilter, setActiveFilter] = useState('ALL')

    const fetchGallery = async () => {
        try {
            const res = await api.get('/gallery')
            const data = await res.json()
            if (Array.isArray(data) && data.length > 0) {
                setImages(data)
                return
            }
        } catch (err) {
            console.warn('Backend gallery fetch failed, checking local storage:', err.message)
        }
        const saved = localStorage.getItem('rg_gallery')
        if (saved) {
            try {
                const parsed = JSON.parse(saved)
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setImages(parsed)
                    return
                }
            } catch (e) {
                console.error(e)
            }
        }
        setImages(defaultImages)
    }

    useEffect(() => {
        fetchGallery()

        const handleStorageChange = () => fetchGallery()
        window.addEventListener('storage', handleStorageChange)
        window.addEventListener('rg_gallery_updated', handleStorageChange)
        return () => {
            window.removeEventListener('storage', handleStorageChange)
            window.removeEventListener('rg_gallery_updated', handleStorageChange)
        }
    }, [])

    const categories = ['ALL', ...new Set(images.map(img => img.category).filter(Boolean))]

    const filteredImages = activeFilter === 'ALL'
        ? images
        : images.filter(img => img.category === activeFilter)

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

                    {categories.length > 2 && (
                        <div className="gallery-filter-chips">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    className={`filter-chip ${activeFilter === cat ? 'active' : ''}`}
                                    onClick={() => setActiveFilter(cat)}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    )}
                </motion.div>

                <motion.div
                    className="gallery-grid"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                >
                    {filteredImages.map((img, i) => {
                        const imgUrl = img.imageUrl || img.src
                        const imgTitle = img.title || img.label
                        return (
                            <div
                                className={`gallery-item ${img.wide ? 'gallery-item-wide' : ''}`}
                                key={img.id || i}
                                onClick={() => setSelected(img)}
                            >
                                <img src={imgUrl} alt={imgTitle} loading="lazy" />
                                <div className="gallery-overlay">
                                    <span>{imgTitle}</span>
                                    {img.category && <span className="gallery-cat-tag">{img.category}</span>}
                                </div>
                            </div>
                        )
                    })}
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
                            <img src={selected.imageUrl || selected.src} alt={selected.title || selected.label} />
                            <div className="lightbox-details">
                                <p className="lightbox-label">{selected.title || selected.label}</p>
                                {selected.category && <span className="lightbox-cat">{selected.category}</span>}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    )
}

export default Gallery
