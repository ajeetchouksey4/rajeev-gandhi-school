import React from 'react'
import { GraduationCap, Facebook, Instagram, Youtube, Twitter } from 'lucide-react'
import './Footer.css'

const Footer = () => (
    <footer className="footer">
        <div className="container">
            <div className="footer-grid">
                <div className="footer-about">
                    <div className="footer-logo">
                        <GraduationCap size={24} />
                        <span>Rajiv Gandhi Convent HSS</span>
                    </div>
                    <p>
                        Affiliated to MPBSE, providing quality education from Nursery to Class 12th. Building future leaders with values and knowledge.
                    </p>
                    <div className="footer-socials">
                        <a href="#" aria-label="Facebook"><Facebook size={18} /></a>
                        <a href="#" aria-label="Instagram"><Instagram size={18} /></a>
                        <a href="#" aria-label="Youtube"><Youtube size={18} /></a>
                        <a href="#" aria-label="Twitter"><Twitter size={18} /></a>
                    </div>
                </div>

                <div className="footer-links-col">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><a href="#home">Home</a></li>
                        <li><a href="#about">About Us</a></li>
                        <li><a href="#academics">Academics</a></li>
                        <li><a href="#facilities">Facilities</a></li>
                        <li><a href="#gallery">Gallery</a></li>
                        <li><a href="#contact">Contact</a></li>
                    </ul>
                </div>

                <div className="footer-links-col">
                    <h4>Academics</h4>
                    <ul>
                        <li><a href="#academics">Pre-Primary (Nursery–UKG)</a></li>
                        <li><a href="#academics">Primary (1–5)</a></li>
                        <li><a href="#academics">Middle School (6–8)</a></li>
                        <li><a href="#academics">Secondary (9–10)</a></li>
                        <li><a href="#academics">Higher Secondary (11–12)</a></li>
                    </ul>
                </div>

                <div className="footer-links-col">
                    <h4>Important</h4>
                    <ul>
                        <li><a href="#admissions">Admissions 2026-27</a></li>
                        <li><a href="#">Fee Structure</a></li>
                        <li><a href="#">School Calendar</a></li>
                        <li><a href="#">Results</a></li>
                        <li><a href="#">Mandatory Disclosure</a></li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                <p>&copy; 2026 Rajiv Gandhi Convent Higher Secondary School. All rights reserved.</p>
                <p>Affiliated to <strong>MPBSE</strong> · Madhya Pradesh Board of Secondary Education</p>
            </div>
        </div>
    </footer>
)

export default Footer
