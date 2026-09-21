'use client'

import { useState } from 'react'
import ItemCreate from './Create'
import ItemUpdate from './Update'
import ItemRemove from './Remove'

export default function ItemList ({
  groupId,
  listId,
  items,
  colors,
  listEndRef,
  editingItemId,
  editItemText,
  onEditItemTextChange,
  onStartEditItem,
  onCancelEditItem
}) {
  const [selectedItemId, setSelectedItemId] = useState(null)
  const totalCount = items.length
  const checkedCount = items.filter((i) => i.checked).length
  const progress = totalCount > 0 ? (checkedCount / totalCount) * 100 : 0
  const sortedItems = [...items].sort((a, b) => Number(a.checked) - Number(b.checked))

  return (
    <>
      {totalCount > 0 && (
        <div className='w-full h-1.5 rounded-full bg-black/10 dark:bg-white/10 mb-1'>
          <div
            className={`h-full rounded-full transition-all duration-300 ${colors.progress}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <p className='text-xs mb-3 text-purple-600 dark:text-purple-400'>
        {checkedCount}/{totalCount}
      </p>

      <div
        className={`flex flex-col gap-1.5 mb-3${items.length > 10 ? ' max-h-64 overflow-y-auto pr-1' : ''}`}
      >
        {items.length === 0 && (
          <p className='text-sm text-zinc-400 dark:text-zinc-500 text-center py-2'>
            Aucun item.
          </p>
        )}
        {sortedItems.map((item) => (
          <div
            key={item._id}
            onClick={() => {
              setSelectedItemId((current) =>
                current === item._id ? null : item._id
              )
            }}
            className='flex items-center gap-2 group'
          >
            <ItemUpdate
              groupId={groupId}
              listId={listId}
              item={item}
              isEditing={editingItemId === item._id}
              editText={editItemText}
              onEditTextChange={onEditItemTextChange}
              onStartEdit={(item) => {
                setSelectedItemId(null)
                onStartEditItem(item)
              }}
              onCancelEdit={onCancelEditItem}
              colors={colors}
            />
            <ItemRemove
              groupId={groupId}
              listId={listId}
              itemId={item._id}
              visible={selectedItemId === item._id || editingItemId === item._id}
            />
          </div>
        ))}
        <div ref={listEndRef} />
      </div>

      <ItemCreate groupId={groupId} listId={listId} colors={colors} />
    </>
  )
}
