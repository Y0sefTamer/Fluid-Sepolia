import { formatEther } from 'viem'

const groupThousands = (value: string) =>
  value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')

export function formatEth(value: bigint, maxFractionDigits = 4): string {
  const full = formatEther(value)
  const [integerPart, fractionPart = ''] = full.split('.')
  const fraction = fractionPart.slice(0, maxFractionDigits).replace(/0+$/, '')

  return fraction.length > 0
    ? `${groupThousands(integerPart)}.${fraction}`
    : groupThousands(integerPart)
}

export function shortAddress(address: string, chars = 4): string {
  if (address.length <= chars * 2 + 2) return address
  return `${address.slice(0, chars + 2)}…${address.slice(-chars)}`
}

export function formatCooldown(seconds: bigint): string {
  if (seconds === 0n) return 'Instant'

  const days = seconds / 86_400n
  const hours = (seconds % 86_400n) / 3_600n
  const minutes = (seconds % 3_600n) / 60n
  const secs = seconds % 60n

  if (days > 0n) return hours > 0n ? `${days}d ${hours}h` : `${days}d`
  if (hours > 0n) return minutes > 0n ? `${hours}h ${minutes}m` : `${hours}h`
  if (minutes > 0n) return secs > 0n ? `${minutes}m ${secs}s` : `${minutes}m`
  return `${secs}s`
}

const pad = (value: number) => value.toString().padStart(2, '0')

export function formatCountdown(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds))
  const days = Math.floor(s / 86_400)
  const hours = Math.floor((s % 86_400) / 3_600)
  const minutes = Math.floor((s % 3_600) / 60)
  const seconds = s % 60

  if (days > 0) {
    return `${days}d ${pad(hours)}h ${pad(minutes)}m`
  }
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
}

export function formatRelativeTime(unixSeconds: bigint | number): string {
  const timestamp = Number(unixSeconds)
  const now = Date.now() / 1_000
  const delta = Math.round(timestamp - now)
  const absolute = Math.abs(delta)
  const formatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

  if (absolute < 60) return formatter.format(delta, 'second')
  if (absolute < 3_600) return formatter.format(Math.round(delta / 60), 'minute')
  if (absolute < 86_400) return formatter.format(Math.round(delta / 3_600), 'hour')
  if (absolute < 2_592_000) return formatter.format(Math.round(delta / 86_400), 'day')
  if (absolute < 31_536_000)
    return formatter.format(Math.round(delta / 2_592_000), 'month')
  return formatter.format(Math.round(delta / 31_536_000), 'year')
}
