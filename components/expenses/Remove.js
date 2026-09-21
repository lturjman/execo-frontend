'use client'

import { useDispatch, useSelector } from 'react-redux'
import { deleteExpense } from '@/lib/store/slices/expenses'
import ValidationModal from '@/components/ValidationModal'

export default function RemoveExpense ({ onClose, expense, onExpenseDeleted }) {
  const dispatch = useDispatch()
  const loading = useSelector((state) => state.expenses.loading)

  const handleDeleteExpense = async () => {
    const action = await dispatch(
      deleteExpense({ groupId: expense.group, expense }),
    )
    if (deleteExpense.fulfilled.match(action)) {
      if (onExpenseDeleted) onExpenseDeleted()
    } else {
      alert("Erreur lors de la suppression de la dépense")
    }
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
