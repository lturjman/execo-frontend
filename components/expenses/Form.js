'use client'

import { useEffect, useState, useRef } from 'react'
import Button from '@/components/Button'
import { NumericFormat } from 'react-number-format'
import { Decimal } from 'decimal.js'
import { useSelector, useDispatch } from 'react-redux'
import { fetchMembers } from '@/lib/store/slices/members'
import { Checkbox } from '@headlessui/react'
import { validateExpense } from '@/utils/validateExpense'

function rescaleTo100 (pcts, ids) {
  const newPcts = { ...pcts }
  const total = ids.reduce((sum, id) => sum + (newPcts[id] || 0), 0)
  if (total > 0 && Math.abs(total - 100) > 0.01) {
    const factor = 100 / total
    ids.forEach(id => { newPcts[id] *= factor })
  }
  return newPcts
}

function computeDebtsFromPercentages (pcts, totalAmount, checkedMembers) {
  if (!totalAmount || Number(totalAmount) <= 0 || checkedMembers.length === 0) {
    return checkedMembers.map(m => ({ amount: '0', member: m }))
  }

  const total = new Decimal(totalAmount)
  const checkedTotal = checkedMembers.reduce((sum, m) => sum + (pcts[m._id] || 0), 0)

  if (checkedTotal <= 0) {
    return checkedMembers.map(m => ({ amount: '0', member: m }))
  }

  return checkedMembers.map(member => {
    const pct = pcts[member._id] || 0
    const normalizedPct = new Decimal(pct).div(checkedTotal)
    const amount = total.mul(normalizedPct)
    return { amount: amount.toString(), member }
  })
}

