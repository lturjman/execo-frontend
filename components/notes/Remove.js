'use client'

import { useDispatch, useSelector } from 'react-redux'
import { deleteNote } from '@/lib/store/slices/notes'
import ValidationModal from '@/components/ValidationModal'

export default function NoteRemove ({ groupId, note, open, onClose }) {
  const dispatch = useDispatch()
  const loading = useSelector((state) => state.notes.loading)

  function handleDelete () {
    dispatch(deleteNote({ groupId, noteId: note._id }))
    onClose()
  }

  return (
    <ValidationModal
      open={open}
      onClose={onClose}
      onConfirm={handleDelete}
      loading={loading}
      title='Êtes-vous sûr de vouloir supprimer la note ?'
      description='Pour rappel, cette action est irréversible.'
    />
  )
}
