import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
    Image,
    UploadCloud,
    ArrowUp,
    ArrowDown
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
const galleryCategoryOptions = ['ALL', 'FACILITY', 'HIGHLIGHT', 'GENERAL']

const loadCloudinaryWidgetScript = () => {
    return new Promise((resolve, reject) => {
        if (window.cloudinary && window.cloudinary.createUploadWidget) {
            return resolve(window.cloudinary)
        }
        const existingScript = document.getElementById('cloudinary-upload-widget-script')
        if (existingScript) {
            if (window.cloudinary && window.cloudinary.createUploadWidget) {
                return resolve(window.cloudinary)
            }
            existingScript.addEventListener('load', () => resolve(window.cloudinary))
            existingScript.addEventListener('error', (err) => reject(err))
            return
        }
        const script = document.createElement('script')
        script.id = 'cloudinary-upload-widget-script'
        script.src = 'https://upload-widget.cloudinary.com/global/all.js'
        script.async = true
        script.onload = () => resolve(window.cloudinary)
        script.onerror = (err) => reject(new Error('Failed to load Cloudinary Upload Widget script'))
        document.body.appendChild(script)
    })
}

const initialMockGallery = [
    {
        id: 1,
        imageUrl: 'https://res.cloudinary.com/dzckejmbq/image/upload/v1778142942/trophy1_bz0ht0.jpg',
        category: 'GENERAL',
        title: 'Annual Day Celebration',
        description: 'Vibrant cultural performances and awards ceremony.',
        eventDate: 'Feb 2026',
        displayOrder: 1
    },
    {
        id: 2,
        imageUrl: 'https://res.cloudinary.com/dzckejmbq/image/upload/v1778130550/lab_sdvj0y.jpg',
        category: 'FACILITY',
        title: 'Composite Science Laboratory',
        description: 'Modern equipment for physics, chemistry, and biology experiments.',
        eventDate: '',
        displayOrder: 2
    },
    {
        id: 3,
        imageUrl: 'https://res.cloudinary.com/dzckejmbq/image/upload/v1778142942/trophy3_vrtlrd.jpg',
        category: 'HIGHLIGHT',
        title: 'Sports Day Championship 2026',
        description: 'Inter-house championship and athletic track events.',
        eventDate: 'Jan 2026',
        displayOrder: 3
    }
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

const AdminPanel = ({ isOpen, onClose, onDataChange }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [passcode, setPasscode] = useState('')
    const [authError, setAuthError] = useState('')
    const [activeTab, setActiveTab] = useState('enquiries') // 'enquiries' | 'notices'

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
    const [galleryImages, setGalleryImages] = useState([])
    const [galleryCategoryFilter, setGalleryCategoryFilter] = useState('ALL')
    const [isGalleryFormOpen, setIsGalleryFormOpen] = useState(false)
    const [galleryFormData, setGalleryFormData] = useState({
        imageUrl: '',
        category: 'GENERAL',
        title: '',
        description: '',
        eventDate: '',
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

    // Fetch Gallery Images
    const fetchGalleryImages = async () => {
        setLoading(true)
        try {
            let endpoint = '/gallery'
            if (galleryCategoryFilter && galleryCategoryFilter !== 'ALL') {
                endpoint += `?category=${galleryCategoryFilter}`
            }
            const res = await api.get(endpoint)
            const data = await res.json()
            if (Array.isArray(data)) {
                setGalleryImages(data)
                setIsBackendConnected(true)
            }
        } catch (err) {
            console.warn('Failed to fetch gallery images from backend, using local storage fallback:', err.message)
            setIsBackendConnected(false)
            const saved = localStorage.getItem('rg_gallery_images')
            const localData = saved !== null ? JSON.parse(saved) : initialMockGallery
            let filtered = [...localData]
            if (galleryCategoryFilter && galleryCategoryFilter !== 'ALL') {
                filtered = filtered.filter(item => (item.category || 'GENERAL') === galleryCategoryFilter)
            }
            filtered.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
            setGalleryImages(filtered)
        } finally {
            setLoading(false)
        }
    }

    // Cloudinary credentials state
    const [cloudName, setCloudName] = useState(() => localStorage.getItem('rg_cloudinary_cloud_name') || import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dzckejmbq')
    const [uploadPreset, setUploadPreset] = useState(() => localStorage.getItem('rg_cloudinary_preset') || import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'rg_school_preset')
    const [showCloudinarySettings, setShowCloudinarySettings] = useState(false)

    const handleSaveCloudinarySettings = (newCloudName, newPreset) => {
        setCloudName(newCloudName)
        setUploadPreset(newPreset)
        localStorage.setItem('rg_cloudinary_cloud_name', newCloudName)
        localStorage.setItem('rg_cloudinary_preset', newPreset)
    }

    const handleOpenCloudinaryWidget = async () => {
        try {
            const cloudinary = await loadCloudinaryWidgetScript()
            if (!cloudinary || !cloudinary.createUploadWidget) {
                alert('Cloudinary widget SDK could not be loaded. Please check your internet connection.')
                return
            }

            const activeCloudName = cloudName || import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dzckejmbq'
            const activePreset = uploadPreset || import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'rg_school_preset'

            const widget = cloudinary.createUploadWidget(
                {
                    cloudName: activeCloudName,
                    uploadPreset: activePreset,
                    folder: 'rajeev-gandhi-school',
                    clientAllowedFormats: ['jpg', 'png', 'webp', 'jpeg'],
                    maxFileSize: 5242880, // 5MB
                    multiple: false,
                    sources: ['local', 'url', 'camera', 'image_search', 'google_drive', 'unsplash'],
                },
                (error, result) => {
                    if (!error && result && result.event === 'success') {
                        const url = result.info.secure_url
                        setGalleryFormData((prev) => ({ ...prev, imageUrl: url }))
                    } else if (error) {
                        console.error('Cloudinary upload error:', error)
                    }
                }
            )
            widget.open()
        } catch (err) {
            alert(`Could not launch Cloudinary widget: ${err.message}`)
        }
    }

    const handleSaveGalleryImage = async (e) => {
        e.preventDefault()
        if (!galleryFormData.imageUrl) {
            alert('Please upload or enter an image URL first!')
            return
        }

        const payload = {
            imageUrl: galleryFormData.imageUrl,
            category: galleryFormData.category || 'GENERAL',
            title: galleryFormData.title || null,
            description: galleryFormData.description || null,
            eventDate: galleryFormData.eventDate || null,
            displayOrder: parseInt(galleryFormData.displayOrder, 10) || 0
        }

        if (isBackendConnected) {
            try {
                await api.post('/gallery', payload)
                await fetchGalleryImages()
            } catch (err) {
                alert(`Backend Gallery Save Error: ${err.message}`)
            }
        } else {
            const saved = localStorage.getItem('rg_gallery_images')
            const list = saved !== null ? JSON.parse(saved) : initialMockGallery
            const newItem = { id: Date.now(), ...payload }
            const updated = [newItem, ...list]
            localStorage.setItem('rg_gallery_images', JSON.stringify(updated))
            setGalleryImages(updated)
        }

        setIsGalleryFormOpen(false)
        setGalleryFormData({
            imageUrl: '',
            category: 'GENERAL',
            title: '',
            description: '',
            eventDate: '',
            displayOrder: 0
        })
    }

    const handleDeleteGalleryImage = async (id) => {
        if (!window.confirm('Are you sure you want to delete this gallery image?')) return

        if (isBackendConnected) {
            try {
                await api.delete(`/gallery/${id}`)
                await fetchGalleryImages()
            } catch (err) {
                alert(`Backend Delete Error: ${err.message}`)
            }
        } else {
            const saved = localStorage.getItem('rg_gallery_images')
            const list = saved !== null ? JSON.parse(saved) : initialMockGallery
            const updated = list.filter(item => item.id !== id)
            localStorage.setItem('rg_gallery_images', JSON.stringify(updated))
            setGalleryImages(updated)
        }
    }

    const handleUpdateGalleryOrder = async (id, currentOrder, direction) => {
        const newOrder = direction === 'up' ? Math.max(0, currentOrder - 1) : currentOrder + 1
        if (isBackendConnected) {
            try {
                await api.patch(`/gallery/${id}/order`, { displayOrder: newOrder })
                await fetchGalleryImages()
            } catch (err) {
                alert(`Error updating order: ${err.message}`)
            }
        } else {
            const saved = localStorage.getItem('rg_gallery_images')
            const list = saved !== null ? JSON.parse(saved) : initialMockGallery
            const updated = list.map(item => item.id === id ? { ...item, displayOrder: newOrder } : item)
            localStorage.setItem('rg_gallery_images', JSON.stringify(updated))
            setGalleryImages(updated.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)))
        }
    }

    useEffect(() => {
        if (isOpen) {
            fetchAnnouncements()
            fetchEnquiries()
            fetchGalleryImages()
        }
    }, [isOpen, categoryFilter, statusFilter, searchQuery, galleryCategoryFilter])

    useEffect(() => {
        if (isAnalyticsOpen) {
            fetchAnalytics(analyticsRange, analyticsCategoryScope)
        }
    }, [isAnalyticsOpen, analyticsRange, analyticsCategoryScope])

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
                fetchEnquiries()
                fetchAnnouncements()
                fetchGalleryImages()
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
                fetchGalleryImages()
            } else {
                setAuthError('Invalid admin password or backend unreachable.')
            }
        } finally {
            setLoading(false)
        }
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

                {/* Main Body */}
                {!isAuthenticated ? (
                    <div className="admin-login-card">
                        <div className="login-icon-box">
                            <Lock size={28} />
                        </div>
                        <h4>Admin Portal Access</h4>
                        <p>Enter the administrator passcode to access enquiries, analytics, and announcements.</p>

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
                    <div className="admin-dashboard">
                        {/* Sidebar / Navigation Tabs */}
                        <div className="admin-nav-tabs">
                            <button
                                className={`nav-tab-btn ${activeTab === 'enquiries' ? 'active' : ''}`}
                                onClick={() => setActiveTab('enquiries')}
                            >
                                <MessageSquare size={16} />
                                <span>Enquiries</span>
                                {unreadCount > 0 && (
                                    <span className="unread-badge-chip">{unreadCount}</span>
                                )}
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
                                <Image size={16} />
                                <span>Gallery</span>
                                <span className="tab-count-chip">{galleryImages.length}</span>
                            </button>
                        </div>

                        {/* ENQUIRIES TAB CONTENT */}
                        {activeTab === 'enquiries' && (
                            <div className="tab-pane">
                                {/* Toolbar */}
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
                                        <button className="btn-logout" onClick={() => setIsAuthenticated(false)} title="Logout">
                                            <LogOut size={15} />
                                        </button>
                                    </div>
                                </div>

                                {/* Enquiry Table / Cards List */}
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
                                        <button className="btn-logout" onClick={() => setIsAuthenticated(false)} title="Logout">
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

                        {/* GALLERY TAB CONTENT */}
                        {activeTab === 'gallery' && (
                            <div className="tab-pane">
                                <div className="dashboard-toolbar">
                                    <div className="toolbar-left search-and-filter">
                                        <h4>Gallery Manager ({galleryImages.length})</h4>
                                        <select
                                            className="filter-select"
                                            value={galleryCategoryFilter}
                                            onChange={(e) => setGalleryCategoryFilter(e.target.value)}
                                            title="Filter Gallery Category"
                                        >
                                            {galleryCategoryOptions.map(cat => (
                                                <option key={cat} value={cat}>
                                                    {cat === 'ALL' ? 'All Categories' : cat}
                                                </option>
                                            ))}
                                        </select>
                                        <button className="refresh-btn" onClick={fetchGalleryImages} title="Refresh Gallery Data">
                                            <RefreshCw size={13} className={loading ? 'spin' : ''} />
                                        </button>
                                    </div>
                                    <div className="toolbar-right">
                                        <button className="btn btn-primary btn-sm" onClick={() => setIsGalleryFormOpen(true)}>
                                            <Plus size={15} /> Add Gallery Image
                                        </button>
                                        <button className="btn-logout" onClick={() => setIsAuthenticated(false)} title="Logout">
                                            <LogOut size={15} />
                                        </button>
                                    </div>
                                </div>

                                <div className="admin-gallery-grid">
                                    {galleryImages.length > 0 ? (
                                        galleryImages.map((img) => (
                                            <div key={img.id} className="admin-gallery-card">
                                                <div className="gallery-card-thumb">
                                                    <img src={img.imageUrl} alt={img.title || 'Gallery item'} />
                                                    <span className={`category-badge-chip cat-${(img.category || 'GENERAL').toLowerCase()}`}>
                                                        {img.category}
                                                    </span>
                                                    <span className="order-badge">Order: #{img.displayOrder ?? 0}</span>
                                                </div>
                                                <div className="gallery-card-body">
                                                    <h5>{img.title || 'Untitled Photo'}</h5>
                                                    {img.description && <p className="gallery-card-desc">{img.description}</p>}
                                                    {img.eventDate && <span className="gallery-card-date">📅 {img.eventDate}</span>}
                                                </div>
                                                <div className="gallery-card-actions">
                                                    <div className="order-controls">
                                                        <button
                                                            className="icon-action-btn order-btn"
                                                            onClick={() => handleUpdateGalleryOrder(img.id, img.displayOrder || 0, 'up')}
                                                            title="Move Up (Decrease order number)"
                                                        >
                                                            <ArrowUp size={14} />
                                                        </button>
                                                        <button
                                                            className="icon-action-btn order-btn"
                                                            onClick={() => handleUpdateGalleryOrder(img.id, img.displayOrder || 0, 'down')}
                                                            title="Move Down (Increase order number)"
                                                        >
                                                            <ArrowDown size={14} />
                                                        </button>
                                                    </div>
                                                    <button
                                                        className="icon-action-btn delete-btn"
                                                        onClick={() => handleDeleteGalleryImage(img.id)}
                                                        title="Delete Image"
                                                    >
                                                        <Trash2 size={15} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="admin-empty-state">
                                            <AlertCircle size={30} />
                                            <p>No gallery images uploaded yet for this category.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </motion.div>

            {/* ENQUIRY DETAIL MODAL */}
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
                                <div className="detail-title-group">
                                    <h4>Enquiry Details</h4>
                                    <span className={`category-badge-chip cat-${(selectedEnquiry.category || 'ADMISSION').toLowerCase()}`}>
                                        {selectedEnquiry.category || 'ADMISSION'}
                                    </span>
                                    <span className={`status-pill status-${(selectedEnquiry.status || 'NEW').toLowerCase()}`}>
                                        {selectedEnquiry.status || 'NEW'}
                                    </span>
                                </div>
                                <button className="admin-close-icon" onClick={() => setIsDetailOpen(false)}>
                                    <X size={16} />
                                </button>
                            </div>

                            <div className="enquiry-detail-body">
                                <div className="detail-grid">
                                    <div className="detail-field">
                                        <label><User size={13} /> Contact Name</label>
                                        <p>{selectedEnquiry.parentName || 'N/A'}</p>
                                    </div>
                                    {(selectedEnquiry.category || 'ADMISSION') === 'ADMISSION' && (
                                        <>
                                            <div className="detail-field">
                                                <label><User size={13} /> Student Name</label>
                                                <p>{selectedEnquiry.studentName || 'N/A'}</p>
                                            </div>
                                            <div className="detail-field">
                                                <label><GraduationCap size={13} /> Class Applied For</label>
                                                <p>{selectedEnquiry.classApplyingFor || selectedEnquiry.classAppliedFor || 'N/A'}</p>
                                            </div>
                                        </>
                                    )}
                                    <div className="detail-field">
                                        <label><PhoneCall size={13} /> Phone</label>
                                        <p>{selectedEnquiry.parentPhone || selectedEnquiry.phone}</p>
                                    </div>
                                    <div className="detail-field">
                                        <label><Mail size={13} /> Email</label>
                                        <p>{selectedEnquiry.parentEmail || 'Not provided'}</p>
                                    </div>
                                    <div className="detail-field">
                                        <label><Calendar size={13} /> Received Date</label>
                                        <p>{selectedEnquiry.createdAt ? new Date(selectedEnquiry.createdAt).toLocaleString() : 'N/A'}</p>
                                    </div>
                                </div>

                                <div className="detail-message-box">
                                    <label>Message / Enquiry Details</label>
                                    <p>{selectedEnquiry.message || 'No additional message submitted.'}</p>
                                </div>

                                <div className="status-update-section">
                                    <label>Update Status:</label>
                                    <div className="status-buttons-row">
                                        {['NEW', 'CONTACTED', 'ENROLLED', 'CLOSED'].map((st) => (
                                            <button
                                                key={st}
                                                className={`status-btn-choice ${selectedEnquiry.status === st ? 'selected' : ''}`}
                                                onClick={() => handleStatusChange(selectedEnquiry.id, st)}
                                            >
                                                {st}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="detail-actions-footer">
                                    <button className="btn btn-whatsapp-full" onClick={() => openWhatsApp(selectedEnquiry)}>
                                        <Send size={16} /> Open WhatsApp Chat with Contact
                                    </button>
                                </div>
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
                                <div className="analytics-title-group">
                                    <BarChart2 size={20} className="analytics-icon" />
                                    <h4>Enquiry Analytics & Trends</h4>
                                </div>
                                <button className="admin-close-icon" onClick={() => setIsAnalyticsOpen(false)}>
                                    <X size={16} />
                                </button>
                            </div>

                            <div className="analytics-body">
                                <div className="analytics-range-selector">
                                    <button
                                        className={`range-btn ${analyticsRange === 'week' ? 'active' : ''}`}
                                        onClick={() => setAnalyticsRange('week')}
                                    >
                                        Weekly
                                    </button>
                                    <button
                                        className={`range-btn ${analyticsRange === 'month' ? 'active' : ''}`}
                                        onClick={() => setAnalyticsRange('month')}
                                    >
                                        Monthly
                                    </button>
                                    <button
                                        className={`range-btn ${analyticsRange === 'year' ? 'active' : ''}`}
                                        onClick={() => setAnalyticsRange('year')}
                                    >
                                        Yearly
                                    </button>
                                </div>

                                <div className="analytics-scope-bar">
                                    <button
                                        className={`scope-btn ${analyticsCategoryScope === 'ALL' ? 'active' : ''}`}
                                        onClick={() => setAnalyticsCategoryScope('ALL')}
                                    >
                                        All Enquiries
                                    </button>
                                    <button
                                        className={`scope-btn ${analyticsCategoryScope === 'ADMISSION' ? 'active' : ''}`}
                                        onClick={() => setAnalyticsCategoryScope('ADMISSION')}
                                    >
                                        🎓 Admissions Only
                                    </button>
                                    <button
                                        className={`scope-btn ${analyticsCategoryScope === 'GENERAL' ? 'active' : ''}`}
                                        onClick={() => setAnalyticsCategoryScope('GENERAL')}
                                    >
                                        ❓ General
                                    </button>
                                    <button
                                        className={`scope-btn ${analyticsCategoryScope === 'CAREER' ? 'active' : ''}`}
                                        onClick={() => setAnalyticsCategoryScope('CAREER')}
                                    >
                                        💼 Careers
                                    </button>
                                    <button
                                        className={`scope-btn ${analyticsCategoryScope === 'BUSINESS' ? 'active' : ''}`}
                                        onClick={() => setAnalyticsCategoryScope('BUSINESS')}
                                    >
                                        🤝 Business
                                    </button>
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

            {/* GALLERY IMAGE UPLOAD MODAL */}
            <AnimatePresence>
                {isGalleryFormOpen && (
                    <div className="form-modal-backdrop" onClick={() => setIsGalleryFormOpen(false)}>
                        <motion.div
                            className="form-modal-card gallery-upload-modal"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="form-modal-header">
                                <h4>Add New Gallery Image</h4>
                                <button className="admin-close-icon" onClick={() => setIsGalleryFormOpen(false)}>
                                    <X size={16} />
                                </button>
                            </div>

                            <form onSubmit={handleSaveGalleryImage} className="admin-form">
                                <div className="form-group cloudinary-upload-section">
                                    <label>Cloudinary Image Upload *</label>
                                    <div className="cloudinary-box-trigger">
                                        <button
                                            type="button"
                                            className="btn btn-cloudinary-widget"
                                            onClick={handleOpenCloudinaryWidget}
                                        >
                                            <UploadCloud size={20} />
                                            <span>Upload Image via Cloudinary Widget</span>
                                        </button>
                                         <p className="upload-hint">Uploads directly to Cloudinary folder (JPG, PNG, WEBP, max 5MB)</p>
                                        <button
                                            type="button"
                                            className="btn-link-settings"
                                            onClick={() => setShowCloudinarySettings(!showCloudinarySettings)}
                                        >
                                            {showCloudinarySettings ? '⚙️ Hide Settings' : '⚙️ Configure Cloud Name & Preset'}
                                        </button>
                                    </div>

                                    {showCloudinarySettings && (
                                        <div className="cloudinary-config-box">
                                            <div className="form-group margin-top-xs">
                                                <label className="text-xs">Cloud Name</label>
                                                <input
                                                    type="text"
                                                    value={cloudName}
                                                    onChange={(e) => handleSaveCloudinarySettings(e.target.value, uploadPreset)}
                                                    placeholder="Cloud Name e.g. dzckejmbq"
                                                />
                                            </div>
                                            <div className="form-group margin-top-xs">
                                                <label className="text-xs">Unsigned Upload Preset</label>
                                                <input
                                                    type="text"
                                                    value={uploadPreset}
                                                    onChange={(e) => handleSaveCloudinarySettings(cloudName, e.target.value)}
                                                    placeholder="Upload Preset e.g. rg_school_preset"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {galleryFormData.imageUrl ? (
                                        <div className="image-preview-container">
                                            <img src={galleryFormData.imageUrl} alt="Uploaded preview" />
                                            <span className="preview-label">Image URL: {galleryFormData.imageUrl}</span>
                                        </div>
                                    ) : (
                                        <div className="form-group margin-top-sm">
                                            <input
                                                type="url"
                                                placeholder="Or paste direct Cloudinary image URL..."
                                                value={galleryFormData.imageUrl}
                                                onChange={(e) => setGalleryFormData({ ...galleryFormData, imageUrl: e.target.value })}
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="form-row-2">
                                    <div className="form-group">
                                        <label>Gallery Category *</label>
                                        <select
                                            value={galleryFormData.category}
                                            onChange={(e) => setGalleryFormData({ ...galleryFormData, category: e.target.value })}
                                            required
                                        >
                                            <option value="GENERAL">General</option>
                                            <option value="FACILITY">Facility</option>
                                            <option value="HIGHLIGHT">Highlight</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>Display Order (Priority #)</label>
                                        <input
                                            type="number"
                                            placeholder="e.g. 1, 2, 3"
                                            value={galleryFormData.displayOrder}
                                            onChange={(e) => setGalleryFormData({ ...galleryFormData, displayOrder: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Title (Optional)</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Science Exhibition 2026"
                                        value={galleryFormData.title}
                                        onChange={(e) => setGalleryFormData({ ...galleryFormData, title: e.target.value })}
                                    />
                                </div>

                                {galleryFormData.category === 'HIGHLIGHT' && (
                                    <div className="form-group">
                                        <label>Event Date (Relevant for Highlights)</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. February 2026"
                                            value={galleryFormData.eventDate}
                                            onChange={(e) => setGalleryFormData({ ...galleryFormData, eventDate: e.target.value })}
                                        />
                                    </div>
                                )}

                                <div className="form-group">
                                    <label>Description (Optional)</label>
                                    <textarea
                                        rows={3}
                                        placeholder="Brief caption or description of the photo..."
                                        value={galleryFormData.description}
                                        onChange={(e) => setGalleryFormData({ ...galleryFormData, description: e.target.value })}
                                    />
                                </div>

                                <div className="form-actions">
                                    <button type="button" className="btn btn-outline" onClick={() => setIsGalleryFormOpen(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary" disabled={!galleryFormData.imageUrl}>
                                        Save Gallery Image
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
