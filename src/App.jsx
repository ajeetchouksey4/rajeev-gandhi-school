import React, { useState, useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Announcements from './components/Announcements'
import AdminPanel from './components/AdminPanel'
import About from './components/About'
import PrincipalDesk from './components/PrincipalDesk'
import Academics from './components/Academics'
import Facilities from './components/Facilities'
import RecentActivities from './components/RecentActivities'
import Gallery from './components/Gallery'
import Testimonials from './components/Testimonials'
import Admissions from './components/Admissions'
import Contact from './components/Contact'
import Footer from './components/Footer'
import BackToTop from './components/BackToTop'
import api from './api/api'
import './App.css'

function App() {
  const [announcementsData, setAnnouncementsData] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const res = await api.get('/announcements')
        const data = await res.json()
        if (Array.isArray(data)) {
          setAnnouncementsData(data)
        }
      } catch (err) {
        console.warn('Frontend initial fetch failed, loading from local storage:', err.message)
        const saved = localStorage.getItem('rg_announcements')
        const localData = saved ? JSON.parse(saved) : []
        setAnnouncementsData(localData)
      }
    }
    fetchInitialData()
  }, [])

  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="app">
            <Navbar onOpenAdmin={() => navigate('/admin')} />
            <Hero />
            <Announcements
              externalAnnouncements={announcementsData}
              onOpenAdmin={() => navigate('/admin')}
            />
            <About />
            <PrincipalDesk />
            <Academics />
            <Facilities />
            <RecentActivities />
            <Gallery />
            <Testimonials />
            <Admissions />
            <Contact />
            <Footer />
            <BackToTop />
          </div>
        }
      />
      <Route
        path="/admin"
        element={
          <AdminPanel
            onDataChange={(data) => setAnnouncementsData(data)}
          />
        }
      />
    </Routes>
  )
}

export default App
