'use client'

import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'

import { useToast } from '@/components/providers/toast-provider'
import { txUrl } from '@/config/contract'
import { getFriendlyError } from '@/lib/errors'

export function useTxSuccessToast({
  hash,
  isSuccess,
  title,
  description,
}: {
  hash: `0x${string}` | undefined
  isSuccess: boolean
  title: string
  description?: string
}) {
  const { pushToast } = useToast()
  const queryClient = useQueryClient()
  const notified = useRef<string | null>(null)

  useEffect(() => {
    if (!isSuccess || !hash || notified.current === hash) return
    notified.current = hash
    pushToast({
      title,
      description,
      variant: 'success',
      href: txUrl(hash),
    })
    void queryClient.invalidateQueries()
  }, [description, hash, isSuccess, pushToast, queryClient, title])
}

export function useTxErrorToast(error: unknown) {
  const { pushToast } = useToast()
  const notified = useRef<unknown>(null)

  useEffect(() => {
    if (!error || notified.current === error) return
    notified.current = error
    const friendly = getFriendlyError(error)
    pushToast({
      title: friendly.title,
      description: friendly.message,
      variant: friendly.kind === 'rejected' ? 'info' : 'error',
    })
  }, [error, pushToast])
}
