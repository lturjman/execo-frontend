'use client'

import { useState } from 'react'
import { TrashIcon } from '@heroicons/react/24/solid'
import { useDispatch, useSelector } from 'react-redux'
import { deleteList } from '@/lib/store/slices/lists'
import ValidationModal from '@/components/ValidationModal'
import ListUpdate from './Update'
import ItemList from '@/components/listItems/ItemList'

export default function ActiveListCard ({
  groupId,
  list,
  colors,
  editingListId,
  onStartEditList,
  onCancelEditList,
  onListDeleted,
  listEndRef,
  editingItemId,
  editItemText,
  onEditItemTextChange,
  onStartEditItem,
  onCancelEditItem
}) {
  const dispatch = useDispatch()
  const loading = useSelector((state) => state.lists.loading)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  function handleDeleteList () {
    dispatch(deleteList({ groupId, listId: list._id }))
    setShowDeleteModal(false)
    onListDeleted(list)
  }

  return (
    <div className={`relative border-2 rounded-lg p-4 ${colors.card}`}>
      <div className='flex items-center justify-between mb-1'>
        {editingListId === list._id
          ? <ListUpdate groupId={groupId} list={list} onDone={onCancelEditList} />
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
          onClick={() => setShowDeleteModal(true)}
          className='shrink-0 cursor-pointer opacity-70 hover:opacity-100'
        >
          <TrashIcon className={`size-4 ${colors.icon}`} />
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

      <ValidationModal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteList}
        loading={loading}
        title='Êtes-vous sûr de vouloir supprimer la liste ?'
        description='Pour rappel, cette action est irréversible et tous les items de la liste seront supprimés.'
      />
    </div>
  )
}
