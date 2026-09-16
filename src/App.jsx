import {
  useEffect,
  useState,
} from 'react'

import BootScreen from './components/BootScreen/BootScreen'
import Desktop from './components/Desktop/Desktop'

const BOOT_MINIMUM_TIME = 1200
const BOOT_EXIT_TIME = 420

function App() {
  const [
    bootState,
    setBootState,
  ] = useState('visible')

  const [
    theme,
    setTheme,
  ] = useState(() => {
    const savedTheme =
      localStorage.getItem('theme')

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
    const startTime =
      Date.now()

    const reducedMotion =
      window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches

    const exitDuration =
      reducedMotion
        ? 0
        : BOOT_EXIT_TIME

    let startExitTimer = null
    let finishExitTimer = null
    let loadingFinished = false

    const finishLoading = () => {
      if (loadingFinished) {
        return
      }

      loadingFinished = true

      const elapsed =
        Date.now() - startTime

      const remaining =
        Math.max(
          BOOT_MINIMUM_TIME -
          elapsed,
          0,
        )

      startExitTimer =
        setTimeout(() => {
          setBootState(
            'leaving',
          )

          finishExitTimer =
            setTimeout(() => {
              setBootState(
                'done',
              )
            }, exitDuration)
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
        {
          once: true,
        },
      )
    }

    return () => {
      window.removeEventListener(
        'load',
        finishLoading,
      )

      if (startExitTimer) {
        clearTimeout(
          startExitTimer,
        )
      }

      if (finishExitTimer) {
        clearTimeout(
          finishExitTimer,
        )
      }
    }
  }, [])

  const toggleTheme = () => {
    setTheme((currentTheme) =>
      currentTheme === 'dark'
        ? 'light'
        : 'dark',
    )
  }

  return (
    <>
      {bootState !== 'visible' && (
        <Desktop
          theme={theme}
          toggleTheme={toggleTheme}
        />
      )}

      {bootState !== 'done' && (
        <BootScreen
          theme={theme}
          leaving={
            bootState ===
            'leaving'
          }
        />
      )}
    </>
  )
}

export default App