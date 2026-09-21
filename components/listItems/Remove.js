'use client'

import { TrashIcon } from '@heroicons/react/24/solid'
import { useDispatch, useSelector } from 'react-redux'
import { deleteItem } from '@/lib/store/slices/lists'

export default function ItemRemove ({ groupId, listId, itemId, visible }) {
  const dispatch = useDispatch()
  const loading = useSelector((state) => state.lists.loading)

  function handleDeleteItem (e) {
    e.stopPropagation()
    if (loading) return
    dispatch(deleteItem({ groupId, listId, itemId }))
  }

  return (
    <div
      className={`flex items-center gap-1 transition-opacity shrink-0 ${
        visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <button
        type='button'
        onMouseDown={(e) => e.preventDefault()}
        onClick={handleDeleteItem}
        disabled={loading}
        className='cursor-pointer text-red-400 hover:text-red-600 disabled:opacity-30'
      >
        <TrashIcon className='size-4' />
      </button>
    </div>
  )
}
