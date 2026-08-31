'use client'

import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { deleteGroup } from '@/lib/store/slices/groups'
import ValidationModal from '@/components/ValidationModal'

export default function RemoveGroup ({ group, onClose }) {
  const router = useRouter()
  const dispatch = useDispatch()
  const loading = useSelector((state) => state.groups.loading)

  const handleDeleteGroup = async () => {
    if (!group) return
    await dispatch(deleteGroup(group._id))
    router.push('/groups')
  }

  return (
    <ValidationModal
      open
      onClose={onClose}
      onConfirm={handleDeleteGroup}
      loading={loading}
      title='Êtes-vous sûr de vouloir supprimer le groupe ?'
      description='Pour rappel, cette action est irréversible et toutes les dépenses seront perdues.'
    />
  )
}
