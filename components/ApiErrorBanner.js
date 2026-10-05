'use client'

import { useEffect, useState } from 'react'
import {
  ArrowPathIcon,
  ExclamationTriangleIcon,
  SignalSlashIcon,
  XMarkIcon
} from '@heroicons/react/24/solid'
import { fetchWithAuth } from '@/utils/fetchWithAuth'
import { clearAll, retryAll, subscribe } from '@/utils/apiFailureStore'

const MESSAGES = {
  network: {
    title: 'Connexion impossible',
    body: 'Impossible de joindre nos serveurs. Vérifiez votre connexion internet.',
    icon: SignalSlashIcon
  },
  server: {
    title: 'Serveur temporairement indisponible',
    body: 'Certaines données n’ont pas pu être chargées. Vous pouvez continuer à naviguer.',
    icon: ExclamationTriangleIcon
  }
}

export default function ApiErrorBanner () {
  const [snapshot, setSnapshot] = useState({
    failures: [],
    isNetworkDown: false,
    hasServerError: false
  })
  const [retrying, setRetrying] = useState(false)

  useEffect(() => subscribe(setSnapshot), [])

  const { failures, isNetworkDown } = snapshot
  if (failures.length === 0) return null

  const kind = isNetworkDown ? 'network' : 'server'
  const { title, body, icon: Icon } = MESSAGES[kind] || MESSAGES.server
  const others = failures.length - 1

  async function handleRetry () {
    setRetrying(true)
    try {
      await retryAll(fetchWithAuth)
    } finally {
      setRetrying(false)
    }
  }

  return (
    <div
      role='alert'
      aria-live='assertive'
      className='fixed bottom-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 animate-[fadeSlideUp_200ms_ease-out]'
    >
      <div className='flex items-start gap-3 rounded-2xl bg-white dark:bg-zinc-800 p-4 shadow-lg ring-1 ring-zinc-200 dark:ring-zinc-700'>
        <Icon className='size-6 shrink-0 text-purple-400' aria-hidden='true' />

        <div className='grow space-y-1'>
          <p className='font-semibold'>{title}</p>
          <p className='text-sm text-zinc-600 dark:text-zinc-300'>{body}</p>
          {others > 0 && (
            <p className='text-sm text-zinc-500 dark:text-zinc-400'>
              {others} autre{others > 1 ? 's' : ''} requête{others > 1 ? 's' : ''} en échec.
            </p>
          )}
          <button
            onClick={handleRetry}
            disabled={retrying}
            aria-busy={retrying}
            className='mt-2 inline-flex items-center gap-2 rounded-full bg-purple-400 hover:bg-purple-500 active:bg-purple-700 disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:text-zinc-500 text-white font-semibold py-1.5 px-4 cursor-pointer'
          >
            {retrying && <ArrowPathIcon className='size-4 animate-spin' />}
            Réessayer
          </button>
        </div>

        <button
          onClick={clearAll}
          aria-label='Masquer le message'
          className='shrink-0 rounded-full p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer'
        >
          <XMarkIcon className='size-5' />
        </button>
      </div>
    </div>
  )
}
