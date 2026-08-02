import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, Reorder } from 'framer-motion'
import {
    Lock,
    X,
    Plus,
    Edit2,
    Trash2,
    Pin,
    AlertCircle,
    Wifi,
    WifiOff,
    LogOut,
    RefreshCw,
    MessageSquare,
    BarChart2,
    Eye,
    Filter,
    Search,
    PhoneCall,
    Mail,
    User,
    Calendar,
    GraduationCap,
    Clock,
    Send,
    Bell,
    Download,
    FileSpreadsheet,
    Image as ImageIcon,
    UploadCloud,
    GripVertical,
    ChevronLeft,
    ChevronRight,
    ArrowLeft,
    ArrowRight,
    Settings,
    Home,
    Building2,
    Sparkles,
    Layers
} from 'lucide-react'
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid
} from 'recharts'
import api from '../api/api'
import './AdminPanel.css'

const categories = ['Admissions', 'Exams', 'Academic', 'Events', 'Circulars']
const badges = ['URGENT', 'IMPORTANT', 'NOTICE', 'EVENT', 'MEETING']
const statusOptions = ['ALL', 'NEW', 'CONTACTED', 'ENROLLED', 'CLOSED']
const categoryFilterOptions = ['ALL', 'ADMISSION', 'GENERAL', 'CAREER', 'BUSINESS']
const galleryCategoryOptions = ['Events', 'Activities', 'Sports', 'Celebrations', 'Academics', 'Infrastructure', 'General']

const defaultGallerySeed = [
    // Facilities Section Photos
    { id: 101, title: 'Science Labs', category: 'Facilities', section: 'FACILITIES', imageUrl: 'https://res.cloudinary.com/dzckejmbq/image/upload/v1778130550/lab_sdvj0y.jpg', displayOrder: 1 },
    { id: 102, title: 'Transport', category: 'Facilities', section: 'FACILITIES', imageUrl: 'https://res.cloudinary.com/dzckejmbq/image/upload/v1778570845/transport1_gql8sk.jpg', displayOrder: 2 },

    // Highlights Section Photos
    { id: 201, title: 'Sports Day Championship', category: 'Highlights', section: 'HIGHLIGHTS', imageUrl: 'https://res.cloudinary.com/dzckejmbq/image/upload/v1778142942/trophy1_bz0ht0.jpg', displayOrder: 1 },
    { id: 202, title: 'Republic Day Parade', category: 'Highlights', section: 'HIGHLIGHTS', imageUrl: 'https://res.cloudinary.com/dzckejmbq/image/upload/v1778130962/independence5_ku7v2n.jpg', displayOrder: 2 },

    // Main Photo Gallery Photos
    { id: 301, title: 'Annual Day Celebration', category: 'Events', section: 'GALLERY', imageUrl: 'https://res.cloudinary.com/dzckejmbq/image/upload/v1778142942/trophy1_bz0ht0.jpg', wide: true, displayOrder: 1 },
    { id: 302, title: 'Yoga Day', category: 'Activities', section: 'GALLERY', imageUrl: 'https://res.cloudinary.com/dzckejmbq/image/upload/v1778130623/assembly2_lu2rg4.jpg', wide: false, displayOrder: 2 },
    { id: 303, title: 'Sports Day', category: 'Sports', section: 'GALLERY', imageUrl: 'https://res.cloudinary.com/dzckejmbq/image/upload/v1778142942/trophy3_vrtlrd.jpg', wide: false, displayOrder: 3 },
    { id: 304, title: 'Independence Day', category: 'Celebrations', section: 'GALLERY', imageUrl: 'https://res.cloudinary.com/dzckejmbq/image/upload/v1778130962/independence6_kgjyx0.jpg', wide: false, displayOrder: 4 },
    { id: 305, title: 'Science Exhibition', category: 'Academics', section: 'GALLERY', imageUrl: 'https://res.cloudinary.com/dzckejmbq/image/upload/v1778130550/lab_sdvj0y.jpg', wide: true, displayOrder: 5 },
]

const initialMockEnquiries = [
    {
        id: 101,
        category: 'ADMISSION',
        studentName: 'Aarav Sharma',
        parentName: 'Rajesh Sharma',
        parentPhone: '9876543210',
        parentEmail: 'rajesh.sharma@example.com',
        classApplyingFor: 'Class 9',
        message: 'Looking for admission guidelines and fee structure for academic session 2026-27.',
        status: 'NEW',
        isRead: false,
        createdAt: '2026-07-31T10:30:00',
    },
    {
        id: 102,
        category: 'ADMISSION',
        studentName: 'Ananya Verma',
        parentName: 'Suman Verma',
        parentPhone: '9988776655',
        parentEmail: 'suman.v@example.com',
        classApplyingFor: 'Nursery',
        message: 'Is transport facility available for South City area?',
        status: 'CONTACTED',
        isRead: true,
        createdAt: '2026-07-30T14:15:00',
    }
]

