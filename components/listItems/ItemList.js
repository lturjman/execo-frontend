'use client'

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
  const totalCount = items.length
  const checkedCount = items.filter((i) => i.checked).length
  const progress = totalCount > 0 ? (checkedCount / totalCount) * 100 : 0

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
        {items.map((item) => (
          <div key={item._id} className='flex items-center gap-2 group'>
            <ItemUpdate
              groupId={groupId}
              listId={listId}
              item={item}
              isEditing={editingItemId === item._id}
              editText={editItemText}
              onEditTextChange={onEditItemTextChange}
              onStartEdit={onStartEditItem}
              onCancelEdit={onCancelEditItem}
              colors={colors}
            />
            {editingItemId !== item._id && (
              <ItemRemove groupId={groupId} listId={listId} itemId={item._id} />
            )}
          </div>
        ))}
        <div ref={listEndRef} />
      </div>

      <ItemCreate groupId={groupId} listId={listId} colors={colors} />
    </>
  )
}
