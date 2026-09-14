import { useEffect, useState } from 'react'

import BootScreen from './components/BootScreen/BootScreen'
import Desktop from './components/Desktop/Desktop'

function App() {
  const [loading, setLoading] = useState(true)

  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme')

    if (savedTheme) {
      return savedTheme
    }

    const prefersDark =
      window.matchMedia(
        '(prefers-color-scheme: dark)',
      ).matches

    return prefersDark
      ? 'dark'
      : 'light'
  })

  useEffect(() => {
    document.documentElement.setAttribute(
      'data-theme',
      theme,
    )

    localStorage.setItem(
      'theme',
      theme,
    )
  }, [theme])

  useEffect(() => {
    const startTime = Date.now()
    const minimumTime = 1200

    const finishLoading = () => {
      const elapsed =
        Date.now() - startTime

      const remaining =
        Math.max(
          minimumTime - elapsed,
          0,
        )

      setTimeout(() => {
        setLoading(false)
      }, remaining)
    }

    if (
      document.readyState ===
      'complete'
    ) {
      finishLoading()
    } else {
      window.addEventListener(
        'load',
        finishLoading,
      )
    }

    return () => {
      window.removeEventListener(
        'load',
        finishLoading,
      )
    }
  }, [])

  const toggleTheme = () => {
    setTheme((currentTheme) =>
      currentTheme === 'dark'
        ? 'light'
        : 'dark',
    )
  }

  if (loading) {
    return <BootScreen />
  }

  return (
    <Desktop
      theme={theme}
      toggleTheme={toggleTheme}
    />
  )
}

export default App