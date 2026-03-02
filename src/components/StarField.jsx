import React, { useEffect, useRef } from 'react'
import './StarField.css'

const StarField = () => {
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        let animationId
        let stars = []
        let shootingStars = []

        const resize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }

        const createStars = () => {
            stars = []
            const count = Math.floor((canvas.width * canvas.height) / 4000)
            for (let i = 0; i < count; i++) {
                stars.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    size: Math.random() * 2 + 0.3,
                    opacity: Math.random() * 0.8 + 0.2,
                    twinkleSpeed: Math.random() * 0.02 + 0.005,
                    twinkleOffset: Math.random() * Math.PI * 2,
                    color: ['#f8fafc', '#60a5fa', '#c084fc', '#fbbf24', '#67e8f9'][Math.floor(Math.random() * 5)],
                })
            }
        }

        const createShootingStar = () => {
            if (Math.random() > 0.995) {
                shootingStars.push({
                    x: Math.random() * canvas.width,
                    y: 0,
                    length: Math.random() * 100 + 60,
                    speed: Math.random() * 8 + 6,
                    angle: Math.PI / 4 + Math.random() * 0.3,
                    opacity: 1,
                })
            }
        }

        const draw = (time) => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            // Draw stars
            stars.forEach(star => {
                const twinkle = Math.sin(time * star.twinkleSpeed + star.twinkleOffset) * 0.4 + 0.6
                ctx.beginPath()
                ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
                ctx.fillStyle = star.color
                ctx.globalAlpha = star.opacity * twinkle
                ctx.fill()

                // Glow for larger stars
                if (star.size > 1.2) {
                    ctx.beginPath()
                    ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2)
                    const grad = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.size * 3)
                    grad.addColorStop(0, star.color)
                    grad.addColorStop(1, 'transparent')
                    ctx.fillStyle = grad
                    ctx.globalAlpha = star.opacity * twinkle * 0.15
                    ctx.fill()
                }
            })

            // Shooting stars
            createShootingStar()
            shootingStars = shootingStars.filter(s => s.opacity > 0)
            shootingStars.forEach(s => {
                const ex = s.x + Math.cos(s.angle) * s.length
                const ey = s.y + Math.sin(s.angle) * s.length
                const grad = ctx.createLinearGradient(s.x, s.y, ex, ey)
                grad.addColorStop(0, 'transparent')
                grad.addColorStop(1, `rgba(255,255,255,${s.opacity})`)
                ctx.beginPath()
                ctx.moveTo(s.x, s.y)
                ctx.lineTo(ex, ey)
                ctx.strokeStyle = grad
                ctx.lineWidth = 1.5
                ctx.globalAlpha = 1
                ctx.stroke()

                s.x += Math.cos(s.angle) * s.speed
                s.y += Math.sin(s.angle) * s.speed
                s.opacity -= 0.012
            })

            ctx.globalAlpha = 1
            animationId = requestAnimationFrame(draw)
        }

        resize()
        createStars()
        animationId = requestAnimationFrame(draw)

        window.addEventListener('resize', () => {
            resize()
            createStars()
        })

        return () => {
            cancelAnimationFrame(animationId)
        }
    }, [])

    return <canvas ref={canvasRef} className="star-field" />
}

export default StarField
