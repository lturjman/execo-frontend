'use client'

import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { updateList } from '@/lib/store/slices/lists'

export default function ListUpdate ({ groupId, list, onDone }) {
  const dispatch = useDispatch()
  const [title, setTitle] = useState(list.title)

  async function handleUpdateList (e) {
    e.preventDefault()
    if (!title.trim()) return
    await dispatch(
      updateList({
        groupId,
        list: { _id: list._id, title: title.trim() }
      })
    )
    onDone()
  }

  return (
    <form
      onSubmit={handleUpdateList}
      className='flex items-center gap-1 grow min-w-0'
    >
      <input
        type='text'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={handleUpdateList}
        autoFocus
        className='grow min-w-0 px-1 py-0.5 text-sm font-bold rounded bg-white/80 dark:bg-zinc-800/80 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-purple-400'
      />
    </form>
  )
}
