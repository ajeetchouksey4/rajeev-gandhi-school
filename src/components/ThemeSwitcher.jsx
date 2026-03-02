import React, { useState, useRef, useEffect } from 'react'
import { Palette, Check } from 'lucide-react'
import { useTheme, THEMES } from '../context/ThemeContext'
import './ThemeSwitcher.css'

const ThemeSwitcher = () => {
    const { theme, setTheme } = useTheme()
    const [open, setOpen] = useState(false)
    const ref = useRef(null)

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Close on escape key
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') setOpen(false)
        }
        document.addEventListener('keydown', handleEsc)
        return () => document.removeEventListener('keydown', handleEsc)
    }, [])

    const handleThemeSelect = (themeId) => {
        setTheme(themeId)
        setOpen(false)
    }

    return (
        <div className="theme-switcher" ref={ref}>
            <button
                className={`theme-toggle-btn ${open ? 'active' : ''}`}
                onClick={() => setOpen(!open)}
                aria-label="Change theme"
                title="Change Theme"
            >
                <Palette size={18} />
            </button>

            {open && (
                <div className="theme-dropdown">
                    <div className="theme-dropdown-header">
                        <span className="theme-dropdown-title">Choose Theme</span>
                    </div>
                    <div className="theme-options">
                        {Object.values(THEMES).map((t) => (
                            <button
                                key={t.id}
                                className={`theme-option ${theme === t.id ? 'selected' : ''}`}
                                onClick={() => handleThemeSelect(t.id)}
                            >
                                <span className="theme-option-emoji">{t.emoji}</span>
                                <div className="theme-option-info">
                                    <span className="theme-option-name">{t.name}</span>
                                    <span className="theme-option-desc">{t.description}</span>
                                </div>
                                {theme === t.id && (
                                    <Check size={16} className="theme-option-check" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default ThemeSwitcher
