import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, CheckCircle, Rocket } from 'lucide-react'
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

const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.1 } }),
}

const Admissions = () => {
    const [submitted, setSubmitted] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        const form = e.target
        const enquiryData = {
            studentName: form.studentName.value,
            classApplyingFor: form.classFor.value,
            parentPhone: form.parentPhone.value,
            parentEmail: form.parentEmail.value || '',
            message: form.message.value || '',
        }

        try {
            const response = await fetch('http://localhost:8080/api/enquiries', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(enquiryData),
            })

            if (!response.ok) {
                throw new Error('Failed to submit enquiry')
            }

            setSubmitted(true)
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
                                    <Rocket size={20} /> Enquiry Form
                                </h3>
                                <form onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        <label htmlFor="studentName">Student's Name</label>
                                        <input type="text" id="studentName" name="studentName" placeholder="Enter student's full name" required />
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label htmlFor="classFor">Class Applying For</label>
                                            <select id="classFor" name="classFor" required>
                                                <option value="">Select Class</option>
                                                {classOptions.map((c) => (
                                                    <option key={c} value={c}>{c}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="parentPhone">Parent's Phone</label>
                                            <input type="tel" id="parentPhone" name="parentPhone" placeholder="10-digit mobile" required />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="parentEmail">Email Address</label>
                                        <input type="email" id="parentEmail" name="parentEmail" placeholder="your@email.com" />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="message">Message (optional)</label>
                                        <textarea id="message" name="message" rows="3" placeholder="Any questions or comments?"></textarea>
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