const AdminPanel = ({ onDataChange }) => {
    const navigate = useNavigate()
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return sessionStorage.getItem('rg_admin_auth') === 'true'
    })
    const [passcode, setPasscode] = useState('')
    const [authError, setAuthError] = useState('')
    const [activeTab, setActiveTab] = useState('enquiries') // 'enquiries' | 'notices' | 'gallery'

    // Announcements state
    const [announcements, setAnnouncements] = useState([])
    const [isBackendConnected, setIsBackendConnected] = useState(false)
    const [loading, setLoading] = useState(false)

    // Form Modal State for Announcements
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

    // Enquiries state
    const [enquiries, setEnquiries] = useState([])
    const [unreadCount, setUnreadCount] = useState(0)
    const [categoryFilter, setCategoryFilter] = useState('ALL')
    const [statusFilter, setStatusFilter] = useState('ALL')
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedEnquiry, setSelectedEnquiry] = useState(null)
    const [isDetailOpen, setIsDetailOpen] = useState(false)

    // Analytics state
    const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false)
    const [analyticsRange, setAnalyticsRange] = useState('week')
    const [analyticsCategoryScope, setAnalyticsCategoryScope] = useState('ALL')
    const [analyticsData, setAnalyticsData] = useState({
        total: 0,
        statusBreakdown: { NEW: 0, CONTACTED: 0, ENROLLED: 0, CLOSED: 0 },
        categoryBreakdown: { ADMISSION: 0, GENERAL: 0, CAREER: 0, BUSINESS: 0 },
        timeline: []
    })

    // Gallery state
    const [galleryItems, setGalleryItems] = useState([])
    const [isGalleryFormOpen, setIsGalleryFormOpen] = useState(false)
    const [editingGalleryItem, setEditingGalleryItem] = useState(null)
    const [isUploading, setIsUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [uploadError, setUploadError] = useState('')
    const [cloudinaryConfig, setCloudinaryConfig] = useState({
        cloudName: localStorage.getItem('rg_cloudinary_cloud') || 'dzckejmbq',
        uploadPreset: localStorage.getItem('rg_cloudinary_preset') || 'rg_school_preset'
    })
    const [showConfigModal, setShowConfigModal] = useState(false)
    const [galleryFormData, setGalleryFormData] = useState({
        title: '',
        category: 'Events',
        section: 'GALLERY',
        imageUrl: '',
        publicId: '',
        wide: false,
        displayOrder: 0
    })

    // Fetch announcements
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
            const saved = localStorage.getItem('rg_announcements')
            const localData = saved !== null ? JSON.parse(saved) : []
            setAnnouncements(localData)
            if (onDataChange) onDataChange(localData)
        } finally {
            setLoading(false)
        }
    }

    // Fetch enquiries
    const fetchEnquiries = async () => {
        setLoading(true)
        try {
            let endpoint = '/enquiries'
            const params = new URLSearchParams()
            if (categoryFilter && categoryFilter !== 'ALL') params.append('category', categoryFilter)
            if (statusFilter && statusFilter !== 'ALL') params.append('status', statusFilter)
            if (searchQuery) params.append('search', searchQuery)
            if (params.toString()) endpoint += `?${params.toString()}`

            const res = await api.get(endpoint)
            const data = await res.json()
            if (Array.isArray(data)) {
                setEnquiries(data)
                setIsBackendConnected(true)

                try {
                    const countRes = await api.get('/enquiries/unread-count')
                    const countData = await countRes.json()
                    setUnreadCount(countData.unreadCount || 0)
                } catch (e) {
                    const uCount = data.filter(e => !e.isRead).length
                    setUnreadCount(uCount)
                }
            }
        } catch (err) {
            console.warn('Failed to fetch enquiries from backend, using local/mock state:', err.message)
            setIsBackendConnected(false)
            const saved = localStorage.getItem('rg_enquiries')
            const localData = saved !== null ? JSON.parse(saved) : initialMockEnquiries
            
            let filtered = [...localData]
            if (categoryFilter && categoryFilter !== 'ALL') {
                filtered = filtered.filter(item => (item.category || 'ADMISSION') === categoryFilter)
            }
            if (statusFilter && statusFilter !== 'ALL') {
                filtered = filtered.filter(item => item.status === statusFilter)
            }
            if (searchQuery) {
                const q = searchQuery.toLowerCase()
                filtered = filtered.filter(item => 
                    (item.studentName && item.studentName.toLowerCase().includes(q)) ||
                    (item.parentName && item.parentName.toLowerCase().includes(q)) ||
                    (item.parentPhone && item.parentPhone.toLowerCase().includes(q)) ||
                    (item.phone && item.phone.toLowerCase().includes(q))
                )
            }
            setEnquiries(filtered)
            setUnreadCount(localData.filter(e => !e.isRead).length)
        } finally {
            setLoading(false)
        }
    }

    // Fetch gallery items
    const fetchGallery = async () => {
        setLoading(true)
        try {
            const res = await api.get('/gallery')
            const data = await res.json()
            if (Array.isArray(data) && data.length > 0) {
                setGalleryItems(data)
                setIsBackendConnected(true)
                localStorage.setItem('rg_gallery', JSON.stringify(data))
                window.dispatchEvent(new Event('rg_gallery_updated'))
                setLoading(false)
                return
            }
        } catch (err) {
            console.warn('Failed to fetch gallery items from backend, using local fallback:', err.message)
            setIsBackendConnected(false)
        }

        const saved = localStorage.getItem('rg_gallery')
        if (saved) {
            try {
                const parsed = JSON.parse(saved)
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setGalleryItems(parsed)
                    setLoading(false)
                    return
                }
            } catch (e) {
                console.error(e)
            }
        }
        setGalleryItems(defaultGallerySeed)
        localStorage.setItem('rg_gallery', JSON.stringify(defaultGallerySeed))
        setLoading(false)
    }

    useEffect(() => {
        if (isAuthenticated) {
            fetchAnnouncements()
            fetchEnquiries()
            fetchGallery()
        }
    }, [isAuthenticated, categoryFilter, statusFilter, searchQuery])

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
                fetchEnquiries()
                fetchAnnouncements()
                fetchGallery()
            } else {
                setAuthError(data.message || 'Invalid admin password!')
            }
        } catch (err) {
            if (passcode === 'RajeevAdmin2026!') {
                setIsAuthenticated(true)
                sessionStorage.setItem('rg_admin_auth', 'true')
                setAuthError('')
                setPasscode('')
                fetchEnquiries()
                fetchAnnouncements()
                fetchGallery()
            } else {
                setAuthError('Invalid admin password or backend unreachable.')
            }
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = () => {
        setIsAuthenticated(false)
        sessionStorage.removeItem('rg_admin_auth')
    }

    // ==========================================
    // GALLERY MANAGEMENT HANDLERS & SWAPPING
    // ==========================================

    const handleOpenGalleryForm = (item = null, defaultSection = 'GALLERY') => {
        if (item) {
            setEditingGalleryItem(item)
            setGalleryFormData({
                title: item.title || '',
                category: item.category || 'Events',
                section: item.section || 'GALLERY',
                imageUrl: item.imageUrl || '',
                publicId: item.publicId || '',
                wide: item.wide || false,
                displayOrder: item.displayOrder || 0
            })
        } else {
            setEditingGalleryItem(null)
            setGalleryFormData({
                title: '',
                category: 'Events',
                section: defaultSection,
                imageUrl: '',
                publicId: '',
                wide: false,
                displayOrder: galleryItems.length + 1
            })
        }
        setUploadError('')
        setIsGalleryFormOpen(true)
    }

    const handleCloudinaryDirectUpload = async (file) => {
        if (!file) return
        if (!file.type.startsWith('image/')) {
            setUploadError('Please select a valid image file.')
            return
        }

        setIsUploading(true)
        setUploadProgress(20)
        setUploadError('')

        const data = new FormData()
        data.append('file', file)
        data.append('upload_preset', cloudinaryConfig.uploadPreset)

        try {
            setUploadProgress(50)
            const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`, {
                method: 'POST',
                body: data
            })

            const result = await res.json()
            setUploadProgress(90)

            if (result.secure_url) {
                setGalleryFormData(prev => ({
                    ...prev,
                    imageUrl: result.secure_url,
                    publicId: result.public_id || '',
                    title: prev.title || file.name.replace(/\.[^/.]+$/, "")
                }))
                setUploadProgress(100)
            } else {
                setUploadError(result.error?.message || 'Cloudinary upload failed. Check your Cloud Name & Unsigned Upload Preset.')
            }
        } catch (err) {
            setUploadError(`Upload network error: ${err.message}. If using Cloudinary public storage, ensure your Upload Preset allows unsigned uploads.`)
        } finally {
            setIsUploading(false)
        }
    }

    const handleSaveGalleryItem = async (e) => {
        e.preventDefault()
        if (!galleryFormData.imageUrl) {
            setUploadError('Please select an image file or provide an Image URL.')
            return
        }

        if (isBackendConnected) {
            try {
                if (editingGalleryItem && editingGalleryItem.id) {
                    await api.put(`/gallery/${editingGalleryItem.id}`, galleryFormData)
                } else {
                    await api.post('/gallery', galleryFormData)
                }
                await fetchGallery()
            } catch (err) {
                alert(`Backend Save Error: ${err.message}`)
            }
        } else {
            let updated = []
            if (editingGalleryItem) {
                updated = galleryItems.map(item =>
                    item.id === editingGalleryItem.id ? { ...item, ...galleryFormData } : item
                )
            } else {
                const newItem = {
                    id: Date.now(),
                    ...galleryFormData,
                    displayOrder: galleryItems.length + 1
                }
                updated = [...galleryItems, newItem]
            }
            setGalleryItems(updated)
            localStorage.setItem('rg_gallery', JSON.stringify(updated))
            window.dispatchEvent(new Event('rg_gallery_updated'))
        }

        setIsGalleryFormOpen(false)
    }

    const handleDeleteGalleryItem = async (id) => {
        if (!window.confirm('Are you sure you want to remove this photo?')) return

        if (isBackendConnected) {
            try {
                await api.delete(`/gallery/${id}`)
                await fetchGallery()
            } catch (err) {
                alert(`Backend Delete Error: ${err.message}`)
            }
        } else {
            const updated = galleryItems.filter(item => item.id !== id)
            setGalleryItems(updated)
            localStorage.setItem('rg_gallery', JSON.stringify(updated))
            window.dispatchEvent(new Event('rg_gallery_updated'))
        }
    }

    // Reorder items within a specific section
    const handleReorderSection = async (sectionName, newSectionItems) => {
        const otherItems = galleryItems.filter(item => (item.section || 'GALLERY') !== sectionName)
        const reorderedSectionItems = newSectionItems.map((item, idx) => ({
            ...item,
            section: sectionName,
            displayOrder: idx + 1
        }))
        const mergedAll = [...otherItems, ...reorderedSectionItems]

        setGalleryItems(mergedAll)

        if (isBackendConnected) {
            try {
                await api.put('/gallery/reorder', mergedAll)
            } catch (err) {
                console.error('Failed to save section order to backend:', err)
            }
        } else {
            localStorage.setItem('rg_gallery', JSON.stringify(mergedAll))
            window.dispatchEvent(new Event('rg_gallery_updated'))
        }
    }

    // Swap item left/right in section
    const swapItemPosition = (sectionName, itemIndex, delta) => {
        const sectionItems = galleryItems.filter(item => (item.section || 'GALLERY') === sectionName)
        const targetIndex = itemIndex + delta

        if (targetIndex < 0 || targetIndex >= sectionItems.length) return

        const copy = [...sectionItems]
        const temp = copy[itemIndex]
        copy[itemIndex] = copy[targetIndex]
        copy[targetIndex] = temp

        handleReorderSection(sectionName, copy)
    }

    const handleSaveCloudinaryConfig = (e) => {
        e.preventDefault()
        localStorage.setItem('rg_cloudinary_cloud', cloudinaryConfig.cloudName)
        localStorage.setItem('rg_cloudinary_preset', cloudinaryConfig.uploadPreset)
        setShowConfigModal(false)
        alert('Cloudinary settings saved!')
    }

    const facilitiesPhotos = galleryItems.filter(item => item.section === 'FACILITIES')
    const highlightsPhotos = galleryItems.filter(item => item.section === 'HIGHLIGHTS')
    const galleryPhotos = galleryItems.filter(item => !item.section || item.section === 'GALLERY')

    return (
        <div className="admin-page-layout">
            {/* Top Navigation Bar */}
            <div className="admin-top-navbar">
                <div className="container admin-nav-inner">
                    <div className="admin-brand" onClick={() => navigate('/')}>
                        <div className="brand-badge">
                            <Lock size={16} />
                        </div>
                        <div>
                            <h2>Rajeev Gandhi Convent</h2>
                            <span className="brand-sub">School Administration Portal</span>
                        </div>
                    </div>

                    <div className="admin-nav-actions">
                        {isAuthenticated && (
                            <div className={`backend-status-pill ${isBackendConnected ? 'connected' : 'offline'}`}>
                                {isBackendConnected ? <Wifi size={13} /> : <WifiOff size={13} />}
                                <span>{isBackendConnected ? 'Backend Live' : 'Offline Mode'}</span>
                            </div>
                        )}
                        <button className="btn-back-home" onClick={() => navigate('/')} title="Return to School Website">
                            <Home size={15} /> <span>Back to Website</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Page Body */}
            <div className="container admin-page-body">
                {!isAuthenticated ? (
                    <div className="admin-login-wrapper">
                        <div className="admin-login-card">
                            <div className="login-icon-box">
                                <Lock size={32} />
                            </div>
                            <h4>Administrator Access</h4>
                            <p>Enter administrator passcode to access school enquiries, announcements, and photo gallery manager.</p>

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
                                    {loading ? 'Authenticating...' : 'Access Admin Control Center'}
                                </button>
                            </form>
                        </div>
                    </div>
                ) : (
                    <div className="admin-dashboard-container">
                        {/* Tab Switcher Navigation */}
                        <div className="admin-nav-tabs">
                            <button
                                className={`nav-tab-btn ${activeTab === 'enquiries' ? 'active' : ''}`}
                                onClick={() => setActiveTab('enquiries')}
                            >
                                <MessageSquare size={16} />
                                <span>Enquiries</span>
                                {unreadCount > 0 && <span className="unread-badge-chip">{unreadCount}</span>}
                            </button>

                            <button
                                className={`nav-tab-btn ${activeTab === 'notices' ? 'active' : ''}`}
                                onClick={() => setActiveTab('notices')}
                            >
                                <Bell size={16} />
                                <span>Announcements</span>
                                <span className="tab-count-chip">{announcements.length}</span>
                            </button>

                            <button
                                className={`nav-tab-btn ${activeTab === 'gallery' ? 'active' : ''}`}
                                onClick={() => setActiveTab('gallery')}
                            >
                                <ImageIcon size={16} />
                                <span>Website Photo Manager</span>
                                <span className="tab-count-chip">{galleryItems.length}</span>
                            </button>
                        </div>

                        {/* ENQUIRIES TAB CONTENT */}
                        {activeTab === 'enquiries' && (
                            <div className="tab-pane">
                                <div className="dashboard-toolbar">
                                    <div className="toolbar-left search-and-filter">
                                        <div className="search-box">
                                            <Search size={15} className="search-icon" />
                                            <input
                                                type="text"
                                                placeholder="Search name, phone..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                            />
                                        </div>

                                        <select
                                            className="filter-select"
                                            value={categoryFilter}
                                            onChange={(e) => setCategoryFilter(e.target.value)}
                                        >
                                            {categoryFilterOptions.map(cat => (
                                                <option key={cat} value={cat}>{cat === 'ALL' ? 'All Categories' : cat}</option>
                                            ))}
                                        </select>

                                        <select
                                            className="filter-select"
                                            value={statusFilter}
                                            onChange={(e) => setStatusFilter(e.target.value)}
                                        >
                                            {statusOptions.map(st => (
                                                <option key={st} value={st}>{st === 'ALL' ? 'All Statuses' : st}</option>
                                            ))}
                                        </select>

                                        <button className="refresh-btn" onClick={fetchEnquiries}>
                                            <RefreshCw size={13} className={loading ? 'spin' : ''} />
                                        </button>
                                    </div>

                                    <div className="toolbar-right">
                                        <button className="btn-logout" onClick={handleLogout} title="Logout">
                                            <LogOut size={15} />
                                        </button>
                                    </div>
                                </div>

                                <div className="admin-enquiries-list">
                                    {enquiries.length > 0 ? (
                                        enquiries.map((enq) => (
                                            <div key={enq.id} className="admin-enquiry-card">
                                                <div className="enquiry-card-header">
                                                    <h5>{enq.parentName || enq.studentName || 'Visitor'}</h5>
                                                    <span className="status-pill status-new">{enq.status || 'NEW'}</span>
                                                </div>
                                                <p className="enquiry-msg-snippet">{enq.message}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="admin-empty-state">
                                            <AlertCircle size={30} />
                                            <p>No enquiries found.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* ANNOUNCEMENTS TAB CONTENT */}
                        {activeTab === 'notices' && (
                            <div className="tab-pane">
                                <div className="dashboard-toolbar">
                                    <h4>Announcements</h4>
                                    <button className="btn btn-primary btn-sm" onClick={() => handleOpenForm()}>
                                        <Plus size={15} /> Add Notice
                                    </button>
                                </div>
                                <div className="admin-notices-table">
                                    {announcements.map((item) => (
                                        <div key={item.id} className="admin-notice-item">
                                            <div>
                                                <h5>{item.title}</h5>
                                                <p className="item-desc-preview">{item.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* SECTIONAL GALLERY MANAGER DASHBOARD */}
                        {activeTab === 'gallery' && (
                            <div className="tab-pane">
                                <div className="dashboard-toolbar">
                                    <div>
                                        <h4>Sectional Photo Gallery Dashboard</h4>
                                        <p className="sub-hint-text">Hold & drag images or use ← / → buttons to swap priority for each section live on your site.</p>
                                    </div>
                                    <div className="toolbar-right">
                                        <button className="btn btn-secondary btn-sm" onClick={() => setShowConfigModal(true)}>
                                            <Settings size={14} /> Cloudinary Settings
                                        </button>
                                        <button className="btn btn-primary btn-sm" onClick={() => handleOpenGalleryForm(null, 'GALLERY')}>
                                            <Plus size={15} /> Upload Photo
                                        </button>
                                        <button className="btn-logout" onClick={handleLogout} title="Logout">
                                            <LogOut size={15} />
                                        </button>
                                    </div>
                                </div>

                                <div className="sections-dashboard-grid">

                                    {/* SECTION 1: OUR FACILITIES */}
                                    <div className="section-manager-box">
                                        <div className="section-box-header">
                                            <div className="section-title-wrap">
                                                <Building2 size={20} className="section-icon facilities-icon" />
                                                <h3>Our Facilities Photos</h3>
                                                <span className="count-chip">{facilitiesPhotos.length} photos</span>
                                            </div>
                                            <button
                                                className="btn-add-section-photo"
                                                onClick={() => handleOpenGalleryForm(null, 'FACILITIES')}
                                            >
                                                <Plus size={14} /> Add Facility Photo
                                            </button>
                                        </div>

                                        <Reorder.Group
                                            axis="x"
                                            values={facilitiesPhotos}
                                            onReorder={(newItems) => handleReorderSection('FACILITIES', newItems)}
                                            className="horizontal-strip-reorder"
                                        >
                                            {facilitiesPhotos.map((img, idx) => (
                                                <Reorder.Item
                                                    key={img.id || idx}
                                                    value={img}
                                                    className="photo-swap-card"
                                                    whileDrag={{ scale: 1.05, zIndex: 100 }}
                                                >
                                                    <div className="card-image-box">
                                                        <img src={img.imageUrl} alt={img.title} />
                                                        <span className="order-number-badge">#{idx + 1}</span>
                                                    </div>

                                                    <div className="card-details">
                                                        <h5 title={img.title}>{img.title}</h5>
                                                        <span className="cat-tag">{img.category || 'Facilities'}</span>
                                                    </div>

                                                    {/* Swap Arrow Controls */}
                                                    <div className="swap-controls">
                                                        <button
                                                            className="swap-btn"
                                                            onClick={() => swapItemPosition('FACILITIES', idx, -1)}
                                                            disabled={idx === 0}
                                                            title="Swap Left (Move Up in Priority)"
                                                        >
                                                            <ArrowLeft size={14} />
                                                        </button>
                                                        <button
                                                            className="swap-btn"
                                                            onClick={() => swapItemPosition('FACILITIES', idx, 1)}
                                                            disabled={idx === facilitiesPhotos.length - 1}
                                                            title="Swap Right (Move Down in Priority)"
                                                        >
                                                            <ArrowRight size={14} />
                                                        </button>
                                                        <button
                                                            className="card-action-btn edit"
                                                            onClick={() => handleOpenGalleryForm(img, 'FACILITIES')}
                                                            title="Edit Photo"
                                                        >
                                                            <Edit2 size={13} />
                                                        </button>
                                                        <button
                                                            className="card-action-btn delete"
                                                            onClick={() => handleDeleteGalleryItem(img.id)}
                                                            title="Delete Photo"
                                                        >
                                                            <Trash2 size={13} />
                                                        </button>
                                                    </div>
                                                </Reorder.Item>
                                            ))}
                                        </Reorder.Group>
                                    </div>

                                    {/* SECTION 2: SCHOOL HIGHLIGHTS */}
                                    <div className="section-manager-box">
                                        <div className="section-box-header">
                                            <div className="section-title-wrap">
                                                <Sparkles size={20} className="section-icon highlights-icon" />
                                                <h3>School Highlights Photos</h3>
                                                <span className="count-chip">{highlightsPhotos.length} photos</span>
                                            </div>
                                            <button
                                                className="btn-add-section-photo"
                                                onClick={() => handleOpenGalleryForm(null, 'HIGHLIGHTS')}
                                            >
                                                <Plus size={14} /> Add Highlight Photo
                                            </button>
                                        </div>

                                        <Reorder.Group
                                            axis="x"
                                            values={highlightsPhotos}
                                            onReorder={(newItems) => handleReorderSection('HIGHLIGHTS', newItems)}
                                            className="horizontal-strip-reorder"
                                        >
                                            {highlightsPhotos.map((img, idx) => (
                                                <Reorder.Item
                                                    key={img.id || idx}
                                                    value={img}
                                                    className="photo-swap-card"
                                                    whileDrag={{ scale: 1.05, zIndex: 100 }}
                                                >
                                                    <div className="card-image-box">
                                                        <img src={img.imageUrl} alt={img.title} />
                                                        <span className="order-number-badge">#{idx + 1}</span>
                                                    </div>

                                                    <div className="card-details">
                                                        <h5 title={img.title}>{img.title}</h5>
                                                        <span className="cat-tag">{img.category || 'Highlights'}</span>
                                                    </div>

                                                    <div className="swap-controls">
                                                        <button
                                                            className="swap-btn"
                                                            onClick={() => swapItemPosition('HIGHLIGHTS', idx, -1)}
                                                            disabled={idx === 0}
                                                            title="Swap Left"
                                                        >
                                                            <ArrowLeft size={14} />
                                                        </button>
                                                        <button
                                                            className="swap-btn"
                                                            onClick={() => swapItemPosition('HIGHLIGHTS', idx, 1)}
                                                            disabled={idx === highlightsPhotos.length - 1}
                                                            title="Swap Right"
                                                        >
                                                            <ArrowRight size={14} />
                                                        </button>
                                                        <button
                                                            className="card-action-btn edit"
                                                            onClick={() => handleOpenGalleryForm(img, 'HIGHLIGHTS')}
                                                            title="Edit Photo"
                                                        >
                                                            <Edit2 size={13} />
                                                        </button>
                                                        <button
                                                            className="card-action-btn delete"
                                                            onClick={() => handleDeleteGalleryItem(img.id)}
                                                            title="Delete Photo"
                                                        >
                                                            <Trash2 size={13} />
                                                        </button>
                                                    </div>
                                                </Reorder.Item>
                                            ))}
                                        </Reorder.Group>
                                    </div>

                                    {/* SECTION 3: PHOTO GALLERY */}
                                    <div className="section-manager-box">
                                        <div className="section-box-header">
                                            <div className="section-title-wrap">
                                                <ImageIcon size={20} className="section-icon gallery-icon" />
                                                <h3>Photo Gallery Photos</h3>
                                                <span className="count-chip">{galleryPhotos.length} photos</span>
                                            </div>
                                            <button
                                                className="btn-add-section-photo"
                                                onClick={() => handleOpenGalleryForm(null, 'GALLERY')}
                                            >
                                                <Plus size={14} /> Add Gallery Photo
                                            </button>
                                        </div>

                                        <Reorder.Group
                                            axis="x"
                                            values={galleryPhotos}
                                            onReorder={(newItems) => handleReorderSection('GALLERY', newItems)}
                                            className="horizontal-strip-reorder"
                                        >
                                            {galleryPhotos.map((img, idx) => (
                                                <Reorder.Item
                                                    key={img.id || idx}
                                                    value={img}
                                                    className="photo-swap-card"
                                                    whileDrag={{ scale: 1.05, zIndex: 100 }}
                                                >
                                                    <div className="card-image-box">
                                                        <img src={img.imageUrl} alt={img.title} />
                                                        <span className="order-number-badge">#{idx + 1}</span>
                                                        {img.wide && <span className="wide-tag">Wide</span>}
                                                    </div>

                                                    <div className="card-details">
                                                        <h5 title={img.title}>{img.title}</h5>
                                                        <span className="cat-tag">{img.category || 'Events'}</span>
                                                    </div>

                                                    <div className="swap-controls">
                                                        <button
                                                            className="swap-btn"
                                                            onClick={() => swapItemPosition('GALLERY', idx, -1)}
                                                            disabled={idx === 0}
                                                            title="Swap Left"
                                                        >
                                                            <ArrowLeft size={14} />
                                                        </button>
                                                        <button
                                                            className="swap-btn"
                                                            onClick={() => swapItemPosition('GALLERY', idx, 1)}
                                                            disabled={idx === galleryPhotos.length - 1}
                                                            title="Swap Right"
                                                        >
                                                            <ArrowRight size={14} />
                                                        </button>
                                                        <button
                                                            className="card-action-btn edit"
                                                            onClick={() => handleOpenGalleryForm(img, 'GALLERY')}
                                                            title="Edit Photo"
                                                        >
                                                            <Edit2 size={13} />
                                                        </button>
                                                        <button
                                                            className="card-action-btn delete"
                                                            onClick={() => handleDeleteGalleryItem(img.id)}
                                                            title="Delete Photo"
                                                        >
                                                            <Trash2 size={13} />
                                                        </button>
                                                    </div>
                                                </Reorder.Item>
                                            ))}
                                        </Reorder.Group>
                                    </div>

                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* UPLOAD / EDIT PHOTO MODAL (FIXED OVERFLOW FROM TOP & BOTTOM) */}
            <AnimatePresence>
                {isGalleryFormOpen && (
                    <div className="form-modal-backdrop" onClick={() => setIsGalleryFormOpen(false)}>
                        <motion.div
                            className="form-modal-card compact-upload-modal"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="form-modal-header">
                                <h4>{editingGalleryItem ? 'Edit Photo Details' : 'Upload Photo to Website'}</h4>
                                <button className="admin-close-icon" onClick={() => setIsGalleryFormOpen(false)}>
                                    <X size={16} />
                                </button>
                            </div>

                            <form onSubmit={handleSaveGalleryItem} className="admin-form">
                                {/* Upload Dropzone */}
                                <div className="form-group">
                                    <label>Upload Image (Cloudinary Direct Storage)</label>
                                    <div className="upload-dropzone compact-dropzone">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            id="gallery-file-input"
                                            onChange={(e) => handleCloudinaryDirectUpload(e.target.files[0])}
                                            style={{ display: 'none' }}
                                        />
                                        <label htmlFor="gallery-file-input" className="dropzone-label">
                                            <UploadCloud size={26} className="upload-icon" />
                                            <span>
                                                {isUploading
                                                    ? `Uploading to Cloudinary (${uploadProgress}%)...`
                                                    : 'Click or drop photo here to upload'}
                                            </span>
                                            <small>Cloudinary Public Unsigned Storage</small>
                                        </label>
                                    </div>
                                    {uploadError && <span className="error-text mt-1">{uploadError}</span>}
                                </div>

                                <div className="form-group">
                                    <label>Or Direct Image URL *</label>
                                    <input
                                        type="url"
                                        placeholder="https://res.cloudinary.com/..."
                                        value={galleryFormData.imageUrl}
                                        onChange={(e) => setGalleryFormData({ ...galleryFormData, imageUrl: e.target.value })}
                                        required
                                    />
                                </div>

                                {galleryFormData.imageUrl && (
                                    <div className="image-preview-box compact-preview">
                                        <img src={galleryFormData.imageUrl} alt="Preview" />
                                    </div>
                                )}

                                <div className="form-group">
                                    <label>Photo Title / Caption *</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Science Exhibition 2026"
                                        value={galleryFormData.title}
                                        onChange={(e) => setGalleryFormData({ ...galleryFormData, title: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-row-2">
                                    <div className="form-group">
                                        <label>Target Website Section *</label>
                                        <select
                                            value={galleryFormData.section}
                                            onChange={(e) => setGalleryFormData({ ...galleryFormData, section: e.target.value })}
                                        >
                                            <option value="FACILITIES">Our Facilities Section</option>
                                            <option value="HIGHLIGHTS">School Highlights Section</option>
                                            <option value="GALLERY">Photo Gallery Section</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>Category Tag *</label>
                                        <select
                                            value={galleryFormData.category}
                                            onChange={(e) => setGalleryFormData({ ...galleryFormData, category: e.target.value })}
                                        >
                                            {galleryCategoryOptions.map(cat => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {galleryFormData.section === 'GALLERY' && (
                                    <div className="form-checkbox">
                                        <input
                                            type="checkbox"
                                            id="wide"
                                            checked={galleryFormData.wide}
                                            onChange={(e) => setGalleryFormData({ ...galleryFormData, wide: e.target.checked })}
                                        />
                                        <label htmlFor="wide">Wide Grid Span (2 columns in photo gallery)</label>
                                    </div>
                                )}

                                <div className="form-actions">
                                    <button type="button" className="btn btn-outline" onClick={() => setIsGalleryFormOpen(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary" disabled={isUploading}>
                                        {editingGalleryItem ? 'Save Changes' : 'Publish Photo'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* CLOUDINARY CONFIG MODAL */}
            <AnimatePresence>
                {showConfigModal && (
                    <div className="form-modal-backdrop" onClick={() => setShowConfigModal(false)}>
                        <motion.div
                            className="form-modal-card"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="form-modal-header">
                                <h4>Cloudinary Settings</h4>
                                <button className="admin-close-icon" onClick={() => setShowConfigModal(false)}>
                                    <X size={16} />
                                </button>
                            </div>

                            <form onSubmit={handleSaveCloudinaryConfig} className="admin-form">
                                <div className="form-group">
                                    <label>Cloud Name *</label>
                                    <input
                                        type="text"
                                        value={cloudinaryConfig.cloudName}
                                        onChange={(e) => setCloudinaryConfig({ ...cloudinaryConfig, cloudName: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Upload Preset Name *</label>
                                    <input
                                        type="text"
                                        value={cloudinaryConfig.uploadPreset}
                                        onChange={(e) => setCloudinaryConfig({ ...cloudinaryConfig, uploadPreset: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-actions">
                                    <button type="button" className="btn btn-outline" onClick={() => setShowConfigModal(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        Save Configuration
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
