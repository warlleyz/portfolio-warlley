import {
  useEffect,
  useState,
} from 'react'

import BootScreen from './components/BootScreen/BootScreen'
import Desktop from './components/Desktop/Desktop'

const BOOT_MINIMUM_TIME = 1200
const BOOT_EXIT_TIME = 420

const getInitialTheme = () => {
  const savedTheme =
    localStorage.getItem('theme')

  if (
    savedTheme === 'light' ||
    savedTheme === 'dark'
  ) {
    return savedTheme
  }

  const prefersDark =
    window.matchMedia(
      '(prefers-color-scheme: dark)',
    ).matches

  return prefersDark
    ? 'dark'
    : 'light'
}

function App() {
  const [
    bootState,
    setBootState,
  ] = useState('visible')

  const [
    theme,
    setTheme,
  ] = useState(getInitialTheme)


  /* === TEMA === */
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


  /* === INICIALIZAÇÃO === */
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

      const elapsedTime =
        Date.now() - startTime

      const remainingTime =
        Math.max(
          BOOT_MINIMUM_TIME -
          elapsedTime,
          0,
        )

      startExitTimer =
        setTimeout(() => {
          setBootState('leaving')

          finishExitTimer =
            setTimeout(() => {
              setBootState('done')
            }, exitDuration)
        }, remainingTime)
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


  /* === AÇÕES === */
  const toggleTheme = () => {
    setTheme((currentTheme) =>
      currentTheme === 'dark'
        ? 'light'
        : 'dark',
    )
  }


  /* === RENDERIZAÇÃO === */
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