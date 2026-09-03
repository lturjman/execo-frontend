"use client";

import { PlusIcon } from '@heroicons/react/24/solid'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addItem } from '@/lib/store/slices/lists'

export default function ItemCreate ({ groupId, listId, colors }) {
  const dispatch = useDispatch()
  const [text, setText] = useState('')

  async function handleAddItem (e) {
    e.preventDefault()
    if (!text.trim() || !listId) return
    await dispatch(addItem({ groupId, listId, text: text.trim() }))
    setText('')
  }

  return (
    <form onSubmit={handleAddItem} className='flex items-center gap-2'>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Ajouter un item..."
        className="px-3 grow py-1.5 text-sm rounded-full bg-white/60 dark:bg-zinc-800/60 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-purple-400"
      />
      <button
        type="submit"
        disabled={!text.trim()}
        className="cursor-pointer opacity-80 hover:opacity-100 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
      >
        <PlusIcon className={`size-5 ${colors.icon}`} />
      </button>
    </form>
  );
}
