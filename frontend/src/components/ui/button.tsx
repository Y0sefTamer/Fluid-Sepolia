import type { ButtonHTMLAttributes, ReactNode } from 'react'

import { SpinnerIcon } from '@/components/ui/icons'
import { cn } from '@/lib/cn'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

const VARIANTS: Record<Variant, string> = {
  primary:
    'bg-accent-gradient text-accent-fg shadow-glow hover:brightness-110 active:brightness-95 disabled:shadow-none',
  secondary:
    'border border-line/10 bg-surface/80 text-fg backdrop-blur hover:border-accent/30 hover:bg-surface disabled:opacity-60',
  ghost: 'text-muted hover:bg-line/10 hover:text-fg disabled:opacity-50',
  danger:
    'border border-danger/30 bg-danger/10 text-danger hover:border-danger/50 hover:bg-danger/20 disabled:opacity-50',
}

const SIZES: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-xs',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-6 text-sm',
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  loadingLabel?: string
  fullWidth?: boolean
  children: ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  loadingLabel,
  fullWidth = false,
  className,
  children,
  disabled,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl font-semibold tracking-tight transition duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
        'disabled:cursor-not-allowed',
        VARIANTS[variant],
        SIZES[size],
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    >
      {loading ? (
        <>
          <SpinnerIcon className="h-4 w-4 animate-spin" />
          <span>{loadingLabel ?? 'Working…'}</span>
        </>
      ) : (
        children
      )}
    </button>
  )
}
