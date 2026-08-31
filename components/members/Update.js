'use client'

import Button from '@/components/Button'
import { useState, useEffect } from 'react'
import RemoveMember from './Remove'
import { XMarkIcon } from '@heroicons/react/24/solid'

import { useDispatch, useSelector } from 'react-redux'
import { updateMember } from '../../lib/store/slices/members'

import { validateMember } from '../../utils/validateMember'

export default function UpdateMember ({
  member,
  groupId,
  onClose,
  onMemberUpdatedOrDeleted
}) {
  const dispatch = useDispatch()
  const loading = useSelector((state) => state.members.loading)

  const [editableMember, setEditableMember] = useState({ ...member })
  const [displayRemoveMember, setDisplayRemoveMember] = useState(false)

  useEffect(() => {
    if (member) {
      setEditableMember({ ...member })
    }
  }, [member])

  const [errors, setErrors] = useState({})

  const handleUpdateMember = async () => {
    if (validateMember(editableMember, setErrors)) {
      const action = await dispatch(
        updateMember({ groupId: member.group, member: editableMember })
      )

      if (updateMember.fulfilled.match(action)) {
        onMemberUpdatedOrDeleted()
      }
    }
  }

  if (displayRemoveMember) {
    return (
      <RemoveMember
        groupId={groupId}
        member={member}
        onClose={() => setDisplayRemoveMember(false)}
        onMemberDeleted={onMemberUpdatedOrDeleted}
      />
    )
  }

  return (
    <div className='space-y-4'>
      <div className='flex justify-between items-center'>
        <h2 className='block font-bold text-xl'> Modifier membre :</h2>
        <Button
          onClick={() => onClose()}
          rounded
          className='bg-zinc-400'
        >
          <XMarkIcon className='size-6' />
        </Button>
      </div>
      <div>
        <label htmlFor='nickname'>Nom du membre</label>
        <input
          type='text'
          nickname='nickname'
          className='w-full p-2 mb-4 rounded bg-zinc-100 focus:outline-none focus:border
             focus:ring-1 focus:ring-purple-400 focus:border-purple-400 dark:bg-zinc-600 dark:text-zinc-200'
          placeholder='Nom'
          value={editableMember.nickname}
          onChange={(e) =>
            setEditableMember({ ...editableMember, nickname: e.target.value })}
        />
        {errors.nickname && (
          <p className='text-red-500 text-sm mb-2'>{errors.nickname}</p>
        )}

        <div>Part : {(member.share * 100).toFixed(2) + '%'}</div>
        <Button className='my-4' onClick={handleUpdateMember} loading={loading}>
          Mettre à jour le membre
        </Button>
      </div>
      <hr className='my-2' />
      <label className='block mb-2 font-bold'> Supprimer le membre :</label>
      <div>
        Attention, le membre sera supprimé définitivement et les dépenses seront
        réparties entre les autres membres du groupe
      </div>
      <Button
        onClick={() => setDisplayRemoveMember(true)}
        className='my-4 bg-red-400 hover:bg-red-500 active:bg-red-600'
      >
        Supprimer le membre
      </Button>
    </div>
  )
}
