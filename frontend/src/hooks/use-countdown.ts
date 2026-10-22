'use client'

import { useEffect, useRef, useState } from 'react'

export function useCountdown(
  secondsLeft: bigint | undefined,
  fetchedAt: number | undefined,
  onElapsed?: () => void,
): number | null {
  const [now, setNow] = useState(() => Date.now())
  const onElapsedRef = useRef(onElapsed)
  const notified = useRef(false)

  useEffect(() => {
    onElapsedRef.current = onElapsed
  }, [onElapsed])

  const active = secondsLeft !== undefined && secondsLeft > 0n

  useEffect(() => {
    if (!active) return

    const tick = () => setNow(Date.now())
    tick()
    const interval = window.setInterval(tick, 1_000)
    return () => window.clearInterval(interval)
  }, [active])

  const remaining =
    secondsLeft === undefined
      ? null
      : Math.max(
          0,
          Number(secondsLeft) -
            Math.max(0, Math.floor((now - (fetchedAt ?? now)) / 1_000)),
        )

  useEffect(() => {
    if (remaining === 0 && secondsLeft !== undefined && secondsLeft > 0n) {
      if (!notified.current) {
        notified.current = true
        onElapsedRef.current?.()
      }
    } else if (remaining !== null && remaining > 0) {
      notified.current = false
    }
  }, [remaining, secondsLeft])

  return remaining
}
