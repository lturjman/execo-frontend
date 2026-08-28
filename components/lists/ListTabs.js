'use client'

import { PlusIcon } from '@heroicons/react/24/solid'

export default function ListTabs ({
  lists,
  activeListId,
  onSelect,
  onToggleCreate,
  colors
}) {
  return (
    <div className='flex gap-1.5 mb-4 overflow-x-auto no-scrollbar'>
      {lists.map((list) => {
        const isActive = activeListId === list._id

        return (
          <button
            key={list._id}
            type='button'
            onClick={() => onSelect(list._id)}
            className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors cursor-pointer shrink-0 ${
              isActive ? colors.tabActive : colors.tab
            }`}
          >
            {list.title}
          </button>
        )
      })}

      <button
        type='button'
        onClick={onToggleCreate}
        className='text-xs font-medium px-3 py-1.5 rounded-full border border-dashed border-zinc-300 dark:border-zinc-600 text-zinc-500 dark:text-zinc-400 hover:border-zinc-400 dark:hover:border-zinc-500 cursor-pointer transition-colors shrink-0'
      >
        <PlusIcon className='size-3 inline -mt-0.5' />
      </button>
    </div>
  )
}
