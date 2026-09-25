'use client'

import { useEffect } from 'react'

export default function GlobalError ({ error, reset }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html>
      <body>
        <main className='min-h-screen flex flex-col items-center justify-center p-4 space-y-6 bg-zinc-50 bg-cover bg-center bg-no-repeat bg-[url("/images/bg-4.jpg")] dark:bg-[url("/images/bg-5.jpg")]'>
          <div className='w-full max-w-md bg-white dark:bg-zinc-800 rounded-2xl shadow-lg text-center p-6 space-y-4'>
            <p className='text-2xl font-bold'>
              Oups, une erreur est survenue 🙈
            </p>
            <p className='text-zinc-600 dark:text-zinc-300'>
              Un problème est survenu au démarrage de l'application. Merci de
              réessayer.
            </p>
            <button
              onClick={reset}
              className='rounded-full bg-purple-400 hover:bg-purple-500 active:bg-purple-700 text-white font-semibold py-2 px-6 cursor-pointer'
            >
              Réessayer
            </button>
          </div>
        </main>
      </body>
    </html>
  )
}
