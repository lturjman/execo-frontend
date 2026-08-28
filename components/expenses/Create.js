'use client'

import { useDispatch } from 'react-redux'
import { createExpense } from '@/lib/store/slices/expenses'
import { fetchMembers } from '@/lib/store/slices/members'

import { useRouter } from 'next/navigation'

import { useState, useEffect } from 'react'

import { Decimal } from 'decimal.js'
import ExpenseForm from './Form'

export default function CreateExpense ({ groupId, onExpenseCreated }) {
  const router = useRouter()
  const dispatch = useDispatch()

  const [expense] = useState({
    name: '',
    amount: 0,
    member: ''
  })

  useEffect(() => {
    if (groupId) {
      dispatch(fetchMembers({ groupId }))
    }
  }, [dispatch, groupId])

  const handleCreateExpense = async (updatedExpense) => {
    const action = await dispatch(
      createExpense({
        groupId,
        expense: {
          name: updatedExpense.name,
          amount: Decimal.mul(updatedExpense.amount, 100),
          debts: updatedExpense.debts.map((debt) => ({
            amount: Decimal.mul(debt.amount, 100).round(),
            member: debt.member._id || debt.member
          })),
          credits: [
            {
              amount: Decimal.mul(updatedExpense.amount, 100),
              member: updatedExpense.member
            }
          ]
        }
      })
    )

    if (createExpense.fulfilled.match(action)) {
      router.push(`/groups/${groupId}`)
      if (onExpenseCreated) onExpenseCreated()
    }
  }

  return (
    <div className='space-y-4 '>
      <h2 className='font-bold text-xl'>Nouvelle dépense :</h2>

      <ExpenseForm expense={expense} handleSubmit={handleCreateExpense} />
    </div>
  )
}