export default function ExpenseForm ({
  expense,
  handleSubmit,
  submitLabel = 'Valider'
}) {
  const dispatch = useDispatch()
  const loading = useSelector((state) => state.expenses.loading)
  const members = useSelector((state) => state.members.items)

  const [editableExpense, setEditableExpense] = useState(() => ({
    ...expense,
    amount:
      expense?.amount != null
        ? Decimal.div(expense.amount, 100).toString()
        : ''
  }))

  const [percentages, setPercentages] = useState({})
  const [checkedIds, setCheckedIds] = useState(() => {
    if (Array.isArray(expense?.debts)) {
      return expense.debts.map(d => d.member?._id || d.member).filter(Boolean)
    }
    return []
  })

  const [errors, setErrors] = useState({})
  const allWereUncheckedRef = useRef(false)

  useEffect(() => {
    if (expense) {
      setEditableExpense({
        ...expense,
        amount: Decimal.div(expense.amount, 100).toString(),
        member:
          (expense.credits && expense.credits[0].member?._id) || expense.member
      })
    }
  }, [expense])

  useEffect(() => {
    if (expense?.group) {
      dispatch(fetchMembers({ groupId: expense?.group }))
    }
  }, [dispatch, expense?.group])

  useEffect(() => {
    if (members.length > 0) {
      const pcts = {}
      members.forEach(m => {
        pcts[m._id] = 0
      })

      if (Array.isArray(expense?.debts) && expense.debts.length > 0 && expense.amount > 0) {
        expense.debts.forEach(debt => {
          const memberId = debt.member?._id || debt.member
          if (memberId) {
            pcts[memberId] = new Decimal(debt.amount).div(expense.amount).mul(100).toNumber()
          }
        })
      }

      setPercentages(pcts)
    }
  }, [members, expense])

  const checkedMembers = members.filter(m => checkedIds.includes(m._id))
  const debts = computeDebtsFromPercentages(percentages, editableExpense.amount, checkedMembers)

  const toggleBeneficiary = (member) => {
    const isChecked = checkedIds.includes(member._id)

    if (isChecked) {
      const wasLastChecked = checkedIds.length === 1

      setPercentages(prev => {
        const newPcts = { ...prev }
        const removedPct = newPcts[member._id] || 0
        newPcts[member._id] = 0

        if (wasLastChecked) {
          members.forEach(m => { newPcts[m._id] = 0 })
        } else {
          const remainingChecked = checkedIds.filter(id => id !== member._id)
          const remainingTotal = remainingChecked.reduce((sum, id) => sum + (prev[id] || 0), 0)

          if (remainingTotal > 0) {
            remainingChecked.forEach(id => {
              newPcts[id] = (prev[id] || 0) + (removedPct * (prev[id] || 0) / remainingTotal)
            })
          } else if (remainingChecked.length > 0) {
            const equal = removedPct / remainingChecked.length
            remainingChecked.forEach(id => { newPcts[id] = equal })
          }
        }

        return newPcts
      })
      setCheckedIds(prev => {
        const newChecked = prev.filter(id => id !== member._id)
        if (newChecked.length === 0) {
          allWereUncheckedRef.current = true
        }
        return newChecked
      })
    } else {
      if (allWereUncheckedRef.current) {
        allWereUncheckedRef.current = false
        const newPcts = {}
        members.forEach(m => { newPcts[m._id] = 0 })
        newPcts[member._id] = 100
        setPercentages(newPcts)
      } else {
        setPercentages(prev => {
          const newCheckedIds = [...checkedIds, member._id]
          const newPcts = { ...prev }

          newCheckedIds.forEach(id => {
            const m = members.find(mem => mem._id === id)
            if (m) newPcts[id] = new Decimal(m.share).mul(100).toNumber()
          })

          members.forEach(m => {
            if (!newCheckedIds.includes(m._id)) newPcts[m._id] = 0
          })

          return rescaleTo100(newPcts, newCheckedIds)
        })
      }
      setCheckedIds(prev => [...prev, member._id])
    }
  }

  const handlePercentageChange = (memberId, value) => {
    setPercentages(prev => {
      const newPcts = { ...prev, [memberId]: value }
      const otherIds = checkedIds.filter(id => id !== memberId)
      if (otherIds.length === 0) return newPcts

      const remainder = Math.max(0, 100 - value)
      const othersTotal = otherIds.reduce((sum, id) => sum + (prev[id] || 0), 0)

      if (othersTotal > 0 && remainder > 0) {
        const factor = remainder / othersTotal
        otherIds.forEach(id => { newPcts[id] = prev[id] * factor })
      } else if (remainder > 0) {
        const equal = remainder / otherIds.length
        otherIds.forEach(id => { newPcts[id] = equal })
      } else {
        otherIds.forEach(id => { newPcts[id] = 0 })
      }

      return newPcts
    })
  }

  const submitForm = (event) => {
    event.preventDefault()
    const isValid = validateExpense({ ...editableExpense, debts }, setErrors)
    if (!isValid) return
    handleSubmit({ ...editableExpense, debts })
  }

  return (
    <form onSubmit={submitForm} className='flex flex-col gap-y-4 '>
      <div>
        <label htmlFor='name'>Intitulé de la dépense :</label>
        <input
          type='text'
          name='name'
          value={editableExpense.name}
          className='appearance-none w-full p-2 focus:border rounded-md
             bg-zinc-100 text-zinc-800 focus:outline-none
             focus:ring-1 focus:ring-purple-400 focus:border-purple-400 dark:bg-zinc-600 dark:text-zinc-200'
          placeholder='Course, Loyer, ...'
          onChange={(e) =>
            setEditableExpense({ ...editableExpense, name: e.target.value })}
        />
        {errors.name && (
          <p className='text-red-500 text-sm mt-1'>{errors.name}</p>
        )}
      </div>
      <div>
        <label htmlFor='amount'>Montant :</label>
        <NumericFormat
          value={editableExpense?.amount}
          decimalScale={2}
          decimalSeparator=','
          allowedDecimalSeparators={['.', ',']}
          thousandSeparator=' '
          fixedDecimalScale
          suffix=' €'
          inputMode='decimal'
          placeholder='0,00 €'
          allowNegative={false}
          onValueChange={({ floatValue }) => {
            setEditableExpense({
              ...editableExpense,
              amount: floatValue ?? ''
            })
          }}
          className='appearance-none w-full p-2 focus:border rounded-md
             bg-zinc-100 text-zinc-800 focus:outline-none
             focus:ring-1 focus:ring-purple-400 focus:border-purple-400 dark:bg-zinc-600 dark:text-zinc-200'
          name='amount'
        />
        {errors.amount && (
          <p className='text-red-500 text-sm mt-1'>{errors.amount}</p>
        )}
      </div>
      <div>
        <label htmlFor='member'>Payé par :</label>
        <select
          value={editableExpense?.member}
          name='member'
          onChange={(e) =>
            setEditableExpense({ ...editableExpense, member: e.target.value })}
          className='appearance-none w-full p-2 border border-zinc-300 rounded-md
             bg-white text-zinc-800 focus:outline-none
             focus:ring-1 focus:ring-purple-400 focus:border-purple-400 dark:bg-zinc-600 dark:text-zinc-200'
        >
          <option value=''>-- Choisir un membre --</option>
          {members.map((member) => (
            <option key={member._id} value={member._id}>
              {member.nickname}
            </option>
          ))}
        </select>
        {errors.member && (
          <p className='text-red-500 text-sm mt-1'>{errors.member}</p>
        )}
      </div>

      <h3 className='text-lg font-semibold'>Bénéficiaires :</h3>

      <div className='overflow-hidden rounded-md bg-white shadow-sm dark:bg-zinc-800 dark:border dark:border-zinc-500'>
        <table className='w-full text-left '>
          <thead className='bg-zinc-800 text-white dark:bg-zinc-600  '>
            <tr>
              <th className='px-4 py-3 w-12 text-center' />
              <th className='px-4 py-3 font-semibold'>Nom :</th>
              <th className='px-4 py-3 text-center font-semibold'>Taux :</th>
              <th className='px-4 py-3 text-right font-semibold'>
                Montant dû :
              </th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => {
              const debt = debts.find((d) => (d.member._id || d.member) === member._id)
              const isChecked = checkedIds.includes(member._id)
              const pct = percentages[member._id] ?? 0

              return (
                <tr key={member._id} className=' border-t border-zinc-200'>
                  <td className='px-4 py-3 text-center'>
                    <Checkbox
                      checked={isChecked}
                      onChange={() => toggleBeneficiary(member)}
                      className='group block size-5 rounded data-checked:border-none border border-zinc-400 bg-white data-checked:bg-purple-400 p-1'
                    >
                      <svg
                        className='stroke-white opacity-0 group-data-checked:opacity-100'
                        viewBox='0 0 14 14'
                        fill='none'
                      >
                        <path
                          d='M3 8L6 11L11 3.5'
                          strokeWidth={2}
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        />
                      </svg>
                    </Checkbox>
                  </td>
                  <td className='px-4 py-3'>
                    <div>{member.nickname}</div>
                  </td>
                  <td className='px-4 py-3 text-center'>
                    <NumericFormat
                      value={pct}
                      decimalScale={2}
                      decimalSeparator=','
                      suffix=' %'
                      allowNegative={false}
                      onValueChange={({ floatValue }) => {
                        if (floatValue !== undefined && floatValue >= 0) {
                          handlePercentageChange(member._id, floatValue)
                        }
                      }}
                      className='w-24 p-1 text-center rounded-md border border-zinc-300
                         bg-white text-zinc-800 focus:outline-none
                         focus:ring-1 focus:ring-purple-400 focus:border-purple-400 dark:bg-zinc-600 dark:text-zinc-200'
                    />
                  </td>
                  <td className='p-4 text-right'>
                    <NumericFormat
                      value={debt?.amount || 0}
                      decimalScale={2}
                      decimalSeparator=','
                      thousandSeparator=' '
                      fixedDecimalScale
                      suffix=' €'
                      disabled
                      className=' w-full p-2 focus:border rounded-md text-right'
                      name='amount'
                    />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      {errors.debts && <p className='text-red-500 text-sm'>{errors.debts}</p>}

      <Button className='my-4' disabled={loading}>
        {loading ? 'En cours de chargement...' : submitLabel}
      </Button>
    </form>
  )
}
