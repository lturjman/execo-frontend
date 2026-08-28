'use client'

import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { CheckIcon } from '@heroicons/react/24/solid'
import { createNote } from '@/lib/store/slices/notes'

import Button from '@/components/Button'

export default function NoteCreate ({ groupId, currentMember }) {
  const dispatch = useDispatch()
  const [message, setMessage] = useState('')

  async function handleSubmit (e) {
    e.preventDefault()
    if (!message.trim() || !currentMember) return
    await dispatch(
      createNote({
        groupId,
        note: { message: message.trim(), member: currentMember._id }
      })
    )
    setMessage('')
  }

  return (
    <form onSubmit={handleSubmit} className='mt-4 flex items-center gap-2'>
      <input
        type='text'
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder='Ajouter un pense-bête...'
        className='px-4 appearance-none grow p-2.5 focus:border rounded-full bg-zinc-100 text-zinc-800 focus:outline-none focus:ring-1 focus:ring-purple-400 focus:border-purple-400 dark:bg-zinc-600 dark:text-zinc-200'
      />
      <Button rounded='true'>
        <CheckIcon className='size-5 text-white' />
      </Button>
    </form>
  )
}
