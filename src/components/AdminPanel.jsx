import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Lock,
    X,
    Plus,
    Edit2,
    Trash2,
    Pin,
    Check,
    AlertCircle,
    Server,
    Wifi,
    WifiOff,
    LogOut,
    RefreshCw
} from 'lucide-react'
import api from '../api/api'
import './AdminPanel.css'

const categories = ['Admissions', 'Exams', 'Academic', 'Events', 'Circulars']
const badges = ['URGENT', 'IMPORTANT', 'NOTICE', 'EVENT', 'MEETING']

const initialMockAnnouncements = [
    {
        id: 1,
        title: 'Admissions Open for Academic Session 2026-2027',
        category: 'Admissions',
        date: '28 Jan 2026',
        isPinned: true,
        badge: 'URGENT',
        description:
            'Registration forms for Nursery to Class 11th are now available online and at the school office. Entrance assessment dates and syllabus guidelines will be communicated individually to registered parents.',
    },
    {
        id: 2,
        title: 'MP Board Class 10th & 12th Pre-Board Exam Date Sheet',
        category: 'Exams',
        date: '25 Jan 2026',
        isPinned: true,
        badge: 'IMPORTANT',
        description:
            'Pre-board examinations start from 10th February 2026. Practical examinations for science streams will take place between 5th-8th Feb. Admit cards can be collected from the school administrative counter.',
    },
    {
        id: 3,
        title: 'Revised Timing for Nursery & KG Classes during Winter Season',
        category: 'Circulars',
        date: '20 Jan 2026',
        isPinned: false,
        badge: 'NOTICE',
        description:
            'Due to cold wave conditions, morning timings for Nursery to UKG classes are revised to 9:00 AM – 1:30 PM until further notification. School buses will operate accordingly.',
    },
]

