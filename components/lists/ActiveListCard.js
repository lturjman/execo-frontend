'use client'

import { XMarkIcon } from '@heroicons/react/24/solid'
import ListUpdate from './Update'
import ListRemove from './Remove'
import ItemList from '@/components/listItems/ItemList'

export default function ActiveListCard ({
  groupId,
  list,
  colors,
  menuRef,
  editingListId,
  onStartEditList,
  onCancelEditList,
  onToggleMenu,
  menuListId,
  onListDeleted,
  listEndRef,
  editingItemId,
  editItemText,
  onEditItemTextChange,
  onStartEditItem,
  onCancelEditItem
}) {
  return (
    <div
      ref={menuRef}
      className={`relative border-2 rounded-lg p-4 ${colors.card}`}
    >
      <div className='flex items-center justify-between mb-1'>
        {editingListId === list._id
          ? (
            <ListUpdate groupId={groupId} list={list} onDone={onCancelEditList} />
            )
          : (
            <p
              onClick={() => onStartEditList(list)}
              className='text-sm font-bold truncate cursor-pointer hover:opacity-70'
            >
              {list.title}
            </p>
            )}
        <button
          type='button'
          onClick={() => onToggleMenu(list._id)}
          className='shrink-0 cursor-pointer opacity-70 hover:opacity-100'
        >
          <XMarkIcon className={`size-4 ${colors.icon}`} />
        </button>
      </div>

      <ItemList
        groupId={groupId}
        listId={list._id}
        items={list.items}
        colors={colors}
        listEndRef={listEndRef}
        editingItemId={editingItemId}
        editItemText={editItemText}
        onEditItemTextChange={onEditItemTextChange}
        onStartEditItem={onStartEditItem}
        onCancelEditItem={onCancelEditItem}
      />

      {menuListId === list._id && (
        <ListRemove
          groupId={groupId}
          list={list}
          onDeleted={() => onListDeleted(list)}
        />
      )}
    </div>
  )
}
