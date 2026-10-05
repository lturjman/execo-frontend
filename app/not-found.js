import Image from 'next/image'
import Button from '@/components/Button'

export default function NotFound () {
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
        <p className='text-2xl font-bold'>Page introuvable 🔍</p>
        <p className='text-zinc-600 dark:text-zinc-300'>
          Cette page n'existe pas ou a été déplacée.
        </p>
        <Button href='/'>Retour à l'accueil</Button>
      </div>
    </main>
  )
}
