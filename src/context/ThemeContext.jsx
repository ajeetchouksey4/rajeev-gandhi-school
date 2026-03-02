import React, { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export const THEMES = {
  maroon: {
    id: 'maroon',
    name: 'Maroon Classic',
    emoji: '🟤',
    description: 'Traditional school elegance',
  },
  blue: {
    id: 'blue',
    name: 'Royal Blue',
    emoji: '🔵',
    description: 'Professional & trustworthy',
  },
  green: {
    id: 'green',
    name: 'Forest Green',
    emoji: '🟢',
    description: 'Fresh & growth-inspired',
  },
  dark: {
    id: 'dark',
    name: 'Night Mode',
    emoji: '🌙',
    description: 'Easy on the eyes',
  },
}

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('school-theme')
    return saved && THEMES[saved] ? saved : 'maroon'
  })

  useEffect(() => {
    // Remove all theme classes
    document.documentElement.classList.remove(
      'theme-maroon',
      'theme-blue',
      'theme-green',
      'theme-dark'
    )
    // Add the current theme class
    document.documentElement.classList.add(`theme-${theme}`)
    // Persist choice
    localStorage.setItem('school-theme', theme)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within ThemeProvider')
  return context
}
