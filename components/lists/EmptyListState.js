'use client'

import { PlusIcon } from '@heroicons/react/24/solid'

export default function EmptyListState ({ onCreate }) {
  return (
    <div className='text-center py-6'>
      <p className='text-base text-zinc-500 dark:text-zinc-400 mb-3'>
        Aucune liste pour le moment.
      </p>
      <button
        type='button'
        onClick={onCreate}
        className='inline-flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-full bg-purple-600 text-white cursor-pointer hover:bg-purple-700 transition-colors'
      >
        <PlusIcon className='size-4' />
        Créer une liste
      </button>
    </div>
  )
}
