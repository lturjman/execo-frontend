'use client'

import { useEffect, useRef } from 'react'
import { CheckIcon } from '@heroicons/react/24/solid'
import { useDispatch } from 'react-redux'
import { updateNote } from '@/lib/store/slices/notes'

export default function NoteUpdate ({
  groupId,
  note,
  isEditing,
  editMessage,
  onEditMessageChange,
  onCancelEdit,
  onClick,
  colors
}) {
  const dispatch = useDispatch()
  const formRef = useRef(null)

  useEffect(() => {
    if (!isEditing) return
    function handleClickOutside (e) {
      if (formRef.current && !formRef.current.contains(e.target)) {
        onCancelEdit()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isEditing, onCancelEdit])

  async function handleUpdate (e) {
    e.preventDefault()
    if (!editMessage.trim()) return
    await dispatch(
      updateNote({
        groupId,
        note: { _id: note._id, message: editMessage.trim() }
      })
    )
    onCancelEdit()
  }

  if (isEditing) {
    return (
      <form
        ref={formRef}
        onSubmit={handleUpdate}
        className='flex items-center gap-1'
      >
        <input
          type='text'
          value={editMessage}
          onChange={(e) => onEditMessageChange(e.target.value)}
          autoFocus
          className='appearance-none grow min-w-0 p-1 px-2 text-sm rounded bg-white/80 dark:bg-zinc-800/80 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-purple-400'
        />
        <button
          type='submit'
          title='Enregistrer'
          className='cursor-pointer opacity-80 hover:opacity-100'
        >
          <CheckIcon className={`size-5 ${colors.icon}`} />
        </button>
      </form>
    )
  }

  return (
    <p
      onClick={onClick}
      className='text-sm text-zinc-800 dark:text-zinc-100 break-words whitespace-pre-wrap leading-relaxed cursor-pointer'
    >
      {note.message}
    </p>
  )
}
