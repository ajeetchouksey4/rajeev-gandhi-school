import React, { useState } from 'react'
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
import './App.css'

function App() {
  const [isAdminOpen, setIsAdminOpen] = useState(false)
  const [announcementsData, setAnnouncementsData] = useState([])

  return (
    <div className="app">
      <Navbar onOpenAdmin={() => setIsAdminOpen(true)} />
      <Hero />
      <Announcements
        externalAnnouncements={announcementsData}
        onOpenAdmin={() => setIsAdminOpen(true)}
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
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onDataChange={(data) => setAnnouncementsData(data)}
      />
    </div>
  )
}

export default App
