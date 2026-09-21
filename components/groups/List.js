'use client'

import { useDispatch, useSelector } from 'react-redux'
import { fetchGroups } from '@/lib/store/slices/groups'
import Button from '@/components/Button'
import GroupCard from '@/components/groups/Card'
import { useEffect, useMemo, useState } from 'react'
import { PlusIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import { DragDropProvider } from '@dnd-kit/react'
import { useSortable, isSortable } from '@dnd-kit/react/sortable'
import { PointerSensor, PointerActivationConstraints } from '@dnd-kit/dom'

const GROUPS_ORDER_KEY = 'execo:groups:order'

function loadGroupsOrder () {
  try {
    const raw = window.localStorage.getItem(GROUPS_ORDER_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveGroupsOrder (order) {
  window.localStorage.setItem(GROUPS_ORDER_KEY, JSON.stringify(order))
}

function EmptyState () {
  return (
    <div className='flex flex-col items-center justify-center min-h-[70vh] w-full px-6 text-white space-y-8'>
      <h1 className='text-3xl font-extrabold text-center'>
        Bienvenue sur Execo !
      </h1>

      <p className='max-w-2xl text-center text-lg leading-relaxed text-white/90'>
        Execo est une application qui permet de partager les dépenses en
        fonction des moyens financiers de chacun de manière équitable.
      </p>

      <ul className='bg-white/90 text-zinc-800 rounded-xl shadow-md px-8 py-6 text-base w-full max-w-xl'>
        <li className='text-lg font-semibold mb-2'>Pour bien démarrer :</li>
        <li className='flex'>
          <div className='font-bold text-purple-400'>1</div>
          <div className='ml-5'>Créez un groupe</div>
        </li>
        <li className='flex'>
          <div className='font-bold text-purple-400'>2</div>
          <div className='ml-5'>Ajoutez des membres</div>
        </li>
        <li className='flex'>
          <div className='font-bold text-purple-400'>3</div>
          <div className='ml-5'>Saisissez les dépenses partagées</div>
        </li>
      </ul>

      <div className='hidden sm:flex gap-6'>
        <ActionCard href='/groups/new' label='Créer un groupe' />
        <ActionCard href='/groups/join' label='Rejoindre un groupe' />
      </div>
    </div>
  )
}

function ActionCard ({ href, label }) {
  return (
    <Link href={href}>
      <div className='cursor-pointer transition-transform hover:scale-102 duration-300 ease-in-out'>
        <div className='flex flex-col items-center justify-center w-64 aspect-video border-2 border-dashed border-white/60 backdrop-blur-md rounded-xl text-white hover:border-purple-400 hover:text-purple-200 p-6 shadow-inner'>
          <span className='font-medium text-lg'>{label}</span>
        </div>
      </div>
    </Link>
  )
}

function SortableGroupCard ({ group, index }) {
  const { ref, isDragging, isDropTarget } = useSortable({
    id: group._id,
    index,
    transition: {
      duration: 200,
      easing: 'ease',
      idle: true
    }
  })

  return (
    <div
      ref={ref}
      className={`rounded-lg cursor-grab active:cursor-grabbing transition-opacity ${
        isDragging ? 'opacity-40' : ''
      } ${isDropTarget ? 'ring-2 ring-purple-400' : ''}`}
    >
      <GroupCard group={group} />
    </div>
  )
}

function GroupsGrid ({ groups, onReorder }) {
  return (
    <div className='w-full max-w-5xl mx-auto px-4'>
      <DragDropProvider
        sensors={(defaults) => [
          ...defaults.filter((sensor) => sensor !== PointerSensor),
          PointerSensor.configure({
            activationConstraints (event) {
              if (event.pointerType === 'touch') {
                return [
                  new PointerActivationConstraints.Delay({
                    value: 250,
                    tolerance: 10
                  })
                ]
              }
              return [new PointerActivationConstraints.Distance({ value: 5 })]
            }
          })
        ]}
        onDragEnd={(event) => {
          if (event.canceled) return
          const { source } = event.operation
          if (isSortable(source)) {
            const { initialIndex, index } = source
            if (initialIndex !== index) {
              onReorder(initialIndex, index)
            }
          }
        }}
      >
        <div className='grid sm:grid-cols-2 gap-6'>
          {groups.map((group, index) => (
            <SortableGroupCard key={group._id} group={group} index={index} />
          ))}

          <div className='hidden sm:flex h-full w-full flex-col items-center justify-center rounded-lg gap-4'>
            <AddGroupButton href='/groups/new' label='Créer un groupe' />
            <AddGroupButton href='/groups/join' label='Rejoindre un groupe' />
          </div>
        </div>
      </DragDropProvider>
    </div>
  )
}

function AddGroupButton ({ href, label }) {
  return (
    <Button
      href={href}
      className='hidden bg-opacity-0 sm:flex h-full w-full flex-col items-center justify-center text-center border-2 border-dashed border-white/60 backdrop-blur-md rounded-lg text-white hover:border-purple-300 hover:bg-purple-400 p-6 shadow-inner transition-transform hover:scale-105 duration-300 ease-in-out gap-4 uppercase'
    >
      {label}
    </Button>
  )
}

function FloatingActionButton () {
  return (
    <Popover className='sm:hidden fixed bottom-6 right-6 z-50'>
      <PopoverButton className='flex items-center justify-center w-20 h-20 rounded-full bg-purple-400 hover:bg-purple-500 active:bg-purple-700 ring-2 ring-white shadow-lg shadow-purple-600/50 cursor-pointer focus:outline-none'>
        {({ open }) => (
          <PlusIcon
            className={`size-9 text-white transition-transform duration-300 ${
              open ? 'rotate-45' : ''
            }`}
          />
        )}
      </PopoverButton>
      <PopoverPanel className='absolute bottom-24 right-0 w-70 bg-white dark:bg-zinc-700 rounded-xl shadow-lg overflow-hidden'>
        <div className='flex flex-col'>
          <Link
            href='/groups/new'
            className='px-4 py-3 text-sm font-bold text-zinc-800 dark:text-zinc-200 hover:bg-purple-100 dark:hover:bg-zinc-600 uppercase'
          >
            Créer un groupe
          </Link>
          <Link
            href='/groups/join'
            className='px-4 py-3 text-sm font-bold text-zinc-800 dark:text-zinc-200 hover:bg-purple-100 dark:hover:bg-zinc-600 border-t border-zinc-200 dark:border-zinc-600 uppercase'
          >
            Rejoindre un groupe
          </Link>
        </div>
      </PopoverPanel>
    </Popover>
  )
}

export default function GroupsList () {
  const dispatch = useDispatch()
  const groups = useSelector((state) => state.groups.items)
  const loading = useSelector((state) => state.groups.loading)
  const [order, setOrder] = useState(() => loadGroupsOrder())

  useEffect(() => {
    dispatch(fetchGroups())
  }, [dispatch])

  const sortedGroups = useMemo(() => {
    return [...groups].sort((a, b) => {
      const indexA = order.indexOf(a._id)
      const indexB = order.indexOf(b._id)
      if (indexA === -1 && indexB === -1) return 0
      if (indexA === -1) return 1
      if (indexB === -1) return -1
      return indexA - indexB
    })
  }, [groups, order])

  const handleReorder = (fromIndex, toIndex) => {
    if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0) return

    const currentIds = sortedGroups.map((group) => group._id)
    const [movedId] = currentIds.splice(fromIndex, 1)
    currentIds.splice(toIndex, 0, movedId)

    setOrder(currentIds)
    saveGroupsOrder(currentIds)
  }

  if (loading) return <div>Chargement...</div>

  return (
    <div className='p-4 space-y-6'>
      {sortedGroups.length === 0
        ? (
          <EmptyState />
          )
        : (
          <GroupsGrid groups={sortedGroups} onReorder={handleReorder} />
          )}
      <FloatingActionButton />
    </div>
  )
}
