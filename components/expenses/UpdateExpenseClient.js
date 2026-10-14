'use client'

import { useRouter, useParams } from 'next/navigation'
import UpdateExpense from '@/components/expenses/Update'
import UpdateRefund from '@/components/expenses/UpdateRefund'
import { useSelector, useDispatch } from 'react-redux'
import { useState, useEffect } from 'react'
import RemoveExpense from '@/components/expenses/Remove'
import { fetchExpenses } from '@/lib/store/slices/expenses'

export default function UpdateExpenseClient ({ groupId }) {
  const router = useRouter()
  const params = useParams()
  const expenseId = params.expenseId

  const dispatch = useDispatch()
  const loading = useSelector((state) => state.expenses.loading)
  const expense = useSelector((state) =>
    state.expenses.items.find((e) => e._id === expenseId)
  )

  const [showRemoveModal, setShowRemoveModal] = useState(false)

  useEffect(() => {
    if (groupId) {
      dispatch(fetchExpenses({ groupId }))
    }
  }, [dispatch, groupId])

  if (!expense || loading) {
    return null
  }

  const isRefund = expense.kind === 'refund'

  const handleUpdated = () => {
    router.push(`/groups/${groupId}`)
  }

  return (
    <>
      {isRefund ? (
        <UpdateRefund
          expense={expense}
          onExpenseUpdated={handleUpdated}
          onShowRemove={() => setShowRemoveModal(true)}
        />
      ) : (
        <UpdateExpense
          expense={expense}
          groupId={groupId}
          onExpenseUpdated={handleUpdated}
          onShowRemove={() => setShowRemoveModal(true)}
        />
      )}
      {showRemoveModal && (
        <RemoveExpense
          expense={expense}
          onClose={() => setShowRemoveModal(false)}
          onExpenseDeleted={handleUpdated}
          title={
            isRefund
              ? 'Êtes-vous sûr de vouloir supprimer le remboursement ?'
              : undefined
          }
          description={
            isRefund
              ? 'Cette action est irréversible. Les soldes du groupe seront recalculés.'
              : undefined
          }
        />
      )}
    </>
  )
}
