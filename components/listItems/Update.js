'use client'

import { CheckIcon, PencilIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { useDispatch } from 'react-redux'
import { updateItem } from '@/lib/store/slices/lists'

export default function ItemUpdate ({
  groupId,
  listId,
  item,
  isEditing,
  editText,
  onEditTextChange,
  onStartEdit,
  onCancelEdit,
  colors
}) {
  const dispatch = useDispatch()

  function handleToggle () {
    dispatch(
      updateItem({
        groupId,
        listId,
        item: { _id: item._id, checked: !item.checked }
      })
    )
  }

  async function handleUpdateItem (e) {
    e.preventDefault()
    if (!editText.trim()) return
    await dispatch(
      updateItem({
        groupId,
        listId,
        item: { _id: item._id, text: editText.trim() }
      })
    )
    onCancelEdit()
  }

  if (isEditing) {
    return (
      <form
        onSubmit={handleUpdateItem}
        className='flex items-center gap-1 grow'
      >
        <input
          type='text'
          value={editText}
          onChange={(e) => onEditTextChange(e.target.value)}
          autoFocus
          className='grow min-w-0 px-2 py-1 text-sm rounded bg-white/80 dark:bg-zinc-800/80 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-purple-400'
        />
        <button
          type='submit'
          disabled={!editText.trim()}
          className='cursor-pointer opacity-80 hover:opacity-100 disabled:opacity-30'
        >
          <CheckIcon className={`size-4 ${colors.icon}`} />
        </button>
        <button
          type='button'
          onClick={onCancelEdit}
          className='cursor-pointer opacity-80 hover:opacity-100'
        >
          <XMarkIcon className={`size-4 ${colors.icon}`} />
        </button>
      </form>
    )
  }

  return (
    <>
      <button
        type='button'
        onClick={handleToggle}
        className={`shrink-0 size-5 rounded border-2 flex items-center justify-center cursor-pointer transition-colors ${
          item.checked
            ? `${colors.check} border-current bg-current/10`
            : 'border-zinc-300 dark:border-zinc-600 hover:border-zinc-400 dark:hover:border-zinc-500'
        }`}
      >
        {item.checked && <CheckIcon className='size-3 text-current' />}
      </button>

      <span
        className={`grow text-sm break-words ${
          item.checked
            ? 'line-through text-zinc-400 dark:text-zinc-500'
            : 'text-zinc-800 dark:text-zinc-200'
        }`}
      >
        {item.text}
      </span>

      <div className='flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0'>
        <button
          type='button'
          onClick={() => onStartEdit(item)}
          className='cursor-pointer'
        >
          <PencilIcon className={`size-4 ${colors.icon}`} />
        </button>
      </div>
    </>
  )
}
