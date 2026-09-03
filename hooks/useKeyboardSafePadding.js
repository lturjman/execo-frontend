import { useCallback, useEffect, useState } from 'react'

export function useKeyboardSafePadding () {
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const viewport = window.visualViewport
    if (!viewport) return

    const update = () => {
      if (window.innerHeight - viewport.height > 0) {
        setOffset(window.innerHeight - viewport.height)
      } else {
        setOffset(0)
      }
    }

    update()
    viewport.addEventListener('resize', update)
    viewport.addEventListener('scroll', update)
    return () => {
      viewport.removeEventListener('resize', update)
      viewport.removeEventListener('scroll', update)
    }
  }, [])

  const getKeyboardSafeStyle = useCallback(
    () => (offset > 0 ? { paddingBottom: `${offset}px` } : undefined),
    [offset]
  )

  return { offset, getKeyboardSafeStyle }
}
