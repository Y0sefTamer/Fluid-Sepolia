import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  viewBox: '0 0 24 24',
  'aria-hidden': true,
}

export function DropletIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3.2c3.3 3.6 6.2 6.8 6.2 10.3a6.2 6.2 0 0 1-12.4 0C5.8 10 8.7 6.8 12 3.2Z" />
      <path d="M9.2 14.2a2.9 2.9 0 0 0 2.8 2.4" />
    </svg>
  )
}

export function WalletIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H18a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6.5A2.5 2.5 0 0 1 4 17.5v-10Z" />
      <path d="M4 8h15" />
      <path d="M16 13.5h2.5" />
    </svg>
  )
}

export function ClockIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 1.8" />
    </svg>
  )
}

export function CoinsIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <ellipse cx="9" cy="7" rx="5" ry="2.4" />
      <path d="M4 7v4c0 1.3 2.2 2.4 5 2.4s5-1.1 5-2.4V7" />
      <path d="M4 11v4c0 1.3 2.2 2.4 5 2.4 1 0 1.9-.1 2.7-.4" />
      <path d="M13.5 16.5c0 1.3 2.2 2.4 5 2.4s2.5-1.1 2.5-2.4" />
      <path d="M21 11.5v7c0 1.3-1.1 2.4-2.5 2.4s-5-1.1-5-2.4v-4" />
    </svg>
  )
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4.5 12h15" />
      <path d="m13.5 6 6 6-6 6" />
    </svg>
  )
}

export function ArrowUpRightIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </svg>
  )
}

export function CopyIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="9" y="9" width="11" height="11" rx="2.5" />
      <path d="M15 5.5A2.5 2.5 0 0 0 12.5 3h-7A2.5 2.5 0 0 0 3 5.5v7A2.5 2.5 0 0 0 5.5 15" />
    </svg>
  )
}

export function CheckIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m5 12.5 4.2 4L19 7" />
    </svg>
  )
}

export function AlertTriangleIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M10.3 4.3 2.8 17.2A2 2 0 0 0 4.5 20h15a2 2 0 0 0 1.7-2.8L13.7 4.3a2 2 0 0 0-3.4 0Z" />
      <path d="M12 9v4" />
      <path d="M12 16.4h.01" />
    </svg>
  )
}

export function InfoIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 11v5" />
      <path d="M12 8h.01" />
    </svg>
  )
}

export function XIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m6 6 12 12" />
      <path d="M18 6 6 18" />
    </svg>
  )
}

export function SunIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="3.6" />
      <path d="M12 2.8v2M12 19.2v2M4.7 4.7l1.4 1.4M17.9 17.9l1.4 1.4M2.8 12h2M19.2 12h2M4.7 19.3l1.4-1.4M17.9 6.1l1.4-1.4" />
    </svg>
  )
}

export function MoonIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M20 14.2A8.2 8.2 0 0 1 9.8 4a8.4 8.4 0 1 0 10.2 10.2Z" />
    </svg>
  )
}

export function GithubIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M9 19.5c-4 1.2-4-2-5.5-2.5M14.5 21v-3.4c0-.9-.1-1.3.5-1.9 2.4-.3 4.5-1.2 4.5-5.2a4 4 0 0 0-1.1-2.8 3.7 3.7 0 0 0-.1-2.8s-.9-.3-3 1.1a10.4 10.4 0 0 0-5.6 0C7.6 4.6 6.7 4.9 6.7 4.9a3.7 3.7 0 0 0-.1 2.8A4 4 0 0 0 5.5 10.5c0 4 2.1 4.9 4.5 5.2.4.5.4 1.1.4 1.9V21" />
    </svg>
  )
}

export function ShieldIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3 5 5.7v5.6c0 4.2 2.8 7.6 7 9.7 4.2-2.1 7-5.5 7-9.7V5.7L12 3Z" />
      <path d="m9.2 11.8 2 2 3.6-3.8" />
    </svg>
  )
}

export function SparklesIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m12 3 1.7 4.5L18 9.2l-4.3 1.7L12 15.4l-1.7-4.5L6 9.2l4.3-1.7L12 3Z" />
      <path d="m18.5 15 .8 2.1 2 .8-2 .8-.8 2.1-.8-2.1-2-.8 2-.8.8-2.1Z" />
    </svg>
  )
}

export function SendIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m21 3-9.2 9.2" />
      <path d="m21 3-6.2 18-3.6-8.4L3 9.2 21 3Z" />
    </svg>
  )
}

export function RefreshIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M20 11a8 8 0 0 0-14.7-4.5L3 9" />
      <path d="M3 4.5V9h4.5" />
      <path d="M4 13a8 8 0 0 0 14.7 4.5L21 15" />
      <path d="M21 19.5V15h-4.5" />
    </svg>
  )
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m6 9.5 6 6 6-6" />
    </svg>
  )
}

export function SpinnerIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3a9 9 0 1 0 9 9" />
    </svg>
  )
}

export function SignOutIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M14 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3" />
      <path d="M9 16.5 13.5 12 9 7.5" />
      <path d="M13.5 12H4" />
    </svg>
  )
}

export function LogoMark(props: IconProps) {
  return (
    <svg viewBox="0 0 40 40" fill="none" aria-hidden {...props}>
      <defs>
        <linearGradient id="fluid-logo-gradient" x1="7" y1="4" x2="34" y2="36">
          <stop stopColor="#5CF2CE" />
          <stop offset="0.55" stopColor="#2DD4BF" />
          <stop offset="1" stopColor="#0EA5A0" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="12" fill="url(#fluid-logo-gradient)" />
      <path
        d="M20 10.5c4.2 4.6 7.4 8.2 7.4 12.2a7.4 7.4 0 0 1-14.8 0c0-4 3.2-7.6 7.4-12.2Z"
        fill="#04110F"
        fillOpacity="0.88"
      />
      <path
        d="M16.5 23a3.5 3.5 0 0 0 3.4 2.9"
        stroke="#5CF2CE"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}
