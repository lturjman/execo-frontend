'use client'

import { useRouter, useParams } from 'next/navigation'
import UpdateExpense from '@/components/expenses/Update'
import { useSelector, useDispatch } from 'react-redux'
import { useState, useEffect } from 'react'
import RemoveExpense from '@/components/expenses/Remove'
import { fetchExpenses } from '@/lib/store/slices/expenses'

export default function UpdateExpenseClient ({ groupId }) {
  const router = useRouter()
  const params = useParams()
  const expenseId = params.expenseId

  const dispatch = useDispatch()
  const expense = useSelector((state) =>
    state.expenses.items.find((e) => e._id === expenseId)
  )

  const [showRemoveModal, setShowRemoveModal] = useState(false)

  useEffect(() => {
    if (!expense && groupId) {
      dispatch(fetchExpenses({ groupId }))
    }
  }, [dispatch, groupId, expense])

  return (
    <>
      <UpdateExpense
        expense={expense}
        groupId={groupId}
        onExpenseUpdated={() => {
          router.push(`/groups/${groupId}`)
        }}
        onShowRemove={() => setShowRemoveModal(true)}
      />
      {showRemoveModal && (
        <RemoveExpense
          expense={expense}
          onClose={() => setShowRemoveModal(false)}
          onExpenseDeleted={() => router.push(`/groups/${groupId}`)}
        />
      )}
    </>
  )
}
