import React, { useState, useEffect, useRef } from 'react'
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
    ArrowLeft,
    ArrowRight,
    Settings,
    Home,
    Building2,
    Sparkles,
    Check
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
const galleryCategoryOptions = ['Events', 'Activities', 'Sports', 'Celebrations', 'Academics', 'Facilities', 'General']

const defaultGallerySeed = [
    // Facilities Section Photos
    { id: 101, title: 'Smart Classrooms', category: 'Facilities', section: 'FACILITIES', imageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=500&q=80', displayOrder: 1 },
    { id: 102, title: 'Science Labs', category: 'Facilities', section: 'FACILITIES', imageUrl: 'https://res.cloudinary.com/dzckejmbq/image/upload/v1778130550/lab_sdvj0y.jpg', displayOrder: 2 },
    { id: 103, title: 'Library', category: 'Facilities', section: 'FACILITIES', imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&q=80', displayOrder: 3 },
    { id: 104, title: 'Sports Complex', category: 'Facilities', section: 'FACILITIES', imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500&q=80', displayOrder: 4 },
    { id: 105, title: 'Computer Lab', category: 'Facilities', section: 'FACILITIES', imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&q=80', displayOrder: 5 },
    { id: 106, title: 'Transport', category: 'Facilities', section: 'FACILITIES', imageUrl: 'https://res.cloudinary.com/dzckejmbq/image/upload/v1778570845/transport1_gql8sk.jpg', displayOrder: 6 },

    // School Highlights Section Photos
    { id: 201, title: 'Annual Day Celebration', category: 'Events', section: 'HIGHLIGHTS', imageUrl: 'https://res.cloudinary.com/dzckejmbq/image/upload/v1778142942/trophy1_bz0ht0.jpg', displayOrder: 1 },
    { id: 202, title: 'Sports Day Championship', category: 'Sports', section: 'HIGHLIGHTS', imageUrl: 'https://res.cloudinary.com/dzckejmbq/image/upload/v1778142942/trophy3_vrtlrd.jpg', displayOrder: 2 },
    { id: 203, title: 'Science Exhibition', category: 'Academics', section: 'HIGHLIGHTS', imageUrl: 'https://res.cloudinary.com/dzckejmbq/image/upload/v1778130550/lab_sdvj0y.jpg', displayOrder: 3 },
    { id: 204, title: 'Republic Day Parade', category: 'Celebrations', section: 'HIGHLIGHTS', imageUrl: 'https://res.cloudinary.com/dzckejmbq/image/upload/v1778130962/independence5_ku7v2n.jpg', displayOrder: 4 },

    // Main Photo Gallery Section Photos
    { id: 301, title: 'Annual Day Celebration', category: 'Events', section: 'GALLERY', imageUrl: 'https://res.cloudinary.com/dzckejmbq/image/upload/v1778142942/trophy1_bz0ht0.jpg', wide: true, displayOrder: 1 },
    { id: 302, title: 'Yoga Day', category: 'Activities', section: 'GALLERY', imageUrl: 'https://res.cloudinary.com/dzckejmbq/image/upload/v1778130623/assembly2_lu2rg4.jpg', wide: false, displayOrder: 2 },
    { id: 303, title: 'Sports Day', category: 'Sports', section: 'GALLERY', imageUrl: 'https://res.cloudinary.com/dzckejmbq/image/upload/v1778142942/trophy3_vrtlrd.jpg', wide: false, displayOrder: 3 },
    { id: 304, title: 'Independence Day', category: 'Celebrations', section: 'GALLERY', imageUrl: 'https://res.cloudinary.com/dzckejmbq/image/upload/v1778130962/independence6_kgjyx0.jpg', wide: false, displayOrder: 4 },
    { id: 305, title: 'Science Exhibition', category: 'Academics', section: 'GALLERY', imageUrl: 'https://res.cloudinary.com/dzckejmbq/image/upload/v1778130550/lab_sdvj0y.jpg', wide: true, displayOrder: 5 },
    { id: 306, title: 'Republic Day', category: 'Celebrations', section: 'GALLERY', imageUrl: 'https://res.cloudinary.com/dzckejmbq/image/upload/v1778130962/independence5_ku7v2n.jpg', wide: false, displayOrder: 6 },
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
    },
    {
        id: 103,
        category: 'CAREER',
        studentName: '',
        parentName: 'Priya Mehta',
        parentPhone: '9123456789',
        parentEmail: 'priya.m@example.com',
        classApplyingFor: '',
        message: 'Applying for Senior PGT Mathematics Teacher position. Have 6 years MP Board experience.',
        status: 'NEW',
        isRead: false,
        createdAt: '2026-07-29T11:20:00',
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

    // Helper: Normalize & ensure photos exist for all sections
    const ensureSectionCoverage = (items) => {
        let normalized = [...items]
        const hasFac = normalized.some(i => i.section === 'FACILITIES')
        const hasHigh = normalized.some(i => i.section === 'HIGHLIGHTS')
        const hasGal = normalized.some(i => !i.section || i.section === 'GALLERY')

        if (!hasFac) {
            normalized = [...normalized, ...defaultGallerySeed.filter(i => i.section === 'FACILITIES')]
        }
        if (!hasHigh) {
            normalized = [...normalized, ...defaultGallerySeed.filter(i => i.section === 'HIGHLIGHTS')]
        }
        if (!hasGal) {
            normalized = [...normalized, ...defaultGallerySeed.filter(i => i.section === 'GALLERY')]
        }
        return normalized
    }

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
                const enriched = ensureSectionCoverage(data)
                setGalleryItems(enriched)
                setIsBackendConnected(true)
                localStorage.setItem('rg_gallery', JSON.stringify(enriched))
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
                    const enriched = ensureSectionCoverage(parsed)
                    setGalleryItems(enriched)
                    setLoading(false)
                    return
                }
            } catch (e) {
                console.error(e)
            }
        }

        setGalleryItems(defaultGallerySeed)
        localStorage.setItem('rg_gallery', JSON.stringify(defaultGallerySeed))
        window.dispatchEvent(new Event('rg_gallery_updated'))
        setLoading(false)
    }

    // Fetch analytics
    const fetchAnalytics = async (range = analyticsRange, catScope = analyticsCategoryScope) => {
        try {
            const res = await api.get(`/enquiries/analytics?range=${range}&category=${catScope}`)
            const data = await res.json()
            setAnalyticsData(data)
        } catch (err) {
            const saved = localStorage.getItem('rg_enquiries')
            const rawList = saved !== null ? JSON.parse(saved) : initialMockEnquiries
            const list = catScope && catScope !== 'ALL'
                ? rawList.filter(e => (e.category || 'ADMISSION') === catScope)
                : rawList

            const total = list.length
            const statusBreakdown = {
                NEW: list.filter(e => e.status === 'NEW').length,
                CONTACTED: list.filter(e => e.status === 'CONTACTED').length,
                ENROLLED: list.filter(e => e.status === 'ENROLLED').length,
                CLOSED: list.filter(e => e.status === 'CLOSED').length,
            }
            const categoryBreakdown = {
                ADMISSION: rawList.filter(e => (e.category || 'ADMISSION') === 'ADMISSION').length,
                GENERAL: rawList.filter(e => e.category === 'GENERAL').length,
                CAREER: rawList.filter(e => e.category === 'CAREER').length,
                BUSINESS: rawList.filter(e => e.category === 'BUSINESS').length,
            }
            
            let timeline = []
            if (range === 'year') {
                timeline = [
                    { label: 'May 2026', count: 4 },
                    { label: 'Jun 2026', count: 12 },
                    { label: 'Jul 2026', count: total },
                ]
            } else if (range === 'month') {
                timeline = [
                    { label: 'W1 (07 Jul)', count: 2 },
                    { label: 'W2 (14 Jul)', count: 5 },
                    { label: 'W3 (21 Jul)', count: 8 },
                    { label: 'W4 (28 Jul)', count: total },
                ]
            } else {
                timeline = [
                    { label: 'Mon', count: 1 },
                    { label: 'Tue', count: 3 },
                    { label: 'Wed', count: 2 },
                    { label: 'Thu', count: 4 },
                    { label: 'Fri', count: total },
                ]
            }
            setAnalyticsData({ total, statusBreakdown, categoryBreakdown, timeline })
        }
    }

    const handleExportCSV = (onlyAdmissions = false) => {
        if (!enquiries || enquiries.length === 0) {
            alert('No enquiries available to export.')
            return
        }

        const targetList = onlyAdmissions 
            ? enquiries.filter(e => (e.category || 'ADMISSION') === 'ADMISSION')
            : enquiries

        if (targetList.length === 0) {
            alert(onlyAdmissions ? 'No admission enquiries found to export.' : 'No enquiries found to export.')
            return
        }

        const headers = ['ID', 'Category', 'Student Name', 'Parent / Contact Name', 'Phone', 'Email', 'Class Applied For', 'Message', 'Status', 'Date']
        
        const rows = targetList.map(enq => [
            enq.id || '',
            enq.category || 'ADMISSION',
            enq.studentName || 'N/A',
            enq.parentName || '',
            enq.parentPhone || enq.phone || '',
            enq.parentEmail || '',
            enq.classApplyingFor || enq.classAppliedFor || 'N/A',
            (enq.message || '').replace(/"/g, '""').replace(/\n/g, ' '),
            enq.status || 'NEW',
            enq.createdAt ? new Date(enq.createdAt).toLocaleString() : ''
        ])

        const csvContent = [
            headers.join(','),
            ...rows.map(e => e.map(val => `"${val}"`).join(','))
        ].join('\n')

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        const filename = onlyAdmissions 
            ? `admissions_enquiries_${new Date().toISOString().slice(0, 10)}.csv`
            : `all_enquiries_${new Date().toISOString().slice(0, 10)}.csv`

        link.setAttribute('href', url)
        link.setAttribute('download', filename)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    useEffect(() => {
        if (isAuthenticated) {
            fetchAnnouncements()
            fetchEnquiries()
            fetchGallery()
        }
    }, [isAuthenticated, categoryFilter, statusFilter, searchQuery])

    useEffect(() => {
        if (isAnalyticsOpen) {
            fetchAnalytics(analyticsRange, analyticsCategoryScope)
        }
    }, [isAnalyticsOpen, analyticsRange, analyticsCategoryScope])

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

    const handleOpenDetail = async (item) => {
        setSelectedEnquiry(item)
        setIsDetailOpen(true)

        if (!item.isRead) {
            if (isBackendConnected) {
                try {
                    await api.get(`/enquiries/${item.id}`)
                    fetchEnquiries()
                } catch (err) {
                    console.error(err)
                }
            } else {
                const saved = localStorage.getItem('rg_enquiries')
                const list = saved !== null ? JSON.parse(saved) : initialMockEnquiries
                const updated = list.map(e => e.id === item.id ? { ...e, isRead: true } : e)
                localStorage.setItem('rg_enquiries', JSON.stringify(updated))
                setEnquiries(prev => prev.map(e => e.id === item.id ? { ...e, isRead: true } : e))
                setUnreadCount(prev => Math.max(0, prev - 1))
            }
        }
    }

    const handleStatusChange = async (id, newStatus) => {
        if (isBackendConnected) {
            try {
                await api.patch(`/enquiries/${id}/status`, { status: newStatus })
                fetchEnquiries()
                if (selectedEnquiry && selectedEnquiry.id === id) {
                    setSelectedEnquiry(prev => ({ ...prev, status: newStatus }))
                }
            } catch (err) {
                alert(`Error updating status: ${err.message}`)
            }
        } else {
            const saved = localStorage.getItem('rg_enquiries')
            const list = saved !== null ? JSON.parse(saved) : initialMockEnquiries
            const updated = list.map(e => e.id === id ? { ...e, status: newStatus } : e)
            localStorage.setItem('rg_enquiries', JSON.stringify(updated))
            setEnquiries(prev => prev.map(e => e.id === id ? { ...e, status: newStatus } : e))
            if (selectedEnquiry && selectedEnquiry.id === id) {
                setSelectedEnquiry(prev => ({ ...prev, status: newStatus }))
            }
        }
    }

    const openWhatsApp = (enquiry) => {
        const phone = (enquiry.parentPhone || enquiry.phone || '').replace(/\D/g, '')
        const formattedPhone = phone.length === 10 ? `91${phone}` : phone
        const name = enquiry.parentName || enquiry.studentName || 'there'
        const isAdmission = (enquiry.category || 'ADMISSION') === 'ADMISSION'
        const studentName = enquiry.studentName || 'your child'
        const classAppliedFor = enquiry.classApplyingFor || enquiry.classAppliedFor || 'our school'

        let text = ''
        if (isAdmission) {
            text = `Hi ${name}, thank you for your enquiry about admission for ${studentName} in ${classAppliedFor}. We'd love to help — let us know a good time to talk.`
        } else {
            text = `Hi ${name}, thank you for reaching out to Rajeev Gandhi Convent School regarding your enquiry (${enquiry.category || 'General'}). How can we assist you today?`
        }

        const url = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(text)}`
        window.open(url, '_blank')
    }

    // Announcement Handlers
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

    // =========================================================
    // HIGH-PERFORMANCE LAG-FREE PHOTO SWAPPING SYSTEM
    // =========================================================

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
            setUploadError(`Upload network error: ${err.message}. Ensure Cloud Name & Upload Preset permit unsigned direct uploads.`)
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

    // Rapid reorder local UI state
    const handleReorderSectionLocal = (sectionName, newSectionItems) => {
        const otherItems = galleryItems.filter(item => (item.section || 'GALLERY') !== sectionName)
        const reorderedSectionItems = newSectionItems.map((item, idx) => ({
            ...item,
            section: sectionName,
            displayOrder: idx + 1
        }))
        setGalleryItems([...otherItems, ...reorderedSectionItems])
    }

    // Persist reorder state smoothly after drop / arrow click
    const handlePersistSectionReorder = (sectionName, itemsToPersist) => {
        const otherItems = galleryItems.filter(item => (item.section || 'GALLERY') !== sectionName)
        const reorderedSectionItems = itemsToPersist.map((item, idx) => ({
            ...item,
            section: sectionName,
            displayOrder: idx + 1
        }))
        const mergedAll = [...otherItems, ...reorderedSectionItems]

        setGalleryItems(mergedAll)

        if (isBackendConnected) {
            api.put('/gallery/reorder', mergedAll).catch(err => console.error('Failed to sync reorder to backend:', err))
        } else {
            localStorage.setItem('rg_gallery', JSON.stringify(mergedAll))
            window.dispatchEvent(new Event('rg_gallery_updated'))
        }
    }

    // Instant 1-Click Left/Right Arrow Swap with Butter-Smooth Framer Motion Animation
    const swapItemPosition = (sectionName, itemIndex, delta) => {
        const sectionItems = galleryItems.filter(item => (item.section || 'GALLERY') === sectionName)
        const targetIndex = itemIndex + delta

        if (targetIndex < 0 || targetIndex >= sectionItems.length) return

        const copy = [...sectionItems]
        const temp = copy[itemIndex]
        copy[itemIndex] = copy[targetIndex]
        copy[targetIndex] = temp

        handlePersistSectionReorder(sectionName, copy)
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
                                <span className="status-dot-pulse" />
                                <Wifi size={14} />
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
                                                placeholder="Search name, phone, details..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                            />
                                        </div>

                                        <select
                                            className="filter-select"
                                            value={categoryFilter}
                                            onChange={(e) => setCategoryFilter(e.target.value)}
                                            title="Filter by Purpose Category"
                                        >
                                            {categoryFilterOptions.map(cat => (
                                                <option key={cat} value={cat}>
                                                    {cat === 'ALL' ? 'All Categories' : cat}
                                                </option>
                                            ))}
                                        </select>

                                        <select
                                            className="filter-select"
                                            value={statusFilter}
                                            onChange={(e) => setStatusFilter(e.target.value)}
                                            title="Filter by Status"
                                        >
                                            {statusOptions.map(st => (
                                                <option key={st} value={st}>
                                                    {st === 'ALL' ? 'All Statuses' : st}
                                                </option>
                                            ))}
                                        </select>

                                        <button className="refresh-btn" onClick={fetchEnquiries} title="Refresh Enquiries">
                                            <RefreshCw size={13} className={loading ? 'spin' : ''} />
                                        </button>
                                    </div>

                                    <div className="toolbar-right">
                                        <button
                                            className="btn btn-secondary btn-sm"
                                            onClick={() => handleExportCSV(true)}
                                            title="Export Admissions Only to Excel"
                                        >
                                            <FileSpreadsheet size={15} /> Export Admissions
                                        </button>
                                        <button
                                            className="btn btn-secondary btn-sm"
                                            onClick={() => handleExportCSV(false)}
                                            title="Export All Enquiries to Excel"
                                        >
                                            <Download size={15} /> Export All
                                        </button>
                                        <button
                                            className={`btn btn-secondary btn-sm ${isAnalyticsOpen ? 'active-analytics' : ''}`}
                                            onClick={() => setIsAnalyticsOpen(true)}
                                        >
                                            <BarChart2 size={15} /> Analytics
                                        </button>
                                        <button className="btn-logout" onClick={handleLogout} title="Logout">
                                            <LogOut size={15} />
                                        </button>
                                    </div>
                                </div>

                                <div className="admin-enquiries-list">
                                    {enquiries.length > 0 ? (
                                        enquiries.map((enq) => {
                                            const isUnread = !enq.isRead
                                            const cat = enq.category || 'ADMISSION'
                                            return (
                                                <div
                                                    key={enq.id}
                                                    className={`admin-enquiry-card ${isUnread ? 'unread' : ''}`}
                                                    onClick={() => handleOpenDetail(enq)}
                                                >
                                                    <div className="enquiry-card-header">
                                                        <div className="student-info">
                                                            {isUnread && <span className="unread-dot" title="Unread Enquiry" />}
                                                            <span className={`category-badge-chip cat-${cat.toLowerCase()}`}>
                                                                {cat}
                                                            </span>
                                                            <h5 className={isUnread ? 'bold-text' : ''}>
                                                                {enq.parentName || enq.studentName || 'Visitor'}
                                                            </h5>
                                                            {cat === 'ADMISSION' && enq.studentName && (
                                                                <span className="parent-subtext">
                                                                    Student: <strong>{enq.studentName}</strong>
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="card-right-group">
                                                            <span className={`status-pill status-${(enq.status || 'NEW').toLowerCase()}`}>
                                                                {enq.status || 'NEW'}
                                                            </span>
                                                            <button
                                                                className="whatsapp-btn-sm"
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    openWhatsApp(enq)
                                                                }}
                                                                title="Open WhatsApp Chat"
                                                            >
                                                                <Send size={13} /> WhatsApp
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div className="enquiry-card-details">
                                                        {cat === 'ADMISSION' && (enq.classApplyingFor || enq.classAppliedFor) && (
                                                            <span><GraduationCap size={13} /> Class: <strong>{enq.classApplyingFor || enq.classAppliedFor}</strong></span>
                                                        )}
                                                        <span><PhoneCall size={13} /> {enq.parentPhone || enq.phone}</span>
                                                        {enq.createdAt && (
                                                            <span><Clock size={13} /> {new Date(enq.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</span>
                                                        )}
                                                    </div>

                                                    {enq.message && (
                                                        <p className="enquiry-msg-snippet">{enq.message}</p>
                                                    )}
                                                </div>
                                            )
                                        })
                                    ) : (
                                        <div className="admin-empty-state">
                                            <AlertCircle size={30} />
                                            <p>No enquiries found matching your filter criteria.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* ANNOUNCEMENTS TAB CONTENT */}
                        {activeTab === 'notices' && (
                            <div className="tab-pane">
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
                                        <button className="btn-logout" onClick={handleLogout} title="Logout">
                                            <LogOut size={15} />
                                        </button>
                                    </div>
                                </div>

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
                                                            className={`pin-btn ${item.isPinned ? 'pinned' : ''}`}
                                                            onClick={() => handleTogglePin(item)}
                                                            title={item.isPinned ? 'Unpin Notice' : 'Pin Notice'}
                                                        >
                                                            <Pin size={15} />
                                                        </button>
                                                        <button
                                                            className="edit-btn"
                                                            onClick={() => handleOpenForm(item)}
                                                            title="Edit Notice"
                                                        >
                                                            <Edit2 size={15} />
                                                        </button>
                                                        <button
                                                            className="delete-btn"
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
                                            <p>No announcements found.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* ULTRA-SMOOTH SECTIONAL GALLERY MANAGER DASHBOARD */}
                        {activeTab === 'gallery' && (
                            <div className="tab-pane">
                                <div className="dashboard-toolbar">
                                    <div>
                                        <h4>Sectional Photo Gallery Dashboard</h4>
                                        <p className="sub-hint-text">Hold & drag photos or use ← / → buttons to swap priority live on your site.</p>
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
                                            onReorder={(newItems) => handleReorderSectionLocal('FACILITIES', newItems)}
                                            className="horizontal-strip-reorder"
                                        >
                                            {facilitiesPhotos.map((img, idx) => (
                                                <Reorder.Item
                                                    key={img.id || idx}
                                                    value={img}
                                                    layout
                                                    className="photo-swap-card"
                                                    whileDrag={{ scale: 1.06, zIndex: 99, boxShadow: '0 12px 28px rgba(0,0,0,0.25)' }}
                                                    onDragEnd={() => handlePersistSectionReorder('FACILITIES', facilitiesPhotos)}
                                                >
                                                    <div className="card-image-box">
                                                        <img src={img.imageUrl} alt={img.title} draggable={false} />
                                                        <span className="order-number-badge">#{idx + 1}</span>
                                                    </div>

                                                    <div className="card-details">
                                                        <h5 title={img.title}>{img.title}</h5>
                                                        <span className="cat-tag">{img.category || 'Facilities'}</span>
                                                    </div>

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
                                            onReorder={(newItems) => handleReorderSectionLocal('HIGHLIGHTS', newItems)}
                                            className="horizontal-strip-reorder"
                                        >
                                            {highlightsPhotos.map((img, idx) => (
                                                <Reorder.Item
                                                    key={img.id || idx}
                                                    value={img}
                                                    layout
                                                    className="photo-swap-card"
                                                    whileDrag={{ scale: 1.06, zIndex: 99, boxShadow: '0 12px 28px rgba(0,0,0,0.25)' }}
                                                    onDragEnd={() => handlePersistSectionReorder('HIGHLIGHTS', highlightsPhotos)}
                                                >
                                                    <div className="card-image-box">
                                                        <img src={img.imageUrl} alt={img.title} draggable={false} />
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
                                            onReorder={(newItems) => handleReorderSectionLocal('GALLERY', newItems)}
                                            className="horizontal-strip-reorder"
                                        >
                                            {galleryPhotos.map((img, idx) => (
                                                <Reorder.Item
                                                    key={img.id || idx}
                                                    value={img}
                                                    layout
                                                    className="photo-swap-card"
                                                    whileDrag={{ scale: 1.06, zIndex: 99, boxShadow: '0 12px 28px rgba(0,0,0,0.25)' }}
                                                    onDragEnd={() => handlePersistSectionReorder('GALLERY', galleryPhotos)}
                                                >
                                                    <div className="card-image-box">
                                                        <img src={img.imageUrl} alt={img.title} draggable={false} />
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

            {/* ENQUIRY DETAIL MODAL (PREMIUM SPACIOUS UI FIX) */}
            <AnimatePresence>
                {isDetailOpen && selectedEnquiry && (
                    <div className="form-modal-backdrop" onClick={() => setIsDetailOpen(false)}>
                        <motion.div
                            className="form-modal-card enquiry-detail-modal"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="form-modal-header">
                                <div className="modal-header-title-wrap">
                                    <span className={`category-badge-chip cat-${(selectedEnquiry.category || 'ADMISSION').toLowerCase()}`}>
                                        {selectedEnquiry.category || 'ADMISSION'}
                                    </span>
                                    <h4>Enquiry Details #{selectedEnquiry.id}</h4>
                                </div>
                                <button className="admin-close-icon" onClick={() => setIsDetailOpen(false)}>
                                    <X size={16} />
                                </button>
                            </div>

                            <div className="enquiry-modal-body">
                                <div className="info-grid">
                                    <div className="info-item">
                                        <span className="info-label">Contact / Parent Name</span>
                                        <p className="info-value">{selectedEnquiry.parentName || selectedEnquiry.studentName || 'Visitor'}</p>
                                    </div>

                                    {(selectedEnquiry.category || 'ADMISSION') === 'ADMISSION' && (
                                        <>
                                            <div className="info-item">
                                                <span className="info-label">Student Name</span>
                                                <p className="info-value">{selectedEnquiry.studentName || 'N/A'}</p>
                                            </div>
                                            <div className="info-item">
                                                <span className="info-label">Class Applying For</span>
                                                <p className="info-value highlight">{selectedEnquiry.classApplyingFor || selectedEnquiry.classAppliedFor || 'N/A'}</p>
                                            </div>
                                        </>
                                    )}

                                    <div className="info-item">
                                        <span className="info-label">Phone Number</span>
                                        <p className="info-value">{selectedEnquiry.parentPhone || selectedEnquiry.phone || 'N/A'}</p>
                                    </div>

                                    <div className="info-item">
                                        <span className="info-label">Email Address</span>
                                        <p className="info-value">{selectedEnquiry.parentEmail || selectedEnquiry.email || 'N/A'}</p>
                                    </div>

                                    <div className="info-item">
                                        <span className="info-label">Submitted Date</span>
                                        <p className="info-value">{selectedEnquiry.createdAt ? new Date(selectedEnquiry.createdAt).toLocaleString() : 'N/A'}</p>
                                    </div>

                                    <div className="info-item">
                                        <span className="info-label">Current Status</span>
                                        <select
                                            value={selectedEnquiry.status || 'NEW'}
                                            onChange={(e) => handleStatusChange(selectedEnquiry.id, e.target.value)}
                                            className="modal-status-select"
                                        >
                                            {statusOptions.filter(s => s !== 'ALL').map(st => (
                                                <option key={st} value={st}>{st}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="info-item full-width mt-3">
                                    <span className="info-label">Message / Notes</span>
                                    <div className="message-box">
                                        {selectedEnquiry.message || 'No additional details provided.'}
                                    </div>
                                </div>
                            </div>

                            <div className="form-actions modal-footer-actions">
                                <button className="whatsapp-btn-lg" onClick={() => openWhatsApp(selectedEnquiry)}>
                                    <Send size={15} /> Chat on WhatsApp
                                </button>
                                <button className="btn btn-outline" onClick={() => setIsDetailOpen(false)}>
                                    Close
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ANALYTICS MODAL */}
            <AnimatePresence>
                {isAnalyticsOpen && (
                    <div className="form-modal-backdrop" onClick={() => setIsAnalyticsOpen(false)}>
                        <motion.div
                            className="form-modal-card analytics-modal"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="form-modal-header">
                                <div>
                                    <h4>Enquiry Analytics & Insights</h4>
                                    <p className="sub-text">Overview of parent enquiries and conversion performance</p>
                                </div>
                                <button className="admin-close-icon" onClick={() => setIsAnalyticsOpen(false)}>
                                    <X size={16} />
                                </button>
                            </div>

                            <div className="analytics-modal-body">
                                <div className="analytics-controls">
                                    <div className="time-range-toggle">
                                        <button
                                            className={analyticsRange === 'week' ? 'active' : ''}
                                            onClick={() => setAnalyticsRange('week')}
                                        >
                                            This Week
                                        </button>
                                        <button
                                            className={analyticsRange === 'month' ? 'active' : ''}
                                            onClick={() => setAnalyticsRange('month')}
                                        >
                                            This Month
                                        </button>
                                        <button
                                            className={analyticsRange === 'year' ? 'active' : ''}
                                            onClick={() => setAnalyticsRange('year')}
                                        >
                                            This Year
                                        </button>
                                    </div>
                                </div>

                                <div className="analytics-summary-card">
                                    <h5>
                                        Period Total: <strong>{analyticsData.total || 0} enquiries</strong>
                                    </h5>
                                    <p className="status-summary-line">
                                        {analyticsData.total || 0} total —{' '}
                                        <span className="summary-new">{analyticsData.statusBreakdown?.NEW || 0} New</span>,{' '}
                                        <span className="summary-contacted">{analyticsData.statusBreakdown?.CONTACTED || 0} Contacted</span>,{' '}
                                        <span className="summary-enrolled">{analyticsData.statusBreakdown?.ENROLLED || 0} Enrolled</span>,{' '}
                                        <span className="summary-closed">{analyticsData.statusBreakdown?.CLOSED || 0} Closed</span>
                                    </p>
                                </div>

                                <div className="analytics-chart-container">
                                    <ResponsiveContainer width="100%" height={240}>
                                        <BarChart data={analyticsData.timeline || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                            <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                                            <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                                            <Tooltip
                                                contentStyle={{
                                                    background: '#1e1e32',
                                                    border: '1px solid #33334d',
                                                    borderRadius: '8px',
                                                    color: '#fff',
                                                    fontSize: '12px'
                                                }}
                                            />
                                            <Bar dataKey="count" fill="#800000" radius={[4, 4, 0, 0]} name="Enquiries" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ANNOUNCEMENT FORM MODAL */}
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

            {/* UPLOAD / EDIT PHOTO MODAL */}
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
