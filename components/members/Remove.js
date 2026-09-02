'use client'

import { useDispatch, useSelector } from 'react-redux'
import { deleteMember } from '../../lib/store/slices/members'
import ValidationModal from '@/components/ValidationModal'

export default function RemoveMember ({
  onClose,
  onMemberDeleted,
  groupId,
  member
}) {
  const dispatch = useDispatch()
  const loading = useSelector((state) => state.members.loading)

  const handleDeleteMember = async () => {
    const action = await dispatch(deleteMember({ groupId, member }))
    if (deleteMember.fulfilled.match(action)) {
      if (onMemberDeleted) onMemberDeleted()
    } else {
      console.error('Échec suppression :', action.error)
      alert('Erreur lors de la suppression')
    }
  }

  return (
    <ValidationModal
      open
      onClose={onClose}
      onConfirm={handleDeleteMember}
      loading={loading}
      title='Êtes-vous sûr de vouloir supprimer le membre ?'
      description='Pour rappel, cette action est irréversible et les dépenses en cours seront réparties entre les autres membres du groupe.'
    />
  )
}