const AdminPanel = ({ isOpen, onClose, onDataChange }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [passcode, setPasscode] = useState('')
    const [authError, setAuthError] = useState('')

    const [announcements, setAnnouncements] = useState([])
    const [isBackendConnected, setIsBackendConnected] = useState(false)
    const [loading, setLoading] = useState(false)

    // Form Modal State
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingItem, setEditingItem] = useState(null)
    const [formData, setFormData] = useState({
        title: '',
        category: 'Admissions',
        badge: 'NOTICE',
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        description: '',
        isPinned: false,
    })

    // Fetch announcements from Spring Boot backend or LocalStorage
    const fetchAnnouncements = async () => {
        setLoading(true)
        try {
            const res = await api.get('/announcements')
            const data = await res.json()
            if (Array.isArray(data)) {
                setAnnouncements(data)
                setIsBackendConnected(true)
                if (onDataChange) onDataChange(data)
            }
        } catch (err) {
            console.warn('Backend API connection failed, falling back to local data:', err.message)
            setIsBackendConnected(false)
            // Load local storage fallback
            const saved = localStorage.getItem('rg_announcements')
            const localData = saved !== null ? JSON.parse(saved) : []
            setAnnouncements(localData)
            if (onDataChange) onDataChange(localData)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (isOpen) {
            fetchAnnouncements()
        }
    }, [isOpen])

    // Lock body scroll when admin modal is active
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => {
            document.body.style.overflow = ''
        }
    }, [isOpen])

    const handleLogin = async (e) => {
        e.preventDefault()
        if (!passcode) return
        setAuthError('')
        setLoading(true)

        try {
            const res = await api.post('/auth/login', { password: passcode })
            const data = await res.json()

            if (data.success) {
                setIsAuthenticated(true)
                sessionStorage.setItem('rg_admin_auth', 'true')
                setAuthError('')
                setPasscode('')
            } else {
                setAuthError(data.message || 'Invalid admin password!')
            }
        } catch (err) {
            // Fallback check if backend API is unreachable
            if (passcode === 'RajeevAdmin2026!') {
                setIsAuthenticated(true)
                sessionStorage.setItem('rg_admin_auth', 'true')
                setAuthError('')
                setPasscode('')
            } else {
                setAuthError('Invalid admin password or backend unreachable.')
            }
        } finally {
            setLoading(false)
        }
    }

    const handleOpenForm = (item = null) => {
        if (item) {
            setEditingItem(item)
            setFormData({
                title: item.title,
                category: item.category,
                badge: item.badge || 'NOTICE',
                date: item.date || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
                description: item.description,
                isPinned: item.isPinned || false,
            })
        } else {
            setEditingItem(null)
            setFormData({
                title: '',
                category: 'Admissions',
                badge: 'NOTICE',
                date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
                description: '',
                isPinned: false,
            })
        }
        setIsFormOpen(true)
    }

    const handleSaveNotice = async (e) => {
        e.preventDefault()
        if (!formData.title || !formData.description) return

        if (isBackendConnected) {
            try {
                if (editingItem) {
                    await api.put(`/announcements/${editingItem.id}`, formData)
                } else {
                    await api.post('/announcements', formData)
                }
                await fetchAnnouncements()
            } catch (err) {
                alert(`Backend Save Error: ${err.message}`)
            }
        } else {
            // LocalStorage fallback
            let updatedList = []
            if (editingItem) {
                updatedList = announcements.map((item) =>
                    item.id === editingItem.id ? { ...item, ...formData } : item
                )
            } else {
                const newItem = { id: Date.now(), ...formData }
                updatedList = [newItem, ...announcements]
            }
            setAnnouncements(updatedList)
            localStorage.setItem('rg_announcements', JSON.stringify(updatedList))
            if (onDataChange) onDataChange(updatedList)
        }

        setIsFormOpen(false)
    }

    const handleDeleteNotice = async (id) => {
        if (!window.confirm('Are you sure you want to delete this announcement?')) return

        if (isBackendConnected) {
            try {
                await api.delete(`/announcements/${id}`)
                await fetchAnnouncements()
            } catch (err) {
                alert(`Backend Delete Error: ${err.message}`)
            }
        } else {
            const updatedList = announcements.filter((item) => item.id !== id)
            setAnnouncements(updatedList)
            localStorage.setItem('rg_announcements', JSON.stringify(updatedList))
            if (onDataChange) onDataChange(updatedList)
        }
    }

    const handleTogglePin = async (item) => {
        const updated = { ...item, isPinned: !item.isPinned }
        if (isBackendConnected) {
            try {
                await api.put(`/announcements/${item.id}`, updated)
                await fetchAnnouncements()
            } catch (err) {
                console.error(err)
            }
        } else {
            const updatedList = announcements.map((i) => (i.id === item.id ? updated : i))
            setAnnouncements(updatedList)
            localStorage.setItem('rg_announcements', JSON.stringify(updatedList))
            if (onDataChange) onDataChange(updatedList)
        }
    }

    if (!isOpen) return null

    return (
        <div className="admin-overlay" onClick={onClose}>
            <motion.div
                className="admin-modal-container"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Admin Modal Header */}
                <div className="admin-header-bar">
                    <div className="admin-title-group">
                        <Lock size={18} className="lock-icon" />
                        <h3>School Admin Control Center</h3>
                    </div>

                    <div className="admin-header-right">
                        {isAuthenticated && (
                            <div
                                className={`backend-status-pill ${
                                    isBackendConnected ? 'connected' : 'offline'
                                }`}
                                title={
                                    isBackendConnected
                                        ? 'Connected to Spring Boot REST API'
                                        : 'Backend offline - Changes saved to Local Browser State'
                                }
                            >
                                {isBackendConnected ? <Wifi size={13} /> : <WifiOff size={13} />}
                                <span>{isBackendConnected ? 'Backend Live' : 'Offline Mode'}</span>
                            </div>
                        )}
                        <button className="admin-close-icon" onClick={onClose}>
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* Body Content */}
                {!isAuthenticated ? (
                    /* PASSCODE LOGIN SCREEN */
                    <div className="admin-login-card">
                        <div className="login-icon-box">
                            <Lock size={28} />
                        </div>
                        <h4>Admin Portal Access</h4>
                        <p>Enter the administrator passcode to manage notices and school updates.</p>

                        <form onSubmit={handleLogin} className="login-form">
                            <input
                                type="password"
                                placeholder="Enter admin passcode..."
                                value={passcode}
                                onChange={(e) => setPasscode(e.target.value)}
                                autoFocus
                            />
                            {authError && <span className="error-text">{authError}</span>}
                            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                                {loading ? 'Verifying...' : 'Access Admin Panel'}
                            </button>
                        </form>
                    </div>
                ) : (
                    /* ADMIN DASHBOARD */
                    <div className="admin-dashboard">
                        {/* Toolbar */}
                        <div className="dashboard-toolbar">
                            <div className="toolbar-left">
                                <h4>Announcement Manager ({announcements.length})</h4>
                                <button className="refresh-btn" onClick={fetchAnnouncements} title="Refresh Data">
                                    <RefreshCw size={13} className={loading ? 'spin' : ''} />
                                </button>
                            </div>
                            <div className="toolbar-right">
                                <button className="btn btn-primary btn-sm" onClick={() => handleOpenForm()}>
                                    <Plus size={15} /> Add Notice
                                </button>
                                <button
                                    className="btn-logout"
                                    onClick={() => setIsAuthenticated(false)}
                                    title="Logout"
                                >
                                    <LogOut size={15} />
                                </button>
                            </div>
                        </div>

                        {/* List Table */}
                        <div className="admin-notices-table">
                            {announcements.length > 0 ? (
                                [...announcements]
                                    .sort((a, b) => {
                                        const pinA = a.isPinned ? 1 : 0
                                        const pinB = b.isPinned ? 1 : 0
                                        if (pinA !== pinB) return pinB - pinA
                                        return (b.id || 0) - (a.id || 0)
                                    })
                                    .map((item) => (
                                    <div key={item.id} className={`admin-notice-item ${item.isPinned ? 'pinned' : ''}`}>
                                        <div className="item-main">
                                            <div className="item-meta">
                                                <span className={`badge-chip tag-${item.category.toLowerCase()}`}>
                                                    {item.badge || 'NOTICE'}
                                                </span>
                                                <span className="item-category-label">{item.category}</span>
                                                <span className="item-date">{item.date}</span>
                                            </div>
                                            <h5 className="item-title">{item.title}</h5>
                                            <p className="item-desc-preview">{item.description}</p>
                                        </div>

                                        <div className="item-actions">
                                            <button
                                                className={`icon-action-btn pin-btn ${item.isPinned ? 'active' : ''}`}
                                                onClick={() => handleTogglePin(item)}
                                                title={item.isPinned ? 'Unpin Notice' : 'Pin to Top'}
                                            >
                                                <Pin size={15} />
                                            </button>
                                            <button
                                                className="icon-action-btn edit-btn"
                                                onClick={() => handleOpenForm(item)}
                                                title="Edit Notice"
                                            >
                                                <Edit2 size={15} />
                                            </button>
                                            <button
                                                className="icon-action-btn delete-btn"
                                                onClick={() => handleDeleteNotice(item.id)}
                                                title="Delete Notice"
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="admin-empty-state">
                                    <AlertCircle size={30} />
                                    <p>No announcements present. Click "+ Add Notice" to create one.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </motion.div>

            {/* Form Modal for Add/Edit */}
            <AnimatePresence>
                {isFormOpen && (
                    <div className="form-modal-backdrop" onClick={() => setIsFormOpen(false)}>
                        <motion.div
                            className="form-modal-card"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="form-modal-header">
                                <h4>{editingItem ? 'Edit Announcement' : 'Create New Announcement'}</h4>
                                <button className="admin-close-icon" onClick={() => setIsFormOpen(false)}>
                                    <X size={16} />
                                </button>
                            </div>

                            <form onSubmit={handleSaveNotice} className="admin-form">
                                <div className="form-group">
                                    <label>Notice Title *</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Admissions Open for Session 2026-27"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-row-2">
                                    <div className="form-group">
                                        <label>Category *</label>
                                        <select
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        >
                                            {categories.map((c) => (
                                                <option key={c} value={c}>{c}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>Priority Badge *</label>
                                        <select
                                            value={formData.badge}
                                            onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                                        >
                                            {badges.map((b) => (
                                                <option key={b} value={b}>{b}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Display Date</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. 28 Jan 2026"
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Full Announcement Details *</label>
                                    <textarea
                                        rows={4}
                                        placeholder="Enter complete notice information..."
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-checkbox">
                                    <input
                                        type="checkbox"
                                        id="isPinned"
                                        checked={formData.isPinned}
                                        onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
                                    />
                                    <label htmlFor="isPinned">Pin this notice to top of board</label>
                                </div>

                                <div className="form-actions">
                                    <button type="button" className="btn btn-outline" onClick={() => setIsFormOpen(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        {editingItem ? 'Save Changes' : 'Publish Notice'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default AdminPanel
