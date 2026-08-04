'use client'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMe, updateUser } from '@/lib/store/slices/users'
import Button from '../Button'
import { NumericFormat } from 'react-number-format'
import { validateUser } from '../../utils/validateUser'

export default function ProfileForm () {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.users.me)
  const status = useSelector((state) => state.users.status)
  const error = useSelector((state) => state.users.error)
  const loading = useSelector((state) => state.users.loading)

  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState(false)

  const [editableUser, setEditableUser] = useState(user || {})

  useEffect(() => {
    dispatch(fetchMe())
  }, [dispatch])

  useEffect(() => {
    if (user) setEditableUser(user)
  }, [user])

  if (status === 'failed') return <p className='text-red-500'>{error}</p>

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSuccess(false)
    if (validateUser(editableUser, setErrors)) {
      try {
        await dispatch(updateUser({ userData: editableUser })).unwrap()
        setSuccess(true)
      } catch {
        // L'erreur est gérée via le state redux
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
      <div>
        <label>Nom d'utilisateur : </label>
        <input
          type='text'
          value={editableUser.username}
          onChange={(e) =>
            setEditableUser({ ...editableUser, username: e.target.value })}
          // placeholder="Nom d'utilisateur"
          className='appearance-none w-full p-2 focus:border rounded-md
             bg-zinc-100 text-zinc-800 focus:outline-none
             focus:ring-1 focus:ring-purple-400 focus:border-purple-400 dark:bg-zinc-600 dark:text-zinc-200'
        />
      </div>

      <div>
        <label>Email : </label>
        <input
          type='email'
          value={editableUser.email}
          onChange={(e) =>
            setEditableUser({ ...editableUser, email: e.target.value })}
          // placeholder="Email"
          className='appearance-none w-full p-2 focus:border rounded-md
             bg-zinc-100 text-zinc-800 focus:outline-none
             focus:ring-1 focus:ring-purple-400 focus:border-purple-400 dark:bg-zinc-600 dark:text-zinc-200'
        />
      </div>

      <div>
        <label htmlFor='monthlyRevenues'>Revenus mensuels net :</label>
        <NumericFormat
          value={editableUser.monthlyRevenues}
          decimalScale={2}
          decimalSeparator=','
          allowedDecimalSeparators={['.', ',']}
          thousandSeparator=' '
          fixedDecimalScale
          suffix=' €'
          inputMode='decimal'
          placeholder='0,00 €'
          allowNegative={false}
          onValueChange={(values) =>
            setEditableUser({
              ...editableUser,
              monthlyRevenues: values.floatValue ?? null
            })}
          className='appearance-none w-full p-2 focus:border rounded-md
                   bg-zinc-100 text-zinc-800 focus:outline-none
                   focus:ring-1 focus:ring-purple-400 focus:border-purple-400 dark:bg-zinc-600 dark:text-zinc-200'
          name='monthlyRevenues'
        />
        {errors.monthlyRevenues && (
          <p className='text-red-500 text-sm mb-2'>{errors.monthlyRevenues}</p>
        )}
      </div>
      <div>
        <label htmlFor='monthlyCharges'>Charges mensuelles</label>
        <NumericFormat
          value={editableUser.monthlyCharges}
          decimalScale={2}
          decimalSeparator=','
          allowedDecimalSeparators={['.', ',']}
          thousandSeparator=' '
          fixedDecimalScale
          suffix=' €'
          inputMode='decimal'
          placeholder='0,00 €'
          allowNegative={false}
          onValueChange={(values) =>
            setEditableUser({
              ...editableUser,
              monthlyCharges: values.floatValue ?? null
            })}
          className='appearance-none w-full p-2 focus:border rounded-md
                   bg-zinc-100 text-zinc-800 focus:outline-none
                   focus:ring-1 focus:ring-purple-400 focus:border-purple-400 dark:bg-zinc-600 dark:text-zinc-200'
          name='monthlyCharges'
        />
        {errors.monthlyCharges && (
          <p className='text-red-500 text-sm mb-2'>{errors.monthlyCharges}</p>
        )}
      </div>
      {success && (
        <p className='text-green-500 text-sm'>
          La mise à jour a bien été prise en compte.
        </p>
      )}
      <Button type='submit' disabled={loading}>
        {loading ? 'Mise à jour...' : 'Mettre à jour'}
      </Button>
    </form>
  )
}
