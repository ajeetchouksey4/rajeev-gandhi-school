import React, { useState, useEffect } from 'react'
import { GraduationCap, Menu, X } from 'lucide-react'
import './Navbar.css'

const navItems = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Academics', href: '#academics' },
    { label: 'Facilities', href: '#facilities' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Contact', href: '#contact' },
]

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
    const [active, setActive] = useState('home')

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 60)

            // Active section detection
            const sections = document.querySelectorAll('section[id]')
            let current = 'home'
            sections.forEach(sec => {
                if (window.scrollY >= sec.offsetTop - 150) {
                    current = sec.id
                }
            })
            setActive(current)
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const handleNavClick = (href) => {
        setMobileOpen(false)
        const el = document.querySelector(href)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
    }

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            <div className="container nav-container">
                <a href="#home" className="nav-logo" onClick={(e) => { e.preventDefault(); handleNavClick('#home') }}>
                    <div className="logo-icon">
                        <GraduationCap size={22} />
                    </div>
                    <div className="logo-text">
                        <span className="logo-name">Rajiv Gandhi Convent</span>
                        <span className="logo-sub">Higher Secondary School</span>
                    </div>
                </a>

                <ul className={`nav-links ${mobileOpen ? 'open' : ''}`}>
                    {navItems.map(item => (
                        <li key={item.href}>
                            <a
                                href={item.href}
                                className={`nav-link ${active === item.href.slice(1) ? 'active' : ''}`}
                                onClick={(e) => { e.preventDefault(); handleNavClick(item.href) }}
                            >
                                {item.label}
                                {active === item.href.slice(1) && <span className="nav-indicator" />}
                            </a>
                        </li>
                    ))}
                    <li>
                        <a
                            href="#admissions"
                            className="nav-link nav-cta"
                            onClick={(e) => { e.preventDefault(); handleNavClick('#admissions') }}
                        >
                            🚀 Admissions Open
                        </a>
                    </li>
                </ul>

                <button
                    className={`nav-toggle ${mobileOpen ? 'open' : ''}`}
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label="Toggle navigation"
                >
                    {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>
        </nav>
    )
}

export default Navbar
