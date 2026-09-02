'use client'

import { useDispatch, useSelector } from 'react-redux'
import { deleteExpense } from '@/lib/store/slices/expenses'
import ValidationModal from '@/components/ValidationModal'

export default function RemoveExpense ({ onClose, expense, onExpenseDeleted }) {
  const dispatch = useDispatch()
  const loading = useSelector((state) => state.expenses.loading)

  const handleDeleteExpense = async () => {
    await dispatch(deleteExpense({ groupId: expense.group, expense }))
    if (onExpenseDeleted) onExpenseDeleted()
  }

  return (
    <ValidationModal
      open
      onClose={onClose}
      onConfirm={handleDeleteExpense}
      loading={loading}
      title='Êtes-vous sûr de vouloir supprimer la dépense ?'
      description='Pour rappel, cette action est irréversible et les dépenses en cours seront réparties entre les autres membres du groupe.'
    />
  )
}
