'use client'

import { useState } from 'react'
import Button from '@/components/Button'
import { useDispatch, useSelector } from 'react-redux'
import { createList } from '@/lib/store/slices/lists'

export default function ListCreate ({ groupId, currentMember, onCreated }) {
  const dispatch = useDispatch()
  const loading = useSelector((state) => state.lists.loading)
  const [title, setTitle] = useState('')

  async function handleCreateList (e) {
    e.preventDefault()
    if (!title.trim() || !currentMember) return
    const action = await dispatch(
      createList({
        groupId,
        list: { title: title.trim(), member: currentMember._id }
      })
    )
    if (action.payload?._id) {
      onCreated(action.payload)
    }
    setTitle('')
  }

  return (
    <form onSubmit={handleCreateList} className='flex gap-2 mb-4'>
      <input
        type='text'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder='Titre de la nouvelle liste...'
        autoFocus
        className='px-4 grow p-2 text-sm rounded-lg border border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-purple-400'
      />
      <Button
        type='submit'
        loading={loading}
        className='w-auto px-3 py-2 text-sm rounded-full bg-purple-600 hover:bg-purple-700'
      >
        Créer
      </Button>
    </form>
  )
}
