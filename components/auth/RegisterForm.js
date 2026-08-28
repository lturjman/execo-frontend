'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/Button'

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL

export default function RegisterForm () {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [monthlyRevenues, setmonthlyRevenues] = useState('')
  const [monthlyCharges, setMonthlyCharges] = useState('')
  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
    monthlyRevenues: '',
    monthlyCharges: ''
  })

  const validateForm = () => {
    let valid = true
    const newErrors = {
      username: '',
      email: '',
      password: '',
      monthlyRevenues: '',
      monthlyCharges: ''
    }

    if (!username) {
      newErrors.username = "Le nom d'utilisateur est obligatoire"
      valid = false
    }

    if (!email) {
      newErrors.email = "L'email n'est pas valide"
      valid = false
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        newErrors.email = "L'email n'est pas valide"
        valid = false
      }
    }

    if (!password) {
      newErrors.password = "Le mot de passe n'est pas valide"
      valid = false
    }

    if (!monthlyRevenues) {
      newErrors.monthlyRevenues = 'Les revenus mensuels ne sont pas valides'
      valid = false
    }

    if (!monthlyCharges) {
      newErrors.monthlyCharges = 'Les charges mensuelles ne sont pas valides'
      valid = false
    }

    setErrors(newErrors)
    return valid
  }

  const router = useRouter()

  const handleRegister = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    const res = await fetch(`${NEXT_PUBLIC_API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username,
        email,
        password,
        monthlyRevenues,
        monthlyCharges
      })
    })
    const data = await res.json()

    if (!res.ok) {
      const newErrors = {
        username: '',
        email: '',
        password: '',
        monthlyRevenues: '',
        monthlyCharges: ''
      }

      if (data?.field === 'username') {
        newErrors.username = "Ce nom d'utilisateur n'est pas valide"
      } else if (data?.field === 'email') {
        newErrors.email = "Cet email n'est pas valide"
      } else if (data?.field === 'monthlyRevenues') {
        newErrors.monthlyRevenues = 'Ces revenus mensuels se sont pas valides'
      } else if (data?.field === 'monthlyCharges') {
        newErrors.monthlyCharges = 'Ces charges mensuelles se sont pas valides'
      } else {
        newErrors.email = "L'email n'est pas valide"
        newErrors.password = "Le mot de passe n'est pas valide"
        newErrors.monthlyRevenues = 'Les revenus mensuels ne sont pas valides'
        newErrors.monthlyCharges = 'Les charges mensuelles ne sont pas valides'
      }

      setErrors(newErrors)
      return
    }

    // Stocker le token
    localStorage.setItem('token', data.token)

    router.push('/groups')
  }

  return (
    <div>
      <form
        noValidate
        onSubmit={handleRegister}
        className='w-full flex flex-col gap-4'
      >
        <div>
          <label htmlFor='username'>Nom d'utilisateur :</label>
          <input
            type='text'
            placeholder='JohnDoe'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className='appearance-none w-full p-2 focus:border rounded-md
             bg-zinc-100 text-zinc-800 focus:outline-none
             focus:ring-1 focus:ring-purple-400 focus:border-purple-400 dark:bg-zinc-600 dark:text-zinc-200'
          />
          {errors.username && (
            <p className='text-red-500 text-sm mt-1'>{errors.username}</p>
          )}
        </div>

        <div>
          <label htmlFor='email'>Email :</label>
          <input
            type='email'
            placeholder='contact@email.com'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className='appearance-none w-full p-2 focus:border rounded-md
             bg-zinc-100 text-zinc-800 focus:outline-none
             focus:ring-1 focus:ring-purple-400 focus:border-purple-400 dark:bg-zinc-600 dark:text-zinc-200'
          />
          {errors.email && (
            <p className='text-red-500 text-sm mt-1'>{errors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor='password'>Mot de passe :</label>
          <input
            type='password'
            placeholder='************'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className='appearance-none w-full p-2 focus:border rounded-md
             bg-zinc-100 text-zinc-800 focus:outline-none
             focus:ring-1 focus:ring-purple-400 focus:border-purple-400 dark:bg-zinc-600 dark:text-zinc-200'
          />
          {errors.password && (
            <p className='text-red-500 text-sm mt-1'>{errors.password}</p>
          )}
        </div>

        <div>
          <label htmlFor='monthlyRevenues'>Revenus mensuels net en € :</label>
          <input
            type='number'
            placeholder='2 228'
            value={monthlyRevenues}
            onChange={(e) => setmonthlyRevenues(e.target.value)}
            required
            className='appearance-none w-full p-2 focus:border rounded-md
             bg-zinc-100 text-zinc-800 focus:outline-none
             focus:ring-1 focus:ring-purple-400 focus:border-purple-400 dark:bg-zinc-600 dark:text-zinc-200'
          />
          {errors.monthlyRevenues && (
            <p className='text-red-500 text-sm mt-1'>
              {errors.monthlyRevenues}
            </p>
          )}
        </div>

        <div>
          <label htmlFor='monthlyCharges'>Charges mensuelles en € :</label>
          <input
            type='number'
            placeholder='800'
            value={monthlyCharges}
            onChange={(e) => setMonthlyCharges(e.target.value)}
            required
            className='appearance-none w-full p-2 focus:border rounded-md
             bg-zinc-100 text-zinc-800 focus:outline-none
             focus:ring-1 focus:ring-purple-400 focus:border-purple-400 dark:bg-zinc-600 dark:text-zinc-200'
          />
          {errors.monthlyCharges && (
            <p className='text-red-500 text-sm mt-1'>{errors.monthlyCharges}</p>
          )}
        </div>

        <Button type='submit'>Créer un compte</Button>
      </form>

      <Button
        className='bg-zinc-400 hover:bg-zinc-500 active:bg-zinc-600 mt-10 w-70 mx-auto'
        onClick={() => router.push('/auth/login')}
      >
        Déjà un compte ?
      </Button>
    </div>
  )
}
