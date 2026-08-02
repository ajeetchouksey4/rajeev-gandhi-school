import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Monitor, FlaskConical, BookMarked, Dumbbell, Laptop, Bus, Building2 } from 'lucide-react'
import api from '../api/api'
import './Facilities.css'

const defaultFacilities = [
    { icon: Monitor, title: 'Smart Classrooms', img: 'https://images.unsplash.com/photo-1562774053-701939374585?w=500&q=80', desc: 'Interactive digital boards and projectors for engaging visual learning.' },
    { icon: FlaskConical, title: 'Science Labs', img: 'https://res.cloudinary.com/dzckejmbq/image/upload/v1778130550/lab_sdvj0y.jpg', desc: 'Well-equipped Physics, Chemistry & Biology labs for hands-on experiments.' },
    { icon: BookMarked, title: 'Library', img: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&q=80', desc: 'Extensive collection of books, journals, and digital resources.' },
    { icon: Dumbbell, title: 'Sports Complex', img: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500&q=80', desc: 'Playground, indoor games, basketball court & athletic track.' },
    { icon: Laptop, title: 'Computer Lab', img: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&q=80', desc: 'Modern computer lab with latest hardware, software & internet.' },
    { icon: Bus, title: 'Transport', img: 'https://res.cloudinary.com/dzckejmbq/image/upload/v1778570845/transport1_gql8sk.jpg', desc: 'Safe and comfortable bus service covering all major routes.' },
]

const iconList = [Monitor, FlaskConical, BookMarked, Dumbbell, Laptop, Bus, Building2]

const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (i) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.1 } }),
}

const Facilities = () => {
    const [facilitiesList, setFacilitiesList] = useState(defaultFacilities)

    const fetchFacilities = async () => {
        try {
            const res = await api.get('/gallery')
            const data = await res.json()
            if (Array.isArray(data)) {
                const facItems = data.filter(item => item.section === 'FACILITIES')
                if (facItems.length > 0) {
                    const mapped = facItems.map((item, index) => ({
                        title: item.title,
                        img: item.imageUrl,
                        desc: item.category ? `${item.category} facility at Rajeev Gandhi Convent School.` : 'Modern infrastructure facility.',
                        icon: iconList[index % iconList.length]
                    }))
                    setFacilitiesList(mapped)
                    return
                }
            }
        } catch (err) {
            console.warn('Backend fetch for facilities failed, checking local storage:', err.message)
        }

        const saved = localStorage.getItem('rg_gallery')
        if (saved) {
            try {
                const parsed = JSON.parse(saved)
                const facItems = parsed.filter(item => item.section === 'FACILITIES')
                if (facItems.length > 0) {
                    const mapped = facItems.map((item, index) => ({
                        title: item.title,
                        img: item.imageUrl,
                        desc: item.category ? `${item.category} facility.` : 'Modern school facility.',
                        icon: iconList[index % iconList.length]
                    }))
                    setFacilitiesList(mapped)
                    return
                }
            } catch (e) {
                console.error(e)
            }
        }
        setFacilitiesList(defaultFacilities)
    }

    useEffect(() => {
        fetchFacilities()

        const handleStorageChange = () => fetchFacilities()
        window.addEventListener('storage', handleStorageChange)
        window.addEventListener('rg_gallery_updated', handleStorageChange)
        return () => {
            window.removeEventListener('storage', handleStorageChange)
            window.removeEventListener('rg_gallery_updated', handleStorageChange)
        }
    }, [])

    return (
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
                    {facilitiesList.map((f, i) => {
                        const Icon = f.icon || Building2
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
}

export default Facilities
