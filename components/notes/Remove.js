'use client'

import { useDispatch } from 'react-redux'
import { deleteNote } from '@/lib/store/slices/notes'

export default function NoteRemove ({ groupId, note, onEdit, onMenuClose }) {
  const dispatch = useDispatch()

  function handleDelete () {
    onMenuClose()
    dispatch(deleteNote({ groupId, noteId: note._id }))
  }

  return (
    <div className='absolute bottom-3 right-3 flex gap-2'>
      <button
        onClick={() => onEdit(note)}
        className='flex items-center gap-1 text-sm bg-white/90 dark:bg-zinc-700/90 text-zinc-800 dark:text-zinc-200 rounded-full px-3 py-1.5 cursor-pointer hover:bg-white dark:hover:bg-zinc-700'
      >
        Modifier
      </button>
      <button
        onClick={handleDelete}
        className='flex items-center gap-1 text-sm bg-red-500 text-white rounded-full px-3 py-1.5 cursor-pointer hover:bg-red-600'
      >
        Supprimer
      </button>
    </div>
  )
}
