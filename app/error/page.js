'use client'

import { Suspense } from 'react'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import Button from '@/components/Button'

function ErrorContent () {
  const searchParams = useSearchParams()
  const reason = searchParams.get('reason')

  return (
    <main className='min-h-screen flex flex-col items-center justify-center p-4 space-y-6 bg-zinc-50 bg-cover bg-center bg-no-repeat bg-[url("/images/bg-4.jpg")] dark:bg-[url("/images/bg-5.jpg")]'>
      <div className='mt-10'>
        <Image
          src='/images/LOGO06.png'
          alt='Logo Execo'
          width={300}
          height={100}
        />
      </div>

      <div className='w-full max-w-md bg-white dark:bg-zinc-800 rounded-2xl shadow-lg text-center p-6 space-y-4'>
        {reason === 'network'
          ? (
            <>
              <p className='text-2xl font-bold'>Problème de connexion 📡</p>
              <p className='text-zinc-600 dark:text-zinc-300'>
                Impossible de joindre nos serveurs. Vérifiez votre connexion
                internet puis réessayez.
              </p>
            </>
            )
          : (
            <>
              <p className='text-2xl font-bold'>Oups, une erreur est survenue 🙈</p>
              <p className='text-zinc-600 dark:text-zinc-300'>
                Un problème technique est survenu. Merci de réessayer dans
                quelques instants.
              </p>
            </>
            )}

        <div className='flex flex-col gap-3'>
          <Button onClick={() => window.location.reload()}>Réessayer</Button>
          <Button
            href='/'
            className='bg-zinc-400 hover:bg-zinc-500 active:bg-zinc-600'
          >
            Retour à l'accueil
          </Button>
        </div>
      </div>
    </main>
  )
}

export default function ErrorPage () {
  return (
    <Suspense>
      <ErrorContent />
    </Suspense>
  )
}
