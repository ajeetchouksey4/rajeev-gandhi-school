import React from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
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
  return (
    <div className="app">
      <Navbar />
      <Hero />
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
  )
}

export default App
