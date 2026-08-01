import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, CheckCircle, Rocket, HelpCircle } from 'lucide-react'
import api from '../api/api'
import './Admissions.css'

const classOptions = [
    'Nursery', 'LKG', 'UKG',
    'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
    'Class 6', 'Class 7', 'Class 8',
    'Class 9', 'Class 10',
    'Class 11 – Science', 'Class 11 – Commerce', 'Class 11 – Arts',
    'Class 12 – Science', 'Class 12 – Commerce', 'Class 12 – Arts',
]

const steps = [
    { num: '01', title: 'Enquiry', desc: 'Visit school or call us' },
    { num: '02', title: 'Registration', desc: 'Fill the admission form' },
    { num: '03', title: 'Interaction', desc: 'Student & parent interview' },
    { num: '04', title: 'Enrollment', desc: 'Confirmation & fee payment' },
]

const categoryOptions = [
    { value: 'ADMISSION', label: '🎓 Student Admission' },
    { value: 'GENERAL', label: '❓ General Enquiry' },
    { value: 'CAREER', label: '💼 Teacher / Job Application' },
    { value: 'BUSINESS', label: '🤝 Business / Vendor / Advertisement' },
]

const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.1 } }),
}

const SCHOOL_WHATSAPP = '919993112923' // +91 9993112923

const Admissions = () => {
    const [submitted, setSubmitted] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('ADMISSION')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        const form = e.target
        const isAdmission = selectedCategory === 'ADMISSION'

        const enquiryData = {
            category: selectedCategory,
            studentName: isAdmission ? (form.studentName ? form.studentName.value : '') : '',
            parentName: form.parentName ? form.parentName.value : '',
            classApplyingFor: isAdmission ? (form.classFor ? form.classFor.value : '') : '',
            parentPhone: form.parentPhone ? form.parentPhone.value : '',
            parentEmail: form.parentEmail ? form.parentEmail.value : '',
            message: form.message ? form.message.value : '',
        }

        try {
            await api.post('/enquiries', enquiryData)
            setSubmitted(true)

            // Build WhatsApp message with details
            const categoryLabel = categoryOptions.find(c => c.value === selectedCategory)?.label || selectedCategory
            const whatsappMessage = [
                `*New Enquiry (${categoryLabel})*`,
                ``,
                enquiryData.parentName ? `*Name:* ${enquiryData.parentName}` : '',
                enquiryData.studentName ? `*Student Name:* ${enquiryData.studentName}` : '',
                enquiryData.classApplyingFor ? `*Class:* ${enquiryData.classApplyingFor}` : '',
                `*Phone:* ${enquiryData.parentPhone}`,
                enquiryData.parentEmail ? `*Email:* ${enquiryData.parentEmail}` : '',
                enquiryData.message ? `*Message:* ${enquiryData.message}` : '',
            ].filter(Boolean).join('\n')

            const whatsappUrl = `https://wa.me/${SCHOOL_WHATSAPP}?text=${encodeURIComponent(whatsappMessage)}`
            window.open(whatsappUrl, '_blank')
        } catch (err) {
            setError('Something went wrong. Please try again later.')
            console.error('Enquiry submission error:', err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <section className="section admissions" id="admissions">
            <div className="admissions-nebula admissions-nebula-1" />
            <div className="admissions-nebula admissions-nebula-2" />

            <div className="container">
                <div className="admissions-wrapper">
                    <motion.div
                        className="admissions-info"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                    >
                        <span className="section-tag">🚀 Join Us</span>
                        <h2 className="admissions-title">
                            Admissions Open
                            <br />
                            <span className="gradient-text">2026–27</span>
                        </h2>
                        <p className="admissions-desc">
                            Enroll your child in one of the finest MPBSE-affiliated schools. Limited seats available for Nursery to Class 12th.
                        </p>

                        <div className="admission-steps">
                            {steps.map((s, i) => (
                                <motion.div
                                    className="admission-step"
                                    key={i}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    variants={fadeInUp}
                                    custom={i + 1}
                                >
                                    <div className="step-num">{s.num}</div>
                                    <div>
                                        <strong>{s.title}</strong>
                                        <p>{s.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        className="glass-card admissions-form-card"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        custom={1}
                    >
                        {!submitted ? (
                            <>
                                <h3>
                                    <Rocket size={20} /> Online Enquiry Form
                                </h3>
                                <form onSubmit={handleSubmit}>
                                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                                        <label htmlFor="category">Enquiry Purpose / Category *</label>
                                        <select
                                            id="category"
                                            name="category"
                                            value={selectedCategory}
                                            onChange={(e) => setSelectedCategory(e.target.value)}
                                            required
                                            style={{ fontWeight: 600 }}
                                        >
                                            {categoryOptions.map((cat) => (
                                                <option key={cat.value} value={cat.value}>
                                                    {cat.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {selectedCategory === 'ADMISSION' ? (
                                        <>
                                            <div className="form-row">
                                                <div className="form-group">
                                                    <label htmlFor="studentName">Student's Name *</label>
                                                    <input type="text" id="studentName" name="studentName" placeholder="Enter student's full name" required />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="parentName">Parent's / Guardian's Name *</label>
                                                    <input type="text" id="parentName" name="parentName" placeholder="Enter parent's full name" required />
                                                </div>
                                            </div>

                                            <div className="form-row">
                                                <div className="form-group">
                                                    <label htmlFor="classFor">Class Applying For *</label>
                                                    <select id="classFor" name="classFor" required>
                                                        <option value="">Select Class</option>
                                                        {classOptions.map((c) => (
                                                            <option key={c} value={c}>{c}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="parentPhone">Parent's Mobile *</label>
                                                    <input type="tel" id="parentPhone" name="parentPhone" placeholder="10-digit mobile" required />
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="form-row">
                                                <div className="form-group">
                                                    <label htmlFor="parentName">Your Full Name *</label>
                                                    <input type="text" id="parentName" name="parentName" placeholder="Enter your full name" required />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="parentPhone">Mobile Number *</label>
                                                    <input type="tel" id="parentPhone" name="parentPhone" placeholder="10-digit mobile" required />
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    <div className="form-group">
                                        <label htmlFor="parentEmail">Email Address</label>
                                        <input type="email" id="parentEmail" name="parentEmail" placeholder="your@email.com" />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="message">
                                            {selectedCategory === 'ADMISSION' ? 'Message / Note (optional)' : 'Message / Details *'}
                                        </label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            rows="3"
                                            placeholder={
                                                selectedCategory === 'ADMISSION'
                                                    ? 'Any questions or comments?'
                                                    : selectedCategory === 'CAREER'
                                                    ? 'Mention subject/qualification you teach or position applied for...'
                                                    : selectedCategory === 'BUSINESS'
                                                    ? 'Describe your proposal, service, or business enquiry...'
                                                    : 'Type your message or enquiry here...'
                                            }
                                            required={selectedCategory !== 'ADMISSION'}
                                        />
                                    </div>

                                    {error && <p style={{ color: '#ff6b6b', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{error}</p>}
                                    <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                                        {loading ? (
                                            <span className="btn-loader" />
                                        ) : (
                                            <><Send size={18} /> Submit Enquiry</>
                                        )}
                                    </button>
                                </form>
                            </>
                        ) : (
                            <div className="form-success">
                                <CheckCircle size={56} />
                                <h3>Thank You!</h3>
                                <p>Your enquiry has been submitted successfully. We will contact you shortly.</p>
                                <button className="btn btn-outline" onClick={() => setSubmitted(false)}>
                                    Submit Another
                                </button>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

export default Admissions
