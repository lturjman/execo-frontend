'use client'

import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { deleteList } from '@/lib/store/slices/lists'

export default function ListRemove ({ groupId, list, onDeleted }) {
  const dispatch = useDispatch()
  const [confirming, setConfirming] = useState(false)

  function handleDeleteList () {
    setConfirming(false)
    dispatch(deleteList({ groupId, listId: list._id }))
    onDeleted()
  }

  return (
    <div className='mt-3 pt-3 border-t border-zinc-200 dark:border-zinc-600 flex justify-center'>
      {confirming
        ? (
          <div className='flex items-center gap-2'>
            <button
              onClick={handleDeleteList}
className='text-sm bg-red-500 text-white rounded-full px-3 py-1.5 cursor-pointer hover:bg-red-600'
            >
              Confirmer
            </button>
            <button
              onClick={() => setConfirming(false)}
              className='text-sm bg-zinc-200 dark:bg-zinc-600 text-zinc-700 dark:text-zinc-300 rounded-full px-3 py-1.5 cursor-pointer hover:bg-zinc-300 dark:hover:bg-zinc-500'
            >
              Annuler
            </button>
          </div>
          )
        : (
          <button
            onClick={() => setConfirming(true)}
            className='text-sm bg-red-500 text-white rounded-full px-3 py-1.5 cursor-pointer hover:bg-red-600'
          >
            Supprimer
          </button>
          )}
    </div>
  )
}
