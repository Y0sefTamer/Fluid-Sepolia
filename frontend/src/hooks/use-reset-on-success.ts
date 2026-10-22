'use client'

import { useEffect, useRef } from 'react'

export function useResetOnSuccess(isSuccess: boolean, reset: () => void) {
  const resetRef = useRef(reset)

  useEffect(() => {
    resetRef.current = reset
  }, [reset])

  useEffect(() => {
    if (!isSuccess) return
    const timeout = window.setTimeout(() => resetRef.current(), 0)
    return () => window.clearTimeout(timeout)
  }, [isSuccess])
}
