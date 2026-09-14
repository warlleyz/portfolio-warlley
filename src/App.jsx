import { useEffect, useState } from 'react'
import BootScreen from './components/BootScreen/BootScreen'
import Desktop from './components/Desktop/Desktop'

function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const startTime = Date.now()
    const minimumTime = 1200

    const finishLoading = () => {
      const elapsed = Date.now() - startTime
      const remaining = Math.max(minimumTime - elapsed, 0)

      setTimeout(() => {
        setLoading(false)
      }, remaining)
    }

    if (document.readyState === 'complete') {
      finishLoading()
    } else {
      window.addEventListener('load', finishLoading)
    }

    return () => {
      window.removeEventListener('load', finishLoading)
    }
  }, [])

  return loading ? <BootScreen /> : <Desktop />
}

export default App