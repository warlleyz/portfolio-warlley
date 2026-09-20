import {
  useEffect,
  useState,
} from 'react'

import BootScreen from './components/BootScreen/BootScreen'
import Desktop from './components/Desktop/Desktop'

const BOOT_MINIMUM_TIME = 1200
const BOOT_EXIT_TIME = 420

const BASE_URL =
  import.meta.env.BASE_URL

const globalAssets = {
  cursorDefault:
    `${BASE_URL}cursor-default.svg`,

  cursorPointer:
    `${BASE_URL}cursor-pointer.svg`,

  cursorGrab:
    `${BASE_URL}cursor-grab.svg`,

  cursorGrabbing:
    `${BASE_URL}cursor-grabbing.svg`,

  cursorText:
    `${BASE_URL}cursor-text.svg`,

  cursorResizeHorizontal:
    `${BASE_URL}cursor-resize-horizontal.svg`,

  cursorResizeVertical:
    `${BASE_URL}cursor-resize-vertical.svg`,

  cursorResizeDiagonal1:
    `${BASE_URL}cursor-resize-diagonal-1.svg`,

  cursorResizeDiagonal2:
    `${BASE_URL}cursor-resize-diagonal-2.svg`,

  cursorMove:
    `${BASE_URL}cursor-move.svg`,

  cursorNotAllowed:
    `${BASE_URL}cursor-not-allowed.svg`,
}

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


  /* === TEMA E ASSETS GLOBAIS === */
  useEffect(() => {
    const root =
      document.documentElement


    root.setAttribute(
      'data-theme',
      theme,
    )


    root.style.setProperty(
      '--wallpaper-image',
      `url("${BASE_URL}wallpapers/ws-${theme}.png")`,
    )

    root.style.setProperty(
      '--cursor-default',
      `url("${globalAssets.cursorDefault}") 4 2`,
    )

    root.style.setProperty(
      '--cursor-pointer',
      `url("${globalAssets.cursorPointer}") 4 2`,
    )

    root.style.setProperty(
      '--cursor-grab',
      `url("${globalAssets.cursorGrab}") 8 8`,
    )

    root.style.setProperty(
      '--cursor-grabbing',
      `url("${globalAssets.cursorGrabbing}") 8 8`,
    )

    root.style.setProperty(
      '--cursor-text',
      `url("${globalAssets.cursorText}") 12 12`,
    )

    root.style.setProperty(
      '--cursor-resize-horizontal',
      `url("${globalAssets.cursorResizeHorizontal}") 12 12`,
    )

    root.style.setProperty(
      '--cursor-resize-vertical',
      `url("${globalAssets.cursorResizeVertical}") 12 12`,
    )

    root.style.setProperty(
      '--cursor-resize-diagonal-1',
      `url("${globalAssets.cursorResizeDiagonal1}") 12 12`,
    )

    root.style.setProperty(
      '--cursor-resize-diagonal-2',
      `url("${globalAssets.cursorResizeDiagonal2}") 12 12`,
    )

    root.style.setProperty(
      '--cursor-move',
      `url("${globalAssets.cursorMove}") 12 12`,
    )

    root.style.setProperty(
      '--cursor-not-allowed',
      `url("${globalAssets.cursorNotAllowed}") 12 12`,
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