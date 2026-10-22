'use client'

import { useEffect, useRef, useState } from 'react'

import { CheckIcon, CopyIcon } from '@/components/ui/icons'
import { cn } from '@/lib/cn'

interface CopyButtonProps {
  value: string
  label?: string
  className?: string
  iconOnly?: boolean
}

export function CopyButton({ value, label = 'Copy', className, iconOnly }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current)
    }
  }, [])

  async function copy() {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      if (timer.current) window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => setCopied(false), 2_000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? 'Copied to clipboard' : label}
      title={copied ? 'Copied' : label}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-lg text-xs font-medium text-muted transition',
        'hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
        iconOnly ? 'p-1.5 hover:bg-line/10' : 'px-2 py-1 hover:bg-line/10',
        className,
      )}
    >
      {copied ? (
        <CheckIcon className="h-4 w-4 text-positive" />
      ) : (
        <CopyIcon className="h-4 w-4" />
      )}
      {copied ? <span className="text-positive">Copied</span> : null}
      {!iconOnly ? <span className="sr-only">{label}</span> : null}
    </button>
  )
}
