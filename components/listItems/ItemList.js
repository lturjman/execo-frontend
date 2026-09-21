'use client'

import { useState } from 'react'
import { ArrowsPointingOutIcon } from '@heroicons/react/24/solid'
import { useDispatch } from 'react-redux'
import { DragDropProvider } from '@dnd-kit/react'
import { useSortable, isSortable } from '@dnd-kit/react/sortable'
import { PointerSensor, PointerActivationConstraints } from '@dnd-kit/dom'
import { reorderItems } from '@/lib/store/slices/lists'
import ItemCreate from './Create'
import ItemUpdate from './Update'
import ItemRemove from './Remove'

function SortableItemRow ({
  groupId,
  listId,
  item,
  index,
  colors,
  editingItemId,
  editItemText,
  onEditItemTextChange,
  onStartEditItem,
  onCancelEditItem,
  selectedItemId,
  onToggleSelected
}) {
  const status = item.checked ? 'checked' : 'unchecked'
  const { ref, handleRef, isDragging, isDropTarget } = useSortable({
    id: item._id,
    index,
    type: status,
    accept: status,
    transition: {
      duration: 200,
      easing: 'ease',
      idle: true
    }
  })

  return (
    <div
      ref={ref}
      onClick={(event) => {
        if (isDragging) return
        onToggleSelected(item._id)
      }}
      className={`flex items-center gap-2 group rounded transition-opacity ${
        isDropTarget ? 'ring-1 ring-purple-400' : ''
      } ${isDragging ? 'opacity-40' : ''}`}
    >
      <button
        type='button'
        ref={handleRef}
        onClick={(event) => event.stopPropagation()}
        title='Déplacer'
        className='shrink-0 cursor-grab active:cursor-grabbing text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors'
      >
        <ArrowsPointingOutIcon className='size-4' />
      </button>
      <ItemUpdate
        groupId={groupId}
        listId={listId}
        item={item}
        isEditing={editingItemId === item._id}
        editText={editItemText}
        onEditTextChange={onEditItemTextChange}
        onStartEdit={(item) => {
          onToggleSelected(null)
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
  )
}

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
  const dispatch = useDispatch()
  const [selectedItemId, setSelectedItemId] = useState(null)
  const totalCount = items.length
  const checkedCount = items.filter((i) => i.checked).length
  const progress = totalCount > 0 ? (checkedCount / totalCount) * 100 : 0
  const sortedItems = [...items].sort(
    (a, b) => Number(a.checked) - Number(b.checked)
  )

  function toggleSelected (itemId) {
    setSelectedItemId((current) => (current === itemId ? null : itemId))
  }

  function handleDragEnd (event) {
    if (event.canceled) return
    const { source } = event.operation
    if (!isSortable(source)) return

    const { initialIndex, index } = source
    if (initialIndex === index) return

    const reordered = [...sortedItems]
    const [moved] = reordered.splice(initialIndex, 1)
    reordered.splice(index, 0, moved)

    dispatch(
      reorderItems({
        groupId,
        listId,
        itemIds: reordered.map((item) => item._id)
      })
    )
  }

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
            Aucun élément.
          </p>
        )}
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
          onDragEnd={handleDragEnd}
        >
          {sortedItems.map((item, index) => (
            <SortableItemRow
              key={item._id}
              groupId={groupId}
              listId={listId}
              item={item}
              index={index}
              colors={colors}
              editingItemId={editingItemId}
              editItemText={editItemText}
              onEditItemTextChange={onEditItemTextChange}
              onStartEditItem={onStartEditItem}
              onCancelEditItem={onCancelEditItem}
              selectedItemId={selectedItemId}
              onToggleSelected={toggleSelected}
            />
          ))}
        </DragDropProvider>
        <div ref={listEndRef} />
      </div>

      <ItemCreate groupId={groupId} listId={listId} colors={colors} />
    </>
  )
}
