'use client'

import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid'

import { fetchMembers } from '@/lib/store/slices/members'
import { fetchMe } from '@/lib/store/slices/users'
import { fetchLists } from '@/lib/store/slices/lists'

import { LIST_COLORS } from './ListColors'
import ListCreate from './Create'
import ListTabs from './ListTabs'
import EmptyListState from './EmptyListState'
import ActiveListCard from './ActiveListCard'

export default function Lists ({ groupId }) {
  const dispatch = useDispatch()

  const lists = useSelector((state) => state.lists.items)
  const members = useSelector((state) => state.members.items)
  const me = useSelector((state) => state.users.me)

  const [isOpen, setIsOpen] = useState(false)
  const [activeListId, setActiveListId] = useState(null)
  const [showNewListInput, setShowNewListInput] = useState(false)
  const [editingListId, setEditingListId] = useState(null)
  const [editingItemId, setEditingItemId] = useState(null)
  const [editItemText, setEditItemText] = useState('')

  const listEndRef = useRef(null)
  const prevItemCountRef = useRef(0)

  const currentMember = members.find(
    (member) => (member.user?._id || member.user) === me._id
  )
  const activeList = lists.find((l) => l._id === activeListId)

  useEffect(() => {
    dispatch(fetchMe())
    dispatch(fetchMembers({ groupId }))
    dispatch(fetchLists({ groupId }))
  }, [dispatch, groupId])

  useEffect(() => {
    if (!activeListId && lists.length > 0) setActiveListId(lists[0]._id)
  }, [lists, activeListId])

  useEffect(() => {
    const currentCount = activeList?.items.length || 0
    if (currentCount > prevItemCountRef.current && listEndRef.current) {
      listEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
    prevItemCountRef.current = currentCount
  }, [activeList?.items.length])

  function toggleOpen () {
    setIsOpen((open) => !open)
  }

  function handleListCreated (list) {
    if (list?._id) setActiveListId(list._id)
    setShowNewListInput(false)
  }

  function handleSelectList (listId) {
    setActiveListId(listId)
    setEditingItemId(null)
  }

  function handleStartEditList (list) {
    setEditingListId(list._id)
  }

  function handleCancelEditList () {
    setEditingListId(null)
  }

  function handleListDeleted (list) {
    if (activeListId === list._id) setActiveListId(null)
  }

  function handleStartEditItem (item) {
    setEditingItemId(item._id)
    setEditItemText(item.text)
  }

  function handleCancelEditItem () {
    setEditingItemId(null)
    setEditItemText('')
  }

  return (
    <div className='bg-white dark:bg-zinc-800 rounded-2xl shadow-lg p-4 flex flex-col'>
      <button
        type='button'
        onClick={toggleOpen}
        className='w-full flex items-center gap-2 cursor-pointer text-left'
      >
        <span className='text-lg font-semibold text-zinc-800 dark:text-zinc-100 grow'>
          Listes
        </span>
        {isOpen
          ? (
            <ChevronUpIcon className='size-5 text-zinc-500 dark:text-zinc-400' />
            )
          : (
            <ChevronDownIcon className='size-5 text-zinc-500 dark:text-zinc-400' />
            )}
      </button>

      {isOpen && (
        <div className='mt-4'>
          {lists.length === 0 && !showNewListInput
            ? (
              <EmptyListState onCreate={() => setShowNewListInput(true)} />
              )
            : null}

          {lists.length > 0 && (
            <ListTabs
              lists={lists}
              activeListId={activeListId}
              onSelect={handleSelectList}
              onToggleCreate={() => setShowNewListInput((v) => !v)}
              colors={LIST_COLORS}
            />
          )}

          {showNewListInput && (
            <ListCreate
              groupId={groupId}
              currentMember={currentMember}
              onCreated={handleListCreated}
            />
          )}

          {activeList && (
            <ActiveListCard
              groupId={groupId}
              list={activeList}
              colors={LIST_COLORS}
              editingListId={editingListId}
              onStartEditList={handleStartEditList}
              onCancelEditList={handleCancelEditList}
              onListDeleted={handleListDeleted}
              listEndRef={listEndRef}
              editingItemId={editingItemId}
              editItemText={editItemText}
              onEditItemTextChange={setEditItemText}
              onStartEditItem={handleStartEditItem}
              onCancelEditItem={handleCancelEditItem}
            />
          )}
        </div>
      )}
    </div>
  )
}
