'use client'

import Button from '@/components/Button'
import { Dialog, DialogPanel, DialogBackdrop } from '@headlessui/react'

export default function ValidationModal ({
  open,
  onClose,
  onConfirm,
  loading,
  title,
  description,
  confirmLabel = 'Oui, Supprimer',
  cancelLabel = 'Non, Annuler'
}) {
  return (
    <Dialog open={open} onClose={onClose} className='fixed inset-0 flex w-screen items-center justify-center bg-black/30 dark:bg-black/70 p-4 z-50'>
      <DialogBackdrop className='fixed inset-0' />
      <div className='fixed p-4 w-full flex justify-center'>
        <DialogPanel className='bg-white rounded-2xl shadow-lg overflow-hidden p-6 dark:bg-zinc-700 max-w-sm w-full'>
          <h2 className='block mb-2 font-bold text-xl text-center'>
            {title}
          </h2>

          {description && (
            <div className='text-sm text-zinc-600 dark:text-zinc-300 mb-4'>
              {description}
            </div>
          )}

          <div className='flex gap-2'>
            <Button
              onClick={onConfirm}
              loading={loading}
              className='bg-red-400 hover:bg-red-500 active:bg-red-600'
            >
              {confirmLabel}
            </Button>
            <Button
              className='bg-zinc-400 hover:bg-zinc-500 active:bg-zinc-600'
              onClick={onClose}
            >
              {cancelLabel}
            </Button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  )
}
