'use client'

import { useState } from 'react'
import { TrashIcon } from '@heroicons/react/24/solid'
import { useDispatch, useSelector } from 'react-redux'
import { deleteItem } from '@/lib/store/slices/lists'
import ValidationModal from '@/components/ValidationModal'

export default function ItemRemove ({ groupId, listId, itemId }) {
  const dispatch = useDispatch()
  const loading = useSelector((state) => state.lists.loading)
  const [open, setOpen] = useState(false)

  async function handleDeleteItem () {
    await dispatch(deleteItem({ groupId, listId, itemId }))
    setOpen(false)
  }

  return (
    <>
      <div className='flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0'>
        <button
          type='button'
          onClick={() => setOpen(true)}
          className='cursor-pointer text-red-400 hover:text-red-600 '
        >
          <TrashIcon className='size-4' />
        </button>
      </div>

      <ValidationModal
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={handleDeleteItem}
        loading={loading}
        title='Êtes-vous sûr ?'
        description="Cette action est irréversible. L'item sera définitivement supprimé de la liste."
      />
    </>
  )
}
